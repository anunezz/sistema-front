import { axiosInstance } from 'src/boot/axios';

export default {
  index(data) {
    return axiosInstance.get('administration/catalogs/tipo-solicitud', data);
  },

}
