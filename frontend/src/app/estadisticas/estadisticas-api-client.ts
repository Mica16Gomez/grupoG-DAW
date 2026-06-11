import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EstadisticasDto } from './estadisticas-dto';

@Injectable({
    providedIn: 'root',
})
export class EstadisticasApiClient {
    private readonly httpClient = inject(HttpClient);

    obtenerEstadisticas(): Observable<EstadisticasDto> {
        return this.httpClient.get<EstadisticasDto>('/api/v1/estadisticas');
    }
}
