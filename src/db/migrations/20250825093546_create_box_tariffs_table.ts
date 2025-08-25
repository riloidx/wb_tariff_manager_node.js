import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('delivery_info', (table) => {
    table.increments('id').primary();
    table.string('geo_name').notNullable();
    table.string('warehouse_name').notNullable();
    table.decimal('box_delivery_base', 10, 2).notNullable();
    table.decimal('box_delivery_coef_expr', 10, 2).notNullable();
    table.decimal('box_delivery_liter', 10, 2).notNullable();
    table.decimal('box_delivery_marketplace_base', 10, 2).notNullable();
    table.decimal('box_delivery_marketplace_coef_expr', 10, 2).notNullable();
    table.decimal('box_delivery_marketplace_liter', 10, 2).notNullable();
    table.decimal('box_storage_base', 10, 2).notNullable();
    table.decimal('box_storage_coef_expr', 10, 2).notNullable();
    table.decimal('box_storage_liter', 10, 2).notNullable();
  });
}


export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('delivery_info');
}