<template>

  <div
    v-if="loading"
    class="row justify-center q-pa-xl"
  >
    <q-spinner
      color="primary"
      size="60px"
    />
  </div>

	<section
		v-else
		id="servicios"
		class="service-section bg-black q-px-md q-px-lg-lg q-py-xl"
	>
    <!-- TITULO -->

    <div class="text-center q-mb-xl">

      <div class="text-h3 text-weight-bold text-gold">
        Nuestros Servicios
      </div>

      <div class="text-subtitle1 text-grey-5 q-mt-sm">
        Bienestar físico, mental y belleza integral.
      </div>

    </div>

    <!-- CATEGORIAS -->

    <div class="services-grid q-mb-xl ">

      <q-card

        v-for="category in services?.data"

        :key="category.id"

        clickable

        flat

        @click="selectCategory(category)"

        :class="[

          'service-card',

          selectedCategory?.id === category.id
            ? 'service-card-active'
            : ''

        ]"

      >

        <q-card-section class="text-center">

          <q-icon

            :name="category.icon"

            size="58px"

            color="pink-4"

          />

          <div class="text-h6 text-gold q-mt-md">

            {{ category.title }}

          </div>

          <div class="text-body2 text-grey-4 q-mt-sm">

            {{ category.subtitle }}

          </div>

        </q-card-section>

      </q-card>

    </div>

    <!-- CONTENIDO -->

    <div
      v-if="selectedCategory?.content"
      class="row q-col-gutter-xl items-start"
    >

      <!-- TEXTO -->

      <div class="col-12 col-lg-6">

        <div class="content-container">

          <div
            class="text-h2 text-weight-bold text-gold"
          >
            {{ selectedCategory.content.title }}
          </div>

          <div
            class="text-h2 text-weight-bold text-pink q-mb-lg"
          >
            {{ selectedCategory.content.subtitle }}
          </div>

          <div

            class="text-body1 text-grey-3 q-mb-lg"

            v-html="selectedCategory.content.description"

          />

          <div

            class="content-html"

            v-html="selectedCategory.content.content"

          />

        </div>

      </div>

      <!-- SLIDER -->

      <div class="col-12 col-lg-6">

		<q-carousel v-model="slideAbout"
		animated
		infinite
		arrows
		navigation
		swipeable
		height="600px"
		class="about-carousel"
		>

			<q-carousel-slide
				v-for="(slider, idx) in selectedCategory?.content?.slider_items" :key="slider.id ?? idx"
				:name="idx"
				class="slider-item-slide"
			>

				<div
					class="carousel-slide-bg"
					:style="sliderImageUrl(slider) ? { backgroundImage: `url(${sliderImageUrl(slider)})` } : {}"
				>
					<q-icon
						v-if="!sliderImageUrl(slider)"
						name="image"
						size="72px"
						color="grey-8"
					/>
				</div>

				<div class="carousel-overlay"></div>

				<div class="carousel-content">

				<div class="text-h3 text-weight-bold text-gold" v-text="slider.title" />

				<div class="text-subtitle1 text-white q-mt-md" v-html="slider.description" />

				<!-- <q-btn
					class="q-mt-lg"
					color="pink-6"
					rounded
					unelevated
					icon="self_improvement"
					label="Explorar"
				/> -->

				</div>

			</q-carousel-slide>


		</q-carousel>

      </div>

    </div>

  </section>

</template>


<script setup lang="ts">
import { ref, watch } from 'vue'

import { useServices } from 'src/composables/the_planet/useServices'

const slideAbout = ref(0)

import type {
  ServiceCategory,
  ServiceSliderItem
} from 'src/interfaces/service'

const sliderImageUrl = (slider: ServiceSliderItem): string | null => {
  if (!slider.image?.path) return null
  return `${process.env.API_URL}${slider.image.path}`
}



const {
  services,
  loading
} = useServices()

/*
|--------------------------------------------------------------------------
| Estado
|--------------------------------------------------------------------------
*/

const selectedCategory = ref<ServiceCategory | null>(null)

const slide = ref<number | string>(1)

/*
|--------------------------------------------------------------------------
| Seleccionar categoría
|--------------------------------------------------------------------------
*/

const selectCategory = (category: ServiceCategory): void => {

  selectedCategory.value = category
  console.log("opopo; ",selectedCategory.value);
  slideAbout.value = 0;

  if (
    category.content &&
    category.content.slider_items &&
    category.content.slider_items.length
  ) {
    slide.value = category.content.slider_items[0].id
  }

}

