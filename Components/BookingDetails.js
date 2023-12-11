import React, { Component } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Switch, ToastAndroid, Dimensions, TouchableWithoutFeedbackBase, BackHandler, Image, /* Modal */} from 'react-native';
import Header from './BookingComponents/Header';
import renderItem from '../Styles/renderItem';
import RectangleCard from './BookingComponents/RectangleCard';
import { StarRatingComponent } from './ReusableComponents/StarRatingComponent';
import color from '../Styles/color';
import button from '../Styles/button';
import font from '../Styles/font';
import Icon from 'react-native-vector-icons/FontAwesome';
import moment from 'moment';
import box from '../Styles/box';
import { BookingRequestAPI, login_check, MemberDirectBookingCallback, MemberDirectBookingAPI} from '../Rest/userAPI';
import CommonHelpers from '../Utils/CommonHelpers';
import Spinner from '../Utils/Spinner';
//import Confirmation from "./../Modals/Confirmation";
import Modal from 'react-native-modalbox';
import { termsandconditions, elegibilty_text, 
  content_text,
  CLAIMS_OF_COPYRIGHT_INFRINGEMENT_text, user_account_deletion,
  review_text1, review_text2,review_text3,
  review_text4,review_text5 ,review_text6,
  space_accounts_text1, space_accounts_text2, 
  space_accounts_text3, user_accounts_text1,user_accounts_text2,
  disputes_text,  third_party_text,link_text ,liability_text,
  indem_text, mis_text,mod_text,copyright_text,contact_text, RAZORPAY_KEY} from '../config/RestAPI';
import RazorpayCheckout from 'react-native-razorpay';
import LogoHeader from './ReusableComponents/LogoHeader';
import Session from '../config/Session';
import route from '../Route/route';
import image from '../Styles/image';
import Drawer from "react-native-drawer";
import Sidemenu from "../Navigation/Sidemenu";
import CustomePushNotifications from './CustomePushNotifications';

export default class BookingDetails extends Component {

