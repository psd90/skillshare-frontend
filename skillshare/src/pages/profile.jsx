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
        isLoading: true,
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
            res.data.student_ratings = {average: studentAverage, total: studentVoteCounts};
            res.data.teacher_ratings = {average: teacherAverage, total: teacherVoteCounts};
            return res.data
        })
        .then(user => {
            const desiredSkills = axios.get(`https://firebasing-testing.firebaseio.com/users_desired_skills/${username}.json`)
            return Promise.all([user, desiredSkills])
        })
        .then(([user, desiredSkills]) => {
            const teachingSkills = axios.get(`https://firebasing-testing.firebaseio.com/users_teaching_skills/${username}.json`)
            return Promise.all([user, desiredSkills.data, teachingSkills ])
        })
        .then(([user, desiredSkills, teachingSkills]) => {
            this.setState({user, desiredSkills, teachingSkills: teachingSkills.data, isLoading: false})
        })
    }

    render(){
        if(this.state.isLoading) return (<p>loading...</p>)
        const teacherStars = [];
        const studentStars = [];
        let teacherRating = Math.round(this.state.user.teacher_ratings.average);
        let studentRating = Math.round(this.state.user.student_ratings.average);
        for (let i = 0; i < 5; i++) {
            if(teacherRating > 0) {
                teacherStars.push('★')
                teacherRating--;
            } else {
                teacherStars.push('☆')
            }
            if(studentRating > 0) {
                studentStars.push('★')
                studentRating--;
            } else {
                studentStars.push('☆')
            }
        }
        return(
            <div id="profile-page">
                <div id="profile-add-friend-button-div">
                    <button className="profile-add-friend-button">Add Friend</button>
                </div>
                <div id="brief-user-data">
                    <img id='profile-image' src={this.state.user.photoUrl} alt={`${this.state.user.name}'s Profile Picture`}/>
                    <p>@{this.props.match.params.username}</p>
                    <p>{this.state.user.name}</p>
                    <h2>About Me</h2>
                </div>
                <div id="profile-ratings">
                    <div id="profile-teacher-ratings">
                        <h3>TEACHER</h3>
                        <p className="profile-stars">{teacherStars}</p>
                        {/* <p>{this.state.user.teacher_ratings.average}</p> */}
                        ({this.state.user.teacher_ratings.total} reviews)
                    </div>
                    <div id="profile-student-ratings">
                        <h3>STUDENT</h3>
                        <p className="profile-stars">{studentStars}</p>
                        <p>({this.state.user.student_ratings.total} reviews)</p>
                    </div>  
                </div>
                <h2>My Skillset</h2>
                <div id="skills-list">
                    <div id ="teaching-skills">
                        <h3>My Skills</h3>
                        <ul id="teaching-skills-list">
                        {Object.keys(this.state.teachingSkills).map(skill => {
                            return <p key={skill}>{skill}</p>
                        })}
                        </ul>
                    </div>
                    <div id="desired-skills">
                        <h3>Desired Skills</h3>
                        <ul id = 'desired-skills-list'>
                        {Object.keys(this.state.desiredSkills).map(skill => {
                            return <p key={skill}>{skill}</p>
                        })}
                        </ul>
                    </div>
                </div>
                <div id="profile-send-message-button-div">
                    <button className="profile-send-message-button">Send Message</button>
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