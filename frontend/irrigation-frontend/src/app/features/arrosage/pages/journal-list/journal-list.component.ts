import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { JournalService } from '../../../../core/services/journal.service';
import { JournalArrosage } from '../../../../core/models/journal-arrosage.model';

@Component({
  selector: 'app-journal-list',
  templateUrl: './journal-list.component.html',
  styleUrls: ['./journal-list.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatSnackBarModule,
    MatCardModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatInputModule,
    MatTooltipModule
  ]
})
export class JournalListComponent implements OnInit {
  journaux: JournalArrosage[] = [];
  programmeId: number | null = null;
  displayedColumns: string[] = ['id', 'programmeId', 'dateExecution', 'volumeReel', 'remarque', 'actions'];
  isLoading = false;

  constructor(
    private journalService: JournalService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.loadAllJournaux();
  }

  loadAllJournaux(): void {
    this.isLoading = true;
    this.journalService.getAllJournaux().subscribe({
      next: (data) => {
        this.journaux = data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement du journal:', error);
        this.snackBar.open('Erreur lors du chargement du journal', 'Fermer', { duration: 3000 });
        this.isLoading = false;
      }
    });
  }

  loadJournauxByProgramme(): void {
    if (!this.programmeId) {
      this.loadAllJournaux();
      return;
    }

    this.isLoading = true;
    this.journalService.getJournalsByProgramme(this.programmeId).subscribe({
      next: (data) => {
        this.journaux = data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement du journal:', error);
        this.snackBar.open('Erreur lors du chargement du journal', 'Fermer', { duration: 3000 });
        this.isLoading = false;
      }
    });
  }

  deleteJournal(id: number): void {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette entrée du journal ?')) {
      return;
    }

    this.journalService.deleteJournal(id).subscribe({
      next: () => {
        this.snackBar.open('Entrée supprimée avec succès', 'Fermer', { duration: 3000 });
        this.loadAllJournaux();
      },
      error: (error) => {
        console.error('Erreur lors de la suppression:', error);
        this.snackBar.open('Erreur lors de la suppression', 'Fermer', { duration: 3000 });
      }
    });
  }
}
