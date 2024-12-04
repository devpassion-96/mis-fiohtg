import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PerformanceEditComponent } from './performance-edit.component';

describe('PerformanceEditComponent', () => {
  let component: PerformanceEditComponent;
  let fixture: ComponentFixture<PerformanceEditComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PerformanceEditComponent]
    });
    fixture = TestBed.createComponent(PerformanceEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