/*
|--------------------------------------------------------------------------
| Cuando llegan los datos del API
|--------------------------------------------------------------------------
*/

watch(

  services,

  (response) => {

    if (
      response &&
      response.data &&
      response.data.length
    ) {

      if (!selectedCategory.value) {

        selectedCategory.value = response.data[0]

        if (
          response.data[0].content &&
          response.data[0].content.slider_items.length
        ) {

          slide.value =
            response.data[0]
              .content
              .slider_items[0]
              .id

        }

      }

    }

  },

  {
    immediate: true,
    deep: true
  }

)

/*
|--------------------------------------------------------------------------
| Helpers
|--------------------------------------------------------------------------
*/

// const currentSlider = (): ServiceSlider[] => {

//   if (!selectedCategory.value) {
//     return []
//   }

//   return selectedCategory.value.content?.slider_items ?? []

// }
</script>

<style scoped>

.service-section{
    background:#000;
    color:#fff;
    width:100%;
}

/*=============================
=        CATEGORIAS
=============================*/

.services-grid{

    display:grid;

    grid-template-columns:repeat(4,1fr);

    gap:20px;

    margin-bottom:40px;

}

.service-card{

    cursor:pointer;

    background:#111;

    border:1px solid #222;

    border-radius:20px;

    transition:.25s;

}

.service-card:hover{

    border-color:#d4af37;

    transform:translateY(-4px);

}

.service-card-active{

    border:2px solid #d4af37;

    box-shadow:0 0 25px rgba(212,175,55,.15);

}

.text-gold{

    color:#d4af37;

}

.text-pink{

    color:#ff4d9d;

}

/*=============================
=       CONTENIDO
=============================*/

.content-container{

    height:100%;

    display:flex;

    flex-direction:column;

    justify-content:center;

}

.content-html{

    line-height:1.8;

    color:#ddd;

}

.content-html :deep(ul){

    padding-left:20px;

}

.content-html :deep(li){

    margin-bottom:10px;

}

/*=============================
=         SLIDER
=============================*/

.slider-card{

    border-radius:25px;

    overflow:hidden;

    background:#111;

}

.slider-image-wrapper{

    position:relative;

    width:100%;

    height:100%;

}

.slider-image{

    width:100%;

    height:100%;

    object-fit:cover;

}

.slider-overlay{

    position:absolute;

    inset:0;

    background:linear-gradient(

        transparent,

        rgba(0,0,0,.75)

    );

    display:flex;

    align-items:flex-end;

}

.slider-content{

    padding:30px;

    color:#fff;

    width:100%;

}

/*=============================
=       TABLET
=============================*/

@media(max-width:1024px){

.services-grid{

    grid-template-columns:repeat(2,1fr);

}

.slider-card{

    height:420px !important;

}

}

/*=============================
=       CELULAR
=============================*/

@media(max-width:768px){

.services-grid{

    display:grid;

    grid-template-columns:1fr;

    gap:18px;

}

.service-card{

    width:100%;

}

.row{

    display:block;

}

.col-12{

    width:100%;

}

.content-container{

    margin-top:35px;

}

.slider-card{

    margin-top:30px;

    height:280px !important;

}

.slider-content{

    padding:18px;

}

.text-h2{

    font-size:2rem;

}

.text-h3{

    font-size:1.5rem;

}

}

/*=============================
=      ANIMACIONES
=============================*/

.service-card,
.slider-card{

    transition:.30s;

}



.slider-item-slide {
  padding: 0 !important;
}

.carousel-slide-bg {
  position: absolute;
  inset: 0;
  background-color: #1a1a1a;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  display: flex;
  align-items: center;
  justify-content: center;
}

.carousel-overlay {

  position: absolute;
  inset: 0;

  background:
    linear-gradient(
      135deg,
      rgba(0,0,0,0.72),
      rgba(0,0,0,0.25)
    );

}

.carousel-content {

  position: absolute;

z-index: 2;

  left: 50px;
  bottom: 60px;

  max-width: 500px;

  pointer-events: none;

}

@media (max-width: 768px) {

  .carousel-content {

    left: 20px;
    right: 20px;
    bottom: 30px;

  }

}


.about-carousel {
  border-radius: 30px;
  overflow: hidden;
  box-shadow:
    0 0 40px rgba(0,0,0,0.45),
    0 0 20px rgba(212,175,55,0.12);
}

.about-carousel .q-carousel__slide {
  background-size: cover;
  background-position: center;
}

@media (max-width: 768px) {

  .about-carousel {
    height: 350px !important;
  }

}

</style>
