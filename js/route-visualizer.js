/**
 * VISUALIZADOR DE RUTAS ACCESIBLES - UBICATEC
 * 
 * Este archivo implementa la visualización de rutas calculadas por el algoritmo
 * de Dijkstra en el mapa de Leaflet, con indicadores específicos para accesibilidad.
 * 
 * @author UBICATEC Team
 * @version 1.0
 * @since 2025
 */

class RouteVisualizer {
    constructor() {
        // Referencias al mapa y sistemas
        this.map = null;
        this.routeLayerGroup = null;
        this.currentRoute = null;
        this.markers = [];
        
        // Configuración de colores por tipo de accesibilidad
        this.accessibilityColors = {
            wheelchair: '#28a745',    // Verde - Fácil para silla de ruedas
            visual: '#007bff',        // Azul - Optimizado para discapacidad visual
            auditory: '#ffc107',      // Amarillo - Optimizado para discapacidad auditiva
            mobility: '#17a2b8'       // Cian - Optimizado para movilidad reducida
        };
        
        // Configuración de iconos
        this.icons = {
            start: L.icon({
                iconUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDJMMTMuMDkgOC4yNkwyMCA5TDEzLjA5IDE1Ljc0TDEyIDIyTDEwLjkxIDE1Ljc0TDQgOUwxMC45MSA4LjI2TDEyIDJaIiBmaWxsPSIjMjhhNzQ1Ii8+Cjwvc3ZnPgo=',
                iconSize: [24, 24],
                iconAnchor: [12, 12],
                popupAnchor: [0, -12]
            }),
            end: L.icon({
                iconUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDJMMTMuMDkgOC4yNkwyMCA5TDEzLjA5IDE1Ljc0TDEyIDIyTDEwLjkxIDE1Ljc0TDQgOUwxMC45MSA4LjI2TDEyIDJaIiBmaWxsPSIjZGMzNTQ1Ii8+Cjwvc3ZnPgo=',
                iconSize: [24, 24],
                iconAnchor: [12, 12],
                popupAnchor: [0, -12]
            }),
            waypoint: L.icon({
                iconUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iOCIgY3k9IjgiIHI9IjYiIGZpbGw9IiM2YzY5NzUiIHN0cm9rZT0iI2ZmZmZmZiIgc3Ryb2tlLXdpZHRoPSIyIi8+Cjwvc3ZnPgo=',
                iconSize: [16, 16],
                iconAnchor: [8, 8],
                popupAnchor: [0, -8]
            }),
            accessibility: {
                wheelchair: L.icon({
                    iconUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyMCAyMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTUgMTBIMTJWMTVIMTNWMTZIMTFWMTVIMFYxMFoiIGZpbGw9IiMyOGE3NDUiLz4KPGNpcmNsZSBjeD0iNCIgY3k9IjE0IiByPSIyIiBmaWxsPSIjMjhhNzQ1Ii8+CjxjaXJjbGUgY3g9IjE0IiBjeT0iMTQiIHI9IjIiIGZpbGw9IiMyOGE3NDUiLz4KPC9zdmc+Cg==',
                    iconSize: [20, 20],
                    iconAnchor: [10, 10],
                    popupAnchor: [0, -10]
                }),
                visual: L.icon({
                    iconUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyMCAyMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTAiIGN5PSIxMCIgcj0iMyIgZmlsbD0iIzAwN2JmZiIgc3Ryb2tlPSIjZmZmZmZmIiBzdHJva2Utd2lkdGg9IjIiLz4KPGNpcmNsZSBjeD0iNyIgY3k9IjciIHI9IjEiIGZpbGw9IiMwMDdiZmYiLz4KPGNpcmNsZSBjeD0iMTMiIGN5PSI3IiByPSIxIiBmaWxsPSIjMDA3YmZmIi8+Cjwvc3ZnPgo=',
                    iconSize: [20, 20],
                    iconAnchor: [10, 10],
                    popupAnchor: [0, -10]
                }),
                auditory: L.icon({
                    iconUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyMCAyMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEwIDJMMTMgN0gxN1YxM0gxM0wxMCAxOFYyWiIgZmlsbD0iI2ZmYzEwNyIvPgo8cGF0aCBkPSJNNiA5VjE0SDhWMTBIOFY5SDZaIiBmaWxsPSIjZmZjMTA3Ii8+Cjwvc3ZnPgo=',
                    iconSize: [20, 20],
                    iconAnchor: [10, 10],
                    popupAnchor: [0, -10]
                }),
                mobility: L.icon({
                    iconUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyMCAyMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTUgMTBIMTVWMTJINVYxMFoiIGZpbGw9IiMxN2EyYjgiLz4KPHBhdGggZD0iTTggN0gxMlY5SDhWN1oiIGZpbGw9IiMxN2EyYjgiLz4KPHBhdGggZD0iTTggMTFIMTJWMTNIOCAxMVoiIGZpbGw9IiMxN2EyYjgiLz4KPC9zdmc+Cg==',
                    iconSize: [20, 20],
                    iconAnchor: [10, 10],
                    popupAnchor: [0, -10]
                })
            }
        };
        
        console.log('🎨 RouteVisualizer inicializado');
    }
    
