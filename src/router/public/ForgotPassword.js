// src/router/public/ForgotPassword.js
export default {
  path: '/recuperar_contraseña',
  component: () => import('layouts/PublicLayout.vue'),
  children: [
    {
      path: '',
      name: 'ForgotPassword',
      component: () => import('pages/ForgotPassword.vue'),
      meta: { requiresAuth: false }
    }
  ]
}
