<template>
  <header-section :title="title">
    <template v-slot:buttons>
      <div class="row q-gutter-xs">
        <div class="row q-gutter-xs">
          <q-btn
            size="12px"
            color="red"
            icon="fas fa-angle-left"
            @click="$router.push({name:'HighMenu'})">
            Atras
          </q-btn>
        </div>
      </div>
    </template>
  </header-section>
  <br>

  <div class="q-pa-md">
    <q-form
      @submit="getEvent"
      class="q-gutter-md"
      ref="myForm"
    >
      <div class="row q-col-gutter-xs">
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

        <div class="col-md-4 q-pa-md">
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

        <div class="col-md-4 q-pa-md">
          <label for='id_impediment' style='font-weight: bold;'>Oficina</label>
          <q-select
            :disable="(store.user.perfil.id_perfil == 5 && [3, 4, 5].includes(store.user.perfil.id_perfil) ? false : true )"
            @new-value="newValue"
            dense
            use-chips
            outlined
            use-input
            emit-value
            map-options
            v-model='form.id_oficina'
            :options='options.office'
            option-value='id_oficina'
            option-label='cad_oficina'
            label='Oficina'
            :rules="[isRequired]"
            clearable/>
        </div>
        <div class="col-md-4 q-pa-md">
          <label style='font-weight: bold;'>Correo electrónico</label>
          <q-input
            outlined
            clearable
            style="width: 100%"
            dense
            placeholder="Correo electrónico"
            v-model="form.correo_electronico"
            :rules="[isValidEmail]"
            >
          </q-input>
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
            :rules="[isRequired]">
          </q-input>
        </div>
        <div class="col-md-6 q-pa-md">
          <label style='font-weight: bold;'>Apellido paterno</label>
          <q-input
            :disable="inputs_disabled_curp"
            outlined
            clearable
            style="width: 100%"
            dense
            placeholder="Apellido paterno"
            v-model="form.primer_apellido"
            :rules="[isRequired]">
          </q-input>
        </div>
        <div class="col-md-6 q-pa-md">
          <label style='font-weight: bold;'>Apellido materno</label>
          <q-input
            :disable="inputs_disabled_curp"
            outlined
            clearable
            style="width: 100%"
            dense
            placeholder="Apellido materno"
            v-model="form.segundo_apellido">
          </q-input>
        </div>
        <!-- <div class="col-md-6 q-pa-md">
          <label style='font-weight: bold;'>Correo electrónico</label>
          <q-input
            outlined
            clearable
            style="width: 100%"
            dense
            placeholder="Correo electrónico"
            v-model="form.persona_correo_electronico"
            :rules="[isValidEmail]">
          </q-input>
        </div> -->
        <div class="col-md-6 q-pa-md">
          <label style='font-weight: bold;'>Fecha de nacimiento</label>
          <q-input
              :disable="inputs_disabled_curp"
              outlined
              dense
              label="Fecha de nacimiento"
              v-model="form.fecha_nacimiento"
              mask="##-##-####" >
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
            placeholder="Entidad federativa de nacimiento"
            v-model="form.entidad_federativa_nacimiento"
            >
          </q-input>
        </div>
        <div class="col-md-6 q-pa-md">
          <label style='font-weight: bold;'>Curp</label>
          <q-input
            outlined
            clearable
            style="width: 100%"
            dense
            placeholder="Curp"
            v-model="form.curp"
            @keyup="onCurpTyping"
            :rules="[isValidCurp]">
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
            >
          </q-input>
        </div>
        <div class="col-md-4 q-pa-md">
          <label style='font-weight: bold;'>Apellido paterno</label>
          <q-input
            outlined
            clearable
            style="width: 100%"
            dense
            placeholder="Apellido paterno"
            v-model="form.padre_primer_apellido"
            >
          </q-input>
        </div>
        <div class="col-md-4 q-pa-md">
          <label style='font-weight: bold;'>Apellido materno</label>
          <q-input
            outlined
            clearable
            style="width: 100%"
            dense
            placeholder="Apellido materno"
            v-model="form.padre_segundo_apellido"
            >
          </q-input>
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
            >
          </q-input>
        </div>
        <div class="col-md-4 q-pa-md">
          <label style='font-weight: bold;'>Apellido paterno</label>
          <q-input
            outlined
            clearable
            style="width: 100%"
            dense
            placeholder="Apellido paterno"
            v-model="form.madre_primer_apellido"
            >
          </q-input>
        </div>
        <div class="col-md-4 q-pa-md">
          <label style='font-weight: bold;'>Apellido materno</label>
          <q-input
            outlined
            clearable
            style="width: 100%"
            dense
            placeholder="Apellido materno"
            v-model="form.madre_segundo_apellido"
            >
          </q-input>
        </div>


        <div class="col-md-6 q-pa-md">
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
        <!-- <div class="col-md-6 q-pa-md" v-if="(storeImpediment.title == 'Editar' || storeImpediment.title == 'Ver detalles')">
          <label for='id_impediment' style='font-weight: bold;'>Subcausal</label>
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
            clearable/>
        </div> -->
        <div class="col-md-12 q-pa-md">
          <label style='font-weight: bold;'>Motivación de acto jurídico</label>
          <q-input
            type="textarea"
            outlined
            clearable
            style="width: 100%"
            dense
            placeholder="Motivación de acto jurídico"
            v-model="form.motivacion_acto_juridico">
          </q-input>
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
          <q-checkbox
            :label="item.nombre"
            name="selection_anexo"
            :true-value="true"
            :false-value="false"
            :model-value="isSelected(item)"
            @update:model-value="(checked) => toggleItem(item, checked)"
          />

          <UploadFileChuncks
                v-if="form.selection_anexo.some(anexo => anexo.id_cat_anexos === item.id_cat_anexos)"
                class="q-mt-sm"
                @success-file="fileData"
                :max_allowed_size_mb="5"
                :size_chunks_mb="5"
                :type_file_front="'.pdf'"
                :type_file_back_system="item.id_cat_anexos"
                save_storage_folder="impedimentos_anexos_files/filesTemp"
                save_storage_cunks_folder="impedimentos_anexos_files/filesChunks"
                url="discharge_of_impediments/upload_file"/>
        </div>

        <div class="col-md-12 q-pa-md" v-if="(form.selection_anexo.some(anexo => anexo.id_cat_anexos === 3))">
          <label style='font-weight: bold;'>Número de pasaporte cancelado</label>
          <q-input
            :disable="!(form.selection_anexo.some(anexo => anexo.id_cat_anexos === 3))"
            outlined
            clearable
            style="width: 100%"
            dense
            placeholder="Número de pasaporte cancelado"
            v-model="form.numero_pasaporte_cancelado">
          </q-input>
        </div>

        <div class="col-md-12 q-pa-md">
          <label style='font-weight: bold;'>Especificar</label>
          <q-input
            type="textarea"
            outlined
            clearable
            style="width: 100%"
            dense
            placeholder="Especificar"
            v-model="form.especificar">
          </q-input>
        </div>

        <div class="col-12 q-pt-xs">
          <div class="row justify-end" >
            <div class="col-5 q-pt-xs">
              <q-btn-group class="full-width">
              <q-btn
                outline
                color="red"
                class="full-width"
                @click="$router.push({name:'HighMenu'})"
                label="Cancelar">
              </q-btn>
              <q-btn
                v-if="storeImpediment.title == 'Nuevo'"
                outline
                type="submit"
                color="primary"
                class="full-width"
                icon="fas fa-save"
                label="Guardar">
              </q-btn>
              <q-btn
                v-if="storeImpediment.title == 'Editar'"
                outline
                type="submit"
                color="primary"
                class="full-width"
                icon="fas fa-update"
                label="Actualizar">
              </q-btn>
              <q-btn
                v-if="(storeImpediment.title == 'Ver detalles' && storeImpediment.id_tipo_impedimento == 1)"
                outline
                type="submit"
                color="primary"
                class="full-width"
                icon="fas fa-update"
                label="Enviar solicitud">
              </q-btn>
              <q-btn
                v-if="(storeImpediment.title == 'Ver detalles' && storeImpediment.id_tipo_impedimento == 2)"
                outline
                type="submit"
                color="warning"
                class="full-width"
                icon="fas fa-update"
                label="Rechazar">
              </q-btn>
              <q-btn
                v-if="(storeImpediment.title == 'Ver detalles' && storeImpediment.id_tipo_impedimento == 2)"
                outline
                type="submit"
                color="primary"
                class="full-width"
                icon="fas fa-update"
                label="Autorizar">
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
import {ref,onMounted,watch} from "vue";
import DischargeImpedimentsServices from 'src/services/discharge_of_impediments';
import {useQuasar} from "quasar";
import {useRouter} from 'vue-router';
import { useImpedimentStore } from "stores/impediments";
import {useAuthUserStore} from "stores/AuthUser";
import moment from 'moment';
import useNotify from "src/composables/useNotify";
import {BinnacleTransaction} from "src/utils/binnacle"

