/**
 * GRAFO ESTÁTICO DEL CAMPUS - UBICATEC
 * 
 * Este archivo define el grafo completo del campus de manera estática,
 * con todos los nodos y conexiones predefinidas para máxima eficiencia.
 * 
 * @author UBICATEC Team
 * @version 2.0
 * @since 2025
 */

class CampusGraph {
    constructor() {
        console.log('🏛️ Inicializando grafo estático del campus...');
        
        // Inicializar estructuras de datos
        this.nodes = new Map();
        this.connections = new Map();
        
        // Construir el grafo completo
        this.buildCompleteGraph();
        
        console.log(`✅ Grafo estático inicializado: ${this.nodes.size} nodos, ${this.getTotalConnections()} conexiones`);
    }

    /**
     * Construye el grafo completo con todos los nodos y conexiones
     */
    buildCompleteGraph() {
        // 1. Agregar todos los edificios
        this.addAllBuildings();
        
        // 2. Agregar todos los puntos de ruta
        this.addAllRoutePoints();
        
        // 3. Agregar todos los accesos
        this.addAllAccessPoints();
        
        // 4. Crear todas las conexiones
        this.createAllConnections();
    }

    /**
     * Agrega todos los edificios del campus
     */
    addAllBuildings() {
        const buildings = [
            // EDIFICIOS PRINCIPALES
            { id: 'edif_1', name: 'Edificio 1 (Dirección)', coords: [19.0700471611661, -98.16987998532049], type: 'building' },
            { id: 'edif_2', name: 'Edificio 2 (Coordinación)', coords: [19.070339683584418, -98.16984213200494], type: 'building' },
            { id: 'edif_3', name: 'Edificio 3 (Sistemas y Computación)', coords: [19.07028250570129, -98.1691442328977], type: 'building' },
            { id: 'edif_19', name: 'Edificio 19 (Laboratorio de Física y Química)', coords: [19.069084, -98.169326], type: 'building' },
            { id: 'edif_20', name: 'Edificio 20 (Laboratorio de Ingeniería Eléctrica)', coords: [19.069205695460248, -98.16860064509656], type: 'building' },
            { id: 'edif_25', name: 'Edificio 25 (Servicio Médico)', coords: [19.068845419565694, -98.16910953816078], type: 'building' },
            { id: 'edif_27', name: 'Edificio 27 (Lab. Ing Mecánica)', coords: [19.068793, -98.168558], type: 'building' },
            { id: 'edif_30', name: 'Edificio 30 (Manufactura avanzada Lab)', coords: [19.0684055, -98.1689559], type: 'building' },
            { id: 'edif_36', name: 'Edificio 36 (Centro de cómputo y lab de sistemas)', coords: [19.068163, -98.170270], type: 'building' },
            { id: 'edif_41', name: 'Edificio 41 (Centro de lenguas extranjeras)', coords: [19.071208, -98.169903], type: 'building' },
            { id: 'edif_45', name: 'Edificio 45 (Unidad académica departamental)', coords: [19.070917, -98.168811], type: 'building' },
            { id: 'edif_49', name: 'Edificio 49 (Lab. Ing Electrónica)', coords: [19.069142, -98.168277], type: 'building' },
            { id: 'edif_50', name: 'Edificio 50 (Centro de Información)', coords: [19.067422488611665, -98.169682206123], type: 'building' },
            { id: 'edif_51', name: 'Edificio 51 (Unidad académica departamental)', coords: [19.071552, -98.169811], type: 'building' },
            { id: 'edif_52', name: 'Edificio 52 (Sala de titulación)', coords: [19.069555, -98.169899], type: 'building' },
            { id: 'edif_53', name: 'Edificio 53 (Ciencias básicas)', coords: [19.070834, -98.169673], type: 'building' }
        ];

        buildings.forEach(building => {
            this.addNode(building.id, building.name, building.coords, building.type);
        });

        console.log(`🏢 ${buildings.length} edificios agregados`);
    }

