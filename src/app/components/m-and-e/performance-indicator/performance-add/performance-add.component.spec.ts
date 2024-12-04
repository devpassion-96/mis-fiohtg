import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PerformanceAddComponent } from './performance-add.component';

describe('PerformanceAddComponent', () => {
  let component: PerformanceAddComponent;
  let fixture: ComponentFixture<PerformanceAddComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PerformanceAddComponent]
    });
    fixture = TestBed.createComponent(PerformanceAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
