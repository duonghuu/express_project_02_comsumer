demo user call custom app register api with data
custom app receive data and send to redis
save user request to db

===
trigger_s2s
call 2 trigger, activity
===


custom app receive request /responsys/register
- responsysController::handleRegister
- ResponsysService.register
  - processContact
    - callContactAPI
      - CALL responsys api rest/api/v1.3/lists/${this.API_PROFILE_LIST}/members
      - retry
- add to queue

===
## table responsys
- log lại thông tin request đến api của CX
  - endpoint, data, datetime

## table call_responsys
- giả lập tình huống gửi data đến api của responsys, log lại thông tin sẽ gửi sang cho responsys
  - endpoint, data, datetime

===
Table for new CR
receive request
===
case 1: FEOL call signup_s2s
  => CX validate data 
    - OK => call reponsys API
    - fail
    => return func response

case 2: FEOL call trigger_s2s
  => CX validate data 
    - OK => luu vào redis -> worker luu vào queue dang array
    - fail
    => return func response

case 3: worker doc queue và call api

===
{
  "endpoint": "endpoint+activity",
  "type": "ADD_ACTIVITY_ARRAY",
  "activity": "WelcomeEmailActivity",
  "data": [
    {
      "emailAddress": "user1@example.com",
      "firstName": "Alice",
      "lastName": "Nguyen",
      "signupDate": "2025-10-24T10:00:00Z"
    },
    {
      "emailAddress": "user2@example.com",
      "firstName": "Bob",
      "lastName": "Tran",
      "signupDate": "2025-10-24T11:00:00Z"
    }
  ]
}
===
Test signup_s2s
- Send request with postman
- Route
- Controller
- Service
- Save to DB


