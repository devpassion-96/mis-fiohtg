import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RetireFundListComponent } from './retire-fund-list.component';

describe('RetireFundListComponent', () => {
  let component: RetireFundListComponent;
  let fixture: ComponentFixture<RetireFundListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RetireFundListComponent]
    });
    fixture = TestBed.createComponent(RetireFundListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
