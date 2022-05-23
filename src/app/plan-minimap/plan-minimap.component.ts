import { Component, OnInit, ChangeDetectionStrategy, ViewChild, ElementRef, Input } from '@angular/core';
import { PlanViewerComponent } from '../plan-viewer/plan-viewer.component';

@Component({
  selector: 'app-plan-minimap',
  templateUrl: './plan-minimap.component.html',
  styleUrls: ['./plan-minimap.component.scss'],
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class PlanMinimapComponent implements OnInit {
  @ViewChild('canvas', { static: true }) private miniCanvasRef?: ElementRef<HTMLCanvasElement>;
  private miniCanvasContext?: CanvasRenderingContext2D;

  @Input() set width(value: number) { this.setWidth(value) }

  get width() {
    return this._width;
  }
  private _width: number = 300;

  viewComputedData = {
    miniCanvasSize: {
      width: 0,
      height: 0,
    },
    image: {
      width: 0,
      height: 0,
      x: 0,
      y: 0,
    },
    visibleArea: {
      height: 0,
      width: 0,
      x: 0,
      y: 0,
    }
  }

  constructor(
    public planViewerComponent: PlanViewerComponent
  ) { }

  ngOnInit(): void {
    this.miniCanvasContext = this.miniCanvasRef?.nativeElement.getContext('2d') as CanvasRenderingContext2D;

    this.update();
    this.planViewerComponent.configChanges$.subscribe(() => {
      this.update();
    });
  }

  computeDrawData(data: {
    zoom: number,
    scale: number,
    position: { x: number, y: number },
    image: {
      height: number,
      width: number,
    },
    canvas: {
      height: number,
      width: number,
    },
    miniCanvasWidth: number,
  }) {
    // const viewScale = data.zoom * data.scale;

    const miniCanvasProportion = (data.miniCanvasWidth / data.canvas.width);

    const fitImageProportion = data.miniCanvasWidth / (data.image.width * data.scale * miniCanvasProportion);
    const miniCanvasSize = {
      width: data.miniCanvasWidth,
      // height: data.canvas.height * miniCanvasProportion,
      height: data.image.height * data.scale * miniCanvasProportion * fitImageProportion,
    }

    // const scaledImage = {
    //   width: data.image.width * data.scale,
    //   height: data.image.height * data.scale,
    // }

    // const fitImageProportion = 1;

    const image = {
      width: data.image.width * data.scale * miniCanvasProportion * fitImageProportion,
      height: data.image.height * data.scale * miniCanvasProportion * fitImageProportion,
      x: 0,
      y: 0,
    }

    // const imageProportion = (data.miniCanvasWidth / data.miniCanvasWidth);

    const visibleArea = {
      width: (data.canvas.width * miniCanvasProportion * fitImageProportion) / data.zoom,
      height: (data.canvas.height * miniCanvasProportion * fitImageProportion) / data.zoom,
      x: (-data.position.x * data.zoom * data.scale * miniCanvasProportion * fitImageProportion) / data.zoom,
      y: (-data.position.y * data.zoom * data.scale *  miniCanvasProportion * fitImageProportion) / data.zoom,
    }

    return {
      miniCanvasSize,
      image,
      visibleArea,
    }
  }

  update() {
    this.viewComputedData = this.computeDrawData({
      miniCanvasWidth: this.width,
      zoom: this.planViewerComponent.config.zoom,
      scale: this.planViewerComponent.config.scale,
      canvas: {
        height: this.planViewerComponent.height,
        width: this.planViewerComponent.width,
      },
      image: {
        width: this.planViewerComponent.image.width,
        height: this.planViewerComponent.image.height
      },
      position: {
        x: this.planViewerComponent.config.position.x,
        y: this.planViewerComponent.config.position.y,
      }
    });
    this.render();
  }

  render() {
    this.miniCanvasRef!.nativeElement.height = this.viewComputedData.miniCanvasSize.height;
    this.miniCanvasRef!.nativeElement.width = this.viewComputedData.miniCanvasSize.width;

    const canvasContext = this.miniCanvasContext!;

    canvasContext.clearRect(
      0,
      0,
      this.viewComputedData.miniCanvasSize.width,
      this.viewComputedData.miniCanvasSize.height
    );

    canvasContext.moveTo(0, 0);

    canvasContext.drawImage(
      this.planViewerComponent.image,
      this.viewComputedData.image.x,
      this.viewComputedData.image.y,
      this.viewComputedData.image.width,
      this.viewComputedData.image.height,
    );

    canvasContext.fillStyle = 'rgba(0,0,0,0.2)';
    canvasContext.fillRect(
      this.viewComputedData.visibleArea.x,
      this.viewComputedData.visibleArea.y,
      this.viewComputedData.visibleArea.width,
      this.viewComputedData.visibleArea.height,
    );

  }

  setWidth(width: number) {
    this._width = width;
  }

}
