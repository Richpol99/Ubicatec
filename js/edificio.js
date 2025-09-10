$(document).ready(function() {
    // Obtener el ID del edificio desde la URL
    const urlParams = new URLSearchParams(window.location.search);
    const edificioId = urlParams.get('id') || '1';
    
    // Cargar datos del edificio
    loadEdificioData(edificioId);
});

async function loadEdificioData(edificioId) {
    try {
        // Cargar datos desde el archivo JSON
        const response = await fetch('data/edificios.json');
        const data = await response.json();
        
        // Buscar el edificio por ID
        const edificio = data.edificios.find(ed => ed.id == edificioId);
        
        if (edificio) {
            renderEdificioContent(edificio);
        } else {
            showError('Edificio no encontrado');
        }
    } catch (error) {
        console.error('Error cargando datos:', error);
        showError('Error al cargar la información del edificio');
    }
}

function renderEdificioContent(edificio) {
    // Actualizar título de la página
    document.getElementById('page-title').textContent = edificio.nombre;
    
    // Crear el contenido HTML
    const content = `
        <div class="mapa-campus-section text-center">
            <div class="container text-center">
                <h2 class="titulo-mapa">${edificio.nombre}</h2>
            </div>
        </div>

        <section id="ficha-edificio" class="bg-light py-5">
            <div class="container">
                <div class="row">
                    <div class="col-md-12 text-center" data-aos="fade-up">
                        <p class="section-sub-title">Ubicación: Campus Tec</p>
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-6">
                        <img src="${edificio.imagen}" alt="${edificio.nombre}" 
                             class="img-fluid" style="border-radius: 8px; margin-bottom: 20px;">
                        ${edificio.imagen_360 ? `
                            <div class="mt-3 mb-3">
                                <button id="ver360Btn" class="btn btn-info">
                                    <i class="fas fa-globe"></i> Ver en 360°
                                </button>
                            </div>
                        ` : ''}
                        <button id="verUbicacionBtn" class="btn btn-primary mt-3" style="margin-bottom: 35px;">
                            Haz clic para ir ahí
                        </button>
                    </div>
                    <div class="col-md-6 text-left">
                        <h4>Descripción:</h4>
                        <p>${edificio.descripcion}</p>
                        <h4>Instalaciones:</h4>
                        <ul>
                            ${edificio.instalaciones.map(inst => 
                                `<li><i class="fas fa-building"></i> ${inst}</li>`
                            ).join('')}
                        </ul>
                        <h4>Horario de Atención:</h4>
                        <p>${edificio.horario}</p>
                    </div>
                </div>

                <div id="mapaEmergente" style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 80%; height: 80%; background-color: white; border: 1px solid #ccc; box-shadow: 0 0 10px rgba(0,0,0,0.2); z-index: 1000; display: none;">
                    <div id="distanciaEnMapa" style="padding: 10px; text-align: center;"></div>
                    <div id="mapa" style="width: 100%; height: 85%;"></div>
                    <button id="cerrarMapaBtn" class="btn btn-secondary mt-2" style="width: 100%; box-sizing: border-box;">Cerrar</button>
                </div>
            </div>
        </section>
    `;
    
    // Insertar el contenido en el div principal
    document.getElementById('edificio-content').innerHTML = content;
    
    // Inicializar funcionalidades del mapa
    initializeMapFeatures(edificio);
    
    // Inicializar visor 360° si existe
    console.log('Edificio:', edificio.nombre, 'Tiene imagen 360°:', !!edificio.imagen_360);
    if (edificio.imagen_360) {
        console.log('Inicializando visor 360° con imagen:', edificio.imagen_360);
        initialize360Viewer(edificio.imagen_360);
    }
}

