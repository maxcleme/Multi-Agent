/**
 * Created by Quentin on 14/01/2015.
 */
var BallModel = function (ballOptions) {

  var that = this;

  var directions = [[0,1],[0,-1],[1,0],[-1,0],[1,1],[-1,-1],[-1,1],[1,-1]];

  /** FISH **/
  var Ball = this.ball = function () {
    Agent.call(this, 'ball', 'red');
    this.direction = directions[Math.floor(Math.random() * directions.length)];
  };
  Ball.prototype.doIt = function () {

    var nextPosition = that.environment.getPosition(this.position.x + this.direction[0], this.position.y + this.direction[1]);

    if (nextPosition == undefined) {
      do {
        var x = this.direction[0];
        var y = this.direction[1];
        if (x == 0 || y == 0) {
          this.direction = [this.direction[0]*(-1),this.direction[1]*(-1)];
        }
        else if (x == 1 && y== 1) {
          this.direction = [1,-1]
        }
        else if (x == 1 && y== -1) {
          this.direction = [-1,-1]
        }
        else if (x == -1 && y== -1) {
          this.direction = [-1,1]
        }
        else if (x == -1 && y== 1) {
          this.direction = [1,1]
        }
      }
      while ((nextPosition = that.environment.getPosition(this.position.x + this.direction[0], this.position.y + this.direction[1])) == undefined);
    }
    else {
      var cell = that.environment.getAgent(nextPosition.x, nextPosition.y);
      if (cell != undefined && cell instanceof Ball) {
        this.direction = [this.direction[0]*(-1),this.direction[1]*(-1)];
      }
    }

    that.environment.moveAgent(this, nextPosition.x, nextPosition.y);
  };

  /** STATS **/
  this.statObject = function () {

    this.reset = function () {
    };

    this.reset();

    this.statsFunction = function (agent) {

    };

    this.callback = function () {
    };
  };

};