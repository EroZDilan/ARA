# 07_ARA_Web_Animation_And_Handoff.md

> **Proyecto:** ARA
> **Documento:** sistema de animación, comportamiento de scroll y handoff visual para la landing
> **Objetivo:** definir **cómo se mueve, aparece y se siente** la web una vez que ya tenemos cerrada la arquitectura de secciones, la dirección visual dark y el pack de assets.
> **Rol de este documento:** servir como puente entre **branding visual + diseño de interfaz + implementación front-end**.
> **Resultado esperado:** que cuando la landing se programe, no sea solo “una página bonita con imágenes”, sino una experiencia coherente, sobria, premium y bien coreografiada.

---

# 0. Qué vamos a cerrar aquí

Este documento responde a una pregunta muy concreta:

## **“Cuando la landing de ARA se programe, cómo debe comportarse?”**

No solo en términos de layout, sino en términos de:

* **entrada del hero**
* **transiciones entre secciones**
* **cómo aparecen los bloques al hacer scroll**
* **qué elementos se mueven y cuáles no**
* **qué imágenes llevan parallax y cuáles deben quedarse quietas**
* **cómo se animan títulos, cards, CTA, galería y fondos**
* **qué intensidad de animación encaja con el tono de ARA**
* **cómo debe adaptarse ese comportamiento a mobile**
* **qué hay que dejar preparado en el handoff para quien programe la web**

---

# 1. Principio general de movimiento de ARA

Lo primero: **ARA no necesita una web “llamativa” ni “tech”**.
Necesita una web que se sienta:

* viva
* cuidada
* elegante
* contemplativa
* orgánica
* premium
* con un ritmo lento y seguro

## Por tanto, la animación base de ARA no es:

* agresiva
* hiper interactiva
* explosiva
* llena de micro-efectos
* llena de rebotes o transiciones elásticas

## La animación base de ARA sí es:

* **cinematográfica**
* **silenciosa**
* **de baja fricción**
* **con profundidad**
* **ligeramente atmosférica**
* **centrada en opacidad, desplazamiento suave, blur y capas**

---

# 2. Sistema de movimiento de marca

Voy a dejar definido un **motion language** del proyecto.
Esto es importante porque así luego no animas cada sección “como salga”, sino que todo responde al mismo idioma.

---

# 2.1 Motion keywords de ARA

Si tuviera que resumir cómo se mueve ARA en 6 palabras:

## **float / reveal / drift / depth / fade / hush**

Traducido a comportamiento visual:

* **float** → algunos elementos parecen flotar ligeramente
* **reveal** → el contenido se revela, no “salta”
* **drift** → pequeños desplazamientos lentos, como si el aire o la vegetación empujaran el layout
* **depth** → sensación de capas y profundidad
* **fade** → la opacidad es clave
* **hush** → todo sucede sin ruido

---

# 2.2 Intensidad de animación permitida

## Escala de intensidad interna

* **Nivel 1** = casi imperceptible
* **Nivel 2** = suave pero visible
* **Nivel 3** = protagonista
* **Nivel 4** = expresiva
* **Nivel 5** = showy / hero product page

## Para ARA:

* **base del sitio:** nivel **1–2**
* **hero:** nivel **2–3**
* **galería hover:** nivel **2**
* **CTA final:** nivel **2**
* **nunca** deberíamos entrar en un nivel 4–5

---

# 3. Stack de animaciones recomendado

Si esto se va a programar en React / Next, mi recomendación para una landing así sería una combinación de:

* **CSS transitions** para microinteracciones sencillas
* **Framer Motion** para reveal, stagger, hero y scroll-based transforms
* **Intersection Observer** para activar entradas por sección si se quiere optimizar
* **GSAP** solo si en algún momento se quisiera una narrativa de scroll mucho más compleja, pero **no lo veo necesario de entrada**

## Mi recomendación realista

Para esta landing:

### **Framer Motion + CSS + un scroll smooth muy controlado**

es más que suficiente.

---

# 4. Filosofía de scroll

El scroll debe sentirse **pesado en el buen sentido**: como si cada bloque tuviera peso visual y no se estuviera “deslizando a toda velocidad” entre secciones.

## Qué buscamos

