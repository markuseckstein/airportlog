import {MapsAPILoader} from '@agm/core';
import {Injectable} from '@angular/core';
import 'rxjs/add/operator/timeInterval';
import {Observable} from 'rxjs/Rx';
import {airportCodes} from './airports';
import {Airport} from './shared';
import {ReplaySubject} from 'rxjs/ReplaySubject';
import {Subject} from 'rxjs/Subject';

declare var google: any;

@Injectable()
export class LocationService {
  private airports: Subject<Airport> = new ReplaySubject(1);
  public airports$: Observable<Airport> = this.airports.asObservable();
  private geocoder;

  constructor(private _mapsApiLoader: MapsAPILoader) {
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


  private loadAirports(): void {
    // Note: this is for throtteling the geocode requests.
    // Google doesn't like batch requests on their free API.
    let counter = -1;
    let idx = 0;
    Observable.from(airportCodes)
      .do(() => {
        if (idx % 6 === 0) {
          counter++;
        }
        idx++;
      })
      .delayWhen((code: any) => {
        const waitTime = 3050 * counter;
        console.log(`waitTime for ${code}, idx ${counter} is ${waitTime}`);
        return Observable.timer(waitTime);
      })
      .flatMap(x => this.codeAirport(x))
      .subscribe(airport => {
        this.airports.next(airport);
      });
  }


  private codeAirport(airportCode: string): Observable<Airport> {
    return Observable.create(obs => {
      console.log(`loading airport '${airportCode}'`);
      this.geocoder.geocode({
        'address': airportCode + ' Airport'
      }, (response, status) => {
        if (status === 'OK') {
          obs.next(response);
          obs.complete();
        } else {
          console.log('airport: ' + airportCode, status);
          obs.error({error: status});
        }
      });
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
          console.log(`Success ${airportCode}`, results);
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
      })
      .retryWhen(errors => errors
        .do(val => console.log(`Error for ${airportCode}`, val))
          .delayWhen(val => Observable.timer(Math.random() * 4000)));
  }
}
