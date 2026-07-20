# Rediseño de la Sección Principal (Hero Section)

El objetivo es actualizar la vista inicial de la página (`HomePage.tsx`) para hacerla más dinámica y visualmente impactante, tomando como referencia el boceto proporcionado. El diseño pasará de estar centrado a estar dividido en dos columnas, destacando un cuadro/póster principal con un efecto de luz de neón.

## Proposed Changes

1. **Estructura Split-Screen**: Modificar el div principal del Hero (`max-w-6xl`) para usar `grid lg:grid-cols-2` en lugar de `flex-col items-center`.
2. **Columna Izquierda (Contenido)**: Alinear el texto principal ("Posters metálicos y cuadros...") y los botones hacia la izquierda. Resaltar la frase "espacios con personalidad" usando el rojo/color primario tal como en el boceto.
3. **Columna Derecha (Póster Dinámico)**: Crear un contenedor para exhibir un cuadro destacado vertical (por ejemplo, una imagen de muestra o uno de los productos de la base de datos). 
   - Se le aplicará un borde y un fuerte `box-shadow` o un elemento de fondo borroso (`blur`) con el color primario (rojo) para simular la retroiluminación LED del boceto.
   - Se agregará una pequeña barra vertical (píldora) al costado derecho del póster con los beneficios clave (Aluminio premium, Impresión HD, Montaje limpio, etc.) usando los iconos de Lucide.
4. **Barra de Estadísticas Inferior**: Mover la caja de características ("100% material premium", "24 h respuesta rápida", etc.) para que se muestre como una barra ancha y redondeada debajo de las dos columnas, ocupando casi todo el ancho.
