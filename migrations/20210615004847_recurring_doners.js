
exports.up = function(knex) {
  return knex.schema.createTable('recurring_doners', function(table) {
    table.increments('id');
    table.text('recurring_donor_data'); //I know its donor, its trouble to fix
    //Inlcudes every donor, so there is 1 updated table
  })
};

exports.down = function(knex) {
  return knex.schema.dropTable('recurring_doners');
};
