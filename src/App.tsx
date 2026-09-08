import { FormEvent, useEffect, useRef, useState } from 'react'
import {
  ArrowRight,
  ArrowLeft,
  Accessibility,
  Bath,
  Bot,
  BusFront,
  ChevronRight,
  Clock3,
  Coffee,
  Languages,
  MapPin,
  Menu,
  Navigation,
  Plane,
  Send,
  ShieldCheck,
  Sparkles,
  Square,
  Utensils,
  Volume2,
  X,
} from 'lucide-react'
import AssistantAvatar from './components/AssistantAvatar'
import { getAirportDirectoryNotice, getAssistantResponse } from './services/assistant'
import type { Language } from './types/airport'

type Message = { id: number; from: 'assistant' | 'user'; text: string }

const translations = {
  es: {
    brandTagline: 'Tu viaje, más sencillo',
    location: 'Estás en el AIFA',
    heroFirst: '¿A dónde',
    heroAccent: 'quieres llegar?',
    heroText: 'Te ayudo a moverte por el aeropuerto de forma fácil, rápida y sin complicaciones.',
    quickEyebrow: 'ACCESOS RÁPIDOS',
    quickTitle: '¿Qué estás buscando?',
    assistantEyebrow: 'TU GUÍA DIGITAL',
    assistantTitle: 'Orientación en un solo mensaje',
    assistantText: 'Pregunta con tus propias palabras. Te ayudaré a encontrar servicios y zonas dentro del aeropuerto.',
    openAssistant: 'Abrir asistente',
    timeEyebrow: 'TIEMPO ESTIMADO',
    security: 'Filtro de seguridad',
    estimate: 'Entre 10 y 15 minutos',
    tipEyebrow: 'TIP DEL VIAJERO',
    tipTitle: 'Ten a la mano tu pase de abordar',
    tipText: 'Así podré ayudarte a ubicar tu puerta y encontrar la mejor ruta.',
    findGate: 'Buscar mi puerta',
    helpTitle: '¿Necesitas ayuda especial?',
    helpText: 'Accesibilidad y asistencia',
    menuEyebrow: 'MENÚ',
    menuTitle: 'Todo lo que necesitas',
    footer: 'Guía AIFA · Información de orientación',
    emergency: 'En una emergencia, acércate al personal del aeropuerto.',
    chatTitle: 'Asistente AIFA',
    online: 'En línea · Listo para ayudarte',
    suggested: 'Preguntas sugeridas',
    placeholder: 'Escribe tu pregunta…',
    privacy: 'No compartas información personal o sensible.',
    closeChat: 'Cerrar asistente',
    openChat: 'Abrir asistente AIFA',
    listen: 'Escuchar respuesta',
    stopListening: 'Detener lectura',
    send: 'Enviar mensaje',
    greeting: '¡Hola! Soy tu guía en el AIFA. Dime a dónde quieres ir y te acompaño paso a paso.',
    unread: 'Nueva respuesta',
    splashEyebrow: 'BIENVENIDO AL AIFA',
    splashTitle: '¿Necesitas ayuda?',
    splashText: 'Pregúntame lo que necesites. Estoy aquí para orientarte.',
    splashAction: 'Comenzar',
    previousOptions: 'Opciones anteriores',
    nextOptions: 'Más opciones',
  },
  en: {
    brandTagline: 'Making your journey easier',
    location: 'You are at AIFA',
    heroFirst: 'Where do you',
    heroAccent: 'want to go?',
    heroText: 'I help you move around the airport easily, quickly, and without complications.',
    quickEyebrow: 'QUICK ACCESS',
    quickTitle: 'What are you looking for?',
    assistantEyebrow: 'YOUR DIGITAL GUIDE',
    assistantTitle: 'Directions in one message',
    assistantText: 'Ask in your own words. I will help you find services and areas inside the airport.',
    openAssistant: 'Open assistant',
    timeEyebrow: 'ESTIMATED TIME',
    security: 'Security checkpoint',
    estimate: 'About 10 to 15 minutes',
    tipEyebrow: 'TRAVEL TIP',
    tipTitle: 'Keep your boarding pass handy',
    tipText: 'This helps me locate your gate and find the best route.',
    findGate: 'Find my gate',
    helpTitle: 'Need special assistance?',
    helpText: 'Accessibility and assistance',
    menuEyebrow: 'MENU',
    menuTitle: 'Everything you need',
    footer: 'AIFA Guide · Wayfinding information',
    emergency: 'In an emergency, contact airport staff.',
    chatTitle: 'AIFA Assistant',
    online: 'Online · Ready to help',
    suggested: 'Suggested questions',
    placeholder: 'Type your question…',
    privacy: 'Do not share personal or sensitive information.',
    closeChat: 'Close assistant',
    openChat: 'Open AIFA assistant',
    listen: 'Listen to response',
    stopListening: 'Stop reading',
    send: 'Send message',
    greeting: 'Hello! I am your AIFA guide. Tell me where you want to go and I will guide you step by step.',
    unread: 'New response',
    splashEyebrow: 'WELCOME TO AIFA',
    splashTitle: 'Need some help?',
    splashText: 'Ask me anything you need. I am here to guide you.',
    splashAction: 'Get started',
    previousOptions: 'Previous options',
    nextOptions: 'More options',
  },
} as const

