/**
 * SISTEMA DE INDICADORES VISUALES - UBICATEC
 * 
 * Este archivo implementa indicadores visuales avanzados para mejorar
 * la experiencia del usuario en el sistema de rutas accesibles.
 * 
 * @author UBICATEC Team
 * @version 1.0
 * @since 2025
 */

class VisualIndicators {
    constructor() {
        // Referencias
        this.map = null;
        this.indicatorsLayer = null;
        
        // Configuración de indicadores
        this.indicators = {
            // Colores por tipo de accesibilidad
            colors: {
                wheelchair: '#28a745',
                visual: '#007bff',
                auditory: '#ffc107',
                mobility: '#17a2b8'
            },
            
            // Animaciones (definir primero)
            animations: {
                pulse: 'pulse 2s infinite',
                bounce: 'bounce 1s infinite',
                fade: 'fadeInOut 3s infinite',
                rotate: 'rotate 2s linear infinite'
            },
            
            // Iconos personalizados (crear después de definir animaciones)
            icons: null // Se inicializarán en el método init()
        };
        
        // Estado de indicadores activos
        this.activeIndicators = new Map();
        
        console.log('🎨 VisualIndicators inicializado');
    }
    
    /**
     * Inicializa el sistema de indicadores
     * @param {Object} map - Mapa de Leaflet
     */
    init(map) {
        this.map = map;
        
        // Crear capa para indicadores
        this.indicatorsLayer = L.layerGroup().addTo(map);
        
        // Agregar estilos CSS para animaciones
        this.addAnimationStyles();
        
        // Inicializar iconos después de que las animaciones estén definidas
        this.initializeIcons();
        
        console.log('🎨 VisualIndicators conectado al mapa');
        return this;
    }
    
    /**
     * Inicializa los iconos personalizados
     */
    initializeIcons() {
        this.indicators.icons = {
            start: this.createCustomIcon('🚩', '#28a745'),
            end: this.createCustomIcon('🏁', '#dc3545'),
            waypoint: this.createCustomIcon('📍', '#6c757d'),
            accessibility: {
                wheelchair: this.createCustomIcon('♿', '#28a745'),
                visual: this.createCustomIcon('👁️', '#007bff'),
                auditory: this.createCustomIcon('👂', '#ffc107'),
                mobility: this.createCustomIcon('🚶', '#17a2b8')
            },
            warning: this.createCustomIcon('⚠️', '#ffc107'),
            info: this.createCustomIcon('ℹ️', '#17a2b8'),
            success: this.createCustomIcon('✅', '#28a745')
        };
        
        console.log('🎨 Iconos personalizados inicializados');
    }
    
    /**
     * Crea un icono personalizado
     * @param {string} emoji - Emoji del icono
     * @param {string} color - Color del icono
     * @param {number} size - Tamaño del icono
     * @returns {Object} Icono de Leaflet
     */
    createCustomIcon(emoji, color = '#000', size = 32) {
        // Verificar que las animaciones estén disponibles
        const animation = this.indicators && this.indicators.animations ? 
            this.indicators.animations.pulse : 'pulse 2s infinite';
        
        const iconHtml = `
            <div style="
                background: white;
                border: 3px solid ${color};
                border-radius: 50%;
                width: ${size}px;
                height: ${size}px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: ${size * 0.6}px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.3);
                animation: ${animation};
            ">${emoji}</div>
        `;
        
        return L.divIcon({
            html: iconHtml,
            className: 'custom-indicator',
            iconSize: [size, size],
            iconAnchor: [size/2, size/2],
            popupAnchor: [0, -size/2]
        });
    }
    
