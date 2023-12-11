import React, { Component } from 'react';
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    ToastAndroid,
    LogBox,
    BackHandler,
    TextInput,
    Image,
    Dimensions,
    Platform,
    ActionSheetIOS,
    Switch,
} from 'react-native';

import color from '../../Styles/color';
import { MultiPickerMaterialDialog } from 'react-native-material-dialog';

import font from "../../Styles/font";
import { StarRatingComponent } from '../ReusableComponents/StarRatingComponent';
import { Calendar } from 'react-native-calendars';
import moment from 'moment';
import box from '../../Styles/box';
import renderItem from "../../Styles/renderItem";
import button from '../../Styles/button';
import { Picker } from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/FontAwesome';
import CommonHelpers from '../../Utils/CommonHelpers';
import Session from '../../config/Session';
import DatePicker from 'react-native-date-picker'
import DateTimePicker from '@react-native-community/datetimepicker';
import LogoHeader from '../ReusableComponents/LogoHeader';
import { MemberDirectBookingAPI, checkTimeAvailabilityAPI, login_check } from '../../Rest/userAPI';
import Spinner from '../../Utils/Spinner';
import image from '../../Styles/image';
import Drawer from "react-native-drawer";
import Sidemenu from "../../Navigation/Sidemenu";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { AWS_URL } from '../../config/RestAPI';



export default class BookingMeetingSpaces extends Component {


    constructor() {
        super();
        this.state = {
            role_id: null,
            isStartDatePicked: false,
            isEndDatePicked: false,
            isTimePicked: false,
            showStartTimer: false,
            showEndTimer: false,

            weekends: [],

            startDate: '',
            endDate: '',
            startTime: '',
            endTime: '',
            valid_start_at: '',
            valid_end_at: '',

            totalDays: 0,
            range: 0,
            duration: 1,
            rangeType: '',
            planName: '',
            currentDay: '',

            seats: 1,

            selectedVAS: [],
            selectedVASIndex: 0,
            selectedVASList: [], //for API
            VASTotalCost: 0,

            totalVASList: [],
            APISelectedVAS: [], // used in this page.
            iosVASList: [],

            CGST: 0,
            SGST: 0,

            spinner: false,
            access_period: null,
            access_period_unit_id: null,
            data: {},
            API_DATA: {},
            guests: 0,
            property_timings: [],
            property_name: '',
            booking_dates: [],
            total_booking_days: [],
            currentIndex: -1,
            enableInvite: false,
            enableRSVP: false,
            addons: [],
            iAddons: [],
            selectedAddons: [],
            addonselect: null,
            showPicker: false,
            amenityValue: '',
            slotAvailable: false,
            isLogin: false,

        }
        //this.noOfSeats = React.createRef();

    }



    componentDidMount = async () => {
        //console.log(await Session.getUserToken());
        LogBox.ignoreLogs(['VirtualizedLists should never be nested']);
        this.backHandler = BackHandler.addEventListener(
            "hardwareBackPress",
            this.goBack
        );

        login_check().then(result => {
            console.log("login check", result.message, result.status);
            this.setState({
                isLogin: result.status,
            })

        }).catch(error => {
            console.log(error)
        })

        const sessionData = JSON.parse(await Session.getMeetingSpacesData());
        console.log(sessionData)

        if (sessionData == null) {
            const API_DATA = this.props.route.params
            console.log('data from API check', API_DATA.API_DATA);

            this.setState({
                weekends: API_DATA.property_timings != null ? CommonHelpers.offDays(API_DATA.property_timings) : [],
                spinner: true,
                access_period_unit_id: Number(API_DATA.item.access_period_unit_id),
                access_period: Number(API_DATA.item.access_period),
                data: API_DATA.item,
                API_DATA: API_DATA,
                property_timings: API_DATA.property_timings,
                property_name: this.props.route.params.property_name,
                addons: this.props.route.params.addons != null ? this.props.route.params.addons : [],
            }, () => {
                //.log(this.state.data);
                this.setPlan();
                console.log('addons', this.state.addons);

                this.markSundays({ dateString: moment(new Date()).format('YYYY-MM-DD') });
                let iAddons = []
                this.state.addons.forEach((amenity, index) => {
                    iAddons.push(amenity.amenity_name);
                })
                this.setState({
                    iAddons: iAddons,
                })
            })


            if (API_DATA.item.start_at != null && API_DATA.item.end_at != null) {
                this.setState({
                    valid_start_at: API_DATA.item.start_at,
                    valid_end_at: API_DATA.item.end_at,
                })
            }

            this.setState({

                CGST: (((this.baseCost(Number(API_DATA.item.resource_plan != null ? API_DATA.item.resource_plan.price : 0)) + Number(this.state.VASTotalCost)) * 9) / 100),
                SGST: (((this.baseCost(Number(API_DATA.item.resource_plan != null ? API_DATA.item.resource_plan.price : 0)) + Number(this.state.VASTotalCost)) * 9) / 100),
                //spinner: true
            })

            let user_details = await Session.getUserDetails();
            user_details = JSON.parse(user_details);
            const role_id = user_details.role_id;
            this.setState({
                role_id: role_id,
            }, () => {
                //console.log("the user has role_id : ", role_id);
            })

            this.state.API_DATA.property_amenities != null ?

                this._createTotalVASList(this.state.API_DATA.property_amenities) : null;

        }
        else {
            await Session.setMeetingSpacesData('null');
            const API_DATA = sessionData;//JSON.parse(await Session.getMeetingSpacesData());
            console.log('data from API check', API_DATA.API_DATA);

            this.setState({
                weekends: API_DATA.property_timings != null ? CommonHelpers.offDays(API_DATA.property_timings) : [],
                spinner: true,
                access_period_unit_id: Number(API_DATA.item.access_period_unit_id),
                access_period: Number(API_DATA.item.access_period),
                data: API_DATA.item,
                API_DATA: API_DATA,
                property_timings: API_DATA.property_timings,
                property_name: API_DATA.property_name,
                addons: API_DATA.addons != null ? API_DATA.addons : [],
            }, () => {
                console.log(this.state.data);
                this.setPlan();
                console.log('addons', this.state.addons);

                this.markSundays({ dateString: moment(new Date()).format('YYYY-MM-DD') });
                let iAddons = []
                this.state.addons.forEach((amenity, index) => {
                    iAddons.push(amenity.amenity_name);
                })
                this.setState({
                    iAddons: iAddons,
                })
            })


            if (API_DATA.item.start_at != null && API_DATA.item.end_at != null) {
                this.setState({
                    valid_start_at: API_DATA.item.start_at,
                    valid_end_at: API_DATA.item.end_at,
                })
            }

            this.setState({

                CGST: (((this.baseCost(Number(API_DATA.item.resource_plan != null ? API_DATA.item.resource_plan.price : 0)) + Number(this.state.VASTotalCost)) * 9) / 100),
                SGST: (((this.baseCost(Number(API_DATA.item.resource_plan != null ? API_DATA.item.resource_plan.price : 0)) + Number(this.state.VASTotalCost)) * 9) / 100),
                //spinner: true
            })

            let user_details = await Session.getUserDetails();
            user_details = JSON.parse(user_details);
            const role_id = user_details.role_id;
            this.setState({
                role_id: role_id,
            }, () => {
                //console.log("the user has role_id : ", role_id);
            })

            this.state.API_DATA.property_amenities != null ?

                this._createTotalVASList(this.state.API_DATA.property_amenities) : null;
        }




        //console.log(this.props.route.params);




        //this.props.modify ? this._handleAutoPopulate() : null;
    }

    setPlan = () => {
        console.log('access peroid: ', this.state.access_period, 'access period unit id: ', this.state.access_period_unit_id);

        if (this.state.access_period_unit_id == 1) {
            console.log("1 month plan", this.state.access_period_unit_id);
            this.setState({
                duration: Number(this.state.access_period),
                //range: Number(this.state.access_period),
                rangeType: 'months',
                planName: "Monthly Plan",
                //spinner: false
            })

        }
        else if (this.state.access_period_unit_id == 2) {
            //console.log("Daily plan time");
            this.setState({
                duration: Number(this.state.access_period),
                //range: Number(this.state.access_period),
                rangeType: 'days',
                planName: "Daily Plan",
                //spinner: false
            })


        }
        else if (this.state.access_period_unit_id == 3) {
            //console.log("Hourly plan");
            this.setState({
                duration: Number(this.state.access_period),
                //range: Number(this.state.access_period),
                rangeType: 'hours',
                planName: "Hourly Plan",
                // spinner: false
            })


        }
        else if (this.state.access_period_unit_id == 5) {
            //console.log("Weekly plan");
            this.setState({
                duration: Number(this.state.access_period),
                //range: Number(this.state.access_period),
                rangeType: 'weeks',
                planName: "Weekly Plan",
                // spinner: false
            })


        }
        else if (this.state.access_period_unit_id == 6) {
            //console.log("Yearly plan");
            this.setState({
                duration: Number(this.state.access_period),
                // range: Number(this.state.access_period),
                rangeType: 'years',
                planName: "Yearly Plan",
                //spinner: false
            })
        }
    }

