import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivityReport } from 'src/app/models/activity-report.model';
import { ActivityReportService } from 'src/app/services/mis/activity-report.service';
// import { ActivityReportService } from '../activity-report.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UserProfileService } from 'src/app/services/auth/user-profile.service';


@Component({
  selector: 'app-report-form',
  templateUrl: './report-form.component.html',
  styleUrls: ['./report-form.component.css']
})
export class ReportFormComponent implements OnInit {
  reportForm: FormGroup;
  isEditMode: boolean = false;
  @Input() report: ActivityReport | null = null;

  currentStep: number = 1;
  totalSteps: number = 4;
  user: any;
  submitted= false;
  constructor(private fb: FormBuilder,private userProfileService: UserProfileService, private reportService: ActivityReportService,private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {

    this.initForm();
  this.route.paramMap.subscribe(params => {
    const reportId = params.get('id');
    if (reportId) {
      this.isEditMode = true;
      this.loadReportData(reportId);
    }
  });
  this.populateStaffId();

  }

  populateStaffId() {
    this.userProfileService.user.subscribe(
      (userData) => {
        if (userData && userData.staffId) {
          this.user = userData;
          this.reportForm.patchValue({ reportFiledBy: userData.staffId });
        }
      },
      (error) => {
        console.error('Error fetching user profile:', error);
      }
    );

    if (!this.user) {
      this.userProfileService.getUserProfile();
    }
  }


  initForm() {
    this.reportForm = this.fb.group({
      reportFiledBy: ['', Validators.required],
      dateOfFiling: ['', Validators.required],
      activityTitle: ['', Validators.required],
      activityDate: ['', Validators.required],
      venue: ['', Validators.required],
      organisers: [''],
      targetParticipantsMales: [0, Validators.min(0)],
      targetParticipantsFemales: [0, Validators.min(0)],
      actualParticipantsMales: [0, Validators.min(0)],
      actualParticipantsFemales: [0, Validators.min(0)],
      facilitators: [''],
      specificGoal: [''],
      contribution: [''],
      activityNature: [''],
      inputsUsed: [''],
      indicators: [''],
      outputs: [''],
      outcomes: [''],
      findings: [''],
      recommendations: [''],
      additionalInfo: [''],
      photos: [null]  // For file upload, further handling will be needed
    });
  }

  loadReportData(id: string) {
    this.reportService.getReportById(id).subscribe((data: ActivityReport) => {
      this.reportForm.patchValue(data);
    });
  }

  onSubmit() {

    this.submitted=true;
    if (this.reportForm.valid) {
      if (this.isEditMode) {
        this.reportService.updateReport(this.report._id, this.reportForm.value).subscribe(response => {
          // Handle response, e.g., navigate back to the list
          this.router.navigate(['/view-reports']);
        });
      } else {
        this.reportService.addReport(this.reportForm.value).subscribe(response => {
          // Handle response
          this.router.navigate(['/view-reports']);
        });
      }
    }
  }


  prepareFormData(formValue: any) {
    const formData = new FormData();
    Object.keys(formValue).forEach(key => {
      if (key !== 'photos') {
        formData.append(key, formValue[key]);
      }
    });
    // Handle file input separately
    if (this.reportForm.get('photos').value) {
      formData.append('photos', this.reportForm.get('photos').value.files[0]);
    }
    return formData;
  }

  goToNextStep() {
    if (this.currentStep < this.totalSteps) {
      this.currentStep++;
    }
  }

  goToPreviousStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

}

