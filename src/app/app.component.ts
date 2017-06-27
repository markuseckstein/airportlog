import {AgmMap} from '@agm/core';
import {Component, OnInit, ViewChild} from '@angular/core';
import {LocationService} from './location.service';
import {Airport} from './shared';


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

  @ViewChild(AgmMap) gMap: AgmMap;

  constructor(private locationService: LocationService) {
  }


  ngOnInit(): any {
    this.locationService.airports$.subscribe((apt: Airport) => {
      this.markers.push(apt);
    });
  }

  clickedMarker($event: any, marker: Airport) {
    this.selectedAirport = marker;
    console.log('Event', $event);
  }

  load() {
    this.locationService.loadAirports();
  }

}

