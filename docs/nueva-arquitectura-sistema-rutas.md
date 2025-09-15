# Nueva Arquitectura del Sistema de Rutas Accesibles - UBICATEC

## Resumen de Cambios

Se ha implementado una nueva arquitectura simplificada para el sistema de rutas accesibles que reemplaza el sistema anterior complejo y fragmentado.

## Archivos del Sistema

### ✅ **Archivos Nuevos (Activos)**

1. **`js/campus-graph.js`** - Grafo estático completo del campus
   - Contiene todos los nodos (edificios, rutas, accesos) predefinidos
   - Todas las conexiones están definidas de una vez
   - Fácil de mantener y debuggear

2. **`js/route-calculator.js`** - Algoritmo de Dijkstra simplificado
   - Trabaja directamente con el grafo estático
   - Soporte para diferentes tipos de accesibilidad
   - Cálculo de rutas optimizado

3. **`js/navigation-system.js`** - Sistema principal de navegación
   - Coordina todos los componentes
   - Interfaz unificada para el usuario
   - Integración con el mapa de Leaflet

4. **`js/test-navigation.js`** - Archivo de pruebas
   - Funciones para probar el sistema
   - Verificación de conectividad
   - Debugging y monitoreo

### ❌ **Archivos Eliminados (Obsoletos)**

1. **`js/unified-graph.js`** - ❌ ELIMINADO
   - Era demasiado complejo (1000+ líneas)
   - Lógica de conexión automática problemática
   - Difícil de mantener

2. **`js/simple-dijkstra.js`** - ❌ ELIMINADO
   - Reemplazado por `route-calculator.js`
   - Funcionalidad mejorada y simplificada

## Ventajas de la Nueva Arquitectura

### 🚀 **Rendimiento**
- **Grafo estático**: No hay cálculos complejos de conectividad
- **Conexiones predefinidas**: Todas las rutas están optimizadas
- **Carga rápida**: Inicialización inmediata

### 🛠️ **Mantenibilidad**
- **Código simple**: Cada archivo tiene una responsabilidad específica
- **Fácil debugging**: Problemas fáciles de identificar y corregir
- **Escalabilidad**: Fácil agregar nuevos nodos y conexiones

### 🔧 **Confiabilidad**
- **Conexiones probadas**: Todas las rutas están validadas
- **Sin componentes desconectados**: Grafo completamente conectado
- **Manejo de errores**: Sistema robusto con fallbacks

## Cómo Usar el Sistema

### **Inicialización Automática**
```javascript
// El sistema se inicializa automáticamente cuando se carga la página
// Verificar estado:
window.unifiedNav.state.isInitialized
```

### **Navegación a Edificios**
```javascript
// Navegar a un edificio específico
window.unifiedNav.navigateToBuilding('Edificio 1');

// Navegar con ubicación específica del usuario
window.unifiedNav.navigateToBuilding('Edificio 3', [19.0700, -98.1690]);
```

### **Cambiar Tipo de Accesibilidad**
```javascript
// Cambiar a silla de ruedas
window.unifiedNav.setAccessibilityType('wheelchair');

// Cambiar a discapacidad visual
window.unifiedNav.setAccessibilityType('visual');
```

### **Funciones de Prueba**
```javascript
// Probar el sistema completo
testNavigationSystem();

// Ver estado del sistema
showSystemStatus();

// Listar todos los edificios
listAllBuildings();

// Limpiar ruta actual
clearCurrentRoute();
```

## Estructura del Grafo

### **Tipos de Nodos**
- **`building`**: Edificios del campus (16 edificios)
- **`route`**: Puntos de las rutas accesibles (verde, naranja, azul)
- **`access`**: Puntos de acceso al campus (6 accesos)

### **Tipos de Conexiones**
- **`sequential`**: Conexiones dentro de una ruta específica
- **`building_access`**: Conexiones de edificios a rutas
- **`access_connection`**: Conexiones de accesos a rutas
- **`intersection`**: Intersecciones entre diferentes rutas

### **Tipos de Accesibilidad Soportados**
- **`wheelchair`**: Optimizado para silla de ruedas
- **`visual`**: Optimizado para discapacidad visual
- **`auditory`**: Optimizado para discapacidad auditiva
- **`mobility`**: Optimizado para movilidad reducida

## Integración con el Mapa

El sistema se integra automáticamente con el mapa de Leaflet existente:

1. **Detección automática**: El sistema detecta cuando el mapa está listo
2. **Visualización de rutas**: Las rutas se dibujan automáticamente
3. **Marcadores**: Puntos de inicio, destino y waypoints
4. **Colores por tipo**: Diferentes colores según el tipo de accesibilidad

## Monitoreo y Debugging

### **Consola del Navegador**
```javascript
// Ver estadísticas completas
window.unifiedNav.getSystemStatistics();

// Ver información de un edificio específico
window.unifiedNav.getNodeInfo('edif_1');

// Probar conectividad del grafo
testGraphConnectivity();
```

### **Logs del Sistema**
El sistema genera logs detallados en la consola:
- ✅ Operaciones exitosas
- ⚠️ Advertencias
- ❌ Errores
- 📊 Estadísticas

## Próximos Pasos

1. **Pruebas en producción**: Verificar que todo funciona correctamente
2. **Optimización**: Ajustar pesos de accesibilidad según feedback
3. **Nuevas funcionalidades**: Agregar más tipos de accesibilidad si es necesario
4. **Documentación**: Crear guía de usuario final

## Contacto

Para preguntas o problemas con el sistema, contactar al equipo UBICATEC.

---
*Documento generado automáticamente - Sistema de Rutas Accesibles v2.0*
