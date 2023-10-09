var app = angular.module("mockExchange", []);

app.controller("mainController", function($scope, $http) {  // Note: arrow function notation does not work here!!

    // initlize the main controller here

    $scope.portfolio = [];
    
    setInterval(updateMarketValues, 5000);

    $scope.onPartialMatchChange = () => {

        $http.get("http://localhost:3000/listing?match=" + $scope.partialMatch)
        .then((response) => {
            $scope.matchingStocks = response.data;
        });

    };

    $scope.onStockPurchase = (stockToBuy, sharesToBuy, costPerShare) => {
        console.log(sharesToBuy + " shares of " + stockToBuy.symbol + " (" + stockToBuy.fullName + ") purchased at $" + costPerShare + " per share!");
        $scope.portfolio.push({ "stock" : stockToBuy, "numShare" : sharesToBuy, "costPerShare" : costPerShare,
                                "marketPrice" : costPerShare, "marketValue" : costPerShare * sharesToBuy,
                                "netChange" : 0 });
    };

    $scope.onStockSelected = (stockSelected) => {
        $scope.stockSelected = stockSelected;
    };

    $scope.onStockSold = (portfolioIndex) => {
        if (portfolioIndex >= 0 && portfolioIndex < $scope.portfolio.length) {
            let itemToSell = $scope.portfolio[portfolioIndex];
            console.log(itemToSell.numShare + " shares of " + itemToSell.stock.symbol +
                 " (" + itemToSell.stock.fullName + ") sold at $" + itemToSell.marketPrice.toFixed(2) + " per Share!");
            $scope.portfolio.splice(portfolioIndex, 1);
        }
    };

    function updateMarketValues() {

        $scope.portfolio.forEach(holding => {

            $http.get("http://localhost:3000/quote?symbol=" + holding.stock.symbol)
            .then((response) => {
                if (response.data.length >= 1) {
                    holding.marketPrice = response.data[0].price;
                    holding.marketValue = holding.numShare * response.data[0].price;
                    holding.netChange = holding.marketValue - holding.costPerShare * holding.numShare;
                }
            });
            // console.log($scope.portfolio);
        });

    }

});