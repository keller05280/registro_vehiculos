import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { VehiculosService } from '../vehiculo.service';
import { AuthService } from '../auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-taller',
  templateUrl: './taller.component.html',
  styleUrls: ['./taller.component.css'],
  imports: [ReactiveFormsModule, CommonModule],
})
export class TallerFormComponent implements OnInit {
  vehiculoForm: FormGroup;
  vehiculos: any[] = [];
  selectedVehiculo: any;
  isSubmitting = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;
  isEditing = false;

  constructor(private fb: FormBuilder, private vehiculosService: VehiculosService, private authService: AuthService, private cdr: ChangeDetectorRef) {
    this.vehiculoForm = this.fb.group({
      marca: ['', Validators.required],
      modelo: ['', Validators.required],
      placa: ['', Validators.required],
      descripcion: ['']
    });
  }

  ngOnInit(): void {
    this.getVehiculos();
  }

  getVehiculos(): void {
    this.vehiculosService.getVehiculos().subscribe({
      next: (vehiculos) => {
        this.vehiculos = vehiculos;
        this.cdr.detectChanges();
        this.errorMessage = null;
      },
      error: (error) => {
        this.errorMessage = error;
        this.successMessage = null;
      }
    });
  }

  addVehiculo(): void {
    if (this.vehiculoForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      const userId = this.authService.getUserId();
      const vehiculo = {
        ...this.vehiculoForm.value,
        id_usuarios: userId
      };
      this.vehiculosService.addVehiculo(vehiculo).subscribe({
        next: () => {
          this.getVehiculos();
          this.vehiculoForm.reset();
          this.isSubmitting = false;
          this.successMessage = 'Vehículo agregado con éxito.';
          this.errorMessage = null;
          this.isEditing = false;
        },
        error: (error) => {
          this.errorMessage = error;
          this.successMessage = null;
          this.isSubmitting = false;
        }
      });
    }
  }

  updateVehiculo(): void {
    if (this.vehiculoForm.valid && this.selectedVehiculo) {
      const updatedVehiculo = {
        ...this.vehiculoForm.value,
        id_usuarios: this.selectedVehiculo.id_usuarios,
        id: this.selectedVehiculo.id
      };
      this.vehiculosService.updateVehiculo(this.selectedVehiculo.id, updatedVehiculo).subscribe({
        next: () => {
          this.getVehiculos();
          this.vehiculoForm.reset();
          this.selectedVehiculo = null;
          this.successMessage = 'Vehículo actualizado con éxito.';
          this.errorMessage = null;
          this.isEditing = false;
        },
        error: (error) => {
          this.errorMessage = error;
          this.successMessage = null;
          this.vehiculoForm.reset();
          this.selectedVehiculo = null;
          this.isEditing = false;
        }
      });
    }
  }

  deleteVehiculo(id: number): void {
    if (confirm('¿Estás seguro de que quieres eliminar este vehículo?')) {
      this.vehiculosService.deleteVehiculo(id).subscribe({
        next: () => {
          this.getVehiculos();
          this.successMessage = 'Vehículo eliminado con éxito.';
          this.errorMessage = null;
        },
        error: (error) => {
          this.errorMessage = error;
          this.successMessage = null;
        }
      });
    }
  }

  selectVehiculo(vehiculo: any): void {
    this.selectedVehiculo = vehiculo;
    this.vehiculoForm.patchValue(vehiculo);
    this.isEditing = true;
  }

  cancelEdit(): void {
    this.vehiculoForm.reset();
    this.selectedVehiculo = null;
    this.isEditing = false;
  }

  onSubmit(): void {
    if (this.isEditing) {
      this.updateVehiculo();
    } else {
      this.addVehiculo();
    }
  }
}