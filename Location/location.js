import { request, PERMISSIONS, check, RESULTS } from 'react-native-permissions';
import CommonHelpers from '../Utils/CommonHelpers';
import Geolocation from 'react-native-geolocation-service';
import { getTrackingStatus, requestTrackingPermission} from 'react-native-tracking-transparency';


const location = {
    
    check:async()=>{

        return new Promise((resolve, reject)=>{
            let permission = false;
        check(Platform.OS === 'android' ? PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION : PERMISSIONS.IOS.LOCATION_ALWAYS).then((result) => {
            switch (result) {
                case RESULTS.GRANTED:
                    console.log('The permission is granted', result);
                    permission = true;
                    
                    //location.getGeoLocation();
                    break;
                case RESULTS.UNAVAILABLE:
                    console.log('This feature is not available (on this device / in this context)');
                    //location.requestPermission();
                    break;
                case RESULTS.DENIED:
                    console.log('The permission has not been requested / is denied but requestable');
                   //location.requestPermission();
                    break;
                case RESULTS.LIMITED:
                    console.log('The permission is limited: some actions are possible');
                    //location.requestPermission();
                    break;

                case RESULTS.BLOCKED:
                    console.log('The permission is denied and not requestable anymore');
                   //location.requestPermission();
                    break;
            }

            resolve(permission)
        }).catch((error) => {
            CommonHelpers.showFlashMsg("Unable to fetch the location Coordinates. Try again in sometime.", "danger");
        })

        })

        
        
        
    },

    requestPermission : async() => {

        return new Promise((resolve, reject)=>{
            let permission = false;
        
            request(Platform.OS === 'android' ? PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION : PERMISSIONS.IOS.LOCATION_ALWAYS).then((result) => {
                console.log(result);
                if (result === 'granted') {
                   permission = true;
                    //location.getGeoLocation()
                }
                else{
                    //CommonHelpers.showFlashMsg("Permission not granted.");
                }
                
            
                resolve(permission);
            }).catch(error => {
                console.log("Error while requesting location permissions: ", error);
                CommonHelpers.showFlashMsg("Error while requesting location permissions", "danger");
            })

        })

       

        
    },

    getGeoLocation : async() => {

        return new Promise((reslove, reject)=>{
            
        Geolocation.getCurrentPosition(
            (position) => {
                //console.log(position);
               reslove(position);
                
              
            },
            (error) => {
                // See error code charts below.
                console.log(error.code, error.message);
                CommonHelpers.showFlashMsg("Error while fetching location coordinates.")
               
            },
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
        );


        })
       

        

    },
    
    checkTrackingPermission: async()=>{
        return new Promise(async(resolve, reject)=>{
            const trackingStatus = await getTrackingStatus();
            if (trackingStatus === 'authorized' || trackingStatus === 'unavailable') {
              resolve(true);
            }
            else{
                resolve(false);
            }

        })
    },

    requestTracking: ()=>{
        return new Promise(async(resolve, reject)=>{
            const trackingStatus = await requestTrackingPermission();
if (trackingStatus === 'authorized' || trackingStatus === 'unavailable') {
  resolve(true);
}
else{
    resolve(false);
}
        })
    }
}
export default location;
