import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../core/services/api.service';

@Component({
  selector: 'app-rooms',
  templateUrl: './rooms.component.html',
  styleUrls: ['./rooms.component.css']
})
export class RoomsComponent implements OnInit {
  rooms: any[] = [];
  loading = true;
  error: string | null = null;
  statusFilter = 'all';
  viewMode: 'grid' | 'list' = 'grid';
  floorFilter = 'all';
  typeFilter = 'all';
  searchQuery = '';

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.loadRooms();
  }

  loadRooms(): void {
    this.loading = true;
    this.error = null;

    const filters = {};

    this.apiService
      .invoke<any>('room:list', filters)
      .then((response) => {
        let rooms = response || [];
        if (this.statusFilter !== 'all') {
          rooms = rooms.filter((r: any) => r.status === this.statusFilter);
        }
        if (this.floorFilter !== 'all') {
          rooms = rooms.filter((r: any) => r.floor?.toString() === this.floorFilter);
        }

        if (this.typeFilter !== 'all') {
          rooms = rooms.filter((r: any) => r.roomTypeId === this.typeFilter);
        }

        if (this.searchQuery.trim()) {
          rooms = rooms.filter((r: any) =>
            r.roomNumber?.toLowerCase().includes(this.searchQuery.toLowerCase())
          );
        }

        this.rooms = rooms;
        this.loading = false;
      })
      .catch((err) => {
        console.error('Failed to load rooms:', err);
        this.error = 'Failed to load rooms';
        this.loading = false;
      });
  }

  onFilterChange(): void {
    this.loadRooms();
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
    return [...new Set(this.rooms.map(r => r.roomTypeId).filter(Boolean))].sort();
  }
}
