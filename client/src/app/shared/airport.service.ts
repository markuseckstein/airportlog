import { Injectable } from "@angular/core";
import { Apollo, gql, ApolloQueryResult } from "apollo-angular-boost";
import { map } from "rxjs/operators";
import { Observable } from "rxjs";
import { airportCodes } from "./airports";
import {
  AirportsByCodes_airportSearchByCodes,
  AirportsByCodes
} from "./queries/AirportsByCodes";

const airportsQuery = gql`
  query AirportsByCodes($codes: [String]) {
    airportSearchByCodes(codes: $codes) {
      name
      iata_code
      ident
      municipality
      coordinates {
        latitude
        longitude
      }
      type
      elevation {
        feet
        meters
      }
      iso_country
      iso_region
      continent
      __typename
    }
  }
`;

@Injectable({ providedIn: "root" })
export class AirportService {
  public airports$: Observable<AirportsByCodes_airportSearchByCodes[]>;

  constructor(private apollo: Apollo) {
    this.init();
  }

  public init() {
    this.airports$ = this.apollo
      .watchQuery<AirportsByCodes>({
        query: airportsQuery,
        variables: {
          codes: airportCodes
        }
      })
      .valueChanges.pipe(
        map(result => {
          return result.data && result.data.airportSearchByCodes;
        })
      );
  }
}
