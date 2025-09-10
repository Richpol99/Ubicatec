/**
 * SISTEMA DE NODOS DEL CAMPUS - UBICATEC
 * 
 * Este archivo contiene la base de datos de nodos del campus del Tecnológico de Puebla.
 * Incluye edificios, intersecciones, waypoints y puntos de acceso para el sistema de rutas accesibles.
 * 
 * @author UBICATEC Team
 * @version 1.0
 * @since 2025
 */

class CampusNodes {
    /**
     * Constructor de la clase CampusNodes
     */
    constructor() {
        // Tipos de nodos disponibles
        this.nodeTypes = {
            BUILDING: 'building',           // Edificio
            INTERSECTION: 'intersection',   // Intersección de caminos
            WAYPOINT: 'waypoint',          // Punto de paso
            ACCESS_POINT: 'access_point',  // Punto de acceso
            RAMP: 'ramp',                  // Rampa
            ELEVATOR: 'elevator',          // Elevador
            STAIRS: 'stairs'               // Escaleras
        };

        // Almacén de nodos
        this.nodes = new Map();
        
        // Contadores para IDs únicos
        this.idCounters = {
            building: 0,
            intersection: 0,
            waypoint: 0,
            access_point: 0,
            ramp: 0,
            elevator: 0,
            stairs: 0
        };

        // Configuración del campus
        this.campusConfig = {
            center: [19.0698, -98.1688], // Centro del campus
            bounds: {
                north: 19.0720,
                south: 19.0670,
                east: -98.1670,
                west: -98.1710
            },
            gridSize: 0.0001 // Tamaño de la cuadrícula para interpolación
        };

        // Inicializar la base de datos
        this.initializeDatabase();
    }

    /**
     * Inicializa la base de datos con los nodos existentes
     */
    initializeDatabase() {
        console.log('🏗️ Inicializando base de datos de nodos del campus...');
        
        // Cargar edificios existentes
        this.loadExistingBuildings();
        
        // Generar nodos de intersecciones aproximadas
        this.generateIntersectionNodes();
        
        // Generar waypoints básicos
        this.generateBasicWaypoints();
        
        // Generar puntos de acceso
        this.generateAccessPoints();
        
        console.log(`✅ Base de datos inicializada con ${this.nodes.size} nodos`);
    }

