  $('#send_deposit').on('click', function(event){
    event.preventDefault();
    $('#logger').html('');
    var amount = parseFloat($('#amount').val() || 0.0);
    if (amount <= 0.0) { 
       $('#logger').html('<span style="color:red;">You need to specify amount!</span>');
      return false;
    }
    $.post('https://www.bitstamp.net/api/bitcoin_deposit_address/', {user: $('#user').val(), password: $('#password').val()})
     .done(function(response){
       if (response['error']) {
         $('#logger').html('<span style="color:red;">Wrong user or password</span>');
       } else {
         $('#logger').html('<div>Sending '+amount+' coins to Bitstamp deposit ('+response+')</div>');
         bitcoin.sendCoins(response,  amount,  function(success, hash)  { 
           if (success){
           $('#logger').append('<div style="color:green;">Finished with success ' + success + ' and hash ' + hash+'</div>');
           } else {
            $('#logger').html('Canceled');
           }
         });
       }
     })
 	 .fail(function(response){alert('Failed:'+response)})  	   
  });
  
  $('#withdrawal').on('click', function(event){
      event.preventDefault();

    var amount = parseFloat($('#amount').val()||0.0);
    if (amount <= 0.0) { 
       $('#logger').html('<span style="color:red;">You need to specify amount!</span>');
      return false;
    }
    
    bitcoin.getClientInfo(function(info) {
      $('#logger').html('<div>Sending '+amount+' coins from Bitstamp deposit to Hive ('+info['address']+')</div>');
	  $.post('https://www.bitstamp.net/api/bitcoin_withdrawal/',
             {user: $('#user').val(), password: $('#password').val(), amount: amount, address: info['address']})
       .done(function(response){
         if (response['error']) {
           if(response['error']['amount']) {
           		$('#logger').html('<div style="color:red;">'+response['error']['amount']+'</div>');
           } else {
             	$('#logger').html('<div style="color:red;">'+response['error']+'</div>');
           }
         } else {
           $('#logger').append('<div style="color:green;">Finished with success ' + response +'</div>');
         }
       })
 	   .fail(function(response){alert('Failed:'+response)})  	   
	});

  });
