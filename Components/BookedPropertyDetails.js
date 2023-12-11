import React, { Component } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, ScrollView, Dimensions, BackHandler, TextInput } from 'react-native';
import font from '../Styles/font';
import box from '../Styles/box';
import image from '../Styles/image';
import color from '../Styles/color';
import renderItem from '../Styles/renderItem';
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Header from './BookingComponents/Header';

import Spinner from '../Utils/Spinner';
import { AWS_URL } from '../config/RestAPI';
import { bookingInfoAPI, getPropertyInfoAPI, checkTimeAvailabilityAPI,modifyMeeting, cancelMemberBooking } from '../Rest/userAPI';
import CommonHelpers from '../Utils/CommonHelpers';
import moment from 'moment';
import Slideshow from 'react-native-image-slider-show';
import Modal from 'react-native-modalbox';
import Pdf from 'react-native-pdf';
import {
    termsandconditions, elegibilty_text,
    content_text,
    CLAIMS_OF_COPYRIGHT_INFRINGEMENT_text, user_account_deletion,
    review_text1, review_text2, review_text3,
    review_text4, review_text5, review_text6,
    space_accounts_text1, space_accounts_text2,
    space_accounts_text3, user_accounts_text1, user_accounts_text2,
    disputes_text, third_party_text, link_text, liability_text,
    indem_text, mis_text, mod_text, copyright_text, contact_text
} from '../config/RestAPI';
import LogoHeader from './ReusableComponents/LogoHeader';
import Drawer from "react-native-drawer";
import Sidemenu from "../Navigation/Sidemenu";
import Session from '../config/Session';
import button from '../Styles/button';

import DatePicker from 'react-native-date-picker';
import IconUsers from 'react-native-vector-icons/FontAwesome5';
import IconCheck from 'react-native-vector-icons/Ionicons';
import IconPen from 'react-native-vector-icons/Ionicons';
import Iconcross from 'react-native-vector-icons/Entypo';
import { SinglePickerMaterialDialog } from 'react-native-material-dialog';
import { StarRatingComponent } from './ReusableComponents/StarRatingComponent';
import Comments from './ReusableComponents/Comments';




export default class BookedPropertyDetails extends Component {
    constructor() {
        super();
        this.state = {
            details: {},
            spinner: false,
            carousel_images: [],//temp_array.images.length != 0? temp_array.images: [],

            amenity: [],
            free: 0,
            tncmodal: false,

            statusText: '',
            sliderheight: 350,

            empResource: null,
            propertyName: '',


            //modify params
            modifyModal: false,
            modificationDescription: '',
            qrvisible: false,
            enablePlanModification: false,
            showAllResourcePlan: false,
            selectedResourcePlan: null,
            modifiedGuestnumber: 1,
            enableGuestNumberModification: false,
            allResourcePlans: [],
            modifiedStartDate: null,
            enableStartDateModify: false,
            modifiedEndDate: null,
            enableEndDateModify: false,
            daysAfterModify: '',
            modifiedPlantype: null,

            modified_booking_dates: [],
            modified_total_booking_days: [],
            showStartTimer: false,
            currentIndex: 0,
            weekends: [],
            planName: null,
            range: null,
            duration: null,
            planDurationName: null,

            //cancel modal

            cancelModal: false,
            cancellationReason:'',
            cancelItem: {},
            policyDocPath: '',
            policydocName: '',

            rating: 0,
            openComments: false,
        }
    }



    componentWillUnmount() {
        if (this.backhandler)
            this.backhandler.remove();
    }

    async componentDidMount() {
        ////console.log("booked details page: ", this.props.route.params.item)

        this.backhandler = BackHandler.addEventListener('hardwareBackPress', () => {
            if (this.state.tncmodal) {
                this.setState({
                    tncmodal: false,
                })
                return true;

            } else {
                this.props.navigation.goBack();

                return true;

            }

        })
        await this._getPropertyInfo(this.props.route.params.item);
    }

    onFilterClosed = () => {
        this.setState({
            openComments: false,
        })

    }


    _getPropertyInfo = async (id) => {
        this.setState({
            spinner: true,
        })
        //console.log('Booking id: ', this.state.details.id, this.state.details);
        bookingInfoAPI({ 'booking_id': Number(id), 'user_id': await Session.getUserId() }).then((result) => {
            this.setState({
                spinner: false,
            });
            console.log('Proeprty info : ', JSON.stringify(result.dataArray[0]), result.status);
            if (result.status) {
                var temp_array = result.dataArray[0].property_images;
                let carousel_images = [];
                temp_array.length != 0 ? carousel_images = CommonHelpers.processRawImages(temp_array) : null;
                this.setState({
                    details: result.dataArray[0],
                    carousel_images: carousel_images,
                    amenity: result.dataArray[0].booking_amenities,
                    weekends: CommonHelpers.offDays(result.dataArray[0].property_timings),
                    planName: result.dataArray[0].booking_plan_details.plan_name,
                    allResourcePlans: result.dataArray[0].resource_plan,
                }, () => {
                    this.setState({
                        propertyName: this.state.details.property_details.show_actual_name != 0 ? this.state.details.property_details.property_name : this.state.details.property_details.pseudoname,
                        cancellation: AWS_URL + this.state.details.cancellation_policy_doc.template_path
                    })

                    if ((moment(new Date()).isBetween(moment(this.state.details.start_date), moment(this.state.details.end_date), undefined, [])) || moment(new Date()).isAfter(moment(this.state.details.end_date))) {
                        console.log('yesyesyes*******')
                        this.setState({

                            qrvisible: true

                        })

                    }




                    console.log('property details: ', this.state.details.property_details.show_actual_name);
                    this.state.amenity.map((item, index) => {
                        //console.log(item);
                        if (item.is_paid == 0) {
                            this.setState({
                                free: 1,
                            })
                        }
                    })
                });
            }
            else {
                CommonHelpers.showFlashMsg(result.message, 'danger');
            }

        })
    }


    closeControlPanel = () => {
        this._drawer.close()
    };
    openControlPanel = () => {
        this._drawer.open()
    };

    setPlan = (details) => {
        console.log(details);

        if (details.access_period_unit_id == 1) {
            console.log("1 month plan", details.access_period);
            this.setState({
                duration: Number(details.access_period),
                range: Number(details.access_period),
                modifiedPlantype: 'months',
                planDurationName: "Monthly Plan",
                //spinner: false
            })

        }
        else if (details.access_period_unit_id == 2) {
            //console.log("Daily plan time");
            this.setState({
                duration: Number(details.access_period),
                range: Number(details.access_period),
                modifiedPlantype: 'days',
                planDurationName: "Daily Plan",
                //spinner: false
            })


        }
        else if (details.access_period_unit_id == 3) {
            //console.log("Hourly plan");
            this.setState({
                duration: Number(details.access_period),
                range: Number(details.access_period),
                modifiedPlantype: 'hours',
                planDurationName: "Hourly Plan",
                // spinner: false
            })


        }
        else if (details.access_period_unit_id == 5) {
            //console.log("Weekly plan");
            this.setState({
                duration: Number(details.access_period),
                range: Number(details.access_period),
                modifiedPlantype: 'weeks',
                planDurationName: "Weekly Plan",
                // spinner: false
            })


        }
        else if (details.access_period_unit_id == 6) {
            //console.log("Yearly plan");
            this.setState({
                duration: Number(details.access_period),
                range: Number(details.access_period),
                modifiedPlantype: 'years',
                planDurationName: "Yearly Plan",
                //spinner: false
            })
        }
    }


    setPlanName = (access_period_unit_id) => {

        console.log('*******access period unit id: ', access_period_unit_id);



        if (access_period_unit_id == 1) {

            console.log("1 month plan", access_period_unit_id);



            return ' Monthly Plan';

        }

        else if (access_period_unit_id == 2) {

            //console.log("Daily plan time");

            return ' Day Plan';





        }

        else if (access_period_unit_id == 3) {

            //console.log("Hourly plan");

            return ' Hourly Plan';





        }

        else if (access_period_unit_id == 5) {

            //console.log("Weekly plan");

            return ' Weekly Plan';





        }

        else if (access_period_unit_id == 6) {

            //console.log("Yearly plan");

            return ' Yearly Plan';

        }

    }


