import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectsFormComponent } from './projects-form.component';

describe('ProjectsFormComponent', () => {
  let component: ProjectsFormComponent;
  let fixture: ComponentFixture<ProjectsFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProjectsFormComponent]
    });
    fixture = TestBed.createComponent(ProjectsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
