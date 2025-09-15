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
        
        // Exponer el mapa globalmente para el sistema de rutas accesibles
        window.map = mapa;
        
        // Notificar que el mapa está listo para el sistema de rutas
        console.log('🗺️ Mapa inicializado y listo para rutas accesibles');

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
    
    // Exponer el mapa principal globalmente para el sistema de rutas accesibles
    window.map = map;
    console.log('🗺️ Mapa principal inicializado y listo para rutas accesibles');
    console.log('🗺️ window.map disponible:', !!window.map, typeof window.map);
    console.log('🗺️ window.map.addLayer disponible:', typeof window.map.addLayer);

    var calle = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 20,
        attribution: '&copy; OpenStreetMap contributors'
    });

    var satelite = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Tiles © Esri'
    });

    satelite.addTo(map);
    L.control.layers({ "Vista Satelital": satelite, "Vista de Calles": calle }).addTo(map);

    // Hacer la lista de edificios disponible globalmente
    window.edificios = [
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
        { nombre: "Edificio 20 (Laboratorio de Ingenieria Electrica)", coords: [19.069142510837185, -98.16839168822943], link: "edif_20.html", tipo: "laboratorio" },
        { nombre: "Edificio 21 (Depto. Economico administrativo. Lab de negocios)", coords: [19.068948, -98.168838], link: "edif_21.html", tipo: "administrativo" },
        { nombre: "Edificio 22 (Aulas)", coords: [19.069201, -98.170032], link: "edif_22.html", tipo: "aula" },
        { nombre: "Edificio 23 (Aulas)", coords: [19.068833, -98.170307], link: "edif_23.html", tipo: "aula" },
        { nombre: "Edificio 24 (Sala T.Alva E. Sala A.Einstein. Sala W.E.Deming)", coords: [19.068907, -98.169477], link: "edif_24.html", tipo: "aula" },
        { nombre: "Edificio 25 (Servicio Medico)", coords: [19.068845419565694, -98.16910953816078], link: "edif_25.html", tipo: "administrativo" },
        { nombre: "Edificio 26 (Aulas)", coords: [19.0688019, -98.1688332], link: "edif_26.html", tipo: "aula" },
        { nombre: "Edificio 27 (Lab. Ing Mecanica)", coords: [19.068793, -98.168558], link: "edif_27.html", tipo: "laboratorio" },
        { nombre: "Edificio 28 (Aulas)", coords: [19.068603, -98.170041], link: "edif_28.html", tipo: "aula" },
        { nombre: "Edificio 29 (Posgrado)", coords: [19.068590, -98.169251], link: "edif_29.html", tipo: "administrativo" },
        { nombre: "Edificio 30 (Manufactura avanzada Lab; y depto. Metal mecanica)", coords: [19.0684790, -98.1689670], link: "edif_30.html", tipo: "laboratorio" },
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

    var markersData = [];
    edificios.forEach(function (edificio) {
        var marker = L.marker(edificio.coords, { className: 'marker-' + edificio.tipo });
        marker.bindTooltip(edificio.nombre, { permanent: true, direction: 'top' });
        
        // Agregar event listener para activar rutas accesibles
        marker.on('click', function () {
            console.log('🏢 Edificio seleccionado:', edificio.nombre);
            
            // Verificar si el sistema de navegación unificado está disponible
            if (typeof window.unifiedNav !== 'undefined' && window.unifiedNav.state.isInitialized) {
                console.log('✅ Activando sistema de rutas accesibles para:', edificio.nombre);
                // Activar el sistema de rutas accesibles
                window.unifiedNav.navigateToBuilding(edificio.nombre);
            } else {
                console.log('⚠️ Sistema de rutas accesibles no disponible, redirigiendo a página del edificio');
                // Fallback: redirigir a la página del edificio si existe
                if (edificio.link) {
                    window.location.href = edificio.link;
                }
            }
        });
        
        markersData.push({ marker: marker, name: edificio.nombre.toLowerCase(), tipo: edificio.tipo });
    });

    var edificioMarkers = L.layerGroup();
    markersData.forEach(function (data) {
        edificioMarkers.addLayer(data.marker);
    });

    edificioMarkers.addTo(map);

    // Definir coordenadas de la ruta azul accesible
    var rutaAzulCoords = [
        [19.068467599492795, -98.17061388514823], //Acesso entrada visitantes
        [19.0683843, -98.1702980], // Aceso Entrada 36
        [19.0683612, -98.1700623], // Aceso pasillo 36
        [19.0683475, -98.1699010], //ACesso Cajon de estacinamiento(Visitantes)
        [19.0684908, -98.1698233], //inicio de nodo canchas
        [19.0684141, -98.1692114], // Fin de nodo canchas
        [19.0685174, -98.1691869], // Inicio ruta 30 -98.1692287407718
        [19.0684790, -98.1689670], // edificio 30
        
    ];

    var rutaAzulCoords2 = [
        [19.0683843, -98.1702980],
        [19.068163, -98.170270], // edificio 36

    ];

    var rutaAzulCoords3 = [
        [19.0683612, -98.1700623],
        [19.06766279821493, -98.17013187271783],
        [19.067589895228735 ,-98.1696891],
        [19.067589895228735, -98.16930687345818],
        [19.0671937,-98.1693723],
        [19.0671990,-98.1691631],
        [19.0670036, -98.1691540],
        [19.066967924289344, -98.16869954966634],
        [19.06634923333955, -98.16864781128356], //fin de canchas ()domo 
    ];

    var rutaAzulCoords4 = [
        [19.067589895228735 ,-98.1696891],
        [19.067422488611665, -98.169682206123], // edificio 50
    ];

    var rutaAzulCoords5 = [
        [19.067184781628676, -98.17086525607026],
        [19.0670036, -98.1691540],
    ];
    // Crear la polyline de la ruta azul
    var rutaAzul = L.polyline(rutaAzulCoords, {
        color: 'blue',
        weight: 4,
        opacity: 0.8,
        smoothFactor: 1
    });

    var rutaAzul2 = L.polyline(rutaAzulCoords2, {
        color: 'blue',
        weight: 4,
        opacity: 0.8,
        smoothFactor: 1
    });

    var rutaAzul3 = L.polyline(rutaAzulCoords3, {
        color: 'blue',
        weight: 4,
        opacity: 0.8,
        smoothFactor: 1
    });

    var rutaAzul4 = L.polyline(rutaAzulCoords4, {
        color: 'blue',
        weight: 4,
        opacity: 0.8,
        smoothFactor: 1
    });

    var rutaAzul5 = L.polyline(rutaAzulCoords5, {
        color: 'blue',
        weight: 4,
        opacity: 0.8,
        smoothFactor: 1
    });
    // Agregar la ruta azul al mapa
    rutaAzul.addTo(map);
    rutaAzul2.addTo(map);
    rutaAzul3.addTo(map);
    rutaAzul4.addTo(map);
    rutaAzul5.addTo(map);

    // Definir coordenadas de la ruta verde accesible
var rutaVerdeCoords = [
    [19.070467999988388, -98.16775186055264], // Rampa de acceso al lab del 45
    [19.07080388748417, -98.16819241335915], // Rampa de acceso al estacionamiento
    [19.070917, -98.168811], // edificio 45
    [19.070954086013042, -98.16938800799538], //NODOO4
    [19.071092876936074, -98.16938197304088], // Rampa de acceso a edificio de vinculación 
    [19.0711188606115, -98.16963343010836], // Rampa de acceso en dirección hacia edificio de mecánica y logística
    [19.071187939146842, -98.1696481822939], //Nodo 7
    [19.071452211800658, -98.16961331358914], // Rampa acceso a edificio idiomas 
    [19.07150761227954, -98.16981708188739],
    [19.071552, -98.169811], // edificio 51
];

// Definir coordenadas de la ruta verde 2
var rutaVerdeCoords2 = [
    [19.070954086013042, -98.16938800799538], // Punto inicial (cerca edificio/área)
    [19.07081751014322, -98.16939838656272],
    [19.07079279391931, -98.16941582091938],
    [19.070806589761048, -98.169548184706],
    [19.070811172650252, -98.16963777369097], // Punto final (camino hacia otra zona)
    [19.070834, -98.169673],
    
];

// Definir coordenadas de la ruta verde 3
var rutaVerdeCoords3 = [
     // Punto inicial// Punto intermedio
    [19.071208, -98.169903], // edificio 41
    [19.071187939146842, -98.1696481822939], 
      // Punto final
];

// Definir coordenadas de la ruta verde 4
var rutaVerdeCoords4 = [
    [19.070806589761048, -98.169548184706],
    [19.070762805083532, -98.1695532147195], // Punto inicial
    [19.070811202962297, -98.16998753799062], // Punto intermedio 1
    [19.070718888479348, -98.16999986594247], // Punto intermedio 2
    [19.07073053982469, -98.1701329062525],   // Punto final

];

var rutaVerdeCoords5 = [
    [19.070806589761048, -98.169548184706],
    [19.070762805083532, -98.1695532147195],
    [19.07045696117779, -98.16959931061868],  // Punto intermedio 1
    [19.070413866126465, -98.16913998236355], // Punto intermedio 2
    [19.07039041734366, -98.16914601732076] ,  // Punto final
    [19.07028250570129, -98.1691442328977], //edificio 3
];
// Crear la polyline de la ruta verde
var rutaVerde = L.polyline(rutaVerdeCoords, {
    color: 'green',   // Color verde
    weight: 4,        // Grosor de línea
    opacity: 0.8,     // Transparencia
    smoothFactor: 1   // Suavizado
});

// Crear la polyline de la ruta verde 2
var rutaVerde2 = L.polyline(rutaVerdeCoords2, {
    color: 'green',   // Color verde
    weight: 4,        // Grosor de línea
    opacity: 0.8,     // Transparencia
    smoothFactor: 1   // Suavizado
});

// Crear la polyline de la ruta verde 3
var rutaVerde3 = L.polyline(rutaVerdeCoords3, {
    color: 'green',   // Color verde
    weight: 4,        // Grosor de línea
    opacity: 0.8,     // Transparencia
    smoothFactor: 1   // Suavizado
});

// Crear la polyline de la ruta verde 4
var rutaVerde4 = L.polyline(rutaVerdeCoords4, {
    color: 'green',   // Color verde
    weight: 4,        // Grosor de línea
    opacity: 0.8,     // Transparencia
    smoothFactor: 1   // Suavizado
});

// Crear la polyline de la ruta verde 5
var rutaVerde5 = L.polyline(rutaVerdeCoords5, {
    color: 'green',   // Color verde
    weight: 4,        // Grosor de línea
    opacity: 0.8,     // Transparencia
    smoothFactor: 1   // Suavizado
});

// Agregar la ruta verde 5 al mapa
rutaVerde5.addTo(map);
rutaVerde4.addTo(map);
rutaVerde3.addTo(map);
rutaVerde2.addTo(map);
rutaVerde.addTo(map);

// Definir coordenadas de la ruta naranja
var rutaNaranjaCoords = [
    [19.069804848263956, -98.17041271377924], // Punto inicial
    [19.069621431292198, -98.17040155232779], // Punto intermedio
    [19.06954411330357,  -98.169699301171],
    
    
    
];

// Definir coordenadas de la ruta naranja 2
var rutaNaranjaCoords2 = [
    [19.069804848263956, -98.17041271377924], // Punto inicial
    [19.069927624157344, -98.1703294409239],  // Punto intermedio 1
    [19.069897837778097, -98.17011084090497], // Punto intermedio 2
    [19.070192532570985, -98.17007127832228],  // Punto final
    [19.070259176578254, -98.17018421030318],
    [19.07051431443449, -98.17014230172214],
    [19.07060430697445, -98.17017381767646],
    [19.07061685675977, -98.1702820816372],
    
      
];

// Coordenadas de la tercera ruta
var rutaNaranjaCoords3 = [
    [19.070192532570985, -98.17007127832228],  // Punto inicial
    [19.070182596818434, -98.16984098206038],   // Punto inicial
    [19.070159827858692, -98.16965699301171],
    
       
];

// Coordenadas de la cuarta ruta corregida
var rutaNaranjaCoords4 = [
    [19.070339683584418, -98.16984213200494], // edificio 2
    [19.070182596818434, -98.16984098206038],
    [19.0700471611661, -98.16987998532049],  //edificio 1

];

// Coordenadas de la quinta ruta------------------------------------>
var rutaNaranjaCoords5 = [
    [19.07045696117779, -98.16959931061868], 
    [19.070159827858692, -98.16965699301171],
    [19.06954411330357,  -98.169699301171],
    [19.069276620209916, -98.1697020963557], 
    [19.069187280232338, -98.1697393033749],   // Punto intermedio 1
    [19.06883313589799, -98.1699629309711],    // Punto intermedio 2
    [19.068709930910195, -98.1699847419628],   // Punto final
    
];

var rutaNaranjaCoords6 = [
    [19.069187280232338, -98.1697393033749],
    [19.069155186281783, -98.16946992268306], // Punto intermedio 1
    [19.06907279802546, -98.16947394598972],  // Punto intermedio 2
    [19.069053151589696, -98.16934050610591], // Punto final
    [19.069084, -98.169326], // edificio 19

];

// Coordenadas de la séptima ruta
var rutaNaranjaCoords7 = [
    [19.06907279802546, -98.16947394598972],
    [19.068963346800043, -98.16949092670183],  // Punto intermedio
    [19.068940531567176, -98.16941381317659],  // Punto final
    [19.06881314646958, -98.16942521256362],
    [19.06880047133015, -98.16917710825706],
    [19.0685174, -98.1691869], //---------
        
];

// Coordenadas de la octava ruta
var rutaNaranjaCoords8 = [
    [19.06880047133015, -98.16917710825706],
    [19.0689629787397, -98.16914431034333],    // Punto intermedio 1
    [19.068953386117077, -98.16897627859588],  // Punto intermedio 2
    [19.068825367272474, -98.16898566632639],
    [19.068793679424385, -98.1687050881701],  //-unto intermedio 3
    [19.068793, -98.168558], // edificio 27
       
];


// Coordenadas de la novena ruta
var rutaNaranjaCoords9 = [ 
    [19.068793679424385, -98.1687050881701],     // Punto inicial
    [19.069272112524505, -98.16864071515533],   // Punto intermedio 1
    [19.06924295978286, -98.16833896666323],    // Punto intermedio 2
    [19.069104801068896, -98.16835170715466],   // Punto intermedio 3
    [19.069142, -98.168277], // edificio 49

];
var rutaNaranjaCoords10 = [ 
    [19.069104801068896, -98.16835170715466],
    [19.069142510837185, -98.16839168822943], // edificio 20

];

var rutaNaranjaCoords11 = [ 
    [19.06880047133015, -98.16917710825706],
    [19.068845419565694, -98.16910953816078], // edificio 25

];

var rutaNaranjaCoords12 = [ 
    [19.069276620209916, -98.1697020963557],
    [19.06927554283283, -98.16995516119464],   // Punto intermedio 1,
    [19.069322, -98.169955], // edificio 17/52
];

// Crear la polyline de la ruta naranja
var rutaNaranja = L.polyline(rutaNaranjaCoords, {
    color: 'orange', // Color naranja
    weight: 4,       // Grosor de línea
    opacity: 0.8,    // Transparencia
    smoothFactor: 1  // Suavizado
});

// Crear la polyline de la ruta naranja 2
var rutaNaranja2 = L.polyline(rutaNaranjaCoords2, {
    color: 'orange', // Color naranja
    weight: 4,       // Grosor de línea
    opacity: 0.8,    // Transparencia
    smoothFactor: 1  // Suavizado
});

// Crear la polyline de la tercera ruta
var rutaNaranja3 = L.polyline(rutaNaranjaCoords3, {
    color: 'orange', // Color naranja
    weight: 4,       // Grosor de línea
    opacity: 0.8,    // Transparencia
    smoothFactor: 1  // Suavizado
});

// Crear la polyline de la cuarta ruta
var rutaNaranja4 = L.polyline(rutaNaranjaCoords4, {
    color: 'orange', // Color naranja
    weight: 4,       // Grosor de línea
    opacity: 0.8,    // Transparencia
    smoothFactor: 1  // Suavizado
});

// Crear la polyline de la quinta ruta
var rutaNaranja5 = L.polyline(rutaNaranjaCoords5, {
    color: 'orange', // Color naranja
    weight: 4,       // Grosor de línea
    opacity: 0.8,    // Transparencia
    smoothFactor: 1  // Suavizado
});
// Crear la polyline de la sexta ruta
var rutaNaranja6 = L.polyline(rutaNaranjaCoords6, {
    color: 'orange', // Color naranja
    weight: 4,       // Grosor de línea
    opacity: 0.8,    // Transparencia
    smoothFactor: 1  // Suavizado
});

// Crear la polyline de la séptima ruta
var rutaNaranja7 = L.polyline(rutaNaranjaCoords7, {
    color: 'orange', // Color naranja
    weight: 4,       // Grosor de línea
    opacity: 0.8,    // Transparencia
    smoothFactor: 1  // Suavizado
});

// Crear la polyline de la octava ruta
var rutaNaranja8 = L.polyline(rutaNaranjaCoords8, {
    color: 'orange', // Color naranja
    weight: 4,       // Grosor de línea
    opacity: 0.8,    // Transparencia
    smoothFactor: 1  // Suavizado
});

// Crear la polyline de la novena ruta
var rutaNaranja9 = L.polyline(rutaNaranjaCoords9, {
    color: 'orange', // Color naranja
    weight: 4,       // Grosor de línea
    opacity: 0.8,    // Transparencia
    smoothFactor: 1  // Suavizado
});

// Crear la polyline de la décima ruta
var rutaNaranja10 = L.polyline(rutaNaranjaCoords10, {
    color: 'orange', // Color naranja
    weight: 4,       // Grosor de línea
    opacity: 0.8,    // Transparencia
    smoothFactor: 1  // Suavizado
});

// Crear la polyline de la undécima ruta
var rutaNaranja11 = L.polyline(rutaNaranjaCoords11, {
    color: 'orange', // Color naranja
    weight: 4,       // Grosor de línea
    opacity: 0.8,    // Transparencia
    smoothFactor: 1  // Suavizado
});

// Crear la polyline de la doceava ruta
var rutaNaranja12 = L.polyline(rutaNaranjaCoords12, {
    color: 'orange', // Color naranja
    weight: 4,       // Grosor de línea
    opacity: 0.8,    // Transparencia
    smoothFactor: 1  // Suavizado
});

// Agregar la ruta al mapa

rutaNaranja12.addTo(map);
rutaNaranja11.addTo(map);
rutaNaranja10.addTo(map);
rutaNaranja9.addTo(map);
rutaNaranja8.addTo(map);
rutaNaranja7.addTo(map);
rutaNaranja6.addTo(map);
rutaNaranja5.addTo(map);
rutaNaranja4.addTo(map);
rutaNaranja3.addTo(map);
rutaNaranja2.addTo(map);
rutaNaranja.addTo(map);




        // Llamada inicial a updateMarkers con un array vacío para no mostrar marcadores al cargar
        updateMarkers('', []);

        var initialLoad = true; // Variable para controlar la carga inicial

    function updateMarkers(query, activeFilters) {
        edificioMarkers.clearLayers();
        if (query || activeFilters.length > 0) { // Mostrar solo si hay una búsqueda o filtros activos
            markersData.forEach(function (data) {
                var matchesQuery = data.name.includes(query.toLowerCase());
                var matchesFilter = activeFilters.length === 0; // Si no hay filtros activos, todos pasan

                if (activeFilters.length > 0) {
                    matchesFilter = false;
                    if (activeFilters.includes('otros')) {
                        const excludedTypes = ['administrativo', 'aula', 'laboratorio', 'baño', 'acceso'];
                        if (!excludedTypes.includes(data.tipo)) {
                            matchesFilter = true;
                        }
                    }
                    if (activeFilters.includes(data.tipo)) {
                        matchesFilter = true;
                    }
                    if (activeFilters.includes('baño')) {
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
    updateMarkers('', []);
    initialLoad = false; // Desactivar la bandera después de la carga inicial
            document.getElementById('searchInput').addEventListener('input', function () {
                var query = this.value.trim();
                var activeFilters = Array.from(document.querySelectorAll('.filter-button.active'))
                    .map(button => button.getAttribute('data-filter'));
                updateMarkers(query, activeFilters);
            });

            document.querySelectorAll('.filter-button').forEach(function (button) {
                button.addEventListener('click', function () {
                    this.classList.toggle('active');
                    var query = document.getElementById('searchInput').value.trim();
                    var activeFilters = Array.from(document.querySelectorAll('.filter-button.active'))
                        .map(button => button.getAttribute('data-filter'));
                    updateMarkers(query, activeFilters);
                });
            });
        });