interface BoxTariff {
  id: number;
  geoName: string;
  warehouseName: string;
  boxDeliveryBase: number;
  boxDeliveryCoefExpr: number;
  boxDeliveryLiter: number;
  boxDeliveryMarketplaceBase: number;
  boxDeliveryMarketplaceCoefExpr: number;
  boxDeliveryMarketplaceLiter: number;
  boxStorageBase: number;
  boxStorageCoefExpr: number;
  boxStorageLiter: number;
  date: Date;
}
