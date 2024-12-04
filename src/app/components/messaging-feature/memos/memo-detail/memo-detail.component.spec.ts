import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MemoDetailComponent } from './memo-detail.component';

describe('MemoDetailComponent', () => {
  let component: MemoDetailComponent;
  let fixture: ComponentFixture<MemoDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MemoDetailComponent]
    });
    fixture = TestBed.createComponent(MemoDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