    /**
     * Agrega estilos CSS para animaciones
     */
    addAnimationStyles() {
        if (document.getElementById('visual-indicators-styles')) {
            return; // Ya existen los estilos
        }
        
        const styles = `
            <style id="visual-indicators-styles">
                @keyframes pulse {
                    0% { transform: scale(1); opacity: 1; }
                    50% { transform: scale(1.1); opacity: 0.8; }
                    100% { transform: scale(1); opacity: 1; }
                }
                
                @keyframes bounce {
                    0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
                    40% { transform: translateY(-10px); }
                    60% { transform: translateY(-5px); }
                }
                
                @keyframes fadeInOut {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.5; }
                }
                
                @keyframes rotate {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                
                .custom-indicator {
                    background: transparent !important;
                    border: none !important;
                }
                
                .route-popup {
                    min-width: 200px;
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                }
                
                .route-popup h6 {
                    color: #495057;
                    margin-bottom: 10px;
                    border-bottom: 2px solid #e9ecef;
                    padding-bottom: 5px;
                }
                
                .route-popup .info-row {
                    display: flex;
                    justify-content: space-between;
                    margin: 5px 0;
                    padding: 3px 0;
                    border-bottom: 1px solid #f8f9fa;
                }
                
                .route-popup .info-label {
                    font-weight: bold;
                    color: #6c757d;
                }
                
                .route-popup .info-value {
                    color: #495057;
                }
                
                .accessibility-badge {
                    display: inline-block;
                    padding: 4px 8px;
                    border-radius: 12px;
                    font-size: 12px;
                    font-weight: bold;
                    color: white;
                    margin: 2px;
                }
                
                .accessibility-wheelchair { background: #28a745; }
                .accessibility-visual { background: #007bff; }
                .accessibility-auditory { background: #ffc107; color: #212529; }
                .accessibility-mobility { background: #17a2b8; }
                
                .navigation-arrow {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    font-size: 24px;
                    color: #dc3545;
                    animation: bounce 1s infinite;
                    pointer-events: none;
                }
                
                .distance-marker {
                    background: rgba(0,0,0,0.7);
                    color: white;
                    padding: 2px 6px;
                    border-radius: 10px;
                    font-size: 11px;
                    font-weight: bold;
                    white-space: nowrap;
                }
            </style>
        `;
        
        document.head.insertAdjacentHTML('beforeend', styles);
    }
    
    /**
     * Muestra un indicador de inicio de ruta
     * @param {Array} coords - Coordenadas [lat, lng]
     * @param {string} name - Nombre del punto
     * @param {string} accessibilityType - Tipo de accesibilidad
     */
    showStartIndicator(coords, name, accessibilityType = 'wheelchair') {
        const icon = this.indicators.icons.start;
        const marker = L.marker(coords, { icon }).addTo(this.indicatorsLayer);
        
        const popupContent = this.createRoutePopup(
            '🚩 Punto de Inicio',
            name,
            {
                'Tipo de accesibilidad': this.getAccessibilityLabel(accessibilityType),
                'Coordenadas': `${coords[0].toFixed(6)}, ${coords[1].toFixed(6)}`,
                'Estado': 'Listo para navegar'
            }
        );
        
        marker.bindPopup(popupContent);
        this.activeIndicators.set('start', marker);
        
        console.log('🚩 Indicador de inicio mostrado:', name);
    }
    
    /**
     * Muestra un indicador de destino
     * @param {Array} coords - Coordenadas [lat, lng]
     * @param {string} name - Nombre del punto
     * @param {string} accessibilityType - Tipo de accesibilidad
     */
    showEndIndicator(coords, name, accessibilityType = 'wheelchair') {
        const icon = this.indicators.icons.end;
        const marker = L.marker(coords, { icon }).addTo(this.indicatorsLayer);
        
        const popupContent = this.createRoutePopup(
            '🏁 Destino',
            name,
            {
                'Tipo de accesibilidad': this.getAccessibilityLabel(accessibilityType),
                'Coordenadas': `${coords[0].toFixed(6)}, ${coords[1].toFixed(6)}`,
                'Estado': 'Destino alcanzado'
            }
        );
        
        marker.bindPopup(popupContent);
        this.activeIndicators.set('end', marker);
        
        console.log('🏁 Indicador de destino mostrado:', name);
    }
    
