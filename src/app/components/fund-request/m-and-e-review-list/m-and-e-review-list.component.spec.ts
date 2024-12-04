import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MAndEReviewListComponent } from './m-and-e-review-list.component';

describe('MAndEReviewListComponent', () => {
  let component: MAndEReviewListComponent;
  let fixture: ComponentFixture<MAndEReviewListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MAndEReviewListComponent]
    });
    fixture = TestBed.createComponent(MAndEReviewListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
