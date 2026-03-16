<template>
	<header-section title="Consulta de impedimentos" url-redirect="ConsultaImpedimentosIndex" :icon-image="iconModule" />
	<br>

  <q-dialog v-model="dialog" persistent>
    <q-card style="min-width: 1200px; max-width: 800px;">
      <q-card-section>
        <div class="text-h6">Motivo del Rechazo</div>
      </q-card-section>

      <q-form @submit.prevent="handleReject" ref="rejectForm">
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
            v-model="observaciones"
			v-uppercase>
          </q-input>
        </q-card-section>
      <q-card-actions align="right">
        <q-btn flat label="Cerrar" color="secondary" @click="dialog = false" />
        <q-btn label="Rechazar" type="submit" color="negative" />
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
	  ref="myForm"
	  @submit.prevent="validateFields"
		class="q-gutter-md"
	  >
		<div class="row q-col-gutter-xs">
		  <div class="col-md-12" v-if="id_estatus_solicitud == 30">
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

		  <div :class="`col-md-6 q-pa-md`">
			<label for='estatus_impedimento' style='font-weight: bold;'>Estatus *</label>
			<q-select
			v-if="authStore.hasPermission('impediment_query_reactive')"
				v-model="form.estatus_impedimento"
				:options="['Activo','Inactivo']"
				emit-value
				map-options
				outlined
				dense
				label="Estatus"
				:rules="[isRequired]"
				/>
			</div>

		  <div class="col-md-6 q-pa-md">
			<label for='id_impediment' style='font-weight: bold;'>Número de impedimento *</label>
			  <q-input
			  :disable="true"
			  outlined
			  clearable
			  style="width: 100%"
			  dense
			  v-max="100"
			  placeholder="Número de impedimento"
			  v-model="form.id_impedimento"
			  v-uppercase
              v-no-spaces
			  />
		  </div>

		  <div :class="`col-md-6 q-pa-md`">
			<label for='id_impediment' style='font-weight: bold;'>Oficina *</label>
			<q-select
				@new-value="newValue"
				@update:model-value="onOficinaSelected"
				dense
				use-chips
				outlined
				use-input
				emit-value
				map-options
				v-model="form.id_oficina"
				:options="optionOffices"
				@filter="filterOffices"
				option-value="id_oficina"
				option-label="cad_oficina"
				@input-debounce="100"
				label="Oficina"
				:rules="[isRequired]"
				:disable="modificarImpedimentoRef"
				clearable/>
			</div>

		  <div class="col-md-12 q-pa-md">
			<br>
			<q-checkbox
			  v-model="form.dependencia"
			  label="Dependencia"
			  :disable="modificarImpedimentoRef"
			/>
		  </div>

		  <div class="col-md-12 q-pa-md" v-if="form.dependencia">
          <label style='font-weight: bold;'>Dependencia *</label>
          <q-input
            outlined
            clearable
            style="width: 100%"
            dense
			v-max="100"
		    placeholder="Dependencia"
            v-model="form.nombre_dependencia"
		    v-alfanumerico
            v-uppercase
            :rules="[isRequired]"
			:disable="modificarImpedimentoRef"
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
			v-max="18"
            placeholder="Curp"
            v-model="form.curp"
            v-uppercase
            v-no-spaces
            @keyup="onCurpTyping"
            :rules="[isValidCurpNotRequired]"
			:disable="modificarImpedimentoRef"
			/>
        </div>

		  <div class="col-md-6 q-pa-md">
			<label style='font-weight: bold;'>Nombre(s) *</label>
			<q-input
			  outlined
			  v-max="30"
			  clearable
			  style="width: 100%"
			  dense
			  placeholder="Nombre(s)"
			  v-model="form.nombres"
			  :disable="modificarImpedimentoRef"
			  v-uppercase
			  />
		  </div>
		  <div class="col-md-6 q-pa-md">
			<label style='font-weight: bold;'>Primer apellido *</label>
			<q-input
			  outlined
			  clearable
			  style="width: 100%"
			  dense
			  v-max="30"
			  placeholder="Primer apellido"
			  v-model="form.primer_apellido"
			  :disable="modificarImpedimentoRef"
			  v-uppercase
			  />
		  </div>
		  <div class="col-md-6 q-pa-md">
			<label style='font-weight: bold;'>Segundo apellido</label>
			<q-input
			  outlined
			  clearable
			  style="width: 100%"
			  dense
			  v-max="30"
			  placeholder="Segundo apellido"
			  v-model="form.segundo_apellido"
			  :disable="modificarImpedimentoRef"
			  v-uppercase
			  />
		  </div>

		  <div class="col-md-6 q-pa-md">
			<label style='font-weight: bold;'>Fecha de nacimiento</label>
			<q-input
				outlined
				dense
				label="Fecha de nacimiento"
				v-model="form.fecha_nacimiento"
				:disable="modificarImpedimentoRef"
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
			  outlined
			  clearable
			  style="width: 100%"
			  dense
			  v-max="100"
			  placeholder="Entidad federativa de nacimiento"
			  v-model="form.entidad_federativa_nacimiento"
			  v-uppercase
			  :disable="modificarImpedimentoRef"
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
			  v-max="30"
			  placeholder="Nombre(s) del padre"
			  v-model="form.padre_nombres"
			  v-uppercase
			  :disable="modificarImpedimentoRef"
			  />
		  </div>
		  <div class="col-md-4 q-pa-md">
			<label style='font-weight: bold;'>Primer apellido</label>
			<q-input
			  outlined
			  clearable
			  style="width: 100%"
			  dense
			  v-max="30"
			  placeholder="Primer apellido"
			  v-model="form.padre_primer_apellido"
			  v-uppercase
			  :disable="modificarImpedimentoRef"
			  />
		  </div>
		  <div class="col-md-4 q-pa-md">
			<label style='font-weight: bold;'>Segundo apellido</label>
			<q-input
			  outlined
			  clearable
			  style="width: 100%"
			  dense
			  v-max="30"
			  placeholder="Segundo apellido"
			  v-model="form.padre_segundo_apellido"
			  v-uppercase
			  :disable="modificarImpedimentoRef"
			  />
		  </div>
		  <div class="col-md-4 q-pa-md">
			<label style='font-weight: bold;'>Nombre(s) del madre</label>
			<q-input
			  outlined
			  clearable
			  style="width: 100%"
			  dense
			  v-max="30"
			  placeholder="Nombre(s) del madre"
			  v-model="form.madre_nombres"
			  v-uppercase
			  :disable="modificarImpedimentoRef"
			  />
		  </div>
		  <div class="col-md-4 q-pa-md">
			<label style='font-weight: bold;'>Primer apellido</label>
			<q-input
			  outlined
			  clearable
			  style="width: 100%"
			  dense
			  v-max="30"
			  placeholder="Primer apellido"
			  v-model="form.madre_primer_apellido"
			  v-uppercase
			  :disable="modificarImpedimentoRef"
			  />
		  </div>
		  <div class="col-md-4 q-pa-md">
			<label style='font-weight: bold;'>Segundo apellido</label>
			<q-input
			  outlined
			  clearable
			  style="width: 100%"
			  dense
			  v-max="30"
			  placeholder="Segundo apellido"
			  v-model="form.madre_segundo_apellido"
			  v-uppercase
			  :disable="modificarImpedimentoRef"
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
		  <div class="col-md-6 q-pa-md" >
          <label for='id_impediment' style='font-weight: bold;'>Causal *</label>
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
			:disable="modificarImpedimentoRef"
            clearable/>
        </div>
        <div class="col-md-6 q-pa-md" >
			<label for='id_impediment' style='font-weight: bold;'>Subcausal *</label>
				<q-select
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
				:disable="disable_subcausal"
				clearable/>
        </div>
        <div class="col-md-12 q-pa-md" v-if="form.id_causal_impedimento == 19">
          	<label style='font-weight: bold;'>Otra *</label>
			<q-input
				outlined
				clearable
				dense
				placeholder="Otra"
				v-model="form.causal_otro_descripcion"
				:disable="modificarImpedimentoRef"
				v-uppercase
				:rules="[isRequired]"
				v-max="100" />
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

			<div class="col-md-12 q-pa-sm" v-for="(item,idx) in documents" :key="idx">
				<div class="row q-col-gutter-xs">
				<div class="col-md-12 q-pb-sm">
					<q-checkbox
					:disable="true"
					:label="item.cat_anexo.nombre"
					name="selection_anexo"
					:true-value="true"
					:false-value="false"
					:model-value="isSelected()"
					@update:model-value="(checked) => toggleItem(item, checked)"
					/>
				</div>

				<div class="col-md-12 q-pb-sm">
					<table
					class="table-bordered"
					style="width: 100%; border-collapse: collapse;"
					>
					<thead>
						<tr>
							<th style="width: 65%; text-align: left; padding: 3px;">Archivo</th>
							<th style="width: 35%; text-align: left; padding: 3px;">Acciones</th>
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
					v-if="item.id_cat_anexos == 3">
					<label style='font-weight: bold;'>Número de pasaporte cancelado *</label>
					<q-input
					outlined
					clearable
					style="width: 100%"
					dense
					v-max="100"
					placeholder="Número de pasaporte cancelado"
					v-model="form.numero_pasaporte_cancelado"
					:rules="[isRequired]"
					@update:model-value="val => {
						form.numero_pasaporte_cancelado = val;
						const anexo = documents.find(a => a.id_cat_anexos === 3);
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
					v-if="item.id_cat_anexos == 11">
					<label style='font-weight: bold;'>Número de pasaporte *</label>
					<q-input
					outlined
					clearable
					style="width: 100%"
					dense
					v-max="100"
					placeholder="Número de pasaporte"
					v-model="form.numero_pasaporte"
					:rules="[isRequired]"
					@update:model-value="val => {
						form.numero_pasaporte = val;
						const anexo = documents.find(a => a.id_cat_anexos === 11);
						if (anexo) {
							anexo.observaciones = val;
							anexo.aux = true;
						}
					}"

					>
					</q-input>
				</div>
				<div class="col-md-12 q-pb-sm" v-if="item.id_cat_anexos == 4">
					<label style='font-weight: bold;'>Especificar *</label>
					<q-input
					type="textarea"
					outlined
					v-max="500"
					clearable
					style="width: 100%"
					dense
					placeholder="Especificar"
					v-model="form.otro_documento_soporte"
					:rules="[isRequired]"
					@update:model-value="val => {
						form.otro_documento_soporte = val;
						const anexo = documents.find(a => a.id_cat_anexos === 4);
						if (anexo) {
							anexo.observaciones = val;
							anexo.aux = true;
						}
					}"
					>
					</q-input>
				</div>

				</div>
			</div>


		<div class="col-12 q-pt-xs">
			<div class="row justify-end" >
			<div class="col-5 q-pt-xs">
				<q-btn-group class="full-width">
					<q-btn
						outline
						color="red"
						class="full-width"
						@click="$router.push({name:'ConsultaImpedimentosIndex'})"
						label="Cancelar">
					</q-btn>
					<q-btn
						outline
						color="green"
						class="full-width"
						@click="validateFields()"
						label="Actualizar">
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
import {ref,onMounted, watch, computed} from "vue";
import UploadFileChuncks from 'src/components/UploadFileChuncks.vue';
import DischargeImpedimentsServices from 'src/services/discharge_of_impediments';
import {useQuasar} from "quasar";
import {useRouter} from 'vue-router';
import useNotify from "src/composables/useNotify";
import useOnlyImpedimentForm from 'src/composables/useOnlyImpedimentForm'