    handleModification = () => {

        this.setState({

            spinner: true,

        })

        //console.log(this.state.details);

        const item = this.state.details;

        let bookingModifiedData = [];

        item.modify_booking.length == 0 ? null :

            item.modify_booking.forEach(element => {

                console.log('element', element)

                if (Number(element.booking_status) == 3) {

                    bookingModifiedData.push(element)

                }

            })

        let first_modify = item.modify_booking.length == 0 ? true : false;



        if (first_modify || bookingModifiedData.length == 0) {

            const data = {

                approved_plan_price: item.apporved_plan_price,

                booking_id: item.id,

                booking_name: item.booking_id,

                booking_type_id: item.booking_type_id,

                user_id: item.user_id,

                provider_id: item.provider_id,

                property_id: item.property_id,

                resource_plan_id: item.resource_plan_id,

                resource_group_id: item.resource_group_id,

                resource_id: item.resource_id,

                corporate_id: item.corporate_id,

                start_date: item.start_date,

                end_date: item.end_date,

                total_days: item.total_days,

                no_of_people: item.no_of_people,

                total_seats: item.total_seats,

                amenities_price: item.amenities_price,

                total_price: item.total_price,

                request_amenities_price: item.request_amenities_price,

                request_total_price: item.request_total_price,

                status: item.status,

                booking_status: null,

                is_direct_booking: item.is_direct_booking,

                parent_id: item.parent_id,

                mod_reasons: this.state.modificationDescription,

                cgst: item.cgst,

                sgst: item.sgst,

                mod_status: 0,

                request_by: "member",

                modify: 1,
                requested_resource_plan_id:this.state.selectedResourcePlan!=null ? this.state.selectedResourcePlan.resource_id : this.state.details.resource_plan_id,

requested_no_of_people:this.state.modifiedGuestnumber, 
requested_start_date: this.state.modifiedStartDate,

requested_end_date:this.state.modifiedEndDate,

requested_booking_duration: this.state.duration,

            };

            modifyMeeting(item.id, data).then((result) => {

                console.log(result.message);

                if (result.status) {

                    CommonHelpers.showFlashMsg(result.message, 'success');

                }

                else {

                    CommonHelpers.showFlashMsg(result.message, 'danger');

                }



                this.setState({

                    spinner: false,

                    modifyModal: false

                })

            })



        }

        else {



            console.log(bookingModifiedData);

              const data = {

                 approved_plan_price: bookingModifiedData[0].apporved_plan_price,

                 booking_id: bookingModifiedData[0].id,

                 booking_name: bookingModifiedData[0].booking_id,

                 booking_type_id: bookingModifiedData[0].booking_type_id,

                 user_id: bookingModifiedData[0].user_id,

                 provider_id: bookingModifiedData[0].provider_id,

                 property_id: bookingModifiedData[0].property_id,

                 resource_plan_id: bookingModifiedData[0].resource_plan_id,

                 resource_group_id: bookingModifiedData[0].resource_group_id,

                 resource_id: bookingModifiedData[0].resource_id,

                 corporate_id: bookingModifiedData[0].corporate_id,

                 start_date: bookingModifiedData[0].start_date,

                 end_date: bookingModifiedData[0].end_date,

                 total_days: bookingModifiedData[0].total_days,

                 no_of_people: bookingModifiedData[0].no_of_people,

                 total_seats: bookingModifiedData[0].total_seats,

                 amenities_price: bookingModifiedData[0].amenities_price,

                 total_price: bookingModifiedData[0].total_price,

                 request_amenities_price: bookingModifiedData[0].request_amenities_price,

                 request_total_price: bookingModifiedData[0].request_total_price,

                 status: bookingModifiedData[0].status,

                 booking_status: bookingModifiedData[0].booking_status,

                 is_direct_booking: bookingModifiedData[0].is_direct_booking,

                 parent_id: bookingModifiedData[0].parent_id,

                 mod_reasons: this.state.modificationDescription,

                 cgst: bookingModifiedData[0].cgst,

                 sgst: bookingModifiedData[0].sgst,

                 request_by: "member",

                 mod_status: 0,

                 modify: 2,
                 requested_resource_plan_id:this.state.selectedResourcePlan!=null ? this.state.selectedResourcePlan.resource_id : this.state.details.resource_plan_id,

requested_no_of_people:this.state.modifiedGuestnumber, 
requested_start_date: this.state.modifiedStartDate,

requested_end_date:this.state.modifiedEndDate,

requested_booking_duration: this.state.duration,

               }; 

             modifyMeeting(item.id, data).then((result) =>{

               console.log(result.message);

               if(result.status){

                   CommonHelpers.showFlashMsg(result.message, 'success');

               }

               else{

                   CommonHelpers.showFlashMsg(result.message, 'danger');

               }

   

               this.setState({

                   spinner: false,

                   modifyModal: false

               })

             })

        }





    }

    handleCancel = () => {

        const item = this.state.cancelItem;

        console.log(item)

        this.setState({

            spinner: true,

            cancelModal: false

        })

        const params = {

            "booking_id": item.id,

            'rsn_for_req_cancel': this.state.cancellationReason,

            // "user_id": Number(await Session.getUserId()),

        }

        console.log(params);



        cancelMemberBooking(params).then(result => {

            this.setState({

                spinner: false,

                cancelModal: false,

                cancelItem: ''

            })





            if (result.status) {

                CommonHelpers.showFlashMsg(result.message, "success");

                this.props.navigation.goBack();

            }

            else {

                CommonHelpers.showFlashMsg(result.message, "danger");

            }



        }).catch(error => {//////console.log("error in cancellation")

        })

    }

    checkBookingOpen = () => {

        const date = moment(new Date());



        const closeTime = moment(new Date(

            date.get('year'),

            date.get('month'),

            date.get('date'),

            '17',

            '00')

        );



        if (moment(new Date()).isAfter(closeTime)) {





            return false

        }

        else {



            return true

        }

    }



    onStartDateSelect = (event, value) => {
        console.log('event, ', event, value,);
        if (event.type == 'set') {
            let date = moment(value);
            const startTime = moment(new Date(
                date.get('year'),
                date.get('month'),
                date.get('date'),
                this.state.details.property_details.start_at.split(':')[0],
                this.state.details.property_details.start_at.split(':')[1],)
            );

            this.setState({
                modifiedStartDate: startTime,//value,
                enableStartDateModify: false
            }, () => {

                this.onDayPress(this.state.selectedResourcePlan != null ? this.state.selectedResourcePlan : this.state.details.booking_plan_details)

            })

        }





    }



    onDayPress = (details) => {


        if (this.state.modifiedStartDate != null) {

            var validstarttimearray = this.state.details.property_details.start_at.split(':');
            var validendtimearray = this.state.details.property_details.end_at.split(':');

            let day = Number(moment(this.state.modifiedStartDate).format("DD"));
            let month = Number(moment(this.state.modifiedStartDate).format("MM")) - 1;
            let year = Number(moment(this.state.modifiedStartDate).format("YYYY"));
            let hours = Number(validstarttimearray[0])
            let min = Number(validstarttimearray[1]);
            var startDate = new Date(year, month, day, hours, min)

            this.setState({
                modifiedStartDate: startDate,
            }, () => {
                if (details.access_period_unit_id == 1) {

                    let endDateTime = moment(this.state.modifiedStartDate).add(this.state.duration, "months").subtract(1, 'day');

                    let endtime2 = moment(endDateTime).add(Number(validendtimearray[0]) - Number(validstarttimearray[0]), "hours");
                    //console.log("endtime with 10 hours.", moment(endtime2).format("DD MM YYYY HH:mm"));
                    this.setState({
                        modifiedEndDate: endtime2,

                    })
                }
                else if (details.access_period_unit_id == 2) {

                    let endDateTime;

                    if (Number(this.state.duration) == 1) {

                        endDateTime = moment(this.state.modifiedStartDate).add(Number(validendtimearray[0]) - Number(validstarttimearray[0]), "hours");
                        this.setState({
                            modifiedEndDate: endDateTime,

                        })
                    }
                    else {
                        endDateTime = this.calculateEndDate(Number(this.state.duration) - 1, moment(this.state.modifiedStartDate));//moment(this.state.startTime).add(Number(this.state.range)-1, 'days');
                        //console.log("hours to add: ", Number(this.state.valid_end_at.split(':')[0])- Number(this.state.valid_start_at.split(':')[0]));
                        let endDate2 = moment(endDateTime).add(Number(this.state.valid_end_at.split(':')[0]) - Number(this.state.valid_start_at.split(':')[0]), "hours");
                        this.setState({
                            modifiedEndDate: endDate2,
                        })

                    }

                }
                else if (details.access_period_unit_id == 3) {
                    this.onStartTimeSelect({ type: 'set' }, this.state.modifiedStartDate);

                    /* console.log("Hourly plan****",this.state.duration);
                    let endDateTime = moment(this.state.modifiedStartDate).add(Number(this.state.duration), "hour");
                    let endHour = moment(endDateTime).format('HH');
                        let endMin = moment(endDateTime).format('mm');
                    if (Number(endHour) > Number(validendtimearray[0]) ) {
                        CommonHelpers.showFlashMsg('Exceeding the closing time.', 'danger');
                        this.setState({
                           // showTimer: true,
                        })
                    } else if (Number(endHour) == Number(validendtimearray[0]) && Number(endMin) > Number(validendtimearray[1])  ) {
                        CommonHelpers.showFlashMsg('Exceeding the closing time.', 'danger');
                        this.setState({
                           // showTimer: true,
                        })
                    }
                    else {
                        this.setState({
                            modifiedEndDate: endDateTime,
                        })
                    } */
                }
                else if (details.access_period_unit_id == 5) {
                    //console.log("Weekly plan");
                    // let endDateTime = moment(this.state.startTime).add(6, "days");
                    let endDateTime = this.calculateEndDate(((Number(this.state.duration) * 7) - 1), moment(this.state.modifiedStartDate))//moment(this.state.startTime).add((Number(this.state.range)*7-1), "days");
                    let endDateTime2 = moment(endDateTime).add(Number(validendtimearray[0]) - Number(validstarttimearray[0]), "hours");
                    this.setState({
                        modifiedEndDate: endDateTime2,

                    })

                } else if (details.access_period_unit_id == 6) {
                    //console.log("1 year plan");
                    //let endDateTime = moment(this.state.startTime).add(29, "days"); // old

                    // let endDateTime = moment(this.state.startTime).add((Number(this.state.range) * 365)-1, "days");
                    let endDateTime = this.calculateEndDate((Number(this.state.duration) * 365) - 1, moment(this.state.modifiedStartDate))//moment(this.state.startTime).add(Number(this.state.range), "years").subtract(1, 'day');

                    let endtime2 = moment(endDateTime).add(Number(validendtimearray[0]) - Number(validstarttimearray[0]), "hours");
                    //console.log("endtime with 10 hours.", moment(endtime2).format("DD MM YYYY HH:mm"));
                    this.setState({
                        modifiedEndDate: endtime2,

                    })
                }
            });


        }
        else {
            CommonHelpers.showFlashMsg("Please select Date first.", "danger");
        }
    }



