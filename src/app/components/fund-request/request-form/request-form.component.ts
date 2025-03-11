import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Router,ActivatedRoute } from '@angular/router';
import { ProjectService } from 'src/app/services/project-management/project.service';
import { BudgetService } from 'src/app/services/project-management/budget.service';
import { RequestService } from 'src/app/services/hrm/request.service';
import { Project } from 'src/app/models/project-management/project.model';
import { Budget } from 'src/app/models/project-management/budget.model';
import { UserProfileService } from 'src/app/services/auth/user-profile.service';


@Component({
  selector: 'app-request-form',
  templateUrl: './request-form.component.html',
  styleUrls: ['./request-form.component.css']
})
export class RequestFormComponent implements OnInit {
  requestForm: FormGroup;
  projects: Project[] = [];
  selectedBudget: Budget | null = null;
  user: any;
  project: Project[] = [];
  budgets: Budget[] = [];

  fileId!: string | null; 
  // fileToEdit!: any | null;
  selectedFile!: File;

    // File management
    selectedFiles: File[] = [];
    fileToEdit: any | null = null;

  submitted = false;




  constructor(
    private fb: FormBuilder,
    private projectService: ProjectService,
    private budgetService: BudgetService,
    private requestService: RequestService,
    private toastr: ToastrService,private route: ActivatedRoute,
    private userProfileService: UserProfileService,
    private router: Router
  ) {}

  ngOnInit() {

    this.budgetService.getAllBudgetRecords().subscribe(data => {
      this.budgets = data;
    });

    this.projectService.getAllProjectRecords().subscribe(data => {
      this.project = data;
    });


    this.requestForm = this.fb.group({
      projectId: ['', Validators.required],
      amountRequested: ['', [Validators.required, Validators.min(1)]],
      description: ['', Validators.required],
      files: [null],
      outputs: ['']
    });

      // Check if we are editing an existing file
      this.fileId = this.route.snapshot.paramMap.get('id');  // Get 'id' from route
      if (this.fileId) {
        this.getFileDetails(this.fileId);  // Fetch file details to edit
      }

    this.loadProjects();
    this.setupProjectChangeListener();
    this.populateStaffId();

    // this.initializeForm();
    // this.loadBudgets();
    // this.checkForEdit();

  }

   // File selection handler
   onFileSelected(event: any): void {
    this.selectedFiles = Array.from(event.target.files);
  }

   // Fetch the file details to pre-fill the form
   getFileDetails(id: string): void {
    this.requestService.getAllRequestRecords().subscribe((files) => {
      const file = files.find(f => f._id === id);
      if (file) {
        this.fileToEdit = file;
        // Pre-fill the form with existing file details
        this.requestForm.patchValue({
          name: file.amountRequested,
          description: file.description,
          outputs:file.outputs,
          // attachment: file.attachment
        });
      }
    });
  }

  
  populateStaffId() {
    this.userProfileService.user.subscribe(
      (userData) => {
        if (userData && userData.staffId) {
          this.user = userData;
          this.requestForm.patchValue({ staffId: userData.staffId });
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
  loadProjects() {
    this.projectService.getAllProjectRecords().subscribe({
      next: (data) => this.projects = data,
      error: () => this.toastr.error('Failed to load projects')
    });
  }

  getProjectNameByProjectId(projectId: string) {
    const project = this.project.find(prj => prj._id === projectId);
    return project ? project.name : 'Unknown';
  }

  setupProjectChangeListener() {
    this.requestForm.get('projectId').valueChanges.subscribe(projectId => {
      if (projectId) {
        this.fetchBudgetForProject(projectId);
      } else {
        this.selectedBudget = null;
      }
    });
  }

  fetchBudgetForProject(projectId: string) {
    this.budgetService.getBudgetByProjectId(projectId).subscribe({
      next: (budgets) => {
        this.selectedBudget = budgets.length > 0 ? budgets[0] : null;
      },
      error: () => this.toastr.error('Error fetching budget for selected project')
    });
  }

  
  isSubmitting = false; // Track submission state
  submitRequest() {
    this.submitted = true;
  
    if (this.requestForm.valid && this.selectedBudget) {
      const requestAmount = this.requestForm.value.amountRequested;
  
      if (requestAmount > this.selectedBudget.balance) {
        this.toastr.error('Requested amount exceeds available budget balance');
        return;
      }

  // Disable button and show loading message
    this.isSubmitting = true;
  //  // Show loading spinner
  //  this.toastr.info('Uploading files, please wait...');
      // Create FormData object to handle file uploads
      const formData = new FormData();
  
      // Append request form values
      formData.append('projectId', this.requestForm.value.projectId);
      formData.append('amountRequested', this.requestForm.value.amountRequested);
      formData.append('description', this.requestForm.value.description);
      formData.append('outputs', this.requestForm.value.outputs);
      formData.append('staffId', this.user.staffId);
      formData.append('status', 'Pending');
      formData.append('createdAt', new Date().toISOString());
      
      // Append each selected file
      this.selectedFiles.forEach((file) => {
        formData.append('files', file);
      });
  
      // Send the formData object to the server
      this.requestService.addRequestRecord(formData as any).subscribe({
        next: () => {
          this.toastr.success('Request submitted successfully');
          this.router.navigate(['/']);
        },
        error: () => this.toastr.error('Failed to submit request')
      });
    } else {
      this.toastr.error('Please fill all required fields');
    }
  }
  
  
  

  onFileChange(event: any): void {
    // this.selectedFile = event.target.files[0];

    this.selectedFiles = Array.from(event.target.files);
  }

}
