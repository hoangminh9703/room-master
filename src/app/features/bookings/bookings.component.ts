import { Component, OnInit, HostListener, OnDestroy } from '@angular/core';
import { ApiService } from '../../core/services/api.service';
import { environment } from '../../../environments/environment';
import * as XLSX from 'xlsx';
import { AuthService } from '../../core/services/auth.service';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.component.html',
  styleUrls: ['./bookings.component.css']
})
export class BookingsComponent implements OnInit, OnDestroy {
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
  selectedRoomPricePerHour = 0;
  computedTotalPrice = 0;

  pageIndex = 1;
  pageSize = environment.pageSize || 10;
  totalRows = 0;
  canExport = false;
  private subs = new Subscription();

  constructor(private apiService: ApiService, private authService: AuthService) {}

  ngOnInit(): void {
    const today = new Date();
    this.startDate = this.toDateInput(today);
    this.endDate = this.toDateInput(today);
    this.loadGuests();
    this.watchRole();
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  private roleCode(val: any): number {
    if (typeof val === 'number') return val;
    const v = String(val || '').toLowerCase();
    if (v === '1' || v === 'admin') return 1;
    if (v === '2' || v === 'le tan' || v === 'lễ tân' || v === 'receptionist') return 2;
    return 0;
  }

  private watchRole(): void {
    const s = this.authService.getAuthState().subscribe((state) => {
      const code = this.roleCode((state.user as any)?.role);
      this.canExport = code === 1; // only admin
    });
    this.subs.add(s);
  }

  loadGuests(): void {
    this.apiService
      .invoke<any>('guest:list', {})
      .then((response) => {
        this.guests = response || [];
        this.filteredGuests = [...this.guests];
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

  loadAvailableRoomsByDate(): void {
    if (!this.checkInDateTime || !this.checkOutDateTime) {
      this.error = 'Please select both check-in and check-out dates first';
      return;
    }

    const checkInDate = this.parseDateTimeLocal(this.checkInDateTime);
    const checkOutDate = this.parseDateTimeLocal(this.checkOutDateTime);

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
        this.rooms = response.items || response || [];
        this.filteredRooms = this.rooms;
        this.loading = false;
        this.error = null;
      })
      .catch((err) => {
        console.error('Failed to load available rooms:', err);
        this.error = 'Failed to load available rooms for selected dates';
        this.loading = false;
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
    // Ensure dropdown shows when typing
    if (!this.showGuestDropdown) {
      this.showGuestDropdown = true;
    }
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
    // Ensure dropdown shows when typing
    if (!this.showRoomDropdown) {
      this.showRoomDropdown = true;
    }
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
    this.selectedRoomPricePerHour = Number(
      room.price_Per_Hour || room.pricePerHour || room.price_per_hour || 0
    ) || 0;
    this.roomSearchQuery = `${room.room_Number} - ${room.room_Type_Id} - ${room.price_Per_Night}`;
    this.showRoomDropdown = false;
    this.updateComputedPrice();
  }

  loadBookings(): void {
    this.loading = true;
    this.error = null;

    const payload: any = {
      keyword: this.searchQuery.trim() || null,
      pageIndex: this.pageIndex,
      pageSize: this.pageSize,
      status: this.filter === 'all' ? null : this.filter,
      fromDate: this.startDate || null,
      toDate: this.endDate || null,
      searchCheckInDate: null,
      searchCheckOutDate: null,
      type: null
    };

    this.apiService
      .post<any>('/bookings/search', payload)
      .then((response) => {
        this.bookings = response.items || [];
        this.totalRows = response.totalRows || response.TotalRows || 0;
        this.loading = false;
      })
      .catch((err) => {
        console.error('Failed to load bookings:', err);
        this.error = 'Failed to load bookings';
        this.loading = false;
      });
  }

  onFilterChange(): void {
    this.pageIndex = 1;
    this.loadBookings();
  }

  onSearch(): void {
    this.pageIndex = 1;
    this.loadBookings();
  }

  onPageChange(delta: number): void {
    const next = this.pageIndex + delta;
    const totalPages = this.getTotalPages();
    if (next < 1 || next > totalPages) return;
    this.pageIndex = next;
    this.loadBookings();
  }

  getTotalPages(): number {
    return Math.max(1, Math.ceil(this.totalRows / this.pageSize || 1));
  }

  getPageNumbers(): number[] {
    const totalPages = this.getTotalPages();
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  openCreateModal(): void {
    this.newBooking = {
      guestId: '',
      roomId: '',
      checkInDate: '',
      checkOutDate: '',
      specialRequests: ''
    };
    this.guestSearchQuery = '';
    this.roomSearchQuery = '';
    this.selectedGuestId = '';
    this.selectedRoomId = '';
    this.selectedRoomPricePerHour = 0;
    this.computedTotalPrice = 0;
    this.showGuestDropdown = false;
    this.showRoomDropdown = false;
    this.error = null;
    
    // Use cached guests if available, otherwise load
    if (this.guests.length > 0) {
      this.filteredGuests = [...this.guests];
    } else {
      this.filteredGuests = [];
      this.loadGuests();
    }
    
    this.filteredRooms = [];
    
    // DO NOT load rooms here - wait for user to select check-in/check-out dates
    const now = new Date();
    this.checkInDateTime = this.toDatetimeLocal(now);
    this.checkOutDateTime = this.toDatetimeLocal(now);

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
    
    // Map check-in/out dates from API response format
    const checkInStr = booking.check_in_date || booking.checkInDate || booking.check_In_Date || '';
    const checkOutStr = booking.check_out_date || booking.checkOutDate || booking.check_Out_Date || '';
    
    // Convert ISO dates to datetime-local format (YYYY-MM-DDTHH:mm)
    if (checkInStr) {
      const checkInDate = new Date(checkInStr);
      this.checkInDateTime = this.toDatetimeLocal(checkInDate);
    }
    if (checkOutStr) {
      const checkOutDate = new Date(checkOutStr);
      this.checkOutDateTime = this.toDatetimeLocal(checkOutDate);
    }
    
    this.selectedGuestId = booking.guest_id || booking.guest_Id || booking.guestId || '';
    this.selectedRoomId = booking.room_id || booking.room_Id || booking.roomId || '';
    
    // ensure editable model has initial ids (used if user doesn't change)
    this.newBooking.guestId = this.selectedGuestId;
    this.newBooking.roomId = this.selectedRoomId;
    this.newBooking.specialRequests = booking.special_Requests || booking.special_requests || booking.specialRequests || '';

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
        this.guestSearchQuery = booking.full_name || booking.full_Name || booking.guestName || booking.guest_Name || '';
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
    if (!this.newBooking.roomId || !this.newBooking.roomId.trim()) {
      this.newBooking.roomId = this.selectedRoomId || this.selectedBooking?.room_Id || this.selectedBooking?.roomId || '';
    }
   
    const checkInDate = this.parseDateTimeLocal(this.checkInDateTime);
    const checkOutDate = this.parseDateTimeLocal(this.checkOutDateTime);

    if (checkOutDate <= checkInDate) {
      this.error = 'Check-out date must be after check-in date';
      return;
    }

    const bookingId = this.selectedBooking?.booking_id || this.selectedBooking?.booking_Id || this.selectedBooking?.bookingId;
    if (!bookingId) {
      this.error = 'Missing booking id';
      return;
    }

    const payload: any = {
      guestId: this.newBooking.guestId || this.selectedGuestId || null,
      roomId: this.newBooking.roomId || this.selectedRoomId || null,
      checkInDate: this.formatDateTimeFromDate(checkInDate),
      checkOutDate: this.formatDateTimeFromDate(checkOutDate),
      specialRequests: this.newBooking.specialRequests ?? null,
      status: this.selectedBooking?.status || null
    };

    this.apiService
      .putRaw<any>(`/bookings/${bookingId}`, payload)
      .then((resp) => {
        this.loadBookings();
        this.closeEditModal();
        alert(resp.message || 'Booking updated successfully');
      })
      .catch((err) => {
        console.error('Failed to update booking:', err);
        this.error = err.message || 'Failed to update booking';
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

  confirmBooking(bookingId: string): void {
    const id = bookingId || this.selectedBooking?.booking_id || this.selectedBooking?.booking_Id || this.selectedBooking?.bookingId;
    if (!id) {
      this.error = 'Missing booking id';
      return;
    }

    if (confirm('Are you sure you want to confirm this booking?')) {
      this.loading = true;

      this.apiService
        .putRaw<any>(`/bookings/${id}`, { status: 'Confirmed' })
        .then((resp) => {
          this.loadBookings();
          alert(resp.message || 'Booking confirmed successfully');
        })
        .catch((err) => {
          console.error('Failed to confirm booking:', err);
          if ((err as any)?.status === 409) {
            this.error = err.message || 'Room is already booked in selected time range';
          } else {
            this.error = err.message || 'Failed to confirm booking';
          }
        })
        .finally(() => {
          this.loading = false;
        });
    }
  }

  cancelBooking(bookingId: string): void {
    const id = bookingId || this.selectedBooking?.booking_id || this.selectedBooking?.booking_Id || this.selectedBooking?.bookingId;
    if (!id) {
      this.error = 'Missing booking id';
      return;
    }

    if (confirm('Are you sure you want to cancel this booking?')) {
      this.loading = true;

      this.apiService
        .putRaw<any>(`/bookings/${id}`, { status: 'Cancelled' })
        .then((resp) => {
          this.loadBookings();
          alert(resp.message || 'Booking cancelled successfully');
        })
        .catch((err) => {
          console.error('Failed to cancel booking:', err);
          this.error = err.message || 'Failed to cancel booking';
        })
        .finally(() => {
          this.loading = false;
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
    this.validateAndLoadAvailableRooms();
    this.updateComputedPrice();
  }

  onCheckOutDateTimeChange(value: string): void {
    this.checkOutDateTime = value;
    this.validateAndLoadAvailableRooms();
    this.updateComputedPrice();
  }

  validateAndLoadAvailableRooms(): void {
    this.error = null;

    if (!this.checkInDateTime || !this.checkOutDateTime) {
      return; // Not ready yet
    }

    const checkInDate = this.parseDateTimeLocal(this.checkInDateTime);
    const checkOutDate = this.parseDateTimeLocal(this.checkOutDateTime);

    // Validate dates
    if (isNaN(checkInDate.getTime()) || isNaN(checkOutDate.getTime())) {
      this.error = 'Invalid date/time format';
      return;
    }

    if (checkOutDate <= checkInDate) {
      this.error = 'Check-out date must be after check-in date';
      return;
    }

    // Check max 30 days
    const diffMs = checkOutDate.getTime() - checkInDate.getTime();
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    if (diffDays > 30) {
      this.error = 'Booking period cannot exceed 30 days';
      return;
    }

    // Auto load available rooms
    this.loadAvailableRoomsByDate();
  }

  // helper: pad2
  pad2(n: number | string): string {
    return String(n).padStart(2, '0');
  }

  private updateComputedPrice(): void {
    const checkIn = this.parseDateTimeLocal(this.checkInDateTime);
    const checkOut = this.parseDateTimeLocal(this.checkOutDateTime);
    if (isNaN(checkIn.getTime()) || isNaN(checkOut.getTime()) || checkOut <= checkIn) {
      this.computedTotalPrice = 0;
      return;
    }

    const diffHours = (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60);
    let pricePerHour = this.selectedRoomPricePerHour;
    if (!pricePerHour && this.selectedRoomId) {
      const room = this.rooms.find(r => r.room_Id === this.selectedRoomId || r.roomId === this.selectedRoomId);
      pricePerHour = Number(room?.price_Per_Hour || room?.pricePerHour || room?.price_per_hour || 0) || 0;
    }
    this.computedTotalPrice = diffHours * pricePerHour;
  }

  exportToExcel(): void {
    // Prepare data for export
    const exportData = this.bookings.map(booking => ({
      'Booking Reference': booking.booking_reference || '',
      'Room Number': booking.room_number || '',
      'Guest Name': booking.full_name || '',
      'Guest Phone': booking.phone || '',
      'Check In': booking.check_in_date ? new Date(booking.check_in_date).toLocaleString() : '',
      'Check Out': booking.check_out_date ? new Date(booking.check_out_date).toLocaleString() : '',
      'Total Price': booking.total_price || 0,
      'Status': booking.status || '',
      'Special Requests': booking.special_Requests || ''
    }));

    // Create worksheet
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportData);
    
    // Set column widths
    ws['!cols'] = [
      { wch: 20 }, // Booking Reference
      { wch: 12 }, // Room Number
      { wch: 25 }, // Guest Name
      { wch: 25 }, // Guest Phone
      { wch: 20 }, // Check In
      { wch: 20 }, // Check Out
      { wch: 12 }, // Total Price
      { wch: 15 }, // Status
      { wch: 30 }  // Special Requests
    ];

    // Create workbook
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Bookings');

    // Generate filename with current date and timestamp to avoid duplicates
    const date = new Date();
    const timestamp = `${date.getHours().toString().padStart(2, '0')}${date.getMinutes().toString().padStart(2, '0')}${date.getSeconds().toString().padStart(2, '0')}`;
    const filename = `Bookings_${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}_${timestamp}.xlsx`;

    // Save file
    XLSX.writeFile(wb, filename);
  }
}
