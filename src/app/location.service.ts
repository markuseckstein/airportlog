import {Injectable} from '@angular/core';
import {Airport} from './shared';
import {airportCodes} from './airports';
import {MapsAPILoader} from 'angular2-google-maps/core/services/maps-api-loader/maps-api-loader';
import {Observable, Subject} from 'rxjs/Rx';
import 'rxjs/add/operator/timeInterval';

declare var google: any;

@Injectable()
export class LocationService {
  public airports$: Observable<Airport>;

  private geocoder;
  private airports: Subject<Airport> = new Subject<Airport>();

  constructor(private _mapsApiLoader: MapsAPILoader) {
    console.log('ctor of LocationService run');
    this.airports$ = this.airports.asObservable();
    _mapsApiLoader.load()
      .then(() => {
        this.geocoder = new google.maps.Geocoder();
        console.debug('Maps api initialized:', this.geocoder);
        // this.loadAirports();
      });
  }


  public loadAirports() {
    // Note: this is for throtteling the geocode requests.
    // Google doesn't like batch requests on their free API.
    let someFastTriggers = Observable.interval(50).take(3);
    let oneSlowTrigger = Observable.timer(3000);

    let triggerSequence = someFastTriggers.concat(oneSlowTrigger).repeat();

    let airportInterval = Observable.zip(
      Observable.from(airportCodes),
      triggerSequence,
      (item, i) => item
    );

    airportInterval
      .do(x => console.log(`loading airport '${x}'`))
      .flatMap(x => this.codeAirport(x))
      .subscribe((x: Airport) => {
        this.airports.next(x);
      });
  }


  private codeAirport(airportCode: string): Observable<Airport> {
    let getAirportAsObservable: Function = Observable.bindCallback(this.geocoder.geocode);
    let result = getAirportAsObservable({
      'address': airportCode + ' Airport'
    })
      .map((results) => {
        if (results[1] === google.maps.GeocoderStatus.OK) {
          console.info('Geo success:', results);
          let marker: Airport = {
            code: airportCode,
            allData: results[0][0],
            label: results[0][0].formatted_address,
            title: airportCode,
            lat: results[0][0].geometry.location.lat(),
            lng: results[0][0].geometry.location.lng(),
          };
          return marker;
        } else {
          console.warn('Geo error:', results);
          return {
            code: airportCode,
            allData: results[0],
            label: 'Error ' + results[1],
            title: airportCode,
          };
        }
      });
    return result;
  }
}
