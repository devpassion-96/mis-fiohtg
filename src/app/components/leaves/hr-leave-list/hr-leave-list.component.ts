import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { forkJoin, map } from 'rxjs';
import { ExtendedLeave } from 'src/app/models/leave.model';
import { EmployeeService } from 'src/app/services/hrm/employee.service';
import { LeavesService } from 'src/app/services/hrm/leaves.service';

@Component({
  selector: 'app-hr-leave-list',
  templateUrl: './hr-leave-list.component.html',
  styleUrls: ['./hr-leave-list.component.css']
})
export class HrLeaveListComponent {

  leaves: ExtendedLeave[] = [];
  filter: string = '';

  constructor(private leavesService: LeavesService,private router: Router, private employeeService: EmployeeService) {}

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
        this.leaves = mappedLeaves.filter(request => request.status === 'Finance Review');
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
    this.router.navigate(['/leave-edit', id]);
  }

  deleteLeave(id: string) {
    if (confirm('Are you sure you want to delete this leave request?')) {
      this.leavesService.deleteLeave(id).subscribe(
        () => {
          // Refresh the list or handle UI updates
          this.leaves = this.leaves.filter(leave => leave._id !== id);
        },
        error => {
          // Handle delete error
        }
      );
    }
  }

}
