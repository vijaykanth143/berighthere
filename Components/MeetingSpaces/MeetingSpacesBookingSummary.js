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
import IconUsers from 'react-native-vector-icons/FontAwesome5';
import IconCheck from 'react-native-vector-icons/Ionicons';
import CommonHelpers from '../../Utils/CommonHelpers';
import Session from '../../config/Session';
import DateTimePicker from '@react-native-community/datetimepicker';
import LogoHeader from '../ReusableComponents/LogoHeader';
import { MemberDirectBookingAPI, BookingRequestAPI, MemberDirectBookingCallback } from '../../Rest/userAPI';
import Spinner from '../../Utils/Spinner';
import image from '../../Styles/image';
import Drawer from "react-native-drawer";
import Sidemenu from "../../Navigation/Sidemenu";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { AWS_URL } from '../../config/RestAPI';
import Modal from 'react-native-modalbox';
import {
    termsandconditions, elegibilty_text,
    content_text,
    CLAIMS_OF_COPYRIGHT_INFRINGEMENT_text, user_account_deletion,
    review_text1, review_text2, review_text3,
    review_text4, review_text5, review_text6,
    space_accounts_text1, space_accounts_text2,
    space_accounts_text3, user_accounts_text1, user_accounts_text2,
    disputes_text, third_party_text, link_text, liability_text,
    indem_text, mis_text, mod_text, copyright_text, contact_text, RAZORPAY_KEY
} from '../../config/RestAPI';
import RazorpayCheckout from 'react-native-razorpay';
import CustomePushNotifications from '../CustomePushNotifications';
import Comments from '../ReusableComponents/Comments';



export default class MeetingSpacesBookingSummary extends Component {
    constructor() {
        super();
        this.state = {
            imageSource: '',
            item: {},
            api_data: {},
            planName: '',
            propertyName: '',
            locality: '',
            city: '',
            startDate: '',
            endDate: '',
            duration: '',
            booking_dates: [],
            booking_timings: [],
            hours: null,
            guests: 0,
            enableInvite: false,
            enableRSVP: false,
            planCost: 0,
            baseCost: 0,
            gst: 0,
            totalCost: 0,
            isEnabled: false,
            tncmodal: false,
            role_id: '',
            paymentSuccess: false,
            bookingDetails: {},
            allDiscountCoupons: [],
            displayCoupons: [],
            selectedCoupon: null,
            showCoupons: false,
            newBaseCost: null,

            selectedAddons: [],

            openComments: false, 

        }
    }

    goBack = () => {
        this.props.navigation.goBack();
        return true;
    }

    componentDidMount = async () => {
        this.notifications = CustomePushNotifications.configureNotifis(this.props.navigation);
        this.backHandler = BackHandler.addEventListener(
            "hardwareBackPress",
            this.goBack
        );

        const sessionData = JSON.parse(await Session.getMeetingSpacesData());
        //console.log(sessionData)
        if (sessionData != null) {
            await Session.setMeetingSpacesData('null');
            const resource = sessionData.item;
            const API_DATA = sessionData.API_DATA.API_DATA;
            //console.log('summary', API_DATA)
            const data = sessionData;
            const role_id = await Session.getRoleId();

            this.setState({
                imageSource: resource.image_path.length != 0 ? { uri: AWS_URL + resource.image_path[0].image_path } : require('../../Assets/images/BRHlogoorange.png'),
                item: resource,
                api_data: API_DATA,
                planName: resource.plan_name,
                propertyName: API_DATA.pseudoname,
                locality: API_DATA.locality,
                city: API_DATA.city.name == null ? '' : API_DATA.city.name,
                startDate: moment(sessionData.startDate),
                endDate: moment(sessionData.endDate),
                duration: sessionData.duration,
                hours: sessionData.hours,
                booking_dates: sessionData.booking_dates != null ? sessionData.booking_dates : [],
                guests: sessionData.guests,
                enableInvite: sessionData.invite,
                enableRSVP: sessionData.rsvp,
                planCost: data.planCost,
                baseCost: data.baseCost,
                gst: data.gst,
                totalCost: data.totalCost,
                role_id: role_id,
                paymentAttemptsRemaining: 3,
                allDiscountCoupons: API_DATA.discounts_coupons,
                selectedAddons: data.selectedAddons,


            }, () => {
                let booking_timings = [];
                this.state.booking_dates.length != 0 && this.state.hours != null && this.state.booking_dates.forEach((item, index) => {

                    if (item.offDay == 0) {
                        const timing = {

                            "start_date_time": new Date(item.startTime),//"2022-09-29T18:30:00.000Z",

                            "end_date_time":new Date( item.endTime),//"2022-09-29T18:30:00.000Z"


                        }
                        booking_timings.push(timing);

                    }
                })
                this.setState({
                    booking_timings: booking_timings,

                }, ()=>{
                    console.log('booking dates are ******', this.state.booking_timings);
                })
                this.setDisplayCoupons();

            })

        }
        else {
            const resource = this.props.route.params.data.item;
            const API_DATA = this.props.route.params.data.API_DATA.API_DATA;
            //console.log('summary', API_DATA)
            const data = this.props.route.params.data;
            const role_id = await Session.getRoleId();
            //console.log('booking days****', this.props.route.params.data.booking_dates )

            this.setState({
                imageSource: resource.image_path.length != 0 ? { uri: AWS_URL + resource.image_path[0].image_path } : require('../../Assets/images/BRHlogoorange.png'),
                item: resource,
                api_data: API_DATA,
                planName: resource.plan_name,
                propertyName: API_DATA.pseudoname,
                locality: API_DATA.locality,
                city: API_DATA.city.name == null ? '' : API_DATA.city.name,
                startDate: moment(this.props.route.params.data.startDate),
                endDate: moment(this.props.route.params.data.endDate),
                duration: this.props.route.params.data.duration,
                hours: this.props.route.params.data.hours,
                booking_dates: this.props.route.params.data.booking_dates != null ? this.props.route.params.data.booking_dates : [],
                guests: this.props.route.params.data.guests,
                enableInvite: this.props.route.params.data.invite,
                enableRSVP: this.props.route.params.data.rsvp,
                planCost: data.planCost,
                baseCost: data.baseCost,
                gst: data.gst,
                totalCost: data.totalCost,
                role_id: role_id,
                paymentAttemptsRemaining: 3,
                allDiscountCoupons: API_DATA.discounts_coupons,
                selectedAddons: this.props.route.params.data.selectedAddons,


            }, () => {
                let booking_timings = [];
                this.state.booking_dates.length != 0 && this.state.hours != null && this.state.booking_dates.forEach((item, index) => {

                    if (item.offDay == 0) {
                        const timing = {
                            /* "start_date_time": "2022-11-18T15:30:00+05:30",
                            "end_date_time": "2022-11-18T17:30:00+05:30" */

                            "start_date_time": moment(item.startTime),//"2022-09-29T18:30:00.000Z",

                            "end_date_time": moment(item.endTime),//"2022-09-29T18:30:00.000Z"


                        }
                        booking_timings.push(timing);

                    }
                })
                this.setState({
                    booking_timings: booking_timings,

                }, ()=>{
                    console.log('bokking timings are : ***', this.state.booking_timings);
                })

                this.setDisplayCoupons();
            })

        }



    }


