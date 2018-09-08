import { Component } from "@angular/core";
import { Airport } from "./shared/airport";
import { AirportService } from "./shared/airport.service";

@Component({
  moduleId: module.id,
  selector: "app-app",
  templateUrl: "app.component.html",
  styleUrls: ["app.component.scss"]
})
export class AppComponent {
  public selectedAirport: Airport | null;

  public get isSmall(): boolean {
    return !!this.selectedAirport;
  }

  constructor(public airportService: AirportService) {}

  onClearCache(): void {
    this.airportService.init();
  }
}
