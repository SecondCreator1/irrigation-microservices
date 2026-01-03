export enum StatutProgramme {
  PREVU = 'PREVU',
  EN_COURS = 'EN_COURS',
  TERMINE = 'TERMINE',
  ANNULE = 'ANNULE'
}

export interface ProgrammeArrosage {
  id?: number;
  parcelleId: number;
  datePlanifiee: string;
  duree?: number; // minutes
  volumePrevu?: number; // litres
  statut: StatutProgramme;
}
