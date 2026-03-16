<template>
  <header-section
    title="REPORTE ESTADÍSTICO DE IMPEDIMENTOS"
    subtitle="Selección de datos para la elaboración de reportes de registros del sistema."
    :icon-image="iconModule"
  >
  </header-section>

  <Modal v-model="dialog" @keyup.enter="getRegisters()" title="Filtros Avanzados">
    <div class="q-pa-md">
      <div class="row q-col-gutter-xs">
        <!--<div class="col-md-12 q-pa-md">
          <q-input dense outlined label="Mes y Año" v-model="displayValue" style="width: 100%">
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                  <q-date
                    v-model="filters.date"
                    mask="YYYY-MM"
                    type="month"
                    @update:model-value="updateDisplay"
                  >
                    <div class="row items-center justify-end q-pa-sm">
                      <q-btn v-close-popup label="Cerrar" color="primary" flat />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </div>-->
  <!-- RANGO DE FECHAS (queda deshabilitado si hay Mes+Año) -->
<div class="col-md-12 q-pa-md">
  <q-input
    dense
    style="width: 100%"
    mask="##-##-#### ##-##-####"
    label="Fecha inicial y fecha final"
    outlined
    v-model="yesterday_input"
    clearable
    @clear="clearDateRange"
    :disable="!!(monthYear.month && monthYear.year)"
  >
    <template v-slot:append>
      <q-icon name="event" class="cursor-pointer">
        <q-popup-proxy cover transition-show="scale" transition-hide="scale">
          <q-date
            range
            v-model="yesterday"
            :locale="myLocale"
            :options="getDayCalendar"
          >
            <div class="row items-center justify-end">
              <q-btn v-close-popup label="Cerrar" color="primary" flat/>
            </div>
          </q-date>
        </q-popup-proxy>
      </q-icon>
    </template>
  </q-input>
</div>

<div class="col-md-12 q-pa-md">
  <q-select
    v-model="monthYear.month"
    :options="monthsForSelectedYear"
    option-value="value"
    option-label="label"
    emit-value
    map-options
    dense
    outlined
    use-input
    use-chips
    clearable
    options-dense
    label="Mes"
    :disable="!!(yesterday && yesterday.from && yesterday.to)"
    @clear="() => { monthYear.month = null }"
  />
</div>

<div class="col-md-12 q-pa-md">
  <q-select
    v-model="monthYear.year"
    :options="yearOptions"
    option-value="value"
    option-label="label"
    emit-value
    map-options
    dense
    outlined
    use-input
    use-chips
    clearable
    options-dense
    label="Año"
    rules="required"
    :disable="!monthYear.month || !!(yesterday && yesterday.from && yesterday.to)"
    @clear="() => { monthYear.year = null }"
  />
</div>



        <div class="col-md-12 q-pa-md">
          <q-select
            @update:model-value="onUserSelected"
            @filter="filterUsers"
            dense
            use-chips
            outlined
            use-input
            emit-value
            map-options
            v-model="filters.id_user"
            :options="optionUsers"
            option-value="id"
            option-label="username"
            multiple
            clearable
            label="usuario"
            :input-value="searchUser"
            @update:input-value="val => (searchUser = val)"
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
            v-model="filters.id_causal_impedimento"
            :options="causeImpediments"
            option-value="id_causal_impedimento"
            option-label="causal_impedimento"
            label="Causal"
            clearable
            multiple
            @filter="filterFnCatCausal"
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
            v-model="filters.id_causal_subimpedimento"
            :options="causeSubimpediments"
            option-value="id_subcausal_impedimento"
            option-label="subcausal_impedimento"
            label="Subcausal"
            clearable
            multiple
            @filter="filterFnCatSubcausal"
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

  <br />

  <div>
    <q-table
      :rows="registers"
      :columns="columnsToShow.map(c => ({
        ...c,
        classes: (c.name === 'usuario' && !filters.id_user) ? 'hidden' : ''
      }))"
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
      :row-key="rowKeyFn"
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
  <q-tr :props="props">
    <q-td v-for="col in props.cols" :key="col.name" :props="props">
      {{ col.value }}
    </q-td>
  </q-tr>
</template>

    </q-table>
  </div>

  <br />
</template>
<script setup>
import { onMounted, ref,watch } from 'vue'
import HeaderSection from 'components/HeaderSection.vue'
import Modal from 'src/components/Modal.vue'
import useImpediments from 'src/composables/administration/reports/useImpediments'

import imageRoute from 'src/assets/icons/Home/reporte_estadistico_impedimentos.png'
import { BinnacleTransaction } from 'src/utils/binnacle'
const iconModule = ref(imageRoute)

const {
  yesterday,
  yesterday_input,
  myLocale,
  //displayValue,
  dialog,
  offices,
  optionUsers,
  filters,
  registers,
  causeImpediments,
  causeSubimpediments,
  //search,
  columnsToShow,
  pagination,
  monthsForSelectedYear,
  yearOptions,
  monthYear,
  getDayCalendar,
  clearData,
  getRegisters,
  downloadExcel,
  downloadPDF,
  //updateDisplay,
  filterFnCatOffice,
  filterFnCatCausal,
  filterFnCatSubcausal,
  rowKeyFn,
  onUserSelected,
  filterUsers
} = useImpediments()

const newValue = (val, done) => {
  done(val)
}

// helpers para limpiar un filtro cuando el otro se usa
const clearDateRange = () => {
  yesterday.value = null
  yesterday_input.value = ''
  delete filters.value.from
  delete filters.value.to
}

const clearMonthYear = () => {
  monthYear.value.month = null
  monthYear.value.year = null
  delete filters.value.month
  delete filters.value.year
}

const formatDate = (dateStr) => {
  if (!dateStr) return ''
  const [year, month, day] = dateStr.split('/')
  return `${day}-${month}-${year}`
}

//  Mes/Año, limpiamos rango de fechas
watch(
  () => ({ m: monthYear.value.month, y: monthYear.value.year }),
  ({ m, y }) => {
    if (m || y) clearDateRange()

    if (m && y) {
      filters.value.month = m
      filters.value.year  = y
    } else {
      delete filters.value.month
      delete filters.value.year
    }
  },
  { deep: false }
)

// ⬅️ Si el usuario elige un rango de fechas, limpiamos Mes/Año
watch(
  () => yesterday.value,
  (val) => {
    const formatDate = (d) => {
      const date = new Date(d)
      const dd = String(date.getDate()).padStart(2, '0')
      const mm = String(date.getMonth() + 1).padStart(2, '0')
      const yyyy = date.getFullYear()
      return `${dd}-${mm}-${yyyy}`
    }

    if (val && val.from && val.to) {
      
      clearMonthYear()
      filters.value.from = formatDate(val.from)
      filters.value.to   = formatDate(val.to)
      yesterday_input.value = `${filters.value.from} ${filters.value.to}`
    } else if (typeof val === 'string') {
      
      clearMonthYear()
      const formatted = formatDate(val)
      filters.value.from = formatted
      filters.value.to   = formatted
      yesterday_input.value = `${formatted} ${formatted}`
    } else {
      yesterday_input.value = ''
      delete filters.value.from
      delete filters.value.to
    }
  },
  { deep: true }
)

// Si el mes se limpia, también limpia el año para que no quede "pintado" deshabilitado
watch(
  () => monthYear.value.month,
  (m) => {
    if (!m && monthYear.value.year) {
      monthYear.value.year = null
      delete filters.value.year
    }
  }
)

watch(yesterday, (newValue) => {
  console.log('Nuevo valor de yesterday:', newValue)

  if (typeof newValue === 'string') {
    //  Solo una fecha seleccionada
    const formatted = formatDate(newValue)
    // Asignamos el mismo día desde las 00 hasta las 23:59
    yesterday_input.value = `${formatted} ${formatted}`
  } else if (newValue && newValue.from && newValue.to) {
    //  Rango de fechas seleccionado
    const fromFormatted = formatDate(newValue.from)
    const toFormatted = formatDate(newValue.to)
    yesterday_input.value = `${fromFormatted} ${toFormatted}`
  } else {
    yesterday_input.value = ''
  }

  console.log('Valor de yesterday_input:', yesterday_input.value)
})



onMounted(() => {
  //Transicion bitacora (moduleId, typeTransactionId, 'action')
  BinnacleTransaction(15, 1, 'Ingreso al modulo de Reporte estadistico de impedimentos')
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
