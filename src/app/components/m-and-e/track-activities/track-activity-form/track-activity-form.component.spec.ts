import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrackActivityFormComponent } from './track-activity-form.component';

describe('TrackActivityFormComponent', () => {
  let component: TrackActivityFormComponent;
  let fixture: ComponentFixture<TrackActivityFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TrackActivityFormComponent]
    });
    fixture = TestBed.createComponent(TrackActivityFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
