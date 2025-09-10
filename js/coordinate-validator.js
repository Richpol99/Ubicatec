// Validador de coordenadas para UBICATEC
class CoordinateValidator {
    constructor() {
        // Tolerancia para considerar coordenadas como "iguales" (en metros)
        this.tolerance = 10; // 10 metros de tolerancia
        
        // Referencias a los sistemas
        this.campusNodes = null;
        this.originalBuildings = null;
        
        // Resultados de validación
        this.validationResults = {
            total: 0,
            valid: 0,
            invalid: 0,
            adjusted: 0,
            discrepancies: []
        };
        
        console.log('🔍 Validador de coordenadas inicializado');
    }

    // Conectar con el sistema de nodos
    setCampusNodes(campusNodes) {
        this.campusNodes = campusNodes;
        this.originalBuildings = this.getOriginalBuildingsData();
    }

    // Obtener datos originales de edificios del sistema actual
    getOriginalBuildingsData() {
        return [
            { nombre: "Edificio 1 (direccion)", coords: [19.0700471611661, -98.16987998532049], tipo: "administrativo" },
            { nombre: "Edificio 2 (coordinacion)", coords: [19.070339683584418, -98.16984213200494], tipo: "administrativo" },
            { nombre: "Edificio 3 (Sistemas y Computacion)", coords: [19.07028250570129, -98.1691442328977], tipo: "laboratorio" },
            { nombre: "Edificio 4 (Aulas, WC)", coords: [19.070338275809316, -98.16871239724523], tipo: "aula" },
            { nombre: "Edificio 5 (Aulas)", coords: [19.070279970696365, -98.16838516772772], tipo: "aula" },
            { nombre: "Edificio 6 (Desarrollo Academico y C.E.S.A)", coords: [19.070056890074806, -98.16867484631699], tipo: "administrativo" },
            { nombre: "Edificio 7 (Aula de clases)", coords: [19.069965, -98.168309], tipo: "aula" },
            { nombre: "Edificio 8 (Aulas)", coords: [19.0697161, -98.1687085], tipo: "aula" },
            { nombre: "Edificio 9 (Aulas y cubiculos para maestros)", coords: [19.0696648, -98.1683283], tipo: "aula" },
            { nombre: "Edificio 10 (Depto. Ciencias economico administrativas)", coords: [19.069675, -98.168104], tipo: "administrativo" },
            { nombre: "Edificio 11 (Aulas y portico)", coords: [19.069590, -98.169141], tipo: "aula" },
            { nombre: "Edificio 12 (Aulas portico, WC)", coords: [19.069453, -98.168654], tipo: "aula" },
            { nombre: "Edificio 13 (Aulas)", coords: [19.0693308, -98.1681797], tipo: "aula" },
            { nombre: "Edificio 14 (Aulas, Galileo Galilei)", coords: [19.069386, -98.169351], tipo: "aula" },
            { nombre: "Edificio 15 (Aulas)", coords: [19.069281, -98.168944], tipo: "aula" },
            { nombre: "Edificio 16 (Cubiculos para profesores)", coords: [19.069341, -98.170290], tipo: "administrativo" },
            { nombre: "Edificio 17 (Aulas y sala de titulacion)", coords: [19.069322, -98.169910], tipo: "aula" },
            { nombre: "Edificio 18 (WC, Portico, Aula Jean Piaget)", coords: [19.069206, -98.169657], tipo: "aula" },
            { nombre: "Edificio 19 (Laboratorio de Fisica y Quimica)", coords: [19.069084, -98.169326], tipo: "laboratorio" },
            { nombre: "Edificio 20 (Laboratorio de Ingenieria Electrica)", coords: [19.069205695460248, -98.16860064509656], tipo: "laboratorio" },
            { nombre: "Edificio 21 (Depto. Economico administrativo. Lab de negocios)", coords: [19.068948, -98.168838], tipo: "administrativo" },
            { nombre: "Edificio 22 (Aulas)", coords: [19.069201, -98.170032], tipo: "aula" },
            { nombre: "Edificio 23 (Aulas)", coords: [19.068833, -98.170307], tipo: "aula" },
            { nombre: "Edificio 24 (Sala T.Alva E. Sala A.Einstein. Sala W.E.Deming)", coords: [19.068907, -98.169477], tipo: "aula" },
            { nombre: "Edificio 25 (Servicio Medico)", coords: [19.068845419565694, -98.16910953816078], tipo: "administrativo" },
            { nombre: "Edificio 26 (Aulas)", coords: [19.0688019, -98.1688332], tipo: "aula" },
            { nombre: "Edificio 27 (Lab. Ing Mecanica)", coords: [19.068793, -98.168558], tipo: "laboratorio" },
            { nombre: "Edificio 28 (Aulas)", coords: [19.068603, -98.170041], tipo: "aula" },
            { nombre: "Edificio 29 (Posgrado)", coords: [19.068590, -98.169251], tipo: "administrativo" },
            { nombre: "Edificio 30 (Manufactura avanzada Lab; y depto. Metal mecanica)", coords: [19.0684055, -98.1689559], tipo: "laboratorio" },
            { nombre: "Edificio 31 (Coordinacion cultural)", coords: [19.0684058, -98.1685666], tipo: "administrativo" },
            { nombre: "Edificio 32 (Exsub-Estacion electrica 1)", coords: [19.068168, -98.168593], tipo: "otro" },
            { nombre: "Edificio 33 (Lab. Desarrollo tecnico e innovacion)", coords: [19.068213, -98.169197], tipo: "laboratorio" },
            { nombre: "Edificio 34 (Coordinacion cultural)", coords: [19.068175, -98.169059], tipo: "administrativo" },
            { nombre: "Edificio 35 (Lab. Ing electronica)", coords: [19.068176, -98.168952], tipo: "laboratorio" },
            { nombre: "Edificio 36 (Centro de computo y lab de sistemas, WC)", coords: [19.068163, -98.170270], tipo: "laboratorio" },
            { nombre: "Edificio 37 (Sub-Estacion electrica 2)", coords: [19.067984, -98.170599], tipo: "otro" },
            { nombre: "Edificio 38 (Cuarto de maq. Coordinacion deportiva, WC)", coords: [19.067226, -98.168782], tipo: "baño" },
            { nombre: "Edificio 39 (Utileria de coordinacion cultural)", coords: [19.067036, -98.168557], tipo: "otro" },
            { nombre: "Edificio 40 (Laboratorio de posgrado-Proyecto)", coords: [19.067282, -98.170378], tipo: "laboratorio" },
            { nombre: "Edificio 41 (Centro de lenguas extranjeras-Lab. Logistica)", coords: [19.071208, -98.169903], tipo: "administrativo" },
            { nombre: "Edificio 42 (Edificio de Sep Federal)", coords: [19.071135, -98.169291], tipo: "administrativo" },
            { nombre: "Edificio 43 (Recursos materiales y servicios)", coords: [19.0670547, -98.1706309], tipo: "administrativo" },
            { nombre: "Edificio 44 (Sub-Estacion Electrica 3-Centro de vinculacion)", coords: [19.071905, -98.169451], tipo: "administrativo" },
            { nombre: "Edificio 45 (Unidad academica departamental-Ing. Industrial)", coords: [19.070917, -98.168811], tipo: "administrativo" },
            { nombre: "Edificio 46 (Sub-Estacion Electrica de U. A. Departamental)", coords: [19.070816, -98.168218], tipo: "otro" },
            { nombre: "Edificio 47 (Almacen activo fijo)", coords: [19.067090, -98.168774], tipo: "otro" },
            { nombre: "Edificio 48 (Almacen de servicios generales)", coords: [19.0670829, -98.1705089], tipo: "otro" },
            { nombre: "Edificio 49 (Lab. Ing Electronica)", coords: [19.069142, -98.168277], tipo: "laboratorio" },
            { nombre: "Edificio 50 (Centro de Informacion, WC)", coords: [19.067422488611665, -98.169682206123], tipo: "administrativo" },
            { nombre: "Edificio 51 (Unidad academica departamental-Ing. Mecanica)", coords: [19.071552, -98.169811], tipo: "administrativo" },
            { nombre: "Edificio 52 (Sala de titulacion)", coords: [19.069555, -98.169899], tipo: "administrativo" },
            { nombre: "Edificio 53 (Ciencias basicas, WC)", coords: [19.070834, -98.169673], tipo: "aula" }
        ];
    }

