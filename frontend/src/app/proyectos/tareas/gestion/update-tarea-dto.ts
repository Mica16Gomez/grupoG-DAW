import { EstadosTareasEnum } from '../estados-tareas-enum';

export interface UpdateTareaDto {
    descripcion?: string;
    estado?: EstadosTareasEnum;
}