const router = useRouter();
const $q = useQuasar();
const storeImpediment = useImpedimentStore()
const store = useAuthUserStore()
const {showError} = useNotify()
//const {showError, showSuccess} = useNotify()

const inputs_disabled_curp = ref(false);
const title = ref(null)
const myForm = ref(null)
const form = ref({
  fecha_registro: moment().format('DD-MM-YYYY'),
  id_oficina: null,
  correo_electronico:null,
  nombres:null,
  primer_apellido:null,
  segundo_apellido:null,
  persona_correo_electronico:null,
  fecha_nacimiento: null,
  entidad_federativa_nacimiento:null,
  curp: "NUAA900125HDFXLD07",
  genero: null,

  padre_nombres: null,
  padre_primer_apellido: null,
  padre_segundo_apellido: null,

  madre_nombres: null,
  madre_primer_apellido: null,
  madre_segundo_apellido: null,

  motivacion_acto_juridico:null,
  id_causal_impedimento: null,
  id_subcausal_impedimento: null,

  selection_anexo:[],
  numero_pasaporte_cancelado:null,
  especificar:null

});

const options = ref({
  office:[],
  impediments:[],
  cat_causal_impedimento:[],
  cat_subcausal_impedimento:[],
  cat_anexos: []
});

const state_date = ref(null) ;
const state_fecha_nacimiento = ref(null);

