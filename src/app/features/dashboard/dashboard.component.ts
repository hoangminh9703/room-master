import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../core/services/api.service';

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
    totalGuests: 0,
    todayRevenue: 0,
    occupancyRate: 0
  };

  upcomingArrivals: any[] = [];
  recentBookings: any[] = [];
  loading = true;
  error: string | null = null;

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.loadStats();
  }

  loadStats(): void {
    this.loading = true;
    this.error = null;

    Promise.all([
      this.apiService.invoke<any>('booking:search', {}),
      this.apiService.invoke<any>('room:list', {}),
      this.apiService.invoke<any>('guest:list', {}),
      this.apiService.invoke<any>('report:revenue', { startDate: this.getTodayDate(), endDate: this.getTodayDate() }),
      this.apiService.invoke<any>('report:occupancy', { startDate: this.getTodayDate(), endDate: this.getTodayDate() })
    ])
      .then(([bookings, rooms, guests, revenue, occupancy]) => {
        const bookingsList = bookings.bookings || [];
        const roomsList = rooms.rooms || [];

        this.stats.totalBookings = bookingsList.length;
        this.stats.confirmedBookings = bookingsList.filter((b: any) => b.status === 'Confirmed').length;
        this.stats.availableRooms = roomsList.filter((r: any) => r.status === 'Available').length;
        this.stats.occupiedRooms = roomsList.filter((r: any) => r.status === 'Occupied').length;
        this.stats.totalGuests = guests.guests?.length || 0;
        this.stats.todayRevenue = revenue.total || 0;
        this.stats.occupancyRate = occupancy.occupancyRate || 0;

        this.upcomingArrivals = bookingsList
          .filter((b: any) => b.status === 'Confirmed' || b.status === 'Pending')
          .sort((a: any, b: any) => new Date(a.check_in_date).getTime() - new Date(b.check_in_date).getTime())
          .slice(0, 5);

        this.recentBookings = bookingsList
          .sort((a: any, b: any) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime())
          .slice(0, 5);

        this.loading = false;
      })
      .catch((err) => {
        console.error('Failed to load stats:', err);
        this.error = 'Failed to load dashboard statistics';
        this.loading = false;
      });
  }

  getTodayDate(): string {
    const today = new Date();
    return today.toISOString().split('T')[0];
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'Confirmed':
        return 'bg-green-100 text-green-800';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Checked_In':
        return 'bg-blue-100 text-blue-800';
      case 'Checked_Out':
        return 'bg-purple-100 text-purple-800';
      case 'Cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }
}
