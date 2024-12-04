import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinanceLeaveListComponent } from './finance-leave-list.component';

describe('FinanceLeaveListComponent', () => {
  let component: FinanceLeaveListComponent;
  let fixture: ComponentFixture<FinanceLeaveListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FinanceLeaveListComponent]
    });
    fixture = TestBed.createComponent(FinanceLeaveListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
