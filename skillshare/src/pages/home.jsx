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
    me: {}, // This prop is for creating the TalkJS user (which has different properties to currentUser)
    searchType: "skill",
    searchButtonText: "category",
    searchBySkillText: "",
    categories: [],
    selectedCategories: [],
    selectedSearchSkillType: "desired",
    results: [],
    hasSearched: false,
  };

  static contextType = AuthContext;

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
          <p className="searchInForm">OR</p>
          <label className="searchInForm" htmlFor="searchBar">
            <input
              onChange={this.handleChange}
              id="searchBySkillText"
              name="searchBar"
              type="text"
              placeholder="Enter Specific Skill"
            />
          </label>
          <p>I want to...</p>
          <lable>
            <input
              name="searchType"
              type="radio"
              value="teaching"
              id="selectedSearchSkillType"
              onClick={this.handleChange}
            ></input>
            Learn this skill
          </lable>
          <lable>
            <input
              name="searchType"
              type="radio"
              value="desired"
              id="selectedSearchSkillType"
              defaultChecked
              onClick={this.handleChange}
            ></input>
            Teach this skill
          </lable>
        </div>
      );
    } else {
      return (
        <>
          <h2>Categories</h2>
          {Object.keys(this.state.categories).map((category, index) => {
            return (
              <label key={index} htmlFor={category}>
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
          <p>I want to...</p>
          <lable>
            <input
              name="searchType"
              type="radio"
              value="teaching"
              id="selectedSearchSkillType"
              onClick={this.handleChange}
            ></input>
            Learn a skill
          </lable>
          <lable>
            <input
              name="searchType"
              type="radio"
              value="desired"
              id="selectedSearchSkillType"
              defaultChecked
              onClick={this.handleChange}
            ></input>
            Teach a skill
          </lable>
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
    ]).then((resArr) => {
      this.setState(
        {
          categories: resArr[0].data,
          currentUser: resArr[1].data,
        },
        () => {
          console.log(
            "Current user in home page state: ",
            this.state.currentUser
          );
        }
      );
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
        this.setState(
          {
            results: resArr.map((res) => res.data),
            hasSearched: true,
          },
          () => {
            console.log(this.state.results);
          }
        );
      });
    });
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
        />
      );
    });
  };

  render() {
    return (
      <>
        <Header />
        <div className="buffer"></div>
        <form className="searchTeachers" id="home-search-form" action="">
          <button
            className="searchByButton"
            onClick={this.toggleSearchType}
          >{`Search by ${this.state.searchButtonText}`}</button>
          {this.renderSearchFields()}
          <br />
          <br />
          <button className="searchButton" onClick={this.renderResults}>
            Search
          </button>
        </form>
        {this.renderCards()}
      </>
    );
  }
}

export default Home;

/* We want to start rendering these results with skill-cards. 
So we need to develop those skill cards */
