import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeaveEditComponent } from './leave-edit.component';

describe('LeaveEditComponent', () => {
  let component: LeaveEditComponent;
  let fixture: ComponentFixture<LeaveEditComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LeaveEditComponent]
    });
    fixture = TestBed.createComponent(LeaveEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
