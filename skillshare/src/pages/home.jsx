import React from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import axios from "axios";
import SkillCard from "../components/skill-cards";
import { object } from "prop-types";

class Home extends React.Component {
  state = {
    currentUser: "alex",
    searchType: "skill",
    searchButtonText: "category",
    searchBySkillText: "",
    categories: [],
    selectedCategories: [],
    selectedSearchSkillType: "desired",
    results: [],
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
        <label htmlFor="searchBar">
          Enter the skill you want to search for:
          <input
            onChange={this.updateSearchText}
            name="searchBar"
            type="text"
          />
        </label>
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
        </>
      );
    }
  };

  updateSearchText = (e) => {
    this.setState({ searchBySkillText: e.target.value });
  };

  toggleSelectedSkillSearchType = (e) => {
    const selectedSearchSkillType = e.target.value;
    this.setState({ selectedSearchSkillType });
  };

  toggleCategories = (e) => {
    const category = e.target.name;
    if (this.state.selectedCategories.includes(category)) {
      const indexOfCategory = this.state.selectedCategories.indexOf(category);
      this.state.selectedCategories.splice(indexOfCategory, 1);
    } else {
      this.state.selectedCategories.push(category);
    }
    console.log(
      `Currently selected category filters: ${this.state.selectedCategories}`
    );
  };

  componentDidMount() {
    axios
      .get("https://firebasing-testing.firebaseio.com/skills.json")
      .then((res) => {
        this.setState({ categories: res.data }, () => {
          console.log("the categories in state are:", this.state.categories);
        });
      });
  }

  renderResults = (e) => {
    e.preventDefault();
    let skillsArr = [];
    const skillPromises = [];
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
      skillPromises.push(
        axios.get(
          `https://firebasing-testing.firebaseio.com/${this.state.selectedSearchSkillType}_skills.json?orderBy="$key"&equalTo="${skill}"`
        )
      );
    });
    Promise.all(skillPromises).then((resArr) => {
      /*We now have the names of everyone who wants to learn the skills in the category selected in the search.
        Now we need to take their names (or keys) and find matching users in the user table to get the rest of their information. Again an individual call for each name is required*/
      const dataArr = resArr.map((res) => res.data);
      const userPromises = [];
      const names = [];
      dataArr.forEach((skill) => {
        for (const prop in skill) {
          names.push(...Object.keys(skill[prop]));
        }
      });
      var uniqueNames = names.filter((v, i, a) => a.indexOf(v) === i);
      uniqueNames.forEach((name) => {
        userPromises.push(
          axios.get(
            `https://firebasing-testing.firebaseio.com/users.json?orderBy="$key"&equalTo="${name}"`
          )
        );
      });
      // Now we have all of the users' data as an array, we need to render it on the page
      Promise.all(userPromises).then((resArr) => {
        this.setState({ results: resArr.map((res) => res.data) }, () => {
          console.log(this.state.results);
        });
      });
    });
  };

  renderCards = () => {
    return this.state.results.map((person, index) => {
      return (
        <SkillCard
          id={index}
          key={index}
          test={"test"}
          person={person[Object.keys(person)[0]]}
        />
      );
    });
  };

  render() {
    return (
      <>
        <form id="home-search-form" action="">
          <input
            name="searchType"
            type="radio"
            value="teaching"
            onClick={this.toggleSelectedSkillSearchType}
          ></input>
          Search people by skills they want to teach
          <br />
          <br />
          <input
            name="searchType"
            type="radio"
            value="desired"
            defaultChecked
            onClick={this.toggleSelectedSkillSearchType}
          ></input>
          Search people by skills they want to learn
          <br />
          <br />
          <button
            onClick={this.toggleSearchType}
          >{`Search by ${this.state.searchButtonText}`}</button>
          <br />
          {this.renderSearchFields()}
          <br />
          <br />
          <button onClick={this.renderResults}>Search</button>
        </form>
        {this.renderCards()}
      </>
    );
  }
}

export default Home;

/* We want to start rendering these results with skill-cards. 
So we need to develop those skill cards */
