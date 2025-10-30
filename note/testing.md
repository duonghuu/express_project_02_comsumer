## Date

| Date  | Title                                  | Note |
| ----- | -------------------------------------- | ---- |
| 29/10 | #### test /responsys/signup_s2s 29/10  |      |
| 29/10 | #### test /responsys/trigger_s2s 29/10 |      |

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








