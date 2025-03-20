require("dotenv").config({ path: "../../.env" });
const path = require("path");

module.exports = {
  development: {
    client: "sqlite3",
    connection: {
      filename:
        process.env.DB_PATH || path.join(__dirname, "../../wallet.sqlite"),
    },
    migrations: {
      directory: path.join(__dirname, "../migrations"),
    },
    useNullAsDefault: true,
    // Enable foreign keys in SQLite
    pool: {
      afterCreate: (conn, cb) => {
        conn.run("PRAGMA foreign_keys = ON", cb);
      },
    },
  },
  test: {
    client: "sqlite3",
    connection: {
      filename: ":memory:",
    },
    migrations: {
      directory: path.join(__dirname, "../migrations"),
    },
    useNullAsDefault: true,
    pool: {
      afterCreate: (conn, cb) => {
        conn.run("PRAGMA foreign_keys = ON", cb);
      },
    },
  },
  production: {
    client: "sqlite3",
    connection: {
      filename:
        process.env.DB_PATH || path.join(__dirname, "../../wallet.sqlite"),
    },
    migrations: {
      directory: path.join(__dirname, "../migrations"),
    },
    useNullAsDefault: true,
    pool: {
      afterCreate: (conn, cb) => {
        conn.run("PRAGMA foreign_keys = ON", cb);
      },
    },
  },
};
