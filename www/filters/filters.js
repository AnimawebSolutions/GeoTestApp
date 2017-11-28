/* FORMATO DE NUMEROS */
app.filter('number_format', function() {
    return function(number, decimals, dec_point, thousands_sep) {
        var n = number,
            prec = decimals;

        var toFixedFix = function(n, prec) {
            var k = Math.pow(10, prec);
            return (Math.round(n * k) / k).toString();
        };

        n = !isFinite(+n) ? 0 : +n;
        prec = !isFinite(+prec) ? 0 : Math.abs(prec);
        var sep = (typeof thousands_sep === 'undefined') ? '.' : thousands_sep;
        var dec = (typeof dec_point === 'undefined') ? ',' : dec_point;

        var s = (prec > 0) ? toFixedFix(n, prec) : toFixedFix(Math.round(n), prec);

        var abs = toFixedFix(Math.abs(n), prec);
        var _, i;

        if (abs >= 1000) {
            _ = abs.split(/\D/);
            i = _[0].length % 3 || 3;

            _[0] = s.slice(0, i + (n < 0)) +
                _[0].slice(i).replace(/(\d{3})/g, sep + '$1');
            s = _.join(dec);
        } else {
            s = s.replace('.', dec);
        }

        var decPos = s.indexOf(dec);
        if (prec >= 1 && decPos !== -1 && (s.length - decPos - 1) < prec) {
            s += new Array(prec - (s.length - decPos - 1)).join(0) + '0';
        } else if (prec >= 1 && decPos === -1) {
            s += dec + new Array(prec).join(0) + '0';
        }
        return s;
    }
})

/* FILTRO PARA LA BUSQUEDA DEL MAPA */
app.filter('name_search', function() {
    return function(texto) {
        textoArray = texto.split(',');
        return textoArray[0];
    }
})
