# BPG Futsal Ducks 🦆⚽

Minijuego de fútbol sala con los patos del **BPG Fuenlabrada**, estética retro de consola/CRT (amarillo y negro).
Web estática (HTML + JS, sin dependencias ni build). Pensado para jugar en vertical desde el móvil.

## La plantilla

Antes de cada partido eliges tu quinteto: el primer jugador que tocas es el **portero**, luego cierre, ala, ala y pívot.
Rasgos y looks se editan en el array `ROSTER` al principio de `game.js`.

| # | Jugador | Look | Rasgo |
|---|---------|------|-------|
| 27 | ANCIO | Gorra | Portero gato: el mejor bajo palos |
| 3 | TORRY | Barba | Muro defensivo |
| 4 | NACH | Gafas | Pase de tiralíneas |
| 5 | JESUS | Pelo rapado | Ancla: entradas de acero |
| 6 | ZARATE | Bigote | Pulmón infinito: sprint que se recarga rápido |
| 7 | ROMERO JR | Cinta roja | Turbo: el más rápido |
| 8 | ALES | Rizos | Regateador: casi imposible de robar |
| 9 | JOSE | Cresta | Tiro de fuego |
| 10 | ROMERO | Gafas de sol + brazalete | **Capitán**. El mago: tiros con efecto |
| 13 | YERAY | Bandana azul | Todoterreno |
| 14 | MIGU | Afro | Killer del área |
| 19 | PATO | Corona | El pato original: su ¡CUAC! asusta al portero |
| 23 | ORMEÑO | Muñequeras | La torre: más grande y gana los choques |

Rival: Unión Fuenlabrada FS (gaviotas celestes). Dificultad: Fácil / Normal / Crack.

## Controles

- **Joystick** (mitad izquierda del mando): mover. Es flotante: toca donde quieras.
- **A · TIRO**: mantén para cargar y suelta. Inclina el joystick a izquierda/derecha para elegir palo.
- **B · PASE**: pasa al compañero hacia el que apuntas.
- Sin balón: **A = ENTRADA** (sprint + intento de robo) · **B = CAMBIO** de jugador.
- Teclado (PC): flechas/WASD, Espacio = A, X/Shift = B, P/Esc = pausa.

## Actualizar la jornada (modo admin)

El cartel de la portada (jornada, rival, fecha, hora, pabellón) se lee de `/api/jornada`. Si no hay servidor o datos,
se usa el cartel por defecto de `game.js` (`JDEF`).

**Cómo entrar:** en la portada, mantén pulsado **POWER** o **RESET** de la consola durante 1,5 s → login (3 intentos,
luego bloqueo de 30 s). Dentro puedes:
- **Pegar el mensaje** de WhatsApp o el pie de foto de Instagram y pulsar **INTERPRETAR** (usa Claude si hay
  `ANTHROPIC_API_KEY`; si no, un análisis básico). Revisa los campos y pulsa **GUARDAR**.
- O rellenar los campos a mano.

**Configuración en Vercel** (una sola vez):
1. En el proyecto → **Storage** → crea/conecta **Upstash Redis** (Marketplace). Añade solas las variables
   `KV_REST_API_URL` y `KV_REST_API_TOKEN`.
2. En **Settings → Environment Variables** añade:
   - `ADMIN_USER` y `ADMIN_PASS`: usuario y clave del admin (no van en el código).
   - `ANTHROPIC_API_KEY` *(opcional)*: para interpretar mensajes con IA. Opcionalmente `ANTHROPIC_MODEL`.
3. **Redeploy** para que las variables se apliquen.

Las funciones están en `api/` (`jornada.js`, `parse.js`). Las claves solo las lee el servidor. Tras 8 intentos fallidos
desde la misma IP, el servidor bloquea 15 minutos.

Para probarlo en local (con las variables en un `.env.local` o `vercel env pull`): `npx vercel dev`
(`npx serve` no ejecuta `api/`).

## Subir a Vercel

Opción 1 (sin instalar nada): entra en https://vercel.com/new, elige **"Deploy" → arrastra/sube esta carpeta**
(o súbela antes a un repo de GitHub e impórtalo). Framework: **Other**. Sin comando de build. Directorio de salida: la raíz.

Opción 2 (CLI):

```bash
npx vercel --prod
```

En el móvil, abre la URL y usa **"Añadir a pantalla de inicio"** para jugar a pantalla completa.

## Probar en local

```bash
npx serve .
```
