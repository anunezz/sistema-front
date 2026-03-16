<template>
  <header-section title="Validación de bajas" url-redirect="InboxValidateLow" :icon-image="iconModule">
  </header-section>
  <br>

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
		<q-btn :label="label_btn" @click="actionForm" color="positive" icon="save" />
		</q-card-actions>
	</q-card>
</q-dialog>

<q-dialog v-model="dialog" persistent>
	<q-card style="min-width: 1200px; max-width: 800px;">
		<q-card-section>
		<div class="text-h6">Motivo rechazo</div>
		</q-card-section>

		<q-form @submit.prevent="validateFields(), action_save_form=5" ref="rejectForm">
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
			<q-btn label="Rechazar" type="submit" color="negative" />
			</q-card-actions>
		</q-form>
	</q-card>
</q-dialog>

<q-dialog persistent v-model="printImpedimentModal" >
  <q-card style="width: 100%; max-width: 900px">
     <q-btn
       icon="close"
       round
       dense
       flat
       color="grey-8"
       @click="closePrintImpediment"
       style="position: absolute; top: 8px; right: 8px; z-index: 10;"
     />
    <q-card-section>
       <div class="row q-col-gutter-xs">
         <div class="col-md-12 q-pa-md">
            <h5>
              <q-btn
                round
                style="background-color: #691C32;"
                text-color="grey-9">
                <q-avatar size="24px">
                  <img src="~src/assets/icons/icon-lista.png">
                </q-avatar>
              </q-btn>
            Se da de baja el impedimento número: {{ printImpedimentData?.numero_impedimento }}
            </h5>
          </div>
       </div>

      <q-list bordered>
        <q-item>
          <q-item-section>Nombre:</q-item-section>
          <q-item-section>{{ printImpedimentData?.people?.nombres || '*' }}</q-item-section>
        </q-item>
        <q-item>
          <q-item-section>Primer apellido:</q-item-section>
          <q-item-section>{{ printImpedimentData?.people?.primer_apellido || '*' }}</q-item-section>
        </q-item>
        <q-item>
          <q-item-section>Segundo apellido:</q-item-section>
          <q-item-section>{{ printImpedimentData?.people?.segundo_apellido || '*' }}</q-item-section>
        </q-item>
        <q-item>
          <q-item-section>CURP:</q-item-section>
          <q-item-section>{{ printImpedimentData?.people?.curp|| '*' }}</q-item-section>
        </q-item>
      </q-list>
    </q-card-section>

    <q-separator />


    <!-- Botón imprimir -->
    <q-card-actions align="right">
		<q-btn flat label="Cerrar" @click="$router.push({name:'InboxValidateLow'})" style="background-color: #691C32;" class="text-white"/>
      	<q-btn flat label="Imprimir boleta" @click="printImpediment" style="background-color: #691C32;" class="text-white"/>
    </q-card-actions>

  </q-card>
