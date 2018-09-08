import {
  Component,
  EventEmitter,
  Input,
  Output,
  ChangeDetectionStrategy
} from "@angular/core";
import { tileLayer, latLng, marker, icon } from "leaflet";
import { AirportsByCodes_airportSearchByCodes } from "../shared/queries/AirportsByCodes";

@Component({
  selector: "app-map",
  templateUrl: "./map.component.html",
  styleUrls: ["./map.component.css"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MapComponent {
  @Input()
  public set markers(value: AirportsByCodes_airportSearchByCodes[]) {
    this.layers = [];
    if (value && value.length > 0) {
      value.forEach(apt => {
        this.layers.push(
          marker([apt.coordinates.latitude, apt.coordinates.longitude], {
            icon: icon({
              iconSize: [25, 41],
              iconAnchor: [13, 41],
              iconUrl: "leaflet/marker-icon.png",
              shadowUrl: "leaflet/marker-shadow.png"
            })
          })
        );
      });
    }
  }

  public get markers(): AirportsByCodes_airportSearchByCodes[] {
    return null;
  }

  @Output()
  public selectAirport = new EventEmitter<
    AirportsByCodes_airportSearchByCodes
  >();

  public options = {
    layers: [
      tileLayer("http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 18,
        attribution: "..."
      })
    ],
    zoom: 2,
    center: latLng(51.673858, 7.815982)
  };

  public layers = [];
}
