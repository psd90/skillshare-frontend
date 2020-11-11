import React from "react";
import axios from "axios";
import PropTypes from "prop-types";
import "../App.css";
import { Link } from "react-router-dom";
import ReactStars from "react-rating-stars-component";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPalette,
  faLaptopCode,
  faUtensils,
  faHammer,
  faMusic,
} from "@fortawesome/free-solid-svg-icons";
import firebase from "firebase";
import { AuthContext } from "../Auth";
import Header from "../components/header";

class Profile extends React.Component {
  state = {
    currentUser: {},
    isLoading: true,
    user: {},
    userUid: "",
    desiredSkills: {},
    teachingSkills: {},
    userSkillCats: [],
    image:
      "https://transmitconsulting.co.uk/wp-content/uploads/male-placeholder-image.jpeg",
  };

  static contextType = AuthContext;

  componentDidMount() {
    const { username } = this.props.match.params;
    let userId;
    axios
      .get(
        `https://firebasing-testing.firebaseio.com/usernames/${username}.json`
      )
      .then((uid) => {
        userId = uid.data;
        axios
          .get(`https://firebasing-testing.firebaseio.com/users/${userId}.json`)
          .then((res) => {
            let studentAverage;
            let teacherAverage;
            let studentVoteCounts;
            let teacherVoteCounts;
            if (!res.data.student_ratings) {
              studentAverage = 0;
              studentVoteCounts = 0;
            } else {
              studentAverage =
                res.data.student_ratings.reduce((a, b) => a + b, 0) /
                res.data.student_ratings.length;
              studentVoteCounts = res.data.student_ratings.length;
            }
            if (!res.data.teacher_ratings) {
              teacherAverage = 0;
              teacherVoteCounts = 0;
            } else {
              teacherAverage =
                res.data.teacher_ratings.reduce((a, b) => a + b, 0) /
                res.data.teacher_ratings.length;
              teacherVoteCounts = res.data.teacher_ratings.length;
            }
            res.data.student_ratings = {
              average: studentAverage,
              total: studentVoteCounts,
            };
            res.data.teacher_ratings = {
              average: teacherAverage,
              total: teacherVoteCounts,
            };
            return res.data;
          })
          .then((user) => {
            const desiredSkills = axios.get(
              `https://firebasing-testing.firebaseio.com/users_desired_skills/${userId}.json`
            );
            return Promise.all([user, desiredSkills]);
          })
          .then(([user, desiredSkills]) => {
            const teachingSkills = axios.get(
              `https://firebasing-testing.firebaseio.com/users_teaching_skills/${userId}.json`
            );
            return Promise.all([user, desiredSkills.data, teachingSkills]);
          })
          .then(([user, desiredSkills, teachingSkills]) => {
            const skillCats = axios.get(
              `https://firebasing-testing.firebaseio.com/skills.json`
            );
            return Promise.all([
              user,
              desiredSkills,
              teachingSkills,
              skillCats,
            ]);
          })
          .then(([user, desiredSkills, teachingSkills, skillCats]) => {
            const userSkillCats = [];
            Object.keys(teachingSkills.data).forEach((skill) => {
              Object.keys(skillCats.data).forEach((skillCat) => {
                if (Object.keys(skillCats.data[skillCat]).includes(skill)) {
                  if (!userSkillCats.includes(skillCat)) {
                    userSkillCats.push(skillCat);
                  }
                }
              });
            });
            this.setState({
              user,
              desiredSkills,
              teachingSkills: teachingSkills.data,
              isLoading: false,
              userSkillCats,
            });
            firebase
              .storage()
              .ref(`users/${userId}/profile.jpg`)
              .getDownloadURL()
              .then((imgUrl) => {
                this.setState({ image: imgUrl });
              });
          })
          .then(() => {
            axios
              .get(
                `https://firebasing-testing.firebaseio.com/users/${this.context.currentUser.uid}.json`
              )
              .then((res) => {
                this.setState(
                  { currentUser: res.data, userUid: userId },
                  () => {
                    console.log(this.state.userUid);
                    console.log(this.state.user);
                  }
                );
              });
          });
      });
  }

  render() {
    const skillsetIcons = {
      Arts: faPalette,
      Coding: faLaptopCode,
      Cooking: faUtensils,
      Crafting: faHammer,
      Music: faMusic,
    };
    if (this.state.isLoading) return <p>loading...</p>;
    return (
      <div id="profile-page">
        <Header />
        <div id="profile-add-friend-button-div">
          <button className="profile-add-friend-button">Add Friend</button>
        </div>
        <div id="brief-user-data">
          <div id="profile-image-div">
            <img
              id="profile-image"
              src={this.state.image}
              alt={`${this.state.user.name}'s Profile Picture`}
            />
          </div>
          <h3>
            {this.state.user.name} (@{this.state.user.username}),{" "}
            {this.state.user.age}
          </h3>
          <div className="profile-user-location-div">
            <p id="profile-user-location">{this.state.user.location.nuts}</p>
          </div>
          <div id="about-me-div">
            <h2>About Me</h2>
            <p>{this.state.user.info}</p>
          </div>
        </div>
        <div id="profile-ratings">
          <div id="profile-teacher-ratings">
            <h3>TEACHER</h3>
            <div id="profile-teacher-stars">
              <ReactStars
                count={5}
                value={this.state.user.teacher_ratings.average}
                edit={false}
                isHalf={true}
                color="lightgray"
                activeColor="orange"
                size={20}
              />
            </div>
            <p>({this.state.user.teacher_ratings.total} reviews)</p>
          </div>
          <div id="profile-student-ratings">
            <h3>STUDENT</h3>
            <div id="profile-student-stars">
              <ReactStars
                count={5}
                value={this.state.user.student_ratings.average}
                edit={false}
                isHalf={true}
                color="lightgray"
                activeColor="orange"
                size={20}
              />
            </div>
            <p>({this.state.user.student_ratings.total} reviews)</p>
          </div>
        </div>
        <h2>My Skillset</h2>
        <div id="skillseticons">
          {this.state.userSkillCats.map((skillCat) => {
            return (
              <FontAwesomeIcon
                className="skill-cat-icon"
                key={skillCat}
                icon={skillsetIcons[skillCat]}
              />
            );
          })}
        </div>
        <div id="skills-list">
          <div id="teaching-skills">
            <h3>My Skills</h3>
            <ul id="teaching-skills-list">
              {Object.keys(this.state.teachingSkills).map((skill) => {
                return <p key={skill}>{skill}</p>;
              })}
            </ul>
          </div>
          <div id="desired-skills">
            <h3>Desired Skills</h3>
            <ul id="desired-skills-list">
              {Object.keys(this.state.desiredSkills).map((skill) => {
                return <p key={skill}>{skill}</p>;
              })}
            </ul>
          </div>
        </div>
        <div id="profile-send-message-button-div">
          <Link
            to={{
              pathname: `/${this.state.currentUser.username}/messages`,
              state: {
                currentUserUid: this.context.currentUser.uid,
                messagedUser: this.state.user,
                messagedUid: this.state.userUid,
                directedFromMessage: true,
              },
            }}
          >
            <button className="profile-send-message-button">
              Send Message
            </button>
          </Link>
        </div>
      </div>
    );
  }
}

Profile.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      username: PropTypes.node,
    }).isRequired,
  }).isRequired,
};

export default Profile;
