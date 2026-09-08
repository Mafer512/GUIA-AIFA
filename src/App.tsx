import { FormEvent, useEffect, useRef, useState } from 'react'
import {
  ArrowRight,
  Bath,
  ChevronRight,
  CircleHelp,
  Clock3,
  Coffee,
  Languages,
  MapPin,
  Menu,
  Mic,
  Navigation,
  Plane,
  Send,
  ShieldCheck,
  Sparkles,
  Utensils,
  X,
} from 'lucide-react'

type Category = 'puerta' | 'baños' | 'comida' | 'migración'
type Message = { id: number; from: 'assistant' | 'user'; text: string }

const quickActions: Array<{ label: string; prompt: string; icon: typeof Plane; color: string }> = [
  { label: 'Mi puerta', prompt: '¿Dónde está mi puerta de abordaje?', icon: Plane, color: 'coral' },
  { label: 'Baños', prompt: '¿Dónde están los baños más cercanos?', icon: Bath, color: 'blue' },
  { label: 'Comida', prompt: 'Quiero encontrar restaurantes y cafeterías', icon: Utensils, color: 'gold' },
  { label: 'Migración', prompt: '¿Cómo llego a migración?', icon: ShieldCheck, color: 'green' },
]

const suggested = [
  '¿Dónde documento mi equipaje?',
  '¿Cómo llego al Mexibús?',
  'Necesito asistencia especial',
]

const responses: Record<Category | 'default', string> = {
  puerta:
    '¡Con gusto! Para ubicar tu puerta necesito el número de vuelo o la puerta indicada en tu pase de abordar. Puedes escribirme, por ejemplo: “Puerta 108”.',
  baños:
    'Los baños más cercanos están a unos 2 minutos, junto al módulo de información del pasillo central. Sigue la señalización azul. También hay sanitarios accesibles y cambiadores.',
  comida:
    'Encontrarás restaurantes y cafeterías en la zona comercial del nivel 2. La opción más cercana está a 4 minutos. ¿Buscas café, comida rápida o un lugar para sentarte?',
  migración:
    'Migración se encuentra después del filtro de seguridad, siguiendo las señales moradas de “Llegadas internacionales”. Desde el vestíbulo principal toma aproximadamente 8 minutos.',
  default:
    'Estoy aquí para orientarte. Puedo ayudarte a encontrar puertas, baños, comida, transporte, migración y otros servicios del aeropuerto. ¿Qué necesitas ubicar?',
}

function getResponse(input: string) {
  const normalized = input.toLocaleLowerCase('es-MX')
  if (/puerta|abordaje|vuelo/.test(normalized)) return responses.puerta
  if (/baño|sanitario/.test(normalized)) return responses.baños
  if (/comida|restaurante|caf[eé]|hambre/.test(normalized)) return responses.comida
  if (/migraci[oó]n|aduana|internacional/.test(normalized)) return responses.migración
  if (/mexib[uú]s|transporte|salir|taxi/.test(normalized)) {
    return 'El Mexibús y los taxis autorizados se encuentran en la planta baja, saliendo por las puertas 1 y 2. Sigue las señales turquesa de “Transporte terrestre”.'
  }
  if (/equipaje|documentar|maleta/.test(normalized)) {
    return 'Los mostradores de documentación están en el nivel de salidas. Busca la pantalla de tu aerolínea para identificar la isla asignada; si me dices tu aerolínea puedo orientarte mejor.'
  }
  if (/asistencia|silla|discapacidad|especial/.test(normalized)) {
    return 'Claro. Hay módulos de asistencia en cada acceso principal. Si requieres silla de ruedas, acércate al mostrador de tu aerolínea o al módulo de información más cercano.'
  }
  return responses.default
}

