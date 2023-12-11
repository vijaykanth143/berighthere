import React, { Component } from "react";

import { View, Text, TouchableOpacity, TouchableWithoutFeedbackBase, BackHandler, TextInput, Platform, ActionSheetIOS} from 'react-native'

import font from "../Styles/font";

import button from "../Styles/button";

import color from "../Styles/color";

import LogoHeader from "./ReusableComponents/LogoHeader";

import box from "../Styles/box";

import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import RadioGroup from 'react-native-radio-buttons-group';

import { Picker } from '@react-native-picker/picker';

import Session from "../config/Session";

import DateTimePicker from '@react-native-community/datetimepicker';

import moment from "moment";

import Icon from 'react-native-vector-icons/FontAwesome';

import CommonHelpers from "../Utils/CommonHelpers";



import formStyle from "./../Styles/control";

import { confirmEmpSeatReservationAPI, getSeatReservationAPI, modifyEmpSeatReservationAPI } from "../Rest/userAPI";



import Spinner from "../UI/Spinner";

import renderItem from "../Styles/renderItem";

import Drawer from "react-native-drawer";

import Sidemenu from "../Navigation/Sidemenu";



export default class EmpSeatReservation extends Component {



    constructor() {

        super();

        this.state = {

            reserveOption: [

                {

                    id: '1', // acts as primary key, should be unique and non-empty string

                    label: 'Seat',

                    value: 'seat',

                    labelStyle: { color: "black", fontFamily: font.regular.fontFamily },

                    size: 20,

                    selected: true

                }, {

                    id: '2',

                    label: 'Meeting/ Conference Room',

                    value: 'meeting/ conference room',

                    labelStyle: { color: "black", fontFamily: font.regular.fontFamily },

                    size: 20,

                    selected: false

                    //disabled: true

                }

            ],

            emp_id: null,

            provider_id :null,



            reserveOptionSelected: 1,

            propertyNameList: [],

            iPropertyNameList: [],

            selectedPropertyName: '',



            propertyItem: '',



            allproperty_list: [],





            resource_group_list: [],

            iResourceGroupList: [],

            resource_group_id: '',

            enableResourceGroup: false,

            corporate_id: null,



            resource_names_list: [],

            iResourceNameList: [],

            resource_name_selected : '',

            enableResourceNames: false,

            





            initialDate: new Date(),

            showStartTimer: false,

            showEndTimer: false,

            isStartDatePicked: false,

            isStartTimePicked: false,

            isEndDatePicked: false,

            isEndTimePicked: false,

            startdate: '',

            endDate: '',

            startDateNtime: '',

            endDateNtime: '',



            corporate_start_time: '9:00',

            corporate_end_time: '19:00',

            corporate_start_date:'',

            corporate_end_date:'',



            minDay:1,

            minMonth: 0,

            minYear: 2022,

            minHour: 0,

            minMinute: 0,



            numberofPeople: null,

            peopleError: false,



            spinner: false,

            weekends : [],

        }

    }



    componentDidMount = async () => {

        console.log("date: ", new Date());

        this.backHandler = BackHandler.addEventListener(

            "hardwareBackPress",

           this.goBack

          );



        let propertyData = await Session.getEmpPropertyDetails();

        let emp_details = await Session.getUserDetails();

        emp_details = JSON.parse(emp_details);

        propertyData = JSON.parse(propertyData);

        console.log('property Details: ', JSON.stringify(propertyData));



        this.setState({

            allproperty_list: propertyData,

            corporate_id: emp_details.corporate_id,

            reserveOptionSelected: this.props.route.params.purpose == 'modify'? this.props.route.params.params.reserve_type_id : 1,

            weekends: CommonHelpers.offDays(propertyData[0].property_timings)

        })

        //console.log("providerId: *********",propertyData[0].provider_id);

        let propertyNames = [];

        let iPropertyNames = [];

        propertyData.forEach(element => {

            //console.log("element: ", element);

            iPropertyNames.push(element.property_name);

            propertyNames.push({ label: element.property_name, value: element.property_name, id: element.id, provider_id:element.provider_id, start_time: element.start_at, end_time: element.end_at});

           // propertyNames.push({ label:"2nd option"/* element.property_name */, value:  "2nd option"/* element.property_name */, id: 12 /* element.id */ });



        });

        

       



        this.setState({

            propertyNameList: propertyNames,

            iPropertyNameList: iPropertyNames,

            emp_id: emp_details.id, 

            //provider_id: propertyData[0].provider_id,

        }, () => { //console.log("Property Names: ", this.state.propertyNameList) ;

        //console.log("lenght:", this.state.propertyNameList.length);

        if(this.state.propertyNameList.length == 1){

            this.setState({

                selectedPropertyName: this.state.propertyNameList[0],

                propertyItem: propertyData[0],

            },()=>{

                this.getResourceGroup({"reserve_type_id":this.state.reserveOptionSelected,"property_id":this.state.selectedPropertyName.id, 'corporate_id': this.state.corporate_id})

            }) 

        }  

    });



    this.props.route.params.purpose == "modify"? this.handleAutoPopolate():null;

    }



    handleAutoPopolate=async()=>{

        console.log("incoming params: ",this.props.route.params.params.start_date,this.props.route.params.params.end_date,);



        this.state.reserveOption.map(item=>{

            if(Number(item.id) == Number(this.state.reserveOptionSelected)){

                item.selected= true

            }else{

                item.selected= false

            }

        })



        this.onPressRadioButton(this.state.reserveOption);

       

        this.state.propertyNameList.forEach((item)=>{

            //console.log(item.id, this.props.route.params.params.selectedProperty.id)

            if(this.props.route.params.params.selectedProperty.id == item.id){

                this.setState({

                    selectedPropertyName: item,

                    provider_id: item.provider_id

                }, ()=>{

                   // console.log("pre selected property: *****$$$$$$$", this.state.selectedPropertyName)

                    this.state.allproperty_list.forEach(element=>{

                        if(this.state.selectedPropertyName.id == element.id){

                            this.setState({

                                propertyItem: element,

                            }, ()=>{

                                //console.log("whole element: ", this.state.propertyItem);

                            })

                        }

                    })

                })

            }

        })

       

        let reserve_type_id = this.state.reserveOptionSelected;

        let property_id = this.props.route.params.params.selectedProperty.id;

        let resource_group_id = this.props.route.params.params.selectedResourceGroup.id;



        this.getResourceGroup({"reserve_type_id":reserve_type_id,"property_id":property_id, "corporate_id": this.state.corporate_id});

        this.getResourceNames({

                    "reserve_type_id": reserve_type_id,

                   "property_id": property_id,

                   "resource_group_id":resource_group_id, "corporate_id": this.state.corporate_id});

                   console.log("number of people", this.props.route.params.params.number_of_people);



        this.setState({

            showStartTimer: false,

            showEndTimer: false,

            isStartDatePicked: false,

            isStartTimePicked: false,

            isEndDatePicked: false,

            isEndTimePicked: false,

            startdate: this.props.route.params.params.start_date,

            endDate: this.props.route.params.params.end_date,

            startDateNtime: this.props.route.params.params.start_date,

            endDateNtime: this.props.route.params.params.end_date,

            numberofPeople: this.props.route.params.params.number_of_people,



            minYear: Number(moment(this.props.route.params.params.start_date).format("YYYY")),

            minMonth: Number(moment(this.props.route.params.params.start_date).format("MM"))-1,

            minDay: Number(moment(this.props.route.params.params.start_date).format("DD")),



        })

    }



   



    checkDate(value){

        if(this.state.weekends.indexOf( new Date(value).getDay()) > -1){

            CommonHelpers.showFlashMsg("The Property is closed on this day.", 'danger');

        }

    }



    onPressRadioButton = (options) => {

        console.log("my option: ", JSON.stringify(options));



        options.forEach(element => {

            if (element.selected) {

                element.labelStyle = { color: "black", fontFamily: "Montserrat-SemiBold" }

                this.setState({

                    reserveOptionSelected: element.id,

                }, () => {

                    if(this.state.selectedPropertyName != ''){

                        this.getResourceGroup({

                            "reserve_type_id":this.state.reserveOptionSelected,

                            "property_id":this.state.selectedPropertyName.id, 

                            'corporate_id': this.state.corporate_id

                        })



                    }

                   // console.log(this.state.reserveOptionSelected);

                });

            } else {

                element.labelStyle = { color: "black", fontFamily: "Montserrat-Regular" }

            }



        });

    }



