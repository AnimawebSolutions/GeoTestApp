var app = angular.module('starter', ['ionic', 'leaflet-directive', 'ngCordova', 'ngMessages', 'ngMockE2E']);

app.run(function($ionicPlatform) {
    $ionicPlatform.ready(function() {
        if (window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            window.cordova.plugins.Keyboard.disableScroll(true);
        }
        if (window.StatusBar) {
            StatusBar.styleDefault();
        }
    });
})


/* CONFIGURACION DEL LOS LOG */
app.config(['$logProvider', function($logProvider) {
    $logProvider.debugEnabled(false);
}])


/* FUNCIONES DE SESION Y LOGIN */
app.run(function($httpBackend) {
    $httpBackend.whenGET('http://localhost:8100/valid').respond({ message: 'Login OK' });
    $httpBackend.whenGET('http://localhost:8100/notauthenticated').respond(401, { message: "Login KO" });
    $httpBackend.whenGET('http://localhost:8100/notauthorized').respond(403, { message: "No autorizado" });
    $httpBackend.whenGET(/templates\/\w+.*/).passThrough();
    $httpBackend.whenJSONP(/integracion.inmoconsulta.com\/\w+.*/).passThrough();
})

app.run(function($rootScope, $state, AuthService, AUTH_EVENTS) {
    $rootScope.$on('$stateChangeStart', function(event, next, nextParams, fromState) {
        if ('data' in next && 'authorizedRoles' in next.data) {
            var authorizedRoles = next.data.authorizedRoles;
            if (!AuthService.isAuthorized(authorizedRoles)) {
                event.preventDefault();
                $state.go($state.current, {}, { reload: true });
                $rootScope.$broadcast(AUTH_EVENTS.notAuthorized);
            }
        }

        if (!AuthService.isAuthenticated()) {
            if (next.name !== 'login') {
                event.preventDefault();
                $state.go('login');
            }
        } else {
            if (next.name === 'login') {
                event.preventDefault();
                $state.go('app.map');
            }
        }
    });
})


/* FUNCION PARA DETECTAR RED */
app.run(function($rootScope, $cordovaNetwork, $ionicPopup) {
    $rootScope.netReady = true;
    $rootScope.detectNetworkData = function() {
        try {
            if ($cordovaNetwork.isOnline() == false) {
                var alertPopup = $ionicPopup.alert({
                    title: 'Error de conexión',
                    template: 'Actualmente no se dispone de una red de datos.',
                    buttons: [{
                        text: '<b>Aceptar</b>',
                        type: 'button-madiva'
                    }]
                });
            }
            $rootScope.netReady = $cordovaNetwork.isOnline();
            return $cordovaNetwork.isOnline();
        } catch (e) {
            return true;
        }
    }
});


/* CONFIGURADOR DE RUTAS Y CONTROLADORES */
app.config(function($stateProvider, $urlRouterProvider, USER_ROLES) {
    $stateProvider
        .state('login', {
            url: "/login",
            templateUrl: "templates/login.html",
            controller: 'LoginController'
        })
        .state('app', {
            url: "/app",
            abstract: true,
            templateUrl: "templates/menu.html",
            controller: 'MapController'
        })
        .state('app.map', {
            url: "/map",
            views: {
                'menuContent': {
                    templateUrl: "templates/map.html"
                }
            }
        });
    /*.state('app.admin', {
        url: '/admin',
        views: {
            'menuContent': {
                templateUrl: "templates/admin.html"
            }
        },
        data: {
            authorizedRoles: [USER_ROLES.admin]
        }
    });*/
    $urlRouterProvider.otherwise('/login');
})