    _createTotalVASList = (amenityList) => {
        ////console.log(amenityList);
        var temp_array = [];
        var ioslist = [];
        amenityList.forEach(amenity => {

            if (amenity.pa_is_paid == 1) {
                temp_array.push(amenity);
                ioslist.push(amenity.amenity_name);
                //console.log(amenity);
            }

            this.setState({
                totalVASList: temp_array,
                selectedVAS: temp_array[0],
                iosVASList: ioslist,
            });
        });
    }

      componentWillUnmount() {
        if (this.backHandler)
            this.backHandler.remove();
    }

    goBack = () => {
        this.props.navigation.goBack();
        return true;
    }

    markSundays = (startday) => {
        this.setState({
            spinner: true
        })
        let Sundays = {}
        let days = Number(this.state.range) * 365 + 7;

        if (this.state.weekends.length > 0) {
            for (var i = 0; i <= days; i = i + 7) {

                this.state.weekends.forEach(day => {
                    var date = moment(startday.dateString).day(day + i).format("YYYY-MM-DD");
                    Sundays[date] = {
                        customStyles: styles.sundayStyle
                    };
                })

            }

        }


        this.setState({
            sundayDates: Sundays,
            markedDates: Sundays,
            spinner: false //this.state.sundayDates,
        }, () => {
            ////console.log(this.state.sundayDates);
        })

        // //console.log("this sunday", moment(day.dateString).day(0).format("YYYY-MM-DD"));
        ////console.log("next sunday", moment(day.dateString).day(0 + 14).format("DD MM YYYY"));

    }

    calculateEndDate = (range, startDate) => {
        console.log(range, startDate)

        let endDate = moment(startDate).add(Number(this.state.API_DATA.API_DATA.end_at.split(':')[0])-Number(this.state.API_DATA.API_DATA.start_at.split(':')[0]), 'hours');
        let booking_dates = [];
        let total_booking_dates = [];
        let dateObj = {
            date: moment(endDate).format('DD MMM YYYY'),
            dateobj: moment(endDate),
            startTime: '',
            startEmpty: true,
            endTime: '',
            endEmpty: true,
            offDay: this.state.weekends.indexOf(new Date(endDate).getDay()) < 0 ? 0 : 1,
            day: new Date(endDate).getDay(),
            disable: true
        }
        total_booking_dates.push(dateObj);

        dateObj.offDay == 0 ? booking_dates.push(dateObj) : null;

        if (this.state.weekends.length == 0) {
            // endDate = endDate.add(range, 'days');
            while (range > 0) {
                endDate = endDate.add(1, 'day');
                console.log(endDate);

                range = range - 1;

                let dateObj = {
                    date: moment(endDate).format('DD MMM YYYY'),
                    dateobj: moment(endDate),
                    startTime: '',
                    startEmpty: true,
                    endTime: '',
                    endEmpty: true,
                    offDay: 0,
                    day: new Date(endDate).getDay(),
                    disable: true
                }
                booking_dates.push(dateObj);
                total_booking_dates.push(dateObj);
                //console.log(this.state.weekends.indexOf(new Date(endDate).getDay()), range);

                console.log(moment(endDate).format('DD-MM-YYYY'), booking_dates);
            }

            this.setState({
                booking_dates: booking_dates,
                total_booking_days: total_booking_dates,

            })
        }
        else if (this.state.weekends.indexOf(new Date(startDate).getDay()) >= 0) {
            range = range + 1;
            while (range > 0) {
                endDate = endDate.add(1, 'day');
                console.log(endDate);
                let dateObj = {
                    date: moment(endDate).format('DD MMM YYYY'),
                    dateobj: moment(endDate),
                    startTime: '',
                    startEmpty: true,
                    endTime: '',
                    endEmpty: true,
                    offDay: this.state.weekends.indexOf(new Date(endDate).getDay()) < 0 ? 0 : 1,
                    day: new Date(endDate).getDay(),
                    disable: true

                }
                total_booking_dates.push(dateObj);
                dateObj.offDay == 0 ? booking_dates.push(dateObj) : null;
                //booking_dates.push(dateObj);
                if (this.state.weekends.indexOf(new Date(endDate).getDay()) < 0) {
                    range = range - 1;


                    //console.log(this.state.weekends.indexOf(new Date(endDate).getDay()), range);
                }
                console.log(moment(endDate).format('DD-MM-YYYY'), booking_dates);
            }
            this.setState({
                booking_dates: booking_dates,
                total_booking_days: total_booking_dates
            })
        }
        else {
            while (range > 0) {
                endDate = endDate.add(1, 'day');
                console.log(endDate);
                let dateObj = {
                    date: moment(endDate).format('DD MMM YYYY'),
                    dateobj: moment(endDate),
                    startTime: '',
                    startEmpty: true,
                    endTime: '',
                    endEmpty: true,
                    offDay: this.state.weekends.indexOf(new Date(endDate).getDay()) < 0 ? 0 : 1,
                    day: new Date(endDate).getDay(),
                    disable: true
                }
                total_booking_dates.push(dateObj);
                dateObj.offDay == 0 ? booking_dates.push(dateObj) : null;
                //booking_dates.push(dateObj);
                if (this.state.weekends.indexOf(new Date(endDate).getDay()) < 0) {

                    range = range - 1;

                    console.log(this.state.weekends.indexOf(new Date(endDate).getDay()), range);
                }
                console.log(moment(endDate).format('DD-MM-YYYY'), booking_dates);
            }

            this.setState({
                booking_dates: booking_dates,
                total_booking_days: total_booking_dates
            })

        }
        return endDate;
    }

    onDayPress = (range) => {
        /*  this.setState({
             currentDay: day
         }) */
        let endDate, startDate;
        console.log(this.state.access_period_unit_id, range)

        if (this.state.access_period_unit_id == 1) {
            //console.log("1 month plan");
            startDate = moment(this.state.startDate);
            endDate = startDate.add(Number(range), 'months').subtract(1, 'days')
            this.setState({
                endDate: moment(endDate).format("YYYY-MM-DD"),
            })
        } else if (this.state.access_period_unit_id == 2) {

            startDate = moment(this.state.startDate);

            endDate = this.calculateEndDate(Number(range) - 1, startDate);//startDate.add(Number(this.state.range) - 1, "days");
            this.setState({
                endDate: moment(endDate).format("YYYY-MM-DD"),

                totalDays: Number(range)
            })


        }
        else if (this.state.access_period_unit_id == 3) {
            //console.log("hourly plan");
            startDate = moment(this.state.startDate);
            console.log(range);
            endDate = this.calculateEndDate(Number(range) - 1, startDate);
            this.setState({
                endDate: endDate,
                totalDays: this.state.range
            })

        }
        else if (this.state.access_period_unit_id == 5) {
            //console.log("hourly plan");
            startDate = moment(this.state.startDate);
            console.log(range);
            endDate = startDate.add(range, 'weeks').subtract(1, 'day');//this.calculateEndDate(Number(range) - 1, startDate);
            this.setState({
                endDate: endDate,
                totalDays: this.state.range
            })

        }




    }

