import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ProjectService } from 'src/app/services/project-management/project.service';
import { EmployeeService } from 'src/app/services/hrm/employee.service';
import { Project } from 'src/app/models/project-management/project.model';
import { Employee } from 'src/app/models/employee.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Comment } from 'src/app/models/project-management/project.model';
import { UserProfileService } from 'src/app/services/auth/user-profile.service';
import { forkJoin, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';


@Component({
  selector: 'app-projects-details',
  templateUrl: './projects-details.component.html',
  styleUrls: ['./projects-details.component.css']
})
export class ProjectsDetailsComponent implements OnInit {
  project: Project | null = null;
  commentForm: FormGroup;
  employees: Employee[] = [];
  teamMemberNames: string[] = []; // Add this property to hold team member names

  managerName: string = '';
  user: any;

  employeeMap: { [key: string]: Employee } = {};

  commentsPerPage = 7; // Number of comments per page
  currentPage = 1;

  constructor(
    private route: ActivatedRoute,
    private userProfileService: UserProfileService,
    private projectService: ProjectService,
    private employeeService: EmployeeService,
    private toastr: ToastrService,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.commentForm = this.fb.group({
      commentContent: ['', Validators.required]
    });

    this.route.paramMap.pipe(
      switchMap(params => {
        const projectId = params.get('id');
        if (projectId) {
          return forkJoin([
            this.employeeService.getAllEmployees(),
            this.projectService.getProjectById(projectId)
          ]);
        } else {
          return forkJoin([
            this.employeeService.getAllEmployees(),
            of(null) // Return a null observable if there's no project ID
          ]);
        }
      })
    ).subscribe({
      next: ([employees, project]) => {
        this.employees = employees;
        this.employeeMap = {};
        for (const employee of employees) {
          this.employeeMap[employee.staffId] = employee;
        }

        if (project) {
          if (!project.comments) {
            project.comments = [];
          }
          this.project = project;
          this.setTeamMemberNames(project.teamMembers);
          this.setManagerName(project.managerId);

          if (project.activities) {
            project.activities.forEach(activity => {
              activity.responsiblePersonName = this.getEmployeeNameByStaffId(activity.responsiblePerson);
            });
          }
        }
      },
      error: () => {
        this.toastr.error('Error fetching project details or employees');
      }
    });

    this.populateStaffId();
  }


  populateStaffId() {
    this.userProfileService.user.subscribe(
      (userData) => {
        if (userData && userData.staffId) {
          this.user = userData;
          this.commentForm.patchValue({ staffId: userData.staffId });
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

  // loadAllEmployees() {
  //   this.employeeService.getAllEmployees().subscribe({
  //     next: (employees) => {
  //       this.employees = employees;
  //     },
  //     error: () => {
  //       this.toastr.error('Error fetching employees');
  //     }
  //   });
  // }

  loadAllEmployees() {
    this.employeeService.getAllEmployees().subscribe({
      next: (employees) => {
        this.employees = employees;
        // Populate the employeeMap
        this.employeeMap = {};
        for (const employee of employees) {
          this.employeeMap[employee.staffId] = employee;
        }
      },
      error: () => {
        this.toastr.error('Error fetching employees');
      }
    });
  }

  loadProjectDetails(id: string) {
    this.projectService.getProjectById(id).subscribe({
      next: (project) => {
        if (!project.comments) {
          project.comments = [];
        }
        this.project = project;
        this.setTeamMemberNames(project.teamMembers);
        this.setManagerName(project.managerId);

        if (project.activities) {
          project.activities.forEach(activity => {
            activity.responsiblePersonName = this.getEmployeeNameByStaffId(activity.responsiblePerson);
          });
        }
      },
      error: () => this.toastr.error('Error fetching project details')
    });
  }


  setTeamMemberNames(teamMemberIds: string[]) {
    this.teamMemberNames = teamMemberIds.map(id => this.getEmployeeNameByStaffId(id));
  }

setManagerName(managerId: string) {
    this.managerName = this.getEmployeeNameByStaffId(managerId);
  }


getEmployeeNameByStaffId(staffId: string): string {
    const employee = this.employeeMap[staffId];
    return employee ? `${employee.firstName} ${employee.lastName}` : 'Unknown';
  }


  // addComment() {

  //   if (this.commentForm.valid && this.project) {
  //     const newComment: Comment = {
  //       content: this.commentForm.value.commentContent,
  //       staffId:this.user.staffId,
  //       timestamp: new Date()
  //     };

  //     if (this.project.comments) {
  //       this.project.comments.push(newComment);

  //       // Update the project in the backend
  //       this.projectService.updateProjectRecord(this.project._id, this.project).subscribe({
  //         next: () => this.toastr.success('Comment added successfully!'),
  //         error: () => this.toastr.error('Failed to add comment')
  //       });

  //       this.commentForm.reset();
  //     }
  //   }
  // }

  addComment() {
    if (this.commentForm.valid && this.project) {
      const newComment: Comment = {
        content: this.commentForm.value.commentContent,
        staffId: this.user.staffId,
        timestamp: new Date()
      };

      if (this.project.comments) {
        this.project.comments.push(newComment);
        this.project.comments.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

        this.projectService.updateProjectRecord(this.project._id, this.project).subscribe({
          next: () => this.toastr.success('Comment added successfully!'),
          error: () => this.toastr.error('Failed to add comment')
        });

        this.commentForm.reset();
      }
    }
  }

  get paginatedComments() {
    const startIndex = (this.currentPage - 1) * this.commentsPerPage;
    return this.project?.comments.slice(startIndex, startIndex + this.commentsPerPage) || [];
  }
  getTotalPages(): number {
    return Math.ceil((this.project?.comments.length || 0) / this.commentsPerPage);
  }


  goToNextPage() {
    if (this.currentPage < Math.ceil((this.project?.comments.length || 0) / this.commentsPerPage)) {
      this.currentPage++;
    }
  }

  goToPreviousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }


}
