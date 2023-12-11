import React, {Component} from "react";
import {View, Text, Image, StyleSheet, ScrollView} from 'react-native';
import box from "../../Styles/box";
import color from "../../Styles/color";
import font from "../../Styles/font";
import image from "../../Styles/image";
import { StarRatingComponent } from "./StarRatingComponent";

export default class ReviewCard extends Component {
   
    render(){
        const height = Math.ceil(this.props.review.split(" ")/7) * 15;
        console.log(this.props.rating)
        return(
            <View style = {[box.centerBox]}>
                <View style = {[box.reviewHeader]}>
                   <Image 
                    source = {this.props.source}
                    style = {[image.imageCover, 
                    image.reviewImageBox]} />
                    <View style = {[styles.leftmargin]}>
                        <Text style = {[font.bold, 
                            font.sizeLarge,
                            color.blackColor]}>
                                {this.props.name}
                                </Text>
                                <View style ={[box.horizontalBox,{
                                    //backgroundColor: 'pink', 
                                    width: '75%',
                                }]}>
                                <Text 
                            style = {[font.semibold, 
                            font.sizeMedium, 
                            color.blackColor,]}>
                            {this.props.date}
                            </Text>
                            <View style = {{justifyContent: 'center'}}>
                            <StarRatingComponent
                            rating = {this.props.rating}
                            readonly/>


                            </View>
                            
                                </View>
                        
                    </View>
                </View>
                <View style = {styles.topmargin}>
                    
                        <View height={Math.ceil(this.props.review.split(" ").length / 6) * 15}>
                    <Text style = {[font.regular, font.textJustify,
                        font.sizeVeryRegular,
                        color.blackColor]}>{this.props.review}</Text>
                        </View>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    leftmargin: {
        marginLeft: '5%',
    },
    topmargin: {
        marginTop: "2%",
    },
    
   
})