import directoryJson from '../data/airport-locations.json'
import type { AirportDirectory, AirportLocation, LocationCategory } from '../types/airport'

const directory = directoryJson as AirportDirectory

const categoryTerms: Record<LocationCategory, string[]> = {
  boarding_gate: ['puerta', 'abordaje', 'vuelo', 'sala'],
  restroom: ['bano', 'sanitario', 'wc', 'cambiador'],
  restaurant: ['comida', 'restaurante', 'cafeteria', 'cafe', 'hambre', 'alimentos'],
  immigration: ['migracion', 'pasaporte', 'aduana', 'internacional'],
  check_in: ['documentar', 'documentacion', 'facturar', 'facturo', 'check in', 'mostrador', 'aerolinea', 'equipaje', 'maleta'],
  transportation: ['mexibus', 'transporte', 'taxi', 'salida', 'autobus'],
  accessibility: ['asistencia', 'accesibilidad', 'silla de ruedas', 'discapacidad', 'especial'],
}

const genericTerms = new Set([
  'a', 'al', 'con', 'como', 'de', 'del', 'donde', 'el', 'en', 'esta', 'estan', 'hacia',
  'la', 'las', 'llego', 'los', 'me', 'mi', 'para', 'por', 'quiero', 'se', 'un', 'una', 'y',
])

function normalize(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase('es-MX')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function tokens(value: string) {
  return normalize(value)
    .split(' ')
    .filter((term) => term.length > 1 && !genericTerms.has(term))
}

function scoreLocation(location: AirportLocation, query: string) {
  const normalizedQuery = normalize(query)
  const queryTokens = tokens(query)
  const searchable = normalize([
    location.name,
    location.zone,
    location.floor,
    location.description,
    ...location.keywords,
  ].join(' '))

  let score = 0

  for (const keyword of location.keywords) {
    const normalizedKeyword = normalize(keyword)
    if (normalizedQuery.includes(normalizedKeyword)) score += normalizedKeyword.includes(' ') ? 8 : 5
  }

  for (const term of categoryTerms[location.category]) {
    if (normalizedQuery.includes(term)) score += 3
  }

  for (const token of queryTokens) {
    if (searchable.includes(token)) score += 1
  }

  return score
}

function formatLocation(location: AirportLocation) {
  const verificationNote = location.status === 'provisional'
    ? ' Esta ruta es orientativa; confirma la asignación en la señalización o con personal del aeropuerto.'
    : ''

  return `${location.name} — ${location.zone}, ${location.floor}. ${location.description}${verificationNote}`
}

export function getAssistantResponse(query: string) {
  const ranked = directory.locations
    .map((location) => ({ location, score: scoreLocation(location, query) }))
    .filter(({ score }) => score > 0)
    .sort((first, second) => second.score - first.score)

  if (ranked.length === 0) {
    return 'Puedo ayudarte a encontrar puertas, baños, alimentos, migración y mostradores de documentación. Dime qué servicio buscas o menciona tu aerolínea.'
  }

  const best = ranked[0]
  const closeMatches = ranked.filter(({ score, location }) =>
    location.category === best.location.category && score >= best.score - 1,
  )

  if (closeMatches.length > 1 && closeMatches[1].score === best.score) {
    const options = closeMatches.slice(0, 3).map(({ location }) =>
      `${location.name} (${location.floor})`,
    )
    return `Encontré estas opciones: ${options.join('; ')}. Dime si estás en salidas, llegadas o después del filtro para darte una indicación más precisa.`
  }

  return formatLocation(best.location)
}

export const airportDirectoryNotice = directory.metadata.notice
