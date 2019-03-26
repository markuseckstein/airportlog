import {
    Component,
    EventEmitter,
    Input,
    Output,
    ChangeDetectionStrategy
} from '@angular/core';
import { tileLayer, latLng, marker, icon } from 'leaflet';
import { Airport } from '../shared/airport';

@Component({
    selector: 'app-map',
    templateUrl: './map.component.html',
    styleUrls: ['./map.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MapComponent {
    @Input()
    public set markers(value: Airport[]) {
        this.layers = [];
        if (value && value.length > 0) {
            value.forEach(apt => {
                this.layers.push(
                    marker([apt.lat, apt.lng], {
                        icon: icon({
                            iconSize: [25, 41],
                            iconAnchor: [13, 41],
                            iconUrl: 'leaflet/marker-icon.png',
                            shadowUrl: 'leaflet/marker-shadow.png'
                        })
                    })
                );
            });
        }
    }

    public get markers(): Airport[] {
        return null;
    }

    @Output()
    public selectAirport = new EventEmitter<Airport>();

    public options = {
        layers: [
            tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 18,
                attribution: '...'
            })
        ],
        zoom: 2,
        center: latLng(51.673858, 7.815982)
    };

    public layers = [];
}