    onTimeSelect = (/* event, time */) => {
        if (this.state.startDate != '') {
            var validstarttimearray = this.state.valid_start_at.split(":");
            var validendtimearray = this.state.valid_end_at.split(":");
            //console.log(validstarttimearray, validendtimearray);

            var starthourtime = Number(validstarttimearray[0]);
            var endhourtime = Number(validendtimearray[0]);
            
            let day = Number(moment(this.state.startDate).format("DD"));
            let month = Number(moment(this.state.startDate).format("MM")) - 1;
            let year = Number(moment(this.state.startDate).format("YYYY"));
            let hours = Number(validstarttimearray[0])//Number(moment(time).format("HH"));
            let min = Number(validstarttimearray[1]);//Number(moment(time).format("mm"));
            
            var startDate = new Date(year, month, day, hours, min)//,sec);
            
            this.setState({
                startTime: startDate,
                showTimer: false,
            }, () => {
                if (this.props.route.params.item.resource_plan.access_period_unit_id == 1) {
                    

                    let endDateTime = this.calculateEndDate((Number(this.state.range) * 30) - 1, moment(this.state.startTime));//moment(this.state.startTime).add(this.state.range, "months").subtract(1, 'day');

                    let endtime2 = moment(endDateTime).add(Number(this.state.valid_end_at.split(':')[0]) - Number(this.state.valid_start_at.split(':')[0]), "hours");
                    //console.log("endtime with 10 hours.", moment(endtime2).format("DD MM YYYY HH:mm"));
                    this.setState({
                        endTime: endtime2,
                        //endTime: endDateTime,
                        isTimePicked: true,
                    })
                }
                else if (this.props.route.params.item.resource_plan.access_period_unit_id == 2) {
                    //console.log("Daily plan time");
                    let endDateTime;
                    //let endDateTime = moment(this.state.startTime).add(24, "hours"); 
                    if (Number(this.state.range) == 1) {
                        //console.log("hours to add: ", Number(this.state.valid_end_at.split(':')[0])- Number(this.state.valid_start_at.split(':')[0]));
                        endDateTime = moment(this.state.startTime).add(Number(this.state.valid_end_at.split(':')[0]) - Number(this.state.valid_start_at.split(':')[0]), "hours");
                        this.setState({
                            endTime: endDateTime,
                            isTimePicked: true,
                        })
                    }
                    else {
                        endDateTime = this.calculateEndDate(Number(this.state.range) - 1, moment(this.state.startTime));//moment(this.state.startTime).add(Number(this.state.range)-1, 'days');
                        //console.log("hours to add: ", Number(this.state.valid_end_at.split(':')[0])- Number(this.state.valid_start_at.split(':')[0]));
                        let endDate2 = moment(endDateTime).add(Number(this.state.valid_end_at.split(':')[0]) - Number(this.state.valid_start_at.split(':')[0]), "hours");
                        this.setState({
                            endTime: endDate2,
                            isTimePicked: true,
                        })

                    }

                }
                else if (this.props.route.params.item.resource_plan.access_period_unit_id == 3) {
                    //console.log("Hourly plan");
                    let endDateTime = moment(this.state.startTime).add(1, "hour");
                    this.setState({
                        endTime: endDateTime,
                        isTimePicked: true,
                        // showTimer: true,
                    })

                }
                else if (this.props.route.params.item.resource_plan.access_period_unit_id == 5) {
                    //console.log("Weekly plan");
                    // let endDateTime = moment(this.state.startTime).add(6, "days");
                    let endDateTime = this.calculateEndDate(((Number(this.state.range) * 7) - 1), moment(this.state.startTime))//moment(this.state.startTime).add((Number(this.state.range)*7-1), "days");
                    let endDateTime2 = moment(endDateTime).add(Number(this.state.valid_end_at.split(':')[0]) - Number(this.state.valid_start_at.split(':')[0]), "hours");
                    this.setState({
                        endTime: endDateTime2,
                        //endTime: endDateTime,
                        isTimePicked: true,
                    })

                } else if (this.props.route.params.item.resource_plan.access_period_unit_id == 6) {
                    //console.log("1 year plan");
                    //let endDateTime = moment(this.state.startTime).add(29, "days"); // old

                    // let endDateTime = moment(this.state.startTime).add((Number(this.state.range) * 365)-1, "days");
                    let endDateTime = this.calculateEndDate((Number(this.state.range) * 365) - 1, moment(this.state.startTime))//moment(this.state.startTime).add(Number(this.state.range), "years").subtract(1, 'day');

                    let endtime2 = moment(endDateTime).add(Number(this.state.valid_end_at.split(':')[0]) - Number(this.state.valid_start_at.split(':')[0]), "hours");
                    //console.log("endtime with 10 hours.", moment(endtime2).format("DD MM YYYY HH:mm"));
                    this.setState({
                        endTime: endtime2,
                        //endTime: endDateTime,
                        isTimePicked: true,
                    })
                }
            });
            //console.log("Time picked is ", /* time, */ moment(this.state.endTime).local().format("HH:mm"));

            /*   } */

        }
        else {
            CommonHelpers.showFlashMsg("Please select Date first.", "danger");
        }



    }

    onTimeSelectOriginal = (event, time) => {
        if (this.state.startDate != '') {
            var validstarttimearray = this.state.valid_start_at.split(":");
            var validendtimearray = this.state.valid_end_at.split(":");
            console.log(validstarttimearray, validendtimearray);

            let day = Number(moment(this.state.startDate).format("DD"));
            let month = Number(moment(this.state.startDate).format("MM")) - 1;
            let year = Number(moment(this.state.startDate).format("YYYY"));
            let hours = Number(moment(time).format("HH"));
            let min = Number(moment(time).format("mm"));
            let sec = Number(moment(time).format('ss'));
            //console.log(day, month, year, hours, min, sec);
            var startDate = new Date(year, month, day, hours, min, sec);

            var starthourtime = Number(validstarttimearray[0]);
            var endhourtime = Number(validendtimearray[0]);

            let choosenTime = moment(startDate);
            let currentTime = moment(new Date());


            if ((Number(moment(time).format("HH")) < starthourtime) || (Number(moment(time).format("HH")) >= endhourtime)) {
                CommonHelpers.showFlashMsg("Please select a time from " + this.state.valid_start_at + " hours to " + this.state.valid_end_at + " hours", "danger");
                this.setState({
                    showTimer: false,
                })
            }
            else if (choosenTime.isBefore(currentTime)) {
                CommonHelpers.showFlashMsg("Choose a future time", 'danger');
                this.setState({
                    showTimer: false,
                })
            }
            else {

                //console.log("Date object: ", moment(startDate).format("DD-MM-YYYY, HH : mm"));
                //console.log(moment(startDate))

                this.setState({
                    startTime: startDate,
                    showTimer: false,
                }, () => {
                    if (this.props.route.params.item.resource_plan.access_period_unit_id == 3) {
                        //console.log("Hourly plan");
                        //let endDateTime = moment(this.state.startTime).add(1, "hour");
                        let endDateTime = moment(this.state.startTime).add(Number(this.state.range) == 0 ? 1 : Number(this.state.range), "hours");
                        let endHour = moment(endDateTime).format('HH');
                        let endMin = moment(endDateTime).format('mm');
                        //console.log("end hour", endHour, moment(endDateTime).format('DD MM YYYY, HH : mm'));

                        if (Number(endHour) > Number(validendtimearray[0]) /* && choosenTime.isSame(currentTime, 'date')  */) {
                            CommonHelpers.showFlashMsg('Exceeding the closing time.', 'danger');
                            this.setState({
                                showTimer: true,
                            })
                        } else if (Number(endHour) == Number(validendtimearray[0]) && Number(endMin) > Number(validendtimearray[1])  /* && choosenTime.isSame(currentTime, 'date') */) {
                            CommonHelpers.showFlashMsg('Exceeding the closing time.', 'danger');
                            this.setState({
                                showTimer: true,
                            })
                        }
                        else {
                            this.setState({
                                endTime: endDateTime,
                                isTimePicked: true,
                                //showTimer: !this.state.showTimer,
                            })
                        }

                    }
                });
                //console.log("Time picked is ", time, moment(this.state.endTime).local().format("HH:mm"));

            }

        }
        else {
            CommonHelpers.showFlashMsg("Please select Date first.", "danger");
        }



    }

    updateInputVal = (val, parameter) => {
        const state = this.state;
        state[parameter] = val;

    }

    makeDirectBooking = (bookingDetails) => {
        //console.log(JSON.stringify(bookingDetails.details_for_api_request[0]));

        MemberDirectBookingAPI(bookingDetails.details_for_api_request[0]).then(result => {
            //console.log(result.status);
            if (result.status) {
                CommonHelpers.showFlashMsg(result.message, "success");
                bookingDetails = { ...bookingDetails, direct_booking_details: result.dataArray }
                //console.log("booking details with direct booking info", bookingDetails);
                this.showSummaryPage(bookingDetails);
            }
            else {
                CommonHelpers.showFlashMsg(result.message, "danger");
                this.openPropertyDetail(this.props.route.params.item.resource_plan.property_id);
            }
        }).catch(error => {//console.log("member direct booking error", error)
        }
        )
    }

    showSummaryPage = (params) => {

        this.props.navigation.push('bookingdetails', {
            bookingDetails: params,
        });
    }

    openPropertyDetail = (id) => {

        this.props.navigation.navigate('detail', {
            property_id: id,
        });
    };

    VASCost = () => {
        var vas = 0;

        this.state.selectedAddons.forEach(item => {
            console.log('total cost of amenity',item.totalCost, item)
            if((item.totalCost != undefined || item.totalCost != null) &&  typeof item.totalCost == 'number')
            vas += item.totalCost;
        });

        this.setState({
            VASTotalCost: vas,
        }, () => {
            console.log('VAS cost: ', this.state.VASTotalCost);
            this.baseCost(this.baseCost(Number(this.state.data != null ? this.state.data.price : 0)));
            this.calGST();
        })

    }

    baseCost = (basePrice) => {
        console.log(basePrice);
        if (this.state.rangeType != 'hours')
            return Number(basePrice) * Number(this.state.range);
        else
            return Number(basePrice) * Number(this.getTotalHours());
    }