</q-dialog>

  <q-dialog v-model="dialog" persistent>
    <q-card style="min-width: 1200px; max-width: 800px;">
      <q-card-section>
        <div class="text-h6">Motivo de rechazo</div>
      </q-card-section>

      <q-form @submit.prevent="validateFields(), action_save_form=5" ref="rejectForm">
        <q-card-section>
            <q-input
            type="textarea"
            outlined
            clearable
            style="width: 100%"
            dense
            label="Observaciones"
            :rules="[val => !!val || 'El campo no puede estar vacío']"
            v-model="observaciones"
            v-uppercase
            v-max="500"
			/>
        </q-card-section>
      <q-card-actions align="right">
        <q-btn flat label="Cerrar" color="secondary" @click="dialog = false" />
        <q-btn label="Rechazar" type="submit" color="negative" />
      </q-card-actions>
    </q-form>
    </q-card>
  </q-dialog>

  <q-dialog v-model="dialog_search" persistent>
    <q-card style="min-width: 1450px; max-width: 800px;">
      <q-card-section>
        <div class="text-h6">Buscar impedimento</div>
      </q-card-section>
      <q-card-section >
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
                  <ExpandedImpedimentRow :row="props.row" @select="selectImpediment" />
                </q-td>
              </q-tr>
            </template>
          </q-table>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="Cerrar" color="secondary" @click="dialog_search = false" />
      </q-card-actions>
    </q-card>
  </q-dialog>

  <div class="q-pa-md">
    <q-form
      @submit="validateFields()"
      class="q-gutter-md"
      ref="myForm"
    >
      <div class="row q-col-gutter-xs">
        <div class="col-md-12" v-if="observaciones">
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
          <label style='font-weight: bold;'>Segundo apellido *</label>
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
            >
          </q-input>
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
            clearable/>
        </div>
        <div class="col-md-6 q-pa-md" >
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
        <div class="col-md-12 q-pa-md" v-if="form.id_tipo_solicitud == 2 && form.id_causal_impedimento == 19">
          	<label style='font-weight: bold;'>Otra *</label>
			<q-input
				outlined
				clearable
				dense
				placeholder="Otra"
				v-model="form.causal_otro_descripcion"
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
                outlined
                clearable
                style="width: 100%"
                dense
                placeholder="Número de pasaporte cancelado"
                v-model="form.numero_pasaporte_cancelado"
                v-max="100"
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
                v-max="500"
                placeholder="Especificar"
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
            <div class="col-7 q-pt-xs">
              <q-btn-group class="full-width">
                <q-btn
                  outline
                  color="red"
                  class="full-width"
                  @click="$router.push({name:'InboxValidateLow'})"
                  label="Cancelar">
                </q-btn>
                <q-btn
                  outline
                  color="red"
                  class="full-width"
                  @click="dialog = true"
                  label="Rechazar">
                </q-btn>
                <q-btn
                  @click="validateFields(),action_save_form=2"
                  outline
                  type="submit"
                  color="primary"
                  class="full-width"
                  label="Actualizar">
                </q-btn>
                <q-btn
                  @click="validateFields(),action_save_form=3"
                  type="submit"
                  outline
                  color="primary"
                  class="full-width"
                  label="Buscar impedimento">
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
import {ref,onMounted} from "vue";
import DischargeImpedimentsServices from 'src/services/discharge_of_impediments';
import {useQuasar} from "quasar";
import {useRouter} from 'vue-router';
import {useAuthUserStore} from "stores/AuthUser";
import ExpandedImpedimentRow from 'components/ExpandedImpedimentRow2.vue'
import imageRoute from 'src/assets/icons/Home/bandeja_validacion_bajas.png';
import useImpedimentForm from 'src/composables/useImpedimentForm';

const router = useRouter();
const $q = useQuasar();
const store = useAuthUserStore()

const iconModule = ref(imageRoute);
const {
	state_date,
	state_fecha_nacimiento,
	form,
	options,
	myLocale,
	observaciones,
	inputs_disabled_curp,
	myForm,
	optionOffices,
	plantillaError,
	getDataFileAnexos,
	onCurpTyping,
	newValue,
	onChangeCausal,
	fileData,
	isSelected,
	toggleItem,
	filterOffices,
	onOficinaSelected,
	validateFiles,
	getImpediment
} = useImpedimentForm()

const dialog_search = ref(false);
const action = ref(false);
const dialog = ref(false);
const dialog2 = ref(false);
const action_save_form = ref(null);
const title = ref(null);
const message = ref(null);
const label_btn = ref(null);
const impediment = ref({});
const rejectForm = ref(null);
const printImpedimentModal = ref(false);
const printImpedimentData = ref({});

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

const validateFields = async () => {
	await myForm.value.validate().then(success => {
		if( validateFiles(success) ){
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
		case 3:
			return_event = searchImpediment();
		break;
		case 5:
		dialog2.value = true;
		title.value = 'Rechazar solicitud';
		message.value = '¿Estás completamente seguro de rechazar la solicitud?';
		label_btn.value = 'Rechazar';
		break;
		}
		return return_event;
	});
};

