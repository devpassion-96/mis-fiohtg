import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DailyPermissionFormComponent } from './daily-permission-form.component';

describe('DailyPermissionFormComponent', () => {
  let component: DailyPermissionFormComponent;
  let fixture: ComponentFixture<DailyPermissionFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DailyPermissionFormComponent]
    });
    fixture = TestBed.createComponent(DailyPermissionFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
