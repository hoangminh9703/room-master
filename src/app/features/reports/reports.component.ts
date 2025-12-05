import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../core/services/api.service';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit {
  reportType = 'revenue';
  loading = false;
  error: string | null = null;
  reportData: any = null;
  exportFormat = 'csv';

  startDate = '';
  endDate = '';

  constructor(private apiService: ApiService) {
    const today = new Date();
    const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());
    this.startDate = lastMonth.toISOString().split('T')[0];
    this.endDate = today.toISOString().split('T')[0];
  }

  ngOnInit(): void {
    this.generateReport();
  }

  generateReport(): void {
    this.loading = true;
    this.error = null;
    this.reportData = null;

    const data = {
      startDate: this.startDate,
      endDate: this.endDate
    };

    let request: Promise<any>;
    switch (this.reportType) {
      case 'revenue':
        request = this.apiService.invoke('report:revenue', data);
        break;
      case 'occupancy':
        request = this.apiService.invoke('report:occupancy', data);
        break;
      case 'bookings':
        request = this.apiService.invoke('report:bookings', { status: 'Checked_Out' });
        break;
      default:
        request = Promise.reject('Invalid report type');
    }

    request
      .then((response) => {
        this.reportData = response;
        this.loading = false;
      })
      .catch((err) => {
        console.error('Failed to generate report:', err);
        this.error = 'Failed to generate report';
        this.loading = false;
      });
  }

  exportReport(): void {
    if (!this.reportData) return;

    if (this.exportFormat === 'csv') {
      this.exportAsCSV();
    } else if (this.exportFormat === 'pdf') {
      this.exportAsPDF();
    }
  }

  exportAsCSV(): void {
    let csv = '';

    if (this.reportType === 'revenue') {
      csv = 'Date,Revenue,Bookings\n';
      if (this.reportData.revenue) {
        this.reportData.revenue.forEach((item: any) => {
          csv += `${item.date || ''},${item.revenue || 0},${item.bookings || 0}\n`;
        });
      }
    } else if (this.reportType === 'occupancy') {
      csv = 'Date,Occupancy Rate,Occupied Rooms,Total Rooms\n';
      csv += `${this.startDate},${this.reportData.occupancyRate || 0}%,${this.reportData.occupiedRooms || 0},${this.reportData.totalRooms || 0}\n`;
    } else if (this.reportType === 'bookings') {
      csv = 'Booking Reference,Nights,Total Price\n';
      if (this.reportData.bookings) {
        this.reportData.bookings.forEach((booking: any) => {
          csv += `${booking.booking_reference || ''},${booking.number_of_nights || 0},${booking.total_price || 0}\n`;
        });
      }
    }

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${this.reportType}-report-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  exportAsPDF(): void {
    alert(`PDF export for ${this.reportType} report is not yet implemented`);
  }

  getDaysInRange(): number {
    if (!this.startDate || !this.endDate) return 0;
    const start = new Date(this.startDate);
    const end = new Date(this.endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  }

  getTotalBookingsRevenue(): number {
    if (!this.reportData || !this.reportData.bookings) return 0;
    return this.reportData.bookings.reduce((sum: number, booking: any) => sum + (booking.total_price || 0), 0);
  }
}
