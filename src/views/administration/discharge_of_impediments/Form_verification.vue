<template>
  <header-section title="Verificación" url-redirect="InboxVerification" :icon-image="iconModule">
  </header-section>
  <br>
	<q-dialog v-if="(form.id_estatus_solicitud == 250 ? [4, 5] : [3, 4, 5]).includes(store.user.perfil.id_perfil)" v-model="dialog_cuerpo_correo" persistent>
		<q-card style="min-width: 1200px; max-width: 800px;">
			<q-card-section>
			<div class="text-h6">cuerpo correo</div>
			</q-card-section>

			<q-form @submit.prevent="handleDictaminar" ref="rejectForm">
				<q-card-section>
					<div class="flex justify-between q-pa-md">
            			<label for='id_impediment' style='font-weight: bold;'>*</label>
						<q-btn
							:disable="[3].includes(store.user.perfil.id_perfil)"
							icon="refresh"
							color="blue"
							text-color="white"
							round
							@click="confirmClear">
							<q-tooltip anchor="top middle" self="center middle">
								Limpiar contenido
							</q-tooltip>
        				</q-btn>
          			</div>
					<div :class="`col-md-6 q-pa-md`">
						<q-select
							v-if="form.id_estatus_solicitud == 250"
							ref="selEstatusVerif"
							required
							dense
							use-chips
							outlined
							use-input
							emit-value
							map-options
							v-model='form.id_estatus_verificacion'
							:options='estatusVerificacionFiltrados'
							option-value='id_estatus_verificacion'
							option-label='estatus'
							label='Estatus de verificacion'
							:rules="[
							val => (val !== null && val !== undefined && val !== '') || 'Selecciona un estatus'
							]"
							clearable/>
					</div>
					<q-editor
						:disable="[3].includes(store.user.perfil.id_perfil)"
						ref="myEditor"
						v-model="cuerpo_correo"
						label="Plantilla"
						:dense="true"
						:error="plantillaError"
						:error-message="'Este campo es obligatorio'"
						:definitions="{}"
						v-max1000="1500"
						:toolbar="[
						['left', 'center', 'right', 'justify'],
						['bold', 'italic', 'strike', 'underline'],
						['token', 'hr', 'link'],
						['unordered', 'ordered'],
						['quote', 'fullscreen']
						]"
					/>
          		</q-card-section>

				<q-card-actions align="right">
					<q-btn-group>
						<q-btn flat label="Cerrar" color="secondary" @click="dialog_cuerpo_correo = false" />
						<q-btn v-if="form.id_estatus_solicitud == 250" label="Actualizar" @click="updateCuerpoCorreo" outline color="primary"
						:disable="(form.id_estatus_verificacion == 1 || form.id_estatus_verificacion == null)"/>
						<q-btn v-if="form.id_estatus_solicitud != 250" label="Enviar a dictaminar" type="submit" outline color="primary" :disable="disableCuerpoCorreo" />
						<q-btn v-if="form.id_estatus_solicitud == 250" label="Enviar a verificar" @click="sendToVerify" outline color="primary"
						:disable="(form.id_estatus_verificacion == 1 || form.id_estatus_verificacion == null || cuerpo_correo == '')" />
  					</q-btn-group>
				</q-card-actions>
			</q-form>
		</q-card>
	</q-dialog>
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
					:rules="[val => !!val || 'El campo no puede estar vacío']"
					v-model="observaciones" v-uppercase
          			v-max="500"
					/>
				</q-card-section>
				<q-card-actions align="right">
				<q-btn flat label="Cerrar" color="secondary" @click="dialog = false" />
				<q-btn label="Rechazar" type="submit" color="positive" icon="save"  />
				<!-- @click="openDialogReject" -->
				</q-card-actions>
			</q-form>
		</q-card>
	</q-dialog>

	<q-dialog v-model="dialog2" persistent>
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
			<q-btn flat label="Cerrar" color="negative" @click="dialog2 = false" />
			<q-btn :label="label_btn" @click="actionForm" color="positive" icon="save" v-if="action_save_form != 10" />
			</q-card-actions>
		</q-card>
	</q-dialog>

	<q-dialog v-model="dialog_search" persistent>
		<q-card style="min-width: 1000px; max-width: 1500px;">
		<q-card-section>
			<div class="text-h6">Buscar impedimento</div>
		</q-card-section>
		<q-card-section v-if="aux == 1">
			<q-table
				:rows="registers"
				:columns="columns"
				separator="cell"
				no-data-label="No hay datos"
				dense
				rows-per-page-label="Registros por página"
				:pagination-label="(firstRowIndex, endRowIndex, totalRowsNumber) => {
					return `${firstRowIndex}-${endRowIndex} de ${totalRowsNumber}`
				}"
				flat
				bordered
				v-model:pagination="pagination"
				:rows-per-page-options="[5, 10, 20, 50, 100]"
				@request="searchImpediment"
				row-key="name"
				>
				<template v-slot:header="props">
				<q-tr :props="props">
					<q-th
					v-for="col in props.cols"
					:key="col.name"
					:props="props">
					<b>{{ col.label }}</b>
					</q-th>
				</q-tr>
				</template>
				<template v-slot:body="props">
				<q-tr :props="props" :class="[ props.row.urgencia ? 'bg-red-3 text-black' : 'bg-white']">
          <div class="q-mb-sm">
            <q-checkbox v-model="selectedItems" :val="props.row.id_impedimento" @update:model-value="onSelectChange" />
          </div>
					<q-td>
					{{ props.row?.numero_impedimento }}
					</q-td>
					<q-td>
					{{ props.row?.people?.full_name }}
					</q-td>
					<q-td>
					{{ props.row?.people?.curp }}
					</q-td>
					<q-td>
					{{ props.row?.people?.fecha_nacimiento }}
					</q-td>
					<q-td>
					{{ props.row?.people?.entidad_federativa_nacimiento }}
					</q-td>
					<q-td>
					<ul>
						<li v-for="(itm, idx) in props.row?.documents" :key="idx">
							{{ itm.cat_anexo.nombre }}
						</li>
					</ul>
					</q-td>
					<q-td>
					<div class="flex justify-center">
						<q-btn-group>
						<q-btn
							color="positive"
							size="sm"
							icon="check"
							@click="props.row.expand = !props.row.expand"
						>
							<q-tooltip anchor="top middle" self="center middle">
							Seleccionar
							</q-tooltip>
						</q-btn>
						</q-btn-group>
					</div>
					</q-td>
				</q-tr>
				<q-tr v-show="props.row.expand" :props="props">
					<q-td colspan="100%">
					<ExpandedImpedimentRow :row="props.row" :show="false" @select="selectImpediment" />
					</q-td>
				</q-tr>
				</template>
			</q-table>
		</q-card-section>
		<q-card-actions align="right">
			<q-btn-group >
			<q-btn flat label="Cerrar" outline color="red" @click="dialog_search = false" />
			<q-btn label="Enviar Dictaminación" outline color="primary" :disable="verifyTemplates"  @click="impedimentsSelected" />
			<!-- <q-btn label="Enviar Dictaminación" outline color="primary" @click="updateRequestActive" /> -->
			</q-btn-group>
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

		<div class="col-md-12" v-if="observaciones">
          <q-banner
            class="bg-red-2 text-black q-mb-md"
            rounded
          >
            <div class="text-subtitle1 text-bold">Observaciones</div>
            <div class="q-mt-sm" v-html="observaciones" />
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

        <div :class="`col-md-6 q-pa-md`">
          <label for='id_impediment' style='font-weight: bold;'>Tipo de solicitud *</label>
          <q-select
            :disable="(action == 'Nuevo' ? false : true)"
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
          <label for='id_impediment' style='font-weight: bold;'>Oficina *</label>
          <q-select
            :disable="([3, 4, 5].includes(store.user.perfil.id_perfil) ? false : true )"
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
            clearable/>
        </div>

        <div class="col-md-6 q-pa-md">
          <label for='id_impediment' style='font-weight: bold;'>Semáforo de prioridad *</label>
          <q-select
            :disable="true"
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
            :disable="true"
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
			<label style='font-weight: bold;'>Correo electrónico *</label>
			<q-input
			  outlined
			  clearable
			  style="width: 100%"
			  dense
			  placeholder="Correo electrónico"
			  v-model="form.correo_electronico"
			  v-uppercase
        	  v-max="70"
			  :rules="[isRequired,isValidEmail]"
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
            v-no-spaces
            @keyup="onCurpTyping"
            :rules="[isValidCurpNotRequired]"
            v-max="18"
			/>
        </div>

        <div class="col-md-6 q-pa-md">
          <label style='font-weight: bold;'>Nombre(s) *</label>
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
          <label style='font-weight: bold;'>Primer apellido *</label>
          <q-input
            :disable="inputs_disabled_curp"
            outlined
            clearable
            style="width: 100%"
            dense
            placeholder="Primer apellido"
            v-model="form.primer_apellido"
            v-uppercase
            v-max="30"
            :rules="[isRequired]"
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

        <div class="col-md-12 q-pa-md" v-if="form.id_tipo_solicitud != 4">
          <label for='id_impediment' style='font-weight: bold;'>Motivación de acto jurídico</label>
		  <q-editor
            ref="myEditor"
			v-uppercase
			clearable
            v-model="form.motivacion_acto_juridico"
            v-max1000="1000"
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
			  v-if="(form.selection_anexo.some(anexo => anexo.id_cat_anexos === 3) && item.id_cat_anexos == 3 )"
			  >
              <label style='font-weight: bold;'>Número de pasaporte cancelado *</label>
              <q-input
			  	v-max="100"
                outlined
                clearable
                style="width: 100%"
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

            <div class="col-md-12 q-pb-sm" v-if="(form.selection_anexo.some(anexo => anexo.id_cat_anexos === 4) && item.id_cat_anexos == 4 )">
              <label style='font-weight: bold;'>Especificar *</label>
              <q-input
                type="textarea"
                outlined
                clearable
                style="width: 100%"
                dense
                placeholder="Especificar"
                v-model="form.otro_documento_soporte"
                v-max="500"
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
            <div class="col-5 q-pt-xs">
				<q-btn-group class="full-width">
					<q-btn
						outline
						color="red"
						class="full-width"
						@click="$router.push({name:'InboxVerification'})"
						label="Cancelar">
					</q-btn>
					<q-btn
						outline
						color="red"
						class="full-width"
						@click="dialog = true, aux_send = true"
						label="Rechazar">
					</q-btn>
					<q-btn
						@click="validateFields(),action=false,action_save_form=2"
						outline
						type="submit"
						color="primary"
						class="full-width"
						label="Actualizar">
					</q-btn>
					<q-btn
          				v-if="form.id_estatus_solicitud == 250"
						@click="seeObservations(),action_save_form=8"
						type="submit"
						outline
						color="primary"
						class="full-width"
						label="Ver observaciones">
					</q-btn>
					<q-btn
						v-else
						@click="validateFields(),action_save_form=4"
						type="submit"
						outline
						color="primary"
						class="full-width"
						label="Verificar">
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
import {ref,onMounted, computed, watch} from "vue";
import DischargeImpedimentsServices from 'src/services/discharge_of_impediments';
import { useQuasar} from "quasar";
import {useRouter} from 'vue-router';
import {useAuthUserStore} from "stores/AuthUser";
import ExpandedImpedimentRow from 'components/ExpandedImpedimentRow2.vue'
import useImpedimentForm from 'src/composables/useImpedimentForm'
import imageRoute from 'src/assets/icons/Home/bandeja_validacion_altas.png';
import useNotify from "src/composables/useNotify";

