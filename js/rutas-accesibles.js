// Sistema de rutas accesibles para UBICATEC
class AccessibleRouteSystem {
    constructor(options = {}) {
        // Configuración básica
        this.config = {
            mapContainer: options.mapContainer || 'map',
            enableGeolocation: options.enableGeolocation !== false,
            defaultAccessibilityType: options.defaultAccessibilityType || 'wheelchair',
            debugMode: options.debugMode || false
        };

        // Estado actual del sistema
        this.state = {
            isInitialized: false,
            isCalculating: false,
            currentRoute: null,
            userLocation: null,
            selectedStart: null,
            selectedEnd: null,
            accessibilityType: this.config.defaultAccessibilityType
        };

        // Referencias a otros sistemas
        this.campusNodes = null;
        this.campusConnections = null;
        this.map = null;
        this.dijkstraCalculator = null;
        this.distanceCalculator = null;
        this.routeValidator = null;
        this.accessibilityWeights = null;

        // Elementos del DOM
        this.elements = {
            map: null,
            mapContainer: null,
            routeButton: null,
            accessibilityModal: null
        };

        // Sistemas externos
        this.externalSystems = {
            campusNodes: null,
            campusConnections: null
        };

        // Event listeners
        this.eventListeners = new Map();

        // Inicializar
        this.init();
    }

    /**
     * Inicializa el sistema de rutas accesibles
     */
    async init() {
        try {
            this.log('Inicializando sistema de rutas accesibles...');
            
            // Verificar dependencias
            if (!this.checkDependencies()) {
                throw new Error('Dependencias requeridas no encontradas');
            }

            // Configurar elementos del DOM
            this.setupDOMElements();

            // Configurar event listeners
            this.setupEventListeners();

            // Cargar sistemas externos
            await this.loadExternalSystems();

            // Marcar como inicializado
            this.state.isInitialized = true;
            
            this.log('Sistema de rutas accesibles inicializado correctamente');
            
            // Emitir evento de inicialización
            this.emit('systemInitialized', { system: this });

        } catch (error) {
            this.log('Error al inicializar el sistema:', error);
            throw error;
        }
    }

    /**
     * Verifica que las dependencias requeridas estén disponibles
     * @returns {boolean} true si todas las dependencias están disponibles
     */
    checkDependencies() {
        const requiredDependencies = [
            'L', // Leaflet
            'jQuery' // jQuery
        ];

        for (const dep of requiredDependencies) {
            if (typeof window[dep] === 'undefined') {
                this.log(`Dependencia requerida no encontrada: ${dep}`);
                return false;
            }
        }

        return true;
    }

    /**
     * Configura las referencias a elementos del DOM
     */
    setupDOMElements() {
        this.elements.mapContainer = document.getElementById(this.config.mapContainer);
        
        if (!this.elements.mapContainer) {
            throw new Error(`Contenedor del mapa no encontrado: ${this.config.mapContainer}`);
        }

        // El mapa se obtendrá del sistema existente
        this.elements.map = window.map || null;
        
        if (!this.elements.map) {
            this.log('Advertencia: Mapa principal no encontrado, se creará referencia más tarde');
        }
    }

    /**
     * Configura los event listeners del sistema
     */
    setupEventListeners() {
        // Event listener para cuando el mapa esté listo
        this.addEventListener('mapReady', this.onMapReady.bind(this));
        
        // Event listener para cambios en la ubicación del usuario
        this.addEventListener('userLocationChanged', this.onUserLocationChanged.bind(this));
        
        // Event listener para selección de edificios
        this.addEventListener('buildingSelected', this.onBuildingSelected.bind(this));
    }

