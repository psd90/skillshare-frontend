import React from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import axios from "axios";
import PropTypes from "prop-types";
import firebase from 'firebase'

class SkillCard extends React.Component {
  state = {
    desiredSkills: [],
    teachingSkills: [],
    image: 'https://transmitconsulting.co.uk/wp-content/uploads/male-placeholder-image.jpeg'
  };

  static propTypes = {
    id: PropTypes.number,
    person: PropTypes.object,
    uid: PropTypes.string,
    messageFunction: PropTypes.func,
    currentUserUid: PropTypes.string,
    currentUserUsername: PropTypes.string,
  };

  getCategories = () => {
    Promise.all([
      axios.get(
        `https://firebasing-testing.firebaseio.com/users_desired_skills.json?orderBy="$key"&equalTo="${this.props.uid}"`
      ),
      axios.get(
        `https://firebasing-testing.firebaseio.com/users_teaching_skills.json?orderBy="$key"&equalTo="${this.props.uid}"`
      ),
      firebase.storage().ref(`users/${this.props.uid}/profile.jpg`).getDownloadURL()
    ]).then((resArr) => {
      const image = resArr[2];
      resArr.pop()
      const dataArr = resArr.map((res) => res.data[Object.keys(res.data)[0]]);
      console.log(dataArr);
      const mappedDataArr = dataArr.map((obj) => Object.keys(obj));
      this.setState({
        desiredSkills: mappedDataArr[0],
        teachingSkills: mappedDataArr[1],
        image
      });
    });
  };

  componentDidMount() {
    this.getCategories();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.person !== this.props.person) {
      this.getCategories();
    }
  }

  render() {
    console.log(this.props.uid);
    const { name, location, username } = this.props.person;
    const { desiredSkills, teachingSkills, image } = this.state;
    return (
      <div className="search-result-card">
        <img className="profile-image" src={image} alt={name} />
        <div className="search-card-header">
          <h5 className="search-result-name">{name}</h5>
          <h6 className="search-result-location">{location.nuts}</h6>
        </div>
        <h6 className="search-result-teaching-skills-header">Skills</h6>
        <div className="search-result-teaching-skills">
          {teachingSkills.join(", ")}
        </div>
        <h6 className="search-result-desired-skills-header">Wants to Learn</h6>
        <div className="search-result-desired-skills">
          {desiredSkills.join(", ")}
        </div>
        <Link
          className="search-message-button-link"
          to={{
            pathname: `/${this.props.currentUserUsername}/messages`,
            state: {
              currentUserUid: this.props.currentUserUid,
              messagedUser: this.props.person,
              messagedUid: this.props.uid,
              directedFromMessage: true,
            },
          }}
        >
          <button className="search-message-button" id={this.props.uid}>
            Message
          </button>
        </Link>
        <Link
          className="search-view-more-button-link"
          to={`/profile/${username}`}
        >
          <button className="search-view-more-button">View more...</button>
        </Link>
      </div>
    );
  }
}

export default SkillCard;
