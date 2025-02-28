import { Routes } from '@angular/router';
    import { LoginComponent } from './login/login.component';
    import { RegisterComponent } from './register/register.component';
    import { TallerFormComponent } from './taller/taller.component';
    export const routes: Routes = [
      { path: 'login', component: LoginComponent },
      { path: 'register', component: RegisterComponent },
      { path: 'taller', component: TallerFormComponent },
      { path: '', redirectTo: '/register', pathMatch: 'full' },
      { path: '**', redirectTo: '/login' },
    ];