<template>
  <div>
    <div class="dropzone">
      <input type="file" ref="fileInput" class="dropzoneFile" @change="uploadFile"
             :disabled="url === null || showProgress === true" :accept="type_file_front"
             title="Selecciona un archivo"/>
    </div>

    <q-dialog v-model="showProgress" persistent transition-show="scale" style="padding: 0px !important;height: 100%">
      <q-card style="width: 1000px; max-width: 100vw;background: #ffffff">
        <q-linear-progress rounded indeterminate v-if="showProgress" size="35px" :value="progress" color="blue-grey-14">
          <div class="absolute-full flex flex-center">
            <q-badge color="white" text-color="accent" style="height: 25px">
              <span style="font-size: 20px"> {{ (progress * 100).toFixed(0) }}%</span>
            </q-badge>
          </div>
        </q-linear-progress>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import {axiosInstance} from "boot/axios";
import {ref} from "vue";
import {useQuasar} from "quasar";

const emit = defineEmits(['successFile']) // Emite un evento cuando el archivo se carga correctamente

const props = defineProps({
  url: {                        //ruta hacia el controlador, la ruta debe permitir muchas peticiones por minuto ejemplo (throttle:1900,1)
    type: String,
    required: true,
    default: null
  },
  save_storage_folder: {        //Ruta donde se almacenara el archivo cargado una vez que se terminen de cargar todos los chunks
    type: String,
    required: true,
    default: null
  },
  save_storage_cunks_folder: {  //Ruta donde se almacenaran los cunks que se estaran cargando ejemplo (acervo/filesChunks)
    type: String,               // adicionalmente en el controlador del back se agrega (/user_id) para no sobrescribir los chunks de los usuarios
    required: false,
    default: 'filesChunks'
  },
  size_chunks_mb: {  // Tamaño de los chunks en MB, por defecto es 2MB
    required: false,
    default: 2
  },
  type_file_front:{ // Tipos de archivos permitidos en el front-end, por ejemplo: type_file_front="'.png, .jpg, .jpeg, gif, .PNG, .JPG, .JPEG, GIF'"
    type:String,
    required: false,
    default:''
  },
  type_file_back_system:{ // Tipo de archivo que se maneja en el sistema, para mandar al back-end, por ejemplo: type_file_back_system="1" para imágenes, "2" para documentos, etc.
    type:Number,
    required: false,
    default:null
  },
  max_allowed_size_mb:{ // Tamaño máximo permitido para el archivo en MB, por defecto es 10MB
    type:Number,
    required: false,
    default:10
  },
  id_cat_anexos:{ // Tamaño máximo permitido para el archivo en MB, por defecto es 10MB
    type:Number,
    required: false,
    default:0
  }
})

const $q = useQuasar()

const fileInput = ref(null)
const progress = ref(0)
const showProgress = ref(false)

