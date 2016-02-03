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

	var Chaser = this.chaser = function() {
		Agent.call(this, 'chaser', 'GoldenRod');
		this.IAlevel = chaserOptions.IAlevel / 100
	};

	var Target = this.target = function() {
		Agent.call(this, 'target', 'ForestGreen');
	};

	var Wall = this.wall = function() {
		Agent.call(this, 'wall', 'Peru');
	};
	
	var SuperPower = this.superpower = function() {
		Agent.call(this, 'superpower', 'Blue');
	};

	Target.prototype.nextPosition = function(){
		return that.environment.getPosition(this.position.x + that.environment.pressedDirections.x , this.position.y + that.environment.pressedDirections.y);
	};
	Target.prototype.init = function(){
		that.environment.setDijkstraNumbering(this.position);
	}

	Chaser.prototype.doIt = function() {
		if ( !that.environment.dijkstraGrid.length )
			return;

		if ( that.environment.dijkstraGrid[this.position.x][this.position.y] === 1){
			that.environment.end = true;
		}else {
			if (that.environment.roundCountWithSuperPowerRemaining > 0) {
				this.color = that.environment.roundCountWithSuperPowerRemaining%2 == 0 ? 'red' : 'black';
				if (Math.random() > this.IAlevel) {
					nextPos = that.environment.randomPlace(this);
				}
				else {
					nextPos = that.environment.maxNeighbour(this.position,true);
				}
			} else {
				this.color = 'GoldenRod';
				nextPos = that.environment.minNeighbour(this.position,true);	
			}
			if ( nextPos ){
				that.environment.moveAgent(this, nextPos.x, nextPos.y);
			}
		}


	};
	Wall.prototype.doIt = function() {
		return;
	};
	Target.prototype.doIt = function() {
		nextPos = this.nextPosition();
		if (nextPos) {
			a = that.environment.getAgent(nextPos.x,nextPos.y);
			if (a === undefined){
				that.environment.moveAgent(this, nextPos.x, nextPos.y);
				that.environment.setDijkstraNumbering(this.position);
			}
			else if (a instanceof SuperPower) {
				that.environment.removeAgent(a);
				that.environment.roundCountWithSuperPowerRemaining += 50;
				that.environment.moveAgent(this, nextPos.x, nextPos.y);
				that.environment.setDijkstraNumbering(this.position);
			}
			if (that.environment.roundCountWithSuperPowerRemaining > 0) {
				that.environment.roundCountWithSuperPowerRemaining --;
			}
		}
	};
	
	SuperPower.prototype.doIt = function() {
		return;
	};


};
