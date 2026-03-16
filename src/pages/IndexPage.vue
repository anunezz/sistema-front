<template>
  <div class="row q-col-gutter-md q-pa-md" style="justify-content: center">
    <div
      class="col-xs-6 col-md-4"
      v-for="(section, index) in AccessModulePermission"
      :key="index + 100"
    >
      <q-card
        v-ripple
        style="cursor: pointer;padding: 5px"
        @click="moduleMenu(section)"
      >
        <div class="row">
          <div class="col-12">
            <q-img
              style="border-radius: 5px;"
              :style="$q.screen.lt.md ? 'height: 145px' : 'height: 146px'"
              src="~assets/img/MenuColor.png"
              basic
            >
              <div
                class="absolute-bottom text-subtitle2 text-center q-mb-md transparent text-grey-10"
              >
                <q-icon
                  :name="section.icon !== '' ? section.icon : section.iconImage ? `img:${section.iconImage}` : ''"
                  style="color: #126866; font-size: clamp(20px, 4vw, 80px);"
                />
              </div>
              <div class="absolute-full transparent app-secition"></div>
            </q-img>
          </div>
          <div class="col-12 text-center" style="color: #335474;padding: 7px">
            {{ section.name }}
          </div>
        </div>
      </q-card>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

import { useAuthUserStore } from "src/stores/AuthUser";

import iconBandejaSolicitudes from 'src/assets/icons/Home/bandeja_solicitudes.png';
import iconBandejaAutorizacionSolicitudes from 'src/assets/icons/Home/bandeja_autorizacion_solicitudes.png';
import iconBandejaValidacionAltas from 'src/assets/icons/Home/bandeja_validacion_altas.png';
import iconBandejaValidacionBajas from 'src/assets/icons/Home/bandeja_validacion_bajas.png';
// import iconBandejaSolicitudesVerificacionImpedimentos from 'src/assets/icons/Home/bandeja_solicitudes_verificacion_impedimentos.png';
import iconBandejaAutorizacionAltaImpedimentos from 'src/assets/icons/Home/bandeja_autorizacion_alta_impedimentos.png';
import iconBandejaAutorizacionBajaImpedimentos from 'src/assets/icons/Home/bandeja_autorizacion_baja_impedimentos.png';
import iconBandejaRespuestaImpedimentos from 'src/assets/icons/Home/bandeja_respuesta_impedimentos.png';
import iconAdminCatalogos from 'src/assets/icons/Home/admin_catalogos.png';
import iconReportes from 'src/assets/icons/Home/reportes.png';
import iconAdminUsuarios from 'src/assets/icons/Home/admin_usuarios.png';
import iconConsultaImpedimentos from 'src/assets/icons/Home/consulta_impedimentos.png';
import iconBitacora from 'src/assets/icons/Home/bitacora.png';
import iconReporteEstadisticoImpedimentos from 'src/assets/icons/Home/reporte_estadistico_impedimentos.png';
import { BinnacleTransaction } from 'src/utils/binnacle';
import { useRouter } from 'vue-router'

