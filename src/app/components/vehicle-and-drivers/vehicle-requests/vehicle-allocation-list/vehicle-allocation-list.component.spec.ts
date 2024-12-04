import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleAllocationListComponent } from './vehicle-allocation-list.component';

describe('VehicleAllocationListComponent', () => {
  let component: VehicleAllocationListComponent;
  let fixture: ComponentFixture<VehicleAllocationListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VehicleAllocationListComponent]
    });
    fixture = TestBed.createComponent(VehicleAllocationListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
