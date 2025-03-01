
import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { VehiculosService } from '../vehiculo.service';
import { AuthService } from '../auth.service'; 

@Component({
  selector: 'app-listado',
  templateUrl: './listado.component.html',
  styleUrls: ['./listado.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule],
})
export class ListadoComponent implements OnInit {
  vehiculos: any[] = [];

  constructor(private router: Router, private vehiculosService: VehiculosService, private authService: AuthService) {} 

  ngOnInit(): void {
    this.getVehiculos();
  }

  getVehiculos(): void {
    this.vehiculosService.getVehiculos().subscribe((vehiculos) => {
      this.vehiculos = vehiculos;
    });
  }

  onDelete(id: number): void {
    if (confirm('¿Estás seguro de que quieres eliminar este vehículo?')) {
      this.vehiculosService.deleteVehiculo(id).subscribe(() => {
        this.getVehiculos(); 
      });
    }
  }

  onEdit(vehiculo: any): void {
    this.router.navigate(['/editar', vehiculo.id]);
  }

  goToRegister() {
    this.router.navigate(['/taller']);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}