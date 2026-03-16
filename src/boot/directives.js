export default ({ app }) => {
  app.directive('uppercase', {
    mounted(el) {
      // Buscar input o textarea
      const input = el.querySelector('input') || el.querySelector('textarea');
      if (!input) return;

      input.addEventListener('input', () => {
        const { selectionStart, selectionEnd, value } = input;
        const uppercased = value.toUpperCase();

        if (value !== uppercased) {
          input.value = uppercased;
          input.setSelectionRange(selectionStart, selectionEnd);
          input.dispatchEvent(new Event('input'));
        }
      });
    }
  });

  	app.directive('alfanumerico', {
		mounted(el) {
			const input = el.querySelector('input') || el.querySelector('textarea');
			if (!input) return;

			input.addEventListener('input', () => {
			const { selectionStart, selectionEnd, value } = input;

			// Expresión regular permitida:
			// Letras, números, acentos, Ñ y espacios
			const permitido = value.replace(/[^a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s]/g, '');

			if (value !== permitido) {
				input.value = permitido;
				input.setSelectionRange(selectionStart - 1, selectionEnd - 1);
				input.dispatchEvent(new Event('input'));
			}
			});
		}
	});

  app.directive('max', {
  mounted(el, binding) {
    const limit = Number(binding.value) || 0;
    if (!limit) return;

    const input = el.querySelector('input') || el.querySelector('textarea');
    if (!input) return;

    const handler = (e) => {
      const target = e.target;
      let { selectionStart, selectionEnd, value } = target;

      if (value.length > limit) {
        // recortar
        value = value.slice(0, limit);
        target.value = value;

        // restaurar posición del cursor lo mejor posible
        target.setSelectionRange(selectionStart, selectionEnd);
      }
      // ⚠️ IMPORTANTE: aquí ya NO llamamos a dispatchEvent('input')
      // Vue/Quasar leen target.value del mismo evento original
    };

    // usar capture para que corra antes que los listeners de Quasar
    input.addEventListener('input', handler, { capture: true });

    // por si luego quieres quitar el listener
    el._maxHandler = handler;
  },

  beforeUnmount(el) {
    const input = el.querySelector('input') || el.querySelector('textarea');
    if (input && el._maxHandler) {
      input.removeEventListener('input', el._maxHandler, { capture: true });
    }
  }
});

app.directive('max1000', {
  mounted (el, binding) {
    const limit = Number(binding.value) || 1000;

    // Buscamos el elemento de edición real dentro del q-editor.
    const targetElement = el.querySelector('[contenteditable="true"], input, textarea');

    if (!targetElement) {
      console.warn('v-max1000: No se encontró un elemento de entrada editable.');
      return;
    }

    const isContentEditable = targetElement.hasAttribute('contenteditable');

    let lastValue = isContentEditable ? (targetElement.innerHTML || '') : (targetElement.value || '');

    // 1. Función para colocar el cursor al final (solo para contenteditable)
    const placeCaretAtEnd = (el) => {
      try {
        const range = document.createRange();
        range.selectNodeContents(el);
        range.collapse(false);
        const sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
      } catch (e) {
        // Ignoramos errores de manipulación de selección que pueden ocurrir durante
        // la reversión rápida. Esto ayuda a eliminar algunos mensajes de consola.
        console.error('Error al colocar el cursor:', e);
      }
    };

    // 2. El manejador de eventos principal
const onInput = () => {
      if (isContentEditable) {
        const text = targetElement.innerText || '';

        if (text.length <= limit) {
          lastValue = targetElement.innerHTML;

          // ⚠️ SOLUCIÓN: Usamos requestAnimationFrame para evitar la recursión (bucle de eventos)
          window.requestAnimationFrame(() => {
             targetElement.dispatchEvent(new Event('input', { bubbles: true }));
          });

        } else {
          // Nos pasamos: revertimos y movemos el cursor.
          targetElement.innerHTML = lastValue;
          placeCaretAtEnd(targetElement);

          // ✔️ No despachamos 'input' en la reversión.
        }
      } else {
        // ... Lógica para q-input/q-textarea (dejar igual que la versión anterior) ...
        const value = targetElement.value || '';
        if (value.length <= limit) {
          lastValue = value;
          targetElement.dispatchEvent(new Event('input', { bubbles: true }));
        } else {
          const pos = targetElement.selectionStart;
          targetElement.value = lastValue;
          targetElement.setSelectionRange(pos - 1, pos - 1);
          targetElement.dispatchEvent(new Event('input', { bubbles: true }));
        }
      }
    };

    // 3. Adjuntamos el listener y lo guardamos para la limpieza.
    targetElement.addEventListener('input', onInput);
    el.__max1000_handler = onInput;
    el.__max1000_target = targetElement;
  },

  // 4. Hook de limpieza (beforeUnmount) - Esencial para evitar fugas y errores al destruir
  beforeUnmount (el) {
    if (el.__max1000_target && el.__max1000_handler) {
      el.__max1000_target.removeEventListener('input', el.__max1000_handler);
      delete el.__max1000_handler;
      delete el.__max1000_target;
    }
  }
});

  // v-no-spaces
  app.directive('no-spaces', {
    mounted(el) {
      const input = el.querySelector('input') || el.querySelector('textarea');
      if (!input) return;

      input.addEventListener('input', () => {
        const { selectionStart, selectionEnd, value } = input;
        const cleaned = value.replace(/\s+/g, '').toUpperCase();

        if (value !== cleaned) {
          input.value = cleaned;
          input.setSelectionRange(selectionStart, selectionEnd);
          input.dispatchEvent(new Event('input'));
        }
      });
    }
  });
};
