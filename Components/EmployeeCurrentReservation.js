import React, { Component } from "react";
import { View, Text, TouchableOpacity, FlatList, StyleSheet, TextInput, Dimensions, ScrollView, Image, Platform, ActionSheetIOS } from 'react-native';
import font from "../Styles/font";
import color from "../Styles/color";
import button from '../Styles/button';
import box from "../Styles/box";
import Spinner from "../UI/Spinner";
import SimilarPropertiesCard from "./ReusableComponents/SimilarPropertiesCard";
import Session from "../config/Session";
import { empCurrentReservationAPI, getPropertyResouceTypes,empUpcomingReservationAPI, get_user_document_api, post_emp_checkout, post_emp_check_details, deleteEmpSeatReservationAPI, getRoleDocumentAPI, getUserLocationAPI } from "../Rest/userAPI";
import { AWS_URL, EMPLOYEE_CURRENT_RESERVATION, EMP_UPCOMING_RESERVATION } from "../config/RestAPI";
import moment from "moment";
import Icon from 'react-native-vector-icons/FontAwesome';
import Modal from 'react-native-modalbox';

import DocumentPicker from "react-native-document-picker";
import CommonHelpers from "../Utils/CommonHelpers";
import storage from "../StoragePermissions/storage";
import location from "../Location/location";
import { Picker } from '@react-native-picker/picker';
import QRCodeScanner from 'react-native-qrcode-scanner';
import CustomePushNotifications from "./CustomePushNotifications";


export default class EmployeeCurrentReservation extends Component {
    constructor() {
        super();
        this.state = {
            data: null,
            imageList: [],
            spinner: false,
            //pagination variables
            enablePagination: false,
            prev_page_url: null,
            next_page_url: null,
            last_page_url: null,
            links: [],
            //paginationvariables ends

            searchPhrase: '',
            searchclicked: false,

            checkinButtonHide: false,

            checkinModal: false,
            checkinPropertyName: '',
            checkinReservationId: '',
            checkinDateTime: '',
            property_id:'',

            checkout_id: '',
            checkout_booking_id: '',
            closing_time: '',

            iDTypeList: []/* [{
                id: 1,
                value: "PAN Card",
                label: "PAN Card"
            },
            {
                id: 2,
                value: "Aaddhar Card",
                label: "Aaddhar Card"
            }] */,
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
            resourceTypes: [],
            locationPermission: false,
            locationDetails: null,


        }
    }

