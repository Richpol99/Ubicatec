# Situación Actual del Proyecto UBICATEC

## Resumen Ejecutivo

El proyecto UBICATEC es un sistema de navegación accesible para el campus del Instituto Tecnológico de Puebla que permite a los usuarios encontrar rutas optimizadas según diferentes tipos de discapacidad. El sistema está actualmente en una fase avanzada de desarrollo con un sistema de cálculo de rutas completamente funcional.

## Arquitectura del Sistema

### Componentes Principales

1. **Sistema de Navegación Unificado** (`navigation-system.js`)
   - Coordinador principal que integra todos los componentes
   - Maneja la inicialización del sistema completo
   - Proporciona interfaz unificada para navegación

2. **Grafo Estático del Campus** (`campus-graph.js`)
   - Representación completa del campus con 22 nodos principales
   - Incluye 16 edificios, 6 puntos de acceso y múltiples nodos de ruta
   - Tres rutas predefinidas: Verde, Naranja y Azul
   - Sistema de conexiones bidireccionales entre nodos

3. **Calculador de Rutas** (`route-calculator.js`)
   - Implementa algoritmo de Dijkstra simplificado
   - Soporte para 4 tipos de accesibilidad: silla de ruedas, visual, auditiva, movilidad reducida
   - Sistema de pesos diferenciados por tipo de accesibilidad
   - Prevención de saltos innecesarios dentro de la misma ruta

4. **Visualizador de Rutas** (`route-visualizer.js`)
   - Renderiza rutas calculadas en el mapa de Leaflet
   - Iconos específicos para cada tipo de accesibilidad
   - Segmentación de rutas por colores según tipo de ruta
   - Marcadores informativos para puntos importantes

5. **Mapa Principal** (`mapa.js`)
   - Integración con Leaflet para visualización del campus
   - Marcadores interactivos para edificios
   - Sistema de búsqueda y filtrado
   - Rutas predefinidas visuales (azul, verde, naranja)

## Estado Actual del Cálculo de Rutas

### Funcionalidades Implementadas

✅ **Algoritmo de Dijkstra Completo**
- Cálculo de rutas más cortas entre cualquier par de nodos
- Soporte para múltiples tipos de accesibilidad
- Sistema de pesos diferenciados por tipo de conexión

✅ **Grafo Estático Robusto**
- 22 nodos principales (16 edificios + 6 accesos)
- 83+ nodos de ruta intermedios
- 200+ conexiones bidireccionales
- Tres rutas predefinidas completamente conectadas

✅ **Sistema de Accesibilidad**
- 4 tipos de accesibilidad soportados
- Pesos diferenciados por tipo de conexión
- Cálculo de tiempo estimado según tipo de discapacidad

✅ **Visualización Avanzada**
- Rutas segmentadas por colores
- Marcadores específicos por tipo de accesibilidad
- Información detallada en popups
- Ajuste automático de vista del mapa

### Tipos de Nodos

1. **Edificios (16)**
   - Edificio 1 (Dirección)
   - Edificio 2 (Coordinación)
   - Edificio 3 (Sistemas y Computación)
   - Edificio 19 (Laboratorio de Física y Química)
   - Edificio 20 (Laboratorio de Ingeniería Eléctrica)
   - Edificio 25 (Servicio Médico)
   - Edificio 27 (Lab. Ing Mecánica)
   - Edificio 30 (Manufactura avanzada Lab)
   - Edificio 36 (Centro de cómputo y lab de sistemas)
   - Edificio 41 (Centro de lenguas extranjeras)
   - Edificio 45 (Unidad académica departamental)
   - Edificio 49 (Lab. Ing Electrónica)
   - Edificio 50 (Centro de Información)
   - Edificio 51 (Unidad académica departamental)
   - Edificio 52 (Sala de titulación)
   - Edificio 53 (Ciencias básicas)

2. **Accesos (6)**
   - Acceso principal (Avenida Tecnológico)
   - Acceso Visitantes (Frente a Sears)
   - Acceso Hangar Autobuses y Estacionamiento 3
   - Acceso Estacionamiento 2 (Colonia Maravillas)
   - Acceso Estudiantes (Colonia Maravillas)
   - Acceso Estacionamiento 1 (Avenida Tecnológico)

3. **Nodos de Ruta (83+)**
   - Ruta Verde: 24 nodos
   - Ruta Naranja: 40 nodos
   - Ruta Azul: 19 nodos

### Sistema de Rutas Predefinidas

#### Ruta Verde
- **Propósito**: Conexión entre edificios del área norte del campus
- **Nodos**: 24 puntos de ruta
- **Edificios conectados**: 3, 41, 45, 51, 53
- **Características**: Optimizada para accesibilidad general

#### Ruta Naranja
- **Propósito**: Ruta principal del campus
- **Nodos**: 40 puntos de ruta
- **Edificios conectados**: 1, 2, 19, 20, 25, 27, 49, 52
- **Características**: Ruta más completa con mayor cobertura

#### Ruta Azul
- **Propósito**: Conexión con área sur del campus
- **Nodos**: 19 puntos de ruta
- **Edificios conectados**: 30, 36, 50
- **Características**: Acceso a laboratorios y servicios

## Algoritmo de Cálculo de Rutas

### Implementación de Dijkstra