    onStartDateSelect = (event, value) => {

       //console.log(value, moment(this.state.corporate_start_date), this.state.corporate_end_date);

        if(event.type == "set"){

            if (this.state.showStartTimer) {

                //console.log("start timer")

                if (!this.state.isStartDatePicked) {

                    //console.log(moment(this.state.corporate_end_date), moment(this.state.corporate_start_date))

                    //console.log(moment(this.state.corporate_start_date).isAfter(value));

                    //console.log( 'end date condition: ',moment(value).isAfter(this.state.corporate_end_date))



                   

    

                    if(moment(value).isBefore(moment(this.state.corporate_start_date)) || moment(value).isAfter(moment(this.state.corporate_end_date))){

                        CommonHelpers.showFlashMsg("Date is ouside the booking period window." + " From "+this.state.corporate_start_date + " to " + this.state.corporate_end_date, "danger");

                       /*  this.setState({

                            isStartDatePicked: false,

                        }) */

                    }

                    else  if(this.state.weekends.indexOf( new Date(value).getDay()) > -1){

                        CommonHelpers.showFlashMsg("The Property is closed on this day.", 'danger');

                    }

                    else{

                        console.log("setting start date",value, /* moment(value).format("DD-MM-YYYY") */ )

                        //let date  = moment(value).format("DD-MM-YYYY");

                        // console.log("start date: ", date);

                        this.setState({

                        startdate: value,

                        isStartDatePicked: true,

                        showStartTimer: true,

                        isStartTimePicked: false,

                        isEndDatePicked: false,

                        endDateNtime: '',

                        endDate: ''



                         }, () => { //console.log("start date set", this.state.isStartDatePicked) 

                        })

    

                    }

    

    

    

                    

                }

                else {  

                   // console.log("start time selected.", moment(value));

                    let day = Number(moment(this.state.startdate).format("DD"));

                    let month = Number(moment(this.state.startdate).format("MM")) - 1;

                    let year = Number(moment(this.state.startdate).format("YYYY"));

                    let hours = Number(moment(value).format("HH"));

                    let min = Number(moment(value).format("mm"));

                    let sec = Number(moment(value).format('ss'));

                    console.log(day, month, year, hours, min, sec);

    

                    let actualStartTimeH = Number(this.state.corporate_start_time.split(":")[0]);

                    console.log("actual start time of the property: ", actualStartTimeH);

                    let actualStartTimeM = Number(this.state.corporate_start_time.split(":")[1]);

                   console.log("actual minutes: ", actualStartTimeM);

    

                    let actualEndTimeH = Number(this.state.corporate_end_time.split(":")[0]);

                    console.log("actual end time of the property: ", actualEndTimeH);

                    let actualEndTimeM = Number(this.state.corporate_end_time.split(":")[1]);

                   console.log("actual minutes: ", actualEndTimeM);

    

    

    

                    if(day == Number(moment(new Date()).format("DD")) && month == (Number(moment(new Date()).format("MM"))-1) && year == Number(moment(new Date()).format("YYYY"))){

                        if(hours < Number(moment(new Date()).format("HH")) )

                        {

                            CommonHelpers.showFlashMsg("Please choose a future time.", "danger");

                            this.setState({

                                isStartDatePicked: false,

                                //isStartTimePicked: false,

                            })

                        }else if(hours < actualStartTimeH || hours > actualEndTimeH){

                            CommonHelpers.showFlashMsg("The operational hours are between " + this.state.corporate_start_time + " hours to " + this.state.corporate_end_time + " hours.", "danger");

                            this.setState({

                                isStartDatePicked: false,

                                //isStartTimePicked: false,

                            })

                        }else if( (hours == actualStartTimeH && min < actualStartTimeM) || (hours == actualEndTimeH && min > actualEndTimeM )){

                            CommonHelpers.showFlashMsg("The operational hours are between " +  this.state.corporate_start_time  + " hours to " +  this.state.corporate_end_time + " hours.", "danger");

                            this.setState({

                               isStartDatePicked: false,

                               // isStartTimePicked: false,

                            })

                        }

                        else{

                            var finalValue = new Date(year, month, day, hours, min, sec);

                        console.log("final start date and time object", moment(finalValue).format("DD MMMM YYYY, HH : mm"));

                        console.log("final start date and time object", finalValue);

                        

        

                        this.setState({

                            startDateNtime: finalValue,

                            isStartDatePicked: false,

                            isStartTimePicked: true,

                            showStartTimer: false,

                            minDay: day,

                            minMonth: month,

                            minYear: year,

                            minHour: hours,

                            minMinute: min,

                            isEndDatePicked:false,

                            isEndTimePicked: false,

                            endDate: '',

                            endDateNtime: ''

                        })

                        }

    

                    }else if(hours < actualStartTimeH || hours > actualEndTimeH){

                        CommonHelpers.showFlashMsg("1.The operational hours are between " + this.state.corporate_start_time + " hours to " + this.state.corporate_end_time + " hours.", "danger");

                        this.setState({

                            //showStartTimer: true,

                            isStartDatePicked: false,

                            //isStartTimePicked: false,

                         })

                    }else if( (hours == actualStartTimeH && min < actualStartTimeM )|| (hours == actualEndTimeH && min > actualEndTimeM )){

                        CommonHelpers.showFlashMsg("2.The operational hours are between " + this.state.corporate_start_time + " hours to " + this.state.corporate_end_time + " hours.", "danger");

                        this.setState({

                            //showStartTimer: true,

                            isStartDatePicked: false,

                            //isStartTimePicked: false,

                         })

                    }

                    else{

                        var finalValue = new Date(year, month, day, hours, min, sec);

                        console.log("final start date and time object", moment(finalValue).format("DD MMMM YYYY, HH : mm"));

                        console.log("final start date and time object", finalValue);

        

                        this.setState({

                            startDateNtime: finalValue,

                            isStartDatePicked: false,

                            isStartTimePicked: true,

                            showStartTimer: false,

                            minDay: day,

                            minMonth: month,

                            minYear: year,

                            minHour: hours,

                            minMinute: min,

                        })

                    }    

                }

            }



        }

        else{

            this.setState({

                isStartDatePicked: false,

                showStartTimer: false

               // isStartTimePicked: false

            })

        }

        

      

   

    }

