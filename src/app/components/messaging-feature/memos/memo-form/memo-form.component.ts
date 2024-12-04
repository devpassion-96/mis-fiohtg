import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Memo } from 'src/app/models/messaging-feature/memos.model';
import { UserProfileService } from 'src/app/services/auth/user-profile.service';
import { MemoService } from 'src/app/services/messaging-feature/memos.service';

@Component({
  selector: 'app-memo-form',
  templateUrl: './memo-form.component.html',
  styleUrls: ['./memo-form.component.css'],
})
export class MemoFormComponent implements OnInit {
  memoForm: FormGroup;
  isEditMode = false;
  memoId: string;

  user: any;
  submitted = false;

  constructor(
    private fb: FormBuilder,
    private memoService: MemoService,
    private route: ActivatedRoute,
    private userProfileService: UserProfileService,
    private router: Router, private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.checkEditMode();
    this.populateStaffId();
  }

  initForm() {
    this.memoForm = this.fb.group({
      title: ['', Validators.required],
      content: ['', Validators.required],
      createdBy: ['', Validators.required],
      createdAt: [new Date(), Validators.required],
    });
  }
  populateStaffId() {
    this.userProfileService.user.subscribe(
      (userData) => {
        if (userData && userData.staffId) {
          this.user = userData;
          this.memoForm.patchValue({ createdBy: userData.staffId });
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

  checkEditMode() {
    // Check if memoId is provided as a route parameter for editing
    this.route.params.subscribe((params) => {
      if (params['id']) {
        this.isEditMode = true;
        this.memoId = params['id'];
        // Load memo data for editing
        this.loadMemoForEdit(this.memoId);
      }
    });
  }

  loadMemoForEdit(id: string) {
    // Fetch the memo data for editing and populate the form
    this.memoService.getMemoById(id).subscribe(
      (memo) => {
        this.memoForm.patchValue(memo);
      },
      (error) => {
        console.error('Error loading memo for edit:', error);
        // Handle errors if needed
      }
    );
  }

  onSubmit() {

    this.submitted = true;
    if (this.memoForm.valid) {
      const memoData: Memo = this.memoForm.value;
      if (this.isEditMode) {
        // Update the existing memo
        this.memoService.updateMemoRecord(this.memoId.toString(), memoData).subscribe(
          (updatedMemo) => {
            console.log('Memo updated:', updatedMemo);
            // Redirect to the memo list or view page
            this.toastr.success('Memo updated successfully', 'Success', {
              timeOut: 3000,
            });
            this.router.navigate(['/memos']);
          },
          (error) => {
            console.error('Error updating memo:', error);
            // Handle errors if needed
          }
        );
      } else {

        const createMemo = {
          ...this.memoForm.value,
          createdBy: this.user.staffId // Use the staffId from the user data
        };
        // Create a new memo
        this.memoService.addMemoRecord(createMemo).subscribe(
          (addedMemo) => {
            console.log('Memo added:', addedMemo);
            // Redirect to the memo list or view page
            this.toastr.success('Memo added successfully', 'Success', {
              timeOut: 3000,
            });
            this.router.navigate(['/memos']);
          },
          (error) => {
            console.error('Error adding memo:', error);
            // Handle errors if needed
          }
        );
      }
    }
  }
}
