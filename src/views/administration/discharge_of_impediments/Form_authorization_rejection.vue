<template>
  <header-section title="Autorización de rechazos" url-redirect="InboxAuthorizationRejection" :icon-image="iconModule">
  </header-section>
  <br>

  <q-dialog v-model="dialog" persistent>
    <q-card style="min-width: 1200px; max-width: 800px;">
      <q-card-section>
        <div class="text-h6" v-if="action_save_form == 2">Motivo de la autorización del rechazo</div>
        <div class="text-h6" v-if="action_save_form == 3">Motivo de cancelación de rechazo</div>
      </q-card-section>

      <q-form @submit.prevent="validateFields()" ref="rejectForm">
        <q-card-section>
            <q-input
            type="textarea"
            outlined
            clearable
            style="width: 100%"
            dense
            label="Observaciones"
            v-max="500"
            :rules="[val => !!val || 'El campo no puede estar vacío']"
            v-model="observaciones_rechazos" v-uppercase>
          </q-input>
        </q-card-section>
      <q-card-actions align="right">
        <q-btn flat label="Cerrar" color="secondary" @click="dialog = false" />
        <q-btn v-if="action_save_form == 2" label="Autorización de rechazo" type="submit" color="negative" />
        <q-btn v-if="action_save_form == 3" label="Cancelar rechazo" type="submit" color="negative" />
      </q-card-actions>
    </q-form>
    </q-card>
  </q-dialog>

   <q-dialog v-model="dialogConfirm" persistent>
  <q-card style="width: 500px; max-width: 90vw;">
    <!-- Título -->
    <q-card-section>
      <div class="text-h6 text-primary">{{ title }}</div>
    </q-card-section>

    <!-- Mensaje -->
    <q-card-section>
      <div class="text-subtitle1">
        <q-icon name="help_outline" color="primary" class="q-mr-sm" />
        <span v-html="message"></span>
      </div>
    </q-card-section>

    <!-- Botones -->
    <q-card-actions align="right">
      <q-btn flat label="Cerrar" color="negative" @click="dialogConfirm = false" />
      <q-btn :label="label_btn" @click="actionForm" color="positive" icon="save" />
    </q-card-actions>
  </q-card>
