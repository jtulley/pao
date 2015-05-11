var Game = React.createClass({displayName: "Game",
  render: function(){
    return(
     React.createElement("div", null, 
       React.createElement(GameState, {myTurn: this.state.myTurn, 
                  gameOver: this.state.gameOver, 
                  won: this.state.won, 
                  myColor: this.state.myColor}), 
       React.createElement(Board, {
          board: this.state.board, myTurn: this.state.myTurn, 
          sendMove: this.sendMove, 
          myColor: this.state.myColor}), 
       React.createElement(Chat, {submitChat: this.submitChat, chats: this.state.chats}), 
      React.createElement("button", {className: "goBackButton"}, React.createElement("a", {href: "/"}, "Go back to lobby"))
     )
    )
  },
  sendMove: function(move){
    // sends a ban chi formatted move
    // game will update us if it was valid
    if (this.ws){
      var command = {Action: "move", Argument: move};
      this.ws.send(JSON.stringify(command));
    }
  },
  submitChat: function(text){
    if (this.ws){
      var chat = {Action: "chat", Argument: text};
      this.ws.send(JSON.stringify(chat));
    }
  },
  componentDidMount: function() {
    this.connect();
    this.ws.onopen = this.askForBoard
    React.unmountComponentAtNode(document.getElementById('lobby'));
  },
  connect: function(){
    var params = {name: this.props.name, id: this.props.id}
    var addr = "ws://" +
          document.location.host +
          "/game?";
    for (var key in params){
      if (params.hasOwnProperty(key) && params[key]){
        addr += key + "=" + params[key] + "&"
      }
    }

    var ws = new WebSocket(addr);
    ws.onmessage = this.handleMessage
    this.ws = ws;
  },
  askForBoard: function(){
    if (this.ws){
      var command = {Action: 'board?'};
      this.ws.send(JSON.stringify(command));
    }
  },
  handleMessage: function(wsMsg){
    if (!wsMsg || !wsMsg.data) {
      return;
    }
    var data = JSON.parse(wsMsg.data)
    switch (data.Action){
      case 'chat':
        this.handleChat(data);
        break;
      case 'board':
        this.handleBoard(data);
        break;
      case 'color':
        this.handleColor(data);
        break;
      case 'gameover':
        this.handleGameOver(data);
        break;
      default:
        console.log("I don't know what to do with this...");
        console.log(data);
    }
  },
  handleBoard: function(boardCommand){
    this.setState({board: boardCommand.Board, myTurn: boardCommand.YourTurn})
  },
  handleChat: function(chatCommand){
    var chats = this.state.chats;
    chats.push({player: chatCommand.Player, text: chatCommand.Message, color: chatCommand.Color})
    this.setState({chats});
  },
  handleColor: function(colorCommand){
    var myColor = colorCommand.Color;
    this.setState({myColor})
  },
  handleGameOver: function(gameOverCommand){
    this.setState({myTurn: false, gameOver: true, won: gameOverCommand.YouWin});
  },
  getInitialState: function() {
    return {
      chats:[],
      board:
      [['.','.','.','.','.','.','.','.',],
      ['.','.','.','.','.','.','.','.',],
      ['.','.','.','.','.','.','.','.',],
      ['.','.','.','.','.','.','.','.',]],
      myTurn:false,
      myColor: null
    };
  },
});

var GameState= React.createClass({displayName: "GameState",
  render: function(){
    var headers = []
    if (this.props.gameOver){
      headers.push(React.createElement("h2", {className: "game-info-header"}, "Game Over"));
      if (this.props.won){
        headers.push(React.createElement("h3", {className: "game-info-subheader"}, "You win!"))
      }
      else {
        headers.push(React.createElement("h3", {className: "game-info-subheader"}, "You lose."))
      }
    }
    else if (this.props.myTurn) {
      headers.push(React.createElement("h2", null, "Your Turn"))
    } else {
      headers.push(React.createElement("h2", null, "Opponent's Turn"))
    }
    var cannon;
    if (this.props.myColor == "red"){
      cannon = React.createElement("div", {className: "banner-piece banqi-square red-cannon"})
    } else {
      cannon = React.createElement("div", {className: "banner-piece banqi-square black-cannon"})
    }
    return (
      React.createElement("div", {className: "game-state-banner"}, 
        cannon, 
        React.createElement("div", {className: "headers"}, 
          headers
        ), 
        cannon
      )
    )
  }
});

// React.render(
//   React.createElement(Game, null),
//   document.getElementById('game')
// );
