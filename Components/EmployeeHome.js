import {
  Text,
  StyleSheet,
  View,
  Image,
  FlatList,
  ImageBackground,
  TouchableOpacity,
  BackHandler, StatusBar, Pressable, TouchableWithoutFeedback, Dimensions
} from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { AWS_URL, EMPLOYEE_PROPERTY_LIST, EMP_UPCOMING_RESERVATION,EMPLOYEE_CURRENT_RESERVATION,PROPERTY_LIST, SEARCH } from '../config/RestAPI';
import { empCurrentReservationAPI,getPropertyListAPI, empUpcomingReservationAPI,login_check, getEmpMappedPropertyListAPI} from '../Rest/userAPI';
import Icon from 'react-native-vector-icons/AntDesign';
import Icon3 from 'react-native-vector-icons/Feather';
import React, { Component } from 'react';
import Searchbar from './NewReusable/searchbar';
import Card from './NewReusable/Card';
import EmployeeCurrentReservation from './EmployeeCurrentReservation';
import Drawer from "react-native-drawer";
import Sidemenu from "../Navigation/Sidemenu";
import LogoHeader from './ReusableComponents/LogoHeader';
import location from '../Location/location';
import font from '../Styles/font';
import color from '../Styles/color';
import Session from '../config/Session';
import CommonHelpers from '../Utils/CommonHelpers';
import ModalScreen from './ModalScreen';
import RectangleCard from './ReusableComponents/RectangleCard';
import CustomePushNotifications from './CustomePushNotifications';



export default class EmployeeHome extends Component {

  constructor() {
    super();
    this.state = {
      emp_id: null,
      username: null,
      spinner: false,
      refreshing: false,
      expanded: false,
      modalOpen: false,
      linked: [],
      upcoming: [],
      updateBooking: false,
      employeeCode: null,
    

     data : [
     /*  {
        iconname: 'md-document-text-sharp',
        text: 'Manage Documents',
        onClick: (navigation)=>{
          ////////console.log('manage documents')
        }
      }, */
      {
        iconname: 'warning',
        text: 'Manage Issues',
        onClick: (navigation)=>{
          ////////console.log('manage issues');
          navigation.push('IssuesList');
        }
      },
      {
        iconname: 'qrcode-scan',
        text: 'Scan',
        text2: 'QR',
        onClick: async(navigation)=>{
          ////////console.log('scan QR');
          this.openScanPage( null);
          //this._fetchCurrentBookingData(await Session.getUserId(), EMPLOYEE_CURRENT_RESERVATION)
        },
      },

      {
        iconname: 'calendar',
        text: 'Manage Bookings',
        onClick: (navigation)=>{
          ////////console.log('manage issues');
          navigation.push('seatreservationlist');
        }
      },
    ],
    searchByCity : [
      {
        id: 1,
        longitude: "77.5946",
        latitude: "12.9716",
        image: "https://static.toiimg.com/thumb/msid-60290719,width-1200,height-900,resizemode-4/.jpg",
       // image: require('../Assets/images/bangalore.jpg'),
        city: 'Bangalore',
        onClick: async(navigation)=>{
          this.openSearchResult({ "latitude": item.latitude, "longitude": item.longitude, 'user_id': await Session.getUserId() }, item.name, [])
          
        }
      },
      {
        id: 2,
       // image: require('../Assets/images/kolkata.jpg'),
        city: 'Kolkata',
        longitude: "88.3639",
        latitude: "22.5726",
        image: "https://www.tripsavvy.com/thmb/vOsVUgkBhTmj3lntYNu-qBswRVM=/3668x2751/smart/filters:no_upscale()/victoria-memorial--kolkata--india-1140726002-95549087f08e4bafb44c1a71179a8ceb.jpg",
        onClick: async(navigation)=>{
          this.openSearchResult({ "latitude": item.latitude, "longitude": item.longitude, 'user_id': await Session.getUserId() }, item.name, [])
          
        }
      },
      {
        id: 3,
       // image: require('../Assets/images/mumbai.jpg'),
        city: 'Mumbai',
        longitude: "72.8777",
        latitude: "19.0760",
        image: "https://upload.wikimedia.org/wikipedia/commons/b/bc/Mumbai_skyline_BWSL.jpg",
        onClick: async(navigation)=>{
          this.openSearchResult({ "latitude": item.latitude, "longitude": item.longitude, 'user_id': await Session.getUserId() }, item.name, [])
          
        }
      },
      {
        id: 4,
        //image: require('../Assets/images/delhi.jpeg'),
        city: 'Delhi',
        longitude: "77.1025",
        latitude: "28.7041",
        image: "https://static.goindigo.in/content/dam/indigov2/6e-website/destinations/delhi/Delhi-LotusTmple.jpg",
        onClick: async(navigation)=>{
          this.openSearchResult({ "latitude": item.latitude, "longitude": item.longitude, 'user_id': await Session.getUserId() }, item.name, [])
          
        }
      },
      {
        id: 5,
        //image: require('../Assets/images/delhi.jpeg'),
        city: 'Chennai',
        longitude: "80.2707",
        latitude: "13.0827",
        image: "https://media.gettyimages.com/photos/high-angle-view-of-sea-and-buildings-against-sky-picture-id1144749579?s=612x612",
        onClick: async(navigation)=>{
          this.openSearchResult({ "latitude": item.latitude, "longitude": item.longitude, 'user_id': await Session.getUserId() }, item.name, [])
          
        }
      },
      
    ]
  }
  }

