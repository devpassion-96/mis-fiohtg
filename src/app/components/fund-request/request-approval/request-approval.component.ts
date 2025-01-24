import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { RequestService } from 'src/app/services/hrm/request.service';
import { BudgetService } from 'src/app/services/project-management/budget.service';
import { Request } from 'src/app/models/request.model';
import { Budget } from 'src/app/models/project-management/budget.model';
import { Employee } from 'src/app/models/employee.model';
import { UserProfileService } from 'src/app/services/auth/user-profile.service';
import { EmployeeService } from 'src/app/services/hrm/employee.service';
import { Project } from 'src/app/models/project-management/project.model';
import { ProjectService } from 'src/app/services/project-management/project.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-request-approval',
  templateUrl: './request-approval.component.html',
  styleUrls: ['./request-approval.component.css']
})
export class RequestApprovalComponent implements OnInit {
  request: Request;
  budget: Budget;
  isLoading = true;

  commentForm: FormGroup;

  submitted = false;

  transactionDetails: any | null = null;

  user: any;
  employees: Employee[] = [];
  projects: Project[] = [];

  constructor(
    private requestService: RequestService,
    private budgetService: BudgetService,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private fb: FormBuilder,
    private userProfileService: UserProfileService,
    private employeeService: EmployeeService,
    private router: Router,
    private projectService: ProjectService
  ) {}

  ngOnInit() {

    this.commentForm = this.fb.group({
      comment: ['', Validators.required]
    });

    const requestId = this.route.snapshot.paramMap.get('id');
    if (requestId) {
      this.fetchRequestAndBudget(requestId);
      this.requestService.getRequestById(requestId).subscribe({
        next: (data) => {
          console.log("all the data: "+data.projectId)
          this.request = data;
          this.isLoading = false;
        },
        error: () => {
          this.toastr.error('Error loading request');
          this.isLoading = false;
        }
      });
    }



    this.populateStaffId();
    this.loadEmployees();
    this.loadProjects();
  }