    componentDidMount = async () => {
        this.fetchResourceTypes();
        this.notifications = CustomePushNotifications.configureNotifis(this.props.navigation);

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
                        locationPermission: true, //value,
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
    fetchResourceTypes = async () => {
        this.setState({
          spinner: true,
        })
        //////console.log("called");
        getPropertyResouceTypes().then((result) => {
          this.setState({
            spinner: false,
          })
          //////console.log("resource types ", result.dataArray.data);
          if (result.status) {
            ////////console.log("resource types ",result.dataArray);
            this.setState({
              resourceTypes: result.dataArray.data,
            })
          }
        }).catch(error => {
          //////console.log(error, "resource types error in history booking.");
        })
        this.apiCall(await Session.getUserId(), EMPLOYEE_CURRENT_RESERVATION);
        //this.apiCall(await Session.getUserId(), EMP_RESERVATION_HISTORY);
      }

   

    apiCall = (emp_id, url) => {
        this.setState({
            spinner: true,
        })
        empCurrentReservationAPI({ 'employee_id': Number(emp_id) }, url).then(result => {
            this.setState({
                spinner: false,
            })
            //////////console.log("Upcoming reservation details from the api: ",result.status,result.dataArray);
            if (result.status) {

                this.setState({
                    data: result.dataArray,

                });
                if (result.pagesData.results.last_page > 1) {
                    this.setState({
                        enablePagination: true,
                        prev_page_url: result.pagesData.results.prev_page_url,
                        next_page_url: result.pagesData.results.next_page_url,
                        last_page_url: result.pagesData.results.last_page_url,
                        links: result.pagesData.results.links,
                    }, () => {
                        ////////console.log("Button status: ", this.state.prev_page_url, this.state.next_page_url, this.state.last_page_url);
                    })
                }

               
            }
        }).catch(error => { ////////console.log("emp upcoming reservation error", JSON.stringify(error)) 
        })
        this.getDocumentList();
    }

    getDocumentList = ()=>{
        getRoleDocumentAPI().then(result=>{
            ////////console.log(result.dataArray);
            let iIDtypeList = [];
            this.setState({
                 iDTypeList: result.dataArray,
        }, ()=>{
            this.state.iDTypeList.forEach(item=>{
                iIDtypeList.push(item.name);

            })
            //////console.log(iIDtypeList)

            this.setState({
                iIDTypeList: iIDtypeList
            })
        })
    })
}
openScanPage = (property) => {
    this.props.navigation.push('scanpage', {
        property: property
      })
  }

    _renderCurrent = (item) => {
        let resourcetype = '--';
        //////console.log(item);
    ////////console.log(this.state.resourceTypes);
    this.state.resourceTypes.forEach((element) => {
      //////console.log(element.id,item.item.resource_group_id);
    
        if (element.id == item.item.resource_group_id) {
          resourcetype = element.resource_group_name;
          //////console.log(resourcetype)
        }
      

    })
       // ////////console.log(" curren************",item.item);
        /* let images  = []
        item.item.property_images.forEach(element => {
            images.push({url: AWS_URL + element.image_path});
            
        }); */
        //////////console.log(images);
        let checkinButtonHide = false;
        let hidebuttons = false;
        //////console.log("check in check out array: ", item.item);

        ////////console.log("item.item.today_check_in_out.length", item.item);

        item.item.today_check_in_out.length == 0 ? checkinButtonHide = false : checkinButtonHide = true;

        if(item.item.today_check_in_out.length != 0 && ( item.item.today_check_in_out[0].check_in_status == 1 && item.item.today_check_in_out[0].check_out_status == 1 )){
           hidebuttons = true;
        }
        

        if (this.state.searchPhrase == '') {
            return (
                <View height={400}>
                    <SimilarPropertiesCard
                        /* imageList={images} */
                        fromEmpReservation={true}
                        from="SRP"
                        isLogin= {true}
                        iconName='heart'
                        iconColor='orange'
                        contentdetails={
                            <View style={[box.centerBox, { justifyContent: "flex-start", /* backgroundColor: "red" */}]}>
                                <View style = {{flex: 1}}>
                  <View style = {{flex :1, flexDirection: "row" ,/* backgroundColor: "pink", */ /* justifyContent: "center", */ alignItems: "center", justifyContent: "space-between"}}> 
                  
                                    
                                        <Text style={[color.myOrangeColor, font.bold, font.sizeLarge,{marginRight: 5}]}>{item.item.booking_id}</Text>
                                        {/* <Text style={[color.blackColor, font.semibold, font.sizeLarge, ]}>{item.item.property_details.property_name}</Text> */}
                                    
                                    <TouchableOpacity onPress = {()=>{
                                        this.raiseIssue(item.item);
                                    }}>
                                        <Text style = {[button.defaultRadius, font.regular, font.sizeRegular, color.myOrangeColor, color.orangeBorder]}>Raise an Issue</Text>
                                    </TouchableOpacity>
                                </View>
                                <Text style={[{flex: 0.5},color.blackColor, font.semibold, font.sizeMedium, ]}>{item.item.property_details.property_name}</Text>
                                </View>
                               
                               
                                <Text style={[color.blackColor, font.regular, font.sizeRegular,]}>Number of People: {item.item.no_of_people}</Text>
                                <View style={[{ flex: 1, flexDirection: "row", }]}>
                                    <View style={{ flex: 1, padding: 5 }}>
                                        <Text style={[color.blackColor, font.semibold, font.sizeRegular]}>Start Date</Text>
                                        <Text style={[color.blackColor, font.regular, font.sizeRegular,]}>{moment(item.item.start_date).format("DD MMMM, YYYY- HH:mm")}Hrs</Text>
                                    </View>
                                    <View style={{ flex: 1, padding: 5 }}>
                                        <Text style={[color.blackColor, font.semibold, font.sizeRegular]}>End Date</Text>
                                        <Text style={[color.blackColor, font.regular, font.sizeRegular,]}>{moment(item.item.end_date).format("DD MMMM, YYYY- HH:mm")}Hrs</Text>
                                    </View>
                                </View>

                                <View style={[{ flex: 1, flexDirection: "row", }]}>
                                    <View style={{ flex: 1, padding: 5 }}>
                                        <Text style={[color.blackColor, font.semibold, font.sizeRegular]}>Workspace Type</Text>
                                        <Text style={[color.blackColor, font.regular, font.sizeRegular,]}>{resourcetype}{/* Dedicated Desk */}</Text>
                                    </View>
                                    <View style={{ flex: 1, padding: 5 }}>
                                        <Text style={[color.blackColor, font.semibold, font.sizeRegular]}>Workspace Name</Text>
                                        <Text style={[color.blackColor, font.regular, font.sizeRegular,]}>{item.item.resources.resource_name}{/* Dedicated desk */}</Text>
                                    </View>
                                </View>

                                <View style={[{ flex: 1, flexDirection: "row", }]}>
                                    <View style={{ flex: 1, padding: 5 }}>
                                        {
                                            hidebuttons ? <Text style = {[color.myOrangeColor, font.sizeRegular, font.semibold]}>You have checked out of the property for the day.</Text> : 

                                            !checkinButtonHide ?

                                                <TouchableOpacity onPress={async () => {

                                                    let startTime = CommonHelpers.getMomentTime(moment(item.item.start_date));
                                                    let endtime = CommonHelpers.getMomentTime(moment(item.item.end_date));
                                                    let currenttime = CommonHelpers.getMomentTime( moment(new Date()));

                                                    if(currenttime.isBetween(startTime, endtime)){
                                                        this.props.homePageVisible ? this.openScanPage(item.item) :

                                                        this.setState({
                                                            checkinPropertyName: item.item.property_details.property_name,
                                                            checkinReservationId: item.item.id,
                                                            checkinDateTime: moment(new Date()),
                                                            property_id: item.item.property_id,
                                                            closing_time: item.item.property_details.end_at,
                                                            
                                                            //scanModal: true
                                                            //checkinModal: true,
                                                        }, () => {
                                                            this._get_user_document();
                                                        });

                                                    }
                                                    else{
                                                        CommonHelpers.showFlashMsg('Please try between '+moment(item.item.start_date).format('HH:mm')+'Hrs to ' + moment(item.item.end_date).format('HH:mm')+'Hrs.', 'danger' )
                                                    }
                                                    //this.openScanPage();
                                                   

                                                }}>
                                                    <Text style={[color.myOrangeColor, color.orangeBorder, font.semibold, font.sizeRegular, /* {textDecorationLine: "underline", textDecorationColor: "gray"} */, button.defaultRadius]}>Check-in</Text>
                                                </TouchableOpacity>
                                                :
                                                <TouchableOpacity onPress={() => {
                                                    ////////console.log(" id  *******", item.item.id)
                                                    let startTime = CommonHelpers.getMomentTime(moment(item.item.start_date));
                                                    let endtime = CommonHelpers.getMomentTime(moment(item.item.end_date));
                                                    let currenttime = CommonHelpers.getMomentTime( moment(new Date()));

                                                    if(currenttime.isBetween(startTime, endtime)){
                                                    this.props.homePageVisible ? this.openScanPage(item.item) :
                                                    this.setState({
                                                        checkout_id: item.item.today_check_in_out[0].id,
                                                        checkout_booking_id: item.item.id,
                                                        scanModal: true,
                                                        checkinButtonHide: true,
                                                        property_id: item.item.property_id,
                                                        closing_time: item.item.property_details.end_at,
                                                        checkinPropertyName: item.item.property_details.property_name,
                                                    })
                                                } else{
                                                    CommonHelpers.showFlashMsg('Please try between '+moment(item.item.start_date).format('HH:mm')+'Hrs to ' + moment(item.item.end_date).format('HH:mm')+'Hrs.', 'danger' )
                                                }

                                                    //this._handleCheckout(item.item.today_check_in_out[0].id, item.item.id)

                                                }}>
                                                    <Text style={[color.myOrangeColor, color.orangeBorder, font.semibold, font.sizeRegular, /* {textDecorationLine: "underline", textDecorationColor: "gray"} */, button.defaultRadius]}>Check-out</Text>
                                                </TouchableOpacity>

                                        }

                                    </View>

                                </View>

                                <View>
                                    {checkinButtonHide && <Text style={[font.regular, font.sizeRegular, color.blackColor]}>check-in Time: {item.item.today_check_in_out[0].check_in_timestamp} </Text>}
                                </View>

                            </View>
                        } />
                </View>
            );

        }
        else if (item.item.property_details.property_name.toLowerCase().includes(this.state.searchPhrase.toLowerCase().trim())) {
            return (
                <View height={400}>
                    <SimilarPropertiesCard
                        /* imageList={images} */
                        fromEmpReservation={true}
                        from="SRP"
                        isLogin= {true}
                        iconName='heart'
                        iconColor='orange'
                        contentdetails={
                            <View style={[box.centerBox, { justifyContent: "flex-start", /* backgroundColor: "red" */}]}>
                            <View style = {{flex: 1}}>
              <View style = {{flex :1, flexDirection: "row" ,/* backgroundColor: "pink", */ /* justifyContent: "center", */ alignItems: "center", justifyContent: "space-between"}}> 
              
                                
                                    <Text style={[color.myOrangeColor, font.bold, font.sizeLarge,{marginRight: 5}]}>{item.item.booking_id}</Text>
                                    {/* <Text style={[color.blackColor, font.semibold, font.sizeLarge, ]}>{item.item.property_details.property_name}</Text> */}
                                
                                <TouchableOpacity onPress = {()=>{
                                    this.raiseIssue(item.item);
                                }}>
                                    <Text style = {[button.defaultRadius, font.regular, font.sizeRegular, color.myOrangeColor, color.orangeBorder]}>Raise an Issue</Text>
                                </TouchableOpacity>
                            </View>
                            <Text style={[{flex: 0.5},color.blackColor, font.semibold, font.sizeMedium, ]}>{item.item.property_details.property_name}</Text>
                            </View>
                           
                           
                            <Text style={[color.blackColor, font.regular, font.sizeRegular,]}>Number of People: {item.item.no_of_people}</Text>
                            <View style={[{ flex: 1, flexDirection: "row", }]}>
                                <View style={{ flex: 1, padding: 5 }}>
                                    <Text style={[color.blackColor, font.semibold, font.sizeRegular]}>Start Date</Text>
                                    <Text style={[color.blackColor, font.regular, font.sizeRegular,]}>{moment(item.item.start_date).format("DD MMMM, YYYY- HH:mm")}Hrs</Text>
                                </View>
                                <View style={{ flex: 1, padding: 5 }}>
                                    <Text style={[color.blackColor, font.semibold, font.sizeRegular]}>End Date</Text>
                                    <Text style={[color.blackColor, font.regular, font.sizeRegular,]}>{moment(item.item.end_date).format("DD MMMM, YYYY- HH:mm")}Hrs</Text>
                                </View>
                            </View>

                            <View style={[{ flex: 1, flexDirection: "row", }]}>
                                <View style={{ flex: 1, padding: 5 }}>
                                    <Text style={[color.blackColor, font.semibold, font.sizeRegular]}>Workspace Type</Text>
                                    <Text style={[color.blackColor, font.regular, font.sizeRegular,]}>{resourcetype}{/* Dedicated Desk */}</Text>
                                </View>
                                <View style={{ flex: 1, padding: 5 }}>
                                    <Text style={[color.blackColor, font.semibold, font.sizeRegular]}>Workspace Name</Text>
                                    <Text style={[color.blackColor, font.regular, font.sizeRegular,]}>{item.item.resources.resource_name}{/* Dedicated desk */}</Text>
                                </View>
                            </View>

                            <View style={[{ flex: 1, flexDirection: "row", }]}>
                                <View style={{ flex: 1, padding: 5 }}>
                                    { hidebuttons ? <Text style = {[color.myOrangeColor, font.sizeRegular, font.semibold]}>You have checked out of the property for the day.</Text> : 
                                        !checkinButtonHide ?

                                            <TouchableOpacity onPress={async () => {
                                               
                                                let startTime = CommonHelpers.getMomentTime(moment(item.item.start_date));
                                                let endtime = CommonHelpers.getMomentTime(moment(item.item.end_date));
                                                let currenttime = CommonHelpers.getMomentTime( moment(new Date()));

                                                if(currenttime.isBetween(startTime, endtime)){
                                                    this.props.homePageVisible ? this.openScanPage(item.item) :

                                                    this.setState({
                                                        checkinPropertyName: item.item.property_details.property_name,
                                                        checkinReservationId: item.item.id,
                                                        checkinDateTime: moment(new Date()),
                                                        property_id: item.item.property_id,
                                                        closing_time: item.item.property_details.end_at,
                                                        
                                                        //scanModal: true
                                                        //checkinModal: true,
                                                    }, () => {
                                                        this._get_user_document();
                                                    });

                                                }
                                                else{
                                                    CommonHelpers.showFlashMsg('Please try between '+moment(item.item.start_date).format('HH:mm')+'Hrs to ' + moment(item.item.end_date).format('HH:mm')+'Hrs.', 'danger' )
                                                }

                                            }}>
                                                <Text style={[color.myOrangeColor, color.orangeBorder, font.semibold, font.sizeRegular, /* {textDecorationLine: "underline", textDecorationColor: "gray"} */, button.defaultRadius]}>Check-in</Text>
                                            </TouchableOpacity>
                                            :
                                            <TouchableOpacity onPress={() => {
                                                let startTime = CommonHelpers.getMomentTime(moment(item.item.start_date));
                                                let endtime = CommonHelpers.getMomentTime(moment(item.item.end_date));
                                                let currenttime = CommonHelpers.getMomentTime(moment(new Date()));

                                                if(currenttime.isBetween(startTime, endtime)){
                                                this.props.homePageVisible ? this.openScanPage(item.item) :
                                                this.setState({
                                                    checkout_id: item.item.today_check_in_out[0].id,
                                                    checkout_booking_id: item.item.id,
                                                    scanModal: true,
                                                    checkinButtonHide: true,
                                                    property_id: item.item.property_id,
                                                    closing_time: item.item.property_details.end_at,
                                                    checkinPropertyName: item.item.property_details.property_name
                                                })
                                            } else{
                                                CommonHelpers.showFlashMsg('Please try between '+moment(item.item.start_date).format('HH:mm')+'Hrs to ' + moment(item.item.end_date).format('HH:mm')+'Hrs.', 'danger' )
                                            }

                                            }}>
                                                <Text style={[color.myOrangeColor, color.orangeBorder, font.semibold, font.sizeRegular, /* {textDecorationLine: "underline", textDecorationColor: "gray"} */, button.defaultRadius]}>Check-out</Text>
                                            </TouchableOpacity>

                                    }

                                </View>

                            </View>

                            <View>
                                {checkinButtonHide && <Text style={[font.regular, font.sizeRegular, color.blackColor]}>check-in Time: {item.item.today_check_in_out[0].check_in_timestamp} </Text>}
                            </View>

                        </View>
                        } />
                </View>
            );

        }



    }

    setSearchPhrase = (val) => {
        this.setState({
            searchPhrase: val
        }, () => {
            ////////console.log(this.state.searchPhrase);
        })

    }
    setClicked = () => {
        this.setState({
            searchClicked: true,
        }, () => {
            ////////console.log("clicked");
        })
    }

    _get_user_document = () => {
        this.setState({
            spinner: true,
        })
        get_user_document_api().then(result => {
            this.setState({
                spinner: false,
            })
            //////console.log("get user document result: ", result.status, result.dataArray, result.dataArray.length);
            if (result.status) {
                ////////console.log("here");
                if (result.dataArray.length > 0) {
                    this.setState({
                       hide_id_proof: true,
                        hide_cert: true,
                        documentsExist: true,
                        scanModal: true,
                        //checkinModal: true,
                    })
                }
                else {
                    this.setState({
                        checkinModal: true,
                    })
                   /*  if(this.state.checkinIDProof.length != 0){
                        this.setState({
                            checkinModal: false, 
                            scanModal: true
                        })
                    } */
                    ////////console.log("files not uploaded.");
                } 

            }
           

        })
    }

    _handleIDupload = async () => {
        try {
            const res = await DocumentPicker.pick({
                type: [DocumentPicker.types.images],
                copyTo: "cachesDirectory"
            })
            ////////console.log("image details: ", res);
            this.setState({
                checkinIDProof: res,
                imagesource: { uri: res[0].fileCopyUri }
            });

            if(this.state.scandata == null){
                this.setState({
                    scanModal: true,
                })
            }

        } catch (err) {
            ////////console.log(err)
        }

    }

    _handleVACcertUpload = async () => {
        try {
            const res = await DocumentPicker.pick({
                type: [DocumentPicker.types.pdf],
                copyTo: "cachesDirectory"
            })
            ////////console.log("pdf details: ", res);
            this.setState({
                checkinVACcert: res
            });

        } catch (err) {
            ////////console.log(err)
        }

    }
    _handleCheckinData = async () => { 
        let locationCoords = await Session.getLocationCoords();
        locationCoords = JSON.parse(locationCoords);
        ////////console.log("check_in data initiated", this.state.hide_id_proof);
        if (this.state.hide_id_proof) {
            const params = {

                "user_id": Number(await Session.getUserId()),
                "booking_id": this.state.checkinReservationId,
                /* "latitude": '12.9424028',
                "longitude": '77.6217102', */
                "latitude": locationCoords.coords.latitude.toString(),  
                "longitude":locationCoords.coords.longitude.toString(),
                'is_mobile' : 1,
                'property_id' : this.state.scandata.property_id,

            }
            ////////console.log("calling handle check in with params: ", params);

            this._handleCheckin(params);

        }
        else {
            const params = new FormData();
            if (this.state.checkinIDProof.length != 0) {
                params.append('govt_id_path', { name: this.state.checkinIDProof[0].name, type: this.state.checkinIDProof[0].type, uri: this.state.checkinIDProof[0].uri });
                if (this.state.checkinVACcert.length != 0) {
                    params.append('vaccination_certificate', { name: this.state.checkinVACcert[0].name, type: this.state.checkinVACcert[0].type, uri: this.state.checkinVACcert[0].uri })
                }

                const otherParams = {

                    "user_id": Number(await Session.getUserId()),

                    "booking_id": this.state.checkinReservationId,
                    /* "latitude": '12.9424028',
                "longitude": '77.6217102', */
                    "latitude": locationCoords.coords.latitude.toString(),  
                "longitude":locationCoords.coords.longitude.toString(),
                    'is_mobile' : 1,
                    'property_id' : this.state.scandata.property_id,

                }

                Object.keys(otherParams).forEach((key) => {
                    params.append(key, otherParams[key]);
                });
                ////////console.log("params: ", JSON.stringify(params));
                ////////console.log("calling handle check in with params: ", params);

                this._handleCheckin(params);

            }
            else {
                CommonHelpers.showFlashMsg("Please select the " + this.state.selectedIdType.value + " to upload.", "danger")
            }

        }
    }

    _handleCheckin = (params) => {
        this.setState({
            spinner: true,
        })
        //////console.log("called handle check in with params: ", params);

        if (this.state.hide_id_proof) {
            post_emp_checkout(params).then(async (result) => {
                ////////console.log("Result from the API: ", result.status);
                this.setState({
                    spinner: false,
                    checkinModal: false,
                    
                })
                if (result.status) {
                    CommonHelpers.showFlashMsg("Checked in", "success");
                    // await Session.setCheckinDetails(null);
                    const alert_time = CommonHelpers.getAlertTime(this.state.closing_time);
                    CustomePushNotifications.checkinReminder(new Date(),"Check-in Alert", "You have been checked-in to " + this.state.checkinPropertyName,  this.notifications, {type: 1});
                    CustomePushNotifications.checkoutReminder(alert_time, this.state.checkinPropertyName, this.notifications, {type: 1} );
                    this.apiCall(await Session.getUserId(), EMPLOYEE_CURRENT_RESERVATION);

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
                ////////console.log("Result from the API: ", result.status);
                this.setState({
                    spinner: false,
                    checkinModal: false,
                    
                })
                if (result.status) {
                    CommonHelpers.showFlashMsg("checked in successfully", "success");
                    this.setState({
                        scandata: null, 
                        checkinButtonHide: true,
                    })
                    const alert_time = CommonHelpers.getAlertTime(this.state.closing_time);
                    CustomePushNotifications.checkinReminder(new Date(),'Check-in Alert', 'You have been Checked-in to '+ this.state.checkinPropertyName, this.notifications);
                    CustomePushNotifications.checkoutReminder(alert_time, this.state.checkinPropertyName, this.notifications);
                    // await Session.setCheckinDetails(null);
                    this.apiCall(await Session.getUserId(), EMPLOYEE_CURRENT_RESERVATION);

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

    _handleCheckout = async (id, booking_id) => {
        let locationCoords = await Session.getLocationCoords();
        locationCoords = JSON.parse(locationCoords);
        //////////console.log("inside check out",this.state.checkinReservationId);
        let params = {
            "id": Number(id),
            "booking_id":Number(booking_id),
            "user_id": Number(await Session.getUserId()),
            /* "latitude": '12.9424028',
                "longitude": '77.6217102', */
            "latitude": locationCoords.coords.latitude.toString(),  
                "longitude":locationCoords.coords.longitude.toString(),
            'is_mobile' : 1,
            'property_id' : this.state.scandata.property_id,

            
        };
        ////////console.log(params);
        this.setState({
            spinner: true,
        })
        post_emp_checkout(params).then(async (result) => {
            ////////console.log("Result from the API: ", result.status);
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
                CustomePushNotifications.checkinReminder(new Date(), 'Checkout Alert', "You have successfully checked out of the property "+ this.state.checkinPropertyName, this.notifications, {type: 1});
                CustomePushNotifications.cancelcheckoutNotification('1', this.notifications);
                this.apiCall(await Session.getUserId(), EMPLOYEE_CURRENT_RESERVATION);

            }
            else {
                if(typeof result.message != 'object'){
                    CommonHelpers.showFlashMsg("Could not check-out. " + result.message, "danger");
                }else{
                    CommonHelpers.showFlashMsg("Could not check-out. QR Code is not configured properly.", "danger");
                }
                //CommonHelpers.showFlashMsg("Could not check-out. " + result.message, "danger");
            }
        })

    }

    handleCancel = () => {
        deleteEmpSeatReservationAPI(this.state.cancelItem).then(result => {
            ////////console.log(result.status);
        }).catch(error => {
            ////////console.log("cancel reservation error", JSON.stringify(error))
        })

    }
    modifyBooking = (params) => {
        ////////console.log("params: ", params);
        this.props.navigation.push('seatreservation', {
            emplogin: 1,
            params: params,
            purpose: "modify",
        });
        }

    raiseIssue = (params) => {
        ////////console.log("params: ", params);
        this.props.navigation.push('raiseissue',{
            emplogin: 1,
            params: params,
            purpose: "new",
        } )
         }

    onSuccess = async (e) => {

        if(!isNaN(Number(e.data))){
            let locationCoords = await Session.getLocationCoords();
            locationCoords = JSON.parse(locationCoords);
            ////////console.log(locationCoords);
            let myscandata = {
                /* "latitude": '12.9424028',
                "longitude": '77.6217102', */
                "latitude": locationCoords.coords.latitude.toString(),  //13.101140 ,//locationCoords.coords.latitude,// e.data.split(':')[1].substring(1,11),
                "longitude": locationCoords.coords.longitude.toString(),//80.162361, //locationCoords.coords.longitude,//e.data.split(':')[2].substring(1,11),
                "property_id": Number(e.data)////this.state.property_id,
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
                    this._handleCheckinData();
                }
                //this.getUserLocation();
            })
        }
        else{
            CommonHelpers.showFlashMsg('Regenerate the QR', 'danger');
        }
    };

    getUserLocation = () =>{
        getUserLocationAPI(this.state.scandata).then(result=>{
            ////////console.log(result.status, result.message);
            if(result.status){
                ////////console.log("checking the checking button status.: ********", this.state.checkinButtonHide);
                if(this.state.checkinButtonHide){
                    this._handleCheckout(this.state.checkout_id, this.state.checkout_booking_id);
                }
                else{
                    this._handleCheckinData();
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
        }).catch(error=>{////////console.log("user location error: ", JSON.stringify(error))
        })



    }


    render() {
        let selectedIdType = this.state.selectedIdType;
        return (
            this.state.data == null ?
                <View style={[box.centerBox, { height: "100%", justifyContent: this.state.spinner ? "flex-start" : "center" }]}>
                    {this.state.spinner ?
                        <Text style={[font.regular, font.sizeRegular, color.blackColor, { textAlign: "center", }]}>Searching...</Text> :
                        <Text style={[font.regular, font.sizeRegular, color.blackColor, { textAlign: "center", }]}> No Current Reservations.</Text>}
                </View> :
                <View style={[{ /* height: "100%", */ justifyContent: this.state.spinner ? "flex-start" : "center", paddingTop: "2%" }]}>
                    <FlatList
                        keyboardShouldPersistTaps='always'
                        data={this.state.data}
                        renderItem={this._renderCurrent}
                        horizontal={false}
                        keyExtractor={(item, index) => {
                            return item.id.toString();
                        }}
                        ListHeaderComponent={
                            

                            <View style={styles.container}>
                                <Icon name="search" color="black" />
                                <TextInput
                                    style={[styles.input, font.regular, font.sizeRegular, color.blackColor, color.whiteBackground]}
                                    placeholder="Search by Property Name"
                                    placeholderTextColor={"black"}
                                    value={this.state.searchPhrase}
                                    onChangeText={this.setSearchPhrase}
                                    onFocus={() => {
                                        this.setClicked();
                                    }}
                                />
                            </View>
                        }



                        //stickyHeaderIndices={[0]}
                        ListFooterComponent={this.state.enablePagination ?
                            <View>
                                <View style={{ flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "space-around" }}>
                                    <TouchableOpacity disabled={this.state.prev_page_url != null ? false : true}
                                        onPress={async () => {
                                            ////////console.log(this.state.prev_page_url);
                                            this.apiCall(await Session.getUserId(), this.state.prev_page_url);

                                        }}
                                    >
                                        <Text style={[font.regular, font.sizeRegular, color.myOrangeColor]}>Prev</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity disabled={this.state.next_page_url != null ? false : true}
                                        onPress={async () => {
                                            ////////console.log(this.state.next_page_url);
                                            this.apiCall(await Session.getUserId(), this.state.next_page_url);

                                        }}>
                                        <Text style={[font.regular, font.sizeRegular, color.myOrangeColor]}>Next</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity disabled={this.state.last_page_url != null ? false : true}
                                        onPress={async () => {
                                            ////////console.log(this.state.last_page_url);
                                            this.apiCall(await Session.getUserId(), this.state.last_page_url);

                                        }}>
                                        <Text style={[font.regular, font.sizeRegular, color.myOrangeColor]}>Last</Text>
                                    </TouchableOpacity>

                                </View>
                                <View style={{ flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center" }}>

                                    {this.state.links.map((item, index) => {
                                        //////////console.log(JSON.stringify(item));
                                        return (item.label == "pagination.previous" || item.label == "pagination.next" ? null :
                                            <TouchableOpacity disabled={item.url == null ? true : false} style={{ padding: "2%", }} onPress={async () => {
                                                this.apiCall(await Session.getUserId(), item.url);
                                            }}>
                                                <Text style={item.url == null ? {} : [color.myOrangeColor, font.regular, font.sizeRegular, { textDecorationLine: "underline", textDecorationColor: "orange" }]}>{item.label}</Text>
                                            </TouchableOpacity>
                                        );

                                    })}

                                </View>
                            </View> : null
                        }

                    />
                    {this.state.spinner && <Spinner />}
                    {this.state.checkinModal && <Modal position={"center"} swipeToClose={false}
                        onClosed={() => { this.setState({ checkinModal: false }) }}
                        style={{
                            //justifyContent: 'space-around',
                            //alignItems: 'space-around',
                            //padding: 20,
                            height: !this.state.hide_id_proof ? Dimensions.get('screen').height * 0.7 : Dimensions.get('screen').height * 0.5,
                            width: Dimensions.get('screen').width * 0.9,
                        }} isOpen={this.state.checkinModal}>
                        <View height={"100%"}>
                            <View style={[/* box.centerBox, */ color.inputBackground, { alignItems: "flex-start", padding: "4%" }]}>
                                <Text style={[font.semibold, font.sizeMedium, color.blackColor,]}>Check-in Form</Text>
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
                                               //////console.log(this.state.iDTypeList[buttonIndex])
                                               this.setState({
                                                   selectedIdType: this.state.iDTypeList[buttonIndex],
                                                   enableIdSelection: true,
                                               }, () => {
                                                   //////console.log("MY SELECTED id: ", this.state["selectedIdType"]);
   
   
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
                                            ////////console.log(itemIndex)

                                            if(itemIndex != 0){
                                                this.setState({
                                                    selectedIdType: itemValue,
                                                    enableIdSelection: true,
                                                }, () => {
                                                    //////console.log("MY SELECTED id: ", this.state["selectedIdType"]);
    
    
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
                            {this.state.scandata != null?
                            <TouchableOpacity style={{ bottom: 0, marginTop: "auto", backgroundColor: "orange", height: this.state.hide_id_proof ? "20%" : "10%", justifyContent: "center" }}
                                onPress={async () => {
                                    ////////console.log(this.state.scandata);
                                    this._handleCheckinData();


                                }}>
                                <Text style={[font.bold, font.sizeLarge, color.textWhiteColor, { textAlign: "center" }]}>Check-in</Text>
                            </TouchableOpacity>: null}
                        </View>

                    </Modal>}

                    {
                        this.state.scanModal && <Modal position={"center"} swipeToClose={false}
                            onClosed={() => { this.setState({ scanModal: false }) }}
                            style={{
                                //justifyContent: 'space-around',
                                //alignItems: 'space-around',
                                //padding: 20,
                                height: Dimensions.get('screen').height * 1,
                                width: Dimensions.get('screen').width * 1,
                            }} isOpen={this.state.scanModal}>
                            <View height={"100%"}>
                                <QRCodeScanner
                                    ref={(node) => { this.scanner = node }}
                                    onRead={this.onSuccess}
                                    topContent={
                                        <View style={[{ width: "100%", }]}>
                                            <Text style={[color.lightBlack, font.regular, font.sizeMedium, { textAlign: "center" }]}>{this.state.checkinButtonHide ? 
                                    "Scan the QR code to check-out to the property.": 
                                    "Scan the QR code to check-in to the property."}</Text>
                                        </View>
                                    }
                                    topViewStyle={[box.centerBox,{paddingTop:"2%"}]/* { flex: 1, alignItems: "center", width: "100%", justifyContent: "flex-start", } */}
                                    /* bottomContent = {
                                      <View style = {{alignItems: "center", justifyContent: "center", }}> 
                                        <TouchableOpacity style = {{marginTop: "10%"}}>
                                          <Icon name = "qrcode" size = {40}/>
                                        </TouchableOpacity>
                                        <Text></Text>
                                      </View>
                                    } */
                                    bottomViewStyle={{ flex: 0, height: 0 }}
                                    cameraStyle={{ height: '100%' }}
                                    showMarker= {true}
                                    cameraContainerStyle={{
                                        flex: 20,
                                        justifyContent: "flex-end",
                                    }}

                                //flashMode={RNCamera.Constants.FlashMode.torch}

                                />

                            </View>

                        </Modal>
                    }

                    {
                    this.state.cancelModal && <Modal position={"center"} swipeToClose={false}
                        onClosed={() => { this.setState({ cancelModal: false }) }}
                        style={{
                            //justifyContent: 'space-around',
                            //alignItems: 'space-around',
                            //padding: 20,
                            height: Dimensions.get('screen').height * 0.3,
                            width: Dimensions.get('screen').width * 0.9,
                        }} isOpen={this.state.cancelModal}>
                        <View height={"100%"}>
                            <View style={[/* box.centerBox, */ color.inputBackground, { alignItems: "flex-start", padding: "4%" }]}>
                                <Text style={[font.semibold, font.sizeMedium, color.blackColor,]}>Confirmation</Text>
                            </View>

                            <View style={[box.centerBox]}>
                                <Text style={[font.semibold, font.sizeMedium, color.blackColor,]}>Proceed to cencel the reservation?</Text>
                            </View>

                            <View style={{ flex: 1, flexDirection: "row", height: 100 }}>
                                <TouchableOpacity style={{ bottom: 0, marginTop: "auto", backgroundColor: "orange", flex: 1, height: "100%", justifyContent: "center", borderRightWidth: 1, borderRightColor: "white" }}
                                    onPress={async () => {
                                        this.setState({
                                            cancelModal: false,
                                        })
                                    }}>
                                    <Text style={[font.bold, font.sizeLarge, color.textWhiteColor, { textAlign: "center" }]}>No</Text>
                                </TouchableOpacity>


                                <TouchableOpacity style={{ bottom: 0, marginTop: "auto", flex: 1, backgroundColor: "orange", height: "100%", justifyContent: "center" }}
                                    onPress={async () => {
                                        this.handleCancel();
                                    }}>
                                    <Text style={[font.bold, font.sizeLarge, color.textWhiteColor, { textAlign: "center" }]}>Yes</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                    </Modal>
                    }

                </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        margin: 15,
        justifyContent: "flex-start",
        alignItems: "center",
        flexDirection: "row",
        width: "90%",

    },
    searchBar__unclicked: {
        padding: 10,
        flexDirection: "row",
        width: "95%",
        backgroundColor: "#d9dbda",
        borderRadius: 15,
        alignItems: "center",
    },
    searchBar__clicked: {
        padding: 10,
        flexDirection: "row",
        width: "80%",
        backgroundColor: "#d9dbda",
        borderRadius: 15,
        alignItems: "center",
        justifyContent: "space-evenly",
    },
    input: {
        fontSize: 20,
        marginLeft: 10,
        width: "95%",

    },
});