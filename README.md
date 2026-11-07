# BPG Futsal Ducks 🦆⚽

Minijuego de fútbol sala con los patos del **BPG Fuenlabrada**, estética retro de consola/CRT (amarillo y negro).
Web estática (HTML + JS, sin dependencias ni build). Pensado para jugar en vertical desde el móvil.

## La plantilla

| # | Pato | Posición | Rasgo |
|---|------|----------|-------|
| 1 | EL MURO | Portero | Brazos XXL: mucho más alcance para parar |
| 5 | CAPI | Cierre | Brazalete. Roba balones como nadie y da el pase más tenso |
| 7 | TURBO | Ala | Cinta roja. El más rápido y con el sprint que más se recarga |
| 10 | EL MAGO | Ala | Gafas de sol. Regate casi imposible de robar y tiros con efecto |
| 9 | CAÑONERO | Pívot | Cresta roja. Tiro más potente; cargado al máximo sale **en llamas** |

Rival: Unión Fuenlabrada FS (gaviotas celestes). Dificultad: Fácil / Normal / Crack.

## Controles

- **Joystick** (mitad izquierda del mando): mover. Es flotante: toca donde quieras.
- **A · TIRO**: mantén para cargar y suelta. Inclina el joystick a izquierda/derecha para elegir palo.
- **B · PASE**: pasa al compañero hacia el que apuntas.
- Sin balón: **A = ENTRADA** (sprint + intento de robo) · **B = CAMBIO** de jugador.
- Teclado (PC): flechas/WASD, Espacio = A, X/Shift = B, P/Esc = pausa.

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
