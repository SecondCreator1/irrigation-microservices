import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MeteoService } from '../../../../core/services/meteo.service';
import { StationMeteo } from '../../../../core/models/station-meteo.model';
@Component({
  selector: 'app-station-form',
  templateUrl: './station-form.component.html',
  styleUrls: ['./station-form.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatDialogModule,
    MatSnackBarModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ]
})
export class StationFormComponent implements OnInit {
  stationForm: FormGroup;
  isEditMode = false;
  constructor(
    private fb: FormBuilder,
    private meteoService: MeteoService,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<StationFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: StationMeteo
  ) {
    this.stationForm = this.fb.group({
      nom: ['', Validators.required],
      latitude: ['', [Validators.required, Validators.min(-90), Validators.max(90)]],
      longitude: ['', [Validators.required, Validators.min(-180), Validators.max(180)]],
      fournisseur: ['']
    });
  }
  ngOnInit(): void {
    if (this.data) {
      this.isEditMode = true;
      this.stationForm.patchValue(this.data);
    }
  }
  onSubmit(): void {
    if (this.stationForm.valid) {
      const station: StationMeteo = this.stationForm.value;
      if (this.isEditMode && this.data.id) {
        this.meteoService.updateStation(this.data.id, station).subscribe({
          next: () => {
            this.snackBar.open('Station modifiée avec succès', 'Fermer', { duration: 3000 });
            this.dialogRef.close(true);
          },
          error: (error) => {
            console.error('Erreur lors de la modification', error);
            this.snackBar.open('Erreur lors de la modification', 'Fermer', { duration: 3000 });
          }
        });
      } else {
        this.meteoService.createStation(station).subscribe({
          next: () => {
            this.snackBar.open('Station créée avec succès', 'Fermer', { duration: 3000 });
            this.dialogRef.close(true);
          },
          error: (error) => {
            console.error('Erreur lors de la création', error);
            this.snackBar.open('Erreur lors de la création', 'Fermer', { duration: 3000 });
          }
        });
      }
    }
  }
  onCancel(): void {
    this.dialogRef.close(false);
  }
}