    /**
     * Carga los edificios existentes del sistema actual
     */
    loadExistingBuildings() {
        console.log('📚 Cargando edificios existentes...');
        
        // Datos de edificios del sistema actual
        const existingBuildings = [
            { nombre: "Edificio 1 (direccion)", coords: [19.0700471611661, -98.16987998532049], link: "edif_1.html", tipo: "administrativo" },
            { nombre: "Edificio 2 (coordinacion)", coords: [19.070339683584418, -98.16984213200494], link: "edif_2.html", tipo: "administrativo" },
            { nombre: "Edificio 3 (Sistemas y Computacion)", coords: [19.07028250570129, -98.1691442328977], link: "edif_3.html", tipo: "laboratorio" },
            { nombre: "Edificio 4 (Aulas, WC)", coords: [19.070338275809316, -98.16871239724523], link: "edif_4.html", tipo: "aula" },
            { nombre: "Edificio 5 (Aulas)", coords: [19.070279970696365, -98.16838516772772], link: "edif_5.html", tipo: "aula" },
            { nombre: "Edificio 6 (Desarrollo Academico y C.E.S.A)", coords: [19.070056890074806, -98.16867484631699], link: "edif_6.html", tipo: "administrativo" },
            { nombre: "Edificio 7 (Aula de clases)", coords: [19.069965, -98.168309], link: "edif_7.html", tipo: "aula" },
            { nombre: "Edificio 8 (Aulas)", coords: [19.0697161, -98.1687085], link: "edif_8.html", tipo: "aula" },
            { nombre: "Edificio 9 (Aulas y cubiculos para maestros)", coords: [19.0696648, -98.1683283], link: "edif_9.html", tipo: "aula" },
            { nombre: "Edificio 10 (Depto. Ciencias economico administrativas)", coords: [19.069675, -98.168104], link: "edif_10.html", tipo: "administrativo" },
            { nombre: "Edificio 11 (Aulas y portico)", coords: [19.069590, -98.169141], link: "edif_11.html", tipo: "aula" },
            { nombre: "Edificio 12 (Aulas portico, WC)", coords: [19.069453, -98.168654], link: "edif_12.html", tipo: "aula" },
            { nombre: "Edificio 13 (Aulas)", coords: [19.0693308, -98.1681797], link: "edif_13.html", tipo: "aula" },
            { nombre: "Edificio 14 (Aulas, Galileo Galilei)", coords: [19.069386, -98.169351], link: "edif_14.html", tipo: "aula" },
            { nombre: "Edificio 15 (Aulas)", coords: [19.069281, -98.168944], link: "edif_15.html", tipo: "aula" },
            { nombre: "Edificio 16 (Cubiculos para profesores)", coords: [19.069341, -98.170290], link: "edif_16.html", tipo: "administrativo" },
            { nombre: "Edificio 17 (Aulas y sala de titulacion)", coords: [19.069322, -98.169910], link: "edif_17.html", tipo: "aula" },
            { nombre: "Edificio 18 (WC, Portico, Aula Jean Piaget)", coords: [19.069206, -98.169657], link: "edif_18.html", tipo: "aula" },
            { nombre: "Edificio 19 (Laboratorio de Fisica y Quimica)", coords: [19.069084, -98.169326], link: "edif_19.html", tipo: "laboratorio" },
            { nombre: "Edificio 20 (Laboratorio de Ingenieria Electrica)", coords: [19.069205695460248, -98.16860064509656], link: "edif_20.html", tipo: "laboratorio" },
            { nombre: "Edificio 21 (Depto. Economico administrativo. Lab de negocios)", coords: [19.068948, -98.168838], link: "edif_21.html", tipo: "administrativo" },
            { nombre: "Edificio 22 (Aulas)", coords: [19.069201, -98.170032], link: "edif_22.html", tipo: "aula" },
            { nombre: "Edificio 23 (Aulas)", coords: [19.068833, -98.170307], link: "edif_23.html", tipo: "aula" },
            { nombre: "Edificio 24 (Sala T.Alva E. Sala A.Einstein. Sala W.E.Deming)", coords: [19.068907, -98.169477], link: "edif_24.html", tipo: "aula" },
            { nombre: "Edificio 25 (Servicio Medico)", coords: [19.068845419565694, -98.16910953816078], link: "edif_25.html", tipo: "administrativo" },
            { nombre: "Edificio 26 (Aulas)", coords: [19.0688019, -98.1688332], link: "edif_26.html", tipo: "aula" },
            { nombre: "Edificio 27 (Lab. Ing Mecanica)", coords: [19.068793, -98.168558], link: "edif_27.html", tipo: "laboratorio" },
            { nombre: "Edificio 28 (Aulas)", coords: [19.068603, -98.170041], link: "edif_28.html", tipo: "aula" },
            { nombre: "Edificio 29 (Posgrado)", coords: [19.068590, -98.169251], link: "edif_29.html", tipo: "administrativo" },
            { nombre: "Edificio 30 (Manufactura avanzada Lab; y depto. Metal mecanica)", coords: [19.0684055, -98.1689559], link: "edif_30.html", tipo: "laboratorio" },
            { nombre: "Edificio 31 (Coordinacion cultural)", coords: [19.0684058, -98.1685666], link: "edif_31.html", tipo: "administrativo" },
            { nombre: "Edificio 32 (Exsub-Estacion electrica 1)", coords: [19.068168, -98.168593], link: "edif_32.html", tipo: "otro" },
            { nombre: "Edificio 33 (Lab. Desarrollo tecnico e innovacion)", coords: [19.068213, -98.169197], link: "edif_33.html", tipo: "laboratorio" },
            { nombre: "Edificio 34 (Coordinacion cultural)", coords: [19.068175, -98.169059], link: "edif_34.html", tipo: "administrativo" },
            { nombre: "Edificio 35 (Lab. Ing electronica)", coords: [19.068176, -98.168952], link: "edif_35.html", tipo: "laboratorio" },
            { nombre: "Edificio 36 (Centro de computo y lab de sistemas, WC)", coords: [19.068163, -98.170270], link: "edif_36.html", tipo: "laboratorio" },
            { nombre: "Edificio 37 (Sub-Estacion electrica 2)", coords: [19.067984, -98.170599], link: "edif_37.html", tipo: "otro" },
            { nombre: "Edificio 38 (Cuarto de maq. Coordinacion deportiva, WC)", coords: [19.067226, -98.168782], link: "edif_38.html", tipo: "baño" },
            { nombre: "Edificio 39 (Utileria de coordinacion cultural)", coords: [19.067036, -98.168557], link: "edif_39.html", tipo: "otro" },
            { nombre: "Edificio 40 (Laboratorio de posgrado-Proyecto)", coords: [19.067282, -98.170378], link: "edif_40.html", tipo: "laboratorio" },
            { nombre: "Edificio 41 (Centro de lenguas extranjeras-Lab. Logistica)", coords: [19.071208, -98.169903], link: "edif_41.html", tipo: "administrativo" },
            { nombre: "Edificio 42 (Edificio de Sep Federal)", coords: [19.071135, -98.169291], link: "edif_42.html", tipo: "administrativo" },
            { nombre: "Edificio 43 (Recursos materiales y servicios)", coords: [19.0670547, -98.1706309], link: "edif_43.html", tipo: "administrativo" },
            { nombre: "Edificio 44 (Sub-Estacion Electrica 3-Centro de vinculacion)", coords: [19.071905, -98.169451], link: "edif_44.html", tipo: "administrativo" },
            { nombre: "Edificio 45 (Unidad academica departamental-Ing. Industrial)", coords: [19.070917, -98.168811], link: "edif_45.html", tipo: "administrativo" },
            { nombre: "Edificio 46 (Sub-Estacion Electrica de U. A. Departamental)", coords: [19.070816, -98.168218], link: "edif_46.html", tipo: "otro" },
            { nombre: "Edificio 47 (Almacen activo fijo)", coords: [19.067090, -98.168774], link: "edif_47.html", tipo: "otro" },
            { nombre: "Edificio 48 (Almacen de servicios generales)", coords: [19.0670829, -98.1705089], link: "edif_48.html", tipo: "otro" },
            { nombre: "Edificio 49 (Lab. Ing Electronica)", coords: [19.069142, -98.168277], link: "edif_49.html", tipo: "laboratorio" },
            { nombre: "Edificio 50 (Centro de Informacion, WC)", coords: [19.067422488611665, -98.169682206123], link: "edif_50.html", tipo: "administrativo" },
            { nombre: "Edificio 51 (Unidad academica departamental-Ing. Mecanica)", coords: [19.071552, -98.169811], link: "edif_51.html", tipo: "administrativo" },
            { nombre: "Edificio 52 (Sala de titulacion)", coords: [19.069555, -98.169899], link: "edif_52.html", tipo: "administrativo" },
            { nombre: "Edificio 53 (Ciencias basicas, WC)", coords: [19.070834, -98.169673], link: "edif_53.html", tipo: "aula" },
            { nombre: "Acceso principal (Avenida Tecnologico)", coords: [19.069821422656712, -98.17042957607508], tipo: "acceso" },
            { nombre: "Acceso Visitantes (Avenida Tecnologico, Frente a Sears)", coords: [19.068467599492795, -98.17061388514823], tipo: "acceso" },
            { nombre: "Acceso Hangar Autobuses y Estacionamiento 3 (Avenida Tecnologico, a un costado de Benteler)", coords: [19.067184781628676, -98.17086525607026], tipo: "acceso" },
            { nombre: "Acceso Estacionamiento 2 (Colonia Maravillas)", coords: [19.069943796103818, -98.16710196647787], tipo: "acceso" },
            { nombre: "Acceso Estudiantes (Colonia Maravillas)", coords: [19.07051268473509, -98.16772933097631], tipo: "acceso" },
            { nombre: "Acceso Estacionamiento 1 (Avenida Tecnologico)", coords: [19.070712336989462, -98.1703082196594], tipo: "acceso" }
        ];

        // Convertir edificios existentes a nodos
        existingBuildings.forEach(building => {
            const nodeId = this.generateNodeId(this.nodeTypes.BUILDING);
            const node = {
                id: nodeId,
                type: this.nodeTypes.BUILDING,
                name: building.nombre,
                coords: building.coords,
                buildingType: building.tipo,
                link: building.link || null,
                accessibility: this.getDefaultAccessibility(building.tipo),
                metadata: {
                    originalData: building,
                    addedDate: new Date().toISOString()
                }
            };
            
            this.nodes.set(nodeId, node);
        });

        console.log(`✅ ${existingBuildings.length} edificios cargados`);
    }

