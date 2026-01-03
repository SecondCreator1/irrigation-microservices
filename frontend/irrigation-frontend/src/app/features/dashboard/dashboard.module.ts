import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardRoutingModule } from './dashboard-routing.module';

// Standalone component
import { DashboardHomeComponent } from './pages/dashboard-home/dashboard-home.component';

@NgModule({
  imports: [
    CommonModule,
    DashboardRoutingModule,

    // ✅ standalone component
    DashboardHomeComponent
  ]
})
export class DashboardModule {}
