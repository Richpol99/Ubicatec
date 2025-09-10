/**
 * CALCULADOR DE DISTANCIAS INTEGRADO - UBICATEC
 * 
 * Este archivo integra el cálculo de distancias con el sistema de geolocalización
 * existente y optimiza los cálculos para el sistema de rutas accesibles.
 * 
 * @author UBICATEC Team
 * @version 1.0
 * @since 2025
 */

class DistanceCalculator {
    constructor() {
        // Configuración del calculador
        this.config = {
            earthRadius: 6371e3, // Radio de la Tierra en metros
            precision: 2,        // Decimales de precisión
            cacheSize: 100,      // Tamaño del caché de distancias
            enableCache: true    // Habilitar caché de distancias
        };

        // Caché de distancias calculadas
        this.distanceCache = new Map();
        
        // Referencia al sistema de geolocalización
        this.geolocationSystem = null;
        
        console.log('📏 DistanceCalculator inicializado');
    }

    /**
     * Conecta con el sistema de geolocalización existente
     * @param {Object} geolocationSystem - Sistema de geolocalización
     */
    setGeolocationSystem(geolocationSystem) {
        this.geolocationSystem = geolocationSystem;
        console.log('🔗 Sistema de geolocalización conectado');
    }

    /**
     * Calcula la distancia entre dos puntos usando la fórmula de Haversine
     * Esta es la misma función que existe en mapa.js pero optimizada
     * 
     * @param {Array} coords1 - Coordenadas del primer punto [lat, lng]
     * @param {Array} coords2 - Coordenadas del segundo punto [lat, lng]
     * @returns {number} Distancia en metros
     */
    calculateDistance(coords1, coords2) {
        // Verificar si tenemos la distancia en caché
        if (this.config.enableCache) {
            const cacheKey = this.generateCacheKey(coords1, coords2);
            if (this.distanceCache.has(cacheKey)) {
                return this.distanceCache.get(cacheKey);
            }
        }

        // Validar coordenadas
        if (!this.isValidCoordinates(coords1) || !this.isValidCoordinates(coords2)) {
            throw new Error('Coordenadas inválidas');
        }

        // Radio de la Tierra en metros
        const R = this.config.earthRadius;
        
        // Convertir grados a radianes
        const φ1 = coords1[0] * Math.PI / 180;  // latitud del primer punto
        const φ2 = coords2[0] * Math.PI / 180;  // latitud del segundo punto
        const Δφ = (coords2[0] - coords1[0]) * Math.PI / 180;  // diferencia de latitud
        const Δλ = (coords2[1] - coords1[1]) * Math.PI / 180;  // diferencia de longitud

        // Fórmula de Haversine
        const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
                  Math.cos(φ1) * Math.cos(φ2) *
                  Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        // Distancia final en metros
        const distance = R * c;
        const roundedDistance = Math.round(distance * Math.pow(10, this.config.precision)) / Math.pow(10, this.config.precision);

        // Guardar en caché si está habilitado
        if (this.config.enableCache) {
            const cacheKey = this.generateCacheKey(coords1, coords2);
            this.distanceCache.set(cacheKey, roundedDistance);
            
            // Limpiar caché si excede el tamaño máximo
            if (this.distanceCache.size > this.config.cacheSize) {
                this.clearOldestCacheEntries();
            }
        }

        return roundedDistance;
    }

    /**
     * Calcula la distancia desde la ubicación actual del usuario a un punto
     * @param {Array} targetCoords - Coordenadas del punto destino
     * @returns {Promise<number>} Distancia en metros
     */
    async calculateDistanceFromUser(targetCoords) {
        if (!this.geolocationSystem) {
            throw new Error('Sistema de geolocalización no disponible');
        }

        try {
            // Obtener ubicación actual del usuario
            const userLocation = await this.getCurrentUserLocation();
            
            if (!userLocation) {
                throw new Error('No se pudo obtener la ubicación del usuario');
            }

            // Calcular distancia
            return this.calculateDistance(userLocation, targetCoords);
            
        } catch (error) {
            console.error('Error calculando distancia desde usuario:', error);
            throw error;
        }
    }

