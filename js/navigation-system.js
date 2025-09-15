/**
 * SISTEMA DE NAVEGACIÓN PRINCIPAL - UBICATEC
 * 
 * Este archivo coordina todo el sistema de navegación accesible,
 * integrando el grafo, calculador de rutas y visualizador.
 * 
 * @author UBICATEC Team
 * @version 2.0
 * @since 2025
 */

class NavigationSystem {
    constructor() {
        console.log('🧭 Inicializando sistema de navegación...');
        
        // Componentes del sistema
        this.graph = null;
        this.calculator = null;
        this.visualizer = null;
        this.map = null;
        
        // Estado del sistema
        this.state = {
            isInitialized: false,
            currentRoute: null,
            currentAccessibilityType: 'mobility',
            userLocation: null
        };
        
        // Configuración
        this.config = {
            maxSearchDistance: 200, // metros
            defaultAccessibilityType: 'mobility',
            supportedAccessibilityTypes: ['wheelchair', 'visual', 'auditory', 'mobility']
        };
        
        console.log('✅ Sistema de navegación inicializado');
    }

    /**
     * Inicializa el sistema completo
     */
    async initialize() {
        try {
            console.log('🚀 Inicializando sistema completo...');
            
            // 1. Crear el grafo estático
            this.graph = new CampusGraph();
            console.log('✅ Grafo estático creado');
            
            // 2. Crear el calculador de rutas
            this.calculator = new RouteCalculator(this.graph);
            console.log('✅ Calculador de rutas creado');
            
            // 3. Crear el visualizador
            this.visualizer = new RouteVisualizer();
            console.log('✅ Visualizador creado');
            
            // 4. Esperar a que el mapa esté listo
            await this.waitForMap();
            
            // 5. Inicializar el visualizador con el mapa
            this.visualizer.init(this.map);
            console.log('✅ Visualizador conectado al mapa');
            
            // 6. Marcar como inicializado
            this.state.isInitialized = true;
            
            console.log('🎉 Sistema de navegación completamente inicializado');
            this.logSystemStatus();
            
            return true;
        } catch (error) {
            console.error('❌ Error inicializando sistema de navegación:', error);
            return false;
        }
    }

    /**
     * Espera a que el mapa esté disponible
     */
    async waitForMap() {
        return new Promise((resolve) => {
            const checkMap = () => {
                if (window.map && typeof window.map.addLayer === 'function') {
                    this.map = window.map;
                    console.log('✅ Mapa encontrado y conectado');
                    resolve();
                } else {
                    console.log('⏳ Esperando mapa...');
                    setTimeout(checkMap, 100);
                }
            };
            checkMap();
        });
    }

    /**
     * Calcula y visualiza una ruta entre dos puntos
     */
    async calculateAndShowRoute(startCoords, endCoords, accessibilityType = null) {
        if (!this.state.isInitialized) {
            console.error('❌ Sistema no inicializado');
            return null;
        }

        try {
            console.log('🛣️ Calculando ruta...');
            
            // Usar tipo de accesibilidad por defecto si no se especifica
            const accType = accessibilityType || this.state.currentAccessibilityType;
            
            // Encontrar nodos más cercanos
            const startNode = this.findNearestNode(startCoords);
            const endNode = this.findNearestNode(endCoords);
            
            if (!startNode) {
                throw new Error('No se encontró un punto de inicio cercano');
            }
            
            if (!endNode) {
                throw new Error('No se encontró un punto de destino cercano');
            }
            
            console.log(`📍 Inicio: ${startNode.name} (${startNode.id})`);
            console.log(`🎯 Destino: ${endNode.name} (${endNode.id})`);
            
            // Calcular ruta
            const route = this.calculator.calculateRoute(
                startNode.id, 
                endNode.id, 
                accType
            );
            
            console.log(`✅ Ruta calculada: ${route.path.length} nodos, ${route.totalDistance.toFixed(1)}m`);
            
            // Guardar ruta actual
            this.state.currentRoute = route;
            this.state.currentAccessibilityType = accType;
            
            // Visualizar ruta
            this.visualizer.visualizeRoute(route, accType);
            
            return route;
        } catch (error) {
            console.error('❌ Error calculando ruta:', error);
            return null;
        }
    }

    /**
     * Calcula ruta desde la ubicación del usuario a un edificio
     */
    async navigateToBuilding(buildingName, userCoords = null) {
        if (!this.state.isInitialized) {
            console.error('❌ Sistema no inicializado');
            return null;
        }

        try {
            console.log(`🏢 Navegando a: ${buildingName}`);
            
            // Obtener coordenadas del usuario
            let startCoords = userCoords || this.state.userLocation;
            if (!startCoords) {
                // Intentar obtener ubicación del usuario
                startCoords = await this.getUserLocation();
            }
            
            if (!startCoords) {
                throw new Error('No se pudo obtener la ubicación del usuario');
            }
            
            // Buscar el edificio por nombre
            const building = this.findBuildingByName(buildingName);
            if (!building) {
                throw new Error(`Edificio no encontrado: ${buildingName}`);
            }
            
            // Calcular y mostrar ruta
            const route = await this.calculateAndShowRoute(
                startCoords, 
                building.coords, 
                this.state.currentAccessibilityType
            );
            
            return route;
        } catch (error) {
            console.error('❌ Error navegando a edificio:', error);
            return null;
        }
    }

