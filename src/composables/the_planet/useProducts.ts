import { ref, onMounted } from 'vue'
import ProductApi from 'src/services/the_planet/product.api'
import type { ProductListResponse } from 'src/services/the_planet/product.api'

// Mismo patrón que useServices(): una sola colección completa (todos los
// productos activos), consumida tanto por el slider de destacados como por
// la vista "todos los productos" (buscador + agrupación) — sin un segundo
// endpoint ni una búsqueda server-side distinta (ver .claude/skills/servicios/).
export function useProducts() {
	const loading = ref(false)

	const products = ref<ProductListResponse>({
		success: false,
		data: [],
	})

	const load = async () => {
		loading.value = true

		try {
			products.value = await ProductApi.getProducts()
		} finally {
			loading.value = false
		}
	}

	onMounted(load)

	return {
		products,
		loading,
		load,
	}
}
