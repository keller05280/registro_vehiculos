import { Component } from '@angular/core';
import { Router, RouterModule, RouterOutlet, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { TallerFormComponent } from './taller/taller.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [RouterOutlet, RouterModule,]
})
export class AppComponent {
  
  title = 'taller-app';
  constructor(private router: Router) {
    this.setupRoutes();
  }
  setupRoutes() {
    const routes: Routes = [
        { path: 'login', component: LoginComponent },
        { path: 'register', component: RegisterComponent },
        { path:'taller',component:TallerFormComponent },
        { path: '', redirectTo: '/login', pathMatch: 'full' },
    ];
    this.router.resetConfig(routes);
  }
}