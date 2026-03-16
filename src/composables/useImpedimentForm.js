import {ref,watch,onMounted} from "vue";
import moment from 'moment';
import {useImpedimentStore} from "stores/impediments";
import {useQuasar} from "quasar";
import DischargeImpedimentsServices from 'src/services/discharge_of_impediments';
import {useRouter} from 'vue-router';
import {useAuthUserStore} from "stores/AuthUser";
import useNotify from "src/composables/useNotify";
import _ from 'lodash';

export default function useImpedimentForm() {
  const storeImpediment = useImpedimentStore()
  const $q = useQuasar();
  const router = useRouter();
  const store = useAuthUserStore();
  const {showError} = useNotify()

  const myForm = ref(null);
  const state_date = ref(null) ;
  const state_fecha_nacimiento = ref(null);
  const id_estatus_solicitud = ref(null)
  const observaciones = ref(null)
  const aux_update = ref(false);

  const form = ref({
    id_solicitud: null,
    id_impedimento: null,
    id_tipo_solicitud: null,
    id_estatus_solicitud: null,
	id_estatus_verificacion: null,
	numero_documento: null,
    id_prioridad: 3,
    dependencia: false,
	nombre_dependencia: null,
    urgencia: false,
    fecha_registro: moment().format('DD-MM-YYYY'),
    id_oficina: null,
    correo_electronico:null,
    nombres:null,
    primer_apellido:null,
    segundo_apellido:null,
    persona_correo_electronico:null,
    fecha_nacimiento: null,
    entidad_federativa_nacimiento:null,
    //curp: 'NUAA900125HDFXLD07',
    curp: null,
	id_genero: null,
    cuerpo_correo: null,
    padre_nombres: null,
    padre_primer_apellido: null,
    padre_segundo_apellido: null,

    madre_nombres: null,
    madre_primer_apellido: null,
    madre_segundo_apellido: null,

    motivacion_acto_juridico: '',
    id_causal_impedimento: null,
	causal_otro_descripcion: null,
    id_subcausal_impedimento: null,

    selection_anexo:[],
	delete_id_anexo:[],
    numero_pasaporte_cancelado:null,
    otro_documento_soporte:null,

	curp_identidad:null,
    nombres_identidad:null,
    primer_apellido_identidad:null,
	segundo_apellido_identidad:null,
	plantilla: '',
	numero_impedimento: null,
	verificacion_impedimentos: []
  });

  //NUAA900125HDFXLD07
  //BACL991018HTSRPS07
  //MEPG990514MQTJRR00

  const options = ref({
    office:[],
    impediments:[],
    cat_causal_impedimento:[],
    cat_subcausal_impedimento:[],
    cat_anexos: [],
    cat_tipo_solicitud:[],
    cat_prioridades:[],
    cat_estatus_verificacion: []
  });

  const myLocale = ref({
      days: 'Domingo_Lunes_Martes_Miércoles_Jueves_Viernes_Sábado'.split('_'),
      daysShort: 'Dom_Lun_Mar_Mié_Jue_Vie_Sáb'.split('_'),
      months: 'Enero_Febrero_Marzo_Abril_Mayo_Junio_Julio_Agosto_Septiembre_Octubre_Noviembre_Diciembre'.split('_'),
      monthsShort: 'Ene_Feb_Mar_Abr_May_Jun_Jul_Ago_Sep_Oct_Nov_Dic'.split('_'),
      firstDayOfWeek: 1,
      format24h: true,
      pluralDay: 'dias'
  });

  const allOffices=ref([]);
  const plantillaError = ref(false)

  watch(allOffices, (val) => {
  if (val?.length > 0) {
    optionOffices.value = val;
    const exists = val.some(o => o.id_oficina === form.value.id_oficina);
    if (!exists) {
      form.value.id_oficina = null;
    }
  }
});

function truncateText(text, maxLength = 50) {
  if (!text) return ''
  return text.length > maxLength ? text.slice(0, maxLength) + '...' : text
}


  const get_cats = () => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        $q.loading.show();
        DischargeImpedimentsServices.get_cats({
          id_tipo_solicitud: form.value.id_tipo_solicitud
        }).then(response => {
          $q.loading.hide();
          if (response.data.success) {
            options.value.office = response.data.Results.cat_oficinas;
            options.value.cat_anexos = response.data.Results.cat_anexos;
            options.value.cat_causal_impedimento = response.data.Results.causal_impedimento;
            options.value.cat_tipo_solicitud = response.data.Results.cat_tipo_solicitud;
            options.value.cat_prioridades = response.data.Results.cat_prioridades;
            options.value.cat_estatus_verificacion = response.data.Results.cat_estatus_verificacion;

			allOffices.value=response.data.Results.cat_oficinas;

			resolve(); // ✅ Se completa la promesa aquí
          } else {
            reject(new Error("Error en la respuesta de get_cats"));
          }
        }).catch(e => {
          $q.loading.hide();
          console.error("error: ", e);
          reject(e); // ❌ En caso de error
        });
      }, 500);
    });
  };

  const getImpediment = async () => {
    $q.loading.show();
    try {
      const response = await DischargeImpedimentsServices.get_impediment({
        hash_id: router.currentRoute.value.params.hash_id
      });

      if (response.data.success) {

		if( Object.prototype.hasOwnProperty.call(response.data.Results, 'aux_update') ){
			aux_update.value = response.data.Results.aux_update;
		}

        id_estatus_solicitud.value = response.data.Results.id_estatus_solicitud;
        form.value.id_estatus_solicitud = response.data.Results.id_estatus_solicitud;
        observaciones.value = response.data.Results.observaciones;
        state_date.value = moment(response.data.Results.fecha_registro).format('DD-MM-YYYY');
        form.value.id_estatus_verificacion = response.data.Results.id_estatus_verificacion;
        form.value.numero_documento = response.data.Results.numero_documento;
        form.value.id_prioridad = response.data.Results.id_prioridad;
        form.value.dependencia = response.data.Results.dependencia;
		form.value.nombre_dependencia = response.data.Results.nombre_dependencia;
        form.value.urgencia = response.data.Results.urgencia;
        form.value.id_tipo_solicitud = response.data.Results.id_tipo_solicitud;
        form.value.id_solicitud = response.data.Results.id_solicitud;
        form.value.id_genero = response.data.Results.id_genero;
        form.value.verificacion_impedimentos = response.data.Results.verificacion_impedimentos;

        form.value.nombres = response.data.Results.nombres;
        form.value.primer_apellido = response.data.Results.primer_apellido;
        form.value.segundo_apellido = response.data.Results.segundo_apellido;
        form.value.persona_correo_electronico = response.data.Results.persona_correo_electronico;
        form.value.entidad_federativa_nacimiento = response.data.Results.entidad_federativa_nacimiento;
		form.value.curp = ( response.data.Results.curp ? response.data.Results.curp?.replace(/\s+/g, '') : null  );
        state_fecha_nacimiento.value = moment(response.data.Results.fecha_nacimiento).format('DD-MM-YYYY');
        form.value.padre_nombres = response.data.Results.nombres_padre;
        form.value.padre_primer_apellido = response.data.Results.primer_apellido_padre;
        form.value.padre_segundo_apellido = response.data.Results.segundo_apellido_padre;

        form.value.madre_nombres = response.data.Results.nombres_madre;
        form.value.madre_primer_apellido = response.data.Results.primer_apellido_madre;
        form.value.madre_segundo_apellido = response.data.Results.segundo_apellido_madre;
        await get_cats();
		form.value.id_oficina = response.data.Results.id_oficina;
		onOficinaSelected(response.data.Results.id_oficina);
        form.value.id_causal_impedimento = response.data.Results.id_causal_impedimento;
		form.value.causal_otro_descripcion =response.data.Results.causal_otro_descripcion;
		await setCausalAndSubcausal();
		form.value.id_subcausal_impedimento = response.data.Results.id_subcausal_impedimento;

        form.value.motivacion_acto_juridico = response.data.Results.motivacion_acto_juridico;
        form.value.numero_pasaporte_cancelado = response.data.Results.numero_pasaporte_cancelado;

		form.value.curp_identidad = response.data.Results.curp_identidad;
        form.value.nombres_identidad = response.data.Results.nombres_identidad;
        form.value.primer_apellido_identidad = response.data.Results.primer_apellido_identidad;
        form.value.segundo_apellido_identidad = response.data.Results.segundo_apellido_identidad;

        form.value.selection_anexo = response.data.Results.documents.map( item => {
            const index = options.value.cat_anexos.findIndex(obj => obj.id_cat_anexos === item.id_cat_anexos);
            let cat = {};
            if (index !== -1) {
              cat = options.value.cat_anexos[index];
              if( item.id_cat_anexos === 3 ){
                form.value.numero_pasaporte_cancelado = item.observaciones;
              }
              if( item.id_cat_anexos === 11 ){
                form.value.numero_pasaporte = item.observaciones;
              }
              if( item.id_cat_anexos === 4 ){
                form.value.otro_documento_soporte = item.observaciones;
              }
            }
            return { ...item, ...cat};
        });


		form.value.correo_electronico = response.data.Results.correo_electronico;
		form.value.cuerpo_correo = response.data.Results.cuerpo_correo;

		if( Object.prototype.hasOwnProperty.call(response.data.Results, 'impedimento') ){
			if( response.data.Results.impedimento ){
				form.value.numero_impedimento = response.data.Results.impedimento.id_impedimento;
			}
		}

      }
    } catch (error) {
      console.error("Error al obtener impedimento:", error);
    } finally {
      $q.loading.hide();
    }
  };

  const fileData = (data) => {
    if( Object.prototype.hasOwnProperty.call(data, 'path') ){
      //data.path = process.env.API_URL+data.path;
      const index = form.value.selection_anexo.findIndex(obj => obj.id_cat_anexos === data.id_cat_anexos);
      if (index !== -1) {
		switch ( form.value.selection_anexo[index].id_cat_anexos ) {
			case 3:
				form.value.selection_anexo[index].observaciones = form.value.numero_pasaporte_cancelado;
			break;
			case 4:
				form.value.selection_anexo[index].observaciones = form.value.otro_documento_soporte;
			break;
			case 11:
				form.value.selection_anexo[index].observaciones = form.value.numero_pasaporte;
			break;
		}
        form.value.selection_anexo[index].identificador_documento = data.fileName;
        form.value.selection_anexo[index].url_documento = data.path;
        form.value.selection_anexo[index].aux = true;
      }
    }
  };

  const getDataFileAnexos = (item,name) => {
	//console.log("getDataFileAnexos: ",item);
    let val = null;
    const index = form.value.selection_anexo.findIndex(obj => obj.id_cat_anexos === item.id_cat_anexos);
    if (index !== -1) {
      val = ( name == "url_documento" ? process.env.API_URL+form.value.selection_anexo[index][name] : form.value.selection_anexo[index][name]);
    }
    return val;
  };

  const onCurpTyping = () => {
    if( form.value.curp && /^[A-Z]{4}\d{6}[HM][A-Z]{2}[A-Z]{3}[A-Z\d]\d$/.test(form.value.curp.toUpperCase()) ){
      $q.loading.show();
      DischargeImpedimentsServices.search_curp_user({
        hash_id : storeImpediment.hash_id,
        curp: form.value.curp
      }).then(response => {
        $q.loading.hide();
        if( response.data.status ){
          $q.notify({
            color: 'green-4',
            textColor: 'white',
            icon: 'cloud_done',
            message: 'Éxito, La curp fue encontrada correctamente.'
          });
          form.value.nombres = response.data.nombres;
          form.value.primer_apellido = response.data.apellido_paterno;
          form.value.segundo_apellido = response.data.apellido_materno;
          state_fecha_nacimiento.value = moment(response.data.fecha_nacimiento, 'DD/MM/YYYY').format('DD-MM-YYYY');
          form.value.fecha_nacimiento = moment(response.data.fecha_nacimiento, 'DD/MM/YYYY').format('DD-MM-YYYY');
          form.value.id_genero = response.data.id_genero;
          form.value.entidad_federativa_nacimiento = response.data.entidad;
        }else{
          form.value.id_genero = null;
        }
      }).catch(e => {
        $q.loading.hide();
        console.error("error: ",e);
      })
    }
  };

  const onChangeCausal = ( ) => {
    setTimeout(() => {
      form.value.id_subcausal_impedimento = null;
    }, 500);
  };


  const newValue = (val,done) => {
      done(val);
  };

  	const setCausalAndSubcausal = () => {
		const causal = options.value.cat_causal_impedimento.find(item =>
			item.id_causal_impedimento === form.value.id_causal_impedimento
		);
		if (causal) {
			options.value.cat_subcausal_impedimento = causal.cat_subcausal_impedimento;
		} else {
			options.value.cat_subcausal_impedimento = [];
		}
	};


	const isSelected = ( item ) => {
		return form.value.selection_anexo.some(obj => obj.id_cat_anexos === item.id_cat_anexos);
	};

	const toggleItem = (item, checked) => {
		if (checked) {
			form.value.selection_anexo.push(item);
		} else {
			let eliminar_anexo = form.value.selection_anexo.find(itm => itm.id_cat_anexos === item.id_cat_anexos);

			if( eliminar_anexo && Object.prototype.hasOwnProperty.call(eliminar_anexo, 'id_solicitud_documento') ){
				form.value.delete_id_anexo.push( eliminar_anexo.id_solicitud_documento );
			}

			form.value.selection_anexo = form.value.selection_anexo.filter(
				obj => obj.id_cat_anexos !== item.id_cat_anexos
			);
		}
	}

  	const optionOffices = ref([]);

	const filterOffices = (val, update)=> {
			if (val === '') {

			update(() => {
				optionOffices.value = allOffices.value;
			});

			return;
		}

		update(() => {
			const needle = val.toLowerCase();
			optionOffices.value = allOffices.value.filter(
				office => office.cad_oficina.toLowerCase().indexOf(needle) > -1//.includes(needle)
			);
		});
	}

	const onOficinaSelected = (newVal) => {
		if( newVal ){
			let office = options.value.office.find(item => item.id_oficina === newVal);
			if( office?.correo_electronico !== null ){
				form.value.correo_electronico = office?.correo_electronico.toUpperCase();
			}else{
				form.value.correo_electronico = null;
			}
		}
	};

  const formatDMY = (iso) => {
     if (!iso) return ''
  const [y, m, d] = iso.split('-') // "2025-08-18" -> ["2025","08","18"]
  return `${d}-${m}-${y}`          // "18-08-2025"
  }

  const validateFiles = ( success ) => {
    if (!success) {
      showError('Error', 'Verifique los campos del formulario.');
      return true;
    }

    if (form.value.selection_anexo.length === 0) {
      showError('Error', 'Debes subir al menos un archivo de anexos.');
      return true;
    }

	let file_item_foto = form.value.selection_anexo.find(item => item.id_cat_anexos === 12);
	if( file_item_foto == undefined || file_item_foto == null || file_item_foto == "" ){
		showError('Error', 'Debes de subir una foto para continuar.');
		return true;
	}else{
		if( file_item_foto && Object.prototype.hasOwnProperty.call(file_item_foto, 'url_documento') ){
			if( file_item_foto.url_documento == null || file_item_foto.url_documento == ''  ){
				showError('Error', 'Debes de subir una foto para continuar.');
				return true;
			}
		}else{
			showError('Error', 'Debes de subir una foto para continuar.');
			return true;
		}
	}

	if(
		router.currentRoute.value.params.hash_id != undefined && router.currentRoute.value.params.hash_id
	){
		let file_item = form.value.selection_anexo.find(item => item.id_cat_anexos === 13);
		if( file_item && Object.prototype.hasOwnProperty.call(file_item, 'url_documento') ){
			if( file_item.url_documento == null || file_item.url_documento == ''  ){
				showError('Error', 'Debes de subir un archivo de formato de solicitud para continuar.');
      			return true;
			}
		}else{
			showError('Error', 'Debes de subir un archivo de formato de solicitud para continuar.');
      		return true;
		}
	}

    let aux = false;
    if (form.value.selection_anexo.length > 0) {
      form.value.selection_anexo.forEach(element => {
        if (
          Object.prototype.hasOwnProperty.call(element, 'identificador_documento') == false ||
          Object.prototype.hasOwnProperty.call(element, 'url_documento') == false ||
          element.identificador_documento == null ||
          element.url_documento == null
        ) {
          showError('Error', `Debes subir un archivo en ${element.nombre}.`);
          aux = true;
        }
      });
    }

	return aux;
  };

  watch(
    () => form.value.id_tipo_solicitud, (newVal) => {
		switch (newVal) {
			case 2:
				form.value.id_subcausal_impedimento = null;
			break;
			case 3:
				form.value.id_causal_impedimento = null;
				form.value.id_subcausal_impedimento = null;
				form.value.causal_otro_descripcion = null;
			break;
			default:
				form.value.causal_otro_descripcion = null;
			break;
		}
    }
  )

  watch(
    () => form.value.id_causal_impedimento, (newVal) => {
      if(newVal){
        let options_ = options.value.cat_causal_impedimento.find(item => {
          return item.id_causal_impedimento == newVal;
        });
        options.value.cat_subcausal_impedimento = ( options_ == undefined ? [] : options_.cat_subcausal_impedimento );
      }else{
        options.value.cat_subcausal_impedimento = [];
      }
    }
  )

  watch(
    () => form.value.id_causal_impedimento, (newVal) => {
      if(newVal){
        let options_ = options.value.cat_causal_impedimento.find(item => {
          return item.id_causal_impedimento == newVal;
        });
        options.value.cat_subcausal_impedimento = ( options_ == undefined ? [] : _.orderBy(options_.cat_subcausal_impedimento, ['subcausal_impedimento'], ['asc']) );

		if( newVal != 19 ){
			form.value.causal_otro_descripcion = null;
		}

      }else{
        options.value.cat_subcausal_impedimento = [];
		form.value.causal_otro_descripcion = null;
      }
    }
  )

  watch(
    () => form.value.id_tipo_solicitud, (newVal) => {
      if( newVal == 4 ){
		form.value.curp_identidad = null;
		form.value.nombres_identidad = null;
		form.value.primer_apellido_identidad = null;
		form.value.segundo_apellido_identidad = null;
		form.value.motivacion_acto_juridico = null;
		form.value.id_causal_impedimento = 9;
      }else{
		form.value.id_causal_impedimento = null;
		form.value.id_subcausal_impedimento = null;
		form.value.causal_otro_descripcion = null;
	  }
    }
  )

  watch(state_date, async (newVal) => {
    if( newVal ){
      form.value.fecha_registro = newVal;
    }else{
      form.value.fecha_registro = moment().format('DD-MM-YYYY');
    }
  })

  watch(state_fecha_nacimiento, async (newVal) => {
    if( newVal ){
      form.value.fecha_nacimiento = newVal;
    }else{
      form.value.fecha_nacimiento = null;
    }
  })
  watch(
    () => form.value.selection_anexo, (newVal) => {
      if( newVal.includes(3) == false ){
        form.value.numero = null;
      }
    }
  )
  watch(
    () => form.value.id_oficina, (newVal) => {
		if( newVal ){
			let office = options.value.office.find(item => item.id_oficina === newVal);
			if( office?.correo_electronico !== null ){
				form.value.correo_electronico = office?.correo_electronico.toUpperCase();
			}else{
				form.value.correo_electronico = null;
			}
		}
    }
  )
  watch(
    () => form.value.dependencia, (newVal) => {
		if( !newVal ){
			form.value.nombre_dependencia = null;
		}
    }
  )

  onMounted(() => {
	if( router.currentRoute.value.params.hash_id == undefined ){
		get_cats();
		if( store.user.perfil.id_perfil == 1 || store.user.perfil.id_perfil == 2 ){
			form.value.id_oficina = store.user.oficina.id_oficina;
			setTimeout(() => {
				onOficinaSelected(store.user.oficina.id_oficina);
			}, 2000);
		}
	}else{
		getImpediment();
	}
  })

  return {
	aux_update,
    state_date,
    state_fecha_nacimiento,
    form,
    options,
    myLocale,
    id_estatus_solicitud,
    observaciones,
    myForm,
	plantillaError,
	optionOffices,
    truncateText,
    getDataFileAnexos,
    get_cats,
    getImpediment,
    onCurpTyping,
    newValue,
    onChangeCausal,
    fileData,
    isSelected,
    toggleItem,
	filterOffices,
	onOficinaSelected,
  	formatDMY,
	validateFiles
  }
}
