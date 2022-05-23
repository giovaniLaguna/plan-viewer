import { Component, OnInit, ChangeDetectionStrategy, Input, ElementRef, Renderer2 } from '@angular/core';
import { merge, observeOn, animationFrameScheduler } from 'rxjs';
import { PlanRoomComponent } from '../plan-room/plan-room.component';
import { PlanViewerComponent } from '../plan-viewer/plan-viewer.component';

type TPosition = {
  x: number;
  y: number;
}

@Component({
  selector: 'app-plan-station',
  templateUrl: './plan-station.component.html',
  styleUrls: ['./plan-station.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PlanStationComponent implements OnInit {
  @Input() set stationRelativePosition(position: TPosition) { this.setStationRelativePosition(position); }
  @Input() set planRelativePosition(position: TPosition) { this.setPlanRelativePosition(position);  }
  @Input() label: string = 'A11';
  _stationRelativePosition: TPosition = {
    x: 50,
    y: 50
  };

  get planRelativePosition() {
    return {
      x: this.planRoomComponent.position.x + this.stationRelativePosition.x,
      y: this.planRoomComponent.position.y + this.stationRelativePosition.y,
    }
  }

  get stationRelativePosition() {
    return this._stationRelativePosition;
  }

  computedData = {
    position: {
      x: 0,
      y: 0
    },
    display: true,
  }

  private element: HTMLElement;

  constructor(
    private planViewerComponent: PlanViewerComponent,
    private planRoomComponent: PlanRoomComponent,
    private renderer: Renderer2,
    private ef: ElementRef<HTMLElement>,
  ) {
    this.element = ef.nativeElement;
  }

  ngOnInit(): void {
    this.update();
    merge(
      this.planRoomComponent.configChanges$,
      this.planViewerComponent.configChanges$,
    ).pipe(
      observeOn(animationFrameScheduler)
    ).subscribe(() => {
      this.update();
    });
  }

  update() {
    const viewScale = this.planViewerComponent.viewScale;

    this.computedData.position.x = (this.stationRelativePosition.x) * viewScale;
    this.computedData.position.y = (this.stationRelativePosition.y) * viewScale;

    this.render();
  }

  private render() {
    this.renderer.setStyle(
      this.element,
      'display',
      this.computedData.display ? 'block' : 'none'
    );

    this.renderer.setStyle(
      this.element,
      'transform',
      `translateX(${this.computedData.position.x}px) translateY(${this.computedData.position.y}px)`
    );
  }

  setPlanRelativePosition(position: TPosition) {
    this.setStationRelativePosition({
      x: position.x - this.planRoomComponent.position.x,
      y: position.y - this.planRoomComponent.position.y,
    });

    this.update();
  }

  setStationRelativePosition(position: TPosition) {
    this._stationRelativePosition = {
      x: position.x,
      y: position.y
    }

    this.update();
  }
}
