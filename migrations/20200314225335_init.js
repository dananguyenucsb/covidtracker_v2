exports.up = function(knex) {
  return knex.schema
    .createTable("cases", (table) => {
      table.increments("id").primary();

      // location information
      table.string("ipAddress", 255).notNullable();
      table.string("country", 10).notNullable();
      table.string("region", 10).notNullable();
      table.string("city", 255).notNullable();
      table.json("location", 255).notNullable();

      // reported information
      table.bigInteger("age").notNullable();
      table.json("symptoms").notNullable();
      table.string("tested").notNullable();
      table.string("incontact").notNullable();
      table.timestamps(true, true);
    })
    .createTable("symptomCounts", (table) => {
      table.increments("id").primary();
      table.string("symptom").notNullable();
      table.bigInteger("count").notNullable();
    });
};

exports.down = function(knex) {
  knex.schema.dropTable("cases").dropTable("symptomCounts");
};
