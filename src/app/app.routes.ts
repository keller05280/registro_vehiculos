// app.routes.ts
import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ListadoComponent } from './listado/listado.component';
import { TallerFormComponent } from './taller/taller.component';
import { EditarComponent } from './editar/editar.component';

export const routes: Routes = [ 
  { path: 'login', component: LoginComponent }, 
  { path: 'listado', component: ListadoComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'taller', component: TallerFormComponent },
  { path: 'editar/:id', component: EditarComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' },
];