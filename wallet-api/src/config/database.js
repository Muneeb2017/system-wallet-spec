const knexConfig = require("./knexfile");
const knex = require("knex");

const environment = process.env.NODE_ENV || "development";

// Initialize knex with the appropriate configuration
const db = knex(knexConfig[environment]);

console.log(`Database connected in ${environment} mode`);

module.exports = db;
