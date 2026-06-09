import { ApiProperty } from "@nestjs/swagger";
import { EstadosClientesEnum } from "../../enums/estados-clientes.enum";

export class ListClienteDTO {
  @ApiProperty()
  id!: number;

  @ApiProperty()
  nombre!: string;

  @ApiProperty({ nullable: true, example: "2615551234" })
  telefono!: string | null;

  @ApiProperty({ nullable: true, example: "cliente@correo.com" })
  email!: string | null;

  @ApiProperty()
  estado!: EstadosClientesEnum;
}