import {
    LOGIN,
    REGISTER, 
    TOKEN, 
    PROPERTY_INFO,  
    BOOKING_REQUEST,
     LIST_OF_AMENITIES, 
     MEMBER_CURRENT_BOOKING, 
     EMPLOYEE_PROPERTY_LIST,/*  EMPLOYEE_LOGIN */
     GET_SEAT_RESERVATION,
     SEAT_RESERVATION_EMP,
     EMP_RESERVATION_HISTORY,
     EMP_UPCOMING_RESERVATION, 
     GET_USER_LOCATION,
     EMP_CHECK_DETAILS, 
     EMP_BOOKING_DETAILS, 
     GET_USER_DOCUMENTS, 
     EMPLOYEE_CURRENT_RESERVATION, 
     EMPLOYEE_MODIFY_RESERVATION, 
     DELETE_SEAT_RESERVATION, 
     GET_ROLE_DOCUMENT, 
     ISSUE_CATEGORY, 
     ISSUES_DETAIL, 
     CHANGE_PASSWORD,
     LOGIN_CHECK,
     MEMBER_DIRECT_BOOKING,
     MEMBER_DIRECT_BOOKING_CALLBACK,
     MEMBER_BOOKING_CANCELLATION,
     PROPERTY_TYPES,
     SEARCH,
     RESOURCE_GROUPS,
     EMP_ALLOCATED_SEAT,
     PROPERTY_RESOURCE_TYPES,
     PROPERTY_RESOURCE_NAMES,
     BOOKING_INFO,
     DELETE_MEMBER,
     DELETE_EMPLOYEE,
     MEETING_RESOURCE_GROUP,
     MEETING_PROPERTY_LIST,
     MEETING_PROPERTY_INFO,
     MEETING_TIME_AVAILABILITY,
     PUSH_GUEST_LIST,
     DELETE_GUEST,
     FORGOT_PASSWORD,
     MODIFY_MEETING,
     PROPERTY_LIST,
     BASE_URL
  } from "./../config/RestAPI";
  import commonModel from "./../Model/commonModel";
//   import i18n from "i18n-js";
  import axios, { Axios, } from "axios";
import Session from "../config/Session";
import CommonModel from "./../Model/commonModel";
//   import Session from "../Config/Session";

// CHECK FOR TOKEN VALIDITY
export const login_check = async() => {
  const params = {
    "user_id": await Session.getUserId(),
    "token" : await Session.getUserToken(),
    "table": "users"
  }
  return new Promise((resolve, reject) => {
    axios
      .post(LOGIN_CHECK, params, {
        // headers: {
        //   "Content-Type": "application/json",
        //   // language: i18n.currentLocale(),
        //   // authorization:"2P2mfbGMap5GRtjFhqTP5V85McgPT75BtmkNuRAn"
        // },
      })
      .then((response) => {
        let commonModel = {
          status : false,
          message: '',
          dataArray : [],
          return_id: '',
          pagesData: []
      }
       // //////////////console.log("TokeN response", JSON.stringify(response));
        if (response.data.status == "success") {
          commonModel.status = true;
          commonModel.message = response.data.message;
        } else {
          commonModel.status = false;
          commonModel.message = response.data.message;
        }
        resolve(commonModel);
      })
      .catch((error) => {
        //////////////console.log("TOkeN error", JSON.stringify(error.response));
        commonModel.status = false;
        commonModel.message = error.message;
        resolve(commonModel);
      });
  });
};
  
  // API call to login A MEMBER using email & password
  export const loginAPI = async(params) => {
    //////////////console.log(LOGIN);
    return new Promise((resolve, reject) => {
      axios
        .post(LOGIN, params, {
          headers: {
            "Content-Type": "application/json",
            // language: i18n.currentLocale(),
            // authorization:"2P2mfbGMap5GRtjFhqTP5V85McgPT75BtmkNuRAn"
          },
        })
        .then(async(response) => {
          let commonModel = {
            status : false,
            message: '',
            dataArray : [],
            return_id: '',
            pagesData: []
        }
          ////////console.log("Login response", JSON.stringify(response));
          if (response.data.status == "success") {
            await Session.setUserToken(response.data.results.token);

            commonModel.return_id = 
              response.data.results,
              
          
            commonModel.status = true;
            commonModel.message = response.data.message;
          } else {
            commonModel.status = false;
            commonModel.message = response.data.message;

            // // to handle array and string types
            // if (Array.isArray(response.data.errors)) {
            //   commonModel.message =
            //     response.data.errors.length > 0 ? response.data.errors[0] : "";
            // } else commonModel.message = response.data.errors;
          }
          resolve(commonModel);
        })
        .catch((error) => {
          ////////////console.log("Login error", JSON.stringify(error.response/* .data.message */ ));
          //////////////console.log("api message: ", error.response.data.message )
          commonModel.status = false;
          commonModel.message = error.response.data.message;
          resolve(commonModel);
        });
    });
  };

  // API CALL TO LOGIN AN EMPLOYEE USING EMAIL AND PASSWORD.
  /* export const employeeLoginAPI = async(params)=>{
    //////////////console.log("emp login", params);
    return new Promise((resolve, reject)=>{
      axios.post(EMPLOYEE_LOGIN, params, {
        headers: {
          "Content-Type": "application/json",
        }
      }).then(response=>{
        if(response.data.status == "success"){
          commonModel.status = true;
          commonModel.return_id = response.data.results;
          commonModel.message = response.data.message;
        }
        else{
          commonModel.status = false;
          commonModel.message = response.data.message;

        }
        resolve(commonModel);


        //////////////console.log(response);
      }).catch(error=>{
        //////////////console.log("Error in employee login: ", JSON.stringify(error));
        commonModel.status = false;
        commonModel.message = error.response.data.message;
        resolve(commonModel);
      })
    })
  } */

// API CALL TO FETCH THE EMPLOYEE PROPERTY LIST FOR THE EMPLOYEE DASHBOARD
/* export const employeePropertyListAPI = (params, url)=>{
  return new Promise((resolve, reject)=>{
    Axios.post(url, params, {
      headers: {
        "Authorization": "2P2mfbGMap5GRtjFhqTP5V85McgPT75BtmkNuRAn",
      }
    }).then((response) => {
      //////////////console.log("params", response.data);
      if (response.data.status == "success") {
        commonModel.status = true;
        commonModel.message = response.data.message;
        commonModel.pagesData = response.data;
      //   commonModel.dataArray = new commonModel().deserializeBillListJSON(
      //     response.data.data
      //   );
      commonModel.dataArray = response.data.result.data;
      //   commonModel.return_id=response.result.data;
      // } else {
      //   commonModel.status = false;
      //   commonModel.message = response.data.errors;
      }
      resolve(commonModel);
    })
    .catch((error) => {
      //////////////console.log("PROPERTY_LIST error", JSON.stringify(error));
      commonModel.status = false;
      commonModel.message = error.message;
      resolve(commonModel);
    });
  })

} */



  // API call to TOKEN
  export const tokenAPI = (params) => {
    //////////////console.log("toke params",params)
    return new Promise((resolve, reject) => {
      axios
        .post(TOKEN, params, {
          // headers: {
          //   "Content-Type": "application/json",
          //   // language: i18n.currentLocale(),
          //   // authorization:"2P2mfbGMap5GRtjFhqTP5V85McgPT75BtmkNuRAn"
          // },
        })
        .then((response) => {
          let commonModel = {
            status : false,
            message: '',
            dataArray : [],
            return_id: '',
            pagesData: []
        }
          //////////////console.log("TokeN response", JSON.stringify(response));
          if (response.data.status.status == "success") {
            commonModel.return_id = 
              response.data.response,
              
          
            commonModel.status = true;
            commonModel.message = response.data.status.message;
          } else {
            commonModel.status = false;
            commonModel.message = response.data.status.message;

            // // to handle array and string types
            // if (Array.isArray(response.data.errors)) {
            //   commonModel.message =
            //     response.data.errors.length > 0 ? response.data.errors[0] : "";
            // } else commonModel.message = response.data.errors;
          }
          resolve(commonModel);
        })
        .catch((error) => {
          //////////////console.log("TOkeN error", JSON.stringify(error.response));
          commonModel.status = false;
          commonModel.message = error.message;
          resolve(commonModel);
        });
    });
  };

  // API call to create new user
export const registerAPI = (params) => {
  //////////////console.log("params",params)
  return new Promise((resolve, reject) => {
    axios
      .post(REGISTER, params, {
        headers: {
          "Content-Type": "application/json",
          // language: i18n.currentLocale(),
        },
      })
      .then((response) => {
        let commonModel = {
          status : false,
          message: '',
          dataArray : [],
          return_id: '',
          pagesData: []
      }
        //////////////console.log("Register response", JSON.stringify(response));
        if (response.data.status == "success") {
          commonModel.status = true;
          commonModel.message = response.data.message;
          commonModel.return_id = response.data;
        } else {
          commonModel.status = false;
          // to handle array and string types
          if (Array.isArray(response.data.errors)) {
            commonModel.message =
              response.data.errors.length > 0 ? response.data.errors[0] : "";
          } else commonModel.message = response.data.message;
        }
        resolve(commonModel);
      })
      .catch((error) => {
        ////////////console.log("Register ERROR ",JSON.stringify(error))
        commonModel.status = false;
        commonModel.message = error.response.data.message;
        resolve(commonModel);
      });
  });
};

  // Property list
export const getPropertyListAPI = async ( params, url) => {
  // const token = await Session._getToken();
  // //////////////console.log("token: ", token);

  // var url = `${PROPERTY_LIST}?page=${page}`;
    ////console.log("employee property list api url: ", url);
   console.log("params tosend",params);

  return new Promise(async(resolve, reject) => {
    axios
      .post(url, params, {
        headers: {
          "Content-Type": "application/json",
          'Authorization':  "2P2mfbGMap5GRtjFhqTP5V85McgPT75BtmkNuRAn",
        },
      })
      .then((response) => {
        let commonModel = {
          status : false,
          message: '',
          dataArray : [],
          return_id: '',
          pagesData: [],
          empData: [],
      }
        console.log("result srp page ",url, response.data);
        if (response.data.status == "success") {
          commonModel.status = true;
          commonModel.message = response.message;
          commonModel.pagesData = response.data.results;
          commonModel.dataArray = response.data.results.data;
          commonModel.empData = response 
       
        }
        resolve(commonModel);
      })
      .catch((error) => {
        console.log("PROPERTY_LIST error 1", JSON.stringify(error.response));
        commonModel.status = false;
        commonModel.message = error.response != null? error.response.data.message: 'empty';
        resolve(commonModel);
      });
  });
};

