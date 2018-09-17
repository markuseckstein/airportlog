const { ApolloServer, gql, PubSub } = require("apollo-server-express");
const fs = require("fs");
const path = require("path");
const express = require("express");
const http = require("http");

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
    airportSearchByCode(iataOrIcao: String): Airport

    airportSearchByCodes(codes: [String]): [Airport]

    airportSearchFreetext(q: String): [Airport]
  }

  type Subscription {
    airportsLoaded: [Airport]
  }
`;

const pubsub = new PubSub();

const airports = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, "data/airport-codes.json"))
);

const TOPIC = "APT_LOAD";

// Resolvers define the technique for fetching the types in the
// schema.  We'll retrieve books from the "books" array above.
const resolvers = {
  Query: {
    airportSearchByCode: (parent, { iataOrIcao }, context, info) => {
      const airport = airports.find(apt => {
        if (iataOrIcao.length === 3) {
          return apt.iata_code === iataOrIcao;
        } else if (iataOrIcao.length === 4) {
          return apt.ident === iataOrIcao;
        }
        return false;
      });
      return airport;
    },
    airportSearchByCodes: (parent, { codes }, context, info) => {
      const airports = [];
      codes.forEach(code => {
        const airport = resolvers.Query.airportSearchByCode(
          undefined,
          { iataOrIcao: code },
          context,
          info
        );
        if (!airport) {
          throw new Error(`Could not find airport with code ${airport}`);
        }
        airports.push(airport);
      });
      return airports;
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
  Subscription: {
    airportsLoaded: {
      subscribe: () => pubsub.asyncIterator([TOPIC])
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
  mocks: false,
  introspection: true,
  playground: true
});

const app = express();
const PORT = 4000;
const httpServer = http.createServer(app);
server.applyMiddleware({ app, cors: true });
server.installSubscriptionHandlers(httpServer);

// ⚠️ Pay attention to the fact that we are calling `listen` on the http server variable, and not on `app`.
httpServer.listen(PORT, () => {
  console.log(`Server ready at http://localhost:${PORT}${server.graphqlPath}`);
  console.log(
    `Subscriptions ready at ws://localhost:${PORT}${server.subscriptionsPath}`
  );
});

let counter = 0;

setInterval(() => {
  pubsub.publish(TOPIC, { airportsLoaded: [airports[counter]] });
  counter++;
}, 2000);