    setDisplayCoupons = async () => {

        //console.log(JSON.stringify(this.state.allDiscountCoupons));

        const allCoupons = this.state.allDiscountCoupons;
        let displayCoupons = [];
        const userDetails = JSON.parse(await Session.getUserDetails());
        allCoupons.forEach(async (coupon, index) => {
            //console.log(coupon);
            if (coupon.is_specific_user == 1) {
                //console.log('coupon user type', coupon.user_type, 'role id: ', await Session.getRoleId(), 'user id ', await Session.getUserId(), 'corporate id: ',userDetails.corporate_id);
                if (coupon.user_type && Number(await Session.getRoleId()) == 7) {

                    if (coupon.user_discounts_coupons != null) {
                        coupon.user_discounts_coupons.forEach(async (corp_coupon, i) => {
                            //console.log('corp coupon: ', corp_coupon);
                            if (corp_coupon.corporate_id == Number(userDetails.corporate_id)) {

                                displayCoupons.push(coupon);
                                console.log('corp match found: ', displayCoupons);
                            }
                        })
                    }

                } else if (coupon.user_type == 0 && Number(await Session.getRoleId()) == 5) {
                    if (coupon.user_discounts_coupons != null) {
                        coupon.user_discounts_coupons.forEach(async (user_coupon, i) => {
                            //console.log('user coupon: ', user_coupon);
                            if (user_coupon.user_id == Number(await Session.getUserId())) {
                                displayCoupons.push(coupon);
                                console.log('user match found', displayCoupons)
                            }
                        })
                    }

                }
            }
            else {
                displayCoupons.push(coupon);
                //console.log('***', displayCoupons)

            }

        });

        this.setState({
            displayCoupons: displayCoupons
        }, () => {
            console.log('display Coupons: ******', this.state.displayCoupons);
        })
        // //console.log('display coupons: ', displayCoupons);
        // return displayCoupons;

    }

    makeEmpDirectBooking = (bookingDetails) => {
        //console.log(JSON.stringify(bookingDetails));

        MemberDirectBookingAPI(bookingDetails).then(result => {
            //console.log(result.status);
            //console.log("result: booking status", result.dataArray.booking_status)
            if (result.status) {
                //console.log( result.dataArray);
                CommonHelpers.showFlashMsg(result.message, "success");
                bookingDetails = { ...bookingDetails, direct_booking_details: result.dataArray }
                this.setState({
                    bookingDetails: bookingDetails,
                }, () => {
                    //console.log(this.state.bookingDetails.direct_booking_details.id);
                })
                //console.log("result: booking status", result.dataArray.booking_status)
                /* if (Number(result.dataArray.booking_status) == 6){
                  //console.log("showing the payment pop up as booking status is ", result.dataArray.booking_status);
                  //show the payment pop up. 
                  this._handleRazorpay();
                }
                else  */if (Number(result.dataArray.booking_status) == 3 || Number(result.dataArray.booking_status) == 1) {
                    this.props.navigation.push('TopTabNavigator');
                }
            }
            else {
                CommonHelpers.showFlashMsg(result.message, "danger");
                this.openPropertyDetail();
            }
        }).catch(error => { }//console.log("member direct booking error", error)
        )
    }

    openPropertyDetail = () => {
        const params = {
            'property_id': Number(this.state.item.property_id),
            'resource_id': Number(this.state.item.resource_id)
        }
        //console.log(this.props.route.params.bookingDetails.resource_plan_details);
        //console.log("Pressed")
        this.props.navigation.navigate('meetingspacedetail', {
            params: params,
        });

    };

    _makeBookingRequest = (params) => {
        //console.log("params for booking", JSON.stringify(params));
        this.setState({
            spinner: true,
        })
        BookingRequestAPI(params).then((result) => {
            //console.log("Result", result.status);
            this.setState({
                spinner: false,
            })

            if (result.status == true) {
                this.props.navigation.push('bookingrequestreceived');

            } else {
                if (result.message == "Network Error") {
                    console.error("Network Error")
                } else {
                    console.error(result.message, "danger");
                    CommonHelpers.showFlashMsg(result.message, 'danger');
                }
                this.props.navigation.goBack();
            }
        });
    }

