import React, { Component } from 'react';
import { TouchableOpacity, Text } from 'react-native';
import font from '../../Styles/font';
import color from '../../Styles/color';
import button from '../../Styles/button';
export default class ButtonLocation extends Component {

  constructor() {
    super();

    this.state = {
      clicked: false,
    }
  }

  handleClick= ()=>{
    this.setState({
      clicked: !this.state.clicked,
    }, this.props.onPress);
  }

  componentDidMount=()=>{
    this.setState({
      clicked: this.props.clicked,
    })
  }


  render() {
    return (
      <TouchableOpacity style={this.props.style}
        onPress={this.handleClick}>
        <Text 
        style= { this.props.from == "location"? 
        this.props.locationStyle: 
        (!this.state.clicked ? 
         [this.props.buttonNotClickStyle, {flex: 1, justifyContent: "center"}] : 
       [this.props.buttonClickStyle, {flex: 1, justifyContent: "center"}])}>{this.props.item}</Text>
      </TouchableOpacity>
    );
  }
}