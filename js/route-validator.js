/**
 * SISTEMA DE VALIDACIÓN DE RUTAS ACCESIBLES - UBICATEC
 * 
 * Este archivo implementa validaciones específicas para rutas accesibles
 * considerando pendientes, ancho, superficie e iluminación.
 * 
 * @author UBICATEC Team
 * @version 1.0
 * @since 2025
 */

class RouteValidator {
    constructor() {
        // Estándares de accesibilidad según normativas internacionales
        this.standards = {
            // Pendientes máximas permitidas (en porcentaje)
            slopes: {
                wheelchair: 8.33,      // 1:12 ratio (8.33%)
                visual: 5.0,           // 5% para discapacidad visual
                auditory: 8.33,        // 1:12 ratio
                mobility: 6.0          // 6% para discapacidad de movilidad
            },
            
            // Anchos mínimos requeridos (en metros)
            widths: {
                wheelchair: 0.9,       // 90 cm mínimo
                visual: 1.2,           // 120 cm para guías táctiles
                auditory: 0.9,         // 90 cm mínimo
                mobility: 1.0           // 100 cm mínimo
            },
            
            // Superficies permitidas
            surfaces: {
                allowed: ['concrete', 'asphalt', 'pavers', 'rubber', 'wood'],
                prohibited: ['gravel', 'sand', 'grass', 'cobblestone', 'brick']
            },
            
            // Niveles de iluminación (en lux)
            lighting: {
                minimum: 50,           // 50 lux mínimo
                recommended: 100,      // 100 lux recomendado
                excellent: 200         // 200 lux excelente
            },
            
            // Distancias máximas sin descanso
            restDistances: {
                wheelchair: 30,        // 30 metros máximo
                visual: 25,            // 25 metros máximo
                auditory: 30,          // 30 metros máximo
                mobility: 35           // 35 metros máximo
            }
        };

        // Referencia al calculador de distancias
        this.distanceCalculator = null;
        
        console.log('✅ RouteValidator inicializado');
    }

    /**
     * Conecta con el calculador de distancias
     * @param {DistanceCalculator} distanceCalculator - Calculador de distancias
     */
    setDistanceCalculator(distanceCalculator) {
        this.distanceCalculator = distanceCalculator;
        console.log('🔗 Calculador de distancias conectado al validador');
    }

    /**
     * Valida una ruta completa para un tipo de accesibilidad específico
     * @param {Array} waypoints - Array de waypoints de la ruta
     * @param {string} accessibilityType - Tipo de accesibilidad
     * @returns {Object} Resultado de la validación
     */
    validateRoute(waypoints, accessibilityType = 'wheelchair') {
        console.log(`🔍 Validando ruta para ${accessibilityType}...`);

        const validation = {
            isValid: true,
            errors: [],
            warnings: [],
            score: 100,
            details: {
                slopeValidation: null,
                widthValidation: null,
                surfaceValidation: null,
                lightingValidation: null,
                restValidation: null
            }
        };

        if (!waypoints || waypoints.length < 2) {
            validation.isValid = false;
            validation.errors.push('La ruta debe tener al menos 2 waypoints');
            return validation;
        }

        // Validar cada segmento de la ruta
        for (let i = 0; i < waypoints.length - 1; i++) {
            const currentPoint = waypoints[i];
            const nextPoint = waypoints[i + 1];
            
            // Validar pendiente del segmento
            const slopeValidation = this.validateSlope(currentPoint, nextPoint, accessibilityType);
            validation.details.slopeValidation = slopeValidation;
            
            if (!slopeValidation.isValid) {
                validation.isValid = false;
                validation.errors.push(`Pendiente excesiva en segmento ${i + 1}: ${slopeValidation.slope}%`);
                validation.score -= 20;
            }

            // Validar ancho del segmento
            const widthValidation = this.validateWidth(currentPoint, nextPoint, accessibilityType);
            validation.details.widthValidation = widthValidation;
            
            if (!widthValidation.isValid) {
                validation.isValid = false;
                validation.errors.push(`Ancho insuficiente en segmento ${i + 1}: ${widthValidation.width}m`);
                validation.score -= 15;
            }

            // Validar superficie del segmento
            const surfaceValidation = this.validateSurface(currentPoint, nextPoint, accessibilityType);
            validation.details.surfaceValidation = surfaceValidation;
            
            if (!surfaceValidation.isValid) {
                validation.isValid = false;
                validation.errors.push(`Superficie inadecuada en segmento ${i + 1}: ${surfaceValidation.surface}`);
                validation.score -= 25;
            }

            // Validar iluminación del segmento
            const lightingValidation = this.validateLighting(currentPoint, nextPoint, accessibilityType);
            validation.details.lightingValidation = lightingValidation;
            
            if (!lightingValidation.isValid) {
                validation.warnings.push(`Iluminación insuficiente en segmento ${i + 1}: ${lightingValidation.lighting} lux`);
                validation.score -= 10;
            }
        }

        // Validar distancias de descanso
        const restValidation = this.validateRestDistances(waypoints, accessibilityType);
        validation.details.restValidation = restValidation;
        
        if (!restValidation.isValid) {
            validation.warnings.push('Distancia excesiva sin puntos de descanso');
            validation.score -= 5;
        }

        // Asegurar que el score no sea negativo
        validation.score = Math.max(0, validation.score);

        console.log(`✅ Validación completada. Score: ${validation.score}/100`);
        
        return validation;
    }

