app.factory('MapsServices', [function() {

    var mapObj = {};

    mapObj.typeMaps = [{
        name: "Superficie Media",
        id: "superficie",
        layer: "SUPCONSTRUIDAMEDIAN",
        legendTitle: 'Superficie media'
    }, {
        name: "Renta Media",
        id: "renta_max",
        layer: "RENTAMEDIAN",
        legendTitle: 'Renta media'
    }, {
        name: "Año construcción",
        id: "construccion",
        layer: "ANNOCONSTRUCCIONMEDIAN",
        legendTitle: 'Año de construcción'
    }];

    return mapObj;

}]);
