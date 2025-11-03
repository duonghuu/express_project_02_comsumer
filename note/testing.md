## Date

| Date  | Title                                  | Note |
| ----- | -------------------------------------- | ---- |
| 29/10 | #### test /responsys/signup_s2s 29/10  |      |
| 29/10 | #### test /responsys/trigger_s2s 29/10 |      |
| 3/11  | #### test /responsys/signup_s2s 3/11   |      |

## start service

- start express_project_02 **producer** port 3000
  - run worker: pnpm worker
- start responsys_basic_demo **responsys** port 6000

## sample data
trigger_s2s
```json
{
    "activity": "Signup",
    "event_name": "Signup_FaceID",
    "event_source": "FEOL2.0",
    "feol_account_id": "UserID123",
    "feol_account_status": "inactive",
    "customer_id": null,
    "email_address": null,
    "mobile_number": "84982535185",
    "params": {
        "CUSTOMER_TYPE":  "NEW",
        "RECOGNITION":  "HIGH",
        "SIGNUP_STATUS":  "FACEID"
    }
}
```

signup_s2s
```json
{
  "insertOnNoMatch": true,
  "updateOnMatch": null,
  "matchColumnName1": "CUSTOMER_ID_",
  "matchColumnName2": "MOBILE_NUMBER_",
  "feol_account_id": "UserID123",
  "feol_account_status": "inactive",
  "data": {
    "CUSTOMER_ID_": "WBNHy2qPns2NM+rWRR4z9VyDBjxlpZLoU+F/rhcv+1w=",
    "MOBILE_NUMBER_": "84982535185",
    "LEAD_SOURCE": "FEOL_2.0"

  }
}
```

#### test /responsys/signup_s2s 29/10

- postman /responsys/signup_s2s, method post
- handleSignupS2S => call api responsys

#### test /responsys/trigger_s2s 29/10

- postman /responsys/trigger_s2s, method post
- handleTriggerS2S => add to queue responsysQueue

- worker lấy responsysQueue và call responsys_basic_demo

#### test /responsys/signup_s2s 3/11
mkta
{
    _id: ObjectId('690866e8f2c17b90ef3e21d7'),
    feol_account_id: 'feolID123',
    feol_account_status: 'inactive',
    RIID: 'RIID_feolID123',
    customer_id_lv1: 'feolID123_hash_by_phone',
    customer_id_lv2: ''
}
request to responsys
{
    '0': 'http://localhost:6000/rest/api/v1.3/lists/Resp_Banking_Customers/members',
    '1': {
        recordData: {
            fieldNames: [
                'CUSTOMER_ID_',
                'MOBILE_NUMBER_',
                'LEAD_SOURCE'
            ],
            records: [
                [
                    'feolID123_hash_by_phone',
                    '84999123123',
                    'FEOL_2.0'
                ]
            ],
            mapTemplateName: null
        },
        mergeRule: {
            htmlValue: 'H',
            optinValue: 'I',
            textValue: 'T',
            insertOnNoMatch: true,
            updateOnMatch: 'REPLACE_ALL',
            matchColumnName1: 'CUSTOMER_ID_',
            matchColumnName2: null,
            matchOperator: 'NONE',
            optoutValue: 'O',
            rejectRecordIfChannelEmpty: null,
            defaultPermissionStatus: 'OPTIN'
        }
    },
    _id: ObjectId('690866e8f2c17b90ef3e21d6'),
    createdAt: '03/11/2025, 15:25:12'
}

#### test /responsys/trigger_s2s 3/11
mkta
{
    _id: ObjectId('69086b5df2c17b90ef3e21d9'),
    feol_account_id: 'feolID123',
    feol_account_status: 'active',
    RIID: 'RIID_feolID123',
    customer_id_lv1: 'feolID123_hash_by_phone',
    customer_id_lv2: 'feolID123_hash_by_nid',
    updated_time: ISODate('2025-11-03T08:44:28.996Z')
}