    iStartDateSelect = (event, value) => {

        //console.log(value, moment(this.state.corporate_start_date), this.state.corporate_end_date);

        if (event.type == "set") {

           

                console.log("start timer")

               

                    //console.log(moment(this.state.corporate_end_date).format("YYYY-MM-DD"), this.state.corporate_start_date)

                    //console.log(moment(this.state.corporate_start_date).isAfter(value));







                    if (moment(value).isBefore(this.state.corporate_start_date) || moment(value).isAfter(this.state.corporate_end_date)) {

                        CommonHelpers.showFlashMsg("Date is ouside the booking period window." + " From " + this.state.corporate_start_date + " to " + this.state.corporate_end_date, "danger");

                        this.setState({

                            isStartDatePicked: false,

                        })

                    } 

                     else if(this.state.weekends.indexOf(new Date(value).getDay()) > -1){

                        CommonHelpers.showFlashMsg("The Property is closed on this day", 'danger');

                    }

                    else {

                        console.log("setting start date", value, /* moment(value).format("DD-MM-YYYY") */)

                        //let date  = moment(value).format("DD-MM-YYYY");

                        // console.log("start date: ", date);

                       



                                   

                    // console.log("start time selected.", moment(value));

                    let day = Number(moment(value).format("DD"));

                    let month = Number(moment(value).format("MM")) - 1;

                    let year = Number(moment(value).format("YYYY"));

                    let hours = Number(moment(value).format("HH"));

                    let min = Number(moment(value).format("mm"));

                    let sec = Number(moment(value).format('ss'));

                    console.log(day, month, year, hours, min, sec);



                    let actualStartTimeH = Number(this.state.corporate_start_time.split(":")[0]);

                    console.log("actual start time of the property: ", actualStartTimeH);

                    let actualStartTimeM = Number(this.state.corporate_start_time.split(":")[1]);

                    console.log("actual minutes: ", actualStartTimeM);



                    let actualEndTimeH = Number(this.state.corporate_end_time.split(":")[0]);

                    console.log("actual end time of the property: ", actualEndTimeH);

                    let actualEndTimeM = Number(this.state.corporate_end_time.split(":")[1]);

                    console.log("actual minutes: ", actualEndTimeM);



                    if (day == Number(moment(new Date()).format("DD")) && month == (Number(moment(new Date()).format("MM")) - 1) && year == Number(moment(new Date()).format("YYYY"))) {

                        if (hours < Number(moment(new Date()).format("HH"))) {

                            CommonHelpers.showFlashMsg("Please choose a future time.", "danger");

                            this.setState({

                                //isStartDatePicked: false,

                                //isStartTimePicked: false,

                            })

                        } else if (hours < actualStartTimeH || hours > actualEndTimeH) {

                            CommonHelpers.showFlashMsg("The operational hours are between " + this.state.corporate_start_time + " hours to " + this.state.corporate_end_time + " hours.", "danger");

                            this.setState({

                                //isStartDatePicked: false,

                                //isStartTimePicked: false,

                            })

                        } else if ((hours == actualStartTimeH && min < actualStartTimeM) || (hours == actualEndTimeH && min > actualEndTimeM)) {

                            CommonHelpers.showFlashMsg("The operational hours are between " + this.state.corporate_start_time + " hours to " + this.state.corporate_end_time + " hours.", "danger");

                            this.setState({

                                //isStartDatePicked: false,

                                // isStartTimePicked: false,

                            })

                        }

                        else {

                            var finalValue =  value;//new Date(year, month, day, hours, min, sec);

                            console.log("final start date and time object", moment(finalValue).format("DD MMMM YYYY, HH : mm"));

                            console.log("final start date and time object", finalValue);





                            this.setState({

                                startDateNtime: finalValue,

                                isStartDatePicked: false,

                                isStartTimePicked: true,

                                showStartTimer: false,

                                minDay: day,

                                minMonth: month,

                                minYear: year,

                                minHour: hours,

                                minMinute: min,

                                isEndDatePicked: false,

                                isEndTimePicked: false,

                                endDate: '',

                                endDateNtime: ''

                            })

                        }



                    } else if (hours < actualStartTimeH || hours > actualEndTimeH) {

                        CommonHelpers.showFlashMsg("1.The operational hours are between " + this.state.corporate_start_time + " hours to " + this.state.corporate_end_time + " hours.", "danger");

                        this.setState({

                            //showStartTimer: true,

                            //isStartDatePicked: false,

                            //isStartTimePicked: false,

                        })

                    } else if ((hours == actualStartTimeH && min < actualStartTimeM) || (hours == actualEndTimeH && min > actualEndTimeM)) {

                        CommonHelpers.showFlashMsg("2.The operational hours are between " + this.state.corporate_start_time + " hours to " + this.state.corporate_end_time + " hours.", "danger");

                        this.setState({

                            //showStartTimer: true,

                            //isStartDatePicked: false,

                            //isStartTimePicked: false,

                        })

                    }

                    else {

                        var finalValue = value;//new Date(year, month, day, hours, min, sec);

                        console.log("final start date and time object", moment(finalValue).format("DD MMMM YYYY, HH : mm"));

                        console.log("final start date and time object", finalValue);



                        this.setState({

                            startDateNtime: finalValue,

                            isStartDatePicked: false,

                            isStartTimePicked: true,

                            showStartTimer: false,

                            minDay: day,

                            minMonth: month,

                            minYear: year,

                            minHour: hours,

                            minMinute: min,

                            isEndDatePicked: false,

                            isEndTimePicked: false,

                            endDate: '',

                            endDateNtime: ''

                        })

                    }

                    }

            



        }

        else {

            this.setState({

                isStartDatePicked: false,

                showStartTimer: false

                // isStartTimePicked: false

            })

        }







    }



    onEndDateSelect = (event, value) => {

        console.log(value);



        if(event.type == "set"){

            if (this.state.showEndTimer) {

                console.log(value);

                //console.log("end timer")

                if (!this.state.isEndDatePicked) {

                    if( moment(value).isBefore(moment(this.state.corporate_start_date)) || moment(value).isAfter(moment(this.state.corporate_end_date))){

                        CommonHelpers.showFlashMsg("Date is ouside the booking period window." + " From "+this.state.corporate_start_date + " to " + this.state.corporate_end_date, "danger");

                    }

                    else  if(this.state.weekends.indexOf( new Date(value).getDay()) > -1){

                        CommonHelpers.showFlashMsg("The Property is closed on this day.", 'danger');

                    }

                    else{

                         //console.log("setting start date", moment(value).format("DD-MM-YYYY"))

                    //let date  = moment(value).format("DD-MM-YYYY");

                    // console.log("start date: ", date);

                    this.setState({

                        endDate: value,

                        isEndDatePicked: true,

                        showEndTimer: true,

                        isEndTimePicked: false,

                    }, () => { //console.log("End date set", this.state.isStartDatePicked) 

                })

    

                    }

                   

                }

                else {

                    console.log("End time selected.", moment(value));

                    let day = Number(moment(this.state.endDate).format("DD"));

                    let month = Number(moment(this.state.endDate).format("MM")) - 1;

                    let year = Number(moment(this.state.endDate).format("YYYY"));

                    let hours = Number(moment(value).format("HH"));

                    let min = Number(moment(value).format("mm"));

                    let sec = Number(moment(value).format('ss'));

                    console.log(day, month, year, hours, min, sec);

    

                    let actualStartTimeH = Number(this.state.corporate_start_time.split(":")[0]);

                    console.log("actual start time of the property: ", actualStartTimeH);

                    let actualStartTimeM = Number(this.state.corporate_start_time.split(":")[1]);

                    console.log("actual minutes: ", actualStartTimeM);

    

                    let actualEndTimeH = Number(this.state.corporate_end_time.split(":")[0]);

                    console.log("actual end time of the property: ", actualEndTimeH);

                    let actualEndTimeM = Number(this.state.corporate_end_time.split(":")[1]);

                    console.log("actual minutes: ", actualEndTimeM);

    

                    if(this.state.minDay == day && this.state.minMonth == month && this.state.minYear == year){

                        if(this.state.minHour >= hours){

                            this.setState({

                                isEndDatePicked: false,

                                showEndTimer: false,

                            })

                            CommonHelpers.showFlashMsg("End time cannot be smaller than start time.", "danger");

                        }else if( hours == actualEndTimeH && min > actualEndTimeM){

                            CommonHelpers.showFlashMsg("The operational hours are between " + this.state.corporate_start_time+ " hours to " + this.state.corporate_end_time + " hours.", "danger");

                            this.setState({

                                isEndDatePicked: false,

                                //isStartTimePicked: false,

                            })

                        }

                        else if(hours < actualStartTimeH || hours > actualEndTimeH){

                            CommonHelpers.showFlashMsg("The operational hours are between " + this.state.corporate_start_time+ " hours to " + this.state.corporate_end_time + " hours.", "danger");

                            this.setState({

                                isEndDatePicked: false,

                                //isStartTimePicked: false,

                            })

                        }

                        else{

                            console.log("date is greater");

                            var finalValue = new Date(year, month, day, hours, min, sec);

                            console.log("final end date and time object", finalValue);

            

                            this.setState({

                                endDateNtime: finalValue,

                                isEndDatePicked: false,

                                isEndTimePicked: true,

                                showEndTimer: false,

                            })

                        }

                    }else if( hours == actualEndTimeH && min > actualEndTimeM){

                        CommonHelpers.showFlashMsg("The operational hours are between " + this.state.corporate_start_time+ " hours to " + this.state.corporate_end_time + " hours.", "danger");

                        this.setState({

                            isEndDatePicked: false,

                            //isStartTimePicked: false,

                        })

                    }

                    else if(hours < actualStartTimeH || hours > actualEndTimeH){

                        CommonHelpers.showFlashMsg("The operational hours are between " + this.state.corporate_start_time + " hours to " +  this.state.corporate_end_time + " hours.", "danger");

                        this.setState({

                            isEndDatePicked: false,

                            //isStartTimePicked: false,

                        })

                    }

                    else{

                        

                            console.log("date is greater");

                            var finalValue = new Date(year, month, day, hours, min, sec);

                            console.log("final end date and time object", finalValue);

            

                            this.setState({

                                endDateNtime: finalValue,

                                isEndDatePicked: false,

                                isEndTimePicked: true,

                                showEndTimer: false,

                            })

                        

                    }

    

                }

            }



        }else{

            this.setState({

                isEndDatePicked: false,

                showEndTimer: false,

            })

        }

       

    }