const myLocale = {
    days: 'Domingo_Lunes_Martes_Miércoles_Jueves_Viernes_Sábado'.split('_'),
    daysShort: 'Dom_Lun_Mar_Mié_Jue_Vie_Sáb'.split('_'),
    months: 'Enero_Febrero_Marzo_Abril_Mayo_Junio_Julio_Agosto_Septiembre_Octubre_Noviembre_Diciembre'.split('_'),
    monthsShort: 'Ene_Feb_Mar_Abr_May_Jun_Jul_Ago_Sep_Oct_Nov_Dic'.split('_'),
    firstDayOfWeek: 1,
    format24h: true,
    pluralDay: 'dias'
}

const onChangeCausal = ( id_causal_impedimento ) => {
  let options_ = options.value.cat_causal_impedimento.find(item => {
    return item.id_causal_impedimento == id_causal_impedimento;
  });

  options.value.cat_subcausal_impedimento = [];
  form.value.id_causal_impedimento = null;
  if( options_.cat_subcausal_impedimento.length > 0 ){
    options.value.cat_subcausal_impedimento = options_.cat_subcausal_impedimento;
  }
};

function onSubmit () {
  myForm.value.validate().then(success => {
    if (success) {
      $q.loading.show();
      DischargeImpedimentsServices.save({
        id_tipo_impedimento:storeImpediment.id_tipo_impedimento,
        ...form.value
      }).then(response => {
        $q.loading.hide();
        if (response.data.success) {
        $q.notify({
          color: 'green-4',
          textColor: 'white',
          icon: 'cloud_done',
          message: 'Éxito, se ha guardado la solicitud correctamente.'
        });
        //TODO: TRANSACCION CREAR ALTA
         if(storeImpediment.id_tipo_impedimento == 1) {
         //Transicion bitacora (moduleId, typeTransactionId, 'action')
         BinnacleTransaction(2,3,'Se Creo un Alta de Impedimento')
         }else if(storeImpediment.id_tipo_impedimento == 3) {
          //Transicion bitacora (moduleId, typeTransactionId, 'action')
         BinnacleTransaction(3,3,'Se Creo una Baja de Impledimento')
        }
        router.push({name:'HighMenu'});
        }
      }).catch(e => {
        $q.loading.hide();
        console.error("error: ",e);
      })
    }
    else {
      console.log("error ----");
      showError(
        'Error',
        'Revise los datos del formulario.');
    }
  })
}

