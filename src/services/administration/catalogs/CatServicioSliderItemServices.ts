import { axiosInstance } from 'src/boot/axios'
import type { AxiosResponse } from 'axios'
import type { ApiListResponse, ApiItemResponse } from 'src/interfaces/serviceCategory'
import type { ServiceSliderItemRecord, ServiceSliderItemPayload } from 'src/interfaces/serviceSliderItem'

interface IndexParams {
  params: {
    page: number
    rowsPerPage: number
    sortBy?: string | null
    descending?: boolean
  }
}

export default {
  index(
    serviceId: string | number,
    data: IndexParams
  ): Promise<AxiosResponse<ApiListResponse<ServiceSliderItemRecord>>> {
    return axiosInstance.get(`administration/catalogos/servicios/${serviceId}/slider-items`, data)
  },

  store(
    serviceId: string | number,
    data: ServiceSliderItemPayload
  ): Promise<AxiosResponse<ApiItemResponse<ServiceSliderItemRecord>>> {
    return axiosInstance.post(`administration/catalogos/servicios/${serviceId}/slider-items`, data)
  },

  update(
    serviceId: string | number,
    itemId: string | number,
    data: ServiceSliderItemPayload
  ): Promise<AxiosResponse<ApiItemResponse<ServiceSliderItemRecord>>> {
    return axiosInstance.put(`administration/catalogos/servicios/${serviceId}/slider-items/${itemId}`, data)
  },

  remove(serviceId: string | number, itemId: string | number): Promise<AxiosResponse<{ success: boolean }>> {
    return axiosInstance.delete(`administration/catalogos/servicios/${serviceId}/slider-items/${itemId}`)
  },
}
