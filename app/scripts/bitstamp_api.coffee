class Bitstamp
 
  apiUrl = 
    loginPage: "https://www.bitstamp.net/api/balance/"
    getBitcoinInfoPage: "https://www.bitstamp.net/api/ticker/"

  @bittstampLogin = (user, password) ->
    success = false
    results = ""
    $.ajax(
      type: "POST"
      async: false
      url: apiUrl.loginPage
      data:
        user: (user or "")
        password: (password or "")
    ).done((response) ->
      if response["error"]
        results = "wrong user or password"
      else
        success = true
        results = response
    ).fail (response) ->
      results = response

    success: success
    results: results

  @bitstampGetBicoinInfo = ->
    success = false
    results = ""
    $.ajax(
      type: "GET"
      async: false
      url: apiUrl.getBitcoinInfoPage
    ).done((response) ->
      if response["error"]
        results = "wrong user or password"
      else
        success = true
        results = response
    ).fail (response) ->
      results = "something went wrong"

    success: success
    results: results
