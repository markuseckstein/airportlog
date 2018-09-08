import { MapsAPILoader } from "@agm/core";
import { Injectable } from "@angular/core";
import { concat, from, Observable, ReplaySubject, Subject, timer } from "rxjs";
import { delayWhen, flatMap, tap, map, retryWhen } from "rxjs/operators";
import { airportCodes } from "./airports";
import { Airport } from "./shared/airport";
import { StorageService } from "./storage/storage.service";

declare var google: any;

@Injectable()
export class LocationService {
  private airports: Subject<Airport[]> = new ReplaySubject<Airport[]>(1);
  public airports$: Observable<Airport[]> = this.airports.asObservable();
  private geocoder;

  private airportArray = new Array<Airport>();

  constructor(
    private _mapsApiLoader: MapsAPILoader,
    private storage: StorageService
  ) {
    _mapsApiLoader
      .load()
      .then(() => {
        timer(200).subscribe(() => {
          this.geocoder = new google.maps.Geocoder();
          console.log("Maps api initialized:", this.geocoder);
          this.loadAirports();
        });
      })
      .catch(err => {
        console.log("Error during maps api initialization: ", err);
      });
  }

  reload(): void {
    this.storage.clearCache();
    this.airportArray.length = 0;
    this.airports.next([]);
    this.loadAirports();
  }

  private loadAirports(): void {
    // Note: this is for throtteling the geocode requests.
    // Google doesn't like batch requests on their free API.
    let counter = -1;
    let idx = 0;

    const airportsFromCache: Airport[] = [];
    const copyOfAirportCodes = airportCodes.slice();

    airportCodes.slice().forEach((aptCode: string) => {
      const apt = this.storage.getAirport(aptCode);
      if (apt) {
        airportsFromCache.push(apt);
        copyOfAirportCodes.splice(copyOfAirportCodes.indexOf(aptCode), 1);
      }
    });

    concat(
      from(airportsFromCache),
      from(copyOfAirportCodes).pipe(
        tap(() => {
          if (idx % 6 === 0) {
            counter++;
          }
          idx++;
        }),
        delayWhen((code: any) => {
          const waitTime = 3050 * counter;
          console.log(`waitTime for ${code}, idx ${counter} is ${waitTime}`);
          return timer(waitTime);
        }),
        flatMap(x => this.codeAirport(x))
      )
    ).subscribe(airport => {
      this.airportArray.push(airport);
      this.airports.next(this.airportArray.slice());
    });
  }

  private codeAirport(airportCode: string): Observable<Airport> {
    return Observable.create(obs => {
      console.log(`loading airport '${airportCode}'`);
      this.geocoder.geocode(
        {
          address: airportCode + " Airport"
        },
        (response, status) => {
          if (status === "OK") {
            obs.next(response);
            obs.complete();
          } else {
            console.log("airport: " + airportCode, status);
            obs.error({ error: status });
          }
        }
      );
    }).pipe(
      map((results: any) => {
        if (results.error) {
          console.warn("Geo error:", results);
          return {
            code: airportCode,
            allData: results[0],
            label: "Error " + results[1],
            title: airportCode
          };
        } else {
          console.log(`Success ${airportCode}`, results);
          const marker: Airport = {
            code: airportCode,
            allData: results[0].address_components,
            name: results[0].address_components[0].long_name,
            label: results[0].formatted_address,
            lat: results[0].geometry.location.lat(),
            lng: results[0].geometry.location.lng()
          };
          return marker;
        }
      }),
      tap((apt: any) => this.storage.setAirport(apt)),
      retryWhen(errors =>
        errors.pipe(
          tap(val => console.log(`Error for ${airportCode}`, val)),
          delayWhen(val => timer(Math.random() * 4000))
        )
      )
    );
  }
}