const iconModule = ref(imageRoute);
const router = useRouter();
const $q = useQuasar();
const store = useAuthUserStore()
const {showError} = useNotify()

const selEstatusVerif = ref(null)
const {
	state_date,
	state_fecha_nacimiento,
	form,
	options,
	myLocale,
	observaciones,
	inputs_disabled_curp,
	myForm,
	plantillaError,
	optionOffices,
	getDataFileAnexos,
	get_cats,
	onCurpTyping,
	newValue,
	fileData,
	isSelected,
	toggleItem,
	filterOffices,
	onOficinaSelected,
	validateFiles,
	getImpediment
} = useImpedimentForm()

const row_impediment = ref({});
const title = ref(null);
const message = ref(null);
const label_btn = ref(false);
const aux_send = ref(false);
const aux = ref(2);
const dialog_search = ref(false);
const action = ref(false);
const dialog = ref(false);
const dialog2 = ref(false);
const rejectForm = ref(null);
const action_save_form = ref(null);
const aux_dependencia = ref(false);
const selectedItems = ref([]);

const dialog_cuerpo_correo = ref(false);
const cuerpo_correo = ref('');
const pagination = ref({
  page: 1,
  rowsPerPage: 10,
  rowsNumber: 0
})
const registers = ref([]);
const columns = ref([
{
    name: 'full_name',
    align: 'left',
    label: 'Seleccionar',
    field: row => row.full_name,
  },
{
    name: 'full_name',
    align: 'left',
    label: 'Número de impedimento',
    field: row => row?.people?.full_name
  },
  {
    name: 'full_name',
    align: 'left',
    label: 'Nombre',
    field: row => row?.people?.full_name
  },
  {
    name: 'curp',
    align: 'left',
    label: 'Curp',
    field: row => row?.people?.curp
  },
  {
    name: 'fecha_nacimiento',
    align: 'left',
    label: 'Fecha de nacimiento',
    field: row => row?.people?.fecha_nacimiento
  },
  {
    name: 'entidad_federativa_nacimiento',
    align: 'left',
    label: 'Entidad federativa de nacimiento',
    field: row => row?.people?.entidad_federativa_nacimiento
  },
  {
    name: 'full_name',
    align: 'left',
    label: 'Expedientes',
    field: row => row?.people?.entidad_federativa_nacimiento
  },
  {
    name: 'full_name',
    align: 'left',
    label: 'Acciones',
    field: row => row?.people?.full_name
  },
])