export const getEmpMappedPropertyListAPI = async ( params, url) => {
  // const token = await Session._getToken();
  // //////////////console.log("token: ", token);

  // var url = `${PROPERTY_LIST}?page=${page}`;
    ////console.log("employee property list api url: ", url);
   ////console.log("params tosend",params);

  return new Promise(async(resolve, reject) => {
    axios
      .post(url, params, {
        headers: {
          "Content-Type": "application/json",
          'Authorization':  "2P2mfbGMap5GRtjFhqTP5V85McgPT75BtmkNuRAn",
        },
      })
      .then((response) => {
        let commonModel = {
          status : false,
          message: '',
          dataArray : [],
          return_id: '',
          pagesData: [],
          //empData: [],
      }
        console.log("result srp page ",url, response.data);
        if (response.data.status == "success") {
          commonModel.status = true;
          commonModel.message = response.data.message;
          commonModel.pagesData = response.data.result;
          commonModel.dataArray = response.data.result.data;
          //commonModel.empData = response 
       
        }
        resolve(commonModel);
      })
      .catch((error) => {
        console.log("PROPERTY_LIST error 1", JSON.stringify(error.response));
        commonModel.status = false;
        commonModel.message = error.response != null? error.response.data.message: 'empty';
        resolve(commonModel);
      });
  });
};

export const getBookinglistAPI = async ( params, url) => {
  // const token = await Session._getToken();
  // //////////////console.log("token: ", token);
  /* let p = {
    "user_id": 615
  } */

  return new Promise(async(resolve, reject) => {
    axios
      .post(url, params, {
        headers: {
          "Content-Type": "application/json",
          // language: i18n.currentLocale(),
          'Authorization': 'Bearer ' + await Session.getUserToken(),
          
          //authorization: "2P2mfbGMap5GRtjFhqTP5V85McgPT75BtmkNuRAn",
        },
      })
      .then((response) => {
        let commonModel = {
          status : false,
          message: '',
          dataArray : [],
          return_id: '',
          pagesData: []
      }
        //////////////console.log("BOOKING_LIST response: ",url, JSON.stringify(response));
        if (response.data.status == "success") {
          commonModel.dataArray = response.data.results,
          commonModel.status = true;
          commonModel.message = response.data.message;
        } else {
          commonModel.status = false;
          commonModel.message = response.data.message;

          // // to handle array and string types
          // if (Array.isArray(response.data.errors)) {
          //   commonModel.message =
          //     response.data.errors.length > 0 ? response.data.errors[0] : "";
          // } else commonModel.message = response.data.errors;
        }
        resolve(commonModel);
      })
      .catch((error) => {
        //////////////console.log("Booking list error:",url, JSON.stringify(error.response));
        commonModel.status = false;
        commonModel.message = error.response.data.message;
        resolve(commonModel);
      });
  });
};
export const getPropertyInfoAPI = async (id, params)=>{
  ////console.log(id, params)
  var config = {
    method: 'get',
    url: PROPERTY_INFO+id,//'https://dev.berighthere.com/api/property-info/199',
    headers: { 
      'Authorization': '2P2mfbGMap5GRtjFhqTP5V85McgPT75BtmkNuRAn', 
      'Content-Type': 'application/json'
    },
   /*  data : params */
  };

  return new Promise(async(resolve, error) =>{
    axios(/* PROPERTY_INFO+id,{params:params},{
      headers:{
        'Authorization': '2P2mfbGMap5GRtjFhqTP5V85McgPT75BtmkNuRAn', 
    'Content-Type': 'application/json'
        /* //'Authorization': 'Bearer ' + await Session.getUserToken(),
        'Authorization': '2P2mfbGMap5GRtjFhqTP5V85McgPT75BtmkNuRAn', 
      }
    } */config).then((response)=>{
      let commonModel = {
        status : false,
        message: '',
        dataArray : [],
        return_id: '',
        pagesData: []
    }
     ////console.log("API response from property Info: ", response);

      if(response.data.status == "success"){
        commonModel.status = true;
        commonModel.message = response.data.message
        commonModel.dataArray = response.data.result;
      }
     
      resolve(commonModel);
    }).catch((error)=>{
      //////////////console.log("Error in API fetch for Property info", error);
      commonModel.status = false;
      commonModel.message = error.message;
      resolve(commonModel);
    })
  });

}

export const BookingRequestAPI =async (params)=>{
  //////////////console.log(JSON.stringify(params));
  ////////////console.log(await Session.getUserToken())
  return new Promise(async(resolve, reject)=>{
    axios.post(BOOKING_REQUEST, params,{
      headers: {
        "Content-Type": "application/json",
        'Authorization': 'Bearer ' + await Session.getUserToken(),
        //'Authorization': '2P2mfbGMap5GRtjFhqTP5V85McgPT75BtmkNuRAn',
      }
    }).then((response)=>{
      let commonModel = {
        status : false,
        message: '',
        dataArray : [],
        return_id: '',
        pagesData: []
    }
      ////console.log("Boking Request response: ", JSON.stringify(response),response.data.status);

      if (response.data.status == "success") {
        commonModel.status = true;
        commonModel.message = response.data.message;
        
        //commonModel.return_id = response.data.result._id;
      } else {
        commonModel.status = false;
        // to handle array and string types
        
      }
      resolve(commonModel);

    }).catch((error)=>{
      //////////////console.log("Catch booking request",JSON.stringify(error));
      ////////////console.log(JSON.stringify(error.response.data.message))
     
      commonModel.status = false;
      commonModel.message = error.response.data.message;
      resolve(commonModel);

    })
  })
}

export const MemberDirectBookingAPI =async (params)=>{
  console.log('api PARAMS *****',JSON.stringify(params));
  return new Promise(async(resolve, reject)=>{
    axios.post(MEMBER_DIRECT_BOOKING, params,{
      headers: {
        "Content-Type": "application/json",
        'Authorization': 'Bearer ' + await Session.getUserToken(),
        //'Authorization': '2P2mfbGMap5GRtjFhqTP5V85McgPT75BtmkNuRAn',
      }
    }).then((response)=>{
      let commonModel = {
        status : false,
        message: '',
        dataArray : [],
        return_id: '',
        pagesData: []
    }
      ////////////console.log("member direct booking response: ", JSON.stringify(response),response.data.status);

      if (response.data.status == "success") {
        commonModel.status = true;
        commonModel.message = response.data.message;
        commonModel.dataArray = response.data.results;
        
        //commonModel.return_id = response.data.result._id;
      } else {
        commonModel.status = false;
        // to handle array and string types
        
      }
      resolve(commonModel);

    }).catch((error)=>{
  ////////////console.log("Catch member direct booking ",JSON.stringify(error.response.data.message));
     
      commonModel.status = false;
      commonModel.message = error.response.data.message;
      resolve(commonModel);

    })
  })
}

export const MemberDirectBookingCallback = async(params)=>{
 // //////////console.log(params);
 //////////console.log('URL: ', MEMBER_DIRECT_BOOKING_CALLBACK+'?booking_id='+params.booking_id+'&payment_id='+params.payment_id+'&user_id='+params.user_id+'&is_direct_booking=1&reference_id='+params.reference_id);
  return new Promise(async(resolve, reject)=>{
    axios.get(MEMBER_DIRECT_BOOKING_CALLBACK+'?booking_id='+params.booking_id+'&payment_id='+params.payment_id+'&user_id='+params.user_id+'&is_direct_booking=1&reference_id='+params.reference_id,{
      headers: {
        "Content-Type": "application/json",
        'Authorization': 'Bearer ' + await Session.getUserToken(),
        //'Authorization': '2P2mfbGMap5GRtjFhqTP5V85McgPT75BtmkNuRAn',
      }
   } ).then(result=>{
    let commonModel = {
      status : false,
      message: '',
      dataArray : [],
      return_id: '',
      pagesData: []
  }
     //////////////console.log("callback result:",result);
     CommonModel.status = result.data.status;
     CommonModel.message = result.data.message;
     resolve(CommonModel);

   }).catch(error=>{
     //////////////console.log("razor callback error: ", error);
    CommonModel.status = false;
    CommonModel.message = error.response.data.message;
     resolve(CommonModel)
   })

  })
}

export const listofamenitiesapi=async()=>{
  return new Promise(async(resolve, reject)=>{
    axios.get(LIST_OF_AMENITIES,{
      headers: {
        /* 'Authorization': 'Bearer ' + await Session.getUserToken(), */
        'Authorization': '2P2mfbGMap5GRtjFhqTP5V85McgPT75BtmkNuRAn'
      }
    } ).then((result)=>{
      let commonModel = {
        status : false,
        message: '',
        dataArray : [],
        return_id: '',
        pagesData: []
    }
     console.log("Master List of amenities: ",JSON.stringify(result));
      if(result.data.status == "success"){
        commonModel.status = true;
        commonModel.message = result.data.message;
        commonModel.dataArray = result.data.data.data;
       // //////////////console.log(commonModel.dataArray);
      }
      else{
        commonModel.status = false;
        commonModel.message = result.data.message;
        commonModel.dataArray = [];
      }

      resolve(commonModel)
    }).catch(error=>{
      ////console.log("error to fetch list of amenities", error);
      commonModel.status = false;
      commonModel.message = error.message;
      commonModel.dataArray = [];
      resolve(commonModel);
    })
  })
}

export const membercurrentbookingapi = async()=>{
  const userId = await Session.getUserId();
let params =JSON.stringify( {
  "user_id": Number(userId),
});
const userToken = await Session.getUserToken()
  //////////////console.log(params);
 

  return new Promise(async(resolve, reject)=>{

    const user_id = await Session.getUserId();
    const user_token = await Session.getUserToken();
    //////////////console.log(user_id, user_token);
    let params= {
      "user_id": user_id,
    }

    axios.post(MEMBER_CURRENT_BOOKING, params, {
      headers:{
        'Authorization':'Bearer ' +  userToken,
        //'Authorization': '2P2mfbGMap5GRtjFhqTP5V85McgPT75BtmkNuRAn', 
      'Content-Type': 'application/json'
      }
  }).then((response)=>{
    let commonModel = {
      status : false,
      message: '',
      dataArray : [],
      return_id: '',
      pagesData: []
  }

    ////////////console.log("current booking from userAPI.js", response);
    if(response.data.status == "success"){
      CommonModel.status = true;
      CommonModel.dataArray = response.data.results;
      CommonModel.message = response.data.message;
      if(response.message == "Booking list not found"){
        CommonModel.dataArray = []; 
      }

    }
    else{
      CommonModel.status = false;
      CommonModel.dataArray = [];
      CommonModel.message = response.data.message;
    }
    resolve(CommonModel);
  }).catch((error)=>{
    //////////////console.log("Error while fetching current booking details: " , JSON.stringify(error));
    commonModel.status = false;
    commonModel.message = error.message;
    resolve(commonModel);

  })
  })
}