    /**
     * Inicializa el visualizador con el mapa de Leaflet
     * @param {Object} map - Instancia del mapa de Leaflet
     */
    init(map) {
        this.map = map;
        
        // Verificar que el mapa esté listo y sea una instancia válida de Leaflet
        if (!map || typeof map.addLayer !== 'function' || typeof map.hasLayer !== 'function') {
            console.error('❌ El mapa no está listo o no es una instancia válida de Leaflet');
            console.error('❌ Tipo de mapa:', typeof map);
            console.error('❌ Propiedades del mapa:', Object.keys(map || {}));
            return this;
        }
        
        // Crear grupo de capas para las rutas
        try {
            this.routeLayerGroup = L.layerGroup();
            this.routeLayerGroup.addTo(map);
            console.log('🗺️ RouteVisualizer conectado al mapa');
        } catch (error) {
            console.error('❌ Error creando grupo de capas:', error);
            // Crear el grupo sin agregarlo al mapa por ahora
            this.routeLayerGroup = L.layerGroup();
            console.log('⚠️ Grupo de capas creado sin conectar al mapa');
        }
        
        return this;
    }
    
    /**
     * Reconecta el grupo de capas al mapa si no estaba conectado
     */
    reconnectToMap() {
        if (!this.map) {
            console.error('❌ No hay mapa disponible para reconectar');
            return;
        }
        
        // Verificar que el mapa sea una instancia válida de Leaflet
        if (typeof this.map.hasLayer !== 'function') {
            console.error('❌ El mapa no es una instancia válida de Leaflet');
            console.error('❌ Tipo de mapa:', typeof this.map);
            console.error('❌ Propiedades del mapa:', Object.keys(this.map || {}));
            
            // Intentar obtener la instancia correcta del mapa
            this.map = this.getValidMapInstance();
            if (!this.map) {
                console.error('❌ No se pudo obtener una instancia válida del mapa');
                return;
            }
        }
        
        if (!this.routeLayerGroup) {
            console.log('🔄 Creando nuevo grupo de capas...');
            try {
                this.routeLayerGroup = L.layerGroup();
                this.routeLayerGroup.addTo(this.map);
                console.log('✅ Nuevo grupo de capas creado y conectado');
            } catch (error) {
                console.error('❌ Error creando nuevo grupo de capas:', error);
            }
        } else if (!this.map.hasLayer(this.routeLayerGroup)) {
            try {
                this.routeLayerGroup.addTo(this.map);
                console.log('✅ Grupo de capas reconectado al mapa');
            } catch (error) {
                console.error('❌ Error reconectando grupo de capas:', error);
            }
        }
    }
    
    /**
     * Intenta obtener una instancia válida del mapa de Leaflet
     * @returns {Object|null} Instancia válida del mapa o null
     */
    getValidMapInstance() {
        console.log('🔍 Buscando instancia válida del mapa...');
        
        // Método 1: Buscar en window.map
        if (window.map && typeof window.map.addLayer === 'function' && typeof window.map.hasLayer === 'function') {
            console.log('✅ Instancia válida encontrada en window.map');
            return window.map;
        }
        
        // Método 2: Buscar en el elemento del mapa
        const mapElement = document.getElementById('mapa'); // Cambiar de 'map' a 'mapa'
        if (mapElement && mapElement._leaflet_id) {
            try {
                // Usar la API correcta de Leaflet 1.7.1
                const leafletMap = L.Map.getMap(mapElement);
                if (leafletMap && typeof leafletMap.addLayer === 'function') {
                    console.log('✅ Instancia válida encontrada en elemento del mapa');
                    return leafletMap;
                }
            } catch (error) {
                console.warn('⚠️ Error obteniendo mapa del elemento:', error);
            }
        }
        
        // Método 3: Buscar en todas las instancias de Leaflet
        if (typeof L !== 'undefined' && L.Map) {
            try {
                const allMaps = L.Map.prototype._instances || [];
                for (let map of allMaps) {
                    if (map && typeof map.addLayer === 'function' && typeof map.hasLayer === 'function') {
                        console.log('✅ Instancia válida encontrada en instancias de Leaflet');
                        return map;
                    }
                }
            } catch (error) {
                console.warn('⚠️ Error buscando en instancias de Leaflet:', error);
            }
        }
        
        console.error('❌ No se encontró ninguna instancia válida del mapa');
        return null;
    }
    
