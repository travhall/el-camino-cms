// config/database.ts
import path from "path";
import { parse } from "pg-connection-string";

export default ({ env }) => {
  const client = env("DATABASE_CLIENT", "sqlite");

  if (client === "postgres") {
    if (!env("DATABASE_URL")) {
      throw new Error("DATABASE_URL is required when using postgres");
    }

    const { host, port, database, user, password } = parse(env("DATABASE_URL"));

    return {
      connection: {
        client,
        connection: {
          host,
          port: parseInt(port, 10),
          database,
          user,
          password,
          ssl: env.bool("DATABASE_SSL", true)
            ? {
                rejectUnauthorized: env.bool(
                  "DATABASE_SSL_REJECT_UNAUTHORIZED",
                  false
                ),
              }
            : false,
          schema: env("DATABASE_SCHEMA", "public"),
        },
        pool: {
          min: env.int("DATABASE_POOL_MIN", 0),
          max: env.int("DATABASE_POOL_MAX", 5),
          acquireTimeoutMillis: env.int("DATABASE_CONNECTION_TIMEOUT", 60000),
          createTimeoutMillis: 30000,
          idleTimeoutMillis: 60000,
          reapIntervalMillis: 1000,
          createRetryIntervalMillis: 100,
        },
        debug: env.bool("DATABASE_DEBUG", false),
      },
    };
  }

  return {
    connection: {
      client,
      connection: {
        filename: path.join(
          __dirname,
          "..",
          "..",
          env("DATABASE_FILENAME", ".tmp/data.db")
        ),
      },
      useNullAsDefault: true,
      debug: env.bool("DATABASE_DEBUG", false),
    },
  };
};
