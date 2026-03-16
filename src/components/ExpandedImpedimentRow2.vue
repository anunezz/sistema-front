<template>
  <q-card flat bordered class="q-pa-md bg-grey-1">
    <q-card-section class="q-pa-none">

      <section>
        <div class="text-h6 text-primary q-mb-sm">Datos del Impedimento</div>
        <div class="row q-col-gutter-md q-mb-md">
          <div class="col-12 col-md-4"><b>Número de impedimento:</b> {{ row.numero_impedimento }}</div>
          <div class="col-12 col-md-4">
            <b>Dependencia:</b>
            <q-icon
              :name="row.dependencia ? 'check_circle' : 'cancel'"
              :color="row.dependencia ? 'green' : 'red'"
              class="q-ml-sm"
            />
          </div>
          <div class="col-12 col-md-4"><b>Correo electrónico:</b> {{ row.correo_electronico }}</div>
        </div>
      </section>

      <q-separator color="grey-4" spaced />

      <section>
        <div class="text-h6 text-primary q-mb-sm">Datos Personales</div>
        <div class="row q-col-gutter-md q-mb-md">
          <div class="col-12 col-md-12"><b>CURP:</b> {{ row?.people?.curp }}</div>
          <div class="col-12 col-md-4"><b>Nombre:</b> {{ row?.people?.nombres }}</div>
          <div class="col-12 col-md-4"><b>Primer Apellido:</b> {{ row?.people?.primer_apellido }}</div>
          <div class="col-12 col-md-4"><b>Segundo Apellido:</b> {{ row?.people?.segundo_apellido }}</div>
          <div class="col-12 col-md-4"><b>Género:</b> {{ row?.people?.genre?.genero }}</div>
          <div class="col-12 col-md-4"><b>Entidad federativa de nacimiento:</b> {{ row?.people?.entidad_federativa_nacimiento }}</div>
          <div class="col-12 col-md-4"><b>Fecha de nacimiento:</b> {{ row?.people?.fecha_nacimiento }}</div>
        </div>
      </section>

      <q-separator color="grey-4" spaced />

      <section>
        <div class="text-h6 text-primary q-mb-sm">Datos personales de padre y madre (Si aplica)</div>
        <div class="row q-col-gutter-md q-mb-md">

          <div class="col-12 col-md-4"><b>Nombre(s) del padre:</b> {{ row?.people?.people_fathers?.nombres_padre }}</div>
          <div class="col-12 col-md-4"><b>Primer Apellido:</b> {{ row?.people?.people_fathers?.primer_apellido_padre }}</div>
          <div class="col-12 col-md-4"><b>Segundo Apellido:</b> {{ row?.people?.people_fathers?.segundo_apellido_padre }}</div>
          <div class="col-12 col-md-4"><b>Nombre(s) del madre:</b> {{ row?.people?.people_fathers?.nombres_madre }}</div>
          <div class="col-12 col-md-4"><b>Primer Apellido:</b> {{ row?.people?.people_fathers?.primer_apellido_madre }}</div>
          <div class="col-12 col-md-4"><b>Segundo Apellido:</b> {{ row?.people?.people_fathers?.segundo_apellido_madre }}</div>
        </div>
      </section>

      <q-separator color="grey-4" spaced />

      <section>
        <div class="text-h6 text-primary q-mb-sm">Motivación de acto jurídico</div>

        <div class="row q-col-gutter-md q-mb-md">
          <div class="col-12">
            <b>Causal:</b>
            <div class="text-justify">
              {{ row?.cat_causal_impedimento.causal_impedimento }}
            </div>
          </div>

		<div class="col-12" v-if="row.id_causal_impedimento == 19">
            <b>Otra:</b>
            <div>
				{{ row.causal_otro_descripcion }}
            </div>
          </div>

          <div class="col-12">
            <b>Subcausal:</b>
            <div>
              {{ row?.cat_subcausal_impedimento?.subcausal_impedimento }}
            </div>
          </div>

		<div class="col-12">
            <b>Plantilla:</b>
            <div v-html="row?.cat_subcausal_impedimento?.cat_plantilla?.plantilla" />
          </div>

          <div class="col-12">
            <b>Motivación de acto jurídico:</b>
            <div v-html="row?.motivacion_acto_juridico" />
          </div>
        </div>
      </section>

      <q-separator color="grey-4" spaced />

      <section>
        <div class="text-h6 text-primary q-mb-sm">Anexos</div>
        <ul v-if="row?.documents && row?.documents.length">
          	<li v-for="(item, i) in row?.documents" :key="i">
				{{ item.cat_anexo.nombre }}  - <a :href="get_href(item.url_documento)" target="_blank" v-if="item.url_documento" > {{ item.identificador_documento }} </a>
			</li>
        </ul>
        <div v-else class="text-grey">No hay anexos registrados.</div>
      </section>

      <q-separator color="grey-4" spaced />

      <div class="row justify-end q-mt-md">
        <q-btn
		  v-if="show"
          label="Seleccionar"
          outline
          color="primary"
          @click="$emit('select', row)"
        />
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup>
defineProps({
  row: Object,
  show:  {
    type: Boolean,
    default: true
  }
})

defineEmits(['select'])


const get_href = (url) => {
	return process.env.API_URL+url;
};

</script>
