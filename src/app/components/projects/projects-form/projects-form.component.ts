import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray,AbstractControl, ValidationErrors, ValidatorFn} from '@angular/forms';

import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Employee } from 'src/app/models/employee.model';
import { Project } from 'src/app/models/project-management/project.model';
import { EmployeeService } from 'src/app/services/hrm/employee.service';
import { ProjectService } from 'src/app/services/project-management/project.service';

@Component({
  selector: 'app-projects-form',
  templateUrl: './projects-form.component.html',
  styleUrls: ['./projects-form.component.css']
})
export class ProjectsFormComponent implements OnInit {
  projectForm: FormGroup;
  isUpdateMode: boolean = false;
  currentProjectId: string;


  employees: Employee[] = [];

  submitted = false;

  minEndDate: string | null = null;

  constructor(    private fb: FormBuilder,
    private projectService: ProjectService,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private router: Router, private employeeService: EmployeeService
) {}

  ngOnInit() {
    this.projectForm = this.fb.group({
      id: [{value: null, disabled: true}], // ID is auto-generated
      name: ['', Validators.required],
      description: [''],
      startDate: [null, Validators.required],
      endDate: [null, Validators.required],
      status: ['', Validators.required],
      managerId: ['', Validators.required],
      teamMembers: this.fb.array([]),
      activities: this.fb.array([]),
    },{ validators: dateRangeValidator() });

    this.loadEmployees();

    this.route.paramMap.subscribe(params => {
      const projectId = params.get('id');
      if (projectId) {
        this.isUpdateMode = true;
        this.currentProjectId = projectId;
        this.loadProjectData(this.currentProjectId);
      }
    });
  }



onStartDateChange() {
  const startDateValue = this.projectForm.get('startDate')?.value;
  if (startDateValue) {
    const startDate = new Date(startDateValue);
    startDate.setDate(startDate.getDate() + 1); // Set minimum end date to one day after start date
    this.minEndDate = startDate.toISOString().split('T')[0];
  } else {
    this.minEndDate = null;
  }
}
  loadEmployees() {
    this.employeeService.getAllEmployees().subscribe({
      next: (data) => {
        this.employees = data;
      },
      error: () => console.error('Error fetching employees')
    });
  }
  get teamMembers(): FormArray {
    return this.projectForm.get('teamMembers') as FormArray;
  }

  addTeamMember() {
    this.teamMembers.push(this.fb.control(''));
  }

  removeTeamMember(index: number) {
    this.teamMembers.removeAt(index);
  }

  loadProjectData(projectId: string) {
    this.projectService.getProjectById(projectId).subscribe({
      next: (project) => {
        this.projectForm.patchValue({
          id: project._id,
          name: project.name,
          description: project.description,
          startDate: project.startDate ? this.formatDate(project.startDate) : null,
          endDate: project.endDate ? this.formatDate(project.endDate) : null,
          status: project.status,
          managerId: project.managerId,
        });
        // Handle teamMembers separately
        if (project.teamMembers) {
          this.teamMembers.clear(); // Clear existing form controls
          project.teamMembers.forEach(teamMember => {
            this.teamMembers.push(this.fb.control(teamMember));
          });
        }
        if (project.activities) {
          const formattedActivities = project.activities.map(activity => ({
            ...activity,
            startDate: this.formatDate(activity.startDate),
            endDate: this.formatDate(activity.endDate),
          }));
          this.setActivities(formattedActivities);
        }
      },
      error: (err) => {
        this.toastr.error('Error loading project data');
      }
    });
  }
  formatDate(date: Date): string {
    return date ? new Date(date).toISOString().split('T')[0] : null;
  }
  get activities(): FormArray {
    return this.projectForm.get('activities') as FormArray;
  }

  addActivity() {
    const activityFormGroup = this.fb.group({
      description: [''],
      startDate: [null],
      endDate: [null],
      responsiblePerson: ['']
    });
    this.activities.push(activityFormGroup);
  }

  setActivities(activities) {
    this.activities.clear();
    activities.forEach(activity => {
      const activityFormGroup = this.fb.group({
        // ...
        description: [activity.description],
        responsiblePerson: [activity.responsiblePerson],
        startDate: [activity.startDate],
        endDate: [activity.endDate],
        // ...
      });
      this.activities.push(activityFormGroup);
    });
  }

  removeActivity(index: number) {
    this.activities.removeAt(index);
  }


  onSubmit() {

    this. submitted = true;
    if (this.projectForm.valid) {
      // Extract the raw value of the form, which includes disabled fields
      const projectData: Project = this.projectForm.getRawValue();

      // Include activities in the project data
      // projectData.activities = this.activities.value;

        // Convert string dates from the form to Date objects
        projectData.startDate = projectData.startDate ? new Date(projectData.startDate) : null;
        projectData.endDate = projectData.endDate ? new Date(projectData.endDate) : null;
        projectData.activities = projectData.activities.map(activity => ({
          ...activity,
          startDate: activity.startDate ? new Date(activity.startDate) : null,
          endDate: activity.endDate ? new Date(activity.endDate) : null,
        }));

      if (this.isUpdateMode) {
        this.updateProject(projectData);
      } else {
        this.addProject(projectData);
      }
    } else {
      this.toastr.error('Please fill all required fields');
    }
  }

  addProject(projectData: Project) {
    this.projectService.addProjectRecord(projectData).subscribe({
      next: (res) => {
        this.toastr.success('Project added successfully!');
        this.router.navigate(['/projects']);
      },
      error: (err) => {
        this.toastr.error('Failed to add project');
      }
    });
  }

  updateProject(projectData: Project) {
    // Ensure the correct project ID is set
    projectData._id = this.currentProjectId;
    this.projectService.updateProjectRecord(this.currentProjectId, projectData).subscribe({
      next: (res) => {
        this.toastr.success('Project updated successfully!');
        this.router.navigate(['/projects']);
      },
      error: (err) => {
        console.error('Update project error:', err);
        this.toastr.error('Failed to update project. Error: ' + err.message);
      }
    });
  }



}


function dateRangeValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const startDate = control.get('startDate')?.value;
    const endDate = control.get('endDate')?.value;

    return startDate && endDate && new Date(startDate) > new Date(endDate)
      ? { 'dateRangeInvalid': true }
      : null;
  };
}
