<template>
  <header-section
    title="GENERACIÓN DE REPORTES"
    subtitle="Selección de datos para la elaboración de reportes de registros del sistema."
    :icon-image="iconModule"
  >
  </header-section>

  <Modal v-model="dialog" @keyup.enter="getRegisters()" title="Filtros Avanzados">
    <div class="q-pa-md">
      <div class="row q-col-gutter-xs">
        <div class="col-md-12 q-pa-md">
          <q-select
            ref="typeReportRef"
            @new-value="newValue"
            dense
            use-chips
            outlined
            use-input
            emit-value
            map-options
            v-model="filters.type_report"
            :options="options"
            option-value="id"
            option-label="name"
            label="Tipo de reporte"
            :rules="[isRequired]"
            clearable
          />
        </div>

        <div class="col-md-12 q-pa-md">
          <q-select
            @new-value="newValue"
            dense
            use-chips
            outlined
            use-input
            emit-value
            map-options
            v-model="filters.id_tipo_solicitud"
            :options="requestType"
            option-value="id_tipo_solicitud"
            option-label="tipo_solicitud"
            label="Tipo de solicitud"
            clearable
            multiple
            @filter="filterFnCatRequest"
          />
        </div>

        <div class="col-md-12 q-pa-md">
          <q-input
            dense
            style="width: 100%"
            mask="##-##-#### ##-##-####"
            label="Fecha inicial y Fecha final"
            outlined
            v-model="yesterday_input"
          >
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                  <q-date range v-model="yesterday" :locale="myLocale" :options="getDayCalendar">
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Cerrar" color="primary" flat></q-btn>
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </div>

        <div class="col-md-12 q-pa-md">
          <q-select
            @new-value="newValue"
            dense
            use-chips
            outlined
            use-input
            emit-value
            map-options
            v-model="filters.id_oficina"
            :options="offices"
            option-value="id_oficina"
            option-label="nombre_corto"
            label="Oficina"
            clearable
            multiple
            @filter="filterFnCatOffice"
          />
        </div>

        <div class="col-md-12 q-pa-md">
          <q-select
            @new-value="newValue"
            dense
            use-chips
            outlined
            use-input
            emit-value
            map-options
            v-model="filters.id_estatus_solicitud"
            :options="status"
            option-value="id_estatus_solicitud"
            option-label="estatus_solicitud"
            label="Estatus"
            clearable
            multiple
            @filter="filterFnCatStatus"
          />
        </div>
      </div>
      <br />
      <div class="row justify-center q-gutter-xs">
        <q-btn
          outline
          size="12px"
          color="white"
          text-color="black"
          icon="fas fa-eraser"
          @click="clearData()"
          label="Limpiar"
        />
        <q-btn
          outline
          size="12px"
          icon="fas fa-filter"
          color="primary"
          @click="getRegisters()"
          label="Buscar"
        />
      </div>
    </div>
  </Modal>

  <div class="col-12 q-pa-md">
  <div class="row q-justify-end">
    <div class="col-12">
      <q-btn
        outline
        size="12px"
        color="withe"
        icon="fa-solid fa-magnifying-glass"
        label="Filtros avanzados"
        @click="dialog = true"
        class="float-right"
      />
    </div>
  </div>
