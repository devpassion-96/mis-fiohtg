import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllocationListComponent } from './allocation-list.component';

describe('AllocationListComponent', () => {
  let component: AllocationListComponent;
  let fixture: ComponentFixture<AllocationListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AllocationListComponent]
    });
    fixture = TestBed.createComponent(AllocationListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
