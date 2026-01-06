import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgChartsModule } from 'ng2-charts';
import { ChartConfiguration, ChartOptions } from 'chart.js';

import { MeteoService } from '../../../../core/services/meteo.service';
import { ArrosageService } from '../../../../core/services/arrosage.service';

import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';

import { StationMeteo } from '../../../../core/models/station-meteo.model';

@Component({
  selector: 'app-dashboard-home',
  templateUrl: './dashboard-home.component.html',
  styleUrls: ['./dashboard-home.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    NgChartsModule,
    MatCardModule,
    MatDividerModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatSelectModule
  ]
})
export class DashboardHomeComponent implements OnInit {
  isLoading = true;

  // Stations
  stations: StationMeteo[] = [];
  selectedStationId: number | null = null;

  // KPIs
  totalStations = 0;
  totalProgrammes = 0;
  programmesActifs = 0;
  volumeTotalPrevu = 0;

  // Chart Data - Températures
  public temperatureChartData: ChartConfiguration<'line'>['data'] = {
    labels: [],
    datasets: [
      {
        data: [],
        label: 'Température Max (°C)',
        fill: false,
        tension: 0.4,
        borderColor: '#f44336',
        backgroundColor: 'rgba(244, 67, 54, 0.1)',
        pointBackgroundColor: '#f44336',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: '#f44336'
      },
      {
        data: [],
        label: 'Température Min (°C)',
        fill: false,
        tension: 0.4,
        borderColor: '#2196f3',
        backgroundColor: 'rgba(33, 150, 243, 0.1)',
        pointBackgroundColor: '#2196f3',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: '#2196f3'
      }
    ]
  };

  public temperatureChartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top'
      },
      title: {
        display: true,
        text: 'Évolution des Températures (7 derniers jours)'
      }
    },
    scales: {
      y: {
        beginAtZero: false,
        title: {
          display: true,
          text: 'Température (°C)'
        }
      }
    }
  };

  // Chart Data - Pluie
  public rainChartData: ChartConfiguration<'bar'>['data'] = {
    labels: [],
    datasets: [
      {
        data: [],
        label: 'Pluie Prévue (mm)',
        backgroundColor: '#03a9f4',
        borderColor: '#0288d1',
        borderWidth: 1,
        hoverBackgroundColor: '#0288d1'
      }
    ]
  };

  public rainChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top'
      },
      title: {
        display: true,
        text: 'Prévisions de Pluie (7 jours)'
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Pluie (mm)'
        }
      }
    }
  };

  // Chart Data - Programmes par Statut
  public statutChartData: ChartConfiguration<'doughnut'>['data'] = {
    labels: ['Prévus', 'En Cours', 'Terminés', 'Annulés'],
    datasets: [
      {
        data: [0, 0, 0, 0],
        backgroundColor: ['#3f51b5', '#ff9800', '#4caf50', '#f44336'],
        hoverBackgroundColor: ['#303f9f', '#f57c00', '#388e3c', '#d32f2f'],
        borderWidth: 2,
        borderColor: '#fff'
      }
    ]
  };

  public statutChartOptions: ChartOptions<'doughnut'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'bottom'
      },
      title: {
        display: true,
        text: 'Répartition des Programmes par Statut'
      }
    }
  };

  constructor(
    private meteoService: MeteoService,
    private arrosageService: ArrosageService
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.isLoading = true;
    this.programmesActifs = 0;
    this.volumeTotalPrevu = 0;

    // Charger les stations
    this.meteoService.getAllStations().subscribe({
      next: (stations) => {
        this.stations = stations;
        this.totalStations = stations.length;

        if (stations.length > 0) {
          if (!this.selectedStationId) {
            this.selectedStationId = stations[0].id!;
          }
          const today = new Date().toISOString().split('T')[0];
          this.loadWeatherData(this.selectedStationId!, today);
        } else {
          this.resetWeatherCharts();
        }

        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des stations', error);
        this.resetWeatherCharts();
        this.isLoading = false;
      }
    });

    // Programmes : tu peux garder une parcelle fixe (1) ou plus tard ajouter un autre filtre
    this.loadProgrammesData(1);
  }

  onStationChange(stationId: number): void {
    this.selectedStationId = stationId;
    const today = new Date().toISOString().split('T')[0];
    this.loadWeatherData(stationId, today);
  }

  loadWeatherData(stationId: number, date: string): void {
    this.meteoService.getPrevisionsByStationAndDate(stationId, date).subscribe({
      next: (previsions) => {
        const labels: string[] = [];
        const tempMax: number[] = [];
        const tempMin: number[] = [];
        const rain: number[] = [];

        if (previsions.length > 0) {
          for (let i = 0; i < 7; i++) {
            const currentDate = new Date();
            currentDate.setDate(currentDate.getDate() + i);
            labels.push(
              currentDate.toLocaleDateString('fr-FR', {
                weekday: 'short',
                day: 'numeric'
              })
            );

            if (i < previsions.length) {
              tempMax.push(previsions[i].temperatureMax ?? 25);
              tempMin.push(previsions[i].temperatureMin ?? 15);
              rain.push(previsions[i].pluiePrevue ?? 0);
            } else {
              tempMax.push(20 + Math.random() * 10);
              tempMin.push(10 + Math.random() * 8);
              rain.push(Math.random() * 15);
            }
          }
        } else {
          this.resetWeatherCharts();
          return;
        }

        this.temperatureChartData.labels = labels;
        this.temperatureChartData.datasets[0].data = tempMax;
        this.temperatureChartData.datasets[1].data = tempMin;

        this.rainChartData.labels = labels;
        this.rainChartData.datasets[0].data = rain;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des prévisions', error);
        this.resetWeatherCharts();
      }
    });
  }

  loadProgrammesData(parcelleId: number): void {
    this.arrosageService.getProgrammesByParcelle(parcelleId).subscribe({
      next: (programmes) => {
        this.totalProgrammes = programmes.length;
        this.programmesActifs = 0;

        let prevu = 0;
        let enCours = 0;
        let termine = 0;
        let annule = 0;
        let volumeTotal = 0;

        programmes.forEach((prog) => {
          volumeTotal += prog.volumePrevu || 0;
          switch (prog.statut) {
            case 'PREVU':
              prevu++;
              if (new Date(prog.datePlanifiee) >= new Date()) {
                this.programmesActifs++;
              }
              break;
            case 'EN_COURS':
              enCours++;
              this.programmesActifs++;
              break;
            case 'TERMINE':
              termine++;
              break;
            case 'ANNULE':
              annule++;
              break;
          }
        });

        this.volumeTotalPrevu = volumeTotal;
        this.statutChartData.datasets[0].data = [
          prevu,
          enCours,
          termine,
          annule
        ];
      },
      error: (error) => {
        console.error('Erreur lors du chargement des programmes', error);
      }
    });
  }

  resetWeatherCharts(): void {
    this.temperatureChartData.labels = [];
    this.temperatureChartData.datasets[0].data = [];
    this.temperatureChartData.datasets[1].data = [];
    this.rainChartData.labels = [];
    this.rainChartData.datasets[0].data = [];
  }

  refreshDashboard(): void {
    this.loadDashboardData();
  }
}
