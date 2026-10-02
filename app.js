/* ==========================================================================
   Relicario — palabras que solo sobreviven dentro de una expresión
   La primera parte (lógica) no toca el DOM y se puede probar con Node:
     node --test tests/logic.test.js
   ========================================================================== */
(function () {
  'use strict';

  // ---------------------------------------------------------------------------
  // Configuración
  // ---------------------------------------------------------------------------

  // Día n.º 1 del juego (fecha local, AAAA-MM-DD). Cada medianoche avanza un día.
  var FECHA_INICIO = '2026-10-03';

  var CLAVE_ALMACEN = 'relicario:v1';

  var MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio',
    'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];

  // ---------------------------------------------------------------------------
  // Fechas y días
  // ---------------------------------------------------------------------------

  function leerFechaISO(iso) {
    var p = iso.split('-').map(Number);
    return new Date(p[0], p[1] - 1, p[2]);
  }

  function fechaISO(d) {
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  }

  // Número de día (1, 2, 3…) para una fecha local. Se cuenta en UTC para que
  // los cambios de horario de verano no descuadren la resta.
  function numeroDia(fecha, inicioISO) {
    var inicio = leerFechaISO(inicioISO || FECHA_INICIO);
    var a = Date.UTC(inicio.getFullYear(), inicio.getMonth(), inicio.getDate());
    var b = Date.UTC(fecha.getFullYear(), fecha.getMonth(), fecha.getDate());
    return Math.floor((b - a) / 86400000) + 1;
  }

  // Fecha local del día n.º n.
  function fechaDelDia(n, inicioISO) {
    var inicio = leerFechaISO(inicioISO || FECHA_INICIO);
    return new Date(inicio.getFullYear(), inicio.getMonth(), inicio.getDate() + n - 1);
  }

  // ?dia=N fuerza el día N (para probar el prototipo).
  function diaForzado(search) {
    var m = /[?&]dia=(\d+)/.exec(search || '');
    if (!m) return null;
    var n = parseInt(m[1], 10);
    return n >= 1 ? n : null;
  }

  function fechaLarga(d) {
    return d.getDate() + ' de ' + MESES[d.getMonth()];
  }

  function fechaCorta(d) {
    return d.getDate() + ' ' + MESES[d.getMonth()].slice(0, 3);
  }

  function msHastaMedianoche(ahora) {
    var siguiente = new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate() + 1);
    return siguiente - ahora;
  }

  function formatoCuentaAtras(ms) {
    var total = Math.max(0, Math.floor(ms / 1000));
    var h = Math.floor(total / 3600), m = Math.floor(total % 3600 / 60), s = total % 60;
    return [h, m, s].map(function (n) { return String(n).padStart(2, '0'); }).join(':');
  }

  // ---------------------------------------------------------------------------
  // Barajar con semilla: todos los jugadores ven el mismo orden el mismo día
  // ---------------------------------------------------------------------------

  // FNV-1a de 32 bits.
  function hashTexto(str) {
    var h = 2166136261;
    for (var i = 0; i < str.length; i++) {
      h ^= str.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return h >>> 0;
  }

  // mulberry32: números entre 0 y 1 a partir de una semilla.
  function aleatorioConSemilla(semilla) {
    var a = semilla >>> 0;
    return function () {
      a = (a + 0x6D2B79F5) >>> 0;
      var t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  // Orden en que se muestran las opciones de la reliquia n.º indice del día
  // con fecha iso. Devuelve los índices originales (0 = la correcta).
  function ordenOpciones(iso, indice, cuantas) {
    var azar = aleatorioConSemilla(hashTexto('relicario|' + iso + '|' + indice));
    var orden = [];
    for (var i = 0; i < cuantas; i++) orden.push(i);
    for (var j = orden.length - 1; j > 0; j--) {
      var k = Math.floor(azar() * (j + 1));
      var t = orden[j]; orden[j] = orden[k]; orden[k] = t;
    }
    return orden;
  }

  // ---------------------------------------------------------------------------
  // Expresiones: «Caer de [bruces]» → trozos con la palabra fósil marcada
  // ---------------------------------------------------------------------------

  function trozosExpresion(expresion) {
    var trozos = [];
    var re = /\[([^\]]+)\]/g;
    var desde = 0, m;
    while ((m = re.exec(expresion))) {
      if (m.index > desde) trozos.push({ texto: expresion.slice(desde, m.index), fosil: false });
      trozos.push({ texto: m[1], fosil: true });
      desde = re.lastIndex;
    }
    if (desde < expresion.length) trozos.push({ texto: expresion.slice(desde), fosil: false });
    return trozos;
  }

  function expresionLimpia(expresion) {
    return expresion.replace(/[[\]]/g, '');
  }

  // ---------------------------------------------------------------------------
  // Partida y puntuación
  // ---------------------------------------------------------------------------

  // respuestas[i]: índice original elegido (0 = acierto) o null si falta.
  // vistas: cuántas reliquias se han cerrado ya con «Siguiente».
  function partidaNueva(cuantas) {
    var p = { respuestas: [], vistas: 0, terminada: false };
    for (var i = 0; i < cuantas; i++) p.respuestas.push(null);
    return p;
  }

  function partidaValida(p, cuantas) {
    return !!p && Array.isArray(p.respuestas) && p.respuestas.length === cuantas &&
      typeof p.vistas === 'number' && p.vistas >= 0 && p.vistas <= cuantas;
  }

  function partidaDelDia(estado, dia, cuantas) {
    var p = estado.partidas[dia];
    if (!partidaValida(p, cuantas)) {
      p = partidaNueva(cuantas);
      estado.partidas[dia] = p;
    }
    return p;
  }

  // Devuelve true si la respuesta se ha anotado (solo la primera cuenta).
  function responder(partida, i, eleccion) {
    if (i < 0 || i >= partida.respuestas.length || partida.respuestas[i] !== null) return false;
    partida.respuestas[i] = eleccion;
    return true;
  }

  // Cierra la reliquia en curso (botón «Siguiente»).
  function avanzar(partida) {
    var i = partida.vistas;
    if (i < partida.respuestas.length && partida.respuestas[i] !== null) partida.vistas++;
  }

  // Dónde está el jugador: { fase: 'pregunta' | 'reliquia' | 'final', indice }.
  function posicion(partida) {
    var i = partida.vistas;
    if (i >= partida.respuestas.length) return { fase: 'final', indice: -1 };
    return { fase: partida.respuestas[i] === null ? 'pregunta' : 'reliquia', indice: i };
  }

  function aciertos(partida) {
    return partida.respuestas.filter(function (r) { return r === 0; }).length;
  }

  function filaRombos(partida) {
    return partida.respuestas.map(function (r) { return r === 0 ? '◆' : '◇'; }).join('');
  }

  function textoCompartir(fecha, partida, url) {
    return 'Relicario · ' + fechaCorta(fecha) + ' · ' + filaRombos(partida) + (url ? ' · ' + url : '');
  }

  // ---------------------------------------------------------------------------
  // Estado guardado
  // ---------------------------------------------------------------------------

  function estadoVacio() {
    return {
      visto: false,          // ya cerró «Cómo se juega»
      diaTutorial: null,     // día en que «Cómo se juega» salió solo por primera vez
      partidas: {},          // { [dia]: { respuestas, vistas, terminada } }
      historial: {},         // { [dia]: aciertos }
      racha: { actual: 0, maxima: 0, ultimoDia: null }
    };
  }

  function cargarEstado(almacen) {
    var e = estadoVacio();
    try {
      var bruto = almacen && almacen.getItem(CLAVE_ALMACEN);
      if (!bruto) return e;
      var datos = JSON.parse(bruto);
      if (!datos || typeof datos !== 'object') return e;
      e.visto = !!datos.visto;
      e.diaTutorial = typeof datos.diaTutorial === 'number' ? datos.diaTutorial : null;
      if (datos.partidas && typeof datos.partidas === 'object') e.partidas = datos.partidas;
      if (datos.historial && typeof datos.historial === 'object') e.historial = datos.historial;
      if (datos.racha && typeof datos.racha === 'object') {
        e.racha.actual = datos.racha.actual | 0;
        e.racha.maxima = datos.racha.maxima | 0;
        e.racha.ultimoDia = typeof datos.racha.ultimoDia === 'number' ? datos.racha.ultimoDia : null;
      }
    } catch (err) { /* almacén ilegible: se empieza de cero */ }
    return e;
  }

  function guardarEstado(almacen, estado) {
    try {
      if (almacen) almacen.setItem(CLAVE_ALMACEN, JSON.stringify(estado));
    } catch (err) { /* sin almacenamiento: se juega igual */ }
  }

  // Anota la partida terminada en el historial y la racha. Devuelve true la primera vez.
  function terminarPartida(estado, dia) {
    var p = estado.partidas[dia];
    if (!p || p.terminada) return false;
    p.terminada = true;
    estado.historial[dia] = aciertos(p);
    var r = estado.racha;
    r.actual = (r.ultimoDia === dia - 1) ? r.actual + 1 : 1;
    r.ultimoDia = dia;
    if (r.actual > r.maxima) r.maxima = r.actual;
    return true;
  }

  // «Cómo se juega» sale solo el día de la primera partida (aunque recargue
  // sin haberlo cerrado); después, únicamente con el botón «?».
  function tocaTutorial(estado, hoy) {
    if (estado.visto) return false;
    return estado.diaTutorial === null || estado.diaTutorial === hoy;
  }

  // Anota que hoy ha salido «Cómo se juega».
  function anotarTutorial(estado, hoy) {
    if (estado.diaTutorial === null) estado.diaTutorial = hoy;
  }

  // Racha visible hoy: se pierde si ayer no se jugó.
  function rachaVigente(estado, hoy) {
    var r = estado.racha;
    if (r.ultimoDia === null) return 0;
    return r.ultimoDia >= hoy - 1 ? r.actual : 0;
  }

  var Logica = {
    FECHA_INICIO: FECHA_INICIO,
    CLAVE_ALMACEN: CLAVE_ALMACEN,
    leerFechaISO: leerFechaISO,
    fechaISO: fechaISO,
    numeroDia: numeroDia,
    fechaDelDia: fechaDelDia,
    diaForzado: diaForzado,
    fechaLarga: fechaLarga,
    fechaCorta: fechaCorta,
    msHastaMedianoche: msHastaMedianoche,
    formatoCuentaAtras: formatoCuentaAtras,
    ordenOpciones: ordenOpciones,
    trozosExpresion: trozosExpresion,
    expresionLimpia: expresionLimpia,
    partidaDelDia: partidaDelDia,
    responder: responder,
    avanzar: avanzar,
    posicion: posicion,
    aciertos: aciertos,
    filaRombos: filaRombos,
    textoCompartir: textoCompartir,
    estadoVacio: estadoVacio,
    cargarEstado: cargarEstado,
    guardarEstado: guardarEstado,
    terminarPartida: terminarPartida,
    tocaTutorial: tocaTutorial,
    anotarTutorial: anotarTutorial,
    rachaVigente: rachaVigente
  };

  if (typeof module !== 'undefined' && module.exports) module.exports = Logica;
  if (typeof document === 'undefined') return;

  // ---------------------------------------------------------------------------
  // Interfaz
  // ---------------------------------------------------------------------------

  var app = document.getElementById('app');
  var modal = document.getElementById('modal');
  var modalCuerpo = document.getElementById('modal-cuerpo');
  var avisoEl = document.getElementById('aviso');
  var almacen = (function () { try { return window.localStorage; } catch (e) { return null; } })();
  var estado = cargarEstado(almacen);
  var forzado = diaForzado(location.search);
  var dias = (window.RELICARIO_DATOS && window.RELICARIO_DATOS.dias) || null;
  var hoy = null;
  var temporizador = null;
  var temporizadorAviso = null;

  var LETRAS = ['a', 'b', 'c', 'd', 'e'];
  var FRASES = [
    'Hoy las reliquias se te han resistido. Mañana, más.',
    'Una pieza a buen recaudo. Algo es algo.',
    'Buen ojo de anticuario.',
    '¡Pleno! Tu gabinete está completo.'
  ];

  function esc(str) {
    return String(str).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function guardar() { guardarEstado(almacen, estado); }

  // Avisa a Almanaque de que la partida de hoy está hecha (ver volver-almanaque.js).
  function avisarAlmanaque() {
    if (window.almanaqueHecho) window.almanaqueHecho();
  }

  function subtitulo(texto) { document.getElementById('subtitulo').textContent = texto; }

  function aviso(msg) {
    avisoEl.textContent = msg;
    avisoEl.classList.add('is-visible');
    clearTimeout(temporizadorAviso);
    temporizadorAviso = setTimeout(function () { avisoEl.classList.remove('is-visible'); }, 2400);
  }

  // Pinta una pantalla y lleva el foco a su encabezado (para lectores de pantalla).
  function pintar(html, enfocar) {
    pararCuentaAtras();
    app.innerHTML = html;
    var titulo = app.querySelector('[data-foco]');
    if (titulo && enfocar !== false) titulo.focus({ preventScroll: true });
    window.scrollTo(0, 0);
  }

  function reliquiasHoy() { return dias[hoy - 1].reliquias; }

  function partidaHoy() { return partidaDelDia(estado, hoy, reliquiasHoy().length); }

  function fechaHoy() { return fechaDelDia(hoy); }

  function numeroPieza(i) { return (hoy - 1) * 3 + i + 1; }

  function htmlExpresion(expresion) {
    return trozosExpresion(expresion).map(function (t) {
      return t.fosil ? '<span class="fosil">' + esc(t.texto) + '</span>' : esc(t.texto);
    }).join('');
  }

  function htmlProgreso(partida, actual) {
    return '<ol class="progreso" aria-label="Progreso del día">' + partida.respuestas.map(function (r, k) {
      var clase = r === null ? (k === actual ? 'is-actual' : '') : (r === 0 ? 'is-acierto' : 'is-fallo');
      var txt = r === null ? (k === actual ? 'en curso' : 'pendiente') : (r === 0 ? 'acertada' : 'fallada');
      return '<li class="' + clase + '"><span aria-hidden="true">' + (r === 0 ? '◆' : '◇') + '</span>' +
        '<span class="visually-hidden">Reliquia ' + (k + 1) + ': ' + txt + '</span></li>';
    }).join('') + '</ol>';
  }

  // ---------- Jugada ----------

  function pantallaJugada() {
    var partida = partidaHoy();
    var pos = posicion(partida);
    if (pos.fase === 'final') { pantallaResultado(); return; }

    var i = pos.indice;
    var rel = reliquiasHoy()[i];
    var orden = ordenOpciones(fechaISO(fechaHoy()), numeroPieza(i), rel.opciones.length);
    subtitulo('Relicario del ' + fechaLarga(fechaHoy()));

    pintar(
      '<section class="pantalla pantalla--jugada">' +
      htmlProgreso(partida, i) +
      '<h2 class="kicker" data-foco tabindex="-1">Reliquia <span class="num">' + (i + 1) + '</span> de <span class="num">' + partida.respuestas.length + '</span></h2>' +
      '<figure class="vitrina">' +
      '<figcaption class="vitrina__rotulo">Pieza n.º <span class="num">' + numeroPieza(i) + '</span></figcaption>' +
      '<p class="expresion">«' + htmlExpresion(rel.expresion) + '»</p>' +
      '</figure>' +
      '<p class="pregunta" id="pregunta">' + esc(rel.pregunta) + '</p>' +
      '<div class="opciones" role="group" aria-labelledby="pregunta">' +
      orden.map(function (o, k) {
        return '<button class="opcion" type="button" data-opcion="' + o + '">' +
          '<span class="opcion__letra" aria-hidden="true">' + LETRAS[k] + '</span>' +
          '<span class="opcion__texto">' + esc(rel.opciones[o]) + '</span>' +
          '<span class="opcion__marca" aria-hidden="true"></span>' +
          '<span class="opcion__estado visually-hidden"></span>' +
          '</button>';
      }).join('') +
      '</div>' +
      '<p class="veredicto" id="veredicto" role="status" aria-live="polite"></p>' +
      '<div id="hueco-reliquia"></div>' +
      '</section>'
    );

    var botones = app.querySelectorAll('.opcion');
    Array.prototype.forEach.call(botones, function (b) {
      b.addEventListener('click', function () {
        if (!responder(partida, i, Number(b.getAttribute('data-opcion')))) return;
        guardar();
        revelar(partida, i, true);
      });
    });

    if (pos.fase === 'reliquia') revelar(partida, i, false);
  }

  // Marca las opciones, anuncia el veredicto y muestra la tarjeta «Reliquia».
  function revelar(partida, i, recien) {
    var rel = reliquiasHoy()[i];
    var elegida = partida.respuestas[i];
    var acierto = elegida === 0;

    Array.prototype.forEach.call(app.querySelectorAll('.opcion'), function (b) {
      var o = Number(b.getAttribute('data-opcion'));
      b.disabled = true;
      var marca = b.querySelector('.opcion__marca');
      var estadoTxt = b.querySelector('.opcion__estado');
      if (o === 0) {
        b.classList.add('is-correcta');
        marca.textContent = '✓';
        estadoTxt.textContent = o === elegida ? ' (correcta, tu respuesta)' : ' (correcta)';
      } else if (o === elegida) {
        b.classList.add('is-errada');
        marca.textContent = '✗';
        estadoTxt.textContent = ' (tu respuesta)';
      } else {
        b.classList.add('is-apagada');
      }
    });

    document.getElementById('veredicto').textContent = acierto
      ? '¡Bien visto! La respuesta correcta es «' + rel.opciones[0] + '».'
      : 'No era esa. La respuesta correcta es «' + rel.opciones[0] + '».';
    document.getElementById('veredicto').classList.add(acierto ? 'is-acierto' : 'is-fallo');

    var ultima = i === partida.respuestas.length - 1;
    var hueco = document.getElementById('hueco-reliquia');
    hueco.innerHTML =
      '<article class="reliquia' + (recien ? ' is-recien' : '') + '" aria-labelledby="reliquia-titulo">' +
      '<h3 class="reliquia__titulo" id="reliquia-titulo"><span aria-hidden="true">❦ </span>Reliquia</h3>' +
      '<p class="reliquia__expresion">' + esc(expresionLimpia(rel.expresion)) + '</p>' +
      '<p class="reliquia__texto">' + esc(rel.reliquia) + '</p>' +
      '<button class="btn btn--grande" id="btn-siguiente" type="button">' + (ultima ? 'Ver el resultado' : 'Siguiente') + '</button>' +
      '</article>';

    var siguiente = document.getElementById('btn-siguiente');
    siguiente.addEventListener('click', function () {
      avanzar(partida);
      guardar();
      pantallaJugada();
    });
    siguiente.focus({ preventScroll: true });
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (recien) hueco.scrollIntoView({ block: 'nearest', behavior: reduce ? 'auto' : 'smooth' });
  }

  // ---------- Resultado ----------

  function pantallaResultado() {
    var partida = partidaHoy();
    if (terminarPartida(estado, hoy)) guardar();
    avisarAlmanaque();
    var n = aciertos(partida);
    var total = partida.respuestas.length;
    var ultimo = hoy >= dias.length;
    var racha = rachaVigente(estado, hoy);
    subtitulo('Relicario del ' + fechaLarga(fechaHoy()));

    pintar(
      '<section class="pantalla pantalla--resultado">' +
      '<h2 class="kicker" data-foco tabindex="-1">Tu gabinete de hoy</h2>' +
      '<div class="marcador">' +
      '<p class="marcador__cifra"><b>' + n + '</b><span> de ' + total + '</span></p>' +
      '<p class="marcador__rombos" role="img" aria-label="' + n + ' de ' + total + ' aciertos">' + filaRombos(partida) + '</p>' +
      '<p class="marcador__frase">' + FRASES[Math.round(n * (FRASES.length - 1) / total)] + '</p>' +
      '</div>' +
      '<div class="pila">' +
      '<button class="btn btn--grande" id="btn-compartir" type="button">Compartir</button>' +
      '<a class="btn btn--sec" data-almanaque-volver hidden href="https://joseleking.github.io/Almanaque/">☜ Regresar al Almanaque</a>' +
      '</div>' +
      '<dl class="cifras">' +
      '<div><dt>Racha</dt><dd>' + racha + '</dd><dd class="cifras__unidad">' + (racha === 1 ? 'día seguido' : 'días seguidos') + '</dd></div>' +
      '<div><dt>Mejor racha</dt><dd>' + estado.racha.maxima + '</dd><dd class="cifras__unidad">' + (estado.racha.maxima === 1 ? 'día' : 'días') + '</dd></div>' +
      '</dl>' +
      (ultimo
        ? '<p class="cuenta-atras">Se acabaron las reliquias de este prototipo.</p>'
        : '<p class="cuenta-atras">Siguiente relicario en <time id="cuenta-atras">--:--:--</time></p>') +
      '<h3 class="repaso__titulo">Las piezas de hoy</h3>' +
      '<ol class="repaso">' + reliquiasHoy().map(function (rel, k) {
        var ok = partida.respuestas[k] === 0;
        return '<li><details>' +
          '<summary><span class="repaso__marca ' + (ok ? 'is-acierto' : 'is-fallo') + '" aria-hidden="true">' + (ok ? '◆' : '◇') + '</span>' +
          '<span class="repaso__expresion">' + htmlExpresion(rel.expresion) + '</span>' +
          '<span class="visually-hidden">' + (ok ? ' (acertada)' : ' (fallada)') + '</span></summary>' +
          '<div class="repaso__detalle">' +
          '<p><b>' + esc(rel.opciones[0]) + '.</b> ' + esc(rel.reliquia) + '</p>' +
          '</div></details></li>';
      }).join('') + '</ol>' +
      '</section>'
    );

    document.getElementById('btn-compartir').addEventListener('click', function () {
      compartir(textoCompartir(fechaHoy(), partida, urlJuego()));
    });
    if (!ultimo) empezarCuentaAtras();
  }

  // ---------- Antes y después del prototipo ----------

  function pantallaAntes() {
    subtitulo('Gabinete de palabras fósiles');
    pintar(
      '<section class="pantalla pantalla--centro">' +
      '<h2 class="kicker" data-foco tabindex="-1">Próximamente</h2>' +
      '<div class="floron" aria-hidden="true">❦</div>' +
      '<p class="lema">El relicario abre el ' + esc(fechaLarga(leerFechaISO(FECHA_INICIO))) + '.</p>' +
      '<p>Cada día, tres expresiones con una palabra que solo sobrevive dentro de ellas. ¿Sabrás qué significaba?</p>' +
      '</section>'
    );
  }

  function pantallaFin() {
    subtitulo('Gabinete de palabras fósiles');
    var jugados = Object.keys(estado.historial).length;
    pintar(
      '<section class="pantalla pantalla--centro">' +
      '<h2 class="kicker" data-foco tabindex="-1">Gabinete cerrado</h2>' +
      '<div class="floron" aria-hidden="true">❦</div>' +
      '<p class="lema">Se acabaron las reliquias de este prototipo.</p>' +
      '<p>Ya están expuestas las ' + (dias.length * 3) + ' piezas de <b>Relicario</b>. Pronto habrá más vitrinas.</p>' +
      (jugados ? '<dl class="cifras">' +
        '<div><dt>Días jugados</dt><dd>' + jugados + '</dd></div>' +
        '<div><dt>Mejor racha</dt><dd>' + estado.racha.maxima + '</dd></div>' +
        '</dl>' : '') +
      '</section>'
    );
  }

  function pantallaError() {
    pintar(
      '<section class="pantalla pantalla--centro">' +
      '<h2 class="kicker" data-foco tabindex="-1">Vitrina vacía</h2>' +
      '<p>No se ha podido cargar el contenido del relicario. Prueba a recargar la página.</p>' +
      '</section>'
    );
  }

  // ---------- Cómo se juega ----------

  function htmlComoSeJuega() {
    return '<div class="reglas">' +
      '<p>Hay palabras que ya solo viven dentro de una expresión hecha. Son <b>reliquias</b>.</p>' +
      '<div class="ejemplo" aria-label="Ejemplo">' +
      '<p class="ejemplo__expresion">«Llevar en <span class="fosil">volandas</span>»</p>' +
      '<p class="ejemplo__pregunta">¿Qué significa «volandas»?</p>' +
      '<ul class="ejemplo__opciones">' +
      '<li class="is-correcta"><span aria-hidden="true">✓ </span>Por el aire, sin tocar el suelo<span class="visually-hidden"> (correcta)</span></li>' +
      '<li>Con mucha prisa</li>' +
      '<li>Sobre unas andas</li>' +
      '</ul>' +
      '<p class="ejemplo__reliquia">Viene de «volar»: a quien llevan en volandas lo alzan y lo transportan por el aire.</p>' +
      '</div>' +
      '<ul class="reglas__lista">' +
      '<li>Cada día hay <b>3 expresiones</b>. La palabra fósil aparece <span class="fosil">subrayada en rojo</span>.</li>' +
      '<li>Elige qué significaba entre <b>3 opciones</b>. Solo vale la primera respuesta.</li>' +
      '<li>Después se revela la reliquia: de dónde viene la palabra.</li>' +
      '<li>Al final, comparte tu fila: ◆ acierto, ◇ fallo. Juega cada día para alargar tu racha.</li>' +
      '</ul>' +
      '</div>';
  }

  // primeraVez: se abre sola el día de la primera partida (botón «A jugar»).
  function abrirAyuda(primeraVez) {
    modalCuerpo.innerHTML = '<h2 id="modal-titulo" tabindex="-1">Cómo se juega</h2>' + htmlComoSeJuega();
    document.getElementById('modal-cerrar').textContent = primeraVez === true ? 'A jugar' : 'Entendido';
    if (modal.showModal) { if (!modal.open) modal.showModal(); } else modal.setAttribute('open', '');
    // Empieza arriba, con el título a la vista (si no, el foco va al botón del final).
    document.getElementById('modal-titulo').focus({ preventScroll: true });
    modal.scrollTop = 0;
  }

  function cerrarAyuda() {
    if (modal.close) modal.close(); else { modal.removeAttribute('open'); alCerrarAyuda(); }
  }

  function alCerrarAyuda() {
    if (!estado.visto) { estado.visto = true; guardar(); }
  }

  document.getElementById('btn-ayuda').addEventListener('click', function () { abrirAyuda(false); });
  document.getElementById('modal-cerrar').addEventListener('click', cerrarAyuda);
  modal.addEventListener('close', alCerrarAyuda);
  modal.addEventListener('click', function (ev) {
    if (ev.target === modal) cerrarAyuda();
  });

  // ---------- Compartir ----------

  function urlJuego() {
    return location.protocol.indexOf('http') === 0 ? location.origin + location.pathname : '';
  }

  function compartir(texto) {
    if (navigator.share) {
      navigator.share({ text: texto }).catch(function (err) {
        if (err && err.name !== 'AbortError') copiar(texto);
      });
      return;
    }
    copiar(texto);
  }

  function copiar(texto) {
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(texto).then(
        function () { aviso('Resultado copiado al portapapeles'); },
        function () { copiarALaAntigua(texto); }
      );
    } else {
      copiarALaAntigua(texto);
    }
  }

  function copiarALaAntigua(texto) {
    var ta = document.createElement('textarea');
    ta.value = texto;
    ta.setAttribute('readonly', '');
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    var ok = false;
    try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
    document.body.removeChild(ta);
    aviso(ok ? 'Resultado copiado al portapapeles' : texto);
  }

  // ---------- Cuenta atrás y cambio de día ----------

  function empezarCuentaAtras() {
    var el = document.getElementById('cuenta-atras');
    function tic() {
      var ms = msHastaMedianoche(new Date());
      el.textContent = formatoCuentaAtras(ms);
      if (ms < 1000 && !forzado) setTimeout(function () { location.reload(); }, 1500);
    }
    tic();
    temporizador = setInterval(tic, 1000);
  }

  function pararCuentaAtras() {
    if (temporizador) { clearInterval(temporizador); temporizador = null; }
  }

  // Si la pestaña se queda abierta y pasa la medianoche, se recarga al volver.
  document.addEventListener('visibilitychange', function () {
    if (document.visibilityState === 'visible' && !forzado && dias && numeroDia(new Date()) !== hoy) {
      location.reload();
    }
  });

  // ---------- Arranque ----------

  function arrancar() {
    if (!dias || !dias.length) { pantallaError(); return; }
    hoy = forzado || numeroDia(new Date());
    if (hoy < 1) { pantallaAntes(); return; }
    if (hoy > dias.length) { pantallaFin(); return; }
    pantallaJugada();   // con la partida terminada, muestra el resultado
    // La primera vez, «Cómo se juega» (cuando ya se ha ido la portada).
    if (tocaTutorial(estado, hoy)) {
      anotarTutorial(estado, hoy);
      guardar();
      despuesDePortada(function () { abrirAyuda(true); });
    }
  }

  // La portada con el logo se ve al menos PORTADA_MS desde que se abre la página y luego se desvanece.
  var PORTADA_MS = 900, FUNDIDO_MS = 400;

  function msPortada() { return Math.max(0, PORTADA_MS - performance.now()); }

  function despuesDePortada(fn) { setTimeout(fn, msPortada() + FUNDIDO_MS); }

  function retirarPortada() {
    var portada = document.getElementById('portada');
    if (!portada) return;
    setTimeout(function () {
      portada.classList.add('oculta');
      setTimeout(function () { portada.remove(); }, FUNDIDO_MS);
    }, msPortada());
  }

  arrancar();
  retirarPortada();

  if ('serviceWorker' in navigator && location.protocol.indexOf('http') === 0) {
    window.addEventListener('load', function () {
      navigator.serviceWorker.register('sw.js').catch(function () { /* sin modo offline */ });
    });
  }
})();