// employee seat reservation page. 
export const getSeatReservationAPI = async ( params) => {
  // //////////////console.log("url: ", url);
   //////////////console.log(params);

  return new Promise(async(resolve, reject) => {
    axios
      .post(GET_SEAT_RESERVATION, params, {
        headers: {
          "Content-Type": "application/json",
          'Authorization':  "2P2mfbGMap5GRtjFhqTP5V85McgPT75BtmkNuRAn",
        },
      })
      .then((response) => {
        let commonModel = {
          status : false,
          message: '',
          dataArray : [],
          return_id: '',
          pagesData: []
      }
        console.log("result", response.data);
        if (response.data.status == "success") {
          commonModel.status = true;
          commonModel.message = response.data.message;
          commonModel.pagesData = response.data;
        commonModel.dataArray = response.data.results;
        }
        resolve(commonModel);
      })
      .catch((error) => {
        console.log("get seat reservation error", error.response.data);
        commonModel.status = false;
        commonModel.message = error.response.data.message;
        resolve(commonModel);
      });
  });
};
export const confirmEmpSeatReservationAPI = async ( params) => {
  // //////////////console.log("url: ", url);
   //////////////console.log(params);
   userToken = await Session.getUserToken();

  return new Promise(async(resolve, reject) => {
    axios
      .post(SEAT_RESERVATION_EMP, params, {
        headers: {
          "Content-Type": "application/json",
          //'Authorization':'Bearer ' +  userToken,
          'Authorization':  "2P2mfbGMap5GRtjFhqTP5V85McgPT75BtmkNuRAn",
        },
      })
      .then((response) => {
        let commonModel = {
          status : false,
          message: '',
          dataArray : [],
          return_id: '',
          pagesData: []
      }
        ////////////////console.log("result", response.data);
        if (response.data.status == "success") {
          commonModel.status = true;
          commonModel.message = response.data.message;
          commonModel.pagesData = response.data;
        commonModel.dataArray = response.data.results;
        }
        resolve(commonModel);
      })
      .catch((error) => {
        //////////console.log("get seat reservation error", error.response.data);
        commonModel.status = false;
        commonModel.message = error.response.data.message;
        resolve(commonModel);
      });
  });
};

export const empHistoryReservationAPI = async ( params, url) => {
  // //////////////console.log("url: ", url);
   //////////////console.log(params);
   userToken = await Session.getUserToken();

  return new Promise(async(resolve, reject) => {
    axios
      .post(url, params, {
        headers: {
          "Content-Type": "application/json",
          //'Authorization':'Bearer ' +  userToken,
          'Authorization':  "2P2mfbGMap5GRtjFhqTP5V85McgPT75BtmkNuRAn",
        },
      })
      .then((response) => {
        let commonModel = {
          status : false,
          message: '',
          dataArray : [],
          return_id: '',
          pagesData: []
      }
        ////////////////console.log("result history", response.data);
        if (response.data.status == "success") {
          commonModel.status = true;
          commonModel.message = response.data.message;
          commonModel.pagesData = response.data;
        commonModel.dataArray = response.data.results/* .data */;
        }
        resolve(commonModel);
      })
      .catch((error) => {
        //////////////console.log("reservation history: ", JSON.stringify(error));
        commonModel.status = false;
        commonModel.message = error.message;
        resolve(commonModel);
      });
  });
};

export const empUpcomingReservationAPI = async (params, url) => {
  // //////////////console.log("url: ", url);
   //////////////console.log(params);
   //userToken = await Session.getUserToken();

  return new Promise(async(resolve, reject) => {
    axios
      .post(url, params, {
        headers: {
          "Content-Type": "application/json",
          //'Authorization':'Bearer ' +  userToken,
          'Authorization': "2P2mfbGMap5GRtjFhqTP5V85McgPT75BtmkNuRAn",
        },
      })
      .then((response) => {
        let commonModel = {
          status : false,
          message: '',
          dataArray : [],
          return_id: '',
          pagesData: []
      }
        ////////////////console.log("result", response.data);
        if (response.data.status == "success") {
          commonModel.status = true;
          commonModel.message = response.data.message;
          commonModel.pagesData = response.data;
          commonModel.dataArray = response.data.results/* .data */;
        }
        resolve(commonModel);
      })
      .catch((error) => {
        //////////////console.log(" UPCOMING reservation ERROR : ", JSON.stringify(error));
        commonModel.status = false;
        commonModel.message = error.message;
        //commonModel.dataArray = []
        resolve(commonModel);
      });
  });
};

export const empCurrentReservationAPI = async (params, url) => {
  // //////////////console.log("url: ", url);
   //////////////console.log(params);
   //userToken = await Session.getUserToken();

  return new Promise(async(resolve, reject) => {
    axios
      .post(url, params, {
        headers: {
          "Content-Type": "application/json",
          //'Authorization':'Bearer ' +  userToken,
          'Authorization': "2P2mfbGMap5GRtjFhqTP5V85McgPT75BtmkNuRAn",
        },
      })
      .then((response) => {
        let commonModel = {
          status : false,
          message: '',
          dataArray : [],
          return_id: '',
          pagesData: []
      }
       // //////////////console.log("result", response.data);
        if (response.data.status == "success") {
          commonModel.status = true;
          commonModel.message = response.data.message;
          commonModel.pagesData = response.data;
          commonModel.dataArray = response.data.results/* .data */;
        }
        resolve(commonModel);
      })
      .catch((error) => {
        //////////////console.log(" Current reservation ERROR : ", JSON.stringify(error));
        commonModel.status = false;
        commonModel.message = error.message;
        resolve(commonModel);
      });
  });
};


// ***************for CHECK IN ONLY using fetch as axios currently does not work with multipart form data to upload id proof and vaccination certificate.************ 
export const post_emp_check_details = (params)=>{
  //////////////console.log(params);
  
  return new Promise((resolve, reject)=>{
    var myHeaders = new Headers();
myHeaders.append("Authorization", "2P2mfbGMap5GRtjFhqTP5V85McgPT75BtmkNuRAn");
myHeaders.append("Content-Type", "multipart/form-data");
    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: params,
      redirect: 'follow'
    };


    fetch(EMP_CHECK_DETAILS, requestOptions)
  .then(response => response.json())
  .then(result => {
    let CommonModel = {
      status : false,
      message: '',
      dataArray : [],
      return_id: '',
      pagesData: []
  }
    //////////console.log('check in result with form data : ',result.status);
    if(result.status != 'error'){
      CommonModel.status = true;
      CommonModel.message = result.message;
      CommonModel.return_id = result.details;
    }
    else{
      CommonModel.status = false;
      CommonModel.message = result.message;

    }
    resolve(CommonModel);
  })
  .catch(error => {//////////////console.log('error', error);
  CommonModel.status = false;
  CommonModel.message = result.message;
  resolve(CommonModel);
});
  })

};

//*****for check out, and checkin : when there is no images or pdf files.******

export const post_emp_checkout = (params)=>{
  //////////////console.log(params);
  
  return new Promise((resolve, reject)=>{
   

  //axios does not support multipart form data. Use normal fetch.
     axios.post( EMP_CHECK_DETAILS, params, {
      header: {
        'Authorization': "2P2mfbGMap5GRtjFhqTP5V85McgPT75BtmkNuRAn",
        //'Content-Type': 'multipart/form-data', 
        //'Accept': 'application/json',

        'Access-Control-Allow-Origin': '*',
     'Access-Control-Allow-Methods': 'POST, GET, PUT, OPTIONS, DELETE',
     'Access-Control-Allow-Headers': 'Access-Control-Allow-Methods, Access-Control-Allow-Origin, Origin, Accept, Content-Type',
     'Accept': 'application/x-www-form-urlencoded',
     'Content-Type':'application/x-www-form-urlencoded'
      },
    },).then((response)=>{
      let commonModel = {
        status : false,
        message: '',
        dataArray : [],
        return_id: '',
        pagesData: []
    }
      //////////console.log('response from back end for open seating:********',JSON.stringify(response.data));
      if (response.data.status == "success") {
        commonModel.status = true;
        commonModel.message = response.data.message;
        //commonModel.pagesData = response.data;
      //commonModel.dataArray = response.data.results;
      }else{
        commonModel.status = false;
        commonModel.message = response.data.message
      }
      resolve(commonModel);
    }).catch((error)=>{
      //////////console.log("Post method emp check in/out details error: ", error.response.data);
      commonModel.status = false;
        commonModel.message = error.response.data;
        resolve(commonModel);
    }) 

  })

}

export const get_emp_check_details = (booking_id)=>{
  return new Promise((resolve, reject)=>{

    axios.get(EMP_CHECK_DETAILS+'/'+booking_id, {headers: {
      "Authorization": "2P2mfbGMap5GRtjFhqTP5V85McgPT75BtmkNuRAn",
    }}).then((response)=>{
      let commonModel = {
        status : false,
        message: '',
        dataArray : [],
        return_id: '',
        pagesData: []
    }
      ////////////////console.log(JSON.stringify(response));
      if (response.data.status == "success") {
        commonModel.status = true;
        commonModel.message = response.data.message;
        commonModel.pagesData = response.data;
        commonModel.dataArray = response.data.results;
      }
      resolve(commonModel);
    }).catch((error)=>{
      //////////////console.log("Get method emp check details error: ", JSON.stringify(error));
      commonModel.status = false;
        commonModel.message = error.message;
        resolve(commonModel);
    })

  })

}

