import axios from "axios";
import { env } from "../config/env";

export async function findAllFromWb() {
  const { data } = await axios.get(env.WB.URL, {
    headers: {
        Authorization: `Bearer: ${env.WB.API_TOKEN}`,
    },
  });

  const list = data.wareHouseList;
  console.log(list);
}

findAllFromWb();
