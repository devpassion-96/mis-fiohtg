import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ReportService } from 'src/app/services/mis/report.service';
import { Report } from 'src/app/models/m-and-e/report.model';

@Component({
  selector: 'app-report-detail',
  templateUrl: './monthly-report-detail.component.html',
  styleUrls: ['./monthly-report-detail.component.css']
})
export class MonthlyReportDetailComponent implements OnInit {
  report: Report | undefined;

  constructor(
    private route: ActivatedRoute,
    private reportService: ReportService
  ) {}

  ngOnInit(): void {
    const reportId = this.route.snapshot.paramMap.get('id');
    if (reportId) {
      this.reportService.getReportById(reportId).subscribe((report) => (this.report = report));
    }
  }
}
