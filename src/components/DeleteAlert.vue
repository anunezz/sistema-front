<template>
	<q-dialog ref="dialogRef" @hide="onDialogHide" >
		<q-card flat bordered>
			<q-item>
				<q-item-section avatar>
					<q-avatar :icon="icon" color="red" text-color="white" :style="avatarStyle"/>
				</q-item-section>

				<q-item-section>
					<q-item-label>{{ title }}</q-item-label>
					<q-item-label caption>
						{{ subtitle }}
					</q-item-label>
				</q-item-section>
			</q-item>
			<q-separator />
			<q-card-section class="row items-center">
				<span>{{ question }}</span>
			</q-card-section>
			<q-card-actions align="right">
				<q-btn dense outline label="Cancelar" color="red" @click="onCancelClick"/>
				<q-btn dense :label="button" color="primary" @click="onOKClick" v-close-popup/>
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
    },
    // Override opcional del color del ícono (por defecto sigue siendo el
    // "red" de siempre para no afectar a ningún módulo existente). Agenda lo
    // usa para que sus confirmaciones usen el mismo color de cabecera que el
    // header administrativo (ver spec §4 / CalendarioTab.vue).
    avatarStyle: {
      required: false,
      type: [String, Object],
      default: null
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
