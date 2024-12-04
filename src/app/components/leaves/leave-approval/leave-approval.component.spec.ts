import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeaveApprovalComponent } from './leave-approval.component';

describe('LeaveApprovalComponent', () => {
  let component: LeaveApprovalComponent;
  let fixture: ComponentFixture<LeaveApprovalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LeaveApprovalComponent]
    });
    fixture = TestBed.createComponent(LeaveApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