import imageRoute from 'src/assets/icons/Home/bandeja_solicitudes.png';
import { useAuthUserStore } from 'src/stores/AuthUser';
const iconModule = ref(imageRoute);
const authStore = useAuthUserStore();

const router = useRouter();
const route = router.currentRoute;

const $q = useQuasar();
const {showError} = useNotify()

const {
	state_fecha_nacimiento,
	form,
	myLocale,
	id_estatus_solicitud,
	observaciones,
	myForm,
	documents,
	optionOffices,
	options,
	plantillaError,
	fileData,
	onChangeCausal,
	onCurpTyping,
	onOficinaSelected,
	newValue,
	filterOffices,
	getDataFileAnexos,
	get_cats,
	getImpediment,
	isSelected,
	toggleItem
} = useOnlyImpedimentForm()

	const title = ref(null);
	const message = ref(null);
	const dialog = ref(false);
	const dialogConfirm = ref(false);
	const label_btn = ref(false);
	const rejectForm = ref(null);
	const modificarImpedimentoRef = ref(false)
	const actionForm = () => {
		$q.loading.show();
		DischargeImpedimentsServices.impediment_update({
			hash_id: router.currentRoute.value.params.hash_id,
			documents: documents.value.filter(doc => doc.aux === true),
			...form.value
		}).then(response => {
			//$q.loading.hide();
			if (response.data.success) {
				$q.notify({
					color: 'green-4',
					textColor: 'white',
					icon: 'cloud_done',
					message: 'Éxito, el impedimento ha sido actualizado correctamente.'
				});
				dialogConfirm.value = false;
				getImpediment();
			}
		}).catch(e => {
			$q.loading.hide();
			console.error("error: ",e);
		})
	};


