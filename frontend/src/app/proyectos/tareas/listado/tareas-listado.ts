import {
    Component,
    computed,
    effect,
    inject,
    Signal,
    signal,
    WritableSignal,
} from '@angular/core';
import { MessageService } from 'primeng/api';
import { ListTareaDTO } from './list-tarea-dto';
import { ButtonModule } from 'primeng/button';
import { Template } from '../../../template/template';
import { GestionTarea } from '../gestion/gestion-tarea';
import { ActivatedRoute, Router } from '@angular/router';
import { ProyectoApiClient } from './proyecto-api-client';
import { ProyectoDTO } from './proyecto-dto';
import { TareasPanel } from '../panel/tareas-panel';
import { GestionTareaApiClient } from '../gestion/gestion-tarea-api-client';
import { EstadosTareasEnum } from '../estados-tareas-enum';

@Component({
    selector: 'app-tareas-listado',
    templateUrl: './tareas-listado.html',
    styleUrls: ['./tareas-listado.css'],
    imports: [ButtonModule, Template, GestionTarea, TareasPanel],
})
export class TareasListado {
    private readonly messageService: MessageService = inject(MessageService);
    private readonly proyectoApiClient: ProyectoApiClient =
        inject(ProyectoApiClient);
    private readonly gestionTareaApiClient: GestionTareaApiClient = inject(
        GestionTareaApiClient,
    );
    private readonly router: Router = inject(Router);
    private readonly route = inject(ActivatedRoute);

    proyecto: WritableSignal<ProyectoDTO | null> = signal(null);
    dialogVisible: WritableSignal<boolean> = signal(false);
    tareaSeleccionada: WritableSignal<ListTareaDTO | null> =
        signal<ListTareaDTO | null>(null);
    readonly idProyecto: WritableSignal<number> = signal(0);

    tareas: Signal<ListTareaDTO[]> = computed(() => {
        return this.proyecto()?.tareas || [];
    });

    private dialogEstabaAbierto = false;

    constructor() {
        const idParam = this.route.snapshot.paramMap.get('id');
        const parsedId = Number(idParam);

        if (!idParam || Number.isNaN(parsedId) || parsedId <= 0) {
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Id de proyecto no válido',
            });
            this.router.navigateByUrl('/proyectos');
            return;
        }

        this.idProyecto.set(parsedId);

        effect(() => {
            const visible = this.dialogVisible();
            if (this.dialogEstabaAbierto && !visible) {
                this.refreshProyecto();
            }
            this.dialogEstabaAbierto = visible;
        });

        this.refreshProyecto();
    }

    refreshProyecto(): void {
        this.proyectoApiClient.buscarProyecto(this.idProyecto()).subscribe({
            next: (data) => {
                this.proyecto.set(data);
            },
            error: () => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Error al obtener el proyecto',
                });
            },
        });
    }

    crearTarea(): void {
        this.tareaSeleccionada.set(null);
        this.dialogVisible.set(true);
    }

    editarTarea(tarea: ListTareaDTO): void {
        this.tareaSeleccionada.set(tarea);
        this.dialogVisible.set(true);
    }

    cambiarEstadoTarea(event: {
        tarea: ListTareaDTO;
        estado: EstadosTareasEnum;
    }): void {
        this.gestionTareaApiClient
            .actualizarTarea(this.idProyecto(), event.tarea.id, {
                estado: event.estado,
            })
            .subscribe({
                next: () => {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Éxito',
                        detail: 'Estado de la tarea actualizado.',
                    });
                    this.refreshProyecto();
                },
                error: (err) => {
                    const detail =
                        err.error?.statusCode >= 400 &&
                        err.error?.statusCode < 500
                            ? err.error.message
                            : 'Ha ocurrido un error al actualizar la tarea';
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail,
                    });
                },
            });
    }
}