* transiciones suaves entre secciones
* entradas bien medidas
* sensación de continuidad
* que el usuario no pierda de vista el tono contemplativo

## Qué evitar

* snap scroll fuerte
* scroll hijacking agresivo
* secciones que se pinnean sin necesidad
* animaciones que bloqueen la lectura
* delays tan largos que entorpezcan la UX

---

# 5. Estructura general de la landing y comportamiento por sección

La landing, tal como la hemos ido definiendo, queda así:

1. **Hero**
2. **Retos**
3. **Protección**
4. **About**
5. **Galería**
6. **CTA final**

Voy a definir una por una:

* layout logic
* entrada
* salida
* animación de texto
* animación de imagen
* scroll behavior
* hover states si aplica
* notas de implementación

---

# HERO

---

# 6. Objetivo del hero a nivel de motion

El hero es donde más se nota si la web está “viva” o no.
No necesitamos una intro cinematográfica de 12 segundos; necesitamos una primera impresión con:

* profundidad
* presencia
* respiración
* elegancia
* foco claro en el guacamayo y el mensaje

## Sensación que debe dar el hero

Cuando se carga la página, debería sentirse como si el usuario estuviera entrando en un hábitat oscuro donde el guacamayo ya estaba ahí, esperando.

---

# 7. Estructura del hero recomendada

## Capas del hero

Yo lo pensaría en **4 capas**:

### `hero-layer-01` — background atmosférico

* `HERO-BG-01`
* ocupa todo el viewport del hero
* muy oscuro, panorámico

### `hero-layer-02` — textura / haze / overlays

* `HERO-TX-01`
* bruma, sombra botánica, glow suave

### `hero-layer-03` — imagen principal del guacamayo

* `HERO-IMG-01`

### `hero-layer-04` — contenido UI

* logo
* heading
* copy
* CTA(s)
* quizá un badge o tagline

---

# 8. Secuencia de entrada del hero

## Timing total recomendado

Entre **1200 ms y 1800 ms** para la entrada completa del hero.
No instantáneo, pero tampoco excesivo.

## Secuencia recomendada

### Paso 1 — aparece el background

**Duración:** 900–1200 ms
**Animación:**

* opacidad `0 → 1`
* scale muy leve `1.04 → 1`
* quizá blur `8px → 0px` si queda fino

### Paso 2 — entra el haze / textura

**Duración:** 1000–1400 ms
**Animación:**

* opacidad `0 → 0.55` aprox.
* desplazamiento vertical muy pequeño `y: 12 → 0`

### Paso 3 — entra el guacamayo

**Duración:** 1000–1400 ms
**Animación:**

* opacidad `0 → 1`
* `y: 24 → 0`
* scale `0.985 → 1`
* easing suave, sin overshoot

### Paso 4 — entra el copy

**Orden:**

1. eyebrow / label
2. H1
3. párrafo
4. CTA principal
5. CTA secundaria / scroll cue

**Animación recomendada para cada elemento**

* opacidad `0 → 1`
* `y: 20 → 0`
* stagger de **80–120 ms**

---

# 9. Estado idle del hero

Una vez termina la entrada, el hero no debería quedarse completamente muerto.
Pero tampoco queremos un loop evidente.

## Qué sí haría

### Fondo

* drift vertical lentísimo, casi imperceptible
* algo como `translateY(0px → -6px → 0px)` en 18–24 segundos

### Textura / haze

* leve cambio de opacidad
* movimiento lateral o vertical mínimo
* como si hubiera aire / humedad

### Guacamayo

Aquí hay que ser prudentes.
No movería el ave como si estuviera flotando.
Como mucho:

* microparallax ligado al scroll
* o una variación de `y` de 2–4 px a lo largo de muchísimo tiempo si queda natural

---

# 10. Parallax del hero

## Sí, pero muy controlado

### Mi propuesta

Cuando el usuario empieza a hacer scroll:

* el **background** se mueve un poco más lento que el scroll
* la **textura** se mueve ligeramente diferente
* el **guacamayo** se desplaza muy poco
* el **copy** puede tener un fade out progresivo

## Valores orientativos

### Background

`translateY: 0 → 40px` a lo largo del hero

### Haze

