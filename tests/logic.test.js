// Pruebas de la lógica del juego. Ejecutar con: node --test tests/logic.test.js
const test = require('node:test');
const assert = require('node:assert/strict');
const L = require('../app.js');
const datos = require('../datos.js');

function almacenEnMemoria() {
  const m = new Map();
  return { getItem: (k) => (m.has(k) ? m.get(k) : null), setItem: (k, v) => m.set(k, String(v)) };
}

test('datos.js: 10 días × 3 reliquias con todos los campos', () => {
  assert.equal(datos.dias.length, 10);
  for (const dia of datos.dias) {
    assert.equal(dia.reliquias.length, 3);
    for (const r of dia.reliquias) {
      for (const k of ['expresion', 'pregunta', 'reliquia']) assert.ok(r[k] && typeof r[k] === 'string', `${r.expresion}: falta ${k}`);
      assert.equal(r.opciones.length, 3, r.expresion);
      assert.equal(new Set(r.opciones).size, 3, `${r.expresion}: opciones repetidas`);
      assert.ok(L.trozosExpresion(r.expresion).some((t) => t.fosil), `${r.expresion}: sin palabra fósil entre corchetes`);
    }
  }
});

test('numeroDia y fechaDelDia cuentan desde FECHA_INICIO (2026-10-03)', () => {
  assert.equal(L.FECHA_INICIO, '2026-10-03');
  assert.equal(L.numeroDia(new Date(2026, 9, 3, 0, 5)), 1);
  assert.equal(L.numeroDia(new Date(2026, 9, 3, 23, 59)), 1);
  assert.equal(L.numeroDia(new Date(2026, 9, 2, 23, 59)), 0);
  assert.equal(L.numeroDia(new Date(2026, 9, 12)), 10);
  assert.equal(L.numeroDia(new Date(2026, 9, 26)), 24);   // cruza el cambio de hora
  assert.equal(L.numeroDia(new Date(2026, 9, 13)), 11);
  assert.equal(L.fechaISO(L.fechaDelDia(1)), '2026-10-03');
  assert.equal(L.fechaISO(L.fechaDelDia(10)), '2026-10-12');
});

test('?dia=N fuerza el día', () => {
  assert.equal(L.diaForzado('?dia=4'), 4);
  assert.equal(L.diaForzado('?x=1&dia=10'), 10);
  assert.equal(L.diaForzado('?dia=0'), null);
  assert.equal(L.diaForzado(''), null);
});

test('fechas en castellano', () => {
  assert.equal(L.fechaLarga(new Date(2026, 9, 3)), '3 de octubre');
  assert.equal(L.fechaCorta(new Date(2026, 9, 3)), '3 oct');
});

test('ordenOpciones: permutación determinista por fecha y pieza', () => {
  const a = L.ordenOpciones('2026-10-03', 1, 3);
  assert.deepEqual(a, L.ordenOpciones('2026-10-03', 1, 3));
  assert.deepEqual([...a].sort(), [0, 1, 2]);
  // La correcta no está siempre en el mismo sitio.
  const sitios = new Set();
  for (let d = 1; d <= 10; d++) {
    const iso = L.fechaISO(L.fechaDelDia(d));
    for (let i = 0; i < 3; i++) sitios.add(L.ordenOpciones(iso, (d - 1) * 3 + i + 1, 3).indexOf(0));
  }
  assert.equal(sitios.size, 3);
});

test('trozosExpresion marca la palabra fósil (también repetida)', () => {
  assert.deepEqual(L.trozosExpresion('Caer de [bruces]'), [
    { texto: 'Caer de ', fosil: false }, { texto: 'bruces', fosil: true }
  ]);
  assert.deepEqual(L.trozosExpresion('Mirar de [hito] en [hito]').filter((t) => t.fosil).length, 2);
  assert.equal(L.expresionLimpia('A [tenor] de'), 'A tenor de');
});

test('partida: responder, revelar, avanzar y terminar', () => {
  const estado = L.estadoVacio();
  const p = L.partidaDelDia(estado, 1, 3);
  assert.deepEqual(L.posicion(p), { fase: 'pregunta', indice: 0 });
  assert.ok(L.responder(p, 0, 0));
  assert.equal(L.responder(p, 0, 2), false, 'solo vale la primera respuesta');
  assert.deepEqual(L.posicion(p), { fase: 'reliquia', indice: 0 });
  L.avanzar(p);
  L.avanzar(p);   // sin responder la siguiente no se avanza
  assert.deepEqual(L.posicion(p), { fase: 'pregunta', indice: 1 });
  L.responder(p, 1, 2); L.avanzar(p);
  L.responder(p, 2, 0); L.avanzar(p);
  assert.deepEqual(L.posicion(p), { fase: 'final', indice: -1 });
  assert.equal(L.aciertos(p), 2);
  assert.equal(L.filaRombos(p), '◆◇◆');
  assert.equal(L.textoCompartir(new Date(2026, 9, 3), p, 'https://x.io/Relicario/'),
    'Relicario · 3 oct · ◆◇◆ · https://x.io/Relicario/');
  assert.ok(L.terminarPartida(estado, 1));
  assert.equal(L.terminarPartida(estado, 1), false);
  assert.equal(estado.historial[1], 2);
});

test('el progreso se guarda y se recupera', () => {
  const almacen = almacenEnMemoria();
  const estado = L.estadoVacio();
  estado.visto = true;
  L.responder(L.partidaDelDia(estado, 3, 3), 0, 1);
  L.guardarEstado(almacen, estado);
  const otra = L.cargarEstado(almacen);
  assert.equal(otra.visto, true);
  assert.deepEqual(L.posicion(L.partidaDelDia(otra, 3, 3)), { fase: 'reliquia', indice: 0 });
  assert.deepEqual(L.cargarEstado({ getItem: () => '{roto' }), L.estadoVacio());
});

test('racha: días seguidos, se pierde si se salta un día', () => {
  const estado = L.estadoVacio();
  for (const d of [1, 2, 3]) { L.partidaDelDia(estado, d, 3); L.terminarPartida(estado, d); }
  assert.equal(L.rachaVigente(estado, 3), 3);
  assert.equal(L.rachaVigente(estado, 4), 3);
  assert.equal(L.rachaVigente(estado, 5), 0);
  L.partidaDelDia(estado, 5, 3); L.terminarPartida(estado, 5);
  assert.equal(L.rachaVigente(estado, 5), 1);
  assert.equal(estado.racha.maxima, 3);
});

test('«Cómo se juega» sale solo el día de la primera partida', () => {
  const almacen = almacenEnMemoria();
  const estado = L.estadoVacio();
  assert.equal(L.tocaTutorial(estado, 1), true);
  L.anotarTutorial(estado, 1);
  L.guardarEstado(almacen, estado);
  const recargado = L.cargarEstado(almacen);
  assert.equal(L.tocaTutorial(recargado, 1), true, 'mismo día sin cerrarlo: vuelve a salir');
  assert.equal(L.tocaTutorial(recargado, 2), false, 'al día siguiente ya no, aunque no lo cerrara');
  recargado.visto = true;
  assert.equal(L.tocaTutorial(recargado, 1), false, 'cerrado: no vuelve a salir');
});
