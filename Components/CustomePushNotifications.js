import { Platform } from "react-native";

import PushNotification from "react-native-push-notification";
import Session from "../config/Session";
import CommonHelpers from "../Utils/CommonHelpers";

/* class CustomePushNotifications{
    constructor(){
        PushNotification.configure({
            onRegister: function(token){

            },
            onNotification: function(notification){
                //console.log(' on Notification called', notification);
                if(notification.action == "Checkout Now"){
                    //console.log('checkout pressed.')
                }
                else if (notification.action == 'something'){
                    //console.log('something pressed.')
                }
                notification.finish();
            },

            permissions: {
                alert: true,
                badge: true,
                sound: true,
              },
            popInitialNotification : true, 
            requestPermissions: Platform.OS === 'ios' ? true : false,
        });

        PushNotification.createChannel(
            {
                channelId: 'checkoutRemainder',
                channelName: 'Alert to Checkout of the Property',
                channelDescription: 'Alert to inform the user will be auto checked out of the property for the day after 10 mins.'
            },
            ()=>{},
        
        );

        PushNotification.createChannel(
            {
                channelId: 'checkinRemainder',
                channelName: 'Alert to Check in to the Property',
                channelDescription: 'Alert to inform the user has been checked in to the property.'
            },
            ()=>{},
        
        );

        PushNotification.getScheduledLocalNotifications(rn =>{
            //console.log('SN--', rn);
        });

       
    }

    checkoutReminder(date, test){
        //console.log('Time for notification: ', date);
        PushNotification.localNotificationSchedule({
            id: '1',
            channelId: 'checkoutRemainder',
            title: 'Checkout Alert!',
            message: 'You shall be auto checked-out of the'+ test+'property soon.',
            playSound: true,
            date: date,//new Date(new Date().getTime()+5000),
            vibrate: true, // (optional) default: true
    vibration: 800, 
    ongoing: true,
    actions: ['Checkout Now', 'something'],
    invokeApp: true
        });
    }

    checkinReminder(date){
        //console.log('Time for notification: ', date);
        PushNotification.localNotificationSchedule({
            id: '2',
            channelId: 'checkinRemainder',
            title: 'Checkin Alert!',
            message: 'You have checked in to the property',
            date: date,//new Date(new Date().getTime()+5000),
            vibrate: true, // (optional) default: true
            vibration: 300, 
            ongoing: true,
            
        });
    }

    cancelcheckoutNotification(id){
        PushNotification.cancelLocalNotification(id);

    }
} */

const CustomePushNotifications = {

    configureNotifis: (navigation)=>{
        PushNotification.configure({
            onRegister: function(token){

            },
            onNotification: async function(notification){
                console.log(' on Notification called', notification);

                if (await Session.getUserName() == null ? 1:0)
                CommonHelpers.handleLoginNavigation(navigation);

                else{
                    if(Number(notification.data.type) === 0)
                CommonHelpers.handleMemberNavigation(navigation);
                else if(Number(notification.data.type) === 1)
                CommonHelpers.handleEmployeeNavigation(navigation);
                else
                CommonHelpers.handleLoginNavigation(navigation);

                }
                
                if(notification.action == "Checkout Now"){
                    //console.log('checkout pressed.');
                    
                    //handlePushNavigation(notification);
                }
                /* else if (notification.action == 'something'){
                    //console.log('something pressed.')
                } */
                notification.finish();
            },

            permissions: {
                alert: true,
                badge: true,
                sound: true,
              },
            popInitialNotification : true, 
            requestPermissions: Platform.OS === 'ios' ? true : false,
        });

        PushNotification.createChannel(
            {
                channelId: 'checkoutRemainder',
                channelName: 'Alert to Checkout of the Property',
                channelDescription: 'Alert to inform the user will be auto checked out of the property for the day after 10 mins.'
            },
            ()=>{},
        
        );

        PushNotification.createChannel(
            {
                channelId: 'checkinRemainder',
                channelName: 'Alert to Check in to the Property',
                channelDescription: 'Alert to inform the user has been checked in to the property.'
            },
            ()=>{},
        
        );

        PushNotification.createChannel(
            {
                channelId: 'paymentSuccessRemainder',
                channelName: 'Alert to notify payment success',
                channelDescription: 'Alert to inform the user has completed the payment successfully.'
            },
            ()=>{},
        
        );

        PushNotification.createChannel(
            {
                channelId: 'meetingRemainder',
                channelName: 'Alert to notify the upcoming meeting.',
                channelDescription: 'Alert the user to join the meeting in 10 minutes.'
            },
            ()=>{},
        
        );

        PushNotification.getScheduledLocalNotifications(rn =>{
            //console.log('SN--', rn);
        });

        return PushNotification;

    },
    
    checkoutReminder: (date, test, PushNotification, details)=>{
        //console.log('Time for notification: ', date);
        PushNotification.localNotificationSchedule({
            id: '1',
            channelId: 'checkoutRemainder',
            title: 'Checkout Alert!',
            message: 'You shall be auto checked-out of the'+ test+'property soon.',
            playSound: true,
            date: date,//new Date(new Date().getTime()+5000),
            vibrate: true, // (optional) default: true
    vibration: 800, 
    ongoing: true,
    actions: ['Checkout Now'],
    invokeApp: true,
    priority: "high",
    data:{
        type: details.type, // member = 0 or employee = 1 or open seating = 2
    }
        });
    },

    checkinReminder: (date,title, message, PushNotification, details)=>{
        console.log('Time for notification: ', date);
        PushNotification.localNotification({
            id: '2',
            channelId: 'checkinRemainder',
            title: title, //'Checkin Alert!',
            message: message,//'You have checked in to the property',
            date: date,//new Date(new Date().getTime()+5000),
            vibrate: true, // (optional) default: true
            vibration: 300, 
            ongoing: true,
            data:{
                type: details.type, // member = 0 or employee = 1
            }
            
            
        });
    },

    cancelcheckoutNotification: (id, PushNotification)=>{
        PushNotification.cancelLocalNotification(id);

    },

    paymentSuccess: (title, message, PushNotification)=>{
        console.log('payment success notification')
        PushNotification.localNotification({
            id: '3',
            channelId: 'paymentSuccessRemainder',
            title: title, //'Checkin Alert!',
            message: message,//'You have checked in to the property',
            date: /* date,// */new Date(/* new Date().getTime()+2000 */),
            vibrate: true, // (optional) default: true
            vibration: 300, 
            ongoing: true,
           /*  data:{
                type: details.type, // member = 0 or employee = 1
            } */
            
            
        });

    },

    meetingReminder: (date, PushNotification, details, id)=>{
        console.log('Time for notification: ', date,id);
        PushNotification.localNotificationSchedule({
            id: id,
            channelId: 'meetingRemainder',
            title: 'Meeting in 1 Hour',
            message: 'Your meeting starts in 1 hour.',
            playSound: true,
            date: date,//new Date(new Date().getTime()+5000),
            vibrate: true, // (optional) default: true
    vibration: 800, 
    ongoing: true,
   // actions: ['Checkout Now'],
    invokeApp: true,
    priority: "high",
    /* data:{
        type: details.type, // member = 0 or employee = 1 or open seating = 2
    } */
        });
    },

}

export default CustomePushNotifications;

//export default new CustomePushNotifications();