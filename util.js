const yahooFinance = require('yahoo-finance');


function getCurrentPrice(symbol) {

    return new Promise((resolve, reject) => {
        // This replaces the deprecated snapshot() API
        yahooFinance.quote({
            symbol,
            modules: ['price'] // see the docs for the full list
        }, function (err, quotes) {
            if (err) {
                reject(err)
            }

            console.log(quotes.price)
            resolve({today: quotes.price.regularMarketPrice, yesterday: quotes.price.regularMarketPreviousClose});
        });
    });
}


module.exports = {
    getCurrentPrice
}