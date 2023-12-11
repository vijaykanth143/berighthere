import React, { Component } from "react";
import {
    StyleSheet,
    ScrollView,
    View,
    Text,
    TouchableWithoutFeedback,
    Animated,
    Dimensions,
    FlatList,
    TouchableOpacity,
    LogBox,
    Platform,
    ActionSheetIOS,
    Image
} from "react-native";
import color from "../../Styles/color";

import CommonHelpers from "../../Utils/CommonHelpers";
import font from "../../Styles/font";
import button from "../../Styles/button";
import box from "../../Styles/box";

import Modal from 'react-native-modalbox';

import Spinner from "../../UI/Spinner";
import { StarRatingComponent } from "./StarRatingComponent";
import { TextInput } from "react-native";
import renderItem from "../../Styles/renderItem";
import * as ImagePicker from 'react-native-image-picker';
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import image from "../../Styles/image";
import MultipleImagePicker from '@baronha/react-native-multiple-image-picker';


const { width, height } = Dimensions.get("window");
const CARD_HEIGHT = height / 4;
const CARD_WIDTH = width - 80//CARD_HEIGHT - 50;

export default class Comments extends Component {

    constructor() {

        super();

        this.state = {
            modalOpen: false,
            spinner: false,
            comment: null,
            imageDetails:[],//null,
            videoDetails: null,
            showOptions: false,
            showRatings: false,
            video: false,
            rating: 0,
        }
    }

    componentDidMount() {
        this.setState({
            modalOpen: true, 
           // showRatings: true,//this.props.showRatings, 
        })
       
    }

    onFilterClosed = () => {
        this.setState({
            modalOpen: false,
        }, () => {

            this.props.closing();

        })
    }

    onFilterOpened = () => {
        this.setState({

            modalOpen: true,
            showRatings:true,

        })
    }

