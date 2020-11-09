import Axios from "axios";
import React, { useContext } from "react";
import { AuthContext } from "../Auth";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import firebase from "firebase";
import Header from "../components/header";

class CreateProfile extends React.Component {
  state = {
    isLoading: true,
    skills: {},
    profile: {
      image: "",
      name: "",
      location: "",
      info: "",
    },
    teachingSkills: {},
    learningSkills: {},
  };

  static contextType = AuthContext;

  componentDidMount() {
    Axios.get("https://firebasing-testing.firebaseio.com/skills.json").then(
      (res) => {
        this.setState({ isLoading: false, skills: res.data });
      }
    );
  }

  changeImageFile = (event) => {
    this.setState((prevState) => {
      const newProfile = { ...prevState.profile };
      newProfile.image = event.target.files[0];
      return { profile: newProfile };
    });
  };

  handleSubmit = () => {
    const user = this;
    Axios.get(
      `https://api.postcodes.io/postcodes/${this.state.profile.location}`
    )
      .then((res) => {
        this.setState((prevState) => {
          const newProfile = { ...prevState.profile };
          newProfile.location = {
            latitude: res.data.result.latitude,
            longitude: res.data.result.longitude,
            nuts: res.data.result.nuts,
            postcode: res.data.result.postcode,
          };
          return { profile: newProfile };
        });
      })
      .then(() => {
        Axios.patch(
          `https://firebasing-testing.firebaseio.com/users/${user.context.currentUser.uid}.json`,
          {
            name: this.state.profile.name,
            location: this.state.profile.location,
            info: this.state.profile.info,
          }
        );
      })
      .then(() =>
        firebase
          .storage()
          .ref(`/users/${user.context.currentUser.uid}/profile.jpg`)
          .put(this.state.profile.image)
          .then(() => {
            Axios.patch(
              `https://firebasing-testing.firebaseio.com/users_teaching_skills/${user.context.currentUser.uid}.json`,
              this.state.teachingSkills
            );
          })
          .then(() => {
            const teachingPromises = Object.keys(this.state.teachingSkills).map(
              (skill) => {
                Axios.patch(
                  `https://firebasing-testing.firebaseio.com/teaching_skills/${skill}.json`,
                  { [user.context.currentUser.uid]: true }
                );
              }
            );
            Promise.all(teachingPromises)
              .then(() => {
                Axios.patch(
                  `https://firebasing-testing.firebaseio.com/users_desired_skills/${user.context.currentUser.uid}.json`,
                  this.state.learningSkills
                );
              })
              .then(() => {
                const learningPromises = Object.keys(
                  this.state.learningSkills
                ).map((skill) => {
                  Axios.patch(
                    `https://firebasing-testing.firebaseio.com/desired_skills/${skill}.json`,
                    { [user.context.currentUser.uid]: true }
                  );
                });
                Promise.all(learningPromises);
              });
          })
      );
  };

  handleChange = (event) => {
    console.log(this.state.profile);
    this.setState((prevState) => {
      const newProfile = { ...prevState.profile };
      newProfile[event.target.id] = event.target.value;
      return { profile: newProfile };
    });
  };

  addTeachingSkill = (event) => {
    this.setState((prevState) => {
      const newTeachingSkills = { ...prevState.teachingSkills };
      if (prevState.teachingSkills[event.target.value]) {
        delete newTeachingSkills[event.target.value];
        return { teachingSkills: newTeachingSkills };
      } else {
        newTeachingSkills[event.target.value] = true;
        return { teachingSkills: newTeachingSkills };
      }
    });
    console.log(this.state.teachingSkills);
  };

  addLearningSkill = (event) => {
    this.setState((prevState) => {
      const newLearningSkills = { ...prevState.learningSkills };
      if (prevState.learningSkills[event.target.value]) {
        delete newLearningSkills[event.target.value];
        return { learningSkills: newLearningSkills };
      } else {
        newLearningSkills[event.target.value] = true;
        return { learningSkills: newLearningSkills };
      }
    });
  };

  render() {
    if (this.state.isLoading) return <p>loading...</p>;
    else
      return (
        <>
          <Header className="testBackground"></Header>
          <div className="buffer"></div>
          <div id="create-profile-page">
            <h1 id="makeProfileHeading">Make Your Profile</h1>
            <div id="select-image-div">
              <img
                id="edit-profile-image"
                src="https://www.scrgrowthhub.co.uk/wp-content/uploads/placeholder-user-400x400-1.png"
              />
              <input
                id="chooseFile"
                type="file"
                onChange={this.changeImageFile}
              ></input>
            </div>
            <div id="name-location-bio-inputs">
              <p>
                <input
                  placeholder="Name"
                  id="name"
                  onChange={this.handleChange}
                  className="edit-profile-inputs"
                ></input>
              </p>
              <p>
                <input
                  placeholder="Location"
                  id="location"
                  onChange={this.handleChange}
                  className="edit-profile-inputs"
                ></input>
              </p>
              <p>
                <textarea
                  placeholder="About Me"
                  id="info"
                  onChange={this.handleChange}
                  className="edit-profile-inputs"
                ></textarea>
              </p>
            </div>
            <div className="edit-skills">
              <h2>What are your skills?</h2>
              <h3>Categories</h3>
              <div className="edit-skills-buttons">
                {Object.keys(this.state.skills).map((category) => {
                  return (
                    <>
                      <h4 value={category} key={category}>
                        {category}
                      </h4>
                      {Object.keys(this.state.skills[category]).map((skill) => {
                        return (
                          <button
                            value={skill}
                            key={skill}
                            onClick={this.addTeachingSkill}
                          >
                            {skill}
                          </button>
                        );
                      })}
                    </>
                  );
                })}
              </div>
              <div className="specific-skills-inputs">
                <p>
                  <input
                    placeholder="Other"
                    className="edit-profile-inputs specific-skill-other"
                  ></input>
                </p>
                <p>
                  <input
                    placeholder="Specific Skills"
                    className="edit-profile-inputs"
                  ></input>
                </p>
              </div>
            </div>
            <div className="edit-skills">
              <h2>What Skills Would You like to Learn?</h2>
              <h3>Categories</h3>
              <div className="edit-skills-buttons">
                {Object.keys(this.state.skills).map((category) => {
                  return (
                    <>
                      <h4 key={category}>{category}</h4>
                      {Object.keys(this.state.skills[category]).map((skill) => {
                        return (
                          <button
                            value={skill}
                            key={skill}
                            onClick={this.addLearningSkill}
                          >
                            {skill}
                          </button>
                        );
                      })}
                    </>
                  );
                })}
              </div>
              <div className="specific-skills-inputs">
                <p>
                  <label>
                    Other:{" "}
                    <input className="edit-profile-inputs specific-skill-other"></input>
                  </label>
                </p>
                <p>
                  <label>
                    Specific Skills:{" "}
                    <input className="edit-profile-inputs"></input>
                  </label>
                </p>
              </div>
            </div>
            <button onClick={this.handleSubmit} id="edit-complete-button">
              Complete
            </button>
          </div>
        </>
      );
  }
}

export default CreateProfile;