    /**
     * Genera nodos de intersecciones aproximadas basadas en la distribución de edificios
     */
    generateIntersectionNodes() {
        console.log('🔄 Generando nodos de intersecciones...');
        
        // Obtener coordenadas de todos los edificios
        const buildingCoords = Array.from(this.nodes.values())
            .filter(node => node.type === this.nodeTypes.BUILDING)
            .map(node => node.coords);

        if (buildingCoords.length === 0) {
            console.log('⚠️ No hay edificios para generar intersecciones');
            return;
        }

        // Calcular límites del campus
        const bounds = this.calculateBounds(buildingCoords);
        
        // Generar intersecciones en una cuadrícula
        const intersections = this.generateGridIntersections(bounds);
        
        // Agregar intersecciones como nodos
        intersections.forEach((coords, index) => {
            const nodeId = this.generateNodeId(this.nodeTypes.INTERSECTION);
            const node = {
                id: nodeId,
                type: this.nodeTypes.INTERSECTION,
                name: `Intersección ${index + 1}`,
                coords: coords,
                accessibility: {
                    wheelchair: true,
                    visual: true,
                    auditory: true,
                    mobility: true
                },
                metadata: {
                    generated: true,
                    gridPosition: index,
                    addedDate: new Date().toISOString()
                }
            };
            
            this.nodes.set(nodeId, node);
        });

        console.log(`✅ ${intersections.length} intersecciones generadas`);
    }

