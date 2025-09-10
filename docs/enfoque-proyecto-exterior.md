# 🎯 ENFOQUE DEL PROYECTO - RUTAS ACCESIBLES EXTERIORES

## 📋 **OBJETIVO ESPECÍFICO DEL PROYECTO**

El sistema de rutas accesibles de UBICATEC está diseñado específicamente para **navegación exterior** en el campus, enfocándose en facilitar el movimiento de personas con discapacidades a través de **rampas, entradas accesibles y puntos de reunión**.

## 🚫 **LO QUE NO INCLUYE EL PROYECTO**

### **❌ Elevadores (Excluidos)**
- **Razón**: El proyecto se enfoca únicamente en rutas exteriores
- **Alcance**: Solo navegación entre edificios y áreas exteriores
- **Implementación**: No se incluyen conexiones de elevadores en el sistema

### **❌ Navegación Interior**
- **Razón**: El alcance es limitado a espacios exteriores del campus
- **Alcance**: Solo rutas entre edificios, no dentro de ellos
- **Implementación**: No se mapean rutas internas de edificios

## ✅ **LO QUE SÍ INCLUYE EL PROYECTO**

### **♿ Rampas Exteriores**
- **Puntos de acceso** con rampas a edificios
- **Rampas de conexión** entre diferentes niveles
- **Rampas de emergencia** para evacuación
- **Pesos optimizados** para silla de ruedas

### **🚪 Entradas Accesibles**
- **Entradas principales** con rampas
- **Accesos secundarios** accesibles
- **Puntos de entrada** identificados y mapeados
- **Conexiones prioritarias** para accesibilidad

### **📍 Puntos de Reunión**
- **Áreas de encuentro** accesibles
- **Espacios abiertos** con acceso fácil
- **Puntos de referencia** para navegación
- **Áreas de descanso** accesibles

### **🛤️ Rutas Exteriores Accesibles**
- **Caminos principales** del campus
- **Senderos accesibles** entre edificios
- **Rutas de emergencia** exteriores
- **Conexiones optimizadas** para accesibilidad

## 🔧 **IMPLEMENTACIÓN TÉCNICA**

### **Tipos de Nodos Específicos:**
```javascript
// Tipos de nodos para el proyecto exterior
this.nodeTypes = {
    BUILDING: 'building',           // Edificio
    INTERSECTION: 'intersection',   // Intersección de caminos
    WAYPOINT: 'waypoint',          // Punto de paso
    ACCESS_POINT: 'access_point',  // Punto de acceso
    RAMP: 'ramp',                  // Rampa exterior
    MEETING_POINT: 'meeting_point', // Punto de reunión
    // NO INCLUYE: ELEVATOR, STAIRS (solo exterior)
};
```

### **Tipos de Conexiones Específicos:**
```javascript
// Tipos de conexiones para el proyecto exterior
this.connectionTypes = {
    STANDARD: 'standard',           // Conexión normal exterior
    ACCESSIBLE: 'accessible',       // Conexión accesible exterior
    RAMP: 'ramp',                   // Rampa exterior
    ENTRADA_ACCESIBLE: 'entrada_accesible', // Entrada con rampa
    PUNTO_REUNION: 'punto_reunion', // Área de encuentro
    EMERGENCY: 'emergency',         // Conexión de emergencia exterior
    // NO INCLUYE: ELEVATOR, STAIRS (solo exterior)
};
```

### **Sistema de Pesos Ajustado:**
```javascript
// Pesos optimizados para rutas exteriores
this.accessibilityWeights = {
    wheelchair: {
        standard: 1.0,      // Peso normal exterior
        accessible: 0.5,    // Más fácil (rutas accesibles)
        ramp: 0.3,          // Muy fácil (rampas)
        entrada_accesible: 0.2, // Muy fácil (entradas con rampa)
        punto_reunion: 0.4, // Fácil (puntos de reunión)
        emergency: 0.8      // Un poco difícil (emergencia)
    },
    // NO INCLUYE: elevator, stairs (solo exterior)
};
```

## 📊 **ESTADÍSTICAS DEL PROYECTO**

### **Nodos Generados:**
- **Edificios**: 53 nodos (todos los edificios del campus)
- **Intersecciones**: 36 nodos (cruces de caminos exteriores)
- **Waypoints**: 100+ nodos (puntos intermedios exteriores)
- **Puntos de acceso**: 6 nodos (entradas principales)
- **Rampas**: Generadas automáticamente
- **Puntos de reunión**: Identificados y mapeados

### **Conexiones Generadas:**
- **Conexiones estándar**: Entre edificios cercanos
- **Conexiones accesibles**: Optimizadas para accesibilidad
- **Conexiones de rampa**: Entre puntos con rampas
- **Conexiones de entrada**: A puntos de acceso accesibles
- **Conexiones de reunión**: A puntos de encuentro
- **Conexiones de emergencia**: Para evacuación exterior

## 🎯 **CASOS DE USO ESPECÍFICOS**

### **Para Usuarios en Silla de Ruedas:**
- Encontrar **rampas** para acceder a edificios
- Navegar por **rutas accesibles** entre edificios
- Localizar **entradas accesibles** con rampas
- Acceder a **puntos de reunión** accesibles

### **Para Usuarios con Discapacidad Visual:**
- Navegar por **rutas bien iluminadas** exteriores
- Usar **puntos de referencia** accesibles
- Encontrar **entradas principales** identificadas
- Localizar **áreas de encuentro** accesibles

### **Para Usuarios con Discapacidad Auditiva:**
- Navegar por **rutas con señales visuales** exteriores
- Usar **puntos de referencia visuales**
- Encontrar **entradas identificadas** visualmente
- Localizar **áreas de encuentro** con señales visuales

### **Para Usuarios con Movilidad Reducida:**
- Encontrar **rutas cortas** entre edificios
- Usar **rampas** para cambios de nivel
- Acceder a **entradas accesibles**
- Localizar **puntos de descanso** accesibles

## 🚀 **PRÓXIMOS PASOS**

### **Fase 2 - Algoritmo de Dijkstra:**
- Implementar cálculo de rutas **exteriores** únicamente
- Optimizar para **rampas y entradas accesibles**
- Priorizar **puntos de reunión** accesibles
- Excluir **elevadores y escaleras** del cálculo

### **Fase 3 - Visualización:**
- Mostrar **rutas exteriores** en el mapa
- Destacar **rampas y entradas accesibles**
- Identificar **puntos de reunión** accesibles
- Excluir **elementos interiores** de la visualización

## 📝 **NOTAS IMPORTANTES**

### **Limitaciones del Proyecto:**
- **Solo exterior**: No incluye navegación interior de edificios
- **Sin elevadores**: No considera elevadores en el cálculo
- **Sin escaleras**: No incluye escaleras en rutas accesibles
- **Enfoque exterior**: Todas las rutas son entre edificios

### **Ventajas del Enfoque:**
- **Simplicidad**: Más fácil de implementar y mantener
- **Precisión**: Datos más exactos para rutas exteriores
- **Enfoque**: Específico para necesidades del campus
- **Escalabilidad**: Fácil agregar más elementos exteriores

---

*Documento de enfoque del proyecto - Actualizado para reflejar el alcance exterior específico*
