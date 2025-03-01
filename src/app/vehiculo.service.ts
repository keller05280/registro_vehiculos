import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, map, throwError } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class VehiculosService {
  private apiUrl = 'http://localhost:3000/vehiculos';

  constructor(private http: HttpClient, private authService: AuthService) {}

  getVehiculos(): Observable<any[]> {
    const userId = this.authService.getUserId();
    if (userId !== null && userId !== undefined) {
      return this.http.get<any[]>(`${this.apiUrl}/${userId}`).pipe(
        catchError(this.handleError)
      );
    } else {
      return throwError(() => 'Usuario no autenticado.');
    }
  }

  getVehiculo(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/item/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  addVehiculo(vehiculo: any): Observable<any> {
    const userId = this.authService.getUserId();
    if (userId !== null && userId !== undefined) {
      const vehiculoConIdUsuario = { ...vehiculo, id_usuarios: userId };
      return this.http.post(this.apiUrl, vehiculoConIdUsuario).pipe(
        catchError(this.handleError),
        map((response: any) => {
          return { ...vehiculo, id: response.id };
        })
      );
    } else {
      return throwError(() => 'Usuario no autenticado.');
    }
  }

  updateVehiculo(id: number, vehiculo: any): Observable<any> {
    const userId = this.authService.getUserId();
    if (userId !== null && userId !== undefined) {
      const vehiculoConIdUsuario = { ...vehiculo, id_usuarios: userId };
      return this.http.put(`${this.apiUrl}/${id}`, vehiculoConIdUsuario).pipe(
        catchError(this.handleError),
        map((response: any) => {
          return response;
        })
      );
    } else {
      return throwError(() => 'Usuario no autenticado.');
    }
  }

  deleteVehiculo(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Algo malo ha ocurrido; por favor intentalo de nuevo más tarde.';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = `Código de error: ${error.status}, mensaje: ${error.error}`;
    }
    return throwError(() => errorMessage);
  }
}