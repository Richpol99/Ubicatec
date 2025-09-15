/**
 * ARCHIVO DE PRUEBA DEL SISTEMA DE NAVEGACIÓN - UBICATEC
 * 
 * Este archivo contiene funciones de prueba para verificar
 * que el sistema de navegación funciona correctamente.
 * 
 * @author UBICATEC Team
 * @version 2.0
 * @since 2025
 */

// Función para probar el sistema completo
function testNavigationSystem() {
    console.log('🧪 Iniciando pruebas del sistema de navegación...');
    
    // Verificar que el sistema esté inicializado
    if (!window.unifiedNav || !window.unifiedNav.state.isInitialized) {
        console.error('❌ Sistema de navegación no inicializado');
        return false;
    }
    
    console.log('✅ Sistema de navegación inicializado');
    
    // Probar estadísticas del sistema
    const stats = window.unifiedNav.getSystemStatistics();
    console.log('📊 Estadísticas del sistema:', stats);
    
    // Probar búsqueda de edificios
    const edificio1 = window.unifiedNav.findBuildingByName('Edificio 1');
    console.log('🏢 Edificio 1 encontrado:', edificio1);
    
    const edificio3 = window.unifiedNav.findBuildingByName('Edificio 3');
    console.log('🏢 Edificio 3 encontrado:', edificio3);
    
    // Probar cálculo de ruta
    if (edificio1 && edificio3) {
        try {
            const route = window.unifiedNav.calculator.calculateRoute(
                edificio1.id, 
                edificio3.id, 
                'mobility'
            );
            console.log('🛣️ Ruta calculada:', route);
            console.log(`   Distancia: ${route.totalDistance.toFixed(1)}m`);
            console.log(`   Tiempo estimado: ${route.estimatedTime} minutos`);
            console.log(`   Nodos: ${route.path.length}`);
        } catch (error) {
            console.error('❌ Error calculando ruta:', error);
        }
    }
    
    // Probar navegación a edificio
    console.log('🧭 Probando navegación a Edificio 1...');
    window.unifiedNav.navigateToBuilding('Edificio 1');
    
    console.log('✅ Pruebas completadas');
    return true;
}

// Función para probar diferentes tipos de accesibilidad
function testAccessibilityTypes() {
    console.log('♿ Probando diferentes tipos de accesibilidad...');
    
    const types = ['wheelchair', 'visual', 'auditory', 'mobility'];
    
    types.forEach(type => {
        console.log(`🔍 Probando tipo: ${type}`);
        window.unifiedNav.setAccessibilityType(type);
        
        // Probar navegación con este tipo
        window.unifiedNav.navigateToBuilding('Edificio 3');
    });
}

// Función para mostrar información de un edificio
function showBuildingInfo(buildingName) {
    const building = window.unifiedNav.findBuildingByName(buildingName);
    if (building) {
        console.log(`🏢 Información de ${buildingName}:`, building);
        return building;
    } else {
        console.error(`❌ Edificio no encontrado: ${buildingName}`);
        return null;
    }
}

// Función para listar todos los edificios disponibles
function listAllBuildings() {
    console.log('📋 Listando todos los edificios disponibles...');
    
    const allNodes = window.unifiedNav.graph.getAllNodes();
    const buildings = allNodes.filter(node => node.type === 'building');
    
    console.log(`🏢 Total de edificios: ${buildings.length}`);
    buildings.forEach((building, index) => {
        console.log(`${index + 1}. ${building.name} (${building.id})`);
    });
    
    return buildings;
}

// Función para probar la conectividad del grafo
function testGraphConnectivity() {
    console.log('🔗 Probando conectividad del grafo...');
    
    const stats = window.unifiedNav.graph.getStatistics();
    console.log('📊 Estadísticas del grafo:', stats);
    
    // Probar algunas conexiones específicas
    const testConnections = [
        ['edif_1', 'edif_2'],
        ['edif_1', 'edif_3'],
        ['edif_2', 'edif_3'],
        ['acceso_principal', 'edif_1'],
        ['acceso_visitantes', 'edif_36']
    ];
    
    testConnections.forEach(([from, to]) => {
        const hasRoute = window.unifiedNav.calculator.hasRoute(from, to);
        console.log(`🔗 ${from} → ${to}: ${hasRoute ? '✅ Conectado' : '❌ No conectado'}`);
    });
}

// Función para limpiar la ruta actual
function clearCurrentRoute() {
    console.log('🧹 Limpiando ruta actual...');
    window.unifiedNav.clearRoute();
    console.log('✅ Ruta limpiada');
}

// Función para mostrar el estado del sistema
function showSystemStatus() {
    console.log('📊 Estado del Sistema de Navegación:');
    console.log('=====================================');
    
    if (window.unifiedNav) {
        const stats = window.unifiedNav.getSystemStatistics();
        console.log('Estado:', stats.isInitialized ? '✅ Inicializado' : '❌ No inicializado');
        console.log('Mapa:', stats.map ? '✅ Conectado' : '❌ No conectado');
        console.log('Nodos del grafo:', stats.graphStats?.totalNodes || 'N/A');
        console.log('Conexiones:', stats.graphStats?.totalConnections || 'N/A');
        console.log('Tipo de accesibilidad:', stats.currentAccessibilityType || 'N/A');
        console.log('Ubicación del usuario:', stats.userLocation ? '✅ Disponible' : '❌ No disponible');
        
        if (stats.currentRoute) {
            console.log('Ruta actual:');
            console.log(`  - Nodos: ${stats.currentRoute.pathLength}`);
            console.log(`  - Distancia: ${stats.currentRoute.totalDistance.toFixed(1)}m`);
            console.log(`  - Tiempo: ${stats.currentRoute.estimatedTime} min`);
        } else {
            console.log('Ruta actual: ❌ Ninguna');
        }
    } else {
        console.log('❌ Sistema de navegación no disponible');
    }
}

// Exportar funciones para uso global
window.testNavigationSystem = testNavigationSystem;
window.testAccessibilityTypes = testAccessibilityTypes;
window.showBuildingInfo = showBuildingInfo;
window.listAllBuildings = listAllBuildings;
window.testGraphConnectivity = testGraphConnectivity;
window.clearCurrentRoute = clearCurrentRoute;
window.showSystemStatus = showSystemStatus;

// Auto-ejecutar pruebas cuando el sistema esté listo
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        if (window.unifiedNav && window.unifiedNav.state.isInitialized) {
            console.log('🎯 Sistema listo, ejecutando pruebas automáticas...');
            testNavigationSystem();
        }
    }, 2000); // Esperar 2 segundos para que todo se inicialice
});

console.log('🧪 Archivo de pruebas del sistema de navegación cargado');
console.log('💡 Usa las funciones de prueba en la consola:');
console.log('   - testNavigationSystem()');
console.log('   - testAccessibilityTypes()');
console.log('   - showBuildingInfo("Edificio 1")');
console.log('   - listAllBuildings()');
console.log('   - testGraphConnectivity()');
console.log('   - clearCurrentRoute()');
console.log('   - showSystemStatus()');
