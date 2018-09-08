import { HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { FlexLayoutModule } from "@angular/flex-layout";
import {
  MatButtonModule,
  MatCardModule,
  MatListModule
} from "@angular/material";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { LeafletModule } from "@asymmetrik/ngx-leaflet";
import { ApolloBoost, ApolloBoostModule } from "apollo-angular-boost";
import { AirportListComponent } from "./airport-list/airport-list.component";
import { AppComponent } from "./app.component";
import { LocationService } from "./location.service";
import { MapComponent } from "./map/map.component";
import { StorageService } from "./storage/storage.service";

@NgModule({
  declarations: [AppComponent, MapComponent, AirportListComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatListModule,
    MatButtonModule,
    MatCardModule,
    FlexLayoutModule,
    ApolloBoostModule,
    HttpClientModule,
    LeafletModule.forRoot()
  ],
  providers: [LocationService, StorageService],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(boost: ApolloBoost) {
    boost.create({
      uri: "http://localhost:4000/graphql"
    });
  }
}
