import { Injectable } from '@angular/core';
import { Room, Booking, Guest } from '../models';

@Injectable({
  providedIn: 'root'
})
export class MockDataService {
  
  getMockRooms(): Room[] {
    return [
      {
        room_id: 'ROOM-001',
        room_number: '101',
        room_type_id: 'TYPE-01',
        floor: 1,
        capacity: 1,
        status: 'Available',
        features: { ac: true, tv: true, wifi: true },
        price_per_night: 50,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        room_id: 'ROOM-002',
        room_number: '102',
        room_type_id: 'TYPE-01',
        floor: 1,
        capacity: 1,
        status: 'Available',
        features: { ac: true, tv: true, wifi: true },
        price_per_night: 50,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        room_id: 'ROOM-003',
        room_number: '103',
        room_type_id: 'TYPE-01',
        floor: 1,
        capacity: 1,
        status: 'Available',
        features: { ac: true, tv: true, wifi: true },
        price_per_night: 50,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        room_id: 'ROOM-004',
        room_number: '104',
        room_type_id: 'TYPE-01',
        floor: 1,
        capacity: 1,
        status: 'Cleaning',
        features: { ac: true, tv: true, wifi: true },
        price_per_night: 50,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        room_id: 'ROOM-005',
        room_number: '105',
        room_type_id: 'TYPE-01',
        floor: 1,
        capacity: 1,
        status: 'Available',
        features: { ac: true, tv: true, wifi: true },
        price_per_night: 50,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        room_id: 'ROOM-006',
        room_number: '201',
        room_type_id: 'TYPE-02',
        floor: 2,
        capacity: 2,
        status: 'Occupied',
        features: { ac: true, tv: true, wifi: true, minibar: true },
        price_per_night: 80,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        room_id: 'ROOM-007',
        room_number: '202',
        room_type_id: 'TYPE-02',
        floor: 2,
        capacity: 2,
        status: 'Available',
        features: { ac: true, tv: true, wifi: true, minibar: true },
        price_per_night: 80,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        room_id: 'ROOM-008',
        room_number: '203',
        room_type_id: 'TYPE-02',
        floor: 2,
        capacity: 2,
        status: 'Available',
        features: { ac: true, tv: true, wifi: true, minibar: true },
        price_per_night: 80,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        room_id: 'ROOM-009',
        room_number: '204',
        room_type_id: 'TYPE-02',
        floor: 2,
        capacity: 2,
        status: 'Available',
        features: { ac: true, tv: true, wifi: true, minibar: true },
        price_per_night: 80,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        room_id: 'ROOM-010',
        room_number: '205',
        room_type_id: 'TYPE-02',
        floor: 2,
        capacity: 2,
        status: 'Available',
        features: { ac: true, tv: true, wifi: true, minibar: true },
        price_per_night: 80,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ];
  }

  getMockBookings(): Booking[] {
    const now = new Date();
    const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    const tomorrowDate = tomorrow.toISOString().split('T')[0];
    const nextWeekDate = nextWeek.toISOString().split('T')[0];
    
    return [
      {
        booking_id: 'BK-001',
        booking_reference: 'REF-001',
        guest_id: 'GUEST-001',
        room_id: 'ROOM-006',
        check_in_date: tomorrowDate,
        check_out_date: nextWeekDate,
        number_of_nights: 7,
        total_price: 560,
        deposit_paid: 100,
        status: 'Confirmed',
        special_requests: 'High floor preferred',
        created_at: now.toISOString(),
        updated_at: now.toISOString()
      },
      {
        booking_id: 'BK-002',
        booking_reference: 'REF-002',
        guest_id: 'GUEST-002',
        room_id: 'ROOM-002',
        check_in_date: tomorrowDate,
        check_out_date: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        number_of_nights: 3,
        total_price: 150,
        deposit_paid: 50,
        status: 'Confirmed',
        special_requests: '',
        created_at: now.toISOString(),
        updated_at: now.toISOString()
      },
      {
        booking_id: 'BK-003',
        booking_reference: 'REF-003',
        guest_id: 'GUEST-003',
        room_id: 'ROOM-008',
        check_in_date: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        check_out_date: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        number_of_nights: 2,
        total_price: 160,
        deposit_paid: 50,
        status: 'Pending',
        special_requests: '',
        created_at: now.toISOString(),
        updated_at: now.toISOString()
      }
    ];
  }

  getMockGuests(): Guest[] {
    const now = new Date().toISOString();
    return [
      {
        guest_id: 'GUEST-001',
        full_name: 'John Doe',
        email: 'john.doe@example.com',
        phone: '+1-555-0101',
        id_type: 'Passport',
        id_number: 'P123456789',
        nationality: 'USA',
        date_of_birth: '1980-01-15',
        created_at: now,
        updated_at: now
      },
      {
        guest_id: 'GUEST-002',
        full_name: 'Jane Smith',
        email: 'jane.smith@example.com',
        phone: '+1-555-0102',
        id_type: 'Passport',
        id_number: 'P987654321',
        nationality: 'USA',
        date_of_birth: '1985-05-20',
        created_at: now,
        updated_at: now
      },
      {
        guest_id: 'GUEST-003',
        full_name: 'Bob Johnson',
        email: 'bob.johnson@example.com',
        phone: '+1-555-0103',
        id_type: 'Driver_License',
        id_number: 'DL123456',
        nationality: 'USA',
        date_of_birth: '1990-12-10',
        created_at: now,
        updated_at: now
      }
    ];
  }

  transformBackendRoom(data: any): Room {
    const isValidDate = (dateStr: string): boolean => {
      if (!dateStr || dateStr === '0001-01-01T00:00:00') {
        return false;
      }
      return !isNaN(new Date(dateStr).getTime());
    };

    const now = new Date().toISOString();
    
    return {
      room_id: data.roomId || `ROOM-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      room_number: data.roomNumber || `R${Math.floor(Math.random() * 1000)}`,
      room_type_id: data.roomTypeId || 'TYPE-DEFAULT',
      floor: data.floor || 1,
      capacity: data.capacity || 1,
      status: data.status || 'Available',
      features: this.parseFeatures(data.features),
      price_per_night: data.pricePerNight || 0,
      created_at: isValidDate(data.createdAt) ? data.createdAt : now,
      updated_at: isValidDate(data.updatedAt) ? data.updatedAt : now
    };
  }

  transformBackendBooking(data: any): Booking {
    const isValidDate = (dateStr: string): boolean => {
      if (!dateStr || dateStr === '0001-01-01T00:00:00') {
        return false;
      }
      return !isNaN(new Date(dateStr).getTime());
    };

    const now = new Date().toISOString();
    const checkInDate = isValidDate(data.checkInDate) 
      ? data.checkInDate.split('T')[0] 
      : now.split('T')[0];
    const checkOutDate = isValidDate(data.checkOutDate) 
      ? data.checkOutDate.split('T')[0] 
      : now.split('T')[0];

    return {
      booking_id: data.bookingId || `BK-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      booking_reference: data.bookingReference || 'N/A',
      guest_id: data.guestId || 'UNKNOWN',
      room_id: data.roomId || 'UNKNOWN',
      check_in_date: checkInDate,
      check_out_date: checkOutDate,
      number_of_nights: data.numberOfNights || 1,
      total_price: data.totalPrice || 0,
      deposit_paid: data.depositPaid || 0,
      status: data.status || 'Pending',
      special_requests: data.specialRequests || '',
      created_at: isValidDate(data.createdAt) ? data.createdAt : now,
      updated_at: isValidDate(data.updatedAt) ? data.updatedAt : now
    };
  }

  private parseFeatures(features: any): Record<string, boolean> {
    if (!features) return {};
    if (typeof features === 'string') {
      try {
        return JSON.parse(features);
      } catch {
        return {};
      }
    }
    return features;
  }
}
