export interface Image {

    id: number

    name: string

    original_name: string

    path: string

    extension: string

    mime_type: string

    size: number

    width: number | null

    height: number | null

    alt: string | null

}

export interface ServiceSliderItem {

    id: number

    title: string

    description: string

    sort_order: number

    active: boolean

    image_id: number | null

    image: Image | null

}

export interface ServiceContent {

    id: number

    title: string

    subtitle: string

    description: string

    content: string

    slider_items: ServiceSliderItem[]

}

export interface ServiceCategory {

    id: number

    icon: string

    title: string

    subtitle: string

    sort_order: number

    active: boolean

    content: ServiceContent | null

}

export interface ServiceResponse {

    success: boolean

    data: ServiceCategory[]

}