    /**
     * Agrega todos los puntos de ruta
     */
    addAllRoutePoints() {
        // RUTA VERDE - Puntos principales
        const verdePoints = [
            { id: 'verde_1', name: 'Ruta Verde 1', coords: [19.070467999988388, -98.16775186055264] },
            { id: 'verde_2', name: 'Ruta Verde 2', coords: [19.07080388748417, -98.16819241335915] },
            { id: 'verde_3', name: 'Ruta Verde 3', coords: [19.070917, -98.168811] },
            { id: 'verde_4', name: 'Ruta Verde 4', coords: [19.070954086013042, -98.16938800799538] },
            { id: 'verde_5', name: 'Ruta Verde 5', coords: [19.071092876936074, -98.16938197304088] },
            { id: 'verde_6', name: 'Ruta Verde 6', coords: [19.0711188606115, -98.16963343010836] },
            { id: 'verde_7', name: 'Ruta Verde 7', coords: [19.071187939146842, -98.1696481822939] },
            { id: 'verde_8', name: 'Ruta Verde 8', coords: [19.071452211800658, -98.16961331358914] },
            { id: 'verde_9', name: 'Ruta Verde 9', coords: [19.07150761227954, -98.16981708188739] },
            { id: 'verde_10', name: 'Ruta Verde 10', coords: [19.071552, -98.169811] },
            { id: 'verde_11', name: 'Ruta Verde 11', coords: [19.07081751014322, -98.16939838656272] },
            { id: 'verde_12', name: 'Ruta Verde 12', coords: [19.07079279391931, -98.16941582091938] },
            { id: 'verde_13', name: 'Ruta Verde 13', coords: [19.070806589761048, -98.169548184706] },
            { id: 'verde_14', name: 'Ruta Verde 14', coords: [19.070811172650252, -98.16963777369097] },
            { id: 'verde_15', name: 'Ruta Verde 15', coords: [19.070834, -98.169673] },
            { id: 'verde_16', name: 'Ruta Verde 16', coords: [19.071208, -98.169903] },
            { id: 'verde_17', name: 'Ruta Verde 17', coords: [19.070762805083532, -98.1695532147195] },
            { id: 'verde_18', name: 'Ruta Verde 18', coords: [19.070811202962297, -98.16998753799062] },
            { id: 'verde_19', name: 'Ruta Verde 19', coords: [19.070718888479348, -98.16999986594247] },
            { id: 'verde_20', name: 'Ruta Verde 20', coords: [19.07073053982469, -98.1701329062525] },
            { id: 'verde_21', name: 'Ruta Verde 21', coords: [19.07045696117779, -98.16959931061868] },
            { id: 'verde_22', name: 'Ruta Verde 22', coords: [19.070413866126465, -98.16913998236355] },
            { id: 'verde_23', name: 'Ruta Verde 23', coords: [19.07039041734366, -98.16914601732076] },
            { id: 'verde_24', name: 'Ruta Verde 24', coords: [19.07028250570129, -98.1691442328977] }
        ];

        // RUTA NARANJA - Puntos principales
        const naranjaPoints = [
            { id: 'naranja_1', name: 'Ruta Naranja 1', coords: [19.069804848263956, -98.17041271377924] },
            { id: 'naranja_2', name: 'Ruta Naranja 2', coords: [19.069621431292198, -98.17040155232779] },
            { id: 'naranja_3', name: 'Ruta Naranja 3', coords: [19.06954411330357, -98.169699301171] },
            { id: 'naranja_4', name: 'Ruta Naranja 4', coords: [19.069927624157344, -98.1703294409239] },
            { id: 'naranja_5', name: 'Ruta Naranja 5', coords: [19.069897837778097, -98.17011084090497] },
            { id: 'naranja_6', name: 'Ruta Naranja 6', coords: [19.070192532570985, -98.17007127832228] },
            { id: 'naranja_7', name: 'Ruta Naranja 7', coords: [19.070259176578254, -98.17018421030318] },
            { id: 'naranja_8', name: 'Ruta Naranja 8', coords: [19.07051431443449, -98.17014230172214] },
            { id: 'naranja_9', name: 'Ruta Naranja 9', coords: [19.07060430697445, -98.17017381767646] },
            { id: 'naranja_10', name: 'Ruta Naranja 10', coords: [19.07061685675977, -98.1702820816372] },
            { id: 'naranja_11', name: 'Ruta Naranja 11', coords: [19.070182596818434, -98.16984098206038] },
            { id: 'naranja_12', name: 'Ruta Naranja 12', coords: [19.070159827858692, -98.16965699301171] },
            { id: 'naranja_13', name: 'Ruta Naranja 13', coords: [19.070339683584418, -98.16984213200494] },
            { id: 'naranja_14', name: 'Ruta Naranja 14', coords: [19.0700471611661, -98.16987998532049] },
            { id: 'naranja_15', name: 'Ruta Naranja 15', coords: [19.069276620209916, -98.1697020963557] },
            { id: 'naranja_16', name: 'Ruta Naranja 16', coords: [19.069187280232338, -98.1697393033749] },
            { id: 'naranja_17', name: 'Ruta Naranja 17', coords: [19.06883313589799, -98.1699629309711] },
            { id: 'naranja_18', name: 'Ruta Naranja 18', coords: [19.068709930910195, -98.1699847419628] },
            { id: 'naranja_19', name: 'Ruta Naranja 19', coords: [19.069155186281783, -98.16946992268306] },
            { id: 'naranja_20', name: 'Ruta Naranja 20', coords: [19.06907279802546, -98.16947394598972] },
            { id: 'naranja_21', name: 'Ruta Naranja 21', coords: [19.069053151589696, -98.16934050610591] },
            { id: 'naranja_22', name: 'Ruta Naranja 22', coords: [19.069084, -98.169326] },
            { id: 'naranja_23', name: 'Ruta Naranja 23', coords: [19.068963346800043, -98.16949092670183] },
            { id: 'naranja_24', name: 'Ruta Naranja 24', coords: [19.068940531567176, -98.16941381317659] },
            { id: 'naranja_25', name: 'Ruta Naranja 25', coords: [19.06881314646958, -98.16942521256362] },
            { id: 'naranja_26', name: 'Ruta Naranja 26', coords: [19.06880047133015, -98.16917710825706] },
            { id: 'naranja_27', name: 'Ruta Naranja 27', coords: [19.0685174, -98.1691869] },
            { id: 'naranja_28', name: 'Ruta Naranja 28', coords: [19.0689629787397, -98.16914431034333] },
            { id: 'naranja_29', name: 'Ruta Naranja 29', coords: [19.068953386117077, -98.16897627859588] },
            { id: 'naranja_30', name: 'Ruta Naranja 30', coords: [19.068825367272474, -98.16898566632639] },
            { id: 'naranja_31', name: 'Ruta Naranja 31', coords: [19.068793679424385, -98.1687050881701] },
            { id: 'naranja_32', name: 'Ruta Naranja 32', coords: [19.068793, -98.168558] },
            { id: 'naranja_33', name: 'Ruta Naranja 33', coords: [19.069272112524505, -98.16864071515533] },
            { id: 'naranja_34', name: 'Ruta Naranja 34', coords: [19.06924295978286, -98.16833896666323] },
            { id: 'naranja_35', name: 'Ruta Naranja 35', coords: [19.069104801068896, -98.16835170715466] },
            { id: 'naranja_36', name: 'Ruta Naranja 36', coords: [19.069142, -98.168277] },
            { id: 'naranja_37', name: 'Ruta Naranja 37', coords: [19.069142510837185, -98.16839168822943] },
            { id: 'naranja_38', name: 'Ruta Naranja 38', coords: [19.068845419565694, -98.16910953816078] },
            { id: 'naranja_39', name: 'Ruta Naranja 39', coords: [19.06927554283283, -98.16995516119464] },
            { id: 'naranja_40', name: 'Ruta Naranja 40', coords: [19.069322, -98.169955] }
        ];

        // RUTA AZUL - Puntos principales
        const azulPoints = [
            { id: 'azul_1', name: 'Ruta Azul 1', coords: [19.068467599492795, -98.17061388514823] },
            { id: 'azul_2', name: 'Ruta Azul 2', coords: [19.0683843, -98.1702980] },
            { id: 'azul_3', name: 'Ruta Azul 3', coords: [19.0683612, -98.1700623] },
            { id: 'azul_4', name: 'Ruta Azul 4', coords: [19.0683475, -98.1699010] },
            { id: 'azul_5', name: 'Ruta Azul 5', coords: [19.0684908, -98.1698233] },
            { id: 'azul_6', name: 'Ruta Azul 6', coords: [19.0684141, -98.1692114] },
            { id: 'azul_7', name: 'Ruta Azul 7', coords: [19.0685174, -98.1691869] },
            { id: 'azul_8', name: 'Ruta Azul 8', coords: [19.0684790, -98.1689670] },
            { id: 'azul_9', name: 'Ruta Azul 9', coords: [19.068163, -98.170270] },
            { id: 'azul_10', name: 'Ruta Azul 10', coords: [19.06766279821493, -98.17013187271783] },
            { id: 'azul_11', name: 'Ruta Azul 11', coords: [19.067589895228735, -98.1696891] },
            { id: 'azul_12', name: 'Ruta Azul 12', coords: [19.067589895228735, -98.16930687345818] },
            { id: 'azul_13', name: 'Ruta Azul 13', coords: [19.0671937, -98.1693723] },
            { id: 'azul_14', name: 'Ruta Azul 14', coords: [19.0671990, -98.1691631] },
            { id: 'azul_15', name: 'Ruta Azul 15', coords: [19.0670036, -98.1691540] },
            { id: 'azul_16', name: 'Ruta Azul 16', coords: [19.066967924289344, -98.16869954966634] },
            { id: 'azul_17', name: 'Ruta Azul 17', coords: [19.06634923333955, -98.16864781128356] },
            { id: 'azul_18', name: 'Ruta Azul 18', coords: [19.067422488611665, -98.169682206123] },
            { id: 'azul_19', name: 'Ruta Azul 19', coords: [19.067184781628676, -98.17086525607026] }
        ];

        // Agregar todos los puntos de ruta con metadata
        verdePoints.forEach((point, index) => {
            this.addNode(point.id, point.name, point.coords, 'route', { route: 'verde', index: index + 1 });
        });
        
        naranjaPoints.forEach((point, index) => {
            this.addNode(point.id, point.name, point.coords, 'route', { route: 'naranja', index: index + 1 });
        });
        
        azulPoints.forEach((point, index) => {
            this.addNode(point.id, point.name, point.coords, 'route', { route: 'azul', index: index + 1 });
        });

        console.log(`🛣️ Puntos de ruta agregados: Verde(${verdePoints.length}), Naranja(${naranjaPoints.length}), Azul(${azulPoints.length})`);
    }

