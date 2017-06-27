import {MapsAPILoader} from '@agm/core';
import {Injectable} from '@angular/core';
import 'rxjs/add/operator/timeInterval';
import {Observable, Subject} from 'rxjs/Rx';
import {airportCodes} from './airports';
import {Airport} from './shared';

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
        Observable.timer(200).subscribe(() => {
          this.geocoder = new google.maps.Geocoder();
          console.log('Maps api initialized:', this.geocoder);
          this.loadAirports();
        });
      }).catch(err => {
      console.log('Fehler: ', err);
    });
  }


  public loadAirports() {
    // Note: this is for throtteling the geocode requests.
    // Google doesn't like batch requests on their free API.
    let counter = 0;
    const airportInterval = Observable.from(airportCodes)
      .scan((acc, code, idx) => ({code, idx}), {})
      .filter((x: any) => x.idx !== undefined) // TODO AMS is missing
      .delayWhen((val: any) => {
        const index = val.idx;
        if (index % 8 === 0) {
          counter++;
        }
        const waitTime = 5050 * counter;

        console.log(`waitTime for ${val.code}, idx ${index} is ${waitTime}`);
        return Observable.timer(waitTime);
      })
      .map(val => val.code);

    airportInterval
      .do(x => console.log(`loading airport '${x}'`))
      .flatMap(x => this.codeAirport(x))
      .subscribe((x: Airport) => {
        this.airports.next(x);
      });
  }


  private codeAirport(airportCode: string): Observable<Airport> {
    return Observable.create(obs => {
      this.geocoder.geocode({
        'address': airportCode + ' Airport'
      }, (response, status) => {
        if (status === 'OK') {
          obs.next(response);
          obs.complete();
        } else {
          console.log('airport: ' + airportCode, status);
          obs.next({error: status});
          obs.complete();
        }
      });
    })
      .do(x => {
        console.log('geo result', x);
      })
      .map((results) => {
        if (results.error) {
          console.warn('Geo error:', results);
          return {
            code: airportCode,
            allData: results[0],
            label: 'Error ' + results[1],
            title: airportCode,
          };
        } else {
          const marker: Airport = {
            code: airportCode,
            allData: results[0].address_components,
            label: results[0].formatted_address,
            title: airportCode,
            lat: results[0].geometry.location.lat(),
            lng: results[0].geometry.location.lng(),
          };
          return marker;
        }
      });
  }
}
