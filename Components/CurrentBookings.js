import React, { Component } from 'react';
import { View, Text, Platform, TouchableOpacity, ScrollView, TouchableWithoutFeedback, Dimensions, ActionSheetIOS} from 'react-native';
import moment from 'moment';
import button from '../Styles/button';
import font from '../Styles/font';
import box from '../Styles/box';
import color from '../Styles/color';
import { membercurrentbookingapi, get_user_document_api,getUserLocationAPI, empCurrentReservationAPI, empUpcomingReservationAPI,  post_emp_checkout, post_emp_check_details, deleteEmpSeatReservationAPI, getRoleDocumentAPI } from '../Rest/userAPI';
import CommonHelpers from '../Utils/CommonHelpers';
import Spinner from '../Utils/Spinner';
import FlatListComponent from './ReusableComponents/FlatlistComponent';
import SimilarPropertiesCard from './ReusableComponents/SimilarPropertiesCard';
import Modal from 'react-native-modalbox';
import QRCodeScanner from 'react-native-qrcode-scanner';
import Session from '../config/Session';
import { Picker } from '@react-native-picker/picker';
import DocumentPicker from "react-native-document-picker";
import Icon from 'react-native-vector-icons/FontAwesome';
import location from '../Location/location';
import CustomePushNotifications from './CustomePushNotifications';

export default class CurrentBookings extends Component {
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

             //pagination variables
             enablePagination: false,
             prev_page_url: null,
             next_page_url: null,
             last_page_url: null,
             links: [],
             //paginationvariables ends

             //check in -check out
             checkinButtonHide: false,

            checkinModal: false,
            checkinPropertyName: '',
            checkinReservationId: '',
            checkinDateTime: '',
            property_id:'',

            checkout_id: '',
            checkout_booking_id: '',

            closing_time: '',

            iDTypeList: [],
            iIDTypeList: [],
            selectedIdType: '',
            enableIdSelection: false,
            checkinIDProof: [],
            checkinVACcert: [],

            hide_id_proof: false,
            hide_cert: false,
            hideCheckin: false,
            documentsExist: false,
            storageReadPermission: null,
            storageWritePermission: null,
            imagesource: {},

            cancelModal: false,
            cancelItem: '',
            

            scanModal: false,
            scandata: null