    calGST = () => {
        // console.log(this.baseCost(Number(this.state.data.resource_plan.price)), this.state.data.resource_plan != null ? this.state.data.resource_plan.price : 0)
        const GST = (((this.baseCost(Number(this.state.data.price)) + (this.state.VASTotalCost == 0 ? 0 : Number(this.state.VASTotalCost))) * 18) / 100);
        console.log('GST is ', GST)
        return Math.round(GST)
    }

    closeControlPanel = () => {
        this._drawer.close()
    };
    openControlPanel = () => {
        this._drawer.open()
    };


    /* Meeting Spaces functions */

    onStartDateSelect = (event, value) => {
        console.log('event, ', event, value);
        if (event.type == 'set') {
            let date = moment(value);
            const startTime = moment(new Date(
                date.get('year'),
                date.get('month'),
                date.get('date'),
                this.state.API_DATA.API_DATA.start_at.split(':')[0],
                this.state.API_DATA.API_DATA.start_at.split(':')[1],)
            );
            this.setState({
                startDate: startTime,//value,
                isStartDatePicked: false

            }, () => {
                Number(this.state.range) > 0 ? this.onDayPress(Number(this.state.range)) : null;
                this.baseCost(this.state.data.price);
                this.calGST();


            })
        }


    }

    onEndDateSelect = (event, value) => {
        console.log('event, ', event, moment(value).format('DD/MM/YYYY'));
        if (event.type == 'set') {
            let date = moment(value);
            const closeTime = moment(new Date(
                date.get('year'),
                date.get('month'),
                date.get('date'),
                this.state.API_DATA.API_DATA.end_at.split(':')[0],
                this.state.API_DATA.API_DATA.end_at.split(':')[1]
            )
            );
            this.setState({
                endDate: closeTime,
                isEndDatePicked: false,
                range: 0

            }, () => {
                const startDate = moment(this.state.startDate);
                const endDate = moment(value);
                let range = 0;
                let date = startDate;
                if (this.state.weekends.indexOf(new Date(startDate).getDay()) > 0) {
                    console.log('start day is holiday');
                    while (moment(date).format('DD/MM/yyyy') != moment(endDate).format('DD/MM/YYYY')) {
                        date = date.add(1, 'day');
                        if (this.state.weekends.indexOf(new Date(date).getDay()) < 0) {
                            range = range + 1;
                        }

                    }

                    if (this.state.rangeType == 'days' && range > 14) {
                        CommonHelpers.showFlashMsg('Booking duration cannot cannot exceed 14 days.');
                    }
                    else {
                        this.setState({
                            range: range
                        }, () => {
                            console.log('no of working days : ', this.state.range);
                            Number(this.state.range) > 0 ? this.onDayPress(Number(this.state.range)) : null;
                            this.baseCost(this.state.data.price);
                            this.calGST();
                        })

                    }


                }
                else {
                    while (moment(date).format('DD/MM/YYYY') != moment(endDate).format('DD/MM/YYYY')) {
                        date = date.add(1, 'day');
                        if (this.state.weekends.indexOf(new Date(date).getDay()) < 0) {
                            range = range + 1;
                        }

                    }

                    if (this.state.rangeType == 'days' && range > 14) {
                        CommonHelpers.showFlashMsg('Booking duration cannot cannot exceed 14 days.');
                    }
                    else {

                        this.setState({
                            range: range + 1
                        }, () => {
                            console.log('no of working days : ', this.state.range);
                            Number(this.state.range) > 0 ? this.onDayPress(Number(this.state.range)) : null;
                            this.baseCost(this.state.data.price);
                            this.calGST();
                        })
                    }

                }




                //const range = endDate.diff(startDate, 'days');



            })
        }


    }

