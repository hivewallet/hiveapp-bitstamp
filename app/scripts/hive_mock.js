var bitcoin = bitcoin || {
    BTC_IN_SATOSHI: 100000000,
    MBTC_IN_SATOSHI: 100000,
    UBTC_IN_SATOSHI: 100,

    TX_TYPE_INCOMING: "incoming",
    TX_TYPE_OUTGOING: "outgoing",


    sendMoney: function(hash, amount, callback){
        if (!hash){
            throw "hash argument is undefined";
        }
        if (callback){
            callback(true, 'FAKE_HASH');
        }
    },

    getTransaction: function(id, callback){
        if (!id || !callback){
            throw "id and callback are required";
        }
        callback({
            id: 123,
            amount: 10,
            type: TX_TYPE.TX_TYPE__INCOMING,
            timestamp: (new Date()).toString(),
            inputAddresses: ['HASH1'],
            outputAddresses: ['HASH2']
        });
    },

    getSystemInfo: function(callback){
        if (!callback){
            throw "callback is undefined";
        }
        callback({ decimalSeparator: "," });
    },

    getUserInfo: function(callback){
        if (!callback){
            throw "callback is required";
        }
        callback({
            firstName: 'Homer',
            lastName:  'Simpson',
            email:     'homer@fake.com',
            address:   'poqjer23rfc234laq'
        });
    }
};

var btc_string_to_satoshi = function(amount, separator){
    if (typeof(amount)=='string'){
        var tab = [];
        if (amount.indexOf(separator) > 0 ){
            tab = amount.split(separator);
        }else{
            tab = [amount,'0'];
        }
        var count = tab[1].length;
        tab = [parseInt(tab[0]), parseInt(tab[1])];
        return tab[0]*bitcoin.BTC_IN_SATOSHI + tab[1]*(bitcoin.BTC_IN_SATOSHI/(Math.pow(10,count)));
    }else{
        return Math.round(amount*bitcoin.BTC_IN_SATOSHI);
    }
};

