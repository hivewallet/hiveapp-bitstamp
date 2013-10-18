/**
 * Created by marcinra on 10/18/13.
 */

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
            address:   'poqjer23rfc234laq',
        });
    }
};

bitcoin['btc_string_to_satoshi'] = function(x){
    if( typeof x === 'string'){
        var tab = [];
        if (x.indexOf('.') > 0 ){
            tab = x.split('.');
        }else if (x.indexOf(',') > 0){
            tab = x.split(',');
        }else{
            tab = [x,'0'];
        }
        var count = tab[1].length;
        tab = [parseInt(tab[0]), parseInt(tab[1])];
        var amount = tab[0]*bitcoin.BTC_IN_SATOSHI + tab[1]*(bitcoin.BTC_IN_SATOSHI/(Math.pow(10,count)));
        return amount;
    } else {
        return x*bitcoin.BTC_IN_SATOSHI;
    }
}