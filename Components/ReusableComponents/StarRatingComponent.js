import React, { Component } from 'react';

import { Rating, AirbnbRating } from 'react-native-ratings';

export class StarRatingComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            starCount: 0,
        };
    }

    componentDidMount=()=>{
        this.props.rating ?
        this.setState({
            starCount: this.props.rating, 
        }): null
    }

    ratingCompleted(rating) {
        console.log("Rating is: " + rating);
        this.setState({
            starCount: rating, 
        })

        this.props.onFinishRating(rating);
    }
    swipeCompleted(rating) {
        console.log("Rating swipe: " + rating);
    }


    render() {
        return (
            <Rating
                imageSize={ this.props.imageSize == undefined ? 15: 40}
                jumpValue ={0.5}
                startingValue={Number(this.state.starCount)}
               // isDisabled = {this.props.isDisabled}
                readonly={this.props.readonly}
                //showRating
                onSwipeRating = {(rating)=>this.swipeCompleted(rating)}
                onFinishRating={(rating)=>this.ratingCompleted(rating)}
                style={{ 
                    alignSelf: 'flex-start',
                    //width: 100
                 }}
            />
        );
    }

}

