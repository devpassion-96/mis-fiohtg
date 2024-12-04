import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleRequestListComponent } from './vehicle-request-list.component';

describe('VehicleRequestListComponent', () => {
  let component: VehicleRequestListComponent;
  let fixture: ComponentFixture<VehicleRequestListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VehicleRequestListComponent]
    });
    fixture = TestBed.createComponent(VehicleRequestListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
