import React, { Component } from 'react';
import ReactStars from "react-rating-stars-component";
import PropTypes from "prop-types";

class Stars extends React.Component {

    state = {
        isLoading: false,
        averageRating: this.props.ratings
    };

    componentDidUpdate(prevProps) {
        if(prevProps.ratings !== this.props.ratings) {
            this.setState({isLoading: true}, ()  => {
                this.setState({averageRating : this.props.ratings, isLoading: false})
            })
        }
    }

    render() { 
       return this.state.isLoading ? <p>loading Stars</p> :
            <ReactStars
                count={5}
                value={this.props.ratings}
                edit={false}
                isHalf={true}
                color="lightgray"
                activeColor="#ffb498"
                size={20}
            />
    }  
}

Stars.propTypes = {
    ratings: PropTypes.node
  };

export default Stars