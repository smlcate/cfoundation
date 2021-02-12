
exports.up = function(knex) {
  return knex.schema.createTable('items', function(table) {
    table.increments();
    table.text('itemData');
  })
};

exports.down = function(knex) {
  return knex.schema.dropTable('items');
};
