angular.module("mockExchange").component("portfolio", {
    templateUrl: "components/portfolio.html",
    bindings: {
        portfolioToShow: "<",
        sellCallback: "<",
        stockSelectCallback: "<"
    }
});