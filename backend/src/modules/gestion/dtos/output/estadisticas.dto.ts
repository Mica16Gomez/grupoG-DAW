import { ApiProperty } from '@nestjs/swagger';

export class ResumenEstadisticasDto {
    @ApiProperty()
    proyectosActivos!: number;

    @ApiProperty()
    proyectosTotal!: number;

    @ApiProperty()
    proyectosFinalizados!: number;

    @ApiProperty()
    tareasPendientes!: number;

    @ApiProperty()
    tareasTotal!: number;

    @ApiProperty()
    tareasFinalizadas!: number;

    @ApiProperty()
    clientesActivos!: number;

    @ApiProperty()
    clientesTotal!: number;
}

export class ProyectosPorClienteDto {
    @ApiProperty()
    idCliente!: number | null;

    @ApiProperty()
    nombreCliente!: string;

    @ApiProperty()
    cantidadProyectos!: number;
}

export class CantidadPorEstadoDto {
    @ApiProperty()
    estado!: string;

    @ApiProperty()
    cantidad!: number;
}

export class EstadisticasDto {
    @ApiProperty({ type: ResumenEstadisticasDto })
    resumen!: ResumenEstadisticasDto;

    @ApiProperty({ type: ProyectosPorClienteDto, isArray: true })
    proyectosPorCliente!: ProyectosPorClienteDto[];

    @ApiProperty({ type: CantidadPorEstadoDto, isArray: true })
    tareasPorEstado!: CantidadPorEstadoDto[];

    @ApiProperty({ type: CantidadPorEstadoDto, isArray: true })
    proyectosPorEstado!: CantidadPorEstadoDto[];
}