</q-dialog>

  <div class="q-pa-md">
    <q-form
      class="q-gutter-md"
      ref="myForm"
    >
      <div class="row q-col-gutter-xs">
        <div class="col-md-12" v-if="id_estatus_solicitud == 300">
          <q-banner
            class="bg-red-2 text-black q-mb-md"
            rounded
          >
            <div class="text-subtitle1 text-bold">Observaciones</div>
            <div class="q-mt-sm observaciones-text" v-html="observaciones" />
          </q-banner>
        </div>

        <div class="col-md-12 q-pa-md">
          <h5>
            <q-btn
              round
              color="orange"
              text-color="grey-9">
              <q-avatar size="24px">
                <img src="~src/assets/icons/icon-lista.png">
              </q-avatar>
            </q-btn>
            Datos de seguimiento
          </h5>
        </div>

		<div class="col-md-12 q-pa-md" >
			<label style='font-weight: bold;'>Número documento</label>
			<q-input
				outlined
				clearable
				style="width: 100%"
				dense
				placeholder="Número documento"
				v-model="form.numero_documento"
                v-max="100"
				/>
        </div>

		<div class="col-md-12 q-pa-md" v-if="form.id_solicitud">
          <label style='font-weight: bold;'>Id solicitud</label>
          <q-input
		  	:disable="true"
            outlined
            clearable
            style="width: 100%"
            dense
            placeholder="Id Solicitud"
            v-max="100"
            v-model="form.id_solicitud"
            />
        </div>

        <div class="col-md-6 q-pa-md">
          <label for='id_impediment' style='font-weight: bold;'>Tipo de solicitud</label>
          <q-select
            :disable="true"
            @update:model-value="get_cats()"
            @new-value="newValue"
            dense
            use-chips
            outlined
            use-input
            emit-value
            map-options
            v-model='form.id_tipo_solicitud'
            :options='options.cat_tipo_solicitud'
            option-value='id_tipo_solicitud'
            option-label='tipo_solicitud'
            label='Tipo de solicitud'
            :rules="[isRequired]"
            clearable/>
        </div>

        <div class="col-md-6 q-pa-md">
          <label for='id_impediment' style='font-weight: bold;'>Oficina</label>
          <q-select
            :disable="([3, 4, 5].includes(store.user.perfil.id_perfil) ? false : true )"
			@update:model-value="onOficinaSelected"
            @new-value="newValue"
            dense
            use-chips
            outlined
            use-input
            emit-value
            map-options
            v-model='form.id_oficina'
            :options="optionOffices"
			@filter="filterOffices"
            option-value='id_oficina'
            option-label='cad_oficina'
            label='Oficina'
            :rules="[isRequired]"
            clearable/>
        </div>

        <div class="col-md-6 q-pa-md">
          <label for='id_impediment' style='font-weight: bold;'>Semáforo de prioridad</label>
          <q-select
            @new-value="newValue"
            dense
            use-chips
            outlined
            use-input
            emit-value
            map-options
            v-model='form.id_prioridad'
            :options='options.cat_prioridades'
            option-value='id_prioridad'
            option-label='prioridad'
            label='Semáforo de prioridad'
            :rules="[isRequired]"
            clearable/>
        </div>

        <div class="col-md-3 q-pa-md">
          <br>
          <q-checkbox
            v-model="form.urgencia"
            label="Urgencia"
          />
        </div>
        <div class="col-md-3 q-pa-md">
          <br>
          <q-checkbox
            v-model="form.dependencia"
            label="Dependencia"
          />
        </div>

        <div class="col-md-12 q-pa-md" v-if="form.dependencia">
          <label style='font-weight: bold;'>Dependencia *</label>
          <q-input
            outlined
            clearable
            style="width: 100%"
            dense
		    placeholder="Dependencia"
            v-model="form.nombre_dependencia"
		    v-alfanumerico
            v-uppercase
            v-max="100"
            :rules="[isRequired]"
			/>
        </div>

        <div class="col-md-6 q-pa-md">
          <label style='font-weight: bold;'>Fecha de solicitud</label>
          <q-input
            :disable="true"
            outlined
            dense
            label="Fecha de solicitud"
            v-model="form.fecha_registro"
            mask="##-##-####"
            :rules="[isRequired]">
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                  <q-date v-model="state_date" mask="DD-MM-YYYY"  :locale="myLocale" minimal >
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Cerrar" color="primary" flat />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </div>


        <div class="col-md-6 q-pa-md">
          <label style='font-weight: bold;'>Correo electrónico</label>
          <q-input
            outlined
            clearable
            style="width: 100%"
            dense
            placeholder="Correo electrónico"
            v-model="form.correo_electronico"
            :rules="[isRequired,isValidEmail]"
            v-uppercase
            v-max="70"
            />
        </div>

        <div class="col-md-12 q-pa-md">
          <h5>
            <q-btn
              round
              color="orange"
              text-color="grey-9">
              <q-avatar size="24px">
                <img src="~src/assets/icons/icon-user.png">
              </q-avatar>
            </q-btn>

            Datos personales
          </h5>
        </div>

        <div class="col-md-12 q-pa-md">
          <label style='font-weight: bold;'>Curp</label>
          <q-input
            outlined
            clearable
            style="width: 100%"
            dense
            placeholder="Curp"
            v-model="form.curp"
            v-uppercase
            v-max="18"
            v-no-spaces
            @keyup="onCurpTyping"
            :rules="[isValidCurpNotRequired]"
			/>
        </div>

        <div class="col-md-6 q-pa-md">
          <label style='font-weight: bold;'>Nombre(s)</label>
          <q-input
            :disable="inputs_disabled_curp"
            outlined
            clearable
            style="width: 100%"
            dense
            placeholder="Nombre(s)"
            v-model="form.nombres"
            v-uppercase
            v-max="30"
            :rules="[isRequired]"
			/>
        </div>
        <div class="col-md-6 q-pa-md">
          <label style='font-weight: bold;'>Primer apellido</label>
          <q-input
            :disable="inputs_disabled_curp"
            outlined
            clearable
            style="width: 100%"
            dense
            placeholder="Primer apellido"
            v-model="form.primer_apellido"
            :rules="[isRequired]"
            v-uppercase
            v-max="30"
			/>
        </div>
        <div class="col-md-6 q-pa-md">
          <label style='font-weight: bold;'>Segundo apellido</label>
          <q-input
            :disable="inputs_disabled_curp"
            outlined
            clearable
            style="width: 100%"
            dense
            placeholder="Segundo apellido"
            v-model="form.segundo_apellido"
            v-uppercase
            v-max="30"
			/>
        </div>
        <div class="col-md-6 q-pa-md">
          <label style='font-weight: bold;'>Fecha de nacimiento</label>
          <q-input
              :disable="inputs_disabled_curp"
              outlined
              dense
              label="Fecha de nacimiento"
              v-model="form.fecha_nacimiento"
              mask="##-##-####">
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                  <q-date v-model="state_fecha_nacimiento" mask="DD-MM-YYYY"  :locale="myLocale" minimal >
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Cerrar" color="primary" flat />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </div>
        <div class="col-md-6 q-pa-md">
          <label style='font-weight: bold;'>Entidad federativa de nacimiento</label>
          <q-input
            :disable="inputs_disabled_curp"
            outlined
            clearable
            style="width: 100%"
            dense
            placeholder="Entidad federativa de nacimiento"
            v-model="form.entidad_federativa_nacimiento"
            v-uppercase
            v-max="100"
            />
        </div>

        <div class="col-md-12 q-pa-md">
          <h5>
            <q-btn
              round
              color="orange"
              text-color="grey-9">
              <q-avatar size="24px" >
                <img src="~src/assets/icons/icon-fam.png">
              </q-avatar>
            </q-btn>
            Datos personales de padre y madre (Si aplica)
          </h5>
        </div>

        <div class="col-md-4 q-pa-md">
          <label style='font-weight: bold;'>Nombre(s) del padre</label>
          <q-input
            outlined
            clearable
            style="width: 100%"
            dense
            placeholder="Nombre(s) del padre"
            v-model="form.padre_nombres"
            v-uppercase
            v-max="30"
            />
        </div>
        <div class="col-md-4 q-pa-md">
          <label style='font-weight: bold;'>Primer apellido</label>
          <q-input
            outlined
            clearable
            style="width: 100%"
            dense
            placeholder="Primer apellido"
            v-model="form.padre_primer_apellido"
            v-uppercase
            v-max="30"
            />
        </div>
        <div class="col-md-4 q-pa-md">
          <label style='font-weight: bold;'>Segundo apellido</label>
          <q-input
            outlined
            clearable
            style="width: 100%"
            dense
            placeholder="Segundo apellido"
            v-model="form.padre_segundo_apellido"
            v-uppercase
            v-max="30"
            />
        </div>
        <div class="col-md-4 q-pa-md">
          <label style='font-weight: bold;'>Nombre(s) del madre</label>
          <q-input
            outlined
            clearable
            style="width: 100%"
            dense
            placeholder="Nombre(s) del madre"
            v-model="form.madre_nombres"
            v-uppercase
            v-max="30"
            />
        </div>
        <div class="col-md-4 q-pa-md">
          <label style='font-weight: bold;'>Primer apellido</label>
          <q-input
            outlined
            clearable
            style="width: 100%"
            dense
            placeholder="Primer apellido"
            v-model="form.madre_primer_apellido"
            v-uppercase
            v-max="30"
            />
        </div>
        <div class="col-md-4 q-pa-md">
          <label style='font-weight: bold;'>Segundo apellido</label>
          <q-input
            outlined
            clearable
            style="width: 100%"
            dense
            placeholder="Segundo apellido"
            v-model="form.madre_segundo_apellido"
            v-uppercase
            v-max="30"
            />
        </div>

        <div class="col-md-12 q-pa-md">
          <h5>
            <q-btn
              round
              color="orange"
              text-color="grey-9">
              <q-avatar size="24px">
                <img src="~src/assets/icons/icon-lista.png">
              </q-avatar>
            </q-btn>
            Motivación de acto jurídico
          </h5>
        </div>


        <div :class="`col-md-6 q-pa-md`"  v-if="form.id_tipo_solicitud != 3">
          <label for='id_impediment' style='font-weight: bold;'>Causal</label>
          <q-select
            @update:model-value="onChangeCausal"
            @new-value="newValue"
            dense
            use-chips
            outlined
            use-input
            emit-value
            map-options
            v-model='form.id_causal_impedimento'
            :options='options.cat_causal_impedimento'
            option-value='id_causal_impedimento'
            option-label='causal_impedimento'
            label='Causal'
            :rules="[isRequired]"
            clearable/>
        </div>
        <div :class="`col-md-6 q-pa-md`" v-if="form.id_tipo_solicitud != 3">
          <label for='id_impediment' style='font-weight: bold;'>Subcausal *</label>
          <q-select
			:disable="form.id_tipo_solicitud == 2"
            @new-value="newValue"
            dense
            use-chips
            outlined
            use-input
            emit-value
            map-options
            v-model='form.id_subcausal_impedimento'
            :options='options.cat_subcausal_impedimento'
            option-value='id_subcausal_impedimento'
            option-label='subcausal_impedimento'
            label='Causal'
            :rules="[isRequired]"
            clearable/>
        </div>

        <div class="col-md-12 q-pa-md" v-if="form.id_tipo_solicitud != 4">
          <label for='id_impediment' style='font-weight: bold;'>Motivación de acto jurídico</label>
		  <q-editor
            ref="myEditor"
			v-uppercase
			clearable
      v-max1000="1000"
            v-model="form.motivacion_acto_juridico"
            label="Motivación de acto jurídico"
            :dense="true"
            :error="plantillaError"
            :error-message="'Este campo es obligatorio'"
            :definitions="{}"
            :toolbar="[
            ['left', 'center', 'right', 'justify'],
            ['bold', 'italic', 'strike', 'underline'],
            ['token', 'hr', 'link'],
            ['unordered', 'ordered'],
            ['quote', 'fullscreen']
            ]"
           />
        </div>

        <div class="col-md-12 q-pa-md" v-if="form.id_tipo_solicitud == 4">
          <h5>
            <q-btn
              round
              color="orange"
              text-color="grey-9">
              <q-avatar size="24px">
                <img src="~src/assets/icons/icon-lista.png">
              </q-avatar>
            </q-btn>
            Identidad a la que se solicita crear un impedimento
          </h5>
        </div>

        <div class="col-md-12 q-pa-md" v-if="form.id_tipo_solicitud == 4">
          <label style='font-weight: bold;'>Curp</label>
          <q-input
            outlined
            clearable
            style="width: 100%"
            dense
            placeholder="Curp"
            v-model="form.curp_identidad"
            v-max="18"
            v-uppercase
            v-no-spaces
            :rules="[isValidCurpNotRequired]"
			/>
        </div>

        <div class="col-md-4 q-pa-md" v-if="form.id_tipo_solicitud == 4">
          <label style='font-weight: bold;'>Nombre(s) *</label>
          <q-input
            outlined
            clearable
            style="width: 100%"
            dense
            placeholder="Nombre(s)"
            v-model="form.nombres_identidad"
            v-uppercase
            v-max="30"
            :rules="[isRequired]"
			/>
        </div>

        <div class="col-md-4 q-pa-md" v-if="form.id_tipo_solicitud == 4">
          <label style='font-weight: bold;'>Primer apellido *</label>
          <q-input
            outlined
            clearable
            style="width: 100%"
            dense
            placeholder="Primer apellido"
            v-model="form.primer_apellido_identidad"
            v-uppercase
            v-max="30"
            :rules="[isRequired]"
			/>
        </div>

        <div class="col-md-4 q-pa-md" v-if="form.id_tipo_solicitud == 4">
          <label style='font-weight: bold;'>Segundo apellido</label>
          <q-input
            outlined
            clearable
            style="width: 100%"
            dense
            placeholder="Segundo apellido"
            v-model="form.segundo_apellido_identidad"
            v-uppercase
            v-max="30"
			/>
        </div>

        <div class="col-md-12 q-pa-md">
          <h5>
            <q-btn
              round
              color="orange"
              text-color="grey-9">
              <q-avatar size="24px">
                <img src="~src/assets/icons/icon-plus.png">
              </q-avatar>
            </q-btn>
            Anexos
          </h5>
        </div>

        <div class="col-md-12 q-pa-sm" v-for="(item,idx) in options.cat_anexos" :key="idx">
          <div class="row q-col-gutter-xs">
            <div class="col-md-12 q-pb-sm">
              <q-checkbox
                :label="item.nombre"
                name="selection_anexo"
                :true-value="true"
                :false-value="false"
                :model-value="isSelected(item)"
                @update:model-value="(checked) => toggleItem(item, checked)"
              />
            </div>

            <div class="col-md-12 q-pb-sm">
              <table
                class="table-bordered"
                style="width: 100%; border-collapse: collapse;"
                v-if="form.selection_anexo.some(anexo => anexo.id_cat_anexos === item.id_cat_anexos)"
              >
                <thead>
                  <tr>
                    <th style="width: 65%; text-align: left; padding: 3px;">Archivo</th>
                    <th style="width: 35%; text-align: left; padding: 3px;">Acciones</th> <!-- Pequeño ancho -->
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <a
                        :href="getDataFileAnexos(item,'url_documento')"
                        target="_blank"
                        v-if="getDataFileAnexos(item,'url_documento') != null"
                      >
                        {{ getDataFileAnexos(item,'identificador_documento') }}
                      </a>
                    </td>
                    <td>
						<UploadFileChuncks
							class="q-mt-sm"
							@success-file="fileData"
							:max_allowed_size_mb="( item.id_cat_anexos == 12 ? 3 : 100)"
							:size_chunks_mb="2"
							:type_file_front="( item.id_cat_anexos == 12 ? '.png, .jpg, .jpeg, .PNG, .JPG, .JPEG' : '.pdf')"
							:type_file_back_system="item.id_cat_anexos"
							save_storage_folder="impedimentos/filesTemp"
							save_storage_cunks_folder="impedimentos/filesChunks"
							url="upload/file-chunks"
							:id="idx"
							:id_cat_anexos="item.id_cat_anexos"
							/>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div
              class="col-md-12 q-pb-sm"
              v-if="(form.selection_anexo.some(anexo => anexo.id_cat_anexos === 3) && item.id_cat_anexos == 3 )">
              <label style='font-weight: bold;'>Número de pasaporte cancelado *</label>
              <q-input
                :disable="!(form.selection_anexo.some(anexo => anexo.id_cat_anexos === 3))"
                outlined
                clearable
                style="width: 100%"
                v-max="100"
                dense
                placeholder="Número de pasaporte cancelado"
                v-model="form.numero_pasaporte_cancelado"
                :rules="[isRequired]"
                @update:model-value="val => {
                  form.numero_pasaporte_cancelado = val;
                  const anexo = form.selection_anexo.find(a => a.id_cat_anexos === 3);
                  if (anexo) {
                    anexo.observaciones = val;
                    anexo.aux = true;
                  }
                }"
                >
              </q-input>
            </div>

            <div
              class="col-md-12 q-pb-sm"
              v-if="(form.selection_anexo.some(anexo => anexo.id_cat_anexos === 11) && item.id_cat_anexos == 11 )">
              <label style='font-weight: bold;'>Número de pasaporte *</label>
              <q-input
                :disable="!(form.selection_anexo.some(anexo => anexo.id_cat_anexos === 11))"
                outlined
                clearable
                style="width: 100%"
                v-max="100"
                dense
                placeholder="Número de pasaporte"
                v-model="form.numero_pasaporte"
                :rules="[isRequired]"
                @update:model-value="val => {
                  form.numero_pasaporte = val;
                  const anexo = form.selection_anexo.find(a => a.id_cat_anexos === 11);
                  if (anexo) {
                    anexo.observaciones = val;
                    anexo.aux = true;
                  }
                }"
                >
              </q-input>
            </div>

            <div class="col-md-12 q-pb-sm" v-if="(form.selection_anexo.some(anexo => anexo.id_cat_anexos === 4) && item.id_cat_anexos == 4 )">
              <label style='font-weight: bold;'>Especificar *</label>
              <q-input
                type="textarea"
                outlined
                clearable
                style="width: 100%"
                dense
                v-max="500"
                place
                holder="Especificar"
                v-model="form.otro_documento_soporte"
                :rules="[isRequired]"
                @update:model-value="val => {
                  form.otro_documento_soporte = val;
                  const anexo = form.selection_anexo.find(a => a.id_cat_anexos === 4);
                  if (anexo) {
                    anexo.observaciones = val;
                    anexo.aux = true;
                  }
                }">
              </q-input>
            </div>

          </div>
        </div>

        <div class="col-12 q-pt-xs">
          <div class="row justify-end" >
            <div class="col-10 q-pt-xs">
              <q-btn-group class="full-width">
                <q-btn
                  outline
                  color="red"
                  class="full-width"
                  @click="$router.push({name:'InboxAuthorizationRejection'})"
                  label="Cancelar">
                </q-btn>
                <q-btn
                  outline
                  color="red"
                  class="full-width"
                  @click="dialog = true, action_save_form = 2, observaciones_rechazos = null"
                  label="Autorizar rechazo">
                </q-btn>
                <q-btn
                  outline
                  color="red"
                  class="full-width"
                  @click="dialog = true, action_save_form = 3, observaciones_rechazos = null"
                  label="Cancelar rechazo">
                </q-btn>
              </q-btn-group>

            </div>
          </div>
        </div>

      </div>
    </q-form>
  </div>