El sistema utiliza una implementación optimizada del algoritmo de Dijkstra con las siguientes características:

1. **Estructura de Datos**
   - Mapas para distancias y nodos previos
   - Cola de prioridad para nodos no visitados
   - Set para nodos visitados

2. **Cálculo de Pesos**
   - Pesos base por tipo de accesibilidad
   - Modificadores por tipo de conexión
   - Fórmula: `peso = distancia × modificador_base × modificador_tipo`

3. **Tipos de Conexión**
   - **Secuencial**: Conexión directa en la misma ruta (peso 1.0)
   - **Intersección**: Conexión entre rutas diferentes (peso 0.8-1.2)
   - **Acceso a edificio**: Conexión edificio-ruta (peso 1.0-1.2)
   - **Acceso a entrada**: Conexión acceso-ruta (peso 1.0)

### Optimizaciones Implementadas

1. **Prevención de Saltos**
   - Evita saltos innecesarios dentro de la misma ruta
   - Permite saltos cuando son necesarios para conectar edificios

2. **Cálculo de Tiempo Estimado**
   - Velocidades diferenciadas por tipo de accesibilidad
   - Silla de ruedas: 50 m/min (3 km/h)
   - Visual: 60 m/min (3.6 km/h)
   - Auditiva: 70 m/min (4.2 km/h)
   - Movilidad reducida: 80 m/min (4.8 km/h)

## Estado de las Pruebas

### Archivo de Pruebas (`test-22-nodos.html`)

El sistema incluye una interfaz de pruebas completa que permite:

- **Selección de nodos**: Interfaz visual para seleccionar origen y destino
- **Cálculo individual**: Prueba de rutas específicas
- **Pruebas masivas**: Cálculo de todas las combinaciones posibles (462 rutas)
- **Logging detallado**: Registro completo de operaciones
- **Estadísticas**: Métricas de éxito y rendimiento

### Cobertura de Pruebas

- **Total de combinaciones**: 22 × 21 = 462 rutas posibles
- **Nodos de prueba**: 16 edificios + 6 accesos
- **Tipos de accesibilidad**: 4 tipos soportados
- **Validación**: Verificación de conectividad entre todos los nodos

## Integración con el Mapa

### Leaflet Integration

El sistema está completamente integrado con Leaflet para:

1. **Visualización de Rutas**
   - Polylíneas segmentadas por tipo de ruta
   - Colores diferenciados (verde, naranja, azul)
   - Marcadores específicos por tipo de accesibilidad

2. **Interactividad**
   - Click en edificios para calcular rutas
   - Popups informativos con detalles de la ruta
   - Ajuste automático de vista del mapa

3. **Capas de Información**
   - Edificios con marcadores interactivos
   - Rutas predefinidas visuales
   - Sistema de capas para organización

## Limitaciones Actuales

### Conocidas

1. **Dependencia del Mapa**
   - Requiere que el mapa de Leaflet esté completamente inicializado
   - Problemas de sincronización en la inicialización

2. **Grafo Estático**
   - No permite modificación dinámica de rutas
   - Requiere actualización manual del código para cambios

3. **Validación de Coordenadas**
   - No valida automáticamente la precisión de coordenadas
   - Dependiente de la calidad de los datos de entrada

### Áreas de Mejora

1. **Optimización de Rendimiento**
   - Cálculo de rutas alternativas
   - Cache de rutas frecuentes
   - Compresión de datos del grafo

2. **Funcionalidades Adicionales**
   - Navegación paso a paso
   - Integración con GPS
   - Notificaciones de llegada

3. **Accesibilidad**
   - Soporte para lectores de pantalla
   - Modo de alto contraste
   - Navegación por teclado

## Próximos Pasos Recomendados

### Corto Plazo (1-2 semanas)

1. **Resolución de Bugs**
   - Corregir problemas de sincronización del mapa
   - Mejorar manejo de errores en cálculo de rutas

2. **Optimización de UI**
   - Mejorar interfaz de selección de nodos
   - Añadir indicadores de progreso

### Mediano Plazo (1-2 meses)

1. **Funcionalidades Avanzadas**
   - Implementar rutas alternativas
   - Añadir navegación paso a paso
   - Integrar notificaciones de llegada

2. **Mejoras de Accesibilidad**
   - Soporte completo para lectores de pantalla
   - Modo de alto contraste
   - Navegación por teclado

### Largo Plazo (3-6 meses)

1. **Integración con Servicios Externos**
   - Integración con GPS
   - Servicios de tráfico en tiempo real
   - Actualizaciones dinámicas de rutas

2. **Expansión del Sistema**
   - Soporte para múltiples campus
   - API para desarrolladores externos
   - Aplicación móvil nativa

## Conclusión

El proyecto UBICATEC ha alcanzado un estado de madurez significativo con un sistema de cálculo de rutas completamente funcional. La arquitectura modular permite fácil mantenimiento y expansión, mientras que el sistema de accesibilidad integrado cumple con los objetivos principales del proyecto.

El sistema está listo para pruebas de usuario y puede ser desplegado en un entorno de producción con las optimizaciones menores mencionadas en la sección de corto plazo.

---

**Fecha de actualización**: 7 de enero de 2025  
**Versión del sistema**: 2.0  
**Estado**: Funcional - Listo para pruebas de usuario
