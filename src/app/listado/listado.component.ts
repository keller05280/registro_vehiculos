
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { VehiculosService } from '../vehiculo.service';
import { AuthService } from '../auth.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

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
  pdfSrc: SafeResourceUrl | null = null;
  incluirDescripcion: boolean = false;
  private pdfDoc: jsPDF | null = null;

  @ViewChild('pdfDialog') pdfDialog!: ElementRef<HTMLDialogElement>;

  constructor(
    private router: Router, 
    private vehiculosService: VehiculosService, 
    private authService: AuthService,
    private sanitizer: DomSanitizer
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

  // Se llama al hacer clic en el botón principal
  generarPDF() {
    this.incluirDescripcion = false; // Inicia con la descripción desactivada
    this.regenerarPreview(); // Genera la vista previa inicial
    this.pdfDialog.nativeElement.showModal(); // Muestra la modal
  }

  // Se llama cada vez que el checkbox cambia
  regenerarPreview() {
    const doc = new jsPDF();
    this.pdfDoc = doc; // Actualiza la instancia del documento para la descarga

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
    this.pdfSrc = this.sanitizer.bypassSecurityTrustResourceUrl(dataUri);
  }

  descargarPDF() {
    if (this.pdfDoc) {
      this.pdfDoc.save('reporte-vehiculos.pdf');
    }
    this.cerrarPreview();
  }

  cerrarPreview() {
    this.pdfDialog.nativeElement.close();
    this.pdfSrc = null;
    this.pdfDoc = null;
    this.incluirDescripcion = false; // Resetea el estado del checkbox
  }
}