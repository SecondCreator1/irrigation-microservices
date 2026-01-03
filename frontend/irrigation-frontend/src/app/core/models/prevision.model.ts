import { StationMeteo } from "./station-meteo.model";

export interface Prevision {
  id?: number;
  date: string; // Format: YYYY-MM-DD
  temperatureMax?: number;
  temperatureMin?: number;
  pluiePrevue?: number;
  vent?: number;
  station?: StationMeteo;
}
