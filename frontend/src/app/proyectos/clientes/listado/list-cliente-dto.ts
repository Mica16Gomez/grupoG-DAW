import { EstadosClientesEnum } from "../estados-clientes-enum";

export interface ListClienteDTO {
  id: number;
  nombre: string;
  telefono: string | null;
  email: string | null;
  estado: EstadosClientesEnum;
}