    /**
     * Encuentra el nodo más cercano a unas coordenadas
     */
    findNearestNode(coords) {
        return this.graph.findNearestNode(coords, this.config.maxSearchDistance);
    }

    /**
     * Busca un edificio por nombre
     */
    findBuildingByName(buildingName) {
        const allNodes = this.graph.getAllNodes();
        
        // Buscar coincidencia exacta primero
        let building = allNodes.find(node => 
            node.type === 'building' && 
            node.name.toLowerCase() === buildingName.toLowerCase()
        );
        
        // Si no se encuentra, buscar coincidencia parcial
        if (!building) {
            building = allNodes.find(node => 
                node.type === 'building' && 
                node.name.toLowerCase().includes(buildingName.toLowerCase())
            );
        }
        
        return building;
    }

    /**
     * Obtiene la ubicación del usuario
     */
    async getUserLocation() {
        return new Promise((resolve, reject) => {
            if (!navigator.geolocation) {
                reject(new Error('Geolocalización no soportada'));
                return;
            }
            
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const coords = [position.coords.latitude, position.coords.longitude];
                    this.state.userLocation = coords;
                    console.log('📍 Ubicación del usuario obtenida:', coords);
                    resolve(coords);
                },
                (error) => {
                    console.error('❌ Error obteniendo ubicación:', error);
                    reject(error);
                },
                {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 60000
                }
            );
        });
    }

    /**
     * Cambia el tipo de accesibilidad
     */
    setAccessibilityType(type) {
        if (this.config.supportedAccessibilityTypes.includes(type)) {
            this.state.currentAccessibilityType = type;
            console.log(`♿ Tipo de accesibilidad cambiado a: ${type}`);
            
            // Recalcular ruta si hay una ruta actual
            if (this.state.currentRoute) {
                this.recalculateCurrentRoute();
            }
        } else {
            console.error(`❌ Tipo de accesibilidad no soportado: ${type}`);
        }
    }

    /**
     * Recalcula la ruta actual con el nuevo tipo de accesibilidad
     */
    recalculateCurrentRoute() {
        if (!this.state.currentRoute) {
            return;
        }
        
        try {
            const startNode = this.graph.getNode(this.state.currentRoute.path[0]);
            const endNode = this.graph.getNode(this.state.currentRoute.path[this.state.currentRoute.path.length - 1]);
            
            if (startNode && endNode) {
                const newRoute = this.calculator.calculateRoute(
                    startNode.id,
                    endNode.id,
                    this.state.currentAccessibilityType
                );
                
                this.state.currentRoute = newRoute;
                this.visualizer.visualizeRoute(newRoute, this.state.currentAccessibilityType);
                
                console.log('🔄 Ruta recalculada con nuevo tipo de accesibilidad');
            }
        } catch (error) {
            console.error('❌ Error recalculando ruta:', error);
        }
    }

    /**
     * Limpia la ruta actual
     */
    clearRoute() {
        this.visualizer.clearRoute();
        this.state.currentRoute = null;
        console.log('🧹 Ruta actual limpiada');
    }

    /**
     * Obtiene información de un nodo específico
     */
    getNodeInfo(nodeId) {
        const node = this.graph.getNode(nodeId);
        if (!node) {
            return null;
        }
        
        const connections = this.graph.getConnectionsFrom(nodeId);
        
        return {
            ...node,
            connections: connections.length,
            connectionTypes: [...new Set(connections.map(conn => conn.type))]
        };
    }

    /**
     * Obtiene estadísticas del sistema
     */
    getSystemStatistics() {
        return {
            isInitialized: this.state.isInitialized,
            currentRoute: this.state.currentRoute ? {
                pathLength: this.state.currentRoute.path.length,
                totalDistance: this.state.currentRoute.totalDistance,
                estimatedTime: this.state.currentRoute.estimatedTime
            } : null,
            currentAccessibilityType: this.state.currentAccessibilityType,
            userLocation: this.state.userLocation,
            graphStats: this.graph.getStatistics(),
            calculatorStats: this.calculator.getStatistics(),
            visualizerStats: this.visualizer.getStatistics()
        };
    }

    /**
     * Muestra el estado del sistema en la consola
     */
    logSystemStatus() {
        console.log('📊 Estado del Sistema de Navegación:');
        console.log('  ✅ Inicializado:', this.state.isInitialized);
        console.log('  🗺️ Mapa conectado:', !!this.map);
        console.log('  🏛️ Nodos del grafo:', this.graph.getAllNodes().length);
        console.log('  🔗 Conexiones:', this.graph.getTotalConnections());
        console.log('  ♿ Tipo de accesibilidad:', this.state.currentAccessibilityType);
        console.log('  📍 Ubicación del usuario:', this.state.userLocation ? 'Disponible' : 'No disponible');
    }

    /**
     * Destruye el sistema y limpia recursos
     */
    destroy() {
        this.clearRoute();
        
        if (this.visualizer) {
            this.visualizer.destroy();
        }
        
        this.graph = null;
        this.calculator = null;
        this.visualizer = null;
        this.map = null;
        this.state.isInitialized = false;
        
        console.log('🗑️ Sistema de navegación destruido');
    }
}

// Crear instancia global del sistema
window.unifiedNav = new NavigationSystem();

// Auto-inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    console.log('🌐 DOM cargado, iniciando sistema de navegación...');
    window.unifiedNav.initialize();
});

// Exportar para uso global
window.NavigationSystem = NavigationSystem;
