import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BudgetTransferComponent } from './budget-transfer.component';

describe('BudgetTransferComponent', () => {
  let component: BudgetTransferComponent;
  let fixture: ComponentFixture<BudgetTransferComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BudgetTransferComponent]
    });
    fixture = TestBed.createComponent(BudgetTransferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