    /**
     * Valida la pendiente de un segmento de ruta
     * @param {Object} point1 - Primer punto
     * @param {Object} point2 - Segundo punto
     * @param {string} accessibilityType - Tipo de accesibilidad
     * @returns {Object} Resultado de la validación de pendiente
     */
    validateSlope(point1, point2, accessibilityType) {
        const maxSlope = this.standards.slopes[accessibilityType] || 8.33;
        
        // Calcular pendiente (simplificado - en un caso real necesitarías datos de elevación)
        const slope = this.calculateSlope(point1, point2);
        
        return {
            isValid: slope <= maxSlope,
            slope: Math.round(slope * 100) / 100,
            maxAllowed: maxSlope,
            recommendation: slope > maxSlope ? 'Considerar ruta alternativa con menor pendiente' : 'Pendiente adecuada'
        };
    }

    /**
     * Valida el ancho de un segmento de ruta
     * @param {Object} point1 - Primer punto
     * @param {Object} point2 - Segundo punto
     * @param {string} accessibilityType - Tipo de accesibilidad
     * @returns {Object} Resultado de la validación de ancho
     */
    validateWidth(point1, point2, accessibilityType) {
        const minWidth = this.standards.widths[accessibilityType] || 0.9;
        
        // Simular ancho de ruta (en un caso real necesitarías datos de ancho real)
        const width = this.estimateWidth(point1, point2);
        
        return {
            isValid: width >= minWidth,
            width: Math.round(width * 100) / 100,
            minRequired: minWidth,
            recommendation: width < minWidth ? 'Ruta muy estrecha, considerar alternativa' : 'Ancho adecuado'
        };
    }

    /**
     * Valida la superficie de un segmento de ruta
     * @param {Object} point1 - Primer punto
     * @param {Object} point2 - Segundo punto
     * @param {string} accessibilityType - Tipo de accesibilidad
     * @returns {Object} Resultado de la validación de superficie
     */
    validateSurface(point1, point2, accessibilityType) {
        // Simular tipo de superficie (en un caso real necesitarías datos de superficie)
        const surface = this.estimateSurface(point1, point2);
        const isAllowed = this.standards.surfaces.allowed.includes(surface);
        
        return {
            isValid: isAllowed,
            surface: surface,
            allowed: this.standards.surfaces.allowed,
            prohibited: this.standards.surfaces.prohibited,
            recommendation: isAllowed ? 'Superficie adecuada' : 'Superficie inadecuada, buscar alternativa'
        };
    }

