
exports.up = function(knex) {
  return knex.schema.createTable('donations', function(table) {
    table.increments('id');
    table.text('donation_data');
  })
};

exports.down = function(knex) {
  return knex.schema.dropTable('donations');
};
