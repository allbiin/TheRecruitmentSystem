
var lastApplicationId = 0;

angular.module("application", ['ngRoute', 'ngCookies', 'selector',  'ngMessages', 'pascalprecht.translate']).config(function ($routeProvider, $translateProvider, $locationProvider) {
    $locationProvider.hashPrefix('');

    /*Routing*/
    $routeProvider
    .when('/', {
        templateUrl: 'form.html',
        controller: 'registration',
        controllerAs: 'registration'
    }).when('/login', {
        templateUrl: 'login.html',
        controller: 'login',
        controllerAs: 'login'
    }).when('/registration', {
        templateUrl: 'form.html',
        controller: 'registration',
        controllerAs: 'registration'
    }).when("/content", {
        templateUrl: 'content.html',
        controller: 'content',
        controllerAs: 'content'
    }).when("/logout", {
        templateUrl: 'login.html',
        controller: 'logout',
        controllerAs: 'logout'
    })
    /**
     *Adrian
     */
        .when("/application/:id", {
            templateUrl: 'application.html',
            controller: 'jobApplication',
            controllerAs: 'jobApplication'
        })
        .when("/application_list", {
            templateUrl: 'application_list.html',
            controller: 'jobApplicationList',
            controllerAs: 'jobApplicationList'
        })
        .when("/register_application", {
        templateUrl: 'register_application.html',
        controller: 'jobApplicationRegister',
        controllerAs: 'jobApplicationRegister'
    });

    /*Translate config*/
    $translateProvider.useUrlLoader('/messageBundle');
    $translateProvider.useStorage('UrlLanguageStorage');
    $translateProvider.preferredLanguage('en');
    $translateProvider.fallbackLanguage('en');

})



    .controller('jobApplication', function ($scope, $translate,$http,  $cookies, $rootScope,  $location, $routeParams) {
    if(!$rootScope.authenticated){
        $location.path("/login");
    }
        $scope.statuses = [{id:0,label:"PENDING"},{id:1,label:"REJECTED"},{id:2,label:"ACCEPTED"}];

    lastApplicationId =$routeParams.id;

    getApplication("en", $http, $cookies,$rootScope);
/**
    $http({
        method: 'GET',
        url: '/api/jobapplication/en/by/id/'+$routeParams.id,
        headers: {'Authorization':  $cookies.get("token")}
    }) .then(function(response){
        $scope.application=response.data;
        $scope.newStatus = response.data.status.name; });
**/


       /**
        $http({
            method: 'GET',
            url: '/api/jobapplication/en/getAllValidStatus',
            headers: {'Authorization':  $cookies.get("token")}
        }) .then(function(response){
            alert(response.data);

            angular.forEach(response.data, function(status) {
                $scope.statuses.push({value:status.id,label:status.name});
            });
        });
        */
})




    .controller('jobApplicationList', function ($scope, $http,$rootScope,$cookies,  $translate, $location) {
    if(!$rootScope.authenticated){
        $location.path("/login");
    }
    $http({
        method: 'GET',
        url: '/api/jobapplication/en/jobapplications/pages/0',
        headers: {'Authorization':  $cookies.get("token")}
    }) .then(function(response){$scope.jobapplications=response.data});

   $scope.changePage = function(pageNmr) {
       var newPage = pageNmr-1;
       $http({
           method: 'GET',
           url: '/api/jobapplication/en/jobapplications/pages/'+newPage,
           headers: {'Authorization':  $cookies.get("token")}
       }) .then(function(response){$scope.jobapplications=response.data});

   }

})

    .controller('jobApplicationRegister',  function ($scope, $rootScope, $translate, $location){

        $scope.myBrowsers = [];
        var competenceList = [{"id":0,"name":"sausage grilling"},{"id":1,"name":"carousel operation"}];


        $scope.browsers = [];
        angular.forEach(competenceList, function(competence) {
            $scope.browsers.push({value:competence.id,label:competence.name});
        });


    //todo

/**
 * Alex
 */
    }).controller('navigation', function ($scope, $translate, $location,$cookies,$http,$rootScope) {
    $scope.changeLanguage = function (lang) {
        $translate.use(lang);
        $location.search('lang', lang);
        getApplication(lang, $http, $cookies,$rootScope);
    }
}).controller('registration', function ($scope, $rootScope, $http, $location) {
    var self = this;

    self.submitForm = function (registrationForm) {
        $rootScope.registration_unavailable_error = false;
        $rootScope.registrationForm_pending_request = true;

        /**
         * Creating json request
         */
        var params = JSON.stringify(
            { firstname : $scope.registration.firstname,
                lastname : $scope.registration.lastname,
                dateOfBirth : $scope.registration.dateOfBirth,
                email : $scope.registration.email,
                username : $scope.registration.username,
                password : $scope.registration.password
            }
        );

        /**
         * Sending request and receiving response
         */
        $http({
            method: 'POST',
            url: '/api/registerservice/register',
            headers: {'Content-Type': 'application/json'},
            data: params
        }).then(function successCallback(response) {
            $rootScope.registrationForm_pending_request = false;
            handlingRegistrationResponse($rootScope, registrationForm, response, $location);
        }, function errorCallback(response) {
            $rootScope.registrationForm_pending_request = false;
            /*TODO: fix this when proper JSON reponse in created*/
            if(response.status === 400)
                registrationForm["dateOfBirth"].$error.date = true;
            else if(response.status === 410)
                $rootScope.registration_unavailable_error = true;
        });
    }
}).controller('login', function ($rootScope, $scope, $http, $location, $cookies) {
    var self = this;

    self.submitLoginForm = function (loginForm) {
        $rootScope.loginForm_pending_request = true;
        $rootScope.login_user_not_exists_error = false;
        $rootScope.login_user_cred_error = false;
        $rootScope.login_service_gone = false;
        $rootScope.logout_success = false;

        /**
         * Creating json request
         */
        var params = JSON.stringify(
            {
                username : $scope.login.username,
                password : $scope.login.password
            }
        );

        $http({
            method: 'POST',
            url: '/api/auth/login',
            headers: {'Content-Type': 'application/json'},
            data: params
        }).then(function successCallback(response) {
            $rootScope.loginForm_pending_request = false;
            $location.path("/content");
            $rootScope.login_success_alert = true;
            $cookies.put("token", response.data.token);

            $rootScope.authenticated = true;

        }, function errorCallback(response) {
            if(response.status == 401)
                $rootScope.login_user_not_exists_error = this;
            else if(response.status == 400)
                $rootScope.login_user_cred_input_error = true;
            else if(response.status == 500)
                $rootScope.login_service_error = true;
            else if(response.status == 410)
                $rootScope.login_service_gone = true;

            $rootScope.loginForm_pending_request = false;
        });
    }

}).controller('content', function ($rootScope, $scope, $http, $location) {
    if(!$rootScope.authenticated){
        $location.path("/login");
    }
}).controller('logout', function ($rootScope, $location, $cookies) {
    $cookies.remove("token");
    $rootScope.authenticated = false;
    $rootScope.logout_success = true;
    $location.path("/login");
    
}).factory('UrlLanguageStorage', ['$location', function($location) {
    return {
        put: function (name, value) {},
        get: function (name) {
            return $location.search()['lang']
        }
    };
}]);

