/* FILTROS DE LAS CAPAS DE CATASTRO */
function filtroCapasMapa(tipoFiltro, datosFiltro, $scope) {

    var capasMapaDef = new Object();

    switch (tipoFiltro) {

        case 'SUPCONSTRUIDAMEDIAN':

            capasMapaDef['<100'] = new Object();
            capasMapaDef['<100'].data = new Object();
            capasMapaDef['<100'].data.features = new Array();
            capasMapaDef['<100'].layerOptions = new Object();
            capasMapaDef['<100'].data.type = 'FeatureCollection';
            capasMapaDef['<100'].name = '<100 metros';
            capasMapaDef['<100'].type = 'geoJSONShape';
            capasMapaDef['<100'].visible = true;
            capasMapaDef['<100'].layerParams = new Object();
            capasMapaDef['<100'].layerOptions.onEachFeature = $scope.onEachFeature;
            capasMapaDef['<100'].layerOptions.style = {
                color: '#000',
                fillColor: '#FDAE61',
                weight: 0.6,
                opacity: 0.4,
                fillOpacity: 0.4
            };

            capasMapaDef['<200'] = new Object();
            capasMapaDef['<200'].data = new Object();
            capasMapaDef['<200'].data.features = new Array();
            capasMapaDef['<200'].layerOptions = new Object();
            capasMapaDef['<200'].data.type = 'FeatureCollection';
            capasMapaDef['<200'].name = '<200 metros';
            capasMapaDef['<200'].type = 'geoJSONShape';
            capasMapaDef['<200'].visible = true;
            capasMapaDef['<200'].layerParams = new Object();
            capasMapaDef['<200'].layerOptions.onEachFeature = $scope.onEachFeature;
            capasMapaDef['<200'].layerOptions.style = {
                color: '#000',
                fillColor: '#F46D43',
                weight: 0.6,
                opacity: 0.4,
                fillOpacity: 0.4
            };

            capasMapaDef['>200'] = new Object();
            capasMapaDef['>200'].data = new Object();
            capasMapaDef['>200'].data.features = new Array();
            capasMapaDef['>200'].layerOptions = new Object();
            capasMapaDef['>200'].data.type = 'FeatureCollection';
            capasMapaDef['>200'].name = '>200 metros';
            capasMapaDef['>200'].type = 'geoJSONShape';
            capasMapaDef['>200'].visible = true;
            capasMapaDef['>200'].layerParams = new Object();
            capasMapaDef['>200'].layerOptions.onEachFeature = $scope.onEachFeature;
            capasMapaDef['>200'].layerOptions.style = {
                color: '#000',
                fillColor: '#D53E4F',
                weight: 0.6,
                opacity: 0.4,
                fillOpacity: 0.4
            };

            angular.forEach(datosFiltro.features, function(value) {
                switch (true) {
                    case (value.properties.SUPCONSTRUIDAMEDIAN > 0) && (value.properties.SUPCONSTRUIDAMEDIAN < 100):
                        capasMapaDef['<100'].data.features.push(value);
                        break;
                    case (value.properties.SUPCONSTRUIDAMEDIAN >= 100) && (value.properties.SUPCONSTRUIDAMEDIAN < 200):
                        capasMapaDef['<200'].data.features.push(value);
                        break;
                    case (value.properties.SUPCONSTRUIDAMEDIAN >= 200):
                        capasMapaDef['>200'].data.features.push(value);
                        break;
                }
            })

            break;

        case 'RENTAMEDIAN':

            var dataMax = 0;
            var dataMin = 999999999999;

            angular.forEach(datosFiltro.features, function(value) {
                if (value.properties.RENTAMEDIAN < dataMin) {
                    dataMin = value.properties.RENTAMEDIAN;
                }
                if (value.properties.RENTAMEDIAN > dataMax) {
                    dataMax = value.properties.RENTAMEDIAN;
                }
            })

            var difData = dataMax - dataMin;
            difData = Math.round(difData / 5);

            capasMapaDef['>' + (dataMax - difData)] = new Object();
            capasMapaDef['>' + (dataMax - difData)].data = new Object();
            capasMapaDef['>' + (dataMax - difData)].data.features = new Array();
            capasMapaDef['>' + (dataMax - difData)].layerOptions = new Object();
            capasMapaDef['>' + (dataMax - difData)].data.type = 'FeatureCollection';
            capasMapaDef['>' + (dataMax - difData)].name = 'Renta media > ' + numberToCurrency((dataMax - difData), ',', '.', 0) + ' €';
            capasMapaDef['>' + (dataMax - difData)].type = 'geoJSONShape';
            capasMapaDef['>' + (dataMax - difData)].visible = true;
            capasMapaDef['>' + (dataMax - difData)].layerParams = new Object();
            capasMapaDef['>' + (dataMax - difData)].layerOptions.onEachFeature = $scope.onEachFeature;
            capasMapaDef['>' + (dataMax - difData)].layerOptions.style = {
                color: '#000',
                fillColor: '#d54910',
                weight: 0.6,
                opacity: 0.4,
                fillOpacity: 0.2
            };

            capasMapaDef['>' + (dataMax - (difData * 2))] = new Object();
            capasMapaDef['>' + (dataMax - (difData * 2))].data = new Object();
            capasMapaDef['>' + (dataMax - (difData * 2))].data.features = new Array();
            capasMapaDef['>' + (dataMax - (difData * 2))].layerOptions = new Object();
            capasMapaDef['>' + (dataMax - (difData * 2))].data.type = 'FeatureCollection';
            capasMapaDef['>' + (dataMax - (difData * 2))].name = 'Renta media >= ' + numberToCurrency((dataMax - (difData * 2)), ',', '.', 0) + ' €';
            capasMapaDef['>' + (dataMax - (difData * 2))].type = 'geoJSONShape';
            capasMapaDef['>' + (dataMax - (difData * 2))].visible = true;
            capasMapaDef['>' + (dataMax - (difData * 2))].layerParams = new Object();
            capasMapaDef['>' + (dataMax - (difData * 2))].layerOptions.onEachFeature = $scope.onEachFeature;
            capasMapaDef['>' + (dataMax - (difData * 2))].layerOptions.style = {
                color: '#000',
                fillColor: '#ff7e00',
                weight: 0.6,
                opacity: 0.4,
                fillOpacity: 0.2
            };

            capasMapaDef['>' + (dataMax - (difData * 3))] = new Object();
            capasMapaDef['>' + (dataMax - (difData * 3))].data = new Object();
            capasMapaDef['>' + (dataMax - (difData * 3))].data.features = new Array();
            capasMapaDef['>' + (dataMax - (difData * 3))].layerOptions = new Object();
            capasMapaDef['>' + (dataMax - (difData * 3))].data.type = 'FeatureCollection';
            capasMapaDef['>' + (dataMax - (difData * 3))].name = 'Renta media >= ' + numberToCurrency((dataMax - (difData * 3)), ',', '.', 0) + ' €';
            capasMapaDef['>' + (dataMax - (difData * 3))].type = 'geoJSONShape';
            capasMapaDef['>' + (dataMax - (difData * 3))].visible = true;
            capasMapaDef['>' + (dataMax - (difData * 3))].layerParams = new Object();
            capasMapaDef['>' + (dataMax - (difData * 3))].layerOptions.onEachFeature = $scope.onEachFeature;
            capasMapaDef['>' + (dataMax - (difData * 3))].layerOptions.style = {
                color: '#000',
                fillColor: '#ecab1f',
                weight: 0.6,
                opacity: 0.4,
                fillOpacity: 0.2
            };

            capasMapaDef['>' + (dataMax - (difData * 4))] = new Object();
            capasMapaDef['>' + (dataMax - (difData * 4))].data = new Object();
            capasMapaDef['>' + (dataMax - (difData * 4))].data.features = new Array();
            capasMapaDef['>' + (dataMax - (difData * 4))].layerOptions = new Object();
            capasMapaDef['>' + (dataMax - (difData * 4))].data.type = 'FeatureCollection';
            capasMapaDef['>' + (dataMax - (difData * 4))].name = 'Renta media >= ' + numberToCurrency((dataMax - (difData * 4)), ',', '.', 0) + ' €';
            capasMapaDef['>' + (dataMax - (difData * 4))].type = 'geoJSONShape';
            capasMapaDef['>' + (dataMax - (difData * 4))].visible = true;
            capasMapaDef['>' + (dataMax - (difData * 4))].layerParams = new Object();
            capasMapaDef['>' + (dataMax - (difData * 4))].layerOptions.onEachFeature = $scope.onEachFeature;
            capasMapaDef['>' + (dataMax - (difData * 4))].layerOptions.style = {
                color: '#000',
                fillColor: '#17ffc0',
                weight: 0.6,
                opacity: 0.4,
                fillOpacity: 0.2
            };

            capasMapaDef['<' + (dataMax - (difData * 4))] = new Object();
            capasMapaDef['<' + (dataMax - (difData * 4))].data = new Object();
            capasMapaDef['<' + (dataMax - (difData * 4))].data.features = new Array();
            capasMapaDef['<' + (dataMax - (difData * 4))].layerOptions = new Object();
            capasMapaDef['<' + (dataMax - (difData * 4))].data.type = 'FeatureCollection';
            capasMapaDef['<' + (dataMax - (difData * 4))].name = 'Renta media < ' + numberToCurrency((dataMax - (difData * 4)), ',', '.', 0) + ' €';
            capasMapaDef['<' + (dataMax - (difData * 4))].type = 'geoJSONShape';
            capasMapaDef['<' + (dataMax - (difData * 4))].visible = true;
            capasMapaDef['<' + (dataMax - (difData * 4))].layerParams = new Object();
            capasMapaDef['<' + (dataMax - (difData * 4))].layerOptions.onEachFeature = $scope.onEachFeature;
            capasMapaDef['<' + (dataMax - (difData * 4))].layerOptions.style = {
                color: '#000',
                fillColor: '#5dc943',
                weight: 0.6,
                opacity: 0.4,
                fillOpacity: 0.2
            };

            angular.forEach(datosFiltro.features, function(value) {
                switch (true) {
                    case (parseInt(value.properties.RENTAMEDIAN) >= parseInt(dataMax - difData)):
                        capasMapaDef['>' + (dataMax - difData)].data.features.push(value);
                        break;
                    case (parseInt(value.properties.RENTAMEDIAN) >= parseInt(dataMax - (difData * 2))) && (parseInt(value.properties.RENTAMEDIAN) < parseInt(dataMax - difData)):
                        capasMapaDef['>' + (dataMax - (difData * 2))].data.features.push(value);
                        break;
                    case (parseInt(value.properties.RENTAMEDIAN) >= parseInt(dataMax - (difData * 3))) && (parseInt(value.properties.RENTAMEDIAN) < parseInt(dataMax - (difData * 2))):
                        capasMapaDef['>' + (dataMax - (difData * 3))].data.features.push(value);
                        break;
                    case (parseInt(value.properties.RENTAMEDIAN) >= parseInt(dataMax - (difData * 4))) && (parseInt(value.properties.RENTAMEDIAN) < parseInt(dataMax - (difData * 3))):
                        capasMapaDef['>' + (dataMax - (difData * 4))].data.features.push(value);
                        break;
                    case (parseInt(value.properties.RENTAMEDIAN) < parseInt(dataMax - (difData * 4))):
                        capasMapaDef['<' + (dataMax - (difData * 4))].data.features.push(value);
                        break;
                }
            })

            break;

        case 'ANNOCONSTRUCCIONMEDIAN':

            var date = new Date();
            var anyoActual = date.getFullYear();
            var etiquetasAnyos = [];

            for (x = 0; x < 6; x++) {
                if (etiquetasAnyos.length > 0) {
                    etiquetasAnyos.push(parseInt(etiquetasAnyos[etiquetasAnyos.length - 1]) - 20);
                } else {
                    etiquetasAnyos.push(anyoActual);
                }
            }

            capasMapaDef[(etiquetasAnyos[1] + 1) + '_' + etiquetasAnyos[0]] = new Object();
            capasMapaDef[(etiquetasAnyos[1] + 1) + '_' + etiquetasAnyos[0]].data = new Object();
            capasMapaDef[(etiquetasAnyos[1] + 1) + '_' + etiquetasAnyos[0]].data.features = new Array();
            capasMapaDef[(etiquetasAnyos[1] + 1) + '_' + etiquetasAnyos[0]].layerOptions = new Object();
            capasMapaDef[(etiquetasAnyos[1] + 1) + '_' + etiquetasAnyos[0]].data.type = 'FeatureCollection';
            capasMapaDef[(etiquetasAnyos[1] + 1) + '_' + etiquetasAnyos[0]].name = 'Inmuebles desde ' + (etiquetasAnyos[1] + 1) + ' a ' + etiquetasAnyos[0];
            capasMapaDef[(etiquetasAnyos[1] + 1) + '_' + etiquetasAnyos[0]].type = 'geoJSONShape';
            capasMapaDef[(etiquetasAnyos[1] + 1) + '_' + etiquetasAnyos[0]].visible = true;
            capasMapaDef[(etiquetasAnyos[1] + 1) + '_' + etiquetasAnyos[0]].layerParams = new Object();
            capasMapaDef[(etiquetasAnyos[1] + 1) + '_' + etiquetasAnyos[0]].layerOptions.onEachFeature = $scope.onEachFeature;
            capasMapaDef[(etiquetasAnyos[1] + 1) + '_' + etiquetasAnyos[0]].layerOptions.style = {
                color: '#000',
                fillColor: '#d54910',
                weight: 0.6,
                opacity: 0.4,
                fillOpacity: 0.2
            };

            capasMapaDef[(etiquetasAnyos[2] + 1) + '_' + etiquetasAnyos[1]] = new Object();
            capasMapaDef[(etiquetasAnyos[2] + 1) + '_' + etiquetasAnyos[1]].data = new Object();
            capasMapaDef[(etiquetasAnyos[2] + 1) + '_' + etiquetasAnyos[1]].data.features = new Array();
            capasMapaDef[(etiquetasAnyos[2] + 1) + '_' + etiquetasAnyos[1]].layerOptions = new Object();
            capasMapaDef[(etiquetasAnyos[2] + 1) + '_' + etiquetasAnyos[1]].data.type = 'FeatureCollection';
            capasMapaDef[(etiquetasAnyos[2] + 1) + '_' + etiquetasAnyos[1]].name = 'Inmuebles desde ' + (etiquetasAnyos[2] + 1) + ' a ' + etiquetasAnyos[1];
            capasMapaDef[(etiquetasAnyos[2] + 1) + '_' + etiquetasAnyos[1]].type = 'geoJSONShape';
            capasMapaDef[(etiquetasAnyos[2] + 1) + '_' + etiquetasAnyos[1]].visible = true;
            capasMapaDef[(etiquetasAnyos[2] + 1) + '_' + etiquetasAnyos[1]].layerParams = new Object();
            capasMapaDef[(etiquetasAnyos[2] + 1) + '_' + etiquetasAnyos[1]].layerOptions.onEachFeature = $scope.onEachFeature;
            capasMapaDef[(etiquetasAnyos[2] + 1) + '_' + etiquetasAnyos[1]].layerOptions.style = {
                color: '#000',
                fillColor: '#ff7e00',
                weight: 0.6,
                opacity: 0.4,
                fillOpacity: 0.2
            };

            capasMapaDef[(etiquetasAnyos[3] + 1) + '_' + etiquetasAnyos[2]] = new Object();
            capasMapaDef[(etiquetasAnyos[3] + 1) + '_' + etiquetasAnyos[2]].data = new Object();
            capasMapaDef[(etiquetasAnyos[3] + 1) + '_' + etiquetasAnyos[2]].data.features = new Array();
            capasMapaDef[(etiquetasAnyos[3] + 1) + '_' + etiquetasAnyos[2]].layerOptions = new Object();
            capasMapaDef[(etiquetasAnyos[3] + 1) + '_' + etiquetasAnyos[2]].data.type = 'FeatureCollection';
            capasMapaDef[(etiquetasAnyos[3] + 1) + '_' + etiquetasAnyos[2]].name = 'Inmuebles desde ' + (etiquetasAnyos[3] + 1) + ' a ' + etiquetasAnyos[2];
            capasMapaDef[(etiquetasAnyos[3] + 1) + '_' + etiquetasAnyos[2]].type = 'geoJSONShape';
            capasMapaDef[(etiquetasAnyos[3] + 1) + '_' + etiquetasAnyos[2]].visible = true;
            capasMapaDef[(etiquetasAnyos[3] + 1) + '_' + etiquetasAnyos[2]].layerParams = new Object();
            capasMapaDef[(etiquetasAnyos[3] + 1) + '_' + etiquetasAnyos[2]].layerOptions.onEachFeature = $scope.onEachFeature;
            capasMapaDef[(etiquetasAnyos[3] + 1) + '_' + etiquetasAnyos[2]].layerOptions.style = {
                color: '#000',
                fillColor: '#ecab1f',
                weight: 0.6,
                opacity: 0.4,
                fillOpacity: 0.2
            };

            capasMapaDef[(etiquetasAnyos[4] + 1) + '_' + etiquetasAnyos[3]] = new Object();
            capasMapaDef[(etiquetasAnyos[4] + 1) + '_' + etiquetasAnyos[3]].data = new Object();
            capasMapaDef[(etiquetasAnyos[4] + 1) + '_' + etiquetasAnyos[3]].data.features = new Array();
            capasMapaDef[(etiquetasAnyos[4] + 1) + '_' + etiquetasAnyos[3]].layerOptions = new Object();
            capasMapaDef[(etiquetasAnyos[4] + 1) + '_' + etiquetasAnyos[3]].data.type = 'FeatureCollection';
            capasMapaDef[(etiquetasAnyos[4] + 1) + '_' + etiquetasAnyos[3]].name = 'Inmuebles desde ' + (etiquetasAnyos[4] + 1) + ' a ' + etiquetasAnyos[3];
            capasMapaDef[(etiquetasAnyos[4] + 1) + '_' + etiquetasAnyos[3]].type = 'geoJSONShape';
            capasMapaDef[(etiquetasAnyos[4] + 1) + '_' + etiquetasAnyos[3]].visible = true;
            capasMapaDef[(etiquetasAnyos[4] + 1) + '_' + etiquetasAnyos[3]].layerParams = new Object();
            capasMapaDef[(etiquetasAnyos[4] + 1) + '_' + etiquetasAnyos[3]].layerOptions.onEachFeature = $scope.onEachFeature;
            capasMapaDef[(etiquetasAnyos[4] + 1) + '_' + etiquetasAnyos[3]].layerOptions.style = {
                color: '#000',
                fillColor: '#17ffc0',
                weight: 0.6,
                opacity: 0.4,
                fillOpacity: 0.2
            };

            capasMapaDef[(etiquetasAnyos[5] + 1) + '_' + etiquetasAnyos[4]] = new Object();
            capasMapaDef[(etiquetasAnyos[5] + 1) + '_' + etiquetasAnyos[4]].data = new Object();
            capasMapaDef[(etiquetasAnyos[5] + 1) + '_' + etiquetasAnyos[4]].data.features = new Array();
            capasMapaDef[(etiquetasAnyos[5] + 1) + '_' + etiquetasAnyos[4]].layerOptions = new Object();
            capasMapaDef[(etiquetasAnyos[5] + 1) + '_' + etiquetasAnyos[4]].data.type = 'FeatureCollection';
            capasMapaDef[(etiquetasAnyos[5] + 1) + '_' + etiquetasAnyos[4]].name = 'Inmuebles desde ' + (etiquetasAnyos[5] + 1) + ' a ' + etiquetasAnyos[4];
            capasMapaDef[(etiquetasAnyos[5] + 1) + '_' + etiquetasAnyos[4]].type = 'geoJSONShape';
            capasMapaDef[(etiquetasAnyos[5] + 1) + '_' + etiquetasAnyos[4]].visible = true;
            capasMapaDef[(etiquetasAnyos[5] + 1) + '_' + etiquetasAnyos[4]].layerParams = new Object();
            capasMapaDef[(etiquetasAnyos[5] + 1) + '_' + etiquetasAnyos[4]].layerOptions.onEachFeature = $scope.onEachFeature;
            capasMapaDef[(etiquetasAnyos[5] + 1) + '_' + etiquetasAnyos[4]].layerOptions.style = {
                color: '#000',
                fillColor: '#5dc943',
                weight: 0.6,
                opacity: 0.4,
                fillOpacity: 0.2
            };

            capasMapaDef['<' + etiquetasAnyos[5]] = new Object();
            capasMapaDef['<' + etiquetasAnyos[5]].data = new Object();
            capasMapaDef['<' + etiquetasAnyos[5]].data.features = new Array();
            capasMapaDef['<' + etiquetasAnyos[5]].layerOptions = new Object();
            capasMapaDef['<' + etiquetasAnyos[5]].data.type = 'FeatureCollection';
            capasMapaDef['<' + etiquetasAnyos[5]].name = 'Inmuebles anteriores a ' + etiquetasAnyos[5];
            capasMapaDef['<' + etiquetasAnyos[5]].type = 'geoJSONShape';
            capasMapaDef['<' + etiquetasAnyos[5]].visible = true;
            capasMapaDef['<' + etiquetasAnyos[5]].layerParams = new Object();
            capasMapaDef['<' + etiquetasAnyos[5]].layerOptions.onEachFeature = $scope.onEachFeature;
            capasMapaDef['<' + etiquetasAnyos[5]].layerOptions.style = {
                color: '#000',
                fillColor: '#00a741',
                weight: 0.6,
                opacity: 0.4,
                fillOpacity: 0.2
            };

            angular.forEach(datosFiltro.features, function(value) {
                switch (true) {
                    case (parseInt(value.properties.ANNOCONSTRUCCIONMEDIAN) >= parseInt(etiquetasAnyos[1] + 1)) && (parseInt(value.properties.ANNOCONSTRUCCIONMEDIAN) <= parseInt(etiquetasAnyos[0])):
                        capasMapaDef[(etiquetasAnyos[1] + 1) + '_' + etiquetasAnyos[0]].data.features.push(value);
                        break;
                    case (parseInt(value.properties.ANNOCONSTRUCCIONMEDIAN) >= parseInt(etiquetasAnyos[2] + 1)) && (parseInt(value.properties.ANNOCONSTRUCCIONMEDIAN) <= parseInt(etiquetasAnyos[1])):
                        capasMapaDef[(etiquetasAnyos[2] + 1) + '_' + etiquetasAnyos[1]].data.features.push(value);
                        break;
                    case (parseInt(value.properties.ANNOCONSTRUCCIONMEDIAN) >= parseInt(etiquetasAnyos[3] + 1)) && (parseInt(value.properties.ANNOCONSTRUCCIONMEDIAN) <= parseInt(etiquetasAnyos[2])):
                        capasMapaDef[(etiquetasAnyos[3] + 1) + '_' + etiquetasAnyos[2]].data.features.push(value);
                        break;
                    case (parseInt(value.properties.ANNOCONSTRUCCIONMEDIAN) >= parseInt(etiquetasAnyos[4] + 1)) && (parseInt(value.properties.ANNOCONSTRUCCIONMEDIAN) <= parseInt(etiquetasAnyos[3])):
                        capasMapaDef[(etiquetasAnyos[4] + 1) + '_' + etiquetasAnyos[3]].data.features.push(value);
                        break;
                    case (parseInt(value.properties.ANNOCONSTRUCCIONMEDIAN) >= parseInt(etiquetasAnyos[5] + 1)) && (parseInt(value.properties.ANNOCONSTRUCCIONMEDIAN) <= parseInt(etiquetasAnyos[4])):
                        capasMapaDef[(etiquetasAnyos[5] + 1) + '_' + etiquetasAnyos[4]].data.features.push(value);
                        break;
                    case (parseInt(value.properties.ANNOCONSTRUCCIONMEDIAN) <= parseInt(etiquetasAnyos[5])):
                        capasMapaDef['<' + etiquetasAnyos[5]].data.features.push(value);
                        break;
                }

            })

            break;
    }

    return capasMapaDef;
}

function numberToCurrency(number, decimalSeparator, thousandsSeparator, nDecimalDigits) {
    decimalSeparator = decimalSeparator || '.';
    thousandsSeparator = thousandsSeparator || ',';
    nDecimalDigits = nDecimalDigits == null ? 2 : nDecimalDigits;

    var fixed = number.toFixed(nDecimalDigits),
        parts = new RegExp('^(-?\\d{1,3})((?:\\d{3})+)(\\.(\\d{' + nDecimalDigits + '}))?$').exec(fixed);

    if (parts) {
        return parts[1] + parts[2].replace(/\d{3}/g, thousandsSeparator + '$&') + (parts[4] ? decimalSeparator + parts[4] : '');
    } else {
        return fixed.replace('.', decimalSeparator);
    }
}
