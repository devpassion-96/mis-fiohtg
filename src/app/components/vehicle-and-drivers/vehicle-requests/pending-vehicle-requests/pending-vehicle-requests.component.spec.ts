import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PendingVehicleRequestsComponent } from './pending-vehicle-requests.component';

describe('PendingVehicleRequestsComponent', () => {
  let component: PendingVehicleRequestsComponent;
  let fixture: ComponentFixture<PendingVehicleRequestsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PendingVehicleRequestsComponent]
    });
    fixture = TestBed.createComponent(PendingVehicleRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
