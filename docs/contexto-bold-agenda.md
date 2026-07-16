# Contexto — Bold Agenda

> Fuente: PRD 2026-07-10 + Corte MVP/MRP (CPO 2026-07-08/09) + Decision Log de Pope + mockups aprobados (2026-07-08 a 2026-07-15) + este documento de contexto (Camilo, 2026-07-15/16).
> Propósito: que cualquier persona (o LLM) que entre a este proyecto parta del mismo estado, sin reabrir decisiones ya cerradas.

## Qué es Bold Agenda

Nueva vertical SaaS de Bold para negocios de servicios. Resuelve el ciclo completo de una cita:

**Cliente reserva → Profesional atiende → Se cobra → Se calcula comisión → Se consulta la venta.**

Ese loop es el corazón del proyecto. Todo lo demás es secundario.

## Segmento de lanzamiento

- **Vertical:** BEAUTY_SALOON / INDEPENDENT_STYLIST (barberías, salones de belleza, peluquerías, negocios donde trabajan varios profesionales).
- **Geografía:** Colombia primero (sin Perú por ahora).
- **Idioma:** es-CO como idioma fuente.
- **Piloto:** F&F (friends & family), 5 a 8 comercios.

## Personas

| Persona | Quién es | Qué quiere |
|---|---|---|
| **Dueño-operador** (decisor) | 1 sede, 2–8 empleados, baja sofisticación técnica, decide por WhatsApp | Agenda llena, menos no-shows, comisiones sin cuentas a mano |
| **Profesional** (uso diario) | Barbero, estilista, manicurista | Ver su día en el celular, cobrar rápido, confiar en su comisión |
| **Cliente final** (consumidor) | Quien reserva | Reservar desde WhatsApp/link en menos de 1 minuto, sin descargar app; recibir recordatorio; poder reprogramar solo |

Roles dentro del comercio: **admin** (ve todo, filtra, configura) y **colaborador** (ve solo lo suyo: su agenda, sus clientes, su comisión). El PRD ya no trata "Recepción" como rol independiente — usa permisos de admin.

## El loop de valor del MVP (piloto)

Reserva online → recordatorio automático por WhatsApp → check-in → cobro (datáfono/QR) → comisión calculada.

## Alcance del MVP

