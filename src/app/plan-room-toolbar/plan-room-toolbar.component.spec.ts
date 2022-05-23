import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanRoomToolbarComponent } from './plan-room-toolbar.component';

describe('PlanRoomToolbarComponent', () => {
  let component: PlanRoomToolbarComponent;
  let fixture: ComponentFixture<PlanRoomToolbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlanRoomToolbarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanRoomToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
