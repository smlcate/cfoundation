
exports.up = function(knex) {
  return knex.schema.createTable('carePackageItemSettings', function(table) {
    table.increments('id');
    table.text('settingsData');
  })
};

exports.down = function(knex) {
  return knex.schema.dropTable('carePackageItemSettings')
};
