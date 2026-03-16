import { axiosInstance } from 'src/boot/axios';

export default {
  index (data) {
    return axiosInstance.get('/administration/users', data);
  },
  search(data){
    return axiosInstance.post('/administration/users/search',data);
  },
  create () {
    return axiosInstance.get('/administration/users/create');
  },

  store (data) {
    return axiosInstance.post('/administration/users', data);
  },
  show(id){
    return axiosInstance.get(`/administration/users/${id}`);
  },
  edit (id) {
    return axiosInstance.get(`/administration/users/${id}/edit`);
  },
  update (id, data) {
    return axiosInstance.put(`/administration/users/${id}`, data);
  },
  changeStatus (id) {
    return axiosInstance.get(`/administration/users/change-status/${id}`);
  },
  cat_users () {
    return axiosInstance.post(`/cat-users`);
  },

  /*directory (data) {
    return axiosInstance.post('/administration/user/sre', data);
  },*/
}
