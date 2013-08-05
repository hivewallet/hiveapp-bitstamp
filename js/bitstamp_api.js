var bitstampLoginPage = 'https://www.bitstamp.net/api/bitcoin_deposit_address/';

function bitstampLogin(user, password) {
  var postData = {user: (user || ''), password: (password || '')};

  $.post(bitstampLoginPage, postData)
    .done(function(response) {
      if (response['error']) {
        return [false, 'wrong user or password'];
      } else {
        return [true, user + ' logged in'];
      }
    })
    .fail(function(response) {
      return [false, 'something went wrong'];
    });
}