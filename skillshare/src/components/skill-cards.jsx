import React from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import axios from "axios";
import PropTypes from 'prop-types';

class SkillCard extends React.Component {
    state = {
        desiredSkills: [],
        teachingSkills: []
    }
    static propTypes = {
        test: PropTypes.string,
        id: PropTypes.number,
        person: PropTypes.object
    }
    componentDidMount(){
        // Promise.all to user desired skills and user teaching skills
        axios.get()
    }


    render () {
        const {name, location, photoUrl} = this.props.person
        return (
            <div className="search-result-card">
                <img className="profile-image" src={photoUrl} alt={name}/>
                <h3>{name}</h3>
                <h4>{location.nuts}</h4>

            </div>
        )
    }
}

export default SkillCard;