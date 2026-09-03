<template>
	<div v-if="loading" class="row justify-center q-pa-xl">
		<q-spinner color="primary" size="60px" />
	</div>

	<section v-else id="productos" class="products-section bg-black q-px-md q-px-lg-lg q-py-xl">
		<div class="text-center q-mb-xl">
			<div class="text-h3 text-weight-bold text-gold">Nuestros Productos</div>
			<div class="text-subtitle1 text-grey-5 q-mt-sm">
				Línea profesional para el cuidado de tu belleza.
			</div>
		</div>

		<div v-if="featured.length" class="row justify-center">
			<div class="col-12 col-lg-10">
				<q-carousel
					v-model="slide"
					animated
					infinite
					arrows
					navigation
					swipeable
					height="420px"
					class="products-carousel"
				>
					<q-carousel-slide
						v-for="(product, idx) in featured"
						:key="product.id"
						:name="idx"
						class="product-slide"
					>
						<div class="product-slide-inner">
							<div
								class="product-slide-image"
								:style="
									imageUrl(product)
										? { backgroundImage: `url(${imageUrl(product)})` }
										: {}
								"
							>
								<q-icon
									v-if="!imageUrl(product)"
									name="image"
									size="72px"
									color="grey-8"
								/>
							</div>

							<div class="product-slide-content">
								<div
									v-if="product.category"
									class="text-caption text-pink-2 text-uppercase"
								>
									{{ product.category.title }}
								</div>
								<div class="text-h5 text-weight-bold text-gold">
									{{ product.title }}
								</div>
								<div
									v-if="product.subtitle"
									class="text-subtitle2 text-grey-4 q-mt-xs"
								>
									{{ product.subtitle }}
								</div>
								<div class="text-h6 text-pink-4 q-mt-sm">
									{{ formatPrice(product.price) }}
								</div>
							</div>
						</div>
					</q-carousel-slide>
				</q-carousel>
			</div>
		</div>

		<div v-else class="text-center text-grey-5">Aún no hay productos publicados.</div>

		<div class="text-center q-mt-xl">
			<q-btn
				unelevated
				rounded
				size="16px"
				color="pink-6"
				text-color="white"
				icon-right="arrow_forward"
				label="Ver más productos"
				class="see-more-btn"
				:to="{ name: 'the_planet_products' }"
			/>
		</div>
	</section>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useProducts } from 'src/composables/the_planet/useProducts'
import type { PublicProductRecord } from 'src/interfaces/product'

const { products, loading } = useProducts()

const slide = ref(0)

// "10 productos destacados" = los primeros 10 por sort_order (el backend ya
// entrega la colección ordenada así, ver ThePlanet\ProductController) —
// mismo mecanismo de prioridad usado en todo el módulo Servicios, sin campo
// "featured" nuevo (decisión confirmada con el usuario).
const featured = computed(() => products.value.data.slice(0, 10))

const imageUrl = (product: PublicProductRecord): string | null => {
	if (!product.image?.path) return null
	return `${process.env.API_URL}${product.image.path}`
}

const formatPrice = (price: string | number) => {
	const num = Number(price)
	return Number.isNaN(num) ? '—' : `$${num.toFixed(2)}`
}
</script>

<style scoped>
.products-section {
	background: #000;
	color: #fff;
	width: 100%;
}

.text-gold {
	color: #d4af37;
}

.products-carousel {
	border-radius: 30px;
	overflow: hidden;
	box-shadow:
		0 0 40px rgba(0, 0, 0, 0.45),
		0 0 20px rgba(212, 175, 55, 0.12);
}

.product-slide {
	padding: 0 !important;
}

.product-slide-inner {
	display: flex;
	height: 100%;
	width: 100%;
}

.product-slide-image {
	flex: 1 1 45%;
	background-color: #1a1a1a;
	background-size: cover;
	background-position: center;
	background-repeat: no-repeat;
	display: flex;
	align-items: center;
	justify-content: center;
}

.product-slide-content {
	flex: 1 1 55%;
	display: flex;
	flex-direction: column;
	justify-content: center;
	padding: 32px 40px;
	background: linear-gradient(135deg, #1a1a1a, #0c0c0c);
}

.see-more-btn {
	font-weight: 600;
	padding: 10px 28px;
}

@media (max-width: 768px) {
	.product-slide-inner {
		flex-direction: column;
	}

	.product-slide-image {
		flex-basis: 45%;
	}

	.product-slide-content {
		flex-basis: 55%;
		padding: 16px 20px;
	}

	.products-carousel {
		height: 480px !important;
	}
}
</style>