    _handleRazorpay = async () => {
        let user_details = await Session.getUserDetails();
        user_details = JSON.parse(user_details);
        //const order_id = 'order_'+this.props.route.params.bookingDetails.direct_booking_details.booking_id;
        // //console.log(this.props.route.params.bookingDetails.direct_booking_details.id);
        //console.log(this.state.item.image_path);
        var amount = Math.round(this.state.totalCost);
        var options = {
            description: 'Direct Booking Payment.',
            image: this.state.item.image_path.length != 0 ? AWS_URL + this.state.item.image_path[0].image_path : 'https://i.imgur.com/3g7nmJC.png',
            currency: 'INR',
            //key: 'rzp_test_P6I9FiuDfakrt0',
            key: RAZORPAY_KEY,
            amount: Number(amount) * 100,
            name: 'Be Right Here',
            //order_id: JSON.stringify(this.props.route.params.bookingDetails.direct_booking_details.id),//'order_DslnoIgkIDL8Zt',//Replace this with an order_id created using Orders API.
            prefill: {
                email: user_details.email,
                contact: user_details.mobile_no,
                name: user_details.name
            },
            theme: { color: 'orange' },
            timeout: 300,
            retry: {
                enabled: true,
                max_count: 3
            },

        }
        RazorpayCheckout.open(options).then(async (data) => {
            // handle success
            CommonHelpers.showFlashMsg("Payment Successful.")
            //console.log(`Success: ${data.razorpay_payment_id}`);
            this.setState({
                paymentSuccess: true,
            }, () => {
                CustomePushNotifications.paymentSuccess('Payment success', "Transaction completed successfully.", this.notifications);

                this.razor_callback(data.razorpay_payment_id);

            });

        }).catch((error) => {
            this.setState({
                paymentSuccess: false,
                paymentAttemptsRemaining: 0
            }, () => {
                console.log("payment failed: ", error, this.state.paymentSuccess, this.state.paymentAttemptsRemaining);
                if (error.description == "timeout" || error.code == 0 || error.code == 2 || error.code == 5 || error.error.reason == "payment_cancelled") {
                    this.props.navigation.goBack();

                    CommonHelpers.showFlashMsg("Payment Cancelled", "danger");
                }
                else {
                    this.razor_callback(error.error.metadata.payment_id);
                    this.props.navigation.navigate('booking', {
                        bookingData: this.props.route.params.bookingDetails.bookingData,
                    });
                }

            })
            //handle failure
            // alert(`Error: ${error.code} | ${error.description}`);
        });

    }

    setAlerts = (refid) => {
        ////console.log('id is : ', id,)


        if (this.state.hours != null) {
            this.state.booking_dates.forEach((item) => {
                if (item.offDay == 0) {

                    const id = JSON.stringify(moment(item.startTime).format('DDMMYYYY') + refid);
                    //console.log( JSON.stringify(moment(item.startTime).format('DDMMYYYY')) +refid);
                    ////console.log("meeting ids:", moment(item.startTime).format('DDMMYYYY'))
                    const alert_time = CommonHelpers.getOneHourAlertTime(item.startTime);
                    CustomePushNotifications.meetingReminder(alert_time, this.notifications, {}, id);
                }
            })
        }
        else {
            this.state.booking_dates.forEach((item) => {
                if (item.offDay == 0) {

                    const id = JSON.stringify(moment(item.dateobj).format('DDMMYYYY') + refid);
                    //console.log( JSON.stringify(moment(item.dateobj).format('DDMMYYYY')) +refid);
                    ////console.log("meeting ids:", moment(item.startTime).format('DDMMYYYY'))
                    const alert_time = CommonHelpers.getOneHourAlertTime(item.dateobj);
                    CustomePushNotifications.meetingReminder(alert_time, this.notifications, {}, id);
                }
            })

        }

    }

    onFilterClosed = () => {
         this.props.navigation.push('TopTabNavigator'), {
                payment: true,
            };
        this.setState({
            openComments: false,
        })

    }

    razor_callback = async (razorpay_payment_id) => {
        this.setState({
            spinner: true
        })
        //console.log(this.state.role_id);
        //console.log(this.state.bookingDetails.direct_booking_details);
        const params = {
            "payment_id": razorpay_payment_id,
            "user_id": Number(await Session.getUserId()),
            "is_direct_booking": 1,
            "booking_id": this.state.bookingDetails.direct_booking_details.id,
            "reference_id": this.state.bookingDetails.direct_booking_details.booking_id,
        }

        MemberDirectBookingCallback(params).then(result => {
            //console.log("razorpay callback result: ", result.status, result.message);
            this.setState({
                spinner: false,
            })
            if (result.status) {
                //console.log(result.message);
                this.setAlerts(this.state.bookingDetails.direct_booking_details.id);
                /* this.setState({
                    openComments: true, 
                }) */
                this.props.navigation.push('TopTabNavigator'), {
                    payment: true,
                };
            }

            //CommonHelpers.showFlashMsg(result.message, "success");
            else
                CommonHelpers.showFlashMsg(result.message, "danger");

        }).catch(error => { }//console.log(error)
        )

    }

    makeDirectBooking = (bookingDetails) => {
        ////console.log(JSON.stringify(bookingDetails.details_for_api_request[0]));
        //console.log(bookingDetails);
        MemberDirectBookingAPI(bookingDetails).then(result => {
            //console.log('API result *******',result.dataArray );
            if (result.status) {
                CommonHelpers.showFlashMsg(result.message, "success");
                bookingDetails = { ...bookingDetails, direct_booking_details: result.dataArray }
                ////console.log("booking details with direct booking info", bookingDetails);
                //this.showSummaryPage(bookingDetails);
                this.setState({
                    bookingDetails: bookingDetails
                })
                this._handleRazorpay();
            }
            else {
                CommonHelpers.showFlashMsg(result.message, "danger");
                this.openPropertyDetail();
            }
        }).catch(error => {////console.log("member direct booking error", error)
        }
        )
    }


    closeControlPanel = () => {
        this._drawer.close()
    };
    openControlPanel = () => {
        this._drawer.open()
    };

    calGST = (baseCost) => {
        // console.log(this.baseCost(Number(this.state.data.resource_plan.price)), this.state.data.resource_plan != null ? this.state.data.resource_plan.price : 0)
        const GST = (Number(baseCost) * 18) / 100;
        this.setState({
            cgst: GST / 2,
            sgst: GST / 2,
            gst: GST,
            totalCost: Number(baseCost) + GST
        })
        console.log('GST is ', GST)
       // return Math.round(GST)
    }

