
exports.up = function(knex) {
  return knex.schema.createTable('items', function(table) {
    table.increments('id');
    table.text('itemData');
  })
};

exports.down = function(knex) {
  return knex.schema.dropTable('items');
};
