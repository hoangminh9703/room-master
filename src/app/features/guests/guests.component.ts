import { Component, OnInit } from '@angular/core';
import { IpcService } from '../../core/services/ipc.service';

@Component({
  selector: 'app-guests',
  templateUrl: './guests.component.html',
  styleUrls: ['./guests.component.css']
})
export class GuestsComponent implements OnInit {
  guests: any[] = [];
  loading = true;
  error: string | null = null;
  searchQuery = '';

  constructor(private ipcService: IpcService) {}

  ngOnInit(): void {
    this.loadGuests();
  }

  loadGuests(): void {
    this.loading = true;
    this.error = null;

    const query = this.searchQuery || '';
    this.ipcService
      .invoke<any>('guest:list', {})
      .then((response) => {
        this.guests = response.guests || [];
        if (query) {
          this.guests = this.guests.filter((g: any) =>
            g.full_name.toLowerCase().includes(query.toLowerCase()) ||
            g.email?.toLowerCase().includes(query.toLowerCase()) ||
            g.phone?.includes(query)
          );
        }
        this.loading = false;
      })
      .catch((err) => {
        console.error('Failed to load guests:', err);
        this.error = 'Failed to load guests';
        this.loading = false;
      });
  }

  onSearch(): void {
    this.loadGuests();
  }

  viewGuest(guestId: string): void {
    console.log('View guest:', guestId);
  }
}
