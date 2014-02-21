var FIELDS = ['11', '12', '13',  '21', '22', '23', '31', '32', '33'];

var Position = function() {
	this.Init = function() {
		this.board = {};
		var that = this;
		FIELDS.forEach(function(f) {
			that.board[f] = 'E';
		});
		this.turn = 'X';
		this.winner = 'E';
		this.moves = 0;
	}

	this.Init();

	this.SwapPlayer = function() {
		if(this.turn == 'X')
			this.turn = 'O';
		else
			this.turn = 'X';
	};

	this.DoMove = function(move) {
		this.board[move] = this.turn;
		this.SwapPlayer();
		this.moves += 1;
	};

	this.UndoMove = function(move) {
		this.board[move] = 'E';
		this.SwapPlayer();
		this.moves -= 1;
	};

	this.IsEmpty = function(f) {
		return (this.board[f] == 'E');
	};

	this.IsEndGame = function() {
		var board = this.board;
		var winner = 'E';
		//rows
		if(board['11'] != 'E' && board['11'] == board['12'] && board['12'] == board['13'])
			winner = board['11'];
		else if(board['21'] != 'E' && board['21'] == board['22'] && board['22'] == board['23'])
			winner = board['21'];
		else if(board['31'] != 'E' && board['31'] == board['32'] && board['32'] == board['33'])
			winner = board['31'];
		//columns
		else if(board['11'] != 'E' && board['11'] == board['21'] && board['11'] == board['31'])
			winner = board['11'];
		else if(board['12'] != 'E' && board['12'] == board['22'] && board['12'] == board['32'])
			winner = board['12'];
		else if(board['13'] != 'E' && board['13'] == board['23'] && board['13'] == board['33'])
			winner = board['13'];
		//first diagonale
		else if(board['11'] != 'E' && board['11'] == board['22'] && board['11'] == board['33'])
			winner = board['11'];
		//second diagonale
		else if(board['13'] != 'E' && board['13'] == board['22'] && board['13'] == board['31'])
			winner = board['13'];

		this.winner = winner;

		if(this.winner != 'E')
			return true;
		else if (this.moves == 9)
			return true;
		else
			return false;
	};

	this.GetRandomMove = function() {
		var choices = [];
		var that = this;
		FIELDS.forEach(function(f) {
			if(that.board[f] == 'E') {
				choices.push(f);
			}
		});
		var i = Math.floor(Math.random() * choices.length);
		var res = choices[i];
		return res;
	};

	this.GetCopy = function() {
		var res = new Position();
		var that = this;
		FIELDS.forEach(function(f) {
			res.board[f] = that.board[f];
		});
		res.turn = this.turn;
		res.winner = this.winner;
		res.moves = this.moves;
		
		return res;
	};

	this.Evaluate = function() {
		var evalx = 0.0;
		var evalo = 0.0;
		var nx, no, ne;
		//lines
		for(var i = 0; i < 3; ++i) {
			nx = 0;
			no = 0;
			ne = 0;
			for(var j = 0; j < 3; ++j) {
				var f = i + '' + j;
				if(this.board[f] == 'X')
					++nx;
				else if(this.board[f] == 'O')
					++no;
				else
					++ne;
			}
			if(nx + ne == 3) evalx += Math.pow(0.5, ne);
			if(no + ne == 3) evalo += Math.pow(0.5, ne);
		}
		//columns
		for(var i = 0; i < 3; ++i) {
			nx = 0;
			no = 0;
			ne = 0;
			for(var j = 0; j < 3; ++j) {
				var f = j + '' + i;
				if(this.board[f] == 'X')
					++nx;
				else if(this.board[f] == 'O')
					++no;
				else
					++ne;
			}
			if(nx + ne == 3) evalx += Math.pow(0.5, ne);
			if(no + ne == 3) evalo += Math.pow(0.5, ne);
		}
		//first diagonal
		nx = 0;
		no = 0;
		ne = 0;
		//11
		if(this.board['11'] == 'X')
			++nx;
		else if(this.board['11'] == 'O')
			++no;
		else
			++ne;
		//22
		if(this.board['22'] == 'X')
			++nx;
		else if(this.board['22'] == 'O')
			++no;
		else
			++ne;
		//33
		if(this.board['33'] == 'X')
			++nx;
		else if(this.board['33'] == 'O')
			++no;
		else
			++ne;
		if(nx + ne == 3) evalx += Math.pow(0.5, ne);
		if(no + ne == 3) evalo += Math.pow(0.5, ne);
		//second diagonal
		nx = 0;
		no = 0;
		ne = 0;
		//13
		if(this.board['13'] == 'X')
			++nx;
		else if(this.board['13'] == 'O')
			++no;
		else
			++ne;
		//22
		if(this.board['22'] == 'X')
			++nx;
		else if(this.board['22'] == 'O')
			++no;
		else
			++ne;
		//31
		if(this.board['31'] == 'X')
			++nx;
		else if(this.board['31'] == 'O')
			++no;
		else
			++ne;
		if(nx + ne == 3) evalx += Math.pow(0.5, ne);
		if(no + ne == 3) evalo += Math.pow(0.5, ne);
		
		var eval = evalx - evalo;
		if(this.turn == 'O')
			eval *= -1;

		return eval;
	};
};
