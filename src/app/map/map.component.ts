import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Airport} from '../shared/airport';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent {
  @Input() public markers: Airport[] = [];
 @Output() public selectAirport = new EventEmitter<Airport>();


  // google maps zoom level
  public zoom = 2;

  // initial center position for the map
  public lat = 51.673858;
  public lng = 7.815982;

}
