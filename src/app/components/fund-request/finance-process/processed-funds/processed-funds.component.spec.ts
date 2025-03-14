import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcessedFundsComponent } from './processed-funds.component';

describe('ProcessedFundsComponent', () => {
  let component: ProcessedFundsComponent;
  let fixture: ComponentFixture<ProcessedFundsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProcessedFundsComponent]
    });
    fixture = TestBed.createComponent(ProcessedFundsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
