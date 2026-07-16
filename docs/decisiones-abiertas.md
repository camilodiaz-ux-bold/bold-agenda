# Decisiones abiertas — Bold Agenda

> No bloquean el prototipo. Se documentan para no perderlas al pasar a Claude Code, y para que quien lea el prototipo no confunda un vacío de diseño con una inconsistencia real.

## 1. Starter sin recordatorios vs. la métrica del piloto

**El vacío:** el plan Starter (gratis) no incluye recordatorios de WhatsApp, según la definición de pricing. Pero una de las métricas aprobadas del piloto es *reducción de no-show ≥30%, atribuible solo a los recordatorios*.

**Por qué no es una contradicción real (por ahora):** el piloto (F&F, 5-8 comercios) corre fuera del esquema de tiers — los tiers aplican desde el MRP. Mientras el prototipo no muestre una pantalla de selección de plan o upsell, esto no toca ninguna superficie del alcance actual (micrositio, agenda, checkout, setup white-glove).

**Cuándo resolverlo:** antes de que exista cualquier pantalla de planes/pricing en el producto real, o si el prototipo se extiende a mostrar ese flujo. Vale la pena que quede explícito en algún lado (ej. una nota en Ajustes) que el piloto no vive en Starter, para que nadie que revise el prototipo lea una promesa que el plan gratuito no cumple.

## 2. Timing de recordatorios: ¿configurable o fijo?

**El vacío:** el flujo F0 (Onboarding) original tenía el timing de recordatorios (24h / 2h) como parte de "Reglas de reserva", configurable por el dueño. El mockup de Configuración (Ajustes) aprobado solo muestra un control para la **ventana de cancelación** — no hay ningún control visible para el timing de los recordatorios.

**Dos lecturas posibles:**
- El timing quedó fijo a propósito (24h + 2h, no configurable) como simplificación del MVP — coherente con "sensatos por defecto, configuración en segundo nivel".
- Falta en el mockup y debería agregarse a la sección de Política de reservas.

**Por qué no bloquea:** el prototipo puede construirse mostrando el timing como fijo (24h/2h) sin control de usuario, que es la lectura más simple y consistente con el mockup actual. Si la respuesta es "sí debe ser configurable", es un ajuste menor a la pantalla de Ajustes, no un cambio de arquitectura.

**Cuándo resolverlo:** antes de dar por cerrado el alcance final de la superficie de Ajustes.

## 3. Walk-in (histórico — ya resuelto, se deja registrado)

El PDF de flujos (F4) documentaba una contradicción entre el PRD (que lo subía a MVP) y el Corte MVP/MRP (que lo bajaba a MRP), con nota de "confirmar con Alejandro antes de diseñar". **Confirmado por Camilo: fuera del MVP, va a MRP.** No se prototipa. Se deja esta entrada solo como registro de que la contradicción existió y ya se resolvió, para que no se reabra sin motivo.