    /**
     * Agrega todos los puntos de acceso
     */
    addAllAccessPoints() {
        const accessPoints = [
            { id: 'acceso_principal', name: 'Acceso principal (Avenida Tecnológico)', coords: [19.069821422656712, -98.17042957607508] },
            { id: 'acceso_visitantes', name: 'Acceso Visitantes (Frente a Sears)', coords: [19.068467599492795, -98.17061388514823] },
            { id: 'acceso_hangar_autobuses', name: 'Acceso Hangar Autobuses y Estacionamiento 3', coords: [19.067184781628676, -98.17086525607026] },
            { id: 'acceso_estacionamiento_2', name: 'Acceso Estacionamiento 2 (Colonia Maravillas)', coords: [19.069943796103818, -98.16710196647787] },
            { id: 'acceso_estudiantes', name: 'Acceso Estudiantes (Colonia Maravillas)', coords: [19.07051268473509, -98.16772933097631] },
            { id: 'acceso_estacionamiento_1', name: 'Acceso Estacionamiento 1 (Avenida Tecnológico)', coords: [19.070712336989462, -98.1703082196594] }
        ];

        accessPoints.forEach(access => {
            this.addNode(access.id, access.name, access.coords, 'access');
        });

        console.log(`🚪 ${accessPoints.length} accesos agregados`);
    }

