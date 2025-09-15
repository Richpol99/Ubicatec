/**
 * CALCULADOR DE RUTAS SIMPLIFICADO - UBICATEC
 * 
 * Este archivo implementa un algoritmo de Dijkstra simplificado
 * que trabaja con el grafo estático del campus.
 * 
 * @author UBICATEC Team
 * @version 2.0
 * @since 2025
 */

class RouteCalculator {
    constructor(graph) {
        this.graph = graph;
        console.log('🧮 RouteCalculator inicializado con grafo estático');
    }

    /**
     * Calcula la ruta más corta entre dos nodos
     * @param {string} startNodeId - ID del nodo de inicio
     * @param {string} endNodeId - ID del nodo de destino
     * @param {string} accessibilityType - Tipo de accesibilidad
     * @returns {Object} Ruta calculada
     */
    calculateRoute(startNodeId, endNodeId, accessibilityType = 'mobility') {
        console.log(`🛣️ Calculando ruta de ${startNodeId} a ${endNodeId} (${accessibilityType})`);

        // Verificar que los nodos existan
        const startNode = this.graph.getNode(startNodeId);
        const endNode = this.graph.getNode(endNodeId);

        if (!startNode) {
            throw new Error(`Nodo de inicio no encontrado: ${startNodeId}`);
        }

        if (!endNode) {
            throw new Error(`Nodo de destino no encontrado: ${endNodeId}`);
        }

        // Inicializar estructuras de datos
        const distances = new Map();
        const previous = new Map();
        const visited = new Set();
        const priorityQueue = [];

        // Inicializar distancias
        this.graph.getAllNodes().forEach(node => {
            distances.set(node.id, node.id === startNodeId ? 0 : Infinity);
            previous.set(node.id, null);
        });

        // Agregar nodo inicial a la cola
        priorityQueue.push({ id: startNodeId, distance: 0 });

        // Algoritmo de Dijkstra
        while (priorityQueue.length > 0) {
            // Ordenar cola por distancia
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
            if (currentNodeId === endNodeId) {
                break;
            }

            // Obtener conexiones del nodo actual
            const connections = this.graph.getConnectionsFrom(currentNodeId);
            
            // Procesar cada conexión
            connections.forEach(connection => {
                const neighborId = connection.to;
                
                // Si ya visitamos este vecino, saltar
                if (visited.has(neighborId)) {
                    return;
                }

                // Calcular peso de la conexión según accesibilidad
                const connectionWeight = connection.weights[accessibilityType] || connection.distance;
                
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
        const path = this.reconstructPath(startNodeId, endNodeId, previous);
        const totalDistance = distances.get(endNodeId);

        // Si no se encontró ruta
        if (totalDistance === Infinity) {
            throw new Error('No se encontró ruta entre los nodos especificados');
        }

        // Generar waypoints con información completa
        const waypoints = path.map(nodeId => {
            const node = this.graph.getNode(nodeId);
            return {
                id: nodeId,
                name: node.name,
                coords: node.coords,
                type: node.type,
                accessibility: node.accessibility
            };
        });

        return {
            path: path,
            totalDistance: totalDistance,
            accessibilityType: accessibilityType,
            estimatedTime: this.calculateEstimatedTime(totalDistance, accessibilityType),
            waypoints: waypoints,
            metadata: {
                algorithm: 'RouteCalculator',
                calculatedAt: new Date().toISOString(),
                nodesVisited: visited.size,
                totalNodes: this.graph.getAllNodes().length
            }
        };
    }

    /**
     * Reconstruye la ruta desde el nodo de destino hasta el de inicio
     */
    reconstructPath(startId, endId, previous) {
        const path = [];
        let current = endId;

        while (current !== null) {
            path.unshift(current);
            current = previous.get(current);
        }

        return path;
    }

    /**
     * Calcula el tiempo estimado de viaje
     */
    calculateEstimatedTime(distance, accessibilityType) {
        const speeds = {
            wheelchair: 50,    // 50 m/min (3 km/h)
            visual: 60,        // 60 m/min (3.6 km/h)
            auditory: 70,      // 70 m/min (4.2 km/h)
            mobility: 80       // 80 m/min (4.8 km/h)
        };

        const speed = speeds[accessibilityType] || 60;
        return Math.round((distance / speed) * 10) / 10;
    }

    /**
     * Encuentra el nodo más cercano a unas coordenadas
     */
    findNearestNode(coords, accessibilityType = 'mobility') {
        return this.graph.findNearestNode(coords);
    }

    /**
     * Verifica si existe una ruta entre dos nodos
     */
    hasRoute(startNodeId, endNodeId, accessibilityType = 'mobility') {
        try {
            this.calculateRoute(startNodeId, endNodeId, accessibilityType);
            return true;
        } catch (error) {
            return false;
        }
    }

    /**
     * Calcula múltiples rutas alternativas
     */
    calculateAlternativeRoutes(startNodeId, endNodeId, accessibilityType = 'mobility', maxRoutes = 3) {
        const routes = [];
        
        try {
            // Ruta principal
            const mainRoute = this.calculateRoute(startNodeId, endNodeId, accessibilityType);
            routes.push(mainRoute);
            
            // Aquí se pueden implementar algoritmos para rutas alternativas
            // Por ahora solo devolvemos la ruta principal
            return routes;
        } catch (error) {
            console.error('Error calculando rutas alternativas:', error);
            return [];
        }
    }

    /**
     * Obtiene estadísticas del calculador
     */
    getStatistics() {
        return {
            algorithm: 'RouteCalculator',
            graphNodes: this.graph.getAllNodes().length,
            graphConnections: this.graph.getTotalConnections(),
            supportedAccessibilityTypes: ['wheelchair', 'visual', 'auditory', 'mobility']
        };
    }
}

// Exportar para uso global
window.RouteCalculator = RouteCalculator;
