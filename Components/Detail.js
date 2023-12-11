import React, { Component } from 'react';
import {
    View,
    Text,
    StatusBar,
    StyleSheet,
    Image,
    TouchableWithoutFeedback,
    TouchableOpacity,
    ScrollView,
    Platform,
    LogBox,
    BackHandler,
    FlatList
} from 'react-native';
import { imagefiles } from './ReusableComponents/imagefiles';
import { similarPropertiesData } from './ReusableComponents/similarPropertiesData';
import AminityCard from './ReusableComponents/AminityCard';
import RectangleCard from './ReusableComponents/RectangleCard';
import FlatListComponent from './ReusableComponents/FlatlistComponent';
import SimilarPropertiesCard from './ReusableComponents/SimilarPropertiesCard';
import image from '../Styles/image';
import font from '../Styles/font';
import renderItem from '../Styles/renderItem';
import color from '../Styles/color';
import box from '../Styles/box';
import Collapsible from 'react-native-collapsible';
import SectionHeader from './ReusableComponents/SectionHeader';
import Icon from 'react-native-vector-icons/FontAwesome';
import MapIcon from 'react-native-vector-icons/FontAwesome5';
import Icon2 from 'react-native-vector-icons/Octicons'
import { StarRatingComponent } from "./ReusableComponents/StarRatingComponent";
import { getMeetingSpaceDetails, getPropertyInfoAPI, getMeetingPropertyList, getPropertyListAPI, login_check, addToWishlist } from '../Rest/userAPI';
import { AWS_URL, MEETING_PROPERTY_LIST , PROPERTY_LIST, ADD_TO_WISHLIST} from '../config/RestAPI';
import Spinner from '../Utils/Spinner';
import CommonHelpers from '../Utils/CommonHelpers';
import Slideshow from 'react-native-image-slider-show';
import Share from 'react-native-share';
import ImgToBase64 from 'react-native-image-base64';
import Drawer from "react-native-drawer";
import Sidemenu from "../Navigation/Sidemenu";
import MeetingCard from './MeetingSpaces/Reusables/MeetingCard';
import { Dimensions } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import Session from '../config/Session';
import Mapping from './MeetingSpaces/Reusables/Mapping';
import ImageView from "react-native-image-viewing";
import { ProgressBar } from '@react-native-community/progress-bar-android';
import { ProgressView } from "@react-native-community/progress-view";
import ReviewCard from './ReusableComponents/ReviewCard';



export default class Detail extends Component {

    componentDidMount = async () => {

        LogBox.ignoreLogs(['VirtualizedLists should never be nested']);

        this._getPropertyInfo(this.props.route.params.property_id);

        this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {

            this.props.navigation.goBack();
            return true;
        })