    /**
     * Visualiza una ruta calculada en el mapa
     * @param {Object} route - Ruta calculada por Dijkstra
     * @param {string} accessibilityType - Tipo de accesibilidad
     */
    visualizeRoute(route, accessibilityType = 'wheelchair') {
        if (!route) {
            console.error('❌ Ruta no disponible para visualización');
            return;
        }
        
        if (!this.map) {
            console.error('❌ Mapa no disponible para visualización. Asegúrate de que el visualizador esté inicializado correctamente.');
            return;
        }
        
        // Reconectar el grupo de capas si es necesario
        this.reconnectToMap();
        
        console.log('🛣️ Visualizando ruta:', route.path);
        
        // Limpiar ruta anterior
        this.clearRoute();
        
        // Guardar ruta actual
        this.currentRoute = route;
        
        // Crear polylines segmentadas para la ruta (mejor visualización)
        this.createSegmentedRoutePolylines(route, accessibilityType);
        
        // Crear marcadores para puntos importantes
        this.createRouteMarkers(route, accessibilityType);
        
        // Ajustar vista del mapa a la ruta
        this.fitMapToRoute(route);
        
        console.log('✅ Ruta visualizada correctamente');
    }
    
    /**
     * Crea la polylínea principal de la ruta siguiendo las rutas predefinidas
     * @param {Object} route - Ruta a visualizar
     * @param {string} accessibilityType - Tipo de accesibilidad
     */
    createRoutePolyline(route, accessibilityType) {
        if (!route.waypoints || route.waypoints.length < 2) {
            console.error('❌ Ruta sin waypoints suficientes');
            return;
        }
        
        // Verificar que el grupo de capas esté disponible
        if (!this.routeLayerGroup) {
            console.error('❌ Grupo de capas no inicializado');
            return;
        }
        
        console.log('🛣️ Creando polylínea usando waypoints directos...');
        
        // Usar directamente las coordenadas de los waypoints
        const coordinates = route.waypoints.map(waypoint => waypoint.coords);
        
        if (coordinates.length < 2) {
            console.error('❌ No se pudieron obtener coordenadas válidas para la ruta');
            return;
        }
        
        console.log(`📍 Usando ${coordinates.length} waypoints para la ruta`);
        
        // Crear polylínea con estilo según accesibilidad
        const polyline = L.polyline(coordinates, {
            color: this.accessibilityColors[accessibilityType] || '#28a745',
            weight: 6,
            opacity: 0.9,
            smoothFactor: 1
        });
        
        // Agregar información de la ruta como popup
        polyline.bindPopup(`
            <div class="route-info">
                <h6>Ruta ${this.getAccessibilityLabel(accessibilityType)}</h6>
                <p><strong>Distancia:</strong> ${route.totalDistance.toFixed(1)} metros</p>
                <p><strong>Tiempo estimado:</strong> ${route.estimatedTime.toFixed(1)} minutos</p>
                <p><strong>Nodos:</strong> ${route.path.length}</p>
                <p><strong>Puntos de ruta:</strong> ${coordinates.length}</p>
            </div>
        `);
        
        // Agregar al grupo de capas
        try {
            this.routeLayerGroup.addLayer(polyline);
            console.log('📏 Polylínea creada con', coordinates.length, 'puntos');
        } catch (error) {
            console.error('❌ Error agregando polylínea al grupo de capas:', error);
            // Intentar agregar directamente al mapa como fallback
            if (this.map) {
                try {
                    polyline.addTo(this.map);
                    console.log('📏 Polylínea agregada directamente al mapa como fallback');
                } catch (fallbackError) {
                    console.error('❌ Error agregando polylínea al mapa:', fallbackError);
                }
            }
        }
    }
    