</template>
<script setup>
import HeaderSection from 'components/HeaderSection.vue';
import UploadFileChuncks from 'src/components/UploadFileChuncks.vue';
import {ref,watch} from "vue";
import DischargeImpedimentsServices from 'src/services/discharge_of_impediments';
import {useQuasar} from "quasar";
import {useRouter} from 'vue-router';
import {useAuthUserStore} from "stores/AuthUser";
import moment from 'moment';
import useImpedimentForm from 'src/composables/useImpedimentForm'
import imageRoute from 'src/assets/icons/Home/bandeja_autorizacion_solicitudes.png';

const iconModule = ref(imageRoute);
const router = useRouter();
const $q = useQuasar();
const store = useAuthUserStore()

const dialog = ref(false);
const rejectForm = ref(null);
const {
  state_date,
  state_fecha_nacimiento,
  form,
  options,
  myLocale,
  id_estatus_solicitud,
  observaciones,
  inputs_disabled_curp,
  myForm,
  optionOffices,
  plantillaError,
  getDataFileAnexos,
  get_cats,
  onCurpTyping,
  newValue,
  onChangeCausal,
  fileData,
  isSelected,
  toggleItem,
  filterOffices,
  onOficinaSelected,
  validateFiles
} = useImpedimentForm()


const title = ref(null);
const message = ref(null);
const dialogConfirm = ref(false);
const label_btn = ref(false);
const observaciones_rechazos = ref(null);

