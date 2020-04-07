import {AfterViewInit, Component, OnInit} from '@angular/core';
import { HistorialService} from '../../services/historial.service';
import { ScanData} from '../../models/scanData.model';

@Component({
  selector: 'app-guardados',
  templateUrl: './guardados.page.html',
  styleUrls: ['./guardados.page.scss'],
})
export class GuardadosPage implements AfterViewInit {
  historial: ScanData[] = [];

  constructor(private historialService: HistorialService) { }

  abrirScan(i: number) {
    this.historialService.abrirEscaneado(i);
  }

  ngAfterViewInit(): void {
    this.historial = this.historialService.cargarHistorial();
  }
}