    /**
     * Valida la iluminación de un segmento de ruta
     * @param {Object} point1 - Primer punto
     * @param {Object} point2 - Segundo punto
     * @param {string} accessibilityType - Tipo de accesibilidad
     * @returns {Object} Resultado de la validación de iluminación
     */
    validateLighting(point1, point2, accessibilityType) {
        // Simular nivel de iluminación (en un caso real necesitarías datos de iluminación)
        const lighting = this.estimateLighting(point1, point2);
        const minLighting = this.standards.lighting.minimum;
        
        return {
            isValid: lighting >= minLighting,
            lighting: lighting,
            minRequired: minLighting,
            recommended: this.standards.lighting.recommended,
            level: this.getLightingLevel(lighting),
            recommendation: lighting < minLighting ? 'Iluminación insuficiente' : 'Iluminación adecuada'
        };
    }

    /**
     * Valida las distancias de descanso en la ruta
     * @param {Array} waypoints - Array de waypoints
     * @param {string} accessibilityType - Tipo de accesibilidad
     * @returns {Object} Resultado de la validación de descanso
     */
    validateRestDistances(waypoints, accessibilityType) {
        const maxDistance = this.standards.restDistances[accessibilityType] || 30;
        let maxSegmentDistance = 0;
        let problematicSegment = -1;

        for (let i = 0; i < waypoints.length - 1; i++) {
            const distance = this.distanceCalculator ? 
                this.distanceCalculator.calculateDistance(waypoints[i].coords, waypoints[i + 1].coords) :
                this.estimateDistance(waypoints[i], waypoints[i + 1]);

            if (distance > maxSegmentDistance) {
                maxSegmentDistance = distance;
                problematicSegment = i;
            }
        }

        return {
            isValid: maxSegmentDistance <= maxDistance,
            maxSegmentDistance: Math.round(maxSegmentDistance),
            maxAllowed: maxDistance,
            problematicSegment: problematicSegment,
            recommendation: maxSegmentDistance > maxDistance ? 
                'Agregar puntos de descanso intermedios' : 'Distancias de descanso adecuadas'
        };
    }

    /**
     * Calcula la pendiente entre dos puntos (simplificado)
     * @param {Object} point1 - Primer punto
     * @param {Object} point2 - Segundo punto
     * @returns {number} Pendiente en porcentaje
     */
    calculateSlope(point1, point2) {
        // En un caso real, necesitarías datos de elevación
        // Por ahora, simulamos una pendiente aleatoria entre 0-10%
        return Math.random() * 10;
    }

    /**
     * Estima el ancho de un segmento de ruta
     * @param {Object} point1 - Primer punto
     * @param {Object} point2 - Segundo punto
     * @returns {number} Ancho estimado en metros
     */
    estimateWidth(point1, point2) {
        // En un caso real, necesitarías datos de ancho real
        // Por ahora, simulamos un ancho entre 0.8-1.5 metros
        return 0.8 + Math.random() * 0.7;
    }

    /**
     * Estima el tipo de superficie de un segmento
     * @param {Object} point1 - Primer punto
     * @param {Object} point2 - Segundo punto
     * @returns {string} Tipo de superficie
     */
    estimateSurface(point1, point2) {
        // En un caso real, necesitarías datos de superficie real
        // Por ahora, simulamos un tipo de superficie
        const surfaces = this.standards.surfaces.allowed;
        return surfaces[Math.floor(Math.random() * surfaces.length)];
    }

    /**
     * Estima el nivel de iluminación de un segmento
     * @param {Object} point1 - Primer punto
     * @param {Object} point2 - Segundo punto
     * @returns {number} Nivel de iluminación en lux
     */
    estimateLighting(point1, point2) {
        // En un caso real, necesitarías datos de iluminación real
        // Por ahora, simulamos un nivel entre 30-250 lux
        return 30 + Math.random() * 220;
    }

