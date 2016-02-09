var ChaserModel = function(chaserOptions) {

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
	
	var that = this;

	var Chaser = this.chaser = function(env) {
		Agent.call(this, 'chaser', 'GoldenRod', env);
		this.cleverness = chaserOptions.cleverness / 10;
	};

	var Target = this.target = function(env) {
		Agent.call(this, 'target', 'ForestGreen', env);
	};

	var Wall = this.wall = function(env) {
		Agent.call(this, 'wall', 'Peru', env);
	};
	
	var SuperPower = this.superpower = function(env) {
		Agent.call(this, 'superpower', 'Blue', env);
	};

	Target.prototype.nextPosition = function(){
		return this.environment.getPosition(this.position.x + this.environment.pressedDirections.x , this.position.y + this.environment.pressedDirections.y);
	};
	Target.prototype.init = function(){
		this.environment.computeDijkstraNumbering(this.position);
	}

	Chaser.prototype.doIt = function() {
		if ( !this.environment.dijkstraGrid.length )
			return;

		if ( this.environment.dijkstraGrid[this.position.x][this.position.y] === 1){
			this.environment.end = true;
		}else {
			if (this.environment.roundCountWithSuperPowerRemaining > 0) {
				this.color = this.environment.roundCountWithSuperPowerRemaining%2 == 0 ? 'red' : 'black';
				if (Math.random() > this.cleverness) {
					nextPos = this.environment.randomPlace(this,true);
				}
				else {
					nextPos = this.environment.maxNeighbour(this.position,true);
				}
			} else {
				this.color = 'GoldenRod';
				nextPos = this.environment.minNeighbour(this.position,true);	
			}
			if ( nextPos ){
				this.environment.moveAgent(this, nextPos.x, nextPos.y);
			}
		}


	};
	Wall.prototype.doIt = function() {
		return;
	};
	Target.prototype.doIt = function() {
		nextPos = this.nextPosition();
		if (nextPos) {
			a = this.environment.getAgent(nextPos.x,nextPos.y);
			if (a === undefined){
				this.environment.moveAgent(this, nextPos.x, nextPos.y);
				this.environment.computeDijkstraNumbering(this.position);
			}
			else if (a instanceof SuperPower) {
				this.environment.removeAgent(a);
				this.environment.roundCountWithSuperPowerRemaining = 50;
				this.environment.moveAgent(this, nextPos.x, nextPos.y);
				this.environment.computeDijkstraNumbering(this.position);
			}
			if (this.environment.roundCountWithSuperPowerRemaining > 0) {
				this.environment.roundCountWithSuperPowerRemaining --;
			}
		}
	};
	
	SuperPower.prototype.doIt = function() {
		return;
	};


};
