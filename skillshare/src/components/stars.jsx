import React, { Component } from 'react';
import ReactStars from "react-rating-stars-component";
import PropTypes from "prop-types";

const Stars = (props) => {
    return  (<ReactStars
                key={props.ratings}
                count={5}
                value={props.ratings}
                edit={false}
                isHalf={true}
                color="lightgray"
                activeColor="#ffb498"
                size={20}
            />)
}

Stars.propTypes = {
    ratings: PropTypes.node
  };

export default Stars