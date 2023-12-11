//import Snackbar from "react-native-snackbar";
import moment from "moment";
import { property_searchAPI } from "../Rest/userAPI";
/* import Toast from 'react-native-simple-toast'; */
import Toast from 'react-native-root-toast';


import { AWS_URL } from "../config/RestAPI";
import color from "../Styles/color";
const CommonHelpers = {

  validateEmail: (email) => {
    var emailPattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (emailPattern.test(email)) {
      return true;
    } else {
      return false;
    }
  },

  validateName: (name) => {
    var namePattern = /^[^_ ][a-zA-Z]*[^_ ]$/;///^[a-zA-Z_ ]*$/;
    if (namePattern.test(name)) {
      return true;
    } else {
      return false;
    }
  },

  validatePassword: (password) => {
    var passwordPattern = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&]).{6,}/;
    if (passwordPattern.test(password)) {
      return true;
    } else {
      return false;
    }
  },

  validatePhoneNumber: (phone) => {
    var phonePattern = /^\d{4}\-\d{6}$/ // /^\(\d{3}\)\s\d{3}-\d{4}$/;
    if (phonePattern.test(phone)) {
      return true;
    } else {
      return false;
    }
  },

  showFlashMsg(msg, type) {
    //console.warn("testing testing", type);
   /*  Snackbar.show({
      text: msg,
      duration: Snackbar.LENGTH_LONG,
      textColor: "#fff",
      
      // fontFamily: "Montserrat-SemiBold",
      backgroundColor: type == "danger" ? "red" : "green",
      
    }); */
    Toast.show(msg, {
      duration: Toast.durations.LONG,
      position: Toast.positions.TOP,
      shadow: true,
      animation: true,
      hideOnPress: true,
      delay: 0,
      backgroundColor:color.myOrangeColor.color,

      onShow: () => {
          // calls on toast\`s appear animation start
      },
      onShown: () => {
          // calls on toast\`s appear animation end.
      },
      onHide: () => {
          // calls on toast\`s hide animation start.
      },
      onHidden: () => {
          // calls on toast\`s hide animation end.
      }
  });
   /*  Toast.showWithGravity(msg, Toast.LONG, Toast.TOP); */

  },

  async searchCall(params, navigation) {
   console.log('params for search api: ', params)
    property_searchAPI(params).then(async (result) => {
    console.log("from " + "search results: ", result.status);

      if (result.status) {
        navigation.push('SRP', 
          {
            param: result.dataArray,
            //searchTerm: true,
          }
        );
      } else {
        if (result.message == "Request failed with status code 404") {
          CommonHelpers.showFlashMsg("No properties to show.", "danger");
        }
        else
          CommonHelpers.showFlashMsg(result.message, "danger");
      }
    })
  },

  bookingStatusInfo(booking_status) {
    console.log("this.state.data.booking_status", booking_status);
    let statusText = '--'
    switch (booking_status) {
      case '0':
        statusText = "Booking Request Sent";

        break;
      case '1':
        statusText = "Confirmed";

        break;
      case '2':
        statusText = "Rejected";

        break;
      case '3':
        statusText = "Waiting for Corporate Approval"

        break;
      case '4':
        statusText = "Corporate Rejected"

        break;
      case '5':
        statusText = "Payment Pending"

        break;
      case '6':
        statusText = "Payment Failure"

        break;
      case '7':
        statusText = "Completed"
        break;
      case '8':
        statusText = "Expired"
        break;
      case '9':
        statusText = "Payment Failure"
        break;
      case '10':
        statusText = 'Cancellation Requested'//"Booking Cancel Request"
        break;
      case '11':
        statusText = "Booking Cancelled"
        break;
      case '12':
        statusText = "Modify Booking request"
        break;
      case '13':
        statusText = "Modify booking request approve"
        break;
      case '14':
        statusText = "Modify booking request reject"
        break;
      case '15':
        statusText = "Modify booking payment pending"
        break;
      case '16':
        statusText = "User cancel request rejected"
        break;


    }
    return statusText;
  },

  issueStatusInfo(booking_status) {
    // //////console.log("this.state.data.booking_status",booking_status);
    let statusText = '--'
    switch (booking_status) {

      case '1':
        statusText = "Open";

        break;
      case '2':
        statusText = "Assigned To Staff";

        break;
      case '3':
        statusText = "In Progress"

        break;
      case '4':
        statusText = "Resolved"

        break;
      case '5':
        statusText = "Re-Open"

        break;
      case '6':
        statusText = "Closed"

        break;


    }
    return statusText;
  },

  offDays(property_timings) {
    //////console.log('week off for this property: ',property_timings);
    let weekends = []

    property_timings.map((day, index) => {
      if (day.is_open == 0) {
        switch (day.day_id) {
          case 'mon': weekends.push(1);
            break;
          case 'tue': weekends.push(2);
            break;
          case 'wed': weekends.push(3);
            break;
          case 'thu': weekends.push(4);
            break;
          case 'fri': weekends.push(5);
            break;
          case 'sat': weekends.push(6);
            break;
          case 'sun': weekends.push(0);
            break;
        }
      }
    })
    //////console.log(weekends);
    return weekends;



  },

  processRawImages(rawimages) {
    //console.log('images list in the function to process: ',rawimages)
    let imageList = [];
    if (rawimages.length > 1) {
      ////////console.log(rawimages);
      let defaultImageIndex = rawimages.findIndex(i => Number(i.is_default) === 1);
      ////////console.log('default index: ', defaultImageIndex);
      if (defaultImageIndex > -1) {
        let defaultObj = rawimages.splice(defaultImageIndex, 1);
        ////////console.log(defaultObj);
        rawimages.unshift(defaultObj[0])

        rawimages.forEach(element => {
          ////////console.log('element: ', element)
          imageList.push({ url: AWS_URL + element.image_path });
        });
        //////console.log('carousel images',rawimages);
        return imageList;
        ////////console.log('Images : ', rawimages);
      }
      else {

        rawimages.forEach(element => {
          imageList.push({ url: AWS_URL + element.image_path });
        });
        //console.log(imageList);
        return imageList;
      }

    }
    else {

      rawimages.forEach(element => {
        imageList.push({ url: AWS_URL + element.image_path });
      });
      ////////console.log(imageList);
      return imageList;
    }
  },
  getAlertTime(closing_time){
    let date = new Date()
                date = new Date(date.getFullYear(), date.getMonth(), date.getDate(), Number(closing_time.split(':')[0]), Number(closing_time.split(':')[1]));
                const alert_time = new Date(date - 10*60000);
                console.log('Alert time to set: ', moment(alert_time).format('DD-MM-YYYY: HH-mm'))
                return alert_time;             
}, 
getOneHourAlertTime(closing_time){
  let date = new Date(closing_time)
              //date = new Date(date.getFullYear(), date.getMonth(), date.getDate(), Number(closing_time.split(':')[0]), Number(closing_time.split(':')[1]));
              const alert_time = new Date(date - 60*60000);
              console.log('Alert time to set: ', moment(alert_time).format('DD-MM-YYYY: HH-mm'))
              return alert_time;             
},

getMomentTime(m){
  console.log(m);
  return moment({hour: m.hour(), minute: m.minute()});
},

  handleMemberNavigation(navigation){
    navigation.push('TopTabNavigator', {screen: 'Current'});
  },
  handleEmployeeNavigation(navigation){
    navigation.push('seatreservationlist', {screen: 'Current'});
  },
  handleLoginNavigation(navigation){
    navigation.push('auth', {screen: 'Login'})
  },
  getDay(day_code) {
    let day = ''
    switch (Number(day_code)) {
        case 1: day = 'M'
            break;
        case 2: day = 'T';
            break;
        case 3: day = 'W';
            break;
        case 4: day = 'T';
            break;
        case 5: day = 'F';
            break;
        case 6: day = 'S';
            break;
        case 0: day = 'S';
            break;
    }
    return day;
}
};
export default CommonHelpers;