const quickActions = [
  {
    label: { es: 'Mi puerta', en: 'My gate' },
    prompt: { es: '¿Dónde está mi puerta de abordaje?', en: 'Where is my boarding gate?' },
    icon: Plane,
    color: 'coral',
  },
  {
    label: { es: 'Baños', en: 'Restrooms' },
    prompt: { es: '¿Dónde están los baños más cercanos?', en: 'Where are the nearest restrooms?' },
    icon: Bath,
    color: 'blue',
  },
  {
    label: { es: 'Comida', en: 'Food' },
    prompt: { es: 'Quiero encontrar restaurantes y cafeterías', en: 'I want to find restaurants and coffee shops' },
    icon: Utensils,
    color: 'gold',
  },
  {
    label: { es: 'Migración', en: 'Immigration' },
    prompt: { es: '¿Cómo llego a migración?', en: 'How do I get to immigration?' },
    icon: ShieldCheck,
    color: 'green',
  },
  {
    label: { es: 'Mexibús', en: 'Mexibus' },
    prompt: { es: '¿Cómo llego al Mexibús?', en: 'How do I get to the Mexibus?' },
    icon: BusFront,
    color: 'purple',
  },
  {
    label: { es: 'Asistencia', en: 'Assistance' },
    prompt: { es: 'Necesito asistencia especial', en: 'I need special assistance' },
    icon: Accessibility,
    color: 'pink',
  },
] as const

const suggested = {
  es: ['¿Dónde documento mi equipaje?', '¿Cómo llego al Mexibús?', 'Necesito asistencia especial'],
  en: ['Where do I check my baggage?', 'How do I get to the Mexibus?', 'I need special assistance'],
}

const menuItems = [
  { label: { es: 'Mapa del aeropuerto', en: 'Airport map' }, prompt: { es: 'Necesito el mapa del aeropuerto', en: 'I need the airport map' } },
  { label: { es: 'Vuelos', en: 'Flights' }, prompt: { es: 'Necesito información sobre vuelos', en: 'I need flight information' } },
  { label: { es: 'Transporte', en: 'Transportation' }, prompt: { es: 'Necesito información sobre transporte', en: 'I need transportation information' } },
  { label: { es: 'Servicios', en: 'Services' }, prompt: { es: '¿Qué servicios puedo encontrar?', en: 'What services can I find?' } },
  { label: { es: 'Contacto', en: 'Contact' }, prompt: { es: 'Necesito contactar al personal del aeropuerto', en: 'I need to contact airport staff' } },
] as const