    /**
     * Obtiene las coordenadas de la ruta siguiendo las conexiones del grafo
     * @param {Object} route - Ruta calculada
     * @returns {Array} Array de coordenadas [lat, lng]
     */
    getRouteCoordinates(route) {
        if (!route.path || route.path.length < 2) {
            return [];
        }
        
        const coordinates = [];
        
        // Obtener el grafo del sistema de navegación
        const graph = window.unifiedNav?.graph || this.graph;
        if (!graph) {
            console.warn('⚠️ Grafo no disponible, usando coordenadas directas');
            return route.waypoints.map(waypoint => waypoint.coords);
        }
        
        console.log('🔍 Reconstruyendo ruta siguiendo conexiones del grafo...');
        
        // Versión simplificada: usar solo las coordenadas de los nodos de la ruta
        for (let i = 0; i < route.path.length; i++) {
            const nodeId = route.path[i];
            const node = graph.getNode(nodeId);
            
            if (node) {
                coordinates.push(node.coords);
                console.log(`📍 Agregando nodo ${i + 1}/${route.path.length}: ${nodeId} (${node.coords})`);
            } else {
                console.warn(`⚠️ Nodo no encontrado: ${nodeId}`);
            }
        }
        
        console.log(`✅ Ruta simplificada con ${coordinates.length} puntos`);
        return coordinates;
    }
    
    /**
     * Obtiene las coordenadas de una ruta secuencial específica
     * @param {string} fromNodeId - ID del nodo de origen
     * @param {string} toNodeId - ID del nodo de destino
     * @param {string} routeName - Nombre de la ruta (verde, naranja, azul)
     * @param {Object} graph - Instancia del grafo
     * @returns {Array} Array de coordenadas intermedias
     */
    getSequentialRouteCoordinates(fromNodeId, toNodeId, routeName, graph) {
        if (!routeName) {
            return [];
        }
        
        console.log(`🔍 Buscando puntos intermedios en ruta ${routeName} entre ${fromNodeId} y ${toNodeId}`);
        
        // Obtener todos los nodos de la ruta específica
        const routeNodes = Array.from(graph.nodes.values()).filter(node => 
            node.metadata && node.metadata.route === routeName
        );
        
        if (routeNodes.length === 0) {
            console.warn(`⚠️ No se encontraron nodos para la ruta ${routeName}`);
            return [];
        }
        
        // Ordenar por índice
        routeNodes.sort((a, b) => a.metadata.index - b.metadata.index);
        
        // Encontrar el índice del nodo de origen y destino
        const fromIndex = routeNodes.findIndex(node => node.id === fromNodeId);
        const toIndex = routeNodes.findIndex(node => node.id === toNodeId);
        
        console.log(`🔍 Nodos encontrados: ${fromNodeId} en índice ${fromIndex}, ${toNodeId} en índice ${toIndex}`);
        
        if (fromIndex === -1 || toIndex === -1) {
            console.warn(`⚠️ Nodo no encontrado en ruta ${routeName}: ${fromNodeId} (${fromIndex}) o ${toNodeId} (${toIndex})`);
            return [];
        }
        
        // Obtener coordenadas entre los nodos
        const coordinates = [];
        const startIndex = Math.min(fromIndex, toIndex);
        const endIndex = Math.max(fromIndex, toIndex);
        
        console.log(`🔍 Buscando puntos intermedios en ruta ${routeName} entre índices ${startIndex} y ${endIndex} (${endIndex - startIndex - 1} puntos intermedios)`);
        
        for (let i = startIndex + 1; i < endIndex; i++) {
            coordinates.push(routeNodes[i].coords);
            console.log(`   📍 Agregando punto intermedio: ${routeNodes[i].id} (${routeNodes[i].coords})`);
        }
        
        console.log(`🛤️ Ruta ${routeName}: ${coordinates.length} puntos intermedios entre ${fromNodeId} y ${toNodeId}`);
        return coordinates;
    }
    
