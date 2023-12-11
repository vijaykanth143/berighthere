import React, { Component } from "react";
import { View, Image, StyleSheet} from 'react-native';
import box from "../../Styles/box";
import image from "../../Styles/image";
import renderItem from "../../Styles/renderItem";


export default class RectangleCard extends Component {
    render() {
        return (
            
            <View style={this.props.from == "booking"? [renderItem.fillWidthView, {
                flex: 1,
                flexDirection: "column",
                justifyContent: "space-around",
                
              }, ]:[renderItem.fillWidthView, box.boxContent, ]}>
                <View style={styles.viewImage}>
                    <Image
                        source={this.props.source}
                        style={[image.imageCover, image.reservationImage]} />
                </View> 
                <View style={styles.ViewContent}>
                   {this.props.data}
                </View>
            </View>
           
            
        );
    }
}

const styles = StyleSheet.create({
    viewImage: {
        flex: 4,
        //backgroundColor: "red"
    },
    ViewContent: {
        flex: 3,
        //marginLeft: "2%",
        padding: "1%",
        justifyContent: "space-around",
        /* backgroundColor: "red" */
    }

})