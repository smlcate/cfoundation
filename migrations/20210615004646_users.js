
exports.up = function(knex) {
  return knex.schema.createTable('users', function(table) {
    table.increments('id');
    table.text('user_data');
    table.string('email');
    table.string('hashed_passcode');
  })
};

exports.down = function(knex) {
  return knex.schema.dropTable('users');
};
