app.controller("MapController", ["$scope", "$rootScope", "$ionicLoading", "$ionicModal", "$compile", "$cordovaGeolocation", "$timeout", "$filter", "leafletMarkerEvents", "leafletData", "MapsServices", "apiMadiva", function($scope, $rootScope, $ionicLoading, $ionicModal, $compile, $cordovaGeolocation, $timeout, $filter, leafletMarkerEvents, leafletData, MapsServices, apiMadiva) {

    /* VALORES POR DEFECTO */
    var zoomDefault = 16;
    $scope.vistaActiva;
    $scope.netReady = $rootScope.netReady;


    /* FUNCIONES DEL MAPA  */
    $scope.typesMap = MapsServices.typeMaps;
    $scope.newLocation;

    var madiva_icons = {
        currentIicon: {
            iconUrl: 'img/marker/house.png',
            shadowUrl: 'img/marker/house_shadow.png',
            iconSize: [32, 37],
            shadowSize: [32, 37],
            iconAnchor: [12, 37],
            shadowAnchor: [0, 37],
            popupAnchor: [4, -36]
        }
    };

    angular.extend($scope, {
        tiles: {
            url: 'http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png'
        },
        center: {
            lat: 40.24,
            lng: -3.41,
            zoom: 5
        },
        layers: {
            overlays: {}
        },
        icons: madiva_icons,
        options: {
            attributionControl: false,
            zoomControl: false,
            controls: {
                layers: {
                    visible: false
                }
            }
        },
        controls: {
            scale: true
        },
        events: {
            markers: {
                enable: leafletMarkerEvents.getAvailableEvents(),
            }
        }
    });

    var markerEvents = leafletMarkerEvents.getAvailableEvents();

    for (var k in markerEvents) {
        var eventName = 'leafletDirectiveMarker.map.' + markerEvents[k];
        $scope.$on(eventName, function(event, e) {
            if (event.name == 'leafletDirectiveMarker.map.dragend') {
                var coords = e.leafletEvent.target.getLatLng();
                var lat = coords.lat;
                var lng = coords.lng;
                angular.extend($scope, {
                    center: {
                        lat: lat,
                        lng: lng,
                        zoom: zoomDefault
                    }
                });

                if ($scope.vistaActiva != undefined) {
                    posicionMarker = $timeout(function() {
                        $timeout.cancel(posicionMarker);
                        $scope.changeMapType($scope.vistaActiva);
                    }, 500);
                }
            }
        });
    }


    /* CONTROLAMOS LOS EVENTOS DEL MAPA */
    var refreshMap = false;

    $scope.$on('leafletDirectiveMap.map.mousedown', function(event) {
        $scope.dataSearch.show = false;
    });

    $scope.$on('leafletDirectiveMap.map.drag', function(event) {
        if ($scope.dataDetail == false) {
            refreshMap = true;
        }
    });

    $scope.$on('leafletDirectiveMap.map.dragend', function(event) {
        if (refreshMap == true) {
            refreshMap = false;
            if ($scope.vistaActiva != undefined) {
                $scope.changeMapType($scope.vistaActiva);
            }
        }
    });

    $scope.$on('leafletDirectiveMap.map.zoomend', function(event) {
        if ($scope.vistaActiva != undefined) {
            $scope.changeMapType($scope.vistaActiva);
        }
    });


    /* CAMBIAMOS LA VISTA DE DATOS DEL MAPA */
    $scope.changeMapType = function(idType) {
        if ($rootScope.detectNetworkData() == true) {
            if (idType != undefined) {
                $scope.vistaActiva = idType;
                $('.sidemenuMadiva .listaSidemenu ion-item').removeClass('active');
                $('#' + MapsServices.typeMaps[idType].id).addClass('active');

                $scope.layers.overlays = {};
                $scope.dataSearch.address = '';
                $scope.dataSearch.show = false;

                leafletData.getMap().then(function(map) {

                    if (map.getZoom() >= zoomDefault) {

                        $ionicLoading.show({
                            animation: 'fade-in',
                            template: '<ion-spinner></ion-spinner><br/><br/>Cargando geometrías...'
                        });

                        var centerMap = map.getCenter();
                        var bounds = map.getBounds();
                        var southWest = bounds.getSouthWest().wrap();
                        var northEast = bounds.getNorthEast().wrap();

                        apiMadiva.cargaDatosApi(centerMap, southWest, northEast)
                        .success(function(response) {
                            var datosCostru = {};
                            datosCostru = angular.extend($scope.layers.overlays, filtroCapasMapa(MapsServices.typeMaps[idType].layer, response, $scope));
                            $scope.pintaLeyenda(datosCostru, MapsServices.typeMaps[idType].legendTitle);
                            $ionicLoading.hide();
                        }).error(function() {
                            $ionicLoading.hide();
                            var alertPopup = $ionicPopup.alert({
                                title: 'Error cargando geometrías',
                                template: '<center>Por favor inténtelo más tarde</center>',
                                buttons: [{
                                    text: '<b>Aceptar</b>',
                                    type: 'button-madiva'
                                }]
                            });
                        });
                    }
                });
            }
        }
        $scope.netReady = $rootScope.netReady;
    };

    /* Pintamos leyenda del mapa */
    $scope.pintaLeyenda = function(data, nameData) {

        var coloresLeyenda = Array();
        var literalesLeyenda = Array();

        angular.forEach(data, function(value, key) {
            literalesLeyenda.push(value.name);
            coloresLeyenda.push(value.layerOptions.style.fillColor);
        });

        angular.extend($scope, {
            legend: {
                legendTitle: nameData,
                position: 'bottomright',
                colors: coloresLeyenda,
                labels: literalesLeyenda
            }
        });
    }

    /* Eventos de las capa de catastro */
    $scope.onEachFeature = function(feature, layer) {
        layer.bindPopup();
        layer.on('click', function() {
            $scope.detalleInmueble(feature, layer);
        });
    }


    /* FUNCIONES DEL BUSCADOR DE DIRECCION */
    $ionicModal.fromTemplateUrl('searchDetail.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.modalSearch = modal;
    });

    $scope.item = {};
    $scope.dataSearch = {};

    $scope.showSearch = function() {
        if ($rootScope.detectNetworkData() == true) {
            $scope.dataSearch.load = true;
            $scope.dataSearch.show = !$scope.dataSearch.show;

            if (!$scope.dataSearch.show) {
                $scope.dataSearch.address = '';
            } else {
                $timeout(function() {
                    document.getElementById('searchKey').select();
                }, 0);
            }

            leafletData.getMap().then(function(map) {
                map._onResize();
            })
        }
        $scope.netReady = $rootScope.netReady;
    }

    $scope.searchAddress = function() {
        if (($scope.dataSearch.address) && ($rootScope.detectNetworkData() == true)) {

            $scope.itemsSearch = {};

            $ionicLoading.show({
                animation: 'fade-in',
                template: '<ion-spinner></ion-spinner><br/><br/>Buscando...'
            });

            var request = new XMLHttpRequest();
            request.open('POST', 'http://madiva.cartodb.com/api/v1/map', true);
            request.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
            var jsonMapConfig = '{"version": "1.3.0","layers": [{"type": "http","options": {"urlTemplate": "http://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png","subdomains": ["a","b","c"]}}]}';
            request.send(jsonMapConfig);

            request.onload = function() {
                if (this.status >= 200 && this.status < 400) {

                    var layergroup = JSON.parse(this.response);

                    $.getJSON('http://nominatim.openstreetmap.org/search?format=json&limit=5&addressdetails=1&q=' + $scope.dataSearch.address).success(function(result) {

                        resultSearch = [];

                        angular.forEach(result, function(value, key) {
                            value.display_name = $filter('name_search')(value.display_name);
                            value.staticImage = 'http://madiva.cartodb.com/api/v1/map/static/center/' + layergroup.layergroupid + '/14/' + value.lat + '/' + value.lon + '/80/80.jpg';
                            resultSearch[key] = value;
                        });

                        leafletData.getMap().then(function() {
                            $scope.dataSearch.address = '';
                            $scope.dataSearch.show = false;
                            $ionicLoading.hide();
                            $scope.itemsSearch = resultSearch;
                            $scope.modalSearch.show();
                        });
                    });

                } else {
                    console.log('Error cargando la imagen estatica: ' + this.status + ' -> ' + this.response);
                }
            };
        }
        $scope.netReady = $rootScope.netReady;
    }

    $scope.posicionaMapa = function(lat, lng) {

        $scope.modalSearch.hide();

        angular.extend($scope, {
            center: {
                lat: lat,
                lng: lng,
                zoom: zoomDefault
            },
            markers: {
                current: {
                    id: 'value.id',
                    type: 'value.type',
                    focus: true,
                    icon: madiva_icons.currentIicon,
                    lat: lat,
                    lng: lng,
                    message: "Tu ubicación",
                    draggable: true
                }
            }
        });

        if ($scope.vistaActiva != undefined) {
            posicionMarker = $timeout(function() {
                $timeout.cancel(posicionMarker);
                $scope.changeMapType($scope.vistaActiva);
            }, 500);
        }
    }


    /* OPTENEMOS POSICION ACTUAL GPS */
    $scope.getCurrentPosition = function() {
        if ($rootScope.detectNetworkData() == true) {
            var promise = '';
            $scope.markers = {};

            $ionicLoading.show({
                animation: 'fade-in',
                template: '<ion-spinner></ion-spinner><br/><br/>Localizando...'
            });

            $scope.dataSearch.address = ''
            $scope.dataSearch.show = false;

            $cordovaGeolocation.getCurrentPosition().then(
                function(position) {
                    angular.extend($scope, {
                        center: {
                            lat: position.coords.latitude,
                            lng: position.coords.longitude,
                            zoom: zoomDefault
                        },
                        markers: {
                            current: {
                                focus: true,
                                icon: madiva_icons.currentIicon,
                                lat: position.coords.latitude,
                                lng: position.coords.longitude,
                                message: "Tu ubicación",
                                draggable: true
                            }
                        }
                    });

                    $ionicLoading.hide();

                    if ((promise) && ($scope.vistaActiva != undefined)) {
                        $timeout.cancel(promise);
                    }
                    promise = $timeout(function() {
                        $scope.changeMapType($scope.vistaActiva);
                    }, 500);
                },
                function(err) {
                    console.log("Erorr en la geoposicion!");
                    console.log(err);
                });
        }
        $scope.netReady = $rootScope.netReady;
    };


    /* POPUP DE INFORMACION/SELECCION DEL INMUEBLE */
    $scope.dataDetail = false;

    $scope.detalleInmueble = function(feature, layer) {
        if ($rootScope.detectNetworkData() == true) {

            $scope.dataSearch.address = '';
            $scope.dataSearch.show = false;
            $scope.dataDetail = true;

            leafletData.getMap().then(function(map) {

                var bounds = map.getBounds();
                var southWest = bounds.getSouthWest().wrap();
                var northEast = bounds.getNorthEast().wrap();

                var sqlJSON = new cartodb.SQL({ user: 'madivapro', format: 'geojson', dp: 5 });
                var sql = "SELECT * FROM constru WHERE refcat like '" + feature.properties.REFCAT + "' AND (the_geom && ST_MakeEnvelope(" + southWest.lng + ", " + southWest.lat + ", " + northEast.lng + ", " + northEast.lat + "))";

                sqlJSON.execute(sql).done(function(data, status) {

                    /* Creamos objeto con las propiedades del inmueble */
                    $scope.detalleInmueble[feature.properties.REFCAT] = feature.properties;

                    /* Pintamos los detalles de inmueble */
                    var template = '<div id="popupInfo">';
                    template += '<div id="cabeceraInfo"><h4>CALLE MONTEVERDI, 14</h4><h5><strong>RefCat:</strong> <i>' + feature.properties.REFCAT + '</i></h5></div>';
                    template += '<div id="centralInfo">';
                    template += '<div id="mapaInfo"></div>';
                    template += '<div id="caracteristicasInfo"><ul class="listas">'
                    template += '</ul></div>';
                    template += '</div>';
                    template += '<div id="pieInfo"><button title="Ver detalle" ng-click="verDetalleInmueble(\'' + feature.properties.REFCAT + '\')" type="button" class="button button-madiva">Ver detalle</button></div>';
                    template += '</div>';
                    var linkFn = $compile(template);
                    var content = linkFn($scope);

                    /* Lanzamos PopUp de Información del inmueble */
                    var popupOptions = {
                        'minWidth': '500px',
                        'maxWidth': '500px'
                    }

                    popup = layer.bindPopup(content[0], popupOptions).openPopup();

                    popup.on("popupclose", function() {
                        $scope.dataDetail = false;
                    })

                    /* Pintamos las carcteristicas del inmueble */
                    $('#caracteristicasInfo .listas').append('<li><strong>Año de construcción:</strong> ' + feature.properties.ANNOCONSTRUCCIONMEDIAN + '</li>');
                    $('#caracteristicasInfo .listas').append('<li><strong>Número de viviendas:</strong> ' + feature.properties.NUMVIVIENDAS + '</li>');
                    $('#caracteristicasInfo .listas').append('<li><strong>Superficie media:</strong> ' + $filter('number_format')(feature.properties.SUPCONSTRUIDAMEDIAN) + ' m<sup>2</sup></li>');
                    $('#caracteristicasInfo .listas').append('<li><strong>Renta media:</strong> ' + $filter('number_format')(feature.properties.RENTAMEDIAN) + ' €</li>');
                    $('#caracteristicasInfo .listas').append('<li><strong>Location Index:</strong> ' + feature.properties.LOCATIONINDEX + '</li>');

                    /* Pintamos el gráfico del inmueble */
                    $scope.pintaInmueble('mapaInfo', data, 125, 125);

                });

            });
        }
        $scope.netReady = $rootScope.netReady;
    }


    /* VER DETALLE DEL INMUEBLE */
    $ionicModal.fromTemplateUrl('modalDetail.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.modalDetail = modal;
    });

    $scope.verDetalleInmueble = function(refCatastral) {
        if ($rootScope.detectNetworkData() == true) {

            $scope.dataDetail = false;

            leafletData.getMap().then(function(map) {
                map.closePopup();
            });

            $scope.propertiesDetail = [
            { 'indice': 'Ref. Catastral', 'valor': $scope.detalleInmueble[refCatastral].REFCAT },
            { 'indice': 'Construcción', 'valor': $scope.detalleInmueble[refCatastral].ANNOCONSTRUCCIONMEDIAN },
            { 'indice': 'Superficie', 'valor': $scope.detalleInmueble[refCatastral].SUPCONSTRUIDAMEDIAN + ' m2' },
            { 'indice': 'Location INDEX', 'valor': $scope.detalleInmueble[refCatastral].LOCATIONINDEX }
            ]

            $scope.economicsDetail = [
            { 'indice': 'Precio alquiler', 'valor': $filter('number_format')($scope.detalleInmueble[refCatastral].PRECIOM2ALQUILER, 2) + ' €/m2' },
            { 'indice': 'Precio venta', 'valor': $filter('number_format')($scope.detalleInmueble[refCatastral].PRECIOM2VENTA, 2) + ' €/m2' },
            { 'indice': 'Renta Media', 'valor': $filter('number_format')($scope.detalleInmueble[refCatastral].RENTAMEDIAN, 2) + ' €' }
            ]

            $scope.modalDetail.show();
        }
        $scope.netReady = $rootScope.netReady;
    }


    /* FUNCION PINTA INMUEBLE DE CATASTRO */
    $scope.pintaInmueble = function(layer, data, w, h) {
        var scale = 100;
        var center = d3.geo.centroid(data);
        var projection = d3.geo.mercator().translate([w / 2, h / 2]).scale(scale).center(center);
        var path = d3.geo.path().projection(projection);
        var bounds = path.bounds(data);
        var hscale = scale * (w - 15) / (bounds[1][0] - bounds[0][0]);
        var vscale = scale * (h - 15) / (bounds[1][1] - bounds[0][1]);
        scale = (hscale < vscale ? hscale : vscale) * .85;
        scale = scale < 1000 ? 2500000 : scale;
        offset = [
        w - (bounds[0][0] + bounds[1][0]) / 2,
        h - (bounds[0][1] + bounds[1][1]) / 2
        ];
        projection = d3.geo.mercator().center(center).scale(scale).translate(offset);
        path = path.projection(projection);

        angular.element(document.querySelector('#' + layer)).empty();
        var svg = d3.select("#" + layer).append("svg").attr("width", w).attr("height", h).attr("id", "capa_" + layer);
        svg.selectAll("path").data(data.features).enter().append("path").attr("d", path).attr("class", function(data) {
            return data.properties.constru
        });
    }


    /* ADMIN */
    $scope.admin = function() {
        $state.go('app.admin');
    }


    /* LOGOUT */
    $scope.logout = function() {
        $ionicSideMenuDelegate.toggleLeft();
        AuthService.logout();
        $state.go('login');
    };

}]);