    /**
     * Carga los sistemas externos necesarios
     */
    async loadExternalSystems() {
        try {
            // Cargar sistema de nodos del campus
            if (typeof CampusNodes !== 'undefined') {
                this.externalSystems.campusNodes = new CampusNodes();
                this.campusNodes = this.externalSystems.campusNodes;
                this.log('Sistema de nodos del campus cargado');
            } else {
                this.log('Advertencia: CampusNodes no disponible, se cargará más tarde');
            }

            // Cargar sistema de conexiones del campus
            if (typeof CampusConnections !== 'undefined') {
                this.externalSystems.campusConnections = new CampusConnections();
                this.campusConnections = this.externalSystems.campusConnections;
                this.log('Sistema de conexiones del campus cargado');
            } else {
                this.log('Advertencia: CampusConnections no disponible, se cargará más tarde');
            }

            // Cargar calculador de Dijkstra
            if (typeof DijkstraRouteCalculator !== 'undefined') {
                this.dijkstraCalculator = new DijkstraRouteCalculator();
                this.dijkstraCalculator.setCampusSystems(this.campusNodes, this.campusConnections);
                this.log('Calculador de Dijkstra cargado');
            } else {
                this.log('Advertencia: DijkstraRouteCalculator no disponible');
            }

            // Cargar calculador de distancias
            if (typeof DistanceCalculator !== 'undefined') {
                this.distanceCalculator = new DistanceCalculator();
                this.log('Calculador de distancias cargado');
            } else {
                this.log('Advertencia: DistanceCalculator no disponible');
            }

            // Cargar validador de rutas
            if (typeof RouteValidator !== 'undefined') {
                this.routeValidator = new RouteValidator();
                this.routeValidator.setDistanceCalculator(this.distanceCalculator);
                this.log('Validador de rutas cargado');
            } else {
                this.log('Advertencia: RouteValidator no disponible');
            }

            // Cargar sistema de pesos de accesibilidad
            if (typeof AccessibilityWeights !== 'undefined') {
                this.accessibilityWeights = new AccessibilityWeights();
                this.log('Sistema de pesos de accesibilidad cargado');
            } else {
                this.log('Advertencia: AccessibilityWeights no disponible');
            }

        } catch (error) {
            this.log('Error al cargar sistemas externos:', error);
            // No lanzar error, permitir carga diferida
        }
    }

    /**
     * Maneja el evento de mapa listo
     */
    onMapReady() {
        this.elements.map = window.map;
        this.log('Mapa principal conectado al sistema de rutas accesibles');
    }

    /**
     * Maneja el evento de cambio de ubicación del usuario
     * @param {Object} event - Evento con datos de ubicación
     */
    onUserLocationChanged(event) {
        this.state.userLocation = event.location;
        this.log('Ubicación del usuario actualizada:', event.location);
    }

    /**
     * Maneja el evento de selección de edificio
     * @param {Object} event - Evento con datos del edificio seleccionado
     */
    onBuildingSelected(event) {
        this.log('Edificio seleccionado:', event.building);
        
        // Si no hay punto de inicio, establecer como inicio
        if (!this.state.selectedStart) {
            this.setStartPoint(event.building);
        } else if (!this.state.selectedEnd) {
            this.setEndPoint(event.building);
        }
    }

    /**
     * Establece el punto de inicio de la ruta
     * @param {Object} building - Datos del edificio de inicio
     */
    setStartPoint(building) {
        this.state.selectedStart = building;
        this.log('Punto de inicio establecido:', building);
        this.emit('startPointSet', { building });
    }

    /**
     * Establece el punto de destino de la ruta
     * @param {Object} building - Datos del edificio de destino
     */
    setEndPoint(building) {
        this.state.selectedEnd = building;
        this.log('Punto de destino establecido:', building);
        this.emit('endPointSet', { building });
    }

    /**
     * Calcula una ruta accesible entre dos puntos
     * @param {Object} start - Punto de inicio
     * @param {Object} end - Punto de destino
     * @param {string} accessibilityType - Tipo de accesibilidad requerida
     * @returns {Promise<Object>} Datos de la ruta calculada
     */
    async calculateRoute(start, end, accessibilityType = null) {
        if (this.state.isCalculating) {
            this.log('Ya hay un cálculo de ruta en progreso');
            return null;
        }

        try {
            this.state.isCalculating = true;
            this.state.accessibilityType = accessibilityType || this.state.accessibilityType;
            
            this.log(`Calculando ruta accesible de ${start.nombre} a ${end.nombre}`);
            this.emit('routeCalculationStarted', { start, end, accessibilityType: this.state.accessibilityType });

            // Verificar que los sistemas externos estén disponibles
            if (!this.externalSystems.campusNodes || !this.externalSystems.campusConnections) {
                throw new Error('Sistemas de nodos y conexiones no están disponibles');
            }

            // Obtener nodos de inicio y destino
            let startNodes = this.externalSystems.campusNodes.findNodesByName(start.nombre);
            const endNodes = this.externalSystems.campusNodes.findNodesByName(end.nombre);

            // Si no se encuentra el nodo de inicio por nombre, buscar el más cercano por coordenadas
            if (!startNodes || startNodes.length === 0) {
                console.log(`🔍 No se encontró nodo por nombre "${start.nombre}", buscando por coordenadas...`);
                const nearestNode = this.externalSystems.campusNodes.findNearestNode(start.coords);
                if (nearestNode) {
                    startNodes = [nearestNode];
                    console.log(`✅ Nodo más cercano encontrado: ${nearestNode.name}`);
                } else {
                    throw new Error(`No se pudo encontrar el nodo de inicio: ${start.nombre}`);
                }
            }
            
            if (!endNodes || endNodes.length === 0) {
                throw new Error(`No se pudo encontrar el nodo de destino: ${end.nombre}`);
            }

            // Usar el primer nodo encontrado (asumiendo que hay uno principal)
            const startNode = startNodes[0];
            const endNode = endNodes[0];

            // Calcular la ruta usando el algoritmo de Dijkstra
            const route = await this.calculateDijkstraRoute(startNode, endNode, this.state.accessibilityType);

            this.state.currentRoute = route;
            this.log('Ruta calculada exitosamente:', route);
            
            this.emit('routeCalculated', { route, start, end });
            
            return route;

        } catch (error) {
            this.log('Error al calcular la ruta:', error);
            this.emit('routeCalculationError', { error, start, end });
            throw error;
        } finally {
            this.state.isCalculating = false;
        }
    }