    captureImage = async () => {
        this.setState({
            showOptions: false,
        })
        let options = {
            storageOptions: {
                mediaType:'photo',
                path: 'images',
                saveToPhotos: true,
            },
            //includeBase64: true,
        }
        await ImagePicker.launchCamera(options, (response) => {
            if (response.errorCode == 'camera_unavailable') {
                CommonHelpers.showFlashMsg('camera Unavailable', 'danger')
            } else if (!response.didCancel) {
                console.log(response);
                let imageDetails = this.state.imageDetails;
                imageDetails.push(response.assets);
                this.setState({
                    imageDetails:imageDetails
                },()=>{
                    console.log('total images : ', this.state.imageDetails)
                })
            }
    
        }).catch(err => {
            console.log(err)
        })
    }
    captureVideo = async () => {
        this.setState({
            showOptions: false,
        })
        let options = {
            storageOptions: {
                mediaType:'video',
                path: 'images',
                saveToPhotos: true,
            },
            //includeBase64: true,
        }
        await ImagePicker.launchCamera(options, (response) => {
            if (response.errorCode == 'camera_unavailable') {
                CommonHelpers.showFlashMsg('camera Unavailable', 'danger')
            } else if (!response.didCancel) {
                console.log(response);
                this.setState({
                    imageDetails: response,
                   
                })
    
            }
    
        }).catch(err => {
            console.log(err)
        })
    }
     openGallery = async () => {
       
        let options = {
            usedCameraButton: true,
            allowedVideo: false, // true for videos 
            allowedPhotograph: true, // for camera : allow this option when you want to take a photos
            allowedVideoRecording: false, //for camera : allow this option when you want to recording video.
            maxVideoDuration: 60, //for camera : max video recording duration
            numberOfColumn: 3,
            maxSelectedAssets: 5,
            singleSelectedMode: false,
            doneTitle: 'Done',
            isPreview: true,
            mediaType: 'image', //'all' for images and videos
            isExportThumbnail: false,
            selectedAssets: this.state.imageDetails,
        }
        await MultipleImagePicker.openPicker(options).then(response=>{

            console.log(response);
            this.setState({
                    imageDetails:response, 
                   
                }
            )

        }).catch(error=>{
            console.log('error', error)
        });
    
    
    } 

    
    render() {
        return (

            <Modal

                style={[styles.modal,  box.bill_shadow_box, { 
                    height: this.state.showRatings ?"20%" :'50%',
                    justifyContent:'flex-start',
                    backgroundColor: "rgba(255,255,255,0.6)",
                    borderRadius:this.state.showRatings ? 20:0, }]}
                position={"center"}
                isOpen={this.state.modalOpen}
                onClosed={() => { this.onFilterClosed() }}
                onOpened={() => { this.onFilterOpened() }}
                swipeArea={30}
                backdropColor={"#fafafa"}
                backdropOpacity={0.9}
            >

                {
                    this.state.showRatings 
                    && 
                    this.props.from == 'afterBooking' 
                    &&
                    <View style = {[box.centerBox, 
                    {
                        justifyContent: 'center'
                    }]}>
                        <Text style = {[
                            font.regular, 
                            font.sizeLarge, 
                            color.darkgrayColor, 
                            {
                                textAlign: 'center'
                            }
                        ]}>{this.props.promptText == undefined ?"Rate your Experience": this.props.promptText}</Text>
                        <StarRatingComponent
                                rating={Number(this.state.rating)}
                                imageSize= {40}
                                readonly={false}
                                onFinishRating = {(rating)=>{
                                    console.log('finished', rating)
                                    this.setState({
                                        rating: rating, 
                                        openComments: true,
                                        showRatings: false
                                    })

                                }}
                                />

                    </View>   
                }
                {
                    this.state.showRatings && this.props.from == 'afterCheckout' && 
                    <View>

                    </View>
                }
                { this.state.openComments &&
                    <View>
                    <View>
                        <View style = {[{
                            width: Dimensions.get('window').width,
                            justifyContent: 'center',
                            padding: 5,
                            height: 50,
                            backgroundColor: color.darkgrayColor.color
                        }]}>
                            <Text style = {[
                                font.semibold, 
                                font.sizeMedium,
                                color.textWhiteColor, 
    
                            ]}>Share a review</Text>
    
                        </View>
    
                        <ScrollView 
                        style= {[{
                            marginBottom : 70,
                            padding: '2%'
                            //top: 50
                        }]}
                        >
                            <View style= {[box.horizontalBox, 
                            {
                                margin: 10
                            }]}>
                            <Text style = {[
                                font.regular, 
                                font.sizeLarge, 
                                color.darkgrayColor,
                            ]}>You Rating</Text>
                            <StarRatingComponent
                           imageSize={15}
                            rating = {this.state.rating}
                            readonly = {true}
                            />

                            </View>
                            
    
                            <TextInput
                            placeholder="Type a Review"
                            defaultValue={this.state.comment}
                            multiline = {true}
                            numberOfLines = {5}
                            style = {[renderItem.inputBox, {
                                borderWidth: 0.5, 
                                borderColor: color.darkgrayColor,color, 
                                borderBottomColor: color.darkgrayColor.color,
                                margin: 10, 
                                height: Dimensions.get('window').height*0.1,
                            }]}
                            />
    
                            <View style = {[box.horizontalBox, ]}>
                            <TouchableOpacity onPress=/* {()=> */{
                                this.openGallery
                                /* this.setState({
                                    showOptions: true,
                                }) */
                            }/* } */>
                            <Text style = {{
                                textDecorationLine: 'underline',
                                textDecorationColor: color.darkgrayColor.color,
                            }}>
                                Attach Image
                            </Text>
    
                            </TouchableOpacity>
    
                            {/* <TouchableOpacity onPress={()=>{
                                this.setState({
                                    showOptions: true,
                                    video: true
                                })
                            }}>
                            <Text style = {{
                                textDecorationLine: 'underline',
                                textDecorationColor: color.darkgrayColor.color,
                            }}>
                                Attach Video
                            </Text>
    
                            </TouchableOpacity> */}
    
                            </View> 
    
                            {
                                this.state.imageDetails.length !=0 ?
    
                                <FlatList
                                data={this.state.imageDetails}
                                renderItem={(item)=>{
                                    console.log(item);
                                    return(
                                         <View style = {{marginLeft: 5}}>
                                    <Image 
                                    style = {[image.imageContain, image.carouselImage]}
                                    source = {{uri: item.item.path}}
                                    />
                                </View>
    
                                    );
                                }}
                                horizontal
                                />
                                
                                :null
                            }
    
                        </ScrollView> 
                    </View>
                    <View style = {[ box.horizontalBox, {
                            position:'absolute',
                            bottom: 0,
                            width: Dimensions.get('window').width,
                            justifyContent: 'center',
                            padding: 5,
                            height: 70,
                            //backgroundColor: color.myOrangeColor.color
                        }]}>
                            <TouchableOpacity 
                            onPress = {()=>{
                                this.onFilterClosed();
                            }}
                            style = {[button.defaultRadius, {
                                flex: 1, 
                                justifyContent: 'center',
                                alignContent: 'center', 
                                margin : 2,
                                borderColor: color.darkgrayColor.color,
                            } ]}>
                                <Text style = {[
                                    font.bold, 
                                    font.sizeRegular, 
                                    color.darkgrayColor, 
                                    {
                                        textAlign: 'center',
                                    }
                                ]}>SKIP</Text>
                            </TouchableOpacity>
    
                            <TouchableOpacity style = {[button.defaultRadius, {
                                flex: 1, 
                                justifyContent: 'center',
                                alignContent: 'center', 
                                backgroundColor: color.darkgrayColor.color,
                                borderColor: color.darkgrayColor.color,
                                margin: 2
                            } ]}>
                                <Text style = {[
                                    font.bold, 
                                    font.sizeRegular, 
                                    color.textWhiteColor, 
                                    {
                                        textAlign: 'center'
                                    }
                                ]}>SUBMIT</Text>
                            </TouchableOpacity>
    
                        </View>
                        </View>

                }
                
                {
                    this.state.spinner && <Spinner/>
                }


                {
                this.state.showOptions && <Modal position={"center"} swipeToClose={false}
                    onClosed={() => { this.setState({ showOptions: false }) }}
                    style={{
                        //justifyContent: 'space-around',
                        //alignItems: 'space-around',
                        //padding: 20,
                        height: Dimensions.get('screen').height * 0.2,
                        width: Dimensions.get('screen').width * 0.9,
                    }} isOpen={this.state.showOptions}>
                    <View height={"100%"}>
                        <View style={[box.centerBox, color.inputBackground, {/* alignItems: "flex-start", */ padding: "4%" }]}>
                            <Text style={[font.semibold, font.sizeMedium, color.blackColor, { textAlign: "center" }]}>Upload from gallery or take a new picture?</Text>
                        </View>



                        <View style={{ flex: 1, flexDirection: "row", }}>
                            <TouchableOpacity style={{ bottom: 0, flex: 1, marginTop: "auto", backgroundColor: "orange", height: "100%", justifyContent: "center", borderRightWidth: 1, borderRightColor: "white" }}
                                onPress={this.openGallery}>
                                <Text style={[font.bold, font.sizeLarge, color.textWhiteColor, { textAlign: "center" }]}>Open Gallery</Text>
                            </TouchableOpacity>


                            <TouchableOpacity style={{ bottom: 0, flex: 1, marginTop: "auto", backgroundColor: "orange", height: "100%", justifyContent: "center" }}
                                onPress={!this.state.video ?this.captureImage: this.captureVideo}>
                                <Text style={[font.bold, font.sizeLarge, color.textWhiteColor, { textAlign: "center" }]}>Open Camera</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                </Modal>
            }




            </Modal>
        );
    }
}



