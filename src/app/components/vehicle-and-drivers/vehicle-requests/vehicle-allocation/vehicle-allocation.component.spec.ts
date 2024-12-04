import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleAllocationComponent } from './vehicle-allocation.component';

describe('VehicleAllocationComponent', () => {
  let component: VehicleAllocationComponent;
  let fixture: ComponentFixture<VehicleAllocationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VehicleAllocationComponent]
    });
    fixture = TestBed.createComponent(VehicleAllocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
