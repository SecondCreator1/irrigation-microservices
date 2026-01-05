import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MeteoService } from '../../../../core/services/meteo.service';
import { Prevision } from '../../../../core/models/prevision.model';
import { StationMeteo } from '../../../../core/models/station-meteo.model';
import { PrevisionFormComponent } from '../prevision-form/prevision-form.component';

@Component({
  selector: 'app-prevision-list',
  templateUrl: './prevision-list.component.html',
  styleUrls: ['./prevision-list.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatSnackBarModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatTableModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatTooltipModule
  ]
})
export class PrevisionListComponent implements OnInit {
  previsions: Prevision[] = [];
  stations: StationMeteo[] = [];
  selectedStationId: number | null = null;
  selectedDate: string = new Date().toISOString().split('T')[0];
  displayedColumns: string[] = ['date', 'temperatureMax', 'temperatureMin', 'pluiePrevue', 'vent', 'actions'];
  isLoading = false;

  constructor(
    private meteoService: MeteoService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.loadStations();
  }

  loadStations(): void {
    this.meteoService.getAllStations().subscribe({
      next: (data) => {
        this.stations = data;
        if (this.stations.length > 0) {
          this.selectedStationId = this.stations[0].id!;
          this.loadPrevisions();
        }
      },
      error: (error) => {
        console.error('Erreur lors du chargement des stations', error);
        this.snackBar.open('Erreur lors du chargement des stations', 'Fermer', { duration: 3000 });
      }
    });
  }

  loadPrevisions(): void {
    if (!this.selectedStationId) return;
    this.isLoading = true;
    this.meteoService.getPrevisionsByStationAndDate(this.selectedStationId, this.selectedDate).subscribe({
      next: (data) => {
        this.previsions = data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des prévisions', error);
        this.snackBar.open('Erreur lors du chargement des prévisions', 'Fermer', { duration: 3000 });
        this.isLoading = false;
      }
    });
  }

  onStationChange(): void {
    this.loadPrevisions();
  }

  onDateChange(): void {
    this.loadPrevisions();
  }

  openAddDialog(): void {
    const dialogRef = this.dialog.open(PrevisionFormComponent, {
      width: '600px',
      data: { stationId: this.selectedStationId }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadPrevisions();
      }
    });
  }

  openEditDialog(prevision: Prevision): void {
    const dialogRef = this.dialog.open(PrevisionFormComponent, {
      width: '600px',
      data: { 
        stationId: this.selectedStationId,
        prevision: prevision
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadPrevisions();
      }
    });
  }

  deletePrevision(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette prévision ?')) {
      this.meteoService.deletePrevision(id).subscribe({
        next: () => {
          this.snackBar.open('Prévision supprimée avec succès', 'Fermer', { duration: 3000 });
          this.loadPrevisions();
        },
        error: (error) => {
          console.error('Erreur lors de la suppression', error);
          this.snackBar.open('Erreur lors de la suppression', 'Fermer', { duration: 3000 });
        }
      });
    }
  }
}
