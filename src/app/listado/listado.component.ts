
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { VehiculosService } from '../vehiculo.service';
import { AuthService } from '../auth.service';

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-listado',
  templateUrl: './listado.component.html',
  styleUrls: ['./listado.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
})
export class ListadoComponent implements OnInit {
  vehiculos: any[] = [];
  incluirDescripcion: boolean = false;
  private pdfDoc: jsPDF | null = null;

  @ViewChild('pdfDialog') pdfDialog!: ElementRef<HTMLDialogElement>;
  @ViewChild('pdfFrame') pdfFrame!: ElementRef<HTMLIFrameElement>; // Referencia al iframe

  constructor(
    private router: Router, 
    private vehiculosService: VehiculosService, 
    private authService: AuthService
  ) {} 

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

  generarPDF() {
    this.incluirDescripcion = false;
    this.regenerarPreview();
    this.pdfDialog.nativeElement.showModal();
  }

  regenerarPreview() {
    const doc = new jsPDF();
    this.pdfDoc = doc;

    doc.text('Reporte de Vehículos', 14, 20);

    let tableHeaders: string[][] = [];
    let tableData: any[][] = [];

    if (this.incluirDescripcion) {
      tableHeaders = [['Marca', 'Modelo', 'Placa', 'Descripción']];
      tableData = this.vehiculos.map(v => [v.marca, v.modelo, v.placa, v.descripcion || 'N/A']);
    } else {
      tableHeaders = [['Marca', 'Modelo', 'Placa']];
      tableData = this.vehiculos.map(v => [v.marca, v.modelo, v.placa]);
    }

    autoTable(doc, {
      head: tableHeaders,
      body: tableData,
      startY: 30,
    });

    const dataUri = doc.output('datauristring');
    // Asignamos la URL directamente al src del iframe, evitando el sanitizer
    this.pdfFrame.nativeElement.src = dataUri;
  }

  descargarPDF() {
    if (this.pdfDoc) {
      this.pdfDoc.save('reporte-vehiculos.pdf');
    }
    this.cerrarPreview();
  }

  cerrarPreview() {
    this.pdfDialog.nativeElement.close();
    // Limpiamos el iframe para liberar memoria
    if(this.pdfFrame && this.pdfFrame.nativeElement) {
      this.pdfFrame.nativeElement.src = '';
    }
    this.pdfDoc = null;
    this.incluirDescripcion = false;
  }
}