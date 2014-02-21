var OO = 1000;
var nodes = 0;

var AlphaBeta = function(position, depth, alpha, beta, first) {
	if(first) {
		nodes = 0;
	}

	if(position.IsEndGame()) {
		++nodes;
		if (position.winner == 'E')
			return 0;
		else
			return -OO /*position.moves*/;
	}

	if(depth == 0) {
		++nodes;
		return position.Evaluate();
	}

	var moves = ['11', '12', '13',  '21', '22', '23', '31', '32', '33'];
	var bestValue = -OO;
	var bestMove = null;
	var found = false;
	for(var i = 0; i < 9; ++i) {
		var move = moves[i];
		if(position.IsEmpty(move)) {
			found = true;
			position.DoMove(move);
			value = -AlphaBeta(position, depth-1, -beta, -alpha, false);
			position.UndoMove(move);
			if(bestValue < value) {
				bestValue = value;
				bestMove = move;
			}
			/*
			if(alpha < bestValue) {
				alpha = bestValue;
			}
			*/

			if(bestValue >= beta) {
				break;
			}

		}
	}

	if(!found)
		console.log('No moves found please check IsEndGame function!');

	if(first)
		return [bestMove, bestValue, nodes];
	else
		return bestValue;
};
