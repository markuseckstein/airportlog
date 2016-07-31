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
      .then((m) => {
        this.geocoder = new google.maps.Geocoder();
        console.debug('Maps api initialized:', this.geocoder);
        // this.loadAirports();
      });
  }


  public loadAirports() {
    let airportInterval = Observable.zip(
      Observable.from(airportCodes),
      Observable.timer(0, 1510),
      (item, i) => {
        return item;
      }
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
            // lat: results[0].geometry.location.lat(),
            // lng: results[0].geometry.location.lng(),
          };
        }
      });
    return result;
  }
}
