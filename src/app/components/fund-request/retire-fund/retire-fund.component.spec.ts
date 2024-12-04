import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RetireFundComponent } from './retire-fund.component';

describe('RetireFundComponent', () => {
  let component: RetireFundComponent;
  let fixture: ComponentFixture<RetireFundComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RetireFundComponent]
    });
    fixture = TestBed.createComponent(RetireFundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
