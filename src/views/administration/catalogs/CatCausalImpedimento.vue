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
          <q-btn
            class="q-ml-md q-px-md q-py-sm"
            size="md"
            text-color="white"
            label="Crear Catálogo"
            icon="fas fa-plus-circle"
            @click="newRegister"
            style="background: #877350"
          />
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
        <div class="text-h6 q-ml-sm">Catálogo de Causales</div>
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
            {{ props.row.id_causal_impedimento }}
          </q-td>
          <q-td
            style="max-width: 500px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap"
          >
            {{ props.row.causal_impedimento }}
          </q-td>
          <q-td> {{ date.formatDate(props.row.updated_at,'DD-MM-YYYY HH:mm:ss') }}</q-td>


          <q-td>
            {{ props.row.bol_eliminado ? 'Si' : 'No' }}
          </q-td>

          <q-td style="width: 10%; text-align: center">
            <q-btn
              style="margin-right: 5px; background-color: #8e3c2f; color: white"
              size="5px"
              @click="showModalTableSub(props.row)"
            >
              <i class="fas fa-eye" style="font-size: 15px" />
              <q-tooltip anchor="top middle" self="center middle"> Ver Subcausales </q-tooltip>
            </q-btn>
            <q-btn
              v-if="props.row.id_causal_impedimento < 10 || props.row.id_causal_impedimento > 19"
              style="margin-right: 5px; background-color: #2c69a2; color: white"
              size="5px"
              @click="showModalSub(props.row)"
            >
              <i class="fas fa-plus" style="font-size: 15px" />
              <q-tooltip anchor="top middle" self="center middle"> Agregar Subcausal </q-tooltip>
            </q-btn>
            <q-btn
              style="margin-right: 5px; background-color: #039b77; color: white"
              size="5px"
              @click="editRegister(props.row)"
            >
              <i class="far fa-edit" style="font-size: 15px" />
              <q-tooltip anchor="top middle" self="center middle"> Editar </q-tooltip>
            </q-btn>
            <q-btn
              style="background-color: #9f2241; color: white"
              size="5px"
              :color="props.row.bol_eliminado ? 'primary' : ''"
              @click="customDelete(props.row.hash_id,props.row.bol_eliminado)"
            >
              <i :class="['fa-solid', !!props.row.bol_eliminado ? 'fa-unlock' : 'fa-lock']" style="font-size: 15px" />
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
              <div class="col-12">
                <q-input
                  v-model="catForm.causal_impedimento"
                  label="Nombre del causal"
                  clearable
                  outlined
                  v-max="300"
                />
                <q-checkbox
                  v-if="catForm.action === 2"
                  v-model="catForm.bol_eliminado"
                  label="¿Deshabilitar?"
                />
                <q-checkbox
                  v-if="catForm.action === 2"
                  v-model="catForm.validate_high"
                  label="Validación de altas"
                />
              </div>
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

    <q-dialog v-model="showModalAddSub" persistent transition-show="scale">
      <q-card style="width: 1000px; max-width: 80vw">
        <q-bar style="background: #c39326"> </q-bar>

        <q-card-section class="text-white" style="background: #877350; height: 52px">
          <div class="text-h6 justify-center">
            <q-icon name="person_add" class="q-mr-sm" />
            {{ titleSub }}
          </div>
        </q-card-section>

        <br />
        <q-card-section>
          <q-form
            class="validate-form"
            @submit="catFormSub.action === 1 ? onSubmitSub() : onUpdateSub()"
          >
            <div class="row q-col-gutter-md">
              <div class="col-12">
                <q-input
                  v-max="120"
                  v-model="catFormSub.subcausal_impedimento"
                  label="Nombre del subcausal"
                  clearable
                  outlined
                />
              </div>
            </div>
            <br />
            <div>
              <q-btn-group spread>
                <q-btn
                  icon="close"
                  @click="showModalAddSub = false"
                  text-color="white"
                  style="background-color: #9f2241"
                  label="Cancelar"
                >
                </q-btn>
                <q-btn
                  v-if="catFormSub.action === 1"
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

    <q-dialog v-model="showModalTable" persistent transition-show="scale">
      <q-card style="width: 1000px; max-width: 80vw">
        <q-bar style="background: #c39326"> </q-bar>
        <br />
        <q-card-section class="row justify-end q-gutter-xs">
          <q-input
            outlined
            clearable
            dense
            :style="'width:' + ($q.screen.width <= 468 ? '100%' : '45%')"
            placeholder="Buscar..."
            v-max="100"
            v-model="searchSub"
            @keyup.enter="getRegistersSub({ pagination: pagination })"
          >
            <template v-slot:append>
              <i
                class="fa-solid fa-magnifying-glass cursor-pointer"
                @click="getRegistersSub({ pagination: pagination })"
              />
            </template>
          </q-input>
        </q-card-section>
        <q-card-section>
          <q-table
            :rows="registersSub"
            :columns="columnsSub"
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
            v-model:pagination="paginationSub"
            :rows-per-page-options="[5, 10, 20, 50, 100]"
            @request="getRegistersSub"
            row-key="id_causal_impedimento"
          >
            <template v-slot:top>
              <div class="text-h6 q-ml-sm">Catálogo de Subcausales</div>
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
                  {{ props.row.subcausal_impedimento }}
                </q-td>
                <q-td> {{ date.formatDate(props.row.updated_at,'DD-MM-YYYY HH:mm:ss') }}</q-td>
                <q-td>
                  {{ props.row.bol_eliminado ? 'Si' : 'No' }}
                </q-td>
                <q-td style="width: 10%; text-align: center">
                  <q-btn
                    style="margin-right: 5px; background-color: #039b77; color: white"
                    size="5px"
                    @click="editRegisterSub(props.row)"
                  >
                    <i class="far fa-edit" style="font-size: 15px" />
                    <q-tooltip anchor="top middle" self="center middle"> Editar </q-tooltip>
                  </q-btn>
                  <q-btn
                    style="background-color: #9f2241; color: white"
                    size="5px"
                    :color="props.row.bol_eliminado ? 'primary' : ''"
                    @click="customDeleteSub(props.row.hash_id,props.row.bol_eliminado)"
                  >
                    <i :class="['fa-solid', !!props.row.bol_eliminado ? 'fa-lock' : 'fa-unlock']"  style="font-size: 15px" />
                    <q-tooltip anchor="top middle" self="center middle"> {{!!props.row.bol_eliminado ? 'Habilitar' : 'Deshabilitar'}} </q-tooltip>
                  </q-btn>
                </q-td>
              </q-tr>
            </template>
          </q-table>
        </q-card-section>
        <q-card-section style="margin: 0px">
          <div class="row q-gutter-xs justify-end">
            <q-btn
              outline
              icon="close"
              @click="showModalTable = false"
              text-color="black"
              style="background-color: #9f2241"
              label="Cerrar"
            >
            </q-btn>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { date } from 'quasar'
import useCatCausalImpedimento from 'src/composables/administration/catalogs/useCatCausalImpedimento'
const {
  title,
  showModal,
  registers,
  columns,
  search,
  catForm,
  pagination,
  getRegisters,
  editRegister,
  newRegister,
  onSubmit,
  onUpdate,
  customDelete,

  titleSub,
  showModalAddSub,
  catFormSub,
  showModalTable,
  searchSub,
  registersSub,
  paginationSub,
  columnsSub,
  showModalSub,
  onSubmitSub,
  showModalTableSub,
  getRegistersSub,
  editRegisterSub,
  onUpdateSub,
  customDeleteSub,
} = useCatCausalImpedimento()

getRegisters()
</script>

<style scoped>
</style>
