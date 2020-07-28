var app = angular.module("myApp", []);

app.controller("productController", productController);

function productController($scope, $http) {
    $scope.title = "List Product";
    // $scope.userName = '';
    // $scope.userId = 0;
    $scope.countModel = "5";
    $scope.currenPage = 1;
    $scope.totalPage = [];
    $scope.loading = false;

    $scope.getListProduct = (number = null, type = null) => {
        $scope.loading = true;
        console.log("current", $scope.currenPage + "number", number + "type", type)
        if (number) $scope.currenPage = number;
        if (type) {
            switch (type) {
                case "prev":
                    $scope.currenPage = $scope.currenPage - 1;
                    break;
                case "next":
                    $scope.currenPage = $scope.currenPage + 1;
                    break;
            }
        }
        console.log($scope.countModel, $scope.currenPage);
        $http
            .get(`/product?limit=${$scope.countModel}&page=${$scope.currenPage}`)
            .then((result) => {
                $scope.listProduct = result.data.product;
                let totalPage = [];
                for (let i = 1; i <= result.data.totalPage; i++) {
                    totalPage.push(i);
                }
                $scope.totalPage = totalPage;
                $scope.loading = false;
            });
    };
    $scope.getProductInfo = (productId, variantId) => {
        $http
            .get(`/product/info?productId=${productId}&variantId=${variantId}`)
            .then((result) => {
                $scope.infoProduct = result.data
            });
    }

    $scope.getListProduct();
}
