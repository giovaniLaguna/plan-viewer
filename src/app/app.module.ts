import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { PlanViewerComponent } from './plan-viewer/plan-viewer.component';
import { DragDirective } from './drag.directive';
import { PlanRoomComponent } from './plan-room/plan-room.component';
import { PlanRoomToolbarComponent } from './plan-room-toolbar/plan-room-toolbar.component';
import { PlanStationComponent } from './plan-station/plan-station.component';
import { PlanMinimapComponent } from './plan-minimap/plan-minimap.component';

@NgModule({
  declarations: [
    AppComponent,
    PlanViewerComponent,
    DragDirective,
    PlanRoomComponent,
    PlanRoomToolbarComponent,
    PlanStationComponent,
    PlanMinimapComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
