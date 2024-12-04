import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Driver } from 'src/app/models/vehicle-drivers/driver.model';
import { DriverService } from 'src/app/services/vehicle-drivers/driver.service';

@Component({
  selector: 'app-driver-detail',
  templateUrl: './driver-detail.component.html',
  styleUrls: ['./driver-detail.component.css']
})
export class DriverDetailComponent implements OnInit {
  // driver: Driver | null = null;

  // constructor(
  //   private route: ActivatedRoute,
  //   private driverService: DriverService
  // ) {}

  // ngOnInit() {
  //   const driverId = this.route.snapshot.paramMap.get('id');
  //   if (driverId) {
  //     this.driverService.getDriverById(driverId).subscribe({
  //       next: (data) => this.driver = data,
  //       error: () => console.error('Error fetching driver data')
  //     });
  //   }
  // }

  ngOnInit() {
    
  }
}
