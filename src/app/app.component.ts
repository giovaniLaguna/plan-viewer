import { KeyValue } from '@angular/common';
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
  newDrawCount = 0;
  newDraws: Map<string, {
    position: {
      x: number,
      y: number,
    },
    size: {
      width: number,
      height: number,
    }
  }> = new Map();

  onDraw(event: Observable<{
    position: {
      x: number,
      y: number,
    },
    size: {
      width: number,
      height: number,
    }
  }>) {
    const id = 'newDraw-' + this.newDrawCount++;
    event.subscribe(draw => {
      const minimumSize = 10; // menor tamanho possivel de um desenho
      if(draw.size.width > minimumSize && draw.size.height > minimumSize) {
        this.newDraws.set(id, draw)
      } else {
        this.newDraws.delete(id);
      }
    });
  }

  trackByKey<K = any, V = any>(index: number, keyValue: KeyValue<K, V>) {
    return keyValue.key;
  }
}
