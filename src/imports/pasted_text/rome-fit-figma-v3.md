================================================================================
PROMPT PARA IA DE GEMMA / GEMINI - MEJORA DEL PROTOTIPO FIGMA ROMEFIT
Proyecto: RomeFit - Sistema de Recomendacion de Tallaje y Visualizacion de Entalle
Avance 3 - Semana 12
Prototipo actual: https://www.figma.com/make/N2wDnwdCxEkm2SIxq2XOSD/Avance-2-RomeFit
================================================================================

CONTEXTO DEL PROYECTO (LEE ESTO PRIMERO):
-------------------------------------------
Soy estudiante de la Universidad Tecnologica del Peru (UTP), carrera de Ingenieria de
Sistemas. Estoy desarrollando un proyecto llamado RomeFit, que es un asistente inteligente
de recomendacion de tallaje para una tienda de moda urbana/streetwear llamada Rome Store.

El problema que resuelve: Cuando las personas compran ropa online (especialmente prendas
oversize y streetwear), no saben que talla pedir porque los estandares de talla varian
mucho entre marcas. Esto genera un 67% de las devoluciones por temas de talla. RomeFit
permite que el usuario ingrese sus medidas y preferencias de ajuste, y el sistema le
recomienda la talla correcta con una visualizacion de como quedara la prenda.

Usuarios principales:
1. Jovenes de 15-35 anos que compran moda urbana online
2. Personas con anatomia no estandar (tallas que no entran en el promedio)
3. NUEVO PARA ESTE AVANCE: Usuarios con discapacidad visual (usan lectores de pantalla
   como VoiceOver, TalkBack, NVDA)

El prototipo actual en Figma tiene las siguientes pantallas basicas:
- Pantalla de bienvenida/inicio
- Flujo de ingreso de medidas (actualmente 5 pasos, hay que reducirlo a 3)
- Pantalla de resultados con la recomendacion de talla
- Posiblemente una pantalla de perfil

================================================================================
INSTRUCCIONES PARA LA IA - LO QUE NECESITAS HACER:
================================================================================

Necesito que me ayudes a mejorar y expandir el prototipo de Figma de RomeFit para el
Avance 3. A continuacion te detallo EXACTAMENTE que pantallas nuevas necesito, que cambios
hacer en las existentes, y como deben verse visualmente.

------------------------------------------------------------------------
CAMBIO 1: OPTIMIZAR EL FLUJO DE INGRESO DE MEDIDAS (de 5 pasos a 3 pasos)
------------------------------------------------------------------------
SITUACION ACTUAL: El flujo tiene demasiados pasos y es confuso.
LO QUE NECESITO:

