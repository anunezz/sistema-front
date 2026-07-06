	<template>
		<header-section title="ADMINISTRACIÓN DE CATÁLOGOS"
			subtitle="Alta, edición y eliminación de registros de los catálogos del sistema." :icon-image="iconModule" ></header-section>

		<div class="q-pa-md">
			<div class="row q-col-gutter-md">
				<div class="col-md-12 col-sm-12 col-xs-12">
					<q-select outlined clearable v-model="selectedCat" :options="options" option-value="id"
						option-label="name" label="Tipo de catálogo" emit-value map-options />
				</div>
			</div>
			<br />

			<br />
			<CatCausalImpedimento v-if="selectedCat === 1" />
			<!-- <CatEntidadFederativa v-if="selectedCat === 2" />
			<CatEstatusSolicitud v-if="selectedCat === 3" /> -->
			<!-- <CatGeneralGenero v-if="selectedCat === 4" /> -->
			<!-- <CatMunicipio v-if="selectedCat === 5" /> -->
			<CatOficinas v-if="selectedCat === 6" />
			<CatCategorias v-if="selectedCat === 8" />
			<CatServicios v-if="selectedCat === 9" />

		</div>
	</template>
	<script setup>
	import { ref, onMounted, watch } from 'vue'
	import HeaderSection from 'components/HeaderSection.vue'
	import CatCausalImpedimento from './CatCausalImpedimento.vue'
	// import CatEntidadFederativa from './CatEntidadFederativa.vue'
	// import CatEstatusSolicitud from './CatEstatusSolicitud.vue'
	// import CatGeneralGenero from './CatGeneralGenero.vue'
	// import CatMunicipio from './CatMunicipio.vue'
	import CatOficinas from './CatOficinas.vue'
	import CatCategorias from './CatCategorias.vue'
	import CatServicios from './CatServicios.vue'
	import { BinnacleTransaction } from "src/utils/binnacle"
	import { useCatalogosStore } from 'src/stores/catalogo'
	import { storeToRefs } from 'pinia'

	import imageRoute from 'src/assets/icons/Home/admin_catalogos.png';

	const catalogosStore = useCatalogosStore()
	const { selectedCat } = storeToRefs(catalogosStore)
	const iconModule = ref(imageRoute);

	const options = ref([
		{ id: 1, name: 'Causales' },
		{ id: 8, name: 'Categorías' },
		{ id: 9, name: 'Servicios' },
		// { id: 3, name: 'Estatus' },
		// { id: 4, name: 'General' },
		// { id: 5, name: 'Municipio' },
		{ id: 6, name: 'Oficinas' },
		// { id: 7, name: 'Pais' },
	])

	watch(selectedCat, (newValue) => {
	const selected = options.value.find(opt => opt.id === newValue)
	if (selected) {
		BinnacleTransaction(10, 1, `Ingreso al catálogo: ${selected.name}`)
	}
	})


	onMounted(() => {
		BinnacleTransaction(10, 1, 'Ingreso al modulo de Administración de Catálogos')
	})
	</script>


	<style scoped>
	.cell {
		box-sizing: border-box;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: normal;
		word-break: break-all;
		line-height: 23px;
		padding-right: 10px;
	}

	.custom-card {
		background: linear-gradient(to bottom, #611232, #9b2247);
		color: white;
		border-radius: 4px;
		box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.3);
		height: 82px;
	}

	.custom-back-btn {
		border-radius: 5px;
		background-color: #611232;
		color: #611232;
		font-size: 16px;
		font-family: 'Noto San';
	}
	</style>