`translateY: 0 → 20px`

### Guacamayo

`translateY: 0 → 12px`

### Copy

* opacidad `1 → 0`
* `y: 0 → -12px`

Todo muy suave.
No quiero una sensación de “efecto parallax de plantilla”.

---

# 11. Scroll cue del hero

Si añades un pequeño indicador tipo “scroll” o una flecha mínima, puede animarse con un loop muy discreto:

* `y: 0 → 6 → 0`
* duración 2.2–2.8 s
* easing in-out
* opacidad constante o con pulsación mínima

---

# RETOS

---

# 12. Qué tiene que hacer la sección Retos

Esta sección tiene una misión narrativa importante: bajar del hero inspiracional al problema real.

Por tanto, la transición debe sentirse como:

* el hero te introduce en el universo
* **Retos** te muestra la tensión y la urgencia

No quiero que esta sección aparezca como un grid de cards genérico.

---

# 13. Entrada de la sección Retos

## Cuando entra en viewport:

### Primero

entra el bloque de título:

* label / eyebrow
* heading
* texto introductorio

### Después

entran las 3 cards de retos con stagger

---

# 14. Animación del encabezado de Retos

## Label

* opacidad `0 → 1`
* `y: 12 → 0`
* duración 500–650 ms

## Heading

* opacidad `0 → 1`
* `y: 18 → 0`
* duración 650–800 ms

## Intro text

* opacidad `0 → 1`
* `y: 18 → 0`
* duración 650–800 ms
* delay 80–120 ms respecto al heading

---

# 15. Animación de las cards de Retos

Aquí hay dos caminos posibles.
Te digo el que **yo recomiendo**.

## Opción recomendada

### Entrada por stagger vertical con profundidad

Cada card entra con:

* opacidad `0 → 1`
* `y: 28 → 0`
* blur `8px → 0`
* delay escalonado

## Orden

1. card 1
2. card 2
3. card 3

## Stagger

`90–140 ms`

## Duración

`700–900 ms`

---

# 16. Hover de las cards de Retos

No haría un hover agresivo.
Lo mantendría muy limpio.

## Hover recomendado

### Card container

* translateY `0 → -4px`
* border / outline ligeramente más visible
* sombra muy sutil o glow oscuro

### Imagen / ilustración interior

* scale `1 → 1.03`
* opacidad / contraste ligeramente más vivos

### Título

* pequeño cambio de color o brillo, nada dramático

---

# 17. Fondo y transición de Retos

El fondo de Retos puede tener una textura muy sutil (`RETOS-BG-01`) que no se mueva apenas.
Si acaso:

* un leve shift de opacidad al entrar la sección
* nada más

No metería parallax fuerte aquí.

---

# PROTECCIÓN

---

# 18. Rol de la sección Protección

Esta sección cambia el tono: ya no estamos solo en el problema, sino en la respuesta de ARA.

Por tanto, la sensación debe ser:

* más humana
* más estable
* más confiada
* más clara

---

# 19. Layout recomendado de Protección

Idealmente:

* imagen a un lado
* copy + lista de acciones / pilares al otro
* composición respirable, no sobrecargada

---

# 20. Entrada de la sección Protección

## Secuencia recomendada

1. aparece el bloque de texto
2. aparece la imagen principal
3. aparecen los puntos / cards de acción

O, si el layout lo pide, texto e imagen pueden entrar casi en paralelo.

---

# 21. Animación del texto de Protección

### Label

* fade + `y`

### Heading

* fade + `y`

### Body

* fade + `y`

### Lista de acciones

* cada ítem con stagger pequeño

## Valores orientativos

* `y: 16–20px`
* opacidad `0 → 1`
* stagger de ítems: `60–90 ms`

---

# 22. Animación de `PROT-IMG-01`

La imagen de Protección sí puede tener una entrada un poco más protagonista que las cards de Retos.

## Entrada recomendada

* opacidad `0 → 1`
* scale `1.03 → 1`
* `x` o `y` muy leve según de dónde venga visualmente
* blur `10px → 0`

## Duración

`900–1100 ms`

## Nota

No haría un reveal con máscara muy evidente salvo que la estética del layout lo pida mucho.
La imagen ya va a tener suficiente presencia.

