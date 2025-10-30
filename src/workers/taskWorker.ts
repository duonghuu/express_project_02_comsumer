import { redis } from "@config/redis";
import { CallResponsysService } from "@services/callResponsysService";
import { ResponsysService } from "@services/responsysService";
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();
import { Worker } from "bullmq";
import dayjs from "dayjs";
import fs from "fs";
// import { connectDB } from "@config/database";
(async () => {
  // const db = await connectDB();


})();
const worker = new Worker(
  "resapi_queue",
  async (job) => {

    // const jobData = job.data;
    // if (job.attemptsMade < 2) {
    //   // return Promise.reject để BullMQ hiểu là job fail (không cần throw)
    //   return Promise.reject("Simulated fail");
    // }
    // console.log("Processing job:", job.name, job.data);
    // // Logic gửi email ở đây
    // fs.appendFileSync(
    //   "logs/sent.log",
    //   `[${dayjs().format("D/M/YYYY H:mm:ss")}] ${job?.id}\n`
    // );
    const { type, data } = job.data;

    try {
      // console.log(`[Worker] Nhận job: ${job.name} (${type})`);

      switch (type) {
        case "ADD_ACTIVITY":
          // Gọi API hoặc xử lý logic tùy theo job
          // const response = await apiClient.post(
          //   "http://localhost:3000/responsys/add_activity",
          //   data
          // );
          // let result = await ResponsysService.processActivity(true, data.activity, data);
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

          // Ghi log kết quả
          // fs.appendFileSync(
          //   "logs/worker.log",
          //   `[${dayjs().format("D/M/YYYY H:mm:ss")}] ✅ DONE ${job.id} | ${type}\n`
          // );

          return result;

        default:
          throw new Error(`Không hỗ trợ job type: ${type}`);
      }
    } catch (err) {
      // fs.appendFileSync(
      //   "logs/worker_error.log",
      //   `[${dayjs().format("D/M/YYYY H:mm:ss")}] ❌ FAIL ${job.id} | ${
      //     err.message || err
      //   }\n`
      // );

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