    constructor(){
        super();
        this.state = {
            isEnabled: false,
            spinner: false,
            tncmodal :false,
            paymentSuccess: null,
            paymentAttemptsRemaining: 3,
            role_id: null,
            bookingDetails : null,

            allDiscountCoupons: [],
            displayCoupons: [],
            selectedCoupon: null,
            showCoupons: false,
            newBaseCost: null,
            cgst: 0,
            sgst: 0,
            gst: 0,
            totalCost: 0,
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

    componentDidMount=async()=>{
      this.notifications = CustomePushNotifications.configureNotifis(this.props.navigation);
      login_check().then(async(result) => {
        this.setState({
            spinner: false,
        })
        
        console.log("login check", result.message, result.status);
       if(!result.status){
         //CommonHelpers.showFlashMsg("Session Expired. Please login again.", "danger");
         await Session.setUserDetails({});
                  await Session.setUserToken('');
                  //console.log(await Session.getUserDetails());
                  await Session.setUserId('');
                  await Session.setUserName('');
                  this.props.navigation.push('auth',{screen: 'Login'})
                
       }
       else{
         let user_details = await Session.getUserDetails();
         user_details = JSON.parse(user_details);
         const role_id = user_details.role_id;
         this.setState({
           role_id: role_id,
           allDiscountCoupons: this.props.route.params.bookingDetails.details_for_api_request[0].property_data.discounts_coupons,
           cgst: this.props.route.params.bookingDetails.CGST,
            sgst: this.props.route.params.bookingDetails.SGST,
            totalCost: this.props.route.params.bookingDetails.totalAmount,
         }, ()=>{
          this.setDisplayCoupons();
           console.log("the user has role_id : ", role_id, this.state.allDiscountCoupons);
         })
       }
  
      }).catch(error => {
        this.setState({
            spinner: false,
        })
        console.log(error)
      });
      this.backhandler = BackHandler.addEventListener("hardwareBackPress", 
       ()=>{
        if(this.state.tncmodal){
          console.log('run this')
         this.setState({
           tncmodal: false
         })
         return true;
        }
        else{
          console.log('run that')
          this.props.navigation.goBack();
          
          return true;
        }
       }
      )
    }

    componentWillUnmount(){
      this.backhandler.remove();
    }

    goBack = () => {
      if(this.state.tncmodal){
        console.log('run this')
       this.setState({
         tncmodal: false
       })
       return true;
      }
      else{
        console.log('run that')
        this.props.navigation.goBack();
    
        return true;
      }
      
        //return true;
    }
    
    _makeBookingRequest =(params)=>{
        console.log("params for booking",JSON.stringify(params));
        this.setState({
            spinner: true,
        })
        BookingRequestAPI(params).then((result) => {
            console.log("Result",result.status);
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
            this.goBack()
           // this.openPropertyDetail(this.props.route.params.bookingDetails.resource_plan_details.property_id);
          }
        });
    }

    _handleRazorpay = async()=>{
      let user_details = await Session.getUserDetails();
      user_details = JSON.parse(user_details);
      //const order_id = 'order_'+this.props.route.params.bookingDetails.direct_booking_details.booking_id;
     // console.log(this.props.route.params.bookingDetails.direct_booking_details.id);
     console.log(this.props.route.params.bookingDetails.totalAmount);
     var amount = Math.round(this.state.totalCost)//Math.round(this.props.route.params.bookingDetails.totalAmount);
        var options = {
        description: 'Direct Booking Payment.',
          image: this.props.route.params.bookingDetails.image_path != null ? this.props.route.params.bookingDetails.image_path: 'https://i.imgur.com/3g7nmJC.png',
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
          theme: {color: 'orange'},
          timeout : 300, 
          retry: {
            enabled: true, 
            max_count: 3
          }, 

        }
        RazorpayCheckout.open(options).then(async(data) => {
          // handle success
          CommonHelpers.showFlashMsg("Payment Successful.")
          console.log(`Success: ${data.razorpay_payment_id}`);
          this.setState({
            paymentSuccess: true,
          }, ()=>{
            
            this.razor_callback(data.razorpay_payment_id);

          });
         
        }).catch((error) => {
          this.setState({
            paymentSuccess: false,
            paymentAttemptsRemaining : 0
          }, ()=>{
            console.log("payment failed: ", error,this.state.paymentSuccess, this.state.paymentAttemptsRemaining);
            if(error.description == "timeout" || error.code == 0 || error.code == 2 || error.error.reason == "payment_cancelled"){
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

      razor_callback = async(razorpay_payment_id)=>{
        this.setState({
          spinner: true
        })
        console.log(this.state.role_id)
        const params={
          "payment_id":razorpay_payment_id,
          "user_id":Number(await Session.getUserId()),
          "is_direct_booking":1,
          "booking_id":this.state.role_id == 7 ? this.state.bookingDetails.direct_booking_details.id : this.props.route.params.bookingDetails.direct_booking_details.id,
          "reference_id":this.state.role_id == 7 ?this.state.bookingDetails.direct_booking_details.booking_id : this.props.route.params.bookingDetails.direct_booking_details.booking_id,
        }

        MemberDirectBookingCallback(params).then(result=>{
          console.log("razorpay callback result: ", result.status, result.message);
          this.setState({
            spinner: false,
          })
          if(result.status){
            console.log(result.message);
            CustomePushNotifications.paymentSuccess("Payment Success","The transaction is completed successfully.",this.notifications)
            this.props.navigation.push('TopTabNavigator'),{
              payment: true,
            };
          }
          
          //CommonHelpers.showFlashMsg(result.message, "success");
          else
          CommonHelpers.showFlashMsg(result.message, "danger");

        }).catch(error=>console.log(error))

      }

      makeEmpDirectBooking = (bookingDetails)=>{
        console.log(JSON.stringify(bookingDetails));

        MemberDirectBookingAPI(bookingDetails).then(result=>{
            console.log(result.status);
            console.log("result: booking status", result.dataArray.booking_status )
            if(result.status){
                CommonHelpers.showFlashMsg(result.message, "success", result.dataArray);
                bookingDetails = {...bookingDetails, direct_booking_details: result.dataArray}
                this.setState({
                  bookingDetails: bookingDetails,
                }, ()=>{
                  console.log(this.state.bookingDetails.direct_booking_details.id);                })
                console.log("result: booking status", result.dataArray.booking_status )
                /* if (Number(result.dataArray.booking_status) == 6){
                  console.log("showing the payment pop up as booking status is ", result.dataArray.booking_status);
                  //show the payment pop up. 
                  this._handleRazorpay();
                }
                else  */if (Number(result.dataArray.booking_status) == 3 || Number(result.dataArray.booking_status) == 1 ) {

                  //CommonHelpers.showFlashMsg()
                  this.props.navigation.push('TopTabNavigator');
                
                }
            }
            else{
                CommonHelpers.showFlashMsg(result.message, "danger");
                this.openPropertyDetail(this.props.route.params.bookingDetails.resource_plan_details.property_id);
            }
        }).catch(error=> console.log("member direct booking error", error))
    }

    
      openPropertyDetail = (id) => {
        console.log(this.props.route.params.bookingDetails.resource_plan_details);
        console.log("Pressed")
        this.props.navigation.navigate('detail', {
          property_id: id,
      });
      
    };
    closeControlPanel = () => {
      this._drawer.close()
    };
    openControlPanel = () => {
      this._drawer.open()
    };

    applyDiscount = () => {
      let baseCost = Number(this.props.route.params.bookingDetails.baseCost)+ Number(this.props.route.params.bookingDetails.VASCost);
      console.log(this.state.selectedCoupon.is_percentage)
      if (this.state.selectedCoupon.is_percentage) {
          
          let newBaseCost = Number(baseCost) - (Number(this.state.selectedCoupon.amount) / 100) * Number(baseCost);

          console.log('new base cost : ', newBaseCost);
          this.setState({
              newBaseCost: newBaseCost,

          }, () => {
              this.calGST(this.state.newBaseCost);
          })
      } else if (this.state.selectedCoupon.is_percentage == 0) {
          
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
      this.calGST(Number(this.props.route.params.bookingDetails.baseCost)+ Number(this.props.route.params.bookingDetails.VASCost));
  }

  calGST = (baseCost) => {
    // console.log(this.baseCost(Number(this.state.data.resource_plan.price)), this.state.data.resource_plan != null ? this.state.data.resource_plan.price : 0)
    const GST = (Number(baseCost) * 18) / 100;
    this.setState({
        cgst: GST / 2,
        sgst: GST / 2,
       
        totalCost: Number(baseCost) + GST
    })
    console.log('GST is ', GST)
   // return Math.round(GST)
}

    render() {
        return (
          <Drawer
      ref={(ref) => this._drawer = ref}
  type="overlay"
  content={<Sidemenu navigation = {this.props.navigation} />}
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
            <View style={[renderItem.topViewMargin]}>
                {/**Custome header component */}
                <LogoHeader  
                navigation = {this.props.navigation}
                //title = {this.props.route.params.bookingDetails.is_direct_booking ? this.props.route.params.bookingDetails.direct_booking_details.booking_id : "Booking Summary"} 
                onBarsPress={()=>{
                  this.openControlPanel()}} />
                
                <View style={[renderItem.scrollViewcomponent, ]}>
                    <ScrollView>
                        {/** booking details brief starts */}
                        <View style={[box.centerBox, renderItem.fillWidthView,box.shadow_box,{ height: 280,/*  backgroundColor: "pink" */ marginBottom : "3%", marginTop: '3%'}]}>
                          <Image source = {this.props.route.params.bookingDetails.image_path != null ?{uri: this.props.route.params.bookingDetails.image_path}: require('./../Assets/images/workplace2.jpg')}
                          style = {[image.imageCover, { width: Dimensions.get('screen').width * 0.9, height: 150, alignSelf: 'center'}]}/>
                          <View style={{ flex: 1, margin: 10 }}>
                                
                                
                                    <Text style={[font.semibold, {marginBottom: 10},
                                    font.sizeLarge,
                                    color.blackColor]}>{'\u20B9'}{Intl.NumberFormat('en-IN').format(this.props.route.params.bookingDetails.baseCost)}
                                    </Text>
                                
                                    <Text style={[font.semibold,
                                    font.sizeRegular,
                                    color.blackColor,]}>{this.props.route.params.bookingDetails.property_name}
                                    </Text>
                                  
                                
                                    <Text style={[font.regular,
                                    font.semibold,
                                    color.blackColor]}>{this.props.route.params.bookingDetails.property_location}</Text>
                               
                            </View>
                        </View>
                        {/** booking details brief ends */}

                        <View style = {[renderItem.fillWidthView, box.shadow_box]}>

                        <View height = {80} style = {[ box.centerBox, /* box.simpleBox */]}>
                            <Text style = {[font.semibold, font.sizeMedium, color.blackColor, {marginBottom: 10}]}>Plan</Text>
                            <Text style = {[font.semibold, font.sizeRegular, color.darkgrayColor, ]}>{this.props.route.params.bookingDetails.plan_name}</Text>
                        </View>

                        <View  height = {80} style = {[box.centerBox/* box.simpleBox */]}>
                            <Text style = {[font.semibold, font.sizeMedium, color.blackColor, {marginBottom: 10}]}>Booking Dates</Text>
                            <Text style = {[font.semibold, font.sizeRegular, color.darkgrayColor, ]}>{moment(this.props.route.params.bookingDetails.startDate).format('DD MMMM YYYY, HH:mm')}Hrs - 
                             {" "+moment(this.props.route.params.bookingDetails.endDate).format('DD MMMM YYYY, HH:mm')}Hrs</Text>
                        </View>

                        <View  height = {80} style = {[box.centerBox]}>
                            <Text style = {[font.semibold, font.sizeMedium, color.blackColor, {marginBottom: 10}]}>Seats</Text>
                            <Text style = {[font.semibold, font.sizeRegular, color.darkgrayColor, ]}>{this.props.route.params.bookingDetails.seats} Seats</Text>
                        </View>
                                        
                        <View  height = {this.props.route.params.bookingDetails.VAS.length == 0? 80: this.props.route.params.bookingDetails.VAS.length * 80 +40} style = {[box.centerBox]}>
                            <Text style = {[font.semibold, font.sizeMedium, color.blackColor, {marginBottom: 10}]}>Value Added Services</Text>
                            <View>
                                {this.props.route.params.bookingDetails.VAS.length == 0? 
                                <Text style = {[font.semibold, font.sizeRegular, color.darkgrayColor, {marginLeft: "2%"}]}>
                                  No Value Added Services.
                                </Text>:
                                <View height  = {this.props.route.params.bookingDetails.VAS.length * 70 +40}/* nestedScrollEnabled = {true} style={{ maxHeight: 150, marginTop: "2%", marginLeft: "2%" }} */>
                                  <View style = {{flexDirection: "row", justifyContent : "flex-start", margin: "2%", flex: 1}}>
                                        <Text style = {[font.semibold, font.sizeVeryRegular, color.blackColor, {/* marginLeft: "2%", */ flex: 1,   textAlign: 'center'}]}>VAS </Text>
                                        <Text style = {[font.semibold, font.sizeVeryRegular, color.blackColor, {/* marginLeft: "2%", */flex: 1, textAlign: 'center'}]}>Units </Text>
                                        <Text style = {[font.semibold, font.sizeVeryRegular, color.blackColor, {/* marginLeft: "2%", */ flex: 1,  textAlign: 'center'}]}>Cost </Text>
                                        </View>
                            {
                               
                                this.props.route.params.bookingDetails.VAS.map((service, index) => {

                                    //console.log(" booked details",this.props.route.params.bookingDetails.VAS);
                                    return(
                                        <View style = {{flexDirection: "row", justifyContent : "flex-start", margin: "2%", flex: 1}}>
                                        <Text style = {[font.semibold, font.sizeSmall, color.darkgrayColor, {/* marginLeft: "2%", */ flex: 1, textAlign: 'center'}]}>{service.amenity_detail.amenity_name} </Text>
                                        <Text style = {[font.semibold, font.sizeSmall, color.darkgrayColor, {/* marginLeft: "2%", */ flex: 1,  textAlign: 'center'}]}>{service.unit} </Text>
                                        <Text style = {[font.semibold, font.sizeSmall, color.darkgrayColor, {/* marginLeft: "2%", */ flex: 1, textAlign: 'center'}]}>{'\u20B9'}{Intl.NumberFormat('en-IN').format(service.totalCost)} </Text>
                                        </View>
                                    );
                                  
                                })
                            }
                            </View>
    }
                            </View>
                        </View>

                        </View>


                        <View height = {50} style = {[box.simpleBox,
                            {flexDirection: 'row', 
                            justifyContent: "flex-start", 
                            alignItems: "center"}]}>
                            <Switch 
                             trackColor={{ false: "#767577", true: "orange" }}
                             thumbColor={this.state.isEnabled ? "#fff" : "#f4f3f4"}
                             ios_backgroundColor="#3e3e3e"
                             onValueChange={value =>{
                                 console.log(value)
                                this.setState({
                                 isEnabled: value,
                             })}}
                             value={this.state.isEnabled}
                             />
                             <TouchableOpacity onPress = {()=>{this.setState({
                                 tncmodal: true,
                             })}}>
                             <Text style = {[
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

                        <View  height = {70} style = {[box.centerBox/* box.simpleBox */]}>
                            <Text style = {[font.semibold, font.sizeRegular, color.blackColor, {marginBottom: 10}]}>Transaction Date</Text>
                            <Text style = {[font.semibold, font.sizeVeryRegular, color.darkgrayColor, ]}>{moment(new Date()).format('DD MMMM YYYY, HH:mm')}Hrs </Text>
                        </View>

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
                             <View height = {200} style = {[box.centerBox, {marginBottom:70}]}>
                              <View style = {{flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>
                              <Text style = {[font.bold, font.sizeVeryRegular, color.blackColor ,{flexWrap: 'wrap', width: '60%'}]}>Sub Total</Text>
                              <Text style = {[font.bold, font.sizeVeryRegular, color.blackColor]}> {'\u20B9'} {Intl.NumberFormat('en-IN').format(this.props.route.params.bookingDetails.baseCost)}</Text>
                              </View>
                              {
                                this.props.route.params.bookingDetails.VAS.length == 0? null:
                                 <View style = {{flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>
                                 <Text style = {[font.bold, font.sizeVeryRegular, color.blackColor]}>Value added services</Text>
                                 <Text style = {[font.bold, font.sizeVeryRegular, color.blackColor]}> {'\u20B9'} {Intl.NumberFormat('en-IN').format(this.props.route.params.bookingDetails.VASCost)}</Text>
                                 </View>

                              }

{
                            this.state.newBaseCost !=null ?
                            <View
                            style={[box.horizontalBox]}>
                                {
                                    this.state.selectedCoupon.is_percentage ? 
                                    <Text style={[
                                      font.bold, font.sizeVeryRegular, color.blackColor,
                                        { width: '50%' }
        
                                    ]}>After {this.state.selectedCoupon.amount}% discount</Text>:

                                    <Text style={[
                                      font.bold, font.sizeVeryRegular, color.blackColor,
                                        { width: '50%' }
        
                                    ]}>Discount Amount</Text>



                                }

                                {
                                    this.state.selectedCoupon.is_percentage ?
                                
                            
                            <Text style={[
                              font.bold, font.sizeVeryRegular, color.blackColor,
                                { width: '50%', textAlign: 'right' }

                            ]}>-{'\u20B9'}{Intl.NumberFormat("en-IN").format((Number(this.state.selectedCoupon.amount)/100)* Number(this.state.baseCost))}</Text>
                        :
                        <Text style={[
                          font.bold, font.sizeVeryRegular, color.blackColor,
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
                                font.bold, font.sizeVeryRegular, color.blackColor,
                                { width: '50%' }

                            ]}>After Discount</Text>
                            <Text style={[
                                font.bold, font.sizeVeryRegular, color.blackColor,
                                { width: '50%', textAlign: 'right' }

                            ]}>{'\u20B9'}{Intl.NumberFormat("en-IN").format(this.state.newBaseCost)}</Text>
                        </View>
                             : null
                        }
                             

                              <View style = {{flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>
                              <Text style = {[font.bold, font.sizeVeryRegular, color.blackColor]}>CGST</Text>
                              <Text style = {[font.bold, font.sizeVeryRegular, color.blackColor]}> {'\u20B9'} {Intl.NumberFormat('en-IN').format(this.state.cgst/* this.props.route.params.bookingDetails.CGST */)}</Text>
                              </View>
                              <View style = {{flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>
                              <Text style = {[font.bold, font.sizeVeryRegular, color.blackColor]}>SGST</Text>
                              <Text style = {[font.bold, font.sizeVeryRegular, color.blackColor]}> {'\u20B9'} {Intl.NumberFormat('en-IN').format(this.state.sgst/* this.props.route.params.bookingDetails.SGST */)}</Text>
                              </View>

                              <View style = {{flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>
                              <Text style = {[font.bold, font.sizeLarge, color.blackColor]}>Total Amount</Text>
                              <Text style = {[font.bold, font.sizeLarge, color.blackColor]}> {'\u20B9'} {Intl.NumberFormat('en-IN').format(Math.round(this.state.totalCost/* this.props.route.params.bookingDetails.totalAmount */))}</Text>
                              </View>
                            
                        </View>

                    </ScrollView>
                </View>

                {
                  this.state.role_id == 7 ?
                  this.state.paymentSuccess ? 

                  <TouchableOpacity  height={100} style={{
                    //right: 10,
                     backgroundColor: "orange",
                //left: 10,
                    //position: 'absolute',
                    height: "8%",
                    //bottom: 100,
                    marginTop: "auto",
                    flexDirection: "row", justifyContent: "center", 
                }}  onPress={() => { //console.error(this.state.isEnabled);

                  console.log('done clicked')
                  this.props.navigation.push('TopTabNavigator'),{
                    payment: true,
                  };
                    
                        //this._makeBookingRequest(this.props.route.params.bookingDetails.details_for_api_request[0]);
                 }}>
                     <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                        <Text style={[font.sizeLarge,
                        font.regular, color.textWhiteColor, {
                            //backgroundColor: "orange",
                            borderColor: "orange",
                            //height: "100%", 
                            marginRight: 15
                        }
                        ]}>Done</Text>
                        <Icon name="arrow-right" size={20} color={"white"} />
                    </View>

                </TouchableOpacity> :
                  <View  height={100} style={{
                    //right: 10,
                     backgroundColor: "orange",
                //left: 10,
                    //position: 'absolute',
                    height: "8%",
                    //bottom: 100,
                    marginTop: "auto",
                    flexDirection: "row", justifyContent: "space-around", 
                }}>
            <TouchableOpacity style = {{height: "100%", width: "50%", backgroundColor: "white" }}
                onPress={() => { 
                    this.goBack()
                 }}>
                     {this.state.spinner ? <Spinner/>: 

                <View style={{ flexDirection: "row", 
                justifyContent: "center", 
                alignItems: "center", 
                //alignContent: "center",
                //backgroundColor: "blue",
                 borderTopWidth: 0.5, 
                 borderTopColor: "black", 
                 height: "100%",  }}>
                    <Text style={[font.sizeLarge,
                    font.regular, color.lightBlack, {
                        //backgroundColor: "white",
                        borderColor: "orange",
                        //height: "100%", 
                        marginRight: 15,
                      //justifyContent: "center"
                    }
                    ]}>Cancel</Text>
                    <Icon name="close" size={20} color={"black"} />
                </View>
                     } 

            </TouchableOpacity>
            <TouchableOpacity style = {{height: "100%", width: "50%"}}//disabled = {!this.state.isEnabled}
                onPress={() => { 

                  if(!this.state.isEnabled ){
                    CommonHelpers.showFlashMsg("Please accept the Terms and Conditions.", "danger")
                  }
                  else if(this.props.route.params.bookingDetails.resource_plan_details.admin_only == 0 && 
                    this.props.route.params.bookingDetails.resource_plan_details.is_only_request_booking == 0){
                        console.log('direct booking.');
                    this.makeEmpDirectBooking(this.props.route.params.bookingDetails.details_for_api_request[0])
                  }
                  else{
                    console.log('request booking.');
                    this._makeBookingRequest(this.props.route.params.bookingDetails.details_for_api_request[0]);
                  }
                    
                 }}
                >
                    {this.state.spinner ? <Spinner/>:

                    
                    <View style={{ flexDirection: "row", 
                    justifyContent: "center", 
                   alignItems: "center", 
                    alignContent: "center",
                    //backgroundColor: "blue",
                    flexWrap: 'wrap',
                     borderTopWidth: 0.5, 
                     borderTopColor: "black", 
                     height: "100%",  }}>
                    <Text style={[font.sizeLarge,
                    font.regular, color.textWhiteColor, {
                        //backgroundColor: "orange",
                        borderColor: "orange",
                        //height: "100%", 
                        marginRight: 15,
                        
                    }
                    ]}>Book Now</Text>
                    <Icon name="arrow-right" size={20} color={"white"} />
                </View>
                    }

            </TouchableOpacity>

                  </View>
                  
                  
                  :


                  this.props.route.params.bookingDetails.resource_plan_details.admin_only == 0 && this.props.route.params.bookingDetails.resource_plan_details.is_only_request_booking == 0 ? 
                
                 this.state.paymentSuccess ? 

                  <TouchableOpacity  height={100} style={{
                    //right: 10,
                     backgroundColor: "orange",
                //left: 10,
                    //position: 'absolute',
                    height: "8%",
                    //bottom: 100,
                    marginTop: "auto",
                    flexDirection: "row", justifyContent: "center", 
                }}  onPress={() => { //console.error(this.state.isEnabled);
                  console.log("done");
                  this.props.navigation.push('TopTabNavigator');
                   
                        //this._makeBookingRequest(this.props.route.params.bookingDetails.details_for_api_request[0]);
                 }}>
                     <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                        <Text style={[font.sizeLarge,
                        font.regular, color.textWhiteColor, {
                            //backgroundColor: "orange",
                            borderColor: "orange",
                            //height: "100%", 
                            marginRight: 15
                        }
                        ]}>Done</Text>
                        <Icon name="arrow-right" size={20} color={"white"} />
                    </View>

                </TouchableOpacity>
                  : 
                  this.state.paymentSuccess == false ? 
                    this.state.paymentAttemptsRemaining == 0 ? null :
                  
                    <TouchableOpacity  height={100} style={{
                    //right: 10,
                     backgroundColor: "orange",
                //left: 10,
                    //position: 'absolute',
                    height: "8%",
                    //bottom: 100,
                    marginTop: "auto",
                    flexDirection: "row", justifyContent: "center", 
                }}  onPress={() => { //console.error(this.state.isEnabled);

               this._handleRazorpay();
                   
                        //this._makeBookingRequest(this.props.route.params.bookingDetails.details_for_api_request[0]);
                 }}>
                     <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                        <Text style={[font.sizeLarge,
                        font.regular, color.textWhiteColor, {
                            //backgroundColor: "orange",
                            borderColor: "orange",
                            //height: "100%", 
                            marginRight: 15
                        }
                        ]}>{this.state.paymentAttemptsRemaining} attempts remaining. Try Again</Text>
                        <Icon name="arrow-right" size={20} color={"white"} />
                    </View>

                </TouchableOpacity>
                  : 
                <View  height={100} style={{
                        //right: 10,
                         backgroundColor: "orange",
                    //left: 10,
                        //position: 'absolute',
                        height: "8%",
                        //bottom: 100,
                        marginTop: "auto",
                        flexDirection: "row", justifyContent: "space-around", 
                    }}>
                <TouchableOpacity style = {{height: "100%", width: "50%", backgroundColor: "white" }}
                    onPress={() => { 
                        this.goBack()
                     }}>
                        {this.state.spinner ? <Spinner/>:

                    <View style={{ flexDirection: "row", 
                    justifyContent: "center", 
                    alignItems: "center", 
                    //alignContent: "center",
                    //backgroundColor: "blue",
                     borderTopWidth: 0.5, 
                     borderTopColor: "black", 
                     height: "100%",  }}>
                        <Text style={[font.sizeLarge,
                        font.regular, color.lightBlack, {
                            //backgroundColor: "white",
                            borderColor: "orange",
                            //height: "100%", 
                            marginRight: 15,
                          //justifyContent: "center"
                        }
                        ]}>Cancel</Text>
                        <Icon name="close" size={20} color={"black"} />
                    </View>
                        }

                </TouchableOpacity>
                <TouchableOpacity style = {{height: "100%", width: "50%"}}//disabled = {!this.state.isEnabled}
                    onPress={() => { console.error(this.state.isEnabled);
                        !this.state.isEnabled? CommonHelpers.showFlashMsg("Please accept the Terms and Conditions.", "danger")
                        :
                        this._handleRazorpay();
                            //this._makeBookingRequest(this.props.route.params.bookingDetails.details_for_api_request[0]);
                     }}
                    >
                        {this.state.spinner ? <Spinner/>:

                        
                        <View style={{ flexDirection: "row", 
                        justifyContent: "center", 
                        alignItems: "center", 
                        //alignContent: "center",
                        //backgroundColor: "blue",
                         borderTopWidth: 0.5, 
                         borderTopColor: "black", 
                         height: "100%",  }}>
                        <Text style={[font.sizeLarge,
                        font.regular, color.textWhiteColor, {
                            //backgroundColor: "orange",
                            borderColor: "orange",
                            //height: "100%", 
                            marginRight: 15
                        }
                        ]}>Pay Now</Text>
                        <Icon name="arrow-right" size={20} color={"white"} />
                    </View>
                        }

                </TouchableOpacity>

                </View>
                 

                : 
                <TouchableOpacity  height={100} style={{
                    //right: 10,
                     backgroundColor: "orange",
                //left: 10,
                    //position: 'absolute',
                    height: "8%",
                    //bottom: 100,
                    marginTop: "auto",
                    flexDirection: "row", justifyContent: "center", 
                }}  onPress={() => { console.error(this.state.isEnabled);
                    !this.state.isEnabled? 
                    CommonHelpers.showFlashMsg("Please accept the Terms and Conditions.", "danger")
                    :
                        this._makeBookingRequest(this.props.route.params.bookingDetails.details_for_api_request[0]);
                 }}>
                     <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                        <Text style={[font.sizeLarge,
                        font.regular, color.textWhiteColor, {
                            //backgroundColor: "orange",
                            borderColor: "orange",
                            //height: "100%", 
                            marginRight: 15
                        }
                        ]}>Send Request</Text>
                        <Icon name="arrow-right" size={20} color={"white"} />
                    </View>

                </TouchableOpacity>
                    }

              

               
                {//this.state.spinner && <Spinner />
                }


                {this.state.tncmodal && <Modal position={"center"} swipeToClose = {false}
                onClosed = {()=>{this.setState({tncmodal: false})}}
                style  ={{
                    justifyContent: 'space-around',
                    alignItems: 'space-around',
                    padding: 20,
                    height: Dimensions.get('screen').height * 0.7,
                    width:Dimensions.get('screen').width * 0.9,
                  }} isOpen={this.state.tncmodal}>
                <View height = {"100%"}>
                    <ScrollView keyboardShouldPersistTaps = {"always"}>
            <Text style = {[font.bold, font.sizeLarge, color.myOrangeColor, {textAlign: "center", marginBottom: "10%"}]}>Terms</Text>
            <Text style = {[font.regular, font.sizeRegular, color.darkgrayColor, {textAlign: "justify", marginBottom: "10%"}]}>{"Effective Date: " + moment().format("DD MMMM, YYYY")}</Text>
            <Text style = {[font.regular, font.sizeRegular, color.darkgrayColor, {textAlign: "justify", lineHeight: 14 + 14*1}]}>
                {termsandconditions}
            </Text>
            <Text style = {[font.bold, font.sizeLarge, color.myOrangeColor, {textAlign: "center", marginBottom: "10%"}]}>Eligibility</Text>
            <Text style = {[font.regular, font.sizeRegular, color.darkgrayColor, {textAlign: "justify", lineHeight: 14 + 14*1}]}>
                {elegibilty_text}
            </Text>
            <Text style = {[font.bold, font.sizeLarge, color.myOrangeColor, {textAlign: "center", marginBottom: "10%"}]}>Content</Text>
            <Text style = {[font.regular, font.sizeRegular, color.darkgrayColor, {textAlign: "justify", lineHeight: 14 + 14*1}]}>
                {content_text}
            </Text>

            <Text style = {[font.bold, font.sizeLarge, color.myOrangeColor, {textAlign: "center", marginBottom: "10%"}]}>CLAIMS OF COPYRIGHT INFRINGEMENT</Text>
            <Text style = {[font.regular, font.sizeRegular, color.darkgrayColor, {textAlign: "justify", lineHeight: 14 + 14*1}]}>
                {CLAIMS_OF_COPYRIGHT_INFRINGEMENT_text}
            </Text>

            <Text style = {[font.bold, font.sizeLarge, color.myOrangeColor, {textAlign: "center", marginBottom: "10%"}]}>REVIEWS, ENQUIRIES, COMMENTS AND USE OF OTHER INTERACTIVE AREAS</Text>
            <Text style = {[font.regular, font.sizeRegular, color.darkgrayColor, {textAlign: "justify", lineHeight: 14 + 14*1}]}>
                {review_text1}
            </Text>
            <Text style = {[font.regular, font.sizeRegular, color.darkgrayColor, {textAlign: "justify", lineHeight: 14 + 14*1}]}>
                {review_text2}
            </Text>
            <Text style = {[font.regular, font.sizeRegular, color.darkgrayColor, {textAlign: "justify", lineHeight: 14 + 14*1}]}>
                {review_text3}
            </Text>
            <Text style = {[font.regular, font.sizeRegular, color.darkgrayColor, {textAlign: "justify", lineHeight: 14 + 14*1}]}>
                {review_text4}
            </Text>
            <Text style = {[font.regular, font.sizeRegular, color.darkgrayColor, {textAlign: "justify", lineHeight: 14 + 14*1}]}>
                {review_text5}
            </Text>
            <Text style = {[font.regular, font.sizeRegular, color.darkgrayColor, {textAlign: "justify", lineHeight: 14 + 14*1}]}>
                {review_text6}
            </Text>

            <Text style = {[font.bold, font.sizeLarge, color.myOrangeColor, {textAlign: "center", marginBottom: "10%"}]}>BERIGHTHERE.COM SPACE ACCOUNTS</Text>
            <Text style = {[font.regular, font.sizeRegular, color.darkgrayColor, {textAlign: "justify", lineHeight: 14 + 14*1}]}>
                {space_accounts_text1}
            </Text>
            <Text style = {[font.regular, font.sizeRegular, color.darkgrayColor, {textAlign: "justify", lineHeight: 14 + 14*1}]}>
                {space_accounts_text2}
            </Text>
            <Text style = {[font.regular, font.sizeRegular, color.darkgrayColor, {textAlign: "justify", lineHeight: 14 + 14*1}]}>
                {space_accounts_text3}
            </Text>

            <Text style = {[font.bold, font.sizeLarge, color.myOrangeColor, {textAlign: "center", marginBottom: "10%"}]}>USER ACCOUNTS</Text>
            <Text style = {[font.regular, font.sizeRegular, color.darkgrayColor, {textAlign: "justify", lineHeight: 14 + 14*1}]}>
                {user_accounts_text1}
            </Text>

            <Text style = {[font.regular, font.sizeRegular, color.darkgrayColor, {textAlign: "justify", lineHeight: 14 + 14*1}]}>
                {user_accounts_text2}
            </Text>
            <Text style = {[font.bold, font.sizeLarge, color.myOrangeColor, {textAlign: "center", marginBottom: "10%"}]}>USER ACCOUNT DELETION</Text>
            <Text style = {[font.regular, font.sizeRegular, color.darkgrayColor, {textAlign: "justify", lineHeight: 14 + 14*1}]}>
                {user_account_deletion}
            </Text>

            <Text style = {[font.bold, font.sizeLarge, color.myOrangeColor, {textAlign: "center", marginBottom: "10%"}]}>DISPUTES BETWEEN COWORKING SPACES AND USERS</Text>
            <Text style = {[font.regular, font.sizeRegular, color.darkgrayColor, {textAlign: "justify", lineHeight: 14 + 14*1}]}>
                {disputes_text}
            </Text>

            <Text style = {[font.bold, font.sizeLarge, color.myOrangeColor, {textAlign: "center", marginBottom: "10%"}]}>THIRD-PARTY SUPPLIERS</Text>
            <Text style = {[font.regular, font.sizeRegular, color.darkgrayColor, {textAlign: "justify", lineHeight: 14 + 14*1}]}>
                {third_party_text}
            </Text>

            <Text style = {[font.bold, font.sizeLarge, color.myOrangeColor, {textAlign: "center", marginBottom: "10%"}]}>LINKS TO THIRD-PARTY SITES</Text>
            <Text style = {[font.regular, font.sizeRegular, color.darkgrayColor, {textAlign: "justify", lineHeight: 14 + 14*1}]}>
                {link_text}
            </Text>

            <Text style = {[font.bold, font.sizeLarge, color.myOrangeColor, {textAlign: "center", marginBottom: "10%"}]}>LIABILITY DISCLAIMER</Text>
            <Text style = {[font.regular, font.sizeRegular, color.darkgrayColor, {textAlign: "justify", lineHeight: 14 + 14*1}]}>
                {liability_text}
            </Text>

            <Text style = {[font.bold, font.sizeLarge, color.myOrangeColor, {textAlign: "center", marginBottom: "10%"}]}>INDEMNIFICATION</Text>
            <Text style = {[font.regular, font.sizeRegular, color.darkgrayColor, {textAlign: "justify", lineHeight: 14 + 14*1}]}>
                {indem_text}
            </Text>

            <Text style = {[font.bold, font.sizeLarge, color.myOrangeColor, {textAlign: "center", marginBottom: "10%"}]}>MICELLANEOUS</Text>
            <Text style = {[font.regular, font.sizeRegular, color.darkgrayColor, {textAlign: "justify", lineHeight: 14 + 14*1}]}>
                {mis_text}
            </Text>

            <Text style = {[font.bold, font.sizeLarge, color.myOrangeColor, {textAlign: "center", marginBottom: "10%"}]}>MODIFICATIONS TO THIS AGREEMENT</Text>
            <Text style = {[font.regular, font.sizeRegular, color.darkgrayColor, {textAlign: "justify", lineHeight: 14 + 14*1}]}>
                {mod_text}
            </Text>

            <Text style = {[font.bold, font.sizeLarge, color.myOrangeColor, {textAlign: "center", marginBottom: "10%"}]}>COPYRIGHT AND TRADEMARK NOTICES</Text>
            <Text style = {[font.regular, font.sizeRegular, color.darkgrayColor, {textAlign: "justify", lineHeight: 14 + 14*1}]}>
                {copyright_text}
            </Text>

            <Text style = {[font.bold, font.sizeLarge, color.myOrangeColor, {textAlign: "center", marginBottom: "10%"}]}>CONTACT</Text>
            <Text style = {[font.regular, font.sizeRegular, color.darkgrayColor, {textAlign: "justify", lineHeight: 14 + 14*1}]}>
                {contact_text}
            </Text>


            </ScrollView>
            </View>
           
                    </Modal>}

                    {this.state.spinner && <Spinner/>}

                
         




            </View>
            </Drawer>
        );
    }
}