function initializeMapFeatures(edificio) {
    // Variables para el mapa
    let mapa;
    let marcadorDestino;
    let marcadorUsuario;
    let llegadaNotificada = false;
    
    // Elementos del DOM
    const mapaEmergente = document.getElementById('mapaEmergente');
    const verUbicacionBtn = document.getElementById('verUbicacionBtn');
    const cerrarMapaBtn = document.getElementById('cerrarMapaBtn');
    const avisoModal = document.getElementById('avisoModal');
    const cerrarAvisoBtn = document.getElementById('cerrarAvisoBtn');
    const continuarBtn = document.getElementById('continuarBtn');
    const llegadaModal = document.getElementById('llegadaModal');
    const cerrarLlegadaBtn = document.getElementById('cerrarLlegadaBtn');
    const cerrarLlegadaOkBtn = document.getElementById('cerrarLlegadaOkBtn');
    const distanciaEnMapaElement = document.getElementById('distanciaEnMapa');
    
    // Event listeners
    verUbicacionBtn.addEventListener('click', () => {
        avisoModal.style.display = 'block';
    });
    
    cerrarAvisoBtn.addEventListener('click', () => {
        avisoModal.style.display = 'none';
    });
    
    continuarBtn.addEventListener('click', () => {
        avisoModal.style.display = 'none';
        mapaEmergente.style.display = 'block';
        inicializarMapa();
        llegadaNotificada = false;
    });
    
    cerrarMapaBtn.addEventListener('click', () => {
        mapaEmergente.style.display = 'none';
        if (mapa) {
            mapa.remove();
            mapa = null;
            marcadorDestino = null;
            marcadorUsuario = null;
        }
    });
    
    cerrarLlegadaBtn.addEventListener('click', () => {
        llegadaModal.style.display = 'none';
    });
    
    cerrarLlegadaOkBtn.addEventListener('click', () => {
        llegadaModal.style.display = 'none';
    });
    
    function inicializarMapa() {
        mapa = L.map('mapa').setView([19.0733, -98.2889], 20);
        
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(mapa);
        
        // Marcador del destino
        marcadorDestino = L.marker(edificio.coords).addTo(mapa)
            .bindPopup(`<b>${edificio.nombre}</b>`).openPopup();
        
        // Icono personalizado para el usuario
        const iconoUsuario = L.icon({
            iconUrl: 'Icon/user.png',
            iconSize: [27, 35],
            iconAnchor: [12, 39],
            popupAnchor: [1, -34]
        });
        
        // Opciones para el seguimiento
        const opcionesSeguimiento = {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
        };
        
        function exitoUbicacion(pos) {
            const latitudUsuario = pos.coords.latitude;
            const longitudUsuario = pos.coords.longitude;
            
            if (marcadorUsuario) {
                marcadorUsuario.setLatLng([latitudUsuario, longitudUsuario]);
            } else {
                marcadorUsuario = L.marker([latitudUsuario, longitudUsuario], {icon: iconoUsuario}).addTo(mapa)
                    .bindPopup('Tu ubicación actual').openPopup();
            }
            
            mapa.panTo(new L.LatLng(latitudUsuario, longitudUsuario));
            
            // Calcular distancia
            const distancia = calcularDistancia(latitudUsuario, longitudUsuario, edificio.coords[0], edificio.coords[1]);
            distanciaEnMapaElement.innerHTML = `<b>Distancia Restante: ${Math.round(distancia)} Metros</b>`;
            
            // Verificar llegada
            if (distancia <= 10 && !llegadaNotificada) {
                llegadaModal.style.display = 'block';
                llegadaNotificada = true;
            }
        }
        
        function errorUbicacion(err) {
            console.warn('ERROR(' + err.code + '): ' + err.message);
            alert('No se pudo obtener la ubicación.');
        }
        
        navigator.geolocation.watchPosition(exitoUbicacion, errorUbicacion, opcionesSeguimiento);
        mapa.invalidateSize();
    }
    
    function calcularDistancia(lat1, lon1, lat2, lon2) {
        const R = 6371e3;
        const φ1 = lat1 * Math.PI / 180;
        const φ2 = lat2 * Math.PI / 180;
        const Δφ = (lat2 - lat1) * Math.PI / 180;
        const Δλ = (lon2 - lon1) * Math.PI / 180;
        
        const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
                  Math.cos(φ1) * Math.cos(φ2) *
                  Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        
        return R * c;
    }
}

