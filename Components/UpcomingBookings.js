import React, { Component } from 'react';
import { View, Text, Platform, TouchableOpacity, ScrollView, TouchableWithoutFeedback, Dimensions} from 'react-native';

import moment from 'moment';
import button from '../Styles/button';

import font from '../Styles/font';
import box from '../Styles/box';
import color from '../Styles/color';
import { cancelMemberBooking, getBookinglistAPI } from '../Rest/userAPI';
import CommonHelpers from '../Utils/CommonHelpers';
import { AWS_URL, MEMBER_UPCOMING_BOOKING } from '../config/RestAPI';
import Spinner from '../Utils/Spinner';
import Modal from 'react-native-modalbox';
import Session from '../config/Session';
import { login_check } from '../Rest/userAPI';
import FlatListComponent from './ReusableComponents/FlatlistComponent';
import SimilarPropertiesCard from './ReusableComponents/SimilarPropertiesCard';
import location from '../Location/location';
import Pdf from 'react-native-pdf';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { TextInput } from 'react-native-gesture-handler';
import renderItem from '../Styles/renderItem';




export default class UpcomingBookings extends Component {
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
            statusText: '--',
            cancelModal: false,
            cancelItem: '',
            cancellationReason: '',
            policyDocPath: null,
            policydocName: null

        }
    }

  /*   bookingStatusInfo = (booking_status)=>{
        ////console.log("this.state.data.booking_status",booking_status);
        let statusText = '--'
        switch(booking_status) {
            case '0': 
                statusText="New Booking Request";
            
            break;
            case '1':  
                statusText= "Confirmed";
           
            break;
            case '2':
                statusText="Rejected";
            
            break;
            case '3': 
                statusText= "Waiting for Corporate Approval"
            
            break;
            case '4': 
                statusText= "Corporate Rejected"
           
            break;
            case '5': 
                statusText= "Payment Pending"
           
            break;
            case '6': 
                statusText= "Payment Failure"
           
            break;
           case '7': 
               statusText= "Completed"
               break;
           
        }
        return statusText;
    } */

    componentDidMount() {

        login_check().then(async(result) => {
            ////console.log("login check", result.message, result.status);
           if(!result.status){
            await Session.setUserDetails({});
            await Session.setUserToken('');
            //////console.log(await Session.getUserDetails());
            await Session.setUserId('');
            await Session.setUserName('');
            this.props.navigation.push('auth',{screen: 'Login'})
           
             CommonHelpers.showFlashMsg("Session Expired. Please login again.", "danger");
            
           }
           else{
            this._fetchUpcomingBookingData();

            location.check().then((value) => {
                this.setState({
                  locationPermission: value,
                }, () => {
                  if (this.state.locationPermission) {
                    location.getGeoLocation().then(async(value) => {
                        await Session.setLocationCoords(value);
                      this.setState({
                        locationDetails: value,
                      })
                    })
                  }
                  else {
                    location.requestPermission().then(value => {
                      if (value) {
                        location.getGeoLocation().then(async(value) => {
                            await Session.setLocationCoords(value);
                          this.setState({
                            locationPermission: true,//value,
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
      
          }).catch(error => {
            ////console.log(error)
          })
       
    }

    _fetchUpcomingBookingData =async () => {
        let user_id = await Session.getUserId();
        var params = {
            "user_id": user_id
        }
        this.setState({
            spinner: true,
        })
        

        getBookinglistAPI(params, MEMBER_UPCOMING_BOOKING).then((result) => {
            ////////console.log(result.status);
            this.setState({
                spinner: false,
            });
            if (result.status == true) {
               //////console.log("Upcoming Booking: ", result.dataArray);
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
                else if(result.message == "Booking not found"){
                    this.setState({
                        data: [],
                        APIMessage: "No Upcoming Bookings to show!"
                    })
                    //CommonHelpers.showFlashMsg("No Upcoming Bookings to show!", "danger");
                }
            }
        })

    }

    

   

    handleCancel = ()=>{
        const item = this.state.cancelItem;
        console.log(item)
        this.setState({
            spinner: true,
            cancelModal: false
        })
        const params = {
            "booking_id": item.id ,
            'rsn_for_req_cancel': this.state.cancellationReason,
           // "user_id": Number(await Session.getUserId()),
        }
        console.log(params);

        cancelMemberBooking(params).then(result=>{
            this.setState({
                spinner: false,
                cancelModal: false,
                cancelItem: ''
            })
            

            if(result.status){
                CommonHelpers.showFlashMsg(result.message, "success");
                this._fetchUpcomingBookingData();
            }
            else{
                CommonHelpers.showFlashMsg(result.message, "danger");
            }

        }).catch(error=>{//////console.log("error in cancellation")
        })
    }



    goBack = () => {
        this.props.navigation.goBack();
        return true;
        
    }

    _saveDetails = (item) => {
        this.setState({
            checkin_checkout_date: moment(),
            selectedBooking: item,
            longitude: this.state.locationDetails.coords.longitude,
            latitude: this.state.locationDetails.coords.latitude,
        }, () => {
           // //////console.log(this.state.checkin_checkout_date, this.state.selectedBooking);
        })
    }

    _renderProperties = ({ item, index })=>{
      //console.log('upcoming booking status:', item, CommonHelpers.bookingStatusInfo(item.booking_status.toString()));
        
        let imageList = CommonHelpers.processRawImages(item.property_images);
   /*  item.property_images.forEach(element => {
      imageList.push({ url: AWS_URL + element.image_path });
    }); */

    return (
        <TouchableWithoutFeedback onPress={() => {
         // //////console.log("clicked.");
          this.openBookedPropertyItem(item);
        }} >
          <View height={400}>
  
            <SimilarPropertiesCard
              from = "SRP"
              imageList={imageList}
             isLogin= {true}
              iconName='heart'
              iconColor='orange'
              
              contentdetails={
                  <View style={[box.detailsBox, { marginTop: "1%",/*  height: 100, */ marginBottom: "3%" }]}>
                      <Text
                              style={[font.semibold,
                              font.sizeMedium,
                              color.blackColor, { marginBottom: 10 }]}>
                              { item.booking_status == '1' ?  item.property_details.property_name : item.property_details.pseudoname}
                          </Text>
                      
                          <Text
                              style={[font.regular,
                              font.sizeMedium,
                              color.darkgrayColor, { marginBottom: "1%" }]}>
                              {item.booking_id}
                          </Text>
                          
                      
                      
                     
                      
                       <View style = {{flex: 1, flexDirection: "row",}}>
                        <View /* style={{marginRight: 20}} */ style = {{flex: 1}}>
                        <Text style={[font.semibold, font.sizeRegular, color.lightBlack]}>From</Text>
                        <Text style={[font.sizeRegular,font.regular, color.grayColor]}>
                        {moment(item.start_date).format('MMMM DD YYYY')}
                        </Text>
                        <Text style={[font.sizeRegular,font.regular, color.grayColor]}>
                        {moment(item.start_date).format('HH:mm')}Hrs
                        </Text>
                        </View>
                        <View style = {{flex: 1}}>
                        <Text style={[font.semibold, font.sizeRegular,color.lightBlack]}>To</Text>
                        <Text style={[font.sizeRegular,font.regular, color.grayColor]}>
                        {moment( item.end_date).format('MMMM DD YYYY')}
                        </Text>
                        <Text style={[font.sizeRegular,font.regular, color.grayColor]}>
                        {moment(item.end_date).format('HH:mm')}Hrs
                        </Text>
                        
                        </View>
                    </View> 

                                {Number(item.status) == 1 ?  
                                <View style = {[{flex: 1 ,flexDirection: "row", alignItems:"center", marginTop: '8%'}]}>
                                      <Text  style={[font.semibold,{flex: 1},
                              font.sizeVeryRegular,
                              color.myOrangeColor,/*  { marginBottom: "1%" } */]}>
                                Status: {CommonHelpers.bookingStatusInfo(item.booking_status.toString())}
                              </Text>
                              
                                <TouchableOpacity style = {{flex: 1,}}
                                onPress = {async()=>{
                                  console.log('cancellation policy document: ', AWS_URL + item.cancellation_policy_doc.tc_type_template_path, item.cancellation_policy_doc.tc_type_name);
                                    this.setState({
                                        cancelModal: true,
                                        cancelItem: item,
                                        policyDocPath: AWS_URL + item.cancellation_policy_doc.tc_type_template_path,
                                        policydocName: item.cancellation_policy_doc.tc_type_name,
                                    })
                                   
                                }}
                                >
                        <Text style ={[button.defaultRadius, 
                           font.bold, color.orangeColor, font.sizeMedium,
                            color.orangeBorder, {marginRight: "1%"}]}>Cancel</Text>
                    </TouchableOpacity>
                   
                    </View> 
                    :   <Text  style={[font.semibold,
                        font.sizeVeryRegular,
                        color.myOrangeColor,/*  { marginBottom: "1%" } */]}>
                          Status: {CommonHelpers.bookingStatusInfo(item.booking_status.toString())}
                        </Text> /* <Text style ={[ 
                           font.bold, color.orangeColor, font.sizeMedium,
                             ]}>{item.status}</Text> */ }

                  {/*   <TouchableOpacity>
                        <Text style ={[button.defaultRadius, 
                           font.bold, color.orangeColor, font.sizeMedium,
                            color.orangeBorder, {width: "60%"}]}>Modify Booking</Text>
                    </TouchableOpacity> */}
                  </View>
              } />
  
  
          </View>
        </TouchableWithoutFeedback>
      );

    }

    openBookedPropertyItem = (item) => {
      //console.log(item)
        item.is_meeting_space_booking==1 ?
        this.props.navigation.push('bookinginformationpage',{
          item: item.id,
          from: 'list'
        } ):

        this.props.navigation.push('bookedpropertydetails',{
            item: item.id,
            from: 'list'
          } )
      };

    render() {
        return (
            this.state.data.length == 0 ? <View style = {[box.centerBox]}>
                <Text style = {[font.semibold, font.regular, color.darkgrayColor, {textAlign: "center"}]}>{this.state.APIMessage}</Text></View> :
            
            <View style={{ marginTop: "5%", marginBottom: "10%" }}>


              



                {
                    this.state.data.length == 0 ? <Text>{this.state.APIMessage}</Text> :

                        this.state.spinner? <Spinner/>:

                        <FlatListComponent
                        data={this.state.data}
                        renderItem={this._renderProperties}
                        horizontal={false}
                       /*  ListFooterComponent = {
                          <BottomTabNavigator/>
                        } */
                        />

                }

{this.state.cancelModal && <Modal position={"center"} swipeToClose = {false}
                onClosed = {()=>{this.setState({cancelModal: false})}}
                style  ={{
                    //justifyContent: 'space-around',
                    //alignItems: 'space-around',
                    //padding: 20,
                    height: Dimensions.get('screen').height * 0.5 ,
                    width:Dimensions.get('screen').width * 0.9,
                  }} isOpen={this.state.cancelModal}>
                <View height = {"100%"}>
                  <KeyboardAwareScrollView>
                    <View style = {[/* box.centerBox, */ color.inputBackground, {alignItems: "flex-start", padding: "4%" }]}>
                        <Text style = {[font.semibold, font.sizeMedium, color.blackColor, ]}>Confirmation</Text>
                    </View>

                    <View style = {[box.centerBox]}>
                        <Text style = {[font.semibold, font.sizeMedium, color.blackColor, {flex: 1} ]}>Do you wish to cancel the booking?</Text>
                        <View style = {{flex: 1}}>
                            <Text style = {[font.sizeVeryRegular, font.semibold, color.myOrangeColor,]}>Cancellation Policy</Text>
                            <Text style = {[font.sizeSmall, font.semibold, color.blackColor, ]}>Within 24 Hrs of booking date and time- {'\u20B9'}{Intl.NumberFormat('en-IN').format(0)} Refund</Text>
                            <Text style = {[font.sizeSmall, font.semibold, color.blackColor, ]}>Within 24-48Hrs - 50% Refund</Text>
                            <Text style = {[font.sizeSmall, font.semibold, color.blackColor, ]}>Above 48Hrs - 100% Refund</Text>
                        </View>
                        
                        <View>
                          <TextInput
                          style = {renderItem.inputBox}
                          placeholder='Reason for Cancellation'
                          placeholderTextColor={color.myOrangeColor.color}  
                          selectionColor={color.myOrangeColor.color}
                          value={this.state.cancellationReason}
                          onChangeText={(value)=>{
                            this.setState({
                              cancellationReason: value,
                            })


                          }}
                           />
                      <Text style = {[font.sizeVeryRegular, font.semibold, color.myOrangeColor,{textDecorationLine:'underline', }]}>{this.state.policydocName}</Text>
                      {/* <Text style = {[font.sizeSmall, font.semibold, color.darkgrayColor,]}>.docx will be downloaded.</Text> */}
                      <View style={{
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
       marginTop: 25,
    }}>
                <Pdf
                trustAllCerts={false}
                fitPolicy = {2}
                    source={{uri: this.state.policyDocPath}} 
                    onLoadComplete={(numberOfPages,filePath) => {
                        console.log(`Number of pages: ${numberOfPages}`);
                    }}
                    onPageChanged={(page,numberOfPages) => {
                        console.log(`Current page: ${page}`);
                    }}
                    onError={(error) => {
                        console.log(error);
                    }}
                    onPressLink={(uri) => {
                        console.log(`Link pressed: ${uri}`);
                    }}
                    style={{
                      flex:1,
                      width:Dimensions.get('window').width*0.8,
                      height:Dimensions.get('window').width,
                  }}/>
            </View>
                      
                    </View>
                    
                    </View>
                    </KeyboardAwareScrollView>
                   

                    <View style = {{/* flex: 1, */ flexDirection: "row", height: 80}}>
                    <TouchableOpacity style = {[color.lightGrayBackColor,{bottom: 0,flex: 1, marginTop: "auto",  height: "100%", justifyContent: "center", borderRightWidth: 1, borderRightColor: "white"}]}
                    onPress = {async()=>{
                        this.setState({
                            cancelModal: false,
                        })   
                    }}>
                        <Text style = {[font.bold, font.sizeLarge, color.blackColor,  {textAlign: "center"}]}>Not Now</Text>
                    </TouchableOpacity>
                    

                    <TouchableOpacity style = {{bottom: 0,flex: 1, marginTop: "auto", backgroundColor: "orange", height:"100%", justifyContent: "center"}}
                    onPress = {async()=>{
                        this.handleCancel();
                    }}>
                        <Text style = {[font.bold, font.sizeLarge, color.textWhiteColor, {textAlign: "center"}]}>Yes, Cancel</Text>
                    </TouchableOpacity>
                    </View>
                   

                   
                </View>
           
                    </Modal>}

                    

                   


            </View>
            
        );

    }
}