            //check in check out ends
            

        }
    }

    componentDidMount() {
        this.notifications = CustomePushNotifications.configureNotifis(this.props.navigation);
        //let time = CommonHelpers.getAlertTime('14:30');
       //CustomePushNotifications.checkinReminder(new Date(), 'Checkout Alert', "You have been checked-out of the property", this.notifications);
       // CustomePushNotifications.checkoutReminder(new Date(), 'tets', this.notifications);
        this._fetchCurrentBookingData();

        location.check().then((value) => {
            this.setState({
              locationPermission: value,
            }, () => {
              if (this.state.locationPermission) {
                location.getGeoLocation().then(async(value) => {
                    await Session.setLocationCoords(value);
                  this.setState({
                    locationDetails: value,
                  }, () => {
                   // this.apiCallPropertyNearBy();
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
                        locationPermission: true, //value,
                        locationDetails: value,
                      }, () => {
                        //this.apiCallPropertyNearBy();
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

    _fetchCurrentBookingData =async () => {
        
        this.setState({
            spinner: true,
        })
        //let user_id = await Session.getUserId();

        membercurrentbookingapi().then((result) => {
            //////////console.log(" current bookings: ",result.status);
            this.setState({
                spinner: false,
            });
            if (result.status == true) {
                ////////////console.log("Current Booking: ", result.dataArray);
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
                else if(result.message == "Request failed with status code 404"){
                    this.setState({
                        data: [],
                        APIMessage: "No Current Bookings for you!",
                    })
                    //CommonHelpers.showFlashMsg("No Current Bookings for you!", "danger");
                }
            }
        })

        this.getDocumentList();

    }

   openScanPage = (property) => {
        this.props.navigation.push('scanpage', {
            property: property
          })
      }



    goBack = () => {
        this.props.navigation.goBack();
        
    }

    _saveDetails = (item) => {
        this.setState({
            checkin_checkout_date: moment(),
            selectedBooking: item,
            longitude: this.state.locationDetails.coords.longitude,
            latitude: this.state.locationDetails.coords.latitude,
        }, () => {
            //////////console.log(this.state.checkin_checkout_date, this.state.selectedBooking);
        })
    }

    raiseIssue = async(params) => {
        //////console.log("params: ", params);
        let user_details = await Session.getUserDetails();
        user_details  = JSON.parse(user_details);
        const emp_login = Number(user_details.role_id) == 7 ? 1: 0;
        //////console.log('role id: ', emp_login);
        this.props.navigation.push('raiseissue',{
            emplogin: emp_login,
            params: params,
            purpose: "new",
        })
        
         }

    _renderProperties = ({ item, index })=>{
        //////////console.log( "current booking item $$$$$$$",item);
        let imageList = CommonHelpers.processRawImages(item.property_images);
    /* item.property_images.forEach(element => {
      imageList.push({ url: AWS_URL + element.image_path });
    }); */

    let checkinButtonHide = false;
    let hidebuttons = false;
    //////////console.log("item.item.today_check_in_out.length", item.today_check_in_out.length);
    item.today_check_in_out.length == 0  ? checkinButtonHide = false : checkinButtonHide = true;
    if(item.today_check_in_out.length != 0 && ( item.today_check_in_out[0].check_in_status == 1 && item.today_check_in_out[0].check_out_status == 1 )){
        hidebuttons = true;
     }

    return (
        <TouchableWithoutFeedback onPress={() => {
         // //////////console.log("clicked.");
          //this.openPropertyDetail(item);
        }} >
          <View height={400}>
  
           <SimilarPropertiesCard
            from = "SRP"
              imageList={imageList}
              
              iconName='heart'
              iconColor='orange'
              contentdetails={
                  <View style={[box.detailsBox, { marginTop: "1%", height: 100, marginBottom: "3%" }]}>
                      <View style={{ flex: 1 }}>

                          

                          <Text
                              style={[font.semibold,
                              font.sizeMedium,
                              color.blackColor, { /* marginBottom: 10  */}]}>
                              {item.property_details.property_name }
                          </Text>
                          <Text
                              style={[font.regular,
                              font.sizeMedium,
                              color.darkgrayColor, { marginBottom: "1%" }]}>
                              {item.booking_id}
                          </Text>
                         
                          


                      </View>
                      <View style = {{flex: 1, flexDirection: "row"}}>
                        <View style={{/* marginRight: 20 */flex: 1, }}>
                        <Text style={[font.semibold, font.sizeRegular, color.lightBlack]}>From</Text>
                        <Text style={[font.sizeRegular,font.regular, color.grayColor]}>
                        {moment(item.start_date).format('MMMM DD YYYY')}
                        </Text>
                        <Text style={[font.sizeRegular,font.regular, color.grayColor]}>
                        {moment(item.start_date).format('HH:mm')}Hrs
                        </Text>
                        </View>
                        <View style = {{flex: 1, marginBottom : 5}}>
                        <Text style={[font.semibold, font.sizeRegular,color.lightBlack]}>To</Text>
                        <Text style={[font.sizeRegular,font.regular, color.grayColor]}>
                        {moment( item.end_date).format('MMMM DD YYYY')}
                        </Text>
                        <Text style={[font.sizeRegular,font.regular, color.grayColor]}>
                        {moment(item.end_date).format('HH:mm')}Hrs
                        </Text>
                        
                        </View>
                    </View>
                    <View style={{ flex: 1, padding: 5, marginTop: 20, flexDirection : 'row' }}>
                        <View style = {{flex: 1, marginRight: '1%'}}>
                                        { hidebuttons ? <Text style = {[color.myOrangeColor, font.sizeRegular, font.semibold]}>You have checked out of the property for the day.</Text> : 
                                            !checkinButtonHide ?

                                                <TouchableOpacity onPress={async () => {

                                                    
                                                    let startTime = CommonHelpers.getMomentTime(moment(item.start_date));
                                                    let endtime = CommonHelpers.getMomentTime(moment(item.end_date));
                                                    let currenttime = CommonHelpers.getMomentTime(moment(new Date()));
                                                    //console.log('allow? : ',currenttime.isBetween(startTime, endtime))

                                                    if(currenttime.isBetween(startTime, endtime)){
                                                        this.props.homePageVisible ? this.openScanPage(item) :

                                                        this.setState({
                                                            checkinPropertyName: item.property_details.property_name,
                                                            checkinReservationId: item.id,
                                                            checkinDateTime: moment(new Date()),
                                                            property_id: item.property_id,
                                                            closing_time: item.property_details.end_at,
                                                            scanModal: true //new
                                                            //checkinModal: true,
                                                        }, () => {
                                                           // this._get_user_document(); //old
                                                        });
                                                        

                                                    }
                                                    else{
                                                        CommonHelpers.showFlashMsg('Please try between '+moment(item.start_date).format('HH:mm')+'Hrs to ' + moment(item.end_date).format('HH:mm')+'Hrs.', 'danger' )
                                                    }
                                                    //this.openScanPage();

                                                   

                                                }}>
                                                    <Text style={[color.orangeColor, color.orangeBorder,font.semibold, font.sizeRegular, /* {textDecorationLine: "underline", textDecorationColor: "gray"} */, button.defaultRadius]}>Check-in</Text>
                                                </TouchableOpacity>
                                                :
                                                <TouchableOpacity onPress={() => {

                                                    let startTime = CommonHelpers.getMomentTime(moment(item.start_date));
                                                    let endtime = CommonHelpers.getMomentTime(moment(item.end_date));
                                                    let currenttime = CommonHelpers.getMomentTime(moment(new Date()));
                                                    //console.log('allow? : ',currenttime.isBetween(startTime, endtime))

                                                    if(currenttime.isBetween(startTime, endtime)){
                                                    //////////console.log(" id  *******", item.id)
                                                    this.props.homePageVisible ? this.openScanPage(item) :
                                                    this.setState({
                                                        checkout_id: item.today_check_in_out[0].id,
                                                        checkout_booking_id: item.id,
                                                        scanModal: true,
                                                        checkinButtonHide: true,
                                                        property_id: item.property_id,
                                                        checkinPropertyName: item.property_details.property_name,
                                                    })
                                                } else{
                                                    CommonHelpers.showFlashMsg('Please try between '+moment(item.start_date).format('HH:mm')+'Hrs to ' + moment(item.end_date).format('HH:mm')+'Hrs.', 'danger' )
                                                }

                                                    //this._handleCheckout(item.item.today_check_in_out[0].id, item.item.id)

                                                }}>
                                                    <Text style={[color.orangeColor, color.orangeBorder, font.semibold, font.sizeRegular, /* {textDecorationLine: "underline", textDecorationColor: "gray"} */, button.defaultRadius]}>Check-out</Text>
                                                </TouchableOpacity>

                                        }
                                        </View>

                            <TouchableOpacity  style = {{flex: 1, marginLeft: '1%'}} onPress = {()=>{
                                this.raiseIssue(item);
                            }}>
                              <Text style={[color.orangeColor, 
                                color.orangeBorder,
                                font.semibold, 
                                font.sizeRegular, 
                                /* {textDecorationLine: "underline", textDecorationColor: "gray"} */, 
                                button.defaultRadius]}> Raise Issue</Text>
                          </TouchableOpacity>

                                    </View>
                                    <View>
                                    {checkinButtonHide && <Text style={[font.regular, font.sizeRegular, color.blackColor]}>check-in Time: {item.today_check_in_out[0].check_in_timestamp} </Text>}
                                </View>
                  </View>
              } /> 
  
  
          </View>
        </TouchableWithoutFeedback>
      );

    }

    //checkin-checkout functions
    _get_user_document = () => {
        this.setState({
            spinner: true,
        })
        get_user_document_api().then(result => {
            this.setState({
                spinner: false,
            })
            //////////console.log("get user document result: ", result.status);
            if (result.status) {
                //////////console.log("here");
                if (result.dataArray.length > 0) {
                    this.setState({
                        hide_id_proof: true,
                        hide_cert: true,
                        documentsExist: true,
                        //scanModal: true, //old
                       //checkinModal: true,
                    });
                    this._handleCheckinData();
                }
                else {
                    this.setState({
                        checkinModal: true,
                    })
                   
                    //////////console.log("files not uploaded.");
                } 

            }
        })
    }

    onSuccess = async (e) => {
        
        if(!isNaN(Number(e.data))){
            let locationCoords = await Session.getLocationCoords();
        locationCoords = JSON.parse(locationCoords);
        //////////console.log(locationCoords);
        let myscandata = {
            "latitude": locationCoords.coords.latitude.toString(),  //13.101140 ,//locationCoords.coords.latitude,// e.data.split(':')[1].substring(1,11),
            "longitude": locationCoords.coords.longitude.toString(),//80.162361, //locationCoords.coords.longitude,//e.data.split(':')[2].substring(1,11),
            "property_id": Number(e.data)//this.state.property_id,
        }
        
        this.setState({
            scandata: myscandata,
            scanModal: false,
            //checkinModal: true,
        }, ()=>{
            if(this.state.checkinButtonHide){
                this._handleCheckout(this.state.checkout_id, this.state.checkout_booking_id);
            }
            else{
                //this._handleCheckinData(); //old
                this._get_user_document(); // new 
            }
            //this.getUserLocation();
        })

        }
        else{
            CommonHelpers.showFlashMsg("Regenerate the QR.");
        }

        
        
    };

    getUserLocation = () =>{
        getUserLocationAPI(this.state.scandata).then(result=>{
            //////////console.log(result.status, result.message);
            if(result.status){
                //////////console.log("checking the checking button status.: ********", this.state.checkinButtonHide);
                if(this.state.checkinButtonHide){
                    this._handleCheckout(this.state.checkout_id, this.state.checkout_booking_id);
                }
                else{
                    //this._handleCheckinData(); //old
                    this._get_user_document(); // new 
                }
                
            }
            else{
                CommonHelpers.showFlashMsg(result.message, "danger");
                this.setState({
                    scandata: null,
                    checkinModal: false,
                    scanModal: false,
                })
            }
        }).catch(error=>{//////////console.log("user location error: ", JSON.stringify(error))
        })



    }

    _handleCheckinData = async () => {
        let locationCoords = await Session.getLocationCoords();
        locationCoords = JSON.parse(locationCoords);
        //////////console.log("check_in data initiated", this.state.hide_id_proof);
        if (this.state.hide_id_proof) {
            //console.log('here after check in&&&&')
            const params = {

                "user_id": Number(await Session.getUserId()),

                "booking_id": this.state.checkinReservationId,
                //new params
                "latitude": /* '17.6140077',// */locationCoords.coords.latitude.toString(),  
                    "longitude":/* '78.0815627',// */locationCoords.coords.longitude.toString(),
                'is_mobile' : 1,
                'property_id' : this.state.scandata.property_id,

            }
            //////////console.log("calling handle check in with params: ", params);

            this._handleCheckin(params);

        }
        else {
            //console.log('here after check in*******')
            const params = new FormData();
            if (this.state.checkinIDProof.length != 0) {
                params.append('govt_id_path', { name: this.state.checkinIDProof[0].name, type: this.state.checkinIDProof[0].type, uri: this.state.checkinIDProof[0].uri });
                if (this.state.checkinVACcert.length != 0) {
                    params.append('vaccination_certificate', { name: this.state.checkinVACcert[0].name, type: this.state.checkinVACcert[0].type, uri: this.state.checkinVACcert[0].uri })
                }

                const otherParams = {

                    "user_id": Number(await Session.getUserId()),

                    "booking_id": this.state.checkinReservationId,
                    //new params
                    "latitude": /* '17.6140077',// */locationCoords.coords.latitude.toString(),  
                    "longitude":/* '78.0815627',// */locationCoords.coords.longitude.toString(),
                    'is_mobile' : 1,
                    'property_id' : this.state.scandata.property_id,

                }

                Object.keys(otherParams).forEach((key) => {
                    params.append(key, otherParams[key]);
                });
                //////////console.log("params: ", JSON.stringify(params));
                //////////console.log("calling handle check in with params: ", params);

                this._handleCheckin(params);

            }
            else {
                CommonHelpers.showFlashMsg("Please select the " + this.state.selectedIdType.value + " to upload.", "danger")
            }

        }
    }

    _handleIDupload = async () => {
        try {
            const res = await DocumentPicker.pick({
                type: [DocumentPicker.types.images],
                copyTo: "cachesDirectory"
            })
            //////////console.log("image details: ", res);
            this.setState({
                checkinIDProof: res,
                imagesource: { uri: res[0].fileCopyUri }
            });

            if(this.state.scandata == null){
                this.setState({
                    //checkinModal: false,
                    //scanModal: true,
                })
            }

        } catch (err) {
            //////////console.log(err)
        }

    }

    _handleVACcertUpload = async () => {
        try {
            const res = await DocumentPicker.pick({
                type: [DocumentPicker.types.pdf],
                copyTo: "cachesDirectory"
            })
            //////////console.log("pdf details: ", res);
            this.setState({
                checkinVACcert: res
            });

        } catch (err) {
            //////////console.log(err)
        }

    }

    _handleCheckin = (params) => {
        this.setState({
            spinner: true,
        })
        //console.log("called handle check in with params: ", params);

        if (this.state.hide_id_proof) {
            post_emp_checkout(params).then(async (result) => {
               //console.log("Result from the API: ", result.message);
                this.setState({
                    spinner: false,
                    checkinModal: false,
                    
                })
                if (result.status) {
                    this.setState({
                       // scandata: null, 
                        checkinButtonHide: true,
                    })
                    CommonHelpers.showFlashMsg("Checked in", "success");
                    //console.log('here after check in&&&&')
                    const alert_time = CommonHelpers.getAlertTime(this.state.closing_time);
                    CustomePushNotifications.checkinReminder(new Date(),'Check-in Alert', 'You have been checked-in to ' + this.state.checkinPropertyName, this.notifications, {type: 0});
                    CustomePushNotifications.checkoutReminder(alert_time, this.state.checkinPropertyName, this.notifications, {type: 0});
                    this._fetchCurrentBookingData();
                    

                }
                else {
                    if(typeof result.message != 'object'){
                        CommonHelpers.showFlashMsg("Could not check-in. " + result.message, "danger");
                    }else{
                        CommonHelpers.showFlashMsg("Could not check-in. QR Code is not configured properly.", "danger");
                    }
                    //CommonHelpers.showFlashMsg("Could not check-in. " + result.message, "danger");
                }
            })

        } else {
            post_emp_check_details(params).then(async (result) => {
                //console.log("Result from the API: ", result.message);
                //////////console.log("Result from the API: ", result.status);
                this.setState({
                    spinner: false,
                    checkinModal: false,
                    
                })
                if (result.status) {
                    CommonHelpers.showFlashMsg("checked in successfully", "success");
                    //console.log('here after check in****')
                    this.setState({
                        scandata: null, 
                        checkinButtonHide: true,
                    })
                    const alert_time = CommonHelpers.getAlertTime(this.state.closing_time);
                    CustomePushNotifications.checkinReminder(new Date(), 'Check-in Alert', 'You have been checked-in to ' + this.state.checkinPropertyName, this.notifications, {type: 0});
                    CustomePushNotifications.checkoutReminder(alert_time, this.state.checkinPropertyName, this.notifications, {type: 0});
                    
                    this._fetchCurrentBookingData();
                    

                }
                else {
                    if(typeof result.message != 'object'){
                        CommonHelpers.showFlashMsg("Could not check-in. " + result.message, "danger");
                    }else{
                        CommonHelpers.showFlashMsg("Could not check-in. QR Code is not configured properly.", "danger");
                    }
                    
                    //CommonHelpers.showFlashMsg("Could not check-in. " + result.message, "danger");
                }
            })
        }
    }

    getDocumentList = ()=>{
        getRoleDocumentAPI().then(result=>{
            ////console.log(result.dataArray);
            let iIDtypeList = [];
            this.setState({
                 iDTypeList: result.dataArray,
        }, ()=>{
            this.state.iDTypeList.forEach(item=>{
                iIDtypeList.push(item.name);
    
            })
            ////console.log(iIDtypeList)
    
            this.setState({
                iIDTypeList: iIDtypeList
            })
        })
    })
    }

_handleCheckout = async (id, booking_id) => {
    let locationCoords = await Session.getLocationCoords();
    locationCoords = JSON.parse(locationCoords);
    ////////////console.log("inside check out",this.state.checkinReservationId);
    let params = {
        "id": Number(id),
        "booking_id":Number(booking_id),
        "user_id": Number(await Session.getUserId()),
        "latitude": /* '17.6140077',// */locationCoords.coords.latitude.toString(),  
                    "longitude":/* '78.0815627',// */locationCoords.coords.longitude.toString(),
        'is_mobile' : 1,
        'property_id' : this.state.scandata.property_id,
    };
    //////////console.log(params);
    this.setState({
        spinner: true,
    })
    post_emp_checkout(params).then(async (result) => {
        //////////console.log("Result from the API: ", result.status);
        this.setState({
            spinner: false,
            checkinModal: false
        })
        if (result.status) {
            CommonHelpers.showFlashMsg("Checked out", "success");
            this.setState({
                scandata: null, 
                checkinButtonHide: false,
            });
            CustomePushNotifications.checkinReminder(new Date(), 'Checkout Alert', "You have been cehcked-out of the "+ this.state.checkinPropertyName, this.notifications, {type: 0})
            CustomePushNotifications.cancelcheckoutNotification('1', this.notifications);
            this._fetchCurrentBookingData();

        }
        else {
            if(typeof result.message != 'object'){
                CommonHelpers.showFlashMsg("Could not check-out. " + result.message, "danger");
            }else{
                CommonHelpers.showFlashMsg("Could not check-out. QR Code is not configured properly.", "danger");
            }
           // CommonHelpers.showFlashMsg("Could not check-out. " + result.message, "danger");
        }
    })

}

    render() {
        let selectedIdType = this.state.selectedIdType;
        return (
            
                
                  this.state.data.length == 0 ? <View style = {[box.centerBox,]}><Text style = {[font.semibold, font.regular,  color.darkgrayColor,  {textAlign: "center"}]}>{this.state.APIMessage}</Text></View> :

                        this.state.spinner? <Spinner/>:
                        <View style={[{ marginTop: "5%", marginBottom: "10%" }]}>

                        <FlatListComponent
                        data={this.state.data}
                        renderItem={this._renderProperties}
                        horizontal={false}
                        />

{
                        this.state.scanModal && <Modal position={"center"} swipeToClose={false}
                            onClosed={() => { this.setState({ scanModal: false }) }}
                            style={{
                                height: Dimensions.get('screen').height * 1,
                                width: Dimensions.get('screen').width * 1,
                            }} isOpen={this.state.scanModal}>
                            <View height={"100%"}>
                                <QRCodeScanner
                                    ref={(node) => { this.scanner = node }}
                                    onRead={this.onSuccess}
                                    topContent={
                                        <View style={[{ width: "100%", flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center'}]}>
                                            <TouchableOpacity onPress = {()=>{
                                                this.setState({
                                                    scanModal: false
                                                })
                                            }}>
                                                <Icon name = 'angle-left' size = {30} color ='orange'/>
                                            </TouchableOpacity>
                                            <Text style={[color.lightBlack, font.regular, font.sizeSmall, { textAlign: "center" }]}>{this.state.checkinButtonHide ? 
                                    "Scan the QR code to check-out to the property.": 
                                    "Scan the QR code to check-in to the property."}</Text>
                                        </View>
                                    }
                                    topViewStyle={[box.centerBox,{paddingTop:"2%"}]/* { flex: 1, alignItems: "center", width: "100%", justifyContent: "flex-start", } */}
                                    showMarker = {true}
                                    bottomViewStyle={{ flex: 0, height: 0 }}
                                    cameraStyle={{ height: '100%' }}
                                    cameraContainerStyle={{
                                        flex: 20,
                                        justifyContent: "flex-end",
                                    }}
                                />

                            </View>

                        </Modal>
                    }

{this.state.checkinModal && <Modal position={"center"} swipeToClose={false}
                        onClosed={() => { this.setState({ checkinModal: false }) }}
                        style={{
                            
                            height: !this.state.hide_id_proof ? Dimensions.get('screen').height * 0.6 : Dimensions.get('screen').height * 0.5,
                            width: Dimensions.get('screen').width * 0.9,
                        }} isOpen={this.state.checkinModal}>
                        <View height={"100%"}>
                            <View style={[/* box.centerBox, */ color.inputBackground, { /* alignItems: "flex-start", */ padding: "4%" }]}>
                                <Text style={[font.semibold, font.sizeMedium, color.myOrangeColor,{textAlign: "center"}]}>Check-in Form</Text>
                            </View>

                            <ScrollView keyboardShouldPersistTaps={"always"}>
                                <View style={[box.centerBox, { flex: 1, flexDirection: "row" }]}>
                                    <Text style={[font.semibold, font.regular, color.blackColor, { flex: 1, }]}>Property Name</Text>
                                    <Text style={[font.semibold, font.regular, color.blackColor, { flex: 1, }]}>{this.state.checkinPropertyName}</Text>
                                </View>
                                <View style={[box.centerBox, { flex: 1, flexDirection: "row" }]}>
                                    <Text style={[font.semibold, font.regular, color.blackColor, { flex: 1, }]}>Reservation ID</Text>
                                    <Text style={[font.semibold, font.regular, color.blackColor, { flex: 1, }]}>{this.state.checkinReservationId}</Text>
                                </View>

                                <View style={[box.centerBox, { flex: 1, flexDirection: "row" }]}>
                                    <Text style={[font.semibold, font.regular, color.blackColor, { flex: 1, }]}>Check-in Date {'&'} Time</Text>
                                    <Text style={[font.semibold, font.regular, color.blackColor, { flex: 1, }]}>{moment(this.state.checkinDateTime).format("DD-MMMM-YYYY HH:mm")}Hrs</Text>
                                </View>

                                {!this.state.hide_id_proof && 
                                <View style={[box.centerBox]}>
                                    <Text style={[font.semibold, font.regular, color.blackColor]}>Type of Govt ID *</Text>
                                   {
                                     Platform.OS === 'ios' ? 

                                     <TouchableOpacity 
                                     style = {[button.defaultRadius, color.myOrangeColor, {borderColor: color.myOrangeColor.color}]}
                                     onPress = {()=>{
                                         ActionSheetIOS.showActionSheetWithOptions(
                                             {
                                                 options: this.state.iIDTypeList,
                                                 title: 'Select type of ID Proof',
                                                 tintColor: 'orange'
                                             },
                                             buttonIndex=>{
                                                 ////console.log(this.state.iDTypeList[buttonIndex])
                                                 this.setState({
                                                     selectedIdType: this.state.iDTypeList[buttonIndex],
                                                     enableIdSelection: true,
                                                 }, () => {
                                                     ////console.log("MY SELECTED id: ", this.state["selectedIdType"]);
     
     
                                                 });
 
                                             }
                                         )
                                     }}>
                                        
                                             {
                                                 this.state.selectedIdType != '' ?
                                             
                                             <View 
                                             style ={[{flexDirection: 'row', justifyContent: 'space-between', }]}> 
                                             <Text style ={[font.regular, font.sizeRegular, color.myOrangeColor,]} >{this.state.selectedIdType.name}</Text>
                                             <Icon name = 'angle-down' size = {15} color  ={color.myOrangeColor.color}/>
                                         </View> :
                                          <View 
                                          style ={[{flexDirection: 'row', justifyContent: 'space-between', }]}> 
                                          <Text  style ={[font.regular, font.sizeRegular, color.myOrangeColor,]}>Select ID Proof</Text>
                                          <Icon name = 'angle-down' size = {15} color  ={color.myOrangeColor.color}/>
                                      </View>
                                         
                                         }

                                     </TouchableOpacity>
                                     
                                     
                                     :
                                   
                                   <Picker
                                        selectedValue={selectedIdType}
                                        //prompt = "Property Name"
                                        style={[color.blackColor, { width: "100%", }]}
                                        dropdownIconColor="black"
                                        onValueChange={(itemValue, itemIndex) => {
                                            //////////console.log(itemIndex)

                                            if(itemIndex != 0){
                                                this.setState({
                                                    selectedIdType: itemValue,
                                                    enableIdSelection: true,
                                                }, () => {
                                                    //////////console.log("MY SELECTED id: ", this.state["selectedIdType"]);
    
    
                                                });

                                            }
                                            else{
                                                CommonHelpers.showFlashMsg("Please select a valid ID Proof", "danger");
                                            }

                                            
                                        }
                                        }>
                                            <Picker.Item label={"Select"} value={"Select"} fontFamily="Montserrat-SemiBold" />
                                        {

                                            this.state.iDTypeList.map((item) => {

                                                return (
                                                    <Picker.Item label={item.name} value={item} fontFamily="Montserrat-SemiBold" />);
                                            })
                                        }
                                    </Picker>}
                                    {this.state.enableIdSelection ?
                                        <View>
                                            <View style={{ flexDirection: "row", flex: 1, justifyContent: "space-between" }}>
                                                <Text style={[font.semibold, font.regular, color.blackColor,]}>Upload Check-in ID Proof *</Text>
                                                {
                                                    this.state.documentsExist && !this.state.hide_id_proof &&
                                                    <TouchableOpacity onPress={() => {
                                                        this.setState({
                                                            hide_id_proof: true,
                                                            hide_cert: true,
                                                        })
                                                    }}>
                                                        <Text style={[font.regular, font.sizeRegular, color.blueColor, { textDecorationLine: "underline", textDecorationColor: "blue" }]}>
                                                            Hide.
                                                        </Text>
                                                    </TouchableOpacity>

                                                }
                                            </View>
                                            <View style={[/* box.centerBox,  */{ flex: 1, flexDirection: "row", marginTop: 10 }]}>
                                                <TouchableOpacity /* style = {{flex: 1}} */ onPress={() => {
                                                    this._handleIDupload();
                                                }}>
                                                    <View style={[button.defaultRadius, { flexDirection: "row", alignItems: "center" }]}>
                                                        <Text style={[font.semibold, font.regular, color.blackColor, { marginRight: 10 }]}>Select ID Proof</Text>
                                                        <Icon name="arrow-down" color="black" size={15} />
                                                    </View>
                                                </TouchableOpacity>
                                                {this.state.checkinIDProof.length != 0 ?

                                                    <View style={[{ flexDirection: "row", flex: 1, marginLeft: 10 }]}>
                                                        <Text style={[font.semibold, font.regular, color.blueColor, { flex: 1, textDecorationLine: "underline", textDecorationColor: "blue", }]}>{this.state.checkinIDProof[0].name}</Text>
                                                        <TouchableOpacity onPress={() => {
                                                            this.setState({
                                                                checkinIDProof: []
                                                            })
                                                        }}>
                                                            <Icon name="close" color="red" size={15} />
                                                        </TouchableOpacity>
                                                    </View> : null}

                                            </View>
                                        </View> : null}

                                </View>}



                                {!this.state.hide_cert && <View style={[box.centerBox]}>
                                    <Text style={[font.semibold, font.regular, color.blackColor,]}>Vaccination Certificate</Text>
                                    <View style={{ flex: 1, flexDirection: "row" }}>
                                        <TouchableOpacity style={{ marginRight: 10 }} onPress={() => {
                                            this._handleVACcertUpload();
                                        }}>
                                            <View style={{ flexDirection: "row", justifyContent: "center" }}>
                                                <Text style={[font.semibold, font.regular, color.blackColor, { marginRight: 10, textDecorationLine: "underline", }]}>Browse File</Text>
                                                <Icon name='cloud' color="blue" size={15} />
                                            </View>
                                        </TouchableOpacity>
                                        {this.state.checkinVACcert.length != 0 ?
                                            <Text style={[font.regular, font.sizeRegular, color.blueColor, { textDecorationLine: "underline", textDecorationColor: "blue" }]}>{this.state.checkinVACcert[0].name}</Text> : null}
                                    </View>
                                </View>}

                                {
                                    this.state.hide_id_proof && <View style={[box.centerBox]}>
                                        <TouchableOpacity onPress={() => {
                                            this.setState({
                                                hide_id_proof: false,
                                                hide_cert: false,
                                                checkinModal: false,
                                            }, () => {
                                                this.setState({
                                                    checkinModal: true,
                                                })
                                            })
                                        }}>
                                            <Text style={[font.regular, font.sizeRegular, color.blueColor, { textDecorationLine: "underline", textDecorationColor: "blue" }]}>
                                                Want to replace the documents?
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                }

                                {/* {
                            this.state.imagesource !={}? <Image source = {this.state.imagesource} width = {90} height={100}/>:null
                        } */}


                            </ScrollView>
                           {/*  {this.state.scandata != null? */}
                           { this.state.checkinIDProof != ''?
                            <TouchableOpacity style={{ bottom: 0, marginTop: "auto", backgroundColor: "orange", height: this.state.hide_id_proof ? "20%" : "10%", justifyContent: "center" }}
                                onPress={async () => {
                                    this.setState({
                                        //scanModal: true, //false
                                        checkinModal: false,
                                    })
                                   // //////////console.log(this.state.scandata);
                                    this._handleCheckinData(); //new


                                }}>
                                <Text style={[font.bold, font.sizeLarge, color.textWhiteColor, { textAlign: "center" }]}>Check-in</Text>
                            </TouchableOpacity>: null}
                        </View>

                    </Modal>}

                        </View>
                
            
            
        );

    }
}