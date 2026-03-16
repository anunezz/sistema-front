import { axiosInstance } from 'src/boot/axios';

export default {
  index (data) {
    return axiosInstance.post('/plantillas', data);
  },
  
  store (data) {
    return axiosInstance.post('/plantillas/create', data);
  },
  getPlantillaById(id) {
    return axiosInstance.post('/plantillas/getPlantillaById', { id });
  },
  //   store (data) {
    //     return axiosInstance.post('/administration/users', data);
    //   },
    
    //   edit (id) {
      //     return axiosInstance.get(`/administration/users/${id}/edit`);
      //   },
      
      update(id, data) {
        return axiosInstance.post(`/plantillas/update/${id}`, data);
      },
      delete(data) {
        return axiosInstance.post(`/plantillas/delete`, data);
      },
      
      get_cat_subcausal (data) {
        return axiosInstance.post('/plantillas/get_cat_subcausal', data);
      },
//   remove (id) {
//     return axiosInstance.delete(`/administration/users/${id}`);
//   },

  /*directory (data) {
    return axiosInstance.post('/administration/user/sre', data);
  },*/
}