    // Validar todas las coordenadas
    validateAllCoordinates() {
        if (!this.campusNodes || !this.originalBuildings) {
            console.log('❌ Sistemas no disponibles para validación');
            return null;
        }

        console.log('🔍 Iniciando validación de coordenadas...');
        
        // Resetear resultados
        this.validationResults = {
            total: 0,
            valid: 0,
            invalid: 0,
            adjusted: 0,
            discrepancies: []
        };

        // Obtener nodos del sistema actual
        const currentNodes = this.campusNodes.exportNodes().filter(node => node.type === 'building');
        
        this.validationResults.total = currentNodes.length;

        // Validar cada nodo
        currentNodes.forEach(node => {
            const originalBuilding = this.findOriginalBuilding(node.name);
            
            if (originalBuilding) {
                const distance = this.calculateDistance(node.coords, originalBuilding.coords);
                const isValid = distance <= this.tolerance;
                
                if (isValid) {
                    this.validationResults.valid++;
                } else {
                    this.validationResults.invalid++;
                    this.validationResults.discrepancies.push({
                        name: node.name,
                        current: node.coords,
                        original: originalBuilding.coords,
                        distance: distance,
                        type: 'coordinate_mismatch'
                    });
                }
            } else {
                this.validationResults.invalid++;
                this.validationResults.discrepancies.push({
                    name: node.name,
                    current: node.coords,
                    original: null,
                    distance: null,
                    type: 'building_not_found'
                });
            }
        });

        console.log('✅ Validación completada');
        return this.validationResults;
    }

