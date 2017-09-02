import {Component, OnInit} from '@angular/core';
import {LocationService} from './location.service';
import {Airport} from './shared/airport';


@Component({
  moduleId: module.id,
  selector: 'app-app',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  providers: [LocationService]
})
export class AppComponent implements OnInit {
  public selectedAirport: Airport;

  public markers: Airport[] = [];

  public get numberOfAirports(): number {
    return this.markers.length;
  }

  // google maps zoom level
  zoom = 2;

  // initial center position for the map
  lat = 51.673858;
  lng = 7.815982;

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
}

