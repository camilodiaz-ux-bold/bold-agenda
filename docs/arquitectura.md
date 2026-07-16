# Arquitectura — Bold Agenda

> Cómo se organiza la navegación, qué vive en cada superficie, y dónde cae cada flujo F0–F7 del documento de flujos de datos. Este archivo es el mapa; el `contexto-bold-agenda.md` es el porqué.

## Dos superficies, no una

Bold Agenda no es una sola app: son **dos superficies con usuarios y sesión distintos**, que comparten datos pero no navegación.

```
┌─────────────────────────────┐        ┌─────────────────────────────┐
│   MICROSITIO PÚBLICO         │        │      APP DEL OPERADOR        │
│   (cliente final, sin cuenta)│        │  (dueño/admin/profesional,   │
│   entrada: link o QR         │        │   con sesión)                 │
└─────────────────────────────┘        └─────────────────────────────┘
```

## 1. Micrositio público (cliente final)

Sin cuenta, sin contraseña. Tres pantallas encadenadas:

1. **Landing del salón** — branding (nombre, dirección, horario), carta de servicios (nombre, duración, precio, badge "pago anticipado" si aplica), equipo, CTA "Reservar cita".
2. **Wizard de reserva** (Variante B — aprobada, 4 pasos, barra de progreso, resumen editable):
   1. Servicio
   2. Profesional (o "cualquiera")
   3. Fecha y hora
   4. Datos del cliente (nombre, cédula, celular) → verificación OTP → pago si el servicio lo exige → confirmación
3. **Gestionar cita** (manage-link firmado, llega por WhatsApp con la confirmación) — reprogramar, cancelar. Aplica la política de cancelación tal como quedó fijada al momento de la reserva (snapshot): si cancela dentro de la ventana, devolución completa; fuera de ella, retención según la política.

Estados que debe cubrir el prototipo: sin cupos disponibles (con opción "avísame"), carga en 3G (skeletons), cupo expirado (el HELD de 10 min venció).

## 2. App del operador (dueño / admin / profesional)

Con sesión. Shell del POS real: sidebar + navbar en web (1440px), tab bar inferior en mobile (390px). Cuatro secciones de primer nivel:

```
Agenda · Ventas · Clientes · Ajustes
```

### Agenda
El trabajo del día. Vista día (Variante C — aprobada: lista cronológica agrupada por hora + mini-calendario/strip semanal + resumen del día con 3 métricas: citas, confirmadas, ingresos). Admin ve todo el equipo y filtra por colaborador; colaborador ve solo su propia agenda, sin selector.

Desde una cita en Agenda se abre, como **drawer lateral** (nunca modal sobre modal):
- **Cierre del servicio** — un solo flujo de dos pasos: (1) ¿cómo terminó? completado / no llegó / reprogramar → (2) cobro: resumen con propina seleccionable (sin propina / 5% / 10% / otra) + método (datáfono / QR / link de pago), o solo confirmación si el servicio ya estaba pagado por adelantado.
- **Editar / reasignar cita** — cambiar hora, profesional o servicio sobre la misma cita, revalidando disponibilidad con el mismo motor de cupos de la reserva pública.
- **Bloqueo de disponibilidad** — el profesional bloquea un día completo o un rango de horas; el micrositio público se actualiza al instante. Si el bloqueo choca con una cita existente, se alerta para reprogramar (no se borra sola).

### Ventas
El histórico. Selector Hoy / Semana / Mes. Consolidado (total vendido, # de ventas, propinas, comisiones) + detalle venta por venta (servicio, quién la hizo, fecha, monto, método de pago). Colaborador ve solo sus propias ventas con su comisión desglosada; admin ve todo y exporta CSV de comisiones por empleado y período.

### Clientes
Directorio con buscador (nombre o celular). Ficha individual: identificación (nombre, cédula, celular, email), gasto acumulado y # de visitas, historial de visitas, notas y preferencias (ej. alergias, preferencia de profesional). Admin ve el directorio completo; colaborador ve solo la ficha de los clientes que atiende, sin poder borrar ni exportar.

### Ajustes
Configuración viva del negocio, editable en cualquier momento por el rol admin — en el piloto, el equipo Bold la configura junto al dueño (white-glove), pero la pantalla ya es autoservicio desde el día 1:
- **Perfil del negocio** — nombre visible, dirección, horario (lo que el cliente final ve en el micrositio).
- **Equipo** — profesionales, rol, servicios que hace cada uno, días y horario.
- **Servicios** — nombre, duración, precio, toggle "pago anticipado" por servicio.
- **Política de reservas** — ventana de cancelación, timing de recordatorios.

Un cambio aquí se refleja al instante en el micrositio público (sin redeploy), pero **nunca altera citas ya existentes** — la política y el precio quedan copiados como snapshot en cada cita al momento de crearse.

## Mapa de flujos F0–F7 sobre esta arquitectura

| Flujo | Dónde vive |
|---|---|
| F0 — Onboarding del comercio | Ajustes (en MVP, ejecutado white-glove por el equipo Bold junto al dueño) |
| F0b — Cambios de configuración | Ajustes |
| F1 — Reserva en línea del cliente | Micrositio público: landing → wizard → confirmación |
| F2 — Día del profesional + cierre | Agenda → drawer "Cierre del servicio" |
| F3 — No-show / cancelación tardía | Se dispara desde F2 ("no llegó") o desde "Gestionar cita" del micrositio (cancelación del cliente); la política se resuelve automáticamente, sin pantalla propia |
| F4 — Walk-in | Fuera del MVP (MRP). No se prototipa. |
| F5 — Cierre de semana del dueño | Ventas |
| F6 — Staff bloquea disponibilidad | Agenda (acción del profesional sobre su propia disponibilidad) |
| F7 — Editar / reasignar una cita | Agenda → drawer "Editar cita", accesible también desde F2 ("¿la cita se movió?") y desde una alerta de conflicto de F6 |

Clientes no tiene un flujo F-numerado propio en el PDF: es una superficie transversal, alimentada automáticamente por F1 (se crea o actualiza la ficha) y consultada desde F2 (historial visible al abrir una cita).

## Ciclo de vida de la cita (objeto central)

```
HELD (10 min, reserva en curso)
   │
   ▼
CONFIRMADA ──────────────┬──────────────┐
   │                      │              │
   ▼                      ▼              ▼
COMPLETADA            NO-SHOW      REPROGRAMADA (F7)
   │                      │
   ▼                      ▼
(venta + comisión)   (política F3: retiene o devuelve prepago)
```

Estado de pago (pendiente / pagado) y estado de comisión (pendiente / calculada) corren en paralelo al estado de la cita — visibles siempre por separado, aunque el cierre los resuelva en un solo gesto de UI.

## Reglas de navegación (anti-patrones a evitar, de `principios-ux-bold.md`)

- Nunca modal sobre modal → todo lo que se abre desde una cita en Agenda es un drawer lateral sobre la misma vista, no un modal nuevo.
- Nunca ocultar el total o el estado del objeto central para "limpiar" la interfaz.
- Nunca mezclar componentes de superficie (ej. usar patrones de la app del operador dentro del micrositio público, o viceversa).
