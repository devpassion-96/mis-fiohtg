import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FundProcessListComponent } from './fund-process-list.component';

describe('FundProcessListComponent', () => {
  let component: FundProcessListComponent;
  let fixture: ComponentFixture<FundProcessListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FundProcessListComponent]
    });
    fixture = TestBed.createComponent(FundProcessListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