const actionForm = () => {
    let select_funtion = null;
    switch (action_save_form.value) {
      case 2:
        select_funtion = RejectAuthorize();
      break;
      case 3:
        select_funtion = RejectCancel();
      break;
    }

    return select_funtion;
};

const RejectAuthorize = () => {
  rejectForm.value.validate().then(valid => {
    if (valid) {
      $q.loading.show();
      DischargeImpedimentsServices.reject_authorize({
      //DischargeImpedimentsServices.authorize_rejection_status({
        observaciones: observaciones_rechazos.value,
        hash_id: router.currentRoute.value.params.hash_id,
        moduleId: 20,
      }).then(response => {
        $q.loading.hide();
        if (response.data.success) {
        $q.notify({
          color: 'green-4',
          textColor: 'white',
          icon: 'cloud_done',
          message: 'Éxito, la solicitud ha sido rechazada correctamente.'
        });
        router.push({name:'InboxAuthorizationRejection'});
        }
      }).catch(e => {
        $q.loading.hide();
        console.error("error: ",e);
      })
    }
  });
};

const RejectCancel = () => {
  rejectForm.value.validate().then(valid => {
    if (valid) {
      $q.loading.show();
      DischargeImpedimentsServices.reject_cancel({
        observaciones: observaciones_rechazos.value,
        hash_id: router.currentRoute.value.params.hash_id,
        moduleId: 20,
      }).then(response => {
        $q.loading.hide();
        if (response.data.success) {
        $q.notify({
          color: 'green-4',
          textColor: 'white',
          icon: 'cloud_done',
          message: 'Éxito, el rechazo de la solicitud ha sido cancelado , correctamente'
        });
        router.push({name:'InboxAuthorizationRejection'});
        }
      }).catch(e => {
        $q.loading.hide();
        console.error("error: ",e);
      })
    }
  });
};

