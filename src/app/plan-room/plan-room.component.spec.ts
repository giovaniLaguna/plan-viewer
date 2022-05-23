import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanRoomComponent } from './plan-room.component';

describe('PlanRoomComponent', () => {
  let component: PlanRoomComponent;
  let fixture: ComponentFixture<PlanRoomComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlanRoomComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanRoomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
