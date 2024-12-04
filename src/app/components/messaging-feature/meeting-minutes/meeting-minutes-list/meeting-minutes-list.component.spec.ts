import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeetingMinutesListComponent } from './meeting-minutes-list.component';

describe('MeetingMinutesListComponent', () => {
  let component: MeetingMinutesListComponent;
  let fixture: ComponentFixture<MeetingMinutesListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MeetingMinutesListComponent]
    });
    fixture = TestBed.createComponent(MeetingMinutesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
