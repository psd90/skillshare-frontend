import React, { useContext } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import axios from "axios";
import SkillCard from "../components/skill-cards";
import Header from "../components/header";
import Talk from "talkjs";
import { AuthContext } from "../Auth";

class Home extends React.Component {
  state = {
    currentUser: {}, //This prop takes the current user from auth context (see did mount function)
    currentUserDesiredSkills: {},
    currentUserTeachingSkills: {},
    me: {}, // This prop is for creating the TalkJS user (which has different properties to currentUser)
    searchType: "skill",
    searchButtonText: "category",
    searchBySkillText: "",
    categories: [],
    selectedCategories: [],
    selectedSearchSkillType: "desired",
    results: [],
    hasSearched: false,
    userLoc: { lat: 0, long: 0 },
    isLoading: true,
  };

  static contextType = AuthContext;

  calculateDistance = (lat1, lon1, lat2, lon2) => {
    function deg2rad(deg) {
      return deg * (Math.PI / 180);
    }

    var R = 3959; // Radius of the earth in miles
    var dLat = deg2rad(lat2 - lat1); // deg2rad below
    var dLon = deg2rad(lon2 - lon1);
    var a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) *
        Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c; // Distance in  miles
    return Math.round(d);
  };

  toggleSearchType = (e) => {
    e.preventDefault();
    this.setState((previousState) => {
      if (previousState.searchType === "skill") {
        return {
          searchType: "category",
          searchButtonText: "skill",
        };
      } else {
        return {
          searchType: "skill",
          searchButtonText: "category",
        };
      }
    });
  };

  renderSearchFields = () => {
    if (this.state.searchType === "skill") {
      return (
        <div id="searchInForm">
          <p id="or" className="searchInForm">
            OR
          </p>
          <label id="skill-input" className="searchInForm" htmlFor="searchBar">
            <input
              onChange={this.handleChange}
              id="searchBySkillText"
              name="searchBar"
              type="text"
              placeholder="Enter Specific Skill"
            />
          </label>
          <p id="i-want-to">I want to...</p>
          <label id="learn-skill-radio-label">
            <input
              name="searchType"
              type="radio"
              value="teaching"
              id="selectedSearchSkillType"
              onClick={this.handleChange}
            ></input>
            Learn this skill
          </label>
          <label id="teach-skill-radio-label">
            <input
              name="searchType"
              type="radio"
              value="desired"
              id="selectedSearchSkillType"
              defaultChecked
              onClick={this.handleChange}
            ></input>
            Teach this skill
          </label>
        </div>
      );
    } else {
      return (
        <>
          <div id="categories-container">
            <h3 id="categories-header">Categories</h3>
            {Object.keys(this.state.categories).map((category, index) => {
              return (
                <label
                  className="categoryCheckboxLabel"
                  key={index}
                  htmlFor={category}
                >
                  {category}
                  <input
                    type="checkbox"
                    name={category}
                    className="selectedCategories"
                    onClick={this.toggleCategories}
                  />
                </label>
              );
            })}
          </div>
          <div id="category-radio-flex">
            <p id="category-i-want-to">I want to...</p>
            <label id="category-learn-radio">
              <input
                name="searchType"
                type="radio"
                value="teaching"
                id="selectedSearchSkillType"
                onClick={this.handleChange}
              ></input>
              Learn a skill
            </label>
            <label id="category-teach-radio">
              <input
                name="searchType"
                type="radio"
                value="desired"
                id="selectedSearchSkillType"
                defaultChecked
                onClick={this.handleChange}
              ></input>
              Teach a skill
            </label>
          </div>
        </>
      );
    }
  };

  handleChange = (e) => {
    //this event is currently only assigned updating to search by desired skills or teaching skills,
    //and updating the current skill search text if searching by specific skill
    this.setState({ [e.target.id]: e.target.value });
  };

  toggleCategories = (e) => {
    const category = e.target.name;
    if (this.state.selectedCategories.includes(category)) {
      const indexOfCategory = this.state.selectedCategories.indexOf(category);
      this.state.selectedCategories.splice(indexOfCategory, 1);
    } else {
      this.state.selectedCategories.push(category);
    }
  };

  componentDidMount() {
    Promise.all([
      axios.get("https://firebasing-testing.firebaseio.com/skills.json"), // Call to get current categories
      axios.get(
        `https://firebasing-testing.firebaseio.com/users/${this.context.currentUser.uid}.json` // Call to get current user's information (as auth user only has uid and email)
      ),
      axios.get(
        `https://firebasing-testing.firebaseio.com/users_desired_skills/${this.context.currentUser.uid}.json`
      ),
      axios.get(
        `https://firebasing-testing.firebaseio.com/users_teaching_skills/${this.context.currentUser.uid}.json`
      ),
    ]).then((resArr) => {
      console.log(resArr[1].data);
      this.setState(
        {
          categories: resArr[0].data,
          currentUser: resArr[1].data,
          userLoc: {
            lat: resArr[1].data.location.latitude,
            long: resArr[1].data.location.longitude,
          },
          currentUserDesiredSkills: resArr[2].data,
          currentUserTeachingSkills: resArr[3].data,
        },
        () => {
          console.log("User location: ", this.state.userLoc);
        }
      );
      if (
        this.state.currentUserDesiredSkills &&
        this.state.currentUserTeachingSkills
      ) {
        const peopleWhoCanTeachWhatIWantToLearnPromises = [];
        Object.keys(this.state.currentUserDesiredSkills).forEach((skill) => {
          peopleWhoCanTeachWhatIWantToLearnPromises.push(
            axios.get(
              `https://firebasing-testing.firebaseio.com/teaching_skills/${skill}.json`
            )
          );
        });
        return Promise.all(peopleWhoCanTeachWhatIWantToLearnPromises)
          .then((resArr) => {
            const peopleWhoCanTeachWhatIWantToLearn = resArr
              .map((res) => res.data)
              .filter((people) => people);
            const peopleWhoWantToLearnWhatICanTeachPromises = [];
            Object.keys(this.state.currentUserTeachingSkills).forEach(
              (skill) => {
                peopleWhoWantToLearnWhatICanTeachPromises.push(
                  axios.get(
                    `https://firebasing-testing.firebaseio.com/desired_skills/${skill}.json`
                  )
                );
              }
            );
            peopleWhoWantToLearnWhatICanTeachPromises.push(
              peopleWhoCanTeachWhatIWantToLearn
            );
            return Promise.all(peopleWhoWantToLearnWhatICanTeachPromises);
          })
          .then((resArr) => {
            //Get a 1d array of unique uids of people who can teach what the current user wants to learn
            const peopleWhoCanTeachWhatIWantToLearn = resArr.pop();
            const flattenedPeopleWhoCanTeach = peopleWhoCanTeachWhatIWantToLearn
              .map((person) => Object.keys(person))
              .flat();
            const filteredPeopleWhoCanTeach = Array.from(
              new Set(flattenedPeopleWhoCanTeach)
            );

            //Get a 1d array of unique uids of people who want to learn what the current user can teach
            const peopleWhoWantToLearnWhatICanTeach = resArr
              .map((res) => res.data)
              .filter((people) => people);
            const flattenedPeopleWhoWantToLearn = peopleWhoWantToLearnWhatICanTeach
              .map((person) => Object.keys(person))
              .flat();
            const filteredPeopleWhoWantToLearn = Array.from(
              new Set(flattenedPeopleWhoWantToLearn)
            );

            const uidsOnBoth = filteredPeopleWhoCanTeach.filter((uid) =>
              filteredPeopleWhoWantToLearn.includes(uid)
            );

            const userPromises = uidsOnBoth.map((uid) =>
              axios.get(
                `https://firebasing-testing.firebaseio.com/users.json?orderBy="$key"&equalTo="${uid}"`
              )
            );
            Promise.all(userPromises).then((resArr) => {
              this.setState({
                results: resArr.map((res) => res.data),
                isLoading: false,
              });
            });
          });
      }
    });
  }

  renderResults = (e) => {
    e.preventDefault();
    let skillsArr = [];
    const skillsPromises = [];
    if (this.state.searchType === "category") {
      const { selectedCategories, categories } = this.state;
      /*Categories are saved in state - we need to access the skills in each category,
          and then make individual calls to the desired_skills node to find everyone who wants to learn the skills in that category */
      selectedCategories.forEach((category) => {
        skillsArr.push(...Object.keys(categories[category]));
      });
    } else {
      const { searchBySkillText, categories } = this.state;
      for (const prop in categories) {
        const categorySkills = Object.keys(categories[prop]);
        categorySkills.forEach((skill) => {
          if (skill.toLowerCase().includes(searchBySkillText.toLowerCase())) {
            skillsArr.push(skill);
          }
        });
      }
    }
    skillsArr.forEach((skill) => {
      skillsPromises.push(
        axios.get(
          `https://firebasing-testing.firebaseio.com/${this.state.selectedSearchSkillType}_skills.json?orderBy="$key"&equalTo="${skill}"`
        )
      );
    });
    Promise.all(skillsPromises).then((resArr) => {
      /*We now have the names of everyone who wants to learn the skills in the category selected in the search.
        Now we need to take their names (or keys) and find matching users in the user table to get the rest of their information. Again an individual call for each name is required*/
      const dataArr = resArr.map((res) => res.data);
      const userPromises = [];
      const uids = [];
      dataArr.forEach((skill) => {
        for (const prop in skill) {
          uids.push(...Object.keys(skill[prop]));
        }
      });
      var uniqueUids = uids.filter((v, i, a) => a.indexOf(v) === i);
      uniqueUids.forEach((uid) => {
        userPromises.push(
          axios.get(
            `https://firebasing-testing.firebaseio.com/users.json?orderBy="$key"&equalTo="${uid}"`
          )
        );
      });
      // Now we have all of the users' data as an array, we need to render it on the page
      Promise.all(userPromises).then((resArr) => {
        const unfilteredResults = resArr.map((res) => res.data);
        //filter out current user
        const filteredResults = unfilteredResults.filter(
          (result) => Object.keys(result)[0] !== this.context.currentUser.uid
        );
        const distancedResults = filteredResults.map((result) => {
          const uid = Object.keys(result)[0];
          const distanceFrom = this.calculateDistance(
            this.state.userLoc.lat,
            this.state.userLoc.long,
            result[uid].location.latitude,
            result[uid].location.longitude
          );
          result.distanceFromUser = distanceFrom;
          return result;
        });
        distancedResults.sort(
          (a, b) => a.distanceFromUser - b.distanceFromUser
        );
        this.setState(
          {
            results: distancedResults,
            hasSearched: true,
          },
          () => {
            console.log(this.state.results);
          }
        );
      });
    });
  };

  renderResultsTitle = () => {
    const { hasSearched, results, isLoading } = this.state;
    if (!hasSearched && results.length) {
      return (
        <>
          <h2 id="results-title">Your top matches</h2>
        </>
      );
    } else if (hasSearched && results.length) {
      return (
        <>
          <h2 id="results-title">Search Results</h2>
          <h4 id="results-sub-title">Sorted by those closest to you:</h4>
        </>
      );
    } else if (!hasSearched && !results.length && !isLoading) {
      return (
        <h3 id="results-title">
          Update your profile with skills you want to teach and learn to see
          automatic matches here!
        </h3>
      );
    }
  };

  renderCards = () => {
    if (!this.state.results.length && this.state.hasSearched) {
      return <div>No results found, please refine your search!</div>;
    }
    return this.state.results.map((person, index) => {
      return (
        <SkillCard
          id={index}
          key={index}
          person={person[Object.keys(person)[0]]}
          uid={Object.keys(person)[0]}
          currentUserUid={this.context.currentUser.uid}
          currentUserUsername={this.state.currentUser.username}
          distanceFromUser={person.distanceFromUser}
        />
      );
    });
  };

  render() {
    return (
      <>
        <Header />
        <form className="searchTeachers" id="home-search-form" action="">
          <button
            className="searchByButton"
            onClick={this.toggleSearchType}
          >{`Search by ${this.state.searchButtonText}`}</button>
          {this.renderSearchFields()}
          <button className="searchButton" onClick={this.renderResults}>
            Search
          </button>
        </form>
        {this.renderResultsTitle()}
        {this.renderCards()}
      </>
    );
  }
}

export default Home;