const uploadFile = async () => {
  const file = fileInput.value.files[0];
  const chunkSize = props.size_chunks_mb * 1024 * 1024 // el tamaño por default es de 2MB
  let total_chunks = Math.ceil(file.size / chunkSize);

  let max_allowed_size_input = props.max_allowed_size_mb !== undefined ? props.max_allowed_size_mb : 10

  let max_allowed_size = max_allowed_size_input * 1024 * 1024


  if (file.size > max_allowed_size){
    clearFile()
    $q.notify({
      type: 'negative',
      message: '',
      caption: `El archivo debe ser menor o igual a ${max_allowed_size_input} Mb`
    });
  }else {

    console.log('tamaño de archivo',file.size,max_allowed_size)
    let percent_by_unit = 1 / total_chunks
    let chunk_unit = 0


    showProgress.value = true
    let offset = 0


    while (offset < file.size) {
      const chunk = file.slice(offset, offset + chunkSize)
      const formData = new FormData()


      formData.set('file_name', file.name);
      formData.append('file_size', file.size)
      formData.append('file', chunk)
      formData.append('offset', offset)
      formData.set('save_storage_folder', props.save_storage_folder);
      formData.set('save_storage_cunks_folder', props.save_storage_cunks_folder);
      formData.set('mimeType', file.type);
      formData.set('type_file_back_system', props.type_file_back_system);

      if (total_chunks === 1) {
        formData.set('is_last', true);
      }

      console.log('total_chunks', total_chunks)
      try {
        let {data} = await axiosInstance.post(props.url, formData,{
			headers: { 'Accept-C': 'false'}
		})

        console.log('dataa->',data)
        if (data.file_exist !== undefined && data.file_exist) {
          offset = data.size //posicion del ultimo puntero de la imagen
          let remaining_size = file.size - data.size //posicion del ultimo puntero de la imagen
          total_chunks = Math.ceil((file.size - data.size) / chunkSize)
          chunk_unit = Math.ceil(data.size / chunkSize) ///Calcular de nuevo los chungs que se van cargando para mostrar porcentage

          console.log('----------\n')
          console.log('file_size', file.size)
          console.log('data_size', data.size)
          console.log('total_chunks', total_chunks)
          console.log('remaining_size', remaining_size)
          console.log('----------\n')

          if (total_chunks <= 0){
            console.log('el archivo esta cargado completamente en el servidor')
            formData.set('full_load', true);
            await axiosInstance.post(props.url, formData,{ headers: { 'Accept-C': false} }).then(response => {
              data = response.data
            }).catch(error => {
              console.log('error al cargar el archivo completamente', error.response)
            })
          }

        } else {
          offset += chunkSize
          total_chunks = total_chunks - 1

          chunk_unit++

        }

        progress.value = chunk_unit * percent_by_unit

        if (total_chunks === 0) {
          setTimeout(function () {
            showProgress.value = false
            progress.value = 0
            clearFile()
            console.log('ocultar barra')
          }, 900);

        }

        if (data.success !== undefined && data.success === false ){
          clearFile()
          offset = file.size + 1
          showProgress.value = false
          progress.value = 0
          $q.notify({
            type: 'negative',
            message: data.message
          });
        }

        if (data.file_fully_uploaded !== undefined && data.file_fully_uploaded === true){
          data.id_cat_anexos = props.id_cat_anexos;

          //console.log("data: ",data);
          emit('successFile',data)
        }

      } catch (error) {
        clearFile()
        offset = file.size + 1
        showProgress.value = false
        progress.value = 0
        console.error('error', error.response)

        $q.notify({
          type: 'negative',
          message: 'No se puede completar la acción',
        });
      }
    }
  }



}

const clearFile = () => {
  fileInput.value.value = ''
}

</script>

<style scoped lang="scss">
.dropzone {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
}

.dropzoneFile {
  width: 100%;
  display: block;
  padding: 5px;
  border: 2px dashed #ccc;
  border-radius: 8px;
  background-color: #f9f9f9;
  cursor: pointer;
  box-sizing: border-box;

  &:hover {
    border-color: #206a5d;
    box-shadow: 0 4px 8px rgba(32, 106, 93, 0.2);
  }

  &:focus {
    border-color: #206a5d;
    box-shadow: 0 0 0 3px rgba(32, 106, 93, 0.25);
  }
}

/* Estilos para el botón de selección de archivo */
::-webkit-file-upload-button {
  content: 'Seleccionar archivo';
  color: white;
  background: #206a5d;
  padding: 12px 20px;
  border: none;
  border-radius: 6px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  outline: none;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-size: 12px;
}

::-webkit-file-upload-button:hover {
  background: #1a594e;
  transform: translateY(-1px);
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.15);
}

::-webkit-file-upload-button:active {
  transform: translateY(0);
  box-shadow: 0 2px 3px rgba(0, 0, 0, 0.1);
}

/* Estilos para la barra de progreso */
.progress-bar {
  height: 8px;
  background: #206a5d;
  border-radius: 4px;
  transition: width 0.3s ease;
  margin-top: 10px;
}

.progress-container {
  background: #f0f0f0;
  border-radius: 4px;
  overflow: hidden;
}
</style>