    /**
     * Obtiene el nivel de iluminación basado en el valor en lux
     * @param {number} lighting - Nivel de iluminación en lux
     * @returns {string} Nivel de iluminación
     */
    getLightingLevel(lighting) {
        if (lighting < this.standards.lighting.minimum) {
            return 'insuficiente';
        } else if (lighting < this.standards.lighting.recommended) {
            return 'aceptable';
        } else if (lighting < this.standards.lighting.excellent) {
            return 'buena';
        } else {
            return 'excelente';
        }
    }

    /**
     * Estima la distancia entre dos puntos (fallback)
     * @param {Object} point1 - Primer punto
     * @param {Object} point2 - Segundo punto
     * @returns {number} Distancia estimada en metros
     */
    estimateDistance(point1, point2) {
        if (this.distanceCalculator) {
            return this.distanceCalculator.calculateDistance(point1.coords, point2.coords);
        }
        
        // Fallback: estimación simple
        const latDiff = Math.abs(point2.coords[0] - point1.coords[0]);
        const lngDiff = Math.abs(point2.coords[1] - point1.coords[1]);
        return Math.sqrt(latDiff * latDiff + lngDiff * lngDiff) * 111000; // Aproximación
    }

    /**
     * Obtiene recomendaciones de mejora para una ruta
     * @param {Object} validation - Resultado de validación
     * @param {string} accessibilityType - Tipo de accesibilidad
     * @returns {Array} Array de recomendaciones
     */
    getImprovementRecommendations(validation, accessibilityType) {
        const recommendations = [];

        if (validation.details.slopeValidation && !validation.details.slopeValidation.isValid) {
            recommendations.push({
                type: 'slope',
                priority: 'high',
                message: 'Instalar rampas o buscar ruta alternativa con menor pendiente',
                action: 'Considerar elevadores o rutas más planas'
            });
        }

        if (validation.details.widthValidation && !validation.details.widthValidation.isValid) {
            recommendations.push({
                type: 'width',
                priority: 'high',
                message: 'Ampliar el ancho del pasillo o buscar ruta alternativa',
                action: 'Verificar si se puede ampliar el paso o usar otra ruta'
            });
        }

        if (validation.details.surfaceValidation && !validation.details.surfaceValidation.isValid) {
            recommendations.push({
                type: 'surface',
                priority: 'medium',
                message: 'Mejorar la superficie del camino',
                action: 'Instalar superficie adecuada o buscar ruta alternativa'
            });
        }

        if (validation.details.lightingValidation && !validation.details.lightingValidation.isValid) {
            recommendations.push({
                type: 'lighting',
                priority: 'medium',
                message: 'Mejorar la iluminación del área',
                action: 'Instalar iluminación adicional o usar ruta mejor iluminada'
            });
        }

        if (validation.details.restValidation && !validation.details.restValidation.isValid) {
            recommendations.push({
                type: 'rest',
                priority: 'low',
                message: 'Agregar puntos de descanso intermedios',
                action: 'Instalar bancas o áreas de descanso'
            });
        }

        return recommendations;
    }

    /**
     * Obtiene estadísticas del validador
     * @returns {Object} Estadísticas del sistema
     */
    getStatistics() {
        return {
            standards: Object.keys(this.standards).length,
            slopeStandards: Object.keys(this.standards.slopes).length,
            widthStandards: Object.keys(this.standards.widths).length,
            surfaceTypes: this.standards.surfaces.allowed.length,
            lightingLevels: Object.keys(this.standards.lighting).length,
            distanceCalculatorConnected: this.distanceCalculator !== null
        };
    }
}

// Exportar la clase para uso global
window.RouteValidator = RouteValidator;

// Auto-inicialización cuando el DOM esté listo
$(document).ready(function() {
    console.log('✅ RouteValidator cargado y listo para usar');
});