function initialize360Viewer(imagen360) {
    console.log('Inicializando visor 360° con imagen:', imagen360);
    // Crear el modal para el visor 360°
    const modal360 = document.createElement('div');
    modal360.id = 'modal360';
    modal360.className = 'modal';
    modal360.style.display = 'none';
    modal360.innerHTML = `
        <div class="modal-content" style="width: 90%; height: 90%; max-width: none; max-height: none;">
            <span class="close-button" id="cerrar360Btn" style="position: absolute; top: 10px; right: 20px; font-size: 30px; cursor: pointer; z-index: 1001; color: white;">&times;</span>
            <div id="viewer360" style="width: 100%; height: 100%;"></div>
        </div>
    `;
    document.body.appendChild(modal360);
    
    // Event listeners
    const ver360Btn = document.getElementById('ver360Btn');
    const cerrar360Btn = document.getElementById('cerrar360Btn');
    
    ver360Btn.addEventListener('click', () => {
        console.log('Botón 360° clickeado, imagen:', imagen360);
        modal360.style.display = 'block';
        
        // Limpiar contenedor anterior
        const viewerContainer = document.getElementById('viewer360');
        viewerContainer.innerHTML = '';
        
        // Crear contenedor para Photo Sphere Viewer
        const psvContainer = document.createElement('div');
        psvContainer.id = 'psv-container';
        psvContainer.style.width = '100%';
        psvContainer.style.height = '100%';
        viewerContainer.appendChild(psvContainer);
        
        // Mostrar estado de carga
        psvContainer.innerHTML = `
            <div style="display: flex; align-items: center; justify-content: center; height: 100%; background: #000; color: white;">
                <div style="text-align: center;">
                    <div style="border: 4px solid #f3f3f3; border-top: 4px solid #3498db; border-radius: 50%; width: 40px; height: 40px; animation: spin 1s linear infinite; margin: 0 auto 20px;"></div>
                    <p>Cargando visor 360°...</p>
                    <p style="font-size: 12px; color: #ccc;">Imagen: ${imagen360}</p>
                </div>
            </div>
            <style>
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            </style>
        `;
        
        // Inicializar visor 360° personalizado
        setTimeout(() => {
            try {
                console.log('Inicializando visor 360° personalizado...');
                console.log('Imagen:', imagen360);
                
                // Convertir ruta relativa a absoluta
                const imageUrl = imagen360.startsWith('http') ? imagen360 : window.location.origin + '/' + imagen360;
                console.log('URL de imagen:', imageUrl);
                
                // Crear visor 360° real con A-Frame
                psvContainer.innerHTML = `
                    <div id="viewer360" style="width: 100%; height: 100%; position: relative; overflow: hidden; background: #000;">
                        <div id="loading360" style="display: flex; align-items: center; justify-content: center; height: 100%; background: #f8f9fa; color: #6c757d;">
                            <div style="text-align: center;">
                                <div style="width: 40px; height: 40px; border: 4px solid #f3f3f3; border-top: 4px solid #007bff; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto;"></div>
                                <p class="mt-3">Cargando visor 360°...</p>
                                <p><small>URL: ${imageUrl}</small></p>
                            </div>
                        </div>
                        <a-scene id="aframe360" style="display: none; width: 100%; height: 100%;">
                            <a-sky src="${imageUrl}" rotation="0 0 0"></a-sky>
                            <a-camera position="0 0 0" rotation="0 0 0">
                                <a-cursor></a-cursor>
                            </a-camera>
                        </a-scene>
                        <img id="hiddenImage360" src="${imageUrl}" style="display: none;" 
                             onload="handleImageLoad()" 
                             onerror="handleImageError('${imageUrl}')" />
                        <div id="controls360" style="position: absolute; top: 10px; right: 10px; z-index: 1000; display: none;">
                            <button id="reset360" style="background: rgba(0,0,0,0.7); color: white; border: none; padding: 10px; margin: 2px; border-radius: 5px; cursor: pointer;" title="Resetear">⌂</button>
                        </div>
                        <div id="instructions360" style="position: absolute; bottom: 10px; left: 10px; background: rgba(0,0,0,0.7); color: white; padding: 10px; border-radius: 5px; font-size: 12px; display: none;">
                            Arrastra para rotar • Rueda del mouse para zoom • Click en controles
                        </div>
                    </div>
                    <style>
                        @keyframes spin {
                            0% { transform: rotate(0deg); }
                            100% { transform: rotate(360deg); }
                        }
                    </style>
                `;
                
                // Inicializar controles 360°
                initialize360Controls();
                
                console.log('Visor 360° personalizado inicializado correctamente');
            } catch (error) {
                console.error('Error al inicializar visor 360°:', error);
                psvContainer.innerHTML = `
                    <div style="display: flex; align-items: center; justify-content: center; height: 100%; background: #f8f9fa; color: #6c757d;">
                        <div style="text-align: center;">
                            <h4>Error al cargar la vista 360°</h4>
                            <p>Error: ${error.message}</p>
                            <p>Imagen: ${imagen360}</p>
                            <button onclick="location.reload()" class="btn btn-primary">Reintentar</button>
                        </div>
                    </div>
                `;
            }
        }, 500);
    });
    
    
    cerrar360Btn.addEventListener('click', () => {
        modal360.style.display = 'none';
        // Limpiar el visor al cerrar
        const viewerContainer = document.getElementById('viewer360');
        if (viewerContainer) {
            viewerContainer.innerHTML = '';
        }
    });
    
    // Cerrar al hacer clic fuera del modal
    modal360.addEventListener('click', (e) => {
        if (e.target === modal360) {
            modal360.style.display = 'none';
            const viewerContainer = document.getElementById('viewer360');
            if (viewerContainer) {
                viewerContainer.innerHTML = '';
            }
        }
    });
}

