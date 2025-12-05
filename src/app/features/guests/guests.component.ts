import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../core/services/api.service';

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

  showCreateModal = false;
  showEditModal = false;
  showViewModal = false;
  selectedGuest: any = null;

  newGuest = {
    fullName: '',
    email: '',
    phone: '',
    idType: 'Passport',
    idNumber: '',
    nationality: '',
    address: ''
  };

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.loadGuests();
  }

  loadGuests(): void {
    this.loading = true;
    this.error = null;

    const query = this.searchQuery || '';
    this.apiService
      .invoke<any>('guest:list', {})
      .then((response) => {
        this.guests = response || [];
        if (query) {
          this.guests = this.guests.filter((g: any) =>
            g.fullName.toLowerCase().includes(query.toLowerCase()) ||
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

  openCreateModal(): void {
    this.newGuest = {
      fullName: '',
      email: '',
      phone: '',
      idType: 'Passport',
      idNumber: '',
      nationality: '',
      address: ''
    };
    this.showCreateModal = true;
  }

  closeCreateModal(): void {
    this.showCreateModal = false;
  }

  createGuest(): void {
    if (!this.newGuest.fullName || !this.newGuest.phone) {
      this.error = 'Please fill in required fields';
      return;
    }

    this.apiService
      .invoke('guest:create', this.newGuest)
      .then(() => {
        this.loadGuests();
        this.closeCreateModal();
        alert('Guest created successfully');
      })
      .catch((err) => {
        console.error('Failed to create guest:', err);
        this.error = 'Failed to create guest';
      });
  }

  openEditModal(guest: any): void {
    this.selectedGuest = { ...guest };
    this.newGuest = { ...guest };
    this.showEditModal = true;
  }

  closeEditModal(): void {
    this.showEditModal = false;
    this.selectedGuest = null;
  }

  updateGuest(): void {
    if (!this.newGuest.fullName || !this.newGuest.phone) {
      this.error = 'Please fill in required fields';
      return;
    }

    this.apiService
      .invoke('guest:update', { guestId: this.selectedGuest.guestId, ...this.newGuest })
      .then(() => {
        this.loadGuests();
        this.closeEditModal();
        alert('Guest updated successfully');
      })
      .catch((err) => {
        console.error('Failed to update guest:', err);
        this.error = 'Failed to update guest';
      });
  }

  openViewModal(guest: any): void {
    this.selectedGuest = guest;
    this.showViewModal = true;
  }

  closeViewModal(): void {
    this.showViewModal = false;
    this.selectedGuest = null;
  }

  deleteGuest(guestId: string): void {
    if (confirm('Are you sure you want to delete this guest?')) {
      this.apiService
        .invoke('guest:delete', { guestId })
        .then(() => {
          this.loadGuests();
          alert('Guest deleted successfully');
        })
        .catch((err) => {
          console.error('Failed to delete guest:', err);
          alert('Failed to delete guest');
        });
    }
  }
}
