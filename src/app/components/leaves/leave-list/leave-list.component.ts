import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Leave } from 'src/app/models/leave.model';
import { LeavesService } from 'src/app/services/hrm/leaves.service';
import { forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { EmployeeService } from 'src/app/services/hrm/employee.service';
import { ToastrService } from 'ngx-toastr';


interface ExtendedLeave extends Leave {
  employeeName?: string;
}

@Component({
  selector: 'app-leave-list',
  templateUrl: './leave-list.component.html',
  styleUrls: ['./leave-list.component.css']
})
export class LeaveListComponent implements OnInit {
  leaves: ExtendedLeave[] = [];
  filter: string = '';

  constructor(private leavesService: LeavesService,
    private toastr: ToastrService, private router: Router, private employeeService: EmployeeService) {}

  ngOnInit(): void {
    this.loadLeaves()
  }

  loadLeaves() {
    forkJoin({
      leaves: this.leavesService.getAllLeaves(),
      employees: this.employeeService.getAllEmployees()
    }).pipe(
      map(({ leaves, employees }) => {
        return leaves.map(leave => ({
          ...leave,
          employeeName: employees.find(emp => emp.staffId === leave.staffId)?.firstName + ' ' +
                        employees.find(emp => emp.staffId === leave.staffId)?.lastName
        }));
      })
    ).subscribe({
      next: (mappedLeaves) => {
        this.leaves = mappedLeaves;
      },
      error: (error) => {
        console.error('Error loading leaves data', error);
        // Handle errors here
      }
    });
  }



applyFilter() {
  this.leavesService.getAllLeaves().subscribe(
    data => {
      this.leaves = data.filter(leave =>
        leave.staffId.toLowerCase().includes(this.filter.toLowerCase()) ||
        leave.type.toLowerCase().includes(this.filter.toLowerCase()) ||
        leave.status.toLowerCase().includes(this.filter.toLowerCase())
      );
    },
    error => {
      console.error('Error fetching filtered leave requests:', error);
    }
  );
}


  // Methods for view, edit, delete actions

  viewLeave(id: string) {
    // Navigate to leave details page
    this.router.navigate(['/leave-details', id]);
  }

  editLeave(id: string) {
    // Navigate to leave edit page with the leave ID
    this.router.navigate(['/leave-form', id]);
  }

  deleteLeave(_id: string) {
    if (confirm('Are you sure you want to delete this leave request?')) {
      this.leavesService.deleteLeave(_id).subscribe(
        () => {
          // Refresh the list or handle UI updates
          this.leaves = this.leaves.filter(leave => leave._id !== _id);
          this.toastr.error('Deleted Successfully');
          this.router.navigate(['/leave-list']);
        },
        error => {
          // Handle delete error
        }
      );
    }
  }



}
