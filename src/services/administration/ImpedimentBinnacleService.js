import { axiosInstance } from 'src/boot/axios';

export default {
  index (data) {
    return axiosInstance.post('/impediment_transaction', data);
  },

//   store (data) {
//     return axiosInstance.post('/application_transaction/create', data);
//   },

  get_cats_binnacle (data) {
    return axiosInstance.post('/get_cats_impediment_binnacle',data);

  },

//     export_data (data) {
//     return axiosInstance.post('/get_export',data,
//       {
//           responseType: 'blob', 
//       }
//     );

//   },
}
