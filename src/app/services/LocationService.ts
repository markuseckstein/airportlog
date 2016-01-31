/// <reference path="../../../typings/google-maps/google-maps.d.ts"/>

import {
    MapsAPILoader,
    NoOpMapsAPILoader,
    MapMouseEvent,
    ANGULAR2_GOOGLE_MAPS_PROVIDERS,
    ANGULAR2_GOOGLE_MAPS_DIRECTIVES
} from 'angular2-google-maps/core';

export class LocationService {
    constructor() {
        console.log("ctor of LocationService run");
    }

    private _airportCodes:string[] = [
        'BOD',
        'BOM',
        'BRU',
        'CDG',
        'CPH',
        'DAD',
        'DEL',
        'DXB',
        'FRA',
        'FUK',
        'HAN',
        'HER',
        'SOF, Sofia',
        'Samos',
        'HGH',
        'ICN',
        'JFK',
        'LAX',
        'LGW',
        'LPA',
        'MLE',
        'MUC',
        'NRT',
        'BKK',
        'NUE',
        'ORY',
        'PEK',
        'PHL',
        'PMI',
        'PVG',
        'SFO',
        'SGN',
        'SIN',
        'TXL',
        'XIY',
        'AMS'
    ];

    private _promiseArray:Promise<Airport>[] = [];

    public get numOfAirports() {
        return this._airportCodes.length;
    }

    public get numOfPromises() {
        return this._promiseArray.length;
    }

    public _airports:Airport[] = [];

    public getAirportLocations():Promise<Airport[]> {
        let airportCodesTemp = this._airportCodes;
        let airportCodesSmallChunks:Array<string[]> = [];
        while (airportCodesTemp.length) {
            let tmp = airportCodesTemp.splice(0, 10);
            airportCodesSmallChunks.push(tmp);
        }


        for (let i = 0; i < airportCodesSmallChunks.length; i++) {
            airportCodesSmallChunks[i].map((code:string)=> {
                this._promiseArray.push(this.codeAirportChunk(code, 0, 6));
            })
        }

        let result = Promise.all(this._promiseArray);
        return result;
    }

    private codeAirportChunk(code:string, delay:number, numOfRetries:number):Promise<Airport> {
        let delayIncrement = delay + 1500;
        let retries = numOfRetries - 1;
        let apPromise = new Promise((resolve, reject) => {
            this.codeAirport(code)
                .then((airport:Airport) => {
                    console.log(`SUCCESS: ${code}: ${airport.label}`);
                    this._airports.push(airport);
                    resolve(airport);
                })
                .catch((status:any) => {
                    if (numOfRetries > 0) {
                        console.log(`Scheduling ${code} for retry in ${delayIncrement}`);
                        return new Promise((resolve, reject) => {
                            setTimeout(() => {
                                let result = this.codeAirportChunk(code, delayIncrement, retries);
                                resolve(result);
                            }, delayIncrement);
                        });
                    }
                    console.log(`FAIL Giving up on ${code}`);
                    reject(status);
                })
        });

        return apPromise;
    }


    private codeAirport(airportCode:string):Promise<Airport> {
        let geocoder = new google.maps.Geocoder();

        let promise = new Promise<Airport>((resolve, reject) => {
            console.log("Request " + airportCode);
            geocoder.geocode({'address': airportCode + ' Airport'}, (results, status) => {
                if (status == google.maps.GeocoderStatus.OK) {
                    let marker:Airport = {
                        code: airportCode,
                        allData: results[0],
                        label: results[0].formatted_address,
                        title: airportCode,
                        lat: results[0].geometry.location.lat(),
                        lng: results[0].geometry.location.lng(),
                    };
                    resolve(marker);
                }
                else {
                    reject(status);
                }
            });
        });
        return promise;
    }
}

export interface Airport {
    code:string,
    allData:any,
    label:string,
    title:string,
    lat:number,
    lng:number
}