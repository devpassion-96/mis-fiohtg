import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinanceReviewListComponent } from './finance-review-list.component';

describe('FinanceReviewListComponent', () => {
  let component: FinanceReviewListComponent;
  let fixture: ComponentFixture<FinanceReviewListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FinanceReviewListComponent]
    });
    fixture = TestBed.createComponent(FinanceReviewListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
