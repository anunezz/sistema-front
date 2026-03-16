<template>
  <div v-for="(link,$index) in menuList" :key="$index">
    <q-item  v-if="link.moduleName !== ''">
      <q-item-section class="text-weight-bold" style="font-size: 12px">
        <strong>{{ link.moduleName }}</strong>
      </q-item-section>
    </q-item>

    <q-list>
      <template  v-for="(menuItem, index) in link.childs" :key="index">
        <q-item
          v-if="authStore.hasPermission(menuItem.permission)"
          clickable
          v-ripple
          tag="router-link"
          @click="handleItem(menuItem)"
          :style="itemStyle(menuItem)"
          active-class="bg-grey-4 text-primary"
          exact
        >
          <q-item-section avatar>
            <q-icon
              :style="menuItem.color ? { color: menuItem.color } : null"
              :name="menuItem.icon !== '' ? menuItem.icon : (menuItem.iconImage ? `img:${menuItem.iconImage}` : '')"
            />
          </q-item-section>

          <q-item-section :style="menuItem.color ? { color: menuItem.color } : null">
            {{ menuItem.moduleName }}
          </q-item-section>
        </q-item>
      </template>
    </q-list>
  </div>

</template>

<script setup>
import {ref} from "vue";
import { useAuthUserStore } from "src/stores/AuthUser";

import iconBandejaSolicitudes from 'src/assets/icons/SideBard/bandeja_solicitudes.png';
import iconBandejaAutorizacionSolicitudes from 'src/assets/icons/SideBard/bandeja_autorizacion_solicitudes.png';
import iconBandejaValidacionAltas from 'src/assets/icons/SideBard/bandeja_validacion_altas.png';
import iconBandejaValidacionBajas from 'src/assets/icons/SideBard/bandeja_validacion_bajas.png';
import iconBandeSolicitudesVerificacionImpedimentos from 'src/assets/icons/SideBard/bandeja_solicitudes_verificacion_impedimentos.png';
import iconBandejaAutorizacionAltaImpedimentos from 'src/assets/icons/SideBard/bandeja_autorizacion_alta_impedimentos.png';
import iconBandejaAutorizacionBajaImpedimentos from 'src/assets/icons/SideBard/bandeja_autorizacion_baja_impedimentos.png';
import iconBandejaRespuestaImpedimentos from 'src/assets/icons/SideBard/bandeja_respuesta_impedimentos.png';
import iconAdminCatalogos from 'src/assets/icons/SideBard/admin_catalogos.png';
import iconReportes from 'src/assets/icons/SideBard/reportes.png';
import iconAdminUsuarios from 'src/assets/icons/SideBard/admin_usuarios.png';
import iconConsultaImpedimentos from 'src/assets/icons/SideBard/consulta_impedimentos.png';
import iconBitacora from 'src/assets/icons/SideBard/bitacora.png';
import iconReporteEstadisticoImpedimentos from 'src/assets/icons/SideBard/reporte_estadistico_impedimentos.png';
import { BinnacleTransaction } from "src/utils/binnacle";
import { useRouter } from "vue-router";

const authStore = useAuthUserStore();
const router = useRouter();

