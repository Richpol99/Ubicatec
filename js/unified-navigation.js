/**
 * SISTEMA DE NAVEGACIÓN UNIFICADO - UBICATEC
 * 
 * Este archivo integra todos los sistemas de la Fase 2 y conecta
 * con las rutas existentes en mapa.js para crear un sistema de navegación completo.
 * 
 * @author UBICATEC Team
 * @version 1.0
 * @since 2025
 */

class UnifiedNavigationSystem {
    constructor() {
        // Referencias a sistemas
        this.accessibleRouteSystem = null;
        this.map = null;
        this.currentRoute = null;
        this.userLocation = null;
        
        // Rutas disponibles del mapa
        this.availableRoutes = {
            blue: [],
            green: [],
            orange: []
        };

        // Estado del sistema
        this.state = {
            isInitialized: false,
            isNavigating: false,
            currentDestination: null,
            navigationMode: 'search' // 'search', 'navigate', 'guidance'
        };

        console.log('🧭 UnifiedNavigationSystem inicializado');
    }

    /**
     * Inicializa el sistema de navegación unificado
     */
    async init() {
        try {
            console.log('🚀 Inicializando sistema de navegación unificado...');

            // Esperar a que el mapa esté disponible
            await this.waitForMap();
            
            // Conectar con el sistema de rutas accesibles
            this.connectAccessibleRouteSystem();
            
            // Cargar rutas del mapa existente
            this.loadMapRoutes();
            
            // Configurar event listeners
            this.setupEventListeners();
            
            this.state.isInitialized = true;
            console.log('✅ Sistema de navegación unificado inicializado correctamente');
            
        } catch (error) {
            console.error('❌ Error inicializando sistema de navegación:', error);
            throw error;
        }
    }

    /**
     * Espera a que el mapa esté disponible
     */
    async waitForMap() {
        return new Promise((resolve) => {
            const checkMap = () => {
                if (typeof map !== 'undefined' && map) {
                    this.map = map;
                    resolve();
                } else {
                    setTimeout(checkMap, 100);
                }
            };
            checkMap();
        });
    }

    /**
     * Conecta con el sistema de rutas accesibles
     */
    connectAccessibleRouteSystem() {
        if (typeof window.accessibleRouteSystem !== 'undefined') {
            this.accessibleRouteSystem = window.accessibleRouteSystem;
            console.log('🔗 Sistema de rutas accesibles conectado');
        } else {
            console.warn('⚠️ Sistema de rutas accesibles no disponible');
        }
    }

    /**
     * Carga las rutas existentes del mapa
     */
    loadMapRoutes() {
        // Esta función se conectará con las rutas definidas en mapa.js
        // Por ahora, definimos las rutas manualmente basándose en el código existente
        
        // Ruta Azul (5 segmentos)
        this.availableRoutes.blue = [
            {
                name: 'Ruta Azul Principal',
                coords: [
                    [19.068467599492795, -98.17061388514823], // Acceso entrada visitantes
                    [19.0683843, -98.1702980], // Acceso Entrada 36
                    [19.0683612, -98.1700623], // Acceso pasillo 36
                    [19.0683475, -98.1699010], // Acceso Cajon de estacionamiento(Visitantes)
                    [19.0684908, -98.1698233], // inicio de nodo canchas
                    [19.0684141, -98.1692114], // Fin de nodo canchas
                    [19.0685174, -98.1691869], // Inicio ruta 30
                    [19.0684790, -98.1689670]  // Fin ruta 30
                ],
                type: 'accessible',
                color: 'blue'
            }
        ];

        // Ruta Verde (5 segmentos)
        this.availableRoutes.green = [
            {
                name: 'Ruta Verde Principal',
                coords: [
                    [19.070467999988388, -98.16775186055264], // Rampa de acceso al lab del 45
                    [19.07080388748417, -98.16819241335915], // Rampa de acceso al estacionamiento
                    [19.070919229826135, -98.16892197417498], // Rampa de acceso al 45
                    [19.070954086013042, -98.16938800799538], // Estacionamiento exclusivo para personas con discapacidad
                    [19.071092876936074, -98.16938197304088], // Rampa de acceso a edificio de vinculación
                    [19.0711188606115, -98.16963343010836], // Rampa de acceso en dirección hacia edificio de mecánica y logística
                    [19.071187939146842, -98.1696481822939], // Rampa de acceso parte trasera edificio 53
                    [19.071452211800658, -98.16961331358914], // Rampa acceso a edificio idiomas
                    [19.07150761227954, -98.16981708188739],
                    [19.071546904566866, -98.16981238802212] // Rampa de acceso estacionamiento edificio mecánica
                ],
                type: 'accessible',
                color: 'green'
            }
        ];

        // Ruta Naranja (9 segmentos)
        this.availableRoutes.orange = [
            {
                name: 'Ruta Naranja Principal',
                coords: [
                    [19.069804848263956, -98.17041271377924], // Punto inicial
                    [19.069621431292198, -98.17040155232779], // Punto intermedio
                    [19.06954411330357, -98.16980476088763]  // Punto final
                ],
                type: 'standard',
                color: 'orange'
            }
        ];

        console.log(`📊 Rutas cargadas: ${this.availableRoutes.blue.length} azules, ${this.availableRoutes.green.length} verdes, ${this.availableRoutes.orange.length} naranjas`);
    }

