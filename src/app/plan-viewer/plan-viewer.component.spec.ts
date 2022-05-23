import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanViewerComponent } from './plan-viewer.component';

describe('PlanViewerComponent', () => {
  let component: PlanViewerComponent;
  let fixture: ComponentFixture<PlanViewerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlanViewerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
