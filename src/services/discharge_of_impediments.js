import { axiosInstance } from 'src/boot/axios';

export default {
  index (data) {
    return axiosInstance.get('/administration/users', data);
  },
  get_cats (data) {
    return axiosInstance.post('/discharge_of_impediments/get_cats',data);
  },
  save (data) {
    return axiosInstance.post('/discharge_of_impediments/save',data);
  },
  get_data (data) {
    return axiosInstance.post('/discharge_of_impediments/get_data',data);
  },
  get_data_inbox_authorization_requests (data) {
    return axiosInstance.post('/discharge_of_impediments/get_data_inbox_authorization_requests',data);
  },
  get_data_inbox_validate_high (data) {
    return axiosInstance.post('/discharge_of_impediments/get_data_inbox_validate_high',data);
  },
  get_data_inbox_validate_low (data) {
    return axiosInstance.post('/discharge_of_impediments/get_data_inbox_validate_low',data);
  },
  get_data_inbox_validate_high_modify (data) {
    return axiosInstance.post('/discharge_of_impediments/get_data_inbox_validate_high_modify',data);
  },
  get_data_authorization_high_impediments (data) {
    return axiosInstance.post('/discharge_of_impediments/get_data_authorization_high_impediments',data);
  },
  get_data_response_impediments (data) {
    return axiosInstance.post('/discharge_of_impediments/get_data_response_impediments',data);
  },
  //################################### RECHAZOS  #################################################
  rejection_validates (data) {
    return axiosInstance.post('/discharge_of_impediments/rejection_validates',data);
  },
  //change_status_decline_deny (data) {
  reject_cancel (data) {
    return axiosInstance.post('/discharge_of_impediments/reject_cancel',data);
  },
  //authorize_rejection_status (data) {
  reject_authorize (data) {
    return axiosInstance.post('/discharge_of_impediments/reject_authorize',data);
  },
  //change_status_decline (data) {
  reject_authorization_impediment (data) {
    return axiosInstance.post('/discharge_of_impediments/reject_authorization_impediment',data);
  },
  reject_response_impediment (data) {
    return axiosInstance.post('/discharge_of_impediments/reject_response_impediment',data);
  },
  send_to_active (data) {
    return axiosInstance.post('/discharge_of_impediments/send_to_active',data);
  },
  send_to_validate (data) {
    return axiosInstance.post('/discharge_of_impediments/send_to_validate',data);
  },
  search_impediment (data) {
    return axiosInstance.post('/discharge_of_impediments/search_impediment',data);
  },
  send_to_authorize (data) {
    return axiosInstance.post('/discharge_of_impediments/send_to_authorize',data);
  },
  get_impediment (data) {
    return axiosInstance.post('/discharge_of_impediments/get_impediment',data);
  },
  update (data) {
    return axiosInstance.post('/discharge_of_impediments/update',data);
  },
  change_status (data) {
    return axiosInstance.post('/discharge_of_impediments/change_status',data);
  },
  search_curp_user (data) {
    return axiosInstance.post('/discharge_of_impediments/search_curp_user',data);
  },
  get_cats_index (data) {
    return axiosInstance.post('/discharge_of_impediments/get_cats_index',data);
  },
  select_impediment (data) {
    return axiosInstance.post('/discharge_of_impediments/select_impediment',data);
  },
  send_to_pending (data) {
    return axiosInstance.post('/discharge_of_impediments/send_to_pending',data);
  },
  send_to_for_rejecting (data) {
    return axiosInstance.post('/discharge_of_impediments/send_to_for_rejecting',data);
  },
  search_impediment_low (data) {
    return axiosInstance.post('/discharge_of_impediments/search_impediment_low',data);
  },
  create_impediment_low (data) {
    return axiosInstance.post('/discharge_of_impediments/create_impediment_low',data);
  },
  get_data_authorization_low_impediments (data) {
    return axiosInstance.post('/discharge_of_impediments/get_data_authorization_low_impediments',data);
  },
  send_to_active_low (data) {
    return axiosInstance.post('/discharge_of_impediments/send_to_active_low',data);
  },
  send_to_confirm_low (data) {
    return axiosInstance.post('/discharge_of_impediments/send_to_confirm_low',data);
  },
  create_impediment (data) {
    return axiosInstance.post('/discharge_of_impediments/create_impediment',data);
  },
  create_impediment_modify (data) {
    return axiosInstance.post('/discharge_of_impediments/create_impediment_modify',data);
  },
  get_data_inbox_verification (data) {
    return axiosInstance.post('/discharge_of_impediments/get_data_inbox_verification',data);
  },
  print_impediment (data) {
    return axiosInstance.post('/discharge_of_impediments/print_impediment',
		data,
		{
			responseType: 'blob',
			headers: {
				'Accept-C': 'false',
			}
		}
	);
  },
  get_data_consult_impediment (data) {
    return axiosInstance.post('/discharge_of_impediments/get_data_consult_impediment',data);
  },
  get_only_impediment (data) {
    return axiosInstance.post('/discharge_of_impediments/get_only_impediment',data);
  },
  get_data_inbox_work_assignation (data) {
    return axiosInstance.post('/discharge_of_impediments/get_data_inbox_work_assignation',data);
  },
  update_request_impediments (data) {
    return axiosInstance.post('/discharge_of_impediments/update_request_impediments',data);
  },
  assign_requests (data) {
    return axiosInstance.post('/discharge_of_impediments/assign_requests',data);
  },
  desassing_request (data) {
    return axiosInstance.post('/discharge_of_impediments/desassign_requests',data);
  },
  delete_impediment (data) {
    return axiosInstance.post('/discharge_of_impediments/delete_impediment',data);
  },
  if_exists_impediment (data) {
    return axiosInstance.post('/discharge_of_impediments/if_exists_impediment',data);
  },
  get_cats_impediment () {
    return axiosInstance.get('/discharge_of_impediments/get_cats_impediment');
  },
  impediment_update (data) {
    return axiosInstance.post('/discharge_of_impediments/impediment_update',data);
  },
  getCausalSubCausalFromImpedimentsID (data) {
    return axiosInstance.post('/discharge_of_impediments/getCausalSubCausalFromImpedimentsID',data);
  },
  send_to_dictaminate (data) {
    return axiosInstance.post('/discharge_of_impediments/send_to_dictaminate',data);
  },
  update_cuerpo_correo (data) {
    return axiosInstance.post('/discharge_of_impediments/update_cuerpo_correo',data);
  },
  send_to_verify (data) {
    return axiosInstance.post('/discharge_of_impediments/send_to_verify',data);
  },
  get_data_inbox_authorization_rejection (data) {
    return axiosInstance.post('/discharge_of_impediments/get_data_inbox_authorization_rejection',data);
  },
  download_request_report (data) {
    return axiosInstance.post('/discharge_of_impediments/download_request_report',
		data,
		{
			responseType: 'blob',
			headers: {
				'Accept-C': 'false',
			}
		}
	);
  }
}
