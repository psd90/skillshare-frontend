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
import AddRating from "../components/AddRating";
import Stars from "../components/stars";
import Loader from "../components/Loader";

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
    addTeacherRating: false,
    addStudentRating: false,
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

            user.uid = userId;
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
                this.setState({ currentUser: res.data, userUid: userId });
              });
          });
      });
  }

  toggleAddTeacherRating = () => {
    this.setState({ addTeacherRating: !this.state.addTeacherRating });
  };

  toggleAddStudentRating = () => {
    this.setState({ addStudentRating: !this.state.addStudentRating });
  };

  addRatings = (teacherOrStudent, value) => {
    this.setState((prevState) => {
      const userCopy = { ...prevState.user };
      const ratingsCopy = { ...userCopy[teacherOrStudent] };
      userCopy[teacherOrStudent] = ratingsCopy;
      let newAmountofVotes = prevState.user[teacherOrStudent].total;
      let newAverage = prevState.user[teacherOrStudent].average;
      newAverage = newAverage * newAmountofVotes;
      newAmountofVotes += 1;
      newAverage += value;
      newAverage = newAverage / newAmountofVotes;
      userCopy[teacherOrStudent].total = newAmountofVotes;
      userCopy[teacherOrStudent].average = newAverage;
      return { user: userCopy };
    });
  };

  renderEditProfileButton = () => {
    if (this.state.user.username === this.state.currentUser.username) {
      return (
        <Link to="/editprofile">
          <div id="profile-add-friend-button-div">
            <button className="profile-add-friend-button">Edit Profile</button>
          </div>
        </Link>
      );
    }
  };


  renderSendMessageButton = () => {
    if (
      this.state.user.username !== this.state.currentUser.username &&
      this.state.currentUser.username
    ) {
      return (
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
      );
    }
  };

  updateUser = (userUid, user) => {
    let studentAverage;
    let teacherAverage;
    let studentVoteCounts;
    let teacherVoteCounts;
    if (!user.student_ratings) {
      studentAverage = 0;
      studentVoteCounts = 0;
    } else {
      studentAverage =
        user.student_ratings.reduce((a, b) => a + b, 0) /
        user.student_ratings.length;
      studentVoteCounts = user.student_ratings.length;
    }
    if (!user.teacher_ratings) {
      teacherAverage = 0;
      teacherVoteCounts = 0;
    } else {
      teacherAverage =
        user.teacher_ratings.reduce((a, b) => a + b, 0) /
        user.teacher_ratings.length;
      teacherVoteCounts = user.teacher_ratings.length;
    }
    user.student_ratings = {
      average: studentAverage,
      total: studentVoteCounts,
    };
    user.teacher_ratings = {
      average: teacherAverage,
      total: teacherVoteCounts,
    };
    const desiredSkills = axios.get(
      `https://firebasing-testing.firebaseio.com/users_desired_skills/${userUid}.json`
    );
    return Promise.all([user, desiredSkills])
      .then(([user, desiredSkills]) => {
        const teachingSkills = axios.get(
          `https://firebasing-testing.firebaseio.com/users_teaching_skills/${userUid}.json`
        );
        return Promise.all([user, desiredSkills.data, teachingSkills]);
      })
      .then(([user, desiredSkills, teachingSkills]) => {
        const skillCats = axios.get(
          `https://firebasing-testing.firebaseio.com/skills.json`
        );
        return Promise.all([user, desiredSkills, teachingSkills, skillCats]);
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
        user.uid = userUid;
        this.setState({
          user,
          desiredSkills,
          teachingSkills: teachingSkills.data,
          isLoading: false,
          userSkillCats,
        });
        firebase
          .storage()
          .ref(`users/${userUid}/profile.jpg`)
          .getDownloadURL()
          .then((imgUrl) => {
            this.setState({ image: imgUrl });
          });
      });
  };

  render() {

    const skillsetIcons = {
      Arts: faPalette,
      Coding: faLaptopCode,
      Cooking: faUtensils,
      Crafting: faHammer,
      Music: faMusic,
    };
    if (this.state.isLoading) return <Loader />;
    return (
      <div id="profile-page">
        <Header updateUser={this.updateUser} />
        <div className="bufferProfile"></div>
        {this.renderEditProfileButton()}

        <div id="brief-user-data">
          <div id="profile-image-div">
            <img
              id="profile-image"
              src={this.state.image}
              alt={`${this.state.user.name}'s Profile Picture`}
            />
          </div>
          <h3 className="username-profile">
            {this.state.user.name} (@{this.state.user.username}),{" "}
            {this.state.user.age}
          </h3>
          <div className="profile-user-location-div">
            <p id="profile-user-location">{this.state.user.location.nuts}</p>
          </div>
          <div id="about-me-div">
            <p>{this.state.user.info}</p>
            <div className="line2"></div>
          </div>
        </div>
        <div id="profile-ratings">
          <div id="profile-teacher-ratings">
            <h3 className="aboutprofile">TEACHER</h3>
            <div id="profile-teacher-stars">
              <Stars ratings={this.state.user.teacher_ratings.average} />
            </div>
            <p>({this.state.user.teacher_ratings.total} reviews)</p>
            <button
              className="addRatingToggle"
              onClick={this.toggleAddTeacherRating}
            >
              {this.state.addTeacherRating ? "▼ Add Rating" : "▶ Add Rating"}
            </button>
            {this.state.addTeacherRating ? (
              <AddRating
                userId={this.state.user.uid}
                ratingType="teacher_ratings"
                addRatings={this.addRatings}
              />
            ) : null}
          </div>
          <div id="profile-student-ratings">
            <h3 className="aboutprofile">STUDENT</h3>
            <div id="profile-student-stars">
              <Stars ratings={this.state.user.student_ratings.average} />
            </div>
            <p>({this.state.user.student_ratings.total} reviews)</p>
            <button
              className="addRatingToggle"
              onClick={this.toggleAddStudentRating}
            >
              {this.state.addStudentRating ? "▼ Add Rating" : "▶ Add Rating"}
            </button>
            {this.state.addStudentRating ? (
              <AddRating
                userId={this.state.user.uid}
                ratingType="student_ratings"
                addRatings={this.addRatings}
              />
            ) : null}
          </div>
        </div>
        <h2 id="myskillset">My Skillset</h2>
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
            <h3 className="aboutprofile">My Skills</h3>
            <ul id="teaching-skills-list">
              {Object.keys(this.state.teachingSkills).map((skill) => {
                return <p key={skill}>{skill}</p>;
              })}
            </ul>
          </div>
          <div id="desired-skills">
            <h3 className="aboutprofile">Desired Skills</h3>
            <ul id="desired-skills-list">
              {Object.keys(this.state.desiredSkills).map((skill) => {
                return <p key={skill}>{skill}</p>;
              })}
            </ul>
          </div>
        </div>
        {this.renderSendMessageButton()}
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
