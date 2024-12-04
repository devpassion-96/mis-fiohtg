import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestPrintViewComponent } from './request-print-view.component';

describe('RequestPrintViewComponent', () => {
  let component: RequestPrintViewComponent;
  let fixture: ComponentFixture<RequestPrintViewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RequestPrintViewComponent]
    });
    fixture = TestBed.createComponent(RequestPrintViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
