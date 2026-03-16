import { axiosInstance } from 'src/boot/axios';

export default {
  index(data) {
    return axiosInstance.get('administration/catalogs/entidad-federativa', data);
  },

  create() {
    return axiosInstance.get('administration/catalogs/entidad-federativa/create');
  },

  store(data) {
    return axiosInstance.post('administration/catalogs/entidad-federativa', data);
  },

  edit(id) {
    return axiosInstance.get(`administration/catalogs/entidad-federativa/${id}/edit`);
  },

  update(id, data) {
    return axiosInstance.put(`administration/catalogs/entidad-federativa/${id}`, data);
  },

  remove(id) {
    return axiosInstance.delete(`administration/catalogs/entidad-federativa/${id}`);
  },
}