export const emp_booking_details = ( id )=>{
  return new Promise((resolve, reject)=>{
    axios.get(EMP_BOOKING_DETAILS + id, {headers: {
      'Authorization': "2P2mfbGMap5GRtjFhqTP5V85McgPT75BtmkNuRAn",
    }}).then((response)=>{
      let commonModel = {
        status : false,
        message: '',
        dataArray : [],
        return_id: '',
        pagesData: []
    }
     // //////////////console.log(response);
      if (response.data.status == "success") {
        commonModel.status = true;
        commonModel.message = response.data.message;
        commonModel.pagesData = response.data;
        commonModel.dataArray = response.data.results;
      }
      resolve(commonModel);
    }).catch((error)=>{
      //////////////console.log("error while fetching the employee booking details log check in check out: ", JSON.stringify(error));
      commonModel.status = false;
      commonModel.message = error.message;
      resolve(commonModel);
    })
  })
}

export const get_user_document_api =async()=>{
  const user_id = await Session.getUserId();

  return new Promise((resolve, reject)=>{
    axios.get(GET_USER_DOCUMENTS + user_id, {
      headers: {
        "Content_Type": "application/json", 
        "Authorization": "2P2mfbGMap5GRtjFhqTP5V85McgPT75BtmkNuRAn",
      }
    }).then(response=>{
      let CommonModel = {
        status : false,
        message: '',
        dataArray : [],
        return_id: '',
        pagesData: []
    }
      //////////console.log("document details: ",response.data.data);
      if(response.data.data.length == 0){
        CommonModel.status = true;
        CommonModel.dataArray = [];
      }
      else if(response.data.data.length > 0) {
        //////////////console.log("greater than 1")
        CommonModel.status = true;
        CommonModel.dataArray = response.data.data;
      }
      resolve(CommonModel)

    }).catch(error=>{
      //////////////console.log(error);
      CommonModel.status = false;
      CommonModel.dataArray = [];
    })
  })

}


export const modifyEmpSeatReservationAPI = async ( params) => {
  // //////////////console.log("url: ", url);
   //////////////console.log(params);
   userToken = await Session.getUserToken();

  return new Promise(async(resolve, reject) => {
    axios
      .post(EMPLOYEE_MODIFY_RESERVATION, params, {
        headers: {
          "Content-Type": "application/json",
          //'Authorization':'Bearer ' +  userToken,
          'Authorization':  "2P2mfbGMap5GRtjFhqTP5V85McgPT75BtmkNuRAn",
        },
      })
      .then((response) => {
        let commonModel = {
          status : false,
          message: '',
          dataArray : [],
          return_id: '',
          pagesData: []
      }
        ////////////////console.log("result", response.data);
        if (response.data.status == "success") {
          commonModel.status = true;
          commonModel.message = response.data.message;
          commonModel.pagesData = response.data;
        commonModel.dataArray = response.data.results;
        }
        resolve(commonModel);
      })
      .catch((error) => {
        //////////////console.log("get seat reservation error", JSON.stringify(error));
        commonModel.status = false;
        commonModel.message = error.response.data.message;
        resolve(commonModel);
      });
  });
};

export const cancelMemberBooking = async ( params) => {
  //////////////console.log("delete param: ", params);
   //////////////console.log(params);
  
   ////////////////console.log(params);
   const userToken = await Session.getUserToken();

  return new Promise(async(resolve, reject) => {
    axios
      .post(MEMBER_BOOKING_CANCELLATION, params, {
        headers: {
          "Content-Type": "application/json",
          'Authorization':'Bearer ' +  userToken,
          //'Authorization':  "2P2mfbGMap5GRtjFhqTP5V85McgPT75BtmkNuRAn",
        },
      })
      .then((response) => {
        let commonModel = {
          status : false,
          message: '',
          dataArray : [],
          return_id: '',
          pagesData: []
      }
        console.log("result cancel", response);
        if (response.data.status == "success") {
          commonModel.status = true;
          commonModel.message = response.data.message;
          //commonModel.pagesData = response.data;
         // commonModel.dataArray = response.data.results;
        }
        else{
          commonModel.status = false;
          commonModel.message = response.data.message;

        }
        resolve(commonModel);
      })
      .catch((error) => {
        console.log(error.response.data)
        //////////////console.log("get seat reservation error", JSON.stringify(error));
        commonModel.status = false;
        commonModel.message = error.message;
        resolve(commonModel);
      });
  });
};

export const deleteEmpSeatReservationAPI = async ( params) => {
  //////////////console.log("delete param: ", params);
   //////////////console.log(params);
  
   //////////////console.log(params);
   //userToken = await Session.getUserToken();

  return new Promise(async(resolve, reject) => {
    axios
      .post(DELETE_SEAT_RESERVATION, params, {
        headers: {
          "Content-Type": "application/json",
          //'Authorization':'Bearer ' +  userToken,
          'Authorization':  "2P2mfbGMap5GRtjFhqTP5V85McgPT75BtmkNuRAn",
        },
      })
      .then((response) => {
        let commonModel = {
          status : false,
          message: '',
          dataArray : [],
          return_id: '',
          pagesData: []
      }
        //////////////console.log("result", response);
        if (response.data.status == "success") {
          commonModel.status = true;
          commonModel.message = response.data.message;
          //commonModel.pagesData = response.data;
         // commonModel.dataArray = response.data.results;
        }
        resolve(commonModel);
      })
      .catch((error) => {
        //////////////console.log(error.response.data)
        //////////////console.log("get seat reservation error", JSON.stringify(error));
        commonModel.status = false;
        commonModel.message = error.message;
        resolve(commonModel);
      });
  });
};

export const getRoleDocumentAPI = async () => {
  return new Promise(async(resolve, reject) => {
    axios
      .get(GET_ROLE_DOCUMENT, {
        headers: {
          "Content-Type": "application/json",
          //'Authorization':'Bearer ' +  userToken,
          'Authorization':  "2P2mfbGMap5GRtjFhqTP5V85McgPT75BtmkNuRAn",
        },
      })
      .then((response) => {
        let commonModel = {
          status : false,
          message: '',
          dataArray : [],
          return_id: '',
          pagesData: []
      }
        //////////////console.log("result", response);
        if (response.status == 200) {
          commonModel.status = true;
          commonModel.message = response.data.message;
          //commonModel.pagesData = response.data;
         commonModel.dataArray = response.data;
        }
        resolve(commonModel);
      })
      .catch((error) => {
        //////////////console.log(error.response.data)
        //////////////console.log("get seat reservation error", JSON.stringify(error));
        commonModel.status = false;
        commonModel.message = error.message;
        resolve(commonModel);
      });
  });
};

export const getUserLocationAPI = async ( params) => {
  // //////////////console.log("url: ", url);
   //////////////console.log(params);
  // userToken = await Session.getUserToken();

  return new Promise(async(resolve, reject) => {
    axios
      .post(GET_USER_LOCATION, params, {
        headers: {
          "Content-Type": "application/json",
          //'Authorization':'Bearer ' +  userToken,
          'Authorization':  "2P2mfbGMap5GRtjFhqTP5V85McgPT75BtmkNuRAn",
        },
      })
      .then((response) => {
        let commonModel = {
          status : false,
          message: '',
          dataArray : [],
          return_id: '',
          pagesData: []
      }
        //////////////console.log("result", response.data);
        if (response.data.status == "true") {
          commonModel.status = true;
          commonModel.message = response.data.message;
         // commonModel.pagesData = response.data;
        //commonModel.dataArray = response.data.results;
        }else{
          commonModel.status = false;
          commonModel.message = response.data.message;

        }
        resolve(commonModel);
      })
      .catch((error) => {
        //////////////console.log("get seat reservation error", JSON.stringify(error));
        commonModel.status = false;
        commonModel.message = error.message;
        resolve(commonModel);
      });
  });
};

//api call to raise issue with image.
export const raiseIssuewithImageAPI = async(params)=>{

  let user_details  = await Session.getUserDetails();
  user_details  = JSON.parse(user_details);
  //////////////console.log(user_details);


  //////////////console.log(params);
  
  return new Promise((resolve, reject)=>{
    var myHeaders = new Headers();
myHeaders.append("Authorization", 'Bearer ' + user_details.token/*  'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIzIiwianRpIjoiZDAwMjRjNWYzNzkzYjI1Y2Q0Yjg3NTkyMzk3N2M3NjRlZDQxMjRkOGQ5NzIzNDljMTBhZmNmMjMxMzIzYzhlZGM1OWNiMzZlNmFjODk3ZDQiLCJpYXQiOjE2NTA3MDkyNTEuNzU1NjYsIm5iZiI6MTY1MDcwOTI1MS43NTU2NjQsImV4cCI6MTY4MjI0NTI1MS43MzkwOSwic3ViIjoiOTAyIiwic2NvcGVzIjpbXX0.kePmY3SPuQdLc5WsXk5OiB-XW32Yha3-EYZZu73O4low1BNX237KbzEEWBFJT31I1fcsIghA5MYCBgXUjjmI19pe0SjVrTtvEaxWY1UgmudRtlm-rmbZ5Fh7XH87cNE83OdhyPok-ifU0I5Dg9wVX4BdfAllh2JzP4O570EkeRaUPzU6Vby0mKzW8sp4CkpEPGcWZ0TQ1JkCdna10NfplRMt_22rRYqoQWja6sgygV2ojHHfVBzfbNIZxesZEW5_q7c1xKP_kHfeOBmjRF8vcPr72JJyE1BcRnpSVWhn1SksAbIgIHDKhG3FhNOxe3Ar6tHcYLS8MNBMRJWf5z85CBzUJNoE4v9rp0P6wxz6-NhWconmCVwyyWSjLx3tH4udM-aW1fqGTNBUgB4fAnNOfVlpLLUzQE-p-1f15G0zLI9L4uc_YqMcMrSN0tT9bauzKPvku7HXXUU4IsbUPiX8Dn5C0BFDu8KF6ZKnyaMDjhckY19YUyoSnBQgOXeHoNBKr_RMBG5Lt_MveBgzcIMHSixw736g73Y4HJnKPkurDfX-ATJemN8vw03ML_7f190h6rbnf7SZvFDhBRClBRMTm_FnjX0olgq3OSR74_5T22j0o66geTKq6FnYXr08Eoj9yVMpZA7TV-2mhSQNvejpH08IjktrWmemUnVivwotFRs' *///"2P2mfbGMap5GRtjFhqTP5V85McgPT75BtmkNuRAn"
);
myHeaders.append("Content-Type", "multipart/form-data");
    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: params,
      redirect: 'follow'
    };
    fetch(ISSUES_DETAIL, requestOptions)
  .then(response => response.json())
  .then(result => {
    let CommonModel = {
      status : false,
      message: '',
      dataArray : [],
      return_id: '',
      pagesData: []
  }
    //////////////console.log(result.status);
    if(result.status){
      CommonModel.status = true;
      CommonModel.message = result.message;
     // CommonModel.return_id = result.details;
    }
    else{
      CommonModel.status = false;
      //CommonModel.message = result.message;

    }
    resolve(CommonModel);
  })
  .catch(error => {//////////////console.log('error in raising issue with image ', error);
  CommonModel.status = false;
  CommonModel.message = error.message;
  resolve(CommonModel);
});
  })

};