    /**
     * Crea polylíneas segmentadas por tipo de ruta para mejor visualización
     * @param {Object} route - Ruta calculada
     * @param {string} accessibilityType - Tipo de accesibilidad
     */
    createSegmentedRoutePolylines(route, accessibilityType) {
        if (!route.waypoints || route.waypoints.length < 2) {
            console.error('❌ Ruta sin waypoints suficientes');
            return;
        }
        
        // Verificar que el grupo de capas esté disponible
        if (!this.routeLayerGroup) {
            console.error('❌ Grupo de capas no inicializado');
            return;
        }
        
        console.log('🛣️ Creando polylíneas siguiendo rutas predefinidas...');
        
        // Obtener el grafo del sistema de navegación
        const graph = window.unifiedNav?.graph || this.graph;
        if (!graph) {
            console.warn('⚠️ Grafo no disponible, usando visualización simple');
            this.createRoutePolyline(route, accessibilityType);
            return;
        }
        
        // Crear segmentos de ruta siguiendo las rutas predefinidas
        const routeSegments = this.createDetailedRouteSegments(route, graph);
        
        // Crear polylíneas para cada segmento
        routeSegments.forEach((segment, index) => {
            if (segment.coordinates.length < 2) {
                return;
            }
            
            // Determinar color según el tipo de ruta
            let color = this.accessibilityColors[accessibilityType] || '#28a745';
            if (segment.routeType === 'naranja') {
                color = '#ff8c00'; // Naranja
            } else if (segment.routeType === 'verde') {
                color = '#28a745'; // Verde
            } else if (segment.routeType === 'azul') {
                color = '#007bff'; // Azul
            }
            
            const polyline = L.polyline(segment.coordinates, {
                color: color,
                weight: 6,
                opacity: 0.9,
                smoothFactor: 1
            });
            
            // Agregar información del segmento
            polyline.bindPopup(`
                <div class="route-segment-info">
                    <h6>Segmento ${index + 1}</h6>
                    <p><strong>Tipo:</strong> ${segment.routeType || 'Conexión'}</p>
                    <p><strong>Puntos:</strong> ${segment.coordinates.length}</p>
                    <p><strong>Distancia:</strong> ${segment.distance.toFixed(1)}m</p>
                </div>
            `);
            
            try {
                this.routeLayerGroup.addLayer(polyline);
                console.log(`📏 Segmento ${index + 1} creado: ${segment.routeType} con ${segment.coordinates.length} puntos`);
            } catch (error) {
                console.error(`❌ Error creando segmento ${index + 1}:`, error);
            }
        });
    }
    
    /**
     * Crea segmentos de ruta detallados siguiendo las rutas predefinidas
     * @param {Object} route - Ruta calculada
     * @param {Object} graph - Instancia del grafo
     * @returns {Array} Array de segmentos de ruta con todos los nodos intermedios
     */
    createDetailedRouteSegments(route, graph) {
        const segments = [];
        let currentSegment = null;
        
        console.log('🔍 Creando segmentos detallados siguiendo rutas predefinidas...');
        
        for (let i = 0; i < route.path.length - 1; i++) {
            const fromNodeId = route.path[i];
            const toNodeId = route.path[i + 1];
            
            const fromNode = graph.getNode(fromNodeId);
            const toNode = graph.getNode(toNodeId);
            
            if (!fromNode || !toNode) {
                console.warn(`⚠️ Nodo no encontrado: ${fromNodeId} o ${toNodeId}`);
                continue;
            }
            
            // Determinar el tipo de ruta basado en los nodos
            const routeType = this.determineRouteType(fromNode, toNode);
            
            // Si es un nuevo tipo de ruta, crear un nuevo segmento
            if (!currentSegment || currentSegment.routeType !== routeType) {
                if (currentSegment) {
                    segments.push(currentSegment);
                }
                currentSegment = {
                    routeType: routeType,
                    coordinates: [],
                    distance: 0
                };
            }
            
            // Obtener TODOS los nodos intermedios de la ruta predefinida
            const intermediateNodes = this.getIntermediateRouteNodes(fromNodeId, toNodeId, routeType, graph);
            
            // Agregar coordenadas del nodo actual
            currentSegment.coordinates.push(fromNode.coords);
            
            // Agregar TODOS los nodos intermedios
            intermediateNodes.forEach(node => {
                currentSegment.coordinates.push(node.coords);
                console.log(`📍 Agregando nodo intermedio: ${node.id} (${node.metadata?.route})`);
            });
            
            // Calcular distancia total del segmento
            const segmentDistance = this.calculateSegmentDistance(currentSegment.coordinates);
            currentSegment.distance = segmentDistance;
        }
        
        // Agregar el último nodo
        if (currentSegment) {
            const lastNode = graph.getNode(route.path[route.path.length - 1]);
            if (lastNode) {
                currentSegment.coordinates.push(lastNode.coords);
            }
            segments.push(currentSegment);
        }
        
        console.log(`✅ Creados ${segments.length} segmentos detallados`);
        return segments;
    }
    
