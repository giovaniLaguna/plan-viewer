import { Component, OnInit, ChangeDetectionStrategy, Input, Output, EventEmitter, Renderer2, ElementRef } from '@angular/core';
import { PlanViewerComponent } from '../plan-viewer/plan-viewer.component';
import { toObservableObject } from '../to-observable-object';
import { animationFrameScheduler, merge, observeOn } from 'rxjs';

type TPosition = { x: number, y: number };
type TSize = { width: number, height: number };

@Component({
  selector: 'app-plan-room',
  templateUrl: './plan-room.component.html',
  styleUrls: ['./plan-room.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PlanRoomComponent implements OnInit {
  @Input() position: TPosition = { x: 100, y: 100 };
  @Output() positionChange = new EventEmitter<TPosition>();
  @Input() size: TSize = { width: 200, height: 200 };
  @Output() sizeChange = new EventEmitter<TSize>();

  @Output() roomClick = new EventEmitter(); // (positionRelativeToObject, positionRelativeToPlanta)
  @Output() roomDblClick = new EventEmitter(); // (positionRelativeToObject, positionRelativeToPlanta)

  // -----

  @Input() shape: 'rect' | 'oval' = 'rect';
  @Input() selected = false;
  @Input() description = ''; // [titulo da sala]
  @Input() resizeAllowed = true; // [se pode redimencionar ou não]
  @Input() dragAllowed = true; // [se pode arrastar ou não]
  @Input() shouldShowToolbar = false; // [se pode exibir a toolbar quando selecionado]

  @Output() delete = new EventEmitter();
  @Output() edit = new EventEmitter();
  @Output() save = new EventEmitter();

  config = toObservableObject({
    position: {
      x: 0,
      y: 0,
    },
    size: {
      width: 0,
      height: 0,
    }
  });

  configChanges$ = this.config.observation$.pipe(
    observeOn(animationFrameScheduler)
  );

  computedData = {
    position: { x: 0, y: 0 },
    size: { width: 200, height: 200 },
    display: true, // caso esteja completamente fora da um display none para economizar recursos
  }

  private element: HTMLElement;

  constructor(
    private planViewerComponent: PlanViewerComponent,
    private renderer: Renderer2,
    private ef: ElementRef<HTMLElement>,
  ) {
    this.element = ef.nativeElement;
  }

  ngOnInit(): void {
    merge(
      this.planViewerComponent.configChanges$,
      this.configChanges$
    ).subscribe(() => {
      this.update();
    });
  }

  update() {
    const viewScale = this.planViewerComponent.viewScale;
    const parentPosition = this.planViewerComponent.config.position;

    this.computedData.size.height = this.size.height * viewScale;
    this.computedData.size.width = this.size.width * viewScale;
    this.computedData.position.x = (this.position.x + parentPosition.x) * viewScale;
    this.computedData.position.y = (this.position.y + parentPosition.y) * viewScale;
    console.log(this.computedData);

    this.render();
  }

  private render() {
    this.renderer.setStyle(
      this.element,
      'width',
      `${this.computedData.size.width}px`
    );

    this.renderer.setStyle(
      this.element,
      'height',
      `${this.computedData.size.height}px`
    );

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
    console.log(`translateX(${this.computedData.position.x}px) translateY(${this.computedData.position.y}px)`);
  }

}
