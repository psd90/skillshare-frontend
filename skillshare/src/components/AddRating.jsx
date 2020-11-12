import Axios from 'axios';
import React from 'react';
import ReactStars from "react-rating-stars-component";
import PropTypes from "prop-types";
import { AuthContext } from "../Auth";

class AddRating extends React.Component {
    state = {
        isLoading: false,
        value: null,
        hasAlreadyTeacherRated: false,
        hasAlreadyStudentRated: false,
        hasVoted: false,
        hasVotedMessage: "you have already voted"
    };

    static contextType = AuthContext;

    componentDidMount() {
        Axios.get(`https://firebasing-testing.firebaseio.com/users/${this.context.currentUser.uid}/users_given_${this.props.ratingType}.json`)
        .then(res => {
            if(res.data) {
                if(this.props.ratingType === 'student_ratings') {
                    if(Object.keys(res.data).includes(this.props.userId)) {
                        this.setState({hasAlreadyStudentRated: true, hasVoted: true})
                    }
                } else if(this.props.ratingType === 'teacher_ratings') {
                    if(Object.keys(res.data).includes(this.props.userId)) {
                        this.setState({hasAlreadyTeacherRated: true, hasVoted: true})
                    }
                }
            }
        })
    }

    setValue = (newValue) => {
        this.setState({value: newValue}, () => {
            `https://firebasing-testing.firebaseio.com/users/${this.props.userId}/${this.props.ratingType}.json`
        })
    }

    submitRating = () => {
        this.props.addRatings(this.props.ratingType, this.state.value)
        Axios.get(`https://firebasing-testing.firebaseio.com/users/${this.props.userId}/${this.props.ratingType}.json`)
        .then(ratings => {
            if(!ratings.data) {
                Axios.put(`https://firebasing-testing.firebaseio.com/users/${this.props.userId}/${this.props.ratingType}.json`, [this.state.value])
            } else {
                const newRatings = ratings.data
                newRatings.push(this.state.value);
                Axios.put(`https://firebasing-testing.firebaseio.com/users/${this.props.userId}/${this.props.ratingType}.json`, newRatings)
            }
            
        })
        .then(() => {
            Axios.put(`https://firebasing-testing.firebaseio.com/users/${this.context.currentUser.uid}/users_given_${this.props.ratingType}/${this.props.userId}.json`, true)
        })
        .then(() => {
            this.setState(() => {
                if(this.props.ratingType === 'student_ratings') {
                    this.setState({hasAlreadyStudentRated: true, hasVoted: true, hasVotedMessage: "your vote has been submitted"})
                } else if(this.props.ratingType === 'teacher_ratings'){
                    this.setState({hasAlreadyTeacherRated: true, hasVoted: true, hasVotedMessage:"your vote has been submitted"})
                }
            })
        })     
    }

    render() {
        return this.state.hasVoted ? <p>{this.state.hasVotedMessage}</p> : (
            <div className="add-rating-div">
            <ReactStars
                count={5}
                value={0}
                color="lightgray"
                activeColor="#ffb498"
                size={20}
                onChange = {this.setValue}
              />
              <button className="add-rating-div-button" onClick={this.submitRating} disabled={this.state.hasAlreadyTeacherRated ? true : this.state.hasAlreadyStudentRated ? true : false}>Submit Rating</button>
              </div>
        )
    }
}

AddRating.propTypes = {
    userId: PropTypes.node,
    ratingType: PropTypes.node,
    addRatings: PropTypes.node
  };

export default AddRating