<template>
	<q-layout view="hHh lpR fFf">
		<q-header class="header-glass">
			<q-toolbar class="q-px-md q-px-lg-lg toolbar-responsive">
				<div class="row items-center cursor-pointer" @click="goBack">
					<img src="~/src/assets/The_planet/Th3eplanet.png" class="logo-mini" />
					<div class="q-ml-md">
						<div class="text-h6 text-weight-bold text-gold brand-title">
							THE PLANET STUDIO
						</div>
						<div class="text-caption text-pink-2 brand-subtitle">
							Estética & Peluquería
						</div>
					</div>
				</div>

				<q-space />

				<q-btn
					flat
					color="white"
					icon="arrow_back"
					label="Volver al inicio"
					@click="goBack"
				/>
			</q-toolbar>
		</q-header>

		<q-page-container>
			<q-page class="bg-dark-page q-pa-md q-pa-md-xl">
				<div class="text-center q-mb-lg q-mt-md">
					<div class="text-h4 text-weight-bold text-gold">Todos los Productos</div>
					<div class="text-grey-5 q-mt-sm">
						Encuentra el producto ideal para complementar tu servicio favorito.
					</div>
				</div>

				<!-- BUSCADOR -->
				<div class="row justify-center q-mb-xl">
					<div class="col-12 col-sm-8 col-md-6">
						<q-input
							outlined
							dark
							dense
							rounded
							color="pink"
							v-model="searchTerm"
							placeholder="Buscar producto..."
							class="search-input"
						>
							<template v-slot:prepend>
								<q-icon name="search" />
							</template>
							<template v-slot:append>
								<q-icon
									v-if="searchTerm"
									name="close"
									class="cursor-pointer"
									@click="searchTerm = ''"
								/>
							</template>
						</q-input>
					</div>
				</div>

				<div v-if="loading" class="row justify-center q-pa-xl">
					<q-spinner color="primary" size="60px" />
				</div>

				<div v-else-if="!groups.length" class="text-center text-grey-5 q-pa-xl">
					No encontramos productos que coincidan con tu búsqueda.
				</div>

				<!-- AGRUPADOS POR SERVICIO -->
				<div v-else>
					<div v-for="group in groups" :key="group.key" class="q-mb-xl">
						<div class="group-title text-h6 text-weight-bold text-gold q-mb-md">
							{{ group.title }}
						</div>

						<div class="products-grid">
							<q-card
								v-for="product in group.products"
								:key="product.id"
								clickable
								flat
								class="product-card"
								@click="openDetail(product)"
							>
								<q-img
									:src="imageUrl(product) || undefined"
									:ratio="1"
									class="product-card-img"
								>
									<template v-if="!imageUrl(product)" v-slot:default>
										<div class="absolute-full flex flex-center bg-grey-10">
											<q-icon name="image" size="48px" color="grey-7" />
										</div>
									</template>
								</q-img>
								<q-card-section>
									<div
										class="text-subtitle1 text-weight-bold text-white ellipsis"
									>
										{{ product.title }}
									</div>
									<div
										v-if="product.subtitle"
										class="text-caption text-grey-5 ellipsis"
									>
										{{ product.subtitle }}
									</div>
									<div
										class="text-subtitle1 text-pink-4 text-weight-bold q-mt-xs"
									>
										{{ formatPrice(product.price) }}
									</div>
								</q-card-section>
							</q-card>
						</div>
					</div>
				</div>
			</q-page>
		</q-page-container>

		<!-- DETALLE DE PRODUCTO -->
		<q-dialog v-model="showDetail">
			<q-card
				v-if="selected"
				class="product-detail-card"
				style="max-width: 520px; width: 100%"
			>
				<q-img :src="imageUrl(selected) || undefined" :ratio="16 / 9">
					<template v-if="!imageUrl(selected)" v-slot:default>
						<div class="absolute-full flex flex-center bg-grey-10">
							<q-icon name="image" size="64px" color="grey-7" />
						</div>
					</template>
				</q-img>

				<q-card-section>
					<div v-if="selected.category" class="text-caption text-pink-2 text-uppercase">
						{{ selected.category.title }}
					</div>
					<div class="text-h5 text-weight-bold text-gold">{{ selected.title }}</div>
					<div v-if="selected.subtitle" class="text-subtitle1 text-grey-4 q-mt-xs">
						{{ selected.subtitle }}
					</div>
					<div class="text-h5 text-pink-4 text-weight-bold q-mt-sm">
						{{ formatPrice(selected.price) }}
					</div>
					<div v-if="selected.description" class="text-body2 text-grey-3 q-mt-md">
						{{ selected.description }}
					</div>
				</q-card-section>

				<q-card-actions align="right">
					<q-btn flat label="Cerrar" color="grey" v-close-popup />
				</q-card-actions>
			</q-card>
		</q-dialog>
	</q-layout>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useProducts } from 'src/composables/the_planet/useProducts'
