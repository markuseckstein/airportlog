import {Component, OnInit} from '@angular/core';
import {GOOGLE_MAPS_DIRECTIVES} from 'angular2-google-maps/core';
import {LocationService} from './location.service';
import {Airport} from './shared';


@Component({
  moduleId: module.id,
  selector: 'my-app',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.css'],
  directives: [GOOGLE_MAPS_DIRECTIVES],
  providers: [LocationService]
})
export class AppComponent implements OnInit {
  public selectedAirport: Airport;

  public markers: Airport[] = [];

  public get numberOfAirports(): number {
    return this.markers.length;
  }

  // google maps zoom level
  zoom: number = 2;

  // initial center position for the map
  lat: number = 51.673858;
  lng: number = 7.815982;

  constructor(private locationService: LocationService) {
  }


  ngOnInit(): any {
    this.locationService.airports$.subscribe((apt: Airport) => {
      this.markers.push(apt);
    });
  }

  clickedMarker(marker: Airport) {
    this.selectedAirport = marker;
  }

  load() {
    this.locationService.loadAirports();
  }
}

