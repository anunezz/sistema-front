import { axiosInstance } from 'src/boot/axios';

export default {
  index(data) {
    return axiosInstance.get('administration/catalogs/general-genero', data);
  },

  create() {
    return axiosInstance.get('administration/catalogs/general-genero/create');
  },

  store(data) {
    return axiosInstance.post('administration/catalogs/general-genero', data);
  },

  edit(id) {
    return axiosInstance.get(`administration/catalogs/general-genero/${id}/edit`);
  },

  update(id, data) {
    return axiosInstance.put(`administration/catalogs/general-genero/${id}`, data);
  },

  remove(id) {
    return axiosInstance.delete(`administration/catalogs/general-genero/${id}`);
  },
}
