import React, { Component } from 'react';
import {
    View,
    Text,
    RefreshControl,
    BackHandler,
    Platform,
    TouchableWithoutFeedback,
    Dimensions,
    FlatList,
    Image,
    TouchableOpacity
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import box from '../../Styles/box';
import location from '../../Location/location';
import Session from '../../config/Session';
import { getMeetingResourceGroup, login_check, getPropertyListAPI, getBookinglistAPI } from '../../Rest/userAPI';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import color from '../../Styles/color';
import Icon from "react-native-vector-icons/FontAwesome";
import MapIcon from 'react-native-vector-icons/FontAwesome5';
import ModalScreen from '../ModalScreen';
import CommonHelpers from '../../Utils/CommonHelpers';
import font from '../../Styles/font';

import image from '../../Styles/image';
import { membercurrentbookingapi } from '../../Rest/userAPI';
import moment from 'moment';
import CategoryItem from './Reusables/CategoryItem';
import { AWS_URL, MEETING_PROPERTY_LIST, PROPERTY_LIST, MEMBER_UPCOMING_BOOKING } from '../../config/RestAPI';
import MeetingCard from './Reusables/MeetingCard';
import RectangleCard from '../ReusableComponents/RectangleCard';
import Spinner from '../../Utils/Spinner';
import Mapping from './Reusables/Mapping';

export default class MeetingHome extends Component {
    constructor() {
        super();
        this.state = {
            refreshing: false,
            spinner: false,
            emplogin: 0,
            UserId: '',
            locationPermission: false,
            modalOpen: false,
            searchCategories: [],

            selectedSearchCategories: [],
            meetingSpacesNearby: [],
            popularCity: [{
                name: "Delhi",
                longitude: "77.1025",
                latitude: "28.7041",
                image: "https://static.goindigo.in/content/dam/indigov2/6e-website/destinations/delhi/Delhi-LotusTmple.jpg",
            }, {
                name: "Kolkata",
                longitude: "88.3639",
                latitude: "22.5726",
                image: "https://www.tripsavvy.com/thmb/vOsVUgkBhTmj3lntYNu-qBswRVM=/3668x2751/smart/filters:no_upscale()/victoria-memorial--kolkata--india-1140726002-95549087f08e4bafb44c1a71179a8ceb.jpg",
            },
            {
                name: "Mumbai",
                longitude: "72.8777",
                latitude: "19.0760",
                image: "https://upload.wikimedia.org/wikipedia/commons/b/bc/Mumbai_skyline_BWSL.jpg",
            },
            {
                name: "Bengaluru",
                longitude: "77.5946",
                latitude: "12.9716",
                image: "https://static.toiimg.com/thumb/msid-60290719,width-1200,height-900,resizemode-4/.jpg",
            },
            {
                name: "Chennai",
                longitude: "80.2707",
                latitude: "13.0827",
                image: "https://media.gettyimages.com/photos/high-angle-view-of-sea-and-buildings-against-sky-picture-id1144749579?s=612x612",
            }],
            upcomingBookings: [],
            currentBookings: [],
            isLogin: false,

            showMaps: false,
            mapMarkers: [],
        }
        this.googleInput = React.createRef();
    }

    componentDidMount = async () => {
        this.refresh();
    }

    refresh = async () => {

        this.setState({
            spinner: true
        })

        if (await Session.getUserDetails() != '') {
            if (Number(await Session.getRoleId()) == 7) {
                this.setState({
                    emplogin: 1
                })
            }
            else {
                this.setState({
                    emplogin: 0
                })
            }

            this.backhandler = BackHandler.addEventListener('hardwareBackPress', () => {
                if (this.state.emplogin) {
                    this.props.navigation.push('employeehome');
                    

                    return true;
                }
                else {
                    if(this.state.showMaps) {
                        this.setState({
                            showMaps: false
                        })
                    }
                    else{
                        BackHandler.exitApp();
                    }
                   
                    return true;

                }

            })

            this.setState({
                name: await Session.getUserName(),
                UserId: await Session.getUserId(),
            })

            Platform.OS === 'ios' ?
                location.checkTrackingPermission().then((value) => {
                    if (value) {
                        ////////console.log("Tracking enabled");
                        location.check().then((value) => {
                            this.setState({
                                locationPermission: value,
                            }, async () => {
                                await Session.setLocationPermission(value);
                                if (this.state.locationPermission) {
                                    location.getGeoLocation().then(async (value) => {
                                        await Session.setLocationCoords(value);
                                        this.getMeetingSpacesNearby();
                                    })
                                }
                                else {
                                    location.requestPermission().then(async (value) => {
                                        await Session.setLocationPermission(value);
                                        if (value) {
                                            location.getGeoLocation().then(async (value) => {
                                                await Session.setLocationCoords(value);
                                                this.getMeetingSpacesNearby();
                                            })
                                        } else {
                                            this.setState({
                                                locationPermission: value,
                                            })
                                        }
                                    })
                                }
                            })
                        });
                    }
                    else {
                        location.requestTracking().then((value) => {
                            if (value) {
                                ////////console.log("Tracking enabled");
                                location.check().then(async (value) => {
                                    await Session.setLocationPermission(value);
                                    this.setState({
                                        locationPermission: value,
                                    }, () => {
                                        if (this.state.locationPermission) {
                                            location.getGeoLocation().then(async (value) => {
                                                await Session.setLocationCoords(value);
                                                this.getMeetingSpacesNearby();
                                            })
                                        }
                                        else {
                                            location.requestPermission().then(value => {
                                                if (value) {
                                                    location.getGeoLocation().then(async (value) => {
                                                        await Session.setLocationCoords(value);
                                                        this.getMeetingSpacesNearby();
                                                    })
                                                } else {
                                                    this.setState({
                                                        locationPermission: value,
                                                    })
                                                }
                                            })
                                        }
                                    })
                                });
                            }
                        })
                    }
                })

                :
                location.check().then(async (value) => {
                    await Session.setLocationPermission(value);
                    this.setState({
                        locationPermission: value,
                    }, () => {
                        if (this.state.locationPermission) {
                            location.getGeoLocation().then(async (value) => {
                                await Session.setLocationCoords(value)
                                this.getMeetingSpacesNearby();
                            })
                        }
                        else {
                            location.requestPermission().then(value => {
                                if (value) {
                                    location.getGeoLocation().then(async (value) => {
                                        await Session.setLocationCoords(value)
                                        this.getMeetingSpacesNearby();
                                    })
                                } else {
                                    this.setState({
                                        locationPermission: value,
                                    })
                                }
                            })
                        }
                    })
                });

            login_check().then(async (result) => {
                
                if (!result.status) {
                    this.setState({
                        isLogin: false
                    })
                    this.getSearchCategories();
                }
                else {

                    this.setState({
                        isLogin: true
                    },()=>{
                        if(this.state.isLogin){
                            this._fetchUpcomingBookingData();
                            this. _fetchCurrentBookings();
                        }

                    })
                    this.getSearchCategories();
                   



                }
                this.setState({
                    spinner: false
                })

            }).catch(error => {
                //////////console.log(error)
            })


        }
        else {
            this.setState(
                {
                    spinner: false
                }
            )
            this.getSearchCategories()
        }


    }

    getSearchCategories = () => {
        this.setState({
            spinner: true,
        })
        getMeetingResourceGroup().then(result => {
            if (result.status)
                this.setState({
                    searchCategories: result.dataArray,
                }, async () => {
                    await Session.setMeetingSearchCategories(JSON.stringify(this.state.searchCategories))
                })
            else
                this.setState({
                    searchCategories: [],
                }, async () => {
                    await Session.setMeetingSearchCategories('');
                })
        }).catch(error => {
            CommonHelpers.showFlashMsg(error.message, 'danger');
        })
    }

    getMeetingSpacesNearby = async (showMaps= false) => {
        this.setState({
            spinner: true
        })

        const coords = JSON.parse(await Session.getLocationCoords());

        var params = {
            /* 'longitude': "77.626579",
                'latitude': "12.934533", */
            "latitude": JSON.stringify(coords.coords.latitude),
            "longitude": JSON.stringify(coords.coords.longitude),
            "resource_group_id": [],//this.state.selectedSearchCategories,
            'is_meeting_space': 1,
        };

        getPropertyListAPI(params, PROPERTY_LIST/* MEETING_PROPERTY_LIST */).then(async (result) => {
            

            if (result.status) {
                let mapMarkers = [];

                result.dataArray.map((item, index) => {
                    const mapItem = {
                        coordinate: {
                            latitude: parseFloat(item.latitude),
                            longitude: parseFloat(item.longitude),
                        },
                        imageURL: item.images.length == 0 ? require('./../../Assets/images/BRHlogoorange.png') : { uri: CommonHelpers.processRawImages(item.images)[0].url },//{uri:AWS_URL+ item.images[0].image_path},
                        item: item
                    }
                    mapMarkers.push(mapItem);
                })

                //////console.log('Results: ', JSON.stringify(result.pagesData));
                this.setState({
                    meetingSpacesNearby: result.dataArray,
                    mapMarkers: mapMarkers,
                    showMaps: showMaps
                });
            }


            else {
                console.log('No results  ***')
                this.setState({
                    meetingSpacesNearby: []
                })
                //CommonHelpers.showFlashMsg(result.message, "danger");
            }
            this.setState({
                spinner: false,
                refreshing: false
            });

        })

    }

    _fetchUpcomingBookingData = async () => {
        let user_id = await Session.getUserId();
        var params = {
            "user_id": user_id
        }
        this.setState({
            spinner: true,
        })


        getBookinglistAPI(params, MEMBER_UPCOMING_BOOKING).then((result) => {
            //////////console.log('upcoming bookings status******',result.status);
            this.setState({
                spinner: false,
            });
            if (result.status == true) {
               // console.log("Upcoming Booking: ", JSON.stringify(result.dataArray));
                if (result.dataArray.length == 0) {
                    this.setState({
                        upcomingBookings: [],

                    })
                }
                else {
                   /*  this.setState({
                        upcomingBookings: result.dataArray,
                    }); */

                    let upcomingBookings = []

                    result.dataArray.forEach(element => {
                       // console.log('item to set: ', element, element.is_meeting_space_booking);
                        let days  = 0//element.total_days;

                        if(element.is_meeting_space_booking == 1){
                            //console.log('item to set: ', element, element.is_meeting_space_booking,element.hourly_plan_timings);
                            if(element.hourly_plan_timings.length == 0){
                                while(days < element.total_days){
                                    const booking = {
                                       // is_meeting_space_booking: 1,
                                        property_images: element.property_images,
                                        pseudoname: element.property_details.pseudoname,
                                        locality: element.property_details.locality,
                                        booking_id: element.booking_id,
                                        id: element.id,
                                        plan_name: element.booking_plan_details.plan_name,
                                        date: moment(element.start_date).add(Number(days), 'days'),
                                        start_time: moment(element.start_date).format('hh:mm AA'),
                                        end_time: moment(element.end_date).format('hh:mm AA'),
        
                                    }
        
                                    upcomingBookings.push(booking);
                                    days = days+1;
        
                                }

                            }
                            else{
                                element.hourly_plan_timings.forEach((day)=>{
                                    const booking = {
                                        // is_meeting_space_booking: 1,
                                         property_images: element.property_images,
                                         pseudoname: element.property_details.pseudoname,
                                         locality: element.property_details.locality,
                                         booking_id: element.booking_id,
                                         id: element.id,
                                         plan_name: element.booking_plan_details.plan_name,
                                         date: moment(day.start_date_time),
                                         start_time: moment(day.start_date_time).format('hh:mm A'),
                                         end_time: moment(day.end_date_time).format('hh:mm A'),
         
                                     }
         
                                     upcomingBookings.push(booking);

                                })
                            }
                          

                        }    
                    })
                    this.setState({
                        upcomingBookings: upcomingBookings,
                        spinner: false
                    })
                }
            }
            else {
                if (result.message == "Network Error") {
                    CommonHelpers.showFlashMsg("Network Error, Try Again.", "danger");
                }
                else if (result.message == "Booking not found") {
                    this.setState({
                        data: [],

                    })
                   // CommonHelpers.showFlashMsg("No Upcoming Bookings to show!", "danger");
                }
            }
        })

    }

    componentWillUnmount() {
        if (this.backhandler)
            this.backhandler.remove();
    }

    getLocationThenSearch() {

        location.check().then(async (value) => {
            await Session.setLocationPermission(value);
            this.setState({
                locationPermission: value,
            }, () => {
                if (this.state.locationPermission) {
                    location.getGeoLocation().then(async (value) => {
                        await Session.setLocationCoords(value);
                        let coords = await Session.getLocationCoords();
                        coords = JSON.parse(coords);
                        console.log(coords)
                        this.getMeetingSpacesNearby(true);
                       
                       

                    })
                }
                else {
                    location.requestPermission().then(value => {
                        if (value) {
                            location.getGeoLocation().then(async (value) => {
                                await Session.setLocationCoords(value);
                                let coords = await Session.getLocationCoords();
                                coords = JSON.parse(coords);
                                this.getMeetingSpacesNearby(true);
                                
                                
                            })
                        } else {
                            this.setState({
                                locationPermission: value,
                            });
                            CommonHelpers.showFlashMsg('Location Permissions NOT granted. Cannot fetch nearby properties. ');
                        }
                    })
                }
            })
        });
    }

    openSearchResult = async(param, name, price, openMaps= false) => {
        
        this.setState({
            selectedSearchCategories: []
        })

        await Session.setSelectedAmenityType(JSON.stringify([]));
        await Session.setSelectedPropertyType(JSON.stringify([]));
        await Session.setSelectedResourceType(JSON.stringify([]));
        await Session.setSelectedSortOrder('');
        await Session.setSelectedValuesRange(JSON.stringify([]));

        this.props.navigation.push('meetingsrp', {
            param: param,
            name: name,
            price: price,
            openMaps: openMaps,
        })

        
    }

    //************filter funtions */
    onFilterClosed = () => {

        this.setState({
            modalOpen: false,

        })

    }

    onFilterOpened = () => {
        this.setState({
            modalOpen: true,
        })

    }

    openPropertyDetail = (params, images) => {

        this.props.navigation.push('meetingspacedetail', {
            params: params,
            resource_images: CommonHelpers.processRawImages(images),
        });

        this.setState({
            spinner: false,
        })
    };

    _renderSearchCategories = ({ item, index }) => {
       //console.log(typeof item.resource_group_name);
        return (
            <CategoryItem
                name={item.resource_group_name.toString().trim()}
                onPress={() => {
                    let selected = this.state.selectedSearchCategories;
                    let index = selected.indexOf(item.id)
                    if (index > -1) {
                        selected.splice(index, 1);
                        ////////console.log('removed ',selected);
                        this.setState({
                            selectedSearchCategories: selected
                        })
                    }
                    else {
                        selected.push(/* 'search items', */item.id);
                        this.setState({
                            selectedSearchCategories: selected
                        })
                        ////////console.log('added ',selected);
                    }


                }}
            />

        );


    }

    renderNearByMeetingSpaces = ({ item, index }) => {
        ////console.log(item)
        return (
            <TouchableOpacity onPress={() => {
                const params = {
                    'property_id': Number(item.id),
                    'resource_id': Number(item.resource_id),
                    'is_meeting_space': 1,
                }
                this.openPropertyDetail(params, item.images)

            }}>
                <MeetingCard
                    source={item.images.length != 0 ? { uri: AWS_URL + item.images[0].image_path } : require('../../Assets/images/BRHlogoorange.png')}
                    resource_name={item.resource_name.toString().trim()}
                    price={item.least_plan_price == null ?
                        "--" :
                        Intl.NumberFormat("en-IN").format(item.least_plan_price.price)}
                    unit={item.least_plan_price == null ?
                        "--" :
                        item.least_plan_price.unit.toString().trim()}
                    distance={Math.ceil(item.distance[0].distance)}
                />

            </TouchableOpacity>

        );
    }

    _fetchCurrentBookingData = async () => {

        this.setState({
            spinner: true,
        })
        //let user_id = await Session.getUserId();

        membercurrentbookingapi().then((result) => {
            ////////console.log(" current bookings: ", result.status);
            this.setState({
                spinner: false,
            });

            if (result.status == true) {

                let startTime = CommonHelpers.getMomentTime(moment(result.dataArray[0].start_date));
                let endtime = CommonHelpers.getMomentTime(moment(result.dataArray[0].end_date));
                let currenttime = CommonHelpers.getMomentTime(moment(new Date()));

                if (currenttime.isBetween(startTime, endtime)) {
                    ////////console.log("Property id : ", result.dataArray[0].property_id)
                    this.openScanPage(result.dataArray[0]);

                } else {
                    //this.openScanPage(null);
                    CommonHelpers.showFlashMsg('Please try between ' + moment(result.dataArray[0].start_date).format('HH:mm') + 'Hrs to ' + moment(result.dataArray[0].end_date).format('HH:mm') + 'Hrs.', 'danger')
                }
            }
            else {
               this.openScanPage(null);
               //CommonHelpers.showFlashMsg("No Current Properties to check-in/ check-out.");
            }
        })

        //this.getDocumentList();

    }

    _fetchCurrentBookings = async () => {

        this.setState({
            spinner: true,
        })
        //let user_id = await Session.getUserId();

        membercurrentbookingapi().then((result) => {
            //console.log(" current bookings: ", result.status);
            this.setState({
                spinner: false,
            });

            if (result.status == true) {

                if(result.dataArray.length == 0){
                this.setState({
                    currentbookings: [],//result.dataArray,
                    spinner: false
                })
            }else{
                let currentBookings = []

                result.dataArray.forEach(element => {
                    console.log('current item to set: ', element);
                    let days  = 0//element.total_days;

                    if(element.is_meeting_space_booking == 1){
                        console.log('yay', element.hourly_plan_timings.length == 0)
                        if(element.hourly_plan_timings.length == 0){
                            while(days < element.total_days){
                                console.log(moment(element.start_date).add(Number(days), 'days').isSame(moment(new Date()),'dates'))
                                if(moment(element.start_date).add(Number(days), 'days').isSame(moment(new Date()),'dates')){
                                    console.log('not hourly')
                                    const booking = {
                                       // is_meeting_space_booking: 1,
                                        property_images: element.property_images,
                                        pseudoname: element.property_details.pseudoname,
                                        locality: element.property_details.locality,
                                        booking_id: element.booking_id,
                                        id: element.id,
                                        item: element,
                                        plan_name: element.booking_plan_details.plan_name,
                                        date: moment(element.start_date).add(Number(days), 'days'),
                                        start_time: moment(element.start_date).format('hh:mm A'),
                                        end_time: moment(element.end_date).format('hh:mm A'),
        
                                    }
        
                                    currentBookings.push(booking);
                                    
                                }
                                days = days+1;
                               
    
                            }

                        }
                        else{
                            element.hourly_plan_timings.forEach((day)=>{

                                if(moment(day.start_date_time).isSame(moment(new Date()),'dates')){
                                    const booking = {
                                        // is_meeting_space_booking: 1,
                                         property_images: element.property_images,
                                         pseudoname: element.property_details.pseudoname,
                                         locality: element.property_details.locality,
                                         booking_id: element.booking_id,
                                         id: element.id,
                                         item: element,
                                         plan_name: element.booking_plan_details.plan_name,
                                         date: moment(day.start_date_time),
                                         start_time: moment(day.start_date_time).format('hh:mm A'),
                                         end_time: moment(day.end_date_time).format('hh:mm A'),
         
                                     }
         
                                     currentBookings.push(booking);

                                }

                               

                            })
                        }
                      

                    }    
                })
                this.setState({
                    currentBookings: currentBookings,
                    spinner: false
                })
            }



            }
            /* else {
                CommonHelpers.showFlashMsg("No Current Properties to check-in/ check-out.");
            } */
        })

        

    }
   openScanPage  = (property) => {
        this.props.navigation.push('scanpage', {
            property: property,
           from : 'meetingSpaces',
        })


    }
    openManageBookings = (page) => {
        ////////////console.log("Pressed")
        this.props.navigation.push('TopTabNavigator', {
            screen: page,
        })

    };

    _renderPopularCity = ({ item, index }) => {
        //////////console.log("item", item)
        return (
            <View style={{ height: 130, marginTop: 20 }}>
                <TouchableWithoutFeedback
                    onPress={async() => {
                        const params = this.state.isLogin ?{
                            "latitude": JSON.stringify(item.latitude),
                            "longitude": JSON.stringify(item.longitude),
                            "resource_group_id": this.state.selectedSearchCategories,
                            'is_meeting_space': 1,
                            'user_id': await Session.getUserId(),
                        } :{
                            "latitude": JSON.stringify(item.latitude),
                            "longitude": JSON.stringify(item.longitude),
                            "resource_group_id": this.state.selectedSearchCategories,
                            'is_meeting_space': 1
                        };

                        this.openSearchResult(params, item.name, [])
                    }}>
                    <View style={{ height: 130, width: 130, marginLeft: 20 }}>
                        <Image source={{ uri: item.image }} style={{ flex: 1, width: null, height: null, resizeMode: "cover" }}>
                        </Image>
                        <Text style={[font.semibold, font.sizeRegular, color.textWhiteColor, { top: -25, left: 10 }]}>{item.name}</Text>
                    </View>
                </TouchableWithoutFeedback>
            </View>
        );
    }

    _renderUpcomingBookings = ({ item, index }) => {
        //console.log("_renderUpcomingBookings", item);
        ////console.log( item.is_meeting_space_booking == 1)
        // if(item.is_meeting_space_booking == 1)
        return (
          <TouchableWithoutFeedback onPress={() => { this.props.navigation.push('bookinginformationpage', {
            item: item.id,
            from: 'home'
          }) }}>
            {}
            <View >
              <RectangleCard
                details={item}
                source={item.property_images.length != 0 ? { uri: AWS_URL + item.property_images[0].image_path } : require('../../Assets/images/workplace.jpg')}
                from="upcomingmeeting"
                
              />
            </View>
            
          </TouchableWithoutFeedback>
        ); 

            }

            _renderCurrentBookings = ({ item, index }) => {
                //console.log("_renderCurrentBookings", item);
                ////console.log( item.is_meeting_space_booking == 1)
                // if(item.is_meeting_space_booking == 1)
                return (
                  <TouchableWithoutFeedback onPress={() => { this.props.navigation.push('bookinginformationpage', {
                    item: item.id,
                    from: 'home'
                  }) }}>
                    {}
                    <View >
                      <RectangleCard
                        details={item}
                        source={item.property_images.length != 0 ? { uri: AWS_URL + item.property_images[0].image_path } : require('../../Assets/images/workplace.jpg')}
                        from="currentmeeting"
                        onCheckinPress = {()=>{

                            /* let startTime = CommonHelpers.getMomentTime(moment(item.start_date));
                            let endtime = CommonHelpers.getMomentTime(moment(item.end_date));
                            let currenttime = CommonHelpers.getMomentTime(moment(new Date()));
            
                            if (currenttime.isBetween(startTime, endtime)) { */
                                ////////console.log("Property id : ", result.dataArray[0].property_id)
                                this.openScanPage(item.item);
            
                           /*  } else {
                                CommonHelpers.showFlashMsg('Outside the proeprty checkin window.')
                            } */
            

                        }}
                        
                      />
                    </View>
                    
                  </TouchableWithoutFeedback>
                ); 
        
                    }

                    onMapClosed = () => {



                        this.setState({
                
                            showMaps: false,
                
                        })
                
                    }

    render() {
        return (
            <View style={{ flex: 1 }}>
                <KeyboardAwareScrollView
                    contentContainerStyle={[box.scrollViewCenter, { justifyContent: 'flex-start' }]}
                    keyboardShouldPersistTaps="always"
                    refreshControl={<RefreshControl refreshing={this.state.refreshing} onRefresh={this.refresh} />}
                >

                    {/* Google places API, filter and location pin */}
                    <View
                        style={[

                            color.whiteBackground,

                            {
                                flex: 1,
                                padding: 5,
                                backgroundColor: 'white',
                                marginTop: 10,

                            }
                        ]}
                    >
                        <TouchableWithoutFeedback onPress={() => {

                        }}>



                            <GooglePlacesAutocomplete

                                GooglePlacesDetailsQuery={{ fields: "geometry" }}
                                ref=  {(input)=> {
                                    //console.log('input value',input);
                                    this.googleInput = input
                                //this.googleInput && this.googleInput.clear();
                            }}
                                textInputProps={{ placeholderTextColor: "gray",
                                //clearButtonMode:"always",
                                clearTextOnFocus : true

                            }}
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
                                        width: Dimensions.get('screen').width * 0.8,
                                        backgroundColor: color.lightGray.color,
                                        borderRadius: 10
                                    }, row: {
                                        backgroundColor: 'white',
                                    }, description: { color: "gray" }
                                }}
                                
                                onPress={async(data, details = null) => {
                                    //console.log(data,'--', details);
                                    //this.googleInput && this.googleInput.clear();

                                    var params = this.state.isLogin ?
                                    {
                                        "latitude": JSON.stringify(details.geometry.location.lat),
                                        "longitude": JSON.stringify(details.geometry.location.lng),
                                        "resource_group_id": this.state.selectedSearchCategories,
                                        'is_meeting_space': 1,
                                        'user_id': await Session.getUserId(),
                                    } : {
                                        "latitude": JSON.stringify(details.geometry.location.lat),
                                        "longitude": JSON.stringify(details.geometry.location.lng),
                                        "resource_group_id": this.state.selectedSearchCategories,
                                        'is_meeting_space': 1
                                    };
                                this.openSearchResult(params, data.description, []);
                                    //console.log('inset', this.googleInput)
                                   this.googleInput.clear();
                                    

                                }}
                                onFail={(error) => console.error(error)} />

                        </TouchableWithoutFeedback>

                        <TouchableWithoutFeedback onPress={() => {
                            ////////console.log(this.state.modalOpen);
                            this.onFilterOpened();

                        }}>

                            <Icon name="filter" color="orange" size={25} style={{ alignSelf: "center", paddingLeft: 5, position: "absolute", top: 10, right: 55 }} />


                        </TouchableWithoutFeedback>

                        <TouchableWithoutFeedback onPress={async () => {
                            ////////console.log(await Session.getLocationPermission())
                            if (await Session.getLocationPermission() === 'true') {
                               
                                this.setState({
                                    showMaps: true,
                                })
                            } else {

                                this.getLocationThenSearch();

                            }



                        }}>
                            <MapIcon name="map-marked" color="orange" size={25} style={{ alignSelf: "center", paddingLeft: 5, position: "absolute", top: 10, right: 20 }} />

                        </TouchableWithoutFeedback>

                    </View>

                    {/* Search Categories */}
                    {
                        this.state.searchCategories.length == 0 ? null :
                    

                    <View style={{
                        height: 50,
                        //flex: 1, 
                        //paddingTop: 5,


                    }}>
                        <FlatList
                        keyExtractor = {(item,index)=>{item.id}}
                            data={this.state.searchCategories}
                            renderItem={this._renderSearchCategories}
                            horizontal={true}
                            showsHorizontalScrollIndicator={false}
                        />


                    </View>}

                    {/* MAIN VIEW with desk image and 3 buttons   */}

                    <View style={{ height: 300, flex: 1, flexDirection: "row", marginTop: 10, margin: 5, }}>
                        <View height={"100%"} style={{ flex: 3, padding: 5, height: 300 }}>
                            <Image source={require('./../../Assets/images/girlondesk.png')}
                                style={[image.imageContain, { width: "100%", height: "100%",/*  resizeMode: "cover" */ }]} />
                        </View>

                        <View height={"100%"} style={{ flex: 1, padding: 5 }}>
                            <View style={{/*  flex: 1, */ flexDirection: "row", height: 100 }}>
                                <TouchableOpacity onPress={() => {
                                    this.state.isLogin? this._fetchCurrentBookingData():this.props.navigation.push('auth',{screen: 'Login'});
                                    
                                }}
                                    style={[box.shadow_box, { flex: 1, margin: "4%", alignItems: "center", justifyContent: "center", padding: 5, shadowColor: color.myOrangeColor.color, backgroundColor: "white" }]}>
                                    <Image source={require('../../Assets/images/qrnew.png')}
                                        style={{ width: 30, height: 30, resizeMode: 'contain' }} />
                                    {/* <Icon name="qrcode" size={30} color="orange" /> */}
                                    <Text style={[font.semibold, font.sizeVeryRegular, color.darkgrayColor, { textAlign: "center" }]}>Scan QR</Text>
                                </TouchableOpacity>

                            </View>

                            <View style={{ /* flex: 1, */ flexDirection: "row", height: 100 }}>
                                <TouchableOpacity onPress={() => {
                                    this.state.isLogin?this.openManageBookings(null) :this.props.navigation.push('auth',{screen: 'Login'});

                                    
                                }}
                                    style={[box.shadow_box, { flex: 1, margin: "4%", alignItems: "center", justifyContent: "center", padding: 5, shadowColor: color.myOrangeColor.color, backgroundColor: "white" }]}>
                                    <Image source={require('../../Assets/images/mybookings.png')}
                                        style={{ width: 30, height: 30, resizeMode: 'contain' }} />
                                    {/* <Icon name="calendar" size={30} color="orange" /> */}
                                    <Text style={[font.semibold, font.sizeVeryRegular, color.darkgrayColor, { textAlign: "center" }]}>Manage Booking</Text>
                                </TouchableOpacity>


                            </View>

                            <View style={{ /* flex: 1, */ flexDirection: "row", height: 100 }}>
                                <TouchableOpacity onPress={() => {
                                    this.state.isLogin? this.props.navigation.push('IssuesList'):this.props.navigation.push('auth',{screen: 'Login'});

                                }} style={[box.shadow_box, { flex: 1, margin: "4%", alignItems: "center", justifyContent: "center", padding: 5, shadowColor: color.myOrangeColor.color, backgroundColor: "white" }]}>
                                    <Image source={require('../../Assets/images/issuesnew.png')}
                                        style={{ width: 30, height: 30, resizeMode: 'contain' }} />
                                    {/* <Icon name="warning" size={30} color="orange"
                                    /> */}
                                    <Text style={[font.semibold, font.sizeVeryRegular, color.darkgrayColor, { textAlign: "center" }]}>Manage Issues</Text>
                                </TouchableOpacity>


                            </View>
                           

                        </View>
                    </View>

                    {/* Near by spaces for meeting. */}
                    {
                        this.state.locationPermission && this.state.meetingSpacesNearby.length != 0 ?

                            <View style={{
                                padding: 10,
                                height: 200
                            }} >

                                <Text style={[
                                    font.semibold,
                                    font.sizeMedium,
                                    color.darkgrayColor, {
                                        marginBottom: 10
                                    }

                                ]} >Nearby Spaces for Meetings</Text>

                                <FlatList
                                keyExtractor = {(item,index)=>{item.id}}
                                    data={this.state.meetingSpacesNearby}
                                    renderItem={this.renderNearByMeetingSpaces}
                                    horizontal={true}
                                    showsHorizontalScrollIndicator={false}
                                />

                            </View>

                            : null

                    }

                    {/* Current Meetings */}
                    {
                        this.state.currentBookings.length >0 ?
                       <View height = {280}>
                         <Text style={[ font.semibold,
                                    font.sizeMedium,
                                    color.darkgrayColor, { paddingHorizontal: 20 }]}>
                    Meetings Today
                  </Text>
                        <FlatList
                           data={this.state.currentBookings}
                           renderItem={this._renderCurrentBookings}
                           horizontal={true}
                           showsHorizontalScrollIndicator={false}
                         />


                       </View>:null

                       
                    }

                    {/* search by city starts  */}
                    <View style={{ flex: 1, paddingTop: 20 }}>
                        <Text style={[ font.semibold,
                                    font.sizeMedium,
                                    color.darkgrayColor, { paddingHorizontal: 20 }]}>
                            Meet in a City
                        </Text>

                        <FlatList
                        keyExtractor = {(item,index)=>{index}}
                            data={this.state.popularCity}
                            renderItem={this._renderPopularCity}
                            horizontal={true}
                            showsHorizontalScrollIndicator={false}
                        />
                    </View>

                    



                    {/* Upcoming Meetings */}
                    {
                        this.state.upcomingBookings.length >0 ?
                       <View height = {250}>
                         <Text style={[ font.semibold,
                                    font.sizeMedium,
                                    color.darkgrayColor, { paddingHorizontal: 20 }]}>
                    Upcoming Meetings
                  </Text>
                        <FlatList
                        keyExtractor = {(item,index)=>{item.id}}
                           data={this.state.upcomingBookings}
                           renderItem={this._renderUpcomingBookings}
                           horizontal={true}
                           showsHorizontalScrollIndicator={false}
                         />


                       </View>:null

                       
                    }

                </KeyboardAwareScrollView>
                {this.state.modalOpen && <ModalScreen 
                navigation={this.props.navigation} 
                closing={() => { this.onFilterClosed() }} 
                from ={'meetingSpace'} />}
                {
                    this.state.spinner && <Spinner/>
                }

{
            this.state.showMaps && this.state.mapMarkers.length == 0 && CommonHelpers.showFlashMsg('No Properties to show.')
          }

{

this.state.showMaps && this.state.mapMarkers.length> 0
&& !isNaN( parseFloat(this.state.mapMarkers[0].coordinate.latitude) )
&& !isNaN( parseFloat(this.state.mapMarkers[0].coordinate.longitude) )
&& 
<Mapping

    initialRegion={{

        latitude: parseFloat(this.state.mapMarkers[0].coordinate.latitude),

        longitude: parseFloat(this.state.mapMarkers[0].coordinate.longitude),

        latitudeDelta: 0.015,

        longitudeDelta: 0.0121,

    }}

    mapMarkers={this.state.mapMarkers}

    navigation={this.props.navigation}

    closing={() => { this.onMapClosed() }}

    openDetails={(item) => {

        this.onMapClosed();

        //console.log('item pressed', item);

        const params = {

            'property_id': Number(item.id),

            'resource_id': Number(item.resource_id),

            'is_meeting_space': 1,

        }

        this.openPropertyDetail(params, item.images);

    }}

    from={'meetingSpace'} />

}
                 
            </View>
        );
    }
}