export default function App() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      from: 'assistant',
      text: '¡Hola! Soy tu guía en el AIFA. Dime a dónde quieres ir y te acompaño paso a paso.',
    },
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [language, setLanguage] = useState<'ES' | 'EN'>('ES')
  const chatEnd = useRef<HTMLDivElement>(null)

  useEffect(() => {
    chatEnd.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  const ask = (text: string) => {
    const clean = text.trim()
    if (!clean || isTyping) return
    setMessages((current) => [...current, { id: Date.now(), from: 'user', text: clean }])
    setInput('')
    setIsTyping(true)
    window.setTimeout(() => {
      setMessages((current) => [
        ...current,
        { id: Date.now() + 1, from: 'assistant', text: getResponse(clean) },
      ])
      setIsTyping(false)
    }, 650)
  }

  const submit = (event: FormEvent) => {
    event.preventDefault()
    ask(input)
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <a className="brand" href="#inicio" aria-label="Inicio Guía AIFA">
          <span className="brand-mark"><Plane size={22} strokeWidth={2.4} /></span>
          <span>
            <strong>Guía AIFA</strong>
            <small>Tu viaje, más sencillo</small>
          </span>
        </a>
        <div className="header-actions">
          <button className="language-button" onClick={() => setLanguage(language === 'ES' ? 'EN' : 'ES')}>
            <Languages size={17} /> {language}
          </button>
          <button className="menu-button" aria-label="Abrir menú" onClick={() => setMenuOpen(true)}>
            <Menu size={23} />
          </button>
        </div>
      </header>

      <main id="inicio">
        <section className="hero">
          <div className="hero-orbit orbit-one" />
          <div className="hero-orbit orbit-two" />
          <div className="hero-content">
            <div className="location-pill"><MapPin size={15} /> Estás en el AIFA</div>
            <h1>¿A dónde<br /><em>quieres llegar?</em></h1>
            <p>Te ayudo a moverte por el aeropuerto de forma fácil, rápida y sin complicaciones.</p>
          </div>
          <div className="hero-route" aria-hidden="true">
            <span className="route-dot" />
            <span className="route-line" />
            <span className="route-plane"><Plane size={25} /></span>
          </div>
        </section>

        <section className="content-grid">
          <div className="main-column">
            <section className="quick-section" aria-labelledby="quick-title">
              <div className="section-heading">
                <div>
                  <span className="eyebrow">ACCESOS RÁPIDOS</span>
                  <h2 id="quick-title">¿Qué estás buscando?</h2>
                </div>
                <Sparkles className="sparkle" size={24} />
              </div>
              <div className="quick-grid">
                {quickActions.map(({ label, prompt, icon: Icon, color }) => (
                  <button className="quick-card" key={label} onClick={() => ask(prompt)}>
                    <span className={`quick-icon ${color}`}><Icon size={24} /></span>
                    <span>{label}</span>
                    <ChevronRight size={17} className="quick-arrow" />
                  </button>
                ))}
              </div>
            </section>

            <section className="chat-card" aria-labelledby="chat-title">
              <div className="chat-header">
                <div className="avatar"><Navigation size={20} /></div>
                <div>
                  <h2 id="chat-title">Asistente AIFA</h2>
                  <span className="online"><i /> En línea · Listo para ayudarte</span>
                </div>
              </div>

              <div className="messages" aria-live="polite">
                {messages.map((message) => (
                  <div className={`message-row ${message.from}`} key={message.id}>
                    {message.from === 'assistant' && <div className="mini-avatar"><Navigation size={14} /></div>}
                    <div className="message-bubble">{message.text}</div>
                  </div>
                ))}
                {isTyping && (
                  <div className="message-row assistant">
                    <div className="mini-avatar"><Navigation size={14} /></div>
                    <div className="message-bubble typing"><i /><i /><i /></div>
                  </div>
                )}
                <div ref={chatEnd} />
              </div>

              <div className="suggestions" aria-label="Preguntas sugeridas">
                {suggested.map((item) => <button key={item} onClick={() => ask(item)}>{item}</button>)}
              </div>

              <form className="chat-form" onSubmit={submit}>
                <button type="button" className="mic-button" aria-label="Hablar"><Mic size={20} /></button>
                <input
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  placeholder="Escribe tu pregunta…"
                  aria-label="Escribe tu pregunta"
                />
                <button className="send-button" type="submit" aria-label="Enviar mensaje" disabled={!input.trim() || isTyping}>
                  <Send size={18} />
                </button>
              </form>
              <p className="privacy-note">No compartas información personal o sensible.</p>
            </section>
          </div>

          <aside className="side-column">
            <div className="info-card">
              <div className="info-icon"><Clock3 size={22} /></div>
              <div><small>TIEMPO ESTIMADO</small><strong>Filtro de seguridad</strong><span>Entre 10 y 15 minutos</span></div>
            </div>
            <div className="tip-card">
              <span className="eyebrow">TIP DEL VIAJERO</span>
              <h3>Ten a la mano tu pase de abordar</h3>
              <p>Así podré ayudarte a ubicar tu puerta y calcular la mejor ruta.</p>
              <button onClick={() => ask('¿Dónde está mi puerta de abordaje?')}>Buscar mi puerta <ArrowRight size={17} /></button>
              <Coffee className="tip-illustration" size={85} strokeWidth={1.2} />
            </div>
            <button className="help-card" onClick={() => ask('Necesito asistencia especial')}>
              <CircleHelp size={23} />
              <span><strong>¿Necesitas ayuda especial?</strong><small>Accesibilidad y asistencia</small></span>
              <ChevronRight size={19} />
            </button>
          </aside>
        </section>
      </main>

      <footer>
        <span>Guía AIFA · Información de orientación</span>
        <span>En una emergencia, acércate al personal del aeropuerto.</span>
      </footer>

      {menuOpen && (
        <div className="menu-backdrop" onClick={() => setMenuOpen(false)}>
          <aside className="drawer" onClick={(event) => event.stopPropagation()}>
            <button className="drawer-close" onClick={() => setMenuOpen(false)} aria-label="Cerrar menú"><X /></button>
            <span className="eyebrow">MENÚ</span>
            <h2>Todo lo que necesitas</h2>
            {['Mapa del aeropuerto', 'Vuelos', 'Transporte', 'Servicios', 'Contacto'].map((item) => (
              <button key={item} onClick={() => { ask(`Necesito información sobre ${item}`); setMenuOpen(false) }}>
                {item}<ChevronRight size={18} />
              </button>
            ))}
          </aside>
        </div>
      )}
    </div>
  )
}

