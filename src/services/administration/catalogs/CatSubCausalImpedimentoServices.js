import { axiosInstance } from 'src/boot/axios';

export default {
  index(data) {
    return axiosInstance.get('administration/catalogs/subcausal-impedimentos', data);
  },

  create() {
    return axiosInstance.get('administration/catalogs/subcausal-impedimentos/create');
  },

  store(data) {
    return axiosInstance.post('administration/catalogs/subcausal-impedimentos', data);
  },

  edit(id) {
    return axiosInstance.get(`administration/catalogs/subcausal-impedimentos/${id}/edit`);
  },

  update(id, data) {
    return axiosInstance.put(`administration/catalogs/subcausal-impedimentos/${id}`, data);
  },

  remove(id) {
    return axiosInstance.delete(`administration/catalogs/subcausal-impedimentos/${id}`);
  },
}