    iEndDateSelect = (event, value) => {

        console.log(value);



        if (event.type == "set") {

            

                console.log(value);

                //console.log("end timer")

               

                    if (moment(value).isBefore(this.state.corporate_start_date) || moment(value).isAfter(this.state.corporate_end_date)) {

                        CommonHelpers.showFlashMsg("Date is ouside the booking period window." + " From " + this.state.corporate_start_date + " to " + this.state.corporate_end_date, "danger");

                    } 

                     else if(this.state.weekends.indexOf(new Date(value).getDay()) > -1){

                        CommonHelpers.showFlashMsg("The Property is closed on this day", 'danger');

                    }

                    else {

                     

                    console.log("End time selected.", moment(value));

                    let day = Number(moment(value).format("DD"));

                    let month = Number(moment(value).format("MM")) - 1;

                    let year = Number(moment(value).format("YYYY"));

                    let hours = Number(moment(value).format("HH"));

                    let min = Number(moment(value).format("mm"));

                    let sec = Number(moment(value).format('ss'));

                    console.log(day, month, year, hours, min, sec);



                    let actualStartTimeH = Number(this.state.corporate_start_time.split(":")[0]);

                    console.log("actual start time of the property: ", actualStartTimeH);

                    let actualStartTimeM = Number(this.state.corporate_start_time.split(":")[1]);

                    console.log("actual minutes: ", actualStartTimeM);



                    let actualEndTimeH = Number(this.state.corporate_end_time.split(":")[0]);

                    console.log("actual end time of the property: ", actualEndTimeH);

                    let actualEndTimeM = Number(this.state.corporate_end_time.split(":")[1]);

                    console.log("actual minutes: ", actualEndTimeM);



                    if (this.state.minDay == day && this.state.minMonth == month && this.state.minYear == year) {

                        if (this.state.minHour >= hours) {

                           

                            CommonHelpers.showFlashMsg("End time cannot be smaller than start time.", "danger");

                        } else if (hours == actualEndTimeH && min > actualEndTimeM) {

                            CommonHelpers.showFlashMsg("The operational hours are between " + this.state.corporate_start_time + " hours to " + this.state.corporate_end_time + " hours.", "danger");

                           

                        }

                        else if (hours < actualStartTimeH || hours > actualEndTimeH) {

                            CommonHelpers.showFlashMsg("The operational hours are between " + this.state.corporate_start_time + " hours to " + this.state.corporate_end_time + " hours.", "danger");

                           

                        }

                        else {

                            console.log("date is greater");

                            var finalValue = value;//new Date(year, month, day, hours, min, sec);

                            console.log("final end date and time object", finalValue);



                            this.setState({

                                endDateNtime: finalValue,

                                isEndDatePicked: false,

                                isEndTimePicked: true,

                                showEndTimer: false,

                            })

                        }

                    } else if (hours == actualEndTimeH && min > actualEndTimeM) {

                        CommonHelpers.showFlashMsg("The operational hours are between " + this.state.corporate_start_time + " hours to " + this.state.corporate_end_time + " hours.", "danger");

                        this.setState({

                            //isEndDatePicked: false,

                            //isStartTimePicked: false,

                        })

                    }

                    else if (hours < actualStartTimeH || hours > actualEndTimeH) {

                        CommonHelpers.showFlashMsg("The operational hours are between " + this.state.corporate_start_time + " hours to " + this.state.corporate_end_time + " hours.", "danger");

                        this.setState({

                            //isEndDatePicked: false,

                            //isStartTimePicked: false,

                        })

                    }

                    else {



                        console.log("date is greater");

                        var finalValue = value;//new Date(year, month, day, hours, min, sec);

                        console.log("final end date and time object", finalValue);



                        this.setState({

                            endDateNtime: finalValue,

                            isEndDatePicked: false,

                            isEndTimePicked: true,

                            showEndTimer: false,

                        })



                    }



                } 

            



        } else {

            this.setState({

                isEndDatePicked: false,

                showEndTimer: false,

            })

        }



    }



    getResourceGroup = (params)=>{

        console.log("myparasm: ", params)

        getSeatReservationAPI(params).then((result)=>{

           console.log("My seat reservation results. : ",result.pagesData/* .corporate_agreement.end_date */, result.status);

           if(result.status){

            let iReosurceGroup = [];

            result.dataArray.forEach(element => {

                iReosurceGroup.push(element.resource_group_name)



            });

               this.setState({

                resource_group_list: result.dataArray,

                resource_names_list : [],

                enableResourceNames: false,

                resource_group_id: '',

                resource_name_selected: '',

                iResourceNameList:[],

                iResourceGroupList: iReosurceGroup,

               corporate_end_date: result.pagesData.corporate_agreement.end_date,

               corporate_end_time:  result.pagesData.corporate_agreement.end_time != null?result.pagesData.corporate_agreement.end_time: "19:00"  ,

                corporate_start_date:  result.pagesData.corporate_agreement.start_date,

               corporate_start_time:  result.pagesData.corporate_agreement.start_time != null ? result.pagesData.corporate_agreement.start_time : "09:00" , 



                enableResourceGroup: true,

               }, ()=>{

                this.props.route.params.purpose == "modify" ? 

                this.state.resource_group_list.forEach((item)=>{

                    console.log(" resource group: ",item);

                    if(this.props.route.params.params.selectedResourceGroup.id == item.id){

                        this.setState({

                            resource_group_id: item, 

                        })

                    }

                })

                :null

               });

               if(result.dataArray.length == 1){

                   this.setState({

                       resource_group_id: result.dataArray[0],

                   },()=>{this.getResourceNames({"reserve_type_id": this.state.reserveOptionSelected,

                   "property_id": this.state.selectedPropertyName.id,

                   "resource_group_id":this.state.resource_group_id.id, "corporate_id": this.state.corporate_id});})

               }

           }

           else{

               if( !result.status/* result.message == 'Request failed with status code 404' */){

                   CommonHelpers.showFlashMsg(result.message/* "No Resources allocated. Cannot proceed with Reservation." */, "danger");

                   this.setState({

                    resource_group_list: [],

                    resource_names_list: [],

                    resource_group_id: '',

                    resource_name_selected: '',

                    iResourceNameList:[],

                    iResourceGroupList: []

                   })

               }

           }

        }).catch(error=>{

            console.log("get reservation error", JSON.stringify(error),params)

        })

    } 

    getResourceNames  = (params)=>{

        console.log("get resource names params: ", params)

        getSeatReservationAPI(params).then((result)=>{

           console.log("resource group names  : ", result.dataArray, result.status);

           if(result.status){

            let iResourceName = [];

            result.dataArray.forEach(element => {

                iResourceName.push(element.resource_name);

            });

               this.setState({

                resource_names_list: result.dataArray,

                iResourceNameList: iResourceName,

                enableResourceNames: true

               }, ()=>{

                ()=>{

                    this.props.route.params.purpose == "modify" ? 

                    this.state.resource_names_list.forEach((item)=>{

                        console.log(" resource name: ",item);

                        if(this.props.route.params.params.resource_name.id == item.id){

                            this.setState({

                                resource_name_selected: item, 

                            })

                        }

                    })

                    :null

                   }

               });

               if(result.dataArray.length == 1){

                   this.setState({

                       resource_name_selected: result.dataArray[0]

                   })

               }



           }

        }).catch(error=>{

            console.log("Resource names list error", JSON.stringify(error))

        })

    } 



    validate = ()=>{

        if(this.state.reserveOptionSelected == null || this.state.reserveOptionSelected == ''){//   ||  ||  || this.state.resource_name_selected.id == null || this.state.startDateNtime == null || this.state.endDateNtime == null || this.state.numberofPeople == 0){

            CommonHelpers.showFlashMsg("Please select a reserve type.","danger");

            return false;

        }

        else if(this.state.emp_id == null || this.state.emp_id == ''){// || this.state.provider_id == null || this.state.selectedPropertyName.id == null || this.state.resource_group_id.id == null || this.state.reserveOptionSelected == null || this.state.resource_name_selected.id == null || this.state.startDateNtime == null || this.state.endDateNtime == null || this.state.numberofPeople == 0){

            CommonHelpers.showFlashMsg("Employee Id is missing! Comtact Admin.", "danger");

            return false;

        }

       /*  else if(this.state.provider_id == null || this.state.provider_id == ''){//  this.state.selectedPropertyName.id == null || this.state.resource_group_id.id == null || this.state.reserveOptionSelected == null || this.state.resource_name_selected.id == null || this.state.startDateNtime == null || this.state.endDateNtime == null || this.state.numberofPeople == 0){

            CommonHelpers.showFlashMsg("Provider Id is missing! Comtact Admin.", "danger");

            return false;

        } */

        else if(this.state.selectedPropertyName.id == null || this.state.selectedPropertyName.id == ''){//   || this.state.resource_group_id.id == null || this.state.reserveOptionSelected == null || this.state.resource_name_selected.id == null || this.state.startDateNtime == null || this.state.endDateNtime == null || this.state.numberofPeople == 0){

            CommonHelpers.showFlashMsg("Please select a property to proceed.", "danger");

            return false;

        }

        else if(this.state.resource_group_id.id == null || this.state.resource_group_id.id == ''){//   ||  || this.state.reserveOptionSelected == null || this.state.resource_name_selected.id == null || this.state.startDateNtime == null || this.state.endDateNtime == null || this.state.numberofPeople == 0){

            CommonHelpers.showFlashMsg("Please select a Resource Group", "danger");

            return false;

        }

        else if(this.state.resource_name_selected.id == null || this.state.resource_name_selected.id == ''){//   ||  ||  ||  || this.state.startDateNtime == null || this.state.endDateNtime == null || this.state.numberofPeople == 0){

            CommonHelpers.showFlashMsg("Please select a Resource Name.","danger");

            return false;

        }

        else if(this.state.startDateNtime == null || this.state.startDateNtime == ''){//   ||  ||  ||  ||  || this.state.endDateNtime == null || this.state.numberofPeople == 0){

            CommonHelpers.showFlashMsg("Please select Start Date and Time","danger");

            return false;

        }

        else if( this.state.endDateNtime == null || this.state.endDateNtime =='' ){//   ||  ||  ||  ||  |||| this.state.numberofPeople == 0){

            CommonHelpers.showFlashMsg("Please select End Date and Time","danger");

            return false;

        }

        else if(this.state.reserveOptionSelected != 1){

        if(this.state.numberofPeople == null || this.state.numberofPeople ==''){

            CommonHelpers.showFlashMsg("Please enter atleast one seat.","danger");

            return false;

        }

    }



        return true;

        

        

    }

