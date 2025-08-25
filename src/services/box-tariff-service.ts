import axios from "axios";
import { env } from "../config/env.js";
import { getTodayFormattedDate, parseWbNumber } from "../util/util.js";
import type { BoxTariff } from "../types/box-tariff-type.js";
import { mapBoxTariffToDb } from "../mappers/box-tariff-mapper.js";
import { upsertTariffsForDate } from "../db/box-tariffs-db.js";

type WbWarehouse = {
  geoName: string;
  warehouseName: string;
  boxDeliveryBase: string | number | null;
  boxDeliveryCoefExpr: string | number | null;
  boxDeliveryLiter: string | number | null;
  boxStorageBase: string | number | null;
  boxStorageCoefExpr: string | number | null;
  boxStorageLiter: string | number | null;
  boxDeliveryMarketplaceBase: string | number | null;
  boxDeliveryMarketplaceCoefExpr: string | number | null;
  boxDeliveryMarketplaceLiter: string | number | null;
};

export async function fetchAndSaveWbTariffs(forDate?: string): Promise<void> {
  const date = forDate ?? getTodayFormattedDate();
  const { data } = await axios.get(env.WB.URL, {
    headers: {
      Authorization: `Bearer ${env.WB.API_TOKEN}`,
    },
    params: { date },
  });

  const list: WbWarehouse[] = data?.response?.data?.warehouseList ?? [];
  const dateObj = new Date(date);

  const tariffs: BoxTariff[] = list.map((w, index) => ({
    id: index + 1,
    geoName: w.geoName,
    warehouseName: w.warehouseName,
    boxDeliveryBase: parseWbNumber(w.boxDeliveryBase),
    boxDeliveryCoefExpr: parseWbNumber(w.boxDeliveryCoefExpr),
    boxDeliveryLiter: parseWbNumber(w.boxDeliveryLiter),
    boxDeliveryMarketplaceBase: parseWbNumber(w.boxDeliveryMarketplaceBase),
    boxDeliveryMarketplaceCoefExpr: parseWbNumber(w.boxDeliveryMarketplaceCoefExpr),
    boxDeliveryMarketplaceLiter: parseWbNumber(w.boxDeliveryMarketplaceLiter),
    boxStorageBase: parseWbNumber(w.boxStorageBase),
    boxStorageCoefExpr: parseWbNumber(w.boxStorageCoefExpr),
    boxStorageLiter: parseWbNumber(w.boxStorageLiter),
    date: dateObj,
  }));

  const dbRows = tariffs.map((t) => {
    const { id, ...db } = mapBoxTariffToDb(t);
    return db;
  });

  await upsertTariffsForDate(dbRows);
}
