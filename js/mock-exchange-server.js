// Mock stock exhange server

const express = require("express");
const mockExchangeDBJson = require("./mock-exchange-db.json");

var app = express();

// allows cross origin access
app.use((request, response, next) => {
    response.header("Access-Control-Allow-Origin", "*");
    next();
});

// stock listing access path

app.get("/listing",

    (request, response) => {

        // console.log("GET: /listing match=" + request.query.match);

        // must have a match string passed in the URL
        if (request.query.match == undefined ||
            request.query.match.length == 0) {
            response.send(JSON.parse('[]'));
            return;
        }

        // convert the search string to lowercase
        let matchString = request.query.match.toLowerCase();

        let matches = mockExchangeDBJson.filter((stock) => {

            // convert the symbol and full name to lowercase
            let lowercaseSymbol = stock.symbol.toLowerCase();
            let lowercaseFullName = stock.fullName.toLowerCase();

            return lowercaseSymbol.indexOf(matchString) > -1 ||
                lowercaseFullName.indexOf(matchString) > -1;
        });

        let results = matches.map(stock => {
            return { "symbol" : stock.symbol, "fullName" : stock.fullName };
        });

        // console.log(results);
        response.send(results);
    }
)

// stock quote access path

app.get("/quote",

    (request, response) => {

        // console.log("GET: /quote symbol=" + request.query.symbol);

        // must have a valid symbol passed in the URL
        if (request.query.symbol == undefined ||
            request.query.symbol.length == 0) {
            response.send(JSON.parse('[]'));
            return;
        }

        // convert the symbol to uppercase
        let searchSymbol = request.query.symbol.toUpperCase();

        let matches = mockExchangeDBJson.filter((stock) => {
            return stock.symbol == searchSymbol;
        });

        let results = JSON.parse('[]');

        if (matches.length >= 1) {
            results.push({ "symbol" : matches[0].symbol,
                           "fullName" : matches[0].fullName,
                           "price" : matches[0].price });
        }

        // console.log(results);
        response.send(results);

    }
    
)

app.listen(3000,
    () => {
        setInterval(updatePrices, 5000);
        console.log("Mock Exchange Server started and listening to port 3000...");
    }
);

// utility function

function updatePrices() {

    mockExchangeDBJson.forEach(stock => {

        // generate a random number from 0 to +2.99999 (this is the % of fluctuation)
        let fluctuation = Math.random();
        console.log(fluctuation + " (range should be 0.0 - 0.99999)");
        fluctuation = fluctuation * 3.0;
        console.log(" * 3.0 = " + fluctuation + " (range should be 0.0 - 2.99999)")

        // fluctuation = fluctuation - 2.5;
        // console.log(" - 2.5 = " + fluctuation + " (range should be -2.5 - +2.99999)");

        // // first time
        // if (stock.trend == undefined) {
        //     stock.trend = "+";
        // }

        if (stock.trend == undefined) {  // first time
            console.log("Randomizing trend...");

            // generate a random trend
            if (Math.random() <= 0.5) {
                console.log("fluctuation will be -");
                stock.trend = "-"
            } else {
                console.log("fluctuation will be +");
                stock.trend = "+"
            }
        }
        else {

            // 60% chance of following the last trend, 40% chance of going opposite direction
            let chanceOfTrend = Math.random();
            console.log("chanceOfTrend = " + chanceOfTrend + " (range should be 0.0 to 0.99999)");

            if (chanceOfTrend <= 0.6) {   // following trend

                console.log("Following trend of : " + stock.trend);

            }
            else {   // flip the trend

                stock.trend = stock.trend == "+" ? "-" : "+";
                console.log("Flipping the trend to : " + stock.trend);
            }
        }

        // now we can set the positive or negative of the fluctuation %
        if (stock.trend == "-") {
            fluctuation *= -1.0;
        }

        console.log("fluctuation = " + fluctuation + "%");

        stock.price *= (1 + fluctuation/100);
        stock.price = Math.floor(stock.price * 100) / 100;
        if (stock.price < 1) {
            stock.price = 1;
        }

        // mark the trend for next update
        stock.trend = fluctuation >= 0 ? "+" : "-";
        
        console.log(stock);
    });

}

