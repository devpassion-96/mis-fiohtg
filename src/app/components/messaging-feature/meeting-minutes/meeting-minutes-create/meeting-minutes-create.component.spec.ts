import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeetingMinutesCreateComponent } from './meeting-minutes-create.component';

describe('MeetingMinutesCreateComponent', () => {
  let component: MeetingMinutesCreateComponent;
  let fixture: ComponentFixture<MeetingMinutesCreateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MeetingMinutesCreateComponent]
    });
    fixture = TestBed.createComponent(MeetingMinutesCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
