import BinnacleService from "src/services/administration/BinnacleService"
import useNotify from "src/composables/useNotify";

const {showError} = useNotify()

/**
 * Registra una transacción en la bitácora.
 * 
 * @example
 * BinnacleTransaction(1, 2, 'create')
*/
export const BinnacleTransaction = async (moduleId, typeTransactionId, action) => {
  try {
    await BinnacleService.store({ moduleId, typeTransactionId, action });
  } catch (e) {
    console.log('error', e);
    showError('Error', 'No se puede completar la acción');
  }
};