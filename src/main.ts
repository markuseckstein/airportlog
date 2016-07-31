import {enableProdMode} from '@angular/core';
import {bootstrap} from '@angular/platform-browser-dynamic';
import {HTTP_PROVIDERS} from '@angular/http';
import {GOOGLE_MAPS_PROVIDERS} from 'angular2-google-maps/core';


import {AppComponent} from './app/app.component';
import {LazyMapsAPILoaderConfig} from 'angular2-google-maps/core/services/maps-api-loader/lazy-maps-api-loader';
import {mapsApiConfig} from './config/mapsApiConfig';


// depending on the env mode, enable prod mode or add debugging modules
if (process.env.ENV === 'build') {
  enableProdMode();
}

bootstrap(AppComponent, [
  // These are dependencies of our App
  HTTP_PROVIDERS,
  {provide: LazyMapsAPILoaderConfig, useValue: mapsApiConfig},
  GOOGLE_MAPS_PROVIDERS
])
  .catch(err => console.error(err));
