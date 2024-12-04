import { Component, OnInit } from '@angular/core';
import { ReportService } from 'src/app/services/mis/report.service';

import { Report } from 'src/app/models/m-and-e/report.model';

@Component({
  selector: 'app-list-report',
  templateUrl: './list-report.component.html',
  styleUrls: ['./list-report.component.css']
})
export class ListReportComponent implements OnInit {
  reports: Report[] = [];

  constructor(private reportService: ReportService) {}

  ngOnInit(): void {
    this.fetchReports();
  }

  fetchReports(): void {
    this.reportService.getReports().subscribe((reports) => (this.reports = reports));
  }

  deleteReport(id: string): void {
    if (confirm('Are you sure you want to delete this report?')) {
      this.reportService.deleteReport(id).subscribe(() => this.fetchReports());
    }
  }
}
