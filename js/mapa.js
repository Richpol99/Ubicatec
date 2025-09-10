$(document).ready(function() {
    var mapaEmergente = $('#mapaEmergente');
    var mapaDiv = $('#mapa');
    var cerrarMapaBtn = $('#cerrarMapaBtn');
    var verUbicacionBtn = $('#verUbicacionBtn');
    var mapa;
    var marcadorDestino;
    var marcadorUsuario;
    var destinoLatitud = 19.069281; // Coordenada de latitud del Edificio 15
    var destinoLongitud = -98.168944; // Coordenada de longitud del Edificio 15
    var distanciaEnMapaElement = $('#distanciaEnMapa'); // Nuevo elemento para la distancia
    var sonidoNotificacion = document.getElementById('notificacionLlegada'); // Elemento de audio
    var llegadaNotificada = false; // Bandera para evitar notificaciones repetidas

    // Elementos para la ventana modal
    var avisoModal = $('#avisoModal');
    var cerrarAvisoBtn = $('#cerrarAvisoBtn');
    var continuarBtn = $('#continuarBtn');
    var llegadaModal = $('#llegadaModal');
    console.log("Elemento llegadaModal:", llegadaModal);
    var cerrarLlegadaBtn = $('#cerrarLlegadaBtn');
    var cerrarLlegadaOkBtn = $('#cerrarLlegadaOkBtn');

    // Cerrar el modal de llegada al hacer clic en la "x"
    cerrarLlegadaBtn.on('click', function() {
        llegadaModal.hide();
    });

    // Cerrar el modal de llegada al hacer clic en "Ok"
    cerrarLlegadaOkBtn.on('click', function() {
        llegadaModal.hide();
    });

    verUbicacionBtn.on('click', function() {
        avisoModal.show(); // Mostrar la ventana de aviso
    });

    cerrarAvisoBtn.on('click', function() {
        avisoModal.hide();
    });

    continuarBtn.on('click', function() {
        avisoModal.hide();
        mapaEmergente.show();
        inicializarMapa();
        llegadaNotificada = false; // Reiniciar la bandera al abrir el mapa
    });

    cerrarMapaBtn.on('click', function() {
        mapaEmergente.hide();
        if (mapa) {
            mapa.remove(); // Limpiar el mapa al cerrar
            mapa = null;
            marcadorDestino = null;
            marcadorUsuario = null;
        }
    });

    function inicializarMapa() {
        mapa = L.map('mapa').setView([19.0733, -98.2889], 20); // Coordenadas iniciales (Tec de Puebla) y zoom

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(mapa);

        // Marcador del destino final (Edificio 15)
        marcadorDestino = L.marker([destinoLatitud, destinoLongitud]).addTo(mapa)
            .bindPopup('<b>Edificio 15</b>').openPopup();


        // Crear un icono personalizado para el usuario
        var iconoUsuario = L.icon({
            iconUrl: 'Icon/user.png', // Reemplaza 'Icon/user.png' con la ruta a tu imagen
            iconSize: [27, 35],     // Tamaño del icono (ancho, alto) en píxeles. Ajusta si es necesario.
            iconAnchor: [12, 39],    // Punto del icono que corresponde a la ubicación. Ajusta si es necesario.
            popupAnchor: [1, -34]    // Punto donde se abrirá el popup. Ajusta si es necesario.
        });

        // Opciones para el seguimiento de la ubicación
        var opcionesSeguimiento = {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
        };

        function exitoUbicacion(pos) {
            var latitudUsuario = pos.coords.latitude;
            var longitudUsuario = pos.coords.longitude;

            if (marcadorUsuario) {
                marcadorUsuario.setLatLng([latitudUsuario, longitudUsuario]);
            } else {
                marcadorUsuario = L.marker([latitudUsuario, longitudUsuario], {icon: iconoUsuario}).addTo(mapa)
                    .bindPopup('Tu ubicación actual').openPopup();
            }

            mapa.panTo(new L.LatLng(latitudUsuario, longitudUsuario));

            // Calcular la distancia restante y actualizar el elemento en el mapa
            var distancia = calcularDistancia(latitudUsuario, longitudUsuario, destinoLatitud, destinoLongitud);
            distanciaEnMapaElement.html('<b>Distancia Restante: ' + Math.round(distancia) + ' Metros</b>');

            // Verificar si se ha llegado al destino (distancia menor a 10 metros)
            var distanciaUmbral = 10; // Metros
            if (distancia <= distanciaUmbral && !llegadaNotificada) {
                sonidoNotificacion.play();
                llegadaModal.show(); // Mostrar el modal de llegada
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

    // Función para calcular la distancia entre dos puntos (en metros) usando la fórmula Haversine
    function calcularDistancia(lat1, lon1, lat2, lon2) {
        const R = 6371e3; // Radio de la Tierra en metros
        const φ1 = lat1 * Math.PI / 180; // φ, λ en radianes
        const φ2 = lat2 * Math.PI / 180;
        const Δφ = (lat2 - lat1) * Math.PI / 180;
        const Δλ = (lon2 - lon1) * Math.PI / 180;

        const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
                  Math.cos(φ1) * Math.cos(φ2) *
                  Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        const distancia = R * c; // en metros
        return distancia;
    }

    var map = L.map('map').setView([19.0698, -98.1688], 18);

    var calle = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 20,
        attribution: '&copy; OpenStreetMap contributors'
    });

    calle.addTo(map);

    var edificios = [
        { nombre: "Edificio 1 (direccion)", coords: [19.0700471611661, -98.16987998532049], link: "edif_1.html", tipo: "administrativo" },
        { nombre: "Edificio 2 (coordinacion)", coords: [19.070339683584418, -98.16984213200494], link: "edif_2.html", tipo: "administrativo" },
        { nombre: "Edificio 3 (Sistemas y Computacion)", coords: [19.07028250570129, -98.1691442328977], link: "edif_3.html", tipo: "laboratorio" },
        { nombre: "Edificio 4 (Aulas, WC)", coords: [19.070338275809316, -98.16871239724523], link: "edif_4.html", tipo: "aula" },
        { nombre: "Edificio 5 (Aulas)", coords: [19.070279970696365, -98.16838516772772], link: "edif_5.html", tipo: "aula" },
        { nombre: "Edificio 6 (Desarrollo Academico y C.E.S.A)", coords: [19.070056890074806, -98.16867484631699], link: "edif_6.html", tipo: "administrativo" },
        { nombre: "Edificio 7 (Aula de clases)", coords: [19.069965, -98.168309], link: "edif_7.html", tipo: "aula" },
        { nombre: "Edificio 8 (Aulas)", coords: [19.0697161, -98.1687085], link: "edif_8.html", tipo: "aula" },
        { nombre: "Edificio 9 (Aulas y cubiculos para maestros)", coords: [19.0696648, -98.1683283], link: "edif_9.html", tipo: "aula" },
        { nombre: "Edificio 10 (Depto. Ciencias economico administrativas)", coords: [19.069675, -98.168104], link: "edif_10.html", tipo: "administrativo" },
        { nombre: "Edificio 11 (Aulas y portico)", coords: [19.069590, -98.169141], link: "edif_11.html", tipo: "aula" },
        { nombre: "Edificio 12 (Aulas portico, WC)", coords: [19.069453, -98.168654], link: "edif_12.html", tipo: "aula" },
        { nombre: "Edificio 13 (Aulas)", coords: [19.0693308, -98.1681797], link: "edif_13.html", tipo: "aula" },
        { nombre: "Edificio 14 (Aulas, Galileo Galilei)", coords: [19.069386, -98.169351], link: "edif_14.html", tipo: "aula" },
        { nombre: "Edificio 15 (Aulas)", coords: [19.069281, -98.168944], link: "edif_15.html", tipo: "aula" },
        { nombre: "Edificio 16 (Cubiculos para profesores)", coords: [19.069341, -98.170290], link: "edif_16.html", tipo: "administrativo" },
        { nombre: "Edificio 17 (Aulas y sala de titulacion)", coords: [19.069322, -98.169910], link: "edif_17.html", tipo: "aula" },
        { nombre: "Edificio 18 (WC, Portico, Aula Jean Piaget)", coords: [19.069206, -98.169657], link: "edif_18.html", tipo: "aula" },
        { nombre: "Edificio 19 (Laboratorio de Fisica y Quimica)", coords: [19.069084, -98.169326], link: "edif_19.html", tipo: "laboratorio" },
        { nombre: "Edificio 20 (Laboratorio de Ingenieria Electrica)", coords: [19.069205695460248, -98.16860064509656], link: "edif_20.html", tipo: "laboratorio" },
        { nombre: "Edificio 21 (Depto. Economico administrativo. Lab de negocios)", coords: [19.068948, -98.168838], link: "edif_21.html", tipo: "administrativo" },
        { nombre: "Edificio 22 (Aulas)", coords: [19.069201, -98.170032], link: "edif_22.html", tipo: "aula" },
        { nombre: "Edificio 23 (Aulas)", coords: [19.068833, -98.170307], link: "edif_23.html", tipo: "aula" },
        { nombre: "Edificio 24 (Sala T.Alva E. Sala A.Einstein. Sala W.E.Deming)", coords: [19.068907, -98.169477], link: "edif_24.html", tipo: "aula" },
        { nombre: "Edificio 25 (Servicio Medico)", coords: [19.068845419565694, -98.16910953816078], link: "edif_25.html", tipo: "administrativo" },
        { nombre: "Edificio 26 (Aulas)", coords: [19.0688019, -98.1688332], link: "edif_26.html", tipo: "aula" },
        { nombre: "Edificio 27 (Lab. Ing Mecanica)", coords: [19.068793, -98.168558], link: "edif_27.html", tipo: "laboratorio" },
        { nombre: "Edificio 28 (Aulas)", coords: [19.068603, -98.170041], link: "edif_28.html", tipo: "aula" },
        { nombre: "Edificio 29 (Posgrado)", coords: [19.068590, -98.169251], link: "edif_29.html", tipo: "administrativo" },
        { nombre: "Edificio 30 (Manufactura avanzada Lab; y depto. Metal mecanica)", coords: [19.0684055, -98.1689559], link: "edif_30.html", tipo: "laboratorio" },
        { nombre: "Edificio 31 (Coordinacion cultural)", coords: [19.0684058, -98.1685666], link: "edif_31.html", tipo: "administrativo" },
        { nombre: "Edificio 32 (Exsub-Estacion electrica 1)", coords: [19.068168, -98.168593], link: "edif_32.html", tipo: "otro" },
        { nombre: "Edificio 33 (Lab. Desarrollo tecnico e innovacion)", coords: [19.068213, -98.169197], link: "edif_33.html", tipo: "laboratorio" },
        { nombre: "Edificio 34 (Coordinacion cultural)", coords: [19.068175, -98.169059], link: "edif_34.html", tipo: "administrativo" },
        { nombre: "Edificio 35 (Lab. Ing electronica)", coords: [19.068176, -98.168952], link: "edif_35.html", tipo: "laboratorio" },
        { nombre: "Edificio 36 (Centro de computo y lab de sistemas, WC)", coords: [19.068163, -98.170270], link: "edif_36.html", tipo: "laboratorio" },
        { nombre: "Edificio 37 (Sub-Estacion electrica 2)", coords: [19.067984, -98.170599], link: "edif_37.html", tipo: "otro" },
        { nombre: "Edificio 38 (Cuarto de maq. Coordinacion deportiva, WC)", coords: [19.067226, -98.168782], link: "edif_38.html", tipo: "baño" },
        { nombre: "Edificio 39 (Utileria de coordinacion cultural)", coords: [19.067036, -98.168557], link: "edif_39.html", tipo: "otro" },
        { nombre: "Edificio 40 (Laboratorio de posgrado-Proyecto)", coords: [19.067282, -98.170378], link: "edif_40.html", tipo: "laboratorio" },
        { nombre: "Edificio 41 (Centro de lenguas extranjeras-Lab. Logistica)", coords: [19.071208, -98.169903], link: "edif_41.html", tipo: "administrativo" },
        { nombre: "Edificio 42 (Edificio de Sep Federal)", coords: [19.071135, -98.169291], link: "edif_42.html", tipo: "administrativo" },
        { nombre: "Edificio 43 (Recursos materiales y servicios)", coords: [19.0670547, -98.1706309], link: "edif_43.html", tipo: "administrativo" },
        { nombre: "Edificio 44 (Sub-Estacion Electrica 3-Centro de vinculacion)", coords: [19.071905, -98.169451], link: "edif_44.html", tipo: "administrativo" },
        { nombre: "Edificio 45 (Unidad academica departamental-Ing. Industrial)", coords: [19.070917, -98.168811], link: "edif_45.html", tipo: "administrativo" },
        { nombre: "Edificio 46 (Sub-Estacion Electrica de U. A. Departamental)", coords: [19.070816, -98.168218], link: "edif_46.html", tipo: "otro" },
        { nombre: "Edificio 47 (Almacen activo fijo)", coords: [19.067090, -98.168774], link: "edif_47.html", tipo: "otro" },
        { nombre: "Edificio 48 (Almacen de servicios generales)", coords: [19.0670829, -98.1705089], link: "edif_48.html", tipo: "otro" },
        { nombre: "Edificio 49 (Lab. Ing Electronica)", coords: [19.069142, -98.168277], link: "edif_49.html", tipo: "laboratorio" },
        { nombre: "Edificio 50 (Centro de Informacion, WC)", coords: [19.067422488611665, -98.169682206123], link: "edif_50.html", tipo: "administrativo" },
        { nombre: "Edificio 51 (Unidad academica departamental-Ing. Mecanica)", coords: [19.071552, -98.169811], link: "edif_51.html", tipo: "administrativo" },
        { nombre: "Edificio 52 (Sala de titulacion)", coords: [19.069555, -98.169899], link: "edif_52.html", tipo: "administrativo" },
        { nombre: "Edificio 53 (Ciencias basicas, WC)", coords: [19.070834, -98.169673], link: "edif_53.html", tipo: "aula" },
        { nombre: "Acceso principal (Avenida Tecnologico)", coords: [19.069821422656712, -98.17042957607508], tipo: "acceso" },
        { nombre: "Acceso Visitantes (Avenida Tecnologico, Frente a Sears)", coords: [19.068467599492795, -98.17061388514823], tipo: "acceso" },
        { nombre: "Acceso Hangar Autobuses y Estacionamiento 3 (Avenida Tecnologico, a un costado de Benteler)", coords: [19.067184781628676, -98.17086525607026], tipo: "acceso" },
        { nombre: "Acceso Estacionamiento 2 (Colonia Maravillas)", coords: [19.069943796103818, -98.16710196647787], tipo: "acceso" },
        { nombre: "Acceso Estudiantes (Colonia Maravillas)", coords: [19.07051268473509, -98.16772933097631], tipo: "acceso" },
        { nombre: "Acceso Estacionamiento 1 (Avenida Tecnologico)", coords: [19.070712336989462, -98.1703082196594], tipo: "acceso" },
    ];

    // Función para crear iconos personalizados según el tipo
    function crearIconoPersonalizado(tipo) {
        var colores = {
            'aula': { color: '#3498db', icono: 'school.svg' },
            'laboratorio': { color: '#27ae60', icono: 'microscope.svg' },
            'administrativo': { color: '#e67e22', icono: 'building.svg' },
            'baño': { color: '#9b59b6', icono: 'toilet-paper.svg' },
            'acceso': { color: '#e74c3c', icono: 'door.svg' },
            'otro': { color: '#95a5a6', icono: 'tools.svg' }
        };
        
        var config = colores[tipo] || colores['otro'];
        
        return L.divIcon({
            className: 'custom-marker marker-' + tipo,
            html: '<div style="background-color: ' + config.color + '; border: 3px solid ' + config.color + '; border-radius: 50%; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 8px rgba(0,0,0,0.3); cursor: pointer; transition: all 0.3s ease;"><img src="Icon/tabler/' + config.icono + '" alt="' + tipo + '" style="width: 16px; height: 16px; filter: brightness(0) invert(1);" /></div>',
            iconSize: [30, 30],
            iconAnchor: [15, 15],
            popupAnchor: [0, -15]
        });
    }

    var markersData = [];
    edificios.forEach(function (edificio) {
        var icono = crearIconoPersonalizado(edificio.tipo);
        var marker = L.marker(edificio.coords, { icon: icono });
        marker.bindTooltip(edificio.nombre, { 
            permanent: true, 
            direction: 'top',
            className: 'custom-tooltip'
        });
        if (edificio.link) {
            marker.on('click', function () { window.location.href = edificio.link; });
        }
        markersData.push({ marker: marker, name: edificio.nombre.toLowerCase(), tipo: edificio.tipo });
    });

    var edificioMarkers = L.layerGroup();
    markersData.forEach(function (data) {
        edificioMarkers.addLayer(data.marker);
    });

    edificioMarkers.addTo(map);

        // Llamada inicial a updateMarkers con un array vacío para no mostrar marcadores al cargar
        updateMarkers('', []);

        var initialLoad = true; // Variable para controlar la carga inicial

    function updateMarkers(query, selectedFilter) {
        edificioMarkers.clearLayers();
        if (query || selectedFilter !== 'todos') { // Mostrar solo si hay una búsqueda o filtro seleccionado
            markersData.forEach(function (data) {
                var matchesQuery = data.name.includes(query.toLowerCase());
                var matchesFilter = selectedFilter === 'todos'; // Si es 'todos', todos pasan

                if (selectedFilter !== 'todos') {
                    matchesFilter = false;
                    if (selectedFilter === 'otros') {
                        const excludedTypes = ['administrativo', 'aula', 'laboratorio', 'baño', 'acceso'];
                        if (!excludedTypes.includes(data.tipo)) {
                            matchesFilter = true;
                        }
                    }
                    if (selectedFilter === data.tipo) {
                        matchesFilter = true;
                    }
                    if (selectedFilter === 'baño') {
                        if (data.name.toLowerCase().includes('wc') || data.name.toLowerCase().includes('baño')) {
                            matchesFilter = true;
                        }
                    }
                }

                if (matchesQuery && matchesFilter) {
                    edificioMarkers.addLayer(data.marker);
                }
            });
        }
    }

    // Llamada inicial para no mostrar marcadores
    updateMarkers('', 'todos');
    initialLoad = false; // Desactivar la bandera después de la carga inicial
    
    // Event listener para el campo de búsqueda
    document.getElementById('searchInput').addEventListener('input', function () {
        var query = this.value.trim();
        var filterSelect = document.getElementById('filterSelect');
        
        // Si hay una búsqueda activa, desactivar el filtro automáticamente
        if (query) {
            filterSelect.value = 'todos';
        }
        
        var selectedFilter = filterSelect.value;
        updateMarkers(query, selectedFilter);
    });


    // Event listener para el selector de filtros
    document.getElementById('filterSelect').addEventListener('change', function () {
        var searchInput = document.getElementById('searchInput');
        var selectedFilter = this.value;
        
        // Si se selecciona un filtro diferente a 'todos', limpiar la búsqueda
        if (selectedFilter !== 'todos') {
            searchInput.value = '';
        }
        
        var query = searchInput.value.trim();
        updateMarkers(query, selectedFilter);
    });
        });