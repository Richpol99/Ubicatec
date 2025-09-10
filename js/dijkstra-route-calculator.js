/**
 * ALGORITMO DE DIJKSTRA PARA CÁLCULO DE RUTAS ACCESIBLES - UBICATEC
 * 
 * Este archivo implementa el algoritmo de Dijkstra adaptado para el cálculo
 * de rutas accesibles en el campus del Tecnológico de Puebla.
 * 
 * @author UBICATEC Team
 * @version 1.0
 * @since 2025
 */

class DijkstraRouteCalculator {
    constructor() {
        // Configuración del algoritmo
        this.config = {
            maxDistance: 1000, // Distancia máxima en metros para considerar conexiones
            accessibilityWeights: {
                wheelchair: {
                    standard: 1.0,
                    accessible: 0.5,
                    ramp: 0.3,
                    elevator: 0.2,
                    stairs: 10.0,
                    emergency: 0.8
                },
                visual: {
                    standard: 1.0,
                    accessible: 0.6,
                    ramp: 0.4,
                    elevator: 0.3,
                    stairs: 1.2,
                    emergency: 1.5
                },
                auditory: {
                    standard: 1.0,
                    accessible: 0.7,
                    ramp: 0.5,
                    elevator: 0.4,
                    stairs: 1.1,
                    emergency: 1.3
                },
                mobility: {
                    standard: 1.0,
                    accessible: 0.6,
                    ramp: 0.4,
                    elevator: 0.3,
                    stairs: 2.0,
                    emergency: 0.9
                }
            }
        };

        // Referencias a sistemas externos
        this.campusNodes = null;
        this.campusConnections = null;
        
        console.log('🔧 DijkstraRouteCalculator inicializado');
    }

    /**
     * Conecta con los sistemas de nodos y conexiones
     * @param {CampusNodes} campusNodes - Sistema de nodos del campus
     * @param {CampusConnections} campusConnections - Sistema de conexiones
     */
    setCampusSystems(campusNodes, campusConnections) {
        this.campusNodes = campusNodes;
        this.campusConnections = campusConnections;
        console.log('🔗 Sistemas del campus conectados al calculador Dijkstra');
    }

    /**
     * Calcula la ruta más corta entre dos nodos usando el algoritmo de Dijkstra
     * @param {string} startNodeId - ID del nodo de inicio
     * @param {string} endNodeId - ID del nodo de destino
     * @param {string} accessibilityType - Tipo de accesibilidad requerida
     * @returns {Object} Objeto con la ruta calculada y metadatos
     */
    calculateRoute(startNodeId, endNodeId, accessibilityType = 'wheelchair') {
        console.log(`🛣️ Calculando ruta de ${startNodeId} a ${endNodeId} (${accessibilityType})`);

        // Validar que los sistemas estén disponibles
        if (!this.campusNodes || !this.campusConnections) {
            throw new Error('Sistemas de nodos y conexiones no están disponibles');
        }

        // Obtener nodos de inicio y destino
        const startNode = this.campusNodes.findNodeById(startNodeId);
        const endNode = this.campusNodes.findNodeById(endNodeId);

        if (!startNode || !endNode) {
            throw new Error('Nodos de inicio o destino no encontrados');
        }

        // Verificar que el tipo de accesibilidad sea válido
        if (!this.config.accessibilityWeights[accessibilityType]) {
            throw new Error(`Tipo de accesibilidad no válido: ${accessibilityType}`);
        }

        // Ejecutar algoritmo de Dijkstra
        const result = this.dijkstra(startNodeId, endNodeId, accessibilityType);

        console.log(`✅ Ruta calculada: ${result.path.length} nodos, ${Math.round(result.totalDistance)}m`);
        
        return result;
    }

