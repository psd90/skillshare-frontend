import React, { Component } from "react";
import Talk from "talkjs";
import { AuthContext } from "../Auth";
import axios from "axios";
import PropTypes from "prop-types";

export default class Messages extends Component {
  state = {
    me: {},
  };
  static propTypes = {
    location: PropTypes.object,
  };

  talkjsContainer = React.createRef();

  static contextType = AuthContext;

  componentDidMount() {
    console.log("Messaged User: ", this.props.location.state.messagedUser);
    const {
      currentUserUid,
      directedFromMessage,
      messagedUser,
      messagedUid,
    } = this.props.location.state;
    console.log(this.props.location.state);
    axios
      .get(
        `https://firebasing-testing.firebaseio.com/users/${currentUserUid}.json`
      )
      .then((res) => {
        this.setState({ me: res.data }, () => {
          console.log("Me:", this.state.me);
        });
      })
      .then(() => {
        if (directedFromMessage) {
          const { name, email } = this.state.me;
          Talk.ready
            .then(() => {
              const me = new Talk.User({
                id: currentUserUid,
                name: name,
                email: email,
                photoUrl: "https://demo.talkjs.com/img/sebastian.jpg",
                welcomeMessage: "Hi! It's the currently logged in user!",
                role: "Admin",
              });
              const other = new Talk.User({
                id: messagedUid,
                name: messagedUser.name,
                email: messagedUser.email,
                photoUrl: "https://demo.talkjs.com/img/sebastian.jpg",
                welcomeMessage: "Hi! It's the other user",
                role: "Admin",
              });
              if (!window.talkSession) {
                window.talkSession = new Talk.Session({
                  appId: "tF07bX0H",
                  me: me,
                });
              }
              const conversationId = Talk.oneOnOneId(me, other);
              const conversation = window.talkSession.getOrCreateConversation(
                conversationId
              );
              conversation.setParticipant(me);
              conversation.setParticipant(other);
              var inbox = window.talkSession.createInbox({
                selected: conversation,
              });
              inbox.mount(this.talkjsContainer.current);
            })
            .catch((err) => {
              console.log(err);
            });
        }
      });
  }

  render() {
    return <div className="chatbox-container" ref={this.talkjsContainer}></div>;
  }
}
