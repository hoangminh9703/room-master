import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { BookingsComponent } from './features/bookings/bookings.component';
import { RoomsComponent } from './features/rooms/rooms.component';
import { GuestsComponent } from './features/guests/guests.component';
import { ReportsComponent } from './features/reports/reports.component';

const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'bookings', component: BookingsComponent },
  { path: 'rooms', component: RoomsComponent },
  { path: 'guests', component: GuestsComponent },
  { path: 'reports', component: ReportsComponent },
  { path: '**', redirectTo: '/dashboard' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes), CommonModule, FormsModule],
  exports: [RouterModule],
  declarations: [
    DashboardComponent,
    BookingsComponent,
    RoomsComponent,
    GuestsComponent,
    ReportsComponent
  ]
})
export class AppRoutingModule { }