    /**
     * Implementación del algoritmo de Dijkstra
     * @param {string} startId - ID del nodo de inicio
     * @param {string} endId - ID del nodo de destino
     * @param {string} accessibilityType - Tipo de accesibilidad
     * @returns {Object} Resultado del algoritmo
     */
    dijkstra(startId, endId, accessibilityType) {
        // Obtener todos los nodos
        const allNodes = this.campusNodes.exportNodes();
        const nodeIds = allNodes.map(node => node.id);

        // Inicializar estructuras de datos
        const distances = new Map();
        const previous = new Map();
        const visited = new Set();
        const priorityQueue = [];

        // Inicializar distancias
        nodeIds.forEach(nodeId => {
            distances.set(nodeId, nodeId === startId ? 0 : Infinity);
            previous.set(nodeId, null);
        });

        // Agregar nodo inicial a la cola de prioridad
        priorityQueue.push({ id: startId, distance: 0 });

        // Algoritmo principal de Dijkstra
        while (priorityQueue.length > 0) {
            // Ordenar cola por distancia (simulando cola de prioridad)
            priorityQueue.sort((a, b) => a.distance - b.distance);
            
            // Obtener nodo con menor distancia
            const current = priorityQueue.shift();
            const currentNodeId = current.id;

            // Si ya visitamos este nodo, continuar
            if (visited.has(currentNodeId)) {
                continue;
            }

            // Marcar como visitado
            visited.add(currentNodeId);

            // Si llegamos al destino, terminar
            if (currentNodeId === endId) {
                break;
            }

            // Obtener conexiones del nodo actual
            const connections = this.campusConnections.getConnectionsFrom(currentNodeId);
            
            // Procesar cada conexión
            connections.forEach(connection => {
                const neighborId = connection.to;
                
                // Si ya visitamos este vecino, saltar
                if (visited.has(neighborId)) {
                    return;
                }

                // Calcular peso de la conexión para el tipo de accesibilidad
                const connectionWeight = this.calculateConnectionWeight(connection, accessibilityType);
                
                // Calcular nueva distancia
                const currentDistance = distances.get(currentNodeId);
                const newDistance = currentDistance + connectionWeight;

                // Si encontramos una ruta más corta, actualizar
                if (newDistance < distances.get(neighborId)) {
                    distances.set(neighborId, newDistance);
                    previous.set(neighborId, currentNodeId);
                    
                    // Agregar a la cola de prioridad
                    priorityQueue.push({ id: neighborId, distance: newDistance });
                }
            });
        }

        // Reconstruir la ruta
        const path = this.reconstructPath(startId, endId, previous);
        const totalDistance = distances.get(endId);

        // Si no se encontró ruta
        if (totalDistance === Infinity) {
            throw new Error('No se encontró ruta entre los nodos especificados');
        }

        return {
            path: path,
            totalDistance: totalDistance,
            accessibilityType: accessibilityType,
            estimatedTime: this.calculateEstimatedTime(totalDistance, accessibilityType),
            waypoints: this.generateWaypoints(path),
            metadata: {
                algorithm: 'Dijkstra',
                calculatedAt: new Date().toISOString(),
                nodesVisited: visited.size,
                totalNodes: allNodes.length
            }
        };
    }

    /**
     * Calcula el peso de una conexión para un tipo de accesibilidad específico
     * @param {Object} connection - Objeto de conexión
     * @param {string} accessibilityType - Tipo de accesibilidad
     * @returns {number} Peso de la conexión
     */
    calculateConnectionWeight(connection, accessibilityType) {
        // Obtener peso base de la conexión
        const baseWeight = connection.weights[accessibilityType] || 1.0;
        
        // Aplicar multiplicador según el tipo de conexión
        const typeMultiplier = this.config.accessibilityWeights[accessibilityType][connection.type] || 1.0;
        
        return baseWeight * typeMultiplier;
    }

    /**
     * Reconstruye la ruta desde el nodo de destino hasta el de inicio
     * @param {string} startId - ID del nodo de inicio
     * @param {string} endId - ID del nodo de destino
     * @param {Map} previous - Mapa de nodos anteriores
     * @returns {Array} Array de IDs de nodos que forman la ruta
     */
    reconstructPath(startId, endId, previous) {
        const path = [];
        let current = endId;

        // Reconstruir desde el final hasta el inicio
        while (current !== null) {
            path.unshift(current);
            current = previous.get(current);
        }

        return path;
    }

