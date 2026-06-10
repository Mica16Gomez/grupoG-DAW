import { Component, computed, input, output, Signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { ListTareaDTO } from '../listado/list-tarea-dto';
import { EstadosTareasEnum } from '../estados-tareas-enum';

interface ColumnaKanban {
    estado: EstadosTareasEnum;
    titulo: string;
    clase: string;
}

type TareasAgrupadas = Record<EstadosTareasEnum, ListTareaDTO[]>;

@Component({
    selector: 'app-tareas-panel',
    templateUrl: './tareas-panel.html',
    styleUrls: ['./tareas-panel.css'],
    imports: [ButtonModule, TooltipModule],
})
export class TareasPanel {
    tareas = input.required<ListTareaDTO[]>();

    editarTarea = output<ListTareaDTO>();

    cambiarEstado = output<{ tarea: ListTareaDTO; estado: EstadosTareasEnum }>();

    readonly columnas: ColumnaKanban[] = [
        {
            estado: EstadosTareasEnum.PENDIENTE,
            titulo: 'Pendiente',
            clase: 'kanban-column--pendiente',
        },
        {
            estado: EstadosTareasEnum.FINALIZADA,
            titulo: 'Finalizada',
            clase: 'kanban-column--finalizada',
        },
        {
            estado: EstadosTareasEnum.BAJA,
            titulo: 'Baja',
            clase: 'kanban-column--baja',
        },
    ];

    /**
     * Agrupa las tareas por estado. Cada columna del panel muestra
     * únicamente las tareas cuyo estado coincide con el de la columna.
     */
    readonly tareasAgrupadas: Signal<TareasAgrupadas> = computed(() => {
        const lista = this.tareas();
        return {
            [EstadosTareasEnum.PENDIENTE]: lista.filter(
                (t) => t.estado === EstadosTareasEnum.PENDIENTE,
            ),
            [EstadosTareasEnum.FINALIZADA]: lista.filter(
                (t) => t.estado === EstadosTareasEnum.FINALIZADA,
            ),
            [EstadosTareasEnum.BAJA]: lista.filter(
                (t) => t.estado === EstadosTareasEnum.BAJA,
            ),
        };
    });

    private tareaArrastrada: ListTareaDTO | null = null;

    tareasPorEstado(estado: EstadosTareasEnum): ListTareaDTO[] {
        return this.tareasAgrupadas()[estado];
    }

    onDragStart(tarea: ListTareaDTO, event: DragEvent): void {
        this.tareaArrastrada = tarea;
        event.dataTransfer?.setData('text/plain', String(tarea.id));
        if (event.dataTransfer) {
            event.dataTransfer.effectAllowed = 'move';
        }
    }

    onDragOver(event: DragEvent): void {
        event.preventDefault();
        if (event.dataTransfer) {
            event.dataTransfer.dropEffect = 'move';
        }
    }

    onDrop(estadoDestino: EstadosTareasEnum, event: DragEvent): void {
        event.preventDefault();

        if (!this.tareaArrastrada) {
            return;
        }

        if (this.tareaArrastrada.estado !== estadoDestino) {
            this.cambiarEstado.emit({
                tarea: this.tareaArrastrada,
                estado: estadoDestino,
            });
        }

        this.tareaArrastrada = null;
    }

    onDragEnd(): void {
        this.tareaArrastrada = null;
    }
}