    checkTimeAvailability = async (startDate, endDate) => {
        const user_data = await Session.getUserDetails(startDate, endDate);
        const parsedData = JSON.parse(user_data);
        const params = {
            "user_id": Number(await Session.getUserId()),
            "provider_id": this.state.API_DATA.provider_id,//471,//static
            "property_id": this.state.API_DATA.id,
            "resource_group_id": this.state.data.resource_group_id,
            "resource_id": this.state.data.resource_id,
            "resource_plan_id": this.state.data.id,
            "corporate_id": parsedData.corporate_id,
            "booking_type_id": Number(parsedData.role_id) == 5 ? 3 : 6,
            "period_quantity": this.state.range,
            "start_date": moment(startDate),
            "end_date": moment(endDate),
            "total_days": this.state.range,
            "no_of_people": 1,
            "total_seats": Number(this.state.guests),
            "total_price": this.baseCost(this.state.data.price),
            "cgst": this.calGST(),
            "sgst": this.calGST(),
            "amenities_price": 0,
            "is_invite_guest": 1,
            "is_rsvp": 1,
            "is_meeting_space": 1,
        }
        console.log('params', params);

        checkTimeAvailabilityAPI(params).then(result => {
            let booking_dates = this.state.booking_dates;
            console.log('time availability', result.dataArray);
            if (result.dataArray == false) {
                /*  this.setState({
                     slotAvailable: true
                 }) */
                booking_dates[this.state.currentIndex].endTime = endDate;
                booking_dates[this.state.currentIndex].endEmpty = false;
                (this.state.currentIndex + 1) < booking_dates.length ?
                    booking_dates[this.state.currentIndex + 1].disable = false : null;

                this.setState({
                    booking_dates: booking_dates,
                    showEndTimer: false
                }, () => {
                    this.baseCost(this.state.data.price);
                    this.calGST();
                })
            }
            else {
                /*  this.setState({
                     slotAvailable: false
                 }) */
                CommonHelpers.showFlashMsg('Time slot not available on this date.', 'danger');
                booking_dates[this.state.currentIndex].endTime = '';
                booking_dates[this.state.currentIndex].endEmpty = true;
                booking_dates[this.state.currentIndex].startTime = '';
                booking_dates[this.state.currentIndex].startEmpty = true;
                this.setState({
                    showEndTimer: false,
                    booking_dates: booking_dates
                })

            }
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
        // console.log('Closing time', moment(closeTime).format('DD MM YYYY HH: mm A'));
        //console.log(moment(date).isAfter(closeTime))
        if (moment(new Date()).isAfter(closeTime)) {
            //console.log('date is after close time. returning false')

            return false
        }
        else {
            //console.log('Date is before close time returning true')
            return true
        }
    }

    checkWeekendDate = (date)=>{
        while(this.state.weekends.indexOf(new Date(date).getDay()) >= 0){
            date = moment(date).add(1,'day');
        }
        return  new Date(date);
    }

    onStartTimeSelect = (event, value) => {
        console.log(moment(value).format('hh:mm A'),);
        let booking_dates = this.state.booking_dates;
        booking_dates[this.state.currentIndex].startEmpty = true;
        let time = moment(value);
        let date = moment(booking_dates[this.state.currentIndex].dateobj);
        const startTime = moment(new Date(
            date.get('year'),
            date.get('month'),
            date.get('date'),
            time.get('hour'),
            time.get('minute'),)
        );

        const accessPeriodTime = moment(new Date(
            date.get('year'),
            date.get('month'),
            date.get('date'),
            time.get('hour') + Number(this.state.access_period),
            time.get('minute'),)
        );

        const openTime = moment(new Date(
            date.get('year'),
            date.get('month'),
            date.get('date'),
            this.state.API_DATA.API_DATA.start_at.split(':')[0],
            this.state.API_DATA.API_DATA.start_at.split(':')[1])
        );

        const minTime = openTime.subtract(1, 'minute');

        const closeTime = moment(new Date(
            date.get('year'),
            date.get('month'),
            date.get('date'),
            this.state.API_DATA.API_DATA.end_at.split(':')[0],
            this.state.API_DATA.API_DATA.end_at.split(':')[1]+1)
        );

        console.log( moment(closeTime).format('DD/MM/YYYY, hh:mm A'));
            
        const maxTime = moment(new Date(
            date.get('year'),
            date.get('month'),
            date.get('date'),
            this.state.API_DATA.API_DATA.end_at.split(':')[0],
            this.state.API_DATA.API_DATA.end_at.split(':')[1])
        ).subtract(59, 'minutes');
        console.log('max time: ', moment(maxTime).format('DD/MM/YYYY,  hh:mm A'), 'close time: ', moment(closeTime).format('DD/MM/YYYY,  hh:mm A'));

        console.log(startTime, minTime, moment(openTime).format('hh : mm A'), moment(closeTime).format('hh:mm A'), moment(maxTime).format('hh : mm A'))

        if (startTime.isBefore(moment(new Date()))) {
            CommonHelpers.showFlashMsg('Please select a future time.', 'danger');
        }
        else {
            if (startTime.isBetween(minTime, maxTime) && accessPeriodTime.isBetween(minTime, closeTime)) {

                console.log('Access period: ', this.state.access_period);
                booking_dates[this.state.currentIndex].startTime = startTime;
                booking_dates[this.state.currentIndex].startEmpty = false;
                booking_dates[this.state.currentIndex].endTime != '' ? (
                    booking_dates[this.state.currentIndex].endTime = startTime.isBefore(moment(booking_dates[this.state.currentIndex].endTime)) ? booking_dates[this.state.currentIndex].endTime : accessPeriodTime,
                    booking_dates[this.state.currentIndex].endEmpty =  false
                ) : (
                    booking_dates[this.state.currentIndex].endTime =  accessPeriodTime,
                    booking_dates[this.state.currentIndex].endEmpty =  false 
                );

                this.setState({
                    booking_dates: booking_dates,
                    showStartTimer: false
                }, () => {
                    this.onEndTimeSelect({ type: "set" }, booking_dates[this.state.currentIndex].endTime);
                    this.baseCost(this.state.data.price);
                    this.calGST();
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
        let booking_dates = this.state.booking_dates;
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
            this.state.API_DATA.API_DATA.start_at.split(':')[0],
            this.state.API_DATA.API_DATA.start_at.split(':')[1])
        );

        const minTime = booking_dates[this.state.currentIndex].startTime != '' ? moment(booking_dates[this.state.currentIndex].startTime).add(59, 'minutes') : openTime.add(59, 'minutes');

        const closeTime = moment(new Date(
            date.get('year'),
            date.get('month'),
            date.get('date'),
            this.state.API_DATA.API_DATA.end_at.split(':')[0],
            this.state.API_DATA.API_DATA.end_at.split(':')[1])
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

    getTotalHours = () => {
        let totalHours = 0
        this.state.booking_dates.forEach((day, index) => {
            if (day.offDay == 0) {
                const startTime = day.startTime != '' ? moment(day.startTime) : 0;
                const endTime = day.endTime != '' ? moment(day.endTime) : 0;
               // console.log('in hours calculation: ', startTime, moment(startTime).format('DD MM YYYY hh:mm A'), endTime, moment(endTime).format('DD MM YYYY, hh:mm A'));
                const duration = startTime != 0 && endTime != 0 ? moment.duration(endTime.diff(startTime)) : 0;
                const hours = startTime != 0 && endTime != 0 ? duration.asHours() : 0;
                totalHours = totalHours + hours;
            }

        });
        return Math.ceil(totalHours);
    }

    validateFields = () => {
        let validate = true;

        if (this.state.startDate == '' || this.state.startDate == null) {
            CommonHelpers.showFlashMsg('Start Date cannot be empty', 'danger');
            validate = false;
        }
        else if (this.state.range == '' || this.state.range == 0 || this.state.range == null) {
            CommonHelpers.showFlashMsg('duration cannot be empty.', 'danger');
            validate = false;
        }
        else if (this.state.guests == 0 || this.state.guests == '' || this.state.guests == null) {
            CommonHelpers.showFlashMsg('The number of guests should atleast be 1.');
            validate = false;
        }
        if (this.state.rangeType == 'hours') {
            [...this.state.booking_dates].reverse().map((day, i) => {
                if (day.startTime == '' || day.startTime == null || day.endTime == '' || day.endTime == null) {
                    if (day.offDay == 0) {
                        CommonHelpers.showFlashMsg('Please enter the meeting duration for ' + day.date, 'danger');
                        validate = false;
                    }

                }

            })

        }
        if (this.state.selectedAddons.length > 0) {
            this.state.selectedAddons.map((amenity, index) => {
                if (amenity.totalCost == 0 || amenity.totalCost == '' || amenity.totalCost == null || amenity.totalCost == undefined) {
                    CommonHelpers.showFlashMsg('Please enter the value of the ' + amenity.amenity_name + ' required.', 'danger');
                    validate = false;
                }
            })

        }


        if (!validate) {
            return false;

        }
        else {
            return true;
        }


    }


    render() {

        const selectedAddons = this.state.addonselect;

        return (
            <Drawer
                ref={(ref) => this._drawer = ref}
                type="overlay"
                content={<Sidemenu navigation={this.props.navigation} close={() => this.closeControlPanel()} />}
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
                <KeyboardAwareScrollView /*  height={'90%'}  */ style={{/* backgroundColor: 'pink', */ marginBottom: 170 }}>
                    {/* Header */}
                    <LogoHeader
                        from='bookingmeetingspaces'
                        navigation={this.props.navigation}
                        title='Booking'
                        onBarsPress={() => {
                            this.openControlPanel()
                        }}
                    />

                    {/* Basic info section */}

                    <View height={110} style={[box.centerBox, { /* backgroundColor: 'pink', */ marginBottom: '1%' }]}>
                        <View style={[box.horizontalBox]}>
                            <Text style={
                                [
                                    font.regular,
                                    font.sizeExtraLarge,
                                    color.myOrangeColor,
                                ]}>{this.state.planName}</Text>
                            <Text style={
                                [
                                    font.regular,
                                    font.sizeExtraLarge,
                                    color.myOrangeColor,
                                ]}>{'\u20B9'}{this.state.data.price}/{this.state.data.unit}</Text>
                        </View>
                        <Text style={[font.bold, font.sizeExtraLarge, color.lightBlack]}>{this.state.data.plan_name}</Text>

                        <View style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between', /* marginTop :10 */
                        }}>

                            <Text style={[
                                font.regular,
                                font.sizeVeryRegular,
                                color.grayColor
                            ]}>{this.state.property_name.toUpperCase()}</Text>
                            <View style={{
                                flexDirection: 'row', //marginRight: 10
                            }}>
                                {

                                    this.state.property_timings != null && this.state.property_timings.map((day, index) => {
                                        return (
                                            <Text style={[
                                                font.regular,
                                                font.sizeVeryRegular,
                                                day.is_open == 1 ? color.myOrangeColor : color.grayColor,
                                                {
                                                    paddingLeft: 5
                                                }
                                            ]}>{CommonHelpers.getDay(day.day_code)}</Text>
                                        );

                                    })
                                }

                            </View>


                        </View>

                        <View style={{
                            flexDirection: 'row', justifyContent: 'space-between',
                            //marginTop: 10
                        }}>
                            <Text style={[
                                font.regular,
                                font.sizeSmall,
                                color.grayColor,

                            ]}>{this.state.API_DATA.API_DATA != null ? this.state.API_DATA.API_DATA.locality : null}, {' '}
                                {this.state.API_DATA.API_DATA != null ? this.state.API_DATA.API_DATA.city != null ? this.state.API_DATA.API_DATA.city.name : null : null}</Text>
                            <Text style={[
                                font.regular,
                                font.sizeSmall,
                                color.grayColor,

                            ]}>{this.state.API_DATA.API_DATA != null ? this.state.API_DATA.API_DATA.start_at + ' to ' + this.state.API_DATA.API_DATA.end_at : null}</Text>
                        </View>

                    </View>

                    {/* date section */}

                    <View height={this.state.rangeType == 'days' ? 215 : 165} style={[box.centerBox, {
                        //  backgroundColor: 'blue',
                        marginBottom: '1%'
                    }]}>
                        <View style={
                            [box.horizontalBox,
                            {
                                alignItems: 'center',
                                marginBottom: 10
                            }]}>
                            <Text style={
                                [font.semibold,
                                font.sizeLarge,
                                color.darkgrayColor,
                                {
                                    width: Dimensions.get('screen').width * 0.2
                                }]
                            }>{this.state.rangeType == 'days' ? 'Start Date' : 'Date'}</Text>
                            <View style={{ width: Dimensions.get('screen').width * 0.7, alignItems: 'flex-end' }}>
                                <TouchableOpacity onPress={() => {
                                    this.setState({
                                        isStartDatePicked: true
                                    })
                                }}
                                    style={[
                                        button.defaultRadius,
                                        box.horizontalBox, {

                                            width: Dimensions.get('screen').width * 0.7,
                                            justifyContent: 'flex-end',
                                            borderColor: color.grayColor.color,
                                            borderWidth: 0.5,



                                        }]}>
                                    <View style={[{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }]} >
                                        {
                                            this.state.startDate != '' ?

                                                <Text style={[font.regular, font.sizeLarge, font.lightBlack, { textAlign: 'left', }]}>{moment(this.state.startDate).format('DD-MM-YYYY')}</Text>
                                                : null}

                                        <Image source={require('../../Assets/images/mybookings.png')}
                                            style={[image.imageContain, image.userImage, { alignSelf: 'flex-end' }]} />

                                    </View>

                                </TouchableOpacity>
                            </View>

                        </View>

                        {
                            this.state.rangeType == 'days' ?
                                <View style={
                                    [box.horizontalBox,
                                    {
                                        alignItems: 'center',
                                        marginBottom: 10
                                    }]}>
                                    <Text style={
                                        [font.semibold,
                                        font.sizeLarge,
                                        color.darkgrayColor,
                                        {
                                            width: Dimensions.get('screen').width * 0.2
                                        }]
                                    }>End Date</Text>
                                    <View style={{ width: Dimensions.get('screen').width * 0.7, alignItems: 'flex-end' }}>
                                        <TouchableOpacity
                                            onPress={() => {
                                                this.setState({
                                                    isEndDatePicked: true
                                                })
                                            }}
                                            style={[
                                                button.defaultRadius,
                                                box.horizontalBox, {

                                                    width: Dimensions.get('screen').width * 0.7,
                                                    justifyContent: 'flex-end',
                                                    borderColor: color.grayColor.color,
                                                    borderWidth: 0.5,
                                                    //


                                                }]}>
                                            <View style={[{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }]}>
                                                {
                                                    this.state.endDate != '' ?

                                                        <Text style={[font.regular, font.sizeLarge, font.lightBlack, { flex: 1 }]}>{moment(this.state.endDate).format('DD-MM-YYYY')}</Text>
                                                        : null}

                                                <Image source={require('../../Assets/images/mybookings.png')}
                                                    style={[image.imageContain, image.userImage]} />

                                            </View>

                                        </TouchableOpacity>
                                    </View>

                                </View>

                                : null
                        }

                        <View style={[box.horizontalBox, { alignItems: 'center' }]}>

                            <Text style={[
                                font.semibold, font.sizeLarge, color.darkgrayColor, { width: Dimensions.get('screen').width * 0.2 }]}>{this.state.rangeType == 'months' ? 'Month(s)' : this.state.rangeType == 'weeks' ? 'week(s)' : 'Day(s)'}</Text>
                            <View style={[box.horizontalBox, {
                                width: Dimensions.get('screen').width * 0.7,
                            }]}>
                                <TextInput
                                    selectionColor={color.myOrangeColor.color}
                                    style={[renderItem.inputBox, button.defaultRadius, {
                                        width: Dimensions.get('screen').width * 0.2,
                                        borderBottomColor: color.grayColor.color,
                                        borderColor: color.grayColor.color, borderWidth: 0.5,
                                        borderBottomWidth: 0.5,
                                    }]}
                                    keyboardType={'number-pad'}
                                    defaultValue={this.state.range.toString()}

                                    onChangeText={(value) => {
                                        console.log('number entered', value)
                                        var valid = 0;
                                        switch (this.state.rangeType) {
                                            case 'days': if (Number(value) > 15) {
                                                CommonHelpers.showFlashMsg('Maximum days allowed - 14 Days')
                                            } else {
                                                valid = 1
                                            }
                                                break;
                                            case 'months': if (Number(value) > 3) {
                                                CommonHelpers.showFlashMsg('Maximum months allowed - 3 months')
                                            } else {
                                                valid = 1
                                            }
                                                break;
                                            case 'hours': if (Number(value) > 7) {
                                                CommonHelpers.showFlashMsg('Maximum days allowed - 7 days')
                                            } else {
                                                valid = 1
                                            }
                                                break;
                                            case 'weeks': if (Number(value) > 3) {
                                                CommonHelpers.showFlashMsg('Maximum weeks allowed - 3 weeks')
                                            } else {
                                                valid = 1
                                            }
                                                break;
                                        }

                                        if (valid == 1) {
                                            this.setState({
                                                range: value
                                            });
                                            console.log(this.state.startDate);
                                            this.state.startDate != '' ? this.onDayPress(value) : null;
                                            this.baseCost(this.state.data.price);
                                            this.calGST();

                                        }
                                        else {
                                            this.setState(
                                                {
                                                    range: 0
                                                }
                                            )
                                        }


                                    }}
                                />

                                <Text style={[
                                    font.semibold, font.sizeLarge, color.darkgrayColor]}>Guest(s)</Text>

                                <TextInput
                                    style={[renderItem.inputBox, button.defaultRadius, {
                                        width: Dimensions.get('screen').width * 0.2,
                                        borderBottomColor: color.grayColor.color,
                                        borderColor: color.grayColor.color, borderWidth: 0.5,
                                        borderBottomWidth: 0.5,
                                    }]}
                                    keyboardType={'number-pad'}
                                    value={this.state.guests.toString()}
                                    onChangeText={(value) => {
                                        if (Number(value) <= Number(this.state.data.capacity)) {
                                            this.setState({
                                                guests: value
                                            })

                                        }
                                        else {
                                            CommonHelpers.showFlashMsg('Exceeding the guest limit', 'danger');
                                        }

                                    }}
                                />

                            </View>





                        </View>

                        {
                            this.state.range > 0 && this.state.startDate != '' ?


                                <View style={
                                    [
                                        box.horizontalBox,
                                        {
                                            alignSelf: 'flex-end',
                                            //justifyContent:'flex-end',
                                            width: Dimensions.get('screen').width * 0.7,

                                        }]}>

                                    <Text style={[font.regular,
                                    font.sizeRegular, color.myOrangeColor, { flex: 1 }]}>{moment(this.state.startDate).format('DD MMM yy')} to {moment(this.state.endDate).format('DD MMM yy')}</Text>
                                    {

                                        this.state.total_booking_days.length != 0
                                        &&
                                        this.state.total_booking_days.slice(
                                            0, this.state.total_booking_days.length >= 7
                                            ? 7 :
                                            this.state.total_booking_days.length).map((day, index) => {
                                                return (
                                                    <Text style={[
                                                        font.regular,
                                                        font.sizeVeryRegular,
                                                        day.offDay == 0 ? color.myOrangeColor : color.grayColor,
                                                        {
                                                            paddingLeft: 5,
                                                            textAlign: 'right'
                                                        }
                                                    ]}>{CommonHelpers.getDay(day.day)}</Text>
                                                );

                                            })

                                    }



                                </View> : null
                        }

                    </View>

                    {/* Time Section only for hourly plan */}
                    {
                        this.state.rangeType == 'hours' && this.state.booking_dates.length != 0 ?


                            <View height={this.state.booking_dates.length == 1 ? 110 : this.state.range * 70 + 40} style={[box.centerBox, { /* backgroundColor: 'yellow', */ alignContent: 'flex-start', paddingTop: 10, paddingBottom: 5, marginBottom: '1%' }]}>
                                <Text style={[font.semibold,
                                font.sizeExtraLarge,
                                color.grayColor, { marginBottom: 10 }]}>Select Time</Text>

                                {
                                    this.state.booking_dates.length != 0 && this.state.booking_dates.map((day, index) => {


                                        if (day.offDay == 0) {

                                            return (
                                                <View height={50} style={[box.horizontalBox, {
                                                    marginBottom: 10
                                                }]}>
                                                    <Text style={
                                                        [
                                                            font.regular,
                                                            font.sizeRegular,
                                                            color.myOrangeColor
                                                        ]}>{day.date}</Text>

                                                    <TouchableOpacity disabled={index == 0 ? false : day.disable ? true : false}
                                                        onPress={() => {
                                                            console.log(this.state.showStartTimer)
                                                            this.setState({
                                                                showStartTimer: true,
                                                                currentIndex: index,

                                                            })
                                                        }}

                                                        style={[box.horizontalBox, button.defaultRadius, {
                                                            width: Dimensions.get('screen').width * 0.3,
                                                            borderColor: color.grayColor.color,
                                                            justifyContent: this.state.booking_dates[index].startTime == '' ? 'flex-end' : 'center'
                                                        }]}>
                                                        <Text style={[font.regular,
                                                        font.sizeRegular,
                                                        this.state.booking_dates[index].startTime == '' ? color.grayColor : color.lightBlack, {
                                                            textAlign: 'center'
                                                        }]}>{this.state.booking_dates[index].startTime != '' ?
                                                            moment(this.state.booking_dates[index].startTime).format('hh:mm A') : ''}</Text>
                                                        {
                                                            this.state.booking_dates[index].startTime == '' ? <Text style={[{ textAlign: 'right' }]}>AM</Text> : null
                                                        }
                                                    </TouchableOpacity>

                                                    <TouchableOpacity disabled={index == 0 ? false : day.disable ? true : false}
                                                        onPress={() => {
                                                            this.setState({
                                                                showEndTimer: true,
                                                                currentIndex: index,
                                                            })
                                                        }}

                                                        style={[box.horizontalBox, button.defaultRadius, {
                                                            width: Dimensions.get('screen').width * 0.3,
                                                            borderColor: color.grayColor.color,
                                                            justifyContent: this.state.booking_dates[index].endTime == '' ? 'flex-end' : 'center'
                                                        }]}>
                                                        <Text style={[font.regular,
                                                        font.sizeRegular,
                                                        this.state.booking_dates[index].endTime == '' ? color.grayColor : color.lightBlack,
                                                        {
                                                            textAlign: 'center'
                                                        }]}>{this.state.booking_dates[index].endTime != '' ?
                                                            moment(this.state.booking_dates[index].endTime).format('hh:mm A') : ''}</Text>
                                                        {
                                                            this.state.booking_dates[index].endTime == '' ? <Text style={[{ textAlign: 'right' }]}>PM</Text> : null
                                                        }
                                                    </TouchableOpacity>


                                                </View>
                                            );
                                        }
                                    })
                                }

                                <Text style={[
                                    font.regular,
                                    font.sizeRegular,
                                    color.myOrangeColor,
                                    {

                                        justifyContent: 'flex-end',
                                        textAlign: 'right'
                                    }
                                ]}>Total Hours: {this.getTotalHours()}</Text>

                            </View> : null
                    }

                    {/* invite and RSVP */}

                    <View height={70} style={[box.centerBox, { marginBottom: '1%' }]}>
                        <View style={[box.horizontalBox, {
                            marginBottom: 5,
                        }]}>
                            <Text style={[
                                font.semibold,
                                font.sizeLarge,
                                color.darkgrayColor,
                            ]}>Send invite to guests?</Text>
                            <Switch
                                trackColor={{ false: "#767577", true: "orange" }}
                                thumbColor={this.state.enableInvite ? "#fff" : "#f4f3f4"}
                                ios_backgroundColor="#3e3e3e"
                                onValueChange={value => {
                                    console.log(value)
                                    this.setState({
                                        enableInvite: value,
                                    })
                                }}
                                value={this.state.enableInvite}
                                style={{ marginRight: 10 }}
                            />

                        </View>

                        <View style={[box.horizontalBox]}>
                            <Text style={[
                                font.semibold,
                                font.sizeLarge,
                                color.darkgrayColor,
                            ]}>RSVP?</Text>
                            <Switch
                                trackColor={{ false: "#767577", true: "orange" }}
                                thumbColor={this.state.enableRSVP ? "#fff" : "#f4f3f4"}
                                ios_backgroundColor="#3e3e3e"
                                onValueChange={value => {
                                    console.log(value)
                                    this.setState({
                                        enableRSVP: value,
                                    })
                                }}
                                value={this.state.enableRSVP}
                                style={{ marginRight: 10 }}
                            />

                        </View>


                    </View>

                    {/* addons */}

                    {
                        this.state.addons.length == 0 ? null :


                            <View height={this.state.selectedAddons.length == 0 ? 80 : this.state.selectedAddons.length * 70 + 80} style={[box.centerBox]}>
                                <View style={[box.horizontalBox, { marginBottom: '1%' }]}>
                                    <View style={{ flexDirection: 'row', alignContent: 'center' }}>
                                        <Image source={require('../../Assets/images/BRHlogoorange.png')}
                                            style={[image.imageContain, image.userImage]} />
                                        <Text style={[
                                            font.semibold,
                                            font.sizeLarge,
                                            color.darkgrayColor, {
                                                paddingLeft: 10
                                            }
                                        ]}>Add Ons</Text>

                                    </View>




                                    <TouchableOpacity
                                        onPress={() => {


                                            this.setState({
                                                showPicker: true,
                                            })
                                        }}
                                        style={[button.defaultRadius, { borderColor: color.myOrangeColor.color, }]}>
                                        <Icon name='plus' size={10} color={color.myOrangeColor.color} />
                                    </TouchableOpacity>


                                    {
                                        this.state.showPicker &&

                                        <MultiPickerMaterialDialog
                                            title={'Select Add ons'}
                                            colorAccent={color.myOrangeColor.color}
                                            items={this.state.addons.map((row, index) => {
                                                return { value: index, label: row.amenity_name, amenity: row };
                                            })}
                                            visible={this.state.showPicker}
                                            selectedItems={this.state.selectedAddons.map((row, index) => {
                                                return { value: this.state.addons.indexOf(row), label: row.amenity_name, amenity: row };
                                            })}
                                            onCancel={() => this.setState({ showPicker: false })}
                                            onOk={result => {
                                                console.log(result)
                                                let selectedAddons = [];
                                                result.selectedItems.forEach((item, i) => {
                                                    console.log(selectedAddons.indexOf(item.label));
                                                    if (selectedAddons.indexOf(item.amenity) < 0) {
                                                        selectedAddons.push(item.amenity);
                                                        this.setState({ selectedAddons: selectedAddons },
                                                            () => {
                                                                console.log(this.state.selectedAddons);
                                                                this.VASCost()
                                                            });
                                                    }
                                                })
                                                this.setState({ showPicker: false });
                                                
                                            }}
                                        />
                                    }
                                </View>

                                {
                                    this.state.selectedAddons.length != 0 ?

                                        this.state.selectedAddons.map((amenity, index) => {
                                            return (
                                                <View style={[box.horizontalBox, { marginBottom: '1%', alignItems: 'center' }]}>
                                                    <View style={{
                                                        flexDirection: 'row',
                                                        /* leftPadding: 5, */
                                                        flex: 1,
                                                        /* width: Dimensions.get('screen').width *0.4, */
                                                        flexWrap: 'wrap',
                                                        // backgroundColor: 'red', 
                                                        padding: 5
                                                    }}>
                                                        <Image source={{ uri: AWS_URL + amenity.icon_path }} style={[image.imageContain, image.userImage, { marginRight: 4 }]} />
                                                        <Text style={[
                                                            font.regular,
                                                            font.sizeVeryRegular,
                                                            color.grayColor,

                                                        ]}>{amenity.amenity_name}</Text>
                                                    </View>

                                                    <View style={{
                                                        flex: 1,
                                                        padding: 5,
                                                        //   backgroundColor: 'pink',
                                                        alignItems: 'center'
                                                        /* width: Dimensions.get('screen').width *0.2 */
                                                    }}>
                                                        <Text style={[
                                                            font.regular,
                                                            font.sizeVeryRegular,
                                                            color.grayColor,
                                                        ]}>
                                                            @{'\u20B9'}{Intl.NumberFormat("en-IN").format(amenity.fee_per_unit)}/person
                                                        </Text>
                                                    </View>
                                                    <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1, /* width: Dimensions.get('screen').width *0.2, */ flexWrap: 'wrap' }}>
                                                        <Text style={[
                                                            font.regular,
                                                            font.sizeVeryRegular,
                                                            color.grayColor, { marginRight: 5 }

                                                        ]}>Guest</Text>

                                                        <TextInput
                                                            style={[renderItem.inputBox, button.defaultRadius, { borderColor: color.myOrangeColor.color, padding: 0 }]}
                                                            defaultValue={this.state.amenityValue}
                                                            selectionColor={color.myOrangeColor.color}
                                                            onChangeText={(value) => {
                                                                
                                                                let selectedAddons = this.state.selectedAddons;
                                                               selectedAddons[index] = {...selectedAddons[index], inputValue: Number(value)}
                                                                selectedAddons[index].totalCost = Number(value) * 10//Number(amenity.fee_per_unit);
                                                                
                                                                this.setState({
                                                                    selectedAddons: selectedAddons
                                                                }, () => {
                                                                    this.VASCost()
                                                                    console.log('input values: ', this.state.selectedAddons);
                                                                })

                                                            }}
                                                        />


                                                    </View>

                                                    <View style={{/* flex: 1, */ flexWrap: 'wrap', }}>
                                                        <Text style={[
                                                            font.regular,
                                                            font.sizeRegular,
                                                            color.grayColor, { textAlign: 'center' }
                                                        ]}>{amenity.totalCost == null ? ('\u20B9' + '0') : ('\u20B9' + amenity.totalCost)}</Text>
                                                    </View>

                                                </View>
                                            );

                                        })

                                        : null
                                }


                            </View>
                    }

                </KeyboardAwareScrollView>

                <View height={100} style={[box.centerBox, {

                    //flexDirection: 'row',
                    //justifyContent: 'space-between'
                    position: "absolute",
                    bottom: 70,
                    //padding: '1%'
                }]} >
                    <View
                        style={[box.horizontalBox]}>
                        <Text style={[
                            font.semibold,
                            font.sizeVeryRegular,
                            color.darkgrayColor,
                            { width: '50%' }

                        ]}>Base Cost</Text>
                        <Text style={[
                            font.semibold,
                            font.sizeVeryRegular,
                            color.darkgrayColor,
                            { width: '50%', textAlign: 'right' }

                        ]}>{'\u20B9'}{Intl.NumberFormat("en-IN").format(this.baseCost(this.state.data.price))}</Text>
                    </View>

                    <View
                        style={[box.horizontalBox]}>
                        <Text style={[
                            font.semibold,
                            font.sizeVeryRegular,
                            color.darkgrayColor,
                            { width: '50%' }

                        ]}>Value Added Services</Text>
                        <Text style={[
                            font.semibold,
                            font.sizeVeryRegular,
                            color.darkgrayColor,
                            { width: '50%', textAlign: 'right' }

                        ]}>{'\u20B9'}{Intl.NumberFormat("en-IN").format(this.state.VASTotalCost)}</Text>
                    </View>

                    <View
                        style={[box.horizontalBox]}>
                        <Text style={[
                            font.semibold,
                            font.sizeVeryRegular,
                            color.darkgrayColor, { width: '50%' }

                        ]}>GST</Text>
                        <Text style={[
                            font.semibold,
                            font.sizeVeryRegular,
                            color.darkgrayColor,
                            { width: '50%', textAlign: 'right' }

                        ]}>{'\u20B9'}{Intl.NumberFormat("en-IN").format(this.calGST())}</Text>
                    </View>

                    <View
                        style={[box.horizontalBox, { borderTopWidth: 1, borderTopColor: color.myOrangeColor.color }]}>
                        <Text style={[
                            font.regular,
                            font.sizeLarge,
                            color.myOrangeColor, { width: '50%' }

                        ]}>Amount to Pay</Text>
                        <Text style={[
                            font.regular,
                            font.sizeLarge,
                            color.darkgrayColor,
                            { width: '50%', textAlign: 'right' }

                        ]}>{'\u20B9'}{Intl.NumberFormat("en-IN").format(this.baseCost(this.state.data.price) + this.calGST() + Number(this.state.VASTotalCost))}</Text>
                    </View>



                </View>

                <View height={70} style={{

                    flexDirection: 'row',
                    justifyContent: 'space-between'
                    , position: "absolute",
                    bottom: 0,
                    padding: '1%'
                }}>
                    <TouchableOpacity
                        onPress={() => {
                            this.props.navigation.goBack();
                        }}
                        style={[button.defaultRadius, { borderColor: color.darkgrayColor.color, width: '49%', alignItems: 'center', justifyContent: 'center' }]}>
                        <Text style={[
                            font.semibold,
                            font.sizeExtraLarge,
                            color.darkgrayColor
                        ]}>CANCEL</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => {

                            if (this.validateFields()) {
                                const data = {
                                    startDate: this.state.startDate.toString(),
                                    endDate: this.state.endDate.toString(),
                                    duration: this.state.range,
                                    hours: this.state.rangeType == 'hours' ? this.getTotalHours() : null,
                                    selectedAddons: this.state.selectedAddons.length == 0 ? [] : this.state.selectedAddons,
                                    booking_dates: this.state.total_booking_days,
                                    API_DATA: this.state.API_DATA,
                                    item: this.state.data,
                                    guests: this.state.guests,
                                    invite: this.state.enableInvite,
                                    rsvp: this.state.enableRSVP,
                                    baseCost: this.baseCost(this.state.data.price),
                                    planCost: this.state.data.price,
                                    totalCost: this.baseCost(this.state.data.price) + this.calGST(),
                                    gst: this.calGST(),

                                }

                                if (!this.state.isLogin) {
                                    Session.setMeetingSpacesData(JSON.stringify(data));
                                    this.props.navigation.push('auth', { screen: 'Login' });

                                }
                                else {
                                    this.props.navigation.push('meetingspacesbookingsummary', {
                                        data: data,
                                    })
                                }




                            }

                        }}
                        style={[button.defaultRadius, { borderColor: color.myOrangeColor.color, width: '49%', alignItems: 'center', justifyContent: 'center' }]}>
                        <Text style={[
                            font.semibold,
                            font.sizeExtraLarge,
                            color.darkgrayColor
                        ]}>BOOK NOW</Text>
                    </TouchableOpacity>

                </View>

                {/* Start Date selector for iOS and Android */}

                {

                    this.state.isStartDatePicked &&
                    <DatePicker
                        modal
                        minuteInterval={30}
                        open={this.state.isStartDatePicked}
                        date={
                            this.checkBookingOpen() ? 
                            this.checkWeekendDate(new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 1))
                            : 
                            this.checkWeekendDate(new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 2))
                        }
                        mode={'date'}
                        minimumDate={this.checkBookingOpen() ? this.checkWeekendDate(new Date(moment(new Date()).add(1, 'day'))) : this.checkWeekendDate(new Date(moment(new Date()).add(2, 'days')))}
                        onConfirm={(date) => {
                            if(this.state.weekends.indexOf(new Date(date).getDay()) < 0)
                            this.onStartDateSelect({ type: "set" }, date); 
                            else
                            {
                                this.setState({
                                    isStartDatePicked: false
                                })
                                CommonHelpers.showFlashMsg('Property Closed on this date.','danger');
                            }
                            
                        }}
                        onCancel={() => {
                            this.setState({
                                isStartDatePicked: false
                            })
                        }}
                    />
                }

                {/* End Date selector for iOS and Android */}

                {

                    this.state.isEndDatePicked &&
                    <DatePicker
                        modal
                        minuteInterval={30}
                        open={this.state.isEndDatePicked}
                        date={this.state.endDate != '' ?
                            new Date(moment(this.state.endDate)) :
                            this.state.startDate == '' ?
                                this.checkBookingOpen() ?
                                this.checkWeekendDate(new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 1)) :
                                this.checkWeekendDate(new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 2)) :
                                new Date(moment(this.state.startDate))}
                        mode={'date'}
                        minimumDate={this.state.startDate != '' ? new Date(moment(this.state.startDate)) : this.checkBookingOpen() ? new Date(moment(new Date()).add(1, 'day')) : new Date(moment(new Date()).add(2, 'day'))/* new Date(moment(new Date()).add(1, 'day')) */}
                        onConfirm={(date) => {
                            /*  if(this.checkBookingOpen()){ */
                            this.state.startDate == '' ? (CommonHelpers.showFlashMsg('Please select the Start Date first.', 'danger'), this.setState({
                                isEndDatePicked: false,
                            })) :
                                this.onEndDateSelect({ type: "set" }, date);
                            /* }else{
                                CommonHelpers.showFlashMsg('Booking window closed for today. Please try again tomorrow.');
                                this.setState({
                                    isEndDatePicked: false
                                })
                                
                            } */

                        }}
                        onCancel={() => {
                            this.setState({
                                isEndDatePicked: false
                            })
                        }}
                    />

                }

                {/* start Timer for hourly plan */}

                {

                    this.state.showStartTimer &&
                    <DatePicker
                        modal
                        minuteInterval={30}
                        open={this.state.showStartTimer}
                        date={this.state.startTime != '' ? new Date(moment(this.state.startTime)) : new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), new Date().getHours(), 0)}
                        mode={'time'}
                        is24hourSource={false}
                        //minimumDate = {this.state.startDate != '' ? new Date(moment(this.state.startDate)):moment(new Date()).add(1, 'day')}
                        onConfirm={(date) => {
                            /*  if(this.checkBookingOpen())
                             { */
                            this.onStartTimeSelect({ type: "set" }, date);
                            /*  }
                             else{
                                 CommonHelpers.showFlashMsg('Booking window closed for today. Please try again tomorrow.');
                                 this.setState({
                                     showStartTimer: false
                                 })  
                             } */

                        }}
                        onCancel={() => {
                            this.setState({
                                showStartTimer: false
                            })
                        }}
                    />

                }


                {/* end Timer for hourly plan */}

                {

                    this.state.showEndTimer &&

                    <DatePicker
                        modal
                        minuteInterval={30}
                        open={this.state.showEndTimer}
                        date={this.state.endTime != '' ? new Date(moment(this.state.endTime)) : new Date()}
                        mode={'time'}
                        is24hourSource={false}
                        //minimumDate = {this.state.startDate != '' ? new Date(moment(this.state.startDate)):moment(new Date()).add(1, 'day')}
                        onConfirm={(date) => {
                            console.log(date);
                            /* if(this.checkBookingOpen()) */
                            this.onEndTimeSelect({ type: "set" }, date);
                            /*  else{
                                 CommonHelpers.showFlashMsg('Booking window closed for today. Please try again tomorrow.');
                                 this.setState({
                                     showEndTimer: false
                                 })
                             } */
                        }}
                        onCancel={() => {
                            this.setState({
                                showEndTimer: false
                            })
                        }}
                    />



                }

                {this.state.spinner && <Spinner />}
            </Drawer>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        // backgroundColor: 'rgba(52, 52, 52, 0.8)',
        //padding: 20,
        justifyContent: 'center'
    },
    customStyles: {
        container: {
            backgroundColor: 'orange',
            borderRadius: 0,
            elevation: 2

        },
        text: {
            color: 'white',
            fontWeight: 'bold'
        }
    },
    sundayStyle: {
        text: {
            color: color.grayColor.color,//'red',
            //backgroundColor: color.lightGray.color
        }
    }

}); 