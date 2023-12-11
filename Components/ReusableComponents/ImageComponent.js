import React, {Component} from "react";
import { View ,ImageBackground} from "react-native";
import image from './../../Styles/image';
import box from './../../Styles/box';
import Icon from 'react-native-vector-icons/FontAwesome'
import renderItem from "../../Styles/renderItem";

export default class ImageComponent extends Component{
    render(){
        return(
           <ImageBackground source = {this.props.source} style = {[image.imageCover, image.propertyCoverImage]}>
               <View style = {[renderItem.topRightView]}>
                   <Icon  
                   name = { this.props.iconName} 
                   color = {this.props.iconColor}
                   size = {16}/>
                   </View>
           </ImageBackground>
        );
    }
}