function showError(message) {
    document.getElementById('edificio-content').innerHTML = `
        <div class="text-center py-5">
            <div class="alert alert-danger" role="alert">
                <h4 class="alert-heading">Error</h4>
                <p>${message}</p>
                <hr>
                <a href="aula.html" class="btn btn-primary">Volver al mapa</a>
            </div>
        </div>
    `;
}

// Función para inicializar controles 360°
window.initialize360Controls = function() {
    const aframeScene = document.getElementById('aframe360');
    const sky = aframeScene ? aframeScene.querySelector('a-sky') : null;
    const camera = aframeScene ? aframeScene.querySelector('a-camera') : null;
    const resetBtn = document.getElementById('reset360');
    
    if (!aframeScene || !sky || !camera) {
        console.log('Escena A-Frame no encontrada');
        return;
    }
    
    console.log('Inicializando controles 360° con A-Frame...');
    
    // Reset
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            sky.setAttribute('rotation', '0 0 0');
            camera.setAttribute('rotation', '0 0 0');
            camera.setAttribute('position', '0 0 0');
        });
    }
    
    console.log('Controles 360° A-Frame inicializados correctamente');
};

// Función para manejar la carga exitosa de la imagen
function handleImageLoad() {
    console.log('Imagen 360° cargada correctamente');
    const loading = document.getElementById('loading360');
    const aframeScene = document.getElementById('aframe360');
    const controls = document.getElementById('controls360');
    const instructions = document.getElementById('instructions360');
    
    if (loading) loading.style.display = 'none';
    if (aframeScene) aframeScene.style.display = 'block';
    if (controls) controls.style.display = 'block';
    if (instructions) instructions.style.display = 'block';
    
    // Inicializar controles después de que la escena se muestre
    setTimeout(() => {
        initialize360Controls();
    }, 100);
}

// Función para manejar errores de carga de imagen
function handleImageError(imageUrl) {
    console.error('Error al cargar la imagen 360°:', imageUrl);
    const loading = document.getElementById('loading360');
    if (loading) {
        loading.innerHTML = `
            <div style="text-align: center;">
                <h4>Error al cargar la imagen 360°</h4>
                <p>No se pudo cargar la imagen</p>
                <p><small>URL: ${imageUrl}</small></p>
                <button onclick="location.reload()" class="btn btn-primary">Reintentar</button>
            </div>
        `;
    }
}
