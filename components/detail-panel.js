angular.module("mockExchange").component("detailPanel", {
    templateUrl: "components/detail-panel.html",
    bindings: {
        stockToShow: "<",
        buyCallback: "<"
    },
    controller: function($scope, $http) {
        
        this.$onChanges = () => {

            this.marketPrice = undefined;

            if (this.intervalId != undefined) {
                clearInterval(this.intervalId);
                this.intervalId = undefined;
            }

            if (this.stockToShow != undefined && this.stockToShow.symbol != undefined) {
                this.intervalId = setInterval(this.updatePrice, 5000, this);
            }
        };

        this.updatePrice = (controller) => {

            $http.get("http://localhost:3000/quote?symbol=" + controller.stockToShow.symbol)
            .then((response) => {
                if (response.data.length > 0) {
                    controller.marketPrice = response.data[0].price;
                }
            });
        };

    }
});