import React, { Component } from 'react';
import { View, Text, Platform, TouchableOpacity, ScrollView, TouchableWithoutFeedback, Dimensions, BackHandler, Image, ActionSheetIOS, SafeAreaView } from 'react-native';
import moment from 'moment';
import button from '../Styles/button';
import font from '../Styles/font';
import box from '../Styles/box';
import color from '../Styles/color';
import { membercurrentbookingapi, get_user_document_api,getPropertyInfoAPI, getUserLocationAPI, empCurrentReservationAPI, empUpcomingReservationAPI, post_emp_checkout, post_emp_check_details, deleteEmpSeatReservationAPI, getRoleDocumentAPI } from '../Rest/userAPI';
import CommonHelpers from '../Utils/CommonHelpers';
import Modal from 'react-native-modalbox';
import QRCodeScanner from 'react-native-qrcode-scanner';
import Session from '../config/Session';
import { Picker } from '@react-native-picker/picker';
import DocumentPicker from "react-native-document-picker";
import Icon from 'react-native-vector-icons/FontAwesome';

import { StatusBar } from 'react-native';
import location from '../Location/location';
import CustomePushNotifications from './CustomePushNotifications';
import Comments from './ReusableComponents/Comments';

export default class ScanPage extends Component {

    constructor() {
        super();
        this.state = {


            checkinButtonHide: false,

            checkinModal: false,
            checkinPropertyName: '',
            checkinReservationId: '',
            checkinResourceName:null,
            checkinDateTime: '',
            property_id: '',

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
            scandata: null,
            locationPermission: false,

            userTypeForNotification: 2,

            openComments: false
        }
    };