    /**
     * Obtiene todos los nodos intermedios de una ruta predefinida
     * @param {string} fromNodeId - ID del nodo origen
     * @param {string} toNodeId - ID del nodo destino
     * @param {string} routeType - Tipo de ruta (naranja, verde, azul)
     * @param {Object} graph - Instancia del grafo
     * @returns {Array} Array de nodos intermedios
     */
    getIntermediateRouteNodes(fromNodeId, toNodeId, routeType, graph) {
        const intermediateNodes = [];
        
        // Obtener todos los nodos de la ruta específica
        const routeNodes = Array.from(graph.nodes.values())
            .filter(node => node.metadata?.route === routeType)
            .sort((a, b) => a.metadata.index - b.metadata.index);
        
        if (routeNodes.length === 0) {
            console.warn(`⚠️ No se encontraron nodos para la ruta ${routeType}`);
            return intermediateNodes;
        }
        
        // Encontrar los índices de los nodos origen y destino
        const fromIndex = routeNodes.findIndex(node => node.id === fromNodeId);
        const toIndex = routeNodes.findIndex(node => node.id === toNodeId);
        
        if (fromIndex === -1 || toIndex === -1) {
            console.warn(`⚠️ Nodos no encontrados en la ruta ${routeType}: ${fromNodeId} o ${toNodeId}`);
            return intermediateNodes;
        }
        
        // Obtener todos los nodos entre el origen y destino
        const startIndex = Math.min(fromIndex, toIndex);
        const endIndex = Math.max(fromIndex, toIndex);
        
        for (let i = startIndex + 1; i < endIndex; i++) {
            intermediateNodes.push(routeNodes[i]);
        }
        
        console.log(`🛤️ Ruta ${routeType}: ${intermediateNodes.length} nodos intermedios entre ${fromNodeId} y ${toNodeId}`);
        return intermediateNodes;
    }
    
    /**
     * Calcula la distancia total de un segmento
     * @param {Array} coordinates - Array de coordenadas
     * @returns {number} Distancia total en metros
     */
    calculateSegmentDistance(coordinates) {
        let totalDistance = 0;
        for (let i = 0; i < coordinates.length - 1; i++) {
            totalDistance += this.calculateDistance(coordinates[i], coordinates[i + 1]);
        }
        return totalDistance;
    }
    
    /**
     * Determina el tipo de ruta basado en los nodos
     * @param {Object} fromNode - Nodo origen
     * @param {Object} toNode - Nodo destino
     * @returns {string} Tipo de ruta (naranja, verde, azul, connection)
     */
    determineRouteType(fromNode, toNode) {
        // Si ambos nodos tienen metadata de ruta y es la misma, usar esa ruta
        if (fromNode.metadata?.route && toNode.metadata?.route && 
            fromNode.metadata.route === toNode.metadata.route) {
            return fromNode.metadata.route;
        }
        
        // Si solo uno tiene metadata de ruta, usar esa
        if (fromNode.metadata?.route) {
            return fromNode.metadata.route;
        }
        if (toNode.metadata?.route) {
            return toNode.metadata.route;
        }
        
        // Si son edificios, es una conexión directa
        if (fromNode.type === 'building' && toNode.type === 'building') {
            return 'connection';
        }
        
        // Si uno es edificio y el otro es ruta, usar la ruta del nodo de ruta
        if (fromNode.type === 'building' && toNode.type === 'route') {
            return toNode.metadata?.route || 'connection';
        }
        if (fromNode.type === 'route' && toNode.type === 'building') {
            return fromNode.metadata?.route || 'connection';
        }
        
        // Si ambos son nodos de ruta pero diferentes rutas, usar 'connection'
        if (fromNode.type === 'route' && toNode.type === 'route') {
            return 'connection';
        }
        
        // Por defecto, conexión
        return 'connection';
    }
    
