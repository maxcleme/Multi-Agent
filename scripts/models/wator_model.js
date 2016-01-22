var WatorModel = function(fishesOptions, sharksOptions) {

	var that = this;

	/** BALL * */
	var Fish = this.fish = function() {
		Agent.call(this, 'fish', 'blue');
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

		var old_x = this.position.x;
		var old_y = this.position.y;
		var nextPos = this.nextPosition();
		if ( nextPos === undefined ){
			return;
		}
		var cell = that.environment.getAgent(nextPos.x, nextPos.y);
		if (!(cell instanceof Shark) && !(cell instanceof Fish)) {
			that.environment.moveAgent(this, nextPos.x, nextPos.y);
			if (this.age % fishesOptions.breedCount === 0) {
				that.environment.addAgent(new Fish(), old_x, old_x);
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

		var old_x = this.position.x;
		var old_y = this.position.y;
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
				that.environment.addAgent(new Shark(), old_x, old_x);
			}
		}
		this.lastFishCount++;

	};

	/** STATS * */
	this.statObject = function() {

		this.reset = function() {
		};

		this.reset();

		this.statsFunction = function(agent) {

		};

		this.callback = function() {
		};
	};

};