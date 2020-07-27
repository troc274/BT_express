var app = angular.module('myApp', []);

app.controller('productController', productController);

function productController($scope, $http) {
    $scope.title = 'List Product';
    // $scope.userName = '';
    // $scope.userId = 0;
    $scope.countModel = "5"
    $scope.currenPage = 1

    $scope.getListProduct = () => {
        console.log($scope.countModel, $scope.currenPage)
        $http.get(`/product?limit=${$scope.countModel}&page=${$scope.currenPage}`).then((result) => {
            console.log(result)
            $scope.listProduct = result.data.product;
        });
    }

    $scope.getListProduct()
}