    /**
     * Crea todas las conexiones del grafo
     */
    createAllConnections() {
        console.log('🔗 Creando todas las conexiones del grafo...');
        
        // 1. Conexiones secuenciales de rutas
        this.createSequentialConnections();
        
        // 2. Conexiones de edificios a rutas
        this.createBuildingConnections();
        
        // 3. Conexiones de accesos a rutas
        this.createAccessConnections();
        
        // 4. Intersecciones entre rutas
        this.createIntersections();
        
        console.log(`✅ ${this.getTotalConnections()} conexiones creadas`);
    }

    /**
     * Crea conexiones secuenciales dentro de cada ruta
     */
    createSequentialConnections() {
        // RUTA VERDE - Conexiones secuenciales
        for (let i = 1; i <= 24; i++) {
            const from = `verde_${i}`;
            const to = `verde_${i + 1}`;
            if (this.nodes.has(from) && this.nodes.has(to)) {
                const distance = this.calculateDistance(
                    this.nodes.get(from).coords,
                    this.nodes.get(to).coords
                );
                this.addConnection(from, to, distance, 'sequential', 'verde');
            }
        }

        // RUTA NARANJA - Conexiones secuenciales
        for (let i = 1; i <= 40; i++) {
            const from = `naranja_${i}`;
            const to = `naranja_${i + 1}`;
            if (this.nodes.has(from) && this.nodes.has(to)) {
                const distance = this.calculateDistance(
                    this.nodes.get(from).coords,
                    this.nodes.get(to).coords
                );
                this.addConnection(from, to, distance, 'sequential', 'naranja');
            }
        }

        // RUTA AZUL - Conexiones secuenciales
        for (let i = 1; i <= 19; i++) {
            const from = `azul_${i}`;
            const to = `azul_${i + 1}`;
            if (this.nodes.has(from) && this.nodes.has(to)) {
                const distance = this.calculateDistance(
                    this.nodes.get(from).coords,
                    this.nodes.get(to).coords
                );
                this.addConnection(from, to, distance, 'sequential', 'azul');
            }
        }

        console.log('🔗 Conexiones secuenciales creadas');
    }