    // Encontrar edificio original por nombre
    findOriginalBuilding(name) {
        return this.originalBuildings.find(building => 
            building.nombre.toLowerCase().includes(name.toLowerCase()) ||
            name.toLowerCase().includes(building.nombre.toLowerCase())
        );
    }

    // Calcular distancia entre coordenadas
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

    // Ajustar coordenadas si es necesario
    adjustCoordinates() {
        if (!this.validationResults.discrepancies.length) {
            console.log('✅ No hay coordenadas que ajustar');
            return;
        }

        console.log('🔧 Ajustando coordenadas...');
        
        this.validationResults.discrepancies.forEach(discrepancy => {
            if (discrepancy.type === 'coordinate_mismatch' && discrepancy.original) {
                // Ajustar coordenada en el sistema de nodos
                const node = this.campusNodes.findNodeById(discrepancy.name);
                if (node) {
                    node.coords = discrepancy.original;
                    this.validationResults.adjusted++;
                    console.log(`✅ Coordenada ajustada para ${discrepancy.name}`);
                }
            }
        });
    }

    // Verificar precisión de ubicaciones
    checkLocationAccuracy() {
        if (!this.campusNodes) {
            console.log('❌ Sistema de nodos no disponible');
            return null;
        }

        const nodes = this.campusNodes.exportNodes().filter(node => node.type === 'building');
        const accuracyReport = {
            total: nodes.length,
            highPrecision: 0,    // < 5 metros
            mediumPrecision: 0,  // 5-20 metros
            lowPrecision: 0,     // > 20 metros
            issues: []
        };

        nodes.forEach(node => {
            const originalBuilding = this.findOriginalBuilding(node.name);
            
            if (originalBuilding) {
                const distance = this.calculateDistance(node.coords, originalBuilding.coords);
                
                if (distance < 5) {
                    accuracyReport.highPrecision++;
                } else if (distance < 20) {
                    accuracyReport.mediumPrecision++;
                } else {
                    accuracyReport.lowPrecision++;
                    accuracyReport.issues.push({
                        name: node.name,
                        distance: distance,
                        severity: distance > 50 ? 'high' : 'medium'
                    });
                }
            }
        });

        return accuracyReport;
    }

    // Generar reporte de validación
    generateValidationReport() {
        const report = {
            timestamp: new Date().toISOString(),
            summary: this.validationResults,
            accuracy: this.checkLocationAccuracy(),
            recommendations: this.generateRecommendations()
        };

        return report;
    }

    // Generar recomendaciones basadas en la validación
    generateRecommendations() {
        const recommendations = [];
        
        if (this.validationResults.invalid > 0) {
            recommendations.push({
                type: 'coordinate_accuracy',
                priority: 'high',
                message: `${this.validationResults.invalid} edificios tienen coordenadas imprecisas`,
                action: 'Revisar y ajustar coordenadas en el sistema'
            });
        }

        if (this.validationResults.discrepancies.some(d => d.type === 'building_not_found')) {
            recommendations.push({
                type: 'missing_buildings',
                priority: 'medium',
                message: 'Algunos edificios no se encontraron en los datos originales',
                action: 'Verificar nombres de edificios en el sistema'
            });
        }

        if (this.validationResults.valid / this.validationResults.total > 0.9) {
            recommendations.push({
                type: 'system_quality',
                priority: 'low',
                message: 'Sistema de coordenadas en buen estado',
                action: 'Continuar con el desarrollo normal'
            });
        }

        return recommendations;
    }

    // Exportar reporte a JSON
    exportReport() {
        const report = this.generateValidationReport();
        const dataStr = JSON.stringify(report, null, 2);
        const dataBlob = new Blob([dataStr], {type: 'application/json'});
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = `coordinate-validation-report-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
    }

    // Obtener estadísticas de validación
    getValidationStats() {
        return {
            ...this.validationResults,
            accuracyRate: this.validationResults.total > 0 ? 
                (this.validationResults.valid / this.validationResults.total * 100).toFixed(2) + '%' : '0%'
        };
    }
}

// Exportar la clase para uso global
window.CoordinateValidator = CoordinateValidator;

// Auto-inicialización cuando el DOM esté listo
$(document).ready(function() {
    console.log('🔍 CoordinateValidator cargado y listo para usar');
});
