/**
 * SISTEMA DE MODALES DE ACCESIBILIDAD - UBICATEC
 * 
 * Este archivo implementa los modales de configuración para la selección
 * de tipos de accesibilidad y personalización de rutas.
 * 
 * @author UBICATEC Team
 * @version 1.0
 * @since 2025
 */

class AccessibilityModal {
    constructor() {
        // Estado del modal
        this.isOpen = false;
        this.currentAccessibilityType = 'mobility'; // Solo movilidad limitada
        this.selectedStart = null;
        this.selectedEnd = null;
        
        // Referencias a elementos DOM
        this.modalElement = null;
        this.startSelect = null;
        this.endSelect = null;
        
        // Callbacks
        this.onRouteCalculate = null;
        this.onAccessibilityChange = null;
        
        // Referencia al sistema de nodos
        this.nodesSystem = null;
        
        console.log('🎛️ AccessibilityModal inicializado con ID:', Math.random().toString(36).substr(2, 9));
    }
    
    /**
     * Inicializa el modal y crea los elementos DOM
     */
    init() {
        this.createModalHTML();
        this.bindEvents();
        console.log('🎛️ AccessibilityModal inicializado con DOM');
    }
    
    /**
     * Crea el HTML del modal
     */
    createModalHTML() {
        const modalHTML = `
            <div id="accessibilityModal" class="modal fade" tabindex="-1" role="dialog" aria-labelledby="accessibilityModalLabel" aria-hidden="true">
                <div class="modal-dialog modal-lg" role="document">
                    <div class="modal-content">
                        <div class="modal-header" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white;">
                            <h5 class="modal-title" id="accessibilityModalLabel">
                                🚶 Rutas para Movilidad Limitada
                            </h5>
                            <button type="button" class="close text-white" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div class="modal-body">
                            <!-- Sección de Selección de Destino -->
                            <div class="destination-section mb-4">
                                <h6 class="text-primary mb-3">🎯 Selecciona tu destino</h6>
                                <div class="alert alert-info mb-3">
                                    <small><strong>ℹ️ Información importante:</strong> Solo los edificios mostrados tienen rutas accesibles y seguras. Si necesitas ir a otro edificio, contacta con servicios de accesibilidad.</small>
                                </div>
                                <div class="row">
                                    <div class="col-md-6">
                                        <label for="startBuilding" class="form-label">Punto de Inicio</label>
                                        <select class="form-control" id="startBuilding">
                                            <option value="">Selecciona tu ubicación actual...</option>
                                        </select>
                                    </div>
                                    <div class="col-md-6">
                                        <label for="endBuilding" class="form-label">Destino</label>
                                        <select class="form-control" id="endBuilding">
                                            <option value="">Selecciona tu destino...</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            
                            <!-- Sección de Opciones Avanzadas -->
                            <div class="advanced-options mb-4">
                                <h6 class="text-primary mb-3">⚙️ Opciones Avanzadas</h6>
                                <div class="row">
                                    <div class="col-md-6">
                                        <div class="form-check">
                                            <input class="form-check-input" type="checkbox" id="avoidStairs" checked>
                                            <label class="form-check-label" for="avoidStairs">
                                                Evitar escaleras
                                            </label>
                                        </div>
                                        <div class="form-check">
                                            <input class="form-check-input" type="checkbox" id="preferElevators" checked>
                                            <label class="form-check-label" for="preferElevators">
                                                Preferir elevadores
                                            </label>
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <div class="form-check">
                                            <input class="form-check-input" type="checkbox" id="wellLit" checked>
                                            <label class="form-check-label" for="wellLit">
                                                Rutas bien iluminadas
                                            </label>
                                        </div>
                                        <div class="form-check">
                                            <input class="form-check-input" type="checkbox" id="shortestRoute">
                                            <label class="form-check-label" for="shortestRoute">
                                                Ruta más corta (menos accesible)
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <!-- Información de la Ruta Seleccionada -->
                            <div id="routeInfo" class="route-info-section" style="display: none;">
                                <h6 class="text-success mb-3">✅ Información de la Ruta</h6>
                                <div class="alert alert-info">
                                    <div id="routeDetails">
                                        <!-- Se llenará dinámicamente -->
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancelar</button>
                            <button type="button" class="btn btn-primary" id="calculateRouteBtn" disabled>
                                <i class="fas fa-route"></i> Calcular Ruta
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Agregar el modal al body si no existe
        if (!document.getElementById('accessibilityModal')) {
            console.log('🏗️ Creando modal en el DOM...');
            document.body.insertAdjacentHTML('beforeend', modalHTML);
        } else {
            console.log('⚠️ Modal ya existe en el DOM');
        }
        
        // Guardar referencias
        this.modalElement = document.getElementById('accessibilityModal');
        this.startSelect = document.getElementById('startBuilding');
        this.endSelect = document.getElementById('endBuilding');
        
        console.log('🎛️ Referencias del modal:', {
            modalElement: this.modalElement,
            startSelect: this.startSelect,
            endSelect: this.endSelect
        });
    }
    
    /**
     * Vincula eventos del modal
     */
    bindEvents() {
        // Selects de edificios
        this.startSelect.addEventListener('change', () => {
            this.selectedStart = this.startSelect.value;
            this.updateCalculateButton();
        });
        
        this.endSelect.addEventListener('change', () => {
            this.selectedEnd = this.endSelect.value;
            this.updateCalculateButton();
        });
        
        // Botón de calcular ruta
        document.getElementById('calculateRouteBtn').addEventListener('click', () => {
            this.calculateRoute();
        });
        
        // Eventos del modal
        this.modalElement.addEventListener('hidden.bs.modal', () => {
            this.isOpen = false;
        });
        
        this.modalElement.addEventListener('shown.bs.modal', () => {
            this.isOpen = true;
        });
    }
    
    
    /**
     * Actualiza el estado del botón de calcular ruta
     */
    updateCalculateButton() {
        const calculateBtn = document.getElementById('calculateRouteBtn');
        const hasSelection = this.selectedStart && this.selectedEnd;
        
        calculateBtn.disabled = !hasSelection;
        
        if (hasSelection) {
            calculateBtn.classList.remove('btn-primary');
            calculateBtn.classList.add('btn-success');
            calculateBtn.innerHTML = '<i class="fas fa-route"></i> Calcular Ruta';
        } else {
            calculateBtn.classList.remove('btn-success');
            calculateBtn.classList.add('btn-primary');
            calculateBtn.innerHTML = '<i class="fas fa-route"></i> Calcular Ruta';
        }
    }
    
    /**
     * Calcula la ruta seleccionada
     */
    calculateRoute() {
        console.log('🛣️ calculateRoute llamado con estado:', {
            selectedStart: this.selectedStart,
            selectedEnd: this.selectedEnd,
            currentAccessibilityType: this.currentAccessibilityType
        });
        
        if (!this.selectedStart || !this.selectedEnd) {
            alert('Por favor selecciona un punto de inicio y destino.');
            console.log('❌ Faltan datos para calcular la ruta');
            return;
        }
        
        const routeOptions = {
            start: this.selectedStart,
            end: this.selectedEnd,
            accessibilityType: this.currentAccessibilityType,
            options: {
                avoidStairs: document.getElementById('avoidStairs').checked,
                preferElevators: document.getElementById('preferElevators').checked,
                wellLit: document.getElementById('wellLit').checked,
                shortestRoute: document.getElementById('shortestRoute').checked
            }
        };
        
        console.log('🛣️ Calculando ruta con opciones:', routeOptions);
        
        // Notificar al sistema principal
        console.log('🔍 Verificando callback onRouteCalculate:', {
            exists: !!this.onRouteCalculate,
            type: typeof this.onRouteCalculate,
            value: this.onRouteCalculate
        });
        
        if (this.onRouteCalculate) {
            console.log('✅ Llamando callback onRouteCalculate');
            this.onRouteCalculate(routeOptions);
        } else {
            console.error('❌ Callback onRouteCalculate no está configurado');
            console.error('❌ Estado del modal:', {
                isOpen: this.isOpen,
                currentAccessibilityType: this.currentAccessibilityType,
                selectedStart: this.selectedStart,
                selectedEnd: this.selectedEnd
            });
        }
        
        // Cerrar modal
        this.hide();
    }
    
    /**
     * Refresca la lista de edificios desde el sistema global
     */
    refreshBuildings() {
        console.log('🔄 Refrescando lista de edificios...');
        console.log('🔍 Estado del callback antes del refresh:', {
            onRouteCalculate: !!this.onRouteCalculate,
            type: typeof this.onRouteCalculate
        });
        
        // Usar la referencia del sistema de nodos si está disponible
        if (this.nodesSystem && typeof this.nodesSystem.getBuildings === 'function') {
            try {
                const buildings = this.nodesSystem.getBuildings();
                console.log('🏢 Edificios refrescados desde sistema:', buildings);
                
                if (buildings && buildings.length > 0) {
                    this.loadBuildings(buildings);
                    console.log('✅ Edificios refrescados exitosamente');
                } else {
                    console.warn('⚠️ No se encontraron edificios al refrescar');
                }
            } catch (error) {
                console.error('❌ Error refrescando edificios desde sistema:', error);
            }
        } else {
            console.warn('⚠️ Sistema de nodos no está disponible');
            console.log('🔍 Estado del modal:', {
                nodesSystem: this.nodesSystem,
                onRouteCalculate: this.onRouteCalculate
            });
        }
        
        console.log('🔍 Estado del callback después del refresh:', {
            onRouteCalculate: !!this.onRouteCalculate,
            type: typeof this.onRouteCalculate
        });
    }
    
    /**
     * Muestra el modal
     */
    show() {
        console.log('🎛️ Mostrando modal - Estado del callback:', {
            onRouteCalculate: !!this.onRouteCalculate,
            type: typeof this.onRouteCalculate
        });
        
        // Recargar edificios antes de mostrar el modal (solo si no están cargados)
        if (!this.startSelect || this.startSelect.options.length <= 1) {
            console.log('🔄 Recargando edificios porque no están cargados...');
            if (this.nodesSystem && typeof this.nodesSystem.getBuildings === 'function') {
                try {
                    const buildings = this.nodesSystem.getBuildings();
                    console.log('🏢 Edificios obtenidos desde sistema en show():', buildings);
                    this.loadBuildings(buildings);
                } catch (error) {
                    console.error('❌ Error obteniendo edificios en show():', error);
                }
            } else {
                console.warn('⚠️ Sistema de nodos no disponible en show()');
                this.refreshBuildings();
            }
        } else {
            console.log('✅ Edificios ya están cargados, no es necesario recargar');
        }
        
        // Verificar que el callback sigue configurado después de cualquier operación
        if (!this.onRouteCalculate) {
            console.error('❌ CRÍTICO: Callback perdido durante show(), intentando recuperar...');
            // Intentar recuperar el callback desde el scope global
            if (typeof handleRouteCalculation !== 'undefined') {
                this.onRouteCalculate = handleRouteCalculation;
                console.log('✅ Callback recuperado desde scope global');
            } else {
                console.error('❌ No se pudo recuperar el callback');
            }
        }
        
        if (typeof $ !== 'undefined' && $.fn.modal) {
            // Usar Bootstrap modal si está disponible
            $(this.modalElement).modal({
                backdrop: true, // Mantener el overlay
                keyboard: true,
                focus: true,
                show: true
            });
        } else {
            // Fallback para mostrar el modal
            this.modalElement.style.display = 'block';
            this.modalElement.classList.add('show');
            // Agregar overlay si no existe
            if (!document.querySelector('.modal-backdrop')) {
                const backdrop = document.createElement('div');
                backdrop.className = 'modal-backdrop fade show';
                backdrop.style.zIndex = '1054';
                document.body.appendChild(backdrop);
            }
        }
        
        this.isOpen = true;
        console.log('🎛️ Modal de accesibilidad mostrado');
    }
    
    /**
     * Oculta el modal
     */
    hide() {
        if (typeof $ !== 'undefined' && $.fn.modal) {
            // Usar Bootstrap modal si está disponible
            $(this.modalElement).modal('hide');
        } else {
            // Fallback para ocultar el modal
            this.modalElement.style.display = 'none';
            this.modalElement.classList.remove('show');
            // Limpiar backdrop si existe
            const backdrop = document.querySelector('.modal-backdrop');
            if (backdrop) {
                backdrop.remove();
            }
        }
        
        this.isOpen = false;
        console.log('🎛️ Modal de accesibilidad oculto');
    }
    
    /**
     * Carga la lista de edificios en los selects
     * @param {Array} buildings - Lista de edificios
     */
    loadBuildings(buildings) {
        if (!buildings || !Array.isArray(buildings)) {
            console.error('❌ Lista de edificios no válida');
            return;
        }
        
        // Limpiar selects
        if (this.startSelect) {
            this.startSelect.innerHTML = '<option value="">Selecciona tu ubicación actual...</option>';
        }
        if (this.endSelect) {
            this.endSelect.innerHTML = '<option value="">Selecciona tu destino...</option>';
        }
        
        // Agregar edificios
        buildings.forEach((building) => {
            const option1 = new Option(building.name, building.id);
            const option2 = new Option(building.name, building.id);
            
            if (this.startSelect) {
                this.startSelect.add(option1);
            }
            
            if (this.endSelect) {
                this.endSelect.add(option2);
            }
        });
        
        console.log(`🏢 ${buildings.length} edificios cargados en el modal`);
    }
    
    /**
     * Muestra información de la ruta calculada
     * @param {Object} route - Ruta calculada
     */
    showRouteInfo(route) {
        const routeInfoSection = document.getElementById('routeInfo');
        const routeDetails = document.getElementById('routeDetails');
        
        if (!route) {
            routeInfoSection.style.display = 'none';
            return;
        }
        
        const infoHTML = `
            <div class="row">
                <div class="col-md-6">
                    <strong>Distancia:</strong> ${route.totalDistance.toFixed(1)} metros<br>
                    <strong>Tiempo estimado:</strong> ${route.estimatedTime.toFixed(1)} minutos<br>
                    <strong>Nodos en la ruta:</strong> ${route.path.length}
                </div>
                <div class="col-md-6">
                    <strong>Tipo:</strong> ${this.getAccessibilityLabel(route.accessibilityType)}<br>
                    <strong>Algoritmo:</strong> ${route.metadata.algorithm}<br>
                    <strong>Calculado:</strong> ${new Date(route.metadata.calculatedAt).toLocaleString()}
                </div>
            </div>
        `;
        
        routeDetails.innerHTML = infoHTML;
        routeInfoSection.style.display = 'block';
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
     * Establece callback para cálculo de rutas
     * @param {Function} callback - Función callback
     */
    setOnRouteCalculate(callback) {
        this.onRouteCalculate = callback;
        console.log('🔗 Callback onRouteCalculate configurado:', {
            type: typeof callback,
            exists: !!callback,
            callback: callback
        });
    }
    
    /**
     * Establece callback para cambio de accesibilidad
     * @param {Function} callback - Función callback
     */
    setOnAccessibilityChange(callback) {
        this.onAccessibilityChange = callback;
    }
    
    /**
     * Establece la referencia al sistema de nodos
     * @param {Object} nodesSystem - Sistema de nodos
     */
    setNodesSystem(nodesSystem) {
        this.nodesSystem = nodesSystem;
        console.log('🔗 Sistema de nodos configurado en el modal:', {
            nodesSystem: !!nodesSystem,
            type: typeof nodesSystem,
            hasGetBuildings: nodesSystem && typeof nodesSystem.getBuildings === 'function'
        });
    }
    
    /**
     * Obtiene el estado actual del modal
     * @returns {Object} Estado actual
     */
    getState() {
        return {
            isOpen: this.isOpen,
            currentAccessibilityType: this.currentAccessibilityType, // Siempre 'mobility'
            selectedStart: this.selectedStart,
            selectedEnd: this.selectedEnd,
            options: {
                avoidStairs: document.getElementById('avoidStairs').checked,
                preferElevators: document.getElementById('preferElevators').checked,
                wellLit: document.getElementById('wellLit').checked,
                shortestRoute: document.getElementById('shortestRoute').checked
            }
        };
    }
    
    /**
     * Destruye el modal y limpia recursos
     */
    destroy() {
        if (this.modalElement) {
            this.modalElement.remove();
        }
        
        this.modalElement = null;
        this.startSelect = null;
        this.endSelect = null;
        
        console.log('🗑️ AccessibilityModal destruido');
    }
}

// Exportar para uso global
window.AccessibilityModal = AccessibilityModal;
