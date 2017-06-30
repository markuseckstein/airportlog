/* tslint:disable:no-unused-variable */

import { addProviders, async, inject } from '@angular/core/testing';
import { LocationService } from './location.service';

describe('Service: Location', () => {
  beforeEach(() => {
    addProviders([LocationService]);
  });

  it('should add some tests...',
    inject([LocationService],
      (service: LocationService) => {
        expect(service).toBeTruthy();
      }));
});