**SÍ incluye:**
- Pago total anticipado, **opcional y configurable por servicio** (toggle, no por reserva).
- Política de cancelación clara (ventana de cancelación, ej. 24h), aplicada como snapshot por cita.
- Cédula obligatoria en el formulario de reserva (no es llave técnica; el sistema usa un ID interno).
- Verificación de celular por OTP, con WhatsApp como canal principal y fallback a SMS.
- Recordatorios automáticos 24h y 2h antes de la cita.
- Look & feel Bold (Merlin) desde el día 1.
- Reserva pública vía **micrositio por link o QR** (decisión #42).
- Comisión calculada únicamente sobre el valor de los servicios (la propina no entra en el cálculo).
- Reportes básicos de cierre de semana (consolidado + detalle + export CSV).
- Bloqueo de disponibilidad por parte del profesional, con reflejo inmediato en el micrositio público.
- Editar/reasignar una cita (hora, profesional o servicio) sin cancelar-y-reagendar.

**NO incluye (diferido):**
- **Prepago parcial** → MRP. En MVP el pago anticipado es del total del servicio o no existe.
- **Retail** → MRP.
- **DIAN** → V1.5.
- **Multi-sede** → V1.5.
- **Walk-in / cola de espera (sin cita)** → MRP. Confirmado. El motor de cupos/concurrencia es el núcleo más delicado del sistema; no se toca en el MVP.
- **Split de pago entre varios profesionales** → fuera de alcance (no confundir con la división de pago técnica `payments[]`, que es un detalle de implementación reusado del monolito, no una feature de producto).
- **Reserva conversacional por WhatsApp** (reservar chateando) → siguiente versión. Esto es distinto de que WhatsApp exista como canal de infraestructura (ver abajo).
- **Card-on-file / cobro de penalidad post-facto** → V1.5.

## El matiz de WhatsApp (para no reabrir esto)

Diferido: solo el **canal conversacional de reserva** — que el cliente reserve chateando con un bot.
Vigente en MVP, como infraestructura de mensajería:
- **OTP de verificación** del celular, con WhatsApp como canal principal y SMS como fallback (timing en discusión con Ingeniería).
- **Recordatorios automáticos** 24h y 2h antes de la cita — la palanca principal contra el no-show, y una de las métricas aprobadas del piloto.
- **Confirmaciones y avisos** (cita confirmada, cambios, cancelaciones), con fallback WhatsApp → SMS → email.

## Objeto central: la cita

Todo el producto gira alrededor de la cita (Appointment). Vive en una sola sede, pertenece a un único profesional (sin split). Tiene tres estados que son **independientes entre sí** aunque el gesto de cierre los resuelva en un solo paso de UI:
- **Estado de la cita:** confirmada → completada / no-show / reprogramada.
- **Estado de pago:** pendiente / pagado (anticipado o al cierre).
- **Estado de comisión:** se deriva automáticamente al cerrar la cita, no se digita.

La política de cancelación y el precio viajan **como snapshot dentro de la cita** en el momento de la reserva — un cambio posterior en configuración no altera citas ya creadas.

## Pricing (decisión cerrada, no reabrir en el piloto)

Tier plano por sede, aplica desde el MRP (el piloto F&F corre fuera de este esquema):
- **Starter:** gratis, 1 profesional, sin recordatorios (hipótesis experimental).
- **Pro:** COP 79.900 + IVA — recordatorios WhatsApp incluidos, sin tope.
- **Premium:** COP 179.900 + IVA — recordatorios WhatsApp incluidos, sin tope.

Cobro anual upfront con link de pago.

> ⚠️ Ver `decisiones-abiertas.md`: hay una tensión entre "Starter sin recordatorios" y la métrica de reducción de no-show del piloto, que vale la pena aclarar antes de que el prototipo muestre planes.

## Arquitectura de datos (decisión cerrada)

Servicio dedicado de citas en `bold-backend` (mismo patrón que POS Restaurantes) + front door público separado para el micrositio. Cero double-booking garantizado a nivel de datos (constraint anti double-booking + HELD con TTL de 10 min mientras el cliente completa la reserva).

## Métricas del piloto (aprobadas)

- Activación: ≥ 6 de 8 comercios.
- ≥ 15 citas por comercio por semana.
- Reducción de no-show ≥ 30%, atribuible solo a los recordatorios.
- Entrega de WhatsApp ≥ 95%.
- Uso del calendario ≥ 4 de 7 días.

## Principios de Bold aplicables a este proyecto

De `principios-ux-bold.md`, los más relevantes para Agenda:
- **El objeto central manda** → la cita siempre visible, accesible y consistente en las tres superficies.
- **Estados visibles** → cita, pago y comisión muestran su estado explícito (ícono + texto + color), nunca solo color.
- **Más rápido que la alternativa** → hoy estos negocios operan con papel, WhatsApp o Excel; el checkout de un solo gesto (estado + cobro) es la aplicación directa de este principio.
- **Precisión y fidelidad de la información** → comisión y venta se derivan del mismo dato, nunca se recalculan por separado (evita disputas de pago, ver F5).

## Referencia de fuentes

- PDF "Flujos de datos F0–F7" (v1.0, 14 jul 2026, PM Juan Sebastián) — nivel de flujo de datos, insumo, no arquitectura de navegación.
- Mockups Coda: Página de reservas (3 variantes, elegida B), Agenda del staff (3 variantes, elegida C), Cierre del servicio + Configuración, Agenda mobile, Micrositio + Clientes (PM 2026-07-15).
- Brief de Camilo (Product Designer Senior, líder de experiencia — no PM, no arquitecto, no Frontend) para trabajar con Claude Code.
