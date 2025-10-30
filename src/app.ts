import { redis } from "@config/redis";
import { CallResponsysService } from "@services/callResponsysService";
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();
import { Worker } from "bullmq";
const worker = new Worker(
  "resapi_queue",
  async (job) => {

    const { type, data } = job.data;

    try {

      switch (type) {
        case "ADD_ACTIVITY":
          const config = {
            method: 'post',
            url: `${process.env.RESPONSYS_ENDPOINT}/rest/api/v1.3/folders/Banking/suppData/Activity_${data.activity}/members`,
            headers: {
              "Content-Type": "application/json",
              "Authorization": null
            },
            data
          };
          let res = await axios(config);
          const result = res.data;
          console.log(result)
          const insertResult = await CallResponsysService.create(result);

          return result;

        default:
          throw new Error(`Không hỗ trợ job type: ${type}`);
      }
    } catch (err) {
      // Trả lỗi để BullMQ biết job này fail và retry
      throw err;
    }
  },
  {
    connection: redis,
    limiter: {
      max: 6,          // tối đa 6 job
      duration: 60000 // trong 60 giây (1 phút)
    },
  }
);
