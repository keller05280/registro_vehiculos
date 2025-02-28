import { Component } from '@angular/core';
    import { AuthService } from '../auth.service';
    import { Router } from '@angular/router';
    import { FormsModule,  } from '@angular/forms';
    import { CommonModule } from '@angular/common';
    import { HttpClient, HttpHeaders } from '@angular/common/http';

    @Component({
        selector: 'app-register',
        templateUrl: './register.component.html',
        styleUrls: ['./register.component.css'],
        imports:[FormsModule, CommonModule,],
    })
    export class RegisterComponent {
        user = { user: '', email: '', contrasena: '' };
        error: string = '';

        constructor(private authService: AuthService, private router: Router, private http: HttpClient) { }

        register() {
            const httpOptions = {
                headers: new HttpHeaders({
                    'Content-Type': 'application/json'
                })
            };

            this.authService.register(this.user, httpOptions).subscribe(
                () => {
                    this.router.navigate(['/login']);
                },
                (error) => {
                    this.error = error.error.error;
                }
            );
        }
    }