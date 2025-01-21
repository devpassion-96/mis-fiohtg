import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';
import { CountsService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  counts: any = {};
  userRole: string;

  constructor(private countsService: CountsService, private authService: AuthService) {}

  ngOnInit(): void {
     // Fetch user role
     const userData = this.authService.getCurrentUserData();
     this.userRole = userData?.role || 'Employee';

    this.countsService.counts$.subscribe((counts) => {
      if (counts) {
        this.counts = counts;
      }
    });

    this.countsService.initializeCounts();
  }
}
