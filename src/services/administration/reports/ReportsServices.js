import { axiosInstance } from 'src/boot/axios';

export default {
  index(data) {
    return axiosInstance.get('administration/reports', data);
  },

  downloadExcel(params) {
    return axiosInstance.get('administration/reports', {
      params,
      responseType: 'blob',
    });
  },

  downloadPDF(params) {
    return axiosInstance.get('administration/reports', {
      params,
      responseType: 'blob',
      headers: {
        'Accept-C': 'false'
      }
    });
  } 
}
