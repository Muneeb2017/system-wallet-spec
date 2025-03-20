/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return (
    knex.schema
      // Create accounts table
      .createTable("accounts", (table) => {
        table.string("id").primary();
        table.string("name").notNullable();
        // Store balance as integer (cents) for precise calculations
        table.integer("balance").notNullable().defaultTo(0);
        table
          .integer("created_at")
          .notNullable()
          .defaultTo(knex.raw("CAST(strftime('%s', 'now') AS INTEGER)"));
        table
          .integer("updated_at")
          .notNullable()
          .defaultTo(knex.raw("CAST(strftime('%s', 'now') AS INTEGER)"));
      })
      // Create transactions table
      .createTable("transactions", (table) => {
        table.string("id").primary();
        table.string("account_id").notNullable();
        table.enu("type", ["top_up", "charge"]).notNullable();
        table.integer("amount").notNullable();
        table.string("reference_id").unique();
        table
          .integer("created_at")
          .notNullable()
          .defaultTo(knex.raw("CAST(strftime('%s', 'now') AS INTEGER)"));

        // Add foreign key constraint
        table
          .foreign("account_id")
          .references("id")
          .inTable("accounts")
          .onDelete("CASCADE");
      })
  );
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema
    .dropTableIfExists("transactions")
    .dropTableIfExists("accounts");
};