//api call to raise issue without image
export const raiseIssueWithoutImageAPI = async(params)=>{
  //////////////console.log(params);
  let user_details  = await Session.getUserDetails();
  user_details  = JSON.parse(user_details);
  //////////////console.log(user_details);
  //////////////console.log(user_details.token);
  
  return new Promise((resolve, reject)=>{
  
  //axios does not support multipart form data. Use normal fetch.
     axios.post( ISSUES_DETAIL, params, {
      headers: {
        'Authorization': 'Bearer ' + user_details.token,//"2P2mfbGMap5GRtjFhqTP5V85McgPT75BtmkNuRAn",
        'Content-Type': 'application/json', 
      },
    },).then((response)=>{
      let commonModel = {
        status : false,
        message: '',
        dataArray : [],
        return_id: '',
        pagesData: []
    }
      //////////////console.log(JSON.stringify(response));
      if (response.data.status == "success") {
        commonModel.status = true;
        commonModel.message = response.data.message;
        //commonModel.pagesData = response.data;
      //commonModel.dataArray = response.data.results;
      }else{
        CommonModel.status = false;
        CommonModel.message = response.data.message
      }
      resolve(commonModel);
    }).catch((error)=>{
      ////////////console.log(" error in raising issue without image ", error.response.data);
      commonModel.status = false;
        commonModel.message = error.message;
        resolve(commonModel);
    }) 

  })

}

export const modifyIssuewithImageAPI = async(params, id)=>{

  let user_details  = await Session.getUserDetails();
  user_details  = JSON.parse(user_details);
  //////////////console.log(user_details);


  //////////////console.log(params);
  
  return new Promise((resolve, reject)=>{
    var myHeaders = new Headers();
myHeaders.append("Authorization", 'Bearer ' + user_details.token/*  'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIzIiwianRpIjoiZDAwMjRjNWYzNzkzYjI1Y2Q0Yjg3NTkyMzk3N2M3NjRlZDQxMjRkOGQ5NzIzNDljMTBhZmNmMjMxMzIzYzhlZGM1OWNiMzZlNmFjODk3ZDQiLCJpYXQiOjE2NTA3MDkyNTEuNzU1NjYsIm5iZiI6MTY1MDcwOTI1MS43NTU2NjQsImV4cCI6MTY4MjI0NTI1MS43MzkwOSwic3ViIjoiOTAyIiwic2NvcGVzIjpbXX0.kePmY3SPuQdLc5WsXk5OiB-XW32Yha3-EYZZu73O4low1BNX237KbzEEWBFJT31I1fcsIghA5MYCBgXUjjmI19pe0SjVrTtvEaxWY1UgmudRtlm-rmbZ5Fh7XH87cNE83OdhyPok-ifU0I5Dg9wVX4BdfAllh2JzP4O570EkeRaUPzU6Vby0mKzW8sp4CkpEPGcWZ0TQ1JkCdna10NfplRMt_22rRYqoQWja6sgygV2ojHHfVBzfbNIZxesZEW5_q7c1xKP_kHfeOBmjRF8vcPr72JJyE1BcRnpSVWhn1SksAbIgIHDKhG3FhNOxe3Ar6tHcYLS8MNBMRJWf5z85CBzUJNoE4v9rp0P6wxz6-NhWconmCVwyyWSjLx3tH4udM-aW1fqGTNBUgB4fAnNOfVlpLLUzQE-p-1f15G0zLI9L4uc_YqMcMrSN0tT9bauzKPvku7HXXUU4IsbUPiX8Dn5C0BFDu8KF6ZKnyaMDjhckY19YUyoSnBQgOXeHoNBKr_RMBG5Lt_MveBgzcIMHSixw736g73Y4HJnKPkurDfX-ATJemN8vw03ML_7f190h6rbnf7SZvFDhBRClBRMTm_FnjX0olgq3OSR74_5T22j0o66geTKq6FnYXr08Eoj9yVMpZA7TV-2mhSQNvejpH08IjktrWmemUnVivwotFRs' *///"2P2mfbGMap5GRtjFhqTP5V85McgPT75BtmkNuRAn"
);
myHeaders.append("Content-Type", "multipart/form-data");
    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: params,
      redirect: 'follow'
    };
    fetch(ISSUES_DETAIL+ '/'+ id, requestOptions)
  .then(response => response.json())
  .then(result => {
    let CommonModel = {
      status : false,
      message: '',
      dataArray : [],
      return_id: '',
      pagesData: []
  }
    //////////////console.log(result.status);
    if(result.status){
      CommonModel.status = true;
      CommonModel.message = result.message;
     // CommonModel.return_id = result.details;
    }
    else{
      CommonModel.status = false;
      //CommonModel.message = result.message;

    }
    resolve(CommonModel);
  })
  .catch(error => {//////////////console.log('error in raising issue with image ', error);
  CommonModel.status = false;
  CommonModel.message = error.message;
  resolve(CommonModel);
});
  })

};

//api call to raise issue without image
export const modifyIssueWithoutImageAPI = async(params, id)=>{
  //////////////console.log(params);
  let user_details  = await Session.getUserDetails();
  user_details  = JSON.parse(user_details);
  //////////////console.log(user_details);
  //////////////console.log(user_details.token);
  
  return new Promise((resolve, reject)=>{
  
  //axios does not support multipart form data. Use normal fetch.
     axios.post( ISSUES_DETAIL+ '/' + id, params, {
      headers: {
        'Authorization': 'Bearer ' + user_details.token,//"2P2mfbGMap5GRtjFhqTP5V85McgPT75BtmkNuRAn",
        'Content-Type': 'application/json', 
      },
    },).then((response)=>{
      let commonModel = {
        status : false,
        message: '',
        dataArray : [],
        return_id: '',
        pagesData: []
    }
      //////////////console.log(JSON.stringify(response));
      if (response.data.status == "success") {
        commonModel.status = true;
        commonModel.message = response.data.message;
        //commonModel.pagesData = response.data;
      //commonModel.dataArray = response.data.results;
      }else{
        CommonModel.status = false;
        CommonModel.message = response.data.message
      }
      resolve(commonModel);
    }).catch((error)=>{
      //////////////console.log(" error in raising issue without image ", JSON.stringify(error));
      commonModel.status = false;
        commonModel.message = error.message;
        resolve(commonModel);
    }) 

  })

}

export const getIssueCategoryAPI = async () => {
  let userdetails= await Session.getUserDetails();
  userdetails = JSON.parse(userdetails);
  const usertoken = userdetails.token;
  //////////////console.log(usertoken);
  return new Promise(async(resolve, reject) => {
    axios
      .get(ISSUE_CATEGORY, {
        headers: {
          //"Content-Type": "application/json",
          'Authorization':'Bearer ' + usertoken,
          //'Authorization':  "2P2mfbGMap5GRtjFhqTP5V85McgPT75BtmkNuRAn",
        },
      })
      .then((response) => {
        let commonModel = {
          status : false,
          message: '',
          dataArray : [],
          return_id: '',
          pagesData: []
      }
        //////////////console.log("result", response);
        if (response.status == 200) {
          commonModel.status = true;
          commonModel.message = response.data.message;
          //commonModel.pagesData = response.data;
         commonModel.dataArray = response.data.data;
        }
        resolve(commonModel);
      })
      .catch((error) => {
        //////////////console.log(error.response.data)
        //////////////console.log("get issues category error", JSON.stringify(error));
        commonModel.status = false;
        commonModel.message = error.message;
        resolve(commonModel);
      });
  });
};


export const getCorporateIssuesListAPI = (url)=>{
  ////////////////console.log(params);
  
  return new Promise((resolve, reject)=>{
   

  //axios does not support multipart form data. Use normal fetch.
     axios.get( url, {
      header: {
        'Authorization': 'Bearer ' + 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIzIiwianRpIjoiZDAwMjRjNWYzNzkzYjI1Y2Q0Yjg3NTkyMzk3N2M3NjRlZDQxMjRkOGQ5NzIzNDljMTBhZmNmMjMxMzIzYzhlZGM1OWNiMzZlNmFjODk3ZDQiLCJpYXQiOjE2NTA3MDkyNTEuNzU1NjYsIm5iZiI6MTY1MDcwOTI1MS43NTU2NjQsImV4cCI6MTY4MjI0NTI1MS43MzkwOSwic3ViIjoiOTAyIiwic2NvcGVzIjpbXX0.kePmY3SPuQdLc5WsXk5OiB-XW32Yha3-EYZZu73O4low1BNX237KbzEEWBFJT31I1fcsIghA5MYCBgXUjjmI19pe0SjVrTtvEaxWY1UgmudRtlm-rmbZ5Fh7XH87cNE83OdhyPok-ifU0I5Dg9wVX4BdfAllh2JzP4O570EkeRaUPzU6Vby0mKzW8sp4CkpEPGcWZ0TQ1JkCdna10NfplRMt_22rRYqoQWja6sgygV2ojHHfVBzfbNIZxesZEW5_q7c1xKP_kHfeOBmjRF8vcPr72JJyE1BcRnpSVWhn1SksAbIgIHDKhG3FhNOxe3Ar6tHcYLS8MNBMRJWf5z85CBzUJNoE4v9rp0P6wxz6-NhWconmCVwyyWSjLx3tH4udM-aW1fqGTNBUgB4fAnNOfVlpLLUzQE-p-1f15G0zLI9L4uc_YqMcMrSN0tT9bauzKPvku7HXXUU4IsbUPiX8Dn5C0BFDu8KF6ZKnyaMDjhckY19YUyoSnBQgOXeHoNBKr_RMBG5Lt_MveBgzcIMHSixw736g73Y4HJnKPkurDfX-ATJemN8vw03ML_7f190h6rbnf7SZvFDhBRClBRMTm_FnjX0olgq3OSR74_5T22j0o66geTKq6FnYXr08Eoj9yVMpZA7TV-2mhSQNvejpH08IjktrWmemUnVivwotFRs',//"2P2mfbGMap5GRtjFhqTP5V85McgPT75BtmkNuRAn",
        //'Content-Type': 'multipart/form-data', 
        //'Accept': 'application/json',

        'Access-Control-Allow-Origin': '*',
     'Access-Control-Allow-Methods': 'POST, GET, PUT, OPTIONS, DELETE',
     'Access-Control-Allow-Headers': 'Access-Control-Allow-Methods, Access-Control-Allow-Origin, Origin, Accept, Content-Type',
     'Accept': 'application/x-www-form-urlencoded',
     'Content-Type':'application/x-www-form-urlencoded'
      },
    },).then((response)=>{
      let commonModel = {
        status : false,
        message: '',
        dataArray : [],
        return_id: '',
        pagesData: []
    }
      //////////////console.log(JSON.stringify(response));
      if (response.data.message == "Issue Management Details") {
        commonModel.status = true;
        commonModel.message = response.data.message;
        commonModel.pagesData = response.data;
      commonModel.dataArray = response.data.data.data;
      }else{
        commonModel.status = false;
        commonModel.message = response.data.message
        commonModel.dataArray = [];
      }
      resolve(commonModel);
    }).catch((error)=>{
      //////////////console.log(" error  ", JSON.stringify(error));
      commonModel.status = false;
        commonModel.message = error.message;
        resolve(commonModel);
    }) 

  })

}