    /**
     * Genera waypoints básicos entre edificios
     */
    generateBasicWaypoints() {
        console.log('📍 Generando waypoints básicos...');
        
        const buildings = Array.from(this.nodes.values())
            .filter(node => node.type === this.nodeTypes.BUILDING);
        
        let waypointCount = 0;
        
        // Generar waypoints entre edificios cercanos
        for (let i = 0; i < buildings.length; i++) {
            for (let j = i + 1; j < buildings.length; j++) {
                const building1 = buildings[i];
                const building2 = buildings[j];
                const distance = this.calculateDistance(building1.coords, building2.coords);
                
                // Si los edificios están cerca (menos de 100 metros), crear waypoints intermedios
                if (distance < 100) {
                    const waypoints = this.generateIntermediateWaypoints(building1.coords, building2.coords, 2);
                    
                    waypoints.forEach((coords, index) => {
                        const nodeId = this.generateNodeId(this.nodeTypes.WAYPOINT);
                        const node = {
                            id: nodeId,
                            type: this.nodeTypes.WAYPOINT,
                            name: `Waypoint ${waypointCount + 1}`,
                            coords: coords,
                            accessibility: {
                                wheelchair: true,
                                visual: true,
                                auditory: true,
                                mobility: true
                            },
                            metadata: {
                                generated: true,
                                betweenBuildings: [building1.id, building2.id],
                                addedDate: new Date().toISOString()
                            }
                        };
                        
                        this.nodes.set(nodeId, node);
                        waypointCount++;
                    });
                }
            }
        }

        console.log(`✅ ${waypointCount} waypoints generados`);
    }

    /**
     * Genera puntos de acceso básicos
     */
    generateAccessPoints() {
        console.log('🚪 Generando puntos de acceso...');
        
        // Los accesos ya están incluidos en los edificios, pero los marcamos como puntos de acceso
        const accessBuildings = Array.from(this.nodes.values())
            .filter(node => node.buildingType === 'acceso');
        
        accessBuildings.forEach(building => {
            // Crear un nodo de punto de acceso adicional
            const nodeId = this.generateNodeId(this.nodeTypes.ACCESS_POINT);
            const node = {
                id: nodeId,
                type: this.nodeTypes.ACCESS_POINT,
                name: `Punto de Acceso - ${building.name}`,
                coords: building.coords,
                accessibility: {
                    wheelchair: true,
                    visual: true,
                    auditory: true,
                    mobility: true
                },
                metadata: {
                    relatedBuilding: building.id,
                    addedDate: new Date().toISOString()
                }
            };
            
            this.nodes.set(nodeId, node);
        });

        console.log(`✅ ${accessBuildings.length} puntos de acceso generados`);
    }

    /**
     * Genera un ID único para un nodo
     * @param {string} type - Tipo de nodo
     * @returns {string} ID único
     */
    generateNodeId(type) {
        this.idCounters[type]++;
        return `${type}_${this.idCounters[type].toString().padStart(3, '0')}`;
    }

