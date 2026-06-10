import {
    ForbiddenException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { CreateTareaDto } from '../dtos/input/create-tarea.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Tarea } from '../entities/tarea.entity';
import { Proyecto } from '../entities/proyecto.entity';
import { Repository } from 'typeorm';
import { EstadosTareasEnum } from '../enums/estados-tareas.enum';
import { UpdateTareaDto } from '../dtos/input/update-tarea.dto';

@Injectable()
export class TareasService {
    constructor(
        @InjectRepository(Tarea)
        private readonly tareasRepository: Repository<Tarea>,
        @InjectRepository(Proyecto)
        private readonly proyectosRepository: Repository<Proyecto>,
    ) {}

    async crearTarea(
        dto: CreateTareaDto,
        idProyecto: number,
    ): Promise<{ id: number }> {
        const proyecto = await this.proyectosRepository.findOne({
            where: { id: idProyecto },
        });

        if (!proyecto) {
            throw new NotFoundException('El proyecto indicado no existe');
        }

        const tarea: Tarea = this.tareasRepository.create(dto);

        tarea.estado = EstadosTareasEnum.PENDIENTE;
        tarea.idProyecto = idProyecto;

        await this.tareasRepository.save(tarea);

        return { id: tarea.id };
    }

    async actualizarTarea(
        dto: UpdateTareaDto,
        idTarea: number,
        idProyecto: number,
    ): Promise<void> {
        const tarea: Tarea | null = await this.tareasRepository.findOne({
            where: { id: idTarea },
        });

        if (!tarea) {
            throw new NotFoundException('La tarea indicada no existe');
        }

        if (tarea.idProyecto !== idProyecto) {
            throw new ForbiddenException(
                'La tarea no pertenece al proyecto indicado',
            );
        }

        this.tareasRepository.merge(tarea, dto);

        await this.tareasRepository.save(tarea);
    }
}