const selectImpediment = ( row ) => {
	row_impediment.value = row;
	dialog2.value = true;
	title.value = 'Actualizar impedimento';
	message.value = 'La solicitud remplazara los datos del impedimento seleccionado, ¿Estás completamente seguro de actualizar el impedimento?';
	label_btn.value = 'Actualizar';
	action_save_form.value = 4;
};

const handleReject = () => {
  rejectForm.value.validate().then(valid => {
    if (valid) {
		dialog2.value = true;
		title.value = 'Rechazar solicitud';
		message.value = '¿Estás completamente seguro de rechazar la solicitud?';
		label_btn.value = 'Rechazar';
		action_save_form.value = 8;
    }
  });
};
const handleDictaminar = () => {
  DischargeImpedimentsServices.send_to_dictaminate({
    hash_id: router.currentRoute.value.params.hash_id,
    cuerpo_correo: cuerpo_correo.value,
	verificacion_impedimentos: selectedItems.value,
    moduleId: 6,
  }).then(response => {
    $q.loading.hide();
    if (response.data.success) {
    $q.notify({
      color: 'green-4',
      textColor: 'white',
      icon: 'cloud_done',
      message: 'Éxito, la solicitud ha sido enviada a dictaminar correctamente.'
    });
    router.push({name:'InboxVerification'});
    }
  }).catch(e => {
    $q.loading.hide();
    console.error("error: ",e);
  })
};

