import { Prevision } from "./prevision.model";

export interface StationMeteo {
  id?: number;
  nom: string;
  latitude: number;
  longitude: number;
  fournisseur?: string;
  previsions?: Prevision[];
}