    /**
     * Calcula la ruta usando el algoritmo de Dijkstra
     * @param {Object} startNode - Nodo de inicio
     * @param {Object} endNode - Nodo de destino
     * @param {string} accessibilityType - Tipo de accesibilidad
     * @returns {Promise<Object>} Datos de la ruta
     */
    async calculateDijkstraRoute(startNode, endNode, accessibilityType) {
        if (!this.dijkstraCalculator) {
            throw new Error('Calculador de Dijkstra no disponible');
        }

        try {
            // Calcular ruta usando Dijkstra
            const route = this.dijkstraCalculator.calculateRoute(
                startNode.id, 
                endNode.id, 
                accessibilityType
            );

            // Validar la ruta si el validador está disponible
            if (this.routeValidator && route.waypoints) {
                const validation = this.routeValidator.validateRoute(route.waypoints, accessibilityType);
                route.validation = validation;
            }

            return route;

        } catch (error) {
            this.log('Error calculando ruta con Dijkstra:', error);
            
            // Fallback: ruta básica directa
            return {
                path: [startNode, endNode],
                distance: this.calculateDistance(startNode.coords, endNode.coords),
                accessibilityType: accessibilityType,
                estimatedTime: this.calculateEstimatedTime(startNode.coords, endNode.coords, accessibilityType),
                waypoints: [
                    { id: startNode.id, name: startNode.name, coords: startNode.coords, type: startNode.type },
                    { id: endNode.id, name: endNode.name, coords: endNode.coords, type: endNode.type }
                ],
                isFallback: true
            };
        }
    }

    /**
     * Calcula la distancia entre dos puntos usando la fórmula de Haversine
     * Esta es una fórmula matemática compleja que calcula la distancia real entre dos puntos
     * en la superficie de la Tierra, considerando que la Tierra es esférica.
     * 
     * @param {Array} coords1 - Coordenadas del primer punto [lat, lng]
     * @param {Array} coords2 - Coordenadas del segundo punto [lat, lng]
     * @returns {number} Distancia en metros
     */
    calculateDistance(coords1, coords2) {
        // Radio de la Tierra en metros
        const R = 6371e3;
        
        // Convertir grados a radianes (necesario para los cálculos trigonométricos)
        const φ1 = coords1[0] * Math.PI / 180;  // latitud del primer punto
        const φ2 = coords2[0] * Math.PI / 180;  // latitud del segundo punto
        const Δφ = (coords2[0] - coords1[0]) * Math.PI / 180;  // diferencia de latitud
        const Δλ = (coords2[1] - coords1[1]) * Math.PI / 180;  // diferencia de longitud

        // Fórmula de Haversine (matemática compleja para calcular distancia en esfera)
        const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
                  Math.cos(φ1) * Math.cos(φ2) *
                  Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        // Distancia final en metros
        return R * c;
    }

