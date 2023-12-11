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
import color from "../../../Styles/color";
import { getPropertyListAPI } from '../../../Rest/userAPI';
import CommonHelpers from "../../../Utils/CommonHelpers";
import font from "../../../Styles/font";
import button from "../../../Styles/button";
import box from "../../../Styles/box";
import Icon from "react-native-vector-icons/FontAwesome";
import Modal from 'react-native-modalbox';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { PROPERTY_LIST } from "../../../config/RestAPI";
import Session from "../../../config/Session";
import Spinner from "../../../UI/Spinner";

const { width, height } = Dimensions.get("window");
const CARD_HEIGHT = height / 4;
const CARD_WIDTH = width - 80//CARD_HEIGHT - 50;

export default class Mapping extends Component {

    constructor() {

        super();

        this.state = {
            modalOpen: false,
            markerPressed: false,
            selectedIndex: 0,
            mapMarkers: [],
            initialRegion: null,
            showSearchButton : false,
            region: null,
            spinner: false,
        }

        this.index = 0;
        this.animation = new Animated.Value(0);
        this.setButtonTimeout = null;

    }

    componentDidMount() {
        LogBox.ignoreLogs(['VirtualizedLists should never be nested']);

        this.setState({
            modalOpen: true,
            mapMarkers: this.props.mapMarkers,
            initialRegion: this.props.initialRegion,
        }, () => {
            this.animation.addListener(({ value }) => {

                let index = Math.floor(value / CARD_WIDTH + 0.4); // animate 30% away from landing on the next item

                if (index >= this.props.mapMarkers.length) {

                    index = this.props.mapMarkers.length - 1;

                }

                if (index <= 0) {

                    index = 0;

                }

                clearTimeout(this.regionTimeout);

                this.regionTimeout = setTimeout(() => {

                    if (this.index !== index) {

                        this.index = index;

                        const { coordinate } = this.state.mapMarkers[index].coordinate;

                        this.map != null?

                        this.map.animateToRegion(

                            {

                                latitude: this.state.mapMarkers[index].coordinate.latitude,

                                longitude: this.state.mapMarkers[index].coordinate.longitude,

                                latitudeDelta: 0.009,

                                longitudeDelta: 0.009

                                //latitudeDelta: this.state.region.latitudeDelta,

                                //longitudeDelta: this.state.region.longitudeDelta,

                            },

                            350

                        ): null;

                    }

                    this.setState({

                        selectedIndex: index

                    })

                }, 10);

            });
        })

    }



    onFilterClosed = () => {

        ////console.log("Modal closed.");



        this.setState({

            modalOpen: false,



        }, () => {

            this.props.closing();

        })



    }

    onFilterOpened = () => {



        this.setState({

            modalOpen: true

        })





    }

    apiCall = async (param, url) => {
        this.setState(
            {
                //data: [],
                spinner: true
            }
        )
        console.log("From  api call: ", url, param);
        getPropertyListAPI(param, url).then(async (result) => {
            ////console.log("from " + this.props.route.params.name + "search results: ", result.status);
            if (result.status) {
                //////console.log('Results: ', JSON.stringify(result.pagesData));
                let mapMarkers = [];

                  result.dataArray.map((item, index) => {
                    const mapItem = {
                        coordinate: {
                            latitude: parseFloat(item.latitude),
                            longitude: parseFloat(item.longitude),
                        },
                        imageURL: (item.images == null || item.images.length == 0) ? require('../../../Assets/images/BRHlogoorange.png') : { uri: CommonHelpers.processRawImages(item.images)[0].url },//{uri:AWS_URL+ item.images[0].image_path},
                        item: item
                    }
                    mapMarkers.push(mapItem);
                })

                this.setState({
                    initialRegion:{
                        "latitude": mapMarkers[0].coordinate.latitude,
                        "longitude": mapMarkers[0].coordinate.longitude,
                        'latitudeDelta': 0.015,
                        'longitudeDelta': 0.0121,
                    },
                    mapMarkers: mapMarkers,

                },()=>{
                 this.map!=null? this.map.animateToRegion(this.state.initialRegion): null;
                })    
            } else {
                this.setState({
                    data: []
                })
                CommonHelpers.showFlashMsg(result.message, "danger");
            }
            this.setState({
                spinner: false,
                refreshing: false
            });
        })



    }

    setSearchRegion=(region)=>{
        clearTimeout(this.setButtonTimeout);
                            this.setState({
                                showSearchButton: true,
                            },()=>{
                                setTimeout(()=>{
                                    this.setState({
                                        showSearchButton: false
                                    })
                                }, 30000)
                            })

                            this.setState({
                                region: region
                            })
    }