</div>
<!-- @click="dialog = true" -->
  <br />

  <div>
    <div class="row q-col-gutter-md" style="width: 100%">
      <div class="col-12 col-md-12 col-sm-12 col-xs-12">
        <div class="row justify-end q-gutter-xs">
          <!--<q-input
            outlined
            clearable
            dense
            :style="'width:' + ($q.screen.width <= 468 ? '100%' : '45%')"
            placeholder="Buscar..."
            v-model="search"
            @keyup.enter="getRegisters({ pagination: pagination })"
          >
            <template v-slot:append>
              <i
                class="fa-solid fa-magnifying-glass cursor-pointer"
                @click="getRegisters({ pagination: pagination })"
              />
            </template>
          </q-input>
          <q-btn
            class="q-ml-md custom-add-btn q-px-md q-py-sm"
            text-color="white"
            @click="newRegister"
          >
            <div class="row items-center no-wrap">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="25"
                height="25"
                fill="white"
                viewBox="0 0 16 16"
                class="q-mr-sm"
              >
                <path
                  d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3z"
                />
              </svg>
              <span>Crear Catálogo</span>
            </div>
          </q-btn>-->
        </div>
      </div>
    </div>

    <br />
    <q-table
      v-if="filters.type_report == 1"
      :rows="registers"
      :columns="columns1"
      separator="cell"
      no-data-label="No hay datos"
      dense
      rows-per-page-label="Registros por página"
      :pagination-label="
        (firstRowIndex, endRowIndex, totalRowsNumber) => {
          return `${firstRowIndex}-${endRowIndex} de ${totalRowsNumber}`
        }
      "
      flat
      bordered
      v-model:pagination="pagination"
      :rows-per-page-options="[5, 10, 20, 50, 100]"
      @request="getRegisters"
      row-key="id_causal_impedimento"
    >
      <template v-slot:top>
        <img src="~src/assets/icons/icon-table.png" />
        <div class="text-h6 q-ml-sm">Reporte</div>
        <q-space />
        <div
        v-if="registers.length"
          class="q-mr-sm"
          style="background-color: #00a982; padding: 8px; border-radius: 8px; border-radius: 50%"
        >
          <img src="~src/assets/icons/icon-export.png" @click="downloadExcel" />
          <q-tooltip>Exportar</q-tooltip>
        </div>

        <div
        v-if="registers.length"
          class="q-mr-sm"
          style="background-color: #00a982; padding: 8px; border-radius: 8px; border-radius: 50%"
        >
          <img src="~src/assets/icons/icon-print.png" @click="downloadPDF" />
          <q-tooltip>Imprimir</q-tooltip>
        </div>
      </template>

      <template v-slot:header="props">
        <q-tr :props="props">
          <q-th v-for="col in props.cols" :key="col.name" :props="props">
            <b>{{ col.label }}</b>
          </q-th>
        </q-tr>
      </template>
      <template v-slot:body="props">
        <q-tr :props="props" :class="[props.pageIndex % 2 != 0 ? 'bg-grey-3' : '', '']">
          <q-td>
            {{ props.row.id_solicitud }}
          </q-td>
          <q-td>
            {{ props.row.full_name }}
          </q-td>
          <q-td>
            {{ props.row.cat_office.nombre_corto }}
          </q-td>
          <q-td>
            {{
              date.formatDate(
                new Date(
                  new Date(
                    props.row.created_at.replace(
                      /(\d{2})\/(\d{2})\/(\d{4}) (\d{2}):(\d{2})/,
                      '$3-$2-$1T$4:$5:00'
                    )
                  ).getTime() - 6 * 60 * 60 * 1000
                ),
                'YYYY-MM-DD HH:mm'
              )
            }}
          </q-td>


          <q-td>
            {{ props.row.observaciones }}
          </q-td>
          <q-td
            style="max-width: 500px; white-space: normal; word-wrap: break-word; overflow-wrap: break-word;"
          >
            {{ props.row.cat_causal_impedimento?.causal_impedimento }}
          </q-td>

            <q-td>
            {{ props.row.cat_status.estatus_solicitud }}
          </q-td>
        </q-tr>
      </template>
    </q-table>

    <q-table
      v-if="filters.type_report == 2"
      row-key="hash_id"          
      v-model:expanded="expandedRows"    
      :rows="registers"
      :columns="columns2"
      separator="cell"
      no-data-label="No hay datos"
      dense
      rows-per-page-label="Registros por página"
      :pagination-label="
        (firstRowIndex, endRowIndex, totalRowsNumber) => {
          return `${firstRowIndex}-${endRowIndex} de ${totalRowsNumber}`
        }
      "
      flat
      bordered
      v-model:pagination="pagination"
      :rows-per-page-options="[5, 10, 20, 50, 100]"
      @request="getRegisters"

    >
      <template v-slot:top>
        <img src="~src/assets/icons/icon-table.png" />
        <div class="text-h6 q-ml-sm">Reporte</div>
        <q-space />
        <div
          class="q-mr-sm"
          style="background-color: #00a982; padding: 8px; border-radius: 8px; border-radius: 50%"
        >
          <img src="~src/assets/icons/icon-export.png" @click="downloadExcel" />
          <q-tooltip>Exportar</q-tooltip>
        </div>

        <div
          class="q-mr-sm"
          style="background-color: #00a982; padding: 8px; border-radius: 8px; border-radius: 50%"
        >
          <img src="~src/assets/icons/icon-print.png" @click="downloadPDF" />
          <q-tooltip>Imprimir</q-tooltip>
        </div>
      </template>

      <template v-slot:header="props">
        <q-tr :props="props">
          <q-th v-for="col in props.cols" :key="col.name" :props="props">
            <b>{{ col.label }}</b>
          </q-th>
        </q-tr>
      </template>
      <template v-slot:body="props">
        <q-tr :props="props" :class="[props.pageIndex % 2 != 0 ? 'bg-grey-3' : '', '']">
          <q-td>
            {{ props.row.numero_impedimento }}
          </q-td>
          <!--<q-td>
            {{ props.row.requests[0]?.cat_type.tipo_solicitud }}
          </q-td>
          <q-td>
            {{ props.row.requests[0]?.id_solicitud }}
          </q-td>
          <q-td>
            {{ props.row.requests[0]?.full_name }}
          </q-td>-->
          <q-td>
            {{ props.row.cat_office?.nombre_corto }}
          </q-td>
          <q-td>
            {{
              date.formatDate(
                new Date(
                  new Date(
                    props.row.created_at.replace(
                      /(\d{2})\/(\d{2})\/(\d{4}) (\d{2}):(\d{2})/,
                      '$3-$2-$1T$4:$5:00'
                    )
                  ).getTime() - 6 * 60 * 60 * 1000
                ),
                'YYYY-MM-DD HH:mm'
              )
            }}
          </q-td>

          <!--<q-td>
            {{ props.row.requests[0]?.observaciones }}
          </q-td>-->
          <q-td style="max-width: 500px; white-space: normal; word-wrap: break-word; overflow-wrap: break-word;"
          >
            {{ props.row.cat_causal_impedimento.causal_impedimento }}
          </q-td>
          <q-td
            style="max-width: 500px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap"
          >
            {{ props.row.cat_status.estatus_solicitud }}
          </q-td>
          <q-td style="width: 10%; text-align: center">
            <q-btn
              style="margin-right: 5px; background-color: #039b77; color: white"
              size="5px"
              @click="showRequests(props)"
            >
              <i class="far fa-eye" style="font-size: 15px" />
              <q-tooltip anchor="top middle" self="center middle"> Ver Solicitudes </q-tooltip>
            </q-btn>
          </q-td>
        </q-tr>

        <q-tr v-show="props.expand" :props="props">
          <q-td colspan="100%">
            <q-table
              :rows="props.row.requests"
              :columns="requestsColumns"
              dense
              flat
              bordered
              separator="cell"
              no-data-label="No hay solicitudes asociadas"
              hide-pagination
            />
          </q-td>
        </q-tr>
      </template>
    </q-table>
  </div>

  <br />
