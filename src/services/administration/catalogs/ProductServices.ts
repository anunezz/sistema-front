import { axiosInstance } from 'src/boot/axios'
import type { AxiosResponse } from 'axios'
import type { ApiListResponse, ApiItemResponse } from 'src/interfaces/serviceCategory'
import type { ProductRecord, ProductPayload } from 'src/interfaces/product'

interface IndexParams {
	filters?: {
		service_category_id?: number
		active?: string | boolean
	}
	page?: number
	rowsPerPage?: number
	sortBy?: string | null
	descending?: boolean
}

// Mismo patrón que AppointmentServiceApi (Agenda): recurso "plano" filtrado
// por service_category_id vía `filters`, no anidado en la URL bajo el
// Servicio (a diferencia de CatServicioSliderItemServices).
export const ProductApi = {
	index(
		params: IndexParams,
	): Promise<
		AxiosResponse<ApiListResponse<ProductRecord> | { success: boolean; data: ProductRecord[] }>
	> {
		return axiosInstance.get('administration/catalogos/productos', { params })
	},

	store(data: ProductPayload): Promise<AxiosResponse<ApiItemResponse<ProductRecord>>> {
		return axiosInstance.post('administration/catalogos/productos', data)
	},

	update(
		hashId: string,
		data: Partial<ProductPayload>,
	): Promise<AxiosResponse<ApiItemResponse<ProductRecord>>> {
		return axiosInstance.put(`administration/catalogos/productos/${hashId}`, data)
	},
}
