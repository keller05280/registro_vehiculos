import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideRouter, Routes } from '@angular/router';
import { LoginComponent } from './app/login/login.component';
import { RegisterComponent } from './app/register/register.component';
import { TallerFormComponent } from './app/taller/taller.component';
import { provideHttpClient } from '@angular/common/http';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'taller', component: TallerFormComponent },
  { path: '', redirectTo: '/register', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' },
];

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideHttpClient()
  ]
})
.catch((err) => console.error(err));