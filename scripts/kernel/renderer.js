var Renderer = function(scale) {

	this.context = undefined;
	this.environment = undefined;
	this.scale = scale;

	this.positionXScaled = [];
	this.positionYScaled = [];

	this.widthScaled = undefined;
	this.heightScaled = undefined;


	this.init = function() {

		if (!this.scale) {
			var scaleHeight = (window.innerHeight / 2)
					/ this.environment.options.height;
			var scaleWidth = (window.innerWidth / 2)
					/ this.environment.options.width;
			this.scale = Math.floor(Math.min(scaleHeight, scaleWidth));
		}

		var canvas = document.createElement("canvas");
		canvas.setAttribute("width", ""
				+ (this.environment.options.width * this.scale));
		canvas.setAttribute("height", ""
				+ ((this.environment.options.height + 1) * this.scale));

		var content = document.getElementById("content");
		content.innerHTML = '';
		content.appendChild(canvas);

		this.context = canvas.getContext('2d');

		// PRECOMPUTE
		for ( i = 0 ; i < this.environment.options.width ; i++ ){
			this.positionXScaled[i] = i * this.scale;
		}
		for ( i = 0 ; i < this.environment.options.height ; i++ ){
			this.positionYScaled[i] = i * this.scale;
		}

		this.widthScaled = (this.environment.options.width ) * this.scale;
		this.heightScaled = (this.environment.options.height ) * this.scale;
	};

	/**
	 * Set the color of the agent to its positions
	 * @param agent the agent color.
	 */
	this.setColor = function(agent) {
		this.context.fillStyle = agent.color;

		switch (agent.shape) {
		case 'CIRCLE':
			var centerX = this.positionXScaled[agent.position.x] + this.scale / 2;
			var centerY = this.positionYScaled[agent.position.y] + this.scale / 2;
			var radius = this.scale / 2;

			this.context.beginPath();
			this.context.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
			this.context.fillStyle = 'green';
			this.context.fill();
			this.context.lineWidth = 1;
			this.context.strokeStyle = '#003300';
			this.context.stroke();
			break;
		default:
		    this.context.fillRect(this.positionXScaled[agent.position.x], this.positionYScaled[agent.position.y], this.scale, this.scale);
			break;
		}
	};

	/**
	 * Clean the canvas.
	 */
	this.clean = function() {
		this.context.clearRect(0, 0, this.widthScaled, this.heightScaled);
		this.context.fillStyle = "white";
		this.context.fillRect(0, 0,this.widthScaled, this.heightScaled);
		this.context.strokeRect(0, 0, this.widthScaled, this.heightScaled);

		if ( this.environment.options.grid ){
			for ( i = 1 ; i < this.environment.options.width ; i++ ){
					this.context.beginPath();
					this.context.moveTo(0, i*this.scale);
					this.context.lineTo(this.widthScaled, i*this.scale );
					this.context.stroke();

					this.context.beginPath();
					this.context.moveTo(i*this.scale, 0);
					this.context.lineTo(i*this.scale, this.heightScaled);
					this.context.stroke();
			}
		}

	};
};
