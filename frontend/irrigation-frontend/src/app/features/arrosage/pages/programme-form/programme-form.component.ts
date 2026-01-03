import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { ArrosageService } from '../../../../core/services/arrosage.service';
import { MeteoService } from '../../../../core/services/meteo.service';
import { ProgrammeArrosage, StatutProgramme } from '../../../../core/models/programme-arrosage.model';
import { StationMeteo } from '../../../../core/models/station-meteo.model';
@Component({
  selector: 'app-programme-form',
  templateUrl: './programme-form.component.html',
  styleUrls: ['./programme-form.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatDialogModule,
    MatSnackBarModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatCheckboxModule,
    MatIconModule
  ]
})
export class ProgrammeFormComponent implements OnInit {
  programmeForm: FormGroup;
  isEditMode = false;
  statuts = Object.values(StatutProgramme);
  stations: StationMeteo[] = [];
  useMeteo = false;
  constructor(
    private fb: FormBuilder,
    private arrosageService: ArrosageService,
    private meteoService: MeteoService,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<ProgrammeFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ProgrammeArrosage
  ) {
    this.programmeForm = this.fb.group({
      parcelleId: ['', [Validators.required, Validators.min(1)]],
      datePlanifiee: [new Date().toISOString().split('T')[0], Validators.required],
      duree: ['', [Validators.min(1), Validators.max(480)]],
      volumePrevu: ['', [Validators.min(0), Validators.max(10000)]],
      statut: [StatutProgramme.PREVU, Validators.required],
      stationId: ['']
    });
  }
  ngOnInit(): void {
    this.loadStations();
    if (this.data) {
      this.isEditMode = true;
      this.programmeForm.patchValue(this.data);
    }
  }
  loadStations(): void {
    this.meteoService.getAllStations().subscribe({
      next: (data) => {
        this.stations = data;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des stations', error);
      }
    });
  }
  onSubmit(): void {
    if (this.programmeForm.valid) {
      const programme: ProgrammeArrosage = {
        parcelleId: this.programmeForm.value.parcelleId,
        datePlanifiee: this.programmeForm.value.datePlanifiee,
        duree: this.programmeForm.value.duree,
        volumePrevu: this.programmeForm.value.volumePrevu,
        statut: this.programmeForm.value.statut
      };
      if (this.isEditMode && this.data.id) {
        this.arrosageService.updateProgramme(this.data.id, programme).subscribe({
          next: (result) => {
            this.snackBar.open('Programme modifié avec succès', 'Fermer', { duration: 3000 });
            this.dialogRef.close(result);
          },
          error: (error) => {
            console.error('Erreur lors de la modification', error);
            this.snackBar.open('Erreur lors de la modification', 'Fermer', { duration: 3000 });
          }
        });
      } else {
        if (this.useMeteo && this.programmeForm.value.stationId) {
          this.arrosageService.createProgrammeWithMeteo(this.programmeForm.value.stationId, programme).subscribe({
            next: (result) => {
              this.snackBar.open('Programme créé avec ajustement météo', 'Fermer', { duration: 3000 });
              this.dialogRef.close(result);
            },
            error: (error) => {
              console.error('Erreur lors de la création', error);
              this.snackBar.open('Erreur lors de la création', 'Fermer', { duration: 3000 });
            }
          });
        } else {
          this.arrosageService.createProgramme(programme).subscribe({
            next: (result) => {
              this.snackBar.open('Programme créé avec succès', 'Fermer', { duration: 3000 });
              this.dialogRef.close(result);
            },
            error: (error) => {
              console.error('Erreur lors de la création', error);
              this.snackBar.open('Erreur lors de la création', 'Fermer', { duration: 3000 });
            }
          });
        }
      }
    }
  }
  onCancel(): void {
    this.dialogRef.close(false);
  }
}