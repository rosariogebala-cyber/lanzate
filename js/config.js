/* Datos editables del sitio: precios, links de pago y contacto.
   En "mp" va el link de pago de Mercado Pago de cada plan (Mercado Pago → Cobrar → Link de pago).
   Mientras esté vacío, el botón abre un mail con el plan elegido. */
window.SITE = {
  marca: "Lanzate",
  email: "hola@example.com",
  whatsapp: "5491123456789",
  /* Medición: pegá acá los IDs cuando los tengas. Mientras estén vacíos no se carga nada.
     ga4: el "ID de medición" de Google Analytics (G-XXXXXXX).
     metaPixel: el número del Píxel de Meta (Administrador de eventos de Meta). */
  medicion: {
    ga4: "",
    metaPixel: ""
  },
  /* Datos fiscales: se muestran en el pie y en las páginas legales cuando están completos.
     dataFiscal es el link del QR de "Data Fiscal" que da ARCA. */
  legal: {
    razonSocial: "",
    cuit: "",
    domicilio: "",
    dataFiscal: ""
  },
  promo: {
    activa: true,
    texto: "Precio de lanzamiento para los primeros clientes",
    hasta: "30 de noviembre"
  },
  planes: [
    {
      id: "express",
      nombre: "Express",
      para: "Para salir online ya, con lo esencial para que te contacten.",
      inicial: 149000,
      mensual: 15000,
      entrega: "Entrega rápida",
      mp: "",
      incluye: [
        "Hasta 6 secciones con módulos prediseñados",
        "Portal privado para editar campos habilitados",
        "Vista previa y publicación sujeta a validaciones",
        "Diseño adaptado a celular, tablet y compu",
        "Botón de WhatsApp siempre visible",
        "Hosting y certificado de seguridad (SSL)",
        "Subdominio tunegocio.lanzate.com.ar",
        "1 cambio asistido por mes (no acumulable)"
      ]
    },
    {
      id: "negocio",
      nombre: "Negocio",
      para: "Para que te encuentren en Google y te elijan frente a la competencia.",
      inicial: 249000,
      mensual: 25000,
      entrega: "Entrega rápida",
      destacado: true,
      mp: "",
      incluye: [
        "Todo lo incluido en Express",
        "Dominio propio .com.ar incluido",
        "Formulario de contacto a tu mail",
        "Mapa, horarios y reseñas de Google",
        "Asistencia inicial para configurar Google Business Profile, sujeta a verificación de Google",
        "3 cambios asistidos por mes (no acumulables)"
      ]
    },
    {
      id: "pro",
      nombre: "Pro",
      para: "Para vender más: turnos online, más secciones y medición de resultados.",
      inicial: 399000,
      mensual: 39000,
      entrega: "Entrega prioritaria",
      mp: "",
      incluye: [
        "Todo lo incluido en Negocio",
        "Hasta 12 secciones a elección",
        "Módulo de solicitud de turnos estándar, sin gestión avanzada",
        "Galería de fotos y videos",
        "Configuración de analítica con cuentas y consentimientos del cliente",
        "Resumen de visitas cuando la medición esté configurada",
        "10 cambios asistidos por mes (no acumulables)"
      ]
    }
  ],
  comparar: [
    ["Entrega", "Rápida", "Rápida", "Prioritaria"],
    ["Secciones", "Hasta 6", "Hasta 8", "Hasta 12"],
    ["Dominio propio .com.ar", false, true, true],
    ["Hosting y SSL", true, true, true],
    ["Botón de WhatsApp", true, true, true],
    ["Formulario de contacto", false, true, true],
    ["Mapa y reseñas de Google", false, true, true],
    ["Alta en Google Maps", false, true, true],
    ["Solicitud de turnos estándar", false, false, true],
    ["Analytics y Píxel de Meta", false, false, true],
    ["Portal privado de edición", true, true, true],
    ["Vista previa de cambios", true, true, true],
    ["Publicación con validaciones", true, true, true],
    ["Ediciones propias en campos habilitados", "Sin límite de ediciones", "Sin límite de ediciones", "Sin límite de ediciones"],
    ["Cambios asistidos por mes", "1", "3", "10"],
    ["Backend o integraciones a medida", "Se cotiza aparte", "Se cotiza aparte", "Se cotiza aparte"]
  ]
};
