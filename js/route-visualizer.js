/**
 * VISUALIZADOR DE RUTAS - UBICATEC
 * 
 * Este archivo maneja específicamente la visualización de rutas en el mapa,
 * separando la lógica de visualización del sistema de navegación principal.
 * 
 * @author UBICATEC Team
 * @version 1.0
 * @since 2025
 */

class RouteVisualizer {
    constructor(map) {
        this.map = map;
        this.currentRoute = null;
        this.routeLayers = {
            polyline: null,
            markers: null,
            waypoints: null
        };
        
        // Configuración de colores por tipo de accesibilidad
        this.accessibilityColors = {
            wheelchair: '#0066cc',  // Azul
            visual: '#00cc66',      // Verde
            auditory: '#ff6600',    // Naranja
            mobility: '#cc0066'     // Rosa
        };
        
        console.log('🎨 RouteVisualizer inicializado');
    }

    /**
     * Visualiza una ruta completa en el mapa
     * @param {Object} route - Objeto de ruta con waypoints y metadatos
     */
    visualizeRoute(route) {
        if (!this.map || !route.waypoints) {
            console.error('❌ No se puede visualizar la ruta: mapa o waypoints no disponibles');
            return;
        }

        console.log('🎨 Visualizando ruta con RouteVisualizer...');
        
        // Limpiar ruta anterior
        this.clearCurrentRoute();
        
        // Guardar ruta actual
        this.currentRoute = route;
        
        // Crear capas de la ruta
        this.createRoutePolyline(route);
        this.createRouteMarkers(route);
        this.createWaypointMarkers(route);
        
        // Ajustar vista del mapa
        this.fitMapToRoute();
        
        console.log('✅ Ruta visualizada correctamente');
    }

    /**
     * Crea la polyline principal de la ruta
     * @param {Object} route - Objeto de ruta
     */
    createRoutePolyline(route) {
        const routeCoords = route.waypoints.map(waypoint => waypoint.coords);
        const color = this.getRouteColor(route.accessibilityType);
        
        this.routeLayers.polyline = L.polyline(routeCoords, {
            color: color,
            weight: 8,
            opacity: 0.9,
            smoothFactor: 1,
            dashArray: '10, 5', // Línea punteada
            className: 'route-polyline'
        });

        this.routeLayers.polyline.addTo(this.map);
        
        // Agregar popup informativo a la polyline
        this.routeLayers.polyline.bindPopup(`
            <div style="text-align: center; min-width: 200px;">
                <h4 style="margin: 0; color: ${color};">🗺️ Ruta ${route.accessibilityType}</h4>
                <p style="margin: 5px 0;"><strong>Distancia:</strong> ${Math.round(route.totalDistance || route.distance)} metros</p>
                <p style="margin: 5px 0;"><strong>Tiempo estimado:</strong> ${route.estimatedTime || 0} minutos</p>
                <p style="margin: 0; font-size: 12px; color: #666;">Haz clic en los marcadores para más información</p>
            </div>
        `);
    }

    /**
     * Crea los marcadores de inicio y fin
     * @param {Object} route - Objeto de ruta
     */
    createRouteMarkers(route) {
        this.routeLayers.markers = L.layerGroup();
        
        if (route.waypoints.length === 0) return;
        
        // Marcador de inicio
        const startMarker = this.createStartMarker(route.waypoints[0]);
        this.routeLayers.markers.addLayer(startMarker);
        
        // Marcador de destino
        const endMarker = this.createEndMarker(route.waypoints[route.waypoints.length - 1]);
        this.routeLayers.markers.addLayer(endMarker);
        
        this.routeLayers.markers.addTo(this.map);
    }

    /**
     * Crea marcadores de waypoints intermedios
     * @param {Object} route - Objeto de ruta
     */
    createWaypointMarkers(route) {
        if (route.waypoints.length <= 2) return;
        
        this.routeLayers.waypoints = L.layerGroup();
        
        for (let i = 1; i < route.waypoints.length - 1; i++) {
            const waypoint = route.waypoints[i];
            const waypointMarker = this.createWaypointMarker(waypoint, i);
            this.routeLayers.waypoints.addLayer(waypointMarker);
        }
        
        this.routeLayers.waypoints.addTo(this.map);
    }

    /**
     * Crea el marcador de inicio
     * @param {Object} waypoint - Waypoint de inicio
     * @returns {L.Marker} Marcador de inicio
     */
    createStartMarker(waypoint) {
        const startIcon = L.divIcon({
            className: 'custom-div-icon start-marker',
            html: `
                <div style="
                    background-color: #28a745; 
                    color: white; 
                    border-radius: 50%; 
                    width: 35px; 
                    height: 35px; 
                    display: flex; 
                    align-items: center; 
                    justify-content: center; 
                    font-weight: bold; 
                    border: 4px solid white; 
                    box-shadow: 0 3px 6px rgba(0,0,0,0.3);
                    font-size: 16px;
                ">🚀</div>
            `,
            iconSize: [35, 35],
            iconAnchor: [17, 17]
        });

        return L.marker(waypoint.coords, { icon: startIcon })
            .bindPopup(`
                <div style="text-align: center; min-width: 200px;">
                    <h4 style="margin: 0; color: #28a745;">🚀 INICIO</h4>
                    <p style="margin: 5px 0;"><strong>${waypoint.name}</strong></p>
                    <p style="margin: 0; font-size: 12px; color: #666;">Tu ubicación actual</p>
                </div>
            `);
    }

