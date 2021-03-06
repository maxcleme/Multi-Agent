var Environment = function (options) {

  // Check options
  this.options = options;
  this.statObject = options.statObject;
  this.renderer = options.renderer;

  // Attributes
  this.population = [];
  this.positions = [];
  this.dijkstraGrid = [];
  this.freePlaces = [];
  this.agents = [];
  this.roundCount = 0;
  this.roundCountWithSuperPowerRemaining = 0;

  this.pressedDirections = {
    x: 0,
    y: 0
  };

  // Check if environment has changed, stop otherwise
  this.change = false;
  this.end = false;

  var that = this;

  /**
   * Initialize the map.
   */
  this.init = function () {
	if (this.options.fairnessSeed) {
		Math.seedrandom(this.options.fairnessSeed);
	}
    if (this.renderer) {
        this.renderer.init(that);
    }

    // Initialize the positions/population array.
    for (var x = 0; x < this.options.height; x++) {
      this.positions[x] = [];
      this.population[x] = [];
      for (var y = 0; y < this.options.width; y++) {
        // Positions
        var position = new Position(x, y);
        this.positions[x][y] = position;
        this.freePlaces.push(position);
        // Population
        this.population[x][y] = undefined;
      }
    }
  };

  /**
   * Populate the map according the agents options.
   */
  this.populate = function () {

    // Copy the description of actors given as options
    var actors = this.options.actors.slice(0);

    // Randomly fill the map
    while (actors.length > 0) {

      var randomRow = Math.floor((Math.random() * this.options.height));
      var randomCol = Math.floor((Math.random() * this.options.width));

      if (this.population[randomRow][randomCol] == undefined) {
		var colors = undefined;
        // Get the agent to create
        var Agent = actors[0].type;
		if (actors[0].randomColors && colors == undefined) {
			colors = generateColors(actors[0].count);
		}

        // Create new instance of the agent
        var newAgent = new Agent(that);
        var position = this.positions[randomRow][randomCol];
        newAgent.position = position;
		if (colors) {
			newAgent.color = colors[actors[0].count - 1];
		}

        // Update free places
        this.freePlaces.splice(this.freePlaces.indexOf(position), 1);

        // Add the agent to the agent list
        this.population[randomRow][randomCol] = newAgent;
        this.agents.push(newAgent);

        // Decrement the count
        actors[0].count--;

        // Delete the actor of the array if processed
        if (actors[0].count == 0) {
          actors.shift();
		  colors = undefined;
        }

      }
    }

    for (  i = 0 ; i < this.agents.length ; i++ ){
      if ( this.agents[i].init ){
        this.agents[i].init();
      }
    }
  };

  /**
   * Get the agent on the specified cell.
   * @param x the x position.
   * @param y the y position.
   * @returns the agent on the specified cell.
   */
  this.getAgent = function (x, y) {
    // Make sure that the cell exists (sphere)
    var height = options.height;
    var width = options.width;
    var torX = (height + x) % height;
    var torY = (width + y) % width;

    return this.population[torX][torY];
  };

  /**
   * Move the agent on the specified cell.
   * @param x the x position.
   * @param y the y position.
   * @returns {*}
   */
  this.moveAgent = function (agent, x, y) {
    if (agent.position.x != x || agent.position.y != y) {

      // Make sure that the cell exists (sphere)
      var height = options.height;
      var width = options.width;
      var torX = (height + x) % height;
      var torY = (width + y) % width;

      var torPosition = this.positions[torX][torY];
      var oldPosition = agent.position;

      // Update places
      this.population[oldPosition.x][oldPosition.y] = undefined;
      this.freePlaces.splice(this.freePlaces.indexOf(torPosition), 1);
      this.freePlaces.push(oldPosition);

      this.population[torX][torY] = agent;
      agent.position = torPosition;

      this.change = true;

    }
  };

  /**
   * Add the agent to the map.
   * @param agent the agent to add.
   */
  this.addAgent = function (agent, x, y) {
    agent.position = this.positions[x][y];
    this.population[agent.position.x][agent.position.y] = agent;
    this.freePlaces.splice(this.freePlaces.indexOf(agent.position), 1);
    this.agents.push(agent);
  }

  /**
   * Remove the agent of the environment.
   * @param agent
   */
  this.removeAgent = function (agent) {
    var index = this.agents.indexOf(agent);
    if (index > -1) {
      if (this.population[agent.position.x][agent.position.y] == agent) {
        this.population[agent.position.x][agent.position.y] = undefined;
      }
      this.freePlaces.push(agent.position);
      this.agents.splice(index, 1);
      this.change = true;
    }
  };

  /**
   * Update the environment by applying the actor comportment.
   */
  this.update = function (onStop) {

    this.change = false;

    if ( this.options.fairness )
    	this.agents = shuffleArray(this.agents);

    if (this.statObject) {
      this.statObject.reset();
    }

    if (this.renderer) {
      this.renderer.clean();
    }

    this.agents.forEach(function (agent) {

      agent.doIt();

      if (this.statObject) {
        this.statObject.statsFunction(agent);
      }

      if (this.renderer) {
        this.renderer.drawAgent(agent);
      }
    });

    if (this.options.dijkstraNumbering) {
      this.renderer.displayDijkstraNumbering();
    }

    if (this.options.mapConsole) {
      this.displayEnvironment();
    }

    if (this.statObject) {
      this.statObject.callback();
    }
    if ( this.end ){
      onStop();
    }else if ( !this.change ){
      onStop();
    }


    this.roundCount++;

  };

  this.randomPlace = function (agent,free) {
    if (agent) {
      switch (this.options.neighborhood) {
        case 0:
          return this.randomMoore(agent);
        case 1:
          return this.randomVonNeumann(agent);
        case 2:
          return this.randomFree(agent);
        default:
          return this.randomMoore(agent,free);
      }
    }
  };

  /**
   * Get random VonNeumann cell.
   * @param agent the agent of the cell
   * @returns position of the random cell.
   */
  this.randomVonNeumann = function (agent) {
    var random = function () {
      return Math.floor((Math.random() * 3)) - 1;
    };
    var randomRow = agent.position.x + random();
    var randomCol = agent.position.y + random();

    if (randomRow == agent.position.x && randomCol == agent.position.y) return this.randomVonNeumann(agent);
    return this.getPosition(randomRow, randomCol);
  };

  /**
   * Get random Moore cell.
   * @param agent the agent of the cell
   * @returns position of the random cell.
   */
  this.randomMoore = function (agent,free) {
    var random = Math.random();
    var newX = agent.position.x, newY = agent.position.y;
	var n = [];
	n.push(this.getPosition(newX+1, newY));
	n.push(this.getPosition(newX, newY+1));
	n.push(this.getPosition(newX-1, newY));
	n.push(this.getPosition(newX, newY-1));
	
	res = [];
	if (free) {
		for (var i in n) {
			if (n[i] && this.getAgent(n[i].x,n[i].y) == undefined) {
					res.push(n[i]);
			}
		}
	}
	else {
		res = n;
	}
	shuffleArray(res);
   return res[0];
  };

  /**
   * Get random free cell.
   * @param agent the agent of the cell
   * @returns coordinates of the random cell.
   */
  this.randomFree = function (agent) {
    return this.freePlaces[Math.floor(Math.random() * this.freePlaces.length)];
  };

  /**
   * Compute the Dijkstra grid from a position to an other.
   */
  this.computeDijkstraNumbering = function (positions, n) {

    var height = this.options.height;
    var width = this.options.width;

    var number = n;
    var toBrowsePositions = [];
    if (positions instanceof Position) {
      for (var x = 0; x < height; x++) {
        this.dijkstraGrid[x] = [];
        for (var y = 0; y < width; y++) {
          this.dijkstraGrid[x][y] = undefined;
        }
      }
      toBrowsePositions.push(positions);
      this.dijkstraGrid[positions.x][positions.y] = 0;
      number = 1;
    } else {
      toBrowsePositions = positions.slice(0);
    }

    var browsedPositions = [];
    toBrowsePositions.forEach(function (position) {
      that.browseNeighbour(position, function (browsedPosition) {
        var cell = that.dijkstraGrid[browsedPosition.x][browsedPosition.y];
        if (isNaN(cell)) {
          that.dijkstraGrid[browsedPosition.x][browsedPosition.y] = number;
          browsedPositions.push(browsedPosition);
        }
      }, true);

    });

    if (browsedPositions.length > 0) this.computeDijkstraNumbering(browsedPositions, number + 1);



    return this.dijkstraGrid;
  };

  /**
   * Get the position for given coordinates.
   * @param x the x coordinate.
   * @param y the y coordinate
   * @returns position
   */
  this.getPosition = function (x, y) {
    if (this.options.torWorld) {
      return this.getPositionTor(x, y);
    }
    return this.getPositionNormal(x, y);
  };

  /**
   * Get the TOR position for given coordinates.
   * @param x the x coordinate.
   * @param y the y coordinate
   * @returns position as Tor.
   */
  this.getPositionTor = function (x, y) {
    var height = this.options.height;
    var width = this.options.width;
    var newX = (height + x) % height;
    var newY = (width + y) % width;
    return this.positions[newX][newY];
  };

  /**
   * Get the normal position for given coordinates.
   * @param x the x coordinate.
   * @param y the y coordinate
   * @returns position if found, undefined otherwise.
   */
  this.getPositionNormal = function (x, y) {
    var height = this.options.height;
    var width = this.options.width;
    if (x >= height || x < 0 || y >= width || y < 0) {
      return undefined;
    }
    return this.positions[x][y];
  };

  /**
   * Find a path to the specified cell.
   * @param position the start position.
   * @param dposition the destination position.
   * @param free true to browse only free cell, false to browse all.
   * @returns Array.<Position> of position corresponding to the path.
   */
  this.findPathTo = function (position, dposition, free) {
    var minPosition = this.minNeighbour(position, free);
    if (dposition == minPosition) {
      return [position, dposition];
    }
    return [position].concat(this.findPathTo(minPosition, dposition));
  };

  /**
   * Browse the neighbour according [options.neighborhood].
   * @param position the position
   * @param coordinateFunction the coordinate function to call for each neighbour.
   * @param free true to browse only free neighbour, false to browse all.
   */
  this.browseNeighbour = function (position, coordinateFunction, free) {
    if (position) {
          return this.browseMooreNeighbour(position, coordinateFunction, free);
    }
  };

  /**
   * Browse the 8 neighbour (VonNeumann).
   * @param position the position
   * @param coordinateFunction the coordinate function to call for each neighbour.
   *  @param free true to browse only free neighbour, false to browse all.

   */
  this.browseVonNeighbour = function (position, coordinateFunction, free) {
    var x = position.x;
    var y = position.y;
    for (var i = x - 1; i <= x + 1; i++) {
      for (var j = y - 1; j <= y + 1; j++) {
        if (i != x || j != y) {
          var browsedPosition = this.getPosition(i, j);
          if (free && this.population[browsedPosition.x][browsedPosition.y]) continue;
          else if (browsedPosition && coordinateFunction(browsedPosition)) return;
        }
      }
    }
  };

  /**
   * Browse the 4 neighbour (Moore).
   * @param position the position
   * @param coordinateFunction the coordinate function to call for each neighbour.
   * @param free true to browse only free neighbour, false to browse all.
   */
  this.browseMooreNeighbour = function (position, coordinateFunction, free) {
    var x = position.x;
    var y = position.y;
    for (var i = -1; i <= 1; i++) {
      for (var j = -1; j <= 1; j++) {
        if (i !== j && (i + j) !== 0) {
          var browsedPosition = this.getPosition(x + i, y + j);
          if (browsedPosition && free && this.population[browsedPosition.x][browsedPosition.y]) continue;
          else if (browsedPosition && coordinateFunction(browsedPosition)) return;
        }
      }
    }
  };

  /**
   * Get the min dijkstra neighbour.
   * @param position the position from which the min has to be returned.
   * @return position the min position.
   * @param free true to browse only free neighbour, false to browse all.
   */
  this.minNeighbour = function (position, free) {
    var minNumber;
    var minPosition = [];
    this.browseNeighbour(position, function (position) {
      if (!minPosition.length || isNaN(minNumber) || minNumber >= that.dijkstraGrid[position.x][position.y]) {
        if (that.dijkstraGrid[position.x][position.y] == minNumber) {
          minPosition.push(position);
        } else {
          minPosition = [];
          minPosition.push(position);
        }
        minNumber = that.dijkstraGrid[position.x][position.y];
      }
    }, free);
    shuffleArray(minPosition);
    return minPosition[0];
  };

  this.maxNeighbour = function (fposition, free) {
    var maxNumber;
    var maxPosition = [];
    this.browseNeighbour(fposition, function (position) {
      if (!maxPosition.length || isNaN(maxNumber) || maxNumber <= that.dijkstraGrid[position.x][position.y]) {
        if (that.dijkstraGrid[position.x][position.y] == maxNumber) {
          maxPosition.push(position);
        } else {
          maxPosition = [];
          maxPosition.push(position);
        }
        maxNumber = that.dijkstraGrid[position.x][position.y];
      }
    }, free);
    shuffleArray(maxPosition);
    return maxPosition[0];
  };
  
  /**
   * Display the environment into the console.
   */
  this.displayEnvironment = function () {
    displayGrid(this.population, function (agent) {
      if (agent) return agent.type.charAt(0);
      return ' ';
    });
  };

  /**
   * Display the dijkstra grid.
   */
  this.displayDijkstra = function () {
    displayGrid(this.dijkstraGrid, function (element) {
      if (!isNaN(element)) return "" + element;
      return ' ';
    });
  };

  /**
   * Display the environment as text.
   */
  var displayGrid = function (grid, toDisplay) {
    var map = "";
	var qty = 0;
    for (var x = 0; x < grid.length; x++) {
      for (var y = 0; y < grid[x].length; y++) {
        var element = grid[x][grid.length - y - 1];
        map += '[';
        map += toDisplay(element);
        map += ']';
		if (toDisplay(element) != ' ') qty ++;
      }
      map += '\n';
    }
    console.log(map,qty);
  };

};

var Agent = function (type, color, env, shape) {
  this.type = type;
  this.color = color;
  this.environment = env;
  this.shape = shape || 'SQUARE';
};
Agent.prototype.doIt = function () {
};

var Position = function (x, y) {
  this.x = x;
  this.y = y;
}

function shuffleArray(o) {
  for (var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
  return o;
};

function randomVal(min, max) {
	return Math.floor(Math.random() * (max - min) + 1) + min;
}
function generateColors(nb) {
	var colors = [];
  for (var i = 0; i < nb; i++) {
	var hsl = 'hsl(' + randomVal(0, 360) + ', ' + randomVal(30, 95) + '%,  ' + randomVal(30, 80) + '%)';
	colors.push(hsl);
  }
  return colors;
}