function onUpdate () {
  myForm.value.validate().then(success => {
    if (success) {
      $q.loading.show();
      DischargeImpedimentsServices.update({
        id_tipo_impedimento:storeImpediment.id_tipo_impedimento,
        hash_id:storeImpediment.hash_id,
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
                  //TODO: TRANSACCION ACTUALIZAR ALTA
         if(storeImpediment.id_tipo_impedimento == 1) {
         //Transicion bitacora (moduleId, typeTransactionId, 'action')
         BinnacleTransaction(2,2,'Se Actualizo un Alta de Impedimento')
         }else if(storeImpediment.id_tipo_impedimento == 3) {
          //Transicion bitacora (moduleId, typeTransactionId, 'action')
         BinnacleTransaction(3,2,'Se Actualizo una Baja de Impledimento')
        }
        router.push({name:'HighMenu'});
        }
      }).catch(e => {
        $q.loading.hide();
        console.error("error: ",e);
      })
    }
    else {
      // oh no, user has filled in
      // at least one invalid value
    }
  })
}

const onChnageStatus = () => {
  $q.loading.show();
  DischargeImpedimentsServices.change_status({
    hash_id : storeImpediment.hash_id
  }).then(response => {
    console.log(response);
    $q.loading.hide();
    if (response.data.success) {
      $q.notify({
        color: 'green-4',
        textColor: 'white',
        icon: 'cloud_done',
        message: 'Éxito, se ha enviado la solicitud a revisión correctamente.'
      });
      //TODO: transaccion ver detalles
      if(storeImpediment.id_tipo_impedimento == 1){
        BinnacleTransaction(2,9,'Se Envio una Solicitud a revisión de un Alta de Impedimento')
      router.push({name:'HighMenu'});
      }
    }
  }).catch(e => {
    $q.loading.hide();
    console.error("error: ",e);
  })
};

const getEvent = () => {
  let action_event = null;

  switch (storeImpediment.title) {
    case "Nuevo":
      action_event = onSubmit();
    break;
    case "Editar":
      action_event = onUpdate();
    break;
    case "Ver detalles":
      action_event = onChnageStatus();
    break;
  }
  return action_event;
};

const get_cats = () => {
  $q.loading.show();
  DischargeImpedimentsServices.get_cats({
    id_tipo_impedimento : storeImpediment.id_tipo_impedimento
  }).then(response => {
    $q.loading.hide();
    if (response.data.success) {
      options.value.office = response.data.Results.cat_oficinas;
      options.value.cat_causal_impedimento = response.data.Results.causal_impedimento;
      options.value.cat_anexos = response.data.Results.cat_anexos;
    }
  }).catch(e => {
    $q.loading.hide();
    console.error("error: ",e);
  })
};

