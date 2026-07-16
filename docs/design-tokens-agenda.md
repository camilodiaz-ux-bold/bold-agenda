# Design tokens — Bold Agenda

> Derivado de los mockups ya aprobados en Coda (2026-07-08 a 2026-07-15), no de una extracción directa de Figma/Merlin. Si Merlin cambia un token de producción, este archivo se actualiza a mano contra el mockup vigente — no se asume ni se inventa.
>
> Regla de capas (heredada del proceso Bold Makers): estos tokens de **estilo** son la única fuente de verdad visual del prototipo. Cualquier pantallazo de referencia adicional que se use más adelante aporta solo **arquitectura** (navegación, jerarquía, ubicación de acciones), nunca estilo.

## Color

| Token | Valor | Uso |
|---|---|---|
| `--color-primary` | `#E8194B` | Coral Bold — token de producto/UI (botones primarios, acentos, estado activo). Fuente: Merlin/Alejandría. |
| `--color-navy` | `#121E6C` | Azul marca — logo sólido, textos de marca, elementos de alta jerarquía. |
| `--color-gradient-start` | `#FF2947` | Stop del gradiente del logo (variante coral→azul). Solo para piezas de marca destacadas (splash, login, bienvenida), nunca decorativo en UI funcional. |
| `--color-success` | verde (confirmada / completada / pagado) | Badges de estado positivo |
| `--color-danger` | rojo/coral (no-show / cancelar) | Badges de estado negativo, acciones destructivas |
| `--color-warning` | amarillo (hueco libre, alertas de conflicto) | Avisos no destructivos |
| `--color-info` | azul claro (confirmada, notas informativas) | Estados neutros/informativos |

> ⚠️ Discrepancia abierta, heredada de `marca-bold.md`: el coral de producto es `#E8194B`, pero el SVG oficial del logo usa `#FF2947` como stop de gradiente. Ambos se mantienen separados a propósito — no unificar sin validación del UX Team en Etapa 2.

## Tipografía

- **Familia:** Montserrat (marca) — cargada por Google Fonts o fallback de sistema.
- **Jerarquía observada en mockups:** títulos de sección en bold navy, labels en gris tenue mayúscula pequeña (ej. "Servicio", "Profesional"), valores en bold navy, montos siempre en bold.

## Forma y espaciado

- **Cards:** radio 16px.
- **Botones:** forma pill (border-radius completo), primer plano coral para la acción principal (CTA), secundario en outline/navy.
- **Touch targets:** mínimo 44×44px en toda superficie mobile.

## Componentes observados (para reutilizar, no reinventar)

### Badges de estado
Siempre **ícono + texto + color** — nunca solo color (regla dura de accesibilidad). Set de íconos: Lucide.

| Estado | Badge |
|---|---|
| Confirmada | ícono calendario + "confirmada" + azul |
| Completada | ícono check + "completada" + verde |
| Pagado | ícono reloj/check circular + "pagado" + rojo/coral |
| No-show | ícono persona-x + "no-show" + rojo |

> Nota de los mockups A/B (agenda): en vistas densas de timeline, las cards de cita completada/no-show pueden recortar el badge de texto (queda solo el color del borde) — esto rompe la regla "nunca solo color". La variante C (elegida) no tiene este problema porque muestra todos los badges completos; mantenerlo así si se itera el layout.

### Wizard de reserva (micrositio, Variante B)
- Barra de progreso de 4 segmentos + label "Paso X de 4".
- Resumen editable de selecciones previas arriba de cada paso ("Servicio: Corte de dama · $45.000 · Editar").
- Grid de horarios disponibles: slots ocupados tachados/deshabilitados, slot seleccionado en coral relleno.
- CTA inferior fijo, pill, coral, con ícono de flecha.

