class BitstampApi
  constructor: ->
    variables()
    bindings()

  login = (user, password) ->
    success = false
    results = ''

    $.ajax
      type: 'POST',
      async: false,
      url: loginPage,
      data: {user: (user || ''), password: (password || '')},
      success: (response) ->
        if (response['error'])
          results = 'wrong user or password'
        else
          success = true
          results = response
      fail: (response) ->
        results = response

    { success: success, results: results }

  getBitcoinInfo = () ->
    success = false
    results = ''

    $.ajax
      type: 'POST',
      async: false,
      url: getBitcionInfoPage,
      success: (response) ->
        if (response['error'])
          results = 'wrong user or password'
        else
          success = true
          results = response
      fail: (response) ->
        results = 'something went wrong'

    { success: success, results: results }

  bindings = ->
    console.log 'no bindings defined'

  variables = ->
    loginPage = 'https://www.bitstamp.net/api/balance/'
    getBitcionInfoPage = 'https://www.bitstamp.net/api/ticker/'

$ ->
  @bitstamp_api = new BitstampApi