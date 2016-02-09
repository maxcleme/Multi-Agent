var WatorModel = function(fishesOptions, sharksOptions) {

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

	var Fish = this.fish = function(env) {
		Agent.call(this, 'fish', 'DodgerBlue', env);
	};
	var Shark = this.shark = function(env) {
		Agent.call(this, 'shark', 'LightCoral', env);
	};

	Fish.prototype.age = 0;

	Shark.prototype.age = 0;
	Shark.prototype.lastFishCount = 0;



	Fish.prototype.doIt = function() {
		this.age++;
		shuffleArray(directions);
		for ( i = 0 ; i < directions.length ; i++ ){
			var nextPos = this.environment.getPosition(this.position.x + directions[i][0], this.position.y + directions[i][1]);
			if ( nextPos === undefined )
				continue // In case of non-toric world
			var cell = this.environment.getAgent(nextPos.x, nextPos.y);
			if (cell === undefined) {
				old_x = this.position.x;
				old_y = this.position.y;
				this.environment.moveAgent(this, nextPos.x, nextPos.y);
				if (this.age % fishesOptions.breedCount === 0) {
					//randomPos = this.environment.randomFree(this);
					this.environment.addAgent(new Fish(this.environment), old_x, old_y);
				}
				return;
			}
		}

	};

	Shark.prototype.doIt = function() {
		this.age++;
		this.lastFishCount++;

		if (this.lastFishCount === sharksOptions.minimumEatCount) {
			this.environment.removeAgent(this);
			return;
		}

		var nextPos;
		var cell;
		var firstEmptyPos;
		var old_x;
		var old_y;
		shuffleArray(directions);
		for ( i = 0 ; i < directions.length ; i++ ){
			nextPos = this.environment.getPosition(this.position.x + directions[i][0], this.position.y + directions[i][1]);
			if ( nextPos === undefined )
				continue // In case of non-toric world
			cell = this.environment.getAgent(nextPos.x, nextPos.y);
			if (cell instanceof Fish) {
				this.environment.removeAgent(cell);
				this.lastFishCount = 0;
				old_x = this.position.x ;
				old_y = this.position.y ;
				this.environment.moveAgent(this, nextPos.x, nextPos.y);
				if (this.age % sharksOptions.breedCount === 0) {
					this.environment.addAgent(new Shark(this.environment), old_x, old_y	);
				}
				return;
			}
			if (cell === undefined ){
				firstEmptyPos = nextPos;
			}
		}
		if ( firstEmptyPos && nextPos){
			old_x = this.position.x ;
			old_y = this.position.y ;
			this.environment.moveAgent(this, nextPos.x, nextPos.y);
			if (this.age % sharksOptions.breedCount === 0) {
				this.environment.addAgent(new Shark(this.environment), old_x, old_y	);
			}
		}

	};

	/** STATS **/
	this.statObject = function() {

		this.reset = function() {
			this.sharkCount = 0;
			this.fishCount = 0;
			this.nbSharkPerAge = [];
			this.nbFishPerAge = [];
			this.maxAge = 0;
		};

		this.reset();

		this.statsFunction = function(agent) {
			var table;
			if (agent instanceof Shark) {
				this.sharkCount++;
				table = this.nbSharkPerAge;
			} else if (agent instanceof Fish) {
				this.fishCount++;
				table = this.nbFishPerAge;
			}
			if (table != undefined) {
				if (table[agent.age] == undefined) {
					table[agent.age] = 1;
				} else {
					table[agent.age]++;
				}
				if (agent.age > this.maxAge) {
					this.maxAge = agent.age;
				}
			}
		};

		this.callback = function() {
		};
	};

};
