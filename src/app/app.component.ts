import { Component } from '@angular/core';
import { Airport } from './shared/airport';
import { LocationService } from './location.service';

@Component({
    selector: 'app-app',
    templateUrl: 'app.component.html',
    styleUrls: ['app.component.scss'],
})
export class AppComponent {
    public selectedAirport: Airport | null;

    public get isSmall(): boolean {
        return !!this.selectedAirport;
    }

    constructor(public airportService: LocationService) {}

    onClearCache(): void {
        this.airportService.reload();
    }
}