const onUpdate = async () => {
	$q.loading.show();
	await DischargeImpedimentsServices.update({
	hash_id : router.currentRoute.value.params.hash_id,
  moduleId: 6,
		...form.value
	}).then(response => {
		$q.loading.hide();
		if (response.data.success) {
			$q.notify({
				color: 'green-4',
				textColor: 'white',
				icon: 'cloud_done',
				message: 'Éxito, se ha actualizado la solicitud correctamente.'
			});
			dialog2.value = false;
			getImpediment();
		}
	}).catch(e => {
	$q.loading.hide();
	console.error("error: ",e);
	})
}

function confirmClear() {
  if(cuerpo_correo.value) {
	$q.dialog({
	title: 'Confirmar',
	message: '¿Deseas limpiar el contenido?',
	ok: {
		label: 'Limpiar'
	},
	cancel: {
		label: 'Cancelar'
	},
	persistent: true
	})
	.onOk(() => {
		cuerpo_correo.value = ''
	})
	.onCancel(() => {
		//console.log('El usuario canceló')
	})
  }
}

const searchImpediment = async ( pag = null ) => {
	if( pag !== undefined && pag ){
		pagination.value.page = pag.pagination.page;
		pagination.value.rowsPerPage = pag.pagination.rowsPerPage;
		pagination.value.rowsNumber = pag.pagination.rowsNumber;
	}

	$q.loading.show();
	registers.value = [];
	DischargeImpedimentsServices.search_impediment({
	hash_id : router.currentRoute.value.params.hash_id,
		...form.value,
		...pagination.value
	}).then(response => {
		$q.loading.hide();
		if (response.data.success) {
			aux_dependencia.value = response.data.aux_dependencia;
			switch (response.data.aux) {
				case 1:
					dialog_search.value = true;
					aux.value = response.data.aux;
					dialog_search.value = true;
					registers.value = response.data.ImImpedimentos.data;
				break;
				case 2:
					showError('Error', 'No se encontraron impedimentos.');
					action_save_form.value = 5;
					dialog2.value = true;
					title.value = 'Verificar';
					message.value = `<strong>No se encontraron impedimentos</strong><br> ¿Estás completamente seguro enviar a verificar la solicitud?`;
					label_btn.value = 'Verificar';
				break;
			}
		}
	}).catch(e => {
		$q.loading.hide();
		console.error("error: ",e);
	})

};

