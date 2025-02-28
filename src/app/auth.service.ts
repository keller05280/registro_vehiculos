import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private apiUrl = 'http://localhost:3000/usuarios';

    constructor(private http: HttpClient) { }

    register(user: any, httpOptions: any): Observable<any> {
        console.log("Datos enviados desde auth service: ", user);
        return this.http.post(`${this.apiUrl}/registro`, user, httpOptions).pipe(
            catchError((error: HttpErrorResponse) => {
                console.error('Error en el registro:', error);
                return throwError(error);
            })
        );
    }

    login(credentials: any): Observable<any> {
        return this.http.post(`${this.apiUrl}/login`, credentials).pipe(
            tap((response: any) => {
                if (response && response.usuario && response.usuario.id) {
                    localStorage.setItem('id', response.usuario.id.toString());
                }
            }),
            catchError((error: HttpErrorResponse) => {
                console.error('Error en el inicio de sesión:', error);
                return throwError(error);
            })
        );
    }

    getUserId(): number | null {
        console.log('Obteniendo id del localStorage');
        const id = localStorage.getItem('id');
        console.log('id obtenido:', id);
        if (id) {
            const userId = parseInt(id, 10);
            console.log('userId convertido:', userId);
            return userId;
        } else {
            return null;
        }
    }
}