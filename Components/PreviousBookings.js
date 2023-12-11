import React, { Component } from 'react';
import { View, Text, Platform, TouchableWithoutFeedback, FlatList, TouchableOpacity, Dimensions} from 'react-native';
import { request, PERMISSIONS, check, RESULTS } from 'react-native-permissions';
import Geolocation from 'react-native-geolocation-service';
import moment from 'moment';
import font from '../Styles/font';
import box from '../Styles/box';
import color from '../Styles/color';
import location from '../Location/location';
import { getBookinglistAPI } from '../Rest/userAPI';
import CommonHelpers from '../Utils/CommonHelpers';
import { AWS_URL, MEMBER_PREVIOUS_BOOKING } from '../config/RestAPI';
import Spinner from '../Utils/Spinner';
import Session from '../config/Session';
import SimilarPropertiesCard from './ReusableComponents/SimilarPropertiesCard';
import button from '../Styles/button';



export default class PreviousBookings extends Component {
    constructor() {
        super();
        this.state = {
            locationPermission: "",
            data: [],

            APIMessage: '',

            checkin_checkout_date: '',
            locationDetails: {},
            selectedBooking: {},
            longitude: '',
            latitude: '',
            spinner: false,

        }
    }

    componentDidMount() {
        this._fetchUpcomingBookingData();
        location.check().then((value) => {
            this.setState({
              locationPermission: value,
            }, () => {
              if (this.state.locationPermission) {
                location.getGeoLocation().then((value) => {
                  this.setState({
                    locationDetails: value,
                  })
                })
              }
              else {
                location.requestPermission().then(value => {
                  if (value) {
                    location.getGeoLocation().then((value) => {
                      this.setState({
                        locationPermission: value,
                        locationDetails: value,
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

    _fetchUpcomingBookingData =async () => {
        let user_id = await Session.getUserId();
        var params = {
            "user_id": user_id, 
        }
        this.setState({
            spinner: true,
        })

        getBookinglistAPI(params, MEMBER_PREVIOUS_BOOKING).then((result) => {
            //////console.log(result.status);
            this.setState({
                spinner: false,
            });
            if (result.status == true) {
               // ////console.log("Previous Booking: ", result.dataArray);
                if (result.dataArray.length == 0) {
                    this.setState({
                        data: [],
                        APIMessage: result.message,
                    })
                }
                else {
                    this.setState({
                        data: result.dataArray,
                    });
                }
            }
            else {
                if (result.message == "Network Error") {
                    CommonHelpers.showFlashMsg("Network Error, Try Again.", "danger");
                }
                else if (result.message == "Booking not found"){
                   // CommonHelpers.showFlashMsg("No previous bookings to show.", "danger");
                }
            }
        })

    }

   

    _saveDetails = (item) => {
        this.setState({
            checkin_checkout_date: moment(),
            selectedBooking: item,
            longitude: this.state.locationDetails.coords.longitude,
            latitude: this.state.locationDetails.coords.latitude,
        }, () => {
           // ////console.log(this.state.checkin_checkout_date, this.state.selectedBooking);
        })
    }

    openBookedPropertyItem = (item) => {
        ////////console.log("Pressed")
        this.props.navigation.push('bookedpropertydetails',{
            item: item,
            from: 'list'
          } )
       
      };

      raiseIssue = async(params) => {
        ////console.log("params: ", params);
        let user_details = await Session.getUserDetails();
        user_details  = JSON.parse(user_details);
        const emp_login = Number(user_details.role_id) == 7 ? 1: 0;
        ////console.log('role id: ', emp_login);
        this.props.navigation.push('raiseissue', {
            emplogin: emp_login,
            params: params,
            purpose: "new",
        })
    }

    _renderProperties = ({ item, index })=>{
        let imageList = CommonHelpers.processRawImages(item.property_images);
   /*  item.property_images.forEach(element => {
      imageList.push({ url: AWS_URL + element.image_path });
    }); */
console.log(item);
    return (
        <TouchableWithoutFeedback onPress={() => {
         // ////console.log("clicked.");
          //this.openPropertyDetail(item.id);
          this.openBookedPropertyItem(item.id)
        }} >
          <View height={400}>
  
            <SimilarPropertiesCard
            from = "SRP"
              imageList={imageList}
              isLogin= {true}
              iconName='heart'
              iconColor='orange'
              contentdetails={
                  <View style={[box.detailsBox, { marginTop: "7%", height: 100, marginBottom: "1%" }]}>
                      
                          <View style = {{ flexDirection: 'row', alignItems : 'center', justifyContent: 'space-between' }}>

                          <Text
                              style={[font.semibold,
                              font.sizeMedium,
                              color.blackColor, { /* marginBottom: 10, */ width: Dimensions.get('screen').width * 0.5, flexWrap: 'wrap' }]}>
                              {item.status.toString() == '1' ?  item.property_details.property_name : item.property_details.pseudoname}
                          </Text>
                          <TouchableOpacity style = {[button.defaultRadius, color.orangeBorder, ]}
                          onPress = {()=>{
                              this.raiseIssue(item);

                          }}
                          >
                              <Text style = {[font.regular, font.sizeRegular, color.myOrangeColor]}> Raise Issue</Text>
                          </TouchableOpacity>
                        
                          </View>

                      <Text
                              style={[font.regular,
                              font.sizeMedium,
                              color.darkgrayColor, { marginBottom: "1%" }]}>
                              {item.booking_id}
                          </Text>
                      <View style = {{flex: 1, flexDirection: "row"}}>
                        <View style={{flex:1/* marginRight: 20 */}}>
                        <Text style={[font.semibold, font.sizeRegular, color.lightBlack]}>From</Text>
                        <Text style={[font.sizeRegular,font.regular, color.grayColor]}>
                        {moment(item.start_date).format('MMM DD YYYY')}
                        </Text>
                        <Text style={[font.sizeRegular,font.regular, color.grayColor]}>
                        {moment(item.start_date).format('HH:mm')}Hrs
                        </Text>
                        </View>
                        <View style= {{flex: 1/* marginRight: 20 */}}>
                        <Text style={[font.semibold, font.sizeRegular,color.lightBlack]}>To</Text>
                        <Text style={[font.sizeRegular,font.regular, color.grayColor]}>
                        {moment( item.end_date).format('MMM DD YYYY')}
                        </Text>
                        <Text style={[font.sizeRegular,font.regular, color.grayColor]}>
                        {moment(item.end_date).format('HH:mm')}Hrs
                        </Text>
                        
                        </View>

                        <View style = {{flex: 1, flexWrap: 'wrap'}}>
                            <Text style={[font.semibold, font.sizeRegular,color.lightBlack]}>Status</Text>
                            <Text style={[font.semibold, font.sizeRegular,color.myOrangeColor, {width: '100%', flexWrap: 'wrap'} ]}>{ CommonHelpers.bookingStatusInfo(item.status.toString())}</Text>
                            </View>
                    </View>
                  </View>
              } />
  
  
          </View>
        </TouchableWithoutFeedback>
      );

    }

    render() {
        return (
            this.state.spinner ? <Spinner/>:

            this.state.data.length == 0 ? <View style = {[ box.centerBox]}>
                <Text style = {[font.semibold, font.regular, color.darkgrayColor, {textAlign: "center"}]}>No Previous Bookings to show!</Text>
            </View>

            :
            
            <View style={{ marginTop: "5%", marginBottom: "10%" }}>
                {
                    this.state.data.length == 0 ? <Text>{this.state.APIMessage}</Text> :

                        this.state.spinner? <Spinner/>:

                        <FlatList
                        data={this.state.data}
                        renderItem={this._renderProperties}
                        horizontal={false}
                        keyExtractor={(item) => item.booking_id}
                        />
                }

                


            </View>
            
        );

    }
}