import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Employee } from 'src/app/models/employee.model';
import { MeetingMinutes } from 'src/app/models/messaging-feature/minutes.model';
import { UserProfileService } from 'src/app/services/auth/user-profile.service';
import { EmployeeService } from 'src/app/services/hrm/employee.service';
import { MeetingMinutesService } from 'src/app/services/messaging-feature/meetings.service';


@Component({
  selector: 'app-meeting-minutes-create',
  templateUrl: './meeting-minutes-create.component.html',
  styleUrls: ['./meeting-minutes-create.component.css']
})
export class MeetingMinutesCreateComponent {

  meetingMinutesForm: FormGroup;
  isEditMode: boolean = false;
  meetingMinuteId: string;
  employees: Employee[] = [];

  user: any;

  submitted = false;

  constructor(private fb: FormBuilder,
    private meetingMinutesService: MeetingMinutesService,
    private router: Router,
    private userProfileService: UserProfileService,
  private toastr: ToastrService, private route: ActivatedRoute,private employeeService: EmployeeService ) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.meetingMinutesForm = this.fb.group({
      title: ['', Validators.required],
      meetingDate: ['', Validators.required],
      pointsDiscussed: this.fb.array([],Validators.required), // FormArray for points discussed
      decisionsMade: this.fb.array([], Validators.required), // FormArray for decisions made
      actionItems: this.fb.array([], Validators.required), // FormArray for action items
      createdBy: ['', Validators.required],

      participants: this.fb.array([], Validators.required), // FormArray for participants
      nonStaffMembers: this.fb.array([]), // FormArray for nonStaffMembers
      absentWithApology: this.fb.array([],),
      agenda: this.fb.array([], Validators.required), // FormArray for agenda items
      secretary: ['', Validators.required], // FormControl for secretary
      chairperson: ['', Validators.required], // FormControl for chairperson
      secretarySignature: [''], // FormControl for secretary's signature
      chairpersonSignature: [''], // FormControl for chairperson's signature
    });

    this.employeeService.getAllEmployees().subscribe(employees => {
      this.employees = employees;
    });

