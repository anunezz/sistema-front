import { axiosInstance } from 'src/boot/axios'
import type { AxiosResponse } from 'axios'
import type {
  ApiListResponse,
  ApiItemResponse,
  ServiceCategoryRecord,
  ServiceCategoryPayload,
  ServiceCategoryFilters,
} from 'src/interfaces/serviceCategory'

interface IndexParams {
  params: {
    page: number
    rowsPerPage: number
    sortBy?: string | null
    descending?: boolean
    filters: ServiceCategoryFilters
  }
}

export default {
  index(data: IndexParams): Promise<AxiosResponse<ApiListResponse<ServiceCategoryRecord>>> {
    return axiosInstance.get('administration/catalogos/servicios', data)
  },

  create(): Promise<AxiosResponse<ApiItemResponse<Partial<ServiceCategoryRecord>>>> {
    return axiosInstance.get('administration/catalogos/servicios/create')
  },

  store(data: ServiceCategoryPayload): Promise<AxiosResponse<ApiItemResponse<ServiceCategoryRecord>>> {
    return axiosInstance.post('administration/catalogos/servicios', data)
  },

  edit(id: string | number): Promise<AxiosResponse<ApiItemResponse<ServiceCategoryRecord>>> {
    return axiosInstance.get(`administration/catalogos/servicios/${id}/edit`)
  },

  update(
    id: string | number,
    data: ServiceCategoryPayload
  ): Promise<AxiosResponse<ApiItemResponse<ServiceCategoryRecord>>> {
    return axiosInstance.put(`administration/catalogos/servicios/${id}`, data)
  },

  remove(id: string | number): Promise<AxiosResponse<{ success: boolean }>> {
    return axiosInstance.delete(`administration/catalogos/servicios/${id}`)
  },
}
