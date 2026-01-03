import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MeteoService } from '../../../../core/services/meteo.service';
import { StationMeteo } from '../../../../core/models/station-meteo.model';
import { StationFormComponent } from '../station-form/station-form.component';
@Component({
  selector: 'app-station-list',
  templateUrl: './station-list.component.html',
  styleUrls: ['./station-list.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatTableModule,
    MatIconModule,
    MatProgressSpinnerModule
  ]
})
export class StationListComponent implements OnInit {
  stations: StationMeteo[] = [];
  displayedColumns: string[] = ['id', 'nom', 'latitude', 'longitude', 'fournisseur', 'actions'];
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
    this.isLoading = true;
    this.meteoService.getAllStations().subscribe({
      next: (data) => {
        this.stations = data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des stations', error);
        
        if (error.status === 0) {
          this.snackBar.open(
            '⚠️ CORS Error ou Gateway non disponible (9094). Vérifiez: 1) Gateway en cours d\'exécution, 2) Configuration CORS',
            'Fermer',
            { duration: 8000, horizontalPosition: 'center', verticalPosition: 'top', panelClass: ['error-snackbar'] }
          );
        } else if (error.status === 403) {
          this.snackBar.open(
            '⚠️ Erreur CORS - La Gateway n\'a pas les bonnes permissions CORS configurées',
            'Fermer',
            { duration: 8000 }
          );
        } else {
          this.snackBar.open(
            `Erreur ${error.status}: ${error.statusText}`,
            'Fermer',
            { duration: 5000 }
          );
        }
        this.isLoading = false;
      }
    });
  }
  openAddDialog(): void {
    const dialogRef = this.dialog.open(StationFormComponent, {
      width: '500px',
      data: null
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadStations();
      }
    });
  }
  openEditDialog(station: StationMeteo): void {
    const dialogRef = this.dialog.open(StationFormComponent, {
      width: '500px',
      data: station
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadStations();
      }
    });
  }
  deleteStation(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette station ?')) {
      this.meteoService.deleteStation(id).subscribe({
        next: () => {
          this.snackBar.open('Station supprimée avec succès', 'Fermer', { duration: 3000 });
          this.loadStations();
        },
        error: (error) => {
          console.error('Erreur lors de la suppression', error);
          this.snackBar.open('Erreur lors de la suppression', 'Fermer', { duration: 3000 });
        }
      });
    }
  }
}