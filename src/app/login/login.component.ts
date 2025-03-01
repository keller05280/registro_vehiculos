import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [RouterModule, FormsModule, CommonModule],
})
export class LoginComponent {
  credentials = { user: '', contrasena: '' };
  error: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  login() {
    
    this.credentials.user = this.credentials.user.replace(/\s/g, '').toLowerCase();
    this.credentials.contrasena = this.credentials.contrasena.replace(/\s/g, '');

    console.log('Credenciales:', this.credentials);

    this.authService.login(this.credentials).subscribe(
      (response) => {
        console.log('Respuesta del backend:', response);
        if (response && response.usuario && response.usuario.id) {
          localStorage.setItem('id', response.usuario.id.toString());
          console.log('ID almacenado en localStorage:', localStorage.getItem('id'));
          this.router.navigate(['/listado']);
        } else {
          console.error('Error de inicio de sesión, ID de usuario no válido.');
          this.error = 'Error de inicio de sesión, ID de usuario no válido.';
        }
      },
      (error) => {
        console.error('Error en el inicio de sesión:', error);
        console.log('Error completo:', error);
        if (error.status === 401) {
          this.error = 'Credenciales inválidas. Verifica tu usuario y contraseña.';
        } else if (error.status === 404) {
          this.error = 'Usuario no encontrado. Verifica tu usuario.';
        } else if (error.status === 500) {
          this.error = 'Error interno del servidor. Intenta nuevamente más tarde.';
        } else {
          this.error = 'Error inesperado. Intente nuevamente.';
        }
      }
    );
  }
}