    goBack = () => {

        console.log("going back");

        this.props.navigation.goBack();

       

          return true;

      }



    componentWillUnmount = () => {

        // this.unsubscribe();

        if (this.backHandler) this.backHandler.remove();

      };

      closeControlPanel = () => {

        this._drawer.close()

      };

      openControlPanel = () => {

        this._drawer.open()

      };



     



    render() {

       let selectedPropertyName =  this.state.selectedPropertyName;

        let resource_group_id = this.state.resource_group_id;

        let resource_name_selected= this.state.resource_name_selected;



        //console.log("pre selected resource name: ", this.state.resource_name_selected);

        return (

            <Drawer

            ref={(ref) => this._drawer = ref}

        type="overlay"

        content={<Sidemenu navigation = {this.props.navigation} close = {()=>this.closeControlPanel()} />}

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

            <View /* style = {{flex: 1}} */style={{flex: 1,/*  top: 10, alignContent: "center", height: "100%" */ }}>

                <LogoHeader 

                navigation = {this.props.navigation}

                qrvisible={false} 

                title = {"Reservation Form"} 

                onBarsPress = {()=>{this.openControlPanel()}}

                />

                <KeyboardAwareScrollView contentContainerStyle={box.scrollViewCenter}

                    keyboardShouldPersistTaps="always">



                    <View style={[box.centerBox, ]}>

                        <Text style={[font.semibold, font.regular, color.blackColor]}>Reserve *</Text>

                        <RadioGroup

                            radioButtons={this.state.reserveOption}

                            onPress={this.onPressRadioButton}

                            containerStyle={[]}

                            layout='row'

                        />

                    </View>



                    <View style={[box.centerBox, ]}>

                        <Text style={[font.semibold, font.regular, color.blackColor]}>Property Name *</Text>

                        {

                             Platform.OS === 'ios' ?



                             <TouchableOpacity disabled={this.state.propertyNameList.length==0?true:false} onPress={() => {

                                 ActionSheetIOS.showActionSheetWithOptions(

                                     {

                                         options: this.state.iPropertyNameList,

                                         title: 'Select a Property',

                                         userInterfaceStyle: "light",

                                         tintColor: "orange",

                                         titleTextStyle: font.regular.fontFamily

                                     },





                                     buttonIndex => {

                                         if (this.state.propertyNameList.length == 1) {



                                             this.setState({

                                                 selectedPropertyName: this.state.propertyNameList[buttonIndex],

                                                 enableResourceGroup: true,



                                             }, () => {

                                                 //console.log("MY SELECTED property: ", this.state["selectedPropertyName"]);

                                                 this.state.allproperty_list.forEach(element => {

                                                     if (this.state.selectedPropertyName.id == element.id) {

                                                         this.setState({

                                                             propertyItem: element,

                                                         }, () => {

                                                             //console.log("whole element: ", this.state.propertyItem);

                                                         })

                                                     }

                                                 })



                                                 this.getResourceGroup({ "reserve_type_id": this.state.reserveOptionSelected, "property_id": this.state.selectedPropertyName.id, "corporate_id": this.state.corporate_id });



                                             })



                                         }

                                         else {

                                             if (this.state.reserveOptionSelected != '') {

                                                 console.log("selected item: ", this.state.propertyNameList[buttonIndex])

                                                 this.setState({

                                                     selectedPropertyName: this.state.propertyNameList[buttonIndex],

                                                     enableResourceGroup: true,

                                                     provider_id: this.state.propertyNameList[buttonIndex].provider_id,





                                                 }, () => {

                                                     console.log("MY SELECTED property: ", this.state["selectedPropertyName"]);

                                                     this.state.allproperty_list.forEach(element => {

                                                         if (this.state.selectedPropertyName.id == element.id) {

                                                             this.setState({

                                                                 propertyItem: element,

                                                             }, () => {

                                                                 //console.log("whole element: ", this.state.propertyItem);

                                                             })

                                                         }

                                                     })



                                                     this.getResourceGroup({ "reserve_type_id": this.state.reserveOptionSelected, "property_id": this.state.selectedPropertyName.id, "corporate_id": this.state.corporate_id });



                                                 });



                                             }

                                             else {

                                                 if (this.state.reserveOptionSelected == '') {

                                                     CommonHelpers.showFlashMsg("Select the Reserve Type first.", "danger");

                                                 }

                                             }



                                         }







                                     }





                                 )

                             }}>

                                 <View style={[button.defaultRadius, { borderColor: color.myOrangeColor.color, flexDirection: "row", justifyContent: 'space-between', marginTop: '3%' }]}>

                                     <Text style={[font.regular, font.sizeRegular, color.myOrangeColor,{ textAlign: "left" }]}> {this.state.selectedPropertyName == '' ? 'Select Property Name' : this.state.selectedPropertyName.label}</Text>

                                     <Icon name={'angle-down'} size={20} color= {color.myOrangeColor.color}

                                     />

                                 </View>

                             </TouchableOpacity>





                             :



                        

                        <Picker

                            selectedValue={selectedPropertyName}

                            //prompt = "Property Name"

                            style={[color.blackColor, { width: "100%", }]}

                            dropdownIconColor="black"

                            onValueChange={(itemValue, itemIndex) => {

                                if(this.state.propertyNameList.length == 1) {

                                    

                                    this.setState({

                                        selectedPropertyName: itemValue,

                                        enableResourceGroup: true,

                                        

                                    },()=> {

                                        //console.log("MY SELECTED property: ", this.state["selectedPropertyName"]);

                                        this.state.allproperty_list.forEach(element=>{

                                            if(this.state.selectedPropertyName.id == element.id){

                                                this.setState({

                                                    propertyItem: element,

                                                }, ()=>{

                                                    //console.log("whole element: ", this.state.propertyItem);

                                                })

                                            }

                                        })

                                        this.getResourceGroup({"reserve_type_id":this.state.reserveOptionSelected,"property_id":this.state.selectedPropertyName.id, "corporate_id": this.state.corporate_id});

                                    

                                    })

                                   

                                }

                                else{

                                    if(itemIndex != 0 && this.state.reserveOptionSelected != ''){

                                        console.log("selected item: ", itemValue)

                                        this.setState({

                                            selectedPropertyName: itemValue,

                                            enableResourceGroup: true,

                                            provider_id:itemValue.provider_id,

        

        

                                        },()=> {

                                            console.log("MY SELECTED property: ", this.state["selectedPropertyName"]);

                                            this.state.allproperty_list.forEach(element=>{

                                                if(this.state.selectedPropertyName.id == element.id){

                                                    this.setState({

                                                        propertyItem: element,

                                                    }, ()=>{

                                                        //console.log("whole element: ", this.state.propertyItem);

                                                    })

                                                }

                                            })



                                           

                                            this.getResourceGroup({"reserve_type_id":this.state.reserveOptionSelected,"property_id":this.state.selectedPropertyName.id, "corporate_id": this.state.corporate_id});

                                        

                                        });

    

                                    }

                                    else{

                                        if(this.state.reserveOptionSelected == ''){

                                            CommonHelpers.showFlashMsg("Select the Reserve Type first.", "danger");

                                        }

                                    }



                                }   

                            }

                            }>

                                   {this.state.propertyNameList.length == 1? null: <Picker.Item label='Properties List' value='0' />}

                                    {

                                        

                                        this.state.propertyNameList.map((item) => {

        

                                            return (

                                                <Picker.Item label={item.value} value={item} fontFamily="Montserrat-SemiBold" />);

                                        })

                                    }     

                               

                        </Picker>

    }

                    </View>



                    <View style={[box.centerBox, ]}>

                        <Text style={[font.semibold, font.regular, color.blackColor]}>Resource Type *</Text>

                       { 

                        Platform.OS === 'ios' ?

                        <TouchableOpacity disabled={!this.state.enableResourceGroup} onPress={() => {

                            ActionSheetIOS.showActionSheetWithOptions(

                                {

                                    options: this.state.iResourceGroupList,

                                    title: "Select a resource Group",

                                    tintColor: 'orange',





                                },

                                buttonIndex => {

                                    this.setState({

                                        resource_group_id: this.state.resource_group_list[buttonIndex],

                                        enableResourceNames: true,



                                    }, () => {

                                        console.log("MY SELECTED resource id: ", this.state.resource_group_id.id);

                                        this.getResourceNames({

                                            "reserve_type_id": this.state.reserveOptionSelected,

                                            "property_id": this.state.selectedPropertyName.id,

                                            "resource_group_id": this.state.resource_group_id.id, "corporate_id": this.state.corporate_id

                                        });



                                    });



                                }

                            )

                        }} >

                            <View style={!this.state.enableResourceGroup ?[button.defaultRadius, {flexDirection: 'row',  justifyContent: 'space-between', marginTop: '3%'}] :[button.defaultRadius, { borderColor: color.myOrangeColor.color, flexDirection: 'row', justifyContent: 'space-between', marginTop: '3%' }]}>

                                <Text

                                    style={[font.regular, font.sizeRegular,!this.state.enableResourceGroup ? color.blackColor: color.myOrangeColor]}

                                >{this.state.resource_group_id == '' ? 'Select Resource Grouo' : this.state.resource_group_id.resource_group_name}</Text>

                                <Icon name='angle-down' size={20} color = {!this.state.enableResourceGroup ? color.blackColor.color: color.myOrangeColor.color} />

                            </View>

                        </TouchableOpacity>



                        :

                       

                       

                       <Picker

                            selectedValue={resource_group_id}

                            //prompt = "Resource Type"

                            enabled = {this.state.enableResourceGroup}

                            style={[color.blackColor, { width: "100%", }]}

                            dropdownIconColor="black"

                            onValueChange={(itemValue, itemIndex) => {

                                if(itemIndex != 0){

                                    this.setState({

                                        resource_group_id: itemValue,

                                        enableResourceNames: true,

    

                                    },()=> {console.log("MY SELECTED resource id: ", this.state.resource_group_id.id);

                                    this.getResourceNames({"reserve_type_id": this.state.reserveOptionSelected,

                                    "property_id": this.state.selectedPropertyName.id,

                                    "resource_group_id":this.state.resource_group_id.id, "corporate_id": this.state.corporate_id});



                                });

                                    

                                }

                               



                            }

                            }>

                                {this.state.resource_group_list.length == 1?null: <Picker.Item label='Select Resource Group' value='0' />}



                            {



                                this.state.resource_group_list.map((item) => {



                                    return (

                                        <Picker.Item label={item.resource_group_name} value={item} fontFamily="Montserrat-SemiBold" />);

                                })

                            }

                        </Picker>}



                    </View>



                    <View style={[box.centerBox, ]}>

                        <Text style={[font.semibold, font.regular, color.blackColor]}>Resource Name *</Text>

                       {

                        Platform.OS === 'ios' ?

                        <TouchableOpacity disabled={!this.state.enableResourceNames} onPress={() => {

                            ActionSheetIOS.showActionSheetWithOptions(

                                {

                                    options: this.state.iResourceNameList,

                                    title: "Select a Resource Name",

                                    tintColor: 'orange',

                                   // cancelButtonIndex: [0]





                                },

                                buttonIndex => {

                                    this.setState({

                                        resource_name_selected: this.state.resource_names_list[buttonIndex],



                                    }, console.log("MY SELECTED resource names: ", this.state["resource_name_selected"]));







                                }

                            )

                        }} >

                            <View style={!this.state.enableResourceNames ? [button.defaultRadius,{flexDirection: 'row', justifyContent: 'space-between', marginTop: '3%'}]:[button.defaultRadius, { borderColor: color.myOrangeColor.color, flexDirection: 'row', justifyContent: 'space-between', marginTop: '3%' }]}>

                                <Text

                                    style={[font.regular, font.sizeRegular, !this.state.enableResourceNames ?color.blackColor :color.myOrangeColor]}

                                >{this.state.resource_name_selected == '' ? 'Select Resource Name' : this.state.resource_name_selected.resource_name}</Text>

                                <Icon name='angle-down' size={20} color= {!this.state.enableResourceNames ? color.blackColor.color: color.myOrangeColor.color} />

                            </View>

                        </TouchableOpacity>







                        :

                       

                       <Picker

                            selectedValue={resource_name_selected}

                            style={[color.blackColor, { width: "100%", }]}

                            enabled = {this.state.enableResourceNames}

                            dropdownIconColor="black"

                            onValueChange={(itemValue, itemIndex) => {

                                this.setState({

                                    resource_name_selected : itemValue,

  

                                  }, console.log("MY SELECTED resource names: ", this.state["resource_name_selected"]));

                               



                            }

                            }>

                             { this.state.resource_names_list.length == 1?null:<Picker.Item label='Select Resource Name' value='0' />}

                            {



                                this.state.resource_names_list.map((item) => {



                                    return (

                                        <Picker.Item label={item.resource_name} value={item} fontFamily="Montserrat-SemiBold" />);

                                })

                            }

                        </Picker>}



                    </View>



                   { 

                    Platform.OS === 'ios' ?

                    <View style={[box.centerBox, { flex: 1, flexDirection: "row", justifyContent: "space-around", alignItems: "center" }]}>

                    <Text style={[font.semibold, font.regular, color.blackColor]}>From Date {'&'} Time *</Text>

                    <View style={{ flex: 1, flexDirection: "row", justifyContent: "space-around", alignItems: "center" }}>

                        {

                            this.state.startDateNtime == '' ? null: <Text style = {[font.semibold, font.sizeRegular, color.myOrangeColor]}>{

                                moment(this.state.startDateNtime).format("DD MMMM YYYY - HH: mm")

                            }</Text>

                        }

                       

                        <TouchableOpacity onPress={() => {

                            this.setState({

                                showStartTimer: true,

                            }, () => {

                                console.log("icon clicked", this.state.showStartTimer)

                            })

                        }}>

                            <Icon name="calendar" size={30} color={color.myOrangeColor.color} />

                        </TouchableOpacity>



                      

                    </View>





                </View>



                    

                    :

                   <View style={[box.centerBox, ]}>

                        <Text style={[font.semibold, font.regular, color.blackColor]}>From Date {'&'} Time *</Text>

                        <View style={{ flex: 1, flexDirection: "row", justifyContent: "space-around", alignItems: "center" }}>

                            <TouchableOpacity onPress={() => {

                                if(this.state.selectedPropertyName != ''){

                                this.setState({

                                    showStartTimer: true,

                                })

                            }

                            else{

                                CommonHelpers.showFlashMsg("Please select a property name first", "danger");

                            }

                            }}>

                                {this.state.isStartDatePicked || this.state.startDateNtime != '' ?

                                    <Text style={[button.defaultRadius,

                                    font.bold, color.darkgrayColor,

                                    color.grayBorderColor, { borderWidth: 2 }]}>

                                        {moment(this.state.startdate).format("DD-MM-YYYY")} </Text > :

                                    <Text style={[button.defaultRadius,

                                    font.bold, color.darkgrayColor,

                                    color.grayBorderColor, { borderWidth: 2 }]}>Select</Text>}

                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => {

                                this.setState({

                                    showStartTimer: true,

                                }, ()=>{

                                    console.log("icon clicked", this.state.showStartTimer)

                                })

                            }}>

                                <Icon name="calendar" size={30} color="black" />

                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => {

                                console.log("status: ", /* this.state.startDateNtime, */ this.state.startdate, this.state.showStartTimer)

                                if (this.state.startDateNtime != '') {

                                    this.setState({

                                        isStartDatePicked: true,

                                        showStartTimer: true,

                                    })

                                }else if(this.state.startdate /* != '' */){

                                    this.setState({

                                        isStartDatePicked: true,

                                        showStartTimer: true,

                                    })

                                }

                                else {

                                    CommonHelpers.showFlashMsg("Please select Start Date first.", "danger")

                                }

                            }}>

                                {this.state.startDateNtime != '' ?

                                    <Text style={[button.defaultRadius,

                                    font.bold, color.darkgrayColor,

                                    color.grayBorderColor, { borderWidth: 2 }]}>

                                        {moment(this.state.startDateNtime).format("HH : mm")} </Text > :

                                    <Text style={[button.defaultRadius,

                                    font.bold, color.darkgrayColor,

                                    color.grayBorderColor, { borderWidth: 2 }]}>Select Hours</Text>}

                            </TouchableOpacity>



                        </View>





                    </View>}



