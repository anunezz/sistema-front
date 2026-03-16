import {RouterView} from "vue-router";

export default {
  path: '/impedimentos',
  component: RouterView,
  children: [
    /**************************
     * BANDEJA DE SOLICITUDES *
     **************************/
    {
      path: 'bandeja_de_solicitudes',
      name: 'InboxRequests',
      component: () => import( 'src/views/administration/discharge_of_impediments/Inbox_requests.vue'),
      meta:{requiredPermission: 'request_tray'}
    },
    {
      path: 'nueva_solicitud',
      name: 'NewFormRequests',
      component: () => import( 'src/views/administration/discharge_of_impediments/Form_request.vue'),
      meta:{requiredPermission: 'request_tray'}
    },
    {
      path: 'actualizar_solicitud/:hash_id',
      name: 'UpdateFormRequests',
      component: () => import( 'src/views/administration/discharge_of_impediments/Form_request.vue'),
      meta:{requiredPermission: 'request_tray'}
    },
    /***************************************
     * BANDEJA DE AUTORIZACION SOLICITUDES *
     ***************************************/
    {
      path: 'bandeja_de_autorizacion_de_solicitudes',
      name: 'InboxAuthorizationRequests',
      component: () => import( 'src/views/administration/discharge_of_impediments/Inbox_authorization_requests.vue'),
      meta:{requiredPermission: 'request_authorization_tray'}
    },
    {
      path: 'formulario_autorizacion_de_solicitudes/:hash_id',
      name: 'ValidationAuthorizationRequests',
      component: () => import( 'src/views/administration/discharge_of_impediments/Form_authorization_requests.vue'),
      meta:{requiredPermission: 'request_authorization_tray'}
    },
    /***************************************
     * BANDEJA DE AUTORIZACION RECHAZOS *
     ***************************************/
    {
      path: 'bandeja_de_autorizacion_de_rechazos',
      name: 'InboxAuthorizationRejection',
      component: () => import( 'src/views/administration/discharge_of_impediments/Inbox_authorization_rejection.vue'),
      meta:{requiredPermission: 'request_authorization_rejection_tray'}
    },
    {
      path: 'formulario_autorizacion_de_rechazos/:hash_id',
      name: 'FormAuthorizationRejection',
      component: () => import( 'src/views/administration/discharge_of_impediments/Form_authorization_rejection.vue'),
      meta:{requiredPermission: 'request_authorization_rejection_tray'}
    },
    /****************************************
     * BANDEJA DE VALIDACION DE ALTAS       *
     ***************************************/
    {
      path: 'bandeja_de_validacion_de_altas',
      name: 'InboxValidateHigh',
      component: () => import( 'src/views/administration/discharge_of_impediments/Inbox_validate_high.vue'),
      meta:{requiredPermission: 'high_validation_tray'}
    },
    {
      path: 'formulario_de_validacion_de_altas/:hash_id',
      name: 'FormValidateHigh',
      component: () => import( 'src/views/administration/discharge_of_impediments/Form_validate_high.vue'),
      meta:{requiredPermission: 'high_validation_tray'}
    },
    /****************************************************
     * BANDEJA DE AUTORIZACION DE ALTAS DE IMPEDIMENTOS *
     ****************************************************/
    {
      path: 'bandeja_de_autorizacion_de_altas_impedimentos',
      name: 'InboxAuthorizationHighImpediments',
      component: () => import( 'src/views/administration/discharge_of_impediments/Inbox_authorization_high_impediments.vue'),
      meta:{requiredPermission: 'authorization_inbox_impediment_clearance'}
    },
    {
      path: 'formulario_de_autorizacion_de_altas_impedimentos/:hash_id',
      name: 'FormAuthorizationHighImpediments',
      component: () => import( 'src/views/administration/discharge_of_impediments/Form_authorization_high_impediments.vue'),
      meta:{requiredPermission: 'authorization_inbox_impediment_clearance'}
    },
    /****************************************
     * BANDEJA DE VALIDACION DE BAJAS       *
     ***************************************/
    {
      path: 'bandeja_de_validacion_de_bajas',
      name: 'InboxValidateLow',
      component: () => import( 'src/views/administration/discharge_of_impediments/Inbox_validate_low.vue'),
      meta:{requiredPermission: 'low_validation_tray'}
    },
    {
      path: 'formulario_de_validacion_de_bajas/:hash_id',
      name: 'FormValidateLow',
      component: () => import( 'src/views/administration/discharge_of_impediments/Form_validate_low.vue'),
      meta:{requiredPermission: 'low_validation_tray'}
    },
    /****************************************************
     * BANDEJA DE AUTORIZACION DE BAJAS DE IMPEDIMENTOS *
     ****************************************************/
    {
      path: 'bandeja_de_autorizacion_de_bajas_impedimentos',
      name: 'InboxAuthorizationLowImpediments',
      component: () => import( 'src/views/administration/discharge_of_impediments/Inbox_authorization_low_impediments.vue'),
      meta:{requiredPermission: 'disability_discharge_authorization_tray'}
    },
    {
      path: 'formulario_de_autorizacion_de_bajas_impedimentos/:hash_id',
      name: 'FormAuthorizationLowImpediments',
      component: () => import( 'src/views/administration/discharge_of_impediments/Form_authorization_low_impediments.vue'),
      meta:{requiredPermission: 'disability_discharge_authorization_tray'}
    },
    /****************************************************
     * BANDEJA DE VALIDACION DE ALTA DE MODIFICACION DE IMPEDIMENTOS *
     ****************************************************/
    {
      path: 'bandeja_de_validacion_de_altas_de_modificacion_impedimentos',
      name: 'InboxValidateHighModifyImpediments',
      component: () => import( 'src/views/administration/discharge_of_impediments/Inbox_validate_high_modify.vue'),
      meta:{requiredPermission: 'validate_inbox_impediment_modify'}
    },
    {
      path: 'formulario_de_validacion_de_altas_de_modificacion_impedimentos/:hash_id',
      name: 'FormValidateHighModifyImpediments',
      component: () => import( 'src/views/administration/discharge_of_impediments/Form_validate_high_modify.vue'),
      meta:{requiredPermission: 'validate_inbox_impediment_modify'}
    },
    /****************************************************
     * BANDEJA DE VERIFICACIONES *
     ****************************************************/
    {
      path: 'bandeja_de_verificaciones',
      name: 'InboxVerification',
      component: () => import( 'src/views/administration/discharge_of_impediments/Inbox_verification.vue'),
      meta:{requiredPermission: 'verification_inbox'}
    },
    {
      path: 'formulario_de_verificaciones/:hash_id',
      name: 'FormVerification',
      component: () => import( 'src/views/administration/discharge_of_impediments/Form_verification.vue'),
      meta:{requiredPermission: 'verification_inbox'}
    },
    /****************************************************
     * BANDEJA DE VALIDACION DE MODIFICACION *
     ****************************************************/
    {
      path: 'bandeja_de_validacion_de_modificacion',
      name: 'InboxValidateModificacion',
      component: () => import( 'src/views/administration/discharge_of_impediments/Inbox_validate_modificacion.vue'),
      meta:{requiredPermission: 'validate_inbox_modificacion'}
    },
    {
      path: 'formulario_de_validacion_de_modificacion',
      name: 'FormValidateModificacion',
      component: () => import( 'src/views/administration/discharge_of_impediments/Form_validate_modificacion.vue'),
      meta:{requiredPermission: 'validate_inbox_modificacion'}
    },
    /****************************************************
     * BANDEJA DE ASIGNACIÓN DE TRABAJO *
     ****************************************************/
    {
      path: 'bandeja_de_asignacion_de_trabajo',
      name: 'InboxWorkAssignation',
      component: () => import( 'src/views/administration/discharge_of_impediments/Inbox_work_assignation.vue'),
      meta:{requiredPermission: 'work_assignation_inbox'}
    },
    {
      path: 'formulario_de_asignación_de_trabajo/:hash_id',
      name: 'FormWorkAssignation',
      component: () => import( 'src/views/administration/discharge_of_impediments/Form_work_assignation.vue'),
      meta:{requiredPermission: 'work_assignation_inbox'}
    },
    /*****************************************
     * BANDEJA DE RESPUESTA DE IMPEDIMENTOS  *
     *****************************************/
    {
      path: 'bandeja_de_respuesta_de_impedimentos',
      name: 'InboxResponseImpediments',
      component: () => import( 'src/views/administration/discharge_of_impediments/Inbox_response_impediments.vue'),
	  meta:{requiredPermission: 'impediments_response_tray'}
    },
    {
      path: 'formulario_respuesta_de_impedimentos/:hash_id',
      name: 'FormResponseImpediments',
      component: () => import( 'src/views/administration/discharge_of_impediments/Form_response_impediments.vue'),
	  meta:{requiredPermission: 'impediments_response_tray'}
    },
    /***********************************************************
     * BANDEJA DE CONSULTA DE IMPEDIMENTOS  *
     ***********************************************************/
    {
		path: 'bandeja_de_consulta_de_impedimentos',
		name: 'ConsultaImpedimentosIndex',
		component: () => import( 'src/views/administration/discharge_of_impediments/Inbox_consult_impediment.vue'),
		meta:{requiredPermission: 'impediment_query'}
	  },
    {
		path: 'formulario_consulta_de_impedimentos/:hash_id',
		name: 'ConsultaImpedimentosForm',
		component: () => import( 'src/views/administration/discharge_of_impediments/Form_consult_impediment.vue'),
		meta:{requiredPermission: 'impediment_query'}
	  },
    //----
    /***********************************************************
     * BANDEJA DE SOLICITUDES DE VERIFICACION DE IMPEDIMENTOS  *
     ***********************************************************/
    {
		path: 'bandeja_de_solicitudes_deverifiacion_impedimentos/plantillas',
		name: 'InboxPlantillas',
		component: () => import( 'src/views/administration/discharge_of_impediments/Plantillas.vue'),
		meta:{requiredPermission: 'impediments_response_tray'}
	  },
    {
		path: 'bandeja_de_solicitudes_deverifiacion_impedimentos/plantillas/nuevo',
		name: 'NewPlantillas',
		component: () => import( 'src/views/administration/discharge_of_impediments/NewPlantilla.vue'),
		meta:{requiredPermission: 'impediments_response_tray'}
	  },
    {
    path: 'bandeja_de_solicitudes_deverifiacion_impedimentos/plantillas/nuevo/:id?',
    name: 'EditPlantillas',
    component: () => import('src/views/administration/discharge_of_impediments/NewPlantilla.vue'),
    meta: { requiredPermission: 'impediments_response_tray' }
  },
    //----

    {
      path: 'bandeja_de_solicitudes',
      name: 'HighMenu',
      component: () => import( 'src/views/administration/discharge_of_impediments/Index.vue'),
      meta:{requiredPermission: ''}
    },
    {
      path: 'bandeja_de_solicitudes',
      name: 'HighMenu',
      component: () => import( 'src/views/administration/discharge_of_impediments/Index.vue'),
      meta:{requiredPermission: ''}
    },
    {
      path: 'nuevo',
      name: 'NewHigh',
      component: () => import( 'src/views/administration/discharge_of_impediments/Form.vue'),
      meta:{requiredPermission: ''}
    },
    {
      path: 'editar',
      name: 'updateMenu',
      component: () => import( 'src/views/administration/discharge_of_impediments/Form.vue'),
      meta:{requiredPermission: ''}
    },
    {
      path: 'ver_detalles',
      name: 'seeDetailsMenu',
      component: () => import( 'src/views/administration/discharge_of_impediments/Form.vue'),
      meta:{requiredPermission: ''}
    }
  ]

};
