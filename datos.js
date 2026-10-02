/* ==========================================================================
   Relicario — contenido
   Cada día tiene tres reliquias. En cada una:
     expresion  la expresión hecha; la palabra fósil va entre corchetes
                (si aparece dos veces, se marcan las dos: «Mirar de [hito] en [hito]»)
     pregunta   lo que se pregunta sobre ella
     opciones   tres respuestas; LA PRIMERA ES LA CORRECTA (el juego las baraja)
     reliquia   la explicación que se revela al responder (1–2 frases)
   Para añadir un día, copia un bloque { reliquias: [...] } al final de «dias».
   ========================================================================== */
(function (raiz) {
  'use strict';

  var DATOS = {
    dias: [
      // Día 1
      { reliquias: [
        {
          expresion: 'Caer de [bruces]',
          pregunta: '¿Qué eran las «bruces»?',
          opciones: ['Los labios', 'Las rodillas', 'Las palmas de las manos'],
          reliquia: 'Viene del antiguo «buz», labio. Caer de bruces es caer de boca, dando con los labios en el suelo.'
        },
        {
          expresion: 'En un [santiamén]',
          pregunta: '¿De dónde sale «santiamén»?',
          opciones: ['Del final de una oración en latín', 'De un santo famoso por su rapidez', 'De una campanada corta'],
          reliquia: 'Es el «Spiritus Sancti, Amen» con que se remata la señal de la cruz, que se dice en un instante.'
        },
        {
          expresion: 'Sin [ton] ni son',
          pregunta: '¿Qué es el «ton»?',
          opciones: ['Tono', 'Tonel', 'Tonto'],
          reliquia: 'Es un apócope de «tono». Sin tono ni sonido quiere decir sin razón ni concierto.'
        }
      ] },

      // Día 2
      { reliquias: [
        {
          expresion: 'A [mansalva]',
          pregunta: '¿Qué era la «salva»?',
          opciones: ['Estar a salvo, sin riesgo', 'Un disparo de cortesía', 'Una bandeja de plata'],
          reliquia: 'De «a mano salva»: obrar sin peligro para uno mismo. Con el tiempo pasó a significar «en abundancia».'
        },
        {
          expresion: 'A la [postre]',
          pregunta: '¿Qué significaba «postre»?',
          opciones: ['Lo último', 'El dulce de la comida', 'La puerta trasera'],
          reliquia: '«Postre» quería decir «último», como «postrero». El dulce se llama así porque llega al final.'
        },
        {
          expresion: 'Mirar de [hito] en [hito]',
          pregunta: '¿Qué era el «hito»?',
          opciones: ['El blanco al que se apuntaba en un juego', 'Una mirada desafiante', 'Un cuento popular'],
          reliquia: 'En el juego del hito se tiraba a un clavo o blanco fijo. Mirar de hito en hito es mirar fijamente, como apuntando.'
        }
      ] },

      // Día 3
      { reliquias: [
        {
          expresion: 'Lanza en [ristre]',
          pregunta: '¿Qué era el «ristre»?',
          opciones: ['Un hierro de la armadura donde se apoyaba la lanza', 'Una ristra de ajos', 'El galope del caballo'],
          reliquia: 'El ristre iba fijado al peto. Con la lanza en ristre, el caballero estaba listo para embestir.'
        },
        {
          expresion: 'Creer a pie [juntillas]',
          pregunta: '¿Qué son las «juntillas»?',
          opciones: ['Los pies bien juntos', 'Unas sandalias de esparto', 'Las juntas de las baldosas'],
          reliquia: 'Estar con los pies juntos es estar firme. Creer a pie juntillas es creer sin dudar ni moverse.'
        },
        {
          expresion: 'De [pacotilla]',
          pregunta: '¿Qué era la «pacotilla»?',
          opciones: ['La carga que un marinero podía llevar por su cuenta', 'Una moneda de poco valor', 'Un juguete de trapo'],
          reliquia: 'Los marineros podían embarcar una pequeña mercancía propia sin pagar flete. Solía ser género barato.'
        }
      ] },

      // Día 4
      { reliquias: [
        {
          expresion: 'En [cuclillas]',
          pregunta: '¿De dónde viene «cuclillas»?',
          opciones: ['De la gallina clueca', 'Del cuco', 'De unas calzas de labrador'],
          reliquia: 'Antes se decía «en cluquillas», en la postura de la gallina clueca cuando incuba los huevos.'
        },
        {
          expresion: 'Sin [ambages]',
          pregunta: '¿Qué son los «ambages»?',
          opciones: ['Rodeos', 'Sobornos', 'Testigos'],
          reliquia: 'Del latín «ambages», rodeo o circunloquio. Hablar sin ambages es ir al grano.'
        },
        {
          expresion: 'A diestro y [siniestro]',
          pregunta: '¿Qué significa aquí «siniestro»?',
          opciones: ['Izquierdo', 'Funesto', 'Torcido'],
          reliquia: 'Diestro es derecho y siniestro, izquierdo. Repartir golpes a diestro y siniestro es darlos a un lado y a otro.'
        }
      ] },

      // Día 5
      { reliquias: [
        {
          expresion: 'El asunto de [marras]',
          pregunta: '¿Qué era «marras»?',
          opciones: ['Una palabra árabe que significa «una vez»', 'Unas piedras de molino', 'Un mal augurio'],
          reliquia: 'Viene del árabe hispánico «márra», una vez. Lo de marras es aquello de lo que ya se habló.'
        },
        {
          expresion: 'Defender a [ultranza]',
          pregunta: '¿Qué es la «ultranza»?',
          opciones: ['El extremo, hasta el final', 'Una ley de ultramar', 'Una lanza larga'],
          reliquia: 'Viene del francés «à outrance», luchar hasta el extremo, a muerte.'
        },
        {
          expresion: 'A la [sazón]',
          pregunta: '¿Qué es la «sazón»?',
          opciones: ['El momento oportuno', 'El punto de sal', 'Un adorno del vestido'],
          reliquia: 'La sazón es el punto justo, como el de la fruta madura. A la sazón significa «en aquel momento».'
        }
      ] },

      // Día 6
      { reliquias: [
        {
          expresion: 'Hacer [mutis] por el foro',
          pregunta: '¿Qué era el «mutis»?',
          opciones: ['La voz del teatro para indicar que un actor sale de escena', 'Un mimo', 'Un telón pequeño'],
          reliquia: 'Se usaba en el teatro para retirar a un actor, y el foro es el fondo del escenario. Hoy significa irse sin decir nada.'
        },
        {
          expresion: 'A ojo de buen [cubero]',
          pregunta: '¿Quién era el «cubero»?',
          opciones: ['El que fabricaba cubas', 'El vigilante de la bodega', 'Un jugador de dados'],
          reliquia: 'Los cuberos calculaban a simple vista cuánto cabía en un tonel.'
        },
        {
          expresion: 'En [lontananza]',
          pregunta: '¿Qué es la «lontananza»?',
          opciones: ['La lejanía', 'Una nana marinera', 'Un barco de vela'],
          reliquia: 'Del italiano «lontananza». En pintura es lo más alejado del cuadro.'
        }
      ] },

      // Día 7
      { reliquias: [
        {
          expresion: 'A la [zaga]',
          pregunta: '¿Qué era la «zaga»?',
          opciones: ['La retaguardia', 'Una saga familiar', 'Una bota de vino'],
          reliquia: 'Del árabe hispánico: la parte trasera de un ejército. Quedarse a la zaga es quedarse atrás.'
        },
        {
          expresion: 'A [granel]',
          pregunta: '¿De dónde viene «granel»?',
          opciones: ['De «granero»', 'De una medida de peso', 'De un tipo de saco'],
          reliquia: 'Del catalán «graner», granero. El grano se vendía suelto, sin envasar.'
        },
        {
          expresion: 'En [jarras]',
          pregunta: '¿Por qué «jarras»?',
          opciones: ['Los brazos imitan las asas de una jarra', 'Por unas tinajas de vino', 'Por un baile popular'],
          reliquia: 'Con las manos en la cintura y los codos hacia fuera, el cuerpo parece una jarra con dos asas.'
        }
      ] },

      // Día 8
      { reliquias: [
        {
          expresion: 'A [tenor] de',
          pregunta: '¿Qué es el «tenor»?',
          opciones: ['El contenido literal de un escrito', 'La voz del cantante', 'El tono de una conversación'],
          reliquia: 'Del latín «tenor», la letra y el sentido de un documento. A tenor de algo es según lo que dice.'
        },
        {
          expresion: 'A [fuer] de',
          pregunta: '¿Qué es el «fuer»?',
          opciones: ['Fuero, ley', 'Fuerza', 'Fuera'],
          reliquia: 'Es un apócope de «fuero». «A fuer de caballero» significa «según la ley del caballero», como corresponde a uno.'
        },
        {
          expresion: 'A [regañadientes]',
          pregunta: '¿Qué significaba en origen «regañar»?',
          opciones: ['Gruñir enseñando los dientes, como un perro', 'Rechinar los dientes de frío', 'Reñir a gritos'],
          reliquia: 'El perro regañaba mostrando los dientes. Hacer algo a regañadientes es hacerlo gruñendo por dentro.'
        }
      ] },

      // Día 9
      { reliquias: [
        {
          expresion: 'A [horcajadas]',
          pregunta: '¿De dónde viene «horcajadas»?',
          opciones: ['De la horca, el palo con dos puntas', 'De un caballo de carga', 'De un juego de niños'],
          reliquia: 'Las piernas abiertas forman una horca, como el apero de labranza con forma de Y.'
        },
        {
          expresion: 'A [quemarropa]',
          pregunta: '¿Por qué «quemarropa»?',
          opciones: ['El disparo era tan cercano que la pólvora quemaba la ropa', 'Se disparaba con la ropa en llamas', 'Se quemaba la ropa del enemigo'],
          reliquia: 'Era tan de cerca que el fogonazo chamuscaba la tela. Hoy también se usa para preguntas directas.'
        },
        {
          expresion: 'Trabajar a [destajo]',
          pregunta: '¿Qué era el «destajo»?',
          opciones: ['Un trabajo pagado por obra hecha, no por tiempo', 'Un tajo de madera', 'Un atajo'],
          reliquia: 'De «destajar», ajustar las condiciones de un trabajo. Cuanto más se hace, más se cobra, y de ahí el afán.'
        }
      ] },

      // Día 10
      { reliquias: [
        {
          expresion: 'A troche y [moche]',
          pregunta: '¿De dónde viene «moche»?',
          opciones: ['De «mochar», cortar las ramas', 'De un golpe de mochila', 'De un tipo de hacha'],
          reliquia: 'Probablemente viene de «tronchar» y «mochar», cortar ramas sin orden ni medida. De ahí, «a lo loco».'
        },
        {
          expresion: 'De [tapadillo]',
          pregunta: '¿Qué era el «tapadillo»?',
          opciones: ['El gesto de taparse la cara con el manto', 'Un tapón de corcho', 'Una tapa de bar'],
          reliquia: 'Las mujeres se cubrían la cara con el manto para no ser reconocidas. De ahí, «a escondidas».'
        },
        {
          expresion: 'A cal y [canto]',
          pregunta: '¿Qué es aquí el «canto»?',
          opciones: ['Una piedra', 'Una canción', 'Un borde'],
          reliquia: 'Cerrar a cal y canto es tapiar con argamasa y piedras: cerrar del todo.'
        }
      ] }
    ]
  };

  if (typeof module !== 'undefined' && module.exports) module.exports = DATOS;
  else raiz.RELICARIO_DATOS = DATOS;
})(this);
