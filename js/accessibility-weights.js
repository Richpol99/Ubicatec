/**
 * SISTEMA DE PESOS DE ACCESIBILIDAD - UBICATEC
 * 
 * Este archivo define y gestiona los pesos de accesibilidad para diferentes
 * tipos de conexiones y rutas en el campus.
 * 
 * @author UBICATEC Team
 * @version 1.0
 * @since 2025
 */

class AccessibilityWeights {
    constructor() {
        // Pesos base para diferentes tipos de accesibilidad
        this.weights = {
            wheelchair: {
                // Pesos para silla de ruedas
                standard: 1.0,      // Ruta estándar
                accessible: 0.5,    // Ruta accesible (rampas, etc.)
                ramp: 0.3,          // Rampa específica
                elevator: 0.2,      // Elevador
                stairs: 10.0,       // Escaleras (muy difícil)
                emergency: 0.8,     // Ruta de emergencia
                // Pesos adicionales para características específicas
                narrow: 2.0,        // Pasillo estrecho
                steep: 5.0,         // Pendiente pronunciada
                rough: 3.0,         // Superficie irregular
                dark: 1.5,          // Iluminación deficiente
                crowded: 2.5        // Área con mucha gente
            },
            visual: {
                // Pesos para discapacidad visual
                standard: 1.0,
                accessible: 0.6,    // Ruta con guías táctiles
                ramp: 0.4,          // Rampa con guías
                elevator: 0.3,      // Elevador con audio
                stairs: 1.2,        // Escaleras con contraste
                emergency: 1.5,     // Ruta de emergencia
                // Pesos adicionales
                narrow: 1.3,        // Pasillo estrecho
                steep: 1.8,         // Pendiente pronunciada
                rough: 1.4,         // Superficie irregular
                dark: 3.0,          // Iluminación deficiente (muy importante)
                crowded: 2.0        // Área con mucha gente
            },
            auditory: {
                // Pesos para discapacidad auditiva
                standard: 1.0,
                accessible: 0.7,    // Ruta con señales visuales
                ramp: 0.5,          // Rampa con indicadores visuales
                elevator: 0.4,      // Elevador con indicadores visuales
                stairs: 1.1,        // Escaleras con indicadores
                emergency: 1.3,     // Ruta de emergencia
                // Pesos adicionales
                narrow: 1.2,        // Pasillo estrecho
                steep: 1.5,         // Pendiente pronunciada
                rough: 1.3,         // Superficie irregular
                dark: 1.4,          // Iluminación deficiente
                crowded: 1.8        // Área con mucha gente (ruido)
            },
            mobility: {
                // Pesos para discapacidad de movilidad general
                standard: 1.0,
                accessible: 0.6,    // Ruta accesible
                ramp: 0.4,          // Rampa
                elevator: 0.3,      // Elevador
                stairs: 2.0,        // Escaleras
                emergency: 0.9,     // Ruta de emergencia
                // Pesos adicionales
                narrow: 1.5,        // Pasillo estrecho
                steep: 2.5,         // Pendiente pronunciada
                rough: 2.0,         // Superficie irregular
                dark: 1.3,          // Iluminación deficiente
                crowded: 1.6        // Área con mucha gente
            }
        };

        // Factores ambientales que afectan la accesibilidad
        this.environmentalFactors = {
            weather: {
                sunny: 1.0,         // Día soleado
                cloudy: 1.1,        // Día nublado
                rainy: 1.5,         // Lluvia
                stormy: 2.0         // Tormenta
            },
            time: {
                day: 1.0,           // Día
                evening: 1.2,       // Atardecer
                night: 1.8,         // Noche
                early_morning: 1.1  // Madrugada
            },
            season: {
                spring: 1.0,        // Primavera
                summer: 1.1,        // Verano (calor)
                autumn: 1.0,        // Otoño
                winter: 1.3         // Invierno (frío, hielo)
            }
        };

        console.log('⚖️ Sistema de pesos de accesibilidad inicializado');
    }

