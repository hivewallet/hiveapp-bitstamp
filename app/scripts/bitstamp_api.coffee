class Bitstamp

  apiUrl =
    getBalance:                     "https://www.bitstamp.net/api/balance/"
    getTicker:                      "https://www.bitstamp.net/api/ticker/"
    getOrderBook:                   "https://www.bitstamp.net/api/order_book/"
    getTransactions:                "https://www.bitstamp.net/api/transactions/"
    getBitInstatReserves:           "https://www.bitstamp.net/api/bitinstant/"
    getEurUsdConversionRate:        "https://www.bitstamp.net/api/eur_usd/"
    postAccountBalance:             "https://www.bitstamp.net/api/balance/"
    postUserTransactions:           "https://www.bitstamp.net/api/user_transactions/"
    postOpenOrders:                 "https://www.bitstamp.net/api/open_orders/"
    postCancelOrder:                "https://www.bitstamp.net/api/cancel_order/"
    postBuyLimitOrder:              "https://www.bitstamp.net/api/buy/"
    postSellLimitOrder:             "https://www.bitstamp.net/api/sell/"
    postCheckBitstampCode:          "https://www.bitstamp.net/api/check_code/"
    postRedeemBitstampCode:         "https://www.bitstamp.net/api/redeem_code/"
    postWithdrawalRequests:         "https://www.bitstamp.net/api/withdrawal_requests/"
    postBitcoinWithdrawal:          "https://www.bitstamp.net/api/bitcoin_withdrawal/"
    postBitcoinDepositAddress:      "https://www.bitstamp.net/api/bitcoin_deposit_address/"
    postUnconfirmedBitcoinDeposits: "https://www.bitstamp.net/api/unconfirmed_btc/"
    postRippleWithrawal:            "https://www.bitstamp.net/api/ripple_withdrawal/"
    postRippleAddress:              "https://www.bitstamp.net/api/ripple_address/"

  @login = (user, password) ->
    success = false
    results = ""
    console.log('OGIEN', apiUrl.getBalance, user, password)
    $.ajax(
      type: "POST"
      async: false
      url: apiUrl.getBalance
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
      console.log(response)
      results = response

    success: success
    results: results

  @getAccountBalance = (user, password) ->
    success = false
    results = ""
    $.ajax(
      type: "POST"
      async: false
      url: apiUrl.postAccountBalance
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

  @getUserTransactions = (user, password) ->
    success = false
    results = ""
    $.ajax(
      type: "POST"
      async: false
      url: apiUrl.postUserTransactions
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

  @getOpenOrders = (user, password) ->
    success = false
    results = ""
    $.ajax(
      type: "POST"
      async: false
      url: apiUrl.postOpenOrders
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

  @sendCancelOrder = (user, password, order_id) ->
    success = false
    results = ""
    $.ajax(
      type: "POST"
      async: false
      url: apiUrl.postCancelOrder
      data:
        user: (user or "")
        password: (password or "")
        id: (order_id or "0")
    ).done((response) ->
      if response["error"]
        results = response["error"]
      else
        success = true
        results = response
    ).fail (response) ->
      results = response

    success: success
    results: results

  @sendBuyLimitOrder = (user, password, amount, price) ->
    success = false
    results = ""
    $.ajax(
      type: "POST"
      async: false
      url: apiUrl.postBuyLimitOrder
      data:
        user: (user or "")
        password: (password or "")
        amount: (amount or 0)
        price: (price or 0)
    ).done((response) ->
      if response["error"]
        results = response["error"]["__all__"][0]
      else
        success = true
        results = response
    ).fail (response) ->
      results = response

    success: success
    results: results

  @sendSellLimitOrder = (user, password, amount, price) ->
    success = false
    results = ""
    $.ajax(
      type: "POST"
      async: false
      url: apiUrl.postSellLimitOrder
      data:
        user: (user or "")
        password: (password or "")
        amount: (amount or 0)
        price: (price or 0)
    ).done((response) ->
      if response["error"]
        results = response["error"]["__all__"][0]
      else
        success = true
        results = response
    ).fail (response) ->
      results = response

    success: success
    results: results

  @checkBitstampCode = (user, password, code) ->
    success = false
    results = ""
    $.ajax(
      type: "POST"
      async: false
      url: apiUrl.postCheckBitstampCode
      data:
        user: (user or "")
        password: (password or "")
        code: (code or "")
    ).done((response) ->
      if response["error"]
        results = response["error"]["code"][0]
      else
        success = true
        results = response
    ).fail (response) ->
      results = response

  @redeemBitstampCode = (user, password, code) ->
    success = false
    results = ""
    $.ajax(
      type: "POST"
      async: false
      url: apiUrl.postRedeemBitstampCode
      data:
        user: (user or "")
        password: (password or "")
        code: (code or "")
    ).done((response) ->
      if response["error"]
        results = response["error"]["code"][0]
      else
        success = true
        results = response
    ).fail (response) ->
      results = response

    success: success
    results: results

  @getWithdrawalRequests = (user, password) ->
    success = false
    results = ""
    $.ajax(
      type: "POST"
      async: false
      url: apiUrl.postWithdrawalRequests
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

  @sendBitcoinWithdrawal = (user, password, amount, address) ->
    success = false
    results = ""
    $.ajax(
      type: "POST"
      async: false
      url: apiUrl.postBitcoinWithdrawal
      data:
        user: (user or "")
        password: (password or "")
        amount: (amount or 0)
        address: (address or "")
    ).done((response) ->
      if response["error"]
        results = response["error"]
      else
        success = true
        results = response
    ).fail (response) ->
      results = response

    success: success
    results: results

  @getBitcoinDepositAddress = (user, password) ->
    success = false
    results = ""
    $.ajax(
      type: "POST"
      async: false
      url: apiUrl.postBitcoinDepositAddress
      data:
        user: (user or "")
        password: (password or "")
    ).done((response) ->
      if response["error"]
        results = response["error"]
      else
        success = true
        results = response
    ).fail (response) ->
      results = response

    success: success
    results: results

  @getUnconfirmedBitcoinDeposits = (user, password) ->
    success = false
    results = ""
    $.ajax(
      type: "POST"
      async: false
      url: apiUrl.postUnconfirmedBitcoinDeposits
      data:
        user: (user or "")
        password: (password or "")
    ).done((response) ->
      if response["error"]
        results = response["error"]
      else
        success = true
        results = response
    ).fail (response) ->
      results = response

    success: success
    results: results

  @sendRippleWithrawal = (user, password, amount, address, currency) ->
    success = false
    results = ""
    $.ajax(
      type: "POST"
      async: false
      url: apiUrl.postRippleWithrawal
      data:
        user: (user or "")
        password: (password or "")
        amount: (amount or 0)
        address: (address or "")
        currency: (currency or "USD")
    ).done((response) ->
      if response["error"]
        results = response["error"]
      else
        success = true
        results = response["address"]
    ).fail (response) ->
      results = response

    success: success
    results: results

  @getRippleAddress = (user, password) ->
    success = false
    results = ""
    $.ajax(
      type: "POST"
      async: false
      url: apiUrl.postRippleAddress
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

  @getBitcoinInfo = ->
    success = false
    results = ""
    $.ajax(
      type: "GET"
      async: false
      url: apiUrl.getTicker
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

  @getOrderBook = ->
    success = false
    results = ""
    $.ajax(
      type: "GET"
      async: false
      url: apiUrl.getOrderBook
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

  @getTransactions = ->
    success = false
    results = ""
    $.ajax(
      type: "GET"
      async: false
      url: apiUrl.getTransactions
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

  @getBitInstatReserves = ->
    success = false
    results = ""
    $.ajax(
      type: "GET"
      async: false
      url: apiUrl.getBitInstatReserves
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

  @getEurUsdConversionRate = ->
    success = false
    results = ""
    $.ajax(
      type: "GET"
      async: false
      url: apiUrl.getEurUsdConversionRate
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

this.angular.module('bitstamp', [])
this.angular.module('bitstamp').factory 'bitstampApi', -> Bitstamp


