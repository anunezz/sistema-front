// Producto de un Servicio (ServiceCategory) — ver .claude/skills/servicios/.
// sort_order es el único mecanismo de prioridad ya usado en todo el módulo
// (ServiceCategory/ServiceContent/ServiceSliderItem/AppointmentService); la
// vista pública lo reutiliza para determinar los "productos destacados",
// sin campo "featured" nuevo.

export interface ProductImage {
	id: number
	path: string
	original_name?: string
}

export interface ProductCategory {
	id: number
	title: string
}

export interface ProductRecord {
	id: number
	hash_id: string
	service_category_id: number
	image_id: number | null
	image?: ProductImage | null
	category?: ProductCategory | null
	title: string
	subtitle: string | null
	description: string | null
	price: string | number
	active: boolean
	sort_order: number
	created_at?: string
	updated_at?: string
}

// Metadatos que entrega UploadFileChuncks una vez subido el archivo — mismo
// shape que ya usa el slider de Servicios (ServiceSliderItemUploadImage),
// no se inventa un mecanismo de subida distinto.
export interface ProductUploadImage {
	fileName: string
	fileNameHash: string
	file_location: string
	typeFile: string
	path: string
}

export interface ProductPayload {
	service_category_id: number
	title: string
	subtitle?: string | null
	description?: string | null
	price: number | string
	active: boolean
	sort_order?: number | null
	// Solo se envía cuando se sube una imagen NUEVA (alta, o reemplazo en
	// edición) — nunca la relación `image` ya cargada del registro, o el
	// backend interpretaría eso como un intento de subida y limpiaría la
	// imagen actual (ver ProductService::update() en backend).
	image?: ProductUploadImage | null
}

// Vista pública (GET /products, sin auth) — misma forma que entrega
// Product::with(['category','image']) serializado directo (mismo criterio
// que GET /services con ServiceCategory), sin Resource dedicado.
export interface PublicProductRecord {
	id: number
	service_category_id: number
	title: string
	subtitle: string | null
	description: string | null
	price: string | number
	sort_order: number
	active: boolean
	image: ProductImage | null
	category: ProductCategory | null
}
