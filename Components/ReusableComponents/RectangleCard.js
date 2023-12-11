import React, { Component } from "react";
import { View, Text, Image, StyleSheet, Button, TouchableOpacity } from 'react-native';
import box from "../../Styles/box";
import image from "../../Styles/image";
import renderItem from "../../Styles/renderItem";
import font from "../../Styles/font";
import color from "../../Styles/color";
import button from './../../Styles/button';
import moment from "moment";


export default class RectangleCard extends Component {
    render() {
        return (
            <View style={
                this.props.from == 'meetingdetails'?
                [
                    renderItem.rectangleCardView, 
                    box.boxContent, 
                    //box.shadow_box,
                    {
                        borderWidth: 1, 
                        borderRadius: 0,
                        borderColor: color.myOrangeColor.color
                    }
                ]:
                [
                    renderItem.rectangleCardView, 
                    box.boxContent, 
                    box.shadow_box, 
                ]}>
                <View style={styles.viewImage}>
                    <Image
                        source={this.props.source}
                        style={[image.imageCover, image.reservationImage]} />
                </View>
                {this.props.from != "home" && this.props.from != "emphome" && this.props.from != 'upcomingmeeting' && this.props.from != 'currentmeeting' && ( <View style={styles.ViewContent}>
                    <Text
                        style={[font.sizeMedium, font.bold, color.darkgrayColor]}>
                             {this.props.details.plan_name}
                             </Text>
                             {this.props.from == 'meetingdetails'?
                                <Text style={[font.sizeMedium, font.regular, color.myOrangeColor]}>
                                {'\u20B9'}{Intl.NumberFormat('en-IN').format(this.props.details.price)}/
                                {this.props.details.unit}
                                </Text>:
                             
                    <Text style={[font.sizeRegular, font.regular, color.grayColor]}>
                        {'\u20B9'}{Intl.NumberFormat('en-IN').format(this.props.details.price)}
                        </Text>}
                   <TouchableOpacity onPress={this.props.onPress}>
                       <Text style = {[button.defaultRadius, 
                           font.bold, color.orangeColor, 
                            color.orangeBorder]}>{this.props.buttonTitle}</Text>
                    </TouchableOpacity>

                </View>)}

                {this.props.from == "home"&&(<View style={[styles.ViewContent,]}>
                    <Text
                        style={[font.sizeMedium, font.bold, color.darkgrayColor, {marginBottom: "10%"}]}>
                            {this.props.details.property_details.show_actual_name ?  this.props.details.property_details.property_name: this.props.details.property_details.pseudoname}
                            </Text>
                    <Text style={[font.sizeRegular, color.grayColor,font.regular, {marginBottom: "5%"}]}>
                        {this.props.details.booking_id}
                        </Text>

                    <View style = {{flex: 1, flexDirection: "row"}}>
                        <View style={{marginRight: 20}}>
                        <Text style={[font.sizeRegular, color.grayColor,font.regular, {marginBottom: "5%"}]}>From</Text>
                        <Text style={[font.sizeRegular, font.regular,color.grayColor, ]}>
                        {moment(this.props.details.start_date).format('DD- MMM')}
                        </Text>
                        <Text style={[font.sizeRegular,font.regular, color.grayColor]}>
                        {moment(this.props.details.start_date).format('HH:mm')}Hrs
                        </Text>
                        </View>
                        <View>
                        <Text style={[font.sizeRegular, color.grayColor,font.regular, {marginBottom: "5%"}]}>To</Text>
                        <Text style={[font.sizeRegular, font.regular, color.grayColor]}>
                        {moment( this.props.details.end_date).format("DD-MMM")}
                        </Text>
                        <Text style={[font.sizeRegular, font.regular, color.grayColor]}>
                        {moment(this.props.details.end_date).format('HH:mm')}Hrs
                        </Text>
                        
                        </View>
                    </View>
                   

                   
                </View>)}

                {this.props.from == "emphome"&&(<View style={[styles.ViewContent,]}>
                    <Text
                        style={[font.sizeMedium, font.bold, color.darkgrayColor, {marginBottom: "10%"}]}>
                            {this.props.details.show_actual_name ?  this.props.details.property_name: this.props.details.pseudoname}
                            </Text>
                    <Text style={[font.sizeRegular, color.grayColor,font.regular, {marginBottom: "5%", }]}>
                        {this.props.details.locality}
                        </Text>

                    <View style = {{flex: 1, flexDirection: "row"}}>
                        <View style={{marginRight: 20}}>
                        <Text style={[font.sizeRegular, color.grayColor,font.regular, {marginBottom: "5%"}]}>From</Text>
                       {/*  <Text style={[font.sizeRegular, font.regular,color.grayColor, ]}>
                        {moment(this.props.details.start_date).format('DD- MMM')}
                        </Text> */}
                        <Text style={[font.sizeRegular,font.regular, color.grayColor]}>
                        {this.props.details.start_at}Hrs
                        </Text>
                        </View>
                        <View>
                        <Text style={[font.sizeRegular, color.grayColor,font.regular, {marginBottom: "5%"}]}>To</Text>
                       {/*  <Text style={[font.sizeRegular, font.regular, color.grayColor]}>
                        {moment( this.props.details.end_date).format("DD-MMM")}
                        </Text> */}
                        <Text style={[font.sizeRegular, font.regular, color.grayColor]}>
                        {this.props.details.end_at}Hrs
                        </Text>
                        
                        </View>
                    </View>
                   

                   
                </View>)}

                {
                    this.props.from == "upcomingmeeting"&&(
                    <View style={[styles.ViewContent,]}>
                        <View style = {{flex: 1, justifyContent: 'flex-start'}}>
                        <Text
                            style={[font.sizeVeryRegular, font.bold, color.darkgrayColor, {/* marginBottom: "1%" */}]}>
                                { this.props.details.pseudoname}
                                </Text>
                        <Text style={[font.sizeVeryRegular, color.grayColor,font.regular, ]}>
                            {this.props.details.locality}
                            </Text>
                            <Text style={[font.sizeRegular, color.grayColor,font.regular, ]}>
                            {this.props.details.booking_id}
                            </Text>
    
                            <Text style={[font.sizeRegular, color.myOrangeColor,font.regular, ]}>
                            {this.props.details.plan_name}
                            </Text>

                        </View>
                      

                           
                            <View style={{flex: 1,marginRight: 20, justifyContent: 'flex-end'}}>
                          
                           <Text style={[font.sizeRegular, font.regular,color.grayColor, ]}>
                            {moment(this.props.details.date).format('DD MMM yyyy')}
                            </Text>
                            <Text style={[font.sizeRegular, font.regular,color.grayColor, ]}>
                            {this.props.details.start_time} to {this.props.details.end_time}
                            </Text>
                           
                            </View>
                            
                       
                       
                       
    
                       
                    </View>)

                }

{
                    this.props.from == "currentmeeting"&&(
                    <View style={[styles.ViewContent,]}>
                        <View style = {{flex: 1, justifyContent: 'flex-start'}}>
                        <Text
                            style={[font.sizeVeryRegular, font.bold, color.darkgrayColor, {/* marginBottom: "1%" */}]}>
                                { this.props.details.pseudoname}
                                </Text>
                        <Text style={[font.sizeVeryRegular, color.grayColor,font.regular, ]}>
                            {this.props.details.locality}
                            </Text>
                            <Text style={[font.sizeRegular, color.grayColor,font.regular, ]}>
                            {this.props.details.booking_id}
                            </Text>
    
                            <Text style={[font.sizeRegular, color.myOrangeColor,font.regular, ]}>
                            {this.props.details.plan_name}
                            </Text>

                        </View>
                      

                           
                            <View style={{flex: 1,marginRight: 20, justifyContent: 'flex-end'}}>
                          
                           <Text style={[font.sizeRegular, font.regular,color.grayColor, ]}>
                            {moment(this.props.details.date).format('DD MMM yyyy')}
                            </Text>
                            <Text style={[font.sizeRegular, font.regular,color.grayColor, ]}>
                            {this.props.details.start_time} to {this.props.details.end_time}
                            </Text>
                            <TouchableOpacity onPress = {this.props.onCheckinPress} >
                                <View style = {[button.defaultRadius, {
                                    flexDirection: 'row', 
                                    justifyContent: 'space-around', 
                                    height: 40,
                                    borderColor: color.myOrangeColor.color,
                                    alignItems: 'center'}]}>
                                    <Image  source = {require('../../Assets/images/qrnew.png')}
                                    style ={[image.imageContain, {width :20, height: 20}]}
                                    />
                                    <Text style = {[
                                        font.regular, font.sizeRegular, color.myOrangeColor
                                    ]}>Check-in</Text>
                                </View>
                            </TouchableOpacity>
                           
                            </View>
                            
                       
                       
                       
    
                       
                    </View>)

                }


            </View>
        );
    }
}

