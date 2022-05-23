import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanMinimapComponent } from './plan-minimap.component';

describe('PlanMinimapComponent', () => {
  let component: PlanMinimapComponent;
  let fixture: ComponentFixture<PlanMinimapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlanMinimapComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanMinimapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
