import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyVehicleRequestsComponent } from './my-vehicle-requests.component';

describe('MyVehicleRequestsComponent', () => {
  let component: MyVehicleRequestsComponent;
  let fixture: ComponentFixture<MyVehicleRequestsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MyVehicleRequestsComponent]
    });
    fixture = TestBed.createComponent(MyVehicleRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
