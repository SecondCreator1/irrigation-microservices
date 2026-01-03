import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArrosageRoutingModule } from './arrosage-routing.module';

// Standalone components
import { ProgrammeListComponent } from './pages/programme-list/programme-list.component';
import { ProgrammeFormComponent } from './pages/programme-form/programme-form.component';
import { JournalListComponent } from './pages/journal-list/journal-list.component';

@NgModule({
  imports: [
    CommonModule,
    ArrosageRoutingModule,

    // ✅ standalone components
    ProgrammeListComponent,
    ProgrammeFormComponent,
    JournalListComponent
  ]
})
export class ArrosageModule {}
