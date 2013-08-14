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

bitstampApp.controller('MainCtrl', ['$scope', '$http', '$rootScope', function($scope, $http, $rootScope) {
  // ---------------------
  $scope.credentials = {};
  $scope.user_balance = {};
  $scope.logOut = function() {
    $scope.credentials.login = "";
    $scope.credentials.password = "";
    $scope.popView();
    $rootScope.menuHidden = true;
  }
  $rootScope.menuHidden = true;
  $scope.showMenu = function() {
    return $rootScope.menuHidden;
  }
  // ---------------------
  $scope.lockView = false;
  $scope.views = [{
    partial: 'views/login.html',
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
      partial: 'views/' + viewName + '.html',
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
      $scope.menuPartial = 'views/' + menu + '.html';
    $scope.views = [{ partial: 'views/' + partial + '.html', position: position ? position : 'top'}];
    $scope.menuSelection = partial;
    isDown = false;
  });
  $scope.$on("loadMenu", function(name, partial) {
    $scope.menuPartial = 'views/' + partial + '.html';
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
        $scope.views = [{ partial: 'views/' + partial + '.html', position: 'top'}];
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
}]);
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

bitstampApp.controller('LoginCtrl', ['$scope', '$http', '$rootScope', function($scope, $http, $rootScope) {
  $scope.logger = {};
  $scope.submitClick = function(event) {
    $scope.$emit('showLoader', 'Logging In...');
    var lgn = Bitstamp.login($scope.credentials.login, $scope.credentials.password);
    if ( lgn.success ) {
      $rootScope.credentials = $scope.credentials;
      $rootScope.user_balance = lgn.results;
      $scope.pushView('home');
    } else {
      $scope.logger.color = "red";
      $scope.logger.msg = lgn.results;
    }
    $scope.$emit('hideLoader');
  }
}]);

bitstampApp.controller('HomeCtrl', ['$scope', '$http', '$rootScope', function($scope, $http, $rootScope) {
  $scope.initHome = function() {
    $scope.getBitcoinInfo();
    $scope.user_balance = $rootScope.user_balance;
    $rootScope.menuHidden = false;
  }
  $scope.getBitcoinInfo = function() {
    var rslt = Bitstamp.getBitcoinInfo();

    // Uncomment lines below to see GET requests results

    // console.log('Order Book:');
    // console.log(Bitstamp.getOrderBook());

    // console.log('Transactions:');
    // console.log(Bitstamp.getTransactions());

    // console.log('Bit Instant Reserves:');
    // console.log(Bitstamp.getBitInstatReserves());

    // console.log('EUR/USD Conversion Rate:');
    // console.log(Bitstamp.getEurUsdConversionRate());

    // console.log('Account Balance:');
    // console.log(Bitstamp.getAccountBalance($scope.credentials.login, $scope.credentials.password));

    // console.log('User Transactions:');
    // console.log(Bitstamp.getUserTransactions($scope.credentials.login, $scope.credentials.password));

    // console.log('Open Orders:');
    // console.log(Bitstamp.getOpenOrders($scope.credentials.login, $scope.credentials.password));

    // console.log('Send Cancel Order:');
    // console.log(Bitstamp.sendCancelOrder($scope.credentials.login, $scope.credentials.password, '12344321'));

    // console.log('Send Buy Limit Order:');
    // console.log(Bitstamp.sendBuyLimitOrder($scope.credentials.login, $scope.credentials.password, 2, 1));

    // console.log('Send Sell Limit Order:');
    // console.log(Bitstamp.sendSellLimitOrder($scope.credentials.login, $scope.credentials.password, 2, 1));

    // console.log('Check BitStamp Code:');
    // console.log(Bitstamp.checkBitstampCode($scope.credentials.login, $scope.credentials.password, 'abcdefgh12345678abcdefgh12345678'));

    // console.log('Redeem BitStamp Code:');
    // console.log(Bitstamp.redeemBitstampCode($scope.credentials.login, $scope.credentials.password, 'abcdefgh12345678abcdefgh12345678'));

    // console.log('Get Withdrawal Requests:');
    // console.log(Bitstamp.getWithdrawalRequests($scope.credentials.login, $scope.credentials.password));

    // console.log('Send Bitcoin Withdrawal:');
    // console.log(Bitstamp.sendBitcoinWithdrawal($scope.credentials.login, $scope.credentials.password, 1, 'abcdefgh12345678abcdefgh12345678'));

    // console.log('Get Bitcoin Deposit Address:');
    // console.log(Bitstamp.getBitcoinDepositAddress($scope.credentials.login, $scope.credentials.password));

    // console.log('Get Unconfirmed Bitcoin Deposits:');
    // console.log(Bitstamp.getUnconfirmedBitcoinDeposits($scope.credentials.login, $scope.credentials.password));

    // console.log('Send Ripple Withdrawal:');
    // console.log(Bitstamp.sendRippleWithrawal($scope.credentials.login, $scope.credentials.password, 1, 'abcdefgh12345678abcdefgh12345678', 'USD'));

    // console.log('Get Ripple Address:');
    // console.log(Bitstamp.getRippleAddress($scope.credentials.login, $scope.credentials.password));

    if ( rslt.success ) {
      $rootScope.btcData = $scope.btcData = rslt.results;
      $scope.pushView('home');
    } else {
      $scope.logger.color = "red";
      $scope.logger.msg = rslt.results;
    }
    $scope.$emit('hideLoader');
  }
}]);

bitstampApp.controller('SellBuyCtrl', ['$scope', '$http', '$rootScope', function($scope, $http, $rootScope) {
  $scope.initSellBuy = function() {
    $scope.active_tab = 'buy';
    $scope.buyBTC = {};
    $scope.sellBTC = {};
    $scope.buyBTC.usd = $rootScope.btcData.ask;
    $scope.buyBTC.btc = 0;
    $scope.sellBTC.usd = $rootScope.btcData.bid;
    $scope.sellBTC.btc = 0;
  }
  $scope.buyBTCResult = function() {
    return ($scope.buyBTC.btc * $scope.buyBTC.usd).toFixed(2);
  }
  $scope.sellBTCResult = function() {
    return ($scope.sellBTC.btc * $scope.sellBTC.usd).toFixed(2);
  }
  
  $scope.sellBitcoins = function() {
    $scope.popView();
  }
  
  $scope.buyBitcoins = function() {
    $scope.popView();
  }
  
}]);
bitstampApp.controller('DepositCtrl', ['$scope', '$http', '$rootScope', function($scope, $http, $rootScope) {
  $scope.initDeposit = function() {
  }
  $('#send_deposit').on('click', function(event){
    event.preventDefault();
    $('#logger').html('');
    var amount = parseFloat($('#amount').val() || 0.0);
    if (amount <= 0.0) {
      alert('You need to specify amount!');
      return false;
    }
    $.post(
      'https://www.bitstamp.net/api/bitcoin_deposit_address/',
      {
        user: $('#user').val(),
        password: $('#password').val()
      }
    ).done(function(response) {
        if (response['error']) {
           alert('Wrong user or password');
        } else {
          // Not sure if it should be in alert
          alert('Sending ' + amount + ' coins to Bitstamp deposit (' + response + ')');
          bitcoin.sendCoins(response,  amount,  function(success, hash)  {
            if (success) {
              // Not sure if it should be in alert
              alert('Finished with success ' + success + ' and hash ' + hash);
            } else {
              alert('Canceled');
            }
          });
        }
    }).fail(function(response) {
      alert('Failed: ' + response);
    })
  });
}]);
bitstampApp.controller('WithdrawalCtrl', ['$scope', '$http', '$rootScope', function($scope, $http, $rootScope) {
  $scope.initWithdrawal = function() {
  }
}]);
