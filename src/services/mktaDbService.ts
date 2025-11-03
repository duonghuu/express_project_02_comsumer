import axios from "axios";
import { MKTADBRepository } from "repositories/mktadbRepository";

export const MKTADBService = {
    authToken: null,
    endPoint: "https://example.responsys.com", // Replace with actual endpoint
    API_PROFILE_LIST: 'Resp_Banking_Customers',

    async create(data: any) {
        return MKTADBRepository.create(data);
    },
    async update(id: string, data: any) {
        if (!id) throw new Error("Missing record id");

        const result = await MKTADBRepository.update(id, data);

        // 3️⃣ (Tuỳ chọn) Gọi API ngoài nếu cần đồng bộ dữ liệu
        // ví dụ: cập nhật thông tin lên Responsys
        /*
        await axios.put(
          `${this.endPoint}/rest/api/v1.3/lists/${this.API_PROFILE_LIST}/members`,
          { recordData: data },
          {
            headers: { Authorization: `Bearer ${this.authToken}` },
          }
        );
        */

        // 4️⃣ Trả kết quả
        return result;
    },
    async getItemByField(field: string, value: any) {
        if (!field || value === undefined || value === null) {
            throw new Error("Missing field or value");
        }

        const item = await MKTADBRepository.getItemByField(field, value);
        return item;
    },
};
