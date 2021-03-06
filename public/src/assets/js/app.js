var app = angular.module("myApp", ["ngRoute"]);

function MainController($scope, $route, $routeParams, $location) {
  $scope.$route = $route;
  $scope.$location = $location;
  $scope.$routeParams = $routeParams;
  $scope.redirectPage = (e, path) => {
    e.preventDefault();
    $location.path(path);
  };
  $scope.getClass = function (path) {
    return $location.path() === path ? "active" : "";
  };
}

function HomeController($scope, $http) {
  $scope.title = "List Product";
  $scope.countModel = "5";
  $scope.currenPage = 1;
  $scope.totalPage = [];
  $scope.loading = false;

  $scope.getListProduct = (number = null, type = null) => {
    $scope.loading = true;
    console.log("current", $scope.currenPage + "number", number + "type", type);
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
        console.log(result.data.product);
        $scope.listProduct = result.data.product;
        let totalPage = [];
        for (let i = 1; i <= result.data.totalPage; i++) {
          totalPage.push(i);
        }
        $scope.totalPage = totalPage;
        $scope.loading = false;
      });
  };

  $scope.getListProduct();
}

function ProductController($scope, $http, $routeParams) {
  let productId = $routeParams.productId;
  let variantId = $routeParams.variantId;
  $scope.title = "Chi tiết sản phẩm"
  $scope.getProductInfo = (productId, variantId) => {
    console.log("varianId", variantId);
    $http.get(`/product/info/${productId}/${variantId}`).then((result) => {
      console.log("product", result);
      $scope.product = result.data;
    });
  };
  $scope.getProductInfo(productId, variantId);
}

function CreateOrderController($scope, $http) {
  $scope.title = "Create Order"
  $scope.getListProduct = () => {
    $http
      .get(`/product`)
      .then((result) => {
        console.log("alo")
        $scope.listProduct = result.data
      })
  }

  $scope.getListProduct();

  $scope.postProduct = () => {
    let order = {}
    let infoCustomer = {
      email: $scope.emailCustomer,
      fulfillment_status: "fulfilled"
    }
    let infoVariant = {
      variant_id: $scope.selectProduct,
      quantity: $scope.quantity
    }
    order.order = infoCustomer
    order.order.line_items = []
    order.order.line_items.push(infoVariant)

    $http.post("http://0.0.0.0:3001/orders/create", order).then((result) => {
      $scope.status == result.status
    }).catch((error) => {
      console.log(error)
    })
  }
}

function OrderController($scope, $http) {
  $scope.title = "List Order";
  // $scope.userName = '';
  // $scope.userId = 0;
  $scope.countModel = "5";
  $scope.currenPage = 1;
  $scope.totalPage = [];
  $scope.loading = false;

  $scope.getListOrder = (number = null, type = null) => {
    $scope.loading = true;
    console.log("current", $scope.currenPage + "number", number + "type", type);
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
    $http
      .get(`/orders?limit=${$scope.countModel}&page=${$scope.currenPage}`)
      .then((result) => {
        $scope.listOrder = result.data.order;
        let totalPage = [];
        for (let i = 1; i <= result.data.totalPage; i++) {
          totalPage.push(i);
        }
        $scope.totalPage = totalPage;
        $scope.loading = false;
      })
      .catch((error) => {
        console.log(error);
      });
  };

  $scope.getListOrder();
}

app
  .controller("MainController", MainController)
  .controller("HomeController", HomeController)
  .controller("ProductController", ProductController)
  .controller("OrderController", OrderController);

app.config(function ($routeProvider, $locationProvider) {
  $routeProvider
    .when("/product/info/:productId/:variantId", {
      templateUrl: "product.html",
      controller: "ProductController",
    })
    .when("/", {
      templateUrl: "home.html",
      controller: "HomeController",
    })
    .when("/order", {
      templateUrl: "order.html",
      controller: "OrderController",
    })
    .when("/order/create", {
      templateUrl: "createOrder.html",
      controller: "CreateOrderController",
    });
});
