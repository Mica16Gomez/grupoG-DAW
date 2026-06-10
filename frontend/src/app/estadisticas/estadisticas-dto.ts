export interface ResumenEstadisticasDto {
    proyectosActivos: number;
    proyectosTotal: number;
    proyectosFinalizados: number;
    tareasPendientes: number;
    tareasTotal: number;
    tareasFinalizadas: number;
    clientesActivos: number;
    clientesTotal: number;
}

export interface ProyectosPorClienteDto {
    idCliente: number | null;
    nombreCliente: string;
    cantidadProyectos: number;
}

export interface CantidadPorEstadoDto {
    estado: string;
    cantidad: number;
}

export interface EstadisticasDto {
    resumen: ResumenEstadisticasDto;
    proyectosPorCliente: ProyectosPorClienteDto[];
    tareasPorEstado: CantidadPorEstadoDto[];
    proyectosPorEstado: CantidadPorEstadoDto[];
}
