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
    ActionSheetIOS
} from 'react-native';

import color from '../Styles/color';

import font from "../Styles/font";
import { StarRatingComponent } from './ReusableComponents/StarRatingComponent';
import { Calendar } from 'react-native-calendars';
import moment from 'moment';
import box from '../Styles/box';
import renderItem from "../Styles/renderItem";
import button from '../Styles/button';
import { Picker } from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/FontAwesome';
import CommonHelpers from '../Utils/CommonHelpers';
import Session from '../config/Session';
import DateTimePicker from '@react-native-community/datetimepicker';
import LogoHeader from './ReusableComponents/LogoHeader';
import { MemberDirectBookingAPI } from '../Rest/userAPI';
import Spinner from '../Utils/Spinner';
import image from '../Styles/image';
import Drawer from "react-native-drawer";
import Sidemenu from "../Navigation/Sidemenu";


export default class Booking extends Component {


    constructor() {
        super();
        this.state = {
            role_id: null,
            //markedDates: {},
            //sundayDates: {},
            isStartDatePicked: false,
            isEndDatePicked: false,
            isTimePicked: false,
            showTimer: false,

            weekends: [],

            startDate: '',
            endDate: '',
            startTime: '',
            endTime: '',
            valid_start_at: '',
            valid_end_at: '',

            totalDays: 0,
            range: 1,
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

            spinner: false
        }
        //this.noOfSeats = React.createRef();

    }