    render() {

        // this.index = 0;

        // this.animation = new Animated.Value(0);

        const interpolations = this.state.mapMarkers.map((marker, index) => {

            const inputRange = [

                (index - 1) * CARD_WIDTH,

                index * CARD_WIDTH,

                ((index + 1) * CARD_WIDTH),

            ];

            const scale = this.animation.interpolate({

                inputRange,

                outputRange: [1, 1.2, 1],

                extrapolate: "clamp",

            });

            const opacity = this.animation.interpolate({

                inputRange,

                outputRange: [0.35, 1, 0.35],

                extrapolate: "clamp",

            });



            return { scale, opacity };

        });

        return (

            <Modal

                style={[styles.modal, styles.modal4, box.bill_shadow_box, { backgroundColor: "rgba(255,255,255,0.6)" }]}
                position={"center"}
                isOpen={this.state.modalOpen}
                onClosed={() => { this.onFilterClosed() }}
                onOpened={() => { this.onFilterOpened() }}
                swipeArea={30}
                backdropColor={"#fafafa"}
                backdropOpacity={0.9}
            >

                
                <View
                    style={{/* flex: 1,  */height: '100%' }}
                >
                    <MapView.Animated

                        ref={map => this.map = map}

                        provider={PROVIDER_GOOGLE}

                        style={{
                            flex: 1,
                            width: Dimensions.get('screen').width,
                            height: '100%',
                            marginBottom: 10,
                        }}
                        initialRegion={this.state.initialRegion}
                        onRegionChangeComplete={(region)=>{
                            console.log('region changed', region);
                            this.setSearchRegion(region);
                            

                        }}
                        showUserLocation={true} >
                        {
                            this.state.mapMarkers.length != 0 &&
                            this.state.mapMarkers.map((marker, index) => {
                                const scaleStyle = {
                                    transform: [
                                        {

                                            scale: interpolations[index].scale,

                                        },

                                    ],

                                };

                                const opacityStyle = {

                                    opacity: interpolations[index].opacity,

                                };



                                return (

                                    <Marker
                                        onCalloutPress={() => {

                                            this.props.from != 'meetingInfo' ?(
                                                this.setState({
                                                    spinner: true
                                                }),
                                            this.props.openDetails(marker.item)): null;
                                        }}

                                    
                                        onPress={() => {

                                            if(this.props.from != 'meetingInfo'){
                                                console.log('clicked: ', index);
                                            this.setState({
                                                selectedIndex: index
                                            })

                                           this.scrolling == null ?null: this.scrolling.scrollTo({
                                                x: index * (CARD_WIDTH + 20),
                                                y: 0,
                                                animated: true
                                            });

                                            }

                                            

                                        }}

                                        key={index}
                                        coordinate={{
                                            latitude: parseFloat(marker.coordinate.latitude),
                                            longitude: parseFloat(marker.coordinate.longitude),
                                        }}

                                        //pinColor={'green'}

                                        title={/* marker.item.pseudoname+ " "+ */marker.item.resource_name}

                                        description={this.props.from != 'meetingInfo' ? '\u20B9' + Intl.NumberFormat('en-IN').format(marker.item.least_plan_price.price) : marker.item.pseudoname}



                                    >

                                        <Animated.View style={[styles.markerWrap,  /* scaleStyle, */]}>

                                            {/*  <Animated.View style={[ styles.ring,  scaleStyle]} /> */}



                                            {

                                                this.props.from != 'meetingInfo' ?



                                                    <Text style={[

                                                        button.smallBillPriceButton,

                                                        {

                                                            backgroundColor: this.state.selectedIndex == index ? 'green' : color.myOrangeColor.color,

                                                            color: 'white',

                                                            borderWidth: 0,

                                                            padding: 10

                                                        }]}>

                                                        {'\u20B9'}{Intl.NumberFormat('en-IN').format(

                                                            marker.item.least_plan_price.price)}

                                                    </Text>

                                                    :

                                                    <Image

                                                        source={require('./../../../Assets/images/BRHlogoorange.png')}

                                                        style={{

                                                            backgroundColor: 'rgba(255,255,2,0.5)',

                                                            height: 35, width: 35

                                                        }} />

                                            }

                                        </Animated.View>

                                    </Marker>







                                )

                            })

                        }
                    </MapView.Animated>


                    <View  style={[ box.horizontalBox, {position: 'absolute',
    top: 2,
    
    backgroundColor: 'rgba(255, 255, 255, 1)',}]}>
        <TouchableOpacity
        onPress={()=>{
            this.onFilterClosed() 
        }}
         style = {[{
            alignSelf:'center', 
            width: '10%', 
            justifyContent: 'center', 
            alignItems: 'center',
            //backgroundColor: 'red'
        }]}>
        <Icon
        name = "angle-left" size={30}
        />

        </TouchableOpacity>
       
                    <TouchableWithoutFeedback onPress={() => {
                    }}>

                        <GooglePlacesAutocomplete
                            GooglePlacesDetailsQuery={{ fields: "geometry" }}
                            textInputProps={{ placeholderTextColor: "gray" }}
                            fetchDetails={true} // you need this to fetch the details object onPress
                            placeholder='Search meeting spaces in...'
                            query={{
                                key: "AIzaSyDgQlUgbgkWodIedIBpYIE8dMZJ7jjbbfA",
                                language: "en", // language of the results
                                components: 'country:in'
                            }}
                            renderLeftButton={() =>
                                <Icon name="search" color="black" size={20} style={{ alignSelf: "center", paddingLeft: 5 }} />
                            }
                            styles={{
                                textInput: {
                                    color: "gray",
                                    backgroundColor: color.lightGray.color,
                                    borderRadius: 20,
                                    fontSize: font.sizeVeryRegular.fontSize,
                                    allowFontScaling: false
                                },
                                textInputContainer: {
                                    width: Dimensions.get('screen').width * 0.89,
                                    backgroundColor: color.lightGray.color,
                                    borderRadius: 10
                                }, row: {
                                    backgroundColor: 'white',
                                }, description: { color: "gray" }
                            }}
                            onPress={async(data, details = null) => {
                                var params = {
                                    "latitude": JSON.stringify(details.geometry.location.lat),
                                    "longitude": JSON.stringify(details.geometry.location.lng),
                                    "resource_group_id": JSON.parse(await Session.getSelectedResourceType()),//this.state.searchCategoryids,
                                    'is_meeting_space': 1
                                };

                                

                                this.apiCall(params, PROPERTY_LIST);
                            }}
                            onFail={(error) => console.error(error)} />

                    </TouchableWithoutFeedback>

                </View>

                {
                    this.state.showSearchButton ? 
                

                <TouchableOpacity
                onPress={async()=>{
                    console.log(this.state.region);
                    var params = {
                        "latitude": JSON.stringify(this.state.region.latitude),
                        "longitude": JSON.stringify(this.state.region.longitude),
                        "resource_group_id": JSON.parse(await Session.getSelectedResourceType()),//this.state.searchCategoryids,
                        'is_meeting_space': 1
                    };
                    this.apiCall(params, PROPERTY_LIST);
                }} 
                 style = {[ button.saveButton, {position:'absolute', width: '50%',
                 backgroundColor:color.darkgrayColor.color,
            top: 50, alignSelf:'center'
            }]}>
                <Text style = {[
                    font.sizeRegular,
                    font.bold, 
                    color.textWhiteColor,
                ]}>Search This Region</Text>
            </TouchableOpacity> 
            :null
            }

                    {
                        this.props.from == 'meetingInfo' ? null :
                            <Animated.ScrollView
                                ref={scroll => this.scrolling = scroll}
                                horizontal
                                scrollEventThrottle={1}
                                showsHorizontalScrollIndicator={false}
                                scrollToOverflowEnabled
                                snapToInterval={CARD_WIDTH + 20}
                                onScroll={Animated.event(

                                    [

                                        {

                                            nativeEvent: {

                                                contentOffset: {

                                                    x: this.animation,

                                                },

                                            },

                                        },

                                    ],

                                    { useNativeDriver: true }

                                )}

                                style={styles.scrollView}

                                contentContainerStyle={styles.endPadding}

                            >

                                {

                                    this.state.mapMarkers.map((marker, index) => (

                                        <TouchableOpacity onPress={() => {

                                            this.props.openDetails(marker.item);

                                        }}

                                            style={styles.card} key={index}>

                                            <Image

                                                source={marker.imageURL}

                                                style={styles.cardImage}

                                                resizeMode="cover"

                                            />

                                            <View style={{ flexDirection: 'row' }}>

                                                <View style={styles.textContent}>

                                                    <Text numberOfLines={1} style={styles.cardtitle}>

                                                        {marker.item.pseudoname}

                                                    </Text>

                                                    <Text numberOfLines={1} style={styles.cardDescription}>

                                                        {marker.item.resource_name}

                                                    </Text>

                                                </View>

                                                <Text style={[

                                                    font.bold,

                                                    font.sizeLarge

                                                ]}>{'\u20B9'}{Intl.NumberFormat('en-IN').format(marker.item.least_plan_price.price)}</Text>

                                            </View>



                                        </TouchableOpacity>

                                    ))

                                }

                            </Animated.ScrollView>
                    }

                </View>

                {
                    this.state.spinner && <Spinner/>
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