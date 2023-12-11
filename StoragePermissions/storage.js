import { request, PERMISSIONS, check, RESULTS } from 'react-native-permissions';
import CommonHelpers from '../Utils/CommonHelpers';
//import RNFetchBlob from 'react-native-fetch-blob';
//var RNFS = require('react-native-fs');


const storage = {

    checkCamera: async()=>{
        return new Promise((resolve, reject)=>{
            let permission = false;
        check(Platform.OS === 'android' ?PERMISSIONS.ANDROID.CAMERA : PERMISSIONS.IOS.CAMERA).then((result) => {
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
            CommonHelpers.showFlashMsg("Unable to get the Read Request permissions. Try again in sometime.", "danger");
        })

        })

    },
    
    checkRead:async()=>{

        return new Promise((resolve, reject)=>{
            let permission = false;
        check(Platform.OS === 'android' ?PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE  : PERMISSIONS.IOS.READ_EXTERNAL_STORAGE).then((result) => {
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
            CommonHelpers.showFlashMsg("Unable to get the Read Request permissions. Try again in sometime.", "danger");
        })

        })

        
        
        
    },

    checkWrite:async()=>{

        return new Promise((resolve, reject)=>{
            let permission = false;
        check(Platform.OS === 'android' ?PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE  : PERMISSIONS.IOS.WRITE_EXTERNAL_STORAGE).then((result) => {
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
            CommonHelpers.showFlashMsg("Unable to get the Read Request permissions. Try again in sometime.", "danger");
        })

        })

        
        
        
    },

    requestWritePermission : async() => {

        return new Promise((resolve, reject)=>{
            let permission = false;
        
            request(Platform.OS === 'android' ? PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE : PERMISSIONS.IOS.WRITE_EXTERNAL_STORAGE).then((result) => {
                console.log(result);
                if (result === 'granted') {
                   permission = true;
                    
                }
                else{
                    CommonHelpers.showFlashMsg("Permission not granted.");
                }
                
            
                resolve(permission);
            }).catch(error => {
                console.log("Error while requesting write permissions: ", error);
                CommonHelpers.showFlashMsg("Error while requesting write permissions", "danger");
            })

        })

       

        
    },
    requestReadPermission : async() => {

        return new Promise((resolve, reject)=>{
            let permission = false;
        
            request(Platform.OS === 'android' ? PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE : PERMISSIONS.IOS.READ_EXTERNAL_STORAGE).then((result) => {
                console.log(result);
                if (result === 'granted') {
                   permission = true;
                    
                }
                else{
                    CommonHelpers.showFlashMsg("Permission not granted.");
                }
                
            
                resolve(permission);
            }).catch(error => {
                console.log("Error while requesting location permissions: ", error);
                CommonHelpers.showFlashMsg("Error while requesting location permissions", "danger");
            })

        })

       

        
    },
    requestCameraPermission: async()=>{
        return new Promise((resolve, reject)=>{
            let permission = false;
        
            request(Platform.OS === 'android' ? PERMISSIONS.ANDROID.CAMERA : PERMISSIONS.IOS.CAMERA).then((result) => {
                console.log(result);
                if (result === 'granted') {
                   permission = true;
                    
                }
                else{
                    CommonHelpers.showFlashMsg("Permission not granted.");
                }
                
            
                resolve(permission);
            }).catch(error => {
                console.log("Error while requesting location permissions: ", error);
                CommonHelpers.showFlashMsg("Error while requesting location permissions", "danger");
            })

        })

    }
    // getPath: async(uri, name)=>{
    //     let destinatinationPath = '';
    //     console.log("received uri: ", uri)
        
    //     if(uri.startsWith("content://")){
    //         const uriComponents = uri.split('/')
    //        /*  for(var i = 0; i<uriComponents.length-1; i++){
    //             destinatinationPath += uriComponents[i]+'/';
    //         }
    //         console.log(destinatinationPath); */
    // const fileNameAndExtension = uriComponents[uriComponents.length - 1]
    // const destPath =`${RNFS.TemporaryDirectoryPath}/${name}`
    // await RNFS.copyFile(uri, destPath);
    // console.log(destPath);
    // destinatinationPath =RNFetchBlob.wrap(destPath);
    // console.log(destinatinationPath);
    
    //     }
    //     //return RNFetchBlob.fs.stat(destinatinationPath).then(info => info.path);
    //     return destinatinationPath;

    // }
}
export default storage;
