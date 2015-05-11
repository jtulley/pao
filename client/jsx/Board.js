var Square = React.createClass({displayName: "Square",
  handleClick: function(e){
    var f = this.props.handleClick;
    var rank = this.props.rank;
    var file = this.props.file;
    !f||f({rank,file});
  },
  render: function() {
    var classes = [];
    classes.push('banqi-square');
    if (this.props.selected){
      classes.push('selected')
    }
    var type = NotationToCss[this.props.piece];
    if (type){
      classes.push(type);
    }
    classString = classes.reduce(function(p, c) { return p + " " + c});
    return(
    React.createElement("td", {className: classString, onClick: this.handleClick}, 
      this.props.children
    ));
  },
});

var Board = React.createClass({displayName: "Board",
  flipPiece: function(square){
    var files = 'ABCDEFGH';
    var move = '?'+files.charAt(square.file)+square.rank;
    console.log("Tried to flip piece at: " + square.rank+","+square.file);
    !this.props.sendMove || this.props.sendMove(move)
  },
  move: function(attacker, target){
    var files = 'ABCDEFGH';
    console.log("Tried to attack/move from: " + attacker.rank+"," +attacker.file
    + " to: " + target.rank+","+target.file);
    var move =  files.charAt(attacker.file) + attacker.rank + '>' +
                files.charAt(target.file) + target.rank;
    !this.props.sendMove || this.props.sendMove(move);
  },
  handleClick: function(clicked){
    var s = this.state.selected;
    var sp = s ? this.props.board[s.rank][s.file] : null;
    var cp = this.props.board[clicked.rank][clicked.file];
    if (s && s.rank == clicked.rank && s.file == clicked.file){
      if (this.props.myTurn && sp == '?'){
        this.flipPiece(clicked);
      }
      this.setState({selected: null});
    }
    else{ if (s && this.IOwn(s) && this.props.myTurn){
      this.move(s, clicked);
      this.setState({selected: null});
    } else{
        this.setState({selected: clicked});
      }
    }
  },
  render: function(){
    var current = this.state.selected;
    var comp = this;
    var rowElements = this.props.board.map(function(row, rank){
      var squares = row.map(function(square, file){
        return (
          React.createElement(Square, {
            handleClick: comp.handleClick, 
            piece: square, 
            selected: current && current.rank == rank && current.file == file, 
            rank: rank, 
            file: file, 
            key: (rank+file)*(rank+file+1)/2 + file
            }
          ));
        }
      );
      return (React.createElement("tr", null, squares));
    });
    return (
      React.createElement("table", {className: "banqi-board"}, 
        rowElements
      )
    )
  },
  getInitialState: function() {
    return {
      selected : null,
    };
  },
  IOwn : function(square){
    switch (this.props.board[square.rank][square.file]) {
      case 'K':
      case 'G':
      case 'E':
      case 'C':
      case 'H':
      case 'P':
      case 'Q':
        return this.props.myColor == 'black';
        break;
      case 'k':
      case 'g':
      case 'e':
      case 'c':
      case 'h':
      case 'p':
      case 'q':
        return this.props.myColor == 'red';
        break;
      default:
        return undefined;
    }
  }
});

NotationToCss = {
  'K' : 'black-king',
  'G' : 'black-guard',
  'E' : 'black-elephant',
  'C' : 'black-cart',
  'H' : 'black-horse',
  'P' : 'black-pawn',
  'Q' : 'black-cannon',
  'k' : 'red-king',
  'g' : 'red-guard',
  'e' : 'red-elephant',
  'c' : 'red-cart',
  'h' : 'red-horse',
  'p' : 'red-pawn',
  'q' : 'red-cannon',
  '?' : 'unflipped-piece'
}