    /**
     * Obtiene la accesibilidad por defecto según el tipo de edificio
     * @param {string} buildingType - Tipo de edificio
     * @returns {Object} Configuración de accesibilidad
     */
    getDefaultAccessibility(buildingType) {
        const accessibilityMap = {
            'administrativo': { wheelchair: true, visual: true, auditory: true, mobility: true },
            'aula': { wheelchair: true, visual: true, auditory: true, mobility: true },
            'laboratorio': { wheelchair: true, visual: true, auditory: true, mobility: true },
            'baño': { wheelchair: true, visual: true, auditory: true, mobility: true },
            'acceso': { wheelchair: true, visual: true, auditory: true, mobility: true },
            'otro': { wheelchair: false, visual: true, auditory: true, mobility: true }
        };
        
        return accessibilityMap[buildingType] || { wheelchair: true, visual: true, auditory: true, mobility: true };
    }

    /**
     * Calcula los límites de un conjunto de coordenadas
     * @param {Array} coords - Array de coordenadas [lat, lng]
     * @returns {Object} Límites del área
     */
    calculateBounds(coords) {
        const lats = coords.map(coord => coord[0]);
        const lngs = coords.map(coord => coord[1]);
        
        return {
            north: Math.max(...lats),
            south: Math.min(...lats),
            east: Math.max(...lngs),
            west: Math.min(...lngs)
        };
    }

    /**
     * Genera intersecciones en una cuadrícula
     * Como no tenemos las coordenadas exactas de las intersecciones del PDF,
     * creamos una cuadrícula de puntos que simula las intersecciones de caminos
     * basándose en la distribución de los edificios existentes.
     * 
     * @param {Object} bounds - Límites del área (norte, sur, este, oeste)
     * @returns {Array} Array de coordenadas de intersecciones
     */
    generateGridIntersections(bounds) {
        const intersections = [];
        
        // Dividir el área en una cuadrícula de 5x5 (6x6 puntos)
        const latStep = (bounds.north - bounds.south) / 5; // Distancia entre filas
        const lngStep = (bounds.east - bounds.west) / 5;   // Distancia entre columnas
        
        // Crear puntos en la cuadrícula
        for (let i = 0; i <= 5; i++) {
            for (let j = 0; j <= 5; j++) {
                const lat = bounds.south + (latStep * i);
                const lng = bounds.west + (lngStep * j);
                intersections.push([lat, lng]);
            }
        }
        
        return intersections;
    }

    /**
     * Genera waypoints intermedios entre dos puntos
     * Crea puntos de paso entre dos edificios para simular caminos accesibles.
     * Es como dibujar una línea recta entre dos puntos y marcar puntos intermedios.
     * 
     * @param {Array} coords1 - Coordenadas del primer punto [lat, lng]
     * @param {Array} coords2 - Coordenadas del segundo punto [lat, lng]
     * @param {number} count - Número de waypoints a generar
     * @returns {Array} Array de coordenadas de waypoints
     */
    generateIntermediateWaypoints(coords1, coords2, count) {
        const waypoints = [];
        
        // Calcular la distancia que hay que avanzar en cada paso
        const latStep = (coords2[0] - coords1[0]) / (count + 1); // Paso en latitud
        const lngStep = (coords2[1] - coords1[1]) / (count + 1); // Paso en longitud
        
        // Crear los puntos intermedios
        for (let i = 1; i <= count; i++) {
            const lat = coords1[0] + (latStep * i); // Latitud del waypoint
            const lng = coords1[1] + (lngStep * i); // Longitud del waypoint
            waypoints.push([lat, lng]);
        }
        
        return waypoints;
    }

    /**
     * Calcula la distancia entre dos puntos usando la fórmula de Haversine
     * Esta fórmula matemática calcula la distancia real entre dos puntos en la Tierra
     * considerando que es esférica, no plana.
     * 
     * @param {Array} coords1 - Coordenadas del primer punto [lat, lng]
     * @param {Array} coords2 - Coordenadas del segundo punto [lat, lng]
     * @returns {number} Distancia en metros
     */
    calculateDistance(coords1, coords2) {
        const R = 6371e3; // Radio de la Tierra en metros
        
        // Convertir grados a radianes para los cálculos matemáticos
        const φ1 = coords1[0] * Math.PI / 180;
        const φ2 = coords2[0] * Math.PI / 180;
        const Δφ = (coords2[0] - coords1[0]) * Math.PI / 180;
        const Δλ = (coords2[1] - coords1[1]) * Math.PI / 180;

        // Fórmula de Haversine (matemática compleja para esferas)
        const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
                  Math.cos(φ1) * Math.cos(φ2) *
                  Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return R * c; // Distancia final en metros
    }

