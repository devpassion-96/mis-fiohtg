import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayrollAdjustmentComponent } from './payroll-adjustment.component';

describe('PayrollAdjustmentComponent', () => {
  let component: PayrollAdjustmentComponent;
  let fixture: ComponentFixture<PayrollAdjustmentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PayrollAdjustmentComponent]
    });
    fixture = TestBed.createComponent(PayrollAdjustmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
