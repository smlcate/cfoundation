
exports.up = function(knex) {
  return knex.schema.createTable('reviews', function(table) {
    table.increments('id');
    table.text('review_data');
  })
};

exports.down = function(knex) {
  return knex.schema.dropTable('reviews');
};
