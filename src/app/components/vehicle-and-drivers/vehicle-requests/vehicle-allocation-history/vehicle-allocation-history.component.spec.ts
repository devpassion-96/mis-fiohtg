import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleAllocationHistoryComponent } from './vehicle-allocation-history.component';

describe('VehicleAllocationHistoryComponent', () => {
  let component: VehicleAllocationHistoryComponent;
  let fixture: ComponentFixture<VehicleAllocationHistoryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VehicleAllocationHistoryComponent]
    });
    fixture = TestBed.createComponent(VehicleAllocationHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
