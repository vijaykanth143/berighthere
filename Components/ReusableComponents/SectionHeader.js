import React, { Component } from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Image} from 'react-native';
import color from '../../Styles/color';
import font from '../../Styles/font';
import Icon from 'react-native-vector-icons/FontAwesome';

export default class SectionHeader extends Component { 

    render(){
        return(
          <TouchableOpacity onPress={ this.props.onPress }>
            <View style= {[styles.sectionHeader, {justifyContent: this.props.from == 'meetingdetails' ||this.props.from == 'meetingspaceinformation' ? 'space-between': 'flex-start'}]} >
            <Text style={[styles.headerText, 
                font.sizeLarge, 
                font.semibold,
                color.darkgrayColor]}>
              {this.props.title}  {this.props.from == 'meetingspaceinformation' ?
              <TouchableOpacity onPress = {this.props.add}>
                <Image source = {require('../../Assets/images/Add.png')} style = {{
                width: 20, height: 20
              }}/>

              </TouchableOpacity>
              
               :null}
            </Text>  
            
              <Icon
                name= {this.props.iconName}
                size={25}
                style={[color.grayColor]}
              />
            </View>
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    sectionHeader: {
        margin: "2%",
        flexDirection: "row",
        padding: 10,
        marginTop: 0,
        
      },
      headerText: {
        marginRight: 10,
      }
})