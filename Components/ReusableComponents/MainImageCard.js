import React, { Component } from 'react';
import { View, StyleSheet, TouchableWithoutFeedback, Text, ImageBackground, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import fontStyle from './../../Styles/font';
import image from './../../Styles/image';



export class MainImageCard extends Component {

    render() {
        return (
            <View style={styles.view}>
                <ImageBackground
                    source={this.props.image_path}
                    style={[styles.backgroundImage, image.imageCover]}>
                    <View style={styles.contentView}>
                        <View style={styles.viewBackArrow}>
                            <TouchableOpacity onPress={this.props.onBackPress} style = {{ width: 50}}>
                                <Icon
                                    name="chevron-left"
                                    color="#fff"
                                    size={25}
                                />
                            </TouchableOpacity>
                        </View>
                        <View style = {styles.viewBottomContent}>
                            <View style={styles.viewBottom}>
                                <View style={styles.viewTitle}>
                                    <View style={styles.text}>
                                        <Text
                                            style={[fontStyle.semibold, fontStyle.sizeExtraLarge, fontStyle.textWhiteColor]}>
                                           {this.props.property_name}
                                        </Text>
                                    </View>

                                    <View style={styles.starView}>
                                       {/*  <StarRatingComponent rating = {this.props.details.rating}/> */}
                                    </View>
                                </View>


                                <View style={styles.detailsView}>
                                    <View style={styles.locationView} >
                                        <Text
                                            style={[fontStyle.regular, fontStyle.sizeMedium, fontStyle.textWhiteColor]}>
                                            {this.props.property_location}
                                        </Text>
                                    </View>
                                    <View style={styles.viewIcons}>
                                        <Icon
                                            name='share-alt'
                                            size={20}
                                            style={styles.share}
                                            color="#fff"
                                        />
                                        <Icon
                                            name='heart-o'
                                            size={20}
                                            style={styles.heart}
                                            color="#fff"
                                        />
                                    </View>
                                </View>

                            </View>
                        </View>
                    </View>
                </ImageBackground>
            </View>
        );
    }

}

const styles = StyleSheet.create({

    viewBackArrow: {
        marginLeft: '5%',
        zIndex: 99,
        //backgroundColor: "red",
        justifyContent: "flex-start",
        flex: 1,

    },
    viewBottomContent: {
        flex: 1,
        marginBottom: "2%",
    },
    viewBottom: {
        flex: 1,
        flexDirection: "column",
        paddingLeft: "5%",
        backgroundColor: "rgba(23,23,23,0.05)",
        //backgroundColor: "red",
        
    },
    viewTitle: {
        flex: 1,
        flexDirection: "row",
        //backgroundColor: "pink",
        
        
        
    },
    text: {
        flex: 3,
        justifyContent:"center"
    },
    starView: {
        paddingTop: "2%",
        flex: 1,
        marginRight: "20%",
        justifyContent:"center"
    },
    detailsView: {
        flex: 1,
        flexDirection: "row",
        //backgroundColor: "green"
        //justifyContent:"center"
    },
    locationView: {
        flex: 5,
        justifyContent:"center"
    },
    viewIcons: {
        flexDirection: "row",
        flex: 1,
        marginRight: "2%",
        //backgroundColor: "yellow",
        alignItems:"center"
    },
    share: {
        flex: 0.5,
        //justifyContent:"center"
    },
    heart: {
        flex: 0.5,
    },

    view: {
        margin: '0%',
    },
    backgroundImage: {
        width: '100%',
        height: '100%',
    },
    contentView: {
        flex: 1,
        flexDirection: "column",
        marginTop: "5%",
    },
})