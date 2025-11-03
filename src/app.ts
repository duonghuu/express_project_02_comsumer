import { redis } from "@config/redis";
import dotenv from "dotenv";
dotenv.config();
import { Worker } from "bullmq";
import { ResponsysService } from "@services/responsysService";
import { MKTADBService } from "@services/mktaDbService";
import _ from "lodash";
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
      if (activityData.activity == "Esign" && data?.feol_account_status == 'active') {
        const getRecord = await MKTADBService.getItemByField('feol_account_id', data?.feol_account_id);
        if (getRecord?.feol_account_status != "active") {
          const updatedData = {
            "feol_account_status": "active",
            "customer_id_lv2": data?.customer_id
          };
          await MKTADBService.update(data?.feol_account_id, updatedData);
          const updatedProfile = {
            "CUSTOMER_ID_": data?.customer_id,
            "RIID_": getRecord?.RIID,
          }
          await ResponsysService.callContactAPI("RIID_", "", updatedProfile);
        }
      }

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