export const getIssuesListAPI = (url)=>{
  ////////////////console.log(params);
  
  return new Promise((resolve, reject)=>{
   

  //axios does not support multipart form data. Use normal fetch.
     axios.get( url, {
      header: {
        'Authorization': 'Bearer ' + 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIzIiwianRpIjoiZDAwMjRjNWYzNzkzYjI1Y2Q0Yjg3NTkyMzk3N2M3NjRlZDQxMjRkOGQ5NzIzNDljMTBhZmNmMjMxMzIzYzhlZGM1OWNiMzZlNmFjODk3ZDQiLCJpYXQiOjE2NTA3MDkyNTEuNzU1NjYsIm5iZiI6MTY1MDcwOTI1MS43NTU2NjQsImV4cCI6MTY4MjI0NTI1MS43MzkwOSwic3ViIjoiOTAyIiwic2NvcGVzIjpbXX0.kePmY3SPuQdLc5WsXk5OiB-XW32Yha3-EYZZu73O4low1BNX237KbzEEWBFJT31I1fcsIghA5MYCBgXUjjmI19pe0SjVrTtvEaxWY1UgmudRtlm-rmbZ5Fh7XH87cNE83OdhyPok-ifU0I5Dg9wVX4BdfAllh2JzP4O570EkeRaUPzU6Vby0mKzW8sp4CkpEPGcWZ0TQ1JkCdna10NfplRMt_22rRYqoQWja6sgygV2ojHHfVBzfbNIZxesZEW5_q7c1xKP_kHfeOBmjRF8vcPr72JJyE1BcRnpSVWhn1SksAbIgIHDKhG3FhNOxe3Ar6tHcYLS8MNBMRJWf5z85CBzUJNoE4v9rp0P6wxz6-NhWconmCVwyyWSjLx3tH4udM-aW1fqGTNBUgB4fAnNOfVlpLLUzQE-p-1f15G0zLI9L4uc_YqMcMrSN0tT9bauzKPvku7HXXUU4IsbUPiX8Dn5C0BFDu8KF6ZKnyaMDjhckY19YUyoSnBQgOXeHoNBKr_RMBG5Lt_MveBgzcIMHSixw736g73Y4HJnKPkurDfX-ATJemN8vw03ML_7f190h6rbnf7SZvFDhBRClBRMTm_FnjX0olgq3OSR74_5T22j0o66geTKq6FnYXr08Eoj9yVMpZA7TV-2mhSQNvejpH08IjktrWmemUnVivwotFRs',//"2P2mfbGMap5GRtjFhqTP5V85McgPT75BtmkNuRAn",
        //'Content-Type': 'multipart/form-data', 
        //'Accept': 'application/json',

        'Access-Control-Allow-Origin': '*',
     'Access-Control-Allow-Methods': 'POST, GET, PUT, OPTIONS, DELETE',
     'Access-Control-Allow-Headers': 'Access-Control-Allow-Methods, Access-Control-Allow-Origin, Origin, Accept, Content-Type',
     'Accept': 'application/x-www-form-urlencoded',
     'Content-Type':'application/x-www-form-urlencoded'
      },
    },).then((response)=>{
      let commonModel = {
        status : false,
        message: '',
        dataArray : [],
        return_id: '',
        pagesData: []
    }
      //////////////console.log(JSON.stringify(response));
      if (response.data.message == "Issue Management Details") {
        commonModel.status = true;
        commonModel.message = response.data.message;
        commonModel.pagesData = response.data;
      commonModel.dataArray = response.data.data.data;
      }else{
        commonModel.status = false;
        commonModel.message = response.data.message
        commonModel.dataArray = [];
      }
      resolve(commonModel);
    }).catch((error)=>{
      ////////////console.log(" error  ",error.response);
      commonModel.status = false;
      commonModel.dataArray = [];
        commonModel.message = error.response.data.message; 
        resolve(commonModel);
    }) 

  })

}


export const changePasswordAPI = async ( params) => {
  // //////////////console.log("url: ", url);
   //////////////console.log(params);
  // userToken = await Session.getUserToken();

  return new Promise(async(resolve, reject) => {
    axios
      .post(CHANGE_PASSWORD, params, {
        headers: {
          "Content-Type": "application/json",
          //'Authorization':'Bearer ' +  userToken,
          'Authorization':  "2P2mfbGMap5GRtjFhqTP5V85McgPT75BtmkNuRAn",
        },
      })
      .then((response) => {
        let commonModel = {
          status : false,
          message: '',
          dataArray : [],
          return_id: '',
          pagesData: []
      }
        //////////////console.log("result", response.data);
        if (response.data.status == "success") {
          commonModel.status = true;
          commonModel.message = response.data.message;
         // commonModel.pagesData = response.data;
        //commonModel.dataArray = response.data.results;
        }else{
          commonModel.status = false;
          commonModel.message = response.data.message;

        }
        resolve(commonModel);
      })
      .catch((error) => {
        //////////////console.log("CHANGE PASSWORD ERROR", JSON.stringify(error));
        commonModel.status = false;
        commonModel.message = error.message;
        resolve(commonModel);
      });
  });
};

export const forgotPasswordAPI = async ( params) => {
  // //////////////console.log("url: ", url);
   //////////////console.log(params);
  // userToken = await Session.getUserToken();

  return new Promise(async(resolve, reject) => {
    axios
      .post(FORGOT_PASSWORD, params, {
        headers: {
          "Content-Type": "application/json",
          //'Authorization':'Bearer ' +  userToken,
          'Authorization':  "2P2mfbGMap5GRtjFhqTP5V85McgPT75BtmkNuRAn",
        },
      })
      .then((response) => {
        let commonModel = {
          status : false,
          message: '',
          dataArray : [],
          return_id: '',
          pagesData: []
      }
        console.log("result", response.data);
        if (response.data.status == "success") {
          commonModel.status = true;
          commonModel.message = response.data.message;
         // commonModel.pagesData = response.data;
        //commonModel.dataArray = response.data.results;
        }else{
          commonModel.status = false;
          commonModel.message = response.data.message;

        }
        resolve(commonModel);
      })
      .catch((error) => {
        console.log("forgot PASSWORD ERROR", JSON.stringify(error));
        commonModel.status = false;
        commonModel.message = error.message;
        resolve(commonModel);
      });
  });
};

export const propertytypesAPI  = async(url)=>{
  return new Promise((resolve,reject)=>{

    axios.get(url, {
      headers: { 
      'Authorization': '2P2mfbGMap5GRtjFhqTP5V85McgPT75BtmkNuRAn', 
      'Content-Type': 'application/json'
    }}).then(response=>{
      let CommonModel = {
        status : false,
        message: '',
        dataArray : [],
        return_id: '',
        pagesData: []
    }

      if(response.data.status == "success"){
        CommonModel.status = true;
        CommonModel.dataArray = response.data.data.data;
        CommonModel.pagesData = response.data.data;
      }else{
        CommonModel.status = false;
        CommonModel.dataArray = [];
      }
      
      resolve(CommonModel)

    }).catch(error=>{
      CommonModel.status = false;
        CommonModel.dataArray = [];
        resolve(CommonModel);
      //////////////console.log("error is fetching the property types.", error);
    })
  })
}

export const property_searchAPI = async(params)=>{
  console.log('params',params);
  return new Promise((resolve, reject)=>{

    axios.post(PROPERTY_LIST, params, {
      headers: {
        "Content-Type": "application/json",
       // 'Authorization': 'Bearer ' + await Session.getUserToken(),
        'Authorization': '2P2mfbGMap5GRtjFhqTP5V85McgPT75BtmkNuRAn',
      }
    }).then((response)=>{
      let CommonModel = {
        status : false,
        message: '',
        dataArray : [],
        return_id: '',
        pagesData: []
    }
    console.log('search results : ', response)
      if(response.data.status == "success"){
        CommonModel.status = true;
        CommonModel.dataArray = response.data.results;
      }
      else{
        CommonModel.status = false;
        CommonModel.dataArray = [];
      }
      resolve(CommonModel);
    }).catch(error=>{//////////console.log("seach Result error", JSON.stringify(error));
    CommonModel.status = false;
    CommonModel.dataArray = [];
    CommonModel.message = error.response.data.message;
    resolve(CommonModel);
  });
  })
}

export const resourcegroupsapi= (url)=>{

  return new Promise((resolve, reject)=>{
    axios.get(url, {
      headers: {
        "Content-Type": "application/json",
        'Authorization': '2P2mfbGMap5GRtjFhqTP5V85McgPT75BtmkNuRAn',
      }
    }).then(response=>{
      let CommonModel = {
        status : false,
        message: '',
        dataArray : [],
        return_id: '',
        pagesData: []
    }
      if(response.data.status == 'success'){
        CommonModel.status = true;
        CommonModel.dataArray=response.data.data.data;
        CommonModel.pagesData =response.data.data;
      }
      else{
        CommonModel.status = false;
        CommonModel.dataArray = []
        CommonModel.pagesData = []
      }
      resolve(CommonModel)
    }).catch((error)=>{
      ////////////console.log(error)
      CommonModel.status = false;
      CommonModel.dataArray = []
    
    resolve(CommonModel)
    })
  })

}

