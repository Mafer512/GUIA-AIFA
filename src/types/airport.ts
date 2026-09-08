export type LocationCategory =
  | 'boarding_gate'
  | 'restroom'
  | 'restaurant'
  | 'immigration'
  | 'check_in'
  | 'transportation'
  | 'accessibility'

export type LocationStatus = 'verified' | 'provisional'

export interface AirportLocation {
  id: string
  category: LocationCategory
  name: string
  zone: string
  floor: string
  description: string
  keywords: string[]
  status: LocationStatus
}

export interface AirportDirectory {
  metadata: {
    airport: string
    code: string
    version: string
    notice: string
  }
  locations: AirportLocation[]
}
