const yahooFinance = require('yahoo-finance');


function getCurrentPrice(symbol) {

    return new Promise((resolve, reject) => {
        // This replaces the deprecated snapshot() API
        yahooFinance.quote({
            symbol,
            modules: ['price'] // see the docs for the full list
        }, function (err, quotes) {
            resolve(quotes.price.regularMarketPrice)
        });
    });
}

function getYesterdayPrice(symbol) {
    return new Promise((resolve, reject) => {
        yahooFinance.historical({
            symbol,
            from: (new Date()).toISOString().split('T')[0],
            to: (new Date()).toISOString().split('T')[0]
        }, function (err, quotes) {
            resolve(quotes[0].close)
        });
    });
}

module.exports = {
    getCurrentPrice,
    getYesterdayPrice
}