import { defineBoot } from '#q-app/wrappers'
import axios from 'axios'
import CryptoJS from 'crypto-js'

const hash = process.env.ENCRYPT_KEY

const axiosInstance = axios.create({
  baseURL: process.env.API_URL, // timeout: 15000,
  headers: {
    'X-Requested-With': 'XMLHttpRequest',
    Accept: 'application/json',
    pragma: 'no-cache',
    'cache-control': 'no-cache="Set-Cookie", no-store, must-revalidate',
    'no-cache': 'Set-Cookie, Set-Directive Cookie2',
    'X-Frame-Options': 'deny',
    'X-XSS-Protection': '1; mode=block',
    'Content-Security-Policy': 'default-src "self"'
  }
})


let ENCRYPT_CHANNEL = false
let newHash = generateKey()
console.log('newHash', newHash)  //poner el nuevo hash en el backend

axiosInstance.interceptors.request.use(function(config) {

  let token = sessionStorage.getItem('impedimentos_token')
  //se pone esta opción para permitir la descarga de pdfs o excel, hay que poner la cabecera responseType: 'blob'  en los Service
  ENCRYPT_CHANNEL = (process.env.ENCRYPT_CHANNEL == 'false' || ( config.headers['Accept-C'] != undefined && config.headers['Accept-C'] == 'false' )) ? false : true

  if (!ENCRYPT_CHANNEL) {
    config.headers['Accept-C'] = 'false'
  }

  if (config && config.data && ENCRYPT_CHANNEL === true) {
    let dataApp = JSON.stringify(config.data)
    dataApp = CryptoJS.AES.encrypt(dataApp, newHash).toString()
    config.data = {
      'encrypt': dataApp
    }
  }

  if (config && config.params && ENCRYPT_CHANNEL === true) {
    let paramsApp = JSON.stringify(config.params)

    paramsApp = CryptoJS.AES.encrypt(paramsApp, newHash).toString()
    config.params = {
      'encryptParams': paramsApp
    }
  }

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  } else {
    config.headers.Authorization = ''
    window.sessionStorage.removeItem('impedimentos_token')
  }
  return config
}, function(error) {
  return Promise.reject(error)
})

axiosInstance.interceptors.response.use(function(response) {

  if (response && response.data && ENCRYPT_CHANNEL === true) {
    if (response.config && response.config.responseType && response.config.responseType === 'blob'){
      // No se realiza desencriptación si es tipo 'blob'
    }else {
      let bytes = CryptoJS.AES.decrypt(response.data.toString(), newHash)
      response.data = JSON.parse(bytes.toString(CryptoJS.enc.Utf8))
    }
  }

  return response
}, function(error) {

  if (error.response && error.response.status === 401) {


    sessionStorage.removeItem('impedimentos_token')

    delete axiosInstance.defaults.headers.common.Authorization

    axiosInstance.defaults.headers.common = {
      Authorization: 'Bearer'
    }
    location.reload()
  }

  return Promise.reject(error)
})

function generateKey() {
  return hash.substr(-16, 16) + hash.substr(0, 16)
}

// Be careful when using SSR for cross-request state pollution
// due to creating a Singleton instance here;
// If any client changes this (global) instance, it might be a
// good idea to move this instance creation inside of the
// "export default () => {}" function below (which runs individually
// for each client)

export default defineBoot(({ app }) => {
  // for use inside Vue files (Options API) through this.$axios and this.$api

  app.config.globalProperties.$axios = axios
  // ^ ^ ^ this will allow you to use this.$axios (for Vue Options API form)
  //       so you won't necessarily have to import axios in each vue file

  app.config.globalProperties.$api = axiosInstance
  // ^ ^ ^ this will allow you to use this.$api (for Vue Options API form)
  //       so you can easily perform requests against your app's API
})

export { axiosInstance }
