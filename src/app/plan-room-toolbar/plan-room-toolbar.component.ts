import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-plan-room-toolbar',
  templateUrl: './plan-room-toolbar.component.html',
  styleUrls: ['./plan-room-toolbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PlanRoomToolbarComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
