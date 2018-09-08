/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: AirportsByCodes
// ====================================================

export interface AirportsByCodes_airportSearchByCodes_coordinates {
  __typename: "Coordinates";
  latitude: number;
  longitude: number;
}

export interface AirportsByCodes_airportSearchByCodes_elevation {
  __typename: "Elevation";
  feet: number | null;
  meters: number | null;
}

export interface AirportsByCodes_airportSearchByCodes {
  __typename: "Airport";
  name: string;
  iata_code: string | null;
  ident: string;
  municipality: string | null;
  coordinates: AirportsByCodes_airportSearchByCodes_coordinates;
  type: string;
  elevation: AirportsByCodes_airportSearchByCodes_elevation | null;
  iso_country: string;
  iso_region: string | null;
  continent: string;
}

export interface AirportsByCodes {
  airportSearchByCodes: (AirportsByCodes_airportSearchByCodes | null)[] | null;
}

export interface AirportsByCodesVariables {
  codes?: (string | null)[] | null;
}
