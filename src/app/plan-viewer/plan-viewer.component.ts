import { DOCUMENT } from '@angular/common';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, HostListener, Inject, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Observable, tap, switchMap, animationFrames, map, Subject, animationFrameScheduler, observeOn, startWith, distinctUntilChanged } from 'rxjs';
import { MouseDragEvent, observeDraggingToElement } from '../drag.directive';
import { PlanRoomComponent } from '../plan-room/plan-room.component';
import { toObservableObject } from '../to-observable-object';

type TPosition = { x: number, y: number };
type TSize = { width: number, height: number };

@Component({
  selector: 'app-plan-viewer',
  templateUrl: './plan-viewer.component.html',
  styleUrls: ['./plan-viewer.component.scss'],
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class PlanViewerComponent implements OnInit {
  @ViewChild('canvas', { static: true }) private canvasRef?: ElementRef<HTMLCanvasElement>;
  private canvasContext?: CanvasRenderingContext2D;

  // plant
  @Input() src?: string;
  image = new Image();

  // zoom
  @Input() set autoZoom(value: boolean) { this.setAutoZoom(value) };
  @Input() set zoom(value: number) { this.setZoom(value) };
  @Output() zoomChange = new EventEmitter<number | undefined>();

  // scale
  @Input() set virtualViewSize(value: number | undefined | null) { this.setVirtualViewSize(value) };
  @Input() set autoScale(value: boolean) { this.setAutoScale(value) };
  @Input() set scale(value: number) { this.setScale(value) };
  @Output() scaleChange = new EventEmitter<number | undefined>();

  // position
  @Input() set position(value: TPosition) { this.setPosition(value) };
  @Output() positionChange = new EventEmitter<TPosition>();
  @Input() canMove = true;

  @Output() mouseDraw = new EventEmitter<{
    position: TPosition;
    size: TSize;
  }>();

  private element: HTMLElement;
  get height() { return this.element.clientHeight };
  get width() { return this.element.clientWidth };

  config = toObservableObject({
    scale: 1,
    autoScale: true,
    zoom: 1,
    autoZoom: true,
    minZoom: 0,
    maxZoom: Infinity,
    virtualViewSize: 1280 as number | null | undefined,
    position: {
      x: 0,
      y: 0,
    }
  });

  configChanges$ = this.config.observation$.pipe(
    startWith(this.config),
    observeOn(animationFrameScheduler)
  );

  get viewScale() {
    return this.config.scale * this.config.zoom;
  }

  viewComputedData = {
    image: {
      width: 0,
      height: 0,
      x: 0,
      y: 0,
    },
  }

  constructor(
    el: ElementRef,
    @Inject(DOCUMENT) private document: HTMLElement
  ) {
    this.element = el.nativeElement;
  }

  async ngOnInit(): Promise<void> {
    this.canvasContext = this.canvasRef?.nativeElement.getContext('2d') as CanvasRenderingContext2D;

    if (this.src) {
      this.image.src = this.src;
      await new Promise((resolve, reject) => {
        this.image.addEventListener('load', resolve);
        this.image.addEventListener('error', reject);
      });
    }

    this.updateCanvasSize();

    if(this.config.autoScale) {
      this.applyAutoScale();
    }

    if(this.config.autoZoom) {
      this.applyAutoZoom();
    }
  }

  ngAfterViewInit(): void {
    let i = 0;
    this.configChanges$.pipe(
      tap(x => console.log('configChanged', i++))
    ).subscribe(() => this.draw());

    const canvasDragEvent = observeDraggingToElement({
      element: this.canvasRef!.nativeElement,
      document: this.document
    });

    const convertDragEventToDraw = (event: MouseDragEvent) => {
      const offset = event.getOffsetPosition();

      const size = {
        width: Math.abs(offset.x),
        height: Math.abs(offset.y),
      }

      const position = {
        x: event.startPosition.x < event.position.x ?  event.startPosition.x : event.startPosition.x - size.width,
        y: event.startPosition.y < event.position.y ?  event.startPosition.y : event.startPosition.y - size.height,
      };

      return {
        size,
        position
      };
    }

    const draws$ = canvasDragEvent.pipe(
      switchMap( dragEventsObservable => dragEventsObservable.pipe(
        map( event => convertDragEventToDraw(event))
      ))
    );

    const realScaleDraws$ = draws$.pipe(
      map(draw => ({
        position: {
          x: draw.position.x / this.viewScale,
          y: draw.position.y / this.viewScale,
        },
        size: {
          width: draw.size.width / this.viewScale,
          height: draw.size.height / this.viewScale,
        },
      })
    ));

    realScaleDraws$.subscribe(draw => this.mouseDraw.next(draw));


    // canvasDragEvent.subscribe(({ startCanvasPosition, event}) => {
    //   if (this.canMove) {
    //     const x = startCanvasPosition.x + event.position.x - event.startPosition.x;
    //     const y = startCanvasPosition.y + event.position.y - event.startPosition.y;

    //     const imageCanvasSize = {
    //       height: this.image.height * this.viewScale,
    //       width: this.image.width * this.viewScale,
    //     }

    //     const maxY = Math.max(this.height - imageCanvasSize.height, 0);
    //     const minY = Math.min(this.height - imageCanvasSize.height, 0);
    //     const maxX = Math.max(this.width - imageCanvasSize.width, 0);
    //     const minX = Math.min(this.width - imageCanvasSize.width, 0);

    //     const canvasPosition = {
    //       x: x > maxX ? maxX : (x < minX ? minX : x),
    //       y: y > maxY ? maxY : (y < minY ? minY : y)
    //     };

    //     const position = {
    //       x: canvasPosition.x / this.viewScale,
    //       y: canvasPosition.y / this.viewScale,
    //     };

    //     this.setPosition(position);
    //   }
    // });
  }

  applyAutoScale() {
    // caso a imagem seja muito grande reduz o zoom para caber na tela, se não mantem o zoom normal
    this.setScale(this.config.virtualViewSize ? this.width / this.config.virtualViewSize : 1);
  }

  applyAutoZoom() {
    const scaledImageWidth = this.image.width * this.config.scale;
    console.log(this.config.scale, scaledImageWidth);
    this.setZoom(scaledImageWidth >= this.width ? this.width / scaledImageWidth : 1);
  }

  // PUBLIC API

  draw() {
    this.viewComputedData = this.computeDrawData({
      viewScale: this.viewScale,
      position: this.config.position,
      image: {
        height: this.image.height,
        width: this.image.width,
      }
    });

    console.log(this.image.width);
    console.log(this.viewComputedData);

    this.render();
  }

  @HostListener('window:resize')
  resize() {
    this.updateCanvasSize();

    if(this.config.autoScale) {
      console.log('applying auto scale')
      this.applyAutoScale();
    }

    this.draw();
  }

  setAutoScale(value: boolean) {
    this.config.autoScale = value;
  }

  setAutoZoom(value: boolean) {
    this.config.autoZoom = value;
  }

  setZoom(zoom: number) {
    const parsedValue = zoom > this.config.maxZoom ? this.config.maxZoom : (zoom < this.config.minZoom ? this.config.minZoom : zoom);

    this.config.zoom = parsedValue;
    this.zoomChange.emit(zoom);
  }

  setScale(scale: number) {
    this.config.scale = scale;
    this.scaleChange.emit(scale);
  }

  setVirtualViewSize(size: number | undefined | null) {
    this.config.virtualViewSize = size;
  }

  setPosition(position: { x: number, y: number }) {
    this.config.position = position;
    this.positionChange.emit(position);
  }

  // PRIVATE API


  private computeDrawData(data: {
    viewScale: number,
    image: {
      height: number,
      width: number,
    },
    position: {
      x: number,
      y: number,
    }
  }) {
    return {
      image: {
        width: data.image.width * data.viewScale,
        height: data.image.height * data.viewScale,
        x: data.position.x * data.viewScale,
        y: data.position.y * data.viewScale
      }
    }
  }

  private render() {
    this.canvasContext?.clearRect(0, 0, this.width, this.height);
    this.canvasContext?.moveTo(0, 0);
    // this.canvasContext?.lineTo(this.width, this.height);
    // this.canvasContext?.stroke();

    // this.canvasContext!.imageSmoothingEnabled = false;
    this.canvasContext?.drawImage(
      this.image,
      this.viewComputedData.image.x,
      this.viewComputedData.image.y,
      this.viewComputedData.image.width,
      this.viewComputedData.image.height,
    );
  }

  private updateMaxZoom() {
    // todo
    // this.maxZoom = this.image.width
    // ou computar por um get
  }

  private updateCanvasSize() {
    this.canvasRef!.nativeElement.width = this.width;
    this.canvasRef!.nativeElement.height = this.height;
  }
}
