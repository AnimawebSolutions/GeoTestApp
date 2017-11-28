app.service("apiMadiva", function($http, $rootScope) {

    this.cargaDatosApi = function(centerMap, southWest, northEast) {
        var connectAPI;
        try {
            connectAPI.abort();
        } catch (e) {
            connectAPI = $http.jsonp('http://integracion.inmoconsulta.com/apiv2pre/mobile/geografia/es/parcelas?&callback=JSON_CALLBACK&token=dd51a7c590f5039899d67b95db460362&centerLng=' + centerMap.lng + '&centerLat=' + centerMap.lat + '&southWestLng=' + southWest.lng + '&southWestLat=' + southWest.lat + '&northEastLng=' + northEast.lng + '&northEastLat=' + northEast.lat);
        }
        return connectAPI;
    }

});