    /**
     * Obtiene el peso base para un tipo de conexión y accesibilidad
     * @param {string} connectionType - Tipo de conexión
     * @param {string} accessibilityType - Tipo de accesibilidad
     * @returns {number} Peso base
     */
    getBaseWeight(connectionType, accessibilityType) {
        const typeWeights = this.weights[accessibilityType];
        if (!typeWeights) {
            console.warn(`Tipo de accesibilidad no válido: ${accessibilityType}`);
            return 1.0;
        }

        return typeWeights[connectionType] || 1.0;
    }

    /**
     * Calcula el peso total considerando factores ambientales
     * @param {string} connectionType - Tipo de conexión
     * @param {string} accessibilityType - Tipo de accesibilidad
     * @param {Object} environmentalData - Datos ambientales
     * @returns {number} Peso total calculado
     */
    calculateTotalWeight(connectionType, accessibilityType, environmentalData = {}) {
        // Obtener peso base
        let totalWeight = this.getBaseWeight(connectionType, accessibilityType);

        // Aplicar factores ambientales
        if (environmentalData.weather) {
            const weatherFactor = this.environmentalFactors.weather[environmentalData.weather] || 1.0;
            totalWeight *= weatherFactor;
        }

        if (environmentalData.time) {
            const timeFactor = this.environmentalFactors.time[environmentalData.time] || 1.0;
            totalWeight *= timeFactor;
        }

        if (environmentalData.season) {
            const seasonFactor = this.environmentalFactors.season[environmentalData.season] || 1.0;
            totalWeight *= seasonFactor;
        }

        return Math.round(totalWeight * 100) / 100; // Redondear a 2 decimales
    }

    /**
     * Obtiene el peso para características específicas de una ruta
     * @param {string} characteristic - Característica de la ruta
     * @param {string} accessibilityType - Tipo de accesibilidad
     * @returns {number} Peso de la característica
     */
    getCharacteristicWeight(characteristic, accessibilityType) {
        const typeWeights = this.weights[accessibilityType];
        if (!typeWeights) {
            return 1.0;
        }

        return typeWeights[characteristic] || 1.0;
    }

    /**
     * Calcula el peso dinámico basado en la hora actual
     * @param {string} connectionType - Tipo de conexión
     * @param {string} accessibilityType - Tipo de accesibilidad
     * @returns {number} Peso dinámico
     */
    calculateDynamicWeight(connectionType, accessibilityType) {
        const now = new Date();
        const hour = now.getHours();
        
        // Determinar período del día
        let timePeriod;
        if (hour >= 6 && hour < 12) {
            timePeriod = 'day';
        } else if (hour >= 12 && hour < 18) {
            timePeriod = 'day';
        } else if (hour >= 18 && hour < 22) {
            timePeriod = 'evening';
        } else {
            timePeriod = 'night';
        }

        // Determinar estación (aproximada)
        const month = now.getMonth() + 1;
        let season;
        if (month >= 3 && month <= 5) {
            season = 'spring';
        } else if (month >= 6 && month <= 8) {
            season = 'summer';
        } else if (month >= 9 && month <= 11) {
            season = 'autumn';
        } else {
            season = 'winter';
        }

        const environmentalData = {
            time: timePeriod,
            season: season
        };

        return this.calculateTotalWeight(connectionType, accessibilityType, environmentalData);
    }

    /**
     * Obtiene todos los tipos de accesibilidad disponibles
     * @returns {Array} Array de tipos de accesibilidad
     */
    getAvailableAccessibilityTypes() {
        return Object.keys(this.weights);
    }

    /**
     * Obtiene todos los tipos de conexión disponibles
     * @returns {Array} Array de tipos de conexión
     */
    getAvailableConnectionTypes() {
        const types = new Set();
        Object.values(this.weights).forEach(typeWeights => {
            Object.keys(typeWeights).forEach(type => {
                types.add(type);
            });
        });
        return Array.from(types);
    }

