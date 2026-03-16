<template>
 <q-dialog ref="dialogRef" @hide="onDialogHide">
            <q-card style="min-width: 800px;min-height: 400px;">
                <q-card-section style="background-color: #C39326;" class="text-white">
                </q-card-section>
                <q-card-section style="background: #9F2241;" class="text-white">
                    <div class="text-h6"><i class="fas fa-user-times"></i> {{title}}</div>
                </q-card-section>

                <q-card-section class="text-center">
                    <div class="q-pa-md">
                        <q-avatar size="150px" font-size="90px" style="color:#DB5761" :icon="icon" />
                        <h5>{{subtitle}}</h5>
                        <h6>{{question}}</h6>
                    </div>
                </q-card-section>

                <q-card-actions>
                    <div class="q-pa-md" style="width: 100%;">
                        <div class="row">
                            <div class="col-6">
                                <q-btn size="md" label="Cancelar" class="full-width" icon="fa-solid fa-circle-xmark"  @click="onCancelClick"
                                    style="background: #9F2241;color:white;" v-close-popup />
                            </div>
                            <div class="col-6">
                                <q-btn size="md" label="Aceptar" class="full-width" icon="fas fa-save" @click="onOKClick"
                                    style="background: #00A982;color:white;" />
                            </div>
                        </div>
                    </div>
                </q-card-actions>
            </q-card>
        </q-dialog>
</template>

        <script>
import { useDialogPluginComponent } from 'quasar'
export default {
  props: {
    icon: {
      required: false,
      type: String,
      default: 'fas fa-exclamation-triangle'
    },
    title: {
      required: true,
      type: String,
      default: ''
    },
    subtitle: {
      required: false,
      type: String,
      default: ''
    },
    question: {
      required: true,
      type: String,
      default: ''
    },
    button: {
      required: true,
      type: String,
      default: 'Deshabilitar'
    }
  },
  emits: [
    // REQUIRED; need to specify some events that your
    // component will emit through useDialogPluginComponent()
    ...useDialogPluginComponent.emits
  ],
  setup() {
    // REQUIRED; must be called inside of setup()
    const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } = useDialogPluginComponent()
    // dialogRef      - Vue ref to be applied to QDialog
    // onDialogHide   - Function to be used as handler for @hide on QDialog
    // onDialogOK     - Function to call to settle dialog with "ok" outcome
    //                    example: onDialogOK() - no payload
    //                    example: onDialogOK({ /*.../* }) - with payload
    // onDialogCancel - Function to call to settle dialog with "cancel" outcome


    return {
      // This is REQUIRED;
      // Need to inject these (from useDialogPluginComponent() call)
      // into the vue scope for the vue html template
      dialogRef,
      onDialogHide,

      // other methods that we used in our vue html template;
      // these are part of our example (so not required)
      onOKClick () {
        // on OK, it is REQUIRED to
        // call onDialogOK (with optional payload)
        onDialogOK()
        // or with payload: onDialogOK({ ... })
        // ...and it will also hide the dialog automatically
      },

      // we can passthrough onDialogCancel directly
      onCancelClick: onDialogCancel
    }
  }
}
</script>
