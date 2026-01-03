import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { JournalService } from '../../../../core/services/journal.service';
import { JournalArrosage } from '../../../../core/models/journal-arrosage.model';

@Component({
  selector: 'app-journal-list',
  templateUrl: './journal-list.component.html',
  styleUrls: ['./journal-list.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatSnackBarModule,
    MatCardModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule
  ]
})
export class JournalListComponent implements OnInit {
  journaux: JournalArrosage[] = [];
  displayedColumns: string[] = ['id', 'programmeId', 'dateExecution', 'volumeReel', 'remarque', 'actions'];
  isLoading = false;

  constructor(
    private journalService: JournalService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.loadJournaux(1);
  }

  loadJournaux(programmeId: number): void {
    this.isLoading = true;
    this.journalService.getJournalsByProgramme(programmeId).subscribe({
      next: (data) => {
        this.journaux = data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement du journal:', error);
        
        if (error.status === 0) {
          this.snackBar.open(
            '⚠️ Erreur de connexion - Vérifiez que la Gateway (9094) et les services sont démarrés. Vérifiez aussi la configuration CORS.',
            'Fermer',
            { duration: 7000, horizontalPosition: 'center', verticalPosition: 'top', panelClass: ['error-snackbar'] }
          );
        } else if (error.status === 403) {
          this.snackBar.open(
            '⚠️ Erreur CORS - La Gateway n\'a pas les bonnes permissions',
            'Fermer',
            { duration: 7000 }
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

  deleteJournal(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette entrée ?')) {
      this.journalService.deleteJournal(id).subscribe({
        next: () => {
          this.snackBar.open('Entrée supprimée avec succès', 'Fermer', { duration: 3000 });
          this.loadJournaux(1);
        },
        error: (error) => {
          console.error('Erreur lors de la suppression', error);
          this.snackBar.open('Erreur lors de la suppression', 'Fermer', { duration: 3000 });
        }
      });
    }
  }
}