import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
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
  isEditMode: boolean = false;

  constructor(
    private fb: FormBuilder,
    private meteoService: MeteoService,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<PrevisionFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { stationId: number; prevision?: Prevision }
  ) {
    this.isEditMode = !!data.prevision;

    this.previsionForm = this.fb.group({
      date: [
        data.prevision?.date || new Date().toISOString().split('T')[0],
        Validators.required
      ],
      temperatureMax: [
        data.prevision?.temperatureMax ?? '',
        [Validators.required, Validators.min(-50), Validators.max(60)]
      ],
      temperatureMin: [
        data.prevision?.temperatureMin ?? '',
        [Validators.required, Validators.min(-50), Validators.max(60)]
      ],
      pluiePrevue: [
        data.prevision?.pluiePrevue ?? '',
        [Validators.required, Validators.min(0), Validators.max(500)]
      ],
      vent: [
        data.prevision?.vent ?? '',
        [Validators.required, Validators.min(0), Validators.max(300)]
      ]
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.previsionForm.invalid) {
      this.previsionForm.markAllAsTouched();
      return;
    }

    const prevision: Prevision = this.previsionForm.value;

    if (this.isEditMode && this.data.prevision?.id) {
      this.meteoService.updatePrevision(this.data.prevision.id, prevision).subscribe({
        next: () => {
          this.snackBar.open('Prévision modifiée avec succès', 'Fermer', { duration: 3000 });
          this.dialogRef.close(true);
        },
        error: (error) => {
          console.error('Erreur lors de la modification', error);
          this.snackBar.open('Erreur lors de la modification', 'Fermer', { duration: 3000 });
        }
      });
    } else {
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
