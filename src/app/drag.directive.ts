import { DOCUMENT } from '@angular/common';
import { Directive, ElementRef, Inject, Output, EventEmitter, Input } from '@angular/core';
import { debounce, filter, fromEvent, map, merge, of, Subject, switchMap, take, takeUntil, throttleTime } from 'rxjs';

interface DragEvent {
  eventType: 'dragstart' | 'dragging' | 'dragend',
  startPosition: {
    x: number;
    y: number;
  },
  position: {
    x: number;
    y: number;
  }
}

interface DragEventWithOffset extends DragEvent {
  offset: {
    x: number;
    y: number;
  }
}


export function observeDraggingToElement(config: {
  element: HTMLElement,
  document: HTMLElement,
  throttleDuration?: number,
  filter?: (event: MouseEvent) => boolean
}) {
  const mouseDown$ = fromEvent<MouseEvent>(config.element, "mousedown").pipe(
    filter(config.filter ?? (() => true))
  );
  const mouseUp$ = fromEvent<MouseEvent>(config.document, "mouseup");

  return mouseDown$.pipe(
    map(e => ({
      type: 'dragstart',
      startPosition: {
        x: e.clientX,
        y: e.clientY,
      },
      position: {
        x: e.clientX,
        y: e.clientY
      }
    })),
    map((dragStartEvent) => merge(
      of(dragStartEvent),
      fromEvent<MouseEvent>(config.document, "mousemove").pipe(
        map(e => ({
          type: 'dragging',
          startPosition: {
            x: dragStartEvent.startPosition.x,
            y: dragStartEvent.startPosition.y,
          },
          position: {
            x: e.clientX,
            y: e.clientY
          }
        })),
        throttleTime(config.throttleDuration ?? 1),
        takeUntil(mouseUp$),
      ),
      mouseUp$.pipe(
        take(1),
        map(e => ({
          type: 'dragend',
          startPosition: {
            x: dragStartEvent.startPosition.x,
            y: dragStartEvent.startPosition.y,
          },
          position: {
            x: e.clientX,
            y: e.clientY
          }
        }))
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

  @Output() dragStart = new EventEmitter<DragEventWithOffset>();
  @Output() dragging = new EventEmitter<DragEventWithOffset>();
  @Output() dragEnd = new EventEmitter<DragEventWithOffset>();
  @Output() drag = new EventEmitter<DragEventWithOffset>();

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
