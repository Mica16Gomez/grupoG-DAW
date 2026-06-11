import {
  Body,
  Controller,
  Get,
  Header,
  NotImplementedException,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Res,
  UseGuards,
} from "@nestjs/common";
import type { Response } from "express";
import { CreateProyectoDto } from "../dtos/input/create-proyecto.dto";
import { UpdateProyectoDto } from "../dtos/input/update-proyecto.dto";
import { ApiBearerAuth, ApiOkResponse } from "@nestjs/swagger";
import { ListProyectoDTO } from "../dtos/output/list-proyecto.dto";
import { ProyectoDTO } from "../dtos/output/proyecto.dto";
import { ProyectosService } from "../services/proyectos.service";
import { AuthGuard } from "../../auth/guards/auth.guard";

@Controller('proyectos')
export class ProyectosController {

    constructor(private readonly proyectosService: ProyectosService) { }

    @ApiBearerAuth()
    @UseGuards(AuthGuard)
    @Post()
    async crearProyecto(@Body() dto: CreateProyectoDto): Promise<{ id: number }> {

       return await this.proyectosService.crearProyecto(dto);

    }

    @ApiBearerAuth()
    @UseGuards(AuthGuard)
    @Put(':id')
    async actualizarProyecto(@Body() dto: UpdateProyectoDto, @Param('id', ParseIntPipe) id: number): Promise<void> {

        await this.proyectosService.actualizarProyecto(id, dto);
    }

    @ApiBearerAuth()
    @ApiOkResponse({ type: ListProyectoDTO, isArray: true })
    @UseGuards(AuthGuard)
    @Get()
    async obtenerProyectos(): Promise<ListProyectoDTO[]> {

        return await this.proyectosService.obtenerProyectos();
    }

    @ApiBearerAuth()
    @UseGuards(AuthGuard)
    @Get(':id')
    async obtenerProyecto(@Param('id', ParseIntPipe) id: number): Promise<ProyectoDTO> {

        return await this.proyectosService.obtenerProyecto(id);
    }

    @ApiBearerAuth()
    @UseGuards(AuthGuard)
    @Get('exportar/csv')
    @Header('Content-Type', 'text/csv; charset=utf-8')
    @Header('Content-Disposition', 'attachment; filename=proyectos.csv')
    async exportarProyectosCSV(@Res() res: Response): Promise<void> {
        
        const proyectos = await this.proyectosService.obtenerProyectos(); 

        let csvData = 'ID,Nombre del Proyecto,Cliente,Estado\n';

        proyectos.forEach(p => {
            const nombreProyecto = p.nombre.replace(/,/g, ' ');
            const nombreCliente = p.cliente ? p.cliente.nombre.replace(/,/g, ' ') : 'Sin Cliente';
            
            csvData += `${p.id},"${nombreProyecto}","${nombreCliente}","${p.estado}"\n`;
        });

        res.status(200).send(Buffer.from(csvData, 'utf-8'));
    }
}