const validateFields = async () => {
	await myForm.value.validate().then(success => {
		if( validateFiles( success ) ){
			return;
		}

		let return_event = null;
		switch (action_save_form.value) {
		case 2:
			dialog2.value = true;
			title.value = 'Actualizar solicitud';
			message.value = '¿Estás completamente seguro de actualizar la solicitud?';
			label_btn.value = 'Actualizar';
		break;
		case 4:
			return_event = searchImpediment();
		break;
		}
		return return_event;
	});
};

const aceptReject = () => {
	if( aux_send.value ){
		$q.loading.show();
        DischargeImpedimentsServices.rejection_validates({
			observaciones: observaciones.value,
			hash_id: router.currentRoute.value.params.hash_id,
			moduleId: 6,
        }).then(response => {
          $q.loading.hide();
			if (response.data.success) {
				$q.notify({
					color: 'green-4',
					textColor: 'white',
					icon: 'cloud_done',
					message: 'Éxito, la solicitud ha sido rechazada correctamente.'
				});
				router.push({name:'InboxVerification'});
			}
        }).catch(e => {
			$q.loading.hide();
			console.error("error: ",e);
        })
	}else{
		DischargeImpedimentsServices.send_to_pending({
			observaciones: observaciones.value,
			hash_id: router.currentRoute.value.params.hash_id,
			moduleId: 6,
		}).then(response => {
			$q.loading.hide();
			if (response.data.success) {
				$q.notify({
					color: 'green-4',
					textColor: 'white',
					icon: 'cloud_done',
					message: 'Éxito, la solicitud ha sido rechazada correctamente.'
				});
				router.push({name:'InboxVerification'});
			}
		}).catch(e => {
			$q.loading.hide();
			console.error("error: ",e);
		})
	}
};

