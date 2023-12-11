import React, { Component } from 'react';
import { View, Text, Image, BackHandler, TextInput, Dimensions, FlatList, Platform, Linking } from 'react-native';
import image from '../../Styles/image';
import font from '../../Styles/font';
import color from '../../Styles/color';
import IconUsers from 'react-native-vector-icons/FontAwesome5';
import IconCheck from 'react-native-vector-icons/Ionicons';
import IconPen from 'react-native-vector-icons/Ionicons';
import Iconcross from 'react-native-vector-icons/Entypo';
import { bookingInfoAPI, deleteGuest, pushGuestListAPI, cancelMemberBooking, modifyMeeting, checkTimeAvailabilityAPI } from '../../Rest/userAPI';
import CommonHelpers from '../../Utils/CommonHelpers';
import Session from '../../config/Session';
import RenderCarousel from './Reusables/RenderCarousel';
import Drawer from "react-native-drawer";
import Sidemenu from '../../Navigation/Sidemenu';
import LogoHeader from '../ReusableComponents/LogoHeader';
import Collapsible from 'react-native-collapsible';
import SectionHeader from '../ReusableComponents/SectionHeader';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import box from '../../Styles/box';
import renderItem from '../../Styles/renderItem';
import { TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5'
import { StarRatingComponent } from '../ReusableComponents/StarRatingComponent';
import moment from 'moment';
import button from '../../Styles/button';
import { AWS_URL } from '../../config/RestAPI';
import Modal from 'react-native-modalbox';
import Pdf from 'react-native-pdf';
import { SinglePickerMaterialDialog } from 'react-native-material-dialog';
import Mapping from './Reusables/Mapping';
import Clipboard from '@react-native-community/clipboard';
import Spinner from '../../Utils/Spinner';
import DatePicker from 'react-native-date-picker';
import Comments from '../ReusableComponents/Comments';

export default class BookingInformationPage extends Component {

    constructor() {

        super();

        this.state = {

            imageSource: '',

            item: {},

            api_data: {},

            planName: '',

            resourceName: '',

            propertyName: '',

            locality: '',

            city: '',

            startDate: '',

            endDate: '',

            duration: '',

            booking_dates: [],

            hours: null,

            guests: 0,

            guestList: [],

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

            spinner: false,

            carousel_images: [],

            amenities: [],



            guestName: null,

            guestEmail: null,

            guestNumber: null,

            meetingTitle: null,



            collapseGuestList: true,

            showAddGuest: false,

            property_timings: [],

            planType: '',

            weekends: [],

            hourly_plan_time: [],


            rating: 0,


            cancelModal: false,

            cancelItem: {},

            policyDocPath: '',

            policydocName: '',

            cancellationReason: '',



            showPicker: false,

            showMap: false,

            pickerItems: [

                {
                    name: 'Copy',
                },

                {
                    name: 'Show in map'
                }

            ],

            latitude: null,

            longitude: null,

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
            daysAfterModify: 1,
            modifiedPlantype: null,
            modifiedTypeDuration: null,
            modified_booking_dates: [],
            modified_total_booking_days: [],
            showStartTimer: false,
            currentIndex: 0,


            openComments: false,

        }





    }



    componentDidMount = async () => {

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

    setPlan = (access_period_unit_id) => {

        console.log('*******access period unit id: ', access_period_unit_id);



        if (access_period_unit_id == 1) {

            console.log("1 month plan", access_period_unit_id);

            this.setState({

                modifiedPlantype: 'Monthly Plan',

                modifiedTypeDuration: 'Months'

            })

            //return ' Monthly Plan';

        }

        else if (access_period_unit_id == 2) {

            //console.log("Daily plan time");

            this.setState({

                modifiedPlantype: 'Daily Plan',

                modifiedTypeDuration: 'Days'

            })

            // return ' Day Plan';





        }

        else if (access_period_unit_id == 3) {

            //console.log("Hourly plan");

            this.setState({

                modifiedPlantype: 'Hourly Plan',

                modifiedTypeDuration: 'Hours'

            })

            //return ' Hourly Plan';





        }

        else if (access_period_unit_id == 5) {

            //console.log("Weekly plan");

            this.setState({

                modifiedPlantype: 'Weekly Plan',

                modifiedTypeDuration: 'Weeks'

            })

            //return ' Weekly Plan';





        }

        else if (access_period_unit_id == 6) {

            //console.log("Yearly plan");

            this.setState({

                modifiedPlantype: 'Yearly Plan',

                modifiedTypeDuration: 'Years'

            })

            //return ' Yearly Plan';

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

    _getPropertyInfo = async (id) => {

        this.setState({

            spinner: true,

        })

        // console.log('Booking id: ', this.state.item.id, this.state.item);

        bookingInfoAPI({ 'booking_id': Number(id), 'user_id': await Session.getUserId() }).then((result) => {

            this.setState({

                spinner: false,

            });

            console.log('Proeprty info : ', JSON.stringify(result.dataArray[0]), result.status);

            if (result.status) {

                var temp_array = result.dataArray[0].property_images;

                let carousel_images = [];

                temp_array.length != 0 ? carousel_images = CommonHelpers.processRawImages(temp_array) : null;

                console.log(result.dataArray[0]);

                this.setState({

                    allResourcePlans: result.dataArray[0].resource_plan,

                    item: result.dataArray[0],

                    carousel_images: carousel_images,

                    amenities: result.dataArray[0].booking_amenities,

                    guests: result.dataArray[0].total_seats,

                    planName: result.dataArray[0].booking_plan_details.plan_name,

                    resourceName: result.dataArray[0].resource_details.resource_name,

                    propertyName: result.dataArray[0].property_details.property_name,

                    guestList: result.dataArray[0].invited_guests,

                    property_timings: result.dataArray[0].property_timings,

                    weekends: CommonHelpers.offDays(result.dataArray[0].property_timings),

                    hourly_plan_time: result.dataArray[0].hourly_plan_timings,

                    locality: result.dataArray[0].property_details.address1 + ' ' + result.dataArray[0].property_details.address2,

                    latitude: result.dataArray[0].property_details.latitude,

                    longitude: result.dataArray[0].property_details.longitude,


                }, () => {


                    console.log('startDate : ', this.state.item.start_date, 'end date',this.state.item.end_date  );
                    this.calculateBookingDates(Number(this.state.item.total_days) - 1, this.state.item.start_date);

                    if ((moment(new Date()).isBetween(moment(this.state.item.start_date), moment(this.state.item.end_date), undefined, []))|| moment(new Date()).isAfter(moment(this.state.item.end_date))) {

                        this.setState({

                            qrvisible: true

                        })

                    }



                });

                switch (result.dataArray[0].booking_plan_details.access_period_unit_id) {

                    case 1: this.setState({

                        planType: 'Monthly Plan'

                    });

                        break;

                    case 2: this.setState({

                        planType: 'Daily Plan'

                    });

                        break;

                    case 3: this.setState({

                        planType: 'Hourly Plan'

                    });

                        break;



                }

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

    collapse = (section) => {

        switch (section) {

            case "guestlist":

                ////console.log(this.state.collapseResevations)

                this.setState({

                    collapseGuestList: !(this.state.collapseGuestList),

                });



                break;





        }

    }

    calculateBookingDates = (range, startDate) => {

        console.log(range, startDate)



        let endDate = moment(startDate);

        let booking_dates = [];

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

        booking_dates.push(dateObj);

        console.log('weekends,', this.state.weekends, booking_dates);



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

                //console.log(this.state.weekends.indexOf(new Date(endDate).getDay()), range);





            }

            console.log(moment(endDate).format('DD-MM-YYYY'), booking_dates);



            this.setState({

                booking_dates: booking_dates,



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

                booking_dates.push(dateObj);

                //booking_dates.push(dateObj);

                if (this.state.weekends.indexOf(new Date(endDate).getDay()) < 0) {

                    range = range - 1;





                    //console.log(this.state.weekends.indexOf(new Date(endDate).getDay()), range);

                }

                console.log(moment(endDate).format('DD-MM-YYYY'), booking_dates);

            }

            this.setState({

                booking_dates: booking_dates,

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

                booking_dates.push(dateObj);

                //booking_dates.push(dateObj);

                if (this.state.weekends.indexOf(new Date(endDate).getDay()) < 0) {



                    range = range - 1;



                    console.log(this.state.weekends.indexOf(new Date(endDate).getDay()), range);

                }

                console.log(moment(endDate).format('DD-MM-YYYY'), booking_dates);

            }



            this.setState({

                booking_dates: booking_dates

            })



        }

    }

     getTotalHour = () => {

        let totalHours = 0

        this.state.hourly_plan_time.forEach((day, index) => {



            const startTime = day.start_date_time != '' ? moment(day.start_date_time) : 0;

            const endTime = day.end_date_time != '' ? moment(day.end_date_time) : 0;

            console.log('in hours calculation: ',startTime, moment(startTime).format('DD MM YYYY, hh:mm A'), endTime, moment(endTime).format('DD MM YYYY , hh:mm A'));

            const duration = startTime != 0 && endTime != 0 ? moment.duration(endTime.diff(startTime)) : 0;

            const hours = startTime != 0 && endTime != 0 ? duration.asHours() : 0;

            totalHours = totalHours + hours;





        });

        return totalHours;

    } 



    _renderGuests = ({ item, index }) => {



        return (

            <View height={30} style={[box.horizontalBox, {

                marginTop: 10,

                //backgroundColor: 'pink',

                alignItems: 'flex-start',

            }]}>

                <View style={[box.horizontalBox, {

                    alignItems: 'center',

                    justifyContent: 'flex-start',

                    width: Dimensions.get('screen').width * 0.2

                }]}>



                    <TouchableOpacity onPress={() => {

                        let guestList = this.state.guestList;

                        guestList.splice(index, 1);

                        this.setState({

                            guestList: guestList

                        })



                        item.id == null ? null :

                            this.deleteGuest(item.id);





                    }}>

                        <Image source={require('../../Assets/images/Delete.png')}

                            style={{ width: 20, height: 20 }} />



                    </TouchableOpacity>



                    <Text style={[

                        font.regular,

                        font.sizeVeryRegular,

                        color.darkgrayColor, {

                            marginLeft: '5%'

                        }

                    ]}>{item.name}</Text>

                </View>

                <Text style={[

                    font.regular,

                    font.sizeVeryRegular,

                    color.darkgrayColor,

                    { width: Dimensions.get('screen').width * 0.4 }

                ]}>{item.email}</Text>

                <Text style={[

                    font.regular,

                    font.sizeVeryRegular,

                    color.darkgrayColor,

                    { width: Dimensions.get('screen').width * 0.3 }

                ]}>{item.phone}</Text>



                <TouchableOpacity onPress={() => {

                    let guestList = this.state.guestList;



                    guestList[index].is_rsvp = guestList[index].is_rsvp == 1 ? 0 : 1;

                    this.setState({

                        guestList: guestList,

                    })



                }}>

                    {item.is_rsvp == 1 ?

                        <Image source={require('../../Assets/images/Check.png')}

                            style={{ width: 20, height: 20 }} /> :

                        <IconCheck

                            name={'checkmark'}

                            size={20}

                            color={color.whiteBackground.backgroundColor}

                            style={{

                                padding: 0,

                                backgroundColor: color.darkgrayColor.color,

                                borderRadius: 100

                            }}

                        />}

                </TouchableOpacity>





            </View>

        );

    }



    sendInvites = (params) => {

        pushGuestListAPI(params).then(result => {

            console.log(params);

            if (result.status) {

                CommonHelpers.showFlashMsg(result.message, 'success');

                this._getPropertyInfo(this.state.item.id);

            }

            else {

                CommonHelpers.showFlashMsg(result.message);

            }



        })



    }



    deleteGuest = (id) => {

        deleteGuest(id).then(result => {

            if (result.status) {

                CommonHelpers.showFlashMsg(result.message, 'success');

                this._getPropertyInfo(this.state.item.id);

            }

            else {

                CommonHelpers.showFlashMsg(result.message, 'danger');

            }

        })

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



    onFilterClosed = () => {



        this.setState({

            showMap: false,
            openComments: false,

        })

    }



    copyToClipboard = async () => {

        Clipboard.setString(this.state.locality);

        console.log(await Clipboard.getString());

    };



    handleModification = () => {

        this.setState({

            spinner: true,

        })

        //console.log(this.state.item);

        const item = this.state.item;

        let bookingModifiedData = [];

        item.modify_booking.length == 0 ? null :

            item.modify_booking.forEach(element => {

                console.log('element', element)

                if (Number(element.booking_status) == 3) {

                    bookingModifiedData.push(element)

                }

            });

            let booking_timings = [];
            this.state.modified_booking_dates.length !=0 && this.getTotalHours() >0 && this.state.modified_booking_dates.forEach((item,index)=>{
                
                if(item.offDay == 0){
                    const timing = {
                        
                            "start_date_time": item.startTime,//"2022-09-29T18:30:00.000Z",
                    
                            "end_date_time": item.endTime,//"2022-09-29T18:30:00.000Z"
                        
                        
                    }
                    booking_timings.push(timing) ;
                    
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
                requested_resource_plan_id: this.state.selectedResourcePlan!=null ? this.state.selectedResourcePlan.resource_id : this.state.item.resource_plan_id,

requested_no_of_people: this.state.modifiedGuestnumber,

requested_start_date: this.state.modifiedStartDate,

requested_end_date: this.state.modifiedEndDate,

requested_booking_duration: this.state.daysAfterModify,

requested_hourly_plan_timings: this.state.modifiedPlantype == 'Hourly Plan' ? booking_timings :[]

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
                 requested_resource_plan_id: this.state.selectedResourcePlan!=null ? this.state.selectedResourcePlan.resource_id : this.state.item.resource_plan_id,

requested_no_of_people: this.state.modifiedGuestnumber,

requested_start_date: this.state.modifiedStartDate,

requested_end_date: this.state.modifiedEndDate,

requested_booking_duration: this.state.daysAfterModify,

requested_hourly_plan_timings: this.state.modifiedPlantype == 'Hourly Plan' ? booking_timings :[]

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



    openScanPage = (property) => {

        this.props.navigation.push('scanpage', {

            property: property,

            // from : 'meetingSpaces',

        })





    }

    //modify functions for date and time

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

                this.state.item.property_details.start_at.split(':')[0],

                this.state.item.property_details.start_at.split(':')[1],)

            );

            this.setState({

                modifiedStartDate: startTime,//value,

                enableStartDateModify: false



            }, () => {

                this.onDayPress(Number(this.state.daysAfterModify));

            })

        }





    }

    onDayPress = (range) => {

        /*  this.setState({

             currentDay: day

         }) */

        let endDate, startDate;

        const access_period_unit_id = this.state.selectedResourcePlan == null ? this.state.item.booking_plan_details.access_period_unit_id : this.state.selectedResourcePlan.access_period_unit_id;

        console.log(' access period unit id : ', typeof access_period_unit_id, range)



        if (access_period_unit_id == 1) {

            console.log("1 month plan");

            startDate = moment(this.state.modifiedStartDate);

            endDate = startDate.add(Number(range), 'months').subtract(1, 'days');
            endDate = startDate.add(Number(this.state.item.property_details.end_at.split(':')[0])-Number(this.state.item.property_details.start_at.split(':')[0]), 'hours');

            this.setState({

                modifiedEndDate: endDate,

            }, () => {

                console.log('end date after modification: ', this.state.modifiedEndDate, moment(this.state.modifiedEndDate).format('DD MM YYYY , hh:mm A'))

            })

        } else if (access_period_unit_id == 2) {



            startDate = moment(this.state.modifiedStartDate);



            endDate = this.calculateEndDate(Number(range) - 1, startDate);//startDate.add(Number(this.state.range) - 1, "days");

            this.setState({

                modifiedEndDate: endDate,



                //daysAfterModify: Number(range)

            }, () => {

                console.log('end date after modification: ', this.state.modifiedEndDate, moment(this.state.modifiedEndDate).format('DD MM YYYY , hh:mm A'))

            })





        }

        else if (access_period_unit_id == 3) {



            startDate = moment(this.state.modifiedStartDate);

            console.log(range);

            endDate = this.calculateEndDate(Number(range) - 1, startDate);

            this.setState({

                modifiedEndDate: endDate,

                //totalDays: this.state.range

            }, () => {

                console.log('end date after modification: ', this.state.modifiedEndDate, moment(this.state.modifiedEndDate).format('DD MM YYYY , hh:mm A'))

            })



        }

        else if (access_period_unit_id == 5) {



            startDate = moment(this.state.modifiedStartDate);

            console.log(range);

            endDate = startDate.add(range, 'weeks').subtract(1, 'day');

            this.setState({

                modifiedEndDate: endDate,

                //totalDays: this.state.range

            }, () => {

                console.log('end date after modification: ', this.state.modifiedEndDate, moment(this.state.modifiedEndDate).format('DD MM YYYY , hh:mm A'))

            })



        }









    }

    calculateEndDate = (range, startDate) => {

        console.log(range, startDate)



        let endDate = moment(startDate);
        endDate = startDate.add(Number(this.state.item.property_details.end_at.split(':')[0])-Number(this.state.item.property_details.start_at.split(':')[0]), 'hours');


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

            console.log('fist if ')

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



                console.log(moment(endDate).format('DD-MM-YYYY, hh:mm A'), booking_dates);

            }



            this.setState({

                modified_booking_dates: booking_dates,

                modified_total_booking_days: total_booking_dates,



            })

        }

        else if (this.state.weekends.indexOf(new Date(startDate).getDay()) >= 0) {

            console.log('second if ')

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

                modified_booking_dates: booking_dates,

                modified_total_booking_days: total_booking_dates

            })

        }

        else {

            console.log('third if ')

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

                modified_booking_dates: booking_dates,

                modified_total_booking_days: total_booking_dates

            })



        }



        return endDate;

    }

    onStartTimeSelect = (event, value) => {

        console.log(moment(value).format('hh:mm A'),);

        let booking_dates = this.state.modified_booking_dates;

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



        const openTime = moment(new Date(

            date.get('year'),

            date.get('month'),

            date.get('date'),

            this.state.item.property_details.start_at.split(':')[0],

            this.state.item.property_details.start_at.split(':')[1])

        );



        const minTime = openTime.subtract(1, 'minute');



        const closeTime = moment(new Date(

            date.get('year'),

            date.get('month'),

            date.get('date'),

            this.state.item.property_details.end_at.split(':')[0],

            this.state.item.property_details.end_at.split(':')[1])

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



                booking_dates[this.state.currentIndex].startTime = startTime;

                booking_dates[this.state.currentIndex].startEmpty = false;

                booking_dates[this.state.currentIndex].endTime != '' ? (

                    booking_dates[this.state.currentIndex].endTime = startTime.isBefore(moment(booking_dates[this.state.currentIndex].endTime)) ? booking_dates[this.state.currentIndex].endTime : '',

                    booking_dates[this.state.currentIndex].endEmpty = startTime.isBefore(moment(booking_dates[this.state.currentIndex].endTime)) ? false : true

                ) : null;



                this.setState({

                    modified_booking_dates: booking_dates,

                    showStartTimer: false

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

            this.state.item.property_details.start_at.split(':')[0],

            this.state.item.property_details.start_at.split(':')[1])

        );



        const minTime = booking_dates[this.state.currentIndex].startTime != '' ? moment(booking_dates[this.state.currentIndex].startTime).add(59, 'minutes') : openTime.add(59, 'minutes');



        const closeTime = moment(new Date(

            date.get('year'),

            date.get('month'),

            date.get('date'),

            this.state.item.property_details.end_at.split(':')[0],

            this.state.item.property_details.end_at.split(':')[1])

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

    checkTimeAvailability = async (startDate, endDate) => {

        const user_data = await Session.getUserDetails(startDate, endDate);

        const parsedData = JSON.parse(user_data);

        const params = {

            "user_id": Number(await Session.getUserId()),

            "provider_id": this.state.item.provider_id,//471,//static

            "property_id": this.state.item.id,

            "resource_group_id": this.state.item.resource_group_id,

            "resource_id": this.state.item.resource_id,

            "resource_plan_id": this.state.item.resource_plan_id,

            "corporate_id": parsedData.corporate_id,

            "booking_type_id": Number(parsedData.role_id) == 5 ? 3 : 6,

            "period_quantity": this.state.daysAfterModify,

            "start_date": moment(startDate),

            "end_date": moment(endDate),

            "total_days": this.state.daysAfterModify,

            "no_of_people": this.state.modifiedGuestnumber == null ? this.state.item.total_seats : this.state.modifiedGuestnumber,

            "total_seats": this.state.modifiedGuestnumber == null ? this.state.item.total_seats : this.state.modifiedGuestnumber,

            "total_price": this.state.item.total_price,

            "cgst": this.state.item.cgst,

            "sgst": this.state.item.sgst,

            "amenities_price": 0,

            "is_invite_guest": 1,

            "is_rsvp": 1,

            "is_meeting_space": 1,

        }

        console.log('params', params);



        checkTimeAvailabilityAPI(params).then(result => {

            let booking_dates = this.state.modified_booking_dates;

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

                    modified_booking_dates: booking_dates,

                    showEndTimer: false

                })

            }

            else {



                CommonHelpers.showFlashMsg('Time slot not available on this date.', 'danger');

                booking_dates[this.state.currentIndex].endTime = '';

                booking_dates[this.state.currentIndex].endEmpty = true;

                booking_dates[this.state.currentIndex].startTime = '';

                booking_dates[this.state.currentIndex].startEmpty = true;

                this.setState({

                    showEndTimer: false,

                    modified_booking_dates: booking_dates

                })



            }

        })

    }

    getTotalHours = () => {

        let totalHours = 0

        this.state.modified_booking_dates.forEach((day, index) => {

            if (day.offDay == 0) {

                const startTime = day.startTime != '' ? moment(day.startTime) : 0;

                const endTime = day.endTime != '' ? moment(day.endTime) : 0;

                console.log('in hours calculation: ', moment(startTime).format('DD MM YYYY hh:mm A'), moment(endTime).format('DD MM YYYY hh : mm A'));

                const duration = startTime != 0 && endTime != 0 ? moment.duration(endTime.diff(startTime)) : 0;

                const hours = startTime != 0 && endTime != 0 ? duration.asHours() : 0;

                totalHours = totalHours + hours;

            }



        });

        return totalHours;

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

                <KeyboardAwareScrollView /*  height={'90%'}  */ style={{ marginBottom:  this.state.qrvisible ? 1 : 70 }}>

                    {/* Header */}

                    <LogoHeader

                        from='summarymeetingspaces'

                        navigation={this.props.navigation}

                        title='Booking Info'

                        qrvisible={this.state.qrvisible}

                        qrpress={() => {

                            this.openScanPage(this.state.item)



                        }}

                        onBarsPress={() => {

                            this.openControlPanel()

                        }}

                    />



                    {/* Image carousel */}

                    <View style={{ marginBottom: '1%' }}>

                        <RenderCarousel

                            images={this.state.carousel_images}

                        />



                    </View>



                    {/* info section */}

                    <View style={{

                        margin: '4%',

                        //backgroundColor: 'pink'

                    }} height={100}>

                        <View style={[ box.horizontalBox, ]}>

                            <Text style={[

                                font.bold,

                                color.myOrangeColor,

                                font.sizeLarge,

                            ]}>{this.state.resourceName}</Text>
{/* 
                            <View style = {{justifyContent:'center',}}>
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

                           



                        </View>

                        <View style={{

                            flexDirection: 'row',

                            justifyContent: 'space-between',

                        }}>



                            <Text style={[

                                font.regular,

                                font.sizeVeryRegular,

                                color.darkgrayColor

                            ]}>{this.state.propertyName.toUpperCase()}</Text>

                            <View style={{

                                flexDirection: 'row', //marginRight: 10

                            }}>

                                {

                                    this.state.property_timings.length != 0 && this.state.property_timings.map((day, index) => {

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



                        <View style={[box.horizontalBox]}>



                            <TouchableOpacity onPress={() => {

                                this.setState({

                                    showPicker: true,

                                })

                            }}>

                                <Text style={[

                                    font.regular,

                                    font.sizeSmall,

                                    color.grayColor,

                                    {

                                        width: Dimensions.get('screen').width * 0.5,

                                    }



                                ]}>{this.state.locality}

                                </Text>



                            </TouchableOpacity>



                            <View style={{ justifyContent: 'flex-end' }}>

                                <Text style={[

                                    font.regular,

                                    font.sizeSmall,

                                    color.grayColor, { textAlign: 'right' }



                                ]}>{this.state.item.property_details != null ? this.state.item.property_details.start_at + ' to ' + this.state.item.property_details.end_at : null}</Text>

                                {/* <StarRatingComponent /> */}



                            </View>



                            {

                                this.state.showPicker &&



                                <SinglePickerMaterialDialog

                                    title={'Select'}

                                    colorAccent={color.myOrangeColor.color}

                                    items={this.state.pickerItems.map((row, index) => {

                                        return { value: index, label: row.name };

                                    })}

                                    visible={this.state.showPicker}

                                    selectedItems={this.state.selectedOption}

                                    onCancel={() => this.setState({ showPicker: false })}

                                    onOk={result => {

                                        console.log(result)

                                        if (Number(result.selectedItem.value) == 1) {

                                            const scheme = Platform.select({ ios: 'maps:0,0?q=', android: 'geo:0,0?q=' });
                                            const latLng = `${this.state.latitude},${this.state.longitude}`;
                                            const label = 'Custom Label';
                                            const url = Platform.select({
                                                ios: `${scheme}${label}@${latLng}`,
                                                android: `${scheme}${latLng}(${label})`
                                            });

    
                                        Linking.openURL(url);

                                           /*  this.setState({

                                                showPicker: false,

                                                showMap: true

                                            }); */



                                        }

                                        else if (Number(result.selectedItem.value) == 0) {

                                            this.copyToClipboard();

                                        }



                                        //this.setState({ showPicker: false });



                                    }}

                                />



                            }



                        </View>









                    </View>



                    {/* info section ends */}





                    {/* booking details */}



                    <View /* height={170} */ style={[box.horizontalBox, { padding: '4%', flex:1}]}>

                        <Image source={require('../../Assets/images/mybookings.png')}

                            style={[{

                                width: 40,

                                height: 40,

                                marginRight: '5%'

                            }]} />



                        <View style={{ flex: 1 }}>

                            <View style={[box.horizontalBox]}>

                                <View>

                                    <Text style={[

                                        font.regular,

                                        font.darkgrayColor,

                                        font.sizeVeryRegular

                                    ]}>Booking ID</Text>

                                    <Text style={[

                                        font.semibold,

                                        font.sizeRegular,

                                        color.myOrangeColor,

                                    ]}>{this.state.item.booking_id}</Text>

                                </View>

                                <View style={{ justifyContent: 'flex-end', /* flexWrap:'wrap', */width: '50%' }}>

                                    <Text style={[font.regular,

                                    font.darkgrayColor,

                                    font.sizeVeryRegular, { textAlign: 'right' }]}>Booking status</Text>

                                    <Text style={[

                                        font.semibold,

                                        font.sizeRegular,

                                        color.myOrangeColor, {

                                            textAlign: 'right',



                                        }

                                    ]}>{CommonHelpers.bookingStatusInfo(JSON.stringify(this.state.item.booking_status)).toUpperCase()}</Text>

                                </View>







                            </View>



                            <View style={[box.horizontalBox]}>

                                <View>

                                    <Text style={[

                                        font.regular,

                                        font.darkgrayColor,

                                        font.sizeVeryRegular

                                    ]}>Booking Date {'&'} Time</Text>

                                    <Text style={[

                                        font.semibold,

                                        font.sizeRegular,

                                        color.myOrangeColor,

                                    ]}>{moment(this.state.item.created_at).format('DD MMM YYYY hh:mm A')}</Text>

                                </View>

                                <View style={{ justifyContent: 'flex-end' }}>

                                    <Text style={[font.regular,

                                    font.darkgrayColor,

                                    font.sizeVeryRegular, { textAlign: 'right' }]}>Booking Plan</Text>

                                    <Text style={[

                                        font.semibold,

                                        font.sizeRegular,

                                        color.myOrangeColor, { textAlign: 'right' }

                                    ]}>{this.state.planType}</Text>

                                </View>







                            </View>



                            <View style={[box.horizontalBox]}>

                                <View>

                                    <Text style={[

                                        font.regular,

                                        font.darkgrayColor,

                                        font.sizeVeryRegular

                                    ]}>Resource Booked</Text>

                                    <Text style={[

                                        font.semibold,

                                        font.sizeRegular,

                                        color.myOrangeColor,

                                    ]}>{this.state.resourceName}</Text>

                                </View>

                                <View style={{ justifyContent: 'flex-end' }}>

                                    <Text style={[font.regular,

                                    font.darkgrayColor,

                                    font.sizeVeryRegular, { textAlign: 'right' }]}>Amount Paid</Text>

                                    <Text style={[

                                        font.semibold,

                                        font.sizeRegular,

                                        color.myOrangeColor, { textAlign: 'right' }

                                    ]}>{'\u20B9'}{Intl.NumberFormat("en-IN").format(this.state.item.total_price)}</Text>

                                </View>







                            </View>

                        </View>



                    </View>



                    {/* start date and end date */}

                    <View /* height={80} */ style={[box.centerBox, box.horizontalBox, { alignItems: 'center', marginBottom: '1%', flex:1 }]}>



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

                            ]}>{moment(this.state.item.start_date).format('DD MMM YYYY')}</Text>

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

                            ]}>{moment(this.state.item.end_date).format('DD MMM YYYY')}</Text>

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

                                ]}>{this.state.item.total_days}</Text>

                                {



                                    this.state.booking_dates.length != 0

                                    &&

                                    this.state.booking_dates.slice(

                                        0, this.state.booking_dates.length >= 7

                                        ? 7 :

                                        this.state.booking_dates.length).map((day, index) => {

                                            //console.log('working day', day)

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



                    {/* for hourly break up */}



                    {
                        this.state.hourly_plan_time.length > 0 ?
                            <View height={Number(this.state.hourly_plan_time.length) * 30 + 50} style={[/* box.centerBox, */ box.horizontalBox, { padding: '5%', marginBottom: '1%', justifyContent: 'flex-start', }]}>

                                <Image source={require('../../Assets/images/mybookings.png')} style={[image.imageContain, { width: 40, height: 40, marginRight: 10 }]} />



                                <View style={{ flex: 1, alignItems: 'flex-end' }} /* width={Dimensions.get('screen').width * 0.8} */>

                                    {

                                        this.state.hourly_plan_time.length != 0 && this.state.hourly_plan_time.map((day, index) => {



                                            return (

                                                <View height={30} style={[box.horizontalBox,]}>

                                                    <Text style={[

                                                        font.regular,

                                                        font.sizeRegular,

                                                        color.darkgrayColor,

                                                        {

                                                            width: (Dimensions.get('screen').width * 0.8) / 6

                                                        }

                                                    ]}>{moment(day.start_date_time).format('ddd')}</Text>

                                                    <Text style={[

                                                        font.regular,

                                                        font.sizeRegular,

                                                        color.darkgrayColor,

                                                        {

                                                            width: (Dimensions.get('screen').width * 0.8) / 4

                                                        }

                                                    ]}>{moment(day.start_date_time).format('DD MMM YYYY')}</Text>

                                                    <Text style={[

                                                        font.regular,

                                                        font.sizeRegular,

                                                        color.darkgrayColor,

                                                        {

                                                            width: (Dimensions.get('screen').width * 0.8) / 4

                                                        }

                                                    ]}>{moment(day.start_date_time).format('LT')}</Text>

                                                    <Text style={[

                                                        font.regular,

                                                        font.sizeRegular,

                                                        color.darkgrayColor,

                                                        {

                                                            width: (Dimensions.get('screen').width * 0.8) / 4,

                                                            textAlign: 'right'

                                                        }

                                                    ]}>{moment(day.end_date_time).format('hh:mm A')}</Text>

                                                </View>

                                            );



                                        })

                                    }

                                    <Text style={[

                                        font.regular,

                                        font.sizeVeryRegular,

                                        color.myOrangeColor, { textAlign: 'right' }



                                    ]}>Total Hours: {this.getTotalHour()}</Text>

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

                            <Text style={[

                                font.semibold,

                                font.sizeLarge,

                                color.myOrangeColor

                            ]}>{this.state.item.total_seats}</Text>

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

                                    backgroundColor: this.state.item.is_invite_guest == 1 ? color.myOrangeColor.color : color.darkgrayColor.color,

                                    borderRadius: 100

                                }}

                            />

                            <Text style={[

                                font.semibold,

                                font.sizeLarge,

                                color.darkgrayColor

                            ]}>Invited</Text>

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

                                    padding: 10,

                                    backgroundColor: this.state.item.is_rsvp == 1 ? color.myOrangeColor.color : color.darkgrayColor.color,

                                    borderRadius: 100

                                }}

                            />

                            <Text style={[

                                font.semibold,

                                font.sizeLarge,

                                color.darkgrayColor

                            ]}>RSVP</Text>

                        </View>



                    </View>



                    {/* Guest List */}

                    <SectionHeader

                        onPress={() => { this.collapse("guestlist") }}

                        title="Guests"

                        add={() => {

                            console.log("total seats: ", this.state.guests, this.state.guestList.length);



                            if (this.state.guestList.length < Number(this.state.guests)) {

                                this.setState({

                                    showAddGuest: true,

                                    guestEmail: null,

                                    guestName: null,

                                    guestNumber: null,

                                    collapseGuestList: false

                                })

                            } else {

                                CommonHelpers.showFlashMsg('Cannot add more than ' + this.state.guests + ' guests.', 'danger');

                            }





                        }}

                        from={'meetingspaceinformation'}

                        iconName={this.state.collapseGuestList ? 'angle-right' : 'angle-up'} />



                    <Collapsible collapsed={this.state.collapseGuestList}

                        /* align="center" */>

                        <View style={{

                            width: "95%",

                            marginLeft: "2%",

                            marginRight: "2%",





                        }} height={this.state.guestList.length > 0 ? this.state.guestList.length * 35 + 188 : 180}>

                            <FlatList

                                data={this.state.guestList}

                                renderItem={this._renderGuests}

                                horizontal={false}

                                ListHeaderComponent={

                                    <View>

                                        <View style={[box.horizontalBox, {

                                            alignItems: 'center',

                                            // backgroundColor: 'red',

                                            padding: 5

                                        }]}>

                                            <Text>Meeting Title</Text>

                                            <TextInput

                                                //placeholder='Guest Name'

                                                //placeholderTextColor={color.grayColor.color}

                                                style={[renderItem.inputBox, {

                                                    width: Dimensions.get('screen').width * 0.6,

                                                    borderBottomColor: color.grayColor,

                                                    borderWidth: 0.8,

                                                    borderColor: color.grayColor.color,

                                                    borderRadius: 10,



                                                    height: 40





                                                }]}

                                                selectionColor={color.myOrangeColor.color}

                                                value={this.state.meetingTitle}

                                                onChangeText={(value) => {

                                                    this.setState({

                                                        meetingTitle: value,

                                                    })

                                                }} />



                                        </View>

                                        {this.state.guestList.length > 0 ?

                                            <View style={[box.horizontalBox]}>

                                                <Text style={[

                                                    font.semibold,

                                                    font.sizeVeryRegular,

                                                    color.darkgrayColor, {

                                                        width: Dimensions.get('screen').width * 0.20,

                                                        textAlign: 'left'

                                                    }



                                                ]}>Name</Text>

                                                <Text style={[

                                                    font.semibold,

                                                    font.sizeVeryRegular,

                                                    color.darkgrayColor, {

                                                        width: Dimensions.get('screen').width * 0.3

                                                        , textAlign: 'left'

                                                    }



                                                ]}>Email</Text>

                                                <Text style={[

                                                    font.semibold,

                                                    font.sizeVeryRegular,

                                                    color.darkgrayColor, {

                                                        width: Dimensions.get('screen').width * 0.3,

                                                        textAlign: 'left'

                                                    }



                                                ]}>Phone</Text>

                                                <Text style={[

                                                    font.semibold,

                                                    font.sizeVeryRegular,

                                                    color.darkgrayColor, {

                                                        width: Dimensions.get('screen').width * 0.10,

                                                        textAlign: 'left'

                                                    }



                                                ]}>RSVP</Text>



                                            </View> : null



                                        }



                                    </View>



                                }

                                ListFooterComponent={



                                    <View height={110}>

                                        {

                                            this.state.showAddGuest ?

                                                <View style={[box.horizontalBox, {

                                                    alignItems: 'center',

                                                }]}>

                                                    <TextInput

                                                        placeholder='Guest Name'

                                                        placeholderTextColor={color.grayColor.color}

                                                        style={[renderItem.inputBox, {

                                                            width: Dimensions.get('screen').width * 0.28,

                                                            borderBottomColor: color.grayColor,

                                                            borderWidth: 0.8,

                                                            borderColor: color.grayColor.color,

                                                            borderRadius: 10,

                                                            height: 40





                                                        }]}

                                                        selectionColor={color.myOrangeColor.color}

                                                        value={this.state.guestName}

                                                        onChangeText={(value) => {

                                                            this.setState({

                                                                guestName: value,

                                                            })

                                                        }}



                                                    />

                                                    <TextInput

                                                        placeholder='Guest Email'

                                                        placeholderTextColor={color.grayColor.color}

                                                        style={[renderItem.inputBox, {

                                                            width: Dimensions.get('screen').width * 0.3,

                                                            borderBottomColor: color.grayColor,

                                                            borderWidth: 0.8,

                                                            borderColor: color.grayColor.color,

                                                            borderRadius: 10,

                                                            height: 40





                                                        }]}

                                                        selectionColor={color.myOrangeColor.color}

                                                        value={this.state.guestEmail}

                                                        onChangeText={(value) => {

                                                            this.setState({

                                                                guestEmail: value,

                                                            })

                                                        }}



                                                    />

                                                    <TextInput

                                                        placeholder='Guest Phone'

                                                        keyboardType={'phone-pad'}

                                                        maxLength={10}

                                                        placeholderTextColor={color.grayColor.color}

                                                        style={[renderItem.inputBox, {

                                                            width: Dimensions.get('screen').width * 0.3,

                                                            borderBottomColor: color.grayColor,

                                                            borderWidth: 0.8,

                                                            borderColor: color.grayColor.color,

                                                            borderRadius: 10,

                                                            height: 40





                                                        }]}

                                                        selectionColor={color.myOrangeColor.color}

                                                        value={this.state.guestNumber}

                                                        onChangeText={(value) => {



                                                            this.setState({

                                                                guestNumber: value,

                                                            })

                                                        }}

                                                    />

                                                    <TouchableOpacity onPress={() => {

                                                        if (CommonHelpers.validateEmail(this.state.guestEmail)) {

                                                            console.log(this.state.guestName, this.state.guestNumber, this.state.guestEmail)

                                                            const name = this.state.guestName != null ? this.state.guestName : '';

                                                            const number = this.state.guestNumber != null ? this.state.guestNumber : '';

                                                            const email = this.state.guestEmail != null ? this.state.guestEmail : '';

                                                            if (name.length != 0 && number.length != 0 && email.length != 0) {





                                                                let guestList = this.state.guestList;

                                                                const newGuest = {

                                                                    name: this.state.guestName,

                                                                    email: this.state.guestEmail,

                                                                    phone: this.state.guestNumber,

                                                                    is_rsvp: this.state.item.is_rsvp == 1 ? 1 : 0,

                                                                }

                                                                let i = -1;



                                                                guestList.forEach((item, index) => {

                                                                    if (item.email.toLowerCase() == email.toLowerCase()) {

                                                                        i = index;



                                                                    }



                                                                })



                                                                if (i < 0) {



                                                                    guestList.push(newGuest);

                                                                    this.setState({

                                                                        guestList: guestList,

                                                                        showAddGuest: false,

                                                                    });

                                                                    const params = {



                                                                        "booking_id": this.state.item.id,



                                                                        "user_id": this.state.item.user_id,



                                                                        "meeting_title": this.state.meetingTitle,



                                                                        "guests": [newGuest]



                                                                    }

                                                                    if (this.state.meetingTitle == null || this.state.meetingTitle.length == 0) {

                                                                        CommonHelpers.showFlashMsg('Meeting Title cannot be empty', 'danger');

                                                                    }

                                                                    /* else if(this.state.guestList.length == 0){

                                                                        CommonHelpers.showFlashMsg('Please add guest details to invite.', 'danger');

                                                                    } */

                                                                    else {

                                                                        this.sendInvites(params);



                                                                    }

                                                                    //this.sendInvites(params);



                                                                }

                                                                else {

                                                                    CommonHelpers.showFlashMsg(email + " is already in the invite list.", 'success');

                                                                }





                                                            }



                                                        }

                                                        else {

                                                            CommonHelpers.showFlashMsg('Please check the email.', 'danger');

                                                        }



                                                    }}>

                                                        <Image source={require('../../Assets/images/Check.png')}

                                                            style={{

                                                                width: 20,

                                                                height: 20

                                                            }} />



                                                    </TouchableOpacity>



                                                </View> : null

                                        }

                                    </View>





                                }

                                showsHorizontalScrollIndicator={false}

                            /* numColumns={4}

                            columnWrapperStyle={{ justifyContent: "center" }} */

                            />

                        </View>

                    </Collapsible>





                </KeyboardAwareScrollView>

                                {
                                    this.state.qrvisible ? null : 
                                    <View height={70} style={{
                                        flexDirection: 'row',
                                        justifyContent: 'space-between'
                                        , position: "absolute",
                                        bottom: 0,
                                        padding: '1%'
                                    }}>
                                        <TouchableOpacity
                                            onPress={() => {
                                                //console.log('cancellation policy document: ', AWS_URL + this.state.item.cancellation_policy_doc.tc_type_template_path, this.state.item.cancellation_policy_doc.tc_type_name);
                                                this.setState({
                                                    cancelModal: true,
                                                    cancelItem: this.state.item,
                                                    policyDocPath: AWS_URL + this.state.item.cancellation_policy_doc.tc_type_template_path,
                                                    policydocName: this.state.item.cancellation_policy_doc.tc_type_name,
                                                })
                    
                                            }}
                                            style={[button.defaultRadius, { borderColor: color.darkgrayColor.color, width: '50%', alignItems: 'center', justifyContent: 'center', }]}>
                                            <Text style={[
                                                font.semibold,
                                                font.sizeExtraLarge,
                                                color.darkgrayColor
                                            ]}>CANCEL</Text>
                    
                                            <Text style={[
                    
                                                font.semibold,
                    
                                                font.sizeRegular,
                    
                                                color.darkgrayColor, {
                    
                                                    lineHeight: 15,
                    
                                                    letterSpacing: 0.5,
                    
                                                    textAlign: 'right'
                    
                                                }
                    
                                            ]}>Booking</Text>
                    
                                        </TouchableOpacity>
                    
                                        <TouchableOpacity
                    
                                            onPress={() => {
                    
                                                this.setState({
                                                    modifyModal: true,
                                                    daysAfterModify: this.state.item.total_days,
                                                    modifiedStartDate: this.state.item.start_date,
                                                    modifiedEndDate: this.state.item.end_date,
                                                    //modifiedPlantype: this.state.planType
                                                }, () => {
                                                    this.state.item.booking_plan_details.access_period_unit_id == 3 ? this.onDayPress(Number(this.state.daysAfterModify)) : null
                                                })
                                                this.setPlan(this.state.item.booking_plan_details.access_period_unit_id);
                                            }}
                    
                                            style={[button.defaultRadius, { borderColor: color.myOrangeColor.color, width: '49%', alignItems: 'center', justifyContent: 'center' }]}>
                    
                                            <Text style={[
                    
                                                font.semibold,
                    
                                                font.sizeExtraLarge,
                    
                                                color.darkgrayColor
                    
                                            ]}>MODIFY</Text>
                    
                                            <Text style={[
                    
                                                font.semibold,
                    
                                                font.sizeRegular,
                    
                                                color.darkgrayColor, {
                    
                                                    lineHeight: 15,
                    
                                                    letterSpacing: 0.5,
                    
                                                    textAlign: 'right'
                    
                                                }
                    
                                            ]}>Booking</Text>
                    
                                        </TouchableOpacity>
                                    </View>
                                }

                



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

                                    ]}>{this.state.item.booking_id}</Text>

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

                                    ]}>{this.state.item.total_seats}</Text>

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

                                    ]}>{moment(this.state.item.start_date).format('DD MMM YYYY')}</Text>

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

                                    ]}>{moment(this.state.item.end_date).format('DD MMM YYYY')}</Text>

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

                                    ]}>{moment(this.state.item.start_date).format('hh:mm A')}</Text>

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

                                    ]}>{moment(this.state.item.end_date).format('hh:mm A')}</Text>

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

                                                ]}>{this.state.selectedResourcePlan == null ? this.state.planName : this.state.selectedResourcePlan.plan_name + this.state.modifiedPlantype}</Text>



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

                                                    <Text>{this.state.selectedResourcePlan != null ? this.state.selectedResourcePlan.plan_name + this.state.modifiedPlantype : 'Select a Plan'}</Text>

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

                                                            this.setState({

                                                                selectedResourcePlan: result.selectedItem.item,

                                                                showAllResourcePlan: false,

                                                                enablePlanModification: false,

                                                            })

                                                            this.onDayPress(Number(this.state.daysAfterModify));
                                                            this.setPlan(result.selectedItem.item.access_period_unit_id);

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



                                                        if (this.state.selectedResourcePlan == null && Number(value) <= this.state.item.resource_details.capacity) {

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

                                                ]}>{this.state.item.total_seats}</Text>



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

                                        ]}>{this.state.modifiedStartDate != null ? moment(this.state.modifiedStartDate).format('DD MMM YYYY') : moment(this.state.item.start_date).format('DD MMM YYYY')}</Text>

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

                                                date={this.checkBookingOpen() ? new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 1) : new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 2)}

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

                                    <Text>Plan: {this.state.modifiedPlantype}</Text>

                                    <TextInput

                                        placeholder={'Enter Number of ' + this.state.modifiedTypeDuration}

                                        defaultValue={this.state.daysAfterModify.toString()}

                                        selectionColor={color.myOrangeColor.color}

                                        onChangeText={(value) => {

                                            console.log('plan type: ', this.state.modifiedPlantype);

                                            if (this.state.modifiedPlantype == 'Daily Plan' && Number(value) <= 14) {

                                                this.setState({

                                                    daysAfterModify: value

                                                })

                                                this.onDayPress(Number(value))

                                            }

                                            else if (this.state.modifiedPlantype == 'Hourly Plan' && Number(value) <= 7) {

                                                this.setState({

                                                    daysAfterModify: value

                                                })

                                                this.onDayPress(Number(value))

                                            } else if(this.state.modifiedPlantype == 'Monthly Plan' && Number(value) < 3) {

                                                this.setState({

                                                    daysAfterModify: value

                                                })

                                                this.onDayPress(Number(value))

                                            }else{
                                                this.setState({

                                                daysAfterModify: 1

                                            })
                                                //CommonHelpers.showFlashMsg('Maximum duration limit exceeded.', 'danger');
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



                                this.state.modifiedPlantype == 'Hourly Plan' && this.state.modified_booking_dates.length != 0 ?



                                    <View height={this.state.modified_booking_dates.length == 1 ? 110 : this.state.daysAfterModify * 70 + 40} style={[box.centerBox, { /* backgroundColor: 'yellow', */ alignContent: 'flex-start', paddingTop: 10, paddingBottom: 5, marginBottom: '1%' }]}>

                                        <Text style={[font.semibold,

                                        font.sizeExtraLarge,

                                        color.grayColor, { marginBottom: 10 }]}>Select Time</Text>



                                        {

                                            this.state.modified_booking_dates.length != 0 && this.state.modified_booking_dates.map((day, index) => {





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

                                                                    justifyContent: this.state.modified_booking_dates[index].startTime == '' ? 'flex-end' : 'center'

                                                                }]}>

                                                                <Text style={[font.regular,

                                                                font.sizeRegular,

                                                                this.state.modified_booking_dates[index].startTime == '' ? color.grayColor : color.lightBlack, {

                                                                    textAlign: 'center'

                                                                }]}>{this.state.modified_booking_dates[index].startTime != '' ?

                                                                    moment(this.state.modified_booking_dates[index].startTime).format('hh:mm A') : ''}</Text>

                                                                {

                                                                    this.state.modified_booking_dates[index].startTime == '' ? <Text style={[{ textAlign: 'right' }]}>AM</Text> : null

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

                                                                    justifyContent: this.state.modified_booking_dates[index].endTime == '' ? 'flex-end' : 'center'

                                                                }]}>

                                                                <Text style={[font.regular,

                                                                font.sizeRegular,

                                                                this.state.modified_booking_dates[index].endTime == '' ? color.grayColor : color.lightBlack,

                                                                {

                                                                    textAlign: 'center'

                                                                }]}>{this.state.modified_booking_dates[index].endTime != '' ?

                                                                    moment(this.state.modified_booking_dates[index].endTime).format('hh:mm A') : ''}</Text>

                                                                {

                                                                    this.state.modified_booking_dates[index].endTime == '' ? <Text style={[{ textAlign: 'right' }]}>PM</Text> : null

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



                                        {

                                            this.state.showEndTimer &&



                                            <DatePicker

                                                modal

                                                minuteInterval={30}

                                                open={this.state.showEndTimer}

                                                date={this.state.modifiedEndDate != '' ? new Date(moment(this.state.modifiedEndDate)) : new Date()}

                                                mode={'time'}

                                                is24hourSource={false}

                                                //minimumDate = {this.state.startDate != '' ? new Date(moment(this.state.startDate)):moment(new Date()).add(1, 'day')}

                                                onConfirm={(date) => {



                                                    this.onEndTimeSelect({ type: "set" }, date);



                                                }}

                                                onCancel={() => {

                                                    this.setState({

                                                        showEndTimer: false

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

                                    }
                                    else{
                                        CommonHelpers.showFlashMsg('Enter the modification description', 'danger');
                                    }





                                }}>

                                <Text style={[font.bold, font.sizeLarge, color.textWhiteColor, { textAlign: "center" }]}>Send</Text>

                            </TouchableOpacity>

                        </View>







                    </View>



                </Modal>}

                {

                    this.state.showMap && <Mapping
                        initialRegion={{

                            latitude: parseFloat(this.state.latitude),

                            longitude: parseFloat(this.state.longitude),

                            latitudeDelta: 0.015,

                            longitudeDelta: 0.0121,

                        }}

                        mapMarkers={[{

                            coordinate: {

                                latitude: parseFloat(this.state.latitude),

                                longitude: parseFloat(this.state.longitude),

                            },

                            imageURL: this.state.item.property_images.length == 0 ? require('./../../Assets/images/BRHlogoorange.png') : { uri: AWS_URL + this.state.item.property_images[0].image_path },

                            item: this.state.item

                        }]}

                        navigation={this.props.navigation}

                        closing={() => { this.onFilterClosed() }}

                        from={'meetingInfo'} />
                }



                {

                    this.state.spinner && <Spinner />

                }

                {
                    this.state.openComments && 
                    <Comments
                    //from = {'afterBooking'}
                        navigation={this.props.navigation}
                        rating = {Number(this.state.rating)}
                        closing={() => { this.onFilterClosed() }}
                    />
                }

            </Drawer>

        );

    }

}



