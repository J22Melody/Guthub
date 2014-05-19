var app = angular.module('guthub',['guthub.directives','guthub.services','ngRoute'])

.config(['$routeProvider',function($routeProvider){
    $routeProvider
    .when('/',{
        controller: 'ListCtrl',
        resolve: {
            recipes: function(MultiRecipeLoader){
                return MultiRecipeLoader();
            }
        },
        templateUrl: 'views/list.html'
    })
    .when('/edit/:recipeId',{
        controller: 'EditCtrl',
        resolve: {
            recipe: function(RecipeLoader){
                return RecipeLoader();
            }
        },
        templateUrl: 'views/recipeForm.html'
    })
    .when('/view/:recipeId',{
        controller: 'ViewCtrl',
        resolve: {
            recipe: function(RecipeLoader){
                return RecipeLoader();
            }
        },
        templateUrl: 'views/viewRecipe.html'
    })
    .when('/new',{
        controller: 'NewCtrl',
        templateUrl: 'views/recipeForm.html'
    })
    .otherwise({redirectTo:'/'});
}])

.controller('ListCtrl', ['$scope','recipes',function($scope,recipes){
    $scope.recipes = recipes;
}])

.controller('ViewCtrl', ['$scope','$location','recipe',function($scope,$location,recipe){
    $scope.recipe = recipe;

    $scope.delete = function(){
        $scope.recipe.$delete(function(res){
            if(res.state){
                $location.path('/');
            }
        });
    };
}])

.controller('EditCtrl', ['$scope','$location','recipe',function($scope,$location,recipe){
    $scope.recipe = recipe;
    var id = recipe._id

    $scope.save = function(){
        $scope.recipe.$update(function(res){
            if(res.state){
                $location.path('/view/' + id);
            }
        });
    };
}])

.controller('NewCtrl', ['$scope','$location','Recipe',function($scope,$location,Recipe){
    $scope.recipe = new Recipe({
        ingredients: []
    });

    $scope.save = function(){
        $scope.recipe.$add(function(res){
            if(res.state){
                $location.path('/view/' + res.doc._id);
            }
        });
    };
}])

.controller('IngredientsCtrl', ['$scope',function($scope){
    $scope.addIngredient = function(){
        var ingredients = $scope.recipe.ingredients;
        ingredients[ingredients.length] = {};
    };

    $scope.removeIngredient = function(index){
        $scope.recipe.ingredients.splice(index,1);
    };
}]);
