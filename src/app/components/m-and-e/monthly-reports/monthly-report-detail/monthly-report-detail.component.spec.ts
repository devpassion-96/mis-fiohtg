import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonthlyReportDetailComponent } from './monthly-report-detail.component';

describe('MonthlyReportDetailComponent', () => {
  let component: MonthlyReportDetailComponent;
  let fixture: ComponentFixture<MonthlyReportDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MonthlyReportDetailComponent]
    });
    fixture = TestBed.createComponent(MonthlyReportDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
