import { Component, OnInit, HostListener } from '@angular/core';
import { ApiService } from '../../core/services/api.service';

@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.component.html',
  styleUrls: ['./bookings.component.css']
})
export class BookingsComponent implements OnInit {
  bookings: any[] = [];
  guests: any[] = [];
  filteredGuests: any[] = [];
  rooms: any[] = [];
  filteredRooms: any[] = [];
  loading = false;
  error: string | null = null;
  filter = 'all';
  searchQuery = '';
  startDate = '';
  endDate = '';
  guestSearchQuery = '';
  roomSearchQuery = '';
  showGuestDropdown = false;
  showRoomDropdown = false;
  selectedGuestId = '';
  selectedRoomId = '';
  showCreateModal = false;
  showEditModal = false;
  showViewModal = false;
  selectedBooking: any = null;

  newBooking = {
    guestId: '',
    roomId: '',
    checkInDate: '',
    checkOutDate: '',
    specialRequests: ''
  };

  checkInDateTime = '';
  checkOutDateTime = '';

  // new: hour/minute selectors for 24-hour input
  checkInHour = '00';
  checkInMinute = '00';
  checkOutHour = '00';
  checkOutMinute = '00';

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    const today = new Date();
    this.startDate = this.toDateInput(today);
    this.endDate = this.toDateInput(today);
  }

  loadGuests(): void {
    this.apiService
      .invoke<any>('guest:list', {})
      .then((response) => {
        this.guests = response || [];
        this.filteredGuests = this.guests;
      })
      .catch((err) => {
        console.error('Failed to load guests:', err);
      });
  }

  loadRooms(): void {
    this.apiService
      .invoke<any>('room:list', {})
      .then((response) => {
        this.rooms = response || [];
        this.filteredRooms = this.rooms;
      })
      .catch((err) => {
        console.error('Failed to load rooms:', err);
      });
  }

  loadAvailableRooms(): void {
    this.apiService
      .invoke<any>('room:available', {})
      .then((response) => {
        this.rooms = response || [];
        this.filteredRooms = this.rooms;
      })
      .catch((err) => {
        console.error('Failed to load available rooms, falling back to all rooms:', err);
        // Fall back to loading all rooms if available endpoint fails
        this.loadRooms();
      });
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.guest-dropdown-container')) {
      this.showGuestDropdown = false;
    }
    if (!target.closest('.room-dropdown-container')) {
      this.showRoomDropdown = false;
    }
  }

  filterGuests(): void {
    const query = this.guestSearchQuery.toLowerCase().trim();
    if (!query) {
      this.filteredGuests = this.guests;
    } else {
      this.filteredGuests = this.guests.filter((g: any) =>
        g.full_Name?.toLowerCase().includes(query) ||
        g.name?.toLowerCase().includes(query) ||
        g.phone?.toLowerCase().includes(query) ||
        g.guest_Id?.toLowerCase().includes(query) ||
        g.guestId?.toLowerCase().includes(query)
      );
    }
    this.showGuestDropdown = true;
  }

  filterRooms(): void {
    const query = this.roomSearchQuery.toLowerCase().trim();
    if (!query) {
      this.filteredRooms = this.rooms;
    } else {
      this.filteredRooms = this.rooms.filter((r: any) =>
        r.room_Number?.toLowerCase().includes(query) ||
        r.roomNumber?.toLowerCase().includes(query) ||
        r.room_Type_Id?.toLowerCase().includes(query) ||
        r.roomType?.toLowerCase().includes(query) ||
        r.room_Id?.toLowerCase().includes(query) ||
        r.roomId?.toLowerCase().includes(query)
      );
    }
    this.showRoomDropdown = true;
  }

  selectGuest(guest: any): void {
    this.newBooking.guestId = guest.guest_Id;
    this.selectedGuestId = guest.guest_Id;
    this.guestSearchQuery = `${guest.full_Name} - ${guest.phone}`;
    this.showGuestDropdown = false;
  }

  selectRoom(room: any): void {
    this.newBooking.roomId = room.room_Id;
    this.selectedRoomId = room.room_Id;
    this.roomSearchQuery = `${room.room_Number} - ${room.room_Type_Id} - ${room.price_Per_Night}`;
    this.showRoomDropdown = false;
  }

  loadBookings(): void {
    this.loading = true;
    this.error = null;

    const filters: any = this.filter === 'all' ? {} : { status: this.filter };
    
    if (this.startDate) {
      filters.startDate = this.startDate;
    }
    if (this.endDate) {
      filters.endDate = this.endDate;
    }

    this.apiService
      .invoke<any>('booking:search', filters)
      .then((response) => {
        let bookings = response || [];
        
        if (this.searchQuery.trim()) {
          bookings = bookings.filter((b: any) =>
            b.bookingReference?.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
            b.guestName?.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
            b.guestId?.toLowerCase().includes(this.searchQuery.toLowerCase())
          );
        }

        this.bookings = bookings;
        this.loading = false;
      })
      .catch((err) => {
        console.error('Failed to load bookings:', err);
        this.error = 'Failed to load bookings';
        this.loading = false;
      });
  }

  onFilterChange(): void {
    // this.loadBookings();
  }

  onSearch(): void {
    this.loadBookings();
  }

  openCreateModal(): void {
    this.newBooking = {
      guestId: '',
      roomId: '',
      checkInDate: '',
      checkOutDate: '',
      specialRequests: ''
    };
    this.loadGuests();
    this.loadRooms();
    const now = new Date();
    this.checkInDateTime = this.toDatetimeLocal(now);
    this.checkOutDateTime = this.toDatetimeLocal(now);
    // init selectors from now
    this.checkInHour = this.pad2(now.getHours());
    this.checkInMinute = this.pad2(now.getMinutes());
    this.checkOutHour = this.pad2(now.getHours());
    this.checkOutMinute = this.pad2(now.getMinutes());

    this.guestSearchQuery = '';
    this.roomSearchQuery = '';
    this.selectedGuestId = '';
    this.selectedRoomId = '';
    this.filteredGuests = this.guests;
    this.filteredRooms = this.rooms;
    this.showGuestDropdown = false;
    this.showRoomDropdown = false;
    this.showCreateModal = true;
  }

  closeCreateModal(): void {
    this.showCreateModal = false;
  }
 
  // helper: format Date -> "YYYY-MM-DDTHH:mm" for datetime-local input
  toDatetimeLocal(d: Date): string {
    const pad = (n: number) => String(n).padStart(2, '0');
    const year = d.getFullYear();
    const month = pad(d.getMonth() + 1);
    const day = pad(d.getDate());
    const hours = pad(d.getHours());
    const minutes = pad(d.getMinutes());
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }

  // helper: format Date -> "YYYY-MM-DD" for date input
  toDateInput(d: Date): string {
    const pad = (n: number) => String(n).padStart(2, '0');
    const year = d.getFullYear();
    const month = pad(d.getMonth() + 1);
    const day = pad(d.getDate());
    return `${year}-${month}-${day}`;
  }

  createBooking(): void {
    if (!this.newBooking.guestId || !this.newBooking.guestId.trim()) {
      this.error = 'Please select a guest';
      return;
    }
    if (!this.newBooking.roomId || !this.newBooking.roomId.trim()) {
      this.error = 'Please select a room';
      return;
    }
    if (!this.checkInDateTime || this.checkInDateTime.trim() === '') {
      this.error = 'Please select check-in date and time';
      return;
    }
    if (!this.checkOutDateTime || this.checkOutDateTime.trim() === '') {
      this.error = 'Please select check-out date and time';
      return;
    }

    const checkInDate = this.parseDateTimeLocal(this.checkInDateTime);
    const checkOutDate = this.parseDateTimeLocal(this.checkOutDateTime);

    if (checkOutDate <= checkInDate) {
      this.error = 'Check-out date must be after check-in date';
      return;
    }

    const payload = {
      guestId: this.newBooking.guestId,
      roomId: this.newBooking.roomId,
      checkInDate: this.formatDateTimeFromDate(checkInDate),
      checkOutDate: this.formatDateTimeFromDate(checkOutDate),
      specialRequests: this.newBooking.specialRequests,
    };

    this.apiService
      .invoke('booking:create', payload)
      .then(() => {
        this.loadBookings();
        this.closeCreateModal();
        alert('Booking created successfully');
      })
      .catch((err) => {
        console.error('Failed to create booking:', err);
        this.error = 'Failed to create booking';
      });
  }

  openEditModal(booking: any): void {
    this.selectedBooking = { ...booking };
    this.newBooking = { ...booking };
    this.checkInDateTime = booking.checkInDate || booking.check_In_Date || booking.check_In_DateTime || booking.check_In_Date || '';
    this.checkOutDateTime = booking.checkOutDate || booking.check_Out_Date || booking.check_Out_DateTime || booking.check_Out_Date || '';
    
    this.selectedGuestId = booking.guest_Id || booking.guestId || '';
    this.selectedRoomId = booking.room_Id || booking.roomId || '';
    
    // ensure editable model has initial ids (used if user doesn't change)
    this.newBooking.guestId = this.selectedGuestId;
    this.newBooking.roomId = this.selectedRoomId;

    this.loadGuests();
    this.loadAvailableRooms();
    
    setTimeout(() => {
      const guest = this.guests.find((g: any) => 
        g.guest_Id === this.selectedGuestId || g.guestId === this.selectedGuestId
      );
      if (guest) {
        this.guestSearchQuery = `${guest.full_Name || guest.name} - ${guest.phone}`;
        // reinforce model id from resolved guest (if different key)
        this.newBooking.guestId = guest.guest_Id || guest.guestId || this.newBooking.guestId;
      } else {
        this.guestSearchQuery = booking.full_Name || booking.guestName || booking.guest_Name || '';
      }
      
      const room = this.rooms.find((r: any) => 
        r.room_Id === this.selectedRoomId || r.roomId === this.selectedRoomId
      );
      if (room) {
        this.roomSearchQuery = `${room.room_Number || room.roomNumber} - ${room.room_Type_Id || room.roomType} - ${room.price_Per_Night}`;
        // reinforce model id from resolved room
        this.newBooking.roomId = room.room_Id || room.roomId || this.newBooking.roomId;
      } else {
        this.roomSearchQuery = booking.room_Number || booking.roomNumber || '';
      }

      // sync hour/minute selectors from resolved datetime strings (if any)
      const ci = this.extractDatePartFromDateTime(this.checkInDateTime);
      const co = this.extractDatePartFromDateTime(this.checkOutDateTime);
      if (ci) {
        this.checkInHour = this.pad2(ci.hours);
        this.checkInMinute = this.pad2(ci.minutes);
      }
      if (co) {
        this.checkOutHour = this.pad2(co.hours);
        this.checkOutMinute = this.pad2(co.minutes);
      }
    }, 300);
    
    this.showGuestDropdown = false;
    this.showRoomDropdown = false;
    this.showEditModal = true;
  }

  closeEditModal(): void {
    this.showEditModal = false;
    this.selectedBooking = null;
  }

  updateBooking(): void {
    // if user didn't change guest/room in UI, ensure we have valid ids from selectedBooking
    if (!this.newBooking.guestId || !this.newBooking.guestId.trim()) {
      this.newBooking.guestId = this.selectedGuestId || this.selectedBooking?.guest_Id || this.selectedBooking?.guestId || '';
    }
    if (!this.newBooking.roomId || !this.newBooking.roomId.trim()) {
      this.newBooking.roomId = this.selectedRoomId || this.selectedBooking?.room_Id || this.selectedBooking?.roomId || '';
    }
   
    const checkInDate = this.parseDateTimeLocal(this.checkInDateTime);
    const checkOutDate = this.parseDateTimeLocal(this.checkOutDateTime);

    if (checkOutDate <= checkInDate) {
      this.error = 'Check-out date must be after check-in date';
      return;
    }

    const bookingId = this.selectedBooking?.booking_Id

    const payload = {
      bookingId: bookingId,
      guest_Id: this.newBooking.guestId,
      room_Id: this.newBooking.roomId,
      check_In_Date: this.formatDateTimeFromDate(checkInDate),
      check_Out_Date: this.formatDateTimeFromDate(checkOutDate),
      special_Requests: this.newBooking.specialRequests || ''
    };

    this.apiService
      .invoke('booking:update', payload)
      .then(() => {
        this.loadBookings();
        this.closeEditModal();
        alert('Booking updated successfully');
      })
      .catch((err) => {
        console.error('Failed to update booking:', err);
        this.error = 'Failed to update booking';
      });
  }

  openViewModal(booking: any): void {
    this.selectedBooking = booking;
    this.showViewModal = true;
  }

  closeViewModal(): void {
    this.showViewModal = false;
    this.selectedBooking = null;
  }

  cancelBooking(bookingId: string): void {
    if (confirm('Are you sure you want to cancel this booking?')) {
      this.apiService
        .invoke('booking:cancel', { bookingId, reason: 'User requested' })
        .then(() => {
          this.loadBookings();
        })
        .catch((err) => {
          console.error('Failed to cancel booking:', err);
          alert('Failed to cancel booking');
        });
    }
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

  // helper: format for user display "dd/MM/yyyy HH:mm"
  formatDisplay(dateTimeString: string): string {
    if (!dateTimeString) return '';
    const d = this.parseDateTimeLocal(dateTimeString);
    if (!d || isNaN(d.getTime())) return '';
    const pad = (n: number) => String(n).padStart(2, '0');
    const day = pad(d.getDate());
    const month = pad(d.getMonth() + 1);
    const year = d.getFullYear();
    const hours = pad(d.getHours());
    const minutes = pad(d.getMinutes());
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  }

  // called when user edits datetime-local input directly
  onCheckInDateTimeChange(value: string): void {
    this.checkInDateTime = value;
    const parsed = this.parseDateTimeLocal(value);
    if (!isNaN(parsed.getTime())) {
      this.checkInHour = this.pad2(parsed.getHours());
      this.checkInMinute = this.pad2(parsed.getMinutes());
    }
  }

  onCheckOutDateTimeChange(value: string): void {
    this.checkOutDateTime = value;
    const parsed = this.parseDateTimeLocal(value);
    if (!isNaN(parsed.getTime())) {
      this.checkOutHour = this.pad2(parsed.getHours());
      this.checkOutMinute = this.pad2(parsed.getMinutes());
    }
  }

  // called when user changes selectors; rebuilds datetime-local string (YYYY-MM-DDTHH:mm)
  updateDateTimeFromSelectors(type: 'in' | 'out'): void {
    if (type === 'in') {
      const datePart = (this.checkInDateTime && this.checkInDateTime.split('T')[0]) || this.toDateInput(new Date());
      this.checkInDateTime = `${datePart}T${this.pad2(Number(this.checkInHour))}:${this.pad2(Number(this.checkInMinute))}`;
    } else {
      const datePart = (this.checkOutDateTime && this.checkOutDateTime.split('T')[0]) || this.toDateInput(new Date());
      this.checkOutDateTime = `${datePart}T${this.pad2(Number(this.checkOutHour))}:${this.pad2(Number(this.checkOutMinute))}`;
    }
  }

  // helper: pad2
  pad2(n: number | string): string {
    return String(n).padStart(2, '0');
  }

  // helper: extract hours/minutes from datetime-local string
  extractDatePartFromDateTime(dt: string): { hours: number; minutes: number } | null {
    if (!dt) return null;
    const parts = dt.split('T');
    if (parts.length < 2) return null;
    const timeParts = parts[1].split(':');
    const hours = Number(timeParts[0] || 0);
    const minutes = Number(timeParts[1] || 0);
    return { hours, minutes };
  }
}
