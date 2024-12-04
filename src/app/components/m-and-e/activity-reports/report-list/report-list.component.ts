import { Component, OnInit } from '@angular/core';
import { ActivityReport } from 'src/app/models/activity-report.model';
import { ActivityReportService } from 'src/app/services/mis/activity-report.service';

@Component({
  selector: 'app-report-list',
  templateUrl: './report-list.component.html',
  styleUrls: ['./report-list.component.css']
})
export class ReportListComponent {
  reports: ActivityReport[] = [];

  constructor(private reportService: ActivityReportService) {}

  ngOnInit(): void {
    this.reportService.getReports().subscribe((data: ActivityReport[]) => {
      this.reports = data;
    });
  }

  editReport(report: ActivityReport) {
    // Logic to handle editing.
    // This could involve navigating to a separate edit form
    // with the report data loaded for editing.
  }

  deleteReport(id: string) {
    if (confirm('Are you sure you want to delete this report?')) {
      this.reportService.deleteReport(id).subscribe(() => {
        this.reports = this.reports.filter(report => report._id !== id);
      });
    }
  }
}
