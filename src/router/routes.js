import forgotPasswordRoute from './public/ForgotPassword.js'
import resetPasswordRoute from './public/ResetPassword.js'
import Discharge_of_impediments from 'src/router/discharge_of_impediments'

import servicios from 'src/router/administration/Servicios'
import agenda from 'src/router/administration/Agenda'

import users from 'src/router/administration/Users'
import binnacle from 'src/router/administration/Binnacle'
import application_binnacle from 'src/router/administration/ApplicationBinnacle'
import impediment_binnacle from 'src/router/administration/ImpedimentBinnacle'
import catalogs from 'src/router/administration/Catalogs'
import reports from 'src/router/administration/Reports'
import reportStatistics from 'src/router/administration/ReportStatistics'
import { isAuthenticatedGuard } from 'src/router/auth-guard'

const routes = [
	{ ...forgotPasswordRoute },
	{ ...resetPasswordRoute },
	{
		path: '/the_planet',
		name: 'the_planet_init',
		component: () => import('pages/index_page_the_planet.vue'),
		beforeEnter: (to, from, next) => {
			if (sessionStorage.getItem('sistema_token')) {
				next({ name: 'AdministrationMenu' })
			} else {
				next()
			}
		},
	},
	{
		// "Ver más productos" (ProductsSection.vue) — vista pública dedicada
		// con buscador y agrupación por Servicio, ver .claude/skills/servicios/.
		path: '/the_planet/productos',
		name: 'the_planet_products',
		component: () => import('pages/products_page_the_planet.vue'),
	},
	{
		path: '/ingresar',
		name: 'login',
		component: () => import('pages/LoginView.vue'),
		beforeEnter: (to, from, next) => {
			if (sessionStorage.getItem('sistema_token')) {
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

			{ ...servicios },
			{ ...agenda },
			{ ...users },
			{ ...catalogs },
			{ ...reports },
			{ ...binnacle },
			{ ...application_binnacle },
			{ ...impediment_binnacle },
			{ ...reportStatistics },
			{ ...Discharge_of_impediments },
		],
	},
	{
		path: '/administracion/',
		redirect: { name: 'AdministrationMenu' },
	},
	{
		path: '/',
		redirect: { name: 'AdministrationMenu' },
	},
	{
		path: '/:catchAll(.*)*',
		component: () => import('pages/ErrorNotFound.vue'),
	},
]

export default routes
