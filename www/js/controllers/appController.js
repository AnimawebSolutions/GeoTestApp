app.controller('appController', function($scope, $rootScope, $state, $ionicPopup, AuthService, AUTH_EVENTS) {

    $scope.username = AuthService.username();

    $scope.$on(AUTH_EVENTS.notAuthorized, function(event) {
        var alertPopup = $ionicPopup.alert({
            title: 'No esta autorizado!',
            template: 'No tiene permisos para acceder a esta sección.'
        });
    });

    $scope.$on(AUTH_EVENTS.notAuthenticated, function(event) {
        AuthService.logout();
        $state.go('login');
        var alertPopup = $ionicPopup.alert({
            title: 'Se perdio la sesión',
            template: 'Lo siento, tiene que volver a validar la sesión.'
        });
    });

    $scope.setCurrentUsername = function(name) {
        $scope.username = name;
    };
})
