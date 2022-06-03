import { DOCUMENT } from '@angular/common';
import { Directive, ElementRef, Inject, Output, EventEmitter, Input } from '@angular/core';
import { debounce, filter, fromEvent, map, merge, of, Subject, switchMap, take, takeUntil, throttleTime, Observable } from 'rxjs';

export class MouseDragEvent {
  static fromMouseEvent(event: MouseEvent, startPosition?: { x: number, y: number }) {
    const type = event.type == 'mousedown' ? 'dragstart' : event.type == 'mouseup' ? 'dragend' : 'drag';

    const position = {
      x: event.clientX,
      y: event.clientY,
    }

    const _startPosition = startPosition ? {
      x: startPosition.x,
      y: startPosition.y
    }: {
      x: position.x,
      y: position.y,
    }

    return new MouseDragEvent(
      type,
      position,
      _startPosition
    );

  }

  constructor(
    public type: 'dragstart' | 'drag' | 'dragend',
    public position: {
      x: number,
      y: number,
    },
    public startPosition: {
      x: number,
      y: number,
    }
  ) { }

  getOffsetPosition() {
    return {
      x: this.position.x - this.startPosition.x,
      y: this.position.y - this.startPosition.y,
    };
  }

}


export function observeDraggingToElement(config: {
  element: HTMLElement,
  document: HTMLElement,
  throttleDuration?: number,
  filter?: (event: MouseEvent) => boolean
}): Observable<Observable<MouseDragEvent>> {
  const mouseDown$ = fromEvent<MouseEvent>(config.element, "mousedown").pipe(
    filter(config.filter ?? (() => true))
  );
  const mouseUp$ = fromEvent<MouseEvent>(config.document, "mouseup");

  return mouseDown$.pipe(
    map(event => new MouseDragEvent(
      'dragstart', // type
      { x: event.clientX, y: event.clientY }, // position
      { x: event.clientX, y: event.clientY }, // start position
    )),
    map((dragStartEvent: MouseDragEvent) => merge(
      of(dragStartEvent),
      fromEvent<MouseEvent>(config.document, "mousemove").pipe(
        map(event => new MouseDragEvent(
          'drag', // type
          { x: event.clientX, y: event.clientY }, // position
          { x: dragStartEvent.startPosition.x, y: dragStartEvent.startPosition.y, }, // start position
        )),
        throttleTime(config.throttleDuration ?? 1),
        takeUntil(mouseUp$),
      ),
      mouseUp$.pipe(
        take(1),
        map(event => new MouseDragEvent(
          'dragend', // type
          { x: event.clientX, y: event.clientY }, // position
          { x: dragStartEvent.startPosition.x, y: dragStartEvent.startPosition.y, }, // start position
        )),
      )
    )
    ),
  )
}

@Directive({
  selector: '[appDrag]'
})
export class DragDirective {
  private element: HTMLElement;
  private destroy$ = new Subject<void>();

  @Input() throttleDuration = 1;

  @Output() dragStart = new EventEmitter<MouseDragEvent>();
  @Output() dragging = new EventEmitter<MouseDragEvent>();
  @Output() dragEnd = new EventEmitter<MouseDragEvent>();
  @Output() drag = new EventEmitter<MouseDragEvent>();

  constructor(
    elementRef: ElementRef<HTMLElement>,
    @Inject(DOCUMENT) private document: HTMLElement
  ) {
    this.element = elementRef.nativeElement;
  }

  ngOnInit() {
    observeDraggingToElement({
      element: this.element,
      document: this.document,
      throttleDuration: this.throttleDuration
    }).subscribe(x => {
      console.log(x);
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
