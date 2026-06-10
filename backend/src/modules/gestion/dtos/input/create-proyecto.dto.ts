import { ApiProperty } from "@nestjs/swagger";
import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from "class-validator";

export class CreateProyectoDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  nombre!: string;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  idCliente!: number;

  @ApiProperty({ example: "2026-06-12" })
  @IsDateString()
  @IsNotEmpty()
  fechaFinalizacion!: string;
}