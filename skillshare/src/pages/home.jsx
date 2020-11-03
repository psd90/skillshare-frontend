import React from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import axios from "axios";

class Home extends React.Component {
  state = {
    showFilters: true,
    categories: [],
    wantsCategories: [],
    teachCategories: [],
    results: [],
  };

  toggleFilters = (e) => {
    e.preventDefault();
    this.setState((previousState) => {
      return {
        showFilters: !previousState.showFilters,
      };
    });
  };

  renderFilters = () => {
    if (this.state.showFilters) {
      return (
        <>
          <h2>
            Search for people by their &quot;wants to learn&quot; skills by
            category
          </h2>
          {Object.keys(this.state.categories).map((category, index) => {
            return (
              <label key={index} htmlFor={category}>
                {category}
                <input
                  type="checkbox"
                  name={category}
                  className="wantsCategories"
                  onClick={this.toggleCategories}
                />
              </label>
            );
          })}
          <h2>
            Search for people by their &quot;can teach&quot; skills by category
          </h2>
          {Object.keys(this.state.categories).map((category, index) => {
            return (
              <label key={index} htmlFor={category}>
                {category}
                <input
                  type="checkbox"
                  name={category}
                  className="teachCategories"
                  onClick={this.toggleCategories}
                />
              </label>
            );
          })}
        </>
      );
    }
  };

  toggleCategories = (e) => {
    const filterType = e.target.className;
    const category = e.target.name;
    if (this.state[filterType].includes(category)) {
      const indexOfCategory = this.state[filterType].indexOf(category);
      this.state[filterType].splice(indexOfCategory, 1);
    } else {
      this.state[filterType].push(category);
    }
    console.log(
      `Currently selected ${filterType} filters: ${this.state[filterType]}`
    );
  };

  componentDidMount() {
    axios
      .get("https://firebasing-testing.firebaseio.com/skills.json")
      .then((res) => {
        this.setState({ categories: res.data });
      });
  }

  renderResults = () => {
    const { wantsCategories } = this.state;
    const categoriesQuery = axios.get(
      "https://firebasing-testing.firebaseio.com/skills.json"
    );
  };

  render() {
    return (
      <>
        <form action="">
          <label htmlFor="searchBar">
            Search:
            <input name="searchBar" type="text" />
          </label>
          <button onClick={this.toggleFilters}>Filter</button>
          {this.renderFilters()}
          <br />
          <br />
          <button onClick={this.renderResults}>Search</button>
        </form>
      </>
    );
  }
}

export default Home;