    /**
     * Crea segmentos de ruta agrupados por tipo
     * @param {Object} route - Ruta calculada
     * @param {Object} graph - Instancia del grafo
     * @returns {Array} Array de segmentos de ruta
     */
    createRouteSegments(route, graph) {
        const segments = [];
        let currentSegment = null;
        
        for (let i = 0; i < route.path.length - 1; i++) {
            const currentNodeId = route.path[i];
            const nextNodeId = route.path[i + 1];
            
            const currentNode = graph.getNode(currentNodeId);
            const nextNode = graph.getNode(nextNodeId);
            
            if (!currentNode || !nextNode) {
                continue;
            }
            
            // Buscar la conexión entre nodos
            const connections = graph.getConnectionsFrom(currentNodeId);
            const connection = connections.find(conn => conn.to === nextNodeId);
            
            let routeType = 'connection';
            if (connection && connection.route) {
                routeType = connection.route;
            }
            
            // Si el tipo de ruta cambió, crear un nuevo segmento
            if (!currentSegment || currentSegment.routeType !== routeType) {
                if (currentSegment) {
                    segments.push(currentSegment);
                }
                
                currentSegment = {
                    routeType: routeType,
                    coordinates: [currentNode.coords],
                    distance: 0
                };
            }
            
            // Agregar coordenadas del nodo actual
            currentSegment.coordinates.push(currentNode.coords);
            
            // Si es una conexión secuencial, agregar puntos intermedios
            if (connection && connection.type === 'sequential') {
                const routeCoordinates = this.getSequentialRouteCoordinates(
                    currentNodeId, 
                    nextNodeId, 
                    connection.route, 
                    graph
                );
                
                if (routeCoordinates.length > 0) {
                    currentSegment.coordinates.push(...routeCoordinates);
                }
            }
            
            // Calcular distancia del segmento
            if (currentSegment.coordinates.length > 1) {
                const lastCoord = currentSegment.coordinates[currentSegment.coordinates.length - 1];
                const distance = this.calculateDistance(lastCoord, nextNode.coords);
                currentSegment.distance += distance;
            }
        }
        
        // Agregar el último nodo al segmento actual
        if (currentSegment) {
            const lastNode = graph.getNode(route.path[route.path.length - 1]);
            if (lastNode) {
                currentSegment.coordinates.push(lastNode.coords);
            }
            segments.push(currentSegment);
        }
        
        console.log(`🛤️ Creados ${segments.length} segmentos de ruta`);
        return segments;
    }
    
