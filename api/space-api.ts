import {instance} from "./api";
import { APIResponseType } from "./api";

export const launchesAPI = {
    async getLaunches(page: number) {
        const res = await instance.post<APIResponseType>(`launches/query`, {
            "query": {},
            "options": {
                "page": page,
                "sort": {
                   "flight_number":"desc"
                }
             },
          });
        return res.data;
    }
}