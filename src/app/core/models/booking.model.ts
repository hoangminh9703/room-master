export interface Booking {
  booking_id: string;
  booking_reference: string;
  guest_id: string;
  room_id: string;
  check_in_date: string;
  check_out_date: string;
  number_of_nights: number;
  total_price: number;
  deposit_paid: number;
  status: BookingStatus;
  special_requests?: string;
  created_at: string;
  updated_at: string;
}

export type BookingStatus = 'Pending' | 'Confirmed' | 'Checked_In' | 'Checked_Out' | 'Cancelled';

export interface CreateBookingRequest {
  guest_id: string;
  room_id: string;
  check_in_date: string;
  check_out_date: string;
  special_requests?: string;
}

export interface UpdateBookingRequest {
  bookingId: string;
  updates: Partial<Booking>;
}

export interface BookingSearchFilter {
  query?: string;
  status?: BookingStatus;
  startDate?: string;
  endDate?: string;
  guestId?: string;
  roomId?: string;
}

export interface BookingListResponse {
  bookings: Booking[];
  total: number;
  page: number;
  limit: number;
}
