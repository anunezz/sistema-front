import { ref, onMounted } from 'vue'
import ServiceApi from 'src/services/service.api'
import type { ServiceResponse } from 'src/interfaces/service'

export function useServices() {

    const loading = ref(false)

    const services = ref<ServiceResponse>({
        success: false,
        data: []
    })

    const load = async () => {

        loading.value = true

        try {

            services.value = await ServiceApi.getServices()

        } finally {

            loading.value = false

        }

    }

    onMounted(load)

    return {
        services,
        loading,
        load
    }

}
