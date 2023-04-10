exports.up = function(knex) {
  return knex.schema.createTable('bags', function(table) {
    table.increments('id');
    table.text('bag_data');
  })
};

exports.down = function(knex) {
  return knex.schema.dropTable('bags');
};
