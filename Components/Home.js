// import Base from "../Base";
import React, { Component } from "react";
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  StatusBar,
  Image,
  TouchableWithoutFeedback,
  FlatList,
  TouchableOpacity,
  RefreshControl,
   BackHandler,
   Dimensions
} from "react-native";
import color from "./../Styles/color";
import { getMeetingResourceGroup, getPropertyListAPI, getBookinglistAPI, listofamenitiesapi, login_check,  membercurrentbookingapi, resourcegroupsapi } from "./../Rest/userAPI";
import CommonHelpers from "./../Utils/CommonHelpers";
import font from "./../Styles/font";
import box from "./../Styles/box";
import moment from "moment";
import image from "./../Styles/image";
import Icon from "react-native-vector-icons/FontAwesome";
import MapIcon from 'react-native-vector-icons/FontAwesome5';
import Spinner from "./../UI/Spinner";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import boxStyle from "./../Styles/box";
import RectangleCard from "./ReusableComponents/RectangleCard";
import { similarPropertiesData } from './ReusableComponents/similarPropertiesData';
import Session from './../config/Session';
import SimilarPropertiesCard from './../Components/ReusableComponents/SimilarPropertiesCard'
import { AWS_URL, PROPERTY_LIST, MEMBER_UPCOMING_BOOKING, MEMBER_PREVIOUS_BOOKING, PROPERTY_TYPES, RESOURCE_GROUPS } from "../config/RestAPI";
import location from '../Location/location';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import LogoHeader from "./ReusableComponents/LogoHeader";
import CurrentBookings from "./CurrentBookings";
import ModalScreen from "./ModalScreen";
import Drawer from "react-native-drawer";
import Sidemenu from "../Navigation/Sidemenu";
import CategoryItem from "./MeetingSpaces/Reusables/CategoryItem";
import Mapping from "./MeetingSpaces/Reusables/Mapping";

export default class Home extends React.Component {
  constructor() {
    super();

    this.page = 0;
    this.state = {
      spinner: false,
      delSpinner: false,
      dues: 1,
      emplogin: 0,

      searchPhrase: '',

      locationPermission: false,
      locationCoords: {},

      propertyList: [],
      popularSpace: [{ img: './../Assets/images/mar.png', name: 'hello', address: 'chennai' },
      { img: './../Assets/images/mar.png', name: 'hello', address: 'chennai' },
      { img: './../Assets/images/mar.png', name: 'hello', address: 'chennai' },
      { img: './../Assets/images/mar.png', name: 'hello', address: 'chennai' }],
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
      UpcomingBooking: [],
      previousBooking: [],
      nearByList: [],
      listOfAmenities: [],
      page: 0,
      hasNextPage: false,
      isLoadMore: false,
      isRefreshing: false, //for pull to refresh
      delModalVisible: false,
      actionSheetType: "",
      similarProperties: similarPropertiesData,
      // similarProperties:[],
      name: '',
      UserId: '',
      refreshing: false,

      //****************for filter modal**************
      modalOpen: false,
     

      //Phase 2 code.
      /* distanceParameter: filterParameters[2].distance,
      distanceSelected: null,
      dIndexSel: null, */

     


      enablePagination: false,
      prev_page_url: '',
      next_page_url: '',
      last_page_url: '',
      links: '',
      isLogin: false,
      
      //****************filter parameters end******************

      searchCategories:[],
      selectedSearchCategories: [],
      showMaps: false,
      mapMarkers: [],


    };
    // this.onCloseModel = this.onCloseModel.bind(this);
    // del confirmation
    // this.onDelClicked = this.onDelClicked.bind(this);

    this.selected_bill_id = "";
    this.selected_bill_index = -1;
    this.selected_item = "";

    

    
    
  }

  

  componentDidMount = async () => {
   
    this.refresh();

  }
  componentWillUnmount(){
    if(this.backhandler)
    this.backhandler.remove();
  }


