var bitstampApp = angular.module('hive-bitstamp', ['bitstamp']);
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



bitstampApp.controller('MainCtrl', ['$scope', '$http', '$rootScope','bitstampApi', function($scope, $http, $rootScope, bitstampApi) {
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

bitstampApp.controller('LoginCtrl', ['$scope', '$http', '$rootScope', 'bitstampApi', function($scope, $http, $rootScope, bitstampApi) {
  $scope.logger = {};
  $scope.logger.type = '';
  $scope.submitClick = function(event) {
    $scope.$emit('showLoader', 'Logging In...');
    var lgn = bitstampApi.login($scope.credentials.login, $scope.credentials.password);
    if ( lgn.success ) {
      $rootScope.credentials = $scope.credentials;
      $rootScope.user_balance = lgn.results;
      $scope.pushView('home');
    } else {
      $scope.logger.type = "wrong";
      $scope.logger.msg = lgn.results;
      $('.screen').animate({scrollTop : 0},500);
    }
    $scope.$emit('hideLoader');
  }
  $scope.logMeIn = function() {
    console.log('logging');
    $scope.credentials.login = '13222';
    $scope.credentials.password = 'Waliays4';
    $scope.submitClick();
  }
}]);

bitstampApp.controller('HomeCtrl', ['$scope', '$http', '$rootScope', 'bitstampApi', function($scope, $http, $rootScope, bitstampApi) {
  $scope.initHome = function() {
    $scope.getBitcoinInfo();
    $scope.user_balance = $rootScope.user_balance;
    $rootScope.menuHidden = false;
  }
  $scope.updateWallet = function(event) {
    $scope.$emit('showLoader');
    var lgn = bitstampApi.login($scope.credentials.login, $scope.credentials.password);
    if ( lgn.success ) {
      $rootScope.user_balance = $scope.user_balance = lgn.results;
      console.log($scope.user_balance);
    } else {
      $scope.logger.type = "wrong";
      $scope.logger.msg = lgn.results;
      $('.screen').animate({scrollTop : 0},500);
    }
    $scope.$emit('hideLoader');
  }
  $rootScope.$on("reloadWallet", function() {
    $scope.updateWallet();
  });
  $scope.getBitcoinInfo = function() {
    var rslt = bitstampApi.getBitcoinInfo();
    // Uncomment lines below to see GET requests results

    // console.log('Order Book:');
    // console.log(bitstampApi.getOrderBook());

    // console.log('Transactions:');
    // console.log(bitstampApi.getTransactions());

    // console.log('Bit Instant Reserves:');
    // console.log(bitstampApi.getBitInstatReserves());

    // console.log('EUR/USD Conversion Rate:');
    // console.log(bitstampApi.getEurUsdConversionRate());

    // console.log('Account Balance:');
    // console.log(bitstampApi.getAccountBalance($scope.credentials.login, $scope.credentials.password));

    // console.log('User Transactions:');
    // console.log(bitstampApi.getUserTransactions($scope.credentials.login, $scope.credentials.password));

    // console.log('Open Orders:');
    // console.log(bitstampApi.getOpenOrders($scope.credentials.login, $scope.credentials.password));

    // console.log('Send Cancel Order:');
    // console.log(bitstampApi.sendCancelOrder($scope.credentials.login, $scope.credentials.password, '12344321'));

    // console.log('Send Buy Limit Order:');
    // console.log(bitstampApi.sendBuyLimitOrder($scope.credentials.login, $scope.credentials.password, 2, 1));

    // console.log('Send Sell Limit Order:');
    // console.log(bitstampApi.sendSellLimitOrder($scope.credentials.login, $scope.credentials.password, 2, 1));

    // console.log('Check BitStamp Code:');
    // console.log(bitstampApi.checkBitstampCode($scope.credentials.login, $scope.credentials.password, 'abcdefgh12345678abcdefgh12345678'));

    // console.log('Redeem BitStamp Code:');
    // console.log(bitstampApi.redeemBitstampCode($scope.credentials.login, $scope.credentials.password, 'abcdefgh12345678abcdefgh12345678'));

    // console.log('Get Withdrawal Requests:');
    // console.log(bitstampApi.getWithdrawalRequests($scope.credentials.login, $scope.credentials.password));

    // console.log('Send Bitcoin Withdrawal:');
    // console.log(bitstampApi.sendBitcoinWithdrawal($scope.credentials.login, $scope.credentials.password, 1, 'abcdefgh12345678abcdefgh12345678'));

    // console.log('Get Bitcoin Deposit Address:');
    // console.log(bitstampApi.getBitcoinDepositAddress($scope.credentials.login, $scope.credentials.password));

    // console.log('Get Unconfirmed Bitcoin Deposits:');
    // console.log(bitstampApi.getUnconfirmedBitcoinDeposits($scope.credentials.login, $scope.credentials.password));

    // console.log('Send Ripple Withdrawal:');
    // console.log(bitstampApi.sendRippleWithrawal($scope.credentials.login, $scope.credentials.password, 1, 'abcdefgh12345678abcdefgh12345678', 'USD'));

    // console.log('Get Ripple Address:');
    // console.log(bitstampApi.getRippleAddress($scope.credentials.login, $scope.credentials.password));

    if ( rslt.success ) {
      $rootScope.btcData = $scope.btcData = rslt.results;
      $scope.pushView('home');
    } else {
      $scope.logger.type = "wrong";
      $scope.logger.msg = rslt.results;
      $('.screen').animate({scrollTop : 0},500);
    }
    $scope.$emit('hideLoader');
  }
}]);

bitstampApp.controller('SellBuyCtrl', ['$scope', '$http', '$rootScope', 'bitstampApi', function($scope, $http, $rootScope, bitstampApi) {
  $scope.initSellBuy = function() {
    $scope.logger = {};
    $scope.logger.type = '';
    $scope.active_tab = 'buy';
    $scope.buyBTC = {};
    $scope.sellBTC = {};
    $scope.buyBTC.usd = $rootScope.btcData.ask;
    $scope.buyBTC.btc = 0;
    $scope.sellBTC.usd = $rootScope.btcData.bid;
    $scope.sellBTC.btc = 0;
    $rootScope.$emit('reloadWallet');
    $scope.balance = $rootScope.user_balance;
    $scope.balance = $rootScope.user_balance;
  }
  $scope.buyBTCResult = function() {
    return ($scope.buyBTC.btc * $scope.buyBTC.usd).toFixed(2);
  }
  $scope.sellBTCResult = function() {
    return ($scope.sellBTC.btc * $scope.sellBTC.usd).toFixed(2);
  }
  
  $scope.sellBitcoins = function() {
    $scope.hasErrors = false;
    $scope.errors = {};
    if ( !$scope.sellBTC.btc ) {
      $scope.errors.sellBTC_btc = ['Can\'t be blank.'];
    } else {
      if ( $scope.sellBTC.btc < 0.00000001 || $scope.sellBTC.btc >= 99999999)
        $scope.errors.sellBTC_btc = ['Ensure this value is greater than or equal to 1E-8.'];
      if ( !jQuery.isNumeric($scope.sellBTC.btc) )
        $scope.errors.sellBTC_btc = ['Enter a number.'];
    }
    $scope.hasErrors = !_.isEmpty($scope.errors);
    if ( $scope.hasErrors ) {
      $('.screen').animate({scrollTop : 0},500);
      return;
    }
    
    $scope.$emit('showLoader');
    var currentBitcoinData = bitstampApi.getBitcoinInfo();
    if ( currentBitcoinData.success ) {
      $rootScope.btcData = $scope.btcData = currentBitcoinData.results;
      console.log('I want to sell ' + $scope.buyBTC.btc + ' btc for marketprice ' + $rootScope.btcData.bid + ' usd');
      // I know the highest buy price now, lets send the request:
      var sellLimitOrder = bitstampApi.sendSellLimitOrder($scope.credentials.login, $scope.credentials.password, $scope.sellBTC.btc, $rootScope.btcData.bid)
      if ( sellLimitOrder.success ) {
        console.log('There you go! I accept your offer.');
        $rootScope.$emit('reloadWallet');
        $scope.popView();
      } else {
        console.log(sellLimitOrder.results)
        $scope.logger.type = "wrong";
        $scope.logger.msg = sellLimitOrder.results;
        $('.screen').animate({scrollTop : 0},500);
      }
    } else {
      console.log(currentBitcoinData.results)
      $scope.logger.type = "wrong";
      $scope.logger.msg = currentBitcoinData.results;
      $('.screen').animate({scrollTop : 0},500);
    }
    $scope.$emit('hideLoader');
  }
  
  $scope.buyBitcoins = function() {
    $scope.hasErrors = false;
    $scope.errors = {};
    if ( !$scope.buyBTC.btc ) {
      $scope.errors.buyBTC_btc = ['Can\'t be blank.'];
    } else {
      if ( $scope.buyBTC.btc < 0.00000001 || $scope.buyBTC.btc >= 99999999)
        $scope.errors.buyBTC_btc = ['Ensure this value is greater than or equal to 1E-8.'];
      if ( !jQuery.isNumeric($scope.buyBTC.btc) )
        $scope.errors.buyBTC_btc = ['Enter a number.'];
    }
    $scope.hasErrors = !_.isEmpty($scope.errors);
    if ( $scope.hasErrors ) {
      $('.screen').animate({scrollTop : 0},500);
      return;
    }
    
    $scope.$emit('showLoader');
    var currentBitcoinData = bitstampApi.getBitcoinInfo();
    if ( currentBitcoinData.success ) {
      $rootScope.btcData = $scope.btcData = currentBitcoinData.results;
      console.log('I want to buy ' + $scope.buyBTC.btc + ' btc for marketprice ' + $rootScope.btcData.ask + ' usd');
      // I know the lowest sell price now, lets send the request:
      var buyLimitOrder = bitstampApi.sendBuyLimitOrder($scope.credentials.login, $scope.credentials.password, $scope.buyBTC.btc, $rootScope.btcData.ask)
      if ( buyLimitOrder.success ) {
        console.log('There you go! I accept your offer.');
        $rootScope.$emit('reloadWallet');
        $scope.popView();
      } else {
        console.log(buyLimitOrder.results)
        $scope.logger.type = "wrong";
        $scope.logger.msg = buyLimitOrder.results;
        $('.screen').animate({scrollTop : 0},500);
      }
    } else {
      console.log(currentBitcoinData.results)
      $scope.logger.type = "wrong";
      $scope.logger.msg = currentBitcoinData.results;
      $('.screen').animate({scrollTop : 0},500);
    }
    $scope.$emit('hideLoader');
  }
  
}]);

bitstampApp.controller('OrdersCtrl', ['$scope', '$http', '$rootScope', 'bitstampApi', function($scope, $http, $rootScope, bitstampApi) {
  $scope.initOrders = function() {
    $scope.list = 'asks';
  } 
}]);

bitstampApp.controller('DepositCtrl', ['$scope', '$http', '$rootScope', 'bitstampApi', function($scope, $http, $rootScope, bitstampApi) {
  $scope.logger = {};
  $scope.logger.type = '';
  $scope.initDeposit = function() {
    $scope.user_balance = $rootScope.user_balance;
  }
  $scope.sendDeposit = function(){
    var amount = parseFloat($scope.amount || 0.0)
    if( amount <= 0.0) {
      $scope.logger.type = "wrong";
      $scope.logger.msg = "Amount should be greather than 0.0";
      $('.screen').animate({scrollTop : 0},500);
    } else {
      $scope.$emit('showLoader');
      bitcoin.getUserInfo(function(info) {
        result = bitstampApi.sendBitcoinWithdrawal($scope.credentials.login, $scope.credentials.password, amount, info['address'])
        if (result.success) {
          $scope.popView();
        } else {
          console.log(result.results);
          $scope.logger.type = "wrong";
          $scope.logger.msg = result.results.amount[0];
          $('.screen').animate({scrollTop : 0},500);
        }
      });
      $scope.$emit('hideLoader');
    }
  }

}]);

bitstampApp.controller('WithdrawalCtrl', ['$scope', '$http', '$rootScope', 'bitstampApi', function($scope, $http, $rootScope, bitstampApi) {
  $scope.logger = {};
  $scope.logger.type = '';
  $scope.initWithdrawal = function() {
    bitcoin.getUserInfo(function(response){
    })
  }

  $scope.sendWithdrawal = function() {

    var amount = parseFloat($scope.amount || 0.0);
    if (amount <= 0.0) {
      $scope.logger.type = "wrong";
      $scope.logger.msg = "Amount should be greather than 0.0";
      $('.screen').animate({scrollTop : 0},500);
      return false;
    }
    $scope.$emit('showLoader');
    $.post(
      'https://www.bitstamp.net/api/bitcoin_deposit_address/',
      {
        user: $scope.credentials.login,
        password: $scope.credentials.password
      }
    ).done(function(response) {
        if (response['error']) {
          console.log(result.results);
          $scope.logger.type = "wrong";
          $scope.logger.msg = "Wrong Bitstamp credentials"
          $('.screen').animate({scrollTop : 0},500);
        } else {
          var temp_amount = bitcoin.btc_string_to_satoshi(amount);
          bitcoin.sendMoney(response,  temp_amount,  function(success, hash)  {
            if (success) {
              $scope.popView();
              $scope.$apply();
            }
          });
        }
      $scope.$emit('hideLoader');
    }).fail(function(response) {
      console.log(response);
      $scope.logger.type = "wrong";
      $scope.logger.msg = response;
      $('.screen').animate({scrollTop : 0},500);
      $scope.$emit('hideLoader');
    })
  }
}]);