const selectImpediment = ( row ) => {
	$q.loading.show();
	action_save_form.value = 3;
	dialog2.value = true;
	title.value = 'Seleccionar solicitud';
	message.value = '¿Estás completamente seguro de solicitar la baja de este impedimento?';
	label_btn.value = 'Guardar';
	impediment.value = row;
	$q.loading.hide();
};

const createImpedimentLow = () => {
	$q.loading.show();
	DischargeImpedimentsServices.create_impediment_low({
		hash_id: router.currentRoute.value.params.hash_id,
		moduleId: 5,
		id_impedimento: impediment.value?.id_impedimento,
		id_persona: impediment.value?.people?.id_persona
	}).then(response => {
		$q.loading.hide();
		if (response.data.success) {
		$q.notify({
			color: 'green-4',
			textColor: 'white',
			icon: 'cloud_done',
			message: 'Éxito, El impedimento ha sido actualizado correctamente.'
		});
		printImpedimentData.value = response.data.ImImpedimento;
				showPrintImpedimentModal()
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
		DischargeImpedimentsServices.rejection_validates({
		//DischargeImpedimentsServices.send_to_for_rejecting({
			observaciones: observaciones.value,
			hash_id: router.currentRoute.value.params.hash_id,
			moduleId: 5,
		}).then(response => {
			$q.loading.hide();
			if (response.data.success) {
			$q.notify({
			color: 'green-4',
			textColor: 'white',
			icon: 'cloud_done',
			message: 'Éxito, la solicitud ha sido rechazada correctamente.'
			});
			router.push({name:'InboxValidateLow'});
			}
		}).catch(e => {
			$q.loading.hide();
			console.error("error: ",e);
		})
    }
  });
};

function onUpdate () {
	$q.loading.show();
	DischargeImpedimentsServices.update({
		hash_id : router.currentRoute.value.params.hash_id,
		moduleId: 5,
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

const searchImpediment = ( pag = null ) => {
  if( pag !== undefined && pag ){
    pagination.value.page = pag.pagination.page;
    pagination.value.rowsPerPage = pag.pagination.rowsPerPage;
    pagination.value.rowsNumber = pag.pagination.rowsNumber;
  }

  dialog_search.value = true;
      $q.loading.show();
	DischargeImpedimentsServices.search_impediment_low({
		hash_id : router.currentRoute.value.params.hash_id,
		...form.value,
		...pagination.value
	}).then(response => {
		$q.loading.hide();
		if (response.data.success) {
			registers.value = response.data.ImImpedimentos.data;
		}
	}).catch(e => {
		$q.loading.hide();
		console.error("error: ",e);
	})

};

const showPrintImpedimentModal = () => {
  printImpedimentModal.value = true;
}

const closePrintImpediment = () => {
  printImpedimentModal.value = false
  router.push({name:'InboxValidateLow'});
}

const printImpediment = () => {
 	$q.loading.show();
	DischargeImpedimentsServices.print_impediment({
		id_impedimento : printImpedimentData.value.id_impedimento,
    id_solicitud: form.value.id_solicitud,
    moduleId: 5,
	},{ responseType: 'blob' }).then(response => {
		$q.loading.hide();

		// Crear URL del blob y descargar
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = `impedimento_${printImpedimentData.value.id_impedimento}.pdf`;
      link.click();

      $q.notify({
        color: 'green-4',
        textColor: 'white',
        icon: 'cloud_done',
        message: 'Éxito, se descargó el impedimento correctamente.'
      });
	}).catch(e => {
    $q.loading.hide();
		console.error("error: ",e);
	})
}

const actionForm = () => {
	let retun_event = null;
	switch (action_save_form.value) {
		case 2:
			retun_event = onUpdate();
		break;
		case 3:
			retun_event = createImpedimentLow();
		break;
		case 5:
			retun_event = handleReject();
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
				router.push({name:'InboxValidateLow'});
			}
		}
	}).catch(e => {
    	$q.loading.hide();
		console.error("error: ",e);
	})
};

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
