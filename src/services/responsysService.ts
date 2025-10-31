import axios from "axios";
import { ResponsysRepository } from "repositories/responsysRepository";
import { CallResponsysService } from "./callResponsysService";
import { v4 as uuidv4 } from 'uuid';
// import * as CryptoJS from 'crypto-js';

//         let hash = CryptoJS.SHA256(randomNID);
//         const CUSTOMER_ID_ = hash.toString(CryptoJS.enc.Base64);
// var decrypted = CryptoJS.AES.decrypt(process.env.RESPONSYS_PASS, process.env.RESPONSYS_KEY);
// var password = decrypted.toString(CryptoJS.enc.Utf8);
export const ResponsysService = {
    authToken: null,
    endPoint: process.env.RESPONSYS_ENDPOINT, // Replace with actual endpoint
    API_PROFILE_LIST: 'Resp_Banking_Customers',
    API_FOLDER: 'Banking',
    /*
        async authenticate() {
    
            let base_url = ""
            let user_name = process.env.RESPONSYS_USERNAME;
    
            //call responsys api
            try {
                const config = {
                    method: 'post',
                    url: `${base_url}/rest/api/v1.3/auth/token`,
                    headers: { "Content-Type": "application/x-www-form-urlencoded;charset=utf-8" },
                    data: `user_name=${user_name}&password=${password}&auth_type=password`
                };
    
                let res = await axios(config);
                if (res.data && res.data.authToken) {
                    authToken = res.data.authToken;
                    endPoint = res.data.endPoint;
                } else {
                    console.log(res.data);
                }
    
                return true;
    
            } catch (err) {
                console.log('authenticate', err);
            }
    
            return false;
        }
    */
    getDate(dateStr: string) {
        let timestamp = new Date(dateStr);
        return timestamp.getFullYear() + '/' + (timestamp.getMonth() + 1) + "/" + timestamp.getDate() + " " + timestamp.getHours() + ":" + timestamp.getMinutes() + ":" + timestamp.getSeconds();
    },
    async processActivity(isCustomer: boolean, activity: any, data: any): Promise<any> {

        let result = await this.callActivityAPI(isCustomer, activity, data);
        return result;
    },
    async processContact(pk1: string, pk2: string, data: any): Promise<any> {
        // if (!authToken) {
        //     await authenticate();
        // }

        let result = await this.callContactAPI(pk1, pk2, data);
        return result;
    },
    async callActivityAPI(isCustomer: boolean, activityName: any, data: any) {
        // console.log('callActivityAPI', process.env)
        //call responsys api
        let result = {};

        //record id
        let record_id = uuidv4();

        let fieldNames = [
            "RECORDID",
            "CUSTOMERID",
            "EMAILADDRESS",
            "MOBILENUMBER",
            "APP_SOURCE",
            "APP_TIMESTAMP"
        ];

        let recordData = [
            record_id,
            data.customer_id ? data.customer_id : "",
            data.email_address ? data.email_address : "",
            data.mobile_number ? data.mobile_number : "",
            data.app_source ? data.app_source : "",
            this.getDate(data.timestamp)
        ];

        if (isCustomer) {
            fieldNames.push(
                "VISITORID",
                //"BROWSER",
                //"DEVICE",
                //"OS",
                //"PLATFORM"
            );

            recordData.push(
                data.user_id ? data.user_id : "",
                //data.ua.BROWSER,
                //data.ua.DEVICE,
                //data.params && data.params['OS'] ? data.params['OS'] : "",
                //data.ua.PLATFORM,
            );
        }

        for (let key in data.params) {
            fieldNames.push(key.toUpperCase());
            recordData.push(data.params[key]);
        }

        let postData = {
            "recordData": {
                "fieldNames": fieldNames,
                "records": [recordData],
                "mapTemplateName": null
            },
            "insertOnNoMatch": true,
            "updateOnMatch": "REPLACE_ALL"
        }

        try {
            const config = {
                method: 'post',
                url: `${process.env.RESPONSYS_ENDPOINT}/rest/api/v1.3/folders/Banking/suppData/Activity_${activityName}/members`,
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": null
                },
                data: postData
            };

            let res = await axios(config);
            result = res.data;
            await CallResponsysService.create(result);

            console.log('callActivityAPI :: success', activityName);

        } catch (err: any) {
            //console.log('callActivityAPI :: fail', err);

            let errorData = err.response ? err.response.data : { message: "NO_RESPONSE_RETURN" };

            //try recall if token expire
            if (errorData.errorCode && errorData.errorCode === 'TOKEN_EXPIRED') {
                this.authToken = null;
                result = await this.processActivity(isCustomer, activityName, data);
            }
        }
    },
    async processEvent(event: any, contact: any, data: any) {
        // if (!authToken) {
        //     await authenticate();
        // }

        let result = await this.callTriggerEventAPI(event, contact, data);
        return result;
    },
    async callTriggerEventAPI(eventName: any, contact: any, data: any) {

        //console.log('callTriggerEventAPI', eventName, contact, data);

        //call responsys api
        let result = {};

        let optionalData = [];
        for (let key in data) {
            optionalData.push({
                "name": key.toUpperCase(),
                "value": data[key]
            });
        }

        let recordData = {
            "customEvent": {
                "eventNumberDataMapping": null,
                "eventDateDataMapping": null,
                "eventStringDataMapping": null
            },
            "recipientData": [
                {
                    "recipient": {
                        "customerId": contact.customer_id ? contact.customer_id : null,
                        "emailAddress": contact.email_address ? contact.email_address : null,
                        "listName": {
                            "folderName": `${this.API_FOLDER}`,
                            "objectName": `${this.API_PROFILE_LIST}`
                        },
                        "recipientId": null,
                        "mobileNumber": contact.mobile_number ? contact.mobile_number : null,
                        "emailFormat": "HTML_FORMAT"
                    },
                    "optionalData": optionalData
                }
            ]
        };

        try {
            const config = {
                method: 'post',
                url: `${process.env.RESPONSYS_ENDPOINT}/rest/api/v1.3/events/${eventName}`,
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": null
                },
                data: recordData //JSON.stringify(data)
            };

            let res = await axios(config);
            result = res.data;
            console.log('callTriggerEventAPI :: success', res);
            await CallResponsysService.create(result)

            /*
            if (result.success === true) {
                //console.log('callTriggerEventAPI :: success', eventName);
            } else {
                //console.log('callTriggerEventAPI :: fail', eventName);
    
                if (result.success === false && result.recipientId === -1 && result.errorMessage === 'NO_RECIPIENT_FOUND') {
    
                    //console.log('call processContactNotFound');
    
                    return await processContactNotFound('event', eventName, contact, data);
                }
            }
            */

        } catch (err: any) {
            console.log('callTriggerEventAPI :: error', err);

            let errorData = err.response ? err.response.data : { message: "NO_RESPONSE_RETURN" };

            //try recall if token expire
            if (errorData.errorCode && errorData.errorCode === 'TOKEN_EXPIRED') {
                this.authToken = null;
                result = await this.processEvent(eventName, contact, data);
            }
        }
        return result
    },
    async callContactAPI(pk1: string, pk2: string, data: any): Promise<any> {
        //call responsys api

        let result = null;

        let fieldNames = [];
        let record = [];

        for (let key in data) {
            fieldNames.push(key);
            record.push(data[key]);
        }

        let recordData = {
            "recordData": {
                "fieldNames": fieldNames,
                "records": [
                    record
                ],
                "mapTemplateName": null
            },
            "mergeRule": {
                "htmlValue": "H",
                "optinValue": "I",
                "textValue": "T",
                "insertOnNoMatch": true,
                "updateOnMatch": "REPLACE_ALL",
                "matchColumnName1": pk1,
                "matchColumnName2": pk2,
                "matchOperator": "NONE",
                "optoutValue": "O",
                "rejectRecordIfChannelEmpty": null,
                "defaultPermissionStatus": "OPTIN"
            }
        }

        try {
            const config = {
                method: 'post',
                url: `${process.env.RESPONSYS_ENDPOINT}/rest/api/v1.3/lists/${this.API_PROFILE_LIST}/members`,
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": this.authToken
                },
                data: recordData
            };

            // uat: thay vi call api cua responsys thi se log vao db: table: CallResponsys
            // const result2 = await CallResponsysService.create(config);

            let res = await axios(config);
            result = res.data;
            const insertResult = await CallResponsysService.create(result);
            if (result.recordData && result.recordData.records && result.recordData.records.length) {
                result = result.recordData.records[0];
            }

            console.log('callContactAPI :: success', result);

        } catch (err: any) {

            console.log('callContactAPI :: error', err);

            let errorData = err.response ? err.response.data : { message: "NO_RESPONSE_RETURN" };

            //try recall if token expire
            if (errorData.errorCode && errorData.errorCode === 'TOKEN_EXPIRED') {
                this.authToken = null;
                result = await this.processContact(pk1, pk2, data);
            }
        }

        return result;
    },

    async register(body: any): Promise<any> {
        let result = await this.processContact(body.matchColumnName1, body.matchColumnName2, body.data);
        return result;
    },
    async create(data: any) {
        return ResponsysRepository.create(data);
    },

};