const menuList = ref([
  {
    moduleName: '',
    childs:[
      { icon: 'fa-solid fa-inbox', moduleName: 'Inicio', routeName: 'AdministrationMenu', color: "#FFFFFF",backgroundColor:"#343434"}
    ]
  },

  {
    moduleName: '',
    childs:[
      { id:1, icon: '',iconImage:iconBandejaSolicitudes, moduleId:2 ,moduleName: 'Solicitudes', routeName: 'InboxRequests', color: "#343434",permission:'request_tray'},
      { id:2, icon: '',iconImage: iconBandejaAutorizacionSolicitudes, moduleId:3 ,moduleName: 'Autorización de solicitudes', routeName: 'InboxAuthorizationRequests', color: "#343434",permission:'request_authorization_tray'},
      { id:21, icon: '',iconImage: iconBandejaAutorizacionSolicitudes, moduleId: 20 ,moduleName: 'Autorización de rechazos', routeName: 'InboxAuthorizationRejection', color: "#343434",permission:'request_authorization_rejection_tray'},
      { id:3, icon: '', iconImage: iconBandejaValidacionAltas, moduleId:4 ,moduleName: 'Validación de altas', routeName: 'InboxValidateHigh', color: "#343434",permission:'high_validation_tray'},
      { id:4, icon: '', iconImage: iconBandejaValidacionBajas, moduleId: 5,moduleName: 'Validación de bajas', routeName: 'InboxValidateLow', color: "#343434",permission:'low_validation_tray'},
      // { id:5, icon: '', iconImage: iconBandeSolicitudesVerificacionImpedimentos, moduleName: 'Bandeja de solicitudes de verificacion de impedimentos', routeName: '', color: "#343434",permission:'impediment_verification_request_tray'},
      { id:6, icon: '', iconImage: iconBandejaAutorizacionAltaImpedimentos, moduleId:7 ,moduleName: 'Autorización de alta de impedimentos', routeName: 'InboxAuthorizationHighImpediments', color: "#343434",permission:'authorization_inbox_impediment_clearance'},
      { id:7, icon: '', iconImage: iconBandejaAutorizacionBajaImpedimentos, moduleId:8 ,moduleName: 'Autorización de baja de impedimentos', routeName: 'InboxAuthorizationLowImpediments', color: "#343434",permission:'disability_discharge_authorization_tray'},
      { id:8, icon: '', iconImage: iconBandejaAutorizacionAltaImpedimentos, moduleId:21 ,moduleName: 'Validación de Alta por modificación de datos personales', routeName: 'InboxValidateHighModifyImpediments', color: "#343434",permission:'validate_inbox_impediment_modify'},
      // { id:9, icon: '', iconImage: iconBandejaAutorizacionAltaImpedimentos, moduleName: 'Validación de modificación', routeName: 'InboxValidateModificacion', color: "#343434",permission:'validate_inbox_modificacion'},
      { id:10, icon: '', iconImage: iconBandeSolicitudesVerificacionImpedimentos, moduleId:6 ,moduleName: 'Verificaciones', routeName: 'InboxVerification', color: "#343434",permission:'verification_inbox'},
      { id:11, icon: '', iconImage: iconBandejaAutorizacionAltaImpedimentos, moduleId: 23,moduleName: 'Asignación de trabajo', routeName: 'InboxWorkAssignation', color: "#343434",permission:'work_assignation_inbox'},
      { id:12, icon: '', iconImage: iconBandejaRespuestaImpedimentos, moduleId: 9,moduleName: 'Respuesta de impedimentos', routeName: 'InboxResponseImpediments', color: "#343434",permission:'impediments_response_tray'},
      { id:13, icon: '', iconImage: iconAdminCatalogos, moduleId: 10,moduleName: 'Administración de Catálogos', routeName: 'CatalogsIndex', color: "#343434",permission:'catalog_management'},
      { id:14, icon: '', iconImage: iconReportes, moduleId: 11,moduleName: 'Generación de  Reportes', routeName: 'ReportesIndex', color: "#343434",permission:'reports'},
      { id:15, icon: '', iconImage: iconAdminUsuarios, moduleId:12 ,moduleName: 'Administración de Usuarios', routeName: 'UsersIndex', color: "#343434",permission:'user_management'},
      { id:16, icon: '', iconImage: iconConsultaImpedimentos, moduleId:13 ,moduleName: 'Consulta de Impedimentos', routeName: 'ConsultaImpedimentosIndex', color: "#343434",permission:'impediment_query'},
      { id:17, icon: '', iconImage: iconBitacora, moduleId: 14,moduleName: 'Consulta de Bitácora', routeName: 'BinnacleIndex', color: "#343434",permission:'logbook'},
      { id:18, icon: '', iconImage: iconReporteEstadisticoImpedimentos, moduleId: 15,moduleName: 'Reporte estadistico de impedimentos', routeName: 'ReportesEstadisticosIndex', color: "#343434",permission:'reports'},
      { id:19, icon: '', iconImage: iconBitacora,moduleId: 16,moduleName:'Bitácora solicitudes', routeName:'ApplicationBinnacleIndex', color: "#343434",permission:'request_log'},
      { id:20, icon: '', iconImage: iconBitacora,moduleId: 17,moduleName:'Bitácora Impedimentos', routeName:'ImpedimentBinnacleIndex', color: "#343434",permission:'impediment_log'}
    ]
  },

]);

const handleItem = (menuItem) => {

  BinnacleTransaction(menuItem.moduleId, 1, `Ingreso al módulo de ${menuItem.moduleName}`)
    router.push({ name: menuItem.routeName })

}

const itemStyle = (menuItem) => {
  const s = {};
  if (menuItem.backgroundColor) s.backgroundColor = menuItem.backgroundColor;
  if (menuItem.color) s.color = menuItem.color;
  return s;
};



</script>

<style scoped>
.q-item2{

  background: #ece9e9;

}

.q-item2:hover{

  background: #343434;
  color: #FFF;

}

</style>