    /**
     * Calcula la distancia entre dos coordenadas
     * @param {Array} coord1 - Primera coordenada [lat, lng]
     * @param {Array} coord2 - Segunda coordenada [lat, lng]
     * @returns {number} Distancia en metros
     */
    calculateDistance(coord1, coord2) {
        const R = 6371000; // Radio de la Tierra en metros
        const lat1 = coord1[0] * Math.PI / 180;
        const lat2 = coord2[0] * Math.PI / 180;
        const deltaLat = (coord2[0] - coord1[0]) * Math.PI / 180;
        const deltaLng = (coord2[1] - coord1[1]) * Math.PI / 180;

        const a = Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
                Math.cos(lat1) * Math.cos(lat2) *
                Math.sin(deltaLng / 2) * Math.sin(deltaLng / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return R * c;
    }
    
    /**
     * Crea marcadores para puntos importantes de la ruta
     * @param {Object} route - Ruta a visualizar
     * @param {string} accessibilityType - Tipo de accesibilidad
     */
    createRouteMarkers(route, accessibilityType) {
        if (!route.waypoints || route.waypoints.length === 0) {
            return;
        }
        
        // Verificar que el grupo de capas esté disponible
        if (!this.routeLayerGroup) {
            console.error('❌ Grupo de capas no inicializado para marcadores');
            return;
        }
        
        // Marcador de inicio
        const startWaypoint = route.waypoints[0];
        const startMarker = L.marker(startWaypoint.coords, {
            icon: this.icons.start
        }).bindPopup(`
            <div class="route-marker">
                <h6>🏁 Punto de Inicio</h6>
                <p><strong>${startWaypoint.name}</strong></p>
                <p>${startWaypoint.coords[0].toFixed(6)}, ${startWaypoint.coords[1].toFixed(6)}</p>
            </div>
        `);
        
        try {
            this.routeLayerGroup.addLayer(startMarker);
            this.markers.push(startMarker);
        } catch (error) {
            console.error('❌ Error agregando marcador de inicio:', error);
        }
        
        // Marcador de destino
        const endWaypoint = route.waypoints[route.waypoints.length - 1];
        const endMarker = L.marker(endWaypoint.coords, {
            icon: this.icons.end
        }).bindPopup(`
            <div class="route-marker">
                <h6>🎯 Destino</h6>
                <p><strong>${endWaypoint.name}</strong></p>
                <p>${endWaypoint.coords[0].toFixed(6)}, ${endWaypoint.coords[1].toFixed(6)}</p>
            </div>
        `);
        
        try {
            this.routeLayerGroup.addLayer(endMarker);
            this.markers.push(endMarker);
        } catch (error) {
            console.error('❌ Error agregando marcador de destino:', error);
        }
        
        // Marcadores de waypoints intermedios (si hay muchos)
        if (route.waypoints.length > 2) {
            for (let i = 1; i < route.waypoints.length - 1; i++) {
                const waypoint = route.waypoints[i];
                const waypointMarker = L.marker(waypoint.coords, {
                    icon: this.icons.waypoint
                }).bindPopup(`
                    <div class="route-marker">
                        <h6>📍 Punto Intermedio</h6>
                        <p><strong>${waypoint.name}</strong></p>
                        <p>${waypoint.coords[0].toFixed(6)}, ${waypoint.coords[1].toFixed(6)}</p>
                    </div>
                `);
                
                try {
                    this.routeLayerGroup.addLayer(waypointMarker);
                    this.markers.push(waypointMarker);
                } catch (error) {
                    console.error('❌ Error agregando marcador intermedio:', error);
                }
            }
        }
        
        console.log('📍 Marcadores creados:', this.markers.length);
    }
    
    /**
     * Ajusta la vista del mapa para mostrar toda la ruta
     * @param {Object} route - Ruta a mostrar
     */
    fitMapToRoute(route) {
        if (!route.waypoints || route.waypoints.length === 0) {
            return;
        }
        
        // Crear grupo de puntos para ajustar la vista
        const routeGroup = L.featureGroup();
        
        route.waypoints.forEach(waypoint => {
            const marker = L.marker(waypoint.coords);
            routeGroup.addLayer(marker);
        });
        
        // Ajustar vista con padding
        this.map.fitBounds(routeGroup.getBounds().pad(0.1));
        
        console.log('🔍 Vista del mapa ajustada a la ruta');
    }
    
    /**
     * Limpia la ruta actual del mapa
     */
    clearRoute() {
        if (this.routeLayerGroup) {
            this.routeLayerGroup.clearLayers();
        }
        
        this.markers = [];
        this.currentRoute = null;
        
        console.log('🧹 Ruta anterior limpiada');
    }
    
    /**
     * Obtiene la etiqueta legible del tipo de accesibilidad
     * @param {string} accessibilityType - Tipo de accesibilidad
     * @returns {string} Etiqueta legible
     */
    getAccessibilityLabel(accessibilityType) {
        const labels = {
            wheelchair: '♿ Silla de Ruedas',
            visual: '👁️ Discapacidad Visual',
            auditory: '👂 Discapacidad Auditiva',
            mobility: '🚶 Movilidad Reducida'
        };
        
        return labels[accessibilityType] || 'Accesible';
    }
    
    /**
     * Destaca un nodo específico en el mapa
     * @param {string} nodeId - ID del nodo a destacar
     * @param {string} type - Tipo de nodo ('building', 'intersection', etc.)
     */
    highlightNode(nodeId, type = 'building') {
        // Esta funcionalidad se puede expandir para destacar nodos específicos
        console.log('🔍 Destacando nodo:', nodeId, 'tipo:', type);
    }
    
    /**
     * Muestra información de accesibilidad en un nodo
     * @param {Object} node - Nodo del campus
     */
    showAccessibilityInfo(node) {
        if (!node || !node.accessibility) {
            return;
        }
        
        const info = `
            <div class="accessibility-info">
                <h6>♿ Información de Accesibilidad</h6>
                <ul>
                    ${node.accessibility.wheelchair ? '<li>✅ Silla de ruedas</li>' : '<li>❌ Silla de ruedas</li>'}
                    ${node.accessibility.visual ? '<li>✅ Discapacidad visual</li>' : '<li>❌ Discapacidad visual</li>'}
                    ${node.accessibility.auditory ? '<li>✅ Discapacidad auditiva</li>' : '<li>❌ Discapacidad auditiva</li>'}
                    ${node.accessibility.mobility ? '<li>✅ Movilidad reducida</li>' : '<li>❌ Movilidad reducida</li>'}
                </ul>
            </div>
        `;
        
        return info;
    }
    
    /**
     * Obtiene estadísticas del visualizador
     * @returns {Object} Estadísticas actuales
     */
    getStatistics() {
        return {
            currentRoute: this.currentRoute ? {
                pathLength: this.currentRoute.path.length,
                totalDistance: this.currentRoute.totalDistance,
                estimatedTime: this.currentRoute.estimatedTime
            } : null,
            markersCount: this.markers.length,
            isInitialized: !!this.map,
            accessibilityColors: Object.keys(this.accessibilityColors).length
        };
    }
    
    /**
     * Destruye el visualizador y limpia recursos
     */
    destroy() {
        this.clearRoute();
        
        if (this.routeLayerGroup) {
            this.map.removeLayer(this.routeLayerGroup);
        }
        
        this.map = null;
        this.routeLayerGroup = null;
        
        console.log('🗑️ RouteVisualizer destruido');
    }
}

// Exportar para uso global
window.RouteVisualizer = RouteVisualizer;
window.RouteVisualizer = RouteVisualizer;