/**
 * Taking action depending on status of registration response
 * @param registrationForm
 * @param response
 */
function handlingRegistrationResponse($rootScope, registrationForm, response, $location) {
    if(response.data.status == "BAD_REQUEST")
        handleFailedRegistration(registrationForm, response);
    else if(response.data.status == "CREATED"){
        handleSuccessfulRegistration($rootScope, $location);
    }
}

/**
 * Handling registration failure
 * @param registrationForm
 * @param response
 */
function handleFailedRegistration(registrationForm, response) {
    response.data.errorList.forEach(function (entry) {
        showErrorMessageForGiveField(registrationForm, entry.field);
    });
}

/**
 * Showing error message for given field
 * @param registrationForm
 * @param field
 * TODO: change to proper error recognition
 */
function showErrorMessageForGiveField(registrationForm, field) {
    if(field == "dateOfBirth")
        registrationForm[field].$error.date = true;
    else if(field == "email")
        registrationForm[field].$error.email = true;
    else
        registrationForm[field].$error.minlength = true;
}

/**
 * Handling successful outcome of registration process
 * @param $rootScope
 * @param $location
 */
function handleSuccessfulRegistration($rootScope, $location) {
    $location.path("/login");
    $rootScope.registration_success_alert = true;
}

function getApplication(lang, $http, $cookies,$scope){
    $http({
        method: 'GET',
        url: '/api/jobapplication/'+ lang + '/jobapplications/'+lastApplicationId,
        headers: {'Authorization':  $cookies.get("token")}
    }) .then(function(response){
        $scope.application=response.data;
        $scope.newStatus = response.data.status.name; });

}