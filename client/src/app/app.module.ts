import { AgmCoreModule } from '@agm/core';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { MapComponent } from './map/map.component';
import { AirportListComponent } from './airport-list/airport-list.component';
import { StorageService } from './storage/storage.service';
import { LocationService } from './location.service';
import { MatListModule, MatButtonModule, MatCardModule } from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';

@NgModule({
  declarations: [
    AppComponent,
    MapComponent,
    AirportListComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatListModule,
    MatButtonModule,
    MatCardModule,
    FlexLayoutModule,
    AgmCoreModule.forRoot({ apiKey: 'AIzaSyA_lAD_OEbsMXiDdOYBsertaqgTbPKhj_E' })
  ],
  providers: [LocationService, StorageService],
  bootstrap: [AppComponent]
})
export class AppModule {
}

