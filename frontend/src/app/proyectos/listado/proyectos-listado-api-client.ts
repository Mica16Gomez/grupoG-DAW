import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ListProyectoDTO} from "./list-proyecto-dto";
import { HttpClient, HttpHeaders } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class ProyectosListadoApiClient {

    private readonly httpClient = inject(HttpClient);
    
    buscarProyectos(): Observable<ListProyectoDTO[]> {
        return this.httpClient.get<ListProyectoDTO[]>('/api/v1/proyectos');
    }

    exportarCSV(): Observable<Blob> {
        const token = localStorage.getItem('token'); // Recupera el JWT de autenticación
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

        // Como usas proxy.conf.json, le pegamos directamente de forma relativa
        return this.httpClient.get('/api/v1/proyectos/exportar/csv', {
            headers: headers,
            responseType: 'blob'
        });
    }


}