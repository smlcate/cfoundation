
exports.up = function(knex) {
  return knex.schema.createTable('bag_presets', function(table) {
    table.increments('id');
    table.text('bag_preset_data');
  })
};

exports.down = function(knex) {
  return knex.schema.dropTable('bag_presets');
};
