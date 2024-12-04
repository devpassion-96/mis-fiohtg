import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateReportFormComponent } from './create-report-form.component';

describe('CreateReportFormComponent', () => {
  let component: CreateReportFormComponent;
  let fixture: ComponentFixture<CreateReportFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreateReportFormComponent]
    });
    fixture = TestBed.createComponent(CreateReportFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