    /**
     * Muestra indicadores de waypoints
     * @param {Array} waypoints - Array de waypoints
     * @param {string} accessibilityType - Tipo de accesibilidad
     */
    showWaypointIndicators(waypoints, accessibilityType = 'wheelchair') {
        // Limpiar waypoints anteriores
        this.clearIndicators('waypoints');
        
        waypoints.forEach((waypoint, index) => {
            if (index === 0 || index === waypoints.length - 1) {
                return; // Skip start and end points
            }
            
            const icon = this.indicators.icons.waypoint;
            const marker = L.marker(waypoint.coords, { icon }).addTo(this.indicatorsLayer);
            
            const popupContent = this.createRoutePopup(
                `📍 Punto Intermedio ${index}`,
                waypoint.name,
                {
                    'Orden': `${index + 1} de ${waypoints.length}`,
                    'Tipo': waypoint.type,
                    'Coordenadas': `${waypoint.coords[0].toFixed(6)}, ${waypoint.coords[1].toFixed(6)}`
                }
            );
            
            marker.bindPopup(popupContent);
            this.activeIndicators.set(`waypoint_${index}`, marker);
        });
        
        console.log('📍 Indicadores de waypoints mostrados:', waypoints.length - 2);
    }
    
    /**
     * Muestra indicadores de accesibilidad en edificios
     * @param {Array} buildings - Array de edificios
     * @param {string} accessibilityType - Tipo de accesibilidad
     */
    showAccessibilityIndicators(buildings, accessibilityType = 'wheelchair') {
        buildings.forEach(building => {
            if (building.accessibility && building.accessibility[accessibilityType]) {
                const icon = this.indicators.icons.accessibility[accessibilityType];
                const marker = L.marker(building.coords, { icon }).addTo(this.indicatorsLayer);
                
                const accessibilityInfo = this.getAccessibilityInfo(building.accessibility);
                const popupContent = this.createRoutePopup(
                    `🏢 ${building.name}`,
                    `Accesible para ${this.getAccessibilityLabel(accessibilityType)}`,
                    {
                        'Accesibilidad': accessibilityInfo,
                        'Tipo de edificio': building.buildingType || 'No especificado',
                        'Coordenadas': `${building.coords[0].toFixed(6)}, ${building.coords[1].toFixed(6)}`
                    }
                );
                
                marker.bindPopup(popupContent);
                this.activeIndicators.set(`accessibility_${building.id}`, marker);
            }
        });
        
        console.log('♿ Indicadores de accesibilidad mostrados');
    }
    
    /**
     * Muestra una flecha de navegación
     * @param {Array} coords - Coordenadas [lat, lng]
     * @param {string} direction - Dirección ('north', 'south', 'east', 'west')
     */
    showNavigationArrow(coords, direction = 'north') {
        const arrowSymbols = {
            north: '↑',
            south: '↓',
            east: '→',
            west: '←'
        };
        
        const arrowHtml = `
            <div class="navigation-arrow">${arrowSymbols[direction]}</div>
        `;
        
        const icon = L.divIcon({
            html: arrowHtml,
            className: 'navigation-arrow-container',
            iconSize: [30, 30],
            iconAnchor: [15, 15]
        });
        
        const marker = L.marker(coords, { icon }).addTo(this.indicatorsLayer);
        this.activeIndicators.set('navigation_arrow', marker);
        
        console.log('🧭 Flecha de navegación mostrada:', direction);
    }
    
    /**
     * Muestra marcadores de distancia
     * @param {Array} routeCoords - Coordenadas de la ruta
     * @param {number} totalDistance - Distancia total en metros
     */
    showDistanceMarkers(routeCoords, totalDistance) {
        const numMarkers = Math.min(5, Math.floor(routeCoords.length / 2)); // Máximo 5 marcadores
        
        for (let i = 1; i < numMarkers; i++) {
            const index = Math.floor((i / numMarkers) * routeCoords.length);
            const coords = routeCoords[index];
            const distance = (totalDistance * i / numMarkers).toFixed(0);
            
            const markerHtml = `
                <div class="distance-marker">${distance}m</div>
            `;
            
            const icon = L.divIcon({
                html: markerHtml,
                className: 'distance-marker-container',
                iconSize: [50, 20],
                iconAnchor: [25, 10]
            });
            
            const marker = L.marker(coords, { icon }).addTo(this.indicatorsLayer);
            this.activeIndicators.set(`distance_${i}`, marker);
        }
        
        console.log('📏 Marcadores de distancia mostrados:', numMarkers - 1);
    }
    
