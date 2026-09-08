export type LocationCategory =
  | 'boarding_gate'
  | 'restroom'
  | 'restaurant'
  | 'immigration'
  | 'check_in'
  | 'transportation'
  | 'accessibility'

export type LocationStatus = 'verified' | 'provisional'
export type Language = 'es' | 'en'

export interface AirportLocation {
  id: string
  category: LocationCategory
  name: string
  name_en: string
  zone: string
  zone_en: string
  floor: string
  floor_en: string
  description: string
  description_en: string
  keywords: string[]
  keywords_en: string[]
  status: LocationStatus
}

export interface AirportDirectory {
  metadata: {
    airport: string
    code: string
    version: string
    notice: string
    notice_en: string
  }
  locations: AirportLocation[]
}