    /**
     * Crea conexiones de edificios a rutas más cercanas
     */
    createBuildingConnections() {
        const buildingConnections = [
            // Edificio 1 - Conectar a ruta naranja
            { building: 'edif_1', route: 'naranja_14', distance: 0 },
            
            // Edificio 2 - Conectar a ruta naranja
            { building: 'edif_2', route: 'naranja_13', distance: 0 },
            
            // Edificio 3 - Conectar a ruta verde
            { building: 'edif_3', route: 'verde_24', distance: 0 },
            
            // Edificio 19 - Conectar a ruta naranja
            { building: 'edif_19', route: 'naranja_22', distance: 0 },
            
            // Edificio 20 - Conectar a ruta naranja
            { building: 'edif_20', route: 'naranja_37', distance: 0 },
            
            // Edificio 25 - Conectar a ruta naranja
            { building: 'edif_25', route: 'naranja_38', distance: 0 },
            
            // Edificio 27 - Conectar a ruta naranja
            { building: 'edif_27', route: 'naranja_32', distance: 0 },
            
            // Edificio 30 - Conectar a ruta azul
            { building: 'edif_30', route: 'azul_8', distance: 0 },
            
            // Edificio 36 - Conectar a ruta azul
            { building: 'edif_36', route: 'azul_9', distance: 0 },
            
            // Edificio 41 - Conectar a ruta verde
            { building: 'edif_41', route: 'verde_16', distance: 0 },
            
            // Edificio 45 - Conectar a ruta verde
            { building: 'edif_45', route: 'verde_3', distance: 0 },
            
            // Edificio 49 - Conectar a ruta naranja
            { building: 'edif_49', route: 'naranja_36', distance: 0 },
            
            // Edificio 50 - Conectar a ruta azul
            { building: 'edif_50', route: 'azul_18', distance: 0 },
            
            // Edificio 51 - Conectar a ruta verde
            { building: 'edif_51', route: 'verde_10', distance: 0 },
            
            // Edificio 52 - Conectar a ruta naranja
            { building: 'edif_52', route: 'naranja_40', distance: 0 },
            
            // Edificio 53 - Conectar a ruta verde
            { building: 'edif_53', route: 'verde_15', distance: 0 }
        ];

        buildingConnections.forEach(conn => {
            if (this.nodes.has(conn.building) && this.nodes.has(conn.route)) {
                const distance = conn.distance || this.calculateDistance(
                    this.nodes.get(conn.building).coords,
                    this.nodes.get(conn.route).coords
                );
                
                // Conexión bidireccional
                this.addConnection(conn.building, conn.route, distance, 'building_access', 'building-route');
                this.addConnection(conn.route, conn.building, distance, 'building_access', 'route-building');
            }
        });

        console.log('🏢 Conexiones de edificios creadas');
    }