    calculateEndDate = (range, startDate) => {

        let endDate = moment(startDate);
        if (this.state.weekends.length == 0) {
            endDate = endDate.add(range, 'days');
        }
        else {
            while (range > 0) {
                endDate = endDate.add(1, 'day');
                if (this.state.weekends.indexOf(new Date(endDate).getDay()) < 0) {

                    range = range - 1;
                    console.log(this.state.weekends.indexOf(new Date(endDate).getDay()), range);
                }
                console.log(moment(endDate).format('DD-MM-YYYY'));
            }

        }


        return endDate;

    }



    onStartTimeSelect = (event, value) => {

        console.log(moment(value).format('hh:mm A'),);
        let time = moment(value);
        let date = moment(this.state.modifiedStartDate);
        var validstarttimearray = this.state.details.property_details.start_at.split(':');
        var validendtimearray = this.state.details.property_details.end_at.split(':');

        const startTime = moment(new Date(

            date.get('year'),

            date.get('month'),

            date.get('date'),

            time.get('hour'),

            time.get('minute'),)

        );



        const openTime = moment(new Date(

            date.get('year'),

            date.get('month'),

            date.get('date'),

            this.state.details.property_details.start_at.split(':')[0],

            this.state.details.property_details.start_at.split(':')[1])

        );



        const minTime = openTime.subtract(1, 'minute');



        const closeTime = moment(new Date(

            date.get('year'),

            date.get('month'),

            date.get('date'),

            this.state.details.property_details.end_at.split(':')[0],

            this.state.details.property_details.end_at.split(':')[1])

        );



        // console.log(moment(minTime).format('DD/MM/YYYY, hh:mm A'), moment(closeTime).format('DD/MM/YYYY, hh:mm A'));



        const maxTime = closeTime.subtract(59, 'minutes');

        //console.log('max time: ', moment(maxTime).format('DD/MM/YYYY,  hh:mm A'));



        console.log(

            moment(startTime).format('DD MMM YYYY hh:mm A'),

            moment(minTime).format('DD MMM YYYY hh:mm A'),

            moment(openTime).format('DD MMM YYYY hh :mm A'),

            moment(closeTime).format('DD MMM YYYY hh:mm A'),

            moment(maxTime).format('DD MMM YYYY hh:mm A'))



        if (startTime.isBefore(moment(new Date()))) {

            CommonHelpers.showFlashMsg('Please select a future time.', 'danger');

        }

        else {

            if (startTime.isBetween(minTime, maxTime)) {

                this.setState({
                    modifiedStartDate: startTime,
                    showStartTimer: false

                }, () => {
                    console.log("Hourly plan****", this.state.duration);
                    let endDateTime = moment(this.state.modifiedStartDate).add(Number(this.state.duration), "hour");
                    let endHour = moment(endDateTime).format('HH');
                    let endMin = moment(endDateTime).format('mm');
                    if (Number(endHour) > Number(validendtimearray[0])) {
                        CommonHelpers.showFlashMsg('Exceeding the closing time.', 'danger');
                        this.onDayPress(this.state.selectedResourcePlan != null ? this.state.selectedResourcePlan : this.state.details.booking_plan_details)
                    } else if (Number(endHour) == Number(validendtimearray[0]) && Number(endMin) > Number(validendtimearray[1])  /* && choosenTime.isSame(currentTime, 'date') */) {
                        CommonHelpers.showFlashMsg('Exceeding the closing time.', 'danger');
                        this.onDayPress(this.state.selectedResourcePlan != null ? this.state.selectedResourcePlan : this.state.details.booking_plan_details)
                    }
                    else {
                        this.setState({
                            modifiedEndDate: endDateTime,
                        })
                    }
                    //this.onDayPress(this.state.selectedResourcePlan != null ? this.state.selectedResourcePlan:this.state.details.booking_plan_details)
                })

            }

            else {

                CommonHelpers.showFlashMsg('Outside the working window of the property.', 'danger');

                this.setState({

                    showStartTimer: false,

                })

            }



        }

    }



    onEndTimeSelect = async (event, value) => {

        console.log(moment(value).format('hh:mm A'),);

        let booking_dates = this.state.modified_booking_dates;

        booking_dates[this.state.currentIndex].endEmpty = true;

        let time = moment(value);





        let date = moment(booking_dates[this.state.currentIndex].dateobj);

        const endTime = moment(new Date(

            date.get('year'),

            date.get('month'),

            date.get('date'),

            time.get('hour'),

            time.get('minute'),)

        );

        console.log('end time: ', endTime);



        const openTime = moment(new Date(

            date.get('year'),

            date.get('month'),

            date.get('date'),

            this.state.details.property_details.start_at.split(':')[0],

            this.state.details.property_details.start_at.split(':')[1])

        );



        const minTime = booking_dates[this.state.currentIndex].startTime != '' ? moment(booking_dates[this.state.currentIndex].startTime).add(59, 'minutes') : openTime.add(59, 'minutes');



        const closeTime = moment(new Date(

            date.get('year'),

            date.get('month'),

            date.get('date'),

            this.state.details.property_details.end_at.split(':')[0],

            this.state.details.property_details.end_at.split(':')[1])

        );



        console.log(moment(minTime).format('DD/MM/YYYY, hh:mm A'), moment(closeTime).format('DD/MM/YYYY, hh:mm A'));



        const maxTime = closeTime.add(1, 'minute');

        console.log('max time: ', moment(maxTime).format('DD/MM/YYYY,  hh:mm A'));





        if (endTime.isBetween(minTime, maxTime)) {

            const minTime = booking_dates[this.state.currentIndex].startTime != '' ? moment(booking_dates[this.state.currentIndex].startTime).add(59, 'minutes') : openTime.add(59, 'minutes');



            if (endTime.isBetween(minTime, maxTime)) {

                await this.checkTimeAvailability(booking_dates[this.state.currentIndex].startTime, endTime)

            }

            else {

                CommonHelpers.showFlashMsg('End time cannot be before start time');

                this.setState({

                    showEndTimer: false

                })

            }

        }

        else {

            CommonHelpers.showFlashMsg('Outside the working window of the property.', 'danger')

            this.setState({

                showEndTimer: false

            })

        }

    }


