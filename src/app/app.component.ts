import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { MouseDragEvent } from './drag.directive';

type TPosition = { x: number, y: number };

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'plan-viewer';

  newDraw?: {
    position: {
      x: number,
      y: number,
    },
    size: {
      width: number,
      height: number,
    }
  };

  onDraw(event: {
    position: {
      x: number,
      y: number,
    },
    size: {
      width: number,
      height: number,
    }
  }) {
    this.newDraw = event;
  }
}
