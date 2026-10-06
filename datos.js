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
      ] },

      // Día 11
      { reliquias: [
        {
          expresion: 'A [hurtadillas]',
          pregunta: '¿De dónde sale «hurtadillas»?',
          opciones: ['De «hurtar», robar a escondidas', 'De «hurta», una capa con capucha', 'De un juego de niños parecido al escondite'],
          reliquia: 'Se formó sobre «hurtar»: obrar como quien roba, sin que nadie lo vea.'
        },
        {
          expresion: 'Postrarse de [hinojos]',
          pregunta: '¿Qué son los «hinojos»?',
          opciones: ['Las rodillas', 'Unas hierbas aromáticas', 'Los tobillos'],
          reliquia: 'Del latín «genuculum», rodilla. Nada que ver con la planta, que viene de «fenuculum». Ponerse de hinojos es arrodillarse.'
        },
        {
          expresion: 'Pasar por las horcas [caudinas]',
          pregunta: '¿Qué eran las horcas caudinas?',
          opciones: ['Un desfiladero donde se humilló a un ejército romano', 'Unos patíbulos medievales', 'Unas herramientas de labranza'],
          reliquia: 'En el 321 a. C., los samnitas atraparon a un ejército romano en el paso de Caudio y obligaron a los soldados a desfilar bajo un yugo de lanzas. Es someterse a una humillación.'
        }
      ] },

      // Día 12
      { reliquias: [
        {
          expresion: 'Estar sin [blanca]',
          pregunta: '¿Qué era una «blanca»?',
          opciones: ['Una moneda de poco valor', 'Una sábana', 'Una hoja de papel'],
          reliquia: 'Era una moneda de vellón de Castilla; se llamó así por su color, por la plata que llevaba al principio. No tener ni una blanca es no tener nada.'
        },
        {
          expresion: 'Mondo y [lirondo]',
          pregunta: '¿Dónde se usa «lirondo» fuera de esta expresión?',
          opciones: ['En ningún sitio: solo vive aquí', 'En los romances, como «lirio»', 'En el habla de los pastores, como «limpio»'],
          reliquia: 'Es de origen incierto y no existe suelta: solo refuerza a «mondo», limpio, pelado. Mondo y lirondo: limpio y sin añadidos.'
        },
        {
          expresion: 'Echar el [bofe]',
          pregunta: '¿Qué es el «bofe»?',
          opciones: ['El pulmón', 'El aliento', 'La bilis'],
          reliquia: 'Es el pulmón, sobre todo el de las reses. Echar el bofe es trabajar o correr hasta quedarse sin aliento.'
        }
      ] },

      // Día 13
      { reliquias: [
        {
          expresion: 'Estar en [Babia]',
          pregunta: '¿Qué es Babia?',
          opciones: ['Una comarca de León', 'Un reino de cuento', 'Un monasterio de clausura'],
          reliquia: 'Es una comarca de montaña leonesa. Según la tradición, los reyes de León se retiraban allí a descansar, ajenos a los asuntos de la corte.'
        },
        {
          expresion: 'De [sopetón]',
          pregunta: '¿Qué era un «sopetón»?',
          opciones: ['Un golpe fuerte y repentino dado con la mano', 'Una sopa espesa que se tomaba deprisa', 'Un soplo de viento'],
          reliquia: 'El diccionario aún lo recoge como golpe fuerte dado con la mano. De ahí «de sopetón»: de golpe, sin avisar.'
        },
        {
          expresion: 'Dar en el [quid]',
          pregunta: '¿Qué es el «quid»?',
          opciones: ['El «qué», en latín', 'El centro de una diana', 'Una moneda romana'],
          reliquia: 'Es el pronombre latino «quid», «qué»: la esencia o el porqué de algo. Dar en el quid es acertar con lo esencial.'
        }
      ] },

      // Día 14
      { reliquias: [
        {
          expresion: 'En un [periquete]',
          pregunta: '¿Qué es un «periquete»?',
          opciones: ['Un espacio de tiempo brevísimo', 'Un loro pequeño', 'Un trago corto de vino'],
          reliquia: 'Así lo define el diccionario: un instante. Su origen no está del todo claro, pero la palabra apenas se usa fuera de «en un periquete».'
        },
        {
          expresion: 'No valer un [ardite]',
          pregunta: '¿Qué era un «ardite»?',
          opciones: ['Una moneda de muy poco valor', 'Una chispa de fuego', 'Un tipo de alfiler'],
          reliquia: 'Fue una moneda de escaso valor que circuló antiguamente en Castilla y en otros reinos. Lo que no vale un ardite no vale nada.'
        },
        {
          expresion: 'Al [socaire] de',
          pregunta: '¿Qué es el «socaire»?',
          opciones: ['El abrigo que da algo del lado contrario al viento', 'Un tipo de vela de barco', 'Un muelle de piedra'],
          reliquia: 'Es palabra marinera: el lado de un objeto resguardado del viento. Hacer algo al socaire de alguien es hacerlo a su amparo.'
        }
      ] },

      // Día 15
      { reliquias: [
        {
          expresion: 'A [tientas]',
          pregunta: '¿De dónde sale «tientas»?',
          opciones: ['De «tentar», tocar', 'De «tienda»', 'De «tinta»'],
          reliquia: '«Tentar» significaba tocar, palpar. Andar a tientas es avanzar palpando, como a oscuras.'
        },
        {
          expresion: 'Más feo que [Picio]',
          pregunta: '¿Quién era Picio?',
          opciones: ['Un zapatero granadino', 'Un bufón de la corte de Felipe IV', 'Un diablo de las pastorelas'],
          reliquia: 'Según la tradición, un zapatero de Granada del siglo XIX al que, condenado a muerte, le llegó el indulto: del susto se quedó calvo y la cara se le llenó de bultos.'
        },
        {
          expresion: 'Poner pies en [polvorosa]',
          pregunta: '¿Qué era la «polvorosa»?',
          opciones: ['La calle, en la jerga de los rufianes', 'La pólvora', 'Una mula rápida'],
          reliquia: 'En germanía, la jerga de los delincuentes del Siglo de Oro, «polvorosa» era la calle, por el polvo. Poner pies en polvorosa es salir huyendo.'
        }
      ] },

      // Día 16
      { reliquias: [
        {
          expresion: 'Ojo [avizor]',
          pregunta: '¿Qué significa «avizor»?',
          opciones: ['Que vigila', 'Que guiña', 'Que llora'],
          reliquia: 'Es el que avizora, es decir, el que acecha o vigila con atención. Ojo avizor: alerta.'
        },
        {
          expresion: 'Ojo a la [funerala]',
          pregunta: '¿Qué era ir «a la funerala»?',
          opciones: ['Llevar las armas boca abajo en señal de duelo', 'Pintarse la cara de negro', 'Ir vestido de luto riguroso'],
          reliquia: 'En los entierros militares, los soldados llevaban las armas con la boca hacia abajo, «a la funerala». Un ojo a la funerala es un ojo amoratado por un golpe.'
        },
        {
          expresion: 'Echar el [resto]',
          pregunta: '¿Qué era el «resto»?',
          opciones: ['La cantidad que se apostaba en el juego', 'Lo que sobraba de la comida', 'Un descanso'],
          reliquia: 'En los juegos de envite, el resto era el dinero que el jugador ponía en juego. Echar el resto es jugárselo todo, poner todo el esfuerzo.'
        }
      ] },

      // Día 17
      { reliquias: [
        {
          expresion: 'A ojos [vistas]',
          pregunta: '¿Qué quiere decir aquí «vistas»?',
          opciones: ['Visibles, que se ven', 'Paisajes', 'Ojos ya cansados'],
          reliquia: '«Visto» se usaba como «visible». A ojos vistas es de forma clara y patente, que cualquiera puede verlo.'
        },
        {
          expresion: 'Tomar las de [Villadiego]',
          pregunta: '¿Qué es Villadiego?',
          opciones: ['Un pueblo de Burgos', 'Un bandolero famoso', 'Un río de Andalucía'],
          reliquia: 'Es una villa burgalesa. La forma antigua era «tomar las calzas de Villadiego»; tomarlas era salir huyendo, aunque el origen exacto se discute.'
        },
        {
          expresion: 'De [bóbilis], [bóbilis]',
          pregunta: '¿Qué es «bóbilis»?',
          opciones: ['Un latín de broma', 'Una moneda', 'Un bobo de comedia'],
          reliquia: 'Es un falso latín de tono burlesco. De bóbilis, bóbilis es de balde, sin esfuerzo.'
        }
      ] },

      // Día 18
      { reliquias: [
        {
          expresion: 'De [cabo] a rabo',
          pregunta: '¿Qué es aquí el «cabo»?',
          opciones: ['El extremo, el principio de algo', 'Un militar de baja graduación', 'Una cuerda de barco'],
          reliquia: '«Cabo» es el extremo de algo (del latín «caput», cabeza). De cabo a rabo: de la cabeza a la cola, de principio a fin.'
        },
        {
          expresion: 'A la [rebatiña]',
          pregunta: '¿Qué era la «rebatiña»?',
          opciones: ['Recoger a empujones algo que se arroja', 'Una batalla naval', 'Una subasta pública'],
          reliquia: 'Como cuando se tiran caramelos o monedas y todos se lanzan a cogerlos. Andar a la rebatiña es disputarse algo sin orden.'
        },
        {
          expresion: 'Pagar a [escote]',
          pregunta: '¿Qué es el «escote»?',
          opciones: ['La parte que le toca pagar a cada uno', 'El cuello de un vestido', 'La cuota de un gremio'],
          reliquia: 'Viene del francés antiguo «escot», cuota. Nada que ver con el escote de un vestido, que viene de «escotar», cortar.'
        }
      ] },

      // Día 19
      { reliquias: [
        {
          expresion: 'En un [tris]',
          pregunta: '¿Qué es el «tris»?',
          opciones: ['El leve sonido de algo delicado al quebrarse', 'Una tercera parte de algo', 'Un pelo de la barba'],
          reliquia: 'Es una onomatopeya: el chasquido de un vidrio que se rompe. Estar en un tris es estar a un instante de que algo ocurra.'
        },
        {
          expresion: 'Traer al [retortero]',
          pregunta: '¿Qué es el «retortero»?',
          opciones: ['Una vuelta alrededor', 'Un torno de alfarero', 'Un retortijón de tripas'],
          reliquia: 'El diccionario lo define como «vuelta alrededor». Traer a alguien al retortero es tenerlo dando vueltas de acá para allá.'
        },
        {
          expresion: 'Hacer [hincapié]',
          pregunta: '¿De dónde viene «hincapié»?',
          opciones: ['De «hincar el pie»', 'De «hincar» una estaca', 'De un juego de pelota'],
          reliquia: 'Es literalmente hincar el pie en el suelo para afirmarse y hacer fuerza. Hacer hincapié es insistir en algo.'
        }
      ] },

      // Día 20
      { reliquias: [
        {
          expresion: 'A [tutiplén]',
          pregunta: '¿De dónde viene «tutiplén»?',
          opciones: ['Del catalán «tot i ple», todo y lleno', 'Del latín «totum plenum»', 'De un tutor muy generoso'],
          reliquia: 'Llegó del catalán «a tot i ple», a montones. A tutiplén es en abundancia.'
        },
        {
          expresion: 'Dejar en la [estacada]',
          pregunta: '¿Qué era la «estacada»?',
          opciones: ['El recinto cercado donde se libraba un combate', 'Una estaca puntiaguda', 'Un pozo seco'],
          reliquia: 'Era el campo cercado de estacas donde se celebraban duelos y torneos. Quien quedaba en la estacada quedaba vencido o muerto en el campo; dejar a alguien así es abandonarlo en apuros.'
        },
        {
          expresion: 'Sin [embargo]',
          pregunta: '¿Qué era el «embargo»?',
          opciones: ['Un impedimento, un estorbo', 'Un barco', 'Una promesa'],
          reliquia: '«Embargar» significaba impedir o estorbar. Sin embargo es «sin que esto lo impida», es decir, a pesar de ello.'
        }
      ] },

      // Día 21
      { reliquias: [
        {
          expresion: 'No saber ni [jota]',
          pregunta: '¿Qué es la «jota»?',
          opciones: ['Una letra', 'Un baile aragonés', 'Una moneda'],
          reliquia: 'Es la iota, la letra más pequeña del alfabeto griego. Ya el Evangelio dice que no pasará de la Ley ni una iota. No saber ni jota es no saber nada.'
        },
        {
          expresion: 'A la [vera] del camino',
          pregunta: '¿Qué es la «vera»?',
          opciones: ['La orilla', 'La verdad', 'La primavera'],
          reliquia: 'Es la orilla o el lado de algo. Estar a la vera de alguien es estar a su lado.'
        },
        {
          expresion: 'Andar de la [ceca] a la Meca',
          pregunta: '¿Qué era la «ceca»?',
          opciones: ['La casa donde se acuñaba la moneda', 'Una sequía', 'Un puerto del norte de África'],
          reliquia: 'Es la casa donde se fabrica la moneda, del árabe «sikka», cuño. Otra explicación la relaciona con la mezquita de Córdoba. Ir de la ceca a la Meca es ir de un sitio a otro sin parar.'
        }
      ] },

      // Día 22
      { reliquias: [
        {
          expresion: 'Irse a [pique]',
          pregunta: '¿Qué significa «a pique»?',
          opciones: ['En vertical, cortado a plomo', 'Con un agujero', 'Picado por las olas'],
          reliquia: 'En el lenguaje marinero, una costa a pique es la que cae en vertical. Un barco que se va a pique se hunde hasta el fondo.'
        },
        {
          expresion: 'De higos a [brevas]',
          pregunta: '¿Qué son las «brevas»?',
          opciones: ['Los primeros frutos de la higuera', 'Unos higos secos', 'Breves ratos de descanso'],
          reliquia: 'La higuera breval da dos cosechas: las brevas al principio del verano y los higos al final. De higos a brevas pasa casi un año: muy de tarde en tarde.'
        },
        {
          expresion: 'Tener en [vilo]',
          pregunta: '¿Qué significa «en vilo»?',
          opciones: ['Suspendido en el aire, sin apoyo', 'Atado con un hilo', 'Encerrado con llave'],
          reliquia: 'En vilo es en el aire, sin apoyo. Tener a alguien en vilo es tenerlo inquieto, sin saber qué pasará.'
        }
      ] },

      // Día 23
      { reliquias: [
        {
          expresion: 'Por [ende]',
          pregunta: '¿Qué significaba «ende»?',
          opciones: ['Allí, de allí', 'El final', 'Dentro'],
          reliquia: 'Del latín «inde», de allí. «Por ende» es por eso, por tanto. Suelta, «ende» desapareció hace siglos.'
        },
        {
          expresion: 'Pasar a pie [enjuto]',
          pregunta: '¿Qué significa «enjuto»?',
          opciones: ['Seco', 'Descalzo', 'Cojo'],
          reliquia: '«Enjuto» es seco, y aún se dice de una persona delgada. Pasar a pie enjuto es cruzar sin mojarse los pies.'
        },
        {
          expresion: 'Ser el [acabose]',
          pregunta: '¿Qué es el «acabose»?',
          opciones: ['«Se acabó», convertido en sustantivo', 'El final de una comedia', 'Una campana'],
          reliquia: 'Viene de «acabóse», «se acabó». Ser el acabose es ser el colmo, el no va más, casi siempre de algo malo.'
        }
      ] },

      // Día 24
      { reliquias: [
        {
          expresion: 'De [tomo] y lomo',
          pregunta: '¿Qué es aquí el «tomo»?',
          opciones: ['El bulto, la importancia', 'Un volumen de un libro', 'Un trago'],
          reliquia: 'Además de volumen de un libro, «tomo» significó bulto e importancia. De tomo y lomo es de mucha importancia o gravedad: un sinvergüenza de tomo y lomo.'
        },
        {
          expresion: 'Vivir a salto de [mata]',
          pregunta: '¿Qué es la «mata»?',
          opciones: ['Un arbusto', 'Un matadero', 'Una alfombra'],
          reliquia: 'Es la del que huye saltando de un matorral a otro para esconderse. Vivir a salto de mata es vivir sin orden ni previsión, aprovechando lo que surge.'
        },
        {
          expresion: 'Dar [pábulo]',
          pregunta: '¿Qué es el «pábulo»?',
          opciones: ['El alimento, el pasto', 'Un rumor', 'Una chispa'],
          reliquia: 'Del latín «pabulum», alimento o forraje. Dar pábulo a un rumor es alimentarlo.'
        }
      ] },

      // Día 25
      { reliquias: [
        {
          expresion: 'Meterse en camisa de once [varas]',
          pregunta: '¿Qué era la «vara»?',
          opciones: ['Una medida de longitud', 'Un palo de pastor', 'Una costura'],
          reliquia: 'La vara castellana medía unos 84 centímetros. Una camisa de once varas sería enorme: meterse en ella es complicarse en lo que no le toca a uno.'
        },
        {
          expresion: 'Plantar al [tresbolillo]',
          pregunta: '¿Qué es el «tresbolillo»?',
          opciones: ['Una disposición en filas alternas', 'Un juego de bolos', 'Un tipo de encaje'],
          reliquia: 'Las plantas se ponen en filas paralelas de modo que cada una queda frente al hueco de la fila vecina, formando triángulos, como los puntos del cinco en un dado.'
        },
        {
          expresion: 'No dar [abasto]',
          pregunta: '¿Qué era el «abasto»?',
          opciones: ['La provisión de lo necesario', 'Un instrumento de medida', 'Un caballo de carga'],
          reliquia: 'Es la provisión de víveres, como en «mercado de abastos». No dar abasto es no poder atender todo lo que se necesita.'
        }
      ] },

      // Día 26
      { reliquias: [
        {
          expresion: 'De [extranjis]',
          pregunta: '¿De dónde viene «extranjis»?',
          opciones: ['De «extranjero», con un final de broma', 'Del nombre de un contrabandista', 'De una palabra del caló'],
          reliquia: 'Es una deformación festiva de «extranjero»: lo que venía de extranjis venía de fuera, de contrabando. De ahí, a escondidas.'
        },
        {
          expresion: 'Salir por [peteneras]',
          pregunta: '¿Qué son las «peteneras»?',
          opciones: ['Un cante flamenco', 'Unas puertas traseras', 'Unas zapatillas de baile'],
          reliquia: 'La petenera es un cante flamenco. Salir por peteneras es decir algo que no viene al caso, como quien se arranca con otro cante.'
        },
        {
          expresion: 'Llover a [raudales]',
          pregunta: '¿Qué es un «raudal»?',
          opciones: ['Un caudal de agua que corre con fuerza', 'Un rayo', 'Un camino real'],
          reliquia: 'Es el caudal de agua que corre violentamente. A raudales es en abundancia.'
        }
      ] },

      // Día 27
      { reliquias: [
        {
          expresion: 'Echar su [cuarto] a espadas',
          pregunta: '¿Qué era aquí un «cuarto»?',
          opciones: ['Una moneda', 'Una habitación', 'La cuarta parte de una hora'],
          reliquia: 'El cuarto era una moneda de cobre. Se suele explicar como apostarla en el juego: echar su cuarto a espadas es meterse en una conversación ajena.'
        },
        {
          expresion: 'Andar a la [greña]',
          pregunta: '¿Qué es la «greña»?',
          opciones: ['El pelo revuelto', 'Una pelea de gatos', 'Una rama seca'],
          reliquia: 'Es la cabellera revuelta y mal peinada. Andar a la greña es reñir, como quien se tira de los pelos.'
        },
        {
          expresion: 'Irse al [garete]',
          pregunta: '¿Qué significa «al garete»?',
          opciones: ['A la deriva, sin gobierno', 'Al fondo del mar', 'A la garita del vigía'],
          reliquia: 'Es término marinero: un barco va al garete cuando, sin gobierno, lo arrastran el viento o la corriente. Se suele relacionar con el francés «égaré», extraviado.'
        }
      ] },

      // Día 28
      { reliquias: [
        {
          expresion: 'Hacer el [paripé]',
          pregunta: '¿De dónde viene «paripé»?',
          opciones: ['Del caló, la lengua de los gitanos españoles', 'Del francés', 'Del nombre de un actor famoso'],
          reliquia: 'Viene del caló, donde significaba «cambio, trueque». Hacer el paripé es fingir, aparentar.'
        },
        {
          expresion: 'Sacar de [quicio]',
          pregunta: '¿Qué es el «quicio»?',
          opciones: ['La parte de la puerta donde gira el gozne', 'El juicio', 'El umbral'],
          reliquia: 'Es la parte de la puerta o ventana en que encaja el eje sobre el que gira. Una puerta sacada de quicio no cierra: así queda quien pierde los nervios.'
        },
        {
          expresion: 'Riquezas sin [cuento]',
          pregunta: '¿Qué era aquí el «cuento»?',
          opciones: ['La cuenta, el cómputo', 'Una historia', 'Un engaño'],
          reliquia: '«Cuento» y «cuenta» tienen el mismo origen, «contar». Sin cuento es sin número, innumerable.'
        }
      ] },

      // Día 29
      { reliquias: [
        {
          expresion: 'Quedarse in [albis]',
          pregunta: '¿Qué significa «in albis»?',
          opciones: ['En blanco, en latín', 'En los Alpes', 'En pañales'],
          reliquia: 'Es latín: «en blanco». Quedarse in albis es quedarse sin entender nada o sin conseguir lo que se esperaba.'
        },
        {
          expresion: 'Armarse la de San [Quintín]',
          pregunta: '¿Qué fue San Quintín?',
          opciones: ['Una batalla', 'Un santo pendenciero', 'Una feria de ganado'],
          reliquia: 'En la batalla de San Quintín, en 1557, las tropas de Felipe II derrotaron a las francesas. Armarse la de San Quintín es organizarse un gran alboroto.'
        },
        {
          expresion: 'Darse [pisto]',
          pregunta: '¿Qué era el «pisto»?',
          opciones: ['Un jugo de carne de ave para los enfermos', 'Un perfume caro', 'Una pista de baile'],
          reliquia: 'Antes de nombrar el guiso de verduras, el pisto era el jugo que se sacaba machacando carne de ave, para dárselo a los enfermos. Darse pisto es darse importancia.'
        }
      ] },

      // Día 30
      { reliquias: [
        {
          expresion: 'Ponerse el mundo por [montera]',
          pregunta: '¿Qué es la «montera»?',
          opciones: ['Un gorro', 'Una silla de montar', 'Una manta de monte'],
          reliquia: 'Es la prenda para cubrir la cabeza, como la de los toreros. Ponerse el mundo por montera es hacer lo que uno quiere sin importarle lo que digan.'
        },
        {
          expresion: 'Quedarse a la luna de [Valencia]',
          pregunta: '¿Qué tiene que ver Valencia?',
          opciones: ['Quedarse fuera de sus murallas, de noche', 'Su famoso observatorio', 'Una canción de cuna valenciana'],
          reliquia: 'Se explica por quienes llegaban tarde y encontraban cerradas las puertas de la muralla de Valencia, y tenían que pasar la noche al raso. Es quedarse frustrado, sin lo que se esperaba.'
        },
        {
          expresion: 'Tanto [tirios] como troyanos',
          pregunta: '¿Quiénes eran los «tirios»?',
          opciones: ['Los habitantes de Tiro', 'Los habitantes del Tirol', 'Unos soldados de élite'],
          reliquia: 'En la «Eneida», los cartagineses, descendientes de los fenicios de Tiro, acaban enfrentados a los troyanos de Eneas. Tirios y troyanos son dos bandos contrarios.'
        }
      ] },

      // Día 31
      { reliquias: [
        {
          expresion: 'En el quinto [pino]',
          pregunta: '¿Qué era el «quinto pino»?',
          opciones: ['Uno de los pinos de las afueras de Madrid', 'Un pino de la Biblia', 'Un monte de Navarra'],
          reliquia: 'La explicación más extendida habla de cinco pinos plantados a lo largo del actual paseo de la Castellana, en Madrid, en el siglo XVIII: el quinto era el más alejado.'
        },
        {
          expresion: 'A la [remanguillé]',
          pregunta: '¿Qué es «remanguillé»?',
          opciones: ['Un falso francés hecho en España', 'Un plato francés', 'Una danza de corte'],
          reliquia: 'Suena a francés, pero es una invención española, probablemente sobre «remangar». A la remanguillé es en desorden, de cualquier manera.'
        },
        {
          expresion: 'Ir de punta en [blanco]',
          pregunta: '¿Qué era aquí el «blanco»?',
          opciones: ['La armadura de acero bruñido', 'Un traje de boda', 'La diana del tiro'],
          reliquia: 'Se decía del caballero armado con todas las piezas de su armadura, de acero pulido o «blanco». Ir de punta en blanco es ir muy arreglado.'
        }
      ] },

      // Día 32
      { reliquias: [
        {
          expresion: 'Estar al [pairo]',
          pregunta: '¿Qué es estar «al pairo»?',
          opciones: ['Un barco quieto con las velas tendidas', 'Un ave quieta en su nido', 'Un caballo en el establo'],
          reliquia: 'Es término náutico: la nave se queda quieta con las velas desplegadas. Estar al pairo es estar a la espera, sin hacer nada.'
        },
        {
          expresion: 'Ni [fu] ni [fa]',
          pregunta: '¿Qué son «fu» y «fa»?',
          opciones: ['Dos voces sin significado propio', 'Dos notas de una escala antigua', 'El soplo y el suspiro'],
          reliquia: 'Son voces expresivas que no significan nada por sí mismas, igual que la cosa a la que se aplican: ni fu ni fa es ni bueno ni malo, indiferente.'
        },
        {
          expresion: 'Poner en [solfa]',
          pregunta: '¿Qué es la «solfa»?',
          opciones: ['El arte de leer y entonar la música', 'Un sol de mediodía', 'Una silla de mano'],
          reliquia: 'Poner algo en solfa era escribirlo en notación musical. Hoy es presentarlo de forma ridícula.'
        }
      ] },

      // Día 33
      { reliquias: [
        {
          expresion: 'A la [trágala]',
          pregunta: '¿Qué fue «el trágala»?',
          opciones: ['Una canción política', 'Una medicina amarga', 'Un castigo militar'],
          reliquia: 'Era una canción con que los liberales del Trienio, hacia 1820, se burlaban de los absolutistas: «Trágala, perro». Hacer algo a la trágala es hacerlo a la fuerza.'
        },
        {
          expresion: 'Sembrar a [voleo]',
          pregunta: '¿Qué es sembrar «a voleo»?',
          opciones: ['Arrojar la semilla a puñados', 'Sembrar con un azadón', 'Sembrar en hileras'],
          reliquia: 'Sembrar a voleo es lanzar la semilla al aire con la mano, a puñados. De ahí, hacer algo de cualquier manera, sin método.'
        },
        {
          expresion: 'Por [ventura]',
          pregunta: '¿Qué es la «ventura»?',
          opciones: ['La suerte', 'Una aventura', 'El viento'],
          reliquia: '«Ventura» es fortuna o suerte. Por ventura significa quizá, por casualidad, y aparece a cada paso en el «Quijote».'
        }
      ] },

      // Día 34
      { reliquias: [
        {
          expresion: 'A [sabiendas]',
          pregunta: '¿De dónde sale «sabiendas»?',
          opciones: ['Del gerundio «sabiendo»', 'De «sabias», mujeres sabias', 'De un libro de leyes'],
          reliquia: 'Sale de «sabiendo». A sabiendas es sabiendo lo que se hace, de forma deliberada.'
        },
        {
          expresion: 'Llevar a [cuestas]',
          pregunta: '¿Qué eran las «cuestas»?',
          opciones: ['Las costillas, la espalda', 'Las pendientes del camino', 'Los cestos de carga'],
          reliquia: 'Viene del latín «costa», costilla. Llevar algo a cuestas es llevarlo sobre la espalda.'
        },
        {
          expresion: 'De [Pascuas] a Ramos',
          pregunta: '¿Cuánto hay de Pascuas a Ramos?',
          opciones: ['Casi un año', 'Una semana', 'Un mes'],
          reliquia: 'El Domingo de Ramos cae una semana antes que el de Pascua; contando desde una Pascua hasta los Ramos del año siguiente, pasa casi un año. Es muy de tarde en tarde.'
        }
      ] },

      // Día 35
      { reliquias: [
        {
          expresion: 'Mirar de [soslayo]',
          pregunta: '¿Qué significa «soslayo»?',
          opciones: ['Oblicuo, de lado', 'Bajo el sol', 'Con desprecio'],
          reliquia: 'De soslayo es oblicuamente, de lado. Mirar de soslayo es mirar de reojo, sin volver la cabeza.'
        },
        {
          expresion: 'A [espuertas]',
          pregunta: '¿Qué es una «espuerta»?',
          opciones: ['Una cesta de esparto con asas', 'Una puerta pequeña', 'Una pala'],
          reliquia: 'La espuerta es una cesta de esparto o palma con dos asas, para acarrear tierra o escombro. A espuertas es en abundancia, como si se sacara con ella.'
        },
        {
          expresion: 'Con [creces]',
          pregunta: '¿Qué eran las «creces»?',
          opciones: ['Aumentos', 'Cruces', 'Deudas'],
          reliquia: 'Viene de «crecer»: las creces eran el aumento de algo. Devolver algo con creces es devolverlo de sobra.'
        }
      ] },

      // Día 36
      { reliquias: [
        {
          expresion: 'Al [tuntún]',
          pregunta: '¿Qué es el «tuntún»?',
          opciones: ['Una voz que imita un ruido', 'Un tambor africano', 'Un tonto de pueblo'],
          reliquia: 'Es una voz onomatopéyica, como de golpes sin ritmo. Al tuntún, o al buen tuntún, es sin reflexión, a la buena de Dios.'
        },
        {
          expresion: 'A [trancas] y [barrancas]',
          pregunta: '¿Qué eran las «trancas» y las «barrancas»?',
          opciones: ['Obstáculos: palos y barrancos', 'Peleas y riñas', 'Puertas y ventanas'],
          reliquia: 'La tranca es el palo grueso que atranca una puerta; la barranca, el barranco. A trancas y barrancas es salvando obstáculos, con mucha dificultad.'
        },
        {
          expresion: 'En [aras] de',
          pregunta: '¿Qué es un «ara»?',
          opciones: ['Un altar', 'Un arado', 'Una medida de tierra'],
          reliquia: 'Es el altar donde se hacían los sacrificios. En aras de algo es en honor o en interés de ello, como quien se sacrifica en su altar.'
        }
      ] },

      // Día 37
      { reliquias: [
        {
          expresion: 'Llevar en [volandas]',
          pregunta: '¿Qué quiere decir «volandas»?',
          opciones: ['Por el aire, sin tocar el suelo', 'En una carreta', 'De mala gana'],
          reliquia: 'Viene de «volar». Llevar a alguien en volandas es llevarlo en alto, levantado del suelo.'
        },
        {
          expresion: 'No tener un [ochavo]',
          pregunta: '¿Qué era un «ochavo»?',
          opciones: ['Una moneda de cobre', 'La octava parte de una herencia', 'Una moneda de oro'],
          reliquia: 'Era una moneda española de cobre que pesaba un octavo de onza y valía dos maravedís.'
        },
        {
          expresion: 'De [consuno]',
          pregunta: '¿Qué es «consuno»?',
          opciones: ['La unión de «con» y «uno»', 'Un consejo', 'Un consuelo'],
          reliquia: 'Es «con uno», todos a una. De consuno es juntamente, de común acuerdo.'
        }
      ] },

      // Día 38
      { reliquias: [
        {
          expresion: 'Más viejo que [Matusalén]',
          pregunta: '¿Quién fue Matusalén?',
          opciones: ['Un patriarca bíblico', 'Un rey visigodo', 'Un ermitaño'],
          reliquia: 'Según el Génesis, vivió 969 años: es el personaje más longevo de la Biblia.'
        },
        {
          expresion: 'Poner a buen [recaudo]',
          pregunta: '¿Qué significaba «recaudo»?',
          opciones: ['Cuidado, custodia', 'La recaudación de impuestos', 'Un recado'],
          reliquia: 'Además de recaudación, «recaudo» significó precaución y custodia. Poner algo a buen recaudo es guardarlo en lugar seguro.'
        },
        {
          expresion: 'Poner en un [brete]',
          pregunta: '¿Qué era un «brete»?',
          opciones: ['Un cepo de hierro para los pies de los presos', 'Una pregunta capciosa', 'Un pozo'],
          reliquia: 'Era el cepo con que se sujetaban los pies de los reos. Poner a alguien en un brete es dejarlo en un aprieto del que no puede salir.'
        }
      ] },

      // Día 39
      { reliquias: [
        {
          expresion: 'A [bocajarro]',
          pregunta: '¿De qué está hecho «bocajarro»?',
          opciones: ['De «boca» y «jarro»', 'De «boca» y «carro»', 'De un apellido'],
          reliquia: 'Es «a boca de jarro»: como quien bebe directamente del jarro. Hoy es disparar desde muy cerca, o decir algo de sopetón.'
        },
        {
          expresion: 'Ni por [asomo]',
          pregunta: '¿Qué es un «asomo»?',
          opciones: ['Un indicio o señal', 'Un balcón', 'Un susto'],
          reliquia: 'Es el indicio o la señal de algo, lo que asoma. Ni por asomo es de ningún modo.'
        },
        {
          expresion: 'A [porfía]',
          pregunta: '¿Qué es la «porfía»?',
          opciones: ['La insistencia o competencia tenaz', 'Una mentira', 'Un premio'],
          reliquia: '«Porfía» es la insistencia obstinada o la competencia. Hacer algo a porfía es hacerlo compitiendo, cada uno más que el otro.'
        }
      ] }
    ]
  };

  if (typeof module !== 'undefined' && module.exports) module.exports = DATOS;
  else raiz.RELICARIO_DATOS = DATOS;
})(this);