    render() {
        return (
            <Drawer
                ref={(ref) => this._drawer = ref}
                type="overlay"
                content={<Sidemenu navigation={this.props.navigation} />}
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

                <View style={[{ flex: 1, }]}>
                    <LogoHeader navigation={this.props.navigation} 
                    onBarsPress={() => {
                        this.openControlPanel()
                    }} />
                   
                    <View style={[{
                        flex: 1,
                        marginTop: '3%',
                        flexDirection: "column",
                        alignContent: "center",
                        justifyContent: "center",
                    }]}>
                        <KeyboardAwareScrollView contentContainerStyle={box.scrollViewCenter}

                            keyboardShouldPersistTaps="always">
                            <Slideshow dataSource={this.state.carousel_images}
                                height={350}
                                containerStyle={image.imageCover}


                            />

{/* <View style = {{
    alignSelf:'center',
    margin: 10
    }}>
                            <StarRatingComponent
                                rating={Number(this.state.rating)}
                                readonly={false}
                                onFinishRating = {(rating)=>{
                                    console.log('finished', rating)
                                    this.setState({
                                        rating: rating, 
                                        openComments: true
                                    })

                                }}
                                />

                            </View> */}
                            <View style={[box.centerBox,]}>


                                {
                                    this.props.route.params.from == 'emphome' ? null : <View style={[box.boxContent]}>
                                        <View style={{ flex: 1, padding: 5 }}>
                                            <Text style={[font.bold, font.sizeMedium, color.lightBlack]}>Name </Text>
                                            <Text style={[font.sizeRegular, font.regular, color.darkgrayColor]}>
                                                {this.state.details.booking_id}
                                            </Text>
                                        </View >
                                        <View style={{ flex: 1, padding: 5 }}>
                                            <Text style={[font.bold, font.sizeMedium, color.lightBlack]}>Number of People </Text>
                                            <Text style={[font.sizeRegular, font.regular, color.darkgrayColor]}>
                                                {this.state.details.no_of_people}
                                            </Text>
                                        </View>
                                    </View>}

                                {
                                    this.state.details.booking_status == '1' ?

                                        <View style={[box.boxContent]}>
                                            <View style={{ flex: 1, padding: 5 }}>
                                                <Text style={[font.bold, font.sizeMedium, color.lightBlack]}>Address </Text>
                                                <Text style={[font.sizeRegular, font.regular, color.darkgrayColor]}>
                                                    {this.state.details.property_details.address1}, {this.state.details.property_details.address2}
                                                </Text>
                                            </View >

                                        </View>

                                        : null

                                }


                                <View style={[box.boxContent]}>
                                    <View style={{ flex: 1, padding: 5 }}>
                                        <Text style={[font.bold, font.sizeMedium, color.lightBlack]}>Booking Status</Text>
                                        <Text style={[font.sizeRegular, font.regular, color.darkgrayColor]}>
                                            {CommonHelpers.bookingStatusInfo(JSON.stringify(this.state.details.booking_status))}
                                        </Text>
                                    </View>
                                    <View style={{ flex: 1, padding: 5 }}>
                                        <Text style={[font.bold, font.sizeMedium, color.lightBlack]}>Property Name  </Text>



                                        <Text style={[font.sizeRegular, font.regular, color.darkgrayColor]}>
                                            {this.state.propertyName}

                                        </Text>

                                    </View>
                                </View>

                                {
                                    this.props.route.params.from == 'emphome' ? null : <View style={[box.boxContent]}>
                                        <View style={{ flex: 1, padding: 5 }}>
                                            <Text style={[font.bold, font.sizeMedium, color.lightBlack]}>Plan Name  </Text>
                                            <Text style={[font.sizeRegular, font.regular, color.darkgrayColor]}>
                                                {this.state.details.booking_plan_details == null ? '--' : this.state.details.booking_plan_details.plan_name}
                                            </Text>
                                        </View>
                                        <View style={{ flex: 1, padding: 5 }}>
                                            <Text style={[font.bold, font.sizeMedium, color.lightBlack]}>Resource Group  </Text>
                                            <Text style={[font.sizeRegular, font.regular, color.darkgrayColor]}>
                                                {
                                                    this.state.details.resource_details == null ? '--' : this.state.details.resource_details.rg_resource_group_name}
                                            </Text>
                                        </View>
                                    </View>}


                                {/* <View style  = {[box.boxContent]}>
                    <View style = {{flex: 1, padding: 5}}>
                <Text style = {[font.bold, font.sizeMedium, color.lightBlack ]}>Resource  </Text>
                <Text style= {[font.sizeRegular, font.regular,color.darkgrayColor ]}>
                    ?
                </Text>
                </View >
              
                </View> */}

                                <View style={[box.boxContent]}>
                                    <View style={{ flex: 1, padding: 5 }}>
                                        <Text style={[font.bold, font.sizeMedium, color.lightBlack]}>Free Services</Text>

                                        {this.state.amenity.length == 0 || this.state.free == 0 ? <Text style={[font.sizeRegular, font.regular, color.darkgrayColor]}>No Services</Text> :

                                            this.state.amenity.map((item, index) => {
                                                //console.log(item);
                                                if (item.is_paid == 0)
                                                    return (
                                                        <Text style={[font.sizeRegular, font.regular, color.darkgrayColor]}>{item.amenity_name}</Text>
                                                    );
                                            })
                                        }

                                    </View>
                                    <View style={{ flex: 1, padding: 5 }}>
                                        <Text style={[font.bold, font.sizeMedium, color.lightBlack]}>Value Added Services </Text>
                                        <Text style={[font.sizeRegular, font.regular, color.darkgrayColor]}>
                                            {this.state.amenity.length == 0 ? <Text style={[font.sizeRegular, font.regular, color.darkgrayColor]}>No Services</Text> :
                                                this.state.amenity.map((item, index) => {
                                                    //console.log(item);
                                                    if (item.is_paid == 1)
                                                        return (
                                                            <Text style={[font.sizeRegular, font.regular, color.darkgrayColor]}>{item.amenity_name}</Text>
                                                        );
                                                })
                                            }
                                        </Text>
                                    </View>
                                </View>



                                <View style={[box.boxContent]}>
                                    {this.props.route.params.from == 'emphome' ? null :
                                        <View style={{ flex: 1, padding: 5 }}>
                                            <Text style={[font.bold, font.sizeMedium, color.lightBlack]}>Date</Text>
                                            <Text style={[font.sizeRegular, font.regular, color.darkgrayColor]}>{
                                                moment(this.state.details.start_date).format("DD MMMM YYYY") == moment(this.state.details.end_date).format("DD MMMM YYYY") ?
                                                    moment(this.state.details.start_date).format("DD MMMM YYYY") :
                                                    moment(this.state.details.start_date).format("DD MMMM YYYY") + ' to ' + moment(this.state.details.end_date).format("DD MMMM YYYY")}
                                            </Text>
                                        </View>}
                                    {
                                        this.props.route.params.from == 'emphome' ?
                                            <View style={{ flex: 1, padding: 5 }}>
                                                <Text style={[font.bold, font.sizeMedium, color.lightBlack]}>Timings</Text>
                                                <Text style={[font.sizeRegular, font.regular, color.darkgrayColor]}>{this.state.details.start_at}Hrs to {this.state.details.end_at}Hrs</Text>
                                            </View>
                                            :
                                            <View style={{ flex: 1, padding: 5 }}>
                                                <Text style={[font.bold, font.sizeMedium, color.lightBlack]}>Timings</Text>
                                                <Text style={[font.sizeRegular, font.regular, color.darkgrayColor]}>{moment(this.state.details.start_date).format("HH:mm")}Hrs to {moment(this.state.details.end_date).format("HH:mm")}Hrs</Text>
                                            </View>}
                                </View>

                                <View style={[box.boxContent]}>
                                    {this.props.route.params.from == 'emphome' ? null :
                                        this.state.details.total_price == null || this.state.details.price == '' ?
                                            <View style={{ flex: 1, padding: 5 }}>
                                                <Text style={[font.semibold, font.sizeMedium, color.lightBlack]}>Total Amount</Text>
                                                <Text> -- </Text>
                                            </View>
                                            :
                                            <View style={{ flex: 1, padding: 5 }}>
                                                <Text style={[font.semibold, font.sizeMedium, color.lightBlack]}>Total Amount</Text>
                                                <Text style={[font.sizeRegular, font.regular, color.darkgrayColor]}> {'\u20B9'} {Intl.NumberFormat('en-IN').format(this.state.details.total_price)} <Text style={[font.regular, font.sizeSmall, color.darkgrayColor]}> (Inclusive of 18% GST)</Text></Text>
                                            </View>
                                    }
                                    {

                                        this.props.route.params.from == 'emphome' ? null :
                                            this.state.details.booking_plan_details == null || this.state.details.booking_plan_details == '' ?
                                                <View style={{ flex: 1, padding: 5 }}>
                                                    <Text style={[font.semibold, font.sizeMedium, color.lightBlack]}>Plan Price Per Booking Period</Text>
                                                    <Text> -- </Text>
                                                </View>
                                                :

                                                <View style={{ flex: 1, padding: 5 }}>
                                                    <Text style={[font.bold, font.sizeMedium, color.lightBlack]}>Plan Price Per Booking Period </Text>
                                                    <Text style={[font.sizeRegular, font.regular, color.darkgrayColor]}>
                                                        {'\u20B9'} {this.state.details.booking_plan_details == null ? '--' : Intl.NumberFormat('en-IN').format(this.state.details.booking_plan_details.price)}
                                                    </Text>
                                                </View>
                                    }
                                </View>

                                <View style={[box.boxContent]}>
                                    {this.props.route.params.from == 'emphome' ? null : <View style={{ flex: 1, padding: 5 }}>
                                        <Text style={[font.bold, font.sizeMedium, color.lightBlack]}>Security Amount</Text>
                                        <Text style={[font.sizeRegular, font.regular, color.darkgrayColor]}> {this.state.details.booking_plan_details == null || this.state.details.booking_plan_details.security_amt == null ? '--' : ('\u20B9' + Intl.NumberFormat('en-IN').format(this.state.details.booking_plan_details.security_amt))} </Text>
                                    </View>}
                                    {/*  <View style = {{flex: 1,padding: 5}}>
                <Text style = {[font.bold, font.sizeMedium,color.lightBlack  ]}>Security Deposit </Text>
                <Text style= {[font.sizeRegular, font.regular, color.darkgrayColor]}>
                    {this.props.route.params.item.booking_plan_details == null || this.props.route.params.item.booking_plan_details.security_amt == null ? '--' : this.props.route.params.item.booking_plan_details.security_amt}
                </Text>
                </View> */}
                                </View>

                                <View style={[box.boxContent]}>
                                    {/*  <View style = {{flex: 1,padding: 5 }}>
                <Text style = {[font.bold, font.sizeMedium, color.lightBlack ]}>Security to Refund</Text>
                <Text style= {[font.sizeRegular, font.regular, color.darkgrayColor]}> {'\u20B9'} ? </Text>
                 
                
                </View> */}

                                </View>

                                <View style={[box.boxContent]}>
                                    <View style={{ flex: 1, padding: 5 }}>

                                        <Text style={[font.bold, font.sizeMedium, color.lightBlack]}>Property Terms and Conditions</Text>
                                        <TouchableOpacity onPress={() => {
                                            this.setState({
                                                tncmodal: true,
                                            })
                                        }}>
                                            <Text style={[font.sizeRegular,
                                            font.regular,
                                            color.myOrangeColor,
                                            {
                                                textDecorationLine: "underline",
                                                textDecorationColor: "orange"
                                            }]}>
                                                Click Here </Text>
                                        </TouchableOpacity>


                                    </View>

                                </View>

                                { /*  <View style  = {[box.boxContent]}>
                    <View style = {{flex: 1, padding: 5}}>
                <Text style = {[font.bold, font.sizeMedium, color.lightBlack ]}>Comments and Remarks</Text>
                <Text style= {[font.sizeRegular, font.regular ,color.darkgrayColor ]}> No Comments and Remarks </Text>
                </View>
                <View style = {{flex: 1,padding: 5}}>
                <Text style = {[font.bold, font.sizeMedium, color.lightBlack ]}>Modification Request Description </Text>
                
                 <Text style= {[font.sizeRegular, font.regular, color.darkgrayColor]}>
                    ?
                </Text> 
                </View>
               
                </View> */}

                            </View>




                        </KeyboardAwareScrollView>
                    </View>

                    {this.state.tncmodal && <Modal position={"center"} swipeToClose={false}
                        onClosed={() => { this.setState({ tncmodal: false }) }}
                        style={{
                            justifyContent: 'space-around',
                            alignItems: 'space-around',
                            padding: 20,
                            height: Dimensions.get('screen').height * 0.8,
                            width: Dimensions.get('screen').width * 0.9,
                        }} isOpen={this.state.tncmodal}>
                        <View height={"100%"}>
                            <ScrollView keyboardShouldPersistTaps={"always"}>
                                <Text style={[font.bold, font.sizeLarge, color.myOrangeColor, { textAlign: "center", marginBottom: "10%" }]}>Terms</Text>
                                <Text style={[font.regular, font.sizeRegular, color.darkgrayColor, { textAlign: "justify", marginBottom: "10%" }]}>{"Effective Date: " + moment().format("DD MMMM, YYYY")}</Text>
                                <Text style={[font.regular, font.sizeRegular, color.darkgrayColor, { textAlign: "justify", lineHeight: 14 + 14 * 1 }]}>
                                    {termsandconditions}
                                </Text>
                                <Text style={[font.bold, font.sizeLarge, color.myOrangeColor, { textAlign: "center", marginBottom: "10%" }]}>Eligibility</Text>
                                <Text style={[font.regular, font.sizeRegular, color.darkgrayColor, { textAlign: "justify", lineHeight: 14 + 14 * 1 }]}>
                                    {elegibilty_text}
                                </Text>
                                <Text style={[font.bold, font.sizeLarge, color.myOrangeColor, { textAlign: "center", marginBottom: "10%" }]}>Content</Text>
                                <Text style={[font.regular, font.sizeRegular, color.darkgrayColor, { textAlign: "justify", lineHeight: 14 + 14 * 1 }]}>
                                    {content_text}
                                </Text>

                                <Text style={[font.bold, font.sizeLarge, color.myOrangeColor, { textAlign: "center", marginBottom: "10%" }]}>CLAIMS OF COPYRIGHT INFRINGEMENT</Text>
                                <Text style={[font.regular, font.sizeRegular, color.darkgrayColor, { textAlign: "justify", lineHeight: 14 + 14 * 1 }]}>
                                    {CLAIMS_OF_COPYRIGHT_INFRINGEMENT_text}
                                </Text>

                                <Text style={[font.bold, font.sizeLarge, color.myOrangeColor, { textAlign: "center", marginBottom: "10%" }]}>REVIEWS, ENQUIRIES, COMMENTS AND USE OF OTHER INTERACTIVE AREAS</Text>
                                <Text style={[font.regular, font.sizeRegular, color.darkgrayColor, { textAlign: "justify", lineHeight: 14 + 14 * 1 }]}>
                                    {review_text1}
                                </Text>
                                <Text style={[font.regular, font.sizeRegular, color.darkgrayColor, { textAlign: "justify", lineHeight: 14 + 14 * 1 }]}>
                                    {review_text2}
                                </Text>
                                <Text style={[font.regular, font.sizeRegular, color.darkgrayColor, { textAlign: "justify", lineHeight: 14 + 14 * 1 }]}>
                                    {review_text3}
                                </Text>
                                <Text style={[font.regular, font.sizeRegular, color.darkgrayColor, { textAlign: "justify", lineHeight: 14 + 14 * 1 }]}>
                                    {review_text4}
                                </Text>
                                <Text style={[font.regular, font.sizeRegular, color.darkgrayColor, { textAlign: "justify", lineHeight: 14 + 14 * 1 }]}>
                                    {review_text5}
                                </Text>
                                <Text style={[font.regular, font.sizeRegular, color.darkgrayColor, { textAlign: "justify", lineHeight: 14 + 14 * 1 }]}>
                                    {review_text6}
                                </Text>

                                <Text style={[font.bold, font.sizeLarge, color.myOrangeColor, { textAlign: "center", marginBottom: "10%" }]}>BERIGHTHERE.COM SPACE ACCOUNTS</Text>
                                <Text style={[font.regular, font.sizeRegular, color.darkgrayColor, { textAlign: "justify", lineHeight: 14 + 14 * 1 }]}>
                                    {space_accounts_text1}
                                </Text>
                                <Text style={[font.regular, font.sizeRegular, color.darkgrayColor, { textAlign: "justify", lineHeight: 14 + 14 * 1 }]}>
                                    {space_accounts_text2}
                                </Text>
                                <Text style={[font.regular, font.sizeRegular, color.darkgrayColor, { textAlign: "justify", lineHeight: 14 + 14 * 1 }]}>
                                    {space_accounts_text3}
                                </Text>

                                <Text style={[font.bold, font.sizeLarge, color.myOrangeColor, { textAlign: "center", marginBottom: "10%" }]}>USER ACCOUNTS</Text>
                                <Text style={[font.regular, font.sizeRegular, color.darkgrayColor, { textAlign: "justify", lineHeight: 14 + 14 * 1 }]}>
                                    {user_accounts_text1}
                                </Text>

                                <Text style={[font.regular, font.sizeRegular, color.darkgrayColor, { textAlign: "justify", lineHeight: 14 + 14 * 1 }]}>
                                    {user_accounts_text2}
                                </Text>
                                <Text style={[font.bold, font.sizeLarge, color.myOrangeColor, { textAlign: "center", marginBottom: "10%" }]}>USER ACCOUNT DELETION</Text>
                                <Text style={[font.regular, font.sizeRegular, color.darkgrayColor, { textAlign: "justify", lineHeight: 14 + 14 * 1 }]}>
                                    {user_account_deletion}
                                </Text>

                                <Text style={[font.bold, font.sizeLarge, color.myOrangeColor, { textAlign: "center", marginBottom: "10%" }]}>DISPUTES BETWEEN COWORKING SPACES AND USERS</Text>
                                <Text style={[font.regular, font.sizeRegular, color.darkgrayColor, { textAlign: "justify", lineHeight: 14 + 14 * 1 }]}>
                                    {disputes_text}
                                </Text>

                                <Text style={[font.bold, font.sizeLarge, color.myOrangeColor, { textAlign: "center", marginBottom: "10%" }]}>THIRD-PARTY SUPPLIERS</Text>
                                <Text style={[font.regular, font.sizeRegular, color.darkgrayColor, { textAlign: "justify", lineHeight: 14 + 14 * 1 }]}>
                                    {third_party_text}
                                </Text>

                                <Text style={[font.bold, font.sizeLarge, color.myOrangeColor, { textAlign: "center", marginBottom: "10%" }]}>LINKS TO THIRD-PARTY SITES</Text>
                                <Text style={[font.regular, font.sizeRegular, color.darkgrayColor, { textAlign: "justify", lineHeight: 14 + 14 * 1 }]}>
                                    {link_text}
                                </Text>

                                <Text style={[font.bold, font.sizeLarge, color.myOrangeColor, { textAlign: "center", marginBottom: "10%" }]}>LIABILITY DISCLAIMER</Text>
                                <Text style={[font.regular, font.sizeRegular, color.darkgrayColor, { textAlign: "justify", lineHeight: 14 + 14 * 1 }]}>
                                    {liability_text}
                                </Text>

                                <Text style={[font.bold, font.sizeLarge, color.myOrangeColor, { textAlign: "center", marginBottom: "10%" }]}>INDEMNIFICATION</Text>
                                <Text style={[font.regular, font.sizeRegular, color.darkgrayColor, { textAlign: "justify", lineHeight: 14 + 14 * 1 }]}>
                                    {indem_text}
                                </Text>

                                <Text style={[font.bold, font.sizeLarge, color.myOrangeColor, { textAlign: "center", marginBottom: "10%" }]}>MICELLANEOUS</Text>
                                <Text style={[font.regular, font.sizeRegular, color.darkgrayColor, { textAlign: "justify", lineHeight: 14 + 14 * 1 }]}>
                                    {mis_text}
                                </Text>

                                <Text style={[font.bold, font.sizeLarge, color.myOrangeColor, { textAlign: "center", marginBottom: "10%" }]}>MODIFICATIONS TO THIS AGREEMENT</Text>
                                <Text style={[font.regular, font.sizeRegular, color.darkgrayColor, { textAlign: "justify", lineHeight: 14 + 14 * 1 }]}>
                                    {mod_text}
                                </Text>

                                <Text style={[font.bold, font.sizeLarge, color.myOrangeColor, { textAlign: "center", marginBottom: "10%" }]}>COPYRIGHT AND TRADEMARK NOTICES</Text>
                                <Text style={[font.regular, font.sizeRegular, color.darkgrayColor, { textAlign: "justify", lineHeight: 14 + 14 * 1 }]}>
                                    {copyright_text}
                                </Text>

                                <Text style={[font.bold, font.sizeLarge, color.myOrangeColor, { textAlign: "center", marginBottom: "10%" }]}>CONTACT</Text>
                                <Text style={[font.regular, font.sizeRegular, color.darkgrayColor, { textAlign: "justify", lineHeight: 14 + 14 * 1 }]}>
                                    {contact_text}
                                </Text>


                            </ScrollView>
                        </View>

                    </Modal>}

                </View>

                {
                   this.state.qrvisible ? null :
                
                <View style={[box.horizontalBox, { height: 70, marginTop: 5 }]}>

                    <TouchableOpacity 
                    onPress = {()=>{
                        this.setState({

                            cancelModal: true,
                            cancelItem: this.state.details,
                            policyDocPath: AWS_URL + this.state.details.cancellation_policy_doc.tc_type_template_path,
                            policydocName: this.state.details.cancellation_policy_doc.tc_type_name,

                        })
                    }}
                    style={[button.defaultRadius, {
                        borderColor: color.darkgrayColor.color,
                        flex: 1,
                        margin: 5,
                        justifyContent: 'center',
                        alignItems: 'center'
                    }]}>
                        <Text style={[font.semibold,
                        font.sizeMedium,
                        color.darkgrayColor]}>CANCEL</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => {

                            this.setState({
                                modifyModal: true,
                                daysAfterModify: this.state.details.total_days,
                                modifiedStartDate: this.state.details.start_date,
                                modifiedEndDate: this.state.details.end_date,

                                //modifiedPlantype: this.state.planType
                            }, () => {
                                this.state.details.booking_plan_details.access_period_unit_id == 3 ? this.onDayPress(this.state.details.booking_plan_details) : null
                            })
                            this.setPlan(this.state.details.booking_plan_details);
                        }}
                        style={[button.defaultRadius, {
                            flex: 1,
                            margin: 5,
                            justifyContent: 'center',
                            alignItems: 'center',
                            borderColor: color.myOrangeColor.color,
                        }]}>
                        <Text style={[font.semibold,
                        font.sizeMedium,
                        color.myOrangeColor]}>MODIFY BOOKING</Text>
                    </TouchableOpacity>


                </View>
    }

                {this.state.modifyModal && <Modal position={"center"} swipeToClose={false}
                    onClosed={() => { this.setState({ modifyModal: false }) }}
                    style={{
                        height: Dimensions.get('screen').height * 0.9,
                        width: Dimensions.get('screen').width * 0.9,
                    }} isOpen={this.state.modifyModal}>
                    <View height={"100%"}>
                        <View style={[{
                            backgroundColor: color.myOrangeColor.color,
                            height: 50,
                            justifyContent: 'center'
                        }]}>
                            <Text style={[
                                font.bold,
                                font.sizeRegular,
                                color.textWhiteColor,
                                {
                                    textAlign: 'center'
                                }
                            ]}>Request For Modification</Text>
                        </View>
                        <KeyboardAwareScrollView>

                            {/* static */}
                            <Text style={[
                                font.bold,
                                font.sizeRegular,
                                color.myOrangeColor,
                                box.centerBox]}>Existing Booking Details</Text>
                            <View style={[box.centerBox, box.horizontalBox, { /* backgroundColor:'red', */ paddingTop: 5, paddingBottom: 5 }]}>
                                <View style={{
                                    flex: 1,
                                    // width: '45%',
                                    flexWrap: 'wrap',
                                }}>
                                    <Text style={[
                                        font.sizeRegular,
                                        font.sizeVeryRegular,
                                        color.grayColor
                                    ]}>Booking Name</Text>
                                    <Text style={[
                                        font.semibold,
                                        font.sizeRegular,
                                        color.myOrangeColor, { flexWrap: 'wrap', }
                                    ]}>{this.state.details.booking_id}</Text>
                                </View>
                                <View style={{
                                    flex: 1,
                                    //width: '45%',
                                    alignItems: 'flex-end'
                                }}>
                                    <Text style={[
                                        font.sizeRegular,
                                        font.sizeVeryRegular,
                                        color.grayColor
                                    ]}>Property Name</Text>
                                    <Text style={[
                                        font.semibold,
                                        font.sizeRegular,
                                        color.myOrangeColor,/* { width:  Dimensions.get('window').width*0.5, flexWrap: 'wrap',} */
                                    ]}>{this.state.propertyName}</Text>

                                </View>
                            </View>

                            <View style={[box.centerBox, box.horizontalBox, { /* backgroundColor:'red', */ paddingTop: 0, paddingBottom: 5 }]}>
                                <View style={{
                                    flex: 1,
                                    // width: '45%',
                                    flexWrap: 'wrap',
                                }}>
                                    <Text style={[
                                        font.sizeRegular,
                                        font.sizeVeryRegular,
                                        color.grayColor
                                    ]}>Plan Name</Text>
                                    <Text style={[
                                        font.semibold,
                                        font.sizeRegular,
                                        color.myOrangeColor, { flexWrap: 'wrap', }
                                    ]}>{this.state.planName}</Text>

                                </View>

                                <View style={{

                                    // flex: 1,

                                    alignItems: 'flex-end'

                                    //width: '45%',



                                }}>

                                    <Text style={[



                                        font.sizeRegular,

                                        font.sizeVeryRegular,

                                        color.grayColor

                                    ]}>Number of People</Text>

                                    <Text style={[

                                        font.semibold,

                                        font.sizeRegular,

                                        color.myOrangeColor,/* { width:  Dimensions.get('window').width*0.5, flexWrap: 'wrap',} */

                                    ]}>{this.state.details.total_seats}</Text>

                                </View>

                            </View>



                            <View style={[box.centerBox, box.horizontalBox, { /* backgroundColor:'red', */ paddingTop: 0, paddingBottom: 5 }]}>

                                <View style={{

                                    flex: 1,

                                    // width: '45%',

                                    flexWrap: 'wrap',



                                }}>

                                    <Text style={[



                                        font.sizeRegular,

                                        font.sizeVeryRegular,

                                        color.grayColor

                                    ]}>Booking Start Date</Text>

                                    <Text style={[

                                        font.semibold,

                                        font.sizeRegular,

                                        color.myOrangeColor, { flexWrap: 'wrap', }

                                    ]}>{moment(this.state.details.start_date).format('DD MMM YYYY')}</Text>

                                </View>

                                <View style={{

                                    // flex: 1,

                                    alignItems: 'flex-end'

                                    //width: '45%',



                                }}>

                                    <Text style={[



                                        font.sizeRegular,

                                        font.sizeVeryRegular,

                                        color.grayColor

                                    ]}>Booking End Date</Text>

                                    <Text style={[

                                        font.semibold,

                                        font.sizeRegular,

                                        color.myOrangeColor,/* { width:  Dimensions.get('window').width*0.5, flexWrap: 'wrap',} */

                                    ]}>{moment(this.state.details.end_date).format('DD MMM YYYY')}</Text>

                                </View>

                            </View>



                            <View style={[box.centerBox, box.horizontalBox, { /* backgroundColor:'red', */ paddingTop: 0, paddingBottom: 5 }]}>

                                <View style={{

                                    flex: 1,

                                    // width: '45%',

                                    flexWrap: 'wrap',



                                }}>

                                    <Text style={[



                                        font.sizeRegular,

                                        font.sizeVeryRegular,

                                        color.grayColor

                                    ]}>Booking Start Time</Text>

                                    <Text style={[

                                        font.semibold,

                                        font.sizeRegular,

                                        color.myOrangeColor, { flexWrap: 'wrap', }

                                    ]}>{moment(this.state.details.start_date).format('hh:mm A')}</Text>

                                </View>

                                <View style={{

                                    // flex: 1,

                                    alignItems: 'flex-end'

                                    //width: '45%',



                                }}>

                                    <Text style={[



                                        font.sizeRegular,

                                        font.sizeVeryRegular,

                                        color.grayColor

                                    ]}>Booking End Time</Text>

                                    <Text style={[

                                        font.semibold,

                                        font.sizeRegular,

                                        color.myOrangeColor,/* { width:  Dimensions.get('window').width*0.5, flexWrap: 'wrap',} */

                                    ]}>{moment(this.state.details.end_date).format('hh:mm A')}</Text>

                                </View>

                            </View>





                            {/* modify begins */}



                            <Text style={[

                                font.bold,

                                font.sizeRegular,

                                color.myOrangeColor,

                                box.centerBox]}>Modify Booking</Text>



                            <View style={[box.centerBox,/* box.horizontalBox, */{ /* backgroundColor:'pink', */paddingTop: 0, paddingBottom: 5 }]}>

                                <View style={{

                                    // width: '45%',

                                    flexWrap: 'wrap'

                                }}>

                                    <Text style={[



                                        font.sizeRegular,

                                        font.regular,

                                        color.grayColor,

                                    ]}>Plan Name</Text>

                                    {

                                        !this.state.enablePlanModification ?



                                            <View style={[box.horizontalBox]}>

                                                <Text style={[

                                                    font.semibold,

                                                    font.sizeRegular,

                                                    color.darkgrayColor,

                                                ]}>{this.state.selectedResourcePlan == null ? this.state.planName : this.state.selectedResourcePlan.plan_name + ' '+this.state.planDurationName}</Text>



                                                <TouchableOpacity style={{ marginLeft: 20 }} onPress={() => {

                                                    this.setState({

                                                        enablePlanModification: !this.state.enablePlanModification,

                                                    })

                                                }}>

                                                    <IconPen name={'ios-pencil'}

                                                        color={color.myOrangeColor.color}

                                                        size={20} />

                                                </TouchableOpacity>







                                            </View>



                                            :



                                            <View style={{ flexDirection: 'row' }}>





                                                <TouchableOpacity style={[button.defaultRadius, { borderColor: color.myOrangeColor.color }]} onPress={() => {

                                                    this.setState({

                                                        showAllResourcePlan: true

                                                    })



                                                }}>

                                                    <Text>{this.state.selectedResourcePlan != null ? this.state.selectedResourcePlan.plan_name + this.state.planDurationName : 'Select a Plan'}</Text>

                                                </TouchableOpacity>



                                                {

                                                    this.state.showAllResourcePlan &&





                                                    <SinglePickerMaterialDialog

                                                        title={'Select'}

                                                        colorAccent={color.myOrangeColor.color}

                                                        items={this.state.allResourcePlans.map((row, index) => {

                                                            return { value: index, label: row.plan_name + this.setPlanName(row.access_period_unit_id), item: row };

                                                        })}

                                                        visible={this.state.showAllResourcePlan}

                                                        selectedItems={this.state.selectedResourcePlan}

                                                        onCancel={() => this.setState({ showAllResourcePlan: false })}

                                                        onOk={result => {

                                                            console.log(result)

                                                            if(result.selectedItem != undefined){
                                                                this.setState({

                                                                    selectedResourcePlan: result.selectedItem.item,
    
                                                                    showAllResourcePlan: false,
    
                                                                    enablePlanModification: false,
    
                                                                })
    
                                                                this.setPlan(result.selectedItem.item);
                                                                this.onDayPress(result.selectedItem.item);

                                                            }
                                                            else{
                                                                CommonHelpers.showFlashMsg('Please select an option.')
                                                            }

                                                          

                                                        }}

                                                    />

                                                }

                                                <TouchableOpacity style={{ marginLeft: 20 }} onPress={() => {

                                                    this.setState({

                                                        enablePlanModification: !this.state.enablePlanModification,

                                                    })

                                                }}>

                                                    <Iconcross name={'circle-with-cross'}

                                                        color={color.myOrangeColor.color}

                                                        size={20} />

                                                </TouchableOpacity>







                                            </View>





                                    }



                                </View>

                                {/* number of people */}

                                {
                                    (this.state.selectedResourcePlan != null && this.state.selectedResourcePlan.capacity > 1) ||
                                        (this.state.selectedResourcePlan == null && this.state.details.booking_plan_details.capacity > 1) ?
                                        null :

                                        <View style={{

                                            //width: '45%',

                                            flexWrap: 'wrap'

                                        }}>

                                            <Text style={[



                                                font.sizeRegular,

                                                font.regular,

                                                color.grayColor,

                                            ]}>Number of People</Text>

                                            {


                                                this.state.enableGuestNumberModification ?

                                                    <View style={{ flexDirection: 'row' }}>

                                                        <TextInput
                                                            placeholder='Enter the guests'
                                                            selectionColor={color.myOrangeColor.color}
                                                            style={[renderItem.inputBox]}
                                                            defaultValue={this.state.modifiedGuestnumber}
                                                            onChangeText={(value) => {
                                                                if (Number(value) <= 100
                                                            /* (this.state.selectedResourcePlan == null && 
                                                            Number(value) <= this.state.details.resource_details.capacity)|| (this.state.selectedResourcePlan != null && Number(value)<= this.state.selectedResourcePlan.capacity) */) {

                                                                    this.setState({

                                                                        modifiedGuestnumber: value

                                                                    })

                                                                }

                                                                else {



                                                                    CommonHelpers.showFlashMsg('Guest limit exceeded.', 'danger')

                                                                }

                                                                /* else if( this.state.selectedResourcePlan){
        
                
        
                                                                } */



                                                            }}

                                                        />

                                                        <TouchableOpacity style={{ marginLeft: 20 }} onPress={() => {

                                                            this.setState({

                                                                enableGuestNumberModification: !this.state.enableGuestNumberModification,

                                                            })

                                                        }}>

                                                            <Iconcross name={'circle-with-cross'}

                                                                color={color.myOrangeColor.color}

                                                                size={20} />

                                                        </TouchableOpacity>



                                                    </View>



                                                    :

                                                    <View style={[box.horizontalBox]}>

                                                        <Text style={[

                                                            font.semibold,

                                                            font.sizeRegular,

                                                            color.darkgrayColor,

                                                        ]}>{this.state.details.total_seats}</Text>



                                                        <TouchableOpacity onPress={() => {

                                                            this.setState({

                                                                enableGuestNumberModification: !this.state.enableGuestNumberModification

                                                            })

                                                        }}>

                                                            <IconPen

                                                                name='ios-pencil'

                                                                color={color.myOrangeColor.color}

                                                                size={20} />

                                                        </TouchableOpacity>

                                                    </View>

                                            }

                                        </View>
                                }

                            </View>



                            <View style={[box.centerBox, /* box.horizontalBox, */ { /* backgroundColor:'blue', */paddingTop: 0, paddingBottom: 5 }]}>

                                <View style={{

                                    // width: 45,

                                    flexWrap: 'wrap'

                                }}>

                                    <Text style={[



                                        font.sizeRegular,

                                        font.regular,

                                        color.grayColor,



                                    ]}>Booking Start Date</Text>



                                    <View style={[box.horizontalBox]}>

                                        <Text style={[

                                            font.semibold,

                                            font.sizeRegular,

                                            color.darkgrayColor,

                                        ]}>{this.state.modifiedStartDate != null ? moment(this.state.modifiedStartDate).format('DD MMM YYYY') : moment(this.state.details.start_date).format('DD MMM YYYY')}</Text>

                                        <TouchableOpacity onPress={() => {

                                            this.setState({

                                                enableStartDateModify: true

                                            })

                                        }}>

                                            <IconPen

                                                name='ios-pencil'

                                                color={color.myOrangeColor.color}

                                                size={20}

                                            />

                                        </TouchableOpacity>

                                        {



                                            this.state.enableStartDateModify &&

                                            <DatePicker

                                                modal

                                                minuteInterval={30}

                                                open={this.state.enableStartDateModify}

                                                date={
                                                    new Date(moment(this.state.modifiedStartDate))
                                                }//this.checkBookingOpen() ? new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 1) : new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 2)}

                                                mode={'date'}

                                                minimumDate={this.checkBookingOpen() ? new Date(moment(new Date()).add(1, 'day')) : new Date(moment(new Date()).add(2, 'days'))}

                                                onConfirm={(date) => {

                                                    this.onStartDateSelect({ type: 'set' }, date)
                                                    // console.log('date: ', date)



                                                }}

                                                onCancel={() => {

                                                    this.setState({

                                                        enableStartDateModify: false

                                                    })

                                                }}

                                            />





                                        }

                                    </View>



                                </View>



                                <View>

                                    <Text>Plan: {this.state.planDurationName}</Text>

                                    <TextInput

                                        placeholder={'Enter Number of ' + this.state.modifiedPlantype}

                                        defaultValue={this.state.daysAfterModify}

                                        selectionColor={color.myOrangeColor.color}

                                        onChangeText={(value) => {

                                            console.log('plan type: ', this.state.modifiedPlantype);

                                            if (this.state.planDurationName == 'Daily Plan' && Number(value) < 14) {

                                                this.setState({

                                                    //range: value,
                                                    duration: Number(this.state.range) * Number(value)

                                                })

                                                this.onDayPress(this.state.selectedResourcePlan != null ? this.state.selectedResourcePlan : this.state.details.booking_plan_details)

                                            }

                                            else if (this.state.planDurationName == 'Hourly Plan' && Number(value) <= 7) {

                                                this.setState({

                                                    duration: Number(this.state.range) * Number(value)

                                                })

                                                this.onDayPress(this.state.selectedResourcePlan != null ? this.state.selectedResourcePlan : this.state.details.booking_plan_details)

                                            } else if (this.state.planDurationName == 'Monthly Plan' && Number(value) <= 2) {

                                                this.setState({

                                                    duration: Number(this.state.range) * Number(value),

                                                })

                                                this.onDayPress(this.state.selectedResourcePlan != null ? this.state.selectedResourcePlan : this.state.details.booking_plan_details)

                                            } else {
                                                CommonHelpers.showFlashMsg("Maximum Plan duration exceeded", 'danger')
                                                /* this.setState({

                                                    duration: Number(this.state.range) * Number(value),

                                                })

                                                this.onDayPress(this.state.selectedResourcePlan != null ? this.state.selectedResourcePlan:this.state.details.booking_plan_details) */

                                            }
                                        }}



                                    />



                                </View>



                                <View style={{

                                    // width: '45%',

                                    flexWrap: 'wrap'

                                }}>

                                    <Text style={[



                                        font.sizeRegular,

                                        font.regular,

                                        color.grayColor,



                                    ]}>Booking End Date</Text>

                                    <View style={[box.horizontalBox]}>

                                        <Text style={[

                                            font.semibold,

                                            font.sizeRegular,

                                            color.darkgrayColor,

                                        ]}>{

                                                moment(this.state.modifiedEndDate).format('DD MMM YYYY')



                                            }

                                        </Text>

                                    </View>



                                </View>



                            </View>

                            {



                                this.state.planDurationName == 'Hourly Plan' ?



                                    <View height={110} style={[box.centerBox, { alignContent: 'flex-start', paddingTop: 10, paddingBottom: 5, marginBottom: '1%' }]}>

                                        <Text style={[font.semibold,

                                        font.sizeExtraLarge,

                                        color.grayColor, { marginBottom: 10 }]}>Select Time</Text>



                                        {
                                            <View height={50} style={[box.horizontalBox, {
                                                marginBottom: 10
                                            }]}>

                                                <TouchableOpacity
                                                    onPress={() => {
                                                        console.log(this.state.showStartTimer)
                                                        this.setState({
                                                            showStartTimer: true,
                                                            //currentIndex: index,
                                                        })
                                                    }}
                                                    style={[box.horizontalBox, button.defaultRadius, {
                                                        width: Dimensions.get('screen').width * 0.3,
                                                        borderColor: color.grayColor.color,
                                                        justifyContent: 'center'
                                                    }]}>
                                                    <Text style={[font.regular,
                                                    font.sizeRegular,
                                                    color.lightBlack, {
                                                        textAlign: 'center'
                                                    }]}>{this.state.modifiedStartDate != '' ?
                                                        moment(this.state.modifiedStartDate).format('hh:mm A') : 'Select Start Time'}</Text>
                                                </TouchableOpacity>

                                                <TouchableOpacity
                                                    disabled={true}
                                                    style={[box.horizontalBox, button.defaultRadius, {
                                                        width: Dimensions.get('screen').width * 0.3,
                                                        borderColor: color.grayColor.color,
                                                        justifyContent: 'center'
                                                    }]}>
                                                    <Text style={[font.regular,
                                                    font.sizeRegular,
                                                    color.lightBlack,
                                                    {
                                                        textAlign: 'center'
                                                    }]}>{this.state.modifiedEndDate != '' ?
                                                        moment(this.state.modifiedEndDate).format('hh:mm A') : ''}</Text>

                                                </TouchableOpacity>
                                            </View>
                                        }

                                        {

                                            this.state.showStartTimer &&
                                            <DatePicker
                                                modal
                                                minuteInterval={30}
                                                open={this.state.showStartTimer}
                                                date={this.state.modifiedStartDate != '' ? new Date(moment(this.state.modifiedStartDate)) : new Date()}
                                                mode={'time'}
                                                is24hourSource={false}
                                                //minimumDate = {this.state.startDate != '' ? new Date(moment(this.state.startDate)):moment(new Date()).add(1, 'day')}
                                                onConfirm={(date) => {
                                                    this.onStartTimeSelect({ type: "set" }, date);
                                                }}
                                                onCancel={() => {
                                                    this.setState({
                                                        showStartTimer: false
                                                    })
                                                }}
                                            />
                                        }



                                    </View> :



                                    <View style={[box.centerBox, box.horizontalBox, { /* backgroundColor:'red', */ paddingTop: 5, paddingBottom: 5 }]}>

                                        <View style={{

                                            flex: 1,

                                            // width: '45%',

                                            flexWrap: 'wrap',



                                        }}>

                                            <Text style={[



                                                font.sizeRegular,

                                                font.sizeVeryRegular,

                                                color.grayColor

                                            ]}>Booking Start Time</Text>

                                            <Text style={[

                                                font.semibold,

                                                font.sizeRegular,

                                                color.myOrangeColor, { flexWrap: 'wrap', }

                                            ]}>{moment(this.state.modifiedStartDate).format('hh:mm A')}</Text>

                                        </View>

                                        <View style={{

                                            flex: 1,

                                            //width: '45%',

                                            alignItems: 'flex-end'



                                        }}>

                                            <Text style={[



                                                font.sizeRegular,

                                                font.sizeVeryRegular,

                                                color.grayColor

                                            ]}>Booking End Time</Text>

                                            <Text style={[

                                                font.semibold,

                                                font.sizeRegular,

                                                color.myOrangeColor,/* { width:  Dimensions.get('window').width*0.5, flexWrap: 'wrap',} */

                                            ]}>{moment(this.state.modifiedEndDate).format('hh:mm A')}</Text>

                                        </View>

                                    </View>

                            }







                            <View style={[box.centerBox]}>

                                <Text style={[



                                    font.sizeRegular,

                                    font.bold,

                                    color.darkgrayColor,



                                ]}>Request Description</Text>

                                <TextInput
                                    placeholder='Enter modification description'
                                    selectionColor={color.myOrangeColor}
                                    multiline={true}
                                    numberOfLines={8}
                                    defaultValue={this.state.modificationDescription}
                                    style={[renderItem.inputBox, { height: 100 }]}
                                    onChangeText={(value) => {
                                        this.setState({
                                            modificationDescription: value
                                        })
                                    }}
                                />
                            </View>

                        </KeyboardAwareScrollView>

                        <View style={{ flexDirection: "row", height: 80 }}>
                            <TouchableOpacity style={[color.lightGrayBackColor, { bottom: 0, flex: 1, marginTop: "auto", height: "100%", justifyContent: "center", borderRightWidth: 1, borderRightColor: "white" }]}
                                onPress={async () => {
                                    this.setState({
                                        modifyModal: false,
                                    })
                                }}>
                                <Text style={[font.bold, font.sizeLarge, color.blackColor, { textAlign: "center" }]}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={{ bottom: 0, flex: 1, marginTop: "auto", backgroundColor: "orange", height: "100%", justifyContent: "center" }}
                                onPress={() => {
                                    if (this.state.modificationDescription.trim() != '') {
                                        this.handleModification();
                                    }else{
                                        CommonHelpers.showFlashMsg('Enter the modification description', 'danger');
                                    }
                                }}>
                                <Text style={[font.bold, font.sizeLarge, color.textWhiteColor, { textAlign: "center" }]}>Send</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>}

                {this.state.cancelModal && <Modal position={"center"} swipeToClose={false}

                    onClosed={() => { this.setState({ cancelModal: false }) }}

                    style={{

                        //justifyContent: 'space-around',

                        //alignItems: 'space-around',

                        //padding: 20,

                        height: Dimensions.get('screen').height * 0.5,

                        width: Dimensions.get('screen').width * 0.9,

                    }} isOpen={this.state.cancelModal}>

                    <View height={"100%"}>

                        <KeyboardAwareScrollView>

                            <View style={[/* box.centerBox, */ color.inputBackground, { alignItems: "flex-start", padding: "4%" }]}>

                                <Text style={[font.semibold, font.sizeMedium, color.blackColor,]}>Confirmation</Text>

                            </View>



                            <View style={[box.centerBox]}>

                                <Text style={[font.semibold, font.sizeMedium, color.blackColor, { flex: 1 }]}>Do you wish to cancel the booking?</Text>

                                <View style={{ flex: 1 }}>

                                    <Text style={[font.sizeVeryRegular, font.semibold, color.myOrangeColor,]}>Cancellation Policy</Text>

                                    <Text style={[font.sizeSmall, font.semibold, color.blackColor,]}>Within 24 Hrs of booking date and time- {'\u20B9'}{Intl.NumberFormat('en-IN').format(0)} Refund</Text>

                                    <Text style={[font.sizeSmall, font.semibold, color.blackColor,]}>Within 24-48Hrs - 50% Refund</Text>

                                    <Text style={[font.sizeSmall, font.semibold, color.blackColor,]}>Above 48Hrs - 100% Refund</Text>

                                </View>



                                <View>

                                    <TextInput

                                        style={renderItem.inputBox}

                                        placeholder='Reason for Cancellation'

                                        placeholderTextColor={color.myOrangeColor.color}

                                        selectionColor={color.myOrangeColor.color}

                                        value={this.state.cancellationReason}

                                        onChangeText={(value) => {

                                            this.setState({

                                                cancellationReason: value,

                                            })





                                        }}

                                    />

                                    <Text style={[font.sizeVeryRegular, font.semibold, color.myOrangeColor, { textDecorationLine: 'underline', }]}>{this.state.policydocName}</Text>

                                    {/* <Text style = {[font.sizeSmall, font.semibold, color.darkgrayColor,]}>.docx will be downloaded.</Text> */}

                                    <View style={{

                                        flex: 1,

                                        justifyContent: 'flex-start',

                                        alignItems: 'flex-start',

                                        marginTop: 25,

                                    }}>

                                        <Pdf

                                            trustAllCerts={false}

                                            fitPolicy={2}

                                            source={{ uri: this.state.policyDocPath }}

                                            onLoadComplete={(numberOfPages, filePath) => {

                                                console.log(`Number of pages: ${numberOfPages}`);

                                            }}

                                            onPageChanged={(page, numberOfPages) => {

                                                console.log(`Current page: ${page}`);

                                            }}

                                            onError={(error) => {

                                                console.log(error);

                                            }}

                                            onPressLink={(uri) => {

                                                console.log(`Link pressed: ${uri}`);

                                            }}

                                            style={{

                                                flex: 1,

                                                width: Dimensions.get('window').width * 0.8,

                                                height: Dimensions.get('window').width,

                                            }} />

                                    </View>



                                </View>



                            </View>

                        </KeyboardAwareScrollView>





                        <View style={{/* flex: 1, */ flexDirection: "row", height: 80 }}>

                            <TouchableOpacity style={[color.lightGrayBackColor, { bottom: 0, flex: 1, marginTop: "auto", height: "100%", justifyContent: "center", borderRightWidth: 1, borderRightColor: "white" }]}

                                onPress={async () => {

                                    this.setState({

                                        cancelModal: false,

                                    })

                                }}>

                                <Text style={[font.bold, font.sizeLarge, color.blackColor, { textAlign: "center" }]}>Not Now</Text>

                            </TouchableOpacity>





                            <TouchableOpacity style={{ bottom: 0, flex: 1, marginTop: "auto", backgroundColor: "orange", height: "100%", justifyContent: "center" }}

                                onPress={async () => {

                                    this.handleCancel();

                                }}>

                                <Text style={[font.bold, font.sizeLarge, color.textWhiteColor, { textAlign: "center" }]}>Yes, Cancel</Text>

                            </TouchableOpacity>

                        </View>
                    </View>
                </Modal>}

                {
                    this.state.openComments && <Comments
                    navigation={this.props.navigation}
                    //rating = {Number(this.state.rating)}
                    showRatings= {true}

                        closing={() => { this.onFilterClosed() }}
                    />
                }
            </Drawer>


        );
    }
}