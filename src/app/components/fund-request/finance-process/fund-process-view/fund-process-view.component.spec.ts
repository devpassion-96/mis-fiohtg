import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FundProcessViewComponent } from './fund-process-view.component';

describe('FundProcessViewComponent', () => {
  let component: FundProcessViewComponent;
  let fixture: ComponentFixture<FundProcessViewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FundProcessViewComponent]
    });
    fixture = TestBed.createComponent(FundProcessViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
