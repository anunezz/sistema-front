import { axiosInstance } from 'src/boot/axios';

export default {
  index(data) {
    return axiosInstance.get('administration/report-statistical', data);
  },

  downloadExcel(params) {
    return axiosInstance.get('administration/report-statistical', {
      params,
      responseType: 'blob',
    });
  },

  downloadPDF(params) {
    return axiosInstance.get('administration/report-statistical', {
      params,
      responseType: 'blob',
      headers: {
				'Accept-C': 'false',
			}
    });
  }
}
