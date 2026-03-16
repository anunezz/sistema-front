import {store} from 'quasar/wrappers'
import {createPinia} from 'pinia'

import {createPersistedStatePlugin} from 'pinia-plugin-persistedstate-2';
import localForage from 'localforage';
import CryptoJS from 'crypto-js';

const  ENCRYPT_KEY  = process.env.ENCRYPT_KEY;

localForage.config({
  driver: localForage.INDEXEDDB,
  name: 'IMPEDIMENTOS',
  version: 1.0,
});


export default store((/* { ssrContext } */) => {
  const pinia = createPinia();

  pinia.use(
    createPersistedStatePlugin({
      storage: {
        getItem: async (key) => {
          const encryptedValue = await localForage.getItem(key);
          if (!encryptedValue) return null;

          const bytes = CryptoJS.AES.decrypt(encryptedValue, ENCRYPT_KEY);
          return bytes.toString(CryptoJS.enc.Utf8);
        },
        setItem: async (key, value) => {
          const encryptedValue = CryptoJS.AES.encrypt(value, ENCRYPT_KEY).toString();
          return localForage.setItem(key, encryptedValue);
        },
        removeItem: async (key) => {
          return localForage.removeItem(key);
        },
      },
    }),
  );

  return pinia;
});
