import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { AirportsByCodes_airportSearchByCodes } from "../shared/queries/AirportsByCodes";

@Component({
  selector: "app-airport-list",
  templateUrl: "./airport-list.component.html",
  styleUrls: ["./airport-list.component.css"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AirportListComponent {
  @Input()
  airports: AirportsByCodes_airportSearchByCodes[];

  trackByCode(airport: AirportsByCodes_airportSearchByCodes) {
    return airport.ident;
  }
}
