import { Notify, useQuasar } from 'quasar'

Notify.setDefaults({
  position: 'top-right',
  html: true,
  timeout: 3000,
  actions: [{ icon: 'close', color: 'white' }]
})

const useNotify = () => {
  const $q = useQuasar()
  const showError = (title, message) => {
    $q.notify({
      type: 'negative',
      message: title,
      caption: message
    });
  }
  const showSuccess = (title, message) => {
    $q.notify({
      type: 'positive',
      message: title,
      caption: message
    });
  }
  const showInfo = (title, message) => {
    $q.notify({
      type: 'info',
      message: title,
      caption: message
    });
  }
  const showWarning = (title, message) => {
    $q.notify({
      type: 'warning',
      message: title,
      caption: message
    });
  }

  return {
    showSuccess,
    showInfo,
    showWarning,
    showError
  }
}

export default useNotify
