import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ArrosageService } from '../../../../core/services/arrosage.service';
import { JournalService } from '../../../../core/services/journal.service';
import { ProgrammeArrosage, StatutProgramme } from '../../../../core/models/programme-arrosage.model';
import { JournalArrosage } from '../../../../core/models/journal-arrosage.model';
import { ProgrammeFormComponent } from '../programme-form/programme-form.component';

@Component({
  selector: 'app-programme-list',
  templateUrl: './programme-list.component.html',
  styleUrls: ['./programme-list.component.scss'],
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
    MatTableModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    MatTooltipModule
  ]
})
export class ProgrammeListComponent implements OnInit {
  programmes: ProgrammeArrosage[] = [];
  parcelleId: number = 1;
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
  StatutProgramme = StatutProgramme; // ✅ Exposer l'enum pour le template

  constructor(
    private arrosageService: ArrosageService,
    private journalService: JournalService, // ✅ AJOUTÉ
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadProgrammes();
  }

  loadProgrammes(): void {
    if (!this.parcelleId) return;

    this.isLoading = true;
    this.arrosageService.getProgrammesByParcelle(this.parcelleId).subscribe({
      next: data => {
        this.programmes = data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des programmes', error);
        
        if (error.status === 0) {
          this.snackBar.open(
            '⚠️ Impossible de se connecter au serveur. Vérifiez que le service Arrosage est démarré.',
            'Fermer',
            { duration: 7000, horizontalPosition: 'center', verticalPosition: 'top' }
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

  onParcelleChange(): void {
    this.loadProgrammes();
  }

  openAddDialog(): void {
    const dialogRef = this.dialog.open(ProgrammeFormComponent, {
      width: '600px',
      data: null
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadProgrammes();
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
        this.loadProgrammes();
      }
    });
  }

  // ✅ NOUVELLE MÉTHODE
  markAsCompleted(programme: ProgrammeArrosage): void {
    if (!confirm('Marquer ce programme comme terminé et l\'enregistrer au journal ?')) {
      return;
    }

    // 1. Mettre à jour le statut du programme à TERMINE
    const updatedProgramme = { ...programme, statut: StatutProgramme.TERMINE };
    
    this.arrosageService.updateProgramme(programme.id!, updatedProgramme).subscribe({
      next: () => {
        // 2. Créer l'entrée dans le journal
        const journal: JournalArrosage = {
          programmeId: programme.id!,
          dateExecution: new Date().toISOString().split('T')[0],
          volumeReel: programme.volumePrevu || 0,
          remarque: `Arrosage terminé pour parcelle ${programme.parcelleId}`
        };

        this.journalService.createJournal(journal).subscribe({
          next: () => {
            this.snackBar.open('✅ Programme terminé et enregistré au journal', 'Fermer', { duration: 3000 });
            this.loadProgrammes();
          },
          error: (error) => {
            console.error('Erreur lors de la création du journal', error);
            this.snackBar.open('⚠️ Programme terminé mais erreur journal', 'Fermer', { duration: 3000 });
            this.loadProgrammes();
          }
        });
      },
      error: (error) => {
        console.error('Erreur lors de la mise à jour du programme', error);
        this.snackBar.open('Erreur lors de la mise à jour', 'Fermer', { duration: 3000 });
      }
    });
  }

  deleteProgramme(id: number): void {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce programme ?')) {
      return;
    }

    this.arrosageService.deleteProgramme(id).subscribe({
      next: () => {
        this.snackBar.open('Programme supprimé avec succès', 'Fermer', { duration: 3000 });
        this.loadProgrammes();
      },
      error: () => {
        this.snackBar.open('Erreur lors de la suppression', 'Fermer', { duration: 3000 });
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
        return 'warn';
      case StatutProgramme.ANNULE:
        return '';
      default:
        return '';
    }
  }
}