export default function App() {
  const [language, setLanguage] = useState<Language>(() => localStorage.getItem('aifa-language') === 'en' ? 'en' : 'es')
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, from: 'assistant', text: translations[language].greeting },
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [chatOpen, setChatOpen] = useState(() => window.location.hash === '#assistant')
  const [hasUnread, setHasUnread] = useState(false)
  const [speakingMessageId, setSpeakingMessageId] = useState<number | null>(null)
  const [showSplash, setShowSplash] = useState(() => sessionStorage.getItem('aifa-splash-seen') !== 'true')
  const [carouselPaused, setCarouselPaused] = useState(false)
  const chatEnd = useRef<HTMLDivElement>(null)
  const carouselRef = useRef<HTMLDivElement>(null)
  const chatOpenRef = useRef(chatOpen)
  const requestIdRef = useRef(0)
  const ui = translations[language]
  const speechSupported = typeof window !== 'undefined' && 'speechSynthesis' in window

  useEffect(() => {
    chatOpenRef.current = chatOpen
    document.body.classList.toggle('assistant-open', chatOpen)
    if (chatOpen) setHasUnread(false)
  }, [chatOpen])

  useEffect(() => {
    document.documentElement.lang = language === 'es' ? 'es-MX' : 'en-US'
  }, [language])

  useEffect(() => {
    chatEnd.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping, chatOpen])

  useEffect(() => () => window.speechSynthesis?.cancel(), [])

  useEffect(() => {
    if (!showSplash) return
    const timer = window.setTimeout(() => {
      setShowSplash(false)
      sessionStorage.setItem('aifa-splash-seen', 'true')
    }, 1800)
    return () => window.clearTimeout(timer)
  }, [showSplash])

  useEffect(() => {
    if (carouselPaused || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const interval = window.setInterval(() => {
      const carousel = carouselRef.current
      const firstCard = carousel?.firstElementChild as HTMLElement | null
      if (!carousel || !firstCard) return
      const gap = Number.parseFloat(getComputedStyle(carousel).columnGap) || 0
      const step = firstCard.getBoundingClientRect().width + gap
      const atEnd = carousel.scrollLeft + carousel.clientWidth >= carousel.scrollWidth - 4
      carousel.scrollTo({ left: atEnd ? 0 : carousel.scrollLeft + step, behavior: 'smooth' })
    }, 4500)
    return () => window.clearInterval(interval)
  }, [carouselPaused])

  const dismissSplash = () => {
    setShowSplash(false)
    sessionStorage.setItem('aifa-splash-seen', 'true')
  }

  const pauseCarousel = () => setCarouselPaused(true)

  const moveCarousel = (direction: -1 | 1) => {
    pauseCarousel()
    const carousel = carouselRef.current
    const firstCard = carousel?.firstElementChild as HTMLElement | null
    if (!carousel || !firstCard) return
    const gap = Number.parseFloat(getComputedStyle(carousel).columnGap) || 0
    carousel.scrollBy({ left: direction * (firstCard.getBoundingClientRect().width + gap), behavior: 'smooth' })
  }

  const openAssistant = () => {
    setChatOpen(true)
    setHasUnread(false)
  }

  const closeAssistant = () => {
    setChatOpen(false)
    window.speechSynthesis?.cancel()
    setSpeakingMessageId(null)
  }

  const changeLanguage = (nextLanguage: Language) => {
    if (nextLanguage === language) return
    requestIdRef.current += 1
    window.speechSynthesis?.cancel()
    setSpeakingMessageId(null)
    setLanguage(nextLanguage)
    localStorage.setItem('aifa-language', nextLanguage)
    setMessages([{ id: Date.now(), from: 'assistant', text: translations[nextLanguage].greeting }])
    setInput('')
    setIsTyping(false)
  }

  const ask = (text: string) => {
    const clean = text.trim()
    if (!clean || isTyping) return
    const activeLanguage = language
    const activeRequest = ++requestIdRef.current
    openAssistant()
    setMessages((current) => [...current, { id: Date.now(), from: 'user', text: clean }])
    setInput('')
    setIsTyping(true)

    window.setTimeout(() => {
      if (requestIdRef.current !== activeRequest) return
      const response = getAssistantResponse(clean, activeLanguage)
      setMessages((current) => [
        ...current,
        { id: Date.now() + 1, from: 'assistant', text: response },
      ])
      setIsTyping(false)
      if (!chatOpenRef.current) setHasUnread(true)
    }, 500)
  }

  const submit = (event: FormEvent) => {
    event.preventDefault()
    ask(input)
  }

  const toggleSpeech = (message: Message) => {
    if (!speechSupported) return
    window.speechSynthesis.cancel()

    if (speakingMessageId === message.id) {
      setSpeakingMessageId(null)
      return
    }

    const utterance = new SpeechSynthesisUtterance(message.text)
    utterance.lang = language === 'es' ? 'es-MX' : 'en-US'
    const preferredVoice = window.speechSynthesis
      .getVoices()
      .find((voice) => voice.lang.toLowerCase().startsWith(language))
    if (preferredVoice) utterance.voice = preferredVoice
    utterance.rate = 0.96
    utterance.onstart = () => setSpeakingMessageId(message.id)
    utterance.onend = () => setSpeakingMessageId(null)
    utterance.onerror = () => setSpeakingMessageId(null)
    window.speechSynthesis.speak(utterance)
  }

  return (
    <div className={`app-shell ${chatOpen ? 'chat-open' : ''}`}>
      <header className="topbar">
        <a className="brand" href="#inicio" aria-label="Guía AIFA">
          <span className="brand-mark"><Plane size={22} strokeWidth={2.4} /></span>
          <span>
            <strong>Guía AIFA</strong>
            <small>{ui.brandTagline}</small>
          </span>
        </a>
        <div className="header-actions">
          <div className="language-selector" aria-label="Language / Idioma">
            <Languages size={16} aria-hidden="true" />
            {(['es', 'en'] as Language[]).map((option) => (
              <button
                key={option}
                className={language === option ? 'active' : ''}
                onClick={() => changeLanguage(option)}
                aria-pressed={language === option}
              >
                {option.toUpperCase()}
              </button>
            ))}
          </div>
          <button className="menu-button" aria-label={ui.menuTitle} onClick={() => setMenuOpen(true)}>
            <Menu size={23} />
          </button>
        </div>
      </header>

      <main id="inicio">
        <section className="hero">
          <div className="hero-orbit orbit-one" />
          <div className="hero-orbit orbit-two" />
          <div className="hero-content">
            <div className="location-pill"><MapPin size={15} /> {ui.location}</div>
            <h1>{ui.heroFirst}<br /><em>{ui.heroAccent}</em></h1>
            <p>{ui.heroText}</p>
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
                  <span className="eyebrow">{ui.quickEyebrow}</span>
                  <h2 id="quick-title">{ui.quickTitle}</h2>
                </div>
                <div className="carousel-controls">
                  <button onClick={() => moveCarousel(-1)} aria-label={ui.previousOptions}><ArrowLeft size={18} /></button>
                  <button onClick={() => moveCarousel(1)} aria-label={ui.nextOptions}><ArrowRight size={18} /></button>
                </div>
              </div>
              <div
                className="quick-carousel"
                ref={carouselRef}
                onPointerDown={pauseCarousel}
                onWheel={pauseCarousel}
                role="list"
                aria-label={ui.quickTitle}
              >
                {quickActions.map(({ label, prompt, icon: Icon, color }) => (
                  <button className="quick-card" role="listitem" key={label.es} onClick={() => ask(prompt[language])}>
                    <span className={`quick-icon ${color}`}><Icon size={24} /></span>
                    <span>{label[language]}</span>
                    <ChevronRight size={17} className="quick-arrow" />
                  </button>
                ))}
              </div>
            </section>

            <section className="assistant-teaser" aria-labelledby="assistant-teaser-title">
              <div className="teaser-bot" aria-hidden="true">
                <AssistantAvatar size="medium" />
                <span className="bot-spark"><Sparkles size={13} /></span>
              </div>
              <div className="teaser-copy">
                <span className="eyebrow">{ui.assistantEyebrow}</span>
                <h2 id="assistant-teaser-title">{ui.assistantTitle}</h2>
                <p>{ui.assistantText}</p>
              </div>
              <button className="primary-button" onClick={openAssistant}>
                <Bot size={18} /> {ui.openAssistant} <ArrowRight size={17} />
              </button>
            </section>
          </div>

          <aside className="side-column">
            <div className="info-card">
              <div className="info-icon"><Clock3 size={22} /></div>
              <div><small>{ui.timeEyebrow}</small><strong>{ui.security}</strong><span>{ui.estimate}</span></div>
            </div>
            <div className="tip-card">
              <span className="eyebrow">{ui.tipEyebrow}</span>
              <h3>{ui.tipTitle}</h3>
              <p>{ui.tipText}</p>
              <button onClick={() => ask(quickActions[0].prompt[language])}>{ui.findGate} <ArrowRight size={17} /></button>
              <Coffee className="tip-illustration" size={85} strokeWidth={1.2} />
            </div>
          </aside>
        </section>
      </main>

      <footer>
        <span>{ui.footer}</span>
        <span>{ui.emergency}</span>
      </footer>

      {chatOpen && (
        <section className="assistant-panel" role="dialog" aria-modal="true" aria-labelledby="chat-title">
          <div className="chat-header">
            <AssistantAvatar size="small" />
            <div>
              <h2 id="chat-title">{ui.chatTitle}</h2>
              <span className="online"><i /> {ui.online}</span>
            </div>
            <button className="panel-close" onClick={closeAssistant} aria-label={ui.closeChat}><X size={21} /></button>
          </div>

          <div className="messages" aria-live="polite">
            {messages.map((message) => (
              <div className={`message-row ${message.from}`} key={message.id}>
                {message.from === 'assistant' && <AssistantAvatar size="mini" />}
                <div className="message-stack">
                  <div className="message-bubble">{message.text}</div>
                  {message.from === 'assistant' && speechSupported && (
                    <button
                      className={`speak-button ${speakingMessageId === message.id ? 'speaking' : ''}`}
                      onClick={() => toggleSpeech(message)}
                      aria-label={speakingMessageId === message.id ? ui.stopListening : ui.listen}
                      title={speakingMessageId === message.id ? ui.stopListening : ui.listen}
                    >
                      {speakingMessageId === message.id ? <Square size={12} fill="currentColor" /> : <Volume2 size={15} />}
                      <span>{speakingMessageId === message.id ? ui.stopListening : ui.listen}</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="message-row assistant">
                <AssistantAvatar size="mini" />
                <div className="message-bubble typing"><i /><i /><i /></div>
              </div>
            )}
            <div ref={chatEnd} />
          </div>

          <div className="chat-composer">
            <div className="suggestions" aria-label={ui.suggested}>
              {suggested[language].map((item) => <button key={item} onClick={() => ask(item)}>{item}</button>)}
            </div>
            <form className="chat-form" onSubmit={submit}>
              <input
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder={ui.placeholder}
                aria-label={ui.placeholder}
                autoComplete="off"
              />
              <button className="send-button" type="submit" aria-label={ui.send} disabled={!input.trim() || isTyping}>
                <Send size={18} />
              </button>
            </form>
            <p className="privacy-note">{ui.privacy}</p>
            <p className="directory-note">{getAirportDirectoryNotice(language)}</p>
          </div>
        </section>
      )}

      <button
        className={`assistant-fab ${hasUnread ? 'has-unread' : ''}`}
        onClick={() => chatOpen ? closeAssistant() : openAssistant()}
        aria-label={chatOpen ? ui.closeChat : ui.openChat}
        aria-expanded={chatOpen}
      >
        <span className="fab-icon">{chatOpen ? <X size={27} /> : <AssistantAvatar size="small" />}</span>
        {!chatOpen && <span className="fab-label">{ui.chatTitle}</span>}
        {hasUnread && <span className="unread-dot"><span className="sr-only">{ui.unread}</span></span>}
      </button>

      {showSplash && (
        <div className="splash-screen" role="status" aria-live="polite" onClick={dismissSplash}>
          <div className="splash-glow splash-glow-one" />
          <div className="splash-glow splash-glow-two" />
          <div className="splash-content" onClick={(event) => event.stopPropagation()}>
            <AssistantAvatar size="large" />
            <span className="splash-eyebrow">{ui.splashEyebrow}</span>
            <h1>{ui.splashTitle}</h1>
            <p>{ui.splashText}</p>
            <button onClick={dismissSplash}>{ui.splashAction}<ArrowRight size={18} /></button>
            <span className="splash-progress" aria-hidden="true"><i /></span>
          </div>
        </div>
      )}

      {menuOpen && (
        <div className="menu-backdrop" onClick={() => setMenuOpen(false)}>
          <aside className="drawer" onClick={(event) => event.stopPropagation()}>
            <button className="drawer-close" onClick={() => setMenuOpen(false)} aria-label={ui.closeChat}><X /></button>
            <span className="eyebrow">{ui.menuEyebrow}</span>
            <h2>{ui.menuTitle}</h2>
            {menuItems.map((item) => (
              <button key={item.label.es} onClick={() => { ask(item.prompt[language]); setMenuOpen(false) }}>
                {item.label[language]}<ChevronRight size={18} />
              </button>
            ))}
          </aside>
        </div>
      )}
    </div>
  )
}
