// Sistema de conexiones del campus para UBICATEC
class CampusConnections {
    constructor() {
        // Tipos de conexiones disponibles
        this.connectionTypes = {
            STANDARD: 'standard',           // Conexión normal
            ACCESSIBLE: 'accessible',       // Conexión accesible
            EMERGENCY: 'emergency',         // Conexión de emergencia
            RAMP: 'ramp',                   // Rampa
            ELEVATOR: 'elevator',           // Elevador
            STAIRS: 'stairs'                // Escaleras
        };

        // Almacén de conexiones
        this.connections = new Map();
        
        // Contador para IDs únicos
        this.connectionIdCounter = 0;

        // Pesos base para diferentes tipos de accesibilidad
        this.accessibilityWeights = {
            wheelchair: {
                standard: 1.0,      // Peso normal
                accessible: 0.5,    // Más fácil
                ramp: 0.3,          // Muy fácil
                elevator: 0.2,      // Muy fácil
                stairs: 10.0,       // Muy difícil
                emergency: 0.8      // Un poco difícil
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
        };

        // Referencia al sistema de nodos
        this.campusNodes = null;

        console.log('🔗 Sistema de conexiones del campus inicializado');
    }

    // Conectar con el sistema de nodos
    setCampusNodes(campusNodes) {
        this.campusNodes = campusNodes;
        this.generateConnections();
    }

    // Generar todas las conexiones automáticamente
    generateConnections() {
        if (!this.campusNodes) {
            console.log('⚠️ CampusNodes no disponible');
            return;
        }

        console.log('🔄 Generando conexiones del campus...');
        
        // Obtener todos los nodos
        const allNodes = this.campusNodes.exportNodes();
        
        // Generar conexiones entre nodos cercanos
        this.generateNearbyConnections(allNodes);
        
        // Generar conexiones especiales
        this.generateSpecialConnections(allNodes);
        
        console.log(`✅ ${this.connections.size} conexiones generadas`);
    }

    // Generar conexiones entre nodos cercanos
    generateNearbyConnections(nodes) {
        for (let i = 0; i < nodes.length; i++) {
            for (let j = i + 1; j < nodes.length; j++) {
                const node1 = nodes[i];
                const node2 = nodes[j];
                const distance = this.campusNodes.calculateDistance(node1.coords, node2.coords);
                
                // Solo conectar nodos que estén cerca (menos de 150 metros)
                if (distance < 150) {
                    this.createConnection(node1, node2, this.connectionTypes.STANDARD);
                    
                    // Si ambos nodos son accesibles, crear conexión accesible también
                    if (this.isAccessibleConnection(node1, node2)) {
                        this.createConnection(node1, node2, this.connectionTypes.ACCESSIBLE);
                    }
                }
            }
        }
    }

    // Generar conexiones especiales (rampas, elevadores, etc.)
    generateSpecialConnections(nodes) {
        const buildings = nodes.filter(node => node.type === 'building');
        
        // Crear conexiones de rampa entre edificios cercanos
        buildings.forEach(building1 => {
            buildings.forEach(building2 => {
                if (building1.id !== building2.id) {
                    const distance = this.campusNodes.calculateDistance(building1.coords, building2.coords);
                    
                    // Si están muy cerca (menos de 50 metros), crear rampa
                    if (distance < 50) {
                        this.createConnection(building1, building2, this.connectionTypes.RAMP);
                    }
                }
            });
        });

        // Crear conexiones de emergencia entre todos los edificios
        buildings.forEach(building1 => {
            buildings.forEach(building2 => {
                if (building1.id !== building2.id) {
                    this.createConnection(building1, building2, this.connectionTypes.EMERGENCY);
                }
            });
        });
    }

    // Crear una conexión entre dos nodos
    createConnection(node1, node2, connectionType) {
        const connectionId = this.generateConnectionId();
        const distance = this.campusNodes.calculateDistance(node1.coords, node2.coords);
        
        const connection = {
            id: connectionId,
            from: node1.id,
            to: node2.id,
            type: connectionType,
            distance: distance,
            weights: this.calculateWeights(connectionType, distance),
            accessibility: this.getConnectionAccessibility(connectionType),
            metadata: {
                created: new Date().toISOString(),
                fromName: node1.name,
                toName: node2.name
            }
        };
        
        this.connections.set(connectionId, connection);
    }

    // Calcular pesos para diferentes tipos de accesibilidad
    calculateWeights(connectionType, distance) {
        const weights = {};
        
        // Calcular peso base por distancia
        const baseWeight = distance / 100; // Peso base por cada 100 metros
        
        // Aplicar multiplicadores según el tipo de conexión
        Object.keys(this.accessibilityWeights).forEach(accessibilityType => {
            const multiplier = this.accessibilityWeights[accessibilityType][connectionType] || 1.0;
            weights[accessibilityType] = baseWeight * multiplier;
        });
        
        return weights;
    }

    // Obtener accesibilidad de una conexión
    getConnectionAccessibility(connectionType) {
        const accessibilityMap = {
            standard: { wheelchair: true, visual: true, auditory: true, mobility: true },
            accessible: { wheelchair: true, visual: true, auditory: true, mobility: true },
            ramp: { wheelchair: true, visual: true, auditory: true, mobility: true },
            elevator: { wheelchair: true, visual: true, auditory: true, mobility: true },
            stairs: { wheelchair: false, visual: true, auditory: true, mobility: true },
            emergency: { wheelchair: true, visual: true, auditory: true, mobility: true }
        };
        
        return accessibilityMap[connectionType] || { wheelchair: true, visual: true, auditory: true, mobility: true };
    }

    // Verificar si dos nodos pueden tener conexión accesible
    isAccessibleConnection(node1, node2) {
        return node1.accessibility.wheelchair && 
               node2.accessibility.wheelchair &&
               node1.accessibility.visual && 
               node2.accessibility.visual;
    }

    // Generar ID único para conexión
    generateConnectionId() {
        this.connectionIdCounter++;
        return `conn_${this.connectionIdCounter.toString().padStart(4, '0')}`;
    }

    // Obtener todas las conexiones desde un nodo
    getConnectionsFrom(nodeId) {
        const connections = [];
        this.connections.forEach(connection => {
            if (connection.from === nodeId) {
                connections.push(connection);
            }
        });
        return connections;
    }

    // Obtener todas las conexiones hacia un nodo
    getConnectionsTo(nodeId) {
        const connections = [];
        this.connections.forEach(connection => {
            if (connection.to === nodeId) {
                connections.push(connection);
            }
        });
        return connections;
    }

    // Obtener todas las conexiones de un nodo (entrada y salida)
    getNodeConnections(nodeId) {
        const connections = [];
        this.connections.forEach(connection => {
            if (connection.from === nodeId || connection.to === nodeId) {
                connections.push(connection);
            }
        });
        return connections;
    }

    // Obtener conexión entre dos nodos específicos
    getConnectionBetween(nodeId1, nodeId2) {
        for (const connection of this.connections.values()) {
            if ((connection.from === nodeId1 && connection.to === nodeId2) ||
                (connection.from === nodeId2 && connection.to === nodeId1)) {
                return connection;
            }
        }
        return null;
    }

    // Obtener el peso de una conexión para un tipo de accesibilidad específico
    getConnectionWeight(connectionId, accessibilityType) {
        const connection = this.connections.get(connectionId);
        if (!connection) return null;
        
        return connection.weights[accessibilityType] || 1.0;
    }

    // Obtener todas las conexiones de un tipo específico
    getConnectionsByType(connectionType) {
        const connections = [];
        this.connections.forEach(connection => {
            if (connection.type === connectionType) {
                connections.push(connection);
            }
        });
        return connections;
    }

    // Obtener estadísticas de conexiones
    getStatistics() {
        const stats = {
            total: this.connections.size,
            byType: {},
            byAccessibility: {
                wheelchair: 0,
                visual: 0,
                auditory: 0,
                mobility: 0
            }
        };
        
        // Contar por tipo
        this.connections.forEach(connection => {
            stats.byType[connection.type] = (stats.byType[connection.type] || 0) + 1;
            
            // Contar accesibilidad
            if (connection.accessibility.wheelchair) stats.byAccessibility.wheelchair++;
            if (connection.accessibility.visual) stats.byAccessibility.visual++;
            if (connection.accessibility.auditory) stats.byAccessibility.auditory++;
            if (connection.accessibility.mobility) stats.byAccessibility.mobility++;
        });
        
        return stats;
    }

    // Exportar todas las conexiones
    exportConnections() {
        return Array.from(this.connections.values());
    }

    // Limpiar todas las conexiones
    clear() {
        this.connections.clear();
        this.connectionIdCounter = 0;
        console.log('🗑️ Conexiones del campus limpiadas');
    }

    // Obtener la mejor conexión entre dos nodos para un tipo de accesibilidad
    getBestConnection(nodeId1, nodeId2, accessibilityType) {
        const connections = this.getNodeConnections(nodeId1).filter(conn => 
            (conn.from === nodeId1 && conn.to === nodeId2) ||
            (conn.from === nodeId2 && conn.to === nodeId1)
        );
        
        if (connections.length === 0) return null;
        
        // Encontrar la conexión con menor peso para el tipo de accesibilidad
        let bestConnection = connections[0];
        let bestWeight = this.getConnectionWeight(bestConnection.id, accessibilityType);
        
        for (let i = 1; i < connections.length; i++) {
            const weight = this.getConnectionWeight(connections[i].id, accessibilityType);
            if (weight < bestWeight) {
                bestWeight = weight;
                bestConnection = connections[i];
            }
        }
        
        return bestConnection;
    }
}

// Exportar la clase para uso global
window.CampusConnections = CampusConnections;

// Auto-inicialización cuando el DOM esté listo
$(document).ready(function() {
    console.log('🔗 CampusConnections cargado y listo para usar');
});
