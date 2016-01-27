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
	};

	var Target = this.target = function() {
		Agent.call(this, 'target', 'ForestGreen');
	};

	var Wall = this.wall = function() {
		Agent.call(this, 'wall', 'Peru');
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
		}else{
			nextPos = that.environment.minNeighbour(this.position, true);
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
		if ( nextPos && that.environment.getAgent(nextPos.x,nextPos.y) === undefined){
			that.environment.moveAgent(this, nextPos.x, nextPos.y);
			that.environment.setDijkstraNumbering(this.position);
		}
	};


};
