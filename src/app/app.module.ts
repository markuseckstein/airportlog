import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { AirportListComponent } from './airport-list/airport-list.component';
import { AppComponent } from './app.component';
import { LocationService } from './location.service';
import { MapComponent } from './map/map.component';
import { StorageService } from './storage/storage.service';
import { AgmCoreModule } from '@agm/core';

@NgModule({
    declarations: [AppComponent, MapComponent, AirportListComponent],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        MatListModule,
        MatButtonModule,
        MatCardModule,
        FlexLayoutModule,
        HttpClientModule,
        AgmCoreModule.forRoot({
            apiKey: 'AIzaSyBMtBOOFug9a9ELRA76AkknR1biKR2KFvI'
        }),
        LeafletModule.forRoot()
    ],
    providers: [LocationService, StorageService],
    bootstrap: [AppComponent]
})
export class AppModule {}
