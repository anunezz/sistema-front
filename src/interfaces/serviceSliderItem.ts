export interface ServiceSliderImage {
  id: number
  path: string
  original_name?: string
}

export interface ServiceSliderItemRecord {
  id: number
  hash_id: string
  service_content_id: number
  image_id: number | null
  image?: ServiceSliderImage | null
  title: string | null
  description: string | null
  sort_order: number
  active: boolean
  created_at: string
  updated_at: string
}

export interface ServiceSliderItemUploadImage {
  fileName: string
  fileNameHash: string
  file_location: string
  typeFile: string
  path: string
}

export interface ServiceSliderItemPayload {
  title: string
  description: string
  sort_order: number | null
  active: boolean
  image?: ServiceSliderItemUploadImage | null
}
