//import forgotPasswordRoute from './public/ForgotPassword.js'
import resetPasswordRoute from './public/ResetPassword.js'
import Discharge_of_impediments from "src/router/discharge_of_impediments";

import users from 'src/router/administration/Users'
import binnacle from 'src/router/administration/Binnacle'
import application_binnacle from 'src/router/administration/ApplicationBinnacle'
import impediment_binnacle from 'src/router/administration/ImpedimentBinnacle'
import catalogs from 'src/router/administration/Catalogs'
import reports from 'src/router/administration/Reports'
import reportStatistics from 'src/router/administration/ReportStatistics'
import { isAuthenticatedGuard } from 'src/router/auth-guard'

const routes = [
	//{ ...forgotPasswordRoute },
	{ ...resetPasswordRoute },
	{
		path: '/ingresar',
		name: 'login',
		component: () => import('pages/LoginView.vue'),
		beforeEnter: (to, from, next) => {
			if (sessionStorage.getItem('impedimentos_token')) {
				next({ name: 'AdministrationMenu' })
			} else {
				next()
			}
		},
	},
	{
		path: '/administracion',
		component: () => import('layouts/MainLayout.vue'),
		beforeEnter: [isAuthenticatedGuard],
		children: [
			{
				path: '',
				name: 'AdministrationMenu',
				component: () => import('pages/IndexPage.vue'),

			},
 			/* {
				path: '/__reload',
				name: 'ReloadTemp',
				component: { template: '<div></div>' },
			}, */
			{ ...users },
			{ ...catalogs },
			{ ...reports },
			{ ...binnacle },
			{ ...application_binnacle },
			{ ...impediment_binnacle },
			{ ...reportStatistics },
			{...Discharge_of_impediments},
		],
	},
	{
		path: '/administracion/',
		redirect:{name:'AdministrationMenu'}
	},
	{
		path: '/',
		redirect:{name:'AdministrationMenu'}
	},

	// Always leave this as last one,
	// but you can also remove it
	{
		path: '/:catchAll(.*)*',
		component: () => import('pages/ErrorNotFound.vue'),
	},
]

export default routes
