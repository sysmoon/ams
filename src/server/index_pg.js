const pg = require("pg");
const { ApolloServer } = require("apollo-server");
const { makeSchemaAndPlugin } = require("postgraphile-apollo-server");

const pgPool = new pg.Pool({
  "user": "postgres",
  "database": "graphql",
  "password": "yourpasswd",
  "host": "yourhost"
});

async function main() {
  const { schema, plugin } = await makeSchemaAndPlugin(
    pgPool,
    'public', // PostgreSQL schema to use
    {
      watchPg: true,
      graphiql: true,
      enhanceGraphiql: true,
      // PostGraphile options, see:
      // https://www.graphile.org/postgraphile/usage-library/
    }
  );

  const server = new ApolloServer({
    schema,
    plugins: [plugin]
  });

  const { url } = await server.listen();
  console.log(`🚀 Server ready at ${url}`);
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
