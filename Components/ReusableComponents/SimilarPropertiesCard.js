import React, { Component } from "react";
import { View, Text, Image, TouchableOpacity, TouchableWithoutFeedback, Dimensions, } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import image from "../../Styles/image";
import font from "../../Styles/font";
import box from "../../Styles/box";
import color from "../../Styles/color";
import renderItem from "../../Styles/renderItem";
import ImageComponent from "./ImageComponent";
//import { SliderBox } from "react-native-image-slider-box";
import Slideshow from 'react-native-image-slider-show';
import {AWS_URL} from './../../config/RestAPI';


export default class SimilarPropertiesCard extends Component {
    constructor() {
        super();
        this.state = {
            //imageList:[]
            position: 0,
        }
        //this.setState=({image:AWS_URL+this.props.imageList.image_path})
    } 

   

    render() {
        return (
            <View
                style={[box.shadow_box, { marginTop: 10}, this.props.from =="SRP"? renderItem.search_result_page_view: this.props.from =="afterSplash" ? renderItem.afterSplashView:
                renderItem.withoutPaddingView]}>
                    {this.props.fromEmpReservation ? null : 
               <View height="45%"
                    width="100%" >
                    <View style = {{padding: 5}}>
                    {/* <SliderBox 
                    images={this.props.imageList}
                    resizeMode={'cover'}
                    sliderBoxHeight={this.props.from != 'afterSplash' ? 170:150}
                    parentWidth = {this.props.from =="SRP"? renderItem.search_result_page_view.width-10: this.props.from =="afterSplash" ? renderItem.afterSplashView.width-10:
                    renderItem.withoutPaddingView.width-10}
                    onCurrentImagePressed={index => console.warn(`image ${index} pressed`)}
                   
                     /> */}
                        {<Slideshow dataSource={this.props.imageList}
                        onPositionChanged={position => {
                            this.setState({
                                position: this.state.position === this.props.imageList.length ? 0 : this.state.position + 1
                              });
                        }}
                        position={this.state.position}
                            height={this.props.from != 'afterSplash' ? 170:150}
                            containerStyle={image.imageContain} />}
                    </View>
                        
                   {this.props.from != 'afterSplash' && this.props.isLogin ? <TouchableOpacity style={[renderItem.topRightView]} onPress={this.props.addToWishlist} >
                        <Icon
                            name={this.props.iconName}
                            color={this.props.iconColor}
                            size={16} />
                    </TouchableOpacity> : null}
                </View> } 
                <View height={this.props.fromEmpReservation ? "100%":"55%"} style={{//backgroundColor: "yellow", 
                justifyContent: "space-around",}}>
                    {this.props.contentdetails}
                  
                </View>
            </View>
        );
    }
}