</template>
<script setup>
import { onMounted, ref } from 'vue'
import HeaderSection from 'components/HeaderSection.vue'
import Modal from 'src/components/Modal.vue'
import useReports from 'src/composables/administration/reports/useReports'
import { BinnacleTransaction } from 'src/utils/binnacle'

import imageRoute from 'src/assets/icons/Home/reportes.png'
import { date } from 'quasar'
import { watch } from 'vue'
const iconModule = ref(imageRoute)

const {
  yesterday,
  yesterday_input,
  myLocale,
  dialog,
  offices,
  options,
  filters,
  status,
  registers,
  columns1,
  columns2,
  requestsColumns,
  requestType,
  //search,
  pagination,
  clearData,
  getRegisters,
  downloadExcel,
  downloadPDF,
  getDayCalendar,
  showRequests,
  filterFnCatRequest,
  filterFnCatOffice,
  filterFnCatStatus,
} = useReports()

const newValue = (val, done) => {
  done(val)
}

// const fmt = (val) => {
//   if (!val) return '—'

//   // Detecta el formato tipo "dd/mm/yyyy HH:mm"
//   const match = val.match(/^(\d{2})\/(\d{2})\/(\d{4})\s+(\d{2}):(\d{2})$/)
//   if (match) {
//     const [, day, month, year, hour, minute] = match
//     // Crear un objeto Date en formato correcto
//     const parsed = new Date(`${year}-${month}-${day}T${hour}:${minute}:00`)
//     return date.formatDate(parsed, 'YYYY-MM-DD HH:mm')
//   }

//   // Si ya es un formato ISO u otro formato válido
//   return date.formatDate(val, 'YYYY-MM-DD HH:mm')
// }

watch(
  () => yesterday.value,
  (val) => {
    console.log('Nuevo valor de yesterday:', val)

        const formatDate = (d) => {
      if (!d) return ''
      const [year, month, day] = d.split('/')
      return `${day}-${month}-${year}`
    }

    if (typeof val === 'string') {
      // un solo día seleccionado
      const formatted = formatDate(val)
      filters.value.from = formatted
      filters.value.to = formatted
      yesterday_input.value = `${formatted} ${formatted}`
    } else if (val && val.from && val.to) {
      //rango de fechas
      const fromFormatted = formatDate(val.from)
      const toFormatted = formatDate(val.to)
      filters.value.from = fromFormatted
      filters.value.to = toFormatted
      yesterday_input.value = `${fromFormatted} ${toFormatted}`
    } else {
      yesterday_input.value = ''
      delete filters.value.from
      delete filters.value.to
    }

    console.log('filters:', filters.value)
  },
  { deep: true }
)


onMounted(() => {
  //Transicion bitacora (moduleId, typeTransactionId, 'action')
  BinnacleTransaction(11, 1, 'Ingreso al modulo de Generación de Reportes')
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

.custom-filter-btn {
  width: 250px;
  border-radius: 5px;
  background-color: #877350;
  color: white;
  font-size: 16px;
  font-family: 'Noto San';
}
</style>