### Agenda (Variante C)
- Strip semanal horizontal (L a D) con indicador de día activo y punto si hay citas ese día.
- Fila de 3 métricas (citas totales, confirmadas, ingresos estimados) inmediatamente debajo del selector de fecha.
- Selector "Todos" + chip por colaborador (solo visible/útil en vista admin).
- Lista cronológica agrupada por hora, cada cita como card con barra de color lateral por profesional, badge de estado a la derecha.
- Indicador visual "ahora" cruzando la lista en la hora actual.
- FAB / CTA "+ Nueva cita".
- Slots vacíos como placeholder invitando a agendar ("Tarde libre — agendar una cita").

### Drawer de cierre del servicio
- Título "Cierre del servicio" + pregunta "¿Cómo terminó la cita?".
- Paso 1: dos opciones tipo card-radio (Completado / El cliente no llegó) + link secundario "¿La cita se movió? Reprogramar para otro día".
- Paso 2: resumen de cobro (línea de servicio + línea de propina + total en bold) → selector de propina (chips: Sin propina / 5% / 10% / Otra) → selector de método de pago (datáfono / QR / link, como opciones tipo card-radio con ícono) → nota condicional si ya estaba pagado por adelantado → CTA final con el monto ("Cobrar $47.250").

### Configuración (Ajustes)
- Banner informativo superior (ícono estrella) para el contexto white-glove del piloto.
- Cards por sección: Perfil del negocio, Equipo, Servicios (tabla con toggle de pago anticipado por fila), Política de reservas (ventana de cancelación + lista de toggles por servicio).
- Cada sección con botón "Editar" o chevron de expansión en mobile.

### Ventas
- Selector de período (Hoy / Semana / Mes) como tabs pill.
- 4 tarjetas de consolidado (total vendido, # ventas, propinas, comisiones).
- Lista de detalle por venta: servicio, profesional, fecha/hora, monto, badge de estado de pago, badge del método usado.

### Clientes
- Buscador por nombre o celular.
- Lista con avatar (iniciales + color por persona), nombre, celular, última visita, gasto acumulado.
- Ficha individual: identificación, gasto acumulado + # visitas destacado, historial de visitas (servicio, fecha, con quién, monto), notas y preferencias con atribución (quién la dejó, cuándo).

### Micrositio público — landing y gestionar cita
- Landing: avatar circular con iniciales del negocio, nombre, dirección, horario, lista de servicios con precio y badge "Pago anticipado" si aplica, avatares del equipo, nota "¿Ya tienes una reserva? Gestiónala desde el enlace que te llegó por WhatsApp", CTA final "Reservar cita".
- Gestionar cita: resumen de la cita (servicio, con quién, badge de estado, fecha/hora/duración, dirección, total con badge "Prepagado" si aplica), botón "Cambiar fecha u hora", botón "Cancelar cita" (outline, texto rojo), nota de política de cancelación, y al confirmar cancelación: card de confirmación con ícono de alerta, texto claro de qué pasa con el dinero según la ventana, botones "Volver" / "Sí, cancelar".
- Footer "Con tecnología de [logo Bold]" en ambas pantallas del micrositio.

## Datos de ejemplo (para mantener consistencia entre pantallas del prototipo)

Usar el mismo comercio de referencia en todas las pantallas: **Salón Camila**, Carrera 13 #85-24, Chapinero, Bogotá. Equipo: Camila Vargas (estilista, dueña), Valentina Ruiz (colorista), Andrés Mora (manicura y pedicura). Servicios: Corte de dama ($45.000/60min), Corte caballero ($30.000/45min), Balayage ($220.000/180min, pago anticipado), Tinte raíz ($95.000/90min), Manicure ($38.000/45min).

## Íconos

Lucide, exclusivamente, vía CDN. Tamaños: 24×24 estándar, 20×20 para chevrons. No es el set oficial de Merlin, es aproximación válida para prototipo — fidelidad exacta se resuelve en Etapa 2.

## Emojis

Prohibidos en toda la UI, sin excepción — heredado de `stack-prototipado.md`.

## Marca

Logo Bold como SVG inline, nunca como imagen externa ni placeholder. Variante azul sólido por defecto; gradiente solo en piezas destacadas (no aplica aquí salvo que se diseñe una pantalla de splash/login, que no está en el alcance actual del prototipo).