const handleReject = () => {
	rejectForm.value.validate().then(valid => {
		if (valid) {
		$q.loading.show();
		DischargeImpedimentsServices.change_status_decline({
			observaciones: observaciones.value,
			hash_id: router.currentRoute.value.params.hash_id,
			moduleId: 13,
		}).then(response => {
			$q.loading.hide();
			if (response.data.success) {
			$q.notify({
			color: 'green-4',
			textColor: 'white',
			icon: 'cloud_done',
			message: 'Éxito, la solicitud ha sido rechazada correctamente.'
			});
			router.push({name:'InboxAuthorizationHighImpediments'});
			}
		}).catch(e => {
			$q.loading.hide();
			console.error("error: ",e);
		})
		}
	});
};

	const validateFields = async () => {
		await myForm.value.validate().then(success => {
			if (!success) {
				showError('Error', 'Verifique los campos del formulario.');
				return;
			}

			dialogConfirm.value = true;
			title.value = 'Actualizar';
			message.value = `¿Estás completamente seguro de actualizar el impedimento?`;
			label_btn.value = 'Actualizar';
		});
	};

	const disable_subcausal = computed(() => {
		let aux = modificarImpedimentoRef.value;
		let array_subcausal = [10,11,12,13,14,15,16,17,18,19];

		if (array_subcausal.includes(form.value.id_causal_impedimento)) {
			aux = true;
		}
		return aux;
	});

	onMounted(() => {
		const q = route.value.query.modificarImpedimento
		modificarImpedimentoRef.value = q === '1' || q === 'true' || q === 1 || q === true
		get_cats()
		setTimeout(() => getImpediment(), 2000)
	})

	// Por si cambian el query sin recargar el componente
	watch(() => route.value.query.modificarImpedimento, (q) => {
		modificarImpedimentoRef.value = q === '1' || q === 'true' || q === 1 || q === true
	})
</script>


  <style scoped>

  .table-bordered, .table-bordered th, .table-bordered td {
	border: 1px solid #ccc;
	border-collapse: collapse;
  }

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

  .title{
	font-weight: bold;
	background: #10312B;
	color: white;
	padding: 5px;
	font-size: 20px;
  }

  </style>