                    {

                         Platform.OS == 'ios' ? 

                        <View style={[box.centerBox,{ flex: 1, flexDirection: "row", justifyContent: "space-around", alignItems: "center" }]}>

                         <Text style={[font.semibold, font.regular, color.blackColor]}>To Date {'&'} Time *</Text>

                         <View style={{ flex: 1, flexDirection: "row", justifyContent: "space-around", alignItems: "center" }}>

 

                             {

                                 this.state.endDateNtime == '' ? null : <Text style = {[font.semibold, font.sizeRegular, color.myOrangeColor]}>

                                     {moment(this.state.endDateNtime).format("DD MMMM YYYY - HH: mm")}

                                 </Text>

                             }

                             

                             <TouchableOpacity onPress={() => {

                                 if (this.state.startDateNtime != '') {

                                     this.setState({

                                         showEndTimer: true,

                                     })

                                 }

                                 else {

                                     CommonHelpers.showFlashMsg("Please select the start date and time first.", "danger");

                                 }

                             }}>

                                 <Icon name="calendar" size={30} color={color.myOrangeColor.color} />

                             </TouchableOpacity>

                            

 

                         </View>

 

 

                        </View>  

                         

                         :

                        

                        <View style={[box.centerBox, ]}>

                        <Text style={[font.semibold, font.regular, color.blackColor]}>To Date {'&'} Time *</Text>

                        <View style={{ flex: 1, flexDirection: "row", justifyContent: "space-around", alignItems: "center" }}>

                            <TouchableOpacity onPress={() => {

                                console.log("end date status", this.state.isEndDatePicked);

                                if(this.state.startDateNtime != ''){

                                this.setState({

                                    showEndTimer: true,

                                })

                            }

                            else{

                                CommonHelpers.showFlashMsg("Please pick the start date and time first.", "danger");

                            }

                            }}>

                                {this.state.isEndDatePicked || this.state.endDateNtime != '' || this.state.endDate != '' ?

                                    <Text style={[button.defaultRadius,

                                    font.bold, color.darkgrayColor,

                                    color.grayBorderColor, { borderWidth: 2 }]}>

                                        {moment(this.state.endDate).format("DD-MM-YYYY")} </Text > :

                                    <Text style={[button.defaultRadius,

                                    font.bold, color.darkgrayColor,

                                    color.grayBorderColor, { borderWidth: 2 }]}>Select</Text>}

                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => {

                                if(this.state.startDateNtime != ''){

                                this.setState({

                                    showEndTimer: true,

                                })

                            }

                            else{

                                CommonHelpers.showFlashMsg("Please select the start date and time first.", "danger");

                            }

                            }}>

