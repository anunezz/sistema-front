export interface ServiceContentRecord {
  id: number
  service_category_id: number
  title: string
  subtitle: string
  description: string
  content: string
  created_at?: string
  updated_at?: string
}

export interface ServiceContentPayload {
  title: string
  subtitle: string
  description: string
  content: string
}
