import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ProjectService } from 'src/app/services/project-management/project.service';
import { Project } from 'src/app/models/project-management/project.model';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-projects-list',
  templateUrl: './projects-list.component.html',
  styleUrls: ['./projects-list.component.css']
})
export class ProjectsListComponent implements OnInit {
  projects: Project[] = [];

  filteredProjects: Project[] = [];
  selectedStatus: string = 'All';
  statuses: string[] = ['All', 'Not Started', 'In Progress', 'Completed'];

  currentPage: number = 1;
  itemsPerPage: number = 16;

  userRole: string; // To store the role of the logged-in user
  
  userDepartment: string;
  userStaffId: string;

  constructor(
    private projectService: ProjectService,private authService: AuthService,
    private toastr: ToastrService, private router: Router
  ) {}

  ngOnInit() {
    this.loadProjects();
    this.loadUserRole();
  }

  loadUserRole() {
    const userData = this.authService.getCurrentUserData();
    if (userData) {
      this.userRole = userData.role; // Role of the user
      this.userDepartment = userData.department; // Department for managers
      this.userStaffId = userData.staffId; // Staff ID for employees
    } else {
      this.userRole = 'Employee';
    }
  }

  loadProjects() {
    this.projectService.getAllProjectRecords().subscribe({
      next: (data) => {
        this.projects = data;
        this.filterProjects();
      },
      error: (err) => {
        this.toastr.error('Error loading projects');
      }
    });
  }

  viewProject(_id: string) {
    this.router.navigate(['/project-detail', _id]); // Adjust the route as per your routing configuration
  }

  editProject(_id: string) {
    this.router.navigate(['/project-form', _id]); // Adjust the route as per your routing configuration
  }

  deleteProject(id: string) {
    if (confirm('Are you sure you want to delete this project?')) {
      this.projectService.deleteProjectRecord(id).subscribe({
        next: () => {
          this.toastr.error('Project deleted successfully');
          this.loadProjects(); // Reload projects to reflect the deletion
        },
        error: () => {
          this.toastr.error('Error deleting project');
        }
      });
    }
  }

  filterProjects(): void {
    if (this.selectedStatus === 'All') {
        this.filteredProjects = this.projects;  // Show all projects if 'All' is selected
    } else {
        this.filteredProjects = this.projects.filter(project => project.status === this.selectedStatus);
    }
  }
}
