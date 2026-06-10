export interface CreateProyectoDTO {
    
    nombre: string;

    idCliente: number;
    fechaFinalizacion?: Date; // <-- NUEVO CAMPO

}
