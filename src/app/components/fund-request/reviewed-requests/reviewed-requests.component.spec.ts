import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewedRequestsComponent } from './reviewed-requests.component';

describe('ReviewedRequestsComponent', () => {
  let component: ReviewedRequestsComponent;
  let fixture: ComponentFixture<ReviewedRequestsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReviewedRequestsComponent]
    });
    fixture = TestBed.createComponent(ReviewedRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
