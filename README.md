# Guía AIFA

Asistente digital de orientación para el Aeropuerto Internacional Felipe Ángeles. La experiencia está diseñada como PWA para que los viajeros puedan abrirla al escanear un código QR y consultar puertas, baños, restaurantes, migración, transporte y otros servicios.

## Desarrollo

```bash
npm install
npm run dev
```

Para generar la versión de producción:

```bash
npm run build
npm run preview
```

## Estado actual

- Interfaz adaptable a teléfonos, tabletas y escritorio.
- Accesos rápidos para consultas comunes.
- Chat interactivo con respuestas locales de demostración.
- Menú lateral, sugerencias y estados de conversación.
- Manifest y service worker para instalación como PWA.

Las respuestas actuales son demostrativas. El siguiente paso de producto es conectar el chat con una fuente validada de mapas, servicios y vuelos del AIFA, además de un backend conversacional.
