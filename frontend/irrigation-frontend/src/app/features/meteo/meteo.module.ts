import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MeteoRoutingModule } from './meteo-routing.module';

// Standalone components
import { StationListComponent } from './pages/station-list/station-list.component';
import { StationFormComponent } from './pages/station-form/station-form.component';
import { PrevisionListComponent } from './pages/prevision-list/prevision-list.component';
import { PrevisionFormComponent } from './pages/prevision-form/prevision-form.component';

@NgModule({
  imports: [
    CommonModule,
    MeteoRoutingModule,

    // ✅ standalone components go here
    StationListComponent,
    StationFormComponent,
    PrevisionListComponent,
    PrevisionFormComponent
  ]
})
export class MeteoModule {}