    componentDidMount = async () => {
        LogBox.ignoreLogs(['VirtualizedLists should never be nested']);
        this.backHandler = BackHandler.addEventListener(
            "hardwareBackPress",
            this.goBack
        );

        this.setState({
            weekends: CommonHelpers.offDays(this.props.route.params.bookingData.property_info[0].property_timings),
            spinner: true,
        }, () => {
            this.markSundays({ dateString: moment(new Date()).format('YYYY-MM-DD') });
        })


        if (this.props.route.params.bookingData.property_info[0].start_at != null && this.props.route.params.bookingData.property_info[0].end_at != null) {
            this.setState({
                valid_start_at: this.props.route.params.bookingData.property_info[0].start_at,
                valid_end_at: this.props.route.params.bookingData.property_info[0].end_at,
            })
        }

        this.setState({

            CGST: (((this.baseCost(Number(this.props.route.params.bookingData.cost)) + Number(this.state.VASTotalCost)) * 9) / 100),
            SGST: (((this.baseCost(Number(this.props.route.params.bookingData.cost)) + Number(this.state.VASTotalCost)) * 9) / 100),
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

        this._createTotalVASList(this.props.route.params.bookingData.property_info[0].amenity);

        this.setPlan();

        //this.props.modify ? this._handleAutoPopulate() : null;
    }



    setPlan = () => {
        //console.log('resource plan details: ', this.props.route.params.bookingData.resource_plan_details);
        ////console.log('access period unit id: ', this.props.route.params.bookingData.resource_plan_details.access_period_unit_id);
        if (this.props.route.params.bookingData.resource_plan_details.access_period_unit_id == 1) {
            console.log("1 month plan", this.props.route.params.bookingData.resource_plan_details.access_period);
            this.setState({
                duration: Number(this.props.route.params.bookingData.resource_plan_details.access_period),
                range: Number(this.props.route.params.bookingData.resource_plan_details.access_period),
                rangeType: 'months',
                planName: "Monthly Plan",
                //spinner: false
            })

        }
        else if (this.props.route.params.bookingData.resource_plan_details.access_period_unit_id == 2) {
            //console.log("Daily plan time");
            this.setState({
                duration: Number(this.props.route.params.bookingData.resource_plan_details.access_period),
                range: Number(this.props.route.params.bookingData.resource_plan_details.access_period),
                rangeType: 'days',
                planName: "Daily Plan",
                //spinner: false
            })


        }
        else if (this.props.route.params.bookingData.resource_plan_details.access_period_unit_id == 3) {
            //console.log("Hourly plan");
            this.setState({
                duration: Number(this.props.route.params.bookingData.resource_plan_details.access_period),
                range: Number(this.props.route.params.bookingData.resource_plan_details.access_period),
                rangeType: 'hours',
                planName: "Hourly Plan",
                // spinner: false
            })


        }
        else if (this.props.route.params.bookingData.resource_plan_details.access_period_unit_id == 5) {
            //console.log("Weekly plan");
            this.setState({
                duration: Number(this.props.route.params.bookingData.resource_plan_details.access_period),
                range: Number(this.props.route.params.bookingData.resource_plan_details.access_period),
                rangeType: 'weeks',
                planName: "Weekly Plan",
                // spinner: false
            })


        }
        else if (this.props.route.params.bookingData.resource_plan_details.access_period_unit_id == 6) {
            //console.log("Yearly plan");
            this.setState({
                duration: Number(this.props.route.params.bookingData.resource_plan_details.access_period),
                range: Number(this.props.route.params.bookingData.resource_plan_details.access_period),
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

    _handleAutoPopulate = () => {
        //console.log(moment(this.props.route.params.bookingData.modifyItem.start_date).format("YYYY-MM-DD"));
        this.onDayPress({ dateString: moment(this.props.route.params.bookingData.modifyItem.start_date).format("YYYY-MM-DD") })

        this.setState({
            // role_id: null,
            //markedDates: {},
            //sundayDates: {},
            isStartDatePicked: true,
            isEndDatePicked: true,
            isTimePicked: true,
            //showTimer: false,

            startDate: this.props.route.params.bookingData.modifyItem.start_date,
            endDate: this.props.route.params.bookingData.modifyItem.end_date,
            startTime: this.props.route.params.bookingData.modifyItem.start_date,
            endTime: this.props.route.params.bookingData.modifyItem.end_date,
            //valid_start_at: '',
            //valid_end_at: '',

            totalDays: this.props.route.params.bookingData.modifyItem.total_days,

            seats: this.props.route.params.bookingData.modifyItem.total_seats,

            //selectedVAS:,
            //selectedVASIndex: 0,
            selectedVASList: this.props.route.params.bookingData.modifyItem.booking_amenities, //for API
            VASTotalCost: this.props.route.params.bookingData.modifyItem.amenities_price,

            //totalVASList: [],
            //APISelectedVAS: [], // used in this page.

            CGST: this.props.route.params.bookingData.modifyItem.cgst == null ? 0 : this.props.route.params.bookingData.modifyItem.cgst,
            SGST: this.props.route.params.bookingData.modifyItem.sgst == null ? 0 : this.props.route.params.bookingData.modifyItem.sgst,
        }, () => {

            const selecteditems = this.props.route.params.bookingData.modifyItem.booking_amenities;
            //console.log("booking amenities:",selecteditems) // just for the request API

            const APISelected = [...this.state.APISelectedVAS];

            selecteditems.forEach(element => {
                //console.log('aminity element:  *****', element)

                if (element.is_paid == 1) {
                    APISelected.push({
                        amenity_detail: element,
                        unit: Number(element.ba_no_of_units),
                        unitCost: Number(element.ba_price),
                        totalCost: Number(element.ba_no_of_units) * Number(element.ba_price),
                    });

                    this.setState({
                        VASTotalCost: this.state.VASTotalCost + Number(element.ba_no_of_units) * Number(element.ba_price),
                    })
                }
            });
            this.setState({
                APISelectedVAS: APISelected,
            }, () => {
                console.warn('aminity element:  *****', element)
                console.warn("For the API", this.state.APISelectedVAS)
            }
            );
            /* 
                    APISelected.push({
                        amenity_detail: this.state["totalVASList"][this.state["selectedVASIndex"]],
                       unit: null,
                       unitCost: this.state["totalVASList"][this.state["selectedVASIndex"]].fee_per_unit,
                       totalCost: 0,
            
                   }); */
            // this.setState({
            //    APISelectedVAS: APISelected,
            //}, () => { console.warn("For the API", this.state.APISelectedVAS) }
            //);

        })
        // this.noOfSeats = React.createRef();  







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

    onDayPress = (day) => {
        //console.log(day);
        // this.markSundays(day);
        this.setState({
            currentDay: day
        })

        let markedDates = {};
        let range = 0;
        let startDate, endDate, totalDays;
        //console.log("id: ", this.props.route.params.bookingData.resource_plan_details.access_period_unit_id)
        this.setState({
            markedDates: this.state.sundayDates,//[],
            isStartDatePicked: false,
            isEndDatePicked: false,
            startDate: day.dateString,
            endDate: '',
            startTime: '',
            isTimePicked: false,
        }, () => {

            markedDates[day.dateString] = {
                customStyles: styles.customStyles
            }//{ selected: true, /* marked: true, */ selectedColor: 'orange'}//startingDay: true, color: "#fc9200", textColor: "#fff" };

            this.setState({
                markedDates: { ...this.state.sundayDates, ...markedDates },
                isStartDatePicked: true,
                startDate: day.dateString,
            }, () => {
                //console.log("startDate", this.state.startDate);
                if (this.props.route.params.bookingData.resource_plan_details.access_period_unit_id == 1) {
                    //console.log("1 month plan");
                    startDate = moment(this.state.startDate);
                    endDate = /* this.calculateEndDate((Number(this.state.range) * 30) - 1, startDate);// */startDate.add(Number(this.state.range), 'months').subtract(1, 'days')
                    endDate = endDate.add(Number(this.state.valid_end_at.split(':')[0]) - Number(this.state.valid_start_at.split(':')[0]), "hours");
                    totalDays = Number(this.state.range) * 30//endDate.diff(startDate, 'days', false);
                    this.setState({
                        endDate: moment(endDate).format("YYYY-MM-DD"),
                        isEndDatePicked: true,
                    }, () => {
                        //console.log("start date: ", this.state.startDate, "endDate is : ", moment(this.state.endDate), 'total days: ', this.state.totalDays);
                        startDate = moment(this.state.startDate);
                        endDate = moment(this.state.endDate);

                        range = endDate.diff(startDate, 'days', false)

                        for (let i = 1; i <= range; i++) {
                            let tempDate = startDate.add(1, 'day');
                            tempDate = moment(tempDate).format('YYYY-MM-DD')
                            if (i < range) {
                                markedDates[tempDate] = {
                                    customStyles: styles.customStyles
                                }//{ selected: true, /* marked: true, */ selectedColor: 'orange'}//color: 'rgba(252, 146, 0, 0.5)', textColor: '#FFFFFF' };
                            } else {
                                markedDates[tempDate] = {
                                    customStyles: styles.customStyles
                                }// { selected: true, /* marked: true, */ selectedColor: 'orange'}//endingDay: true, color: '#fc9200', textColor: '#FFFFFF' };

                            }
                        }
                        this.setState({
                            markedDates: { ...markedDates, ...this.state.sundayDates },
                            totalDays: Number(this.state.range) * 30//range
                            //markedDates: { ...markedDates, ...this.state.sundayDates },
                        }, () => {
                            //console.log(this.state.totalDays);
                        })
                    })
                } else if (this.props.route.params.bookingData.resource_plan_details.access_period_unit_id == 2) {
                    //console.log("Daily Plan");
                    startDate = moment(this.state.startDate);
                    if (Number(this.state.range) == 1)
                        endDate = startDate.add(Number(this.state.valid_end_at.split(':')[0]) - Number(this.state.valid_start_at.split(':')[0]), "hours");
                    else
                        endDate = this.calculateEndDate(Number(this.state.range) - 1, startDate);//startDate.add(Number(this.state.range) - 1, "days");
                    this.setState({
                        endDate: moment(endDate).format("YYYY-MM-DD"),
                        isEndDatePicked: true,
                        //totalDays: 1,
                        totalDays: Number(this.state.range)
                    }, () => {
                        //console.log("start date: ", moment(this.state.startDate), "endDate is : ", moment(this.state.endDate).format("hh"));
                        startDate = moment(this.state.startDate);
                        endDate = moment(this.state.endDate);
                        //range = 0;//1
                        range = Number(this.state.range) == 1 ? 0 : endDate.diff(startDate, 'days');//Number(this.state.range)-1
                        console.log("difference:", startDate.diff(endDate, 'days'));
                        for (let i = 1; i <= range; i++) {
                            let tempDate = startDate.add(1, 'day');
                            tempDate = moment(tempDate).format('YYYY-MM-DD')
                            if (i < range) {
                                markedDates[tempDate] = {
                                    customStyles: styles.customStyles
                                } //{ marked: true, dotColor: 'orange', activeOpacity: 0}//color: 'rgba(252, 146, 0, 0.5)', textColor: '#FFFFFF' };
                            } else {
                                markedDates[tempDate] = {
                                    customStyles: styles.customStyles
                                }//{ selected: true, marked: true, selectedColor: 'orange'}//endingDay: true, color: '#fc9200', textColor: '#FFFFFF' };

                            }
                        }
                        this.setState({
                            markedDates: { ...markedDates, ...this.state.sundayDates },
                            //markedDates: { ...markedDates, ...this.state.sundayDates },
                        })
                    })
                    ////console.log("start date: ",moment(this.state.startDate).format("DD-MM-YYYY"),"endDate is : ", endDate.format("DD-MM-YYYY"));

                }
                else if (this.props.route.params.bookingData.resource_plan_details.access_period_unit_id == 3) {
                    //console.log("hourly plan");
                    startDate = moment(this.state.startDate);
                    //endDate = startDate.add(1, "hours");
                    endDate = startDate.add(Number(this.state.range) == 0 ? 1 : Number(this.state.range), 'hours');
                    this.setState({
                        endDate: moment(endDate).format("YYYY-MM-DD"),
                        isEndDatePicked: true,
                        totalDays: 1,
                    }, () => {
                        //console.log("start date: ", moment(this.state.startDate), "endDate is : ", moment(this.state.endDate));
                        startDate = moment(this.state.startDate);
                        endDate = moment(this.state.endDate);
                        range = endDate.diff(startDate, 'days', true)//0;
                        //console.log("hourly plan range ", range);

                        for (let i = 1; i <= range; i++) {
                            let tempDate = startDate.add(1, 'day');
                            tempDate = moment(tempDate).format('YYYY-MM-DD')
                            if (i < range) {
                                markedDates[tempDate] = {
                                    customStyles: styles.customStyles
                                } //{ marked: true, dotColor: 'orange', activeOpacity: 0}//color: 'rgba(252, 146, 0, 0.5)', textColor: '#FFFFFF' };
                            } else {
                                markedDates[tempDate] = {
                                    customStyles: styles.customStyles
                                }//{ selected: true, marked: true, selectedColor: 'orange'}//endingDay: true, color: '#fc9200', textColor: '#FFFFFF' };

                            }
                        }

                        markedDates[endDate] = {
                            customStyles: styles.customStyles
                        }//{ endingDay: true, color: '#fc9200', textColor: '#FFFFFF' };
                        this.setState({
                            markedDates: { ...this.state.sundayDates, ...markedDates },
                            totalDays: range
                            // markedDates: { ...markedDates, ...this.state.sundayDates },
                        })

                    })
                    ////console.log("start date: ",moment(this.state.startDate).format("DD-MM-YYYY"),"endDate is : ", endDate.format("DD-MM-YYYY"));


                }
                else if (this.props.route.params.bookingData.resource_plan_details.access_period_unit_id == 5) {
                    //console.log("Weekly plan");
                    startDate = moment(this.state.startDate);

                    endDate = this.calculateEndDate((Number(this.state.range) * 7) - 1, startDate)//startDate.add((Number(this.state.range) *7)-1, 'days');


                    this.setState({
                        endDate: endDate,
                        isEndDatePicked: true,
                    }, () => {
                        //console.log("start date: ", this.state.startDate, "endDate is : ", moment(this.state.endDate));
                        startDate = moment(this.state.startDate);
                        endDate = moment(this.state.endDate);
                        //range = 6;
                        range = endDate.diff(startDate, 'days');//(Number(this.state.range)*7)-1

                        for (let i = 1; i <= range; i++) {
                            let tempDate = startDate.add(1, 'day');
                            tempDate = moment(tempDate).format('YYYY-MM-DD')
                            if (i < range) {
                                markedDates[tempDate] = {
                                    customStyles: styles.customStyles
                                }//{ color: 'rgba(252, 146, 0, 0.5)', textColor: '#FFFFFF' };
                            } else {
                                markedDates[tempDate] = {
                                    customStyles: styles.customStyles
                                }
                                //{ endingDay: true, color: '#fc9200', textColor: '#FFFFFF' };

                            }
                        }
                        this.setState({
                            markedDates: { ...markedDates, ...this.state.sundayDates },
                            //markedDates: { ...markedDates, ...this.state.sundayDates },
                        })
                    })
                } else if (this.props.route.params.bookingData.resource_plan_details.access_period_unit_id == 6) {
                    //console.log("1 year plan");
                    startDate = moment(this.state.startDate);

                    endDate = this.calculateEndDate((Number(this.state.range) * 365) - 1, startDate)//startDate.add(Number(this.state.range), 'years').subtract(1, 'day')

                    endDate = endDate.add(Number(this.state.valid_end_at.split(':')[0]) - Number(this.state.valid_start_at.split(':')[0]), "hours");
                    //console.log("endDate", endDate);
                    ////console.log("start date after adding 1 month", startDate);
                    //console.log("start date: ", moment(this.state.startDate), "endDate is : ", endDate);

                    this.setState({
                        endDate: moment(endDate).format("YYYY-MM-DD"),
                        isEndDatePicked: true,
                        //totalDays: 30,
                        // totalDays : 365 * this.state.range
                    }, () => {
                        //console.log("start date: ", this.state.startDate, "endDate is : ", moment(this.state.endDate));
                        startDate = moment(this.state.startDate);
                        endDate = moment(this.state.endDate);
                        //range = 29;

                        range = endDate.diff(startDate, 'days', false)//Number(this.state.totalDays) -1

                        for (let i = 1; i <= range; i++) {
                            let tempDate = startDate.add(1, 'day');
                            tempDate = moment(tempDate).format('YYYY-MM-DD')
                            if (i < range) {
                                markedDates[tempDate] = {
                                    customStyles: styles.customStyles
                                }//{ selected: true, /* marked: true, */ selectedColor: 'orange'}//color: 'rgba(252, 146, 0, 0.5)', textColor: '#FFFFFF' };
                            } else {
                                markedDates[tempDate] = {
                                    customStyles: styles.customStyles
                                }// { selected: true, /* marked: true, */ selectedColor: 'orange'}//endingDay: true, color: '#fc9200', textColor: '#FFFFFF' };

                            }
                        }
                        this.setState({
                            markedDates: { ...markedDates, ...this.state.sundayDates, },
                            totalDays: range
                            // markedDates: { ...markedDates, ...this.state.sundayDates },
                        })
                    })
                }

            })

        });
        this.setState({
            markedDates: markedDates,
            isStartDatePicked: true,
            isEndDatePicked: true,
        }, () => {
            if (this.props.route.params.bookingData.resource_plan_details.access_period_unit_id != 3) {
                this.onTimeSelect();
            }
            else if (this.props.route.params.bookingData.resource_plan_details.access_period_unit_id == 3) {
                this.setState({
                    showTimer: true,
                })
            }
        });

    }

    onTimeSelect = (/* event, time */) => {
        if (this.state.startDate != '') {
            var validstarttimearray = this.state.valid_start_at.split(":");
            var validendtimearray = this.state.valid_end_at.split(":");
            //console.log(validstarttimearray, validendtimearray);

            var starthourtime = Number(validstarttimearray[0]);
            var endhourtime = Number(validendtimearray[0]);
            /* if((Number(moment(time).format("HH")) < starthourtime) || (Number(moment(time).format("HH")) >= endhourtime)){
                CommonHelpers.showFlashMsg("Please select a time from " + this.state.valid_start_at + " hours to " + this.state.valid_end_at + " hours", "danger");
                this.setState({
                    showTimer: false,
                })
            }
            else{ */
            let day = Number(moment(this.state.startDate).format("DD"));
            let month = Number(moment(this.state.startDate).format("MM")) - 1;
            let year = Number(moment(this.state.startDate).format("YYYY"));
            let hours = Number(validstarttimearray[0])//Number(moment(time).format("HH"));
            let min = Number(validstarttimearray[1]);//Number(moment(time).format("mm"));
            //let sec = Number(moment(time).format('ss'));
            //console.log(day, month, year, hours, min);//,sec);
            var startDate = new Date(year, month, day, hours, min)//,sec);
            //console.log("Date object: ", moment(startDate).format("DD-MM-YYYY, HH : mm"));
            //console.log("this is what you need to send: ", moment(startDate))

            this.setState({
                startTime: startDate,
                showTimer: false,
            }, () => {
                if (this.props.route.params.bookingData.resource_plan_details.access_period_unit_id == 1) {
                    //console.log("1 month plan");


                    //let endDateTime = moment(this.state.startTime).add((Number(this.state.range) * 30)-1, "days");

                    let endDateTime = /* this.calculateEndDate((Number(this.state.range) * 30) - 1, moment(this.state.startTime));// */moment(this.state.startTime).add(this.state.range, "months").subtract(1, 'day');

                    let endtime2 = moment(endDateTime).add(Number(this.state.valid_end_at.split(':')[0]) - Number(this.state.valid_start_at.split(':')[0]), "hours");
                    //console.log("endtime with 10 hours.", moment(endtime2).format("DD MM YYYY HH:mm"));
                    this.setState({
                        endTime: endtime2,
                        //endTime: endDateTime,
                        isTimePicked: true,
                    })
                }
                else if (this.props.route.params.bookingData.resource_plan_details.access_period_unit_id == 2) {
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
                else if (this.props.route.params.bookingData.resource_plan_details.access_period_unit_id == 3) {
                    //console.log("Hourly plan");
                    let endDateTime = moment(this.state.startTime).add(1, "hour");
                    this.setState({
                        endTime: endDateTime,
                        isTimePicked: true,
                        // showTimer: true,
                    })

                }
                else if (this.props.route.params.bookingData.resource_plan_details.access_period_unit_id == 5) {
                    //console.log("Weekly plan");
                    // let endDateTime = moment(this.state.startTime).add(6, "days");
                    let endDateTime = this.calculateEndDate(((Number(this.state.range) * 7) - 1), moment(this.state.startTime))//moment(this.state.startTime).add((Number(this.state.range)*7-1), "days");
                    let endDateTime2 = moment(endDateTime).add(Number(this.state.valid_end_at.split(':')[0]) - Number(this.state.valid_start_at.split(':')[0]), "hours");
                    this.setState({
                        endTime: endDateTime2,
                        //endTime: endDateTime,
                        isTimePicked: true,
                    })

                } else if (this.props.route.params.bookingData.resource_plan_details.access_period_unit_id == 6) {
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
                    if (this.props.route.params.bookingData.resource_plan_details.access_period_unit_id == 3) {
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
                this.openPropertyDetail(this.props.route.params.bookingData.resource_plan_details.property_id);
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
        //console.log(this.props.route.params.bookingData.resource_plan_details);
        //console.log("Pressed")
        this.props.navigation.navigate('detail', {
            property_id: id,
        });
    };

    VASCost = () => {
        var vas = 0;

        this.state.APISelectedVAS.forEach(item => {
            vas += item.totalCost;
        });

        this.setState({
            VASTotalCost: vas,
        }, () => {
            this.setState({
                /*  CGST: ((((Number(this.props.route.params.bookingData.cost) ) + Number(this.state.VASTotalCost)) * 9) / 100),
                 SGST: ((((Number(this.props.route.params.bookingData.cost) ) + Number(this.state.VASTotalCost)) * 9) / 100), */
                CGST: (((this.baseCost(Number(this.props.route.params.bookingData.cost)) + Number(this.state.VASTotalCost)) * 9) / 100),
                SGST: (((this.baseCost(Number(this.props.route.params.bookingData.cost)) + Number(this.state.VASTotalCost)) * 9) / 100),
            })
        })

    }

    baseCost = (basePrice) => {
        if (this.props.route.params.bookingData.resource_plan_details.capacity > 1) {
            return Number(basePrice) * (Number(this.state.range) / Number(this.state.duration));
        }

        else {
            return Number(basePrice) * Number(this.state.seats) * (Number(this.state.range) / Number(this.state.duration));
        }

    }

    closeControlPanel = () => {
        this._drawer.close()
    };
    openControlPanel = () => {
        this._drawer.open()
    };


    render() {
        ////console.log(this.props.route.params.bookingData);
        const selectedVAS = this.state.selectedVAS;

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
                <View style={{ marginTop: "1%", }}>
                    <View style={{ /* marginTop: "2%", *//* marginBottom: 200 */ height: '100%' }}>
                        {/**Custome header component */}
                        <LogoHeader navigation={this.props.navigation}
                            onBarsPress={() => {
                                this.openControlPanel()
                            }} />

                        {/**Custome header component ends */}
                        <ScrollView>
                            {/** brief details. */}
                            <View style={[renderItem.fillWidthView,
                            box.shadow_box, box.centerBox,
                            {
                                height: 300,
                                marginBottom: "3%", marginTop: '3%'
                            }]}>
                                <Image source={this.props.route.params.bookingData.image_path != null ?
                                    { uri: this.props.route.params.bookingData.image_path } :
                                    require('./../Assets/images/workplace2.jpg')} style={[image.imageCover, {
                                        alignSelf: 'center',
                                        width: Dimensions.get('screen').width * 0.9,
                                        height: 150
                                    }]} />

                                <View style={[{ flex: 1, marginRight: 10, marginTop: '2%' }]}>
                                    <Text style={[font.semibold,
                                    font.sizeMedium, { marginBottom: 5 },
                                    color.blackColor]}>{this.props.route.params.bookingData.plan_name}</Text>

                                    <Text style={[font.regular,
                                    font.sizeMedium,
                                    color.blackColor,]}>{this.props.route.params.bookingData.property_name}
                                    </Text>
                                    <Text style={[font.regular,
                                    font.sizeMedium,
                                    color.blackColor]}>{'\u20B9'}{Intl.NumberFormat('en-IN').format(this.props.route.params.bookingData.cost)}
                                    </Text>
                                    <Text style={[font.regular,
                                    font.sizeRegular,
                                    color.blackColor, { marginTop: 10 }]}>{this.props.route.params.bookingData.property_location}</Text>

                                </View>
                            </View>
                            {/** brief details ends */}

                            {/** calendar starts */}
                            <View height={460} style={[box.shadow_box, renderItem.fillWidthView, { marginBottom: "3%", borderRadius: 5 }]} >
                                <View height={80} >
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                        <Text style={[font.semibold, font.sizeRegular, color.myOrangeColor,]}>Plan Name: {this.state.planName} </Text>
                                        <Text style={[font.semibold, font.sizeSmall, color.myOrangeColor,]}>Base Duration:{this.state.duration} {this.state.rangeType}</Text>

                                    </View>

                                    <TextInput
                                        label={this.state.rangeType}
                                        placeholder={'Enter number of ' + this.state.rangeType}
                                        placeholderTextColor={color.blackColor.color}
                                        selectionColor={color.myOrangeColor.color}
                                        value={this.state.range}
                                        keyboardType='number-pad'
                                        onChangeText={(val) => {
                                            let range = Number(val) * Number(this.state.duration);
                                            this.setState({
                                                range: range,


                                            }, () => {
                                                if (this.state.startDate != '') {
                                                    this.onDayPress(this.state.currentDay);

                                                    this.markSundays({ dateString: moment(this.state.startDate).format('YYYY-MM-DD') });
                                                }
                                                else {
                                                    this.markSundays({ dateString: moment(new Date()).format('YYYY-MM-DD') });
                                                }

                                                this.setState({
                                                    CGST: (((this.baseCost(Number(this.props.route.params.bookingData.cost)) + Number(this.state.VASTotalCost)) * 9) / 100),
                                                    SGST: (((this.baseCost(Number(this.props.route.params.bookingData.cost)) + Number(this.state.VASTotalCost)) * 9) / 100),
                                                })
                                            });
                                        }}
                                        style={[color.myOrangeColor, font.regular, font.sizeMedium, {
                                            height: 50,
                                            borderBottomWidth: 0.5,
                                            borderBottomColor: color.myOrangeColor.color,

                                        }]}
                                    />
                                </View>
                                <View style={[/* box.shadow_box, */ /* renderItem.fillWidthView */]} >
                                    <Calendar
                                        minDate={this.state.planName == 'Daily Plan' || this.state.planName == 'Hourly Plan' ? new Date() : new Date().setDate(new Date().getDate() + 1)}//{Date()}
                                        monthFormat={"MMMM yyyy"}
                                        markedDates={this.state.markedDates}
                                        markingType="custom"
                                        hideExtraDays={true}
                                        hideDayNames={false}
                                        onDayPress={(day) => {


                                            const day_of_week = new Date(day.dateString).getDay();
                                            //console.log("Day: ", day_of_week)
                                            if (this.state.weekends.indexOf(day_of_week) > -1 /* day_of_week == 6 || day_of_week == 0 */)
                                                CommonHelpers.showFlashMsg("The property is closed on this day.", 'danger');
                                            else
                                                this.onDayPress(day)
                                        }}
                                        theme={{
                                            arrowColor: '#fc9200',
                                            todayTextColor: "orange",
                                            /* 'stylesheet.calendar.header': {
                                                dayTextAtIndex0: {
                                                    //color: 'red'
                                                },
                                                dayTextAtIndex6: {
                                                    //color: 'blue'
                                                }
                                            } */

                                        }}
                                    />
                                </View>
                            </View>
                            {/**calendar ends  */}



                            {/* Timepicker starts */}

                            {
                                this.state.rangeType == 'hours' ?
                                    Platform.OS === 'ios' ?

                                        <View height={50} style={{ flex: 1, flexDirection: "row", margin: 5, justifyContent: "space-around", alignItems: "center" }}>
                                            <TouchableOpacity disabled={this.props.route.params.bookingData.resource_plan_details.access_period_unit_id == 3 ? false : true} onPress={() => {
                                                this.setState({
                                                    showTimer: !this.state.showTimer,
                                                })
                                                if (this.state.isTimePicked) {
                                                    this.setState({
                                                        isTimePicked: false,
                                                    })
                                                }
                                            }}>
                                                {this.state.isTimePicked ?
                                                    <View>
                                                        <Text style={[button.defaultRadius,
                                                        font.bold, color.myOrangeColor,
                                                        { borderWidth: 2, borderColor: color.myOrangeColor.color }]}> Start Time-
                                                            {" " + moment(this.state.startTime).format("HH : mm")} </Text >
                                                    </View> :
                                                    <View style={[button.defaultRadius, color.orangeBorder, { flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }]}>

                                                        <Text style={[
                                                            font.bold, color.orangeColor,
                                                        ]}  >Select Start Time</Text>
                                                        {/*  {this.state.showTimer && */}

                                                        <DateTimePicker
                                                            testID="dateTimePicker"
                                                            minuteInterval={30}
                                                            value={this.state.startTime != '' ? new Date(moment(this.state.startTime)) : new Date()}//{new Date()}
                                                            mode={'time'}
                                                            is24Hour={true}
                                                            display='inline'
                                                            textColor={color.myOrangeColor.color}
                                                            style={[color.myOrangeColor, { width: Dimensions.get('screen').width * 0.4 }]}
                                                            onChange={this.onTimeSelectOriginal} />

                                                        {/* } */}

                                                    </View>}

                                            </TouchableOpacity>

                                            {
                                                this.state.isTimePicked ?
                                                    <TouchableOpacity disabled={true}>
                                                        {this.state.isTimePicked ?
                                                            <Text style={[button.defaultRadius,
                                                            font.bold, color.darkgrayColor,
                                                            color.grayBorderColor, { borderWidth: 2 }]}> End Time-
                                                                {" " + moment(this.state.endTime).format("HH : mm")} </Text > :
                                                            <Text style={[button.defaultRadius,
                                                            font.bold, color.darkgrayColor,
                                                            color.grayBorderColor, { borderWidth: 2 }]}>End Time</Text>}

                                                    </TouchableOpacity>

                                                    : null
                                            }






                                        </View>
                                        :

                                        <View height={50} style={{ flex: 1, flexDirection: "row", margin: 5, justifyContent: "space-around", alignItems: "center" }}>



                                            <TouchableOpacity disabled={this.props.route.params.bookingData.resource_plan_details.access_period_unit_id == 3 ? false : true} onPress={() => {
                                                this.setState({
                                                    showTimer: !this.state.showTimer,
                                                })


                                            }}>
                                                {this.state.isTimePicked ?
                                                    <Text style={[button.defaultRadius,
                                                    font.bold, color.darkgrayColor,
                                                    color.grayBorderColor, { borderWidth: 2 }]}> Start Time-
                                                        {" " + moment(this.state.startTime).format("HH:mm")}Hrs</Text > :
                                                    this.props.route.params.bookingData.resource_plan_details.access_period_unit_id == 3 ?
                                                        <Text style={[button.defaultRadius,
                                                        font.bold, color.orangeColor,
                                                        color.orangeBorder]}  >Select Start Time</Text> :
                                                        <Text style={[button.defaultRadius,
                                                        font.bold, color.darkgrayColor,
                                                        color.grayBorderColor, { borderWidth: 2 }]}>Start Time</Text>}

                                            </TouchableOpacity>

                                            <TouchableOpacity disabled={true}>
                                                {this.state.isTimePicked ?
                                                    <Text style={[button.defaultRadius,
                                                    font.bold, color.darkgrayColor,
                                                    color.grayBorderColor, { borderWidth: 2 }]}> End Time-
                                                        {" " + moment(this.state.endTime).format("HH:mm")}Hrs</Text > :
                                                    <Text style={[button.defaultRadius,
                                                    font.bold, color.darkgrayColor,
                                                    color.grayBorderColor, { borderWidth: 2 }]}>End Time</Text>}

                                            </TouchableOpacity>



                                            {this.state.showTimer &&

                                                <DateTimePicker
                                                    testID="dateTimePicker"
                                                    minuteInterval={30}
                                                    value={new Date()}
                                                    mode={'time'}
                                                    is24Hour={true}
                                                    display="spinner"
                                                    style={[color.myOrangeColor]}
                                                    onChange={this.onTimeSelectOriginal} />

                                            }


                                        </View> : null
                            }

                            {/* Timepicker ends */}


                            {/** Value added services begin */}
                            <View height={this.state.selectedVASList.length == 0 ? 200 : 200 + (this.state.selectedVASList.length * 60)} >
                                <View style={[box.shadow_box, renderItem.fillWidthView, { borderRadius: 0, height: '100%' }]}>
                                    <Text style={[font.semibold,
                                    font.sizeRegular,
                                    color.lightBlack]}>
                                        Date
                                    </Text>
                                    <Text style={[font.regular,
                                    font.sizeVeryRegular,
                                    color.darkgrayColor]}>
                                        {!this.state.isTimePicked ? "" : moment(this.state.startTime).format("DD-MM-YYYY, HH:mm") + "Hrs to "}
                                        {!this.state.isTimePicked ? " " : moment(this.state.endTime).format("DD-MM-YYYY, HH:mm") + "Hrs"}
                                    </Text>

                                    {

                                        this.props.route.params.bookingData.resource_plan_details.capacity > 1 ? null :

                                            <View style={{ flexDirection: "row", justifyContent: "flex-start", alignItems: "center", marginBottom: 10, }}>
                                                <Text style={[font.semibold, font.sizeRegular, color.lightBlack]}>Seats</Text>
                                                <View /* style={form.formMargin} */>
                                                    <TextInput
                                                        style={{ borderBottomWidth: 0.5, borderBottomColor: color.myOrangeColor.color, width: 80, height: 50 }}

                                                        keyboardType='numeric'
                                                        ref={input => { this.textInput = input }}
                                                        placeholder='1'
                                                        placeholderTextColor={color.myOrangeColor.color}
                                                        value={this.state.seats}
                                                        selectionColor={color.myOrangeColor.color}

                                                        onChangeText={(val) => {

                                                            if (Number(val) > 100/*  Number(this.props.route.params.bookingData.resource_plan_details.capacity) */) {
                                                                this.setState({
                                                                    seats: ''
                                                                })
                                                                CommonHelpers.showFlashMsg("Plan Capacity Exceeded. Capacity: " + 100/* this.props.route.params.bookingData.resource_plan_details.capacity */, "danger");
                                                                //this.updateInputVal(this.props.route.params.bookingData.resource_plan_details.capacity, "seats");


                                                            }
                                                            else {
                                                                this.updateInputVal(val, "seats");
                                                                this.setState({
                                                                    CGST: (((this.baseCost(Number(this.props.route.params.bookingData.cost)) + Number(this.state.VASTotalCost)) * 9) / 100),
                                                                    SGST: (((this.baseCost(Number(this.props.route.params.bookingData.cost)) + Number(this.state.VASTotalCost)) * 9) / 100),
                                                                    // CGST: ((((Number(this.props.route.params.bookingData.cost) ) + Number(this.state.VASTotalCost)) * 9) / 100),
                                                                    // SGST: ((((Number(this.props.route.params.bookingData.cost)) + Number(this.state.VASTotalCost)) * 9) / 100),
                                                                })
                                                                //console.error(this.state["seats"])
                                                            }


                                                        }
                                                        }
                                                    />

                                                </View>

                                            </View>
                                    }

                                    <Text style={[font.semibold, font.sizeRegular, color.lightBlack, { marginBottom: "2%" }]} >
                                        Value Added Services
                                    </Text>
                                    <View>
                                        {
                                            this.state.totalVASList.length == 0 ?
                                                <Text style={[font.regular, font.sizeRegular, color.blackColor]}>No Value added services Available</Text> :


                                                <View style={{ flexDirection: "row", height: 50 }}>
                                                    <View width={"75%"} style={{ borderWidth: 0.4, marginRight: 10 }}>

                                                        {
                                                            Platform.OS === "ios" ?

                                                                <TouchableOpacity style={{ justifyContent: "center", width: "100%", height: "100%", marginLeft: 10 }} onPress={() => {
                                                                    ActionSheetIOS.showActionSheetWithOptions(
                                                                        {
                                                                            options: this.state.iosVASList,
                                                                            //destructiveButtonIndex: 2,
                                                                            //cancelButtonIndex: 0,
                                                                            userInterfaceStyle: 'light',
                                                                            tintColor: 'orange'
                                                                        },
                                                                        buttonIndex => {
                                                                            this.setState({
                                                                                selectedVAS: this.state.totalVASList[buttonIndex],
                                                                                selectedVASIndex: buttonIndex,
                                                                            }, console.log("MY SELECTED ITEM: ", this.state["selectedVAS"]));

                                                                        }
                                                                    )

                                                                }}>
                                                                    <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                                                                        <Text style={[color.myOrangeColor, font.semibold, font.sizeMedium, { textAlign: "left", flex: 1 }]}>
                                                                            {this.state.selectedVAS.length == 0 ? "Show VAS List" : this.state.iosVASList[this.state.selectedVASIndex]}
                                                                        </Text>
                                                                        <Icon name='angle-down' size={20} style={{ flex: 0.2, }} color={color.myOrangeColor.color} />
                                                                    </View>
                                                                </TouchableOpacity>


                                                                :
                                                                <Picker
                                                                    selectedValue={selectedVAS}
                                                                    style={[color.darkgrayColor, { width: "100%", }]}
                                                                    onValueChange={(itemValue, itemIndex) => {
                                                                        this.setState({
                                                                            selectedVAS: itemValue,
                                                                            selectedVASIndex: itemIndex,
                                                                        }, //console.log("MY SELECTED ITEM: ", this.state["selectedVAS"])
                                                                        );

                                                                    }
                                                                    }>
                                                                    {

                                                                        this.state.totalVASList.map((item) => {
                                                                            ////console.log(" Picker list",this.state.totalVASList);
                                                                            return (
                                                                                <Picker.Item label={item.amenity_name} value={item} fontFamily="Montserrat-SemiBold" />);
                                                                        })
                                                                    }
                                                                </Picker>}

                                                    </View>
                                                    <TouchableOpacity disabled={
                                                        this.state.totalVASList.length == 0 ?
                                                            ToastAndroid.show(" Paid VAS is not available", ToastAndroid.SHORT)
                                                            : false
                                                    }
                                                        onPress={() => {
                                                            const APISelected = [...this.state.APISelectedVAS];
                                                            var index = -1;

                                                            APISelected.forEach(element => {

                                                                if (element.amenity_detail.amenity_name == this.state["selectedVAS"].amenity_name) {
                                                                    index = 1;
                                                                    console.error("value", element.amenity_detail.amenity_name, this.state["selectedVAS"].amenity_name)
                                                                }
                                                            })

                                                            if (index > -1) {
                                                                //do nothing
                                                                CommonHelpers.showFlashMsg("You have already Added this service.", "success");
                                                                //ToastAndroid.show("You have already added the service", ToastAndroid.LONG);
                                                            }
                                                            else {


                                                                const selecteditems = [...this.state.selectedVASList]; // just for the request API

                                                                const APISelected = [...this.state.APISelectedVAS];

                                                                APISelected.push({
                                                                    amenity_detail: this.state["totalVASList"][this.state["selectedVASIndex"]],
                                                                    unit: 0,
                                                                    unitCost: this.state["totalVASList"][this.state["selectedVASIndex"]].pa_fee_per_unit == null ? 0 : this.state["totalVASList"][this.state["selectedVASIndex"]].pa_fee_per_unit,
                                                                    totalCost: 0,
                                                                    paid_units: this.state["totalVASList"][this.state["selectedVASIndex"]].pa_paid_units == '' || this.state["totalVASList"][this.state["selectedVASIndex"]].pa_paid_units == null ? 0 : this.state["totalVASList"][this.state["selectedVASIndex"]].pa_paid_units,

                                                                });
                                                                this.setState({
                                                                    APISelectedVAS: APISelected,
                                                                }, () => { console.warn("For the API", this.state.APISelectedVAS) }
                                                                );



                                                                selecteditems.push(this.state["totalVASList"][this.state["selectedVASIndex"]]);

                                                                var APIArray = selecteditems.map(item => ({ ...item, is_selected: 1 }));
                                                                //console.log("My API array: ", APIArray);

                                                                this.setState({
                                                                    selectedVASList: APIArray
                                                                }, () => { //console.log(" MY SELECTED VAS LIST: ", this.state["selectedVASList"])
                                                                }
                                                                )

                                                            }
                                                        }}
                                                    >
                                                        <Text style={[button.defaultRadius,
                                                        font.regular, color.textWhiteColor, {
                                                            backgroundColor: "orange",
                                                            borderColor: "orange",
                                                            height: "100%", paddingTop: 15
                                                        }
                                                        ]}>ADD</Text>
                                                    </TouchableOpacity>
                                                </View>
                                        }
                                    </View>

                                    {
                                        this.state.selectedVASList.length == 0 ? null :
                                            /*  <ScrollView nestedScrollEnabled={true} style={{ maxHeight: 200, marginTop: "2%",}}> */
                                            <View width={"95%"} height={60} style={{ marginTop: "2%", }} >
                                                <View style={[renderItem.withoutPaddingView]}>
                                                    {this.state.APISelectedVAS.length == 0 ?
                                                        <Text style={[
                                                            font.semibold,
                                                            font.sizeVeryRegular,
                                                            color.lightBlack, { marginTop: "2%" }]}>
                                                            Selected Services will appear here.
                                                        </Text> :
                                                        this.state["APISelectedVAS"].map((item, index) => {
                                                            return (
                                                                <View key={index} style={{ flexDirection: "row", justifyContent: "space-between", width: "95%", paddingTop: "2%", alignItems: "center", }}>
                                                                    {//console.log("rendering" + item.amenity_name)
                                                                    }
                                                                    <View width={"28%"} style={{ alignItems: "center" }}>
                                                                        <Text style={[{ textAlign: 'center' },
                                                                        font.semibold,
                                                                        font.sizeVeryRegular,
                                                                        color.lightBlack]}>{item.amenity_detail.amenity_name}</Text>
                                                                    </View>
                                                                    <View width={"30%"} style={{ alignItems: "center" }}>

                                                                        <TextInput
                                                                            placeholder="Units"
                                                                            keyboardType='number-pad'
                                                                            style={[renderItem.inputBox, { width: 50 }]}
                                                                            value={item.unit}

                                                                            onChangeText={(val) => {

                                                                                if (Number(val) > Number(item.paid_units)) {
                                                                                    item.unit = '';
                                                                                    CommonHelpers.showFlashMsg("Units Available : " + item.paid_units + " only.", "danger");

                                                                                    /*  const updateArray = [...this.state.APISelectedVAS]
                                                                                     updateArray[index].unit = item.paid_units;
                                                                                     updateArray[index].totalCost = updateArray[index].unitCost == null ? 0 : updateArray[index].unitCost * item.paid_units;
                                                                                      this.setState({
                                                                                         APISelectedVAS: updateArray,
                                                                                     }, ()=>{
                                                                                         this.VASCost();
                                                                                     }); */
                                                                                }
                                                                                else {
                                                                                    const updateArray = [...this.state.APISelectedVAS];
                                                                                    const APIData = [...this.state.selectedVASList];
                                                                                    updateArray[index].unit = val;
                                                                                    updateArray[index].amenity_detail.pa_selected_units = Number(val);
                                                                                    APIData[index].pa_selected_units = Number(val);
                                                                                    updateArray[index].totalCost = updateArray[index].unitCost == null ? 0 : updateArray[index].unitCost * val;
                                                                                    this.setState({
                                                                                        APISelectedVAS: updateArray,
                                                                                        selectedVASList: APIData,
                                                                                    }, () => {
                                                                                        console.log(this.state.selectedVASList);
                                                                                        this.VASCost();
                                                                                    });

                                                                                }

                                                                            }
                                                                            }

                                                                        />
                                                                    </View>
                                                                    <View width={"28%"} style={{ alignItems: "center" }}>
                                                                        <Text style={[{ textAlign: 'center' },
                                                                        font.semibold,
                                                                        font.sizeVeryRegular,
                                                                        color.lightBlack]}> {
                                                                                this.state["APISelectedVAS"][index].unit + ' X ' +
                                                                                this.state["APISelectedVAS"][index].unitCost + ' = '
                                                                            }
                                                                            {'\u20B9'}{Intl.NumberFormat('en-IN').format(this.state["APISelectedVAS"][index].unitCost * this.state["APISelectedVAS"][index].unit)}
                                                                        </Text>
                                                                    </View>
                                                                    <View width={"9%"} style={{ alignItems: "flex-start" }}>
                                                                        <TouchableOpacity onPress={() => {

                                                                            this.setState({
                                                                                VASTotalCost: Number(this.state.VASTotalCost) - Number(this.state.APISelectedVAS[index].totalCost),
                                                                            })

                                                                            var selectedVAS = this.state.APISelectedVAS;
                                                                            var selectedList = this.state.selectedVASList;

                                                                            selectedVAS.splice(index, 1);
                                                                            selectedList.splice(index, 1);

                                                                            this.setState({
                                                                                APISelectedVAS: selectedVAS,
                                                                                selectedVASList: selectedList,

                                                                            }, () => {
                                                                                this.VASCost();
                                                                                //console.log("checking after removal: ", this.state.APISelectedVAS);
                                                                                //console.log("Other list: ", this.state.selectedVASList);
                                                                            })


                                                                        }}>
                                                                            <Icon name="close" size={15} color="gray" />
                                                                        </TouchableOpacity>
                                                                    </View>
                                                                </View>);
                                                        })
                                                    }
                                                </View>
                                            </View>
                                        /* </ScrollView>  */
                                    }

                                </View>
                            </View>
                            {/** Value added services end */}

                            {/** cost summary begin */}
                            <View height={250} style={[{ margin: "4%" }]}>
                                <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 10 }}>
                                    {
                                        /*  Number(this.state.range )> Number(this.state.duration) ? 
                                      
                                      <Text style={[font.semibold, 
                                          font.sizeMedium, 
                                          color.darkgrayColor, 
                                          {flexWrap: 'wrap', 
                                          width: Dimensions.get('screen').width * 0.5}]}>
                                              {
                                                  Number(this.state.range) > Number(this.state.duration)
                                              }
                                          Plan Cost :
                                          {'\u20B9'}{Intl.NumberFormat('en-IN').format(this.props.route.params.bookingData.cost)} X {this.state.seats} Seats X {this.state.range} {this.state.rangeType}
                                      </Text>: 
                                       <Text style={[font.semibold, 
                                          font.sizeMedium, 
                                          color.darkgrayColor, 
                                          {flexWrap: 'wrap', 
                                          width: Dimensions.get('screen').width * 0.5}]}>
                                              {
                                                  Number(this.state.range) > Number(this.state.duration)
                                              }
                                          Plan Cost :
                                          {'\u20B9'}{Intl.NumberFormat('en-IN').format(this.props.route.params.bookingData.cost)} X {this.state.seats} Seats
                                      </Text>  */
                                    }
                                    <Text style={[font.semibold, font.sizeMedium, color.darkgrayColor]}>Sub Total</Text>
                                    <Text style={[font.semibold, font.sizeMedium, color.darkgrayColor]}>{'\u20B9'}{Intl.NumberFormat('en-IN').format(this.baseCost(this.props.route.params.bookingData.cost)) /* * this.state.seats */}</Text>
                                </View>

                                {
                                    Number(this.state.VASTotalCost) != 0 ? <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 10 }}>
                                        <Text style={[font.semibold, font.sizeMedium, color.darkgrayColor]}>VAS { }</Text>
                                        <Text style={[font.semibold, font.sizeMedium, color.darkgrayColor]}> {'\u20B9'}{Intl.NumberFormat('en-IN').format(Number(this.state.VASTotalCost))}</Text>
                                    </View> : null

                                }


                                <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 10 }}>
                                    <Text style={[font.semibold, font.sizeMedium, color.darkgrayColor]}>CGST (9%)</Text>
                                    <Text style={[font.semibold, font.sizeMedium, color.darkgrayColor]}>{'\u20B9'}{Intl.NumberFormat('en-IN').format(this.state.CGST)}</Text>
                                </View>
                                <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 10 }}>
                                    <Text style={[font.semibold, font.sizeMedium, color.darkgrayColor]}>SGST (9%)</Text>
                                    <Text style={[font.semibold, font.sizeMedium, color.darkgrayColor]}>{'\u20B9'}{Intl.NumberFormat('en-IN').format(this.state.SGST)}</Text>
                                </View>
                                <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 10 }}>
                                    <Text style={[font.bold, font.sizeMedium, color.blackColor]}>Total</Text>
                                    <Text style={[font.bold,
                                    font.sizeMedium,
                                    color.blackColor]}>
                                        {'\u20B9'} {
                                            Intl.NumberFormat('en-IN').format(((this.baseCost(Number(this.props.route.params.bookingData.cost)) /* *
                                            Number(this.state.seats) */) +
                                                Number(this.state.VASTotalCost) +
                                                Number(this.state.CGST) + Number(this.state.SGST)).toFixed(2))
                                        }</Text>
                                </View>
                            </View>

                        </ScrollView>
                    </View>
                    <TouchableOpacity
                        onPress={async () => {
                            let VASCheck = 0;
                            if (this.state.APISelectedVAS.length != 0) {
                                const list = this.state.APISelectedVAS;
                                list.forEach((item) => {
                                    if (Number(item.totalCost) == 0) {
                                        VASCheck = 1;
                                        CommonHelpers.showFlashMsg(item.amenity_detail.amenity_name + ' cannot be 0 units', 'danger');
                                    }
                                })
                            }

                            if (this.state.startDate == '' || this.state.endDate == '') {
                                CommonHelpers.showFlashMsg("Please select Start Date.", "danger");
                                //ToastAndroid.show("Please select start and end dates.", ToastAndroid.SHORT)
                            } else if (this.state.startTime == '' || this.state.endTime == '') {
                                CommonHelpers.showFlashMsg("Please select the Start Time", "danger");
                            }
                            else if (this.state.seats == 0) {
                                CommonHelpers.showFlashMsg("There should be atleast one seat.", "danger");
                                //ToastAndroid.show("Please enter the number of seats", ToastAndroid.SHORT);
                            }
                            else if (VASCheck == 1) {
                                //console.log('VAS is zero');

                            }
                            else {
                                const property_info = this.props.route.params.bookingData.property_info;
                                const resource_plan_details = this.props.route.params.bookingData.resource_plan_details;
                                const user_data = await Session.getUserDetails();
                                const parsedData = JSON.parse(user_data);

                                //console.log("property info: *********", property_info);


                                const bookingDetails = {
                                    is_direct_booking: this.props.route.params.bookingData.resource_plan_details.admin_only == 0 && this.props.route.params.bookingData.resource_plan_details.is_only_request_booking == 0 && parsedData.role_id == 5 ? 1 : 0,
                                    property_name: this.props.route.params.bookingData.property_name,
                                    unitprice: this.props.route.params.bookingData.cost,
                                    property_location: this.props.route.params.bookingData.property_location,
                                    //rating: this.props.route.params.bookingData.rating,
                                    image_path: this.props.route.params.bookingData.image_path,
                                    plan_name: this.props.route.params.bookingData.plan_name,
                                    unitsBooked: 1,
                                    duration: this.state.totalDays,// this.props.route.params.bookingData.duration,
                                    startDate: this.state.startTime.toString(),
                                    endDate: this.state.endTime.toString(),
                                    baseCost: this.baseCost(Number(this.props.route.params.bookingData.cost)),
                                    seats: this.state.seats,
                                    range: this.state.range,
                                    baseRange: this.state.duration,
                                    rangeType: this.state.rangeType,
                                    VASCost: this.state.VASTotalCost,
                                    CGST: Number(this.state.CGST),
                                    SGST: Number(this.state.SGST),
                                    VAS: this.state.APISelectedVAS,
                                    bookingData: this.props.route.params.bookingData,
                                    totalAmount: (this.baseCost((Number(this.props.route.params.bookingData.cost)) /* *
                                Number(this.state.seats) */) +
                                        Number(this.state.VASTotalCost) +
                                        Number(this.state.CGST) + Number(this.state.SGST)).toFixed(2)/* ( this.props.route.params.bookingData.cost +
                                    this.state.VASTotalCost +
                                    this.state.CGST + this.state.SGST).toFixed(2) */,
                                    resource_plan_details: this.props.route.params.bookingData.resource_plan_details,
                                    details_for_api_request: [{
                                        "booking_type_id": Number(parsedData.role_id) == 5 ? 3 : 6,//parsedData.booking_type_id,
                                        "user_id": Number(await Session.getUserId()),
                                        'corporate_id': parsedData.corporate_id,
                                        "provider_id": property_info[0].provider_id,
                                        "property_id": property_info[0].id,
                                        "resource_plan_id": resource_plan_details.id,
                                        "resource_group_id": this.props.modify ? this.props.route.params.bookingData.modifyItem.resource_group_id : resource_plan_details.resource_group_id,
                                        "resource_id": resource_plan_details.resource_id,
                                        "start_date": moment(this.state.startTime),
                                        "end_date": moment(this.state.endTime),
                                        "total_days": this.state.totalDays,
                                        "no_of_people": this.state.seats,
                                        "total_seats": this.state.seats,
                                        "booking_duration": Number(this.state.range),
                                        "amenities_price": this.state.VASTotalCost,
                                        "period_unit": Number(this.state.range) / Number(this.state.duration),
                                        "total_price": (this.baseCost((Number(this.props.route.params.bookingData.cost)) /* *
                                    Number(this.state.seats) */) +
                                            Number(this.state.VASTotalCost) +
                                            Number(this.state.CGST) + Number(this.state.SGST)).toFixed(2)/* (this.props.route.params.bookingData.cost +
                                        this.state.VASTotalCost +
                                        this.state.CGST + this.state.SGST).toFixed(2) */,
                                        "amenities": this.state.selectedVASList,
                                        "resource_plan": {
                                            "id": resource_plan_details.id,
                                            "plan_name": resource_plan_details.plan_name,
                                            "resource_id": resource_plan_details.resource_id,
                                            "property_id": resource_plan_details.property_id,
                                            "price": resource_plan_details.price,
                                            "description": resource_plan_details.description,
                                            "access_period_unit_id": resource_plan_details.access_period_unit_id,
                                            "image_path": resource_plan_details.image_path,


                                        },
                                        "property_data": property_info[0],
                                        "user_data": parsedData,

                                    }

                                    ]
                                }

                                parsedData.role_id == 7 ? this.showSummaryPage(bookingDetails) :
                                    this.props.route.params.bookingData.resource_plan_details.admin_only == 0 && this.props.route.params.bookingData.resource_plan_details.is_only_request_booking == 0 ?
                                        this.makeDirectBooking(bookingDetails) : this.showSummaryPage(bookingDetails);

                            }


                        }}


                        height={100} style={{
                            bottom: 0,
                            position: 'absolute',
                            width: '100%',
                            height: 70,

                            backgroundColor: "orange",

                            flexDirection: "row", justifyContent: "center", alignItems: "center"
                        }}>
                        <View style={{ flexDirection: "row", justifyContent: "center", alignContent: "center", }}>
                            {
                                this.props.route.params.bookingData.resource_plan_details.admin_only == 0 && this.props.route.params.bookingData.resource_plan_details.is_only_request_booking == 0 ?
                                    <Text style={[font.sizeLarge,
                                    font.regular, color.textWhiteColor, {
                                        //backgroundColor: "orange",
                                        borderColor: "orange",
                                        height: "100%", marginRight: 15
                                    }
                                    ]}>Book Now</Text> :

                                    <Text style={[font.sizeLarge,
                                    font.regular, color.textWhiteColor, {
                                        //backgroundColor: "orange",
                                        borderColor: "orange",
                                        height: "100%", marginRight: 15
                                    }
                                    ]}>Place Booking Request</Text>
                            }
                            <Icon name="arrow-right" size={20} color={"white"} />
                        </View>

                    </TouchableOpacity>


                </View>
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