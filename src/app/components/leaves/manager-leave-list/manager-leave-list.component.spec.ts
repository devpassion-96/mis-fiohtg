import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagerLeaveListComponent } from './manager-leave-list.component';

describe('ManagerLeaveListComponent', () => {
  let component: ManagerLeaveListComponent;
  let fixture: ComponentFixture<ManagerLeaveListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ManagerLeaveListComponent]
    });
    fixture = TestBed.createComponent(ManagerLeaveListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
