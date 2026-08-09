import { axiosInstance } from 'src/boot/axios'
import type { AxiosResponse } from 'axios'
import type { ApiItemResponse } from 'src/interfaces/serviceCategory'
import type { ServiceContentRecord, ServiceContentPayload } from 'src/interfaces/serviceContent'

export default {
  show(serviceId: string | number): Promise<AxiosResponse<ApiItemResponse<ServiceContentRecord | null>>> {
    return axiosInstance.get(`administration/catalogos/servicios/${serviceId}/content`)
  },

  update(
    serviceId: string | number,
    data: ServiceContentPayload
  ): Promise<AxiosResponse<ApiItemResponse<ServiceContentRecord>>> {
    return axiosInstance.put(`administration/catalogos/servicios/${serviceId}/content`, data)
  },
}
