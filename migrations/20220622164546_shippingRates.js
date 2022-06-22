
exports.up = function(knex) {
  return knex.schema.createTable('shippingRates', function(table) {
    table.increments('id');
    table.text('shippingRate_data');
  })
};

exports.down = function(knex) {
  return knex.schema.dropTable('shippingRates');
};
