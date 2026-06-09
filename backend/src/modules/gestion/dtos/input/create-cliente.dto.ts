import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, Matches, MaxLength } from "class-validator";

export class CreateClienteDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  nombre!: string;

  @ApiProperty({ example: "+5492615438843" })
  @IsString()
  @IsNotEmpty()
  @Matches(/^\+?[1-9]\d{5,14}$/, {
    message: "El teléfono debe tener entre 6 y 15 dígitos y puede comenzar con +",
  })
  telefono!: string;

  @ApiProperty({ example: "cliente@correo.com" })
  @IsString()
  @IsNotEmpty()
  @MaxLength(254, {
    message: "El correo electrónico no debe superar los 254 caracteres",
  })
  @IsEmail({}, { message: "El correo electrónico no es válido" })
  email!: string;
}