    // Check if route has 'id' parameter, indicating edit mode
    this.route.paramMap.subscribe((params) => {
      this.meetingMinuteId = params.get('id');
      if (this.meetingMinuteId) {
        this.isEditMode = true;
        this.loadMeetingMinuteForEdit();
      }
    });
    this.populateStaffId();
  }

  populateStaffId() {
    this.userProfileService.user.subscribe(
      (userData) => {
        if (userData && userData.staffId) {
          this.user = userData;
          this.meetingMinutesForm.patchValue({ createdBy: userData.staffId });
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
  loadMeetingMinuteForEdit() {
    this.meetingMinutesService.getMeetingMinutesById(this.meetingMinuteId).subscribe(
      (meetingMinute) => {
        // Populate the form with the retrieved data
        this.meetingMinutesForm.patchValue(meetingMinute);

        // Populate FormArrays
        this.meetingMinutesForm.setControl('pointsDiscussed', this.fb.array(meetingMinute.pointsDiscussed || []));
        this.meetingMinutesForm.setControl('decisionsMade', this.fb.array(meetingMinute.decisionsMade || []));
        this.meetingMinutesForm.setControl('actionItems', this.fb.array(meetingMinute.actionItems || []));

        this.meetingMinutesForm.setControl('absentWithApology', this.fb.array(meetingMinute.absentWithApology || []));
        this.meetingMinutesForm.setControl('participants', this.fb.array(meetingMinute.participants || []));
        this.meetingMinutesForm.setControl('nonStaffMembers', this.fb.array(meetingMinute.nonStaffMembers || []));
      this.meetingMinutesForm.setControl('agenda', this.fb.array(meetingMinute.agenda || []));
      this.meetingMinutesForm.patchValue({
        secretary: meetingMinute.secretary,
        chairperson: meetingMinute.chairperson,
        secretarySignature: meetingMinute.secretarySignature,
        chairpersonSignature: meetingMinute.chairpersonSignature,
      });
      },
      (error) => {
        console.error('Error loading meeting minute for edit:', error);
        // Handle errors if needed
      }
    );
  }


  get pointsDiscussedFormArray() {
    return this.meetingMinutesForm.get('pointsDiscussed') as FormArray;
  }

  get decisionsMadeFormArray() {
    return this.meetingMinutesForm.get('decisionsMade') as FormArray;
  }

  get actionItemsFormArray() {
    return this.meetingMinutesForm.get('actionItems') as FormArray;
  }

  get participantsFormArray() {
    return this.meetingMinutesForm.get('participants') as FormArray;
  }

  get nonStaffMembersFormArray() {
    return this.meetingMinutesForm.get('nonStaffMembers') as FormArray;
  }


   get absentWithApologyFormArray() {
    return this.meetingMinutesForm.get('absentWithApology') as FormArray;
  }
  get agendaFormArray() {
    return this.meetingMinutesForm.get('agenda') as FormArray;
  }

  addListItem(formArray: FormArray) {
    formArray.push(this.fb.control(''));
  }

  removeListItem(formArray: FormArray, index: number) {
    formArray.removeAt(index);
  }

  addParticipant() {
    this.participantsFormArray.push(this.fb.control(''));
  }

  removeParticipant(index: number) {
    this.participantsFormArray.removeAt(index);
  }

  addNonStaffMembers() {
    this.nonStaffMembersFormArray.push(this.fb.control(''));
  }

  removeNonStaffMembers(index: number) {
    this.nonStaffMembersFormArray.removeAt(index);
  }

  addAbsentWithApology() {
    this.absentWithApologyFormArray.push(this.fb.control(''));
  }

  removeAbsentWithApology(index: number) {
    this.absentWithApologyFormArray.removeAt(index);
  }

  addAgendaItem() {
    this.agendaFormArray.push(this.fb.control(''));
  }

  removeAgendaItem(index: number) {
    this.agendaFormArray.removeAt(index);
  }

  onSubmit() {
    this.submitted = true;
    if (this.meetingMinutesForm.valid) {
      const meetingMinutesData: MeetingMinutes = this.meetingMinutesForm.value;

      if (this.isEditMode) {
        // Update existing meeting minute if in edit mode
        this.meetingMinutesService
          .updateMeetingMinutesRecord(this.meetingMinuteId, meetingMinutesData)
          .subscribe(
            (updatedMeetingMinutes: MeetingMinutes) => {
              console.log('Meeting Minutes Data (Updated):', updatedMeetingMinutes);
              this.toastr.success('Meeting Minutes updated successfully', 'Success', {
                timeOut: 3000,
              });
              this.router.navigate(['/meeting-minutes']);
            },
            (error) => {
              console.error('Error updating meeting minutes:', error);
              // Handle errors if needed
            }
          );
      } else {

        const createdBy = {
          ...this.meetingMinutesForm.value,
          staffId: this.user.staffId
        };
     
        // Create a new meeting minute if not in edit mode
        this.meetingMinutesService.addMeetingMinutesRecord(createdBy).subscribe(
          (addedMeetingMinutes: MeetingMinutes) => {
            console.log('Meeting Minutes Data (Added):', addedMeetingMinutes);
            this.toastr.success('Meeting Minutes added successfully', 'Success', {
              timeOut: 3000,
            });
            this.router.navigate(['/meeting-minutes']);
          },
          (error) => {
            console.error('Error adding meeting minutes:', error);
            // Handle errors if needed
          }
        );
      }
    }
  }

  onFileSelected(event: Event, role: 'secretary' | 'chairperson') {
    const file = (event.target as HTMLInputElement).files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result as string;
        if (role === 'secretary') {
          this.meetingMinutesForm.get('secretarySignature').setValue(base64);
        } else {
          this.meetingMinutesForm.get('chairpersonSignature').setValue(base64);
        }
      };
      reader.readAsDataURL(file);
    }
  }

}