    /**
     * Crea el contenido HTML para popups de rutas
     * @param {string} title - Título del popup
     * @param {string} subtitle - Subtítulo
     * @param {Object} info - Información adicional
     * @returns {string} HTML del popup
     */
    createRoutePopup(title, subtitle, info = {}) {
        let infoHtml = '';
        for (const [key, value] of Object.entries(info)) {
            infoHtml += `
                <div class="info-row">
                    <span class="info-label">${key}:</span>
                    <span class="info-value">${value}</span>
                </div>
            `;
        }
        
        return `
            <div class="route-popup">
                <h6>${title}</h6>
                <p><strong>${subtitle}</strong></p>
                ${infoHtml}
            </div>
        `;
    }
    
    /**
     * Obtiene información de accesibilidad formateada
     * @param {Object} accessibility - Objeto de accesibilidad
     * @returns {string} HTML formateado
     */
    getAccessibilityInfo(accessibility) {
        const badges = [];
        
        if (accessibility.wheelchair) badges.push('<span class="accessibility-badge accessibility-wheelchair">♿ Silla de ruedas</span>');
        if (accessibility.visual) badges.push('<span class="accessibility-badge accessibility-visual">👁️ Visual</span>');
        if (accessibility.auditory) badges.push('<span class="accessibility-badge accessibility-auditory">👂 Auditiva</span>');
        if (accessibility.mobility) badges.push('<span class="accessibility-badge accessibility-mobility">🚶 Movilidad</span>');
        
        return badges.join(' ');
    }
    
    /**
     * Obtiene la etiqueta legible del tipo de accesibilidad
     * @param {string} type - Tipo de accesibilidad
     * @returns {string} Etiqueta legible
     */
    getAccessibilityLabel(type) {
        const labels = {
            wheelchair: '♿ Silla de Ruedas',
            visual: '👁️ Discapacidad Visual',
            auditory: '👂 Discapacidad Auditiva',
            mobility: '🚶 Movilidad Reducida'
        };
        
        return labels[type] || 'Accesible';
    }
    
    /**
     * Limpia indicadores específicos
     * @param {string} type - Tipo de indicadores a limpiar
     */
    clearIndicators(type = 'all') {
        if (type === 'all') {
            this.indicatorsLayer.clearLayers();
            this.activeIndicators.clear();
        } else {
            // Limpiar indicadores específicos
            for (const [key, marker] of this.activeIndicators) {
                if (key.startsWith(type)) {
                    this.indicatorsLayer.removeLayer(marker);
                    this.activeIndicators.delete(key);
                }
            }
        }
        
        console.log('🧹 Indicadores limpiados:', type);
    }
    
    /**
     * Destaca un indicador específico
     * @param {string} indicatorId - ID del indicador
     * @param {boolean} highlight - Si destacar o no
     */
    highlightIndicator(indicatorId, highlight = true) {
        const marker = this.activeIndicators.get(indicatorId);
        if (marker) {
            if (highlight) {
                marker.getElement().style.animation = this.indicators.animations.bounce;
            } else {
                marker.getElement().style.animation = this.indicators.animations.pulse;
            }
        }
    }
    
    /**
     * Obtiene estadísticas de indicadores
     * @returns {Object} Estadísticas
     */
    getStatistics() {
        return {
            totalIndicators: this.activeIndicators.size,
            indicatorsByType: {
                start: this.activeIndicators.has('start') ? 1 : 0,
                end: this.activeIndicators.has('end') ? 1 : 0,
                waypoints: Array.from(this.activeIndicators.keys()).filter(k => k.startsWith('waypoint_')).length,
                accessibility: Array.from(this.activeIndicators.keys()).filter(k => k.startsWith('accessibility_')).length,
                distance: Array.from(this.activeIndicators.keys()).filter(k => k.startsWith('distance_')).length
            },
            isInitialized: !!this.map
        };
    }
    
    /**
     * Destruye el sistema de indicadores
     */
    destroy() {
        this.clearIndicators();
        
        if (this.indicatorsLayer) {
            this.map.removeLayer(this.indicatorsLayer);
        }
        
        // Remover estilos CSS
        const styles = document.getElementById('visual-indicators-styles');
        if (styles) {
            styles.remove();
        }
        
        this.map = null;
        this.indicatorsLayer = null;
        this.activeIndicators.clear();
        
        console.log('🗑️ VisualIndicators destruido');
    }
}

// Exportar para uso global
window.VisualIndicators = VisualIndicators;
