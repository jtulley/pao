var Lobby = React.createClass({displayName: "Lobby",
  joinNew: function(){
    React.render(
      React.createElement(Game, {name: this.state.name}),
      document.getElementById('game')
    );
  },
  join: function(id){
    React.render(
      React.createElement(Game, {name: this.state.name, id: id}),
      document.getElementById('game')
    );
  },
  nameChanged: function(){
    var name = this.refs.name.getDOMNode().value;
    this.setState({name});
  },
  render: function(){
    var comp = this;
    var games = this.state.games.map(function(g) {
        return React.createElement(LobbyGame, {id: g.ID, players: g.Players, 
          onClick: function(){comp.join(g.ID)}})
      });
    var gameCount = games ? games.length : 0;
    return (
      React.createElement("div", {className: "lobby"}, 
        React.createElement("h2", null, "Pao Lobby"), 
        React.createElement("input", {type: "text", ref: "name", value: this.state.name, onChange: this.nameChanged, placeholder: "Your Name"}), 
        React.createElement("div", {className: "lobby-current-games"}, 
          React.createElement("h3", null, gameCount, " Current Games"), 
          React.createElement("ul", {className: "games"}, 
            games
          )
        ), 
        React.createElement("button", {onClick: this.joinNew}, "Join New Game")
      )
    )
  },
  Reload: function(){
    var comp = this;
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
      if (xhr.readyState==4 && xhr.status == 200){
        var data = JSON.parse(xhr.responseText)
        comp.setState({games: data});
      }
    }
    xhr.open("GET", "/listGames", true);
    xhr.send();
  },
  componentDidMount: function() {
    var comp = this;
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
      if (xhr.readyState==4 && xhr.status == 200){
        var data = JSON.parse(xhr.responseText)
        if (data){
          comp.setState({games: data});
        }
      }
    }
    xhr.open("GET", "/listGames", true);
    xhr.send();
  },
  getInitialState: function() {
    return {
      name: null,
      games: []
    };
  },
});

var LobbyGame = React.createClass({displayName: "LobbyGame",
  render: function() {
    var playerList = this.props.players.map(function(player){
      return (React.createElement("li", {className: "player"}, player));
    });
    return (
      React.createElement("div", {className: "lobby-game", onClick: this.props.onClick}, 
        React.createElement("div", {className: "banqi-square red-cannon"}), 
        React.createElement("p", null, "Current Players:"), 
        React.createElement("ul", null, playerList)
      ));
  },
});

setTimeout(function() {
  React.render(
    React.createElement(Lobby, null),
    document.getElementById('lobby')
  );
}, 1);
