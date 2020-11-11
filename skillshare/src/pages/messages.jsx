import React, { Component } from "react";
import Talk from "talkjs";
import { AuthContext } from "../Auth";
import axios from "axios";
import PropTypes from "prop-types";
import Header from "../components/header";

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
    if (!this.props.location.state) {
      this.props.location.state = {
        currentUserUid: this.context.currentUser.uid,
        messagedUser: null,
        messagedUid: null,
        directedFromMessage: false,
      };
    }
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
        return Talk.ready;
      })
      .then(() => {
        const { name, email } = this.state.me;
        const me = new Talk.User({
          id: currentUserUid,
          name: name,
          email: email,
          photoUrl: "https://demo.talkjs.com/img/sebastian.jpg",
          welcomeMessage: `Hi! It's ${name}!`,
          role: "Admin",
        });
        if (!window.talkSession) {
          window.talkSession = new Talk.Session({
            appId: "tF07bX0H",
            me: me,
          });
        }
        if (directedFromMessage) {
          const other = new Talk.User({
            id: messagedUid,
            name: messagedUser.name,
            email: messagedUser.email,
            photoUrl: "https://demo.talkjs.com/img/sebastian.jpg",
            welcomeMessage: `Hi! It's ${messagedUser.name}`,
            role: "Admin",
          });
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
        } else {
          var inbox = window.talkSession.createInbox();
          inbox.mount(this.talkjsContainer.current);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  destroySession = () => {
    window.talkSession.destroy();
  };

  render() {
    return (
      <>
        <Header destroySession={this.destroySession} />
        <div className="chatbox-container" ref={this.talkjsContainer}></div>
      </>
    );
  }
}