import type { PublicProductRecord } from 'src/interfaces/product'

const router = useRouter()
const { products, loading } = useProducts()

const searchTerm = ref('')
const showDetail = ref(false)
const selected = ref<PublicProductRecord | null>(null)

const imageUrl = (product: PublicProductRecord): string | null => {
	if (!product.image?.path) return null
	return `${process.env.API_URL}${product.image.path}`
}

const formatPrice = (price: string | number) => {
	const num = Number(price)
	return Number.isNaN(num) ? '—' : `$${num.toFixed(2)}`
}

// Búsqueda sobre la MISMA colección que ya carga la vista pública (GET
// /products, vía useProducts()) — sin endpoint ni mecanismo de búsqueda
// nuevo/duplicado (ver .claude/skills/servicios/). Coincide por título,
// subtítulo, descripción y, si aplica, el Servicio relacionado.
const filteredProducts = computed(() => {
	const term = searchTerm.value.trim().toLowerCase()
	if (!term) return products.value.data

	return products.value.data.filter((product) => {
		return (
			product.title?.toLowerCase().includes(term) ||
			product.subtitle?.toLowerCase().includes(term) ||
			product.description?.toLowerCase().includes(term) ||
			product.category?.title?.toLowerCase().includes(term)
		)
	})
})

// Agrupación real Producto -> Servicio (category), no una relación
// artificial armada en frontend — el orden de los grupos sigue el orden en
// que aparece cada Servicio en la colección ya ordenada por sort_order.
const groups = computed(() => {
	const map = new Map<string, { key: string; title: string; products: PublicProductRecord[] }>()

	for (const product of filteredProducts.value) {
		const key = product.category ? String(product.category.id) : 'sin-servicio'
		const title = product.category?.title ?? 'Otros productos'

		if (!map.has(key)) {
			map.set(key, { key, title, products: [] })
		}
		map.get(key)?.products.push(product)
	}

	return Array.from(map.values())
})

const openDetail = (product: PublicProductRecord) => {
	selected.value = product
	showDetail.value = true
}

const goBack = () => {
	router.push({ name: 'the_planet_init' })
}
</script>

<style scoped>
.bg-dark-page {
	background: radial-gradient(circle at top, rgba(255, 105, 180, 0.12), #060606 45%);
	min-height: 100vh;
}

.header-glass {
	background: rgba(0, 0, 0, 0.75);
	backdrop-filter: blur(12px);
	border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.toolbar-responsive {
	min-height: 64px;
}

.logo-mini {
	width: 44px;
	height: 44px;
	border-radius: 50%;
}

.text-gold {
	color: #d4af37;
}

.search-input {
	background: rgba(255, 255, 255, 0.04);
	border-radius: 24px;
}

.group-title {
	border-bottom: 1px solid rgba(212, 175, 55, 0.3);
	padding-bottom: 8px;
}

.products-grid {
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
	gap: 20px;
}

.product-card {
	background: #111;
	border: 1px solid #222;
	border-radius: 16px;
	overflow: hidden;
	transition: 0.25s;
}

.product-card:hover {
	border-color: #d4af37;
	transform: translateY(-4px);
}

.product-card-img {
	max-height: 180px;
}

.product-detail-card {
	background: #0c0c0c;
	color: #fff;
}
</style>
