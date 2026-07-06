// src/router/public/ResetPassword.js
export default {
  path: '/actualizar_credenciales/:hash?',
  component: () => import('layouts/PublicLayout.vue'),
  children: [
    {
      path: '',
      name: 'ResetPassword',
      component: () => import('pages/ResetPassword.vue'),
      meta: { requiresAuth: false }
    }
  ]
}
