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
        <div class="text-h6 q-ml-sm">Catálogo de Género</div>
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
            {{ props.row.id_genero }}
          </q-td>
          <q-td>
            {{ props.row.genero }}
          </q-td>
          <q-td>
            {{ props.row.created_at }}
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
              style="background-color: #9f2241; color: white"
              size="5px"
              @click="customDelete(props.row.hash_id)"
            >
              <i class="far fa-trash-alt" style="font-size: 15px" />
              <q-tooltip anchor="top middle" self="center middle"> Eliminar </q-tooltip>
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
                <q-input
                  v-model="catForm.id_genero"
                  label="ID"
                  :rules="[isRequired, hasMinLength]"
                  clearable
                  outlined
                />
              </div>
              <div class="col-6">
                <q-input
                  v-model="catForm.genero"
                  label="Nombre del género"
                  :rules="[isRequired]"
                  clearable
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
import useCatGeneralGenero from 'src/composables/administration/catalogs/useCatGeneralGenero'
const {
  title,
  showModal,
  registers,
  columns,
  search,
  catForm,
  pagination,

  hasMinLength,
  getRegisters,
  editRegister,
  newRegister,
  onSubmit,
  onUpdate,
  customDelete,
} = useCatGeneralGenero()

getRegisters()
</script>

<style scoped>
</style>