const styles = StyleSheet.create({
    viewImage: {
        flex: 1,
        //backgroundColor: "red"
    },
    ViewContent: {
        flex: 1,
        marginLeft: "2%",
        justifyContent: "space-around",
    }

})















// import React, { Component } from "react";
// import { View, Text, Image, StyleSheet, Button, TouchableOpacity } from 'react-native';
// import box from "../../Styles/box";
// import image from "../../Styles/image";
// import renderItem from "../../Styles/renderItem";
// import font from "../../Styles/font";
// import color from "../../Styles/color";
// import button from './../../Styles/button';


// export default class RectangleCard extends Component {
//     render() {
//         return (
//             <View style={[renderItem.fillWidthView, box.boxContent, box.shadow_box]}>
//                 <View style={styles.viewImage}>
//                     <Image
//                         source={this.props.source}
//                         style={[image.imageContain, image.reservationImage]} />
//                 </View>
//                 <View style={styles.ViewContent}>
//                     <Text
//                         style={[font.sizeMedium, font.bold, color.darkgrayColor]}>
//                             {this.props.details.plan_name}
//                             </Text>
//                             {/* duration not coming from API as of now. */}
//                    {/*  <Text style={[font.sizeRegular, color.grayColor]}>
//                         {this.props.details.duration}
//                         </Text> */}
//                     <Text style={[font.sizeRegular, color.grayColor]}>
//                         Rs.{this.props.details.price}
//                         </Text>
//                     <TouchableOpacity onPress={this.props.onPress}>
//                         <Text style = {[button.defaultRadius, 
//                             font.bold, color.orangeColor, 
//                             color.orangeBorder]}>{this.props.buttonTitle}</Text>
//                     </TouchableOpacity>

//                 </View>

//             </View>
//         );
//     }
// }

// const styles = StyleSheet.create({
//     viewImage: {
//         flex: 1.5,
//         //backgroundColor: "red"
//     },
//     ViewContent: {
//         flex: 1,
//         marginLeft: "2%",
//         justifyContent: "space-around",
//     }

// })