    /**
     * Crea el marcador de destino
     * @param {Object} waypoint - Waypoint de destino
     * @returns {L.Marker} Marcador de destino
     */
    createEndMarker(waypoint) {
        const endIcon = L.divIcon({
            className: 'custom-div-icon end-marker',
            html: `
                <div style="
                    background-color: #dc3545; 
                    color: white; 
                    border-radius: 50%; 
                    width: 35px; 
                    height: 35px; 
                    display: flex; 
                    align-items: center; 
                    justify-content: center; 
                    font-weight: bold; 
                    border: 4px solid white; 
                    box-shadow: 0 3px 6px rgba(0,0,0,0.3);
                    font-size: 16px;
                ">🎯</div>
            `,
            iconSize: [35, 35],
            iconAnchor: [17, 17]
        });

        return L.marker(waypoint.coords, { icon: endIcon })
            .bindPopup(`
                <div style="text-align: center; min-width: 200px;">
                    <h4 style="margin: 0; color: #dc3545;">🎯 DESTINO</h4>
                    <p style="margin: 5px 0;"><strong>${waypoint.name}</strong></p>
                    <p style="margin: 0; font-size: 12px; color: #666;">Tu destino</p>
                </div>
            `);
    }

    /**
     * Crea un marcador de waypoint intermedio
     * @param {Object} waypoint - Waypoint intermedio
     * @param {number} index - Índice del waypoint
     * @returns {L.Marker} Marcador de waypoint
     */
    createWaypointMarker(waypoint, index) {
        const waypointIcon = L.divIcon({
            className: 'custom-div-icon waypoint-marker',
            html: `
                <div style="
                    background-color: #007bff; 
                    color: white; 
                    border-radius: 50%; 
                    width: 25px; 
                    height: 25px; 
                    display: flex; 
                    align-items: center; 
                    justify-content: center; 
                    font-weight: bold; 
                    border: 3px solid white; 
                    box-shadow: 0 2px 4px rgba(0,0,0,0.3);
                    font-size: 12px;
                ">${index}</div>
            `,
            iconSize: [25, 25],
            iconAnchor: [12, 12]
        });

        return L.marker(waypoint.coords, { icon: waypointIcon })
            .bindPopup(`
                <div style="text-align: center; min-width: 180px;">
                    <h5 style="margin: 0; color: #007bff;">📍 Punto ${index}</h5>
                    <p style="margin: 5px 0;"><strong>${waypoint.name}</strong></p>
                    <p style="margin: 0; font-size: 12px; color: #666;">Waypoint intermedio</p>
                </div>
            `);
    }

    /**
     * Obtiene el color de la ruta según el tipo de accesibilidad
     * @param {string} accessibilityType - Tipo de accesibilidad
     * @returns {string} Color de la ruta
     */
    getRouteColor(accessibilityType) {
        return this.accessibilityColors[accessibilityType] || '#666666';
    }

    /**
     * Ajusta la vista del mapa para mostrar toda la ruta
     */
    fitMapToRoute() {
        if (!this.routeLayers.polyline) return;
        
        const bounds = this.routeLayers.polyline.getBounds();
        this.map.fitBounds(bounds, { 
            padding: [30, 30],
            maxZoom: 18
        });
    }

    /**
     * Limpia la ruta actual del mapa
     */
    clearCurrentRoute() {
        if (this.routeLayers.polyline) {
            this.map.removeLayer(this.routeLayers.polyline);
            this.routeLayers.polyline = null;
        }
        
        if (this.routeLayers.markers) {
            this.map.removeLayer(this.routeLayers.markers);
            this.routeLayers.markers = null;
        }
        
        if (this.routeLayers.waypoints) {
            this.map.removeLayer(this.routeLayers.waypoints);
            this.routeLayers.waypoints = null;
        }
        
        this.currentRoute = null;
    }

    /**
     * Resalta un segmento específico de la ruta
     * @param {number} segmentIndex - Índice del segmento a resaltar
     */
    highlightSegment(segmentIndex) {
        if (!this.currentRoute || !this.routeLayers.polyline) return;
        
        // Implementar resaltado de segmento
        console.log(`🎯 Resaltando segmento ${segmentIndex}`);
    }

    /**
     * Obtiene información de la ruta actual
     * @returns {Object|null} Información de la ruta actual
     */
    getCurrentRouteInfo() {
        if (!this.currentRoute) return null;
        
        return {
            waypoints: this.currentRoute.waypoints.length,
            distance: this.currentRoute.totalDistance || this.currentRoute.distance,
            estimatedTime: this.currentRoute.estimatedTime,
            accessibilityType: this.currentRoute.accessibilityType,
            color: this.getRouteColor(this.currentRoute.accessibilityType)
        };
    }

    /**
     * Obtiene estadísticas del visualizador
     * @returns {Object} Estadísticas del visualizador
     */
    getStatistics() {
        return {
            hasCurrentRoute: this.currentRoute !== null,
            hasPolyline: this.routeLayers.polyline !== null,
            hasMarkers: this.routeLayers.markers !== null,
            hasWaypoints: this.routeLayers.waypoints !== null,
            supportedAccessibilityTypes: Object.keys(this.accessibilityColors)
        };
    }
}

// Exportar la clase para uso global
window.RouteVisualizer = RouteVisualizer;

// Auto-inicialización cuando el DOM esté listo
$(document).ready(function() {
    console.log('🎨 RouteVisualizer cargado y listo para usar');
});
