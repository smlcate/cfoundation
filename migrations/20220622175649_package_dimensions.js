exports.up = function(knex) {
  return knex.schema.createTable('package_dimensions', function(table) {
    table.increments('id');
    table.text('package_dimensions_data');
  })
};

exports.down = function(knex) {
  return knex.schema.dropTable('package_dimensions');
};
