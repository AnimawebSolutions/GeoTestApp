app.controller('LoginController', function($scope, $state, $ionicModal, $ionicPopup, AuthService) {

    /* MAXIMAGE */
    $scope.$on('$ionicView.loaded', function(viewInfo, state) {
        jQuery('#maximage').maximage();
    });


    /* FUNCION DE LOGIN DE LA APLICACION */
    $scope.data = {};

    $scope.login = function(data) {
        AuthService.login(data.username, data.password).then(function(authenticated) {
            $state.go('app.map', {}, { reload: true });
            $scope.setCurrentUsername(data.username);
        }, function(err) {
            var alertPopup = $ionicPopup.alert({
                title: 'Error en la validación',
                template: 'Por favor revisa el usuario y la contraseña',
                buttons: [{
                    text: '<b>Ok</b>',
                    type: 'button-madiva'
                }]
            });
        });
    };


    /* RECUPERACION DE CONTRASEÑA */
    $ionicModal.fromTemplateUrl('modalForgot.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.modalForgot = modal;
    });

    $scope.forgotPassword = function() {
        $scope.modalForgot.show();
    }

});