const actionForm = () => {
	let retun_event = null;
	switch (action_save_form.value) {
		case 2:
			retun_event = onUpdate();
		break;
    	case 5:
      		retun_event = dialogDictaminar();
		break;
    	case 8:
      		retun_event = aceptReject();
		break;
	}
	return retun_event;
};

const ifExistsImpediment = async () => {
	await DischargeImpedimentsServices.if_exists_impediment({
		hash_id : router.currentRoute.value.params.hash_id,
	}).then(response => {
		if( response.data.success ){
			if( response.data.Results ){
				router.push({name:'InboxVerification'});
			}
		}
	}).catch(e => {
    	$q.loading.hide();
		console.error("error: ",e);
	})
};

const updateCuerpoCorreo =() => {
  $q.loading.show();
	DischargeImpedimentsServices.update_cuerpo_correo({
		hash_id : router.currentRoute.value.params.hash_id,
    cuerpo_correo: cuerpo_correo.value,
    id_estatus_verificacion: form.value.id_estatus_verificacion,
    moduleId: 6,
	}).then(response => {
		$q.loading.hide();
		if (response.data.success) {
			$q.notify({
				color: 'green-4',
				textColor: 'white',
				icon: 'cloud_done',
				message: 'Éxito, se ha actualizado la solicitud correctamente'
			});
			//form.value.cuerpo_correo = response.data.Results.cuerpo_correo;
			form.value.cuerpo_correo = response.data.Results.cuerpo_correo || '';
			form.value.id_estatus_verificacion = response.data.Results.id_estatus_verificacion;
			dialog_cuerpo_correo.value = false;
			dialog2.value = false;
		}
	}).catch(e => {
		$q.loading.hide();
		console.error("error: ",e);
	})
}
const sendToVerify = async () => {
  if (form.value.id_estatus_solicitud === 250) {
    const ok = selEstatusVerif.value?.validate?.() ?? true

    const hasValue =
      form.value.id_estatus_verificacion !== null &&
      form.value.id_estatus_verificacion !== undefined &&
      form.value.id_estatus_verificacion !== ''

    if (!ok || !hasValue) {
      selEstatusVerif.value?.focus?.()
      $q.notify({ type: 'negative', message: 'Selecciona el estatus de verificación.' })
      return
    }
  }

  $q.loading.show()
  try {
    const response = await DischargeImpedimentsServices.send_to_verify({
      hash_id: router.currentRoute.value.params.hash_id,
      cuerpo_correo: cuerpo_correo.value,
      id_estatus_verificacion: form.value.id_estatus_verificacion,
      id_estatus_solicitud: 1000,
      moduleId: 6,
    })

    if (response.data.success) {
      $q.notify({
        color: 'green-4',
        textColor: 'white',
        icon: 'cloud_done',
        message: 'Éxito, se ha actualizado la solicitud correctamente'
      })
      dialog_cuerpo_correo.value = false
      router.push({ name: 'InboxVerification' })
    }
  } catch (e) {
    console.error('error:', e)
    $q.notify({ type: 'negative', message: 'No se pudo enviar a verificar.' })
  } finally {
    $q.loading.hide()
  }
}

const escapeHtml = (s = '') =>
  String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')

