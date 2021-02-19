
exports.up = function(knex) {
  return knex.schema.createTable('orders', function(table) {
    table.increments('id');
    table.text('orderData');
  })
};

exports.down = function(knex) {
  return knex.schema.dropTable('orders');
};