  populateStaffId() {
    this.userProfileService.user.subscribe(
      (userData) => {
        if (userData && userData.staffId) {
          this.user = userData;
          console.log("populated staff id: ", this.user.staffId)
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

  loadEmployees() {
    this.employeeService.getAllEmployees().subscribe(data => {
      this.employees = data;
    });
  }

  loadProjects() {
    this.projectService.getAllProjectRecords().subscribe(data => {
      this.projects = data;
    });
  }

  getEmployeeNameById(id: string): string {
    const employee = this.employees.find(emp => emp.staffId === id);
    return employee ? `${employee.firstName} ${employee.lastName}` : 'Unknown';
  }



  // getProjectNameById(projectId: string) {
  //   const project = this.projects.find(prj => prj._id === projectId);
  //   return project ? project.name : 'Unknown';
  // }

  getProjectNameById(projectId: string): string {
  const project = this.projects.find((prj) => prj._id === projectId);
  if (!project) {
    console.error(`Project not found for ID: ${projectId}`);
  }
  return project ? project.name : 'Unknown';
}



  fetchRequestAndBudget(requestId: string) {
    this.requestService.getRequestById(requestId).subscribe({
      next: (data) => {
        this.request = data;
        this.fetchBudget(data.projectId); // Fetch budget for the project
      },
      error: () => {
        this.toastr.error('Error loading request');
        this.isLoading = false;
      }
    });
  }

  // fetchBudget(projectId: string) {
  //   // Directly use projectId without converting it to a string
  //   this.budgetService.getBudgetByProjectId(projectId).subscribe({
  //     next: (data) => {
  //       this.budget = data[0];
  //       this.isLoading = false;

  //       console.log('Fetched Budget:', data);
  //       console.log('Fetched Budget Amount:', this.budget.amount);
  //       console.log('Request Amount Requested:', this.request.amountRequested);
  //     },
  //     error: () => {
  //       this.toastr.error('Error loading budget');
  //       this.isLoading = false;
  //     }
  //   });
  // }

  // fetchBudget(projectId: string) {
  //   this.budgetService.getBudgetByProjectId(projectId).subscribe({
  //     next: (data) => {
  //       // Ensure the budget corresponds to the correct project ID
  //       const budget = data.find((b) => b.projectId === projectId);
  
  //       if (!budget) {
  //         this.toastr.error('No budget found for the selected project');
  //         return;
  //       }
  
  //       this.budget = budget;
  //       this.isLoading = false;
  
  //       console.log('Correct Budget:', this.budget); // Verify correct budget is selected
  //     },
  //     error: () => {
  //       this.toastr.error('Error loading budget');
  //       this.isLoading = false;
  //     },
  //   });
  // }

  fetchBudget(projectId: string) {
    this.budgetService.getBudgetByProjectId(projectId).subscribe({
      next: (data) => {
        // Ensure the budget corresponds to the correct project ID
        const budget = data.find((b) => b.projectId === projectId);
  
        if (!budget) {
          this.toastr.error(`Project not found for ID: ${projectId}`);
          console.error(`Project not found for ID: ${projectId}`);
          return;
        }
  
        this.budget = budget;
        this.isLoading = false;
  
        console.log('Correct Budget:', this.budget); // Log only when a valid budget is found
      },
      error: (err) => {
        this.toastr.error('Error loading budget');
        console.error('Error loading budget:', err); // Log error details for debugging
        this.isLoading = false;
      },
    });
  }
  
  
  
  
  

  addComment() {
    this.submitted = true;
  
    if (this.commentForm.valid) {
      const commentText = this.commentForm.get('comment').value;
      const newComment = {
        text: commentText,
        reviewedBy: this.user.staffId,
        reviewedAt: new Date() // Add the current date and time
      };
  
      // Initialize the comments array if it doesn't exist
      if (!this.request.comments) {
        this.request.comments = [];
      }
  
      this.request.comments.push(newComment);
  
      this.request.reviewedAt = new Date();
  
      this.requestService.updateRequestRecord(this.request._id, this.request).subscribe({
        next: () => {
          // Optionally show a success message
          this.toastr.success('Comment added successfully');
        },
        error: () => this.toastr.error('Error updating request')
      });
    }
  }
  

  approveRequest() {
    // Ensure the comment form is valid before proceeding
    if (this.commentForm.valid) {
      const commentText = this.commentForm.get('comment').value;
      const newComment = {
        text: commentText,
        reviewedBy: this.user.staffId,
        reviewedAt: new Date(), // Add the current date and time
      };
  
      // Initialize the comments array if it doesn't exist
      if (!this.request.comments) {
        this.request.comments = [];
      }
  
      // Add the comment
      this.request.comments.push(newComment);
    }
  
    // Set transaction details
    this.transactionDetails = {
      requestId: this.request._id,
      projectName: this.budget.projectId,
      amountApproved: this.request.amountRequested,
      approvedBy: this.user.staffId,
      date: new Date(),
    };
  
    // Update the budget and proceed with the approval
    this.updateBudget(this.request.projectId, this.request.amountRequested, () => {
      this.updateRequestStatus('Approved');
    });
  }
  

  rejectRequest() {
    this.updateRequestStatus('Rejected');
  }

  private updateRequestStatus(status: 'Approved' | 'Rejected') {
    const updatedRequest = {
      ...this.request,
      status: status,
      approvedOrRejectedAt: new Date(),
      approvedBy: this.user.staffId
    };

    this.requestService.updateRequestRecord(this.request._id.toString(), updatedRequest).subscribe({
      next: () => {
        this.toastr.success(`Request ${status.toLowerCase()}`);
        this.router.navigate(['/request-list']);
      },
      error: () => this.toastr.error(`Failed to ${status.toLowerCase()} request`)
    });
  }

  // private updateBudget(projectId: string, amount: number, onSuccess: () => void): void {
  //   // Fetch the budget for the project
  //   this.budgetService.getBudgetByProjectId(projectId).subscribe({
  //     next: (budgetArray) => {
  //       console.log('Fetched budget:', budgetArray); // Debugging log
  
  //       if (!budgetArray || budgetArray.length === 0) {
  //         this.toastr.error('No budget records found for this project');
  //         console.error('Empty budget array:', budgetArray); // Debugging log
  //         return;
  //       }
  
  //       const budget = budgetArray[0]; // Assume only one budget per project
  //       console.log('Selected budget:', budget); // Debugging log
  
  //       if (!budget) {
  //         this.toastr.error('Budget not found for this project');
  //         return;
  //       }
  
  //       // Calculate the new balance
  //       if (budget.balance >= amount) {
  //         const updatedBudget: Budget = {
  //           ...budget,
  //           balance: budget.balance - amount, // Deduct the amount
  //           amountUsed: budget.amountUsed + amount,
  //         };
  
  //         console.log('Updated budget payload:', updatedBudget); // Debugging log
  
  //         // Call the update API
  //         this.budgetService.updateBudgetRecord(budget._id, updatedBudget).subscribe({
  //           next: () => {
  //             this.toastr.success('Budget updated successfully');
  //             console.log('onSuccess callback executed');
  //             onSuccess(); // Execute success callback
  //           },
  //           error: (err) => {
  //             console.error('Error updating budget:', err); // Debugging log
  //             this.toastr.error('Error updating budget');
  //           },
  //         });
  //       } else {
  //         this.toastr.error('Insufficient budget for this project');
  //         console.log(`Budget balance: ${budget.balance}, Amount requested: ${amount}`); // Debugging log
  //       }
  //     },
  //     error: (err) => {
  //       console.error('Error fetching budget details:', err); // Debugging log
  //       this.toastr.error('Error fetching budget details');
  //     },
  //   });
  // }

  // private updateBudget(projectId: string, amount: number, onSuccess: () => void): void {
  //   // Fetch the budget for the project
  //   this.budgetService.getBudgetByProjectId(projectId).subscribe({
  //     next: (budgetArray) => {
  //       console.log('Fetched budget:', budgetArray); // Debugging log
  
  //       // Ensure the budget corresponds to the correct project ID
  //       const budget = budgetArray.find((b) => b.projectId === projectId);
  
  //       if (!budget) {
  //         this.toastr.error('No budget records found for this project');
  //         console.error('No matching budget found for projectId:', projectId); // Debugging log
  //         return;
  //       }
  
  //       console.log('Selected budget:', budget); // Debugging log
  
  //       // Calculate the new balance
  //       if (budget.balance >= amount) {
  //         const updatedBudget: Budget = {
  //           ...budget,
  //           balance: budget.balance - amount, // Deduct the amount
  //           amountUsed: budget.amountUsed + amount,
  //         };
  
  //         console.log('Updated budget payload:', updatedBudget); // Debugging log
  
  //         // Call the update API
  //         this.budgetService.updateBudgetRecord(budget._id, updatedBudget).subscribe({
  //           next: () => {
  //             this.toastr.success('Budget updated successfully');
  //             console.log('onSuccess callback executed');
  //             onSuccess(); // Execute success callback
  //           },
  //           error: (err) => {
  //             console.error('Error updating budget:', err); // Debugging log
  //             this.toastr.error('Error updating budget');
  //           },
  //         });
  //       } else {
  //         this.toastr.error('Insufficient budget for this project');
  //         console.log(`Budget balance: ${budget.balance}, Amount requested: ${amount}`); // Debugging log
  //       }
  //     },
  //     error: (err) => {
  //       console.error('Error fetching budget details:', err); // Debugging log
  //       this.toastr.error('Error fetching budget details');
  //     },
  //   });
  // }

  private updateBudget(projectId: string, amount: number, onSuccess: () => void): void {
    this.budgetService.getBudgetByProjectId(projectId).subscribe({
      next: (budgetArray) => {
        console.log('Fetched budget:', budgetArray); // Debugging log
  
        // Ensure the budget corresponds to the correct project ID
        const budget = budgetArray.find((b) => {
          const budgetProjectId = b.projectId; // No `_id`, as there's no `populate`
          return budgetProjectId === projectId;
        });
  
        if (!budget) {
          this.toastr.error('No budget records found for this project');
          console.error('No matching budget found for projectId:', projectId); // Debugging log
          return;
        }
  
        console.log('Selected budget:', budget); // Debugging log
  
        // Calculate the new balance
        if (budget.balance >= amount) {
          const updatedBudget: Budget = {
            ...budget,
            balance: budget.balance - amount, // Deduct the amount
            amountUsed: (budget.amountUsed || 0) + amount, // Handle undefined `amountUsed`
          };
  
          console.log('Updated budget payload:', updatedBudget); // Debugging log
  
          // Call the update API
          this.budgetService.updateBudgetRecord(budget._id, updatedBudget).subscribe({
            next: () => {
              this.toastr.success('Budget updated successfully');
              console.log('onSuccess callback executed');
              onSuccess(); // Execute success callback
            },
            error: (err) => {
              console.error('Error updating budget:', err); // Debugging log
              this.toastr.error('Error updating budget');
            },
          });
        } else {
          this.toastr.error('Insufficient budget for this project');
          console.log(`Budget balance: ${budget.balance}, Amount requested: ${amount}`); // Debugging log
        }
      },
      error: (err) => {
        console.error('Error fetching budget details:', err); // Debugging log
        this.toastr.error('Error fetching budget details');
      },
    });
  }
 

  approveWithComment() {
    this.submitted = true;
  
    if (this.commentForm.valid) {
      const commentText = this.commentForm.get('comment').value;
      const newComment = {
        text: commentText,
        reviewedBy: this.user.staffId,
        reviewedAt: new Date(),
      };
  
      // Add comment to the request
      this.request.comments.push(newComment);
  
      // Update the budget before approving the request
      this.updateBudget(this.request.projectId, this.request.amountRequested, () => {
        // Budget update succeeded, now approve the request
        this.request.status = 'Approved'; // Or the next status you want after approval
        this.request.reviewedAt = new Date();
  
        // Call the service to update the request record
        this.requestService.updateRequestRecord(this.request._id, this.request).subscribe({
          next: () => {
            this.toastr.success('Request approved with comment successfully');
            this.router.navigate(['/request-list']);
          },
          error: () => this.toastr.error('Error updating request'),
        });
      });
    }
  }
  
  
  


}
