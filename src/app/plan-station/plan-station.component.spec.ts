import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanStationComponent } from './plan-station.component';

describe('PlanStationComponent', () => {
  let component: PlanStationComponent;
  let fixture: ComponentFixture<PlanStationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlanStationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanStationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
