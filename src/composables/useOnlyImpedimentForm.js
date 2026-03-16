import {ref,watch} from "vue";
import moment from 'moment';
import {useQuasar} from "quasar";
import DischargeImpedimentsServices from 'src/services/discharge_of_impediments';
import {useRouter} from 'vue-router';

export default function useImpedimentForm() {
  const $q = useQuasar();
  const router = useRouter();

  const myForm = ref(null);
  const state_date = ref(null) ;
  const state_fecha_nacimiento = ref(null);
  const id_estatus_solicitud = ref(null)
  const observaciones = ref(null)
  const aux_update = ref(false);
  const documents = ref([]);
  const allOffices=ref([]);
  const optionOffices = ref([]);
  const plantillaError = ref(false)


  const form = ref({
	estatus_impedimento: null,
    id_impedimento: null,
    id_prioridad: 3,
    dependencia: false,
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
    curp: null,
    genero: null,

    padre_nombres: null,
    padre_primer_apellido: null,
    padre_segundo_apellido: null,

    madre_nombres: null,
    madre_primer_apellido: null,
    madre_segundo_apellido: null,

    motivacion_acto_juridico:'',
    id_causal_impedimento: null,
	causal_otro_descripcion: null,
    id_subcausal_impedimento: null,

    selection_anexo:[],
    numero_pasaporte_cancelado:null,
    otro_documento_soporte:null,

	curp_identidad:null,
    nombres_identidad:null,
    primer_apellido_identidad:null,
	segundo_apellido_identidad:null,
	plantilla: ''
  });

  //NUAA900125HDFXLD07

  const options = ref({
    office:[],
    impediments:[],
    cat_causal_impedimento:[],
    cat_subcausal_impedimento:[],
    cat_anexos: [],
    cat_tipo_solicitud:[],
    cat_prioridades:[]
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



  	const newValue = (val,done) => {
		done(val);
	};


  const get_cats = () => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        $q.loading.show();
        DischargeImpedimentsServices.get_cats_impediment().then(response => {
          $q.loading.hide();
          if (response.data.success) {
            options.value.office = response.data.Results.cat_oficinas;
            options.value.cat_anexos = response.data.Results.cat_anexos;
            options.value.cat_causal_impedimento = response.data.Results.causal_impedimento;
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
      const response = await DischargeImpedimentsServices.get_only_impediment({
        hash_id: router.currentRoute.value.params.hash_id
      });

      if (response.data.success) {
		await get_cats()
		switch (response.data.Results.id_estatus_impedimento) {
			case 100:
				form.value.estatus_impedimento = 'Activo';
			break;
			case 150:
				form.value.estatus_impedimento = 'Inactivo';
			break;
		}

        form.value.id_impedimento = response.data.Results.id_impedimento;
		form.value.id_oficina = null

		setTimeout(() => {
			form.value.id_oficina = response.data.Results.id_oficina
			onOficinaSelected(response.data.Results.id_oficina)
		}, 0)

        form.value.curp = response.data.Results?.people.curp?.replace(/\s+/g, '');

		form.value.nombres = response.data.Results?.people?.nombres;
        form.value.primer_apellido = response.data.Results?.people?.primer_apellido;
        form.value.segundo_apellido = response.data.Results?.people?.segundo_apellido;
		form.value.correo_electronico = response.data.Results?.people?.correo_electronico;
		state_fecha_nacimiento.value = moment(response.data.Results?.people?.fecha_nacimiento).format('DD-MM-YYYY');
		form.value.dependencia = response.data.Results.dependencia;
		form.value.nombre_dependencia = response.data.Results.nombre_dependencia;

		form.value.entidad_federativa_nacimiento = response.data.Results?.people?.entidad_federativa_nacimiento;

		form.value.padre_nombres = response.data.Results?.people?.people_fathers?.nombres_padre;
        form.value.padre_primer_apellido = response.data.Results?.people?.people_fathers?.primer_apellido_padre;
        form.value.padre_segundo_apellido = response.data.Results?.people?.people_fathers?.segundo_apellido_padre;

        form.value.madre_nombres = response.data.Results?.people?.people_fathers?.nombres_madre;
        form.value.madre_primer_apellido = response.data.Results?.people?.people_fathers?.primer_apellido_madre;
        form.value.madre_segundo_apellido = response.data.Results?.people?.people_fathers?.segundo_apellido_madre;
        form.value.id_causal_impedimento = response.data.Results.id_causal_impedimento;
		form.value.causal_otro_descripcion =response.data.Results.causal_otro_descripcion;
		await setCausalAndSubcausal();
		form.value.id_subcausal_impedimento = response.data.Results.id_subcausal_impedimento;
		form.value.plantilla = response.data.Results?.cat_subcausal_impedimento?.cat_plantilla?.plantilla || '';
		form.value.motivacion_acto_juridico = response.data.Results.motivacion_acto_juridico || '';
		documents.value = response.data.Results.documents.map( item => {
			switch (item.id_cat_anexos) {
				case 3:
					form.value.numero_pasaporte_cancelado = item.observaciones;
				break;
				case 11:
					form.value.numero_pasaporte = item.observaciones;
				break;
				case 4:
					form.value.otro_documento_soporte = item.observaciones;
				break;
			}

            return { ...item};
        });
      }
    } catch (error) {
      console.error("Error al obtener impedimento:", error);
    } finally {
      $q.loading.hide();
    }
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

	const onCurpTyping = () => {
		if( /^[A-Z]{4}\d{6}[HM][A-Z]{2}[A-Z]{3}[A-Z\d]\d$/.test(form.value.curp.toUpperCase()) ){
		  $q.loading.show();
		  DischargeImpedimentsServices.search_curp_user({
			hash_id : router.currentRoute.value.params.hash_id,
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
			  form.value.genero = response.data.sexo;
			  form.value.entidad_federativa_nacimiento = response.data.entidad;
			}else{
			  form.value.genero = null;
			}
		  }).catch(e => {
			$q.loading.hide();
			console.error("error: ",e);
		  })
		}
	  };

const fileData = (data) => {
    if( Object.prototype.hasOwnProperty.call(data, 'path') ){
      const index = documents.value.findIndex(obj => obj.id_cat_anexos === data.id_cat_anexos);
	  console.log("index: ",index);
      if (index !== -1) {
		switch ( documents.value[index].id_cat_anexos ) {
			case 3:
				documents.value[index].observaciones = form.value.numero_pasaporte_cancelado;
			break;
			case 4:
				documents.value[index].observaciones = form.value.otro_documento_soporte;
			break;
			case 11:
				documents.value[index].observaciones = form.value.numero_pasaporte;
			break;
		}
        documents.value[index].identificador_documento = data.fileName;
        documents.value[index].url_documento = data.path;
        documents.value[index].aux = true;
      }
    }
  };

  const getDataFileAnexos = (item,name) => {
    let val = null;
	val = ( name == "url_documento" ? process.env.API_URL+item[name] : item[name]);
    return val;
  };

  const isSelected = () => {
    return true;
  };

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

  const toggleItem = (item, checked) => {
    if (checked) {
      form.value.selection_anexo.push(item);
    } else {
      form.value.selection_anexo = form.value.selection_anexo.filter(
        obj => obj.id_cat_anexos !== item.id_cat_anexos
      );
    }
  }

  const onChangeCausal = ( ) => {
    setTimeout(() => {
      form.value.id_subcausal_impedimento = null;
    }, 500);
  };


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
        options.value.cat_subcausal_impedimento = ( options_ == undefined ? [] : options_.cat_subcausal_impedimento );
      }else{
        options.value.cat_subcausal_impedimento = [];
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
		form.value.motivacion_acto_juridico = '';
		form.value.id_causal_impedimento = 9;
      }else{
		form.value.id_causal_impedimento = null;
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
    () => form.value.id_causal_impedimento, (newVal) => {
      if( newVal != 19 ){
        form.value.causal_otro_descripcion = null;
      }
    }
  )

  watch(
    () => form.value.selection_anexo, (newVal) => {
      if( newVal.includes(3) == false ){
        form.value.numero = null;
      }
    }
  )

watch(allOffices, (val) => {
  if (!val?.length) return
  	optionOffices.value = val;
})


  return {
	aux_update,
    state_date,
    state_fecha_nacimiento,
    form,
    myLocale,
    id_estatus_solicitud,
    observaciones,
    myForm,
	plantillaError,
	documents,
	optionOffices,
	options,
	onChangeCausal,
	onCurpTyping,
	onOficinaSelected,
	newValue,
	filterOffices,
    getDataFileAnexos,
    get_cats,
    getImpediment,
    fileData,
    isSelected,
    toggleItem
  }
}
