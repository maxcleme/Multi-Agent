var BallModel = function(ballOptions) {

    var that = this;

    var directions = [
        [0, 1],
        [0, -1],
        [1, 0],
        [-1, 0],
        [1, 1],
        [-1, -1],
        [-1, 1],
        [1, -1]
    ];
	
    /** BALL **/
    var Ball = this.ball = function(env) {
        Agent.call(this, 'ball', 'red', env, ballOptions.shape);
        this.direction = directions[Math.floor(Math.random() * directions.length)];
    };


	Ball.prototype.nextPosition = function() {
		return this.environment.getPosition(this.position.x + this.direction[0], this.position.y + this.direction[1]);
	}
		
    Ball.prototype.doIt = function() {
        var nextP;
        var nbProcessed = 0;
		
        while (nbProcessed < directions.length && (nextP = this.nextPosition()) == undefined) {
            var x = this.direction[0];
            var y = this.direction[1];
            if (x == 0 || y == 0) {
                this.direction = [this.direction[0] * (-1), this.direction[1] * (-1)];
            } else if (x == 1 && y == 1) {
                this.direction = [1, -1]
            } else if (x == 1 && y == -1) {
                this.direction = [-1, -1]
            } else if (x == -1 && y == -1) {
                this.direction = [-1, 1]
            } else if (x == -1 && y == 1) {
                this.direction = [1, 1]
            }
            nbProcessed++;
        }

        if (nextP !== undefined) {
            var cell = this.environment.getAgent(nextP.x, nextP.y);
            if (cell !== undefined && cell instanceof Ball) {
            	this.direction = [this.direction[0] * (-1), this.direction[1] * (-1)];
            	cell.direction = [cell.direction[0] * (-1), cell.direction[1] * (-1)];
            } else {
                this.environment.moveAgent(this, nextP.x, nextP.y);
            }
        }
    };

    /** STATS **/
    this.statObject = function() {

        this.reset = function() {};

        this.reset();

        this.statsFunction = function(agent) {

        };

        this.callback = function() {};
    };
};