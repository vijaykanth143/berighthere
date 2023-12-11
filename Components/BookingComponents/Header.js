import React, {Component} from 'react';
import {View, Text, SafeAreaView, TouchableOpacity,} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'
import color from '../../Styles/color';
import font from '../../Styles/font';

export default class Header extends Component{
    render(){
        return(
            <SafeAreaView style = {{ flexDirection : "row",alignItems:"center", height: 75,/*  backgroundColor: "red", */ marginTop: "5%" }}>
                <TouchableOpacity style = {{ marginLeft: "5%", }} onPress = {this.props.onPress}>
            <Icon name = {this.props.name} style = {[this.props.style,]} size = { 40 }/>
            </TouchableOpacity>
            <Text style = {[font.bold, 
                font.sizeDoubleLarge, 
                color.myOrangeColor, { marginLeft: "15%"}]}>{this.props.title}</Text>
            </SafeAreaView>
        );
    }
}