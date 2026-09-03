import { axiosInstance } from 'src/boot/axios'
import type { PublicProductRecord } from 'src/interfaces/product'

export interface ProductListResponse {
	success: boolean
	data: PublicProductRecord[]
}

class ProductApi {
	async getProducts(): Promise<ProductListResponse> {
		const { data } = await axiosInstance.get<ProductListResponse>('/products')
		return data
	}
}

export default new ProductApi()