const styles = StyleSheet.create({



    wrapper: {

        //paddingTop: 50,

        //flex: 1

    },



    modal: {

        justifyContent: 'center',

        alignItems: 'center'

    },



    modal2: {

        height: 230,

        backgroundColor: "#3B5998"

    },

    greybar: {

        backgroundColor: "#eaeaea",

        marginTop: "2%",

        borderRadius: 50,

        padding: 0,

        width: "30%",

        height: "1%"

    },



    modal3: {

        height: 300,

        width: 300

    },



    modal4: {

        height: "90%"

    },



    btn: {

        margin: 10,

        backgroundColor: "#3B5998",

        color: "white",

        padding: 10

    },



    btnModal: {

        position: "absolute",

        top: 0,

        right: 0,

        width: 50,

        height: 50,

        backgroundColor: "transparent"

    },



    text: {

        color: "black",

        fontSize: 22

    },

    container: {

        flex: 1,

    },

    scrollView: {

        position: "absolute",

        bottom: 30,

        left: 0,

        right: 0,

        paddingVertical: 10,

    },

    endPadding: {

        paddingRight: width - CARD_WIDTH,

    },

    card: {

        padding: 10,

        elevation: 2,

        backgroundColor: "#FFF",

        marginHorizontal: 10,

        shadowColor: "#000",

        shadowRadius: 5,

        shadowOpacity: 0.3,

        shadowOffset: { x: 2, y: -2 },

        height: CARD_HEIGHT,

        width: CARD_WIDTH,

        overflow: "hidden",

    },

    cardImage: {

        flex: 3,

        width: "100%",

        height: "100%",

        alignSelf: "center",

    },

    textContent: {

        flex: 1,

    },

    cardtitle: {

        fontSize: 12,

        marginTop: 5,

        fontWeight: "bold",

    },

    cardDescription: {

        fontSize: 12,

        color: "#444",

    },

    markerWrap: {

        alignItems: "center",

        justifyContent: "center",

    },

    marker: {

        width: 8,

        height: 8,

        borderRadius: 4,

        backgroundColor: "rgba(130,4,150, 0.9)",

    },

    ring: {

        width: 24,

        height: 24,

        borderRadius: 12,

        backgroundColor: "rgba(130,4,150, 0.3)",

        position: "absolute",

        borderWidth: 1,

        borderColor: "rgba(130,4,150, 0.5)",

    },



});