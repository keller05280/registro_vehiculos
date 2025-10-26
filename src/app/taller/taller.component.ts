import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { VehiculosService } from '../vehiculo.service';
import { AuthService } from '../auth.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
@Component({
  selector: 'app-taller',
  templateUrl: './taller.component.html',
  styleUrls: ['./taller.component.css'],
  imports: [ReactiveFormsModule, CommonModule],
})
export class TallerFormComponent {
  vehiculoForm: FormGroup;
  isSubmitting = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;
  submitted = false;

  constructor(
    private fb: FormBuilder,
    private vehiculosService: VehiculosService,
    private authService: AuthService,
    private router: Router 
  ) {
    this.vehiculoForm = this.fb.group({
      marca: ['', Validators.required],
      modelo: ['', Validators.required],
      placa: ['', Validators.required],
      descripcion: [''],
    });
  }

  addVehiculo(): void {
    if (this.vehiculoForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      const userId = this.authService.getUserId();
      const vehiculo = {
        ...this.vehiculoForm.value,
        id_usuarios: userId,
      };
      this.vehiculosService.addVehiculo(vehiculo).subscribe({
        next: () => {
          this.vehiculoForm.reset();
          this.isSubmitting = false;
          this.successMessage = 'Vehículo agregado con éxito.';
          this.errorMessage = null;
          this.router.navigate(['/listado']); 
        },
        error: (error) => {
          this.errorMessage = error;
          this.successMessage = null;
          this.isSubmitting = false;
        },
      });
    }
  }

  onSubmit(): void {
    this.submitted = true;
    this.addVehiculo();
  }
}