export interface BoxTariffDb {
  id: number;
  geo_name: string;
  warehouse_name: string;
  box_delivery_base: number | null;
  box_delivery_coef_expr: number | null;
  box_delivery_liter: number | null;
  box_delivery_marketplace_base: number | null;
  box_delivery_marketplace_coef_expr: number | null;
  box_delivery_marketplace_liter: number | null;
  box_storage_base: number | null;
  box_storage_coef_expr: number | null;
  box_storage_liter: number | null;
  date: Date;
}