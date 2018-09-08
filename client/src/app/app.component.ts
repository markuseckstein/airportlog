import {Component} from '@angular/core';
import {LocationService} from './location.service';
import {Airport} from './shared/airport';


@Component({
  moduleId: module.id,
  selector: 'app-app',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  public selectedAirport: Airport | null;

  public get isSmall(): boolean {
    return !!this.selectedAirport;
  }


  constructor(public locationService: LocationService) {
  }

  onClearCache(): void {
    this.locationService.reload();
  }
}