---

# 23. Microinteracción de los “pilares” o bullets de Protección

Si esta sección tiene 3 o 4 bullets / mini-cards tipo:

* investigación
* protección del hábitat
* sensibilización
* acción comunitaria

cada una puede animarse así:

* icono / número / bullet marker aparece primero
* título y texto después
* hover con elevación de `2–3px`

---

# ABOUT

---

# 24. Rol del About en el ritmo de la landing

El About es un momento de pausa humana.
Después de “retos” y “protección”, aquí el usuario debe sentir:

* quién está detrás
* por qué esto importa
* que ARA es un proyecto real y no un concepto bonito

Por eso la animación del About debe ser más íntima que espectacular.

---

# 25. Entrada del About

Si el bloque tiene:

* imagen del equipo
* copy
* quizá mini bios o datos

yo lo animaría con **dos tiempos**.

## Tiempo 1

entra la composición del equipo (`ABOUT-IMG-01`)

## Tiempo 2

entra el copy y luego los detalles secundarios

---

# 26. Animación de `ABOUT-IMG-01`

## Recomendada

* opacidad `0 → 1`
* scale `1.02 → 1`
* `y: 18 → 0`
* blur `8px → 0`

## Duración

`900–1100 ms`

## Por qué

Queremos que la imagen se sienta “presente”, casi como si estuvieras entrando en una conversación con el equipo.

---

# 27. Animación del copy del About

### Heading / párrafo principal

fade + rise suave

### nombres / roles / pequeños datos

stagger muy ligero

## Importante

No haría que cada línea de texto entre con una coreografía exagerada.
El About debe leerse con calma.

---

# 28. Si hay cards individuales del equipo

Si decides poner 3 mini-cards debajo o al lado del bloque principal:

## Entrada

stagger horizontal o vertical, muy sutil

## Hover

* elevación mínima
* ligera subida del retrato o brillo del borde
* nada más

No usaría flips, overlays complejos ni interacciones “team page”.

---

# GALERÍA

---

# 29. Rol de la galería en la landing

La galería tiene que funcionar como un bloque de riqueza visual y respiración.
No es solo “mira qué fotos”.
Es el momento donde el universo de ARA se expande:

* aves
* hábitat
* proyecto
* atmósfera

Por eso la galería debe sentirse viva, pero con mucha disciplina.

---

# 30. Layout recomendado de galería

Yo mantendría un **masonry o collage controlado**, no una cuadrícula rígida perfecta.
Eso le da más aire editorial.

## Tipos de piezas

* 1 pieza protagonista
* 2–3 medianas
* 2–3 secundarias
* 1 pieza humana o de hábitat que rompa el ritmo

---

# 31. Entrada de la galería

## Secuencia

1. entra el heading / intro
2. aparece el contenedor de galería
3. las imágenes entran con stagger por filas o por orden visual

---

# 32. Cómo animar las imágenes de galería

No haría una entrada “pop” por cada imagen.
Mejor una entrada sobria y coordinada.

## Para cada tile

* opacidad `0 → 1`
* `y: 24 → 0`
* scale `1.02 → 1`
* blur `10px → 0`

## Stagger

`60–100 ms`

## Duración

`700–900 ms`

---

# 33. Hover de la galería

Aquí sí hay margen para una microinteracción agradable.

## Hover recomendado por tile

### Imagen

* scale `1 → 1.04`
* transición suave 500–700 ms
* quizá leve cambio de contraste o brightness

### Overlay si existe

* opacidad `0 → 1` muy sutil
* mostrar nombre del ave / tipo de proyecto / categoría

### Tile container

* translateY `0 → -3px` máximo

---

# 34. Qué NO haría en la galería

* zooms exagerados
* overlays negros pesados
* cards que giran
* lightbox automático al hover
* animación distinta en cada tile
* masonry que se recoloca de forma brusca

---

# CTA FINAL

---

# 35. Qué tiene que hacer el CTA final

El CTA final no es una “banner section” más.
Tiene que cerrar la landing emocionalmente y dejar al usuario con una sensación clara de:

* valor del proyecto
* posibilidad de sumarse / contactar / apoyar
* continuidad del trabajo de ARA

