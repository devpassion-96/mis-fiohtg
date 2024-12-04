import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ActivityReport } from 'src/app/models/activity-report.model';
import { ActivityReportService } from 'src/app/services/mis/activity-report.service';

@Component({
  selector: 'app-report-detail',
  templateUrl: './report-detail.component.html',
  styleUrls: ['./report-detail.component.css']
})
export class ReportDetailComponent {
  report: ActivityReport;
  id: string;

  constructor(private reportService: ActivityReportService, private route: ActivatedRoute) {}

ngOnInit(): void {
  this.route.paramMap.subscribe(params => {
    this.id = params.get('id');
    this.loadReportDetails(this.id);
  });
}

loadReportDetails(id: string) {
  this.reportService.getReportById(id).subscribe((data: ActivityReport) => {
    this.report = data;
  });
}



}
