const fs = require("fs");
const path = require("path");
const { ApolloServer } = require("apollo-server");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

// 2
const resolvers = {
   Query: {
      info: () => "Hello World",
      feed: async (_parent, _args, context) => {
         return context.prisma.link.findMany();
      },
   },
   Mutation: {
      // 2
      post: (_parent, args, context, info) => {
         const newLink = context.prisma.link.create({
            data: {
               url: args.url,
               description: args.description,
            },
         });
         return newLink;
      },
   },
};

// 3
const server = new ApolloServer({
   typeDefs: fs.readFileSync(path.join(__dirname, "schema.graphql"), "utf8"),
   resolvers,
   context: {
      prisma,
   },
});

server.listen().then(({ url }) => console.log(`Server is running on ${url}`));
