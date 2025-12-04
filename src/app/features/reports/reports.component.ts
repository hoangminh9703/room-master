import { Component, OnInit } from '@angular/core';
import { IpcService } from '../../core/services/ipc.service';

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

  startDate = '';
  endDate = '';

  constructor(private ipcService: IpcService) {
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
        request = this.ipcService.invoke('report:revenue', data);
        break;
      case 'occupancy':
        request = this.ipcService.invoke('report:occupancy', data);
        break;
      case 'bookings':
        request = this.ipcService.invoke('report:bookings', { status: 'Checked_Out' });
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
    console.log('Exporting report:', this.reportType);
  }
}
