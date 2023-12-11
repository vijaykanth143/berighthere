import React, {Component} from 'react';
import {View, Image, Text} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import color from '../../../Styles/color';
import font from '../../../Styles/font';
import image from '../../../Styles/image';
import box from '../../../Styles/box';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { ImageBackground } from 'react-native';
import { Dimensions } from 'react-native';

export default class MeetingCard extends Component{
    constructor(){
        super();
        this.state = {
            clicked: false
        }
    }

    render(){
        console.log(this.props.source)
        return(
            <TouchableWithoutFeedback style = {{
                marginRight: 10
            }}
            
            >
                <ImageBackground source={this.props.source} style = {{
                    height: Dimensions.get('screen').width*0.4, 
                    width: Dimensions.get('screen').width*0.45
                }}>
                    <View style = {{
                        //height: 30,
                        
                        position: 'absolute',
                        bottom: 30,
                        backgroundColor : 'rgba(0,0,0,0.8)',
                        width: '100%'
                        //opacity: 0.2
                    }} >
                        <Text style = {[
                            font.bold, 
                            font.sizeSmall, 
                            color.myOrangeColor, {
                                paddingLeft:5,
                               padding: this.props.from == 'details'? 5:0,
                               
                               
                            }
                        ]}>{this.props.resource_name.toString().trim()}</Text>
                        {
                            this.props.from == 'details' ?null:
                            <View style = {{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                paddingLeft: 5,
                               // marginTop: 0
                                //backgroundColor: 'pink'
                            }} >
    
                                <Text style = {[
                                font.bold, 
                                font.sizeSmall, 
                                color.textWhiteColor, {
                                    paddingLeft: 2,
                                    
                                }
                            ]}>{'\u20B9'}{this.props.price}/{this.props.unit}</Text>
                                <Text style = {[
                                font.bold, 
                                font.sizeSmall, 
                                color.textWhiteColor, {
                                    paddingRight: 5
                                }
                            ]}>{this.props.distance}Kms <Icon name = 'map-marker' size = {10}></Icon></Text>
    
                            </View>
                            
                        }
                        

                    </View>
                </ImageBackground>
            </TouchableWithoutFeedback>
        );
    }

}