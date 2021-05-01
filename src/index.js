const fs = require("fs");
const path = require("path");
const { ApolloServer, PubSub } = require("apollo-server");
const { PrismaClient } = require("@prisma/client");
const { getUserId } = require("./utils");
const Query = require("./resolvers/Query");
const Mutation = require("./resolvers/Mutation");
const User = require("./resolvers/User");
const Link = require("./resolvers/Link");
const Subscription = require("./resolvers/Subscription");
const Vote = require("./resolvers/Vote");

const prisma = new PrismaClient();
const pubsub = new PubSub();

// 2
const resolvers = {
   Query,
   Mutation,
   Subscription,
   User,
   Link,
   Vote,
};

// 3
const server = new ApolloServer({
   typeDefs: fs.readFileSync(path.join(__dirname, "schema.graphql"), "utf8"),
   resolvers,
   context: ({ req }) => {
      return {
         ...req,
         prisma,
         pubsub,
         userId: req && req.headers.authorization ? getUserId(req) : null,
      };
   },
   subscriptions: {
      onConnect: (connectionParams) => {
         if (connectionParams.authToken) {
            return {
               prisma,
               userId: getUserId(null, connectionParams.authToken),
            };
         } else {
            return {
               prisma,
            };
         }
      },
   },
});

server.listen().then(({ url }) => console.log(`Server is running on ${url}`));
