# Galería de demos comerciales

El constructor es la fuente de autoría. Una demo no es un cliente ni genera facturación. La publicación comercial es explícita, posterior a la publicación de la landing y desactivada por defecto.

## Contrato público propuesto

Un manifiesto de solo lectura contiene exclusivamente id, título, rubro, URL HTTPS pública, imagen pública, texto alternativo y orden de demos autorizadas. Nunca exportar datos de clientes, credenciales, borradores, formularios privados ni identificadores internos de facturación. Validar permisos de administrador en servidor y comprobar que el destino pertenece a una demo publicada. Desactivar una demo retira su entrada del manifiesto. La galería comercial conserva contenido estático si el manifiesto no está disponible.

## Validación previa a integrar

- Crear y editar una demo sin cliente asociado.
- Publicar landing sin mostrarla automáticamente en la galería.
- Autorizar, ordenar y ocultar demos desde administrador.
- Rechazar intentos de publicación por usuarios cliente y URLs no autorizadas.
- Verificar que no se crean facturas, alertas de cobro ni cupos de cliente.
- Probar con datos ficticios y servicios aislados.
- Mantener fuera de la rama de estabilización hasta aprobar sus controles.

Estado: diseño del contrato; integración de constructor y manifiesto pendiente.