    /**
     * Crea conexiones de accesos a rutas más cercanas
     */
    createAccessConnections() {
        const accessConnections = [
            // Acceso principal - Conectar a ruta naranja
            { access: 'acceso_principal', route: 'naranja_1', distance: 0 },
            
            // Acceso visitantes - Conectar a ruta azul
            { access: 'acceso_visitantes', route: 'azul_1', distance: 0 },
            
            // Acceso hangar autobuses - Conectar a ruta azul
            { access: 'acceso_hangar_autobuses', route: 'azul_19', distance: 0 },
            
            // Acceso estacionamiento 2 - Conectar a ruta verde
            { access: 'acceso_estacionamiento_2', route: 'verde_1', distance: 0 },
            
            // Acceso estudiantes - Conectar a ruta verde
            { access: 'acceso_estudiantes', route: 'verde_1', distance: 0 },
            
            // Acceso estacionamiento 1 - Conectar a ruta naranja
            { access: 'acceso_estacionamiento_1', route: 'naranja_10', distance: 0 }
        ];

        accessConnections.forEach(conn => {
            if (this.nodes.has(conn.access) && this.nodes.has(conn.route)) {
                const distance = conn.distance || this.calculateDistance(
                    this.nodes.get(conn.access).coords,
                    this.nodes.get(conn.route).coords
                );
                
                // Conexión bidireccional
                this.addConnection(conn.access, conn.route, distance, 'access_connection', 'access-route');
                this.addConnection(conn.route, conn.access, distance, 'access_connection', 'route-access');
            }
        });

        console.log('🚪 Conexiones de accesos creadas');
    }

    /**
     * Crea intersecciones entre rutas
     */
    createIntersections() {
        const intersections = [
            // Intersección Verde-Naranja
            { from: 'verde_21', to: 'naranja_15', distance: 8.5 },
            
            // Intersección Naranja-Azul
            { from: 'naranja_27', to: 'azul_7', distance: 0 },
            
            // Intersección Verde-Azul (a través de naranja)
            { from: 'verde_21', to: 'naranja_15', distance: 8.5 },
            { from: 'naranja_15', to: 'naranja_27', distance: 0 },
            { from: 'naranja_27', to: 'azul_7', distance: 0 }
        ];

        intersections.forEach(intersection => {
            if (this.nodes.has(intersection.from) && this.nodes.has(intersection.to)) {
                const distance = intersection.distance || this.calculateDistance(
                    this.nodes.get(intersection.from).coords,
                    this.nodes.get(intersection.to).coords
                );
                
                // Conexión bidireccional
                this.addConnection(intersection.from, intersection.to, distance, 'intersection', 'route-intersection');
                this.addConnection(intersection.to, intersection.from, distance, 'intersection', 'route-intersection');
            }
        });

        console.log('🔀 Intersecciones creadas');
    }