    /**
     * Calcula el tiempo estimado de viaje basado en la distancia y tipo de accesibilidad
     * @param {number} distance - Distancia en metros
     * @param {string} accessibilityType - Tipo de accesibilidad
     * @returns {number} Tiempo estimado en minutos
     */
    calculateEstimatedTime(distance, accessibilityType) {
        // Velocidades promedio en metros por minuto según tipo de accesibilidad
        const speeds = {
            wheelchair: 50,    // 50 m/min (3 km/h)
            visual: 60,        // 60 m/min (3.6 km/h)
            auditory: 70,      // 70 m/min (4.2 km/h)
            mobility: 80       // 80 m/min (4.8 km/h)
        };

        const speed = speeds[accessibilityType] || 60;
        return Math.round((distance / speed) * 10) / 10; // Redondear a 1 decimal
    }

    /**
     * Genera waypoints intermedios para la ruta
     * @param {Array} path - Array de IDs de nodos
     * @returns {Array} Array de waypoints con coordenadas
     */
    generateWaypoints(path) {
        const waypoints = [];
        
        path.forEach(nodeId => {
            const node = this.campusNodes.findNodeById(nodeId);
            if (node) {
                waypoints.push({
                    id: nodeId,
                    name: node.name,
                    coords: node.coords,
                    type: node.type
                });
            }
        });

        return waypoints;
    }

    /**
     * Encuentra el nodo más cercano a unas coordenadas
     * @param {Array} coords - Coordenadas [lat, lng]
     * @param {string} accessibilityType - Tipo de accesibilidad
     * @returns {Object} Nodo más cercano
     */
    findNearestNode(coords, accessibilityType = 'wheelchair') {
        const allNodes = this.campusNodes.exportNodes();
        let nearestNode = null;
        let minDistance = Infinity;

        allNodes.forEach(node => {
            // Verificar que el nodo sea accesible para el tipo especificado
            if (this.isNodeAccessible(node, accessibilityType)) {
                const distance = this.campusNodes.calculateDistance(coords, node.coords);
                if (distance < minDistance) {
                    minDistance = distance;
                    nearestNode = node;
                }
            }
        });

        return nearestNode;
    }

    /**
     * Verifica si un nodo es accesible para un tipo de accesibilidad específico
     * @param {Object} node - Nodo a verificar
     * @param {string} accessibilityType - Tipo de accesibilidad
     * @returns {boolean} true si el nodo es accesible
     */
    isNodeAccessible(node, accessibilityType) {
        if (!node.accessibility) {
            return true; // Si no hay información de accesibilidad, asumir accesible
        }

        return node.accessibility[accessibilityType] === true;
    }

    /**
     * Calcula múltiples rutas alternativas entre dos nodos
     * @param {string} startId - ID del nodo de inicio
     * @param {string} endId - ID del nodo de destino
     * @param {string} accessibilityType - Tipo de accesibilidad
     * @param {number} maxRoutes - Número máximo de rutas a calcular
     * @returns {Array} Array de rutas alternativas
     */
    calculateAlternativeRoutes(startId, endId, accessibilityType = 'wheelchair', maxRoutes = 3) {
        console.log(`🛣️ Calculando ${maxRoutes} rutas alternativas de ${startId} a ${endId}`);

        const routes = [];
        
        try {
            // Calcular ruta principal
            const mainRoute = this.calculateRoute(startId, endId, accessibilityType);
            routes.push(mainRoute);

            // Para rutas alternativas, podríamos implementar algoritmos como Yen's K-shortest paths
            // Por ahora, retornamos solo la ruta principal
            console.log(`✅ ${routes.length} ruta(s) calculada(s)`);
            
        } catch (error) {
            console.error('Error calculando rutas alternativas:', error);
        }

        return routes;
    }

    /**
     * Obtiene estadísticas del calculador
     * @returns {Object} Estadísticas del sistema
     */
    getStatistics() {
        return {
            algorithm: 'Dijkstra',
            supportedAccessibilityTypes: Object.keys(this.config.accessibilityWeights),
            maxDistance: this.config.maxDistance,
            campusNodesAvailable: this.campusNodes !== null,
            campusConnectionsAvailable: this.campusConnections !== null
        };
    }
}

// Exportar la clase para uso global
window.DijkstraRouteCalculator = DijkstraRouteCalculator;

// Auto-inicialización cuando el DOM esté listo
$(document).ready(function() {
    console.log('🔧 DijkstraRouteCalculator cargado y listo para usar');
});