export const EmpAllocatedApi = (params, url)=>{
  return new Promise((resolve,reject)=>{

    axios.post(url,params, {
      headers: {
        "Content-Type": "application/json",
        'Authorization': '2P2mfbGMap5GRtjFhqTP5V85McgPT75BtmkNuRAn',
      }
    }).then(response=>{
      let CommonModel = {
        status : false,
        message: '',
        dataArray : [],
        return_id: '',
        pagesData: []
    }
      ////////////console.log("allocated seat response", response.data);
      if(response.data.status == "success"){
        CommonModel.status = true;
        CommonModel.dataArray = response.data.results;
        CommonModel.pagesData = response.data;
      }
     
      resolve(CommonModel)
    }).catch(error=>{
      ////////////console.log("allocated seat error",error);
      CommonModel.status = false;
      CommonModel.message=error.response.message;
      //CommonModel.dataArray = null;
      //CommonModel.pagesData = null;
      resolve(CommonModel)

    })
  })
}

export const getPropertyResouceName =async (property_id)=>{
  return new Promise((resolve, reject)=>{
    axios.get(PROPERTY_RESOURCE_NAMES + '/'+property_id, {
      headers: {
        "Content-Type": "application/json",
        'Authorization': '2P2mfbGMap5GRtjFhqTP5V85McgPT75BtmkNuRAn',
      }
    }).then(response =>{
      let CommonModel = {
        status : false,
        message: '',
        dataArray : [],
        return_id: '',
        pagesData: []
    }
      ////////////console.log("resource names", response.data.data);
      if(response.data.status == "success"){
        CommonModel.status = true;
        CommonModel.dataArray=  response.data.data;
      }
      else{
        CommonModel.status = false;
        CommonModel.dataArray = [];
      }
      resolve(CommonModel);
    })
  }).catch((error)=>{
    ////////////console.log(error);
    CommonModel.status = false;
    CommonModel.dataArray = [];
    resolve(CommonModel);
  })
}

export const getPropertyResouceTypes =async (property_id)=>{
  return new Promise((resolve, reject)=>{
    axios.get(PROPERTY_RESOURCE_TYPES, {
      headers: {
        "Content-Type": "application/json",
        'Authorization': '2P2mfbGMap5GRtjFhqTP5V85McgPT75BtmkNuRAn',
      }
    }).then((response) =>{
      let CommonModel = {
        status : false,
        message: '',
        dataArray : [],
        return_id: '',
        pagesData: []
    }
      ////////////console.log("resource types", response.data.data);
      if(response.data.status == "success"){
        CommonModel.status = true;
        CommonModel.dataArray=  response.data.data;
      }
      else{
        CommonModel.status = false;
        CommonModel.dataArray = [];
      }
      resolve(CommonModel);
    })
  }).catch((error)=>{
    ////////////console.log(error);
    CommonModel.status = false;
    CommonModel.dataArray = [];
    resolve(CommonModel);
  })
}

export const bookingInfoAPI = async(params)=>{
 

  return new Promise(async(resolve, reject)=>{
    axios.post(BOOKING_INFO, params,{
      headers: {
        "Content-Type": "application/json",
        'Authorization': 'Bearer ' + await Session.getUserToken(),
        //'Authorization': '2P2mfbGMap5GRtjFhqTP5V85McgPT75BtmkNuRAn',
      }}).then(response=>{
        let CommonModel = {
          status : false,
          message: '',
          dataArray : [],
          return_id: '',
          pagesData: []
      }
        if(response.data.status == 'success'){
          CommonModel.status = true;
          CommonModel.dataArray = response.data.result;
          ////////console.log('booking info  from api',response.data.result)
        }
        else{
          CommonModel.status = false;
          CommonModel.dataArray = []
        }
        resolve(CommonModel)
      }).catch(error=>{
        ////console.log('Error while getting booking info: ', error.response.data);
        CommonModel.status = false;
        CommonModel.dataArray = [];
        CommonModel.message = error.response.data.message
        resolve(CommonModel);
      })
  })

}

export const deleteMember = async(params)=>{
  ////////console.log(params);
  ////////console.log('delete url: ', DELETE_MEMBER + await Session.getUserId());

  return new Promise(async(resolve, reject)=>{
    axios.put(DELETE_MEMBER + await Session.getUserId(), params, { headers: {
      "Content-Type": "application/json",
      'Authorization': 'Bearer ' + await Session.getUserToken(),
      //'Authorization': '2P2mfbGMap5GRtjFhqTP5V85McgPT75BtmkNuRAn',
    } 

    }).then(response=>{
      ////////console.log('deleting member response: ', response);
      let CommonModel = {
        status : false,
        message: '',
        dataArray : [],
        return_id: '',
        pagesData: []
    }
      if(response.data.status == 'success'){
        CommonModel.status = true;
        CommonModel.message = response.data.message;
      }
      else{
        CommonModel.status = false;
        CommonModel.message = response.data.message;
        //CommonModel.dataArray = []
      }
      resolve(CommonModel)
    }).catch(error=>{
      ////////console.log('Error while deleting ', error.response.data);
      CommonModel.status = false;
      //CommonModel.dataArray = [];
      CommonModel.message = error.response.data.message
      resolve(CommonModel);
    })
  })
}

export const updateUserProfileMember = async(params)=>{
  console.log('params:', params);
  return new Promise(async(resolve, reject)=>{
    var myHeaders = new Headers();
myHeaders.append("Authorization", 'Bearer ' + await Session.getUserToken()/*  'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIzIiwianRpIjoiZDAwMjRjNWYzNzkzYjI1Y2Q0Yjg3NTkyMzk3N2M3NjRlZDQxMjRkOGQ5NzIzNDljMTBhZmNmMjMxMzIzYzhlZGM1OWNiMzZlNmFjODk3ZDQiLCJpYXQiOjE2NTA3MDkyNTEuNzU1NjYsIm5iZiI6MTY1MDcwOTI1MS43NTU2NjQsImV4cCI6MTY4MjI0NTI1MS43MzkwOSwic3ViIjoiOTAyIiwic2NvcGVzIjpbXX0.kePmY3SPuQdLc5WsXk5OiB-XW32Yha3-EYZZu73O4low1BNX237KbzEEWBFJT31I1fcsIghA5MYCBgXUjjmI19pe0SjVrTtvEaxWY1UgmudRtlm-rmbZ5Fh7XH87cNE83OdhyPok-ifU0I5Dg9wVX4BdfAllh2JzP4O570EkeRaUPzU6Vby0mKzW8sp4CkpEPGcWZ0TQ1JkCdna10NfplRMt_22rRYqoQWja6sgygV2ojHHfVBzfbNIZxesZEW5_q7c1xKP_kHfeOBmjRF8vcPr72JJyE1BcRnpSVWhn1SksAbIgIHDKhG3FhNOxe3Ar6tHcYLS8MNBMRJWf5z85CBzUJNoE4v9rp0P6wxz6-NhWconmCVwyyWSjLx3tH4udM-aW1fqGTNBUgB4fAnNOfVlpLLUzQE-p-1f15G0zLI9L4uc_YqMcMrSN0tT9bauzKPvku7HXXUU4IsbUPiX8Dn5C0BFDu8KF6ZKnyaMDjhckY19YUyoSnBQgOXeHoNBKr_RMBG5Lt_MveBgzcIMHSixw736g73Y4HJnKPkurDfX-ATJemN8vw03ML_7f190h6rbnf7SZvFDhBRClBRMTm_FnjX0olgq3OSR74_5T22j0o66geTKq6FnYXr08Eoj9yVMpZA7TV-2mhSQNvejpH08IjktrWmemUnVivwotFRs' *///"2P2mfbGMap5GRtjFhqTP5V85McgPT75BtmkNuRAn"
);
myHeaders.append("Content-Type", "multipart/form-data");
    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: params,
      redirect: 'follow'
    };
    console.log('my headers: ', myHeaders);
    fetch(DELETE_MEMBER + await Session.getUserId(), requestOptions)
  .then(response => response.json())
  .then(result => {
    console.log(result);
    let CommonModel = {
      status : false,
      message: '',
      dataArray : [],
      return_id: '',
      pagesData: []
  }
    console.log(result);
    if(result.status){
      CommonModel.status = true;
      CommonModel.message = result.message;
      CommonModel.dataArray = result.data;
     // CommonModel.return_id = result.details;
    }
    else{
      CommonModel.status = false;
      //CommonModel.message = result.message;

    }
    resolve(CommonModel);
  })
  /* .catch(error => {console.log('error in raising issue with image ', error);
  CommonModel.status = false;
  CommonModel.message = error.message;
  resolve(CommonModel);
}); */
  })
}


export const deleteEmployee = async(params)=>{
  

  return new Promise(async(resolve, reject)=>{
    axios.post(DELETE_EMPLOYEE , params, { headers: {
      "Content-Type": "application/json",
      'Authorization': 'Bearer ' + await Session.getUserToken(),
      //'Authorization': '2P2mfbGMap5GRtjFhqTP5V85McgPT75BtmkNuRAn',
    }

    }).then(response=>{
      ////////console.log('deleting employee response: ', response.data.result);
      let CommonModel = {
        status : false,
        message: '',
        dataArray : [],
        return_id: '',
        pagesData: []
    }
      if(response.data.status == 'success'){
        CommonModel.status = true;
        CommonModel.message = response.data.result;
      }
      else{
        CommonModel.status = false;
        CommonModel.message = response.data.result;
        //CommonModel.dataArray = []
      }
      resolve(CommonModel)
    }).catch(error=>{
      ////////console.log('Error while deleting ', error.response.data);
      CommonModel.status = false;
      //CommonModel.dataArray = [];
      CommonModel.message = error.response.data.message
      resolve(CommonModel);
    })
  })
}

//meeting spaces

export const getMeetingResourceGroup = async()=>{
  return new Promise(async(resolve, reject)=>{
    axios.get(MEETING_RESOURCE_GROUP, {headers: {
      "Content-Type": "application/json",
      'Authorization': '2P2mfbGMap5GRtjFhqTP5V85McgPT75BtmkNuRAn',
    }}).then(response=>{
      let CommonModel = {
        status : false,
        message: '',
        dataArray : [],
        return_id: '',
        pagesData: []
    }
    //console.log('meeting resources ',response.data.results)
      if(response.data.status == 'success'){
        ////////console.log('meeting resources ',response.data.results)
        CommonModel.status = true;
        CommonModel.dataArray = response.data.results;
      }
      else{
        CommonModel.status = false;
        CommonModel.message = response.data.results;
        //CommonModel.dataArray = []
      }
      resolve(CommonModel)


    }).catch(error=>{
      //console.log('error in getting the resource groups.', error);
      CommonModel.status = false;
      //CommonModel.dataArray = [];
      CommonModel.message = error.response.data.message
      resolve(CommonModel);
    })
  })
}


