import { schedule } from "node-cron";
import { fetchAndSaveWbTariffs } from "./services/box-tariff-service.js";
import { getTodayFormattedDate } from "./util/util.js";
import { exportTariffsToSheets } from "./services/google-sheets-service.js";

schedule("0 * * * *", async () => {
  await fetchAndSaveWbTariffs(getTodayFormattedDate());
});

schedule("5 * * * *", async () => {
  await exportTariffsToSheets(getTodayFormattedDate());
});