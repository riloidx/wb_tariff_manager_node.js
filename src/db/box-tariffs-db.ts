import { db } from "./db.js";
import type { BoxTariffDb } from "../types/box-tariff-db-type.js";

const TABLE = "box_tariffs";

export async function upsertTariffsForDate(rows: Omit<BoxTariffDb, "id">[]): Promise<void> {
  if (!rows.length) return;
  const insertRows = rows.map((r) => ({ ...r }));
  await db<TableRow>(TABLE)
    .insert(insertRows)
    .onConflict(["date", "geo_name", "warehouse_name"]) // requires unique index in migration
    .merge({
      box_delivery_base: db.raw("excluded.box_delivery_base"),
      box_delivery_coef_expr: db.raw("excluded.box_delivery_coef_expr"),
      box_delivery_liter: db.raw("excluded.box_delivery_liter"),
      box_delivery_marketplace_base: db.raw("excluded.box_delivery_marketplace_base"),
      box_delivery_marketplace_coef_expr: db.raw("excluded.box_delivery_marketplace_coef_expr"),
      box_delivery_marketplace_liter: db.raw("excluded.box_delivery_marketplace_liter"),
      box_storage_base: db.raw("excluded.box_storage_base"),
      box_storage_coef_expr: db.raw("excluded.box_storage_coef_expr"),
      box_storage_liter: db.raw("excluded.box_storage_liter"),
    });
}

type TableRow = BoxTariffDb;

export async function getLatestTariffsByDate(date: string): Promise<BoxTariffDb[]> {
  return db<BoxTariffDb>(TABLE)
    .select("*")
    .where("date", date)
    .orderBy(["box_delivery_coef_expr", "box_delivery_marketplace_coef_expr"].map((c) => ({ column: c as keyof BoxTariffDb, order: "asc" as const })));
}