                                <Icon name="calendar" size={30} color="black" />

                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => {

                                if(this.state.startDateNtime != ''){

                                if (this.state.endDateNtime != ''|| this.state.isEndDatePicked || this.state.endDate!='') {

                                    this.setState({

                                        isEndDatePicked: true,

                                        showEndTimer: true,

                                    })

                                }

                                else {

                                    CommonHelpers.showFlashMsg("Please select End Date first.", "danger")

                                }

                            }

                            else{

                                CommonHelpers.showFlashMsg("Please select the start date and time first.", "danger");

                            }

                            }}>

                                {this.state.endDateNtime != '' ?

                                    <Text style={[button.defaultRadius,

                                    font.bold, color.darkgrayColor,

                                    color.grayBorderColor, { borderWidth: 2 }]}>

                                        {moment(this.state.endDateNtime).format("HH : mm")} </Text > :

                                    <Text style={[button.defaultRadius,

                                    font.bold, color.darkgrayColor,

                                    color.grayBorderColor, { borderWidth: 2 }]}>Select Hours</Text>}

                            </TouchableOpacity>



                        </View>





                        </View>

                    }



                    {this.state.reserveOptionSelected == 1? null:



                    <View style={[box.centerBox, ]}>

                        <Text style={[font.semibold, font.regular, color.blackColor]}>No. of People: {this.state.numberofPeople}</Text>

                        <View style={[formStyle.formMargin, ]}>

                        <TextInput

                    placeholder={"Enter no. of People"}

                    placeholderTextColor = {color.darkgrayColor.color}

                    style = {[renderItem.inputBox]}

                    selectionColor = {color.myOrangeColor.color}

                    keyboardType="numeric"

                   /*  ref={(input) => {

                      this.emailRef = input;

                    }} */

                    value={this.state.numberofPeople}

                    returnKeyType={"next"}

                   /*  onSubmitEditing={() => {

                      this.pwdRef.focus();

                    }} */

                    blurOnSubmit={true}

                    onChangeText={(val) => {this.setState({

                        numberofPeople: val,

                    })}}

                    

                  />

                  </View>

                       



                    </View>

    }

                     

                </KeyboardAwareScrollView>

                <View height={80} style = {{position: "relative", bottom: 0,  flexDirection: "row", }}>

                        <TouchableOpacity style = {{flex: 1, alignItems: "center", justifyContent: "center", borderTopWidth:0.5}}

                        onPress= {()=>{

                            this.goBack();

                        }}

                        > 

                            <Text style = {[font.semibold, font.sizeLarge, color.blackColor,{}]}>CANCEL</Text>

                        </TouchableOpacity>

                        <TouchableOpacity style = {{flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "orange"}}

                        onPress = {()=>{

                            if(this.validate()){

                                let params = {};

                                let empPropertyitem = this.state.propertyItem;

                                let bookingpropertyItem = this.props.route.params.purpose == "modify"?this.props.route.params.params.item: null;



                                console.log(bookingpropertyItem);

                                this.props.route.params.purpose == "modify"? 

                                params = {

                                    "id":bookingpropertyItem.id ,

                                    "booking_id": bookingpropertyItem.booking_id,

                                    "booking_type_id": bookingpropertyItem.booking_type_id,

                                    "employee_id": this.state.emp_id,

                                    "provider_id": empPropertyitem.provider_id,

                                    "property_id": empPropertyitem.id,

                                    "resource_group_id": this.state.resource_group_id.id,

                                    "resource_id": this.state.resource_name_selected.id,

                                    "resource_plan_id": bookingpropertyItem.resource_plan_id,

                                    "reserve_type_id": Number(this.state.reserveOptionSelected),

                                    "start_date":moment(this.state.startDateNtime),

                                    "end_date": moment(this.state.endDateNtime),

                                    "total_days": bookingpropertyItem.total_days,

                                    "no_of_people": this.state.reserveOptionSelected == 1 ? 1:Number(this.state.numberofPeople),

                                    "total_seats": bookingpropertyItem.total_seats,

                                    "currency_id": bookingpropertyItem.currency_id,

                                    "amenities_price": bookingpropertyItem.amenities_price,

                                    "request_amenities_price": bookingpropertyItem.request_amenities_price,

                                    "total_price": bookingpropertyItem.total_price,

                                    "request_total_price": bookingpropertyItem.request_total_price,

                                    "suggested_property_id": bookingpropertyItem.suggested_property_id,

                                    "discount_price": bookingpropertyItem.discount_price,

                                    "discount_percentage": bookingpropertyItem.discount_percentage,

                                    "cgst": bookingpropertyItem.cgst,

                                    "sgst": bookingpropertyItem.sgst,

                                    "status": bookingpropertyItem.status,

                                    "booking_status":bookingpropertyItem.booking_status,

                                    "rsn_for_cancellation": bookingpropertyItem.rsn_for_cancellation,

                                    "admin_id": bookingpropertyItem.admin_id,

                                    "created_at": bookingpropertyItem.created_at,

                                    "updated_at": bookingpropertyItem.updated_at,

                                    "deleted_at": bookingpropertyItem.deleted_at,

                                    "approve_reject_at": bookingpropertyItem.approve_reject_at,

                                    "property_details": {

                                        "id": this.state.selectedPropertyName.id,

                                        "provider_id": this.state.provider_id,

                                        "property_name": this.state.selectedPropertyName.label,

                                        "property_code": empPropertyitem.property_code,

                                        "landline": empPropertyitem.landline,

                                        "city_id": empPropertyitem.city_id,

                                        "state_id": empPropertyitem.state_id,

                                        "country_id": empPropertyitem.country_id,

                                        "zipcode": empPropertyitem.zipcode,

                                        "latitude": empPropertyitem.latitude,

                                        "longitude": empPropertyitem.longitude,

                                        "property_tabs": empPropertyitem.property_tabs,

                                        "address1": empPropertyitem.address1,

                                        "address2": empPropertyitem.address2,

                                        "sort_id": empPropertyitem.sort_id,

                                        "short_desc": empPropertyitem.short_desc,

                                        "long_desc": empPropertyitem.long_desc,

                                        "pseudoname": empPropertyitem.pseudoname,

                                        "property_type_id": empPropertyitem.property_type_id,

                                        "is_verified": empPropertyitem.is_verified,

                                        "contact_no": empPropertyitem.contact_no,

                                        "website": empPropertyitem.website,

                                        "email": empPropertyitem.email,

                                        "service_location_id": empPropertyitem.service_location_id,

                                        "contact_person": empPropertyitem.contact_person,

                                        "contact_email": empPropertyitem.contact_email,

                                        "contact_alternate_email": empPropertyitem.contact_alternate_email,

                                        "country_code": empPropertyitem.country_code,

                                        "mobile_no": empPropertyitem.mobile_no,

                                        "total_sq_ft":empPropertyitem.total_sq_ft,

                                        "floor_no": empPropertyitem.floor_no,

                                        "start_at": empPropertyitem.start_at,

                                        "end_at": empPropertyitem.end_at,

                                        "show_actual_name": empPropertyitem.show_actual_name,

                                        "gst_registration_num": empPropertyitem.gst_registration_num,

                                        "is_cancellation_policy": empPropertyitem.is_cancellation_policy,

                                        "invoice_template_id": empPropertyitem.invoice_template_id,

                                        "status": empPropertyitem.status,

                                        "is_draft": empPropertyitem.is_draft,

                                        "is_alternative_primary": empPropertyitem.is_alternative_primary,

                                        "is_primary": empPropertyitem.is_primary,

                                        "landmark": empPropertyitem.landmark,

                                        "locality": empPropertyitem.locality,

                                        "skip_plans": empPropertyitem.skip_plans,

                                        "cgst": empPropertyitem.cgst,

                                        "sgst": empPropertyitem.sgst,

                                        "cctv_link": empPropertyitem.cctv_link,

                                        "is_cancel": empPropertyitem.is_cancel,

                                        "qr_code_path": empPropertyitem.qr_code_path,

                                        "floor_file": empPropertyitem.floor_file,

                                        "is_qr_code": empPropertyitem.is_qr_code,

                                        "created_at": empPropertyitem.created_at,

                                        "updated_at": empPropertyitem.updated_at,

                                        "deleted_at": empPropertyitem.deleted_at

                                    },

                                    "booking_seat_details": bookingpropertyItem.booking_seat_details /* [

                                        {

                                            "id": bookingpropertyItem.booking_seat_details[0].id,

                                            "booking_id": bookingpropertyItem.booking_seat_details[0].booking_id,

                                            "seat_id": bookingpropertyItem.booking_seat_details[0].seat_id,

                                            "user_id": bookingpropertyItem.booking_seat_details[0].user_id,

                                            "corporate_emp_properties_id": bookingpropertyItem.booking_seat_details[0].corporate_emp_properties_id,

                                            "corporate_id": bookingpropertyItem.booking_seat_details[0].corporate_id,

                                            "property_id":this.state.selectedPropertyName.id ,

                                            "resource_id": this.state.resource_name_selected.id,

                                            "resource_group_id": this.state.resource_group_id.id,

                                            "start_date": this.state.startDateNtime,

                                            "end_date":this.state.endDateNtime,

                                            "status": bookingpropertyItem.booking_seat_details[0].status,

                                            "created_at": bookingpropertyItem.booking_seat_details[0].created_at,

                                            "updated_at": bookingpropertyItem.booking_seat_details[0].updated_at,

                                            "deleted_at": bookingpropertyItem.booking_seat_details[0].deleted_at

                                        }

                                    ] */

                                }

                                :

                                 params = {

                                    "employee_id": this.state.emp_id,

                                    "property_id": this.state.selectedPropertyName.id,

                                    //"provider_id":this.state.provider_id,

                                    "resource_group_id": this.state.resource_group_id.id,

                                    "resource_id": this.state.resource_name_selected.id,

                                    "start_date": moment(this.state.startDateNtime),

                                    "end_date": moment(this.state.endDateNtime),

                                    "no_of_people":this.state.reserveOptionSelected == 1? 1: Number(this.state.numberofPeople),

                                    "reserve_type_id": Number(this.state.reserveOptionSelected),

                                   "corporate_id":this.state.corporate_id,// bookingpropertyItem.booking_seat_details[0].corporate_id,

                                }



                                console.log(params);

                                this.setState({

                                    spinner: true,

                                })



                                this.props.route.params.purpose == 'modify'?

                                

                                modifyEmpSeatReservationAPI(params).then((result)=>{

                                    this.setState({

                                        spinner: false,

                                    })

                                console.log("employee seat reservation modify status ", result.message, result.status);

                                if(result.status){

                                    CommonHelpers.showFlashMsg(result.message, "success");

                                    this.props.navigation.push('employeehome', {

                                        emplogin: 1,

                                    })

                                   

                                }

                                else{

                                   /*  if(result.message == "Request failed with status code 422")

                                    CommonHelpers.showFlashMsg("Seats not available to modify the request", "danger");

                                    else{ */

                                        CommonHelpers.showFlashMsg(result.message, "danger");

                                  /*   } */

                                }

                                }).catch(error=>{

                                    console.log(JSON.stringify(error));

                                })



                                

                                :



                                confirmEmpSeatReservationAPI(params).then((result)=>{

                                    this.setState({

                                        spinner: false,

                                    })

                                console.log("employee seat reservation status ", result.message, result.status);

                                if(result.status){

                                    CommonHelpers.showFlashMsg(result.message, "success");

                                    this.props.navigation.push('seatreservationlist');

                                   

                                }

                                else{

                                   /*  if(result.message == "Request failed with status code 422")

                                    CommonHelpers.showFlashMsg("Seats not available", "danger");

                                    else{ */

                                        CommonHelpers.showFlashMsg(result.message, "danger");

                                   /*  } */

                                }

                                }).catch(error=>{

                                    console.log(JSON.stringify(error));

                                })



                            }                       

                             }}>

                            <Text style = {[font.semibold, font.sizeLarge, color.textWhiteColor]}>RESERVE</Text>

                        </TouchableOpacity>

                            </View>

                

                {

                    Platform.OS === 'ios' ? 

                    this.state.showStartTimer && 

                    <DateTimePicker

                        testID="dateTimePicker"

                        minuteInterval={30}

                        textColor = {color.myOrangeColor.color}

                        value={this.state.startDateNtime != '' ? new Date(moment(this.state.startDateNtime)) : new Date()}

                        mode={'datetime'}

                        display= {"spinner"}//{this.state.isStartDatePicked ?"spinner": "default"}

                        is24Hour={true}

                        minimumDate = {new Date()}//{new Date(moment(this.state.corporate_start_date))}/* {this.state.initialDate} */

                        style={[color.myOrangeColor]}

                        onChange={this.iStartDateSelect} />

                    :

                this.state.showStartTimer &&



                    <DateTimePicker

                        testID="dateTimePicker"

                        minuteInterval={30}

                        value={this.state.startdate != ''? new Date(moment(this.state.startdate)): new Date()}

                        mode={this.state.isStartDatePicked ? "time" : 'date'}

                        display="spinner"//{this.state.isStartDatePicked ?"spinner": "default"}

                        is24Hour={true}

                        minimumDate = {new Date()}/* {this.state.initialDate} */

                        style={[color.myOrangeColor]}

                        onChange={this.onStartDateSelect} />



                }

                 {

                     Platform.OS == 'ios' ? 





                     this.state.showEndTimer &&

 

                     <DateTimePicker

                         testID="dateTimePicker"

                         minuteInterval={30}

                         textColor = {color.myOrangeColor.color}

                         value={this.state.endDate != '' ? new Date(moment(this.state.endDate)) : new Date()}

                         mode={'datetime'}

                         display={"spinner"}//{this.state.isStartDatePicked ?"spinner": "default"}

                         is24Hour={true}

                         minimumDate={new Date(this.state.minYear, this.state.minMonth, this.state.minDay)}

                         style={[color.myOrangeColor]}

                         onChange={this.iEndDateSelect} />

                     

                     :

                 this.state.showEndTimer &&



                    <DateTimePicker

                      testID="dateTimePicker"

    minuteInterval={30}

    value={this.state.endDate != ''? new Date(moment(this.state.endDate)):new Date()}

    mode={this.state.isEndDatePicked ? "time" : 'date'}

    display="spinner"//{this.state.isStartDatePicked ?"spinner": "default"}

    is24Hour={true}

    minimumDate={new Date(this.state.minYear, this.state.minMonth, this.state.minDay)}

    //maximumDate = {new Date(moment(this.state.corporate_end_date))}

    style={[color.myOrangeColor]}

                      onChange={this.onEndDateSelect} />

                }



                {this.state.spinner && <Spinner/>}

            </View>

            </Drawer>

        );

    }

}