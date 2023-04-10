
exports.up = function(knex) {
  return knex.schema.createTable('feedback_controller', function(table) {
    table.increments('id');
    table.text('feedback_controller_data');
  })
};

exports.down = function(knex) {
  return knex.schema.dropTable('feedback_controller');
};
