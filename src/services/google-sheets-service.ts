import { google } from "googleapis";
import { env } from "../config/env.js";
import { getLatestTariffsByDate } from "../db/box-tariffs-db.js";
import { getTodayFormattedDate } from "../util/util.js";

function getJwtClient() {
  const privateKey = env.GOOGLE.PRIVATE_KEY?.replace(/\\n/g, "\n");
  return new google.auth.JWT({
    email: env.GOOGLE.SERVICE_ACCOUNT_EMAIL,
    key: privateKey,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
}

export async function exportTariffsToSheets(forDate?: string): Promise<void> {
  const date = forDate ?? getTodayFormattedDate();
  const rows = await getLatestTariffsByDate(date);

  rows.sort((a, b) => {
    const aCoef = a.box_delivery_marketplace_coef_expr ?? a.box_delivery_coef_expr ?? Number.POSITIVE_INFINITY;
    const bCoef = b.box_delivery_marketplace_coef_expr ?? b.box_delivery_coef_expr ?? Number.POSITIVE_INFINITY;
    return (aCoef as number) - (bCoef as number);
  });

  const header = [
    "geo_name",
    "warehouse_name",
    "box_delivery_base",
    "box_delivery_coef_expr",
    "box_delivery_liter",
    "box_delivery_marketplace_base",
    "box_delivery_marketplace_coef_expr",
    "box_delivery_marketplace_liter",
    "box_storage_base",
    "box_storage_coef_expr",
    "box_storage_liter",
    "date",
  ];
  const values = [header, ...rows.map((r) => [
    r.geo_name,
    r.warehouse_name,
    r.box_delivery_base,
    r.box_delivery_coef_expr,
    r.box_delivery_liter,
    r.box_delivery_marketplace_base,
    r.box_delivery_marketplace_coef_expr,
    r.box_delivery_marketplace_liter,
    r.box_storage_base,
    r.box_storage_coef_expr,
    r.box_storage_liter,
    date,
  ])];

  if (!env.GOOGLE.SPREADSHEET_IDS.length) return;
  const auth = getJwtClient();
  await auth.authorize();
  const sheets = google.sheets({ version: "v4", auth });
  const range = "stocks_coefs!A1";

  for (const spreadsheetId of env.GOOGLE.SPREADSHEET_IDS) {
    await sheets.spreadsheets.values.clear({ spreadsheetId, range });
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range,
      valueInputOption: "RAW",
      requestBody: { values },
    });
  }
}


