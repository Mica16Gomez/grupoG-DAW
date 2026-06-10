import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Proyecto } from '../entities/proyecto.entity';
import { Tarea } from '../entities/tarea.entity';
import { Cliente } from '../entities/cliente.entity';
import { EstadosProyectosEnum } from '../enums/estados-proyectos.enum';
import { EstadosTareasEnum } from '../enums/estados-tareas.enum';
import { EstadosClientesEnum } from '../enums/estados-clientes.enum';
import {
    CantidadPorEstadoDto,
    EstadisticasDto,
    ProyectosPorClienteDto,
    ResumenEstadisticasDto,
} from '../dtos/output/estadisticas.dto';

@Injectable()
export class EstadisticasService {
    constructor(
        @InjectRepository(Proyecto)
        private readonly proyectosRepository: Repository<Proyecto>,
        @InjectRepository(Tarea)
        private readonly tareasRepository: Repository<Tarea>,
        @InjectRepository(Cliente)
        private readonly clientesRepository: Repository<Cliente>,
    ) {}

    async obtenerEstadisticas(): Promise<EstadisticasDto> {
        const [
            proyectosActivos,
            proyectosTotal,
            proyectosFinalizados,
            tareasPendientes,
            tareasTotal,
            tareasFinalizadas,
            clientesActivos,
            clientesTotal,
            proyectosPorClienteRaw,
            tareasPorEstadoRaw,
            proyectosPorEstadoRaw,
        ] = await Promise.all([
            this.proyectosRepository.count({
                where: { estado: EstadosProyectosEnum.ACTIVO },
            }),
            this.proyectosRepository.count(),
            this.proyectosRepository.count({
                where: { estado: EstadosProyectosEnum.FINALIZADO },
            }),
            this.tareasRepository.count({
                where: { estado: EstadosTareasEnum.PENDIENTE },
            }),
            this.tareasRepository.count(),
            this.tareasRepository.count({
                where: { estado: EstadosTareasEnum.FINALIZADA },
            }),
            this.clientesRepository.count({
                where: { estado: EstadosClientesEnum.ACTIVO },
            }),
            this.clientesRepository.count(),
            this.obtenerProyectosPorCliente(),
            this.obtenerTareasPorEstado(),
            this.obtenerProyectosPorEstado(),
        ]);

        const resumen = new ResumenEstadisticasDto();
        resumen.proyectosActivos = proyectosActivos;
        resumen.proyectosTotal = proyectosTotal;
        resumen.proyectosFinalizados = proyectosFinalizados;
        resumen.tareasPendientes = tareasPendientes;
        resumen.tareasTotal = tareasTotal;
        resumen.tareasFinalizadas = tareasFinalizadas;
        resumen.clientesActivos = clientesActivos;
        resumen.clientesTotal = clientesTotal;

        const dto = new EstadisticasDto();
        dto.resumen = resumen;
        dto.proyectosPorCliente = proyectosPorClienteRaw;
        dto.tareasPorEstado = tareasPorEstadoRaw;
        dto.proyectosPorEstado = proyectosPorEstadoRaw;

        return dto;
    }

    private async obtenerProyectosPorCliente(): Promise<ProyectosPorClienteDto[]> {
        const filas = await this.proyectosRepository
            .createQueryBuilder('proyecto')
            .leftJoin('proyecto.cliente', 'cliente')
            .select('cliente.id', 'idCliente')
            .addSelect('cliente.nombre', 'nombreCliente')
            .addSelect('COUNT(proyecto.id)', 'cantidad')
            .groupBy('cliente.id')
            .addGroupBy('cliente.nombre')
            .orderBy('cantidad', 'DESC')
            .getRawMany<{ idCliente: number | null; nombreCliente: string | null; cantidad: string }>();

        return filas.map((fila) => {
            const dto = new ProyectosPorClienteDto();
            dto.idCliente = fila.idCliente;
            dto.nombreCliente = fila.nombreCliente ?? 'Sin cliente';
            dto.cantidadProyectos = Number(fila.cantidad);
            return dto;
        });
    }

    private async obtenerTareasPorEstado(): Promise<CantidadPorEstadoDto[]> {
        return this.obtenerCantidadPorEstado(
            this.tareasRepository
                .createQueryBuilder('tarea')
                .select('tarea.estado', 'estado')
                .addSelect('COUNT(tarea.id)', 'cantidad')
                .groupBy('tarea.estado'),
            Object.values(EstadosTareasEnum),
        );
    }

    private async obtenerProyectosPorEstado(): Promise<CantidadPorEstadoDto[]> {
        return this.obtenerCantidadPorEstado(
            this.proyectosRepository
                .createQueryBuilder('proyecto')
                .select('proyecto.estado', 'estado')
                .addSelect('COUNT(proyecto.id)', 'cantidad')
                .groupBy('proyecto.estado'),
            Object.values(EstadosProyectosEnum),
        );
    }

    private async obtenerCantidadPorEstado(
        queryBuilder: {
            getRawMany: () => Promise<
                { estado: string; cantidad: string }[]
            >;
        },
        estadosPosibles: string[],
    ): Promise<CantidadPorEstadoDto[]> {
        const filas = await queryBuilder.getRawMany();
        const mapa = new Map<string, number>();

        for (const fila of filas) {
            mapa.set(fila.estado, Number(fila.cantidad));
        }

        return estadosPosibles.map((estado) => {
            const dto = new CantidadPorEstadoDto();
            dto.estado = estado;
            dto.cantidad = mapa.get(estado) ?? 0;
            return dto;
        });
    }
}