const getImpediment = ( ) => {
  $q.loading.show();
  DischargeImpedimentsServices.get_impediment({
    hash_id : storeImpediment.hash_id
  }).then(response => {
    $q.loading.hide();
    if (response.data.success) {
      state_date.value = moment(response.data.Results.fecha_registro).format('DD-MM-YYYY');
      form.value.id_oficina = response.data.Results.id_oficina;
      form.value.correo_electronico = response.data.Results.correo_electronico;
      form.value.nombres = response.data.Results.people.nombres;
      form.value.primer_apellido = response.data.Results.people.primer_apellido;
      form.value.segundo_apellido = response.data.Results.people.segundo_apellido;
      form.value.persona_correo_electronico = response.data.Results.people.correo_electronico;
      form.value.entidad_federativa_nacimiento = response.data.Results.people.entidad_federativa_nacimiento;
      form.value.curp = response.data.Results.people.curp.replace(/\s+/g, '');
      state_fecha_nacimiento.value = moment(response.data.Results.people.fecha_nacimiento).format('DD-MM-YYYY');

      form.value.padre_nombres = response.data.Results.people.people_fathers.nombres_padre;
      form.value.padre_primer_apellido = response.data.Results.people.people_fathers.primer_apellido_padre;
      form.value.padre_segundo_apellido = response.data.Results.people.people_fathers.segundo_apellido_padre;

      form.value.madre_nombres = response.data.Results.people.people_fathers.nombres_madre;
      form.value.madre_primer_apellido = response.data.Results.people.people_fathers.primer_apellido_madre;
      form.value.madre_segundo_apellido = response.data.Results.people.people_fathers.segundo_apellido_madre;

      form.value.id_causal_impedimento = response.data.Results.id_causal_impedimento;
      form.value.id_subcausal_impedimento = response.data.Results.id_subcausal_impedimento;
      form.value.motivacion_acto_juridico = response.data.Results.motivacion_acto_juridico;
      form.value.numero_pasaporte_cancelado = response.data.Results.numero_pasaporte_cancelado;

      //form.value.selection_anexo =
    }
  }).catch(e => {
    $q.loading.hide();
    console.error("error: ",e);
  })
};

const fileData = (data) => {
    if( Object.prototype.hasOwnProperty.call(data, 'path') ){
      data.path = process.env.API_URL+data.path;
    }

    // switch (data.id_cat_file_type) {
    //   case "1":
    //     state.file_1 = data;
    //     state.form.id_file_1 = data.id;
    //   break;
    //   case "2":
    //     state.file_2 = data;
    //     state.form.id_file_2 = data.id;
    //   break;
    //   case "3":
    //     state.file_3 = data;
    //     state.form.id_file_3 = data.id;
    //   break;
    // }
};

const onCurpTyping = () => {
  console.log('Tecla presionada:', form.value.curp)
  if( /^[A-Z]{4}\d{6}[HM][A-Z]{2}[A-Z]{3}[A-Z\d]\d$/.test(form.value.curp.toUpperCase()) ){
    $q.loading.show();
    DischargeImpedimentsServices.search_curp_user({
      hash_id : storeImpediment.hash_id,
      curp: form.value.curp
    }).then(response => {
      $q.loading.hide();
      if( response.data.status ){
        $q.notify({
          color: 'green-4',
          textColor: 'white',
          icon: 'cloud_done',
          message: 'Éxito, La curp fue encontrada correctamente.'
        });
        inputs_disabled_curp.value = true;
        form.value.nombres = response.data.nombres;
        form.value.primer_apellido = response.data.apellido_paterno;
        form.value.segundo_apellido = response.data.apellido_materno;
        state_fecha_nacimiento.value = moment(response.data.fecha_nacimiento, 'DD/MM/YYYY').format('DD-MM-YYYY');
        form.value.genero = response.data.sexo;
      }else{
        form.value.genero = null;
      }
    }).catch(e => {
      $q.loading.hide();
      console.error("error: ",e);
    })
  }
};

const newValue = (val,done) => {
    done(val);
};

const isSelected = ( item ) => {
  return form.value.selection_anexo.some(obj => obj.id_cat_anexos === item.id_cat_anexos);
};

const toggleItem = (item, checked) => {
  if (checked) {
    form.value.selection_anexo.push(item);
  } else {
    form.value.selection_anexo = form.value.selection_anexo.filter(
      obj => obj.id_cat_anexos !== item.id_cat_anexos
    );
  }
}

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

onMounted(() => {
  if( store.user.perfil.id_perfil != 1 ||  store.user.perfil.id_perfil != 4 ){
    form.value.id_oficina = store.user.oficina.id_oficina;
  }
  storeImpediment.setForm(form.value);
  title.value = storeImpediment.nombre_tipo_impedimento+' / '+storeImpediment.title;
  get_cats();

  if( storeImpediment.hash_id ){
    getImpediment();
  }

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
u
