var bitstampLoginPage = 'https://www.bitstamp.net/api/balance/';
var bitstampGetBitcoinInfoPage = 'https://www.bitstamp.net/api/ticker/';

function bitstampLogin(user, password) {
  var success = false;
  var results = '';

  $.ajax({
    type: 'POST',
    async: false,
    url: bitstampLoginPage,
    data: {user: (user || ''), password: (password || '')}
  }).done(function(response) {
    if (response['error']) {
      results = 'wrong user or password';
    } else {
      success = true;
      results = response;
    }
  }).fail(function(response) {
    results = response;
  });

  return { success: success, results: results }
}

function bitstampGetBicoinInfo() {
  var success = false;
  var results = '';

  $.ajax({
    type: 'GET',
    async: false,
    url: bitstampGetBitcoinInfoPage
  }).done(function(response) {
    if (response['error']) {
      results = 'wrong user or password';
    } else {
      success = true;
      results = response;
    }
  }).fail(function(response) {
    results = 'something went wrong';
  });

  return { success: success, results: results }
}
