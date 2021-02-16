
exports.up = function(knex) {
  return knex.schema.createTable('ribbons', function(table) {
    table.increments('id');
    table.text('ribbonData');
  })
};

exports.down = function(knex) {
  return knex.schema.dropTable('ribbons');
};
