var bitstampApp = angular.module('hive-bitstamp', []);
bitstampApp.directive( [ 'focus', 'blur', 'keyup', 'keydown', 'keypress', 'scroll' ].reduce( function ( container, name ) {
    var directiveName = 'ng' + name[ 0 ].toUpperCase( ) + name.substr( 1 );
    container[ directiveName ] = [ '$parse', function ( $parse ) {
        return function ( scope, element, attr ) {
            var fn = $parse( attr[ directiveName ] );
            element.bind( name, function ( event ) {
                scope.$apply( function ( ) {
                    fn( scope, {
                        $event : event
                    } );
                } );
            } );
        };
    } ];
    return container;
}, { } ) );

function ScreenCtrl($scope) {
  $scope.screens = [];
  $scope.getScreenClass = function(screen) {
    if ( !$scope.screens || $scope.screens.lenght ) return 'right';
    if ( $scope.screens[$scope.screens.length-1] == screen )
      return 'center';
    if ( $scope.screens.indexOf(screen) >= 0 )
      return 'left';
    return 'right';
  }
  $scope.pushView = function(screen) {
    $scope.screens.push(screen);
  }
  $scope.popView = function() {
    $scope.screens.pop();
  }
  $scope.$on('pushView', function(e, view){
    $scope.pushView(view);
  });
}

bitstampApp.controller('MainCtrl', ['$scope', function($scope) {
  $scope.credentials = {};
}]);

bitstampApp.controller('LoginCtrl', ['$scope', '$http', function($scope, $http) {
  $scope.logger = {};
  $scope.submitClick = function(event) {
    postData = {user: ($scope.credentials.login || ""), password: ($scope.credentials.password || "")};
    console.log(postData);
    $.post('https://www.bitstamp.net/api/bitcoin_deposit_address/', postData)
      .done(function(response){
       if (response['error']) {
          $scope.logger.color = "red";
          $scope.logger.msg = "wrong user or password";
       } else {
         $scope.pushView('home-screen');
       }
      })
      .fail(function(response){
          $scope.logger.color = "red";
          $scope.logger.msg = "Something went wrong!";
      });
  }
}]);

bitstampApp.controller('HomeCtrl', ['$scope', function($scope) {

}]);

/*

bitstampApp = angular.module('hive-bitstamp', [])
  .config(['$routeProvider'], function($routeProvider){
    $routeProvider
      .when('/login', {templateUrl: 'views/login.html', controller: LoginCtrl})
      .when('/', {templateUrl: 'views/home.html', controller: HomeCtrl})
      .otherwise({redirectTo: '/login'});
  });

var MainCtrl = function($scope) {
  $scope.credentials = {};
}

var LoginCtrl = function($scope, $http) {
  $scope.logger = {};
  $scope.submitClick = function(event) {
    postData = {user: ($scope.credentials.login || ""), password: ($scope.credentials.password || "")};
    console.log(postData);
    $.post('https://www.bitstamp.net/api/bitcoin_deposit_address/', postData)
      .done(function(response){
       if (response['error']) {
          $scope.logger.color = "red";
          $scope.logger.msg = "wrong user or password";
       } else {
         console.log(response)
       }
      })
      .fail(function(response){
          $scope.logger.color = "red";
          $scope.logger.msg = "Something went wrong!";
      });
  }
}

var homeCtrl = function() {}

*/


//$('#send_deposit').on('click', function(event){
    //event.preventDefault();
    //$('#logger').html('');
    //var amount = parseFloat($('#amount').val() || 0.0);
    //if (amount <= 0.0) {
       //$('#logger').html('<span style="color:red;">You need to specify amount!</span>');
      //return false;
    //}
    //$.post('https://www.bitstamp.net/api/bitcoin_deposit_address/', {user: $('#user').val(), password: $('#password').val()})
     //.done(function(response){
       //if (response['error']) {
         //$('#logger').html('<span style="color:red;">Wrong user or password</span>');
       //} else {
         //$('#logger').html('<div>Sending '+amount+' coins to Bitstamp deposit ('+response+')</div>');
         //bitcoin.sendCoins(response,  amount,  function(success, hash)  {
           //if (success){
           //$('#logger').append('<div style="color:green;">Finished with success ' + success + ' and hash ' + hash+'</div>');
           //} else {
            //$('#logger').html('Canceled');
           //}
         //});
       //}
     //})
    //.fail(function(response){alert('Failed:'+response)})
  //});

  //$('#withdrawal').on('click', function(event){
      //event.preventDefault();

    //var amount = parseFloat($('#amount').val()||0.0);
    //if (amount <= 0.0) {
       //$('#logger').html('<span style="color:red;">You need to specify amount!</span>');
      //return false;
    //}

    //bitcoin.getClientInfo(function(info) {
      //$('#logger').html('<div>Sending '+amount+' coins from Bitstamp deposit to Hive ('+info['address']+')</div>');
		//$.post('https://www.bitstamp.net/api/bitcoin_withdrawal/',
             //{user: $('#user').val(), password: $('#password').val(), amount: amount, address: info['address']})
       //.done(function(response){
         //if (response['error']) {
           //if(response['error']['amount']) {
               //$('#logger').html('<div style="color:red;">'+response['error']['amount']+'</div>');
           //} else {
               //$('#logger').html('<div style="color:red;">'+response['error']+'</div>');
           //}
         //} else {
           //$('#logger').append('<div style="color:green;">Finished with success ' + response +'</div>');
         //}
       //})
      //.fail(function(response){alert('Failed:'+response)})
	//});

  //});
