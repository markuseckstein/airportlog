import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { Airport } from "../shared/airport";

@Component({
  selector: "app-airport-list",
  templateUrl: "./airport-list.component.html",
  styleUrls: ["./airport-list.component.css"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AirportListComponent {
  @Input()
  airports: Airport[];

  trackByCode(airport: Airport) {
    return airport.code;
  }
}
