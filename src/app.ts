import { redis } from "@config/redis";
import { CallResponsysService } from "@services/callResponsysService";
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();
import { Worker } from "bullmq";
import { ResponsysService } from "@services/responsysService";
const worker = new Worker(
  "resapi_queue",
  async (job) => {
    const { data } = job.data;
    try {
      let activityData = {
        activity: data.activity ? data.activity : data.event_name,
        customer_id: data.customer_id,
        email_address: data.email_address,
        mobile_number: data.mobile_number,
        user_id: data.user_id,
        event_name: data.event_name,
        app_source: data.event_source,
        timestamp: data.timestamp,
        params: data.params,
      };
      ///
      await ResponsysService.callActivityAPI(true, activityData.activity, activityData);

      let triggerData = {
        //type: 'TRIGGER_EVENT',
        event: data.event_name,
        contact: {
          customer_id: data.customer_id,
          email_address: data.email_address,
          mobile_number: data.mobile_number,
        },
        data: {
          event_source: data.event_source,
          ...data.params
        }
      }
      ///
      await ResponsysService.callTriggerEventAPI(triggerData.event, triggerData, null)

      // switch (type) {
      //   case "ADD_ACTIVITY":
      //     const config = {
      //       method: 'post',
      //       url: `${process.env.RESPONSYS_ENDPOINT}/rest/api/v1.3/folders/Banking/suppData/Activity_${data.activity}/members`,
      //       headers: {
      //         "Content-Type": "application/json",
      //         "Authorization": null
      //       },
      //       data
      //     };
      //     let res = await axios(config);
      //     const result = res.data;
      //     console.log(result)
      // const insertResult = await CallResponsysService.create(result);

      //     return result;

      //   default:
      //     throw new Error(`Không hỗ trợ job type: ${type}`);
      // }
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
