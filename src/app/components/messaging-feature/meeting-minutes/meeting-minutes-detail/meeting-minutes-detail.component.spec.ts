import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeetingMinutesDetailComponent } from './meeting-minutes-detail.component';

describe('MeetingMinutesDetailComponent', () => {
  let component: MeetingMinutesDetailComponent;
  let fixture: ComponentFixture<MeetingMinutesDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MeetingMinutesDetailComponent]
    });
    fixture = TestBed.createComponent(MeetingMinutesDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
