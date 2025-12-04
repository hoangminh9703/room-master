import { Component, OnInit } from '@angular/core';
import { IpcService } from '../../core/services/ipc.service';

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

  constructor(private ipcService: IpcService) {}

  ngOnInit(): void {
    this.loadRooms();
  }

  loadRooms(): void {
    this.loading = true;
    this.error = null;

    const filters = this.statusFilter === 'all' ? {} : { status: this.statusFilter };

    this.ipcService
      .invoke<any>('room:list', filters)
      .then((response) => {
        this.rooms = response.rooms || [];
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

  updateRoomStatus(roomId: string, event: any): void {
    const newStatus = event.target.value;
    if (!newStatus) return;

    this.ipcService
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
}