        login_check().then(async (result) => {

            //console.log("login check", result.message, result.status);

            if (!result.status) {

                this.setState({

                    isLogin:false

                })

            }

            else{

                this.setState({

                    isLogin: true

                })

            }



        }).catch(error => {

            //console.log(error)

        })

    }



    onFilterClosed = () => {



        this.setState({

            showMaps: false,

        })

    }



    onFilterOpened = () => {

        this.setState({

            showMaps: true,

        })

    }



    constructor() {

        super();



        this.state = {

            //api data

            API_DATA: [],

            property_name: '',

            property_location: "",

            image_path: null,
            position: 0,

            carousel_images: [],

            carousel_images_base: [],

            resource_plan: [],

            amenity: [],

            addons: [],

            short_desc: 'Delve into the world of luxury and splendid ambience for an unforgettable work experience, at our centre. The plush centre comes fully equipped with premium cabins, curated with the latest amenities that offer pedestal storage, lockers, whiteboards, and pinup boards to make working more seamless and productive. Our centre also offers an array of hi-tech infrastructure options like video projection and conferencing for creative brainstorming sessions and collaborative meetings with your team members. Opulent meeting rooms and collab zones ensure a dynamic work environment that fosters teamwork, planning and road mapping.',

            long_desc: '',

            supportText: 'Our highly skilled support managers and concierge team specialises in tailoring their services to your personal requirements. We offer only the best qualified personnel to provide day to day customised assistance, as per your needs.\n BeRightHere Community and Admin staff are available from Monday to Saturday from 9.00 AM to 6.00 PM',

            desc_btn: false,

            spinner: false,

            latitude:null,

            longitude: null,

            showMaps: false,

            //static data

            activeIndex: 0,

            reviews: imagefiles[0].reviews,
            allReviews: imagefiles[0].reviews,
            allImages: [],//imagefiles[0].allImages,
            currentReviewImage: 0,
            showReviewImages: false,

            collapseResevations: false,

            collapseAmenities: false,

            collapseDescription: false,

            collapseReviews: false,

            collapseotherMeetings: false,

            collapseAddons: false,

            collapseMap: false,

            collapseSupport: false,



            similarProperties: similarPropertiesData,



            meetingSpacesNearby: [],

            isLogin: false,
            fillHeart: false,
            reviewText: null, 
            reviewRatings : [0,0,0,0,0],



        }

    }



    componentWillUnmount() {

        if (this.backHandler)

            this.backHandler.remove();

    }



    _getPropertyInfo = async (id) => {

        this.setState({

            spinner: true,

        })

        getPropertyInfoAPI(id, {'is_meeting_space': null}).then((result) => {

            this.setState({

                spinner: false,

            });

            console.log('meeting spaces details from api: ********',JSON.stringify(result.dataArray[0]))

            console.log(result.status);

            if (result.status) {

                console.log(" PropertyList API Data", JSON.stringify(result.dataArray));

                var temp_array = result.dataArray[0];

                //console.log(" image path",temp_array);

                let carousel_images = temp_array.images.length > 0 ? CommonHelpers.processRawImages(temp_array.images) : [];

                let carousel_images_base = []



                temp_array.images.length != 0 ?

                    temp_array.images.forEach(item => {



                        ImgToBase64.getBase64String(AWS_URL + item.image_path)

                            .then(base64String => {
                                carousel_images_base.push('data:image/' + (item.image_path.split('.')[1].localeCompare('jpg') != 0 ? 'jpeg' : 'png') + ';base64,' + base64String);
                            })

                            .catch(err => { ////console.log("base 64 error: ", err) 

                            });

                    }) : carousel_images.push(require('./../Assets/images/workplace2.jpg'));
                let addons = [];

                temp_array.amenity.map((amenity, index) => {

                    if (amenity.is_paid == 1) {//change it to 1

                        addons.push(amenity);

                    }

                })



                console.log('latitude, ',temp_array.latitude,'longitude, ',temp_array.longitude, )



                this.setState({

                    API_DATA: result.dataArray,

                    property_name: temp_array.pseudoname,

                    property_location: temp_array.locality,

                    image_path: temp_array.images.length != 0 ? AWS_URL + temp_array.images[0].image_path : null,

                    carousel_images: carousel_images ,//temp_array.images.length != 0? temp_array.images: [],

                    carousel_images_base: carousel_images_base,

                    resource_plan: temp_array.resource_plan,

                    amenity: temp_array.amenity,

                    addons: addons,

                    latitude: temp_array.latitude,

                    longitude: temp_array.longitude,



                    //short_desc: temp_array.short_desc,

                    long_desc: temp_array.long_desc,



                }, () => {

                    this.getMeetingSpacesNearby()

                    // //console.log('api data : ', this.state.API_DATA)

                });

                let ratingCount = this.state.reviewRatings;

                this.state.reviews.forEach((review, index)=>{

                    switch(review.rating){
                        case 1: ratingCount[0] = ratingCount[0] + 1;
                        this.setState({
                            reviewRatings: ratingCount,
                        })
                        break;
                        case 2: ratingCount[1] = ratingCount[1] + 1;
                        this.setState({
                            reviewRatings: ratingCount,
                        })
                        break;
                        case 3: ratingCount[2] = ratingCount[2] + 1;
                        this.setState({
                            reviewRatings: ratingCount,
                        })
                        break;
                        case 4: ratingCount[3] = ratingCount[3] + 1;
                        this.setState({
                            reviewRatings: ratingCount,
                        })
                        break;
                        case 5: ratingCount[4] = ratingCount[4] + 1;
                        this.setState({
                            reviewRatings: ratingCount,
                        })
                        break;
                    }
                })

                let imageURI= []

                imagefiles[0].allImages.forEach((image, index)=>{
                    console.log(image)
                    imageURI.push({ uri: image.path});
                })
                this.setState({
                    allImages: imageURI
                })

            }

            else {

                CommonHelpers.showFlashMsg("Try Again!", "danger");

            }



        })

    }



    getMeetingSpacesNearby = async () => {



        var params = {

            "latitude": this.state.API_DATA[0].latitude,

            "longitude": this.state.API_DATA[0].longitude,

            "resource_group_id": [],//this.state.selectedSearchCategories,

            "is_meeting_space": 1

        };



        getPropertyListAPI(params, PROPERTY_LIST).then(async (result) => {

            ////////console.log("from " + this.props.route.params.name + "search results: ", result.pagesData);



            if (result.status) {

                //console.log('length: before', result.dataArray.length)

                let mapMarkers = []



                result.dataArray.map((item, index) => {

                    //console.log('item', item);

                   /*  if (item.id == this.state.API_DATA[0].id) {

                        //console.log('index to splice ', index)

                        result.dataArray.splice(index, 1);

                        //console.log('length: after', result.dataArray.length)

                    } */



                    const mapItem = {

                        coordinate: {

                            latitude:parseFloat(item.latitude),

                            longitude: parseFloat(item.longitude),

                        },

                        imageURL: item.images.length == 0 ?require('./../Assets/images/BRHlogoorange.png') : {uri:CommonHelpers.processRawImages(item.images)[0].url},

                        item: item

                    }



                    mapMarkers.push(mapItem);







                })



                ////console.log('Results: ', JSON.stringify(result.pagesData));

                this.setState({

                    meetingSpacesNearby: result.dataArray,

                    mapMarkers: mapMarkers,

                });

            }





            else {

                //////console.log('No results  ***')

                this.setState({

                    meetingSpacesNearby: []

                })

                CommonHelpers.showFlashMsg(result.message, "danger");

            }

            this.setState({

                spinner: false,

                refreshing: false

            });



        })



    }



    _renderImageItem = ({ item, index }) => {

        return (

            <TouchableWithoutFeedback

                onPress={() => {

                    this.setState({

                        image_path: AWS_URL + item.image_path,

                    })

                }}

            >

                <View style={renderItem.smallView}>

                    <Image

                        style={[image.imageCover, image.carouselImage]}

                        source={{ uri: AWS_URL + item.image_path }} />

                </View>

            </TouchableWithoutFeedback>

        );

    }



    _renderReservationPlans = ({ item, index }) => {

        ////console.log(" Reservation plans: ", item,  AWS_URL + item.image_path[0].image_path)

        return (

            <TouchableWithoutFeedback>



                <RectangleCard

                    details={item}

                    from='meetingdetails'

                    onPress={() => { 

                        //console.log('clicked')

                        this.bookNow(item) }}

                    source={item.image_path.length != 0 ? { uri: AWS_URL + item.image_path[0].image_path } : require("./../Assets/images/workplace.jpg")}

                    buttonTitle={item.is_only_request_booking == 1 ? 'REQUEST NOW' : "BOOK NOW"}

                />



            </TouchableWithoutFeedback>

        );

    }



    bookNow = async(item) => {
        console.log(" booked: " + JSON.stringify(this.state.API_DATA));
    
        const bookingData = {
          cost: item.price,
          image_path: item.image_path == null ? null : AWS_URL + item.image_path[0].image_path,
          property_location: this.state.property_location,
          property_name: this.state.property_name,
          id: item.id,
          // rating: this.state.images[0].rating,
    
          //duration: item.duration, //for the booking details page.
          plan_name: item.plan_name, // for the booking details page. 
    
          property_info: this.state.API_DATA,
          resource_plan_details: item,
    
        }
        //console.log(bookingData);
    
        this.state.isLogin?
        this.props.navigation.push('booking', {
          bookingData: bookingData,
        })
        :
        (
          await Session.setWorkSpaceDetails(JSON.stringify(bookingData)),
          this.props.navigation.push('auth', {
            screen: 'Login',
          })
        )
    
      }



    _renderAminities = ({ item, index }) => {

        //////console.log(JSON.stringify(item));

        //console.log(item)

        return (

            <View /* width = {40} */ style={{

                width: 80,

                height: 80,

                marginRight: 10,

                //padding: "2%" , 

                justifyContent: "center"

            }}>



                {<AminityCard details={item} from={'meetingdetails'}

                    source={{ uri: AWS_URL + item.icon_path }}

                //iconName={item.icon} 

                />}

            </View>

        );

    }



    _renderAddons = ({ item, index }) => {

        //////console.log(JSON.stringify(item));

        //console.log(item)

        return (

            <View width = {Dimensions.get('window').width/4} style={{

                //flex: 1,

                margin: '2%',

                padding: "1%",

                justifyContent: "center"

            }}>



                {<AminityCard details={item} from={'meetingaddons'}

                    source={{ uri: AWS_URL + item.icon_path }}

                //iconName={item.icon} 

                />}

            </View>

        );

    }



   
    _renderSimilarProperties = ({ item, index }) => {

        return (

            <SimilarPropertiesCard

                from="detail"

                imageList={item.images}

                iconName='heart'

                isLogin= {this.state.isLogin}

                iconColor='orange'

                contentdetails={

                    <View style={[box.detailsBox]}>

                        <View style={{ flexDirection: "row", marginBottom: "2%" }}>

                            {

                                item.amenities.map((item, index) => {

                                    return (

                                        <View key={index} style={{ flexDirection: "row", marginRight: "5%" }}>

                                            <Icon name={item.icon}

                                                size={20}

                                                style={[{ marginRight: 10 }, color.blackColor]}

                                            />

                                            <Text style={[font.semibold, font.sizeMedium]}>{item.name}</Text>

                                        </View>

                                    );

                                })

                            }

                        </View>

                        <View style={{//backgroundColor: "pink", 

                            margin: "2%",

                        }}>

                            <Text

                                style={[color.orangeColor,

                                font.regular,

                                font.sizeLarge]}>

                                Max Capacity {item.capacity}

                            </Text>

                        </View>

                        <View style={{ flex: 1 }}>

                            <View style={{ flexDirection: "row" }}>

                                <Text

                                    style={[font.regular,

                                    font.sizeLarge,

                                    color.blackColor, { marginRight: 20 }]}>

                                    {item.propertyName}

                                </Text>

                                <View style={{ marginTop: 5, flex: 0.5 }}>

                                    <StarRatingComponent rating={item.rating} />

                                </View>



                            </View>

                            <View style={{ flexDirection: "row", marginBottom: "2%" }}>

                                <Text style={[font.bold, font.sizeLarge, color.blackColor, { marginRight: 15 }]}>

                                    {item.price}

                                </Text>

                                <Text style={[font.regular,

                                font.sizeMedium,

                                color.darkgrayColor]}>

                                    {item.reservationType}

                                </Text>

                            </View>

                            <Text

                                style={[font.regular,

                                font.sizeMedium,

                                color.darkgrayColor, { marginBottom: "1%" }]}>

                                {item.location}, {item.city}

                            </Text>

                            <Text style={[font.regular, font.sizeMedium, color.blackColor, { flex: 1, }]}>

                                {item.description}

                            </Text>



                        </View>



                    </View>

                } />

        );

    }

    _renderSimilarPlans = ({ item, index }) => {

        return (

            <SimilarPropertiesCard

                from="detail"

                imageList={item.images}

                iconName='heart'

                isLogin= {this.state.isLogin}

                iconColor='orange'

                contentdetails={

                    <View style={[box.detailsBox]}>

                        <View style={{ flex: 1 }}>

                            <View style={{ flexDirection: "row", marginBottom: "2%" }}>

                                <Text style={[font.bold, font.sizeExtraLarge, color.blackColor, { marginRight: 15 }]}>

                                    {item.price}

                                </Text>

                                <Text style={[font.regular,

                                font.sizeMedium,

                                color.darkgrayColor, { marginTop: "1%" }]}>

                                    {item.reservationType}

                                </Text>

                            </View>

                            <View style={{ flexDirection: "row", flex: 1 }}>

                                <Text

                                    style={[font.regular,

                                    font.sizeLarge,

                                    color.blackColor, { marginRight: 20 }]}>

                                    {item.propertyName}

                                </Text>

                                <View style={{ marginTop: 5, flex: 0.5 }}>

                                    <StarRatingComponent rating={item.rating} />

                                </View>



                            </View>



                            <Text

                                style={[font.regular,

                                font.sizeMedium,

                                color.darkgrayColor, { marginBottom: "1%", flex: 0.7 }]}>

                                {item.location}, {item.city}

                            </Text>

                            <Text style={[font.regular, font.sizeMedium, color.blackColor, { flex: 1, }]}>

                                {item.description}

                            </Text>



                        </View>

                        <View style={{ flexDirection: "row", marginBottom: "2%" }}>

                            {

                                item.amenities.map((item, index) => {

                                    return (

                                        <View key={index} style={{ flexDirection: "row", marginRight: "5%" }}>

                                            <Icon name={item.icon}

                                                size={20}

                                                style={[{ marginRight: 10 }, color.blackColor]}

                                            />

                                            <Text style={[font.semibold, font.sizeMedium]}>{item.name}</Text>

                                        </View>

                                    );

                                })

                            }

                        </View>



                    </View>

                } />

        );

    }



    //Closes or opens a section.

    collapse = (section) => {

        switch (section) {

            case "reservations":

                //////console.log(this.state.collapseResevations)

                this.setState({

                    collapseResevations: !(this.state.collapseResevations),

                });



                break;



            case "amenities":

                this.setState({

                    collapseAmenities: !(this.state.collapseAmenities),

                })

                break;



            case "description":

                this.setState({

                    collapseDescription: !(this.state.collapseDescription),

                })

                break;



            case "reviews": this.setState({

                collapseReviews: !(this.state.collapseReviews),

            });

                break;

            case "othermeetings": this.setState({

                collapseotherMeetings: !(this.state.collapseotherMeetings),

            });

                break;

            case "addons": this.setState({

                collapseAddons: !(this.state.collapseAddons),

            });

                break;

            case "map": this.setState({

                collapseMap: !(this.state.collapseMap),

            });

                break;

            case "support": this.setState({

                collapseSupport: !(this.state.collapseSupport),

            });

                break;



        }

    }



    goBack = () => {

        this.props.navigation.goBack();



        return true;

    }



    _handleShare = async () => {

        ////console.log(this.state.carousel_images_base.length);

        const shareOptions = {

            message: "test message",

            urls: this.state.carousel_images_base,

        }



        try {

            const share = await Share.open(shareOptions);



        } catch (error) {

            ////console.log("Share Error", error)

        }

    }

    closeControlPanel = () => {

        this._drawer.close()

    };

    openControlPanel = () => {

        this._drawer.open()

    };



    renderNearByMeetingSpaces = ({ item, index }) => {

        console.log('nearby ********',item)

        return (

            <TouchableOpacity onPress={() => {

                

                this._getPropertyInfo(Number(item.id));

            }}>

                <MeetingCard

                    from={'details'}



                    source={item.images.length != 0 ? { uri: AWS_URL + item.images[0].image_path } : require('./../Assets/images/BRHlogoorange.png')}

                    resource_name={item.resource_name.toString().trim()}



                />

            </TouchableOpacity>



        );

    }

    calladdToWishlist =async(resource_id)=>{

        //console.log('added to wishlist');



        const params ={

            "user_id" : Number(await Session.getUserId()),

            "resource_id" : resource_id,

            "is_workspace" : 0,

            "status" : 1

        }



        addToWishlist(params, ADD_TO_WISHLIST).then(result=>{

            console.log('wishlist status: ', result.status, result);

            CommonHelpers.showFlashMsg(result.message, 'danger');

            if(result.status && result.message == 'Removed from Favourite'){
                this.setState({
                    fillHeart: false
                })
            }else if(result.status && result.message == 'Added to Favourite'){
                this.setState({
                    fillHeart: true
                })
            }
        })

    }

    _renderReviews = ({ item, index }) => {
        console.log('to render', item.rating)
        return (
    
          <ReviewCard
            source={item.image}
            name={item.name}
            date={item.dateofreview}
            review={item.review}
            rating = {item.rating}
    
          />
    
        );
      }

      _renderParameters = ({ item, index }) => {
        return (
          <View style={{ flexDirection: "row", marginBottom: 20, justifyContent: "flex-start" }}>
            <View style = {{width: "50%" }}>
            <Text style = {[font.semibold, font.sizeRegular, color.blackColor]}>{item.name}</Text>
            </View >
            <View style = {{width: "30%",}}>
            {
              (Platform.OS === 'android') ?
                (
                  <ProgressBar styleAttr="Horizontal"
                    indeterminate={false}
                    progress={item.score/5}
                    color= "#f45b1e" 
                    style = {[styles.headerText, {width: "100%"}]} />
                ) :
                (<ProgressView
                  progressTintColor="orange"
                  trackTintColor="blue"
                  progress={item.score/5} />)
            }
            </View>
            <View style = {{width: "10%", marginLeft: 20}}>
            <Text style = {[font.semibold, font.sizeVeryRegular, color.blackColor]}>{item.score}</Text>
            </View>
          </View>
        );
      }



    render() {

        return (

            <Drawer

                ref={(ref) => this._drawer = ref}

                type="overlay"

                content={

                <Sidemenu navigation={this.props.navigation} />}

                tapToClose={true}

                openDrawerOffset={0.2} // 20% gap on the right side of drawer

                panCloseMask={0.2}

                closedDrawerOffset={-3}

                //styles={drawerStyles}

                side='right'

                tweenHandler={(ratio) => ({

                    main: { opacity: (2 - ratio) / 2 }

                })}

            >

                <View style={styles.parent}>

                    {this.state.spinner ? <Spinner /> :



                        <ScrollView contentContainerStyle={{ flexGrow: 1, }}>





                            <View style={styles.mainImageCard}>

                                <View width="100%">
                                    <View>

                                        <Slideshow

                                            dataSource={this.state.carousel_images}
                                            position= {this.state.position}
                                            
                                            onPositionChanged={(position)=>{
                                                console.log(position);
                                                this.setState({
                                                    position: this.state.position === this.state.carousel_images.length ? 0 : this.state.position +1,
                                                })
                                            }}

                                            height={400}

                                            containerStyle={image.imageCover}

                                        />

                                    </View>





                                    <TouchableOpacity style={[renderItem.topLeftView, {

                                        backgroundColor: "rgba(80,80,80,0.01)",

                                        alignItems: 'center',

                                        height: 80

                                    }]}

                                        onPress={() => this.goBack()}  >

                                        <Icon

                                            name="angle-left"

                                            color={color.myOrangeColor.color}

                                            size={60} />

                                    </TouchableOpacity>



                                    <TouchableOpacity style={[renderItem.topRightView, {

                                        backgroundColor: "rgba(80,80,80,0.01)",

                                        top: 30, right: this.state.isLogin ? 70: 20

                                    }]}

                                        onPress={() => {

                                            this._handleShare();



                                        }} >

                                        {<Icon2

                                            name="share"

                                            color={color.myOrangeColor.color}

                                            size={30} />}

                                    </TouchableOpacity>
                                    {
                                        this.state.isLogin ? 
                                    

                                    <TouchableOpacity style={[renderItem.topRightView, {

                                        backgroundColor: "rgba(80,80,80,0.01)",

                                        top: 30, right: 20

                                        }]}

                                            onPress={() => {
                                                this.calladdToWishlist(Number(this.state.API_DATA[0].resource_id))

                                                 //this._handleShare();



                                        }} >
                                                {<Icon

                                                     name={this.state.fillHeart ?"heart": 'heart-o'}

                                                     color={color.myOrangeColor.color}

                                                        size={30} />}

                                        </TouchableOpacity>
                                     :null}


                                    {/* <View style={{ backgroundColor: "rgba(80,80,80,0.001)", height: 100, paddingLeft: "2%", justifyContent: "space-evenly", marginTop: "-30%"  }}>

                                        <Text style={[font.semibold, font.sizeLarge, font.textWhiteColor,  ]}>

                                            {this.state.property_name}

                                        </Text>

                                        <Text style={[font.regular, font.sizeRegular, font.textWhiteColor,]}>{this.state.property_location}</Text>

                                        <View style={styles.viewIcons}>

                                            <TouchableOpacity onPress={() => {

                                                this._handleShare();

                                            }}>

                                                <Icon

                                                    name='share-alt'

                                                    size={20}

                                                    style={styles.share}

                                                    color="#fff"

                                                />

                                            </TouchableOpacity>

                                            <Icon

                                                name='heart-o'

                                                size={20}

                                                style={styles.heart}

                                                color="#fff"

                                            />

                                        </View>



                                    </View> */}



                                </View>

                            </View>


                            {/* info section */}

                            <View style={{

                                margin: '2%',

                                //backgroundColor: 'pink'

                            }} height={80}>

                                <View style={[box.horizontalBox]}>

                                    <Text style={[

                                        font.bold,

                                        color.darkgrayColor,

                                        font.sizeLarge,

                                    ]}>{this.state.API_DATA.length != 0 ? this.state.API_DATA[0].resource_name : null}</Text>



                                    {<TouchableOpacity  onPress ={()=>{

                                        this.setState({

                                            showMaps: true,

                                        })

                                    }} >

                                        <MapIcon name = 'map-marked' size = {20}/>

                                    </TouchableOpacity>}



                                </View>

                                <View style={{

                                    flexDirection: 'row',

                                    justifyContent: 'space-between', /* marginTop :10 */

                                }}>



                                    <Text style={[

                                        font.regular,

                                        font.sizeVeryRegular,

                                        color.myOrangeColor

                                    ]}>{this.state.property_name.toUpperCase()}</Text>

                                    <View style={{

                                        flexDirection: 'row', //marginRight: 10

                                    }}>

                                        {

                                            this.state.API_DATA.length != 0 && this.state.API_DATA[0].property_timings.map((day, index) => {

                                                return (

                                                    <Text style={[

                                                        font.regular,

                                                        font.sizeVeryRegular,

                                                        day.is_open == 1 ? color.myOrangeColor : color.grayColor,

                                                        {

                                                            paddingLeft: 5

                                                        }

                                                    ]}>{CommonHelpers.getDay(day.day_code)}</Text>

                                                );



                                            })

                                        }



                                    </View>





                                </View>



                                <View style={[box.horizontalBox]}>

                                    <Text style={[

                                        font.regular,

                                        font.sizeSmall,

                                        color.grayColor,



                                    ]}>{this.state.API_DATA.length != 0 ? this.state.API_DATA[0].locality : null}, {' '}

                                        {this.state.API_DATA.length != 0 ? this.state.API_DATA[0].city != null ? this.state.API_DATA[0].city.name : null : null}</Text>

                                    <Text style={[

                                        font.regular,

                                        font.sizeSmall,

                                        color.grayColor,



                                    ]}>{this.state.API_DATA.length != 0 ? this.state.API_DATA[0].start_at + ' to ' + this.state.API_DATA[0].end_at : null}</Text>

                                </View>









                            </View>



                            {/* info section ends */}





                            {/* Section Amenities Starts */}

                            <SectionHeader

                                onPress={() => { this.collapse("amenities") }}

                                title="AMENITIES"

                                from={'meetingdetails'}

                                iconName={this.state.collapseAmenities ? 'angle-right' : 'angle-up'} />



                            <Collapsible collapsed={this.state.collapseAmenities}

                                align="center">

                                <View style={styles.aminitiesView} height={100/* Math.ceil(this.state.amenity.length / 4) * 90 + 40 */}>

                                    <FlatList

                                        data={this.state.amenity}

                                        renderItem={this._renderAminities}

                                        horizontal={true}

                                        showsHorizontalScrollIndicator={false}

                                    /* numColumns={4}

                                    columnWrapperStyle={{ justifyContent: "center" }} */

                                    />

                                </View>

                            </Collapsible>

                            {/* Section Amenities ends */}



                            {/* Section Reservation Starts */}

                            <SectionHeader

                                onPress={() => { this.collapse("reservations") }}

                                title="RESERVATION PLANS"

                                from='meetingdetails'

                                iconName={this.state.collapseResevations ? 'angle-right' : 'angle-up'}

                            />

                            {
                                this.state.resource_plan.length == 0 ? <Text style={[font.semibold, font.regular, color.darkgrayColor, { marginLeft: "5%" }]}>No Reservation plans Available for this property.</Text> :

                                    <Collapsible

                                        collapsed={this.state.collapseResevations}

                                        align="center"

                                    >

                                        <View style={styles.carouselView}>

                                            <FlatListComponent

                                                data={this.state.resource_plan}

                                                renderItem={this._renderReservationPlans}

                                                horizontal={true}

                                            />

                                        </View>

                                    </Collapsible>

                            }

                            {/* Section Reservation Ends*/}


                            {/* Section Add ons Starts */}

                            <SectionHeader

                                onPress={() => { this.collapse("addons") }}

                                title="ADD ONS AVAILABLE"

                                from='meetingdetails'

                                iconName={this.state.collapseAddons ? 'angle-right' : 'angle-up'}

                            />



                            {



                                this.state.addons.length == 0 ?

                                    <Collapsible collapsed={this.state.collapseAddons}

                                        align="center">

                                        <Text style=

                                            {[

                                                font.semibold,

                                                font.regular,

                                                color.darkgrayColor,

                                                {

                                                    marginLeft: "5%"

                                                }]}>No add-ons available for this property.</Text>



                                    </Collapsible>

                                    :

                                    <Collapsible collapsed={this.state.collapseAddons}

                                        align="center">

                                        <View style={[styles.aminitiesView,]} height={Math.ceil(this.state.amenity.length / 4) * 30 + 40}>

                                            <FlatList

                                                data={this.state.addons}

                                                renderItem={this._renderAddons}

                                                horizontal={false}

                                                showsHorizontalScrollIndicator={false}

                                                numColumns={3}

                                                columnWrapperStyle={{ justifyContent: 'flex-start' }}

                                            />

                                        </View>

                                    </Collapsible>

                            }

                            {/* Section Add ons Ends*/}



                            {/* Near by spaces for meeting. */}

                            {

                                this.state.meetingSpacesNearby.length != 0 ?

                                    <SectionHeader

                                        onPress={() => { this.collapse("othermeetings") }}

                                        title="OTHER MEETING SPACES"

                                        from={'meetingdetails'}

                                        iconName={this.state.collapseotherMeetings ? 'angle-right' : 'angle-up'} />
                                    : null



                            }

                            {

                                this.state.meetingSpacesNearby.length != 0 ?

                                    <Collapsible

                                        collapsed={this.state.collapseotherMeetings}

                                        align="center"

                                        style={{ marginBottom: 10 }}

                                    >

                                        <View height={180}>



                                            <FlatList

                                                data={this.state.meetingSpacesNearby}

                                                renderItem={this.renderNearByMeetingSpaces}

                                                horizontal={true}

                                                showsHorizontalScrollIndicator={false}

                                            />

                                        </View>

                                    </Collapsible>
                                    : null



                            }


                            {/* Maps */}

                            <SectionHeader

                                onPress={() => { this.collapse("map") }}

                                title="LOCATION"

                                from='meetingdetails'

                                iconName={this.state.collapseMap ? 'angle-right' : 'angle-up'}

                            />



                            {

                                <Collapsible

                                    collapsed={this.state.collapseMap}

                                    align="center"

                                >

                                    <View style={{

                                        height: 200,

                                        width: 400,

                                        justifyContent: 'center'

                                        //marginRight: -20,

                                        //justifyContent: 'flex-end',

                                        //alignItems: 'center',

                                    }}>

                                        {

                                            this.state.latitude != null && this.state.longitude !=null?

                                        

                                        <MapView

                                            provider={PROVIDER_GOOGLE}

                                            style={{

                                                width: Dimensions.get('screen').width,

                                                height: 200,

                                                marginBottom: 10,





                                            }}

                                            initialRegion={{

                                                latitude: parseFloat(this.state.latitude),

                                                longitude: parseFloat(this.state.longitude),

                                                latitudeDelta: 0.015,

                                                longitudeDelta: 0.0121,

                                            }}

                                            showUserLocation={true} >

                                            <Marker coordinate={{

                                                latitude: parseFloat(this.state.latitude),

                                                longitude: parseFloat(this.state.longitude),

                                            }}

                                                pinColor={color.myOrangeColor.color} />

                                        </MapView>: null

                                        }

                                    </View>



                                </Collapsible>

                            }


                            {/* Section Property Details begins */}



                            <SectionHeader

                                onPress={() => { this.collapse("description") }}

                                title="PROPERTY INFORMATION"

                                from='meetingdetails'

                                iconName={this.state.collapseDescription ? 'angle-right' : 'angle-up'}

                            />

                            {

                                <Collapsible

                                    collapsed={this.state.collapseDescription}

                                    align="center"

                                    style={{ marginBottom: 10 }}

                                >

                                    <View height={this.state.long_desc.split(' ').length / 6 * 12 + 10}>



                                        <Text style={[

                                            color.darkgrayColor,

                                            font.regular,

                                            font.sizeVeryRegular,

                                            font.textJustify, { marginLeft: 20, marginRight: 20 }]}

                                            ellipsizeMode="tail"



                                            numberOfLines={Math.ceil(this.state.long_desc.split(" ").length / 6)}

                                        >

                                            {this.state.long_desc}

                                        </Text>

                                    </View>

                                </Collapsible>



                            }

                            {/* Section property details ends*/}


                             {/** section reviews begin */}
             
         <SectionHeader onPress={() => { this.collapse("reviews") }}
            title="REVIEWS & RATINGS"
            from='meetingdetails'
            iconName={this.state.collapseReviews ? 'angle-right' : 'angle-up'}
          />
          <Collapsible collapsed={this.state.collapseReviews}
            align="center" style={{ width: "99%", alignContent: "center" }}>
            <View>
              {<View style={styles.sectionHeader}>

                <View style={[styles.reviewRatingView, {
                  
                }]}>
                  {<Text
                    style={[font.bold, font.sizeExtraLarge,
                    styles.headerText,
                    color.darkgrayColor]}>
                    
                    {imagefiles[0].rating}
                  </Text>}
                  <Icon
                    name='star'
                    size={18}
                    style={[color.yellowColor,
                    styles.starMargin, {
                        alignSelf: 'center'
                    }]}
                  />
                  <Text style={[font.bold,
                  font.sizeLarge,
                  styles.headerText,
                  color.darkgrayColor]}>
                    ({this.state.reviews.length} Reviews)
                  </Text>
                </View>
                <View /* style={[styles.reviewRatingView]} */>
                    {

                        this.state.reviewRatings.map((rating, index)=>{
                           
                                const sum = this.state.reviewRatings.reduce((partialSum, a)=>partialSum+a, 0);
                                const progress =(rating/sum) *100;
                                console.log(typeof progress)
                            return(
                                <View style={{ flexDirection: "row", marginBottom: 20, justifyContent: "center" }}>
            <TouchableOpacity 
            onPress = {
                ()=>{
                    this.collapse("reviews")

                    let showReviews = [];
                    let allReviews = this.state.allReviews;

                    allReviews.forEach((review, i)=>{
                        console.log(review.rating, index+1);
                        if( review.rating == (index+1) ){
                            console.log(review.name)
                            showReviews.push(review);
                           
                        }
                    })
                    this.setState({
                        reviews: showReviews,
                    }, ()=>{
                        this.collapse("reviews")
                    })
                }
            }
            style = {{width: "50%",
         }}>
            <Text style = {[font.semibold, 
            font.sizeRegular, color.blackColor, {
                textAlign: 'center',
                textDecorationLine: 'underline',
            }]}>{index +1} Star</Text>
            </TouchableOpacity >
            <View style = {{width: "30%",}}>
            {
              (Platform.OS === 'android') ?
                (
                  <ProgressBar styleAttr="Horizontal"
                    indeterminate={false}
                    progress={ isNaN(progress) ? 0: progress/100}
                    color= "#f45b1e" 
                    style = {[styles.headerText, {width: "100%"}]} />
                ) :
                (<ProgressView
                  progressTintColor="orange"
                  trackTintColor="blue"
                  progress={ isNaN(progress) ? 0: progress/100} />)
            }
            </View>
            <View style = {{width: "10%", marginLeft: 20}}>
            <Text
             style = {[
                font.semibold, 
                font.sizeVeryRegular, 
                color.blackColor]}>
                    {progress}%</Text>
            </View>
          </View>
                            );
                        })
                    }

                    <TouchableOpacity onPress= {()=>{
                        this.collapse("reviews");
                        this.setState({
                            reviews: this.state.allReviews
                        }, ()=>{
                            this.collapse("reviews")
                        })
                    }}>
                        <Text style = {[font.regular, 
                        font.sizeVeryRegular, 
                        color.darkgrayColor, 
                        {
                            textAlign: 'right', 
                            textDecorationLine: 'underline'

                        }
                    ]}>
                        Show All Reviews

                        </Text>
                    </TouchableOpacity>
                  
                </View>
              </View>}

              {
                this.state.allImages.length != 0 && 
                <View style = {[box.centerBox]}>
                    <TouchableOpacity onPress = {()=>{
                        this.setState({
                            showReviewImages: true
                        })
                    }}>
                        <Text 
                        style = {[font.regular, 
                        font.sizeVeryRegular, 
                        color.darkgrayColor, 
                        {
                            textAlign: 'right', 
                            textDecorationLine: 'underline'

                        }
                    ]}
                        >Expand</Text>
                    </TouchableOpacity>

                <FlatList
                            data={this.state.allImages}
                            renderItem={({item, index})=>{
                                //console.log(item);
                                return(
                                     <TouchableOpacity 
                                     onPress={()=>{
                                        this.setState({
                                            currentReviewImage : index
                                        }, ()=>{
                                            this.setState({
                                                showReviewImages: true
                                            })
                                            
                                        })
                                     }}
                                     style = {{marginLeft: 5}}>
                                <Image 
                                style = {[image.imageContain, image.carouselImage]}
                                source = {item/* {uri: item.path} */}
                                />
                            </TouchableOpacity>

                                );
                            }}
                            horizontal
                            />
                            </View>
              }


              <ScrollView nestedScrollEnabled={true} style={{ maxHeight: 400 }}>
                <View height = {this.state.reviews.length *200}>
                  <FlatList 
                    data={this.state.reviews}
                    renderItem={this._renderReviews}
                    horizontal={false}
                    extraData={this.state.reviews}
                  />
                </View>
              </ScrollView>
            </View>
          </Collapsible>
            {/** section reviews ends */}





                            {/* Section Support begins */}



                            <SectionHeader

                                onPress={() => { this.collapse("support") }}

                                title="SUPPORT TEAM"

                                from='meetingdetails'

                                iconName={this.state.collapseSupport ? 'angle-right' : 'angle-up'}

                            />

                            {

                                <Collapsible

                                    collapsed={this.state.collapseSupport}

                                    align="center"

                                    style={{ marginBottom: 10 }}

                                >

                                    <View height={this.state.supportText.split(' ').length / 6 * 12 + 10}>



                                        <Text style={[

                                            color.darkgrayColor,

                                            font.regular,

                                            font.sizeVeryRegular,

                                            font.textJustify, { marginLeft: 20, marginRight: 20 }]}

                                            ellipsizeMode="tail"



                                            numberOfLines={Math.ceil(this.state.supportText.split(" ").length / 6 + 1)}

                                        >

                                            {this.state.supportText}

                                        </Text>

                                    </View>

                                </Collapsible>



                            }

                            {/* Section Support ends*/}





                            {/* Phase 2 code. */}



                            {/** section reviews begin */}

                            {/*  

         <SectionHeader onPress={() => { this.collapse("reviews") }}

            title="Reviews"

            iconName={this.state.collapseReviews ? 'angle-right' : 'angle-up'}

          />

          <Collapsible collapsed={this.state.collapseReviews}

            align="center" style={{ width: "99%", alignContent: "center" }}>

            <View>

              <View style={styles.sectionHeader}>



                <View style={[styles.reviewRatingView]}>

                  <Text

                    style={[font.bold, font.sizeLarge,

                    styles.headerText,

                    color.darkgrayColor]}>

                    {this.state.images[0].rating}

                  </Text>

                  <Icon

                    name='star'

                    size={18}

                    style={[color.yellowColor,

                    styles.starMargin]}

                  />

                  <Text style={[font.bold,

                  font.sizeLarge,

                  styles.headerText,

                  color.darkgrayColor]}>

                    ({this.state.reviews.length} Reviews)

                  </Text>

                </View>

                <View style={[styles.reviewRatingView]}>

                  <FlatListComponent

                    data={this.state.images[0].parameters}

                    renderItem={this._renderParameters}

                    horizontal={false}

                  />

                </View>

              </View>

              <ScrollView nestedScrollEnabled={true} style={{ maxHeight: 400 }}>

                <View>

                  <FlatListComponent

                    data={this.state.reviews}

                    renderItem={this._renderReviews}

                    horizontal={false}

                  />

                </View>

              </ScrollView>

            </View>

          </Collapsible> */}

                            {/** section reviews ends */}







                            {/** section similar properties begin. */}

                            {/* <SectionHeader title = "Similar Properties"/>

          <View height = {420} 

          onStartShouldSetResponderCapture = {(e) => false}  

          onMoveShouldSetResponderCapture= {(e)=> false }

          >

          <FlatListComponent

                    data={this.state.similarProperties}

                    renderItem={this._renderSimilarProperties}

                    horizontal={true}

                  />

          </View> */}

                            {/** section similar properties ends */}



                            {/** section similar plans begin. */}

                            {/* <SectionHeader title = "Similar Plans"/>

          <View height = {420} 

          onStartShouldSetResponderCapture = {(e) => false}  

          onMoveShouldSetResponderCapture= {(e)=> false }

          >

          <FlatListComponent

                    data={this.state.similarProperties}

                    renderItem={this._renderSimilarPlans}

                    horizontal={true}

                  />

          </View> */}

                            {/** section similar plans ends */}





                        </ScrollView>

                    }



                </View>

                {
                    this.state.showReviewImages && <ImageView
                    images={this.state.allImages}
                    imageIndex={this.state.currentReviewImage}
                    visible={this.state.showReviewImages}
                    animationType={'fade'}
                    keyExtractor={(key)=>{key}}
                    onImageIndexChange = {(index)=>{
                        !this.state.showReviewImages ? 
                        this.setState({
                            currentReviewImage: index
                        }): null

                    }}
                    backgroundColor={color.whiteBackground.backgroundColor}
                    onRequestClose={() => {this.setState({
                        showReviewImages: false,
                    })}}
                  />
                }



                {

                    this.state.showMaps && <Mapping 

                    initialRegion={{

                        latitude: parseFloat(this.state.latitude),

                        longitude: parseFloat(this.state.longitude),

                        latitudeDelta: 0.015,

                        longitudeDelta: 0.0121,

                    }}

                    mapMarkers = {this.state.mapMarkers}

                    navigation={this.props.navigation} 

                    closing={() => { this.onFilterClosed() }} 

                    openDetails = {(item)=>{

                        this.onFilterClosed();

                        console.log('item pressed',item);

                        const params = {



                            'property_id': Number(item.id),

                            'resource_id': Number(item.resource_id)

                        }

                        this._getPropertyInfo(Number(item.id));

                    }}

                    from ={'meetingSpace'}/>

                }

            </Drawer>

        );

    }

}



const styles = StyleSheet.create({

    parent: {

        flex: 1,

        flexDirection: "column",

        //backgroundColor: "red",

        marginTop: "7%",

        //height: "100%"

    },

    mainImageCard: {

        //flex: 2,

        //backgroundColor:"red",

        paddingTop: 0,

        height: 400,

    },

    carouselView: {

        //flex: 1,

        height: 175,

        marginLeft: 1,

        //backgroundColor: "green",

        //marginBottom: 2,



    },

    aminitiesView: {

        width: "95%",

        margin: "2%",

        //alignItems: "center",



    },

    sectionHeader: {

        margin: "2%",

        //flexDirection: "row",

        //padding: 10,

        //backgroundColor: "red",

        marginTop: 0

    },

    headerText: {

        marginRight: 5,

    },

    reviewRatingView: {

        flexDirection: "row",

        margin: "5%",

    },

    starMargin: {

        marginTop: 3,

        marginRight: 15,

    },

    viewIcons: {

        width: 50,

        position: "absolute",

        //top: 5,

        flexDirection: "row",

        flex: 1,

        marginRight: "5%",

        //backgroundColor: "yellow",

        alignItems: "center",

        alignSelf: "flex-end",

        justifyContent: "space-around",

        bottom: 10



    },



})