function buildCorreoHTML(pares = []) {
  if (!Array.isArray(pares) || pares.length === 0) {
    return `<p><em>No se encontraron causales/subcausales.</em></p>`
  }

  let html = ``

  const sorted = [...pares].sort((a,b)=>a.id_impedimento - b.id_impedimento)

  for (const p of sorted) {
	console.log("pxxxxx: ",p);
    const causal = escapeHtml(p.causal_str || '')
    const sub = escapeHtml(p.subcausal_str || '')
    const plantilla = p.plantilla_str || ''

html += `
<div style="margin-bottom:12px">

<strong>Causal:</strong><br>
${causal}<br>

<strong>Subcausal:</strong><br>
${sub || '<em>(Sin subcausal)</em>'}<br>

<strong>Plantilla:</strong><br>

${plantilla || '<em>(Sin plantilla)</em>'}

</div>
<hr style="margin:25px 0;">
`

  }

  return String(html)
}

const impedimentsSelected = () => {
  if(!selectedItems.value.length) {
    dialog2.value = true;
    title.value = 'No se selecccionaron impedimentos';
    message.value = 'No ha seleccionado ningún impedimento. ¿Está completamente seguro que ninguno de los impedimentos mostrados corresponde a la persona registrada en la solicitud?';
    label_btn.value = 'Continuar';
    action_save_form.value = 5;
  } else {
  dialogDictaminar()
  }
}

const dialogDictaminar = async () => {
	await DischargeImpedimentsServices.getCausalSubCausalFromImpedimentsID({
	ids_impedimento : selectedItems.value,
  moduleId: 6,
	}).then(response => {
		$q.loading.hide();
		if (response.data.success) {
			const data = response.data.Results
			cuerpo_correo.value = buildCorreoHTML(data);
		}
	}).catch(e => {
	$q.loading.hide();
	console.error("error: ",e);
	})

  dialog_search.value = false
  dialog_cuerpo_correo.value = true
}

const seeObservations = async () => {
  cuerpo_correo.value = form.value.cuerpo_correo
  dialog_cuerpo_correo.value = true
  dialog.value = false;
}

const estatusVerificacionFiltrados = computed(() => {
  return options.value.cat_estatus_verificacion.map(item => ({
    ...item,
    disable: item.estatus === 'Pendiente'
  }))
})

const disableCuerpoCorreo = computed(() => {
	//dialogDictaminar(222,cuerpo_correo.value);
  if (!cuerpo_correo.value) return true;

  const div = document.createElement('div');
  div.innerHTML = cuerpo_correo.value;

  return div.textContent.trim().length === 0;
});

const verifyTemplates = computed(() => {
	return selectedItems.value.some(selected => {
		const registro = registers.value.find(
			r => r.id_impedimento === selected
		)
		return !registro?.cat_subcausal_impedimento?.cat_plantilla
	});
});

const onSelectChange = () => {
	let contenidoHtml = '<ul>';
	let aux = false;
	const item_array = [...selectedItems.value].sort((a, b) => a - b);
	item_array.forEach(selected => {

		const registro = registers.value.find(
			r => r.id_impedimento === selected
		);

		if (!registro?.cat_subcausal_impedimento?.cat_plantilla) {

			contenidoHtml += `
				<li>
					Impedimento ${registro.id_impedimento} -
					Subcausal: ${registro?.cat_subcausal_impedimento?.subcausal_impedimento || 'Sin nombre'}
				</li>
			`;

			aux = true;
		}

	});

	contenidoHtml += '</ul>';

	if (aux) {

		dialog2.value = true;

		title.value = 'Plantillas vacias';

		message.value = `Los Subcausales no cuentan con una plantilla asignada, favor de generarla.
			${contenidoHtml}
		`;

		label_btn.value = 'Continuar';
		action_save_form.value = 10;
	}
};

watch(cuerpo_correo, val => {
  if (val == "<br>") {
    cuerpo_correo.value = ''
  }
})

onMounted(() => {
	ifExistsImpediment();
})

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

.title{
  font-weight: bold;
  background: #10312B;
  color: white;
  padding: 5px;
  font-size: 20px;
}

</style>
