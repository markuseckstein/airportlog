import {AgmCoreModule} from '@agm/core';
import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent} from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AgmCoreModule.forRoot({apiKey: 'AIzaSyA_lAD_OEbsMXiDdOYBsertaqgTbPKhj_E'})
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
