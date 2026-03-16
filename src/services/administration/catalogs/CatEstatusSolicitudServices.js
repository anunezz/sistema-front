import { axiosInstance } from 'src/boot/axios';

export default {
  index(data) {
    return axiosInstance.get('administration/catalogs/estatus-solicitud', data);
  },

  create() {
    return axiosInstance.get('administration/catalogs/estatus-solicitud/create');
  },

  store(data) {
    return axiosInstance.post('administration/catalogs/estatus-solicitud', data);
  },

  edit(id) {
    return axiosInstance.get(`administration/catalogs/estatus-solicitud/${id}/edit`);
  },

  update(id, data) {
    return axiosInstance.put(`administration/catalogs/estatus-solicitud/${id}`, data);
  },

  remove(id) {
    return axiosInstance.delete(`administration/catalogs/estatus-solicitud/${id}`);
  },
}
