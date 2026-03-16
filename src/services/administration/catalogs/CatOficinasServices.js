import { axiosInstance } from 'src/boot/axios';

export default {
  index(data) {
    return axiosInstance.get('administration/catalogs/oficinas', data);
  },

  create() {
    return axiosInstance.get('administration/catalogs/oficinas/create');
  },

  store(data) {
    return axiosInstance.post('administration/catalogs/oficinas', data);
  },

  edit(id) {
    return axiosInstance.get(`administration/catalogs/oficinas/${id}/edit`);
  },

  update(id, data) {
    return axiosInstance.put(`administration/catalogs/oficinas/${id}`, data);
  },

  remove(id) {
    return axiosInstance.delete(`administration/catalogs/oficinas/${id}`);
  },
}
