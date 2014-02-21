var UCTK = 1.0;

var Tree = function(position, parent, move) {
	this.parent = parent;
	this.player = position.turn == 'X' ? 'O' : 'X';
	this.move = move;
	this.wins = 0;
	this.visits = 0;
	this.expanded = [];
	this.notExpanded = [];

	if(!position.IsEndGame()) {
		var board = position.board;
		var that = this;

		FIELDS.forEach(function(f) {
			if(board[f] == 'E')
				that.notExpanded.push(f);
		});
	}

	this.Expand = function(position) {
		var len = this.notExpanded.length;
		var i = Math.floor(Math.random() * len);
		var move = this.notExpanded[i];
		this.notExpanded.splice(i, 1);
		position.DoMove(move);
		var tree = new Tree(position, this, move);
		this.expanded.push(tree);
		return tree;
	};

	this.GetValue = function() {
		var value = this.wins / this.visits;
		var explorationBonus = UCTK * Math.sqrt(Math.log(this.parent.visits) / this.visits);
		value += explorationBonus;

		return value;
	};

	this.GetMeanValue = function() {
		var value = this.wins / this.visits;
		return value;		
	};
	
	this.Select = function() {
		var len = this.expanded.length;
		var selectedChild = null;
		var bestValue = -OO;
		for(var i = 0; i < len; ++i) {
			var child = this.expanded[i];
			var value = child.GetValue();
			if(bestValue < value) {
				bestValue = value;
				selectedChild = child
			}
		}

		return selectedChild;
	};

	this.BackPropagate = function(winner) {
		if(winner == 'E')
			this.wins += 0.5;
		else if(this.player == winner)
			this.wins += 1.0;
		else
			this.wins += 0.0;

		this.visits += 1;
	};

	this.IsLeaf = function() {
		return (this.expanded.length + this.notExpanded.length == 0);
	};

	this.IsFullyExapnded = function() {
		return (this.notExpanded.length == 0);
	};
};

var MAX_ITERATIONS = 100;

var MCTS = function(position) {
	var rootTree = new Tree(position, null, null);

	for(var i = 1; i <= MAX_ITERATIONS; ++i) {
		if(i%100 == 0)
			console.log('iteration = ' + i);
		var tree = rootTree;
		var tmpPosition = position.GetCopy();
		//Selection
		while(tree.IsFullyExapnded() && !tree.IsLeaf()) {
			tree = tree.Select();
			tmpPosition.DoMove(tree.move);
		}
		//Expansion
		if(!tree.IsLeaf()) {
			tree = tree.Expand(tmpPosition);
		}
		//playout
		while(!tmpPosition.IsEndGame()) {
			tmpPosition.DoMove(tmpPosition.GetRandomMove());
		}
		//backpropagation
		var winner = tmpPosition.winner;
		while(tree != null) {
			tree.BackPropagate(winner);
			tree = tree.parent;
		}
	}

	var selected = rootTree.Select();
	var bestMove = selected.move;
	var bestValue = selected.GetMeanValue();
	var bestVisits = selected.visits;

	return [bestMove, bestValue, bestVisits];
};
