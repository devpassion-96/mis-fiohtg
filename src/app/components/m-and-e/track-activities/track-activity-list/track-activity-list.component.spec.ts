import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrackActivityListComponent } from './track-activity-list.component';

describe('TrackActivityListComponent', () => {
  let component: TrackActivityListComponent;
  let fixture: ComponentFixture<TrackActivityListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TrackActivityListComponent]
    });
    fixture = TestBed.createComponent(TrackActivityListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
