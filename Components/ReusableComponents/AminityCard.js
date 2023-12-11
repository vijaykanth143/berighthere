import React, { Component } from 'react';
import { View, Text, StyleSheet, Image} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import box from '../../Styles/box';
import font from '../../Styles/font';
import image from '../../Styles/image';
import color from '../../Styles/color';

export default class AminityCard extends Component {
    render() {
        //const icon = this.props.iconName;
       /*  console.log(icon); */
        return (

            this.props.from == 'meetingaddons' ? 
            <View style={ 
            [
                //box.centerBox, 
                //box.bill_shadow_box, 
                color.whiteBackground,
                {
                    flexDirection:'row',
                   //margin: '1%'
                    //borderWidth: 1,
                    //borderColor: color.grayColor.color
                }
                ]}>
               <View style = {[styles.viewStyle,]}>
               <Image
                        source={this.props.source}
                        style={[image.imageContain, image.userImage, { marginRight: 5}]} />
                   
                </View> 
                <View style = {styles.viewStyle}>
                    <Text
                    style = {this.props.from == 'meetingdetails'?[font.sizeSmall, color.darkgrayColor,font.semibold,{textAlign:"center"}]:[font.sizeSmall, color.myOrangeColor,font.semibold,{textAlign:"center"}]}>{this.props.details.amenity_name}</Text>
                </View>

            </View>:
            <View style={ this.props.from == 'meetingdetails'? 
            [
                box.centerBox, 
                //box.bill_shadow_box, 
                color.whiteBackground,
                {
                    borderWidth: 1,
                    borderColor: color.grayColor.color
                }
                ]:
                [
                box.centerBox, 
                box.bill_shadow_box, 
                color.whiteBackground
                ]}>
               <View style = {styles.viewStyle}>
               <Image
                        source={this.props.source}
                        style={[image.imageContain, image.userImage]} />
                   {/*  <Icon
                        name={icon}
                        size={20}
                        style={styles.icon}
                        color="black"
                    /> */}
                </View> 
                <View style = {styles.viewStyle}>
                    <Text
                    style = {this.props.from == 'meetingdetails'?[font.sizeSmall, color.darkgrayColor,font.semibold,{textAlign:"center"}]:[font.sizeSmall, color.myOrangeColor,font.semibold,{textAlign:"center"}]}>{this.props.details.amenity_name}</Text>
                </View>

            </View>

        );


    }
}

const styles = StyleSheet.create({
    viewStyle: {
        //flex: 1, 
        //backgroundColor: "red",
         alignItems: "center",
         marginTop: "0%",
         alignContent: "center",
         justifyContent: "center"
    },
    icon: {
        margin: 5
        
    }
})