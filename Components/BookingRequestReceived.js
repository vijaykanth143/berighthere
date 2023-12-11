import React, {Component} from 'react';
import {View, Text, TouchableOpacity, BackHandler, Image} from 'react-native';
import font from '../Styles/font';
import color from '../Styles/color';

import image from '../Styles/image';
import Session from '../config/Session';


export default class BookingRequestReceived extends Component{

    async componentDidMount (){
     let userdetails = await Session.getUserDetails();
     userdetails = JSON.parse(userdetails);

    this.BackHandler = BackHandler.addEventListener('hardwareBackPress', ()=>{
      this.props.navigation.push('bottomtabnavigator'/* 'masterhome' */);
      return true;
    }
    //this.handleBackButton
    );
  }
  handleBackButton(){
    this.props.navigation.push('bottomtabnavigator'/* 'masterhome' */);
   
    return true;
  } 

  componentWillUnmount (){
    if(this.BackHandler){
      this.BackHandler.remove();
    }
  }
    render(){
        return(
            <View height = {"100%"} 
            style = {[{flex: 1, justifyContent: "space-around", alignItems: "center"}]}>

              <Image source = {require('./../Assets/images/BRH_new_logo.png')}
              style = {[ image.imageContain, {height: '40%', width: '80%',}]}/>

                <Text 
                style = {[font.bold, 
                font.sizeDoubleLarge, 
                color.myOrangeColor, {textAlign: "center"}]}>
                    Thank you! 
                    </Text>
                    <Text 
                style = {[font.bold, 
                font.sizeLarge, 
                color.blackColor, {textAlign: "center"}]}>
                   Your Request has been Sent.
                    </Text>

                    <TouchableOpacity onPress = { ()=>{
                      this.props.navigation.push('TopTabNavigator');
                      
                    }}>
                        <Text style = {[font.regular, 
                            font.sizeRegular, 
                            color.orangeColor, {textDecorationLine: "underline"}]}>
                                View Upcoming Bookings
                                </Text>
                    </TouchableOpacity>
            </View>
        );
    }
}