    /**
     * Calcula el tiempo estimado de viaje
     * @param {Array} coords1 - Coordenadas del primer punto
     * @param {Array} coords2 - Coordenadas del segundo punto
     * @param {string} accessibilityType - Tipo de accesibilidad
     * @returns {number} Tiempo estimado en minutos
     */
    calculateEstimatedTime(coords1, coords2, accessibilityType) {
        const distance = this.calculateDistance(coords1, coords2);
        
        // Velocidades promedio en metros por minuto según tipo de accesibilidad
        const speeds = {
            wheelchair: 50,    // 50 m/min (3 km/h)
            visual: 60,        // 60 m/min (3.6 km/h)
            auditory: 70,      // 70 m/min (4.2 km/h)
            mobility: 60       // 60 m/min (3.6 km/h)
        };

        const speed = speeds[accessibilityType] || 60;
        return Math.round((distance / speed) * 10) / 10; // Redondear a 1 decimal
    }

    /**
     * Visualiza una ruta en el mapa
     * @param {Object} route - Datos de la ruta a visualizar
     */
    visualizeRoute(route) {
        if (!this.elements.map) {
            this.log('Error: Mapa no disponible para visualización');
            return;
        }

        this.log('Visualizando ruta en el mapa:', route);
        this.emit('routeVisualizationStarted', { route });

        // La visualización se implementará cuando se cree el sistema de visualización
        // Por ahora, solo se registra el evento
    }

    /**
     * Limpia la ruta actual del mapa
     */
    clearRoute() {
        this.log('Limpiando ruta actual del mapa');
        this.emit('routeCleared');
    }

    /**
     * Agrega un event listener
     * Los event listeners permiten que diferentes partes del código se comuniquen
     * sin conocerse directamente. Es como un sistema de notificaciones.
     * 
     * @param {string} event - Nombre del evento (ej: 'routeCalculated')
     * @param {Function} callback - Función que se ejecutará cuando ocurra el evento
     */
    addEventListener(event, callback) {
        if (!this.eventListeners.has(event)) {
            this.eventListeners.set(event, []);
        }
        this.eventListeners.get(event).push(callback);
    }

    /**
     * Emite un evento
     * Cuando algo importante sucede en el sistema, se "emite" un evento
     * para que todas las funciones que estén "escuchando" se ejecuten.
     * 
     * @param {string} event - Nombre del evento a emitir
     * @param {Object} data - Datos que se pasarán a las funciones que escuchan
     */
    emit(event, data = {}) {
        if (this.eventListeners.has(event)) {
            this.eventListeners.get(event).forEach(callback => {
                try {
                    callback(data);
                } catch (error) {
                    this.log(`Error en event listener para ${event}:`, error);
                }
            });
        }
    }

    /**
     * Registra un mensaje de log
     * @param {string} message - Mensaje a registrar
     * @param {...any} args - Argumentos adicionales
     */
    log(message, ...args) {
        if (this.config.debugMode) {
            console.log(`[AccessibleRouteSystem] ${message}`, ...args);
        }
    }

    /**
     * Obtiene el estado actual del sistema
     * @returns {Object} Estado del sistema
     */
    getState() {
        return { ...this.state };
    }

    /**
     * Obtiene la configuración del sistema
     * @returns {Object} Configuración del sistema
     */
    getConfig() {
        return { ...this.config };
    }

    /**
     * Destruye el sistema y limpia recursos
     */
    destroy() {
        this.log('Destruyendo sistema de rutas accesibles...');
        
        // Limpiar event listeners
        this.eventListeners.clear();
        
        // Limpiar estado
        this.state = {
            isInitialized: false,
            isCalculating: false,
            currentRoute: null,
            userLocation: null,
            selectedStart: null,
            selectedEnd: null,
            accessibilityType: this.config.defaultAccessibilityType
        };
        
        // Limpiar referencias
        this.elements = {
            map: null,
            mapContainer: null,
            routeButton: null,
            accessibilityModal: null
        };
        
        this.log('Sistema destruido');
    }
}

// Exportar la clase para uso global
window.AccessibleRouteSystem = AccessibleRouteSystem;

// Auto-inicialización cuando el DOM esté listo
$(document).ready(function() {
    // Esperar a que el mapa esté disponible
    if (typeof map !== 'undefined' && map) {
        // Inicializar el sistema de rutas accesibles
        window.accessibleRouteSystem = new AccessibleRouteSystem({
            mapContainer: 'map',
            enableGeolocation: true,
            defaultAccessibilityType: 'wheelchair',
            debugMode: true
        });
    } else {
        // Esperar a que el mapa se inicialice
        $(document).on('mapInitialized', function() {
            window.accessibleRouteSystem = new AccessibleRouteSystem({
                mapContainer: 'map',
                enableGeolocation: true,
                defaultAccessibilityType: 'wheelchair',
                debugMode: true
            });
        });
    }
});