export const getMeetingPropertyList = async(params,url)=>{
  //////console.log('meeting params', params, url)
  return new Promise(async(resolve, reject)=>{
    axios.post(url, params, {headers: {
      "Content-Type": "application/json",
      'Authorization': '2P2mfbGMap5GRtjFhqTP5V85McgPT75BtmkNuRAn',
    }}).then(response=>{
      let CommonModel = {
        status : false,
        message: '',
        dataArray : [],
        return_id: '',
        pagesData: []
    }
    ////console.log(result)
    
      if(response.data.status == 'success'){
        //////console.log('meeting property list ',response.data.results.data)
        CommonModel.status = true;
        CommonModel.dataArray = response.data.results.data;
        CommonModel.pagesData = response.data.results
      }
      else{
        CommonModel.status = false;
        CommonModel.message = response.data != null ? response.data.results.data: 'empty';
        //CommonModel.dataArray = []
      }
      resolve(CommonModel)


    }).catch(error=>{
      //////console.log('error in getting the meeting properties', error);
      CommonModel.status = false;
      //CommonModel.dataArray = [];
      CommonModel.message = error.response.data!=null ? error.response.data.message: ''
      resolve(CommonModel);
    })
  })
}

export const getMeetingSpaceDetails = async (params)=>{

  return new Promise(async(resolve, error) =>{
    axios.post(MEETING_PROPERTY_INFO, params,{
      headers:{
        //'Authorization': 'Bearer ' + await Session.getUserToken(),
        'Authorization': '2P2mfbGMap5GRtjFhqTP5V85McgPT75BtmkNuRAn',
      }
    }).then((response)=>{
      let commonModel = {
        status : false,
        message: '',
        dataArray : [],
        return_id: '',
        pagesData: []
    }
     console.log("API response from property Info: ", JSON.stringify(response.data.results));

      if(response.data.status == "success"){
        commonModel.status = true;
        commonModel.message = response.data.message
        commonModel.dataArray = response.data.results;
      }
     
      resolve(commonModel);
    }).catch((error)=>{
      //////////////console.log("Error in API fetch for Property info", error);
      commonModel.status = false;
      commonModel.message = error.message;
      resolve(commonModel);
    })
  });

}

export const checkTimeAvailabilityAPI = async (params)=>{

  return new Promise(async(resolve, error) =>{
    axios.post(MEETING_TIME_AVAILABILITY, params,
    {
      headers:
      {
        'Authorization': 'Bearer ' + await Session.getUserToken(),
        //'Authorization':'2P2mfbGMap5GRtjFhqTP5V85McgPT75BtmkNuRAn',
      }
    }).then((response)=>{
      let commonModel = {
        status : false,
        message: '',
        dataArray : false,
        return_id: '',
        pagesData: []
      }
     console.log("API response for time availability: ", response.data);

      if(response.data.status == "success")
      {
        commonModel.status = true;
        commonModel.message = response.data.message
        commonModel.dataArray = response.data.results;
      }
      resolve(commonModel);
    }).catch((error)=>{
      //////////////console.log("Error in API fetch for Property info", error);
      commonModel.status = false;
      commonModel.message = error.message;
      commonModel.dataArray = false;
      resolve(commonModel);
    })
  });

}

export const pushGuestListAPI = async (params)=>{

  return new Promise(async(resolve, error) =>{
    axios.post(PUSH_GUEST_LIST, params,{
      headers:{
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + await Session.getUserToken(),
       
      }
    }).then((response)=>{
      let commonModel = {
        status : false,
        message: '',
        dataArray : [],
        return_id: '',
        pagesData: []
    }
     ////console.log("API response from guest list insert", JSON.stringify(response.data));

      if(response.data.status == "success"){
        commonModel.status = true;
        commonModel.message = response.data.message
        
      }
     
      resolve(commonModel);
    }).catch((error)=>{
      //////////////console.log("Error in API fetch for Property info", error);
      commonModel.status = false;
      commonModel.message = error.message;
      resolve(commonModel);
    })
  });

}

export const deleteGuest = async (id)=>{
  ////console.log('id to delete', id)

  return new Promise(async(resolve, error) =>{
    axios.delete(DELETE_GUEST+id,{
      headers:{
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + await Session.getUserToken(),
       
      }
    }).then((response)=>{
      let commonModel = {
        status : false,
        message: '',
        dataArray : [],
        return_id: '',
        pagesData: []
    }
     ////console.log("API response from guest delete", JSON.stringify(response.data));

      if(response.data.status == "success"){
        commonModel.status = true;
        commonModel.message = response.data.message
        
      }
     
      resolve(commonModel);
    }).catch((error)=>{
      //////////////console.log("Error in API fetch for Property info", error);
      commonModel.status = false;
      commonModel.message = error.message;
      resolve(commonModel);
    })
  });

}

export const modifyMeeting = async (id, params)=>{
  ////console.log('id to delete', id)

  return new Promise(async(resolve, error) =>{
    axios.post(MODIFY_MEETING+id,params,{
      headers:{
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + await Session.getUserToken(),
       
      }
    }).then((response)=>{
      let commonModel = {
        status : false,
        message: '',
        dataArray : [],
        return_id: '',
        pagesData: []
    }
    console.log("API response from modify booking", JSON.stringify(response.data));

      if(response.data.status == "success"){
        commonModel.status = true;
        commonModel.message = response.data.message
        
      }
      else{
        commonModel.status = false;
        commonModel.message = response.data.message

      }
     
      resolve(commonModel);
    }).catch((error)=>{
      //////////////console.log("Error in API fetch for Property info", error);
      commonModel.status = false;
      commonModel.message = error.message;
      resolve(commonModel);
    })
  });

}

export const addToWishlist = async ( params, url) => {
  return new Promise(async(resolve, reject) => {
    axios
      .post(url, params, {
        headers: {
          "Content-Type": "application/json",
          'Authorization':  "2P2mfbGMap5GRtjFhqTP5V85McgPT75BtmkNuRAn",
        },
      })
      .then((response) => {
        let commonModel = {
          status : false,
          message: '',
          dataArray : [],
          return_id: '',
          pagesData: []
      }
        console.log("result srp page ",url, response.data);
        if (response.data.status == "success") {
          commonModel.status = true;
          commonModel.message = response.data.message;
          //commonModel.pagesData = response.data.results;
          //commonModel.dataArray = response.data.results.data;
       
        }
        resolve(commonModel);
      })
      .catch((error) => {
        console.log("PROPERTY_LIST error 1", JSON.stringify(error));
        commonModel.status = false;
        commonModel.message = error.response != null? error.response/* .data.message */: 'empty';
        resolve(commonModel);
      });
  });
};


export const getWishlist = async ( params, url) => {
 
    console.log("wishlist property list api url: ", url);
  console.log("params tosend",params);

  return new Promise(async(resolve, reject) => {
    axios
      .post(url, params, {
        headers: {
          "Content-Type": "application/json",
          'Authorization':  "2P2mfbGMap5GRtjFhqTP5V85McgPT75BtmkNuRAn",
        },
      })
      .then((response) => {
        let commonModel = {
          status : false,
          message: '',
          dataArray : [],
          return_id: '',
          pagesData: []
      }
        console.log("result wishlist page ",url, response.data);
        if (response.data.status == "success") {
          commonModel.status = true;
          commonModel.message = response.message;
          commonModel.pagesData = response.data.results;
          commonModel.dataArray = response.data.results;
       
        }
        resolve(commonModel);
      })
      .catch((error) => {
        console.log("wishlist error 1", JSON.stringify(error.response));
        commonModel.status = false;
        commonModel.message = error.response != null? error.response.data.message: 'empty';
        commonModel.dataArray = []
        resolve(commonModel);
      });
  });
};

export const getCountries = async()=>{
  return new Promise((resolve, reject)=>{
    axios.get(BASE_URL + 'country?limit=300', {
      headers: {
        "Content-Type": "application/json",
        'Authorization':  "2P2mfbGMap5GRtjFhqTP5V85McgPT75BtmkNuRAn",
      }
    }).then((response)=>{
    //  console.log(response.data.data.data);
      let commonModel = {
        status : false,
        message: '',
        dataArray : [],
        return_id: '',
        pagesData: []
    }
    /* if (response.data.data.status == "success") { */
      commonModel.status = true;
      commonModel.dataArray = response.data.data.data;
   /*  } */
    resolve(commonModel)

    }).catch(error=>{
      console.log(error.response);
      commonModel.status = false;
      commonModel.dataArray = []
      resolve(commonModel)
    })

  })
  
}
export const getStates = async(params)=>{
  return new Promise((resolve, reject)=>{
    axios.post(BASE_URL + "state/" + params.country_id,params, {
      headers: {
        "Content-Type": "application/json",
        'Authorization':  "2P2mfbGMap5GRtjFhqTP5V85McgPT75BtmkNuRAn",
      }
    }).then((response)=>{
      console.log(response.data.data);
      let commonModel = {
        status : false,
        message: '',
        dataArray : [],
        return_id: '',
        pagesData: []
    }
    /* if (response.data.data.status == "success") { */
      commonModel.status = true;
      commonModel.dataArray = response.data.data;
   /*  } */
    resolve(commonModel)

    }).catch(error=>{
      console.log(error.response);
      commonModel.status = false;
      commonModel.dataArray = []
      resolve(commonModel)
    })

  })
  
}

export const getCities = async(params)=>{
  return new Promise((resolve, reject)=>{
    axios.post(BASE_URL + "city/" + params.state_id,params, {
      headers: {
        "Content-Type": "application/json",
        'Authorization':  "2P2mfbGMap5GRtjFhqTP5V85McgPT75BtmkNuRAn",
      }
    }).then((response)=>{
      console.log(response.data.data);
      let commonModel = {
        status : false,
        message: '',
        dataArray : [],
        return_id: '',
        pagesData: []
    }
    /* if (response.data.data.status == "success") { */
      commonModel.status = true;
      commonModel.dataArray = response.data.data;
   /*  } */
    resolve(commonModel)

    }).catch(error=>{
      console.log(error.response);
      commonModel.status = false;
      commonModel.dataArray = []
      resolve(commonModel)
    })

  })
  
}