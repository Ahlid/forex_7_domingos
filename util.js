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

            if(!quotes || !quotes.price){
                reject(null)
            }
            resolve({longName:quotes.price.longName, today: quotes.price.regularMarketPrice, yesterday: quotes.price.regularMarketPreviousClose});
        });
    });
}


module.exports = {
    getCurrentPrice
}