  refresh = async()=>{

    this.setState({
      spinner: true
    })

    if(Number(await Session.getRoleId()) == 7){
      this.setState({
        emplogin: 1
      })
    }
    else{
      this.setState({
        emplogin: 0
      })
    }

    this.backhandler = BackHandler.addEventListener('hardwareBackPress', ()=>{
      if(this.state.emplogin){
        this.props.navigation.push('employeehome');
        /* this.props.navigation.push('SRP', {
          emplogin: 1
        }) */
        
        return true;
      }
      else{
        BackHandler.exitApp();
    return true;

      }
      
    })


   
    // this.state.name = await Session.getUserName();
    this.state.UserId = await Session.getUserId();
    this.state.name = await Session.getUserName();
    //////////console.log("User Id in the Home screen: ", this.state.UserId);


    Platform.OS === 'ios' ?
    location.checkTrackingPermission().then((value)=>{
      if(value){
        ////console.log("Tracking enabled");
        location.check().then((value) => {
          this.setState({
            locationPermission: value,
          }, () => {
            if (this.state.locationPermission) {
              location.getGeoLocation().then((value) => {
                this.setState({
                  locationCoords: value,
                }, () => {
                  this.apiCallPropertyNearBy();
                  ////////console.log("Location Details: ", this.state.locationCoords, this.state.locationPermission);
                })
              })
            }
            else {
              location.requestPermission().then(value => {
                if (value) {
                  location.getGeoLocation().then((value) => {
                    this.setState({
                      locationPermission: value,
                      locationCoords: value,
                    }, () => {
                      this.apiCallPropertyNearBy();
                      // //////console.log("Location Details: ", this.state.locationCoords, this.state.locationPermission);
                    })
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
      else{
        location.requestTracking().then((value)=>{
          if(value){
            ////console.log("Tracking enabled");
            location.check().then((value) => {
              this.setState({
                locationPermission: value,
              }, () => {
                if (this.state.locationPermission) {
                  location.getGeoLocation().then((value) => {
                    this.setState({
                      locationCoords: value,
                    }, () => {
                      this.apiCallPropertyNearBy();
                      ////////console.log("Location Details: ", this.state.locationCoords, this.state.locationPermission);
                    })
                  })
                }
                else {
                  location.requestPermission().then(value => {
                    if (value) {
                      location.getGeoLocation().then((value) => {
                        this.setState({
                          locationPermission: value,
                          locationCoords: value,
                        }, () => {
                          this.apiCallPropertyNearBy();
                          // //////console.log("Location Details: ", this.state.locationCoords, this.state.locationPermission);
                        })
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
    location.check().then((value) => {
      this.setState({
        locationPermission: value,
      }, () => {
        if (this.state.locationPermission) {
          location.getGeoLocation().then(async(value) => {
            await Session.setLocationCoords(value);
            this.setState({
              locationCoords: value,
            }, () => {
              this.apiCallPropertyNearBy();
              ////////console.log("Location Details: ", this.state.locationCoords, this.state.locationPermission);
            })
          })
        }
        else {
          location.requestPermission().then(value => {
            if (value) {
              location.getGeoLocation().then(async(value) => {
                await Session.setLocationCoords(value);
                this.setState({
                  //locationPermission: true,
                  locationCoords: value,
                }, () => {
                  this.apiCallPropertyNearBy();
                  
                  // //////console.log("Location Details: ", this.state.locationCoords, this.state.locationPermission);
                })
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

    login_check().then(async(result) => {
      ////////console.log("login check", result.message, result.status);
     if(!result.status){
       
                this.setState({
                  isLogin: false
                })

                this.getAmenitesList();
                this.getSearchCategories();
              
     }
     else{

      this.setState({
        isLogin:true
      })
      
      this.apiCallPropertyList(false, false);
      this.getAmenitesList();
      this.getSearchCategories();
      

     }

    }).catch(error => {
      //////console.log(error)
    })

  }

  getSearchCategories = () => {
    this.setState({
        spinner: true,
    })
    resourcegroupsapi(RESOURCE_GROUPS).then(result => {
        if (result.status)
            this.setState({
                searchCategories: result.dataArray,
            }, async () => {
              console.log('work space categories: ****', this.state.searchCategories);
                await Session.setWorkSpaceSearchCategories(JSON.stringify(this.state.searchCategories))
            })
        else
            this.setState({
                searchCategories: [],
            }, async () => {
                await Session.setWorkSpaceSearchCategories('');
            })
    }).catch(error => {
        CommonHelpers.showFlashMsg(error.message, 'danger');
    })
}

  getAmenitesList = () => {
    this.setState({
      spinner: true,
    })
    listofamenitiesapi().then(result => {
      console.log(result.dataArray);
      if (result.status) {
        this.setState({
          listOfAmenities: result.dataArray,
        }, () => {
          ////////console.log(this.state.listOfAmenities);
        })
      }
      else {
        if (result.message == "Network Error") {
          CommonHelpers.showFlashMsg("No Network Connection", "danger");
        } else {
          ////console.log(result.message + " -get list of amenities")
         // CommonHelpers.showFlashMsg(result.message + " -get list of amenities", "danger");
        }

      }
    })
  }

  extractKey = ({ id }) => {
    id;
    //////console.log("id: ", id);
  };


  // Property list 
  apiCallPropertyList = (isPulltoRefresh, isLoadMore) => {
    ////////console.log("this.state.page: ", this.state.page);
    if (!isPulltoRefresh && !isLoadMore)
      this.setState({
        spinner: true,
      });
    getPropertyListAPI( {}/* "" */, PROPERTY_LIST).then(
      (result) => {
        this.setState({
          spinner: false,
        });
        ////console.log("getPropertyListAPI ", result.dataArray);

        if (result.status) {
          if (isPulltoRefresh) this.setState({ propertyList: [] });
          this.setState({
            propertyList:
              this.state.page === 0
                ? result.dataArray
                : [...this.state.propertyList, ...result.dataArray],
          });
          // this.setState({ hasNextPage: result.return_id });
        } else {
          if (result.message == "Network Error") {
            CommonHelpers.showFlashMsg("No Network Connection", "danger");
          } else {
            ////console.log("-Property list api",result.message)
            //CommonHelpers.showFlashMsg(result.message + "-Property list api", "danger");
          }
        }
        this.setState({
          isLoadMore: false,
          isRefreshing: false
        });
        if(this.state.isLogin){
          this.apiCallBookinglist(this.state.UserId, MEMBER_UPCOMING_BOOKING, 0);
          this.apiCallBookinglist(this.state.UserId, MEMBER_PREVIOUS_BOOKING, 1);
        }
       

      }
    );
  };

  //only for login

  apiCallBookinglist = (id, url, value) => {
    ////////console.log("this.state.page: ", this.state.page);

    this.setState({
      spinner: true,
    });
    let data = {
      "user_id": id
    }
    getBookinglistAPI(data, url).then(
      (result) => {
        this.setState({
          spinner: false,
        });
        ////console.log("getBookinglistAPI: ", url, result.status);

        if (result.status) {
          if (result.dataArray != undefined && value == 0) {
            this.setState({
              UpcomingBooking: result.dataArray,
              // this.state.page === 0
              //   ? result.dataArray
              //   : [...this.state.UpcomingBooking, ...result.dataArray],
            }, () => { //////console.log("upcoming booking length", this.state.UpcomingBooking.length)
             });
            this.setState({ hasNextPage: result.return_id });

          }
          else if (result.dataArray != undefined && value == 1) {
            ////////console.log("Previous bookings", result.dataArray);
            this.setState({
              previousBooking: result.dataArray,
              // this.state.page === 0
              //   ? result.dataArray
              //   : [...this.state.UpcomingBooking, ...result.dataArray],
            }, () => {
              //////console.log("upcoming booking length", this.state.UpcomingBooking.length)
            });
            this.setState({ hasNextPage: result.return_id });

          }
          //if (isPulltoRefresh) this.setState({ UpcomingBooking: [] });

        } else {
          //////console.log(" check this in booking list ", result.message);
          if (result.message == "Network Error") {
            CommonHelpers.showFlashMsg("No Network Connection", "danger");
          } else if (result.message == "Booking not found") {
            //CommonHelpers.showFlashMsg("No Bookings for you. All Clear", "success");
            //////console.log("No Bookings for you. All Clear");
          }
        }

        this.setState({
          isLoadMore: false,
          isRefreshing: false
        });
      }
    );
    //this.apiCallBookinglist(this.state.UserId, MEMBER_UPCOMING_BOOKING, 0);
    //this.apiCallBookinglist(this.state.UserId, MEMBER_PREVIOUS_BOOKING, 1);
  };

  apiCallPropertyNearBy = (showMaps= false) => {
   
    this.setState({
      spinner: true,
    });

    ////////console.log("Longitude", this.state.locationCoords.coords.longitude, "latitude", this.state.locationCoords.coords.latitude)
    let data =
    {
     /*  "longitude": "77.1025",
      "latitude": "28.7041", */
      
      "latitude":  this.state.locationCoords.coords.latitude.toString(),
      "longitude": this.state.locationCoords.coords.longitude.toString(),
      'resource_group_id': [],
      'is_meeting_space': null
    }

    getPropertyListAPI(data, PROPERTY_LIST).then(
      (result) => {
        this.setState({
          spinner: false,
        });
        ////console.log("apiCallPropertyNearBy ", result.dataArray);

        if (result.status) {
          if (result.dataArray != undefined) {

            let mapMarkers = [];

                result.dataArray.map((item, index) => {
                    const mapItem = {
                        coordinate: {
                            latitude: parseFloat(item.latitude),
                            longitude: parseFloat(item.longitude),
                        },
                        imageURL: item.images.length == 0 ? require('./../Assets/images/BRHlogoorange.png') : { uri: CommonHelpers.processRawImages(item.images)[0].url },//{uri:AWS_URL+ item.images[0].image_path},
                        item: item
                    }
                    mapMarkers.push(mapItem);
                })
            this.setState({
              nearByList: result.dataArray,
              mapMarkers: mapMarkers,
              showMaps: showMaps,
            }, () => {////////console.log("Places near by list: ", this.state.nearByList);
            });
          }
        } else {
          if (result.message == "Network Error") {
            CommonHelpers.showFlashMsg("No Network Connection", "danger");
          } else {
            //console.log(result.message + " error in near by places. try again.");
           // CommonHelpers.showFlashMsg(result.message + " error in near by places. try again.", "danger");
          }
        }
        this.setState({
          isLoadMore: false,
          isRefreshing: false
        });
      }
    );

   // this.getAmenitesList();
  };

  openPropertyDetail = (id) => {
    ////////console.log("Pressed")
    this.props.navigation.push('detail', {
      property_id: id,
    })
  
  };

  openManageBookings = (page) => {
    ////////console.log("Pressed")
    this.props.navigation.push('TopTabNavigator', {
      screen: page,
    })
   
  };

  openSearchResult = async(param, name, price) => {
    this.setState({
      selectedSearchCategories: []
  });
  await Session.setSelectedAmenityType(JSON.stringify([]));
        await Session.setSelectedPropertyType(JSON.stringify([]));
        await Session.setSelectedResourceType(JSON.stringify([]));
        await Session.setSelectedSortOrder('');
        await Session.setSelectedValuesRange(JSON.stringify([]));

    this.props.navigation.push('SRP',{
      param: param,
      name: name,
      price: price, 
      
    })
    }

    //only for login
  
  _fetchCurrentBookingData =async () => {
        
    this.setState({
        spinner: true,
    })
    //let user_id = await Session.getUserId();

    membercurrentbookingapi().then((result) => {
       ////console.log(" current bookings: ",result.status);
        this.setState({
            spinner: false,
        });
        
        if (result.status == true) {

          let startTime = CommonHelpers.getMomentTime(moment(result.dataArray[0].start_date));
          let endtime = CommonHelpers.getMomentTime(moment(result.dataArray[0].end_date));
          let currenttime = CommonHelpers.getMomentTime(moment(new Date()));

          if(currenttime.isBetween(startTime, endtime)){
            ////console.log("Property id : ",result.dataArray[0].property_id )
            this.openScanPage(result.dataArray[0]);
          
      } else{
          CommonHelpers.showFlashMsg('Please try between '+moment(result.dataArray[0].start_date).format('HH:mm')+'Hrs to ' + moment(result.dataArray[0].end_date).format('HH:mm')+'Hrs.', 'danger' )
      }
            
             
               
        }
        else {
            CommonHelpers.showFlashMsg("No Current Properties to check-in/ check-out.");
        }
    })

    //this.getDocumentList();

}

  openScanPage = (property) => {
    this.props.navigation.push('scanpage',  {
      property: property

    })
   

  }
 

  openBookedPropertyItem = (item) => {
    ////////console.log("Pressed")
    console.log(item)
    /* this.props.navigation.push('bookedpropertydetails', {
      item: id,
      from: 'home'
    }) */

    item.is_meeting_space_booking==1 ?
        this.props.navigation.push('bookinginformationpage',{
          item: item.id,
          from: 'home'
        } ):

        this.props.navigation.push('bookedpropertydetails',{
            item: item.id,
            from: 'home'
          } )
   };

  _renderNearByPlaces = ({ item, index }) => {
    //console.log(" nearby places",item);
    let imageList = CommonHelpers.processRawImages(item.images);//[];
   /*  item.images.forEach(element => {
      imageList.push({ url: AWS_URL + element.image_path });

    }); */
    ////////console.log(imageList)
    return (
      <TouchableWithoutFeedback onPress={() => {
        // //////console.log("clicked.");
        this.openPropertyDetail(item.id);
      }} >
        <View height={280}>

          <SimilarPropertiesCard
            from="home"
            imageList={imageList}
            isLogin= {this.state.isLogin}
            iconName='heart'
            iconColor='orange'
            contentdetails={
              <View style={[box.detailsBox, { marginTop: "15%", height: 100 }]}>
                <View style={{ flex: 1, justifyContent: 'center' }}>
                  <View style={{ flexDirection: "row" }}>
                    <Text
                      style={[font.regular,
                      font.sizeLarge,
                      color.blackColor, { marginRight: 20,
                        allowFontScaling: false 
                       }]}>
                       { item.show_actual_name == 1 ? item.property_name: item.pseudoname}
                    </Text>
                    {/*  <View style = {{marginTop: 5, flex: 0.5}}>
                <StarRatingComponent rating = {item.rating} />
                </View>  */}
                  </View>

                  <Text
                    style={[font.regular,
                    font.sizeMedium,
                    color.darkgrayColor, { marginBottom: "1%" }]}>
                   {/*  {item.address1}, */} {item.address2}
                  </Text>


                </View>
              </View>
            } />


        </View>
      </TouchableWithoutFeedback>
    );
  }
  _renderPopularCity = ({ item, index }) => {
    ////////console.log("item", item)
    return (
      <View style={{ height: 130, marginTop: 20 }}>
        <TouchableWithoutFeedback
          onPress={async() => {

            this.state.isLogin ? this.openSearchResult({ 
              "latitude": item.latitude, 
              "longitude": item.longitude, 
              "resource_group_id": this.state.selectedSearchCategories,
              'user_id': await Session.getUserId() }, item.name, []) :
            
            this.openSearchResult({ 
              "latitude": item.latitude, 
              "longitude": item.longitude,
              "resource_group_id": this.state.selectedSearchCategories,
             }, item.name, [])
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

  _renderListOfAmenities = ({ item, index }) => {
    ////////console.log("amenity item",AWS_URL+item.icon_path)
    return (
      <TouchableWithoutFeedback onPress={async() => {
        ////////console.log("pressed");
        this.state.isLogin ?this.openSearchResult({ "amenity_id": [item.id], 'user_id': await Session.getUserId(),"resource_group_id": this.state.selectedSearchCategories, }, item.amenity_name, []):
        this.openSearchResult({ "amenity_id": [item.id],"resource_group_id": this.state.selectedSearchCategories, }, item.amenity_name, [])
      }}>
        <View style={[box.centerBox, { padding: 0, marginBottom: 30 },
        box.bill_shadow_box,
        color.whiteBackground,
        { width: 80, height: 80, margin: 10 }]}>
          <View style={{
            flex: 1,
            //backgroundColor: "red",
            alignItems: "center",
            alignContent: "center",
            justifyContent: "center"
          }}>
            <Image
              source={{ uri: AWS_URL + item.icon_path }}
              style={[image.imageContain,
              image.userImage]} />
          </View>
          <View style={{
            flex: 1,
            //backgroundColor: "red",
            alignItems: "center",
            alignContent: "center",
            justifyContent: "center"
          }}>
            <Text
              style={[font.sizeSmall, font.semibold,
              color.myOrangeColor,
              { textAlign: "center" }]}>
              {item.amenity_name}</Text>
          </View>

        </View>
      </TouchableWithoutFeedback>

    );
  }

  _renderUpcomingBookings = ({ item, index }) => {
    ////////console.log("_renderUpcomingBookings", item);
    return (
      <TouchableWithoutFeedback onPress={() => { this.openBookedPropertyItem(item) }}>
        {/* {this.state.UpcomingBooking.length != 0? */}
        <View >
          <RectangleCard
            details={item}
            source={item.property_images.length != 0 ? { uri: AWS_URL + item.property_images[0].image_path } : require('./../Assets/images/workplace.jpg')}
            from="home"
            //buttonTitle="BOOK NOW"
            //length={this.state.UpcomingBooking.length}
          />
        </View>
        {/* :
        <View style ={{backgroundColor:"red"}}>
        <Text>No data found</Text>

        </View>
 } */}
      </TouchableWithoutFeedback>
    );
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

 

  closeControlPanel = () => {
    this._drawer.close()
  };
  openControlPanel = () => {
    this._drawer.open()
  };

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
                    this.apiCallPropertyNearBy(true);
                   
                   

                })
            }
            else {
                location.requestPermission().then(value => {
                    if (value) {
                        location.getGeoLocation().then(async (value) => {
                            await Session.setLocationCoords(value);
                            let coords = await Session.getLocationCoords();
                            coords = JSON.parse(coords);
                            this.apiCallPropertyNearBy(true);
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

onMapClosed = () => {
  this.setState({

      showMaps: false,

  })

}

  render() {
    return (
      <>
     <Drawer
      ref={(ref) => this._drawer = ref}
  type="overlay"
  content={<Sidemenu navigation = {this.props.navigation} close = {()=>{
    this.closeControlPanel();
  }} />}
  tapToClose={true}
  openDrawerOffset={0.2} // 20% gap on the right side of drawer
  panCloseMask={0.2}
  closedDrawerOffset={-3}
  //styles={drawerStyles}
  side = 'right'
  tweenHandler={(ratio) => ({
    main: { opacity:(2-ratio)/2 }
  })}
  >
    <StatusBar barStyle={'dark-content'} backgroundColor='#fff'  />

        <View style={styles.flexContent}>
       {/*  <StatusBar barStyle={'dark-content'} backgroundColor={color.myOrangeColor.color}  /> */}
          <KeyboardAwareScrollView
            contentContainerStyle={boxStyle.scrollViewCenter}
            keyboardShouldPersistTaps="always"
            refreshControl={<RefreshControl refreshing = {this.state.refreshing} onRefresh = {this.refresh}/>}
          >
            <View
              style={[
                
                color.whiteBackground,
                
                {
                  flex: 1,
                  padding: 5,
                  marginTop: 10,
                  backgroundColor: 'white',
                }
              ]}
            >
              <TouchableWithoutFeedback onPress={() => {
                ////////console.log('Hello')
              }}>
                <GooglePlacesAutocomplete
                  GooglePlacesDetailsQuery={{ fields: "geometry" }}
                  textInputProps={{ placeholderTextColor: "gray"
                }
              }
                  fetchDetails={true} // you need this to fetch the details object onPress
                  placeholder='Search Areas, Location etc...'
                  query={{
                    key: "AIzaSyDgQlUgbgkWodIedIBpYIE8dMZJ7jjbbfA",
                    language: "en", // language of the results
                    components: 'country:in'
                  }}
                  renderLeftButton= {()=>
                   
                    <Icon name= "search" color = "black" size = {20} style = {{ alignSelf: "center", paddingLeft: 5}}/>
                  }
                  styles={{
                    textInput: { color: "gray",
                    fontSize: font.sizeVeryRegular.fontSize, 
                    allowFontScaling: false }, textInputContainer: {
                      width: Dimensions.get('screen').width *0.8,
                    } , row: {
                      backgroundColor: "white",
                    }, description: { color: "gray" }
                  }}
                  onPress={async(data, details = null) => {
                    var params = 
                    
                    this.state.isLogin ?
                     {
                      "latitude": JSON.stringify(details.geometry.location.lat),
                      "longitude": JSON.stringify(details.geometry.location.lng),
                      'resource_group_id':  this.state.selectedSearchCategories,//[],
                      'is_meeting_space': null,
                      'user_id': await Session.getUserId(),
                    } 
                    :
                      {
                      "latitude": JSON.stringify(details.geometry.location.lat),
                      "longitude": JSON.stringify(details.geometry.location.lng),
                      'resource_group_id':this.state.selectedSearchCategories,// [],
                      'is_meeting_space': null
                    };
                    this.openSearchResult(params, data.description, [])

                  }}
                  onFail={(error) => console.error(error)} />

              </TouchableWithoutFeedback>
              
              <TouchableWithoutFeedback onPress={() => {
                ////console.log(this.state.modalOpen);
                this.onFilterOpened();
                //  this.ActionSheet.show()
               /*  this.setState({
                  modalOpen: true,
                }) */
              }}>
                <Icon name= "filter" color = "orange" size = {25} style = {{ alignSelf: "center", paddingLeft: 5, position: "absolute", top: 10, right: 60}}/>
                
               {/*  <Image
                  style={styles.filterIcon}
                  size
                  source={require("./../Assets/images/filter.png")}
                /> */}
              </TouchableWithoutFeedback>
              <TouchableWithoutFeedback onPress={async() => {
                ////console.log('coordinates: ', await Session.getLocationCoords());
               /*  let coords  = await Session.getLocationCoords();
                coords  = JSON.parse(coords); */

                if (await Session.getLocationPermission() === 'true') {

                   this.setState({
                       showMaps: true,
                   })
               } else {

                   this.getLocationThenSearch();

               }
               /* this.state.isLogin ? 
               this.openSearchResult( {
                "latitude":coords.coords.latitude.toString(),
                "longitude":coords.coords.longitude.toString(),
                'resource_group_id':  this.state.selectedSearchCategories,//[],
                'is_meeting_space': null,
                'user_id': await Session.getUserId(),
              }, "", []):
                this.openSearchResult( {
                  "latitude":coords.coords.latitude.toString(),
                  "longitude":coords.coords.longitude.toString(),
                  'resource_group_id':this.state.selectedSearchCategories,//</View>[],
                  'is_meeting_space': null
                }, "", []) */
                
              }}>
                <MapIcon name= "map-marked" color = "orange" size = {25} style = {{ alignSelf: "center", paddingLeft: 5, position: "absolute", top: 10, right: 20}}/>
              
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


            {/* MAIN VIEW */}

            <View style={{ height: 300, flex: 1, flexDirection: "row", marginTop: 10, margin: 5 }}>
              <View height={"100%"} style={{ flex: 3, padding: 5,  }}>
                <Image source={require('./../Assets/images/girlWaving.png')}
                  style={[image.imageCover, { width: "100%", height: "100%",/*  resizeMode: "cover" */ }]} />
              </View>

              <View height={"100%"} style={{ flex: 1, padding: 5 }}>
                <View style={{ flex: 1, flexDirection: "row",  /* height: 100 */ }}>
                  <TouchableOpacity  onPress = {()=>{
                    

                   this.state.isLogin? this._fetchCurrentBookingData():this.props.navigation.push('auth',{screen: 'Login'});
                  }}
                  style = {[box.shadow_box,{flex: 1, margin: "4%",   alignItems: 'center', justifyContent: "center", padding: 5, shadowColor: color.myOrangeColor.color, backgroundColor: "white"}]}>
                    <Image source={require('./../Assets/images/qrnew.png')}
                                        style={{ width: 30, height: 30, resizeMode: 'contain' }} />
                    {/* <Icon name = "qrcode" size = {30} color = "orange"/> */}
                    <Text style = {[font.semibold, font.sizeVeryRegular, color.darkgrayColor, {textAlign: "center"}]}>Scan QR</Text>
                  </TouchableOpacity>
                 {/*  <TouchableOpacity onPress={() => {
                    this.openManageBookings();
                  }}
                    style={[box.shadow_box, { flex: 1, margin: "4%", alignItems: "center", justifyContent: "space-around", padding: 5, shadowColor: "#F8F8F8", backgroundColor: "white" }]}>
                    <Icon name="calendar" size={30} color="orange" />
                    <Text style={[font.semibold, font.sizeVeryRegular, color.darkgrayColor, { textAlign: "center" }]}>Manage Booking</Text>
                  </TouchableOpacity> */}
                </View>

                <View style={{ flex: 1, flexDirection: "row",  }}>
                <TouchableOpacity onPress={() => {
                  this.state.isLogin? this.openManageBookings(null):this.props.navigation.push('auth',{screen: 'Login'});
                  
                    
                  }}
                    style={[box.shadow_box, { flex: 1, margin: "4%", alignItems: "center", justifyContent: "center", padding: 5, shadowColor: color.myOrangeColor.color, backgroundColor: "white" }]}>
                      <Image source={require('./../Assets/images/mybookings.png')}
                                        style={{ width: 30, height: 30, resizeMode: 'contain' }} />
                   {/*  <Icon name="calendar" size={30} color="orange" /> */}
                    <Text style={[font.semibold, font.sizeVeryRegular, color.darkgrayColor, { textAlign: "center" }]}>Manage Booking</Text>
                  </TouchableOpacity>
              {/*  <TouchableOpacity style = {[box.bill_shadow_box,{flex: 1, margin: "4%", alignItems: "center", justifyContent: "space-around", padding: 5,shadowColor: "#F8F8F8",backgroundColor: "white"}]}>
                <Icon name = "file-text-o" size = {30} color = "orange"/>
                    <Text style = {[font.semibold, font.sizeVeryRegular, color.darkgrayColor, {textAlign: "center"}]}>Manage Document</Text>
                </TouchableOpacity>
                  <TouchableOpacity style = {[box.shadow_box,{flex: 1, margin: "4%", alignItems: "center", justifyContent: "space-around", padding: 5,shadowColor: "#F8F8F8",backgroundColor: "white", }]}>
                    {this.state.dues == 0? null : 
                  <View style = {[{alignSelf: "flex-end", marginTop: -15, marginRight: -15, borderRadius: 20, borderWidth: 2, width: 30, height: 30, alignItems: "center", borderColor: "orange"}]}>
                      <Text style = {[font.bold, font.sizeMedium, color.myOrangeColor, {textAlign: "center"}]}>{this.state.dues}</Text>
                    </View>}
                  <Icon name = "rupee" size = {30} color = "orange"/>
                    <Text style = {[font.semibold, font.sizeVeryRegular, color.darkgrayColor, {textAlign: "center"}]}>Check Dues</Text>
                  </TouchableOpacity>*/}

                </View> 

                  <View style={{ flex: 1, flexDirection: "row", /* height: 100  */ }}>
                  <TouchableOpacity onPress ={()=>{

this.state.isLogin? this.props.navigation.push('IssuesList'):this.props.navigation.push('auth',{screen: 'Login'});
                    
                  
                  }} style = {[box.shadow_box,{flex: 1, margin: "4%",  alignItems: "center", justifyContent: "center", padding: 5,shadowColor: color.myOrangeColor.color,backgroundColor: "white"}]}>
                    <Image source={require('./../Assets/images/issuesnew.png')}
                                        style={{ width: 30, height: 30, resizeMode: 'contain' }} />
                  {/* <Icon name = "warning" size = {30} color = "orange"
                  /> */}
                    <Text style = {[font.semibold, font.sizeVeryRegular, color.darkgrayColor, {textAlign: "center"}]}>Manage Issues</Text>
                  </TouchableOpacity>
                {/*   <TouchableOpacity style = {[box.shadow_box,{flex: 1, margin: "4%",  alignItems: "center", justifyContent: "space-around", padding: 5,shadowColor: "#F8F8F8",backgroundColor: "white"}]}>
                   
                  <Icon name = "calendar-check-o" size = {30} color = "orange"/>
                    <Text style = {[font.semibold, font.sizeVeryRegular, color.darkgrayColor, {textAlign: "center"}]}>Browse Events</Text>
                  </TouchableOpacity> */}

               </View>
                

              </View>
            </View>

            {/* MAIN VIEW ENDS */}


            {/* <ScrollView> */}
            {/* search by city starts  */}
            <View style={{ flex: 1, paddingTop: 20 }}>
              <Text style={[font.semibold, font.sizeExtraLarge, color.blackColor, { paddingHorizontal: 20 }]}>
                Search By City
              </Text>

              <FlatList
                data={this.state.popularCity}
                renderItem={this._renderPopularCity}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
              />
            </View>
            {/* search by city ends */}

            {/* search by amenities starts  */}
            <View style={{ flex: 1, paddingTop: 20, /* backgroundColor: "red"  */ }}>
              <Text style={[font.semibold, font.sizeExtraLarge, color.blackColor, { paddingHorizontal: 20 }]}>
                Search By Amenities
              </Text>
              {this.state.listOfAmenities.length != 0 ?
                <FlatList
                  data={this.state.listOfAmenities}
                  renderItem={this._renderListOfAmenities}
                  horizontal={true}
                  showsHorizontalScrollIndicator={false}
                //extraData = {this.state}
                /> :
                <Text> No Amenities Available.</Text>}
            </View>
            {/* search by amenities ends */}

            {/* current booking */}
            <View style ={[box.centerBox,{flexDirection: 'row', justifyContent: 'space-between', /* backgroundColor: 'red', */ paddingBottom: 0, paddingTop: 0}]}>
            <Text style={[font.semibold, font.sizeExtraLarge, color.blackColor, {// paddingHorizontal: 20
             }]}>
                    Current Bookings
                  </Text>
                  <TouchableWithoutFeedback onPress={() => {
                    //  this.ActionSheet.show()
                    this.openManageBookings('Current')
                  }}>
                    <Text style={[font.regular, font.sizeMedium, color.myOrangeColor, { textAlign: 'right', /* bottom: 28, right: 10, */ }]}>
                      View all
                    </Text>
                  </TouchableWithoutFeedback>
                  </View>

           <CurrentBookings navigation = {this.props.navigation} homePageVisible = {true} /> 

            {/* Places nearby starts */}
            {
              this.state.nearByList.length != 0 ?
                <View>
                  <Text style={[font.semibold, font.sizeExtraLarge, color.blackColor,  { paddingHorizontal: 20 }]}>
                    Spaces Near You
                  </Text>

                  <View style={{ marginTop: 20 }}>
                    {this.state.nearByList.length != 0 ?
                      <FlatList
                        data={this.state.nearByList}
                        renderItem={this._renderNearByPlaces}
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}
                      /> :
                      <Text style={[{ textAlign: "center", marginBottom: 20 }, font.regular, font.sizeRegular, color.darkgrayColor]}
                      > No properties nearby.
                      </Text>}

                  </View>
                </View> : null}
            {/* Places nearby ends */}


            {/* Upcoming bookings begin */}
            {this.state.UpcomingBooking.length != 0 ?
              <View style={{
                height: this.state.UpcomingBooking.length == 0 ? 0 : 250,
                marginLeft: 1
              }}>
                <Text style={[font.semibold, font.sizeExtraLarge, color.blackColor, { paddingHorizontal: 20 }]}>
                  Upcoming Bookings
                </Text>
                <TouchableWithoutFeedback onPress={() => {
                  //  this.ActionSheet.show()
                  this.openManageBookings('Upcoming')
                }}>
                  <Text style={[font.regular, font.sizeMedium, color.myOrangeColor, { textAlign: 'right', bottom: 28, right: 10, }]}>
                    View all
                  </Text>
                </TouchableWithoutFeedback>
                {this.state.UpcomingBooking.length != 0 ? (
                  <View height={210}>
                    <FlatList
                      data={this.state.UpcomingBooking}
                      renderItem={this._renderUpcomingBookings}
                      horizontal={true}
                      showsHorizontalScrollIndicator={false}
                    />
                  </View>)
                  :
                  (
                    <View >
                      <Text style={{ textAlign: "center" }} >
                        No data found
                      </Text>
                    </View>
                  )}

              </View> : null}
            {/* Upcoming booking ends */}


            {/* History bookings begin  */}
            {
              this.state.previousBooking.length != 0 ?
                <View style={{
                  height: this.state.previousBooking.length == 0 ? 0 : 270,
                  marginLeft: 1,
                  marginTop: 10,
                }}>
                  <Text style={[font.semibold, font.sizeExtraLarge, color.blackColor, { paddingHorizontal: 20 }]}>
                    Previous Bookings
                  </Text>
                  <TouchableWithoutFeedback onPress={() => {
                    //  this.ActionSheet.show()
                    this.openManageBookings('Previous')
                  }}>
                    <Text style={[font.regular, font.sizeMedium, color.myOrangeColor, { textAlign: 'right', bottom: 28, right: 10, }]}>
                      View all
                    </Text>
                  </TouchableWithoutFeedback>
                  {this.state.previousBooking.length != 0 ? (
                    <View height={210}>
                      <FlatList
                        data={this.state.previousBooking}
                        renderItem={this._renderUpcomingBookings}
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}
                       
                      />
                    </View>)
                    :
                    (
                      <View height={50} >
                        <Text style={[{ textAlign: "center", marginBottom: 20 }, font.regular, font.sizeRegular, color.darkgrayColor]} >
                          No data found
                        </Text>
                      </View>
                    )}

                </View> : null}
            {/* History booking ends */}


            {/* </ScrollView> */}

          </KeyboardAwareScrollView>
          {this.state.spinner && <Spinner/>}

          {this.state.delSpinner && <Spinner />}

          {this.state.modalOpen &&  <ModalScreen navigation = {this.props.navigation} closing = {()=>{this.onFilterClosed()}} /> 
            
          }

          {
            this.state.showMaps && this.state.mapMarkers.length == 0 && CommonHelpers.showFlashMsg('No Properties to show.')
          }

{

this.state.showMaps && this.state.mapMarkers.length > 0
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
        this.openPropertyDetail(item.id);
    }}

    from={'meetingSpace'} />

}
        </View>
        </Drawer>
      </>
    );
  }
}



const styles = StyleSheet.create({
  searchcontainer: {
    //margin: 15,
    justifyContent: "flex-start",
    alignItems: "center",
    flexDirection: "row",
    width: "100%",
    //backgroundColor: "pink"

  },
  searchinput: {
    fontSize: 20,
    marginLeft: 10,
    width: "95%",
    
  },
  flexContent: { flex: 1 },
  align: { textAlign: "right", justifyContent: "flex-end", flex: 1, marginTop: 20, },
  rowStyle: { flexDirection: 'row' },

  content: { marginTop: 10, marginBottom: 20, marginLeft: 15, marginRight: 15 },
  flexStyle: { flex: 1, flexDirection: "row" },
  rightArrow: { width: 20, height: 20 },
  padding: { justifyContent: "center", position: "relative", left: 40, top: 0 },
  bankImage: { width: 60, height: 60 },
  centerPadding: { marginLeft: 10, marginTop: 10 },
  downBox: {
    borderBottomColor: "#b2b1b1", borderBottomWidth: 1, borderColor: "#f5f5f5", width: "95%", marginLeft: 10,
  },
  spacing: { paddingTop: 10, paddingBottom: 10, paddingLeft: 5, paddingRight: 5, },
  accountsList: { marginLeft: 10, marginRight: 10, marginBottom: 10, flex: 1, marginTop: 10, paddingRight: 10, paddingLeft: 10, },
  accountsItem: {
    padding: 2,
    paddingTop: 15,
    paddingBottom: 10,
    borderBottomWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  leftContent: { alignItems: "flex-start", flexGrow: 1, flex: 1, paddingLeft: 5, },
  rightContent: { alignItems: "flex-end", },
  pickerText: { height: 30, width: 100 },
  dueItem: {
    padding: 2, paddingTop: 12, paddingBottom: 12, borderBottomWidth: 1, flexDirection: "row",
    alignItems: "center", justifyContent: "space-between",
  },
  borderSpacing: { borderTopLeftRadius: 5, borderTopRightRadius: 5, borderWidth: 1, },
  billDrop: {
    paddingTop: 8,
    paddingBottom: 8,
    paddingLeft: 20,
    paddingRight: 20,
    borderWidth: 1,
    borderRadius: 20,
  },
  dataStyle: { flex: 1, flexDirection: "column", alignItems: "center", justifyContent: "center", },

  addButtonStyle: { flexWrap: "wrap" },
  radius: {
    borderTopLeftRadius: 40, borderTopRightRadius: 40, borderBottomLeftRadius: 40, borderBottomRightRadius: 40,
  },
  skeletonStyle: { width: 50, height: 50, marginTop: 5, borderRadius: 5 },
  skeletonTextStyle: { width: 100, height: 15, marginTop: 5, borderRadius: 5 },
  skeletonIcon: { width: 15, height: 15, marginRight: 10, position: "absolute", top: 60, left: 0, },
  skeletonDollarStyle: { width: 60, height: 15, marginTop: 5, borderRadius: 5 },
  dropArrowStyle: { width: 10, height: 10, marginTop: 2, marginLeft: 5 },
  dotsImageStyle: { width: 18, height: 18, marginLeft: 5 },
  price: { padding: 3, paddingRight: 5, paddingLeft: 5, marginLeft: 5 },
  searchIcon: {
    width: 20,
    height: 20,
    position: "absolute",
    top: 15,
    left: 8,
  },
  filterIcon: {
    width: 20,
    height: 20,
    position: "absolute",
    top: 15,
    right: 38,
  },

});
