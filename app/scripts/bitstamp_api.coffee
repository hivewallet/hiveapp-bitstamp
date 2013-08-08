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

this.Bitstamp = Bitstamp
