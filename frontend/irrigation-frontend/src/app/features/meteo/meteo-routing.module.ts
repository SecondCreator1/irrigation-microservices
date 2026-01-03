import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StationListComponent } from './pages/station-list/station-list.component';
import { PrevisionListComponent } from './pages/prevision-list/prevision-list.component';

const routes: Routes = [
  { path: 'stations', component: StationListComponent },
  { path: 'previsions', component: PrevisionListComponent },
  { path: '', redirectTo: 'stations', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MeteoRoutingModule { }
