import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpHeaders, HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [ReactiveFormsModule, CommonModule, FormsModule, HttpClientModule, RouterModule],
})
export class LoginComponent {
  credentials = { user: '', contrasena: '' };
  error: string = '';

  constructor(private authService: AuthService, private router: Router, private http: HttpClient) { }

  login() {
    console.log('Credenciales:', this.credentials);

    this.authService.login(this.credentials).subscribe(
      (response) => {
        if (response && response.usuario && response.usuario.id) {
          localStorage.setItem('id', response.usuario.id.toString());
          console.log('ID almacenado en localStorage:', localStorage.getItem('id'));
          this.router.navigate(['/taller']);
        } else {
          this.error = 'Error de inicio de sesión, ID de usuario no válido.';
        }
      },
      (error) => {
        this.error = error.error.error;
      }
    );
  }
}