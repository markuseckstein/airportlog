import { MapsAPILoader } from '@agm/core';
import { Injectable } from '@angular/core';
import {
    from,
    interval,
    Observable,
    of,
    ReplaySubject,
    Subject,
    timer,
    zip
} from 'rxjs';
import {
    delayWhen,
    map,
    mapTo,
    mergeMap,
    retryWhen,
    startWith,
    tap
} from 'rxjs/operators';
import { Airport } from './shared/airport';
import { airportCodes } from './shared/airports';
import { StorageService } from './storage/storage.service';

declare var google: any;

@Injectable()
export class LocationService {
    private airports$$: Subject<Airport[]> = new ReplaySubject<Airport[]>(1);
    public airports$: Observable<Airport[]> = this.airports$$.asObservable();
    private geocoder;

    constructor(
        _mapsApiLoader: MapsAPILoader,
        private storage: StorageService
    ) {
        _mapsApiLoader
            .load()
            .then(() => {
                timer(200).subscribe(() => {
                    this.geocoder = new google.maps.Geocoder();
                    console.log('Maps api initialized:', this.geocoder);
                    this.loadAirports();
                });
            })
            .catch(err => {
                console.log('Error during maps api initialization: ', err);
            });
    }

    reload(): void {
        this.storage.clearCache();
        this.airports$$.next([]);
        this.loadAirports();
    }

    private loadAirports(): void {
        const loadedAirports: Airport[] = [];

        const interval$ = interval(200).pipe(
            mapTo(void 0),
            startWith(void 0)
        );

        const oneAirportAtATime$ = zip(
            from(airportCodes.slice()),
            interval$
        ).pipe(
            map(x => x[0]),
            mergeMap(airportCode => {
                const apt = this.storage.getAirport(airportCode);
                if (apt) {
                    console.log('from cache:', apt);
                    return of(apt);
                } else {
                    console.log('requesting ' + airportCode);
                    return this.codeAirport(airportCode);
                }
            }),
            tap(apt => this.storage.setAirport(apt))
        );

        oneAirportAtATime$.subscribe(airport => {
            console.log('got Airport', airport);
            loadedAirports.push(airport);
            this.airports$$.next(loadedAirports.slice());
        });
    }

    private codeAirport(airportCode: string): Observable<Airport> {
        return Observable.create(obs => {
            console.log(`loading airport '${airportCode}'`);
            this.geocoder.geocode(
                {
                    address: airportCode + ' Airport'
                },
                (response, status) => {
                    if (status === 'OK') {
                        obs.next(response);
                        obs.complete();
                    } else {
                        console.log('airport: ' + airportCode, status);
                        obs.error({ error: status });
                    }
                }
            );
        }).pipe(
            map((results: any) => {
                if (results.error) {
                    console.warn('Geo error:', results);
                    return {
                        code: airportCode,
                        allData: results[0],
                        label: 'Error ' + results[1],
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
