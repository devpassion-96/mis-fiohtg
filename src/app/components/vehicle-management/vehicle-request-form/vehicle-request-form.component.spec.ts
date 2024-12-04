import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleRequestFormComponent } from './vehicle-request-form.component';

describe('VehicleRequestFormComponent', () => {
  let component: VehicleRequestFormComponent;
  let fixture: ComponentFixture<VehicleRequestFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VehicleRequestFormComponent]
    });
    fixture = TestBed.createComponent(VehicleRequestFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
