const { ApolloServer, gql } = require("apollo-server");
const fs = require("fs");
const path = require("path");

// This is a (sample) collection of books we'll be able to query
// the GraphQL server for.  A more complete example might fetch
// from an existing data source like a REST API or database.

// Type definitions define the "shape" of your data and specify
// which ways the data can be fetched from the GraphQL server.
const typeDefs = gql`
  # Comments in GraphQL are defined with the hash (#) symbol.

  # This "Book" type can be used in other type declarations.

  type Airport {
    continent: String!
    coordinates: Coordinates!
    elevation: Elevation
    gps_code: String
    iata_code: String
    ident: ID!
    iso_country: String!
    iso_region: String
    local_code: String
    municipality: String
    name: String!
    type: String!
  }

  type Elevation {
    feet: Int
    meters: Int
  }

  type Coordinates {
    latitude: Float!
    longitude: Float!
  }

  # The "Query" type is the root of all GraphQL queries.
  # (A "Mutation" type will be covered later on.)
  type Query {
    airportSearchByCode(iata: String): Airport

    airportSearchFreetext(q: String): [Airport]
  }
`;

// Resolvers define the technique for fetching the types in the
// schema.  We'll retrieve books from the "books" array above.
const resolvers = {
  Query: {
    airportSearchByCode: (parent, { iata }, context, info) => {
      const airports = JSON.parse(
        fs.readFileSync(path.resolve(__dirname, "data/airport-codes.json"))
      );
      const airport = airports.find(apt => apt.iata_code === iata);
      return airport;
    },
    airportSearchFreetext: (parent, { q }, context, info) => {
      const airports = JSON.parse(
        fs.readFileSync(path.resolve(__dirname, "data/airport-codes.json"))
      );
      const matches = airports.filter(apt => {
        return (
          (apt.iata_code && apt.iata_code.includes(q)) ||
          (apt.name && apt.name.includes(q)) ||
          (apt.municipality && apt.municipality.includes(q))
        );
      });
      return matches;
    }
  },

  Airport: {
    elevation(parent) {
      return {
        feet: parent.elevation_ft,
        meters: Math.round(parent.elevation_ft / 3.28084)
      };
    },
    coordinates(parent) {
      const [longitude, latitude] = parent.coordinates.split(", ");
      return {
        latitude,
        longitude
      };
    }
  }
};

// In the most basic sense, the ApolloServer can be started
// by passing type definitions (typeDefs) and the resolvers
// responsible for fetching the data for those types.
const server = new ApolloServer({
  typeDefs,
  resolvers,
  tracing: true,
  engine: {
    apiKey: "service:markuseckstein-9774:Z-JMTIBHMXsSn-BT5Ax8aQ"
  },
  mocks: false
});

// This `listen` method launches a web-server.  Existing apps
// can utilize middleware options, which we'll discuss later.
server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
