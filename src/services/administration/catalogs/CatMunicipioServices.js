import { axiosInstance } from 'src/boot/axios';

export default {
  index(data) {
    return axiosInstance.get('administration/catalogs/municipio', data);
  },

  create() {
    return axiosInstance.get('administration/catalogs/municipio/create');
  },

  store(data) {
    return axiosInstance.post('administration/catalogs/municipio', data);
  },

  edit(id) {
    return axiosInstance.get(`administration/catalogs/municipio/${id}/edit`);
  },

  update(id, data) {
    return axiosInstance.put(`administration/catalogs/municipio/${id}`, data);
  },

  remove(id) {
    return axiosInstance.delete(`administration/catalogs/municipio/${id}`);
  },
}