  apiCall =async(param, url) => {
    //console.log('emp property list params: ', param);
    this.setState({
      spinner: true,
    });
    getEmpMappedPropertyListAPI(param, url).then(async (result) => {
      if (result.status) {
        console.log('property mapped **********',result.dataArray);
        await Session.setEmpPropertyDetails(result.dataArray);
        this.setState({
          linked: result.dataArray
        },async()=>{
          this._fetchUpcomingBookings(await Session.getUserId(), EMP_UPCOMING_RESERVATION);
        })
      } else {
        await Session.setEmpPropertyDetails([])
        ////////console.log('No results  ***');
        this._fetchUpcomingBookings(await Session.getUserId(), EMP_UPCOMING_RESERVATION);
      }
      this.setState({
        spinner: false,
        refreshing: false,
      });
    })
    
  }

  componentDidMount = async() => {
    //CustomePushNotifications.checkinReminder(new Date());
    this.backhandler = BackHandler.addEventListener("hardwareBackPress", () => {
      BackHandler.exitApp();
      return true;
    });
    let details = await Session.getUserDetails();
    details = JSON.parse(details);
    
    this.setState({
      emp_id: details.id,
      employeeCode: details.user_code,
      username: details.name,
      company_name: details.company_name,
    }, ()=>{
      ////////console.log('Employee details: ', details);
    })
    
    

    Platform.OS === 'ios' ?
    location.checkTrackingPermission().then((value)=>{
      if(value){
        //console.log("Tracking enabled");
        location.check().then((value) => {
          this.setState({
            locationPermission: value,
          }, () => {
            if (this.state.locationPermission) {
              location.getGeoLocation().then(async (value) => {
                await Session.setLocationCoords(value)
              })
            }
            else {
              location.requestPermission().then(value => {
                if (value) {
                  location.getGeoLocation().then(async (values) => {
                    await Session.setLocationCoords(values)
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
            //console.log("Tracking enabled");
            location.check().then((value) => {
              this.setState({
                locationPermission: value,
              }, () => {
                if (this.state.locationPermission) {
                  location.getGeoLocation().then(async (value) => {
                    await Session.setLocationCoords(value)
                  })
                }
                else {
                  location.requestPermission().then(value => {
                    if (value) {
                      location.getGeoLocation().then(async (values) => {
                        await Session.setLocationCoords(values)
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
          location.getGeoLocation().then(async (value) => {
            await Session.setLocationCoords(value)
          })
        }
        else {
          location.requestPermission().then(value => {
            if (value) {
              location.getGeoLocation().then(async (values) => {
                await Session.setLocationCoords(values)
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
      //////console.log("login check", result.message, result.status);
     if(!result.status){
       CommonHelpers.showFlashMsg("Session Expired. Please login again.", "danger");
       await Session.setUserDetails({});
                await Session.setUserToken('');
                //////console.log(await Session.getUserDetails());
                await Session.setUserId('');
                await Session.setUserName('');
                this.props.navigation.push('auth',{screen: 'Login'})
              
     }
     else{
      this.apiCall({ "emp_id": details.id }, EMPLOYEE_PROPERTY_LIST);
     }

    }).catch(error => {
      ////console.log(error)
    })
  }

  openManageBookings = (page) => {
    ////////////console.log("Pressed")
    this.props.navigation.push('seatreservationlist', {
      screen: page,
    })
  
  };

  refresh = async () => {
    this.setState({
      refreshing: true,
      spinner: true
    })

    let details = await Session.getUserDetails();
    details = JSON.parse(details);
    ////////console.log(details);
    this.setState({
      emp_id: details.id,
      username: details.name,
    })
    //this.props.searchTerm ? this.searchCall():
    this.apiCall({ "emp_id": details.id }, EMPLOYEE_PROPERTY_LIST);




    location.check().then((value) => {
      this.setState({
        locationPermission: value,
      }, () => {
        if (this.state.locationPermission) {
          location.getGeoLocation().then(async (value) => {
            await Session.setLocationCoords(value)
          })
        }
        else {
          location.requestPermission().then(value => {
            if (value) {
              location.getGeoLocation().then(async (values) => {
                await Session.setLocationCoords(values)
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

  //************filter funtions */
  onFilterClosed = () => {
    this.setState({
      modalOpen: false,
    })
  }

  componentWillUnmount() {
    if (this.backhandler)
      this.backhandler.remove();
  }

  onFilterOpened = () => {
    this.setState({
      modalOpen: true,
    })
  }
  //********** filter funtions end. */


  _fetchCurrentBookingData = (emp_id, url) => {
    this.setState({
        spinner: true,
    })
    empCurrentReservationAPI({ 'employee_id': Number(emp_id) }, url).then(result => {
        this.setState({
            spinner: false,
        })
        ////////console.log("Upcoming reservation details from the api: ",result.status,result.dataArray);
        if (result.status) {
          this.openScanPage( result.dataArray[0]);
        }
        else{
          CommonHelpers.showFlashMsg("No Current Properties to check-in/ check-out.");
        }
    }).catch(error => { //////////console.log("emp upcoming reservation error", JSON.stringify(error)) 
    })
}


_fetchUpcomingBookings = (emp_id, url) => {
  this.setState({
      spinner: true,
  })
  empUpcomingReservationAPI({ 'employee_id': Number(emp_id) }, url).then(result => {
      this.setState({
          spinner: false,
      })
      ////////////console.log("Upcoming reservation details from the api: ",result.status,result.dataArray);
      if (result.status) {
        ////////console.log("upcoming data exists. ")
          this.setState({
              upcoming: result.dataArray,

          });
      }

  }).catch(error => {//////////console.log("emp upcoming reservation error", JSON.stringify(error))
  })
}

  openScanPage = (property) => {
    this.props.navigation.push('scanpage',  {
      property: property,
    })
   

  }

 

  openSearchResult = (param, name, price) => {

    this.props.navigation.push('SRP',{
      param: param,
      name: name,
      price: price, 
      
    })
    }

    openBookedPropertyItem = (item, from) => {
      ////////////console.log("Pressed")
      this.props.navigation.push('bookedpropertydetails', {
        item: item,
        from : from
      })
     };
  

    _renderList = ({ item, index }) => {
   ////////console.log("_render", item);
      return (
        <TouchableWithoutFeedback onPress={() => { //this.openBookedPropertyItem(item, 'emphome') 
        }}>
          {/* {this.state.UpcomingBooking.length != 0? */}
          <View >
            <RectangleCard
              details={item}
              source={item.images.length != 0 ? 
                { uri: AWS_URL + item.images[0].image_path } : 
                require('./../Assets/images/workplace.jpg')}
              from="emphome"
            />
          </View>
        </TouchableWithoutFeedback>
      );
    }

    _renderUpcoming = ({ item, index }) => {
      ////////console.log("_render upcoming", item);
         return (
           <TouchableWithoutFeedback onPress={() => {/*  this.openBookedPropertyItem(item,'empupcoming') */ }}>
             {/* {this.state.UpcomingBooking.length != 0? */}
             <View >
               <RectangleCard
                 details={item}
                 source={item.property_images.length != 0 ? 
                   { uri: AWS_URL + item.property_images[0].image_path } : 
                   require('./../Assets/images/workplace.jpg')}
                 from="home"
               />
             </View>
           </TouchableWithoutFeedback>
         );
       }




  closeControlPanel = () => {
    this._drawer.close()
  };
  openControlPanel = () => {
    this._drawer.open()
  };
  render() {
    return (
      <Drawer
        ref={(ref) => this._drawer = ref}
        type="overlay"
        content={<Sidemenu navigation={this.props.navigation} close={() => {
          this.closeControlPanel();
        }}
        />
        }
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
         <StatusBar barStyle="dark-content" backgroundColor="#fff" />
        <KeyboardAwareScrollView
          keyboardShouldPersistTaps="always"
          style={{ flex: 1, alignContent: 'flex-start', backgroundColor: 'white' }}>
          <LogoHeader
            title="Be Right Here"
            navigation={this.props.navigation}
            qrvisible={true}
            qrpress={async() => { 
              /* this._fetchCurrentBookingData(await Session.getUserId(), EMPLOYEE_CURRENT_RESERVATION) */ 
              this.openScanPage( null);
            }}
            onBarsPress={() => {
              this.openControlPanel()
            }}
            from={'Home'}
          />

          <View style={{ alignItems: 'center', marginTop: 20 }}>
            <View>
              <Text style={[font.bold, font.sizeMedium, color.myOrangeColor]}>Hello, {this.state.username}</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
              <Text style={[color.grayColor, font.regular, font.sizeVeryRegular, ]}>
                {this.state.company_name == null ? "--" : this.state.comapny_name}
              </Text>
              <Text style={[color.grayColor, font.regular, font.sizeVeryRegular,]}>
                Employee ID {this.state.employeeCode}
              </Text>
            </View>
          </View>
          <Searchbar 
          text="Search Company Properties..." 
          icon="list-2" 
          navigation = {this.props.navigation} 
          params = {{}} 
          apiCall= {(e)=>{
            this.props.navigation.push('SRP', {
              param: {
                'search_keyword': e
              }
            })
          }}/>

          <View style={{ alignItems: 'center' }}>
            <Image
              style={{ height: 250, width: 180, resizeMode: 'cover' }}
              source={require('../Assets/images/signinPageDoll.png')}
            />
          </View>
          <View
            style={{
              padding: 10,
              flexDirection: 'row',
              justifyContent: 'center',
              width: '100%',
            }}>
            {this.state.data.map(item => {
              return (
                <TouchableOpacity style = {{width: '21%', marginRight: 10}}
                  onPress = {()=>{item.onClick(this.props.navigation)}}
                >
                <Card 
                icon={item.iconname} 
                text={item.text} 
                qr={item.text2} 
                //navigation = {this.props.navigation}
                //onPress = {item.onClick} 
                 />
                </TouchableOpacity>
              );
            })}
          </View>



          {this.state.expanded ? (
          <>
            <View>
              <Text
                style={{
                  textAlign: 'center',
                  marginBottom: 0,
                  fontSize: 20,
                  fontWeight: 'bold',
                  color: 'black',
                }}>
                DISCOVER PROPERTIES
              </Text>

              <TouchableWithoutFeedback
                onPress={() => {
                  ////////////console.log('Hello')
                }}>
                <View
                  style={{
                    borderColor: 'gray',
                    borderWidth: 1,
                    marginHorizontal: 30,
                    marginTop: 15,
                    paddingRight: 10,
                  }}>
                     <GooglePlacesAutocomplete
                     autoFocus={true}
                GooglePlacesDetailsQuery={{ fields: "geometry" }}
                textInputProps={{ placeholderTextColor: "gray" }}
                fetchDetails={true} // you need this to fetch the details object onPress
                placeholder='Search Areas, Location etc...'
                query={{
                  key: "AIzaSyDgQlUgbgkWodIedIBpYIE8dMZJ7jjbbfA",
                  language: "en", // language of the results
                }}
                renderLeftButton={() => (
                  <Icon
                    name="search1"
                    color="black"
                    size={20}
                    style={{
                      alignSelf: 'center',
                      paddingLeft: 5,
                    }}
                  />
                )}
                renderRightButton={() => (
                  <View
                    style={{flexDirection: 'row', alignItems: 'center'}}>
                    <TouchableOpacity onPress = {()=>{ this.onFilterOpened();}}>
                      <Icon3
                        name="filter"
                        size={25}
                        color={'#a9a9a9'}
                        style={{marginHorizontal: 10}}
                      />
                    </TouchableOpacity>
                  {/*   <TouchableOpacity>
                      <Image
                        source={require('../Assets/Icons/greylocation.png')}
                        style={{height: 28, width: 25, marginBottom: 5}}
                      />
                    </TouchableOpacity> */}
                  </View>
                )}
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
                  //////////console.log("data", data);
                  //////////console.log("details", details);
                  //////////console.log(JSON.stringify(details?.geometry?.location));

                  var params = {
                    "latitude": JSON.stringify(details.geometry.location.lat),
                    "longitude": JSON.stringify(details.geometry.location.lng),
                    'user_id': await Session.getUserId()
                  };
                  this.openSearchResult(params, data.description, [])

                }}
                onFail={(error) => console.error(error)} />
                </View>
              </TouchableWithoutFeedback>
            </View>
            <View>
              <Text
                style={{
                  fontSize: 25,
                  fontWeight: 'bold',
                  color: 'black',
                  paddingHorizontal: 25,
                  paddingBottom: 10,
                  paddingTop: 20,
                }}>
                Search by City
              </Text>
              <View
                style={{
                  paddingHorizontal: 25,
                  paddingTop: 15,
                  paddingBottom: 30,
                }}>
                <FlatList
                  data={this.state.searchByCity}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  keyExtractor={(item, index) => index}
                  renderItem={({item}) => {
                    return (
                      <TouchableOpacity style={{paddingRight: 20}} onPress = {async()=>{this.openSearchResult({ "latitude": item.latitude, "longitude": item.longitude, 'user_id': await Session.getUserId() }, item.city, [])}}>
                        <ImageBackground
                          source={{uri: item.image}}
                          resizeMode="cover"
                          style={{
                            width: 180,
                            height: 120,

                            justifyContent: 'flex-end',
                          }}>
                          <Text
                            style={{
                              color: '#ffffff',
                              fontWeight: '700',
                              fontSize: 15,
                              letterSpacing: 0.5,
                              paddingHorizontal: 10,
                              marginVertical: 15,
                            }}>
                            {item.city}
                          </Text>
                        </ImageBackground>
                      </TouchableOpacity>
                    );
                  }}
                />
              </View>
            </View>
          </>
        ) : (
          <View style={{alignItems: 'center', marginHorizontal: 20}}>
            <Pressable
              android_ripple={'orange'}
              style={[
                {
                  borderColor: 'orange',
                  borderWidth: 2,
                  alignItems: 'center',
                  width: '100%',
                  paddingVertical: 8,

                  paddingHorizontal: 0,
                  marginTop: 20,
                  marginBottom: 10,
                },
              ]}
              onPress={() => this.setState({expanded: !this.state.expanded})}>
              <Text
                style={[ font.semibold, font.sizeRegular,
                  {color: 'orange', letterSpacing: 0.7, fontWeight: '600'},
                ]}>
                DISCOVER SPACES
              </Text>
            </Pressable>
          </View>
        )}

          
          <View>
            <Text
              style={[font.regular, font.sizeMedium,{
                fontSize: 25,
                fontWeight: 'bold',
                color: 'black',
                paddingHorizontal: 25,
                paddingBottom: 10,
                paddingTop: 20,
              }]}>
              Current Booking
            </Text>
           { <EmployeeCurrentReservation 
           navigation = {this.props.navigation} 
           homePageVisible = {true} />}
          </View>

               {/* Linked proeprties begin  */}
            {
              
              this.state.linked.length != 0 ?
                <View style={{
                  height: this.state.linked.length == 0 ? 0 : 250,
                  marginLeft: 1
                }}>
                  <Text style={[font.semibold, font.sizeExtraLarge, color.blackColor, { paddingHorizontal: 20 }]}>
                    Linked Properties
                  </Text>
                  <TouchableWithoutFeedback onPress={() => {
                    //  this.ActionSheet.show()
                    this.openManageBookings('Allocated')
                  }}>
                    <Text style={[font.regular, font.sizeMedium, color.myOrangeColor, { textAlign: 'right', bottom: 28, right: 10, }]}>
                      View all
                    </Text>
                  </TouchableWithoutFeedback>
                  {this.state.linked.length != 0 ? (
                    <View height={200}>
                      <FlatList
                        data={this.state.linked}
                        renderItem={this._renderList}
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}
                        //extraData={this.state.linked}
                       
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
            {/* Linked proeprties ends */}

            {/* Upcoming proeprties begin  */}
            {
              
               this.state.upcoming.length != 0 ?
                <View style={{
                  height: this.state.linked.length == 0 ? 0 : 250,
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
                  {this.state.upcoming.length != 0 ? (
                    <View height={200}>
                     <FlatList
                        data={this.state.upcoming}
                        renderItem={this._renderUpcoming}
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}
                        //extraData={this.state.upcoming}
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

                </View> : null }
            {/* upcoming proeprties ends */}

          
          
          
        </KeyboardAwareScrollView>
        {this.state.modalOpen &&  <ModalScreen navigation = {this.props.navigation} closing = {()=>{this.onFilterClosed()}} />}
        
      </Drawer>
    );
  }
}

const styles = StyleSheet.create({
  greeting: {
    color: 'orange',
    fontWeight: 'bold',
    fontSize: 25,
    letterSpacing: 0.6,
  },
  bar2: {
    borderColor: 'black',
    borderWidth: 1,
    margin: 10,
    marginHorizontal: 35,
    paddingVertical: 0,
    marginTop: 15,
  },
});