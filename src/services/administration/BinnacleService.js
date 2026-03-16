import { axiosInstance } from 'src/boot/axios';

export default {
  index (data) {
    return axiosInstance.post('/transaction', data);
  },

  store (data) {
    return axiosInstance.post('/transaction/create', data);
  },

  get_cats_binnacle (data) {
    return axiosInstance.post('/get_cats_binnacle',data);

  },

    export_data (data) {
    return axiosInstance.post('/get_export',data,
      {
          responseType: 'blob', 
      }
    );

  },

//   store (data) {
//     return axiosInstance.post('/administration/users', data);
//   },

//   edit (id) {
//     return axiosInstance.get(`/administration/users/${id}/edit`);
//   },

//   update (id, data) {
//     return axiosInstance.put(`/administration/users/${id}`, data);
//   },

//   remove (id) {
//     return axiosInstance.delete(`/administration/users/${id}`);
//   },

  /*directory (data) {
    return axiosInstance.post('/administration/user/sre', data);
  },*/
}
