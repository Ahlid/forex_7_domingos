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

            if (!quotes || !quotes.price) {
                reject(null)
            }

            try {
                resolve({
                    ...quotes.price,
                    longName: quotes.price.longName,
                    today: quotes.price.regularMarketPrice,
                    yesterday: quotes.price.regularMarketPreviousClose,
                    percentage: ((quotes.price.regularMarketPrice - quotes.price.regularMarketPreviousClose) * 100 / quotes.price.regularMarketPreviousClose).toFixed(2)
                });
            } catch (e) {
                console.log(e);
            }
        });
    });
}


module.exports = {
    getCurrentPrice
}