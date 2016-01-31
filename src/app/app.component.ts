
import {Component} from 'angular2/core';

import {
    MapsAPILoader,
    NoOpMapsAPILoader,
    MapMouseEvent,
    ANGULAR2_GOOGLE_MAPS_PROVIDERS,
    ANGULAR2_GOOGLE_MAPS_DIRECTIVES
} from 'angular2-google-maps/core';

import {LocationService} from "./services/LocationService";
import {Airport} from "./services/LocationService";


@Component({
    selector: 'my-app',
    directives: [ANGULAR2_GOOGLE_MAPS_DIRECTIVES],
    templateUrl: 'src/app/templates/app.component.html'
})

export class AppComponent {
    private _locationService:LocationService;

    constructor(locationService:LocationService) {
        this._locationService = locationService;
        this.numberOfAirports = this._locationService.numOfAirports;
        this.numberOfPromises = this._locationService.numOfPromises;
        this.theTime = new Date();
        window.setInterval(() => {
            this.theTime = new Date();
        }, 1000);

    }

    public theTime:Date;

    public selectedAirport:string;

    public markers:Airport[] = [];

    public numberOfAirports:number;

    public numberOfPromises:number;

    // google maps zoom level
    zoom:number = 2;

    // initial center position for the map
    lat:number = 51.673858;
    lng:number = 7.815982;

    clickedMarker(label:string, marker:Airport) {
        this.selectedAirport = label;
    }

   
    clickHandler() {
        this._locationService.getAirportLocations()
            .then((airports) => {
                console.log("Got all airports");
            })
            .catch((whatever) => {
                console.log("Some airports missing...");
                //debugger;
                console.log(whatever);
            });
        this.markers = this._locationService._airports;
        this.numberOfPromises = this._locationService.numOfPromises;
    }
}

