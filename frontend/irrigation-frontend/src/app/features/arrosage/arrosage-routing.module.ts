import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ProgrammeListComponent } from './pages/programme-list/programme-list.component';
import { JournalListComponent } from './pages/journal-list/journal-list.component';

const routes: Routes = [
  { path: 'programmes', component: ProgrammeListComponent },
  { path: 'journal', component: JournalListComponent },
  { path: '', redirectTo: 'programmes', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ArrosageRoutingModule {}
