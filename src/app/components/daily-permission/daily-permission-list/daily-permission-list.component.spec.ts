import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DailyPermissionListComponent } from './daily-permission-list.component';

describe('DailyPermissionListComponent', () => {
  let component: DailyPermissionListComponent;
  let fixture: ComponentFixture<DailyPermissionListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DailyPermissionListComponent]
    });
    fixture = TestBed.createComponent(DailyPermissionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
