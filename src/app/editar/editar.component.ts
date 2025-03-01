import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { VehiculosService } from '../vehiculo.service';

@Component({
  selector: 'app-editar',
  templateUrl: './editar.component.html',
  styleUrls: ['./editar.component.css'],
  imports: [ReactiveFormsModule, CommonModule,RouterModule]
})
export class EditarComponent implements OnInit {
  vehiculoForm: FormGroup;
  vehiculo: any;
  id: number = 0;

  constructor(private fb: FormBuilder, private route: ActivatedRoute, private vehiculoService: VehiculosService, private router: Router) {
    this.vehiculoForm = this.fb.group({
      marca: ['', Validators.required],
      modelo: ['', Validators.required],
      placa: ['', Validators.required],
      descripcion: ['']
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.id = +params['id'];
      this.vehiculoService.getVehiculo(this.id).subscribe((vehiculo) => {
        this.vehiculo = vehiculo;
        this.vehiculoForm.patchValue(this.vehiculo);
      });
    });
  }

  onSubmit(): void {
    if (this.vehiculoForm.valid) {
      this.vehiculoService.updateVehiculo(this.id, this.vehiculoForm.value).subscribe(() => {
        this.router.navigate(['/listado']);
      });
    }
  }

  onCancel(): void {
    this.router.navigate(['/listado']);
  }
}