import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupervisorApprovalComponent } from './supervisor-approval.component';

describe('SupervisorApprovalComponent', () => {
  let component: SupervisorApprovalComponent;
  let fixture: ComponentFixture<SupervisorApprovalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SupervisorApprovalComponent]
    });
    fixture = TestBed.createComponent(SupervisorApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
