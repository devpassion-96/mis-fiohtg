import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { RequestService } from 'src/app/services/hrm/request.service';
import { Request } from 'src/app/models/request.model';
import { Employee } from 'src/app/models/employee.model';
import { Project } from 'src/app/models/project-management/project.model';
import { EmployeeService } from 'src/app/services/hrm/employee.service';
import { ProjectService } from 'src/app/services/project-management/project.service';
import { UserProfileService } from 'src/app/services/auth/user-profile.service';

@Component({
  selector: 'app-request-review',
  templateUrl: './request-review.component.html',
  styleUrls: ['./request-review.component.css']
})
export class RequestReviewComponent implements OnInit {
  request: Request;
  commentForm: FormGroup;
  isLoading = true;

  employees: Employee[] = [];
  projects: Project[] = [];
  user: any;

  submitted = false;

  constructor(
    private requestService: RequestService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private router: Router,
    private employeeService: EmployeeService,
    private projectService: ProjectService,
    private userProfileService: UserProfileService,
  ) {}

  ngOnInit() {
    this.commentForm = this.fb.group({
      comment: ['', Validators.required]
    });

    const requestId = this.route.snapshot.paramMap.get('id');
    if (requestId) {
      this.requestService.getRequestById(requestId).subscribe({
        next: (data) => {
          this.request = data;
          console.log('Current Status:', this.request.status);
          this.isLoading = false;
        },
        error: () => {
          this.toastr.error('Error loading request');
          this.isLoading = false;
        }
      });
    }

    this.loadEmployees();
    this.loadProjects();
    this.populateStaffId();
  }

  populateStaffId() {
    this.userProfileService.user.subscribe(
      (userData) => {
        if (userData && userData.staffId) {
          this.user = userData;
          this.commentForm.patchValue({ reviewedBy: userData.staffId });
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



  getProjectNameById(projectId: string) {
    const project = this.projects.find(prj => prj._id === projectId);
    return project ? project.name : 'Unknown';
  }


  addComment() {
    this.submitted = true;
    if (this.commentForm.valid) {
      const commentText = this.commentForm.get('comment').value;
    const newComment = {
      text: commentText,
      reviewedBy:this.user.staffId,
      reviewedAt: new Date(), // Add the current date and time
    };
    this.request.comments.push(newComment);
      // Update the status based on the current status
      console.log('Current Status:', this.request.status);
      switch (this.request.status) {
        case 'Pending':
          this.request.status = 'ManagerReview';
          break;
        case 'ManagerReview':
          this.request.status = 'M&EReview';
          break;
        case 'M&EReview':
          this.request.status = 'Reviewed'; // Ready for Director Decision
          break;
      }
      this.request.reviewedAt = new Date();

      this.requestService.updateRequestRecord(this.request._id, this.request).subscribe({
        next: () => {
          this.toastr.success('Request reviewed successfully');
          this.router.navigate(['/request-list']);
        },
        error: () => this.toastr.error('Error updating request')
      });
    }
  }
}
