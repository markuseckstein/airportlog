import {Injectable} from '@angular/core';
import {Airport} from '../shared/airport';

@Injectable()
export class StorageService {
  private readonly key = '__airports';

  private cache = {};

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage(): void {
    const airportString: string | null = window.localStorage.getItem(this.key);
    if (airportString) {
      this.cache = JSON.parse(airportString);
    }
  }

  private saveToStorage(): void {
    const storageString = JSON.stringify(this.cache);
    window.localStorage.setItem(this.key, storageString);
  }

  public getAirport(code: string): Airport | undefined {
    return this.cache[code];
  }

  public setAirport(airport: Airport): void {
    this.cache[airport.code] = airport;
    this.saveToStorage();
  }

  public clearCache(): void {
    this.cache = {};
    window.localStorage.removeItem(this.key);
  }
}
