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

function ScreenCtrl($scope, $timeout) {
  $scope.lockView = false;
  $scope.views = [{
    partial: 'templates/login.html',
    position: 'center'
  }];
  $scope.menuPartial = null;
  $scope.menuSelection = null;
  $scope.updatePositions = function(offset) {
    if ( offset == undefined )  offset = 0;
    var n = $scope.views.length-1+offset;
    var i;
    for( i in $scope.views ) {
      var view = $scope.views[i];
      view.position = i < n ? 'left' : i > n ? 'right' : 'center';
    }
  };
  $scope.pushView = function(viewName) {
    if ($scope.lockView)  return;
    $scope.lockView = true;
    $scope.views.push({
      partial: 'templates/' + viewName + '.html',
      position: 'right'
    });
  };
  $scope.$on("pushView", function(name, partial) {
    $scope.pushView(partial);
  });
  $scope.popView = function() {
    if ($scope.lockView)  return;
    $scope.lockView = true;
    
    if ( $scope.views.length - 2 >= 0 ) {
      var view = $scope.views[$scope.views.length-2];
      view.position = 'left';
    }
    setTimeout(function(){
      $scope.updatePositions(-1);
      $scope.$apply();
    }, 50);
    setTimeout(function(){
      $scope.lockView = false;
      $scope.views.pop();
      $scope.$apply();
    }, 600);
  };
  $scope.$on("popView", function() {
    $scope.popView();
  });
  $scope.partialLoaded = function() {
    setTimeout(function(){
      $scope.$apply(function(){
        $scope.updatePositions();
      });
    }, 50);
    setTimeout(function(){
      $scope.$apply(function(){
        $scope.lockView = false;
        if ( $scope.views.length - 2 >= 0 ) {
          var view = $scope.views[$scope.views.length-2];
          view.position = 'left hidden';
        }
      });
    }, 1000);
  };
  $scope.$on("loadView", function(name, partial, menu, position) {
    if ( typeof menu != 'undefined' )
      $scope.menuPartial = 'templates/' + menu + '.html';
    $scope.views = [{ partial: 'templates/' + partial + '.html', position: position ? position : 'top'}];
    $scope.menuSelection = partial;
    isDown = false;
  });
  $scope.$on("loadMenu", function(name, partial) {
    $scope.menuPartial = 'templates/' + partial + '.html';
  });
  $scope.loaderText = 'Loading...';
  $scope.$on("showLoader", function(name, text) {
    $scope.loaderText = text ? text : 'Loading...';
    $('body .loader').css({display: 'block'}).animate({opacity: 1}, 300);
    //$scope.$apply();
  });
  $scope.hideLoader = function() {
    $('body .loader').animate({opacity: 0}, function(){
      $('body .loader').css('display', 'none');
    });
  };
  $scope.$on("hideLoader", function() {
    $scope.hideLoader();
  });
  $(function(){
    var isDown = false;
    $('[data-push-view], [data-pop-view], [data-load-view], .back')
      .on('#main', 'touchstart mousedown', function(e){ 
        isDown = true;
      })
      .on('#main', 'touchmove mousemove', function(e){ 
        isDown = false;
      });
    $('[data-push-view]').on('#main', 'touchend mouseup', function(e){ 
      if (isDown) {
        $scope.pushView( $(this).data('pushView') );
        $scope.$apply();
        isDown = false;
        e.preventDefault();
      }
    });
    $('[data-pop-view], .back').on('#main', 'touchend mouseup', function(e){  
      if (isDown) {
        $scope.popView();
        $scope.$apply();
        isDown = false;
        e.preventDefault();
      }
    });
    $('[data-load-view]').on('#main', 'touchend mouseup', function(e){ 
      var partial = $(this).data('loadView');
      if (isDown && partial != $scope.menuSelection) {
        $scope.$apply(function(){
        $scope.views = [{ partial: 'templates/' + partial + '.html', position: 'top'}];
        $scope.menuSelection = partial;
        });
        isDown = false;
      }
    });
    var hash = window.location.hash.replace('#/', '');
    if (hash.length) {
      $scope.pushView( hash );
      $scope.$apply();
    }
  });
}
  /*
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
  */

bitstampApp.controller('MainCtrl', ['$scope', function($scope) {
  $scope.credentials = {};
}]);

bitstampApp.controller('LoginCtrl', ['$scope', '$http', function($scope, $http) {
  $scope.logger = {};
  $scope.submitClick = function(event) {
    postData = {user: ($scope.credentials.login || ""), password: ($scope.credentials.password || "")};
    $scope.$emit('showLoader', 'Logging In...');
    $.post('https://www.bitstamp.net/api/bitcoin_deposit_address/', postData)
      .done(function(response){
       if (response['error']) {
          $scope.logger.color = "red";
          $scope.logger.msg = "wrong user or password";
         $scope.$emit('hideLoader');
       } else {
         $scope.pushView('home-screen');
       }
          $scope.$apply();
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
