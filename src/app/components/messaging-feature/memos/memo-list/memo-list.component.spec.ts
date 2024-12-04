import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MemoListComponent } from './memo-list.component';

describe('MemoListComponent', () => {
  let component: MemoListComponent;
  let fixture: ComponentFixture<MemoListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MemoListComponent]
    });
    fixture = TestBed.createComponent(MemoListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
