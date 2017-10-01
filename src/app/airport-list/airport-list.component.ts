import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';
import { Airport } from '../shared/airport';

@Component({
  selector: 'app-airport-list',
  templateUrl: './airport-list.component.html',
  styleUrls: ['./airport-list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AirportListComponent implements OnInit {
  @Input() airports: Airport[];

  trackByCode(airport: Airport) {
    return airport.code;
  }

  constructor() { }

  ngOnInit() {
  }

}
