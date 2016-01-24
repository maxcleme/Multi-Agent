var WatorModel = function(fishesOptions, sharksOptions) {

	var that = this;

	/** BALL * */
	var Fish = this.fish = function() {
		Agent.call(this, 'fish', 'DodgerBlue');
		this.age = 0;
	};
	var Shark = this.shark = function() {
		Agent.call(this, 'shark', 'black');
		this.age = 0;
		this.lastFishCount = 0;
	};

	Fish.prototype.nextPosition = function() {
		return that.environment.randomVonNeumann(this);
	}
	Shark.prototype.nextPosition = function() {
		return that.environment.randomVonNeumann(this);
	}

	Fish.prototype.doIt = function() {
		var nextP;
		var nbProcessed = 0;
		this.age++;

		var nextPos = this.nextPosition();
		if (nextPos === undefined) {
			return;
		}
		var cell = that.environment.getAgent(nextPos.x, nextPos.y);
		if (!(cell instanceof Shark) && !(cell instanceof Fish)) {
			that.environment.moveAgent(this, nextPos.x, nextPos.y);
			if (this.age % fishesOptions.breedCount === 0) {
				randomPos = that.environment.randomFree(this);
				that.environment.addAgent(new Fish(), randomPos.x, randomPos.y);
			}
		}

	};

	Shark.prototype.doIt = function() {
		var nextP;
		var nbProcessed = 0;
		this.age++;

		if (this.lastFishCount === sharksOptions.minimumEatCount) {
			that.environment.removeAgent(this);
			return;
		}

		var nextPos = this.nextPosition();
		if (nextPos !== undefined) {
			var cell = that.environment.getAgent(nextPos.x, nextPos.y);
			if (cell instanceof Shark) {
				return;
			}
			if (cell instanceof Fish) {
				that.environment.removeAgent(cell);
				this.lastFishCount = 0;
			}
			that.environment.moveAgent(this, nextPos.x, nextPos.y);
			if (this.age % sharksOptions.breedCount === 0) {
				randomPos = that.environment.randomFree(this);
				that.environment
						.addAgent(new Shark(), randomPos.x, randomPos.y);
			}
		}
		this.lastFishCount++;

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