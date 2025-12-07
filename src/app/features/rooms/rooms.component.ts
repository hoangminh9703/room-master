import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../core/services/api.service';

@Component({
  selector: 'app-rooms',
  templateUrl: './rooms.component.html',
  styleUrls: ['./rooms.component.css']
})
export class RoomsComponent implements OnInit {
  rooms: any[] = [];
  loading = false;
  error: string | null = null;
  statusFilter = 'all';
  viewMode: 'grid' | 'list' = 'grid';
  floorFilter = 'all';
  typeFilter = 'all';
  capacityFilter = 'all';
  searchQuery = '';
  checkInDateTime = '';
  checkOutDateTime = '';

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    
  }

  private applyFilters(rooms: any[]): any[] {
    let filtered = rooms;

    if (this.statusFilter !== 'all') {
      filtered = filtered.filter((r: any) => r.status === this.statusFilter);
    }
    if (this.floorFilter !== 'all') {
      filtered = filtered.filter((r: any) => r.floor?.toString() === this.floorFilter);
    }
    if (this.typeFilter !== 'all') {
      filtered = filtered.filter((r: any) => {
        const typeVal = r.roomTypeId || r.room_Type_Id || r.roomType;
        return typeVal === this.typeFilter;
      });
    }
    if (this.capacityFilter !== 'all') {
      filtered = filtered.filter((r: any) => r.capacity?.toString() === this.capacityFilter);
    }
    if (this.searchQuery.trim()) {
      const term = this.searchQuery.toLowerCase();
      filtered = filtered.filter((r: any) =>
        (r.roomNumber || r.room_Number || r.room_number || '')
          .toLowerCase()
          .includes(term)
      );
    }

    return filtered;
  }

  loadRooms(): void {
    this.loading = true;
    this.error = null;

    this.apiService
      .invoke<any>('room:available', {})
      .then((response) => {
        this.rooms = this.applyFilters(response || []);
        this.loading = false;
      })
      .catch((err) => {
        console.error('Failed to load rooms:', err);
        this.error = 'Failed to load rooms';
        this.loading = false;
      });
  }

  loadAvailableRoomsByDate(): void {
    this.error = null;

    if (!this.checkInDateTime || !this.checkOutDateTime) {
      this.error = 'Please select both check-in and check-out date/time';
      return;
    }

    const checkInDate = this.parseDateTimeLocal(this.checkInDateTime);
    const checkOutDate = this.parseDateTimeLocal(this.checkOutDateTime);

    if (isNaN(checkInDate.getTime()) || isNaN(checkOutDate.getTime())) {
      this.error = 'Invalid date/time format';
      return;
    }

    if (checkOutDate <= checkInDate) {
      this.error = 'Check-out date must be after check-in date';
      return;
    }

    this.loading = true;
    const payload = {
      checkInDate: this.formatDateTimeFromDate(checkInDate),
      checkOutDate: this.formatDateTimeFromDate(checkOutDate)
    };

    this.apiService
      .post<any>('/rooms/available', payload)
      .then((response) => {
        this.rooms = this.applyFilters(response.items || response || []);
        this.loading = false;
      })
      .catch((err) => {
        console.error('Failed to load available rooms:', err);
        this.error = 'Failed to load available rooms for selected dates';
        this.loading = false;
      });
  }

  onFilterChange(): void {
    if (this.checkInDateTime && this.checkOutDateTime) {
      this.loadAvailableRoomsByDate();
    } else {
      this.loadRooms();
    }
  }

  onDateRangeChange(): void {
    this.error = null;
    if (this.checkInDateTime && this.checkOutDateTime) {
      this.onFilterChange();
    }
  }

  toggleViewMode(mode: 'grid' | 'list'): void {
    this.viewMode = mode;
  }

  updateRoomStatus(roomId: string, event: any): void {
    const newStatus = event.target.value;
    if (!newStatus) return;

    this.apiService
      .invoke('room:update-status', { roomId, status: newStatus })
      .then(() => {
        this.loadRooms();
      })
      .catch((err) => {
        console.error('Failed to update room status:', err);
        alert('Failed to update room status');
      });
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'Available':
        return 'bg-green-100 text-green-800';
      case 'Occupied':
        return 'bg-blue-100 text-blue-800';
      case 'Cleaning':
        return 'bg-yellow-100 text-yellow-800';
      case 'Maintenance':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  getUniqueCapacities(): number[] {
    const capacities = new Set<number>();
    this.rooms.forEach((r: any) => {
      if (r.capacity) capacities.add(r.capacity);
    });
    return Array.from(capacities).sort((a, b) => a - b);
  }

  getStatusIcon(status: string): string {
    switch (status) {
      case 'Available':
        return '🟢';
      case 'Occupied':
        return '🔴';
      case 'Cleaning':
        return '🟡';
      case 'Maintenance':
        return '⚠️';
      default:
        return '⚪';
    }
  }

  getUniqueFloors(): string[] {
    return [...new Set(this.rooms.map(r => r.floor?.toString()).filter(Boolean))].sort();
  }

  getUniqueTypes(): string[] {
    return [
      ...new Set(
        this.rooms
          .map(r => r.roomTypeId || r.room_Type_Id || r.roomType)
          .filter(Boolean)
      )
    ].sort();
  }
  formatDateTimeFromDate(d: Date): string {
    const pad = (n: number) => String(n).padStart(2, '0');
    const year = d.getFullYear();
    const month = pad(d.getMonth() + 1);
    const day = pad(d.getDate());
    const hours = pad(d.getHours());
    const minutes = pad(d.getMinutes());
    const seconds = pad(d.getSeconds());
    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
  }

  
  parseDateTimeLocal(s: string): Date {
    if (!s) return new Date('');
    const [datePart, timePart] = s.split('T');
    if (!timePart) return new Date(s);
    const [yearStr, monthStr, dayStr] = datePart.split('-');
    const timeParts = timePart.split(':');
    const hour = Number(timeParts[0] || 0);
    const minute = Number(timeParts[1] || 0);
    const second = timeParts[2] ? Number(timeParts[2].replace(/\D.*$/,'')) : 0;
    const year = Number(yearStr);
    const month = Number(monthStr);
    const day = Number(dayStr);
    return new Date(year, month - 1, day, hour, minute, second);
  }
}
