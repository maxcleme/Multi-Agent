/**
 * Created by Quentin on 16/01/2015.
 */
var Renderer = function(scale) {

	this.context = undefined;
	this.environment = undefined;
	this.scale = scale;

	// 3D stuffs
	this.scene = undefined;
	this.camera = undefined;
	this.renderer3D = undefined;
	this.texture = undefined;
	this.material = undefined;

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
	};

	this.init3D = function() {

		var height = (this.environment.options.height * this.scale);
		var width = (this.environment.options.width * this.scale);

		height = nearestPow2(height);
		width = nearestPow2(width);

		// Canvas
		var canvas = document.createElement("canvas");
		canvas.setAttribute("width", "" + width);
		canvas.setAttribute("height", "" + height);
		this.context = canvas.getContext('2d');

		// Document
		this.renderer3D = new THREE.WebGLRenderer();
		this.renderer3D.setSize(height, width);
		document.body.appendChild(this.renderer3D.domElement);

		this.scene = new THREE.Scene();

		// Camera
		this.camera = new THREE.PerspectiveCamera(45, width / height, 1, 1000);
		this.camera.position.z = 500;
		this.camera.lookAt(this.scene.position);

		var geometry = new THREE.SphereGeometry(height / 2, 100, 100);
		this.texture = new THREE.Texture(canvas);
		this.material = new THREE.MeshBasicMaterial({
			map : this.texture
		});
		this.material.needsUpdate = true;

		var earthMesh = new THREE.Mesh(geometry, this.material);
		earthMesh.overdraw = true;
		this.scene.add(earthMesh);
		this.scene.add(this.camera);

		this.renderer3D.render(this.scene, this.camera);

	};

	/**
	 * Display the dijkstra number on the canvas.
	 */
	this.displayDijkstraNumbering = function() {
		var dijkstraGrid = this.environment.dijkstraGrid;
		for (var x = 0; x < dijkstraGrid.length; x++) {
			for (var y = 0; y < dijkstraGrid[x].length; y++) {
				this.context.fillStyle = 'white';
				this.context.fillText("" + dijkstraGrid[x][y], (x) * this.scale
						+ this.scale / 3,
						((y + 1) * this.scale - this.scale / 3));
			}
		}
	};

	/**
	 * Set the color of the agent to its positions
	 * @param agent the agent color.
	 */
	this.setColor = function(agent) {
		this.context.fillStyle = agent.color;

		switch (agent.shape) {
		case 'CIRCLE':
			var centerX = (agent.position.x * this.scale);
			var centerY = (agent.position.y * this.scale);
			var radius = this.scale;

			this.context.beginPath();
			this.context.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
			this.context.fillStyle = 'green';
			this.context.fill();
			this.context.lineWidth = 1;
			this.context.strokeStyle = '#003300';
			this.context.stroke();
			break;
		default:
		    this.context.fillRect(agent.position.x * this.scale, agent.position.y * this.scale, this.scale, this.scale);
			break;
		}
	};

	/**
	 * Clean the canvas.
	 */
	this.clean = function() {
		this.context.clearRect(0, 0, this.environment.options.width
				* this.scale, this.environment.options.height * this.scale);
		this.context.fillStyle = "black";
		this.context.fillRect(0, 0,
				this.environment.options.width * this.scale,
				this.environment.options.height * this.scale);

	};

	/**
	 * Check for the height/width power of 2.
	 * @param aSize
	 * @returns {number}
	 */
	function nearestPow2(aSize) {
		return Math.pow(2, Math.round(Math.log(aSize) / Math.log(2)));
	}

};