    /**
     * Valida si un tipo de accesibilidad es válido
     * @param {string} accessibilityType - Tipo de accesibilidad a validar
     * @returns {boolean} true si es válido
     */
    isValidAccessibilityType(accessibilityType) {
        return this.weights.hasOwnProperty(accessibilityType);
    }

    /**
     * Valida si un tipo de conexión es válido
     * @param {string} connectionType - Tipo de conexión a validar
     * @returns {boolean} true si es válido
     */
    isValidConnectionType(connectionType) {
        return this.getAvailableConnectionTypes().includes(connectionType);
    }

    /**
     * Obtiene estadísticas del sistema de pesos
     * @returns {Object} Estadísticas del sistema
     */
    getStatistics() {
        const stats = {
            totalAccessibilityTypes: Object.keys(this.weights).length,
            totalConnectionTypes: this.getAvailableConnectionTypes().length,
            environmentalFactors: Object.keys(this.environmentalFactors).length,
            averageWeights: {}
        };

        // Calcular pesos promedio para cada tipo de accesibilidad
        Object.keys(this.weights).forEach(accessibilityType => {
            const typeWeights = this.weights[accessibilityType];
            const weights = Object.values(typeWeights);
            const average = weights.reduce((sum, weight) => sum + weight, 0) / weights.length;
            stats.averageWeights[accessibilityType] = Math.round(average * 100) / 100;
        });

        return stats;
    }

    /**
     * Actualiza el peso de una característica específica
     * @param {string} accessibilityType - Tipo de accesibilidad
     * @param {string} characteristic - Característica
     * @param {number} newWeight - Nuevo peso
     */
    updateWeight(accessibilityType, characteristic, newWeight) {
        if (!this.weights[accessibilityType]) {
            console.error(`Tipo de accesibilidad no válido: ${accessibilityType}`);
            return false;
        }

        this.weights[accessibilityType][characteristic] = newWeight;
        console.log(`✅ Peso actualizado: ${accessibilityType}.${characteristic} = ${newWeight}`);
        return true;
    }

    /**
     * Obtiene recomendaciones de accesibilidad para un tipo específico
     * @param {string} accessibilityType - Tipo de accesibilidad
     * @returns {Object} Recomendaciones
     */
    getRecommendations(accessibilityType) {
        const recommendations = {
            wheelchair: {
                best: ['elevator', 'ramp', 'accessible'],
                avoid: ['stairs', 'steep', 'rough'],
                tips: [
                    'Usar elevadores cuando estén disponibles',
                    'Evitar escaleras y superficies irregulares',
                    'Preferir rutas con rampas'
                ]
            },
            visual: {
                best: ['accessible', 'elevator', 'ramp'],
                avoid: ['dark', 'crowded'],
                tips: [
                    'Usar rutas bien iluminadas',
                    'Evitar áreas muy concurridas',
                    'Preferir rutas con guías táctiles'
                ]
            },
            auditory: {
                best: ['accessible', 'elevator', 'ramp'],
                avoid: ['crowded'],
                tips: [
                    'Usar rutas con indicadores visuales',
                    'Evitar áreas muy ruidosas',
                    'Preferir rutas tranquilas'
                ]
            },
            mobility: {
                best: ['elevator', 'ramp', 'accessible'],
                avoid: ['stairs', 'steep', 'rough'],
                tips: [
                    'Usar elevadores y rampas',
                    'Evitar escaleras y pendientes pronunciadas',
                    'Preferir superficies lisas y regulares'
                ]
            }
        };

        return recommendations[accessibilityType] || {};
    }
}

// Exportar la clase para uso global
window.AccessibilityWeights = AccessibilityWeights;

// Auto-inicialización cuando el DOM esté listo
$(document).ready(function() {
    console.log('⚖️ AccessibilityWeights cargado y listo para usar');
});
