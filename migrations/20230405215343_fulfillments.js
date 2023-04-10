exports.up = function(knex) {
  return knex.schema.createTable('fulfillments', function(table) {
    table.increments('id');
    table.text('fulfillment_data');
  })
};

exports.down = function(knex) {
  return knex.schema.dropTable('fulfillments');
};
