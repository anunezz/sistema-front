import {boot} from 'quasar/wrappers'

export default boot(async ({app}) => {
    app.mixin({
        methods: {
            isRequired(val) {
                if (typeof val === 'object' && val !== null) {
                    if (val.length === 0) return 'Este es un campo requerido';
                    else return val
                } else {
                    return !!val || 'Este es un campo requerido';
                }
            },

            isValidEmail(val) {
                const emailPattern = /^(?=[a-zA-Z0-9@._%+-]{6,254}$)[a-zA-Z0-9._%+-]{1,64}@(?:[a-zA-Z0-9-]{1,63}\.){1,8}[a-zA-Z]{2,63}$/;
                return emailPattern.test(val) || 'Correo no válido';
            },

            isValidUsername(val) {
                const usernamePattern = /^[a-z0-9_-]{3,15}$/;
                return usernamePattern.test(val) || 'Usuario no válido';
            },

            onlyNumbers(val) {
                const usernamePattern = /^[0-9]*$/;
                return usernamePattern.test(val) || 'Solo se permiten números';
            },

            needNumber(val) {
                const pattern = /.*[0-9].*/;
                return pattern.test(val) || 'Indique al menos un número'
            },

            needLower(val) {
                const pattern = /.*[a-z]/;
                return pattern.test(val) || 'Indique al menos una minúscula'
            },

            needUpper(val) {
                const pattern = /.*[A-Z]/;
                return pattern.test(val) || 'Indique al menos una mayúscula'
            },

            needSpecialChar(val) {
                const pattern = /.*[¡!@#$%^&*(),.¿?:{}|<>]/;
                return pattern.test(val) || 'Indique al menos una caracter especial'
            },

            need8Length(val) {
                if (val) {
                    return val.length >= 8 || 'Escriba al menos 8 caracteres';
                }
            },

            validUrl(val) {
                if (val) {
                    let regex = /^https?:\/\/[\w-]+(\.[\w-]+)+[#?]?.*/ig;
                    return regex.test(val) || 'Enlace incorrecto.https://www.ejemplo.com'
                }
            },

          isValidCurp(val) {
            const pattern = /^([A-Z][AEIOUX][A-Z]{2}\d{2}(?:0\d|1[0-2])(?:[0-2]\d|3[01])[HM](?:AS|B[CS]|C[CLMSH]|D[FG]|G[TR]|HG|JC|M[CNS]|N[ETL]|OC|PL|Q[TR]|S[PLR]|T[CSL]|VZ|YN|ZS)[B-DF-HJ-NP-TV-Z]{3}[A-Z\d])(\d)$/;
            return val ? (pattern.test(val) || 'CURP no valida') : true;
          },
          isValidCurpNotRequired(val) {
            const pattern = /^([A-Z][AEIOUX][A-Z]{2}\d{2}(?:0\d|1[0-2])(?:[0-2]\d|3[01])[HM](?:AS|B[CS]|C[CLMSH]|D[FG]|G[TR]|HG|JC|M[CNS]|N[ETL]|OC|PL|Q[TR]|S[PLR]|T[CSL]|VZ|YN|ZS)[B-DF-HJ-NP-TV-Z]{3}[A-Z\d])(\d)$/;
            return !val || pattern.test(val) || 'CURP no válida';
          },
          isValidRfc(val) {
            const pattern = /^([A-ZÑ\\x26]{3,4}([0-9]{2})(0[1-9]|1[0-2])(0[1-9]|1[0-9]|2[0-9]|3[0-1])([A-Z]|[0-9]){2}([A]|[0-9]){1})?$/;
            return val ? (pattern.test(val) || 'RFC no valido') : true;
          }


        }
    });
})

