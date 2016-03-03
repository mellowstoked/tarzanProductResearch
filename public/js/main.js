var myApp = angular.module('myApp', []);

myApp.factory('productKeyWords', function($http, $q) {

    var productKeyWords = {};
    productKeyWords.list = [];

    productKeyWords.add = function(productKeyWord) {
        productKeyWords.list.push({
            id: productKeyWords.list.length,
            text: productKeyWord
        });
    };

    return productKeyWords;

});


myApp.controller('MainCtrl', ['$scope', '$http',

    function($scope, $http, res) {
        $scope.queryResults
        $scope.query = function(queryString) {
            // $scope.hello = data;

            //expecting a post request 
            //sending to the express server API /query by post method 
            $http({
                url: '/query',
                dataType: 'json',
                method: 'POST',
                data: {
                    'query': queryString
                },
                headers: {
                    "Content-Type": "application/json"
                }

            }).success(function(response) {
                $scope.productAttributeSets = [];

                // $scope.queryResults = response.ListMatchingProductsResponse.ListMatchingProductsResult[0].Products.Product;
                $scope.queryResults = response;
                for (var i in $scope.queryResults) {
                    var product = {}
                    
                }
                // var product = {}
                // for (var key in $scope.queryResults[i])
                //     product[key] = $scope.queryResults[i][key]
                // $scope.productAttributeSets.push(product)
                // }
                // var product = {}
                // console.log($scope.queryResults[i].AttributeSets['ns2:ItemAttributes'])
                // for (var key in $scope.queryResults[i].AttributeSets['ns2:ItemAttributes']) {
                //    // for (var key in $scope.queryResults[i])
                //     //console.log(key,$scope.queryResults[i].AttributeSets[key])
                //     product[key.replace("ns2:", "").toLowerCase()] = $scope.queryResults[i].AttributeSets['ns2:ItemAttributes'][key];
                //     }
                //     $scope.productAttributeSets.push(product);
                // }
                // console.log($scope.productAttributeSets)

                // $scope.asinResults = response.json.ranking;
                // console.log($scope.asinResults);



            }).error(function(error) {
                $scope.error = error;
            });

        }
    }
]);