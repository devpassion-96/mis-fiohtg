import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeDevelopmentComponent } from './employee-development.component';

describe('EmployeeDevelopmentComponent', () => {
  let component: EmployeeDevelopmentComponent;
  let fixture: ComponentFixture<EmployeeDevelopmentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EmployeeDevelopmentComponent]
    });
    fixture = TestBed.createComponent(EmployeeDevelopmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