No debe sentirse publicitario ni gritón.

---

# 36. Entrada del CTA final

## Secuencia

1. aparece el fondo atmosférico
2. entra el heading
3. entra el párrafo
4. entra el CTA principal
5. opcionalmente CTA secundaria o dato final

---

# 37. Animación del fondo `CTA-BG-01`

## Recomendada

* opacidad `0 → 1`
* scale `1.02 → 1`
* quizá un pequeño shift de `y`

## Después, en idle

* drift lentísimo
* haze muy sutil si existe overlay

---

# 38. Animación del texto del CTA

Muy parecida al hero, pero más contenida.

## Heading

* fade + `y`
* 700–900 ms

## Body

* fade + `y`
* 700–900 ms

## CTA button

* fade + `y`
* delay 100–140 ms

---

# 39. Hover del CTA principal

Como el CTA es una acción importante, sí merece una respuesta clara.

## Botón principal

* background se ilumina o gana contraste ligeramente
* `translateY(-2px)`
* shadow / glow muy sutil
* icono o flecha puede desplazarse `2–4px`

## Duración

`220–320 ms`

---

# 40. Footer o cierre después del CTA

Si hay un mini footer con logo / créditos / links:

* no lo animaría de forma protagonista
* como mucho un fade suave al entrar en viewport

---

# 41. Sistema de reveal general del sitio

Para no reinventar cada bloque, conviene definir un sistema reusable de reveal.

---

# 41.1 Reveal A — text block reveal

Para headings, labels, párrafos intro.

## Propiedades

* `opacity: 0 → 1`
* `y: 18 → 0`
* duration `0.65–0.85s`
* ease suave

---

# 41.2 Reveal B — image block reveal

Para imágenes grandes de sección.

## Propiedades

* `opacity: 0 → 1`
* `y: 20 → 0`
* `scale: 1.02 → 1`
* `filter: blur(8px) → blur(0px)`
* duration `0.85–1.1s`

---

# 41.3 Reveal C — card stagger reveal

Para cards, retos, mini bloques, galería.

## Propiedades

* cada item:

  * `opacity: 0 → 1`
  * `y: 24 → 0`
  * `blur: 8px → 0`
* stagger `0.08–0.14s`

---

# 41.4 Reveal D — atmospheric background fade

Para fondos de sección.

## Propiedades

* `opacity: 0 → 1`
* `scale: 1.02 → 1`
* duration `1.0–1.4s`

---

# 42. Sistema de hover global

No conviene que cada bloque tenga un hover distinto sin relación.
Yo usaría una familia muy consistente:

## Hover de cards / tiles

* `translateY(-3px a -4px)`
* ligera mejora de contraste
* borde o sombra un poco más visible

## Hover de imágenes

* scale `1.03–1.05`
* transición lenta

## Hover de botones

* elevación pequeña
* contraste / glow sutil
* posible desplazamiento mínimo de icono

---

# 43. Transiciones entre secciones

Aquí hay una parte importante: la landing no debería sentirse como “bloques apilados con fondo diferente”.
Tiene que haber **continuidad**.

---

# 43.1 Cómo generar continuidad sin complicar demasiado el front

Yo lo haría con 3 herramientas:

## A. Superposición ligera de fondos

Que el final de una sección tenga un degradado o haze que conecta con la siguiente.

## B. Ritmo de spacing

No cambiar brutalmente de densidad entre secciones.

## C. Reutilizar overlays

Usar texturas / brumas del sistema en varias secciones con intensidades distintas.

---

# 43.2 Qué transiciones no haría

* wipes horizontales
* morphs entre secciones
* pantallas que se “cierran”
* efectos de cortina
* cambios bruscos de color de fondo

---

# 44. Scroll behavior específico por sección

Voy a resumir cómo debería sentirse el scroll en cada bloque.

## Hero

* más inmersivo
* leve parallax
* fade del copy al salir

## Retos

* reveal limpio
* sin parallax fuerte

## Protección

* reveal más sólido en imagen y bullets
* quizá microparallax de imagen si queda bien

## About

* entrada calmada, humana
* casi sin movimiento una vez visible

## Galería

* stagger de tiles
* hover agradable
* quizá un microparallax en la pieza protagonista, pero no es obligatorio

