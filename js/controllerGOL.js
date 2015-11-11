var app = angular.module('gol', []);

app.controller('ctrlGOL', ['$scope','$interval',function($scope,$interval) {
  $scope.noRows = 0;
  $scope.noColumns = 0;
  $scope.showBoard = false;

  //Board that will be draw
  $scope.boardToDraw = [];

  //Board calculate from boardToDraw
  $scope.calculateBoard = [];

  //To show the message for click on cells
  $scope.isRunning = false;

  //Interval to execute one step in milliseconds
  $scope.executionInterval = 10;

  //Id to cancel the interval execution
  var refreshIntervalId;


  $scope.$watch('noRows', function () {
    $scope.checkRowsColsInterval();
  });

  $scope.$watch('noColumns', function () {
    $scope.checkRowsColsInterval();
  });
  $scope.$watch('executionInterval', function () {
    $scope.checkRowsColsInterval();
  });

  $scope.checkRowsColsInterval = function(){
    $scope.showBoard = $scope.executionInterval != '' && $scope.noRows != '' && $scope.noColumns != '' && $scope.executionInterval >= 10 && $scope.noRows > 0 && $scope.noColumns > 0;
    $scope.createNewBoardIfProceed();
  }

  $scope.createNewBoardIfProceed = function (){
    //Stop the process if is running
    $scope.stop();
    if($scope.showBoard){
      $scope.boardToDraw = [];
      for(var i = 0; i < $scope.noRows; i++){
        var column = []
        for(var j = 0; j < $scope.noColumns; j++){
          column.push(0);
        }
        $scope.boardToDraw.push(column);
      }
      $scope.resetCalculateBoard();
    }
  }

  $scope.resetCalculateBoard = function(){
    $scope.calculateBoard = [];
    for(var i = 0; i < $scope.noRows; i++){
      var column = []
      for(var j = 0; j < $scope.noColumns; j++){
        column.push(0);
      }
      $scope.calculateBoard.push(column);
    }
  }

  //Change the state of clicked cell
  $scope.switchCell = function(x, y){
    if(!angular.isDefined(refreshIntervalId)){
      if($scope.boardToDraw[x][y]==1){
        $scope.boardToDraw[x][y] = 0;
      }else{
        $scope.boardToDraw[x][y] = 1;
      }
    }
  }

  //Calculate the next state of each cell in the board
  $scope.calculateNextStep = function(){
    for(var row = 0; row < $scope.noRows; row++){
      for(var col = 0; col < $scope.noColumns; col++){
        $scope.calculateBoard[row][col] = $scope.calculateDeadOrAliveCell(row, col);
      }
    }
    $scope.boardToDraw = $scope.calculateBoard;
    $scope.resetCalculateBoard();
  }

  //calculate the next state of a cell on the coordinates x, y
  $scope.calculateDeadOrAliveCell = function(x,y){
    //Cell of game algorithm
    var total = 0;
    if((x-1) >= 0 && (y-1) >= 0) total = total + $scope.boardToDraw[x-1][y-1];
    if((x-1) >= 0) total = total + $scope.boardToDraw[x-1][y];
    if((x-1) >= 0 && (y+1) < $scope.noColumns) total = total + $scope.boardToDraw[x-1][y+1];
    if((y-1) >= 0) total = total + $scope.boardToDraw[x][y-1];
    if((y+1) < $scope.noColumns) total = total + $scope.boardToDraw[x][y+1];
    if((x+1) < $scope.noRows && (y-1) >= 0) total = total + $scope.boardToDraw[x+1][y-1];
    if((x+1) < $scope.noRows) total = total + $scope.boardToDraw[x+1][y];
    if((x+1) < $scope.noRows && (y+1) < $scope.noColumns) total = total + $scope.boardToDraw[x+1][y+1];

    var newState = $scope.boardToDraw[x][y];

    //Algorithm 23/3
    if(newState == 1 && total != 2 && total != 3){
      newState = 0;
    }else if(newState == 0 && total == 3){
      newState=1;
    }
    return newState;
  }

  //Stop the unlimited process
  $scope.stop = function(){
    if (angular.isDefined(refreshIntervalId)) {
      $interval.cancel(refreshIntervalId);
      refreshIntervalId = undefined;
      $scope.isRunning = false;
    }
  }

  //Start the unlimited process
  $scope.start = function(){
    if (angular.isDefined(refreshIntervalId)) return;
    refreshIntervalId = $interval($scope.calculateNextStep, $scope.executionInterval);
    $scope.isRunning = true;
  }


}]);
