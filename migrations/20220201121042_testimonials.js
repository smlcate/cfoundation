
exports.up = function(knex) {
  return knex.schema.createTable('testimonials', function(table) {
    table.increments('id');
    table.text('testimonial_data');
  })
};

exports.down = function(knex) {
  return knex.schema.dropTable('testimonials');
};