## CTA

* entrada atmosférica
* fondo con drift suave

---

# 45. Qué haría en mobile

Esto es importante: **mobile no debe ser desktop comprimido**.
Y menos si la web depende de atmósfera y scroll.

---

# 45.1 Regla general para mobile

En mobile reduciría la complejidad de animación aproximadamente un **30–40%**.

## Qué mantendría

* fades
* rise suaves
* stagger de cards
* hover sustituido por estado táctil donde aplique
* un poco de parallax solo si rinde bien

## Qué reduciría o eliminaría

* parallax del hero demasiado elaborado
* blur pesados
* loops continuos si penalizan rendimiento
* demasiadas capas superpuestas

---

# 45.2 Hero en mobile

## Sí mantendría

* entrada secuencial del hero
* fade del background
* entrada del guacamayo
* stagger del texto

## Reduciría

* la cantidad de desplazamiento del parallax
* la cantidad de capas haze
* la complejidad del fade al salir

---

# 45.3 Galería en mobile

En mobile la galería probablemente ya no será masonry complejo sino grid o stack más simple.
La animación debe adaptarse a eso:

* reveal por bloque
* hover eliminado o sustituido por tap / focus states
* zooms mucho más suaves o inexistentes

---

# 46. Accesibilidad y rendimiento

No quiero que el sistema de motion se coma la experiencia.
Así que hay que dejar claras varias reglas.

---

# 46.1 `prefers-reduced-motion`

La landing debería respetarlo.

## Si el usuario tiene reduced motion:

* eliminar parallax
* eliminar drift en idle
* reducir stagger
* dejar solo fades muy suaves o incluso sin animación en algunos bloques

---

# 46.2 Performance budget visual

Evitar:

* 8 capas con blur enorme encima del hero
* parallax sobre imágenes gigantes sin optimización
* animar propiedades costosas innecesariamente
* demasiados box-shadows complejos en scroll

## Priorizar animar:

* `opacity`
* `transform`

Y usar blur con cuidado.

---

# 46.3 Lazy loading y prioridades

## Prioridad alta

* hero background
* hero bird
* fuentes críticas
* primer bloque visible

## Lazy / eager según viewport

* imágenes de retos si entran pronto
* about y galería más abajo lazy
* CTA background lazy con prefetch si quieres hilar fino

---

# 47. Handoff para desarrollo: qué hay que documentar asset por asset

Cuando llegue el momento de pasar esto a quien programe, no basta con “aquí tienes las imágenes”.
Hay que decirle cómo se usan.

Yo dejaría una tabla por asset con estos campos:

* **ID**
* **archivo**
* **sección**
* **desktop position**
* **mobile position**
* **object-fit**
* **si lleva parallax**
* **si lleva reveal**
* **si lleva hover**
* **si necesita overlay**
* **z-index / capa**
* **notas de crop**

---

# 48. Ejemplo de handoff de asset

## `HERO-IMG-01`

* **uso:** imagen principal hero
* **desktop:** columna visual derecha o centro-derecha
* **mobile:** bloque superior o intercalado sobre el copy
* **fit:** contain / custom crop según layout
* **animación de entrada:** reveal B
* **parallax:** sí, muy leve
* **hover:** no
* **overlay:** sí, haze y dark gradient
* **prioridad de carga:** alta

---

# 49. Ejemplo de handoff de sección

## Hero

### Desktop

* alto mínimo: `100svh` o ligeramente menos si el header ocupa bastante
* layout 2 columnas o composición editorial con contenido a la izquierda y ave a la derecha
* copy máximo 6–7 líneas visuales
* CTA visible above the fold

### Mobile

* hero apilado
* copy arriba o entre capas según mockup
* imagen del guacamayo recortada específicamente para mobile
* evitar que el CTA quede demasiado abajo

---

# 50. Sistema de timings resumido

Para que luego no haya 20 timings distintos sin control, yo cerraría un set base:

## Fast

`180–260 ms`
Para hovers y pequeños cambios de estado

## Medium

`450–700 ms`
Para entradas pequeñas y transiciones de UI

## Slow

`850–1200 ms`
Para imágenes grandes, hero, fondos

## Extra slow

