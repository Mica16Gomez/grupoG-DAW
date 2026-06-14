import { Component, effect, inject, signal, WritableSignal } from "@angular/core";
import { Router } from "@angular/router";
import { MessageService } from "primeng/api";
import { ListProyectoDTO } from "./list-proyecto-dto";
import { ProyectosListadoApiClient } from "./proyectos-listado-api-client";
import { TableModule } from 'primeng/table';
import { ButtonModule } from "primeng/button";
import { Template } from "../../template/template";
import { TooltipModule } from 'primeng/tooltip';
import { GestionProyecto } from "../gestion/gestion-proyecto";
import { DatePipe } from "@angular/common";
import { TagModule } from 'primeng/tag'; 

@Component({
  selector: "app-proyectos-listado",
  templateUrl: "./proyectos-listado.html",
  styleUrls: ["./proyectos-listado.css"],
  imports: [TableModule, ButtonModule, Template, TooltipModule, GestionProyecto, DatePipe, TagModule]
})
export class ProyectosListado {

  private readonly messageService: MessageService = inject(MessageService);
  private readonly proyectosListadoApiClient: ProyectosListadoApiClient = inject(ProyectosListadoApiClient);

  private readonly router: Router = inject(Router);

  proyectos: WritableSignal<ListProyectoDTO[]> = signal([]);
  dialogVisible: WritableSignal<boolean> = signal(false);
  proyectoSeleccionado: WritableSignal<ListProyectoDTO | null> = signal<ListProyectoDTO | null>(null);

  private dialogEstabaAbierto = false;

  constructor() {
    effect(() => {
      const visible = this.dialogVisible();
      if (this.dialogEstabaAbierto && !visible) {
        this.refrescarProyectos();
      }
      this.dialogEstabaAbierto = visible;
    });

    this.refrescarProyectos();
  }

  refrescarProyectos(): void {
    this.proyectosListadoApiClient.buscarProyectos().subscribe({
      next: (data) => {
        this.proyectos.set(data);
      },
      error: (error) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al obtener los proyectos' });
      }
    });
  }

  crearProyecto(): void {
    this.dialogVisible.set(true);
  }

  editarProyecto(proyecto: ListProyectoDTO): void {
    this.dialogVisible.set(true);
    this.proyectoSeleccionado.set(proyecto);
  }

  gestionarTareas(proyecto: ListProyectoDTO): void {
    this.router.navigate(['/proyectos', proyecto.id, 'tareas']);
  }

  descargarReporteCSV() {
  this.proyectosListadoApiClient.exportarCSV().subscribe({
    next: (blob: Blob) => {
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      
      link.download = `reporte_proyectos_${new Date().toISOString().slice(0,10)}.csv`;
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      window.URL.revokeObjectURL(blobUrl);
    },
    error: (err) => {
      console.error('Error al descargar el archivo CSV:', err);
    }
  });
}
calcularEstadoFecha(fechaStr: any): {
  texto: string;
  severidad: 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast';
} {
  if (!fechaStr) {
    return { texto: 'Sin fecha', severidad: 'secondary' };
  }

  let fechaFin: Date;

  if (typeof fechaStr === 'string' && fechaStr.includes('-')) {
    const [anio, mes, dia] = fechaStr.split('-').map(Number);
    fechaFin = new Date(anio, mes - 1, dia);
  } else {
    fechaFin = new Date(fechaStr);
  }

  const hoy = new Date();

  hoy.setHours(0, 0, 0, 0);
  fechaFin.setHours(0, 0, 0, 0);

  const diffTime = fechaFin.getTime() - hoy.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return {
      texto: `Retrasado (${Math.abs(diffDays)} días)`,
      severidad: 'danger',
    };
  } else if (diffDays === 0) {
    return {
      texto: 'Vence hoy',
      severidad: 'warn',
    };
  } else {
    return {
      texto: `Faltan ${diffDays} días`,
      severidad: 'info',
    };
  }
}}