PASO 1 de 3 - "Tus Medidas":
- Titulo: "Cuales son tus medidas?"
- Campo 1: Altura (en cm) - input numerico con icono de persona
- Campo 2: Peso (en kg) - input numerico con icono de bascula
- Campo 3: Medida de pecho/busto (en cm) - con ilustracion pequena de como medir
- Campo 4 (opcional): Cintura (en cm)
- Al pie: "No tienes cinta metrica? Usa tu talla de referencia" con link al paso alternativo
- Boton: "Siguiente" (color rojo oscuro #C00000 o similar al branding de Rome Store)
- Barra de progreso: Paso 1 de 3

PASO 2 de 3 - "Tu Estilo de Ajuste":
- Titulo: "Como te gusta que te quede?"
- 4 opciones visuales con ilustraciones de siluetas:
  * Opcion A: "Muy Justo" - silueta ajustada al cuerpo
  * Opcion B: "Justo" - silueta que sigue la forma pero sin apretar
  * Opcion C: "Oversize Moderado" - hombros caidos un poco, holgado (RECOMENDADO badge)
  * Opcion D: "Oversize Extremo" - muy amplio, caida dramatica
- Cada opcion: ilustracion simple de silueta + nombre + descripcion corta de 5-8 palabras
- Las opciones deben ser tarjetas seleccionables con estado visual claro (borde rojo cuando
  seleccionada)
- Barra de progreso: Paso 2 de 3
- Botones: "Atras" y "Ver mi talla recomendada"

PASO 3 de 3 - "Tu Marca de Referencia" (OPCIONAL pero recomendado):
- Titulo: "En que marca compras normalmente?"
- Subtitulo: "Esto nos ayuda a calibrar mejor tu recomendacion"
- Lista de marcas comunes: Nike, Adidas, Zara, H&M, Supreme, Off-White, Local Peruano,
  Otra (campo libre)
- Selector de tu talla habitual en esa marca: XS, S, M, L, XL, XXL
- Barra de progreso: Paso 3 de 3
- Botones: "Atras" y "Calcular mi talla"

------------------------------------------------------------------------
CAMBIO 2: MEJORAR LA PANTALLA DE RESULTADOS
------------------------------------------------------------------------
SITUACION ACTUAL: La pantalla de resultados es basica y falta informacion visual.
LO QUE NECESITO:

PANTALLA DE RESULTADO - "Tu Talla Ideal":
- Header: Logo RomeFit / Rome Store en la parte superior
- Talla recomendada: En grande y prominente - ejemplo "TALLA M" (texto grande, negrita,
  color destacado)
- Subtitulo: "Basado en tus medidas y preferencia oversize moderado"
- NUEVO - Barra de confianza tipo semaforo visual:
  * Verde = Alta confianza (datos completos, alta precision)
  * Amarillo = Confianza media (datos parciales, buena aproximacion)
  * Rojo = Baja confianza (poca informacion, recomendacion aproximada)
  * Texto debajo: "Confianza: Alta - Tus medidas coinciden perfectamente con esta talla"
- NUEVO - Visualizacion del entalle:
  * Ilustracion simple de una silueta humana con la prenda encima
  * Flechas o indicadores que muestren donde hay holgura y cuanta
  * Descripcion: "La prenda tendra 8 cm de holgura en el pecho. Los hombros caen 2 cm
    hacia afuera. Largo: hasta la cadera."
- Comparativa de tallas (opcional pero valioso):
  * Tabla pequena: S / M (TUYA) / L
  * Con descripcion: S = demasiado justo | M = ideal | L = muy holgado
- Botones de accion:
  * Principal: "Agregar Talla M al Carrito" (color rojo, prominente)
  * Secundario: "Ver otras tallas" (outline/borde)
  * Terciario: "Guardar mi talla en mi perfil" (texto solo)

------------------------------------------------------------------------
CAMBIO 3: NUEVA PANTALLA - PERFIL DE USUARIO
------------------------------------------------------------------------
PANTALLA NUEVA - "Mi Perfil RomeFit":
- Header con nombre del usuario y foto/avatar
- Seccion "Mis Medidas Guardadas":
  * Altura: X cm
  * Peso: X kg
  * Pecho: X cm
  * Cintura: X cm (si la guardo)
  * Preferencia de ajuste: Oversize Moderado
  * Boton: "Actualizar medidas"
- Seccion "Mi Historial de Recomendaciones":
  * Lista de las ultimas 3-5 recomendaciones
  * Cada item: nombre de la prenda + talla recomendada + si fue correcta (icono pulgar
    arriba/abajo que el usuario puede votar)
  * Boton: "Ver historial completo"
- Seccion "Mis Marcas de Referencia":
  * Lista de marcas que el usuario ha indicado y su talla en cada una
  * Boton: "Agregar marca"

------------------------------------------------------------------------
CAMBIO 4: NUEVA PANTALLA - MODO ACCESIBILIDAD (PARA USUARIO CON DISCAPACIDAD VISUAL)
------------------------------------------------------------------------
ESTA ES UNA PANTALLA NUEVA MUY IMPORTANTE PARA EL AVANCE 3.

PANTALLA - "Modo Accesible RomeFit":
- En la pantalla de bienvenida, agregar un boton pequeno pero visible en la esquina
  superior: "Modo Accesible" con icono de ojo con linea o icono de accesibilidad
- Cuando se activa el Modo Accesible, mostrar una pantalla de confirmacion:
  * Titulo: "Modo de Accesibilidad Activado"
  * Icono grande de accesibilidad (persona con brazos abiertos en circulo)
  * Descripcion: "Esta interfaz es compatible con lectores de pantalla. Todos los
    elementos tienen etiquetas de texto. Puedes navegar con swipe horizontal."
  * Diferencias visuales del modo accesible:
    - Fondo blanco puro (mayor contraste)
    - Texto en negro puro, tamano minimo 18px
    - Botones con bordes gruesos y etiquetas texto completas
    - Sin animaciones que puedan causar confusion
    - Indicadores de posicion claros: "Estas en: Paso 1 de 3 - Ingreso de medidas"
  * Boton: "Entendido, comenzar" - Tamanio grande, color negro, texto blanco

FLUJO SIMPLIFICADO EN MODO ACCESIBLE:
- Mismo flujo de 3 pasos pero con texto mas grande y campos mas separados
- Cada campo tiene:
  * Label en texto claro ANTES del campo (no placeholder dentro del campo)
  * Instruccion adicional: "Ejemplo: escribe 170 para 170 centimetros"
  * Confirmacion de lo ingresado: "Has ingresado: 170 cm"
- En los resultados, la recomendacion se presenta en texto simple y claro:
  "Tu talla recomendada es: M. La prenda tendra holgura moderada. Presiona el boton
   grande para agregar al carrito."

------------------------------------------------------------------------
CAMBIO 5: MEJORAS DE DISENO VISUAL GENERAL
------------------------------------------------------------------------
PALETA DE COLORES (mantener consistencia con Rome Store):
- Color principal: Rojo oscuro #C00000 o #8B0000 (Rome Store branding)
- Color secundario: Negro #000000 o gris muy oscuro #1A1A1A
- Fondo principal: Blanco #FFFFFF o gris muy claro #F5F5F5
- Color de exito/confirmacion: Verde #2E7D32
- Color de advertencia: Amarillo #F57C00
- Tipografia: Si no tienen una especifica, usar Inter o DM Sans (modernas, legibles)

MEJORAS DE UI/UX:
- Agregar un header consistente en todas las pantallas con: logo de Rome Store a la
  izquierda y un menu hamburguesa a la derecha
- Agregar una barra de navegacion inferior (bottom nav) con 4 iconos:
  * Inicio (home icon)
  * Talla Ideal (regla/medida icon) - PANTALLA PRINCIPAL
  * Mi Perfil (persona icon)
  * Ajustes (engranaje icon)
- Agregar microinteracciones: cuando el usuario selecciona una opcion de ajuste (justo/
  oversize) la tarjeta debe cambiar visualmente de forma clara
- Loading state: agregar una pantalla de carga entre "Calcular mi talla" y los resultados
  con texto: "Calculando tu talla ideal..." y una animacion simple de carga

------------------------------------------------------------------------
CAMBIO 6: NUEVA PANTALLA - COMPARACION DE TALLAS
------------------------------------------------------------------------
PANTALLA - "Comparar Tallas":
- Titulo: "Comparar tallas en esta prenda"
- Mostrar 3 columnas: S | M | L (o las tallas relevantes)
- Para cada talla:
  * Silueta con la prenda
  * Medidas clave: pecho X cm, largo X cm, hombro X cm
  * Tag: "Demasiado justo" / "TU TALLA" (highlighted) / "Muy holgado"
- Esta pantalla se accede desde el boton "Ver otras tallas" de la pantalla de resultados

------------------------------------------------------------------------
FORMATO DE LA RESPUESTA QUE NECESITO DE TI:
------------------------------------------------------------------------
Por favor, dame:
1. Una descripcion detallada de COMO implementar cada pantalla en Figma Make, paso a paso
2. Que componentes de Figma usar para cada elemento
3. Las dimensiones recomendadas para movil (iPhone 14 Pro: 393 x 852 px)
4. El orden de las frames en el panel izquierdo de Figma
5. Como crear los prototype links entre pantallas para que el flujo sea navegable
6. Cualquier sugerencia adicional para mejorar la UX de RomeFit que no haya mencionado

Si puedes generar codigo CSS o especificaciones de diseno para los componentes clave,
seria muy util.

================================================================================
CONTEXTO ADICIONAL - TEORIA DEL CURSO (para que entiendas el marco academico):
================================================================================
Este prototipo aplica los conceptos de:
- Prototipado de Alta Fidelidad: Representaciones realistas e interactivas del producto
  final (Chavez Herrera, 2025 - Semana 10)
- Iteracion y Mejora Continua: Proceso ciclico de diseno, prototipo, pruebas y
  refinamiento basado en feedback (Chavez Herrera, 2025 - Semana 11)
- Accesibilidad Universal: Diseno que incluye a personas con discapacidad como
  usuarios validos del sistema
- Storyboards: El prototipo debe reflejar los flujos narrativos de los storyboards
  elaborados para cada requerimiento funcional

El prototipo debe demostrar la EVOLUCION desde el Avance 2 (prototipo basico) hasta
el Avance 3 (prototipo mejorado con accesibilidad, iteracion y nuevos RF).

================================================================================
FIN DEL PROMPT
================================================================================