    /**
     * Agrega un nodo al grafo
     */
    addNode(id, name, coords, type, metadata = {}) {
        this.nodes.set(id, {
            id,
            name,
            coords,
            type,
            metadata,
            accessibility: {
                wheelchair: true,
                visual: true,
                auditory: true,
                mobility: true
            }
        });
    }

    /**
     * Agrega una conexión al grafo
     */
    addConnection(fromId, toId, distance, connectionType, routeName) {
        if (!this.connections.has(fromId)) {
            this.connections.set(fromId, []);
        }
        
        const connection = {
            to: toId,
            distance: distance,
            type: connectionType,
            route: routeName,
            weights: {
                wheelchair: this.calculateWeight(distance, connectionType, 'wheelchair'),
                visual: this.calculateWeight(distance, connectionType, 'visual'),
                auditory: this.calculateWeight(distance, connectionType, 'auditory'),
                mobility: this.calculateWeight(distance, connectionType, 'mobility')
            }
        };
        
        this.connections.get(fromId).push(connection);
    }

    /**
     * Calcula el peso de una conexión para un tipo de accesibilidad
     */
    calculateWeight(distance, connectionType, accessibilityType) {
        const baseWeights = {
            wheelchair: { sequential: 1.0, intersection: 0.8, building_access: 1.2, access_connection: 1.0 },
            visual: { sequential: 1.0, intersection: 1.2, building_access: 1.1, access_connection: 1.0 },
            auditory: { sequential: 1.0, intersection: 1.1, building_access: 1.0, access_connection: 1.0 },
            mobility: { sequential: 1.0, intersection: 1.0, building_access: 1.1, access_connection: 1.0 }
        };
        
        const baseWeight = baseWeights[accessibilityType]?.[connectionType] || 1.0;
        return distance * baseWeight;
    }

    /**
     * Calcula la distancia entre dos coordenadas
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
     * Obtiene las conexiones desde un nodo
     */
    getConnectionsFrom(nodeId) {
        return this.connections.get(nodeId) || [];
    }

    /**
     * Obtiene un nodo por ID
     */
    getNode(nodeId) {
        return this.nodes.get(nodeId);
    }

    /**
     * Obtiene todos los nodos
     */
    getAllNodes() {
        return Array.from(this.nodes.values());
    }

    /**
     * Obtiene el total de conexiones
     */
    getTotalConnections() {
        let total = 0;
        this.connections.forEach(connections => {
            total += connections.length;
        });
        return total;
    }

    /**
     * Encuentra el nodo más cercano a unas coordenadas
     */
    findNearestNode(coords, maxDistance = 200) {
        let nearestNode = null;
        let minDistance = Infinity;

        this.nodes.forEach(node => {
            const distance = this.calculateDistance(coords, node.coords);
            if (distance < minDistance && distance <= maxDistance) {
                minDistance = distance;
                nearestNode = node;
            }
        });

        return nearestNode;
    }

    /**
     * Obtiene estadísticas del grafo
     */
    getStatistics() {
        const stats = {
            totalNodes: this.nodes.size,
            totalConnections: this.getTotalConnections(),
            nodesByType: {},
            connectionsByType: {}
        };

        // Contar nodos por tipo
        this.nodes.forEach(node => {
            stats.nodesByType[node.type] = (stats.nodesByType[node.type] || 0) + 1;
        });

        // Contar conexiones por tipo
        this.connections.forEach(connections => {
            connections.forEach(conn => {
                stats.connectionsByType[conn.type] = (stats.connectionsByType[conn.type] || 0) + 1;
            });
        });

        return stats;
    }
}

// Exportar para uso global
window.CampusGraph = CampusGraph;