    onFilterClosed = () => {
        this.setState({
            openComments: false,
        } ,()=>{
            this.handleNavigation();
        })

    }  
    componentDidMount = () => {
        //CustomePushNotifications.checkoutReminder(new Date());
        //this._fetchCurrentBookingData();
        this.getDocumentList();
        this.notifications = CustomePushNotifications.configureNotifis(this.props.navigation);
        //CustomePushNotifications.checkinReminder(new Date(), 'Check-in Alert' , "You have been checked-in " , this.notifications, {type: this.state.userTypeForNotification});
       // this._get_user_document(); //old
       this.backhandler = BackHandler.addEventListener('hardwareBackPress',()=>{
        this.props.navigation.goBack();
           return true;
       })

       location.check().then((value) => {
        this.setState({
          locationPermission: value,
        }, () => {
          if (this.state.locationPermission) {
            location.getGeoLocation().then(async(value) => {
                await Session.setLocationCoords(value)
             /*  this.setState({
                locationDetails: value,
              }) */
            })
          }
          else {
            location.requestPermission().then(value => {
              if (value) {
                location.getGeoLocation().then(async(value) => {
                  this.setState({
                    locationPermission: true ,//value,
                    //locationDetails: value,
                  })
                  await Session.setLocationCoords(value)
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

        //console.log(this.props.route.params.property);
        if(this.props.route.params.property != null)
        {
            console.log(this.props.route.params.property);
            this.setState({
                checkinPropertyName: this.props.route.params.property.property_details.property_name,
                checkinReservationId: this.props.route.params.property.id,
                checkinDateTime: moment(new Date()),
                property_id: this.props.route.params.property.property_id,
                checkout_booking_id: this.props.route.params.property.id,
                checkout_id: this.props.route.params.property.today_check_in_out.length == 0 ? null : this.props.route.params.property.today_check_in_out[0].id,
                closing_time: this.props.route.params.property.property_details.end_at,
                userTypeForNotification: 0,
                checkinResourceName: this.props.params.property.booking_plan_details.plan_name,
            },
                () => {
                    this.setState({
                        
                        scanModal: true,
                       
                    }, ()=>{
                        this.props.route.params.property.today_check_in_out.length == 0? null: this.setState({
                            checkinButtonHide: true
                        });
                    }) //new
                    //console.log("details", this.state.property_id, this.state.checkout_booking_id, this.state.checkout_id);
                })
        }
        else{
            
            this.setState({
                        
                scanModal: true,
               
               
            })

        }
       
    }
    _get_user_document = () => {
        this.setState({
            spinner: true,
        })
        get_user_document_api().then(result => {
            this.setState({
                spinner: false,
            })
            //console.log("get user document result: ", result.status);
            if (result.status) {
                //console.log("here");
                if (result.dataArray.length > 0) {
                    this.setState({
                        hide_id_proof: true, //old
                        hide_cert: true,
                        documentsExist: true,
                        //scanModal: true,
                        //checkinModal: true, //old

                       
                    })
                     //new
                    this._handleCheckinData();
                }
                else {
                    this.setState({
                        checkinModal: true,
                    })

                    //console.log("files not uploaded.");
                }

            }
        })
    }

    _getPropertyInfo = async () => {
        this.setState({
          spinner: true,
        })
        getPropertyInfoAPI(Number(this.state.scandata.property_id)).then((result) => {
          this.setState({
            spinner: false,
          });
          //console.log(result.status);
          if (result.status) {
           // //console.log('proprty info', result.dataArray);
            this.setState({
                closing_time: result.dataArray[0].end_at,
            })
           
          }
    
        })
      }

    onSuccess = async (e) => {

        console.log('scan data: ',e, isNaN(Number(e.data)));
        let data= Number(e.data);

       // e = Number(e);

        if(!isNaN(data)){
            let locationCoords = await Session.getLocationCoords();
            locationCoords = JSON.parse(locationCoords);
            //console.log(locationCoords);
            let myscandata = {
                /* "latitude": '12.9424028',
                "longitude": '77.6217102', */
                "latitude": locationCoords.coords.latitude.toString(), 
                "longitude": locationCoords.coords.longitude.toString(),
                "property_id": Number(e.data)//this.state.property_id,
            }
            //console.log('scan data ',myscandata);
    
            this.setState({
                scandata: myscandata,
                scanModal: false,
                //checkinModal: true,
            }, async() => {
                if(this.props.route.params.property != null){
                    if (this.state.checkinButtonHide) {
                        this._handleCheckout(this.state.checkout_id, this.state.checkout_booking_id);
                    }
                    else {
                        
                      Number(await Session.getRoleId()) == 7 ?
                      this.setState({
                        hide_id_proof: true,
                        hide_cert: true,
                            documentsExist: true,
                      }, ()=>{
    
                        this._handleCheckinData();
                      })
                       :
                       this._get_user_document();
                    }
    
                }else if(this.props.route.params.property == null && this.props.route.params.from =='meetingSpaces'){
                  this.openPropertyDetail();  
                }
                else{
                    if (this.state.checkinButtonHide) {
                        this._handleCheckout(this.state.checkout_id, this.state.checkout_booking_id);
                    }
                    else {
                        this._getPropertyInfo();
                      Number(await Session.getRoleId()) == 7 ?
                      this.setState({
                        hide_id_proof: true,
                        hide_cert: true,
                            documentsExist: true,
                      }, ()=>{
                        this._handleCheckinData()
                      })
                       :
                       this._get_user_document();
                    }
    
                }
               
               // this.getUserLocation(); //25-07-2022
            })

        }
        else{
            CommonHelpers.showFlashMsg('Regenerate the QR.', 'danger');
        }

       
        ////console.log("message:", this.state.scandata, e.data);

        //await Session.setCheckinDetails(e);
    };

    openPropertyDetail = () => {

        this.props.navigation.push('detail', {
            property_id:Number(this.state.scandata.property_id),
        });

        this.setState({
            spinner: false,
        })
    };

    getUserLocation = () => {
        getUserLocationAPI(this.state.scandata).then(result => {
            //console.log(result.status, result.message);
            if (result.status) {
                //console.log("checking the checking button status.: ********", this.state.checkinButtonHide);
                if (this.state.checkinButtonHide) {
                    this._handleCheckout(this.state.checkout_id, this.state.checkout_booking_id);
                }
                else {
                   // this._handleCheckinData(); //old
                   this._get_user_document();
                }

            }
            else {
                CommonHelpers.showFlashMsg(result.message, "danger");
                this.setState({
                    scandata: null,
                    checkinModal: false,
                    scanModal: false,
                }, ()=>{
                    this.props.navigation.goBack();
                   
                })
            }
        }).catch(error => { //console.log("user location error: ", JSON.stringify(error))
         })



    }

    _handleCheckinData = async () => {
        let locationCoords = await Session.getLocationCoords();
        locationCoords = JSON.parse(locationCoords);
        //console.log("check_in data initiated", this.state.hide_id_proof);
        if (this.state.hide_id_proof) {
            let params;

            if(this.props.route.params.property != null){
                 params = {

                    "user_id": Number(await Session.getUserId()),
                    "booking_id": this.props.route.params.property != null? this.state.checkinReservationId: null,
                    /* "latitude": '12.9424028',
                "longitude": '77.6217102', */
                    "latitude": locationCoords.coords.latitude.toString(),  
                    "longitude":locationCoords.coords.longitude.toString(),
                    'is_mobile' : 1,
                    'property_id' : this.state.scandata.property_id,
    
                }

            }
            else{
                params = {

                    "user_id": Number(await Session.getUserId()),
                    "booking_id":  null,
                    /* "latitude": '12.9424028',
                "longitude": '77.6217102', */
                    "latitude": locationCoords.coords.latitude.toString(),  
                    "longitude":locationCoords.coords.longitude.toString(),
                    'is_mobile' : 1,
                    'property_id' : this.state.scandata.property_id,
                    'id': null
    
                }

            }

            
            //console.log("calling handle check in with params: ", params);

            this._handleCheckin(params);

        }
        else {
            let params = new FormData();
            let otherParams;
            if (this.state.checkinIDProof.length != 0) {
                params.append('govt_id_path', { name: this.state.checkinIDProof[0].name, type: this.state.checkinIDProof[0].type, uri: this.state.checkinIDProof[0].uri });
                if (this.state.checkinVACcert.length != 0) {
                    params.append('vaccination_certificate', { name: this.state.checkinVACcert[0].name, type: this.state.checkinVACcert[0].type, uri: this.state.checkinVACcert[0].uri })
                }

                if(this.props.route.params.property != null){
                    otherParams = {
   
                       "user_id": Number(await Session.getUserId()),
                       "booking_id": this.props.route.params.property != null? this.state.checkinReservationId: null,
                       /* "latitude": '12.9424028',
                "longitude": '77.6217102', */
                       "latitude":locationCoords.coords.latitude.toString(),  
                    "longitude":locationCoords.coords.longitude.toString(),
                       'is_mobile' : 1,
                      'property_id' : this.state.scandata.property_id,
       
                   }
   
               }
               else{
                   otherParams = {
   
                       "user_id": Number(await Session.getUserId()),
                       "booking_id":  null,
                       /* "latitude": '12.9424028',
                "longitude": '77.6217102', */
                       "latitude": locationCoords.coords.latitude.toString(),  
                       "longitude":locationCoords.coords.longitude.toString(),
                       'is_mobile' : 1,
                      'property_id' : this.state.scandata.property_id,
                      'id': null
       
                   }
   
               }

                Object.keys(otherParams).forEach((key) => {
                    params.append(key, otherParams[key]);
                });
                //console.log("params: ", JSON.stringify(params));
                //console.log("calling handle check in with params: ", params);

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
            //console.log("image details: ", res);
            this.setState({
                checkinIDProof: res,
                imagesource: { uri: res[0].fileCopyUri }
            });

            if (this.state.scandata == null) {
                this.setState({
                    //checkinModal: false,
                    //scanModal: true,
                })
            }

        } catch (err) {
            //console.log(err)
        }

    }

    _handleVACcertUpload = async () => {
        try {
            const res = await DocumentPicker.pick({
                type: [DocumentPicker.types.pdf],
                copyTo: "cachesDirectory"
            })
            //console.log("pdf details: ", res);
            this.setState({
                checkinVACcert: res
            });

        } catch (err) {
            //console.log(err)
        }

    }

   

    _handleCheckin = (params) => {
        //console.log("checkin payload:", params);
        this.setState({
            spinner: true,
        })
        //console.log("called handle check in with params: ", params);

        if (this.state.hide_id_proof) {
            post_emp_checkout(params).then(async (result) => {
                //console.log("Result from the API: ", result.status);
                this.setState({
                    spinner: false,
                    checkinModal: false,

                })
                if (result.status) {
                    console.log('***********open seating message*********',result.message);
                    if(this.props.route.params.property != null){
                     
                        CommonHelpers.showFlashMsg("checked in successfully", "success");
                        CustomePushNotifications.checkinReminder(new Date(), 'Check-in Alert' , "You have been checked-in to " + this.state.checkinPropertyName, this.notifications, {type: this.state.userTypeForNotification});
                        const alert_time  =  CommonHelpers.getAlertTime(this.state.closing_time);
                        CustomePushNotifications.checkoutReminder(alert_time, this.state.checkinPropertyName, this.notifications, {type: this.state.userTypeForNotification} );
                   }
                   else{
                     
                    CommonHelpers.showFlashMsg('Checked in'/* result.message */, 'success');
                    if(result.message == 'Check in Successfully') {
                        CustomePushNotifications.checkinReminder(new Date(), 'Check-in Alert' , "You have been checked-in to " + this.state.checkinPropertyName, this.notifications, {type: this.state.userTypeForNotification});
                        const alert_time  =  CommonHelpers.getAlertTime(this.state.closing_time);
                        console.log(alert_time)
                        CustomePushNotifications.checkoutReminder(alert_time, this.state.checkinPropertyName, this.notifications, {type: this.state.userTypeForNotification});
                    }
                    else{
                        CustomePushNotifications.cancelcheckoutNotification('1', this.notifications);
                    }
                   

                   } 
                    this.handleNavigation();
                }
                else {
                    //console.log('qr code result',  result.message);
                    if(typeof result.message != 'object'){
                        CommonHelpers.showFlashMsg("Could not check-in. " + result.message, "danger");
                    }else{
                        CommonHelpers.showFlashMsg("Could not check-in. QR Code is not configured properly.", "danger");
                    }
                    CustomePushNotifications.cancelcheckoutNotification('1', this.notifications);
                    this.props.navigation.goBack();
                }
            })

        } else {
            post_emp_check_details(params).then(async (result) => {
                //console.log("Result from the API: ", result.status);
                this.setState({
                    spinner: false,
                    checkinModal: false,

                })
                if (result.status) {
                    CommonHelpers.showFlashMsg(result.message/* "checked in successfully" */, "success");
                    this.setState({
                        scandata: null,
                        checkinButtonHide: true,
                    });

                    CustomePushNotifications.checkinReminder(new Date(), 'Check-in Alert' , "You have been checked-in to " + this.state.checkinPropertyName, this.notifications,{type: this.state.userTypeForNotification});
                    const alert_time  =  CommonHelpers.getAlertTime(this.state.closing_time);
                    CustomePushNotifications.checkoutReminder(alert_time, this.state.checkinPropertyName, this.notifications, {type: this.state.userTypeForNotification});
                    this.handleNavigation();
                    //this._fetchCurrentBookingData();
                    //this.props.navigation.goBack();
                    


                }
                else {
                    //console.log('qr code result',  result.message);
                    if(typeof result.message != 'object'){
                        CommonHelpers.showFlashMsg("Could not check-in. " + result.message, "danger");
                    }else{
                        CommonHelpers.showFlashMsg("Could not check-in. QR Code is not configured properly.", "danger");
                    }
                   
                    this.props.navigation.goBack();
                }
            })
        }
    }

    getDocumentList = () => {
        getRoleDocumentAPI().then(result => {
            //console.log(result.dataArray);
            let iIDtypeList = [];
            this.setState({
                iDTypeList: result.dataArray,
            }, ()=>{
                this.state.iDTypeList.forEach(item=>{
                    iIDtypeList.push(item.name);
    
                })
                //console.log(iIDtypeList)
    
                this.setState({
                    iIDTypeList: iIDtypeList
                })
            });

            //this._get_user_document();

        })
    }

    _handleCheckout = async (id, booking_id) => {
        let locationCoords = await Session.getLocationCoords();
        locationCoords = JSON.parse(locationCoords );
        ////console.log("inside check out",this.state.checkinReservationId);
        let params = {
            "id":this.props.route.params.property != null ? Number(id) : null,
            "booking_id": this.props.route.params.property != null ? Number(booking_id) : null,
            "user_id": Number(await Session.getUserId()),
            /* "latitude": '12.9424028',
                "longitude": '77.6217102', */
            "latitude": locationCoords.coords.latitude.toString(),  
            "longitude":locationCoords.coords.longitude.toString(),
            'is_mobile' : 1,
            'property_id' : this.state.scandata.property_id,
        };
        //console.log(params);
        this.setState({
            spinner: true,
        })
        post_emp_checkout(params).then(async (result) => {
            //console.log("Result from the API: ", result.status);
            this.setState({
                spinner: false,
                checkinModal: false
            })
            if (result.status) {
                CommonHelpers.showFlashMsg("Checked out", "success");
                this.setState({
                    scandata: null,
                    checkinButtonHide: false,
                   // openComments: true
                });
                CustomePushNotifications.checkinReminder(new Date(), 'Checkout Alert', "You have been checked-out of the property", this.notifications, {type: this.state.userTypeForNotification});
                CustomePushNotifications.cancelcheckoutNotification('1', this.notifications);
               this.handleNavigation();
                //this._fetchCurrentBookingData();
                //this.props.navigation.goBack();
                

            }
            else {
                if(typeof result.message != 'object'){
                    CommonHelpers.showFlashMsg("Could not check-out. " + result.message, "danger");
                }else{
                    CommonHelpers.showFlashMsg("Could not check-out. QR Code is not configured properly.", "danger");
                }
                //CommonHelpers.showFlashMsg("Could not check-out. " + result.message, "danger");
                this.props.navigation.goBack();
            }
        })

    }

    handleNavigation=async()=>{
        let role = await Session.getRoleId();
        //console.log("role id: ", role, Number(role))
        if(Number(role) == 5){
            this.props.navigation.push('bottomtabnavigator'/* 'masterhome' */);
        }
        else if (Number(role) == 7){
            this.props.navigation.push('employeehome');

        }
    }

    render() {
        let selectedIdType = this.state.selectedIdType;
        return (
            <SafeAreaView height={"100%"}>
                <StatusBar hidden = {true}/>
                {this.state.scanModal &&
                
                  
                    <QRCodeScanner
                        ref={(node) => { this.scanner = node }}
                        onRead={this.onSuccess}
                        topContent={
                            <View style={[{ flexDirection: 'row',width: "100%", justifyContent: 'space-around', alignItems:'center' }]}>
                                 <TouchableOpacity onPress = {()=>{
                                                this.props.navigation.goBack();
                                                 
                                                 return true;
                                            }}>
                                                <Icon name = 'arrow-left' size = {20} color ='orange'/>
                                            </TouchableOpacity>
                                <Text style={[color.lightBlack, font.regular, font.sizeSmall, { textAlign: "center" }]}>
                                    {this.state.checkinButtonHide ? 
                                    "Scan the QR code to check-out of the property.": 
                                    "Scan the QR code to check-in/ check-out of the property."}
                                    </Text>
                            </View>
                        }
                        topViewStyle={[box.centerBox, { paddingTop: "2%" }]/* { flex: 1, alignItems: "center", width: "100%", justifyContent: "flex-start", } */}
                        showMarker = {true}
                       /*  customMarker = {
                            <View>
                                <Image source = {require('../Assets/images/BRHlogowhite.png')}
                                style = {[image.imageContain, {width: 100, height: 100}]}/>
                                </View>
                        } */
                        bottomViewStyle={{ flex: 0, height: 0 }}
                        cameraStyle={{ height: '100%' }}
                        cameraContainerStyle={{
                            flex: 20,
                            justifyContent: "flex-end",
                        }}
                    />
                   
                    
                    }
                {this.state.checkinModal && <Modal position={"center"} swipeToClose={false}
                    onClosed={() => { this.setState({ checkinModal: false }) }}
                    style={{

                        height: !this.state.hide_id_proof ? Dimensions.get('screen').height * 0.6 : Dimensions.get('screen').height * 0.5,
                        width: Dimensions.get('screen').width * 0.9,
                    }} isOpen={this.state.checkinModal}>
                    <View height={"100%"}>
                        <View style={[/* box.centerBox, */ color.inputBackground, { /* alignItems: "flex-start", */ padding: "4%" }]}>
                            <Text style={[font.semibold, font.sizeMedium, color.myOrangeColor, { textAlign: "center" }]}>Check-in Form</Text>
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
                                <Text style={[font.semibold, font.regular, color.blackColor, { flex: 1, }]}>{moment(this.state.checkinDateTime).format("DD-MMMM-YYYY HH : mm")} Hrs</Text>
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
                                              //console.log(this.state.iDTypeList[buttonIndex])
                                              this.setState({
                                                  selectedIdType: this.state.iDTypeList[buttonIndex],
                                                  enableIdSelection: true,
                                              }, () => {
                                                  //console.log("MY SELECTED id: ", this.state["selectedIdType"]);
  
  
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
                                            //console.log(itemIndex)

                                            if (itemIndex != 0) {
                                                this.setState({
                                                    selectedIdType: itemValue,
                                                    enableIdSelection: true,
                                                }, () => {
                                                    //console.log("MY SELECTED id: ", this.state["selectedIdType"]);


                                                });

                                            }
                                            else {
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
                                    </Picker>
                                }
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
                        {this.state.checkinIDProof != '' ?
                            <TouchableOpacity style={{ bottom: 0, marginTop: "auto", backgroundColor: "orange", height: this.state.hide_id_proof ? "20%" : "10%", justifyContent: "center" }}
                                onPress={async () => {

                                    
                                    this._handleCheckinData();


                                }}>
                                <Text style={[font.bold, font.sizeLarge, color.textWhiteColor, { textAlign: "center" }]}>Check-in</Text>
                            </TouchableOpacity> : null}
                    </View>

                </Modal>}

                {
                    this.state.openComments && 
                    <Comments
                        navigation={this.props.navigation}
                        showRatings= {true}
                        from = {'afterCheckout'}
                        promptText = {this.props.route.params.property != null ? 'Rate the ' + this.state.checkinResourceName:'Rate your Experience'}
                        closing={() => { this.onFilterClosed() }}
                    />
                }

            </SafeAreaView>
            

        );
    }
}

