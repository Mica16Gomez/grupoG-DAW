import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { Template } from '../template/template';
import { EstadisticasApiClient } from './estadisticas-api-client';
import {
    CantidadPorEstadoDto,
    EstadisticasDto,
    ResumenEstadisticasDto,
} from './estadisticas-dto';

interface TarjetaMetrica {
    titulo: string;
    valor: number;
    icono: string;
    clase: string;
}

@Component({
    selector: 'app-estadisticas',
    templateUrl: './estadisticas.html',
    styleUrls: ['./estadisticas.css'],
    imports: [Template, ButtonModule, TableModule],
})
export class Estadisticas implements OnInit {
    private readonly estadisticasApiClient = inject(EstadisticasApiClient);
    private readonly messageService = inject(MessageService);

    estadisticas: WritableSignal<EstadisticasDto | null> = signal(null);
    tarjetas: WritableSignal<TarjetaMetrica[]> = signal([]);
    cargando: WritableSignal<boolean> = signal(true);

    ngOnInit(): void {
        this.cargarEstadisticas();
    }

    cargarEstadisticas(): void {
        this.cargando.set(true);
        this.estadisticasApiClient.obtenerEstadisticas().subscribe({
            next: (data) => {
                this.estadisticas.set(data);
                this.tarjetas.set(this.construirTarjetas(data.resumen));
                this.cargando.set(false);
            },
            error: () => {
                this.cargando.set(false);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'No se pudieron cargar las estadísticas',
                });
            },
        });
    }

    porcentaje(cantidad: number, total: number): number {
        if (total === 0) {
            return 0;
        }
        return Math.round((cantidad / total) * 100);
    }

    barraAncho(item: CantidadPorEstadoDto, items: CantidadPorEstadoDto[]): number {
        const maximo = Math.max(...items.map((i) => i.cantidad), 1);
        return (item.cantidad / maximo) * 100;
    }

    private construirTarjetas(resumen: ResumenEstadisticasDto): TarjetaMetrica[] {
        return [
            {
                titulo: 'Proyectos activos',
                valor: resumen.proyectosActivos,
                icono: 'pi pi-briefcase',
                clase: 'metrica--proyectos',
            },
            {
                titulo: 'Total de proyectos',
                valor: resumen.proyectosTotal,
                icono: 'pi pi-folder',
                clase: 'metrica--total',
            },
            {
                titulo: 'Proyectos finalizados',
                valor: resumen.proyectosFinalizados,
                icono: 'pi pi-check-circle',
                clase: 'metrica--finalizados',
            },
            {
                titulo: 'Tareas pendientes',
                valor: resumen.tareasPendientes,
                icono: 'pi pi-clock',
                clase: 'metrica--pendientes',
            },
            {
                titulo: 'Total de tareas',
                valor: resumen.tareasTotal,
                icono: 'pi pi-list',
                clase: 'metrica--tareas',
            },
            {
                titulo: 'Tareas finalizadas',
                valor: resumen.tareasFinalizadas,
                icono: 'pi pi-verified',
                clase: 'metrica--tareas-ok',
            },
            {
                titulo: 'Clientes activos',
                valor: resumen.clientesActivos,
                icono: 'pi pi-users',
                clase: 'metrica--clientes',
            },
            {
                titulo: 'Total de clientes',
                valor: resumen.clientesTotal,
                icono: 'pi pi-building',
                clase: 'metrica--clientes-total',
            },
        ];
    }
}
