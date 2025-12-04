import { Component, OnInit } from '@angular/core';
import { IpcService } from '../../core/services/ipc.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  stats = {
    totalBookings: 0,
    confirmedBookings: 0,
    availableRooms: 0,
    occupiedRooms: 0,
    totalGuests: 0
  };

  loading = true;
  error: string | null = null;

  constructor(private ipcService: IpcService) {}

  ngOnInit(): void {
    this.loadStats();
  }

  loadStats(): void {
    this.loading = true;
    this.error = null;

    Promise.all([
      this.ipcService.invoke<any>('booking:search', {}),
      this.ipcService.invoke<any>('room:list', {}),
      this.ipcService.invoke<any>('guest:list', {})
    ])
      .then(([bookings, rooms, guests]) => {
        this.stats.totalBookings = bookings.bookings?.length || 0;
        this.stats.confirmedBookings = bookings.bookings?.filter((b: any) => b.status === 'Confirmed').length || 0;
        this.stats.availableRooms = rooms.rooms?.filter((r: any) => r.status === 'Available').length || 0;
        this.stats.occupiedRooms = rooms.rooms?.filter((r: any) => r.status === 'Occupied').length || 0;
        this.stats.totalGuests = guests.guests?.length || 0;
        this.loading = false;
      })
      .catch((err) => {
        console.error('Failed to load stats:', err);
        this.error = 'Failed to load dashboard statistics';
        this.loading = false;
      });
  }
}