const authStore = useAuthUserStore();
const router = useRouter()
const modules = ref([
  {
    name: "Solicitudes",
    icon: "",
    iconImage: iconBandejaSolicitudes,
    routeName: "InboxRequests",
    permission: 'request_tray',
    module: 2
  },
  {
    name: "Autorización de solicitudes",
    icon: "",
    iconImage: iconBandejaAutorizacionSolicitudes,
    routeName: "InboxAuthorizationRequests",
    permission: 'request_authorization_tray',
    module: 3
  },
  {
    name: "Autorización de rechazos",
    icon: "",
    iconImage: iconBandejaAutorizacionSolicitudes,
    routeName: "InboxAuthorizationRejection",
    permission: 'request_authorization_rejection_tray',
    module: 20
  },
  {
    name: "Validación de altas",
    icon: "",
    iconImage: iconBandejaValidacionAltas,
    routeName: "InboxValidateHigh",
    permission:'high_validation_tray',
    module: 4
  },
  {
    name: "Validación de bajas",
    icon: "",
    iconImage: iconBandejaValidacionBajas,
    routeName: "InboxValidateLow",
    permission:'low_validation_tray',
    module: 5
  },
  // {
  //   name:'Bandeja de solicitudes de verificacion de impedimentos',
  //   icon:'',
  //   iconImage:iconBandejaSolicitudesVerificacionImpedimentos,
  //   routeName: '',
  //   permission:'impediment_verification_request_tray'
  // },
  {
    name:'Autorización de alta de impedimentos',
    icon:'',
    iconImage:iconBandejaAutorizacionAltaImpedimentos,
    routeName: 'InboxAuthorizationHighImpediments',
    permission:'authorization_inbox_impediment_clearance',
    module: 7
  },
  {
    name:'Autorización de baja de impedimentos',
    icon: '',
    iconImage:iconBandejaAutorizacionBajaImpedimentos,
    routeName: 'InboxAuthorizationLowImpediments',
    permission:'disability_discharge_authorization_tray',
    module: 8
  },
  {
    name:'Validación de Alta por modificación de datos personales',
    icon: '',
    iconImage:iconBandejaAutorizacionAltaImpedimentos,
    routeName: 'InboxValidateHighModifyImpediments',
    permission:'validate_inbox_impediment_modify',
    module: 21
  },
  {
    name:'Verificaciones',
    icon: '',
    iconImage:iconBandejaAutorizacionAltaImpedimentos,
    routeName: 'InboxVerification',
    permission:'verification_inbox',
    module: 6
  },
  {
    name:'Asignación de trabajo',
    icon: '',
    iconImage:iconBandejaAutorizacionAltaImpedimentos,
    routeName: 'InboxWorkAssignation',
    permission:'work_assignation_inbox',
    module: 23
  },
  {
    name:'Respuesta de impedimentos',
    icon:'',
    iconImage:iconBandejaRespuestaImpedimentos,
    routeName:'InboxResponseImpediments',
    permission:'impediments_response_tray',
    module: 9
  },
  {
    name:'Administración de Catálogos',
    icon:'',
    iconImage:iconAdminCatalogos,
    routeName:'CatalogsIndex',
    permission:'catalog_management',
    module: 10
  },
  {
    name: "Generación de reportes",
    icon: "",
    iconImage: iconReportes,
    routeName: "ReportesIndex",
    permission:'reports',
    module: 11
  },
  {
    name: "Administración de Usuarios",
    icon: "",
    iconImage: iconAdminUsuarios,
    routeName: "UsersIndex",
    permission:'user_management',
    module: 12
  },
  {
    name: "Consulta de impedimentos",
    icon: "",
    iconImage: iconConsultaImpedimentos,
    routeName: 'ConsultaImpedimentosIndex',
    permission:'impediment_query',
    module: 13
  },
  {
    name: "Consulta de Bitácora",
    icon: "",
    iconImage: iconBitacora,
    routeName: "BinnacleIndex",
    permission:'logbook',
    module: 14
  },
  {
    name:'Reporte estadistico de solicitudes',
    icon:'',
    iconImage:iconReporteEstadisticoImpedimentos,
    routeName:'ReportesEstadisticosIndex',
    permission:'reports',
    module: 15
  },
  {
    name: 'Bitácora Solicitudes',
    icon:'',
    iconImage: iconBitacora,
    routeName: "ApplicationBinnacleIndex",
    permission:'request_log',
    module: 16
  },
  {
    name: 'Bitácora Impedimentos',
    icon:'',
    iconImage: iconBitacora,
    routeName: "ImpedimentBinnacleIndex",
    permission:'impediment_log',
    module: 17
  }
]);

const moduleMenu = (section) => {
  console.log(section)
  BinnacleTransaction(section.module, 1, `Ingreso al módulo de ${section.name}`)
  router.push({ name: section.routeName })
}

const AccessModulePermission = computed(() => {
  return modules.value.filter(module=>authStore.hasPermission(module.permission));
  //return modules.value.filter(module=>authStore.hasPermission(module.permission));
});
</script>