`16–24 s`
Solo para drift ambiental casi imperceptible

---

# 51. Curvas / easing recomendadas

No hace falta hilar con cubic-beziers hiper complejas, pero sí conviene una familia coherente.

## Para reveals

ease-out suave, con caída elegante

## Para hovers

ease estándar rápida, sin rebote

## Para drift atmosférico

ease-in-out muy lenta o animación sinusoidal si se implementa con keyframes

## Qué evitar

* bounce
* elastic
* overshoot marcado
* ease demasiado “appy” o juguetona

---

# 52. Qué haría yo con el header / navbar

No lo habíamos desarrollado del todo, pero te dejo recomendación porque afecta mucho a la experiencia.

## Header inicial sobre hero

* transparente o casi transparente
* texto claro
* logo visible
* CTA secundario si existe

## Al hacer scroll

el header puede pasar a:

* fondo dark translúcido
* blur suave
* borde inferior muy sutil

## Animación del cambio

* `background-color`
* `backdrop-filter` si se usa
* opacidad de borde
* duración `220–320 ms`

---

# 53. Qué haría yo con los botones globales

## CTA primario

* fondo más luminoso / con acento de marca
* hover con elevación mínima y leve glow

## CTA secundario

* ghost / outlined / text button
* hover con cambio de opacidad o borde

## Transición

`200–280 ms`

---

# 54. Qué haría con divisores o detalles ornamentales

Si la web lleva:

* líneas sutiles
* pequeñas marcas
* patrones de pluma / vegetación
* numeraciones de sección

pueden aparecer con:

* fade
* width reveal
* opacity + slight slide

Pero siempre con una intensidad menor que la del contenido principal.

---

# 55. Qué evitar a toda costa en la implementación

Esto te lo dejo porque muchas veces la landing se rompe no por el diseño, sino por decisiones de front que se cargan el tono.

## Evitar:

* scroll demasiado “slippery” tipo template de portfolio
* animar todo al mismo tiempo
* delays larguísimos que obligan a esperar
* hacer que cada bloque entre desde una dirección distinta
* meter un parallax fuerte porque “queda premium”
* usar blur exagerado en texto
* oscurecer tanto las imágenes que ya no se lean
* hover de zoom excesivo en aves o retratos
* fondos con video si no es imprescindible

---

# 56. Recomendación concreta de sistema final para ARA

Si tuviera que resumir el comportamiento final de la landing en una receta clara, sería esta:

## Hero

* reveal por capas
* microparallax
* drift atmosférico muy leve

## Retos

* heading reveal
* 3 cards con stagger y hover sutil

## Protección

* reveal de texto + imagen grande + bullets

## About

* retrato de equipo con entrada íntima
* copy sereno

## Galería

* masonry controlado
* stagger de tiles
* hover con zoom mínimo

## CTA

* fondo atmosférico + copy + CTA con cierre elegante

## Todo el sitio

* motion level 1–2
* transforms + opacity
* reduced motion respetado
* nada showy

---

# 57. Qué haría inmediatamente después de este documento

Ahora mismo, con la arquitectura ya cerrada, el orden lógico sería este:

---

# Opción recomendada — seguir con handoff real de implementación

El siguiente documento sería:

# **`08_ARA_Web_Build_Blueprint.md`**

Y ahí te dejo la **traducción exacta de toda la landing a estructura de implementación**:

* árbol de secciones
* layout desktop / tablet / mobile
* spacing system
* grid system
* orden de componentes
* qué componente recibe qué asset
* naming de componentes
* props que tendría cada sección
* cómo montar la landing en Next / React
* qué se puede hacer con Tailwind / CSS Modules
* y cómo dejarlo listo para empezar a programar sin improvisar

---

# Mi recomendación clara

Hasta ahora hemos hecho:

* **inventario de assets**
* **pack de prompts**
* **sistema de motion / handoff visual**

Lo que falta para cerrar el sistema de verdad es el documento que convierte todo esto en **arquitectura web implementable**.

## Así que yo seguiría con:

# **`08_ARA_Web_Build_Blueprint.md`**

Si me dices “continúa”, sigo con ese y te lo estructuro como si ya fuéramos a pasar a Figma/dev.
