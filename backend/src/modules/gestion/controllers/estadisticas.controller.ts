import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse } from '@nestjs/swagger';
import { AuthGuard } from '../../auth/guards/auth.guard';
import { EstadisticasDto } from '../dtos/output/estadisticas.dto';
import { EstadisticasService } from '../services/estadisticas.service';

@Controller('estadisticas')
export class EstadisticasController {
    constructor(private readonly estadisticasService: EstadisticasService) {}

    @ApiBearerAuth()
    @ApiOkResponse({ type: EstadisticasDto })
    @UseGuards(AuthGuard)
    @Get()
    async obtenerEstadisticas(): Promise<EstadisticasDto> {
        return await this.estadisticasService.obtenerEstadisticas();
    }
}
