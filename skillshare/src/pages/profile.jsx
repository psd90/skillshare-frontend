import React from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import axios from 'axios';
import PropTypes from 'prop-types';
import '../App.css'

class Profile extends React.Component{
    state= {
        user: {},
    }

    componentDidMount() {
        const { username } = this.props.match.params
        axios
        .get(`https://firebasing-testing.firebaseio.com/users/${username}.json`)
        .then((res) => {
            const studentAverage = res.data.student_ratings.reduce((a, b) => a + b, 0) / res.data.student_ratings.length;
            const teacherAverage = res.data.teacher_ratings.reduce((a, b) => a + b, 0) / res.data.teacher_ratings.length;
            const studentVoteCounts = res.data.student_ratings.length;
            const teacherVoteCounts = res.data.teacher_ratings.length; 
            res.data.student_ratings = studentAverage;
            res.data.teacher_ratings = teacherAverage;
            console.log(res.data)
          this.setState({user: res.data});
        });
    }

    render(){
        console.log(this.state)
        return(
            <div id="profile-page">
                <div id="brief-user-data">
                    <img id='profile-image' src={this.state.user.photoUrl} alt={`${this.state.user.name}'s Profile Picture`}/>
                    <p>@{this.props.match.params.username}</p>
                    <p>{this.state.user.name}</p>
                    <h2>About Me</h2>
                </div>
                <div id="profile-ratings">
                    <div id="profile-teacher-ratings">
                        <h3>TEACHER</h3>
                        <p>{this.state.user.teacher_ratings}</p>
                    </div>
                    <div id="profile-student-ratings">
                        <h3>STUDENT</h3>
                        <p>{this.state.user.student_ratings}</p>
                    </div>
                </div>
            </div>
        )
    }

    
}

Profile.propTypes = {
    match: PropTypes.shape({
        params: PropTypes.shape({
            username: PropTypes.node,
        }).isRequired
    }).isRequired
}

export default Profile