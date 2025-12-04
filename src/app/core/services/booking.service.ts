import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IpcService } from './ipc.service';
import { Booking, CreateBookingRequest, BookingSearchFilter, BookingListResponse } from '../models';

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  constructor(private ipcService: IpcService) {}

  createBooking(request: CreateBookingRequest): Observable<Booking> {
    return new Observable(observer => {
      this.ipcService.invoke<Booking>('booking:create', request)
        .then(booking => {
          observer.next(booking);
          observer.complete();
        })
        .catch(error => observer.error(error));
    });
  }

  searchBookings(filters: BookingSearchFilter): Observable<BookingListResponse> {
    return new Observable(observer => {
      this.ipcService.invoke<BookingListResponse>('booking:search', filters)
        .then(response => {
          observer.next(response);
          observer.complete();
        })
        .catch(error => observer.error(error));
    });
  }

  getBookingById(bookingId: string): Observable<Booking> {
    return new Observable(observer => {
      this.ipcService.invoke<Booking>('booking:get-by-id', { bookingId })
        .then(booking => {
          observer.next(booking);
          observer.complete();
        })
        .catch(error => observer.error(error));
    });
  }

  updateBooking(bookingId: string, updates: Partial<Booking>): Observable<Booking> {
    return new Observable(observer => {
      this.ipcService.invoke<Booking>('booking:update', { bookingId, updates })
        .then(booking => {
          observer.next(booking);
          observer.complete();
        })
        .catch(error => observer.error(error));
    });
  }

  cancelBooking(bookingId: string, reason?: string): Observable<{ success: boolean; refundAmount: number }> {
    return new Observable(observer => {
      this.ipcService.invoke<any>('booking:cancel', { bookingId, reason })
        .then(response => {
          observer.next(response);
          observer.complete();
        })
        .catch(error => observer.error(error));
    });
  }

  checkAvailability(roomId: string, checkInDate: string, checkOutDate: string): Observable<boolean> {
    return new Observable(observer => {
      this.ipcService.invoke<{ available: boolean }>('booking:check-availability', {
        roomId,
        checkInDate,
        checkOutDate
      })
        .then(response => {
          observer.next(response.available);
          observer.complete();
        })
        .catch(error => observer.error(error));
    });
  }
}
