import axios from "axios";
import { env } from "../config/env.js";
import { getTodayFormattedDate } from "../util/date-util.js";

export async function findAllFromWb() {
  const { data } = await axios.get(env.WB.URL, {
    headers: {
        Authorization: `Bearer ${env.WB.API_TOKEN}`,
    },
    params: {
      date: getTodayFormattedDate(),
    }
  });

  const list = data.response.data.warehouseList;

}

findAllFromWb();
