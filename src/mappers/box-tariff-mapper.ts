export function mapBoxTariffToDb(tariff: BoxTariff): BoxTariffDb {
  return {
    id: tariff.id,
    geo_name: tariff.geoName,
    warehouse_name: tariff.warehouseName,
    box_delivery_base: tariff.boxDeliveryBase,
    box_delivery_coef_expr: tariff.boxDeliveryCoefExpr,
    box_delivery_liter: tariff.boxDeliveryLiter,
    box_delivery_marketplace_base: tariff.boxDeliveryMarketplaceBase,
    box_delivery_marketplace_coef_expr: tariff.boxDeliveryMarketplaceCoefExpr,
    box_delivery_marketplace_liter: tariff.boxDeliveryMarketplaceLiter,
    box_storage_base: tariff.boxStorageBase,
    box_storage_coef_expr: tariff.boxStorageCoefExpr,
    box_storage_liter: tariff.boxStorageLiter,
    date: tariff.date,
  };
}

export function mapDbToBoxTariff(dbRow: BoxTariffDb): BoxTariff {
  return {
    id: dbRow.id,
    geoName: dbRow.geo_name,
    warehouseName: dbRow.warehouse_name,
    boxDeliveryBase: dbRow.box_delivery_base,
    boxDeliveryCoefExpr: dbRow.box_delivery_coef_expr,
    boxDeliveryLiter: dbRow.box_delivery_liter,
    boxDeliveryMarketplaceBase: dbRow.box_delivery_marketplace_base,
    boxDeliveryMarketplaceCoefExpr: dbRow.box_delivery_marketplace_coef_expr,
    boxDeliveryMarketplaceLiter: dbRow.box_delivery_marketplace_liter,
    boxStorageBase: dbRow.box_storage_base,
    boxStorageCoefExpr: dbRow.box_storage_coef_expr,
    boxStorageLiter: dbRow.box_storage_liter,
    date: dbRow.date,
  };
}

export function mapBoxTariffsToDb(tariffs: BoxTariff[]): BoxTariffDb[] {
  return tariffs.map(mapBoxTariffToDb);
}

export function mapDbToBoxTariffs(dbRows: BoxTariffDb[]): BoxTariff[] {
  return dbRows.map(mapDbToBoxTariff);
}