    /**
     * Obtiene la ubicación actual del usuario
     * @returns {Promise<Array>} Coordenadas [lat, lng] del usuario
     */
    async getCurrentUserLocation() {
        return new Promise((resolve, reject) => {
            if (!navigator.geolocation) {
                reject(new Error('Geolocalización no soportada por el navegador'));
                return;
            }

            const options = {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 60000 // 1 minuto
            };

            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const coords = [
                        position.coords.latitude,
                        position.coords.longitude
                    ];
                    resolve(coords);
                },
                (error) => {
                    console.error('Error obteniendo ubicación:', error);
                    reject(error);
                },
                options
            );
        });
    }

    /**
     * Calcula la distancia entre múltiples puntos (para rutas)
     * @param {Array} waypoints - Array de coordenadas de waypoints
     * @returns {number} Distancia total en metros
     */
    calculateRouteDistance(waypoints) {
        if (!waypoints || waypoints.length < 2) {
            return 0;
        }

        let totalDistance = 0;
        
        for (let i = 0; i < waypoints.length - 1; i++) {
            const distance = this.calculateDistance(waypoints[i], waypoints[i + 1]);
            totalDistance += distance;
        }

        return Math.round(totalDistance * Math.pow(10, this.config.precision)) / Math.pow(10, this.config.precision);
    }

    /**
     * Encuentra el punto más cercano a unas coordenadas de referencia
     * @param {Array} referenceCoords - Coordenadas de referencia
     * @param {Array} candidateCoords - Array de coordenadas candidatas
     * @returns {Object} Objeto con el punto más cercano y su distancia
     */
    findNearestPoint(referenceCoords, candidateCoords) {
        if (!candidateCoords || candidateCoords.length === 0) {
            return null;
        }

        let nearestPoint = null;
        let minDistance = Infinity;
        let nearestIndex = -1;

        candidateCoords.forEach((coords, index) => {
            const distance = this.calculateDistance(referenceCoords, coords);
            if (distance < minDistance) {
                minDistance = distance;
                nearestPoint = coords;
                nearestIndex = index;
            }
        });

        return {
            coords: nearestPoint,
            distance: minDistance,
            index: nearestIndex
        };
    }

    /**
     * Calcula el tiempo estimado de viaje basado en la distancia
     * @param {number} distance - Distancia en metros
     * @param {string} accessibilityType - Tipo de accesibilidad
     * @returns {number} Tiempo estimado en minutos
     */
    calculateTravelTime(distance, accessibilityType = 'standard') {
        // Velocidades promedio en metros por minuto
        const speeds = {
            standard: 80,        // 80 m/min (4.8 km/h) - caminata normal
            wheelchair: 50,      // 50 m/min (3 km/h) - silla de ruedas
            visual: 60,          // 60 m/min (3.6 km/h) - discapacidad visual
            auditory: 70,        // 70 m/min (4.2 km/h) - discapacidad auditiva
            mobility: 60         // 60 m/min (3.6 km/h) - discapacidad de movilidad
        };

        const speed = speeds[accessibilityType] || speeds.standard;
        const timeInMinutes = distance / speed;
        
        return Math.round(timeInMinutes * 10) / 10; // Redondear a 1 decimal
    }

    /**
     * Valida si unas coordenadas son válidas
     * @param {Array} coords - Coordenadas a validar [lat, lng]
     * @returns {boolean} true si las coordenadas son válidas
     */
    isValidCoordinates(coords) {
        if (!Array.isArray(coords) || coords.length !== 2) {
            return false;
        }

        const [lat, lng] = coords;
        
        // Validar latitud (-90 a 90)
        if (typeof lat !== 'number' || lat < -90 || lat > 90) {
            return false;
        }

        // Validar longitud (-180 a 180)
        if (typeof lng !== 'number' || lng < -180 || lng > 180) {
            return false;
        }

        return true;
    }

    /**
     * Genera una clave única para el caché de distancias
     * @param {Array} coords1 - Primeras coordenadas
     * @param {Array} coords2 - Segundas coordenadas
     * @returns {string} Clave de caché
     */
    generateCacheKey(coords1, coords2) {
        // Ordenar coordenadas para evitar duplicados (A->B es igual a B->A)
        const sorted = [coords1, coords2].sort((a, b) => {
            if (a[0] !== b[0]) return a[0] - b[0];
            return a[1] - b[1];
        });
        
        return `${sorted[0][0]},${sorted[0][1]}-${sorted[1][0]},${sorted[1][1]}`;
    }

    /**
     * Limpia las entradas más antiguas del caché
     */
    clearOldestCacheEntries() {
        const entriesToRemove = Math.floor(this.config.cacheSize * 0.2); // Remover 20%
        const entries = Array.from(this.distanceCache.entries());
        
        // Remover las primeras entradas (más antiguas)
        for (let i = 0; i < entriesToRemove; i++) {
            this.distanceCache.delete(entries[i][0]);
        }
    }

    /**
     * Limpia todo el caché de distancias
     */
    clearCache() {
        this.distanceCache.clear();
        console.log('🗑️ Caché de distancias limpiado');
    }

    /**
     * Obtiene estadísticas del calculador de distancias
     * @returns {Object} Estadísticas del sistema
     */
    getStatistics() {
        return {
            cacheSize: this.distanceCache.size,
            maxCacheSize: this.config.cacheSize,
            cacheEnabled: this.config.enableCache,
            precision: this.config.precision,
            earthRadius: this.config.earthRadius,
            geolocationAvailable: this.geolocationSystem !== null
        };
    }

    /**
     * Optimiza el cálculo de distancias para un conjunto de puntos
     * @param {Array} points - Array de puntos con coordenadas
     * @returns {Array} Array de distancias optimizadas
     */
    optimizeDistanceCalculation(points) {
        if (!points || points.length < 2) {
            return [];
        }

        const distances = [];
        
        // Calcular distancias en paralelo usando Promise.all
        const distancePromises = [];
        
        for (let i = 0; i < points.length - 1; i++) {
            distancePromises.push(
                Promise.resolve(this.calculateDistance(points[i].coords, points[i + 1].coords))
            );
        }

        return Promise.all(distancePromises);
    }

    /**
     * Convierte metros a otras unidades
     * @param {number} meters - Distancia en metros
     * @param {string} unit - Unidad de destino ('km', 'miles', 'feet')
     * @returns {number} Distancia convertida
     */
    convertDistance(meters, unit = 'km') {
        const conversions = {
            km: meters / 1000,
            miles: meters * 0.000621371,
            feet: meters * 3.28084
        };

        return Math.round(conversions[unit] * 100) / 100;
    }
}

// Exportar la clase para uso global
window.DistanceCalculator = DistanceCalculator;

// Auto-inicialización cuando el DOM esté listo
$(document).ready(function() {
    console.log('📏 DistanceCalculator cargado y listo para usar');
});