const action_save_form = ref(null);

const validateFields = async () => {
  await myForm.value.validate().then(success => {
    if( validateFiles(success) ){
      return;
    }

    dialogConfirm.value = true;
    switch (action_save_form.value) {
      case 2:
        title.value = 'Autorizar rechazo solicitud';
        message.value = '¿Estás completamente seguro de autorizar rechazo de esta solicitud?';
        label_btn.value = 'Autorizar rechazo';
      break;
      case 3:
        title.value = 'Cancelar rechazo solicitud';
        message.value = '¿Estás completamente seguro de cancelar el rechazo de esta solicitud?';
        label_btn.value = 'Cancelar rechazo';
      break;
    }
  });
};

watch(state_date, async (newVal) => {
  if( newVal ){
    form.value.fecha_registro = newVal;
  }else{
    form.value.fecha_registro = moment().format('DD-MM-YYYY');
  }
})

watch(state_fecha_nacimiento, async (newVal) => {
  if( newVal ){
    form.value.fecha_nacimiento = newVal;
  }else{
    form.value.fecha_nacimiento = null;
  }
})
watch(
  () => form.value.selection_anexo, (newVal) => {
    if( newVal.includes(3) == false ){
      form.value.numero = null;
    }
  }
)

</script>


<style scoped>

thead tr:first-child th {
  background-color: #6F7271;
  color: white;
}

.cell {
  box-sizing: border-box;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: normal;
  word-break: break-all;
  line-height: 23px;
  padding-right: 10px;
}

.break-text {
  word-break: break-word;
  overflow-wrap: break-word;
  white-space: normal;
}

.title{
  font-weight: bold;
  background: #10312B;
  color: white;
  padding: 5px;
  font-size: 20px;
}

</style>
