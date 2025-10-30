#### /responsys/signup_s2s
- Lưu request_in vào DB

#### /responsys/trigger_s2s
- Check và update custom app db

#### mktadb structure

| col                 |     |
| ------------------- | --- |
| id                  |     |
| feol_account_id     |     |
| feol_account_status |     |
| RIID_               |     |
| customer_id_lv1     |     |
| customer_id_lv2     |     |
| created_time        |     |
| updated_time        |     |

**Lưu request gọi vào signup**
input: feol_account_id, feol_account_status
handle
  if not exist feol_account_id
  {
    if (RIID_ = callResSignUpApi thành công)
    {
        requestStatus = req.feol_account_status
        customerID = req.data.CUSTOMER_ID_
        insertData = []
        insertData['RIID_] = RIID_
        if (requestStatus != 'active') {
            insertData['customer_id_lv1] = customerID
        }

    }
  }
output: new record in mktadb

**update record in mktadb with event esign**
input: feol_account_id, feol_account_status, activity
handle
    if req.activity == Esign && req.feol_account_status == active && tồn tại DB.feol_account_id && tồn tại DB.feol_account_status == inactive
    {
        update DB.feol_account_status == active
        update DB.feol_account_status == active
    }
handle
  if not exist feol_account_id
  {
    if (RIID_ = callResSignUpApi thành công)
    {
        requestStatus = req.feol_account_status
        customerID = req.data.CUSTOMER_ID_
        insertData = []
        insertData['RIID_] = RIID_
        if (requestStatus != 'active') {
            insertData['customer_id_lv1] = customerID
        }

    }
  }
output: update record in mktadb

