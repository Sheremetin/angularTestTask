'use strict';

app.controller('CounterController', ['$scope', '$timeout', function ($scope, $timeout) {
    var timer, current, splitCurrent;

    $scope.stopTrigger = false;

    $scope.counter = 0;
    $scope.working = 1;

    /**
     * stop counter 
     */

    var stopCounter = function () {
        $timeout.cancel(timer);
        timer = null;
        current = $scope.counter;
        $scope.current = current;

        $scope.working = 0;
        console.log(current)
    };

    /**
     * start counter
     */

    var startCounter = function () {

        if (timer === null) {
            updateCounter();
        }

        $scope.working = 1;
    };

    /**
     * start/stop counter trigger
     */

    $scope.toggleCounter = function () {
        if ($scope.working) {
            stopCounter();
        } else {
            startCounter();
        }
    };

    /**
     * reset counter
     */

    $scope.resetCounter = function () {
        $timeout.cancel(timer);
        timer = null;
        if (timer === null) {
            $scope.counter=0;
            $scope.current='';
            $scope.showSplitCounter='';
            $scope.splitData=[];
            $scope.working = 0;
        }
    };

    $scope.splitData = [];

    /**
     * split counter
     */

    $scope.splitCounter = function () {
        splitCurrent = $scope.counter;
        $scope.splitCurrent = splitCurrent;
        if (timer === null) {
            updateCounter();
        }
        $scope.splitData.push(splitCurrent);

        $scope.showSplitCounter = $scope.splitData.join(', ');
    };

    /**
     * counter
     */

    var updateCounter = function () {
        $scope.counter++;
        timer = $timeout(updateCounter, 100);
    };
    updateCounter();
}]);
