import { Routes } from '@angular/router';
import { Login } from './auth/login/login';
import { TareasListado } from './proyectos/tareas/listado/tareas-listado';
import { ProyectosListado } from './proyectos/listado/proyectos-listado';
import { Estadisticas } from './estadisticas/estadisticas';
import { authGuard } from './auth/auth-guard';

export const routes: Routes = [
    {
        path: 'login',
        component: Login,
    },
    {
        path: 'proyectos/:id/tareas',
        component: TareasListado,
        canActivate: [authGuard],
    },
    {
        path: 'proyectos',
        component: ProyectosListado,
        canActivate: [authGuard],
    },
    {
        path: 'estadisticas',
        component: Estadisticas,
        canActivate: [authGuard],
    },
    {
        path: '**',
        redirectTo: 'login',
    },
];
