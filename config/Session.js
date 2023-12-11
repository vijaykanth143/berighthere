// import AsyncStorage from "@react-native-community/async-storage";
import AsyncStorage from '@react-native-async-storage/async-storage';
import location from '../Location/location';
const Session = {
    /* Get started page shown or not */
  isAppIntroShown: async (value) => {
    try {
      await AsyncStorage.setItem("initial", value);
    } catch (error) {
      // Error saving data
    }
  },


  getIsAppIntroShown: async () => {
    try {
      const value = await AsyncStorage.getItem("initial");
      //console.log("value: ", value);
      return value;
    } catch (error) {}
  },
   //Methods used to set user name
   setUserName: async (value) => {
    //console.log(" UserName valued: ", value);
    try {
      await AsyncStorage.setItem("user_name", value);
    } catch (error) {
      // Error saving data
    }
  },
  getUserName: async () => {
    
    try {
      const value = await AsyncStorage.getItem("user_name");
    //console.log(" getUserName valued: ", value);

      return value;
    } catch (error) {
      //console.log(error);
    }
  },
  //Methods used to set user's id
  setUserId: async (value) => {
    //console.log("ID valued: ", value);
    try {
      await AsyncStorage.setItem("user_id", JSON.stringify(value));
    } catch (error) {
      // Error saving data
    }
  },
  getUserId: async () => {
    try {
      const value = await AsyncStorage.getItem("user_id");
      //console.log(" getUserId valued: ", value);

      return value;
    } catch (error) {
      //console.log(error);
    }
  },

  setUserToken: async (value) => {
    //console.log("Token valued: ", value);
    try {
      await AsyncStorage.setItem("user_token", value);
    } catch (error) {
      // Error saving data
    }
  },
  getUserToken: async () => {
    try {
      const value = await AsyncStorage.getItem("user_token");
      ////console.log(" getUserToken valued: ", value);

      return value;
    } catch (error) {
      //console.log(error);
    }
  },

  setUserDetails: async(value)=>{
    //console.log("User details: ", JSON.stringify(value));
    try{
      await AsyncStorage.setItem("userDetails", JSON.stringify(value));
    }catch(error){}
  },

  getUserDetails: async()=>{
    try{
      const value = await AsyncStorage.getItem("userDetails");
      return value;
    }catch(error){}

  },

  setRoleId: async(value)=>{
    //console.log("User role id : ", JSON.stringify(value));
    try{
      await AsyncStorage.setItem("role_id", JSON.stringify(value));
    }catch(error){}
  },

  getRoleId: async()=>{
    try{
      const value = await AsyncStorage.getItem("role_id");
      return value;
    }catch(error){}

  },


  setEmpPropertyDetails: async(value)=>{ 
   // //console.log("User details: ", JSON.stringify(value));
    try{
      await AsyncStorage.setItem("empPropertyDetails", JSON.stringify(value));
    }catch(error){}
  },

  getEmpPropertyDetails: async()=>{
    try{
      const value = await AsyncStorage.getItem("empPropertyDetails");
      return value;
    }catch(error){}

  },

  setLocationPermission : async(permission)=>{
    try{
      await AsyncStorage.setItem("locationPermission", JSON.stringify(permission));
      
    }catch(error){}

  },
  getLocationPermission: async()=>{
    try{
      const value = await AsyncStorage.getItem("locationPermission");
      return value;
    }catch(error){}

  },


  setLocationCoords: async(location)=>{
    try{
      await AsyncStorage.setItem("coords", JSON.stringify(location));
    }catch(error){}
  },
  getLocationCoords: async()=>{
    try{
      const value = await AsyncStorage.getItem("coords");
      return value;
    }catch(error){}
  },

  setCheckinDetails : async(checkinInfo)=>{
    try{
      await AsyncStorage.setItem("check-in", JSON.stringify(checkinInfo));
    }catch(error){}
  },

  getCheckinDetails: async()=>{
    try{
      const value = await AsyncStorage.getItem("check-in");
      return value;
    }catch(error){}
  },

  setComponentId : async(componentid)=>{
    try{
      await AsyncStorage.setItem("componentid", componentid);
    }catch(error){}
  },

  getComponentId: async()=>{
    try{
      const value = await AsyncStorage.getItem("componentid");
      return value;
    }catch(error){}
  },

  modifyBookingDetails : async(details)=>{
    try{
      await AsyncStorage.setItem("modifyBookingdetails", details);
    }catch(error){}
  },

  getModifyBookingDetails: async()=>{
    try{
      const value = await AsyncStorage.getItem("modifyBookingdetails");
      return value;
    }catch(error){}
  },
  setMeetingSearchCategories : async(categories)=>{
    try{
      await AsyncStorage.setItem("meetingCategories", categories);
    }catch(error){}
  },

  getWorkSpaceSearchCategories: async()=>{
    try{
      const value = await AsyncStorage.getItem("workspaceCategories");
      return value;
    }catch(error){}
  },

  setWorkSpaceSearchCategories : async(categories)=>{
    try{
      await AsyncStorage.setItem("workspaceCategories", categories);
    }catch(error){}
  },

  getMeetingSearchCategories: async()=>{
    try{
      const value = await AsyncStorage.getItem("meetingCategories");
      return value;
    }catch(error){}
  },

  setScrollData : async(data)=>{
    try{
      await AsyncStorage.setItem("scrollData", data);
    }catch(error){}
  },

  getScrollData: async()=>{
    try{
      const value = await AsyncStorage.getItem("scrollData");
      return value;
    }catch(error){}
  },

  setMeetingSpacesData : async(data)=>{
    try{
      await AsyncStorage.setItem("BookingMeetingData", data);
    }catch(error){}
  },

  getMeetingSpacesData: async()=>{
    try{
      const value = await AsyncStorage.getItem("BookingMeetingData");
      return value;
    }catch(error){}
  },

  setWorkSpaceDetails : async(data)=>{
    try{
      await AsyncStorage.setItem("BookingWorkspace", data);
    }catch(error){}
  },

  getWorkSpaceDetails: async()=>{
    try{
      const value = await AsyncStorage.getItem("BookingWorkspace");
      return value;
    }catch(error){}
  },

  //filters
  setSelectedPropertyType: async(data)=>{
    try{
      await AsyncStorage.setItem("propertyTypeSelection", data);
    }catch(error){}
  },

  getSelectedPropertyType: async()=>{
    try{
      const value = await AsyncStorage.getItem("propertyTypeSelection");
      return value;
    }catch(error){}
  },

  setSelectedAmenityType: async(data)=>{
    try{
      await AsyncStorage.setItem("amenityTypeSelection", data);
    }catch(error){}
  },

  getSelectedAmenityType: async()=>{
    try{
      const value = await AsyncStorage.getItem("amenityTypeSelection");
      return value;
    }catch(error){}
  },

  setSelectedResourceType: async(data)=>{
    try{
      await AsyncStorage.setItem("resourceTypeSelection", data);
    }catch(error){}
  },

  getSelectedResourceType: async()=>{
    try{
      const value = await AsyncStorage.getItem("resourceTypeSelection");
      return value;
    }catch(error){}
  },

  setSelectedSortOrder: async(data)=>{
    try{
      await AsyncStorage.setItem("sortOrder", data);
    }catch(error){}
  },

  getSelectedSortOrder: async()=>{
    try{
      const value = await AsyncStorage.getItem("sortOrder");
      return value;
    }catch(error){}
  },

  setSelectedValuesRange: async(data)=>{
    try{
      await AsyncStorage.setItem("valuesRange", data);
    }catch(error){}
  },

  getSelectedValuesRange: async()=>{
    try{
      const value = await AsyncStorage.getItem("valuesRange");
      return value;
    }catch(error){}
  },
  


};
export default Session;

