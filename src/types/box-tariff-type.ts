export interface BoxTariff {
  id: number;
  geoName: string;
  warehouseName: string;
  boxDeliveryBase: number | null;
  boxDeliveryCoefExpr: number | null;
  boxDeliveryLiter: number | null;
  boxDeliveryMarketplaceBase: number | null;
  boxDeliveryMarketplaceCoefExpr: number | null;
  boxDeliveryMarketplaceLiter: number | null;
  boxStorageBase: number | null;
  boxStorageCoefExpr: number | null;
  boxStorageLiter: number | null;
  date: Date;
}
