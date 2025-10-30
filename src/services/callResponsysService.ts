import axios from "axios";
import { CallResponsysRepository } from "repositories/callResponsysRepository";

export const CallResponsysService = {
    authToken: null,
    endPoint: "https://example.responsys.com", // Replace with actual endpoint
    API_PROFILE_LIST: 'Resp_Banking_Customers',

    async create(data: any) {
        return CallResponsysRepository.create(data);
    },

};
