import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BudgetCashflowComponent } from './budget-cashflow.component';

describe('BudgetCashflowComponent', () => {
  let component: BudgetCashflowComponent;
  let fixture: ComponentFixture<BudgetCashflowComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BudgetCashflowComponent]
    });
    fixture = TestBed.createComponent(BudgetCashflowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
