import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { ArrosageService } from '../../../../core/services/arrosage.service';
import { ProgrammeArrosage, StatutProgramme } from '../../../../core/models/programme-arrosage.model';
import { ProgrammeFormComponent } from '../programme-form/programme-form.component';
@Component({
  selector: 'app-programme-list',
  templateUrl: './programme-list.component.html',
  styleUrls: ['./programme-list.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatSnackBarModule,
    MatButtonModule,
    MatCardModule,
    MatTableModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatChipsModule
  ]
})
export class ProgrammeListComponent implements OnInit {
  programmes: ProgrammeArrosage[] = [];
  displayedColumns: string[] = [
    'id',
    'parcelleId',
    'datePlanifiee',
    'duree',
    'volumePrevu',
    'statut',
    'actions'
  ];
  isLoading = false;
  constructor(
    private arrosageService: ArrosageService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}
  ngOnInit(): void {
    this.loadProgrammes(1);
  }
  loadProgrammes(parcelleId: number): void {
    this.isLoading = true;
    this.arrosageService.getProgrammesByParcelle(parcelleId).subscribe({
      next: data => {
        this.programmes = data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des programmes', error);
        
        if (error.status === 0) {
          this.snackBar.open(
            '⚠️ Impossible de se connecter au serveur (8082). Vérifiez que le service Arrosage est démarré.',
            'Fermer',
            { duration: 7000, horizontalPosition: 'center', verticalPosition: 'top', panelClass: ['error-snackbar'] }
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
    const dialogRef = this.dialog.open(ProgrammeFormComponent, {
      width: '600px',
      data: null
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadProgrammes(result.parcelleId);
      }
    });
  }
  openEditDialog(programme: ProgrammeArrosage): void {
    const dialogRef = this.dialog.open(ProgrammeFormComponent, {
      width: '600px',
      data: programme
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadProgrammes(result.parcelleId);
      }
    });
  }
  deleteProgramme(id: number, parcelleId: number): void {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce programme ?')) {
      return;
    }
    this.arrosageService.deleteProgramme(id).subscribe({
      next: () => {
        this.snackBar.open(
          'Programme supprimé avec succès',
          'Fermer',
          { duration: 3000 }
        );
        this.loadProgrammes(parcelleId);
      },
      error: () => {
        this.snackBar.open(
          'Erreur lors de la suppression',
          'Fermer',
          { duration: 3000 }
        );
      }
    });
  }
  getStatutColor(statut: StatutProgramme): string {
    switch (statut) {
      case StatutProgramme.PREVU:
        return 'primary';
      case StatutProgramme.EN_COURS:
        return 'accent';
      case StatutProgramme.TERMINE:
        return 'success';
      case StatutProgramme.ANNULE:
        return 'warn';
      default:
        return '';
    }
  }
}