    /**
     * Busca un nodo por ID
     * @param {string} id - ID del nodo
     * @returns {Object|null} Nodo encontrado o null
     */
    findNodeById(id) {
        return this.nodes.get(id) || null;
    }

    /**
     * Busca nodos por tipo
     * @param {string} type - Tipo de nodo
     * @returns {Array} Array de nodos del tipo especificado
     */
    findNodesByType(type) {
        return Array.from(this.nodes.values()).filter(node => node.type === type);
    }

    /**
     * Busca nodos por nombre (búsqueda parcial)
     * @param {string} name - Nombre a buscar
     * @returns {Array} Array de nodos que coinciden
     */
    findNodesByName(name) {
        const searchTerm = name.toLowerCase();
        return Array.from(this.nodes.values()).filter(node => 
            node.name.toLowerCase().includes(searchTerm)
        );
    }

    /**
     * Busca el nodo más cercano a unas coordenadas
     * @param {Array} coords - Coordenadas de referencia
     * @param {string} type - Tipo de nodo a buscar (opcional)
     * @returns {Object|null} Nodo más cercano
     */
    findNearestNode(coords, type = null) {
        let candidates = Array.from(this.nodes.values());
        
        if (type) {
            candidates = candidates.filter(node => node.type === type);
        }
        
        if (candidates.length === 0) {
            return null;
        }
        
        let nearest = candidates[0];
        let minDistance = this.calculateDistance(coords, nearest.coords);
        
        for (let i = 1; i < candidates.length; i++) {
            const distance = this.calculateDistance(coords, candidates[i].coords);
            if (distance < minDistance) {
                minDistance = distance;
                nearest = candidates[i];
            }
        }
        
        return nearest;
    }

    /**
     * Agrega un nuevo nodo
     * @param {Object} nodeData - Datos del nodo
     * @returns {string} ID del nodo creado
     */
    addNode(nodeData) {
        const nodeId = this.generateNodeId(nodeData.type);
        const node = {
            id: nodeId,
            type: nodeData.type,
            name: nodeData.name,
            coords: nodeData.coords,
            accessibility: nodeData.accessibility || this.getDefaultAccessibility('otro'),
            metadata: {
                ...nodeData.metadata,
                addedDate: new Date().toISOString()
            }
        };
        
        this.nodes.set(nodeId, node);
        console.log(`✅ Nodo agregado: ${node.name} (${nodeId})`);
        
        return nodeId;
    }

    /**
     * Obtiene estadísticas de la base de datos
     * @returns {Object} Estadísticas de nodos
     */
    getStatistics() {
        const stats = {
            total: this.nodes.size,
            byType: {},
            byAccessibility: {
                wheelchair: 0,
                visual: 0,
                auditory: 0,
                mobility: 0
            }
        };
        
        // Contar por tipo
        Array.from(this.nodes.values()).forEach(node => {
            stats.byType[node.type] = (stats.byType[node.type] || 0) + 1;
            
            // Contar accesibilidad
            if (node.accessibility.wheelchair) stats.byAccessibility.wheelchair++;
            if (node.accessibility.visual) stats.byAccessibility.visual++;
            if (node.accessibility.auditory) stats.byAccessibility.auditory++;
            if (node.accessibility.mobility) stats.byAccessibility.mobility++;
        });
        
        return stats;
    }

    /**
     * Exporta todos los nodos
     * @returns {Array} Array con todos los nodos
     */
    exportNodes() {
        return Array.from(this.nodes.values());
    }

    /**
     * Limpia la base de datos
     */
    clear() {
        this.nodes.clear();
        this.idCounters = {
            building: 0,
            intersection: 0,
            waypoint: 0,
            access_point: 0,
            ramp: 0,
            elevator: 0,
            stairs: 0
        };
        console.log('🗑️ Base de datos de nodos limpiada');
    }
}

// Exportar la clase para uso global
window.CampusNodes = CampusNodes;

// Auto-inicialización cuando el DOM esté listo
$(document).ready(function() {
    console.log('🏗️ CampusNodes cargado y listo para usar');
});
