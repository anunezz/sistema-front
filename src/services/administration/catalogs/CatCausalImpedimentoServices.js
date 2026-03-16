import { axiosInstance } from 'src/boot/axios';

export default {
  index(data) {
    return axiosInstance.get('administration/catalogs/causal-impedimentos', data);
  },

  create() {
    return axiosInstance.get('administration/catalogs/causal-impedimentos/create');
  },

  store(data) {
    return axiosInstance.post('administration/catalogs/causal-impedimentos', data);
  },

  edit(id) {
    return axiosInstance.get(`administration/catalogs/causal-impedimentos/${id}/edit`);
  },

  update(id, data) {
    return axiosInstance.put(`administration/catalogs/causal-impedimentos/${id}`, data);
  },

  remove(id) {
    return axiosInstance.delete(`administration/catalogs/causal-impedimentos/${id}`);
  },
}