    applyDiscount = () => {
        console.log(this.state.selectedCoupon.is_percentage)
        if (this.state.selectedCoupon.is_percentage) {
            let baseCost = this.state.baseCost;
            let newBaseCost = Number(baseCost) - (Number(this.state.selectedCoupon.amount) / 100) * Number(baseCost);

            console.log('new base cost : ', newBaseCost);
            this.setState({
                newBaseCost: newBaseCost,

            }, () => {
                this.calGST(this.state.newBaseCost);
            })
        } else if (this.state.selectedCoupon.is_percentage == 0) {
            let baseCost = this.state.baseCost;
            let newBaseCost = Number(baseCost) - Number(this.state.selectedCoupon.amount);
            console.log('new base cost : ', newBaseCost);
            this.setState({
                newBaseCost: newBaseCost,
            }, () => {
                this.calGST(this.state.newBaseCost);
            })
        }
    }

    removeDiscount = () => {
        this.calGST(this.state.baseCost);
    }

    render() {
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
                <KeyboardAwareScrollView /*  height={'90%'}  */ style={{ marginBottom: 70 }}>
                    {/* Header */}
                    <LogoHeader
                        from='summarymeetingspaces'
                        navigation={this.props.navigation}
                        title='Booking Summary'
                        onBarsPress={() => {
                            this.openControlPanel()
                        }}
                    />

                    <View height={150} style={[box.centerBox, box.horizontalBox, { padding: '5%', marginBottom: '1%' }]}>
                        <Image source={this.state.imageSource} style={[image.imageContain, {
                            width: Dimensions.get('screen').width * 0.45,
                            height:/*  150,//Dimensions.get('screen').width*0.45  */'100%'
                        }]} />
                        <View style={[box.centerBox, { padding: 10 }]}  >
                            <View>
                                <Text style={[
                                    font.semibold,
                                    font.sizeMedium,
                                    color.lightBlack, { flexWrap: 'wrap' }
                                ]}>{this.state.planName}</Text>
                                <Text style={[
                                    font.regular,
                                    font.sizeRegular,
                                    color.darkgrayColor,
                                ]}>{this.state.propertyName}</Text>

                                <Text style={[
                                    font.regular,
                                    font.sizeRegular,
                                    color.darkgrayColor,
                                ]}>{this.state.api_data.locality}, {this.state.city}</Text>

                            </View>

                            <View style={[box.horizontalBox, { justifyContent: 'flex-start' }]}>
                                {this.state.api_data.property_timings != null && this.state.api_data.property_timings.map((day, index) => {
                                    return (
                                        <Text style={[
                                            font.regular,
                                            font.sizeVeryRegular,
                                            day.is_open == 1 ? color.myOrangeColor : color.grayColor, {
                                                paddingLeft: 5
                                            }

                                        ]}>{CommonHelpers.getDay(day.day_code)}</Text>
                                    );

                                })
                                }

                            </View>
                            <Text>{this.state.api_data.start_at} to {this.state.api_data.end_at}</Text>

                            <StarRatingComponent 
                                rating={5}
                                readonly={true}
                            />

                        </View>
                    </View>

                    {/* start date and end date */}
                    <View height={100} style={[box.centerBox, box.horizontalBox, { alignItems: 'center', marginBottom: '1%', }]}>

                        <Image source={require('../../Assets/images/mybookings.png')} style={[image.imageContain, { width: 40, height: 40, }]} />
                        <View>
                            <Text style={[
                                font.semibold,
                                font.sizeRegular,
                                color.lightBlack
                            ]}>From</Text>
                            <Text style={[
                                font.semibold,
                                font.sizeRegular,
                                color.lightBlack
                            ]}>{moment(this.state.startDate).format('DD MMM YYYY')}</Text>
                        </View>

                        <View>
                            <Text style={[
                                font.semibold,
                                font.sizeRegular,
                                color.lightBlack
                            ]}>To</Text>
                            <Text style={[
                                font.semibold,
                                font.sizeRegular,
                                color.lightBlack
                            ]}>{moment(this.state.endDate).format('DD MMM YYYY')}</Text>
                        </View>


                        <View>
                            <Text style={[
                                font.semibold,
                                font.sizeRegular,
                                color.lightBlack
                            ]}>Working Days</Text>
                            <View style={[box.horizontalBox]}>
                                <Text style={[
                                    font.semibold,
                                    font.sizeRegular,
                                    color.lightBlack, {
                                        marginRight: 10
                                    }
                                ]}>{this.state.duration}</Text>
                                {

                                    this.state.booking_dates.length != 0
                                    &&
                                    this.state.booking_dates.slice(
                                        0, this.state.booking_dates.length >= 7
                                        ? 7 :
                                        this.state.booking_dates.length).map((day, index) => {
                                            return (
                                                <Text style={[
                                                    font.regular,
                                                    font.sizeVeryRegular,
                                                    day.offDay == 0 ? color.myOrangeColor : color.grayColor,
                                                    {
                                                        // paddingLeft: 5,
                                                        textAlign: 'right'
                                                    }
                                                ]}>{CommonHelpers.getDay(day.day)}</Text>
                                            );

                                        })

                                }

                            </View>

                        </View>

                    </View>

                    {/* hour breakup for hourly plan */}

                    {
                        this.state.hours != null ?

                            <View height={Number(this.state.duration) * 40 + 50} style={[box.centerBox, box.horizontalBox, { marginBottom: '1%', justifyContent: 'flex-start', }]}>
                                <Image source={require('../../Assets/images/mybookings.png')} style={[image.imageContain, { width: 40, height: 40, marginRight: 10 }]} />

                                <View width={Dimensions.get('screen').width * 0.8}>
                                    {
                                        this.state.booking_dates.length != 0 && this.state.booking_dates.map((day, index) => {
                                            if (day.offDay == 0) {
                                                return (
                                                    <View height={40} style={[box.horizontalBox,]}>
                                                        <Text style={[
                                                            font.regular,
                                                            font.sizeRegular,
                                                            color.darkgrayColor,
                                                            {
                                                                width: (Dimensions.get('screen').width * 0.8) / 8,
                                                               // backgroundColor: 'red'
                                                            }
                                                        ]}>{moment(day.startTime).format('ddd')}</Text>
                                                        <Text style={[
                                                            font.regular,
                                                            font.sizeRegular,
                                                            color.darkgrayColor,
                                                            {
                                                                width: (Dimensions.get('screen').width * 0.8) / 3,
                                                               // backgroundColor: 'pink'
                                                            }
                                                        ]}>{day.date}</Text>
                                                        <Text style={[
                                                            font.regular,
                                                            font.sizeRegular,
                                                            color.darkgrayColor,
                                                            {
                                                                width: (Dimensions.get('screen').width * 0.8) / 4,
                                                               // backgroundColor: 'pink'
                                                            }
                                                        ]}>{moment(day.startTime).format('hh:mm A')}</Text>
                                                        <Text style={[
                                                            font.regular,
                                                            font.sizeRegular,
                                                            color.darkgrayColor,
                                                            {
                                                                width: (Dimensions.get('screen').width * 0.8) / 4,
                                                                //backgroundColor: 'pink'
                                                            }
                                                        ]}>{moment(day.endTime).format('hh:mm A')}</Text>
                                                    </View>
                                                );
                                            }
                                        })
                                    }
                                    <Text style={[
                                        font.regular,
                                        font.sizeVeryRegular,
                                        color.myOrangeColor, { textAlign: 'right' }

                                    ]}>Total Hours: {this.state.hours}</Text>
                                </View>

                            </View>
                            : null


                    }

                    {/* guest, invite and rsvp */}

                    <View height={80} style={[box.centerBox, box.horizontalBox, { alignItems: 'center', marginBottom: '1%' }]}>

                        <View style={{
                            flexDirection: 'row',
                            alignItems: 'center',

                            width: Dimensions.get('screen').width / 4,
                            justifyContent: 'space-around'
                        }}>
                            <IconUsers
                                name={'users'}
                                size={20}
                                color={color.whiteBackground.backgroundColor}
                                style={{
                                    padding: 8,
                                    backgroundColor: color.myOrangeColor.color,
                                    borderRadius: 100
                                }}
                            />
                            <Text>{this.state.guests}</Text>
                        </View>

                        <View style={{
                            flexDirection: 'row',
                            alignItems: 'center',

                            width: Dimensions.get('screen').width / 4,
                            justifyContent: 'space-around'
                        }}>
                            <IconCheck
                                name={'checkmark'}
                                size={20}
                                color={color.whiteBackground.backgroundColor}
                                style={{
                                    padding: 8,
                                    backgroundColor: this.state.enableInvite ? color.myOrangeColor.color : color.darkgrayColor.color,
                                    borderRadius: 100
                                }}
                            />
                            <Text>Invite</Text>
                        </View>

                        <View style={{
                            flexDirection: 'row',
                            alignItems: 'center',

                            width: Dimensions.get('screen').width / 4,
                            justifyContent: 'space-around'
                        }}>
                            <Icon
                                name={'times'}
                                size={20}
                                color={color.whiteBackground.backgroundColor}
                                style={{
                                    padding: 8,
                                    backgroundColor: this.state.enableRSVP ? color.myOrangeColor.color : color.darkgrayColor.color,
                                    borderRadius: 100
                                }}
                            />
                            <Text>RSVP</Text>
                        </View>

                    </View>


                    {/* Add ons */}
                    {
                        this.state.selectedAddons.length != 0 ? 
                        <View height = {80 + this.state.selectedAddons.length*35 } style = {[box.centerBox, {
                            justifyContent:'flex-start'
                        }]}>
                            <Text style = {[
                                font.sizeRegular, 
                                font.bold, 
                                color.darkgrayColor,
                               { marginBottom : 20
}
                            ]}>VALUE ADDED SERVICES</Text>

                            {
                                this.state.selectedAddons.map((addon, index)=>{
                                    console.log(addon);
                                    return(
                                        <View style = {[box.horizontalBox, {marginBottom :'5%', alignItems:'center',/*  justifyContent:'center' */}]}>
                                            <View style = {[box.horizontalBox]}>
                                                <Image source = {{uri: AWS_URL+addon.icon_path}} style = {[image.userImage, {marginRight: 5}]}/>
                                                <Text style = {[
                                                    font.sizeVeryRegular, 
                                                    font.regular, 
                                                    color.darkgrayColor, 

                                                ]}>{addon.amenity_name}</Text>
                                                </View>

                                                <Text style  ={[
                                                    font.sizeVeryRegular, 
                                                    font.regular, 
                                                    color.darkgrayColor
                                                ]}>
                                                    @ {'\u20B9'}{addon.fee_per_unit == null ? 0: Intl.NumberFormat("en-IN").format(addon.fee_per_unit)} per Person
                                                </Text>

                                                <Text style  ={[
                                                    font.sizeVeryRegular, 
                                                    font.regular, 
                                                    color.darkgrayColor
                                                ]}>
                                                    X {addon.inputValue} Persons
                                                </Text>

                                                <Text style  ={[
                                                    font.sizeVeryRegular, 
                                                    font.regular, 
                                                    color.darkgrayColor
                                                ]}>
                                                    {'\u20B9'}{Intl.NumberFormat("en-IN").format(addon.totalCost)}
                                                </Text>





                                            </View>
                                    );
                                })
                            }
                        </View>
                        
                        :null
                    }

                    {/* Discounts */}
                    {
                        this.state.displayCoupons.length > 0 ?
                            <TouchableOpacity
                                onPress={() => {
                                    this.setState({
                                        showCoupons: !this.state.showCoupons,
                                    })
                                }}
                                height={60}
                                style={[box.centerBox]}
                            >
                                <Text style={[font.semibold, font.sizeVeryRegular, color.myOrangeColor, {
                                    textDecorationLine: 'underline',
                                    textDecorationColor: color.myOrangeColor.color
                                }]}>Apply a Discount Coupon</Text>

                            </TouchableOpacity>
                            : null
                    }
                    {
                        this.state.showCoupons &&
                        <View
                            height={this.state.displayCoupons.length * 80}
                            style={[box.centerBox,
                            ]}
                        >
                            {
                                this.state.displayCoupons.map((coupon, index) => {
                                    return (
                                        <View style={[box.horizontalBox, button.winnerButton,
                                        {
                                            width: '100%',
                                            borderRadius: 10,
                                            padding: 10,
                                            height: 60,
                                            backgroundColor: this.state.selectedCoupon != null && this.state.selectedCoupon.id == coupon.id ? color.myOrangeColor.color : color.whiteBackground.backgroundColor,

                                            alignItems: 'center'
                                        }]}>

                                            <Text style={[
                                                font.semibold,
                                                font.sizeMedium,
                                                this.state.selectedCoupon != null && this.state.selectedCoupon.id == coupon.id ? color.textWhiteColor :
                                                    color.myOrangeColor,

                                            ]}>{coupon.coupon_code}</Text>
                                            {
                                                this.state.selectedCoupon != null && this.state.selectedCoupon.id == coupon.id ?
                                                    <TouchableOpacity onPress={() => {
                                                        //console.log(coupon);

                                                        this.setState({
                                                            newBaseCost: null,
                                                            selectedCoupon: null,
                                                        }, () => {
                                                            this.removeDiscount();
                                                            console.log('selected coupon: ', this.state.selectedCoupon)
                                                        })
                                                    }} >
                                                        <Text style={[
                                                            font.bold,
                                                            font.sizeRegular,
                                                            this.state.selectedCoupon != null && this.state.selectedCoupon.id == coupon.id ? color.textWhiteColor : color.myOrangeColor
                                                        ]}>{'Remove'}</Text>
                                                    </TouchableOpacity>
                                                    :
                                                    <TouchableOpacity onPress={() => {
                                                        console.log(coupon);

                                                        this.setState({
                                                            selectedCoupon: coupon
                                                        }, () => {
                                                            console.log('selected coupon: ', this.state.selectedCoupon);
                                                            this.applyDiscount();
                                                        })
                                                    }} >
                                                        <Text style={[
                                                            font.bold,
                                                            font.sizeRegular,
                                                            this.state.selectedCoupon != null && this.state.selectedCoupon.id == coupon.id ? color.textWhiteColor : color.myOrangeColor
                                                        ]}>{'Apply'}</Text>
                                                    </TouchableOpacity>

                                            }
                                        </View>
                                    )
                                })
                            }

                        </View>

                    }

                    {/* Bill details */}

                    <View height={270} style={[box.centerBox, { marginBottom: '1%' }]} >
                        <Text
                            style={[
                                font.semibold,
                                font.sizeLarge,
                                color.lightBlack,

                                {
                                    borderBottomColor: color.myOrangeColor.color,
                                    borderBottomWidth: 1,
                                    textAlign: 'left'
                                }
                            ]}
                        >BILL DETAILS</Text>
                        <View
                            style={[box.horizontalBox]}>
                            <Text style={[
                                font.semibold,
                                font.sizeRegular,
                                color.darkgrayColor,
                                { width: '50%' }

                            ]}>Plan Cost</Text>
                            <Text style={[
                                font.semibold,
                                font.sizeRegular,
                                color.darkgrayColor,
                                { width: '50%', textAlign: 'right' }

                            ]}>{'\u20B9'}{Intl.NumberFormat("en-IN").format(this.state.planCost)}</Text>
                        </View>
                        <View
                            style={[box.horizontalBox]}>
                            <Text style={[
                                font.semibold,
                                font.sizeRegular,
                                color.darkgrayColor,
                                { width: '50%' }

                            ]}>{this.state.hours == null ? 'Duration' : 'Number of hours'}</Text>
                            <Text style={[
                                font.semibold,
                                font.sizeRegular,
                                color.darkgrayColor,
                                { width: '50%', textAlign: 'right' }

                            ]}>{this.state.hours == null ? this.state.duration : this.state.hours}</Text>
                        </View>
                        <View
                            style={[box.horizontalBox]}>
                            <Text style={[
                                font.semibold,
                                font.sizeRegular,
                                color.darkgrayColor,
                                { width: '50%' }

                            ]}>Total</Text>
                            <Text style={[
                                font.semibold,
                                font.sizeRegular,
                                color.darkgrayColor,
                                { width: '50%', textAlign: 'right' }

                            ]}>{'\u20B9'}{Intl.NumberFormat("en-IN").format(this.state.baseCost)}</Text>
                        </View>
                        {
                            this.state.newBaseCost !=null ?
                            <View
                            style={[box.horizontalBox]}>
                                {
                                    this.state.selectedCoupon.is_percentage ? 
                                    <Text style={[
                                        font.semibold,
                                        font.sizeRegular,
                                        color.darkgrayColor,
                                        { width: '50%' }
        
                                    ]}>After {this.state.selectedCoupon.amount}% discount</Text>:

                                    <Text style={[
                                        font.semibold,
                                        font.sizeRegular,
                                        color.darkgrayColor,
                                        { width: '50%' }
        
                                    ]}>Discount Amount</Text>



                                }

                                {
                                    this.state.selectedCoupon.is_percentage ?
                                
                            
                            <Text style={[
                                font.semibold,
                                font.sizeRegular,
                                color.darkgrayColor,
                                { width: '50%', textAlign: 'right' }

                            ]}>-{'\u20B9'}{Intl.NumberFormat("en-IN").format((Number(this.state.selectedCoupon.amount)/100)* Number(this.state.baseCost))}</Text>
                        :
                        <Text style={[
                            font.semibold,
                            font.sizeRegular,
                            color.darkgrayColor,
                            { width: '50%', textAlign: 'right' }

                        ]}>-{'\u20B9'}{Intl.NumberFormat("en-IN").format(Number(this.state.selectedCoupon.amount))}</Text>
                        }
                            </View>
                            
                            :null
                        }
                        {
                            this.state.newBaseCost != null ?
                            <View
                            style={[box.horizontalBox]}>
                            <Text style={[
                                font.semibold,
                                font.sizeRegular,
                                color.darkgrayColor,
                                { width: '50%' }

                            ]}>After Discount</Text>
                            <Text style={[
                                font.semibold,
                                font.sizeRegular,
                                color.darkgrayColor,
                                { width: '50%', textAlign: 'right' }

                            ]}>{'\u20B9'}{Intl.NumberFormat("en-IN").format(this.state.newBaseCost)}</Text>
                        </View>
                             : null
                        }
                        <Text style={[
                            font.regular,
                            font.sizeVeryRegular,
                            color.darkgrayColor, { width: '50%' }

                        ]}>Taxes</Text>
                        <View
                            style={[box.horizontalBox]}>
                            <Text style={[
                                font.semibold,
                                font.sizeRegular,
                                color.darkgrayColor, { width: '50%' }

                            ]}>CGST</Text>
                            <Text style={[
                                font.semibold,
                                font.sizeRegular,
                                color.darkgrayColor,
                                { width: '50%', textAlign: 'right' }

                            ]}>{'\u20B9'}{Intl.NumberFormat("en-IN").format(Number(this.state.gst) / 2)}</Text>
                        </View>
                        <View
                            style={[box.horizontalBox]}>
                            <Text style={[
                                font.semibold,
                                font.sizeRegular,
                                color.darkgrayColor, { width: '50%' }

                            ]}>SGST</Text>
                            <Text style={[
                                font.semibold,
                                font.sizeRegular,
                                color.darkgrayColor,
                                { width: '50%', textAlign: 'right' }

                            ]}>{'\u20B9'}{Intl.NumberFormat("en-IN").format(Number(this.state.gst) / 2)}</Text>
                        </View>

                        <View
                            style={[box.horizontalBox, { borderTopWidth: 1, borderTopColor: color.myOrangeColor.color }]}>
                            <Text style={[
                                font.semibold,
                                font.sizeLarge,
                                color.myOrangeColor, { width: '50%' }

                            ]}>Amount to Pay</Text>
                            <Text style={[
                                font.semibold,
                                font.sizeLarge,
                                color.myOrangeColor,
                                { width: '50%', textAlign: 'right' }

                            ]}>{'\u20B9'}{Intl.NumberFormat("en-IN").format(this.state.totalCost)}</Text>
                        </View>



                    </View>

                    {/* Terms and conditions */}

                    <View height={50} style={[box.simpleBox,
                    {
                        flexDirection: 'row',
                        justifyContent: "flex-start",
                        alignItems: "center"
                    }]}>
                        <Switch
                            trackColor={{ false: "#767577", true: "orange" }}
                            thumbColor={this.state.isEnabled ? "#fff" : "#f4f3f4"}
                            ios_backgroundColor="#3e3e3e"
                            onValueChange={value => {
                                //console.log(value)
                                this.setState({
                                    isEnabled: value,
                                })
                            }}
                            value={this.state.isEnabled}
                        />
                        <TouchableOpacity onPress={() => {
                            this.setState({
                                tncmodal: true,
                            })
                        }}>
                            <Text style={[
                                font.regular,
                                font.sizeRegular,
                                color.orangeColor,
                                {
                                    marginLeft: "2%",
                                    textDecorationLine: 'underline',
                                    textDecorationColor: "orange"
                                }]}>
                                Terms and Conditions.
                            </Text>
                        </TouchableOpacity>

                    </View>






                </KeyboardAwareScrollView>


                {
                    Number(this.state.role_id) == 7 ?
                        this.state.paymentSuccess ?
                            <View height={70} style={{

                                flexDirection: 'row',
                                justifyContent: 'space-between'
                                , position: "absolute",
                                bottom: 0,
                                padding: '1%'
                            }}>
                                <TouchableOpacity
                                    onPress={() => {
                                        console.log('PAYMENT DONE')
                                        //this.props.navigation.goBack();
                                    }}
                                    style={[button.defaultRadius, { borderColor: color.darkgrayColor.color, alignItems: 'center', justifyContent: 'center' }]}>
                                    <Text style={[
                                        font.semibold,
                                        font.sizeExtraLarge,
                                        color.darkgrayColor
                                    ]}>DONE</Text>
                                </TouchableOpacity>


                            </View>


                            :

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
                                    onPress={async () => {
                                        //console.log("start_date", moment(this.state.startDate).format('DD MM YYYY'),"end_date",moment(this.state.endDate).format('DD MM YYYY'),)
                                        const user_data = await Session.getUserDetails();
                                        const parsedData = JSON.parse(user_data);

                                        const details_for_api_request = {
                                            "user_id": Number(await Session.getUserId()),
                                            "provider_id": this.state.api_data.provider_id,
                                            "property_id": this.state.item.property_id,
                                            "resource_group_id": this.state.item.resource_group_id,
                                            "resource_id": this.state.item.resource_id,
                                            "resource_plan_id": this.state.item.id,
                                            "corporate_id": parsedData.corporate_id,
                                            "booking_type_id": Number(parsedData.role_id) == 5 ? 3 : 6,
                                            "period_quantity": this.state.duration,
                                            "start_date": moment(this.state.startDate),
                                            "end_date": moment(this.state.endDate),
                                            "total_days": this.state.duration,
                                            "no_of_people": 1,
                                            "total_seats": Number(this.state.guests),
                                            "total_price": this.state.totalCost,
                                            "cgst": Number(this.state.gst) / 2,
                                            "sgst": Number(this.state.gst) / 2,
                                            "amenities_price": 0,
                                            "is_invite_guest": 1,
                                            "is_rsvp": 1,
                                            "is_meeting_space_booking": 1,
                                            "hour_plan_timings": this.state.booking_timings,

                                        }
                                        //console.log(details_for_api_request);


                                        if (!this.state.isEnabled) {
                                            CommonHelpers.showFlashMsg("Please accept the Terms and Conditions.", "danger")
                                        }
                                        else if (this.state.item.admin_only == 0 &&
                                            this.state.item.is_only_request_booking == 0) {
                                            this.makeEmpDirectBooking(details_for_api_request)
                                        }
                                        else {
                                            this._makeBookingRequest(details_for_api_request);
                                        }
                                    }}
                                    style={[button.defaultRadius, { borderColor: color.myOrangeColor.color, width: '49%', alignItems: 'center', justifyContent: 'center' }]}>
                                    <Text style={[
                                        font.semibold,
                                        font.sizeExtraLarge,
                                        color.darkgrayColor
                                    ]}>REQUEST NOW</Text>
                                </TouchableOpacity>
                            </View>

                        : //member
                        this.state.item.admin_only == 0 && this.state.item.is_only_request_booking == 0 ?
                            this.state.paymentSuccess ?
                                <View height={70} style={{

                                    flexDirection: 'row',
                                    justifyContent: 'space-between'
                                    , position: "absolute",
                                    bottom: 0,
                                    padding: '1%'
                                }}>
                                    <TouchableOpacity
                                        onPress={() => {
                                            console.log('PAYMENT DONE')
                                            //this.props.navigation.goBack();
                                        }}
                                        style={[button.defaultRadius, { borderColor: color.darkgrayColor.color, alignItems: 'center', justifyContent: 'center' }]}>
                                        <Text style={[
                                            font.semibold,
                                            font.sizeExtraLarge,
                                            color.darkgrayColor
                                        ]}>DONE</Text>
                                    </TouchableOpacity>


                                </View>


                                :

                                this.state.paymentSuccess == false &&
                                    this.state.paymentAttemptsRemaining == 0 ? null :
                                    //direct booking 
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
                                            onPress={async () => {
                                                const user_data = await Session.getUserDetails();
                                                const parsedData = JSON.parse(user_data);
                                                //console.log("start_date", moment(this.state.startDate).format('DD MM YYYY'),"end_date",moment(this.state.endDate).format('DD MM YYYY'),)

                                                const details_for_api_request = {
                                                    "user_id": Number(await Session.getUserId()),
                                                    "provider_id": this.state.api_data.provider_id,
                                                    "property_id": this.state.item.property_id,
                                                    "resource_group_id": this.state.item.resource_group_id,
                                                    "resource_id": this.state.item.resource_id,
                                                    "resource_plan_id": this.state.item.id,
                                                    "corporate_id": parsedData.corporate_id,
                                                    "booking_type_id": Number(parsedData.role_id) == 5 ? 3 : 6,
                                                    "period_quantity": this.state.duration,
                                                    "start_date": moment(this.state.startDate),
                                                    "end_date": moment(this.state.endDate),
                                                    "total_days": this.state.duration,
                                                    "no_of_people": 1,
                                                    "total_seats": Number(this.state.guests),
                                                    "total_price": this.state.totalCost,
                                                    "cgst": Number(this.state.gst) / 2,
                                                    "sgst": Number(this.state.gst) / 2,
                                                    "amenities_price": 0,
                                                    "is_invite_guest": 1,
                                                    "is_rsvp": 1,
                                                    "is_meeting_space_booking": 1,
                                                    "hour_plan_timings": this.state.booking_timings,
                                                }
                                                console.log( 'DATA FOR API: ************' ,JSON.stringify(details_for_api_request));
                                                if (this.state.isEnabled)
                                                    this.makeDirectBooking(details_for_api_request);
                                                else {
                                                    CommonHelpers.showFlashMsg('Please accept the terms and Conditions', 'danger');
                                                }
                                            }}
                                            style={[button.defaultRadius, { borderColor: color.myOrangeColor.color, width: '49%', alignItems: 'center', justifyContent: 'center' }]}>
                                            <Text style={[
                                                font.semibold,
                                                font.sizeExtraLarge,
                                                color.darkgrayColor
                                            ]}>PAY NOW</Text>
                                        </TouchableOpacity>

                                    </View> :
                            //request booking
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
                                    onPress={async () => {

                                        const user_data = await Session.getUserDetails();
                                        const parsedData = JSON.parse(user_data);

                                        const details_for_api_request = {
                                            "user_id": Number(await Session.getUserId()),
                                            "provider_id": this.state.api_data.provider_id,
                                            "property_id": this.state.item.property_id,
                                            "resource_group_id": this.state.item.resource_group_id,
                                            "resource_id": this.state.item.resource_id,
                                            "resource_plan_id": this.state.item.id,
                                            "corporate_id": parsedData.corporate_id,
                                            "booking_type_id": Number(parsedData.role_id) == 5 ? 3 : 6,
                                            "period_quantity": this.state.duration,
                                            "start_date": moment(this.state.startDate),
                                            "end_date": moment(this.state.endDate),
                                            "total_days": this.state.duration,
                                            "no_of_people": 1,
                                            "total_seats": Number(this.state.guests),
                                            "total_price": this.state.totalCost,
                                            "cgst": Number(this.state.gst) / 2,
                                            "sgst": Number(this.state.gst) / 2,
                                            "amenities_price": 0,
                                            "is_invite_guest": 1,
                                            "is_rsvp": 1,
                                            "is_meeting_space_booking": 1,
                                            "hour_plan_timings": this.state.booking_timings,
                                        }
                                        //console.log(details_for_api_request);
                                        !this.state.isEnabled ?
                                            CommonHelpers.showFlashMsg("Please accept the Terms and Conditions.", "danger")
                                            :
                                            this._makeBookingRequest(details_for_api_request);


                                    }}
                                    style={[button.defaultRadius, { borderColor: color.myOrangeColor.color, width: '49%', alignItems: 'center', justifyContent: 'center' }]}>
                                    <Text style={[
                                        font.semibold,
                                        font.sizeExtraLarge,
                                        color.darkgrayColor
                                    ]}>REQUEST NOW</Text>
                                </TouchableOpacity>

                            </View>




                }






                {this.state.tncmodal && <Modal position={"center"} swipeToClose={false}
                    onClosed={() => { this.setState({ tncmodal: false }) }}
                    style={{
                        justifyContent: 'space-around',
                        alignItems: 'space-around',
                        padding: 20,
                        height: Dimensions.get('screen').height * 0.7,
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

                {
                    this.state.openComments && <Comments
                    navigation={this.props.navigation}
                    showRatings= {true}
                    promptText={'Rate the booking experience.'}
                    from = {'afterBooking'}
                    closing={() => { this.onFilterClosed() }}
                    />
                }

                {this.state.spinner && <Spinner />}
            </Drawer>

        );
    }
}