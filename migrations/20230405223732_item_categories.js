
exports.up = function(knex) {
  return knex.schema.createTable('item_categories', function(table) {
    table.increments('id');
    table.text('category_data');
  })
};

exports.down = function(knex) {
  return knex.schema.dropTable('item_categories');
};
