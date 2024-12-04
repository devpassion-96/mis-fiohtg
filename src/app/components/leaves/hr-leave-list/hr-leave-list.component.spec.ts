import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HrLeaveListComponent } from './hr-leave-list.component';

describe('HrLeaveListComponent', () => {
  let component: HrLeaveListComponent;
  let fixture: ComponentFixture<HrLeaveListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HrLeaveListComponent]
    });
    fixture = TestBed.createComponent(HrLeaveListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
