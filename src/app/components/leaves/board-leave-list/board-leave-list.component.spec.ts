import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoardLeaveListComponent } from './board-leave-list.component';

describe('BoardLeaveListComponent', () => {
  let component: BoardLeaveListComponent;
  let fixture: ComponentFixture<BoardLeaveListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BoardLeaveListComponent]
    });
    fixture = TestBed.createComponent(BoardLeaveListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
