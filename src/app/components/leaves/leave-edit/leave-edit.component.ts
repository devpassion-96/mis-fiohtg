import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Leave } from 'src/app/models/leave.model';
import { LeavesService } from 'src/app/services/hrm/leaves.service';


@Component({
  selector: 'app-leave-edit',
  templateUrl: './leave-edit.component.html',
  styleUrls: ['./leave-edit.component.css']
})
export class LeaveEditComponent implements OnInit {
  leaveForm: FormGroup;
  leaveId: string;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private leavesService: LeavesService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.leaveId = params['id'];
      this.leavesService.getLeaveById(this.leaveId).subscribe(
        leave => this.initForm(leave),
        error => console.error('Error fetching leave:', error)
      );
    });
  }

  initForm(leave: Leave) {
    this.leaveForm = this.fb.group({
      staffId: [{value: leave.staffId, disabled: true}, Validators.required],
      startDate: [leave.startDate, Validators.required],
      endDate: [leave.endDate, Validators.required],
      type: [leave.type, Validators.required],
      status: [{value: leave.status, disabled: true}, Validators.required],
      approverComments: [leave.approverComments],
      remarks: [leave.remarks],
      appliedOn: [{value: leave.appliedOn, disabled: true}],
      approvedBy: [leave.approvedBy],
      approvedOn: [leave.approvedOn]
    });
  }

  onSubmit() {
    if (this.leaveForm.valid) {
      const updatedLeave = {...this.leaveForm.value, staffId: this.leaveForm.get('staffId')?.value};
      this.leavesService.updateLeave(this.leaveId, updatedLeave).subscribe(
        () => this.router.navigate(['/leave-list']),
        error => console.error('Error updating leave:', error)
      );
    }
  }
}
