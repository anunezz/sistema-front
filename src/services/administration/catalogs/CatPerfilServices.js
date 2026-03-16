import { axiosInstance } from 'src/boot/axios';

export default {
  index(data) {
    return axiosInstance.get('administration/catalogs/perfil', data);
  },

  create() {
    return axiosInstance.get('administration/catalogs/perfil/create');
  },

  store(data) {
    return axiosInstance.post('administration/catalogs/perfil', data);
  },

  edit(id) {
    return axiosInstance.get(`administration/catalogs/perfil/${id}/edit`);
  },

  update(id, data) {
    return axiosInstance.put(`administration/catalogs/perfil/${id}`, data);
  },

  remove(id) {
    return axiosInstance.delete(`administration/catalogs/perfil/${id}`);
  },
}
