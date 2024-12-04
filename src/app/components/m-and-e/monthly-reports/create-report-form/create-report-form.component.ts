import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ReportService } from 'src/app/services/mis/report.service';
import { Report } from 'src/app/models/m-and-e/report.model';

@Component({
  selector: 'app-create-report-form',
  templateUrl: './create-report-form.component.html',
  styleUrls: ['./create-report-form.component.css']
})
export class CreateReportFormComponent implements OnInit {
  reportForm: FormGroup;
  months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  constructor(
    private fb: FormBuilder,
    private reportService: ReportService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.reportForm = this.fb.group({
      month: ['February', Validators.required],
      officeActivities: ['Office Activities', Validators.required],
      govNgoMeetings: ['Gov Meetings', Validators.required],
      workshopReports: this.fb.array([this.initWorkshopReportGroup()]), // Initialized as a FormArray
      officeActivityPlans: ['Office activity plans', Validators.required],
      otherActivityPlans: this.fb.array([this.initOtherActivitiesReportGroup()]), // Initialized as a FormArray
    });
  }

  ngOnInit(): void {
    const reportId = this.route.snapshot.paramMap.get('id');
    if (reportId) {
      this.reportService.getReportById(reportId).subscribe(report => this.populateForm(report));
    }
  }

  // Helper to initialize a single workshop report group
  initWorkshopReportGroup(): FormGroup {
    return this.fb.group({
      activityTitle: ['activityTitle'],
      community: ['community'],
      facilitator: ['facilitator'],
      date: [''],
      beneficiaries: this.fb.group({
        male: [3],
        female: [10],
        pwds: [30]
      }),
      budget: [70000],
      followUp: ['followUp'],
      projectOrDonor: ['projectOrDonor']
    });
  }

  // Helper to initialize a single other activity plan group
  initOtherActivitiesReportGroup(): FormGroup {
    return this.fb.group({
      oap_activityTitle: ['oap_activityTitle'],
      oap_community: ['oap_community'],
      oap_facilitator: ['oap_facilitator'],
      oap_date: [''],
      oap_beneficiaries: this.fb.group({
        oap_male: [5],
        oap_female: [10],
        oap_pwds: [20]
      }),
      oap_budget: [30000],
      oap_followUp: ['oap_followUp'],
      oap_projectOrDonor: ['oap_projectOrDonor']
    });
  }

  // Getters for the FormArray
  get workshopReports(): FormArray {
    return this.reportForm.get('workshopReports') as FormArray;
  }

  get otherActivityPlans(): FormArray {
    return this.reportForm.get('otherActivityPlans') as FormArray;
  }

  // Add a new workshop report
  addWorkshopReport(): void {
    this.workshopReports.push(this.initWorkshopReportGroup());
  }

  // Remove a workshop report
  removeWorkshopReport(index: number): void {
    this.workshopReports.removeAt(index);
  }

  // Add a new other activity plan
  addOtherActivityPlan(): void {
    this.otherActivityPlans.push(this.initOtherActivitiesReportGroup());
  }

  // Remove an other activity plan
  removeOtherActivityPlan(index: number): void {
    this.otherActivityPlans.removeAt(index);
  }

  onSubmit(): void {
    if (this.reportForm.valid) {
      const report = this.reportForm.value as Report;
      const reportId = this.route.snapshot.paramMap.get('id');
      if (reportId) {
        this.reportService.updateReport(reportId, report).subscribe(() => this.router.navigate(['/monthly-reports']));
      } else {
        this.reportService.createReport(report).subscribe(() => this.router.navigate(['/monthly-reports']));
      }
    }
  }

  // private populateForm(report: Report): void {
  //   // Patch values for simple fields
  //   this.reportForm.patchValue(report);

  //   // Populate workshopReports FormArray
  //   this.workshopReports.clear();
  //   report.workshopReports?.forEach(workshopReport => {
  //     this.workshopReports.push(this.fb.group(workshopReport));
  //   });

  //   // Populate otherActivityPlans FormArray
  //   this.otherActivityPlans.clear();
  //   report.otherActivityPlans?.forEach(activityPlan => {
  //     this.otherActivityPlans.push(this.fb.group(activityPlan));
  //   });
  // }

  private populateForm(report: Report): void {
    // Patch simple fields
    this.reportForm.patchValue({
      month: report.month,
      officeActivities: report.officeActivities,
      govNgoMeetings: report.govNgoMeetings,
      officeActivityPlans: report.officeActivityPlans
    });
  
    // Populate `workshopReports` FormArray
    this.workshopReports.clear(); // Clear existing items
    if (report.workshopReports) {
      report.workshopReports.forEach((workshopReport) => {
        this.workshopReports.push(this.fb.group({
          activityTitle: workshopReport.activityTitle,
          community: workshopReport.community,
          facilitator: workshopReport.facilitator,
          date: workshopReport.date,
          beneficiaries: this.fb.group({
            male: workshopReport.beneficiaries.male,
            female: workshopReport.beneficiaries.female,
            pwds: workshopReport.beneficiaries.pwds,
          }),
          budget: workshopReport.budget,
          followUp: workshopReport.followUp,
          projectOrDonor: workshopReport.projectOrDonor
        }));
      });
    }
  
    // Populate `otherActivityPlans` FormArray
    this.otherActivityPlans.clear(); // Clear existing items
    if (report.otherActivityPlans) {
      report.otherActivityPlans.forEach((activityPlan) => {
        this.otherActivityPlans.push(this.fb.group({
          oap_activityTitle: activityPlan.oap_activityTitle,
          oap_community: activityPlan.oap_community,
          oap_facilitator: activityPlan.oap_facilitator,
          oap_date: activityPlan.oap_date,
          oap_beneficiaries: this.fb.group({
            oap_male: activityPlan.oap_beneficiaries.oap_male,
            oap_female: activityPlan.oap_beneficiaries.oap_female,
            oap_pwds: activityPlan.oap_beneficiaries.oap_pwds,
          }),
          oap_budget: activityPlan.oap_budget,
          oap_followUp: activityPlan.oap_followUp,
          oap_projectOrDonor: activityPlan.oap_projectOrDonor
        }));
      });
    }
  }
  
}

