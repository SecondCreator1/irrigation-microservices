import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MeteoService } from '../../../../core/services/meteo.service';
import { Prevision } from '../../../../core/models/prevision.model';
@Component({
  selector: 'app-prevision-form',
  templateUrl: './prevision-form.component.html',
  styleUrls: ['./prevision-form.component.scss'],
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
    MatIconModule
  ]
})
export class PrevisionFormComponent implements OnInit {
  previsionForm: FormGroup;
  constructor(
    private fb: FormBuilder,
    private meteoService: MeteoService,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<PrevisionFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { stationId: number }
  ) {
    this.previsionForm = this.fb.group({
      date: [new Date().toISOString().split('T')[0], Validators.required],
      temperatureMax: ['', [Validators.min(-50), Validators.max(60)]],
      temperatureMin: ['', [Validators.min(-50), Validators.max(60)]],
      pluiePrevue: ['', [Validators.min(0), Validators.max(500)]],
      vent: ['', [Validators.min(0), Validators.max(300)]]
    });
  }
  ngOnInit(): void { }
  onSubmit(): void {
    if (this.previsionForm.valid) {
      const prevision: Prevision = this.previsionForm.value;
      this.meteoService.createPrevision(this.data.stationId, prevision).subscribe({
        next: () => {
          this.snackBar.open('Prévision créée avec succès', 'Fermer', { duration: 3000 });
          this.dialogRef.close(true);
        },
        error: (error) => {
          console.error('Erreur lors de la création', error);
          this.snackBar.open('Erreur lors de la création', 'Fermer', { duration: 3000 });
        }
      });
    }
  }
  onCancel(): void {
    this.dialogRef.close(false);
  }
}