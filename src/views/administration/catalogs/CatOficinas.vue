<template>
  <div>
    <div class="row q-col-gutter-md" style="width: 100%">
      <div class="col-12 col-md-12 col-sm-12 col-xs-12">
        <div class="row justify-end q-gutter-xs">
          <q-input
            outlined
            clearable
            dense
            :style="'width:' + ($q.screen.width <= 468 ? '100%' : '45%')"
            placeholder="Buscar..."
            v-model="search"
            v-max="100"
            @keyup.enter="getRegisters({ pagination: pagination })"
          >
            <template v-slot:append>
              <i
                class="fa-solid fa-magnifying-glass cursor-pointer"
                @click="getRegisters({ pagination: pagination })"
              />
            </template>
          </q-input>
          <!-- <q-btn
            class="q-ml-md q-px-md q-py-sm"
            size="md"
            text-color="white"
            label="Crear Catálogo"
            icon="fas fa-plus-circle"
            @click="newRegister"
            style="background: #877350"
          /> -->
        </div>
      </div>
    </div>

    <br />
    <q-table
      :rows="registers"
      :columns="columns"
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
        <div class="text-h6 q-ml-sm">Catálogo de Oficinas</div>
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
            {{ props.row.id_oficina }}
          </q-td>
          <q-td>
            {{ props.row.cad_oficina }}
          </q-td>
          <q-td>
            {{ props.row.nombre_corto }}
          </q-td>
          <q-td>
            {{ props.row.correo_electronico }}
          </q-td>
          <q-td>
            {{ date.formatDate(props.row.created_at,'DD-MM-YYYY HH:mm:ss') }}
          </q-td>
          <q-td>
            {{ props.row.bol_eliminado ? 'Si' : 'No' }}
          </q-td>

          <q-td style="width: 10%; text-align: center">
            <q-btn
              style="margin-right: 5px; background-color: #039b77; color: white"
              size="5px"
              @click="editRegister(props.row)"
            >
              <i class="far fa-edit" style="font-size: 15px" />
              <q-tooltip anchor="top middle" self="center middle"> Editar </q-tooltip>
            </q-btn>
            <q-btn
              :color="props.row.bol_eliminado ? 'primary' : ''"
              style="background-color: #9f2241; color: white"
              size="5px"
              @click="customDelete(props.row.hash_id,props.row.bol_eliminado)"
            >
              <i :class="['fa-solid',!!props.row.bol_eliminado ? 'fa-unlock' : 'fa-lock']" style="font-size: 15px" />
              <q-tooltip anchor="top middle" self="center middle"> {{props.row.bol_eliminado ? 'Habilitar' : 'Deshabilitar'}} </q-tooltip>
            </q-btn>
          </q-td>
        </q-tr>
      </template>
    </q-table>

    <q-dialog v-model="showModal" persistent transition-show="scale">
      <q-card style="width: 1000px; max-width: 80vw">
        <q-bar style="background: #c39326"> </q-bar>

        <q-card-section class="text-white" style="background: #877350; height: 52px">
          <div class="text-h6 justify-center">
            <q-icon name="person_add" class="q-mr-sm" />
            {{ title }}
          </div>
        </q-card-section>

        <br />
        <q-card-section>
          <q-form class="validate-form" @submit="catForm.action === 1 ? onSubmit() : onUpdate()">
            <div class="row q-col-gutter-md">
              <div class="col-6">
                <q-select
                  outlined
                  clearable
                  v-model="catForm.id_pais"
                  :options="countries"
                  :rules="[isRequired]"
                  option-value="id_pais"
                  option-label="cad_nombre_es"
                  label="País"
                  emit-value
                  map-options
                  :disable="catForm.action === 2 ? true: false"
                />
              </div>
              <!-- <div class="col-6">
                <q-input
                  v-model="catForm.id_oficina_suet"
                  label="Id Oficina SUET"
                  :rules="[onlyNumbers]"
                  clearable
                  outlined
                />
              </div> -->
              <div class="col-6">
                <q-input
                  v-model="catForm.cad_oficina"
                  label="Cad oficina"
                  :rules="[isRequired]"
                  clearable
                  outlined
                  :disable="catForm.action === 2 ? true: false"
                />
              </div>
              <div class="col-6">
                <q-input
                  v-model="catForm.nombre_corto"
                  label="Nombre de oficina"
                  :rules="[isRequired]"
                  clearable
                  outlined
                  :disable="catForm.action === 2 ? true: false"
                />
              </div>
              <div class="col-6">
                <q-input
                  v-model="catForm.correo_electronico"
                  label="Correo electrónico"
                  :rules="[isRequired]"
                  clearable
                  v-max="70"
                  outlined
                />
              </div>
              <q-checkbox
                v-if="catForm.action === 2"
                v-model="catForm.bol_eliminado"
                label="¿Deshabilitar?"
              />
            </div>
            <br />
            <div>
              <q-btn-group spread>
                <q-btn
                  icon="close"
                  @click="showModal = false"
                  text-color="white"
                  style="background-color: #9f2241"
                  label="Cancelar"
                >
                </q-btn>
                <q-btn
                  v-if="catForm.action === 1"
                  type="submit"
                  icon="save"
                  text-color="white"
                  style="background-color: #00a982"
                  label="Guardar"
                >
                </q-btn>
                <q-btn
                  v-else
                  type="submit"
                  icon="edit"
                  label="Actualizar"
                  text-color="white"
                  style="background-color: #00a982"
                >
                </q-btn>
              </q-btn-group>
            </div>
          </q-form>
          <br />
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import useCatOficinas from 'src/composables/administration/catalogs/useCatOficinas'
import { date } from 'quasar'
const {
  title,
  showModal,
  registers,
  columns,
  search,
  catForm,
  pagination,
  countries,

  getRegisters,
  editRegister,
  onSubmit,
  onUpdate,
  customDelete,
} = useCatOficinas()

getRegisters()
</script>

<style scoped>
</style>
