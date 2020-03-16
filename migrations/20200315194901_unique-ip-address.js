exports.up = function(knex) {
  return knex.schema.table("cases", function(table) {
    table.unique("ipAddress");
  });
};

exports.down = function(knex) {
  return knex.schema.table("cases", function(table) {
    table.dropUnique("ipAddress");
  });
};
