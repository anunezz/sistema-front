import { axiosInstance } from 'src/boot/axios';

export default {
    async login  (data) {
		return await axiosInstance.post('/login', data);
	},

	logut () {
		return axiosInstance.post('/logout');
	}
};
