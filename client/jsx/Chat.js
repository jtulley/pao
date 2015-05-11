var ChatMessage = React.createClass({displayName: "ChatMessage",
  render: function(){
    return(
      React.createElement("div", {className: "chat-message"}, 
        React.createElement("strong", {style: {color: this.props.color}}, this.props.player), ":", 
        React.createElement("br", null), 
        React.createElement("p", null, this.props.text)
      )
    );
  }
});

var Chat = React.createClass({displayName: "Chat",
  submitChat: function(e){
    e.preventDefault();
    var message = this.state.chatMessage;
    console.log("User sent chat message: " + this.state.chatMessage);
    !this.props.submitChat || this.props.submitChat(message);
    this.setState({chatMessage: null})
  },
  changeMessage: function(){
    var message = this.refs.chatInput.getDOMNode().value;
    this.setState({chatMessage: message});
  },
  render: function() {
    var messages = this.props.chats.map(function(message, i){
      return (React.createElement(ChatMessage, {key: i, player: message.player, text: message.text, color: message.color}));
    });
    return(
      React.createElement("div", {className: "chat"}, 
        React.createElement("div", {className: "chat-messages"}, 
          messages
        ), 
        React.createElement("form", {onSubmit: this.submitChat}, 
          React.createElement("input", {
            type: "text", 
            ref: "chatInput", 
            value: this.state.chatMessage, 
            onChange: this.changeMessage, 
            placeholder: "Type a chat message"})
        )
      )
    );
  },
  getInitialState: function() {
    return {
    };
  },
})