    /**
     * Configura los event listeners del sistema
     */
    setupEventListeners() {
        // Event listener para búsqueda de edificios
        $(document).on('input', '#searchInput', (e) => {
            this.handleBuildingSearch(e.target.value);
        });

        // Event listener para clic en edificios
        $(document).on('click', '.marker-building', (e) => {
            this.handleBuildingClick(e);
        });

        // Event listener para el botón de rutas accesibles
        $(document).on('click', '#rutasAccesiblesBtn', (e) => {
            this.handleAccessibleRoutesClick(e);
        });
    }

    /**
     * Maneja la búsqueda de edificios
     * @param {string} query - Término de búsqueda
     */
    handleBuildingSearch(query) {
        if (query.length < 2) return;

        console.log(`🔍 Buscando edificio: ${query}`);
        
        // Aquí se integraría con el sistema de búsqueda existente
        // Por ahora, solo mostramos un mensaje
        this.showSearchResults(query);
    }

    /**
     * Maneja el clic en un edificio
     * @param {Event} event - Evento de clic
     */
    handleBuildingClick(event) {
        const buildingName = event.target.options.title || 'Edificio';
        console.log(`🏢 Edificio seleccionado: ${buildingName}`);
        
        this.selectBuilding(buildingName);
    }

    /**
     * Maneja el clic en el botón de rutas accesibles
     * @param {Event} event - Evento de clic (opcional)
     */
    handleAccessibleRoutesClick(event) {
        if (event) {
            event.preventDefault();
        }
        console.log('♿ Activando sistema de rutas accesibles...');
        
        this.showAccessibleRoutesModal();
    }

    /**
     * Muestra los resultados de búsqueda
     * @param {string} query - Término de búsqueda
     */
    showSearchResults(query) {
        // Esta función se integraría con el sistema de búsqueda existente
        console.log(`📋 Mostrando resultados para: ${query}`);
    }

    /**
     * Selecciona un edificio para navegación
     * @param {string} buildingName - Nombre del edificio
     */
    selectBuilding(buildingName) {
        this.state.currentDestination = buildingName;
        this.state.navigationMode = 'navigate';
        
        console.log(`🎯 Destino seleccionado: ${buildingName}`);
        
        // Mostrar opciones de navegación
        this.showNavigationOptions(buildingName);
    }

    /**
     * Muestra las opciones de navegación
     * @param {string} buildingName - Nombre del edificio
     */
    showNavigationOptions(buildingName) {
        const options = `
            <div class="navigation-options" style="position: fixed; top: 20px; right: 20px; background: white; padding: 20px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); z-index: 1000;">
                <h4>Navegación a: ${buildingName}</h4>
                <div class="accessibility-options">
                    <button class="btn btn-primary btn-sm" onclick="unifiedNav.startNavigation('wheelchair')">
                        ♿ Silla de Ruedas
                    </button>
                    <button class="btn btn-success btn-sm" onclick="unifiedNav.startNavigation('visual')">
                        👁️ Discapacidad Visual
                    </button>
                    <button class="btn btn-info btn-sm" onclick="unifiedNav.startNavigation('auditory')">
                        👂 Discapacidad Auditiva
                    </button>
                    <button class="btn btn-warning btn-sm" onclick="unifiedNav.startNavigation('mobility')">
                        🚶 Discapacidad de Movilidad
                    </button>
                </div>
                <button class="btn btn-secondary btn-sm" onclick="unifiedNav.cancelNavigation()" style="margin-top: 10px;">
                    Cancelar
                </button>
            </div>
        `;
        
        // Remover opciones anteriores si existen
        $('.navigation-options').remove();
        
        // Agregar nuevas opciones
        $('body').append(options);
    }

    /**
     * Inicia la navegación con un tipo de accesibilidad específico
     * @param {string} accessibilityType - Tipo de accesibilidad
     */
    async startNavigation(accessibilityType) {
        try {
            console.log(`🧭 Iniciando navegación (${accessibilityType}) a: ${this.state.currentDestination}`);
            
            this.state.isNavigating = true;
            this.state.navigationMode = 'guidance';
            
            // Obtener ubicación del usuario
            const userLocation = await this.getUserLocation();
            
            if (!userLocation) {
                throw new Error('No se pudo obtener la ubicación del usuario');
            }

            // Calcular ruta usando el sistema de rutas accesibles
            const route = await this.calculateRoute(userLocation, this.state.currentDestination, accessibilityType);
            
            if (route) {
                this.currentRoute = route;
                this.visualizeRoute(route);
                this.startGuidance(route);
            } else {
                throw new Error('No se pudo calcular la ruta');
            }
            
        } catch (error) {
            console.error('❌ Error iniciando navegación:', error);
            alert(`Error: ${error.message}`);
        }
    }

