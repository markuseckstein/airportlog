/**
 * Created by marku on 05.01.2016.
 */
import {bootstrap} from 'angular2/platform/browser'
import {AppComponent} from './app.component'
import {
    MapsAPILoader,
    NoOpMapsAPILoader,
    MapMouseEvent,
    ANGULAR2_GOOGLE_MAPS_PROVIDERS,
    ANGULAR2_GOOGLE_MAPS_DIRECTIVES
} from 'angular2-google-maps/core';
import {LocationService} from './services/LocationService'

bootstrap(AppComponent, [
    ANGULAR2_GOOGLE_MAPS_PROVIDERS,  LocationService
    // If you don't want to let angular2-google-maps load the Google Maps API script,
    // you can use the NoOpMapsAPILoader like this:
    // provide(MapsAPILoader, {useClass: NoOpMapsAPILoader})
    
])//.catch(err => console.error(err));
