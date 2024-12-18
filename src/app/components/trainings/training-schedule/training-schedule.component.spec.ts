import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrainingScheduleComponent } from './training-schedule.component';

describe('TrainingScheduleComponent', () => {
  let component: TrainingScheduleComponent;
  let fixture: ComponentFixture<TrainingScheduleComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TrainingScheduleComponent]
    });
    fixture = TestBed.createComponent(TrainingScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