    /**
     * Obtiene la ubicación actual del usuario
     * @returns {Promise<Array>} Coordenadas [lat, lng]
     */
    async getUserLocation() {
        return new Promise((resolve, reject) => {
            if (!navigator.geolocation) {
                reject(new Error('Geolocalización no soportada'));
                return;
            }

            navigator.geolocation.getCurrentPosition(
                (position) => {
                    resolve([position.coords.latitude, position.coords.longitude]);
                },
                (error) => {
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
     * Calcula la ruta entre dos puntos
     * @param {Array} startCoords - Coordenadas de inicio
     * @param {string} destination - Destino
     * @param {string} accessibilityType - Tipo de accesibilidad
     * @returns {Promise<Object>} Ruta calculada
     */
    async calculateRoute(startCoords, destination, accessibilityType) {
        if (!this.accessibleRouteSystem) {
            throw new Error('Sistema de rutas accesibles no disponible');
        }

        // Buscar el edificio de destino
        const destinationBuilding = this.findBuildingByName(destination);
        if (!destinationBuilding) {
            throw new Error('Edificio de destino no encontrado');
        }

        // Buscar el nodo más cercano a la ubicación del usuario
        const nearestNode = this.findNearestNodeToUser(startCoords);
        if (!nearestNode) {
            throw new Error('No se encontró ningún nodo cercano a tu ubicación. Asegúrate de estar cerca de un acceso al campus.');
        }

        console.log(`📍 Nodo más cercano encontrado: ${nearestNode.name} (${Math.round(this.calculateDistance(startCoords, nearestNode.coords))}m)`);

        // Crear objeto de inicio basado en el nodo más cercano
        const startBuilding = {
            nombre: nearestNode.name,
            coords: nearestNode.coords,
            tipo: nearestNode.type,
            id: nearestNode.id
        };

        // Calcular ruta usando el sistema de rutas accesibles
        const route = await this.accessibleRouteSystem.calculateRoute(
            startBuilding,
            destinationBuilding,
            accessibilityType
        );

        return route;
    }

    /**
     * Busca el nodo más cercano a la ubicación del usuario
     * @param {Array} userCoords - Coordenadas del usuario [lat, lng]
     * @returns {Object|null} Nodo más cercano
     */
    findNearestNodeToUser(userCoords) {
        if (!this.accessibleRouteSystem || !this.accessibleRouteSystem.externalSystems.campusNodes) {
            console.warn('⚠️ Sistema de nodos no disponible, usando fallback');
            return this.findNearestNodeFallback(userCoords);
        }

        const campusNodes = this.accessibleRouteSystem.externalSystems.campusNodes;
        const nearestNode = campusNodes.findNearestNode(userCoords);
        
        if (nearestNode) {
            const distance = this.calculateDistance(userCoords, nearestNode.coords);
            console.log(`🔍 Nodo más cercano: ${nearestNode.name} a ${Math.round(distance)}m`);
            
            // Si está muy lejos (más de 200 metros), no usar este nodo
            if (distance > 200) {
                console.warn(`⚠️ Nodo más cercano está muy lejos (${Math.round(distance)}m), buscando alternativas`);
                return this.findNearestAccessPoint(userCoords);
            }
            
            return nearestNode;
        }
        
        return this.findNearestAccessPoint(userCoords);
    }

    /**
     * Busca el punto de acceso más cercano
     * @param {Array} userCoords - Coordenadas del usuario
     * @returns {Object|null} Punto de acceso más cercano
     */
    findNearestAccessPoint(userCoords) {
        if (!this.accessibleRouteSystem || !this.accessibleRouteSystem.externalSystems.campusNodes) {
            return this.findNearestNodeFallback(userCoords);
        }

        const campusNodes = this.accessibleRouteSystem.externalSystems.campusNodes;
        const accessPoints = campusNodes.findNodesByType('access_point');
        
        if (accessPoints.length === 0) {
            return this.findNearestNodeFallback(userCoords);
        }

        let nearest = accessPoints[0];
        let minDistance = this.calculateDistance(userCoords, nearest.coords);

        for (let i = 1; i < accessPoints.length; i++) {
            const distance = this.calculateDistance(userCoords, accessPoints[i].coords);
            if (distance < minDistance) {
                minDistance = distance;
                nearest = accessPoints[i];
            }
        }

        console.log(`🚪 Punto de acceso más cercano: ${nearest.name} a ${Math.round(minDistance)}m`);
        return nearest;
    }

    /**
     * Fallback para encontrar el nodo más cercano cuando el sistema principal no está disponible
     * @param {Array} userCoords - Coordenadas del usuario
     * @returns {Object|null} Nodo más cercano
     */
    findNearestNodeFallback(userCoords) {
        // Lista de puntos de acceso principales del campus
        const accessPoints = [
            { nombre: "Acceso principal (Avenida Tecnologico)", coords: [19.069821422656712, -98.17042957607508] },
            { nombre: "Acceso Visitantes (Avenida Tecnologico, Frente a Sears)", coords: [19.068467599492795, -98.17061388514823] },
            { nombre: "Acceso Estudiantes (Colonia Maravillas)", coords: [19.07051268473509, -98.16772933097631] },
            { nombre: "Acceso Estacionamiento 1 (Avenida Tecnologico)", coords: [19.070712336989462, -98.1703082196594] },
            { nombre: "Acceso Estacionamiento 2 (Colonia Maravillas)", coords: [19.069943796103818, -98.16710196647787] }
        ];

        let nearest = accessPoints[0];
        let minDistance = this.calculateDistance(userCoords, nearest.coords);

        for (let i = 1; i < accessPoints.length; i++) {
            const distance = this.calculateDistance(userCoords, accessPoints[i].coords);
            if (distance < minDistance) {
                minDistance = distance;
                nearest = accessPoints[i];
            }
        }

        console.log(`🔄 Usando fallback - Punto más cercano: ${nearest.nombre} a ${Math.round(minDistance)}m`);
        
        return {
            id: 'fallback_access',
            name: nearest.nombre,
            coords: nearest.coords,
            type: 'access_point'
        };
    }

    /**
     * Calcula la distancia entre dos puntos usando la fórmula de Haversine
     * @param {Array} coords1 - Coordenadas del primer punto [lat, lng]
     * @param {Array} coords2 - Coordenadas del segundo punto [lat, lng]
     * @returns {number} Distancia en metros
     */
    calculateDistance(coords1, coords2) {
        const R = 6371e3; // Radio de la Tierra en metros
        
        const φ1 = coords1[0] * Math.PI / 180;
        const φ2 = coords2[0] * Math.PI / 180;
        const Δφ = (coords2[0] - coords1[0]) * Math.PI / 180;
        const Δλ = (coords2[1] - coords1[1]) * Math.PI / 180;

        const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
                  Math.cos(φ1) * Math.cos(φ2) *
                  Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return R * c;
    }

    /**
     * Busca un edificio por nombre
     * @param {string} name - Nombre del edificio
     * @returns {Object|null} Edificio encontrado
     */
    findBuildingByName(name) {
        console.log(`🔍 Buscando edificio: ${name}`);
        
        // Intentar obtener la lista de edificios del mapa si está disponible
        if (typeof window.edificios !== 'undefined' && Array.isArray(window.edificios)) {
            console.log('✅ Usando lista de edificios del mapa');
            const building = window.edificios.find(edificio => 
                edificio.nombre.toLowerCase().includes(name.toLowerCase())
            );
            
            if (building) {
                console.log('✅ Edificio encontrado en lista del mapa:', building.nombre);
                return {
                    nombre: building.nombre,
                    coords: building.coords,
                    tipo: building.tipo,
                    link: building.link
                };
            }
        }
        
        // Fallback: lista básica de edificios importantes
        console.log('⚠️ Usando lista de fallback');
        const fallbackBuildings = [
            { nombre: "Edificio 1 (direccion)", coords: [19.0700471611661, -98.16987998532049], tipo: "administrativo" },
            { nombre: "Edificio 2 (coordinacion)", coords: [19.070339683584418, -98.16984213200494], tipo: "administrativo" },
            { nombre: "Edificio 3 (Sistemas y Computacion)", coords: [19.07028250570129, -98.1691442328977], tipo: "laboratorio" },
            { nombre: "Edificio 4 (Aulas, WC)", coords: [19.070338275809316, -98.16871239724523], tipo: "aula" },
            { nombre: "Edificio 5 (Aulas)", coords: [19.070279970696365, -98.16838516772772], tipo: "aula" },
            { nombre: "Edificio 15 (Aulas)", coords: [19.069281, -98.168944], tipo: "aula" }
        ];

        const building = fallbackBuildings.find(building => 
            building.nombre.toLowerCase().includes(name.toLowerCase())
        );
        
        if (building) {
            console.log('✅ Edificio encontrado en lista de fallback:', building.nombre);
        } else {
            console.log('❌ Edificio no encontrado:', name);
        }
        
        return building;
    }

    /**
     * Visualiza la ruta en el mapa
     * @param {Object} route - Ruta a visualizar
     */
    visualizeRoute(route) {
        if (!this.map || !route.waypoints) {
            console.error('❌ No se puede visualizar la ruta: mapa o waypoints no disponibles');
            return;
        }

        console.log('🗺️ Visualizando ruta en el mapa...');
        console.log('📍 Waypoints:', route.waypoints.length);
        console.log('🎯 Tipo de accesibilidad:', route.accessibilityType);

        // Limpiar ruta anterior si existe
        if (this.currentRoutePolyline) {
            this.map.removeLayer(this.currentRoutePolyline);
        }
        if (this.currentRouteMarkers) {
            this.currentRouteMarkers.clearLayers();
        }

        // Crear polyline de la ruta
        const routeCoords = route.waypoints.map(waypoint => waypoint.coords);
        
        const routePolyline = L.polyline(routeCoords, {
            color: this.getRouteColor(route.accessibilityType),
            weight: 8,
            opacity: 0.9,
            smoothFactor: 1,
            dashArray: '10, 5' // Línea punteada para mejor visibilidad
        });

        // Agregar al mapa
        routePolyline.addTo(this.map);

        // Ajustar vista del mapa para mostrar toda la ruta
        this.map.fitBounds(routePolyline.getBounds(), { padding: [30, 30] });

        // Crear grupo de marcadores para la ruta
        this.currentRouteMarkers = L.layerGroup();

        // Agregar marcadores de inicio y fin
        if (route.waypoints.length > 0) {
            // Marcador de inicio
            const startIcon = L.divIcon({
                className: 'custom-div-icon',
                html: `<div style="background-color: #28a745; color: white; border-radius: 50%; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; font-weight: bold; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);">S</div>`,
                iconSize: [30, 30],
                iconAnchor: [15, 15]
            });

            const startMarker = L.marker(route.waypoints[0].coords, { icon: startIcon })
                .bindPopup(`
                    <div style="text-align: center;">
                        <h4 style="margin: 0; color: #28a745;">🚀 INICIO</h4>
                        <p style="margin: 5px 0;"><strong>${route.waypoints[0].name}</strong></p>
                        <p style="margin: 0; font-size: 12px; color: #666;">Tu ubicación actual</p>
                    </div>
                `)
                .addTo(this.currentRouteMarkers);

            // Marcador de destino
            const endIcon = L.divIcon({
                className: 'custom-div-icon',
                html: `<div style="background-color: #dc3545; color: white; border-radius: 50%; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; font-weight: bold; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);">F</div>`,
                iconSize: [30, 30],
                iconAnchor: [15, 15]
            });

            const endMarker = L.marker(route.waypoints[route.waypoints.length - 1].coords, { icon: endIcon })
                .bindPopup(`
                    <div style="text-align: center;">
                        <h4 style="margin: 0; color: #dc3545;">🎯 DESTINO</h4>
                        <p style="margin: 5px 0;"><strong>${route.waypoints[route.waypoints.length - 1].name}</strong></p>
                        <p style="margin: 0; font-size: 12px; color: #666;">Tu destino</p>
                    </div>
                `)
                .addTo(this.currentRouteMarkers);

            // Agregar marcadores intermedios si hay más de 2 waypoints
            if (route.waypoints.length > 2) {
                for (let i = 1; i < route.waypoints.length - 1; i++) {
                    const waypoint = route.waypoints[i];
                    const waypointIcon = L.divIcon({
                        className: 'custom-div-icon',
                        html: `<div style="background-color: #007bff; color: white; border-radius: 50%; width: 20px; height: 20px; display: flex; align-items: center; justify-content: center; font-weight: bold; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3); font-size: 12px;">${i}</div>`,
                        iconSize: [20, 20],
                        iconAnchor: [10, 10]
                    });

                    const waypointMarker = L.marker(waypoint.coords, { icon: waypointIcon })
                        .bindPopup(`
                            <div style="text-align: center;">
                                <h5 style="margin: 0; color: #007bff;">📍 Punto ${i}</h5>
                                <p style="margin: 5px 0;"><strong>${waypoint.name}</strong></p>
                                <p style="margin: 0; font-size: 12px; color: #666;">Waypoint intermedio</p>
                            </div>
                        `)
                        .addTo(this.currentRouteMarkers);
                }
            }
        }

        // Agregar marcadores al mapa
        this.currentRouteMarkers.addTo(this.map);

        // Guardar referencia para limpiar después
        this.currentRoutePolyline = routePolyline;

        console.log('✅ Ruta visualizada correctamente');
    }

    /**
     * Obtiene el color de la ruta según el tipo de accesibilidad
     * @param {string} accessibilityType - Tipo de accesibilidad
     * @returns {string} Color de la ruta
     */
    getRouteColor(accessibilityType) {
        const colors = {
            wheelchair: '#0066cc',  // Azul
            visual: '#00cc66',      // Verde
            auditory: '#ff6600',    // Naranja
            mobility: '#cc0066'     // Rosa
        };
        return colors[accessibilityType] || '#666666';
    }

    /**
     * Inicia la guía de navegación
     * @param {Object} route - Ruta calculada
     */
    startGuidance(route) {
        console.log('🧭 Iniciando guía de navegación...');
        
        // Mostrar información de la ruta
        this.showRouteInfo(route);
        
        // Iniciar seguimiento GPS
        this.startGPSTracking(route);
    }

    /**
     * Muestra la información de la ruta
     * @param {Object} route - Ruta calculada
     */
    showRouteInfo(route) {
        const info = `
            <div class="route-info" style="position: fixed; bottom: 20px; left: 20px; background: white; padding: 15px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); z-index: 1000; max-width: 300px;">
                <h5>Información de la Ruta</h5>
                <p><strong>Distancia:</strong> ${Math.round(route.totalDistance || route.distance)} metros</p>
                <p><strong>Tiempo estimado:</strong> ${route.estimatedTime || 0} minutos</p>
                <p><strong>Tipo:</strong> ${route.accessibilityType}</p>
                <p><strong>Waypoints:</strong> ${route.waypoints ? route.waypoints.length : 0}</p>
                <button class="btn btn-danger btn-sm" onclick="unifiedNav.stopNavigation()">
                    Detener Navegación
                </button>
            </div>
        `;
        
        // Remover información anterior si existe
        $('.route-info').remove();
        
        // Agregar nueva información
        $('body').append(info);
    }

    /**
     * Inicia el seguimiento GPS
     * @param {Object} route - Ruta calculada
     */
    startGPSTracking(route) {
        if (!navigator.geolocation) {
            console.warn('Geolocalización no disponible');
            return;
        }

        const watchId = navigator.geolocation.watchPosition(
            (position) => {
                this.updateUserLocation([position.coords.latitude, position.coords.longitude]);
            },
            (error) => {
                console.error('Error en seguimiento GPS:', error);
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0
            }
        );

        this.gpsWatchId = watchId;
    }

    /**
     * Actualiza la ubicación del usuario
     * @param {Array} coords - Coordenadas [lat, lng]
     */
    updateUserLocation(coords) {
        this.userLocation = coords;
        
        // Actualizar marcador del usuario en el mapa
        if (this.userMarker) {
            this.userMarker.setLatLng(coords);
        } else {
            this.userMarker = L.marker(coords, {
                icon: L.icon({
                    iconUrl: 'Icon/user.png',
                    iconSize: [27, 35],
                    iconAnchor: [12, 39]
                })
            }).addTo(this.map);
        }

        // Centrar mapa en la ubicación del usuario
        this.map.panTo(coords);
    }

    /**
     * Muestra el modal de rutas accesibles
     */
    showAccessibleRoutesModal() {
        // Crear overlay de fondo con animación
        const overlay = `
            <div id="accessibilityOverlay" style="
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0, 0, 0, 0.6);
                z-index: 9999;
                display: flex;
                justify-content: center;
                align-items: center;
                animation: fadeIn 0.3s ease-in-out;
            ">
                <div style="
                    background: white;
                    padding: 40px;
                    border-radius: 20px;
                    box-shadow: 0 15px 40px rgba(0, 0, 0, 0.4);
                    max-width: 600px;
                    width: 90%;
                    text-align: center;
                    animation: slideIn 0.3s ease-out;
                ">
                    <div style="margin-bottom: 30px;">
                        <h2 style="color: #333; margin-bottom: 10px; font-size: 28px;">♿ Rutas Accesibles</h2>
                        <p style="color: #666; font-size: 16px; margin-bottom: 20px;">Selecciona el tipo de accesibilidad que necesitas para calcular la ruta más adecuada:</p>
                    </div>
                    
                    <div style="display: grid; gap: 20px; margin-bottom: 30px;">
                        <button class="accessibility-option" onclick="unifiedNav.selectAccessibilityType('wheelchair')" 
                                style="padding: 20px; font-size: 18px; border: none; border-radius: 15px; background: linear-gradient(135deg, #007bff, #0056b3); color: white; cursor: pointer; transition: all 0.3s ease; box-shadow: 0 4px 15px rgba(0, 123, 255, 0.3);">
                            <div style="font-size: 24px; margin-bottom: 8px;">♿</div>
                            <div style="font-weight: bold;">Silla de Ruedas</div>
                            <div style="font-size: 14px; opacity: 0.9;">Rutas con rampas y elevadores</div>
                        </button>
                        
                        <button class="accessibility-option" onclick="unifiedNav.selectAccessibilityType('visual')" 
                                style="padding: 20px; font-size: 18px; border: none; border-radius: 15px; background: linear-gradient(135deg, #28a745, #1e7e34); color: white; cursor: pointer; transition: all 0.3s ease; box-shadow: 0 4px 15px rgba(40, 167, 69, 0.3);">
                            <div style="font-size: 24px; margin-bottom: 8px;">👁️</div>
                            <div style="font-weight: bold;">Discapacidad Visual</div>
                            <div style="font-size: 14px; opacity: 0.9;">Rutas bien iluminadas y con guías</div>
                        </button>
                        
                        <button class="accessibility-option" onclick="unifiedNav.selectAccessibilityType('auditory')" 
                                style="padding: 20px; font-size: 18px; border: none; border-radius: 15px; background: linear-gradient(135deg, #17a2b8, #117a8b); color: white; cursor: pointer; transition: all 0.3s ease; box-shadow: 0 4px 15px rgba(23, 162, 184, 0.3);">
                            <div style="font-size: 24px; margin-bottom: 8px;">👂</div>
                            <div style="font-weight: bold;">Discapacidad Auditiva</div>
                            <div style="font-size: 14px; opacity: 0.9;">Rutas con indicadores visuales</div>
                        </button>
                        
                        <button class="accessibility-option" onclick="unifiedNav.selectAccessibilityType('mobility')" 
                                style="padding: 20px; font-size: 18px; border: none; border-radius: 15px; background: linear-gradient(135deg, #ffc107, #e0a800); color: #212529; cursor: pointer; transition: all 0.3s ease; box-shadow: 0 4px 15px rgba(255, 193, 7, 0.3);">
                            <div style="font-size: 24px; margin-bottom: 8px;">🚶</div>
                            <div style="font-weight: bold;">Discapacidad de Movilidad</div>
                            <div style="font-size: 14px; opacity: 0.9;">Rutas cómodas y accesibles</div>
                        </button>
                    </div>
                    
                    <div style="display: flex; gap: 15px; justify-content: center;">
                        <button class="btn btn-secondary" onclick="unifiedNav.closeAccessibilityModal()" 
                                style="padding: 12px 25px; font-size: 16px; border: none; border-radius: 10px; background: #6c757d; color: white; cursor: pointer; transition: all 0.3s ease;">
                            Cancelar
                        </button>
                        <button class="btn btn-info" onclick="unifiedNav.showAccessibilityInfo()" 
                                style="padding: 12px 25px; font-size: 16px; border: none; border-radius: 10px; background: #17a2b8; color: white; cursor: pointer; transition: all 0.3s ease;">
                            ℹ️ Más Información
                        </button>
                    </div>
                </div>
            </div>
            
            <style>
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                
                @keyframes slideIn {
                    from { transform: translateY(-50px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
                
                .accessibility-option:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2) !important;
                }
            </style>
        `;
        
        // Remover overlay anterior si existe
        $('#accessibilityOverlay').remove();
        
        // Agregar nuevo overlay
        $('body').append(overlay);
        
        console.log('✅ Modal de accesibilidad mejorado mostrado');
    }

    /**
     * Cierra el modal de accesibilidad
     */
    closeAccessibilityModal() {
        $('#accessibilityOverlay').remove();
        console.log('❌ Modal de accesibilidad cerrado');
    }

    /**
     * Muestra información adicional sobre accesibilidad
     */
    showAccessibilityInfo() {
        const infoModal = `
            <div id="accessibilityInfoOverlay" style="
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0, 0, 0, 0.7);
                z-index: 10000;
                display: flex;
                justify-content: center;
                align-items: center;
            ">
                <div style="
                    background: white;
                    padding: 30px;
                    border-radius: 15px;
                    box-shadow: 0 15px 40px rgba(0, 0, 0, 0.4);
                    max-width: 700px;
                    width: 90%;
                    max-height: 80vh;
                    overflow-y: auto;
                ">
                    <h3 style="color: #333; margin-bottom: 20px; text-align: center;">ℹ️ Información sobre Accesibilidad</h3>
                    
                    <div style="text-align: left; line-height: 1.6;">
                        <h4 style="color: #007bff;">♿ Silla de Ruedas</h4>
                        <p>Rutas optimizadas para usuarios en silla de ruedas, priorizando:</p>
                        <ul>
                            <li>Rampas en lugar de escaleras</li>
                            <li>Elevadores cuando estén disponibles</li>
                            <li>Superficies lisas y regulares</li>
                            <li>Ancho mínimo de 90 cm</li>
                        </ul>
                        
                        <h4 style="color: #28a745;">👁️ Discapacidad Visual</h4>
                        <p>Rutas con características visuales mejoradas:</p>
                        <ul>
                            <li>Iluminación adecuada (mínimo 50 lux)</li>
                            <li>Guías táctiles cuando estén disponibles</li>
                            <li>Contraste visual adecuado</li>
                            <li>Evitar áreas muy concurridas</li>
                        </ul>
                        
                        <h4 style="color: #17a2b8;">👂 Discapacidad Auditiva</h4>
                        <p>Rutas con indicadores visuales:</p>
                        <ul>
                            <li>Señales visuales claras</li>
                            <li>Indicadores en elevadores</li>
                            <li>Rutas tranquilas cuando sea posible</li>
                            <li>Evitar áreas muy ruidosas</li>
                        </ul>
                        
                        <h4 style="color: #ffc107;">🚶 Discapacidad de Movilidad</h4>
                        <p>Rutas cómodas para movilidad reducida:</p>
                        <ul>
                            <li>Pendientes suaves (máximo 6%)</li>
                            <li>Superficies antideslizantes</li>
                            <li>Puntos de descanso cada 35 metros</li>
                            <li>Ancho mínimo de 100 cm</li>
                        </ul>
                    </div>
                    
                    <div style="text-align: center; margin-top: 25px;">
                        <button onclick="unifiedNav.closeAccessibilityInfo()" 
                                style="padding: 12px 25px; font-size: 16px; border: none; border-radius: 10px; background: #6c757d; color: white; cursor: pointer;">
                            Cerrar
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        $('#accessibilityInfoOverlay').remove();
        $('body').append(infoModal);
    }

    /**
     * Cierra el modal de información de accesibilidad
     */
    closeAccessibilityInfo() {
        $('#accessibilityInfoOverlay').remove();
    }

    /**
     * Selecciona un tipo de accesibilidad
     * @param {string} accessibilityType - Tipo de accesibilidad
     */
    selectAccessibilityType(accessibilityType) {
        console.log(`♿ Tipo de accesibilidad seleccionado: ${accessibilityType}`);
        
        // Cerrar modal
        this.closeAccessibilityModal();
        
        // Mostrar instrucciones
        this.showAccessibilityInstructions(accessibilityType);
    }

    /**
     * Muestra las instrucciones de accesibilidad
     * @param {string} accessibilityType - Tipo de accesibilidad
     */
    showAccessibilityInstructions(accessibilityType) {
        const instructions = {
            wheelchair: 'Busca un edificio en el mapa y haz clic en él para calcular la ruta más accesible para silla de ruedas.',
            visual: 'Busca un edificio en el mapa y haz clic en él para calcular la ruta con mejor iluminación y guías táctiles.',
            auditory: 'Busca un edificio en el mapa y haz clic en él para calcular la ruta con indicadores visuales.',
            mobility: 'Busca un edificio en el mapa y haz clic en él para calcular la ruta más cómoda para movilidad reducida.'
        };

        alert(`Instrucciones para ${accessibilityType}:\n\n${instructions[accessibilityType]}`);
    }

    /**
     * Cancela la navegación actual
     */
    cancelNavigation() {
        this.state.isNavigating = false;
        this.state.navigationMode = 'search';
        this.state.currentDestination = null;
        
        // Limpiar elementos de la interfaz
        $('.navigation-options').remove();
        $('.route-info').remove();
        
        // Limpiar ruta del mapa
        if (this.currentRoutePolyline) {
            this.map.removeLayer(this.currentRoutePolyline);
            this.currentRoutePolyline = null;
        }
        
        // Detener seguimiento GPS
        if (this.gpsWatchId) {
            navigator.geolocation.clearWatch(this.gpsWatchId);
            this.gpsWatchId = null;
        }
        
        console.log('🚫 Navegación cancelada');
    }

    /**
     * Detiene la navegación actual
     */
    stopNavigation() {
        this.cancelNavigation();
        console.log('🛑 Navegación detenida');
    }

    /**
     * Obtiene estadísticas del sistema
     * @returns {Object} Estadísticas del sistema
     */
    getStatistics() {
        return {
            isInitialized: this.state.isInitialized,
            isNavigating: this.state.isNavigating,
            navigationMode: this.state.navigationMode,
            currentDestination: this.state.currentDestination,
            availableRoutes: {
                blue: this.availableRoutes.blue.length,
                green: this.availableRoutes.green.length,
                orange: this.availableRoutes.orange.length
            },
            accessibleRouteSystemConnected: this.accessibleRouteSystem !== null,
            mapConnected: this.map !== null
        };
    }
}

// Exportar la clase para uso global
window.UnifiedNavigationSystem = UnifiedNavigationSystem;

// Crear instancia global
window.unifiedNav = new UnifiedNavigationSystem();

// Auto-inicialización cuando el DOM esté listo
$(document).ready(function() {
    console.log('🧭 UnifiedNavigationSystem cargado, inicializando...');
    window.unifiedNav.init().catch(error => {
        console.error('❌ Error inicializando sistema de navegación:', error);
    });
});
