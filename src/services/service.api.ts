import { axiosInstance } from 'src/boot/axios';
import type { ServiceResponse } from 'src/interfaces/service'

class ServiceApi{

    async getServices():Promise<ServiceResponse>{

        const {data}=await axiosInstance.get<ServiceResponse>('/services')

        return data

    }

}

export default new ServiceApi()
