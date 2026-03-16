<template>
  <q-card flat bordered class="q-pa-md bg-grey-1">
    <q-card-section class="q-pa-none">

      <section>
        <div class="text-h6 text-primary q-mb-sm">Datos del Impedimento</div>
        <div class="row q-col-gutter-md q-mb-md">
          <div class="col-12 col-md-4"><b>Número de impedimento:</b> {{ row.impediment.numero_impedimento }}</div>
          <!-- <div class="col-12 col-md-4"><b>Oficina:</b> {{ row.impediment.oficina }}</div> -->
          <!-- <div class="col-12 col-md-4"><b>Semáforo de prioridad:</b> {{ row.impediment.semaforo_prioridad }}</div> -->
          <!-- <div class="col-12 col-md-4"><b>Urgencia:</b> {{ row.impediment.urgencia }}</div> -->
          <div class="col-12 col-md-4">
            <b>Dependencia:</b>
            <q-icon
              :name="row.impediment.dependencia ? 'check_circle' : 'cancel'"
              :color="row.impediment.dependencia ? 'green' : 'red'"
              class="q-ml-sm"
            />
          </div>
          <!-- <div class="col-12 col-md-4"><b>Fecha de registro:</b> {{ row.impediment.fecha_registro }}</div> -->
          <div class="col-12 col-md-4"><b>Correo electrónico:</b> {{ row.impediment.correo_electronico }}</div>
        </div>
      </section>

      <q-separator color="grey-4" spaced />

      <section>
        <div class="text-h6 text-primary q-mb-sm">Datos Personales</div>
        <div class="row q-col-gutter-md q-mb-md">
          <div class="col-12 col-md-12"><b>CURP:</b> {{ row.curp }}</div>
          <div class="col-12 col-md-4"><b>Nombre:</b> {{ row.nombres }}</div>
          <div class="col-12 col-md-4"><b>Primer Apellido:</b> {{ row.primer_apellido }}</div>
          <div class="col-12 col-md-4"><b>Segundo Apellido:</b> {{ row.segundo_apellido }}</div>
          <div class="col-12 col-md-4"><b>Correo electrónico:</b> {{ row.correo_electronico }}</div>
          <div class="col-12 col-md-4"><b>Entidad federativa de nacimiento:</b> {{ row.entidad_federativa_nacimiento }}</div>
          <div class="col-12 col-md-4"><b>Fecha de nacimiento:</b> {{ row.fecha_nacimiento }}</div>
        </div>
      </section>

      <q-separator color="grey-4" spaced />

      <section>
        <div class="text-h6 text-primary q-mb-sm">Datos personales de padre y madre (Si aplica)</div>
        <div class="row q-col-gutter-md q-mb-md">
          <div class="col-12 col-md-4"><b>Nombre(s) del padre:</b> {{ row?.people_fathers?.padre_nombres }}</div>
          <div class="col-12 col-md-4"><b>Primer Apellido:</b> {{ row?.people_fathers?.padre_primer_apellido }}</div>
          <div class="col-12 col-md-4"><b>Segundo Apellido:</b> {{ row?.people_fathers?.padre_segundo_apellido }}</div>
          <div class="col-12 col-md-4"><b>Nombre(s) del madre:</b> {{ row?.people_fathers?.madre_nombres }}</div>
          <div class="col-12 col-md-4"><b>Primer Apellido:</b> {{ row?.people_fathers?.madre_primer_apellido }}</div>
          <div class="col-12 col-md-4"><b>Segundo Apellido:</b> {{ row?.people_fathers?.madre_segundo_apellido }}</div>
        </div>
      </section>

      <q-separator color="grey-4" spaced />

      <section>
        <div class="text-h6 text-primary q-mb-sm">Motivación de acto jurídico</div>

        <div class="row q-col-gutter-md q-mb-md">
          <div class="col-12">
            <b>Causal:</b>
            <div class="text-justify">
              {{ row.impediment.cat_causal_impedimento.causal_impedimento }}
            </div>
          </div>

          <div class="col-12 col-md-6">
            <b>Subcausal:</b>
            <div>
              {{ row.impediment.cat_subcausal_impedimento.subcausal_impedimento }}
            </div>
          </div>

          <div class="col-12">
            <b>Motivación de acto jurídico:</b>
            <div>
              {{ row.impediment.motivacion_acto_juridico }}
            </div>
          </div>
        </div>
      </section>

      <q-separator color="grey-4" spaced />

      <section>
        <div class="text-h6 text-primary q-mb-sm">Anexos</div>
        <ul v-if="row.impediment.documents && row.impediment.documents.length">
          	<li v-for="(item, i) in row.impediment.documents" :key="i">
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
