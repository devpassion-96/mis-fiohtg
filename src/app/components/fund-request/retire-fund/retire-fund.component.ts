import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Budget } from 'src/app/models/project-management/budget.model';
import { Project } from 'src/app/models/project-management/project.model';
import { RetireFund } from 'src/app/models/retire-fund.model';
import { UserProfileService } from 'src/app/services/auth/user-profile.service';
import { BudgetService } from 'src/app/services/project-management/budget.service';
import { ProjectService } from 'src/app/services/project-management/project.service';
import { RetireFundService } from 'src/app/services/project-management/retire-fund.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-retire-fund',
  templateUrl: './retire-fund.component.html',
  styleUrls: ['./retire-fund.component.css']
})
export class RetireFundComponent implements OnInit {
  retireFundForm: FormGroup;
  budgets: Budget[] = [];
  project: Project[] = [];
  selectedBudget: Budget | null = null;

  user: any;
  submitted = false;
  filePreviews: SafeUrl[] = []; // To store image previews

  constructor(
    private budgetService: BudgetService,
    private retireFundService: RetireFundService,
    private toastr: ToastrService,
    private router: Router,
    private userProfileService: UserProfileService,
    private projectService: ProjectService,
    private sanitizer: DomSanitizer // Sanitize URLs
  ) {}

  ngOnInit(): void {
    this.budgetService.getAllBudgetRecords().subscribe(data => {
      this.budgets = data;
    });

    this.projectService.getAllProjectRecords().subscribe(data => {
      this.project = data;
    });

    this.retireFundForm = new FormGroup({
      projectId: new FormControl('', Validators.required),
      amount: new FormControl(null, [Validators.required, Validators.min(1)]),
      staffId: new FormControl(''),
      date: new FormControl(''),
      documents: new FormControl(null)
    });

    // Listen for changes on the projectId control and update the selected budget
    this.retireFundForm.get('projectId').valueChanges.subscribe(projectId => {
      this.budgetService.getBudgetByProjectId(projectId).subscribe({
        next: (budgets) => {
          this.selectedBudget = budgets.length > 0 ? budgets[0] : null;
        },
        error: () => this.toastr.error('Error fetching budget for selected project')
      });
    });

    this.populateStaffId();
  }

  populateStaffId() {
    this.userProfileService.user.subscribe(
      (userData) => {
        if (userData && userData.staffId) {
          this.user = userData;

          console.log("shsjsjsjsj: "+ userData.staffId)
          this.retireFundForm.patchValue({ staffId: userData.staffId });
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

  getProjectNameByProjectId(projectId: string) {
    const project = this.project.find(prj => prj._id === projectId);
    return project ? project.name : 'Unknown';
  }

  onFileSelected(event: any): void {
    const files: FileList = event.target.files;
    this.retireFundForm.patchValue({ documents: files });
    this.filePreviews = []; // Reset previews on new file selection
    Array.from(files).forEach(file => {
      if (file.type.startsWith('image/')) {
        const url = this.sanitizer.bypassSecurityTrustUrl(window.URL.createObjectURL(file));
        this.filePreviews.push(url);
      }
    });
  }

  onSubmit() {
    this.submitted = true;
    if (this.retireFundForm.valid && this.selectedBudget) {
      const formValues = this.retireFundForm.value;
      const newBalance = this.selectedBudget.balance + formValues.amount;

      // Check if the new balance exceeds the project amount
      if (newBalance > this.selectedBudget.amount) {
        this.toastr.error('New balance cannot exceed the total project amount');
        return; // Exit the function to prevent further processing
      }

      // Prepare FormData to send files and data
      const formData = new FormData();
      formData.append('projectId', formValues.projectId);
      formData.append('amount', formValues.amount.toString());
      formData.append('staffId', formValues.staffId); // Utilizing form's staffId populated during form initialization or user profile loading
      formData.append('date', new Date().toISOString()); // Convert the date to ISO string for backend compatibility

      if (formValues.documents) {
        // Append each file to the formData
        for (let i = 0; i < formValues.documents.length; i++) {
          formData.append('documents', formValues.documents[i], formValues.documents[i].name);
        }
      }

      // Update the budget record first
      this.budgetService.updateBudgetRecord(this.selectedBudget._id, { ...this.selectedBudget, balance: newBalance }).subscribe({
        next: () => {
          // Then, submit the retire fund request with document uploads
          this.retireFundService.addRetireFundRecord(formData).subscribe({
            next: () => {
              this.toastr.success('Retire fund action submitted successfully');
              this.router.navigate(['/retire-fund-list']);
            },
            error: (error) => {
              console.error('Failed to record retire fund action', error);
              this.toastr.error('Failed to record retire fund action');
            }
          });
        },
        error: (error) => {
          console.error('Error updating budget', error);
          this.toastr.error('Error updating budget');
        }
      });
    } else {
      this.toastr.error('Please fill all required fields or select a valid project');
    }
  }


  // onSubmit() {
  //   this.submitted = true;
  //   if (this.retireFundForm.valid && this.selectedBudget) {
  //     const formValues = this.retireFundForm.value;
  //     const newBalance = this.selectedBudget.balance + formValues.amount;

  //         // Check if new balance exceeds the project amount
  //   if (newBalance > this.selectedBudget.amount) {
  //     this.toastr.error('New balance cannot exceed the total project amount');
  //     return; // Exit the function to prevent further processing
  //   }

  //     const updatedBudget: Budget = {
  //       ...this.selectedBudget,
  //       balance: newBalance
  //     };

  //     this.budgetService.updateBudgetRecord(this.selectedBudget._id, updatedBudget).subscribe({
  //       next: () => {
  //         const retireFundData: RetireFund = {
  //           ...formValues,
  //           projectId: this.selectedBudget.projectId,
  //           staffId: this.user.staffId, // Replace with actual staff ID
  //           date: new Date() // Captures the current date and time
  //         };

  //         this.retireFundService.addRetireFundRecord(retireFundData).subscribe({
  //           next: () => {
  //             this.toastr.success('Retire fund action submitted successfully');
  //             this.router.navigate(['/retire-fund-list']);
  //           },
  //           error: () => this.toastr.error('Failed to record retire fund action')
  //         });
  //       },
  //       error: () => this.toastr.error('Error updating budget')
  //     });
  //   } else {
  //     this.toastr.error('Please fill all required fields or select a valid project');
  //   }
  // }
}
