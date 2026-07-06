import { axiosInstance } from 'src/boot/axios';

export default {
  index(data) {
    return axiosInstance.get('administration/catalogs/pais', data);
  },

  create() {
    return axiosInstance.get('administration/catalogs/pais/create');
  },

  store(data) {
    return axiosInstance.post('administration/catalogs/pais', data);
  },

  edit(id) {
    return axiosInstance.get(`administration/catalogs/pais/${id}/edit`);
  },

  update(id, data) {
    return axiosInstance.put(`administration/catalogs/pais/${id}`, data);
  },

  remove(id) {
    return axiosInstance.delete(`administration/catalogs/pais/${id}`);
  },
}
