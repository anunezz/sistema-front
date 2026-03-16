// src/router/public/ResetPassword.js
export default {
  path: '/reset-password',
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
