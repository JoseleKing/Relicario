# Relicario

![Relicario](icons/relicario-512.png)

Juego diario de palabras fósiles. Hay palabras que solo sobreviven dentro de
una expresión hecha («de **bruces**», «a **mansalva**», «lanza en **ristre**»):
son reliquias. Cada día hay **tres expresiones**; en cada una se resalta la
palabra fósil y hay que elegir qué significaba entre tres opciones. Al
responder se revela la explicación.

Al terminar se comparte una fila de rombos:

> Relicario · 3 oct · ◆◆◇ · https://joseleking.github.io/Relicario/

Es una PWA estática (HTML, CSS y JavaScript, sin frameworks ni paso de
compilación) de la familia de [Almanaque](https://joseleking.github.io/Almanaque/).

## Archivos

| Archivo | Contenido |
| --- | --- |
| `index.html` | Estructura de la página |
| `styles.css` | Estética de gabinete de curiosidades: plana, crema, tinta y lacre |
| `app.js` | Lógica: día, barajado determinista, progreso, racha, compartir |
| `datos.js` | Contenido: 39 días × 3 reliquias |
| `sw.js` | Service worker (funciona sin conexión) |
| `manifest.webmanifest` | Datos para instalar la app |
| `icons/` | Logo SVG, iconos 192/512, adaptable (*maskable*), `apple-touch-icon` y favicon |
| `volver-almanaque.js` | Franja ☜ para regresar a Almanaque (copia de `Almanaque/para-los-juegos/`) |
| `reiniciar/index.html` | Página para borrar el progreso guardado |
| `tests/logic.test.js` | Pruebas de la lógica (Node, sin dependencias) |

## Probar en local

```sh
python3 -m http.server 8000
```

Y abre <http://localhost:8000>. (También funciona abriendo `index.html` con
doble clic, pero sin modo sin conexión).

- **Forzar un día:** `http://localhost:8000/?dia=4` juega el día 4. Con
  `?dia=40` (o más) se ve que el ciclo vuelve a empezar. Sin el parámetro, antes
  del 3 de octubre se ve «El relicario abre el 3 de octubre».
- **Empezar de cero:** `http://localhost:8000/reiniciar/` borra la partida, el
  historial y la racha de ese navegador (clave `relicario:v1` del `localStorage`).
- **Pruebas:** `node --test tests/logic.test.js`

## Cambiar la fecha de inicio

Al principio de `app.js`:

```js
var FECHA_INICIO = '2026-10-03';
```

Esa fecha (en hora local del jugador) es el día 1; cada medianoche se pasa al
siguiente. Cuando se acaban los días de `datos.js`, el ciclo vuelve a empezar
por el primero. Con 39 días, el último es el 10 de noviembre de 2026 y el 11
vuelve el día 1.

## Añadir días

Copia un bloque al final de `dias` en `datos.js`:

```js
{ reliquias: [
  {
    expresion: 'Caer de [bruces]',          // la palabra fósil, entre corchetes
    pregunta: '¿Qué eran las «bruces»?',
    opciones: ['Los labios', 'Las rodillas', 'Las palmas de las manos'],  // la PRIMERA es la correcta
    reliquia: 'Viene del antiguo «buz», labio. …'
  },
  // … tres en total
] }
```

El juego baraja las opciones con una semilla que depende de la fecha, así que
todos los jugadores ven el mismo orden. Si la palabra fósil aparece dos veces,
marca las dos: `'Mirar de [hito] en [hito]'`.

## Publicar en GitHub Pages

1. Sube los cambios a `main` (`git push`).
2. En GitHub: **Settings → Pages → Build and deployment → Source: Deploy from
   a branch**, rama `main`, carpeta `/ (root)`, **Save**.
3. Al cabo de un minuto estará en <https://joseleking.github.io/Relicario/>.

**Al publicar una versión nueva**, sube `CACHE_VERSION` en `sw.js` (`'v1'` →
`'v2'`) y el `?v=` de los `<script>` y del CSS en `index.html`. Así los móviles
que ya tienen la app instalada descargan la versión nueva.
