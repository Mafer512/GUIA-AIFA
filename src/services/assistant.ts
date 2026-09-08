import directoryJson from '../data/airport-locations.json'
import type { AirportDirectory, AirportLocation, Language, LocationCategory } from '../types/airport'

const directory = directoryJson as AirportDirectory

const categoryTerms: Record<Language, Record<LocationCategory, string[]>> = {
  es: {
    boarding_gate: ['puerta', 'abordaje', 'vuelo', 'sala'],
    restroom: ['bano', 'sanitario', 'wc', 'cambiador'],
    restaurant: ['comida', 'restaurante', 'cafeteria', 'cafe', 'hambre', 'alimentos'],
    immigration: ['migracion', 'pasaporte', 'aduana', 'internacional'],
    check_in: ['documentar', 'documentacion', 'facturar', 'facturo', 'check in', 'mostrador', 'aerolinea', 'equipaje', 'maleta'],
    transportation: ['mexibus', 'transporte', 'taxi', 'salida', 'autobus'],
    accessibility: ['asistencia', 'accesibilidad', 'silla de ruedas', 'discapacidad', 'especial'],
  },
  en: {
    boarding_gate: ['gate', 'boarding', 'flight', 'departure lounge'],
    restroom: ['bathroom', 'restroom', 'toilet', 'changing table'],
    restaurant: ['food', 'restaurant', 'coffee', 'hungry', 'meal'],
    immigration: ['immigration', 'passport', 'customs', 'international'],
    check_in: ['check in', 'check-in', 'counter', 'airline', 'baggage', 'luggage', 'bag'],
    transportation: ['mexibus', 'transportation', 'taxi', 'exit', 'bus'],
    accessibility: ['assistance', 'accessibility', 'wheelchair', 'disability', 'special'],
  },
}

const genericTerms: Record<Language, Set<string>> = {
  es: new Set([
    'a', 'al', 'con', 'como', 'de', 'del', 'donde', 'el', 'en', 'esta', 'estan', 'hacia',
    'la', 'las', 'llego', 'los', 'me', 'mi', 'para', 'por', 'quiero', 'se', 'un', 'una', 'y',
  ]),
  en: new Set([
    'a', 'an', 'and', 'are', 'at', 'can', 'do', 'find', 'for', 'from', 'get', 'how', 'i',
    'in', 'is', 'me', 'my', 'of', 'the', 'to', 'where', 'with',
  ]),
}

function normalize(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase('es-MX')
    .replace(/[^a-z0-9\s-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function tokens(value: string, language: Language) {
  return normalize(value)
    .split(' ')
    .filter((term) => term.length > 1 && !genericTerms[language].has(term))
}

function localizedLocation(location: AirportLocation, language: Language) {
  if (language === 'en') {
    return {
      name: location.name_en,
      zone: location.zone_en,
      floor: location.floor_en,
      description: location.description_en,
      keywords: location.keywords_en,
    }
  }

  return {
    name: location.name,
    zone: location.zone,
    floor: location.floor,
    description: location.description,
    keywords: location.keywords,
  }
}

function scoreLocation(location: AirportLocation, query: string, language: Language) {
  const normalizedQuery = normalize(query)
  const queryTokens = tokens(query, language)
  const localized = localizedLocation(location, language)
  const searchable = normalize([
    localized.name,
    localized.zone,
    localized.floor,
    localized.description,
    ...localized.keywords,
  ].join(' '))

  let score = 0

  for (const keyword of localized.keywords) {
    const normalizedKeyword = normalize(keyword)
    if (normalizedQuery.includes(normalizedKeyword)) score += normalizedKeyword.includes(' ') ? 8 : 5
  }

  for (const term of categoryTerms[language][location.category]) {
    if (normalizedQuery.includes(term)) score += 3
  }

  for (const token of queryTokens) {
    if (searchable.includes(token)) score += 1
  }

  return score
}

function formatLocation(location: AirportLocation, language: Language) {
  const localized = localizedLocation(location, language)
  const verificationNote = location.status === 'provisional'
    ? language === 'es'
      ? ' Esta ruta es orientativa; confirma la asignación en la señalización o con personal del aeropuerto.'
      : ' This route is a guide; confirm the assignment on airport signs or with airport staff.'
    : ''

  return `${localized.name} — ${localized.zone}, ${localized.floor}. ${localized.description}${verificationNote}`
}

export function getAssistantResponse(query: string, language: Language = 'es') {
  const ranked = directory.locations
    .map((location) => ({ location, score: scoreLocation(location, query, language) }))
    .filter(({ score }) => score > 0)
    .sort((first, second) => second.score - first.score)

  if (ranked.length === 0) {
    return language === 'es'
      ? 'Puedo ayudarte a encontrar puertas, baños, alimentos, migración y mostradores de documentación. Dime qué servicio buscas o menciona tu aerolínea.'
      : 'I can help you find gates, restrooms, food, immigration, and check-in counters. Tell me which service you need or mention your airline.'
  }

  const best = ranked[0]
  const closeMatches = ranked.filter(({ score, location }) =>
    location.category === best.location.category && score >= best.score - 1,
  )

  if (closeMatches.length > 1 && closeMatches[1].score === best.score) {
    const options = closeMatches.slice(0, 3).map(({ location }) => {
      const localized = localizedLocation(location, language)
      return `${localized.name} (${localized.floor})`
    })

    return language === 'es'
      ? `Encontré estas opciones: ${options.join('; ')}. Dime si estás en salidas, llegadas o después del filtro para darte una indicación más precisa.`
      : `I found these options: ${options.join('; ')}. Tell me if you are in departures, arrivals, or past security so I can give you more precise directions.`
  }

  return formatLocation(best.location, language)
}

export function getAirportDirectoryNotice(language: Language) {
  return language === 'es' ? directory.metadata.notice : directory.metadata.notice_en
}
