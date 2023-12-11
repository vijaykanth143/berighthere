import React from "react";
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  Button,
  Image,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Dimensions,
  BackHandler,
  Alert,
  ActivityIndicator,
  Modal,
  Keyboard,
  Switch,
  Appearance, 
  TextInput
} from "react-native";

import route from "./../Route/route";

// import { setI18nConfig, translate } from "./../../Config/Language";
import formStyle from "./../Styles/control";
import fontStyle from "./../Styles/font";
import colorStyle from "./../Styles/color";
import buttonStyle from "./../Styles/button";
import boxStyle from "./../Styles/box";
//import { Icon } from "react-native-elements";
import { employeeLoginAPI, forgotPasswordAPI, loginAPI,tokenAPI } from "./../Rest/userAPI";
import Icon from 'react-native-vector-icons/FontAwesome';

import CommonHelpers from "../Utils/CommonHelpers";
import Session from "./../config/Session";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

//import NetInfo from "@react-native-community/netinfo";
import { getUniqueId } from "react-native-device-info";
import Spinner from "./../UI/Spinner";
import Confirmation from "./../Modals/Confirmation";
import location from '../Location/location';
import color from "./../Styles/color";
import renderItem from "../Styles/renderItem";


global.userToken = "";
export default class Login extends React.Component {
  constructor(props) {
    super(props);
    // setI18nConfig();
    this.state = {

      locationPermission: false,
      locationCoords:{},

      email: "",
      password: "",
      showHidePwd: false,
      pwdEye: "eye-slash",
      emailError: false,
      passwordError: false,
      spinner: false,
      isConnected: true,
      networkStatusTxt: "",
      appExitmodalVisible: false,
      forgotPassword: false,
      isEmployee: false,
    //   preferredVerification: "",
      userName: "",
    //   showFingerprintModal: false,
    //   isBiometricAvailable: false, //whether mobile supports?
    //   isFingerPrint: false, //whether finger print or face id?
    };
    this.emailRef = React.createRef();
    this.pwdRef = React.createRef();
    // this.unsubscribe;
    this.onCloseModel = this.onCloseModel.bind(this);
    this.onOKClicked = this.onOKClicked.bind(this);

    this.onCloseForgot = this.onCloseForgot.bind(this);
    this.onForgotPassword = this.onForgotPassword.bind(this);
    // this.closeFingerPrintModal = this.closeFingerPrintModal.bind(this);
  }

  componentDidMount = async () => {
    this.backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      this.backAction
    );
      await location.check().then((value) => {
        this.setState({
          locationPermission: value,
        }, () => {
          if (this.state.locationPermission) {
            location.getGeoLocation().then(async(value) => {
              await Session.setLocationCoords(value)
              this.setState({
                locationCoords: value,
              }, () => {
                
                //this.apiCallPropertyNearBy();
                console.log("Location Details: ", this.state.locationCoords, this.state.locationPermission);
              })
            })
          }
          else {
            location.requestPermission().then(value => {
              if (value) {
                location.getGeoLocation().then(async(values) => {
                  await Session.setLocationCoords(values)
                  this.setState({
                    locationPermission: value,
                    locationCoords: values,
                  }, async() => {
                    
                    //this.apiCallPropertyNearBy();
                    console.log("Location Details: ", this.state.locationCoords, this.state.locationPermission);
                  })
                })
              } else {
                this.setState({
                  locationPermission: value,
                })
              }
            })
          }
        })
      });
  };

  componentWillUnmount = () => {
    // this.unsubscribe();
    if (this.backHandler) this.backHandler.remove();
  };

  componentDidAppear = () => {
    console.log("appppppp");
    // add back listener
    this.backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      this.backAction
    );
  };

  /* componentDidDisappear = () => {
    // remove back listener
    this.backHandler.remove();
  }; */

  // App Exit popup
  backAction = () => {
    this.setState({
      appExitmodalVisible: true,
    });
    return true;
  };

  onOKClicked = () => {
    this.setState({
      appExitmodalVisible: false,
    });
    BackHandler.exitApp();
  };

  onForgotPassword = (email) => {
    this.setState({
      forgotPassword: false,
    });

    console.log(email);

    const params = {

      "email": email
  
  }

  forgotPasswordAPI(params).then(result=>{
    if(result.status){
      CommonHelpers.showFlashMsg(result.message, 'success');
    }
    else{
      CommonHelpers.showFlashMsg(result.message, 'danger');
    }
  })
  };

  onCloseModel = () => {
    this.setState({
      appExitmodalVisible: false,
    });
  };

  onCloseForgot = () => {
    this.setState({
      forgotPassword: false,
    });
  };


  gotoRegister = () => {
    console.log("Registered")
    Keyboard.dismiss();
    this.props.navigation.push('Register')

    
  };


  gotoForgot = () => {
   this.setState({
    forgotPassword: true,
   })
 };

  updateInputVal = (val, prop) => {
    const state = this.state;
    state[prop] = val;

    // to remove error red line
    state["emailError"] = false;
    state["passwordError"] = false;
    this.setState(state);
  };

  // Method to show/hide password and eye icon changes
  showOrHidePassword = () => {
    if (this.state.showHidePwd) {
      this.setState({ showHidePwd: false });
      this.setState({ pwdEye: "eye-slash" });
    } else {
      this.setState({ showHidePwd: true });
      this.setState({ pwdEye: "eye" });
    }
  };

 

  // Method to validate login form data
  validateLoginData = async () => {
    Keyboard.dismiss();

    if (this.state.email == "") {
      CommonHelpers.showFlashMsg("Please Enter Email Id", "danger");
      this.setState({ emailError: true });
    } else if (!CommonHelpers.validateEmail(this.state.email)) {
      CommonHelpers.showFlashMsg("Please Enter Valid Email Id", "danger");
      this.setState({ emailError: true });
    } else if (this.state.password == "") {
      CommonHelpers.showFlashMsg("Please Enter Password", "danger");
      this.setState({ passwordError: true });
    } else {
      // to show loader
      this.setState({
        spinner: true,
      });
      this.getPlayerId();
    }
    
  };

  getPlayerId = async () => {
    // if ((await Session.getPlayerId()) === null) this.getPlayerId();
    // else 
    this.apiCallLogin();
  };



  apiCallforToken = async () => {

    const formData = new FormData();

    formData.append("username", this.state.email);
    formData.append("password", this.state.password);
    formData.append(
      "client_secret",
      "2P2mfbGMap5GRtjFhqTP5V85McgPT75BtmkNuRAn"
    );
    formData.append("grant_type", "password");
    formData.append("client_id", 2);
    this.setState({
      spinner: true,
    });
   /*  tokenAPI(formData).then(async(result) => {
      console.log("check",result.data.access_token);
      this.setState({
        spinner: false,
      }); */

      let details = await Session.getUserDetails();
      details = JSON.parse(details);
      console.log("role id parsed here: ",details.role_id,details );

      const meetingData = JSON.parse( await Session.getMeetingSpacesData());
      const workspaceData = JSON.parse(await Session.getWorkSpaceDetails());
      console.log('in login',typeof meetingData, );
      if(meetingData != null){
        if(meetingData.item.access_period_unit_id == 3){
          this.props.navigation.push('afterlogin',{
            screen:'bookingmeetingspaces',
            //params: meetingData
          })
        }else{
          this.props.navigation.push('afterlogin',{
            screen:'meetingspacesbookingsummary',
            //params: meetingData
          })

        }
        this.setState({
          spinner: false
        })
      }
      else if(workspaceData != null)
      {
        await Session.setWorkSpaceDetails('null');
        this.setState({
          spinner: false
        });

        this.props.navigation.push('afterlogin',{
          screen:'booking',
          params: {
            bookingData: workspaceData
          }
        })

      }
      else{
        this.setState({
          spinner: false
        })

        if(Number(details.role_id) == 5 ){
          this.setState({
            spinner: false,
          });
         // this.props.navigation.push('afterlogin',{screen:'Home'});
          this.props.navigation.push('afterlogin',{screen:'bottomtabnavigator'/* 'masterhome' */});
       
  
        }
        else if(Number(details.role_id) == 7){
          this.setState({
            spinner: false,
          });
          console.log("employee login success. ");
          this.props.navigation.push('afterlogin', {screen: 'employeehome'});
         
          
        }

      }
      
      
  }






  // Method to send login data to api
  apiCallLogin = async () => {
    // to remove error red line on text fields
    this.setState({ passwordError: false });
    this.setState({ emailError: false });

    // to show loader
    this.setState({
      spinner: true,
    });

    var params = {
      email: this.state.email,
      password: this.state.password,
    };
    let that = this;
    console.log("res", params);

   /*  if(this.state.isEmployee){
      employeeLoginAPI(params).then((result)=>{
        console.log("result employee: ", result.status, result.return_id);
        this.setState({
          spinner: false,
        });
        if(result.status){
          Session.setUserId(result.return_id.id);
          Session.setUserName(result.return_id.name);
          Session.setUserDetails(result.return_id);
          //Session.setUserName(result.return_id.first_name + " " + result.return_id.last_name);

          CommonHelpers.showFlashMsg(result.message, "success");
          this.apiCallforToken();

        }
        else {
          if (result.message == "Network Error") {
            CommonHelpers.showFlashMsg(
              "No Network Connection",
              "danger"
            );
          } 
          else {
            CommonHelpers.showFlashMsg("Employee Login Error: "+result.message, "danger");
          }
        }
      })

    }  */
    
      loginAPI(params).then((result) => {
        console.log("res", result.status,result.message,result);
        this.setState({
          spinner: false,
        });
        if (result.status) {
  
            // global.userToken = result.return_id.token;
            // // Parse JWT and get data
            // const userData = Session.parseJwt(global.userToken);
            // console.log("userData: ", userData);
            
            Session.setUserId(result.return_id.id);
            Session.setUserName(result.return_id.name);
            Session.setUserDetails(result.return_id);
            console.log("the role id is ; ", result.return_id.role_id);
            Session.setRoleId(result.return_id.role_id);
            
            //Session.setUserName(result.return_id.first_name + " " + result.return_id.last_name);
  
            CommonHelpers.showFlashMsg(result.message, "success");
            
            this.apiCallforToken();
            // Move to next page
          
          }
  
          /*  Navigation after login */
      //   } 
      else {
          if (result.message == "Network Error") {
            CommonHelpers.showFlashMsg(
              "No Network Connection",
              "danger"
            );
          } 
          else {
            CommonHelpers.showFlashMsg(result.message, "danger");
          }
        }
      });
  
  };

  resetFormElements = () => {
    this.emailRef.setValue("");
    this.pwdRef.setValue("");
    this.setState({
      email: "",
      password: "",
    });
  };

 

  render() {
    return (
      
        
        <SafeAreaView  /* height={"100%"} */ style={[/* boxStyle.container, */ {/* backgroundColor:"red", */ /* position: "relative", */ flex: 1}  ]}>
         {/*  {!this.state.isConnected ? (
            <View style={styles.offlineContainer}>
              <Text style={styles.offlineText}>
                {this.state.networkStatusTxt}
              </Text>
            </View>
          ) : null} */}

          <KeyboardAwareScrollView
            contentContainerStyle={[boxStyle.scrollViewCenter, { flexDirection: "column"/* ,justifyContent: 'space-between' */ , }, ]}
            keyboardShouldPersistTaps="always"
          >
            <View style={[boxStyle.centerBox/* , colorStyle.whiteBackground */, {height: "100%",flex: 1}]}>

              <View style = {{flex: 1}}>
                <View style = {{flex: 2,/*  backgroundColor: "pink",  */alignItems: "center", justifyContent: "space-around"}}>
                <Image
                  style={[ { width: "60%",
                  height:'80%',
                  resizeMode: "contain",
                  //marginLeft: "20%",
                  //marginBottom: 40,
                  //marginTop: 5,
                  //bottom:100,
                  // justifyContent: "flex-start"
                }]}
                  source={/* Appearance.getColorScheme()=== "dark"?require('./../Assets/images/BRHlogowhite.png'): */require("./../Assets/images/BRHnew.png")}
                />

                </View>
                <View style = {{flex: 4, /* backgroundColor: "yellow", */ justifyContent: "center"}}>
                <Image
                  style={[ { width: "100%",
                  height:'100%',
                  resizeMode: "contain",
                  //marginLeft: "20%",
                  //marginBottom: 40,
                  //marginTop: 5,
                  //bottom:200,
                  // justifyContent: "flex-start"
                }]}
                  source={require("./../Assets/images/signinPageDoll.png")}
                />
                </View>
              </View>
              
               {/*  <View height = {100} style={{backgroundColor:"red", alignItems: "center" ,width: "99%", flex:1}}>
              <Image
                  style={[ { width: "60%",
                  //height:'60%',
                  resizeMode: "contain",
                  //marginLeft: "20%",
                  //marginBottom: 40,
                  //marginTop: 5,
                  bottom:100,
                  // justifyContent: "flex-start"
                }]}
                  source={Appearance.getColorScheme()=== "dark"?require('./../Assets/images/BRHlogowhite.png'):require("./../Assets/images/BRHlogoexpanded.png")}
                />
                </View> */}
                {/* <View  height = {200} 
                style={{backgroundColor:"yellow",alignItems: "center", flex:1}}
                >
                <Image
                  style={[ { width: "100%",
                  height:'60%',
                  resizeMode: "contain",
                  //marginLeft: "20%",
                  //marginBottom: 40,
                  //marginTop: 5,
                  bottom:200,
                  // justifyContent: "flex-start"
                }]}
                  source={require("./../Assets/images/signinPageDoll.png")}
                />
                </View> */}
                <View  style={[formStyle.formMargin, ]}>
                  <View style = {{flex: 1}}>
                  <Text
                    style={[
                      fontStyle.bold,
                      fontStyle.sizeExtraLarge,
                      colorStyle.blackColor,
                    ]}
                  >
                    Hello!
                  </Text>
                  </View>
                  {/* <View style = {{flex: 1,flexDirection: "row", alignItems: "center", justifyContent: "flex-end" }}>
                    
                  <Switch 
                             trackColor={{ false: "#767577", true: "orange" }}
                             thumbColor={this.state.isEmployee ? "#fff" : "#f4f3f4"}
                             ios_backgroundColor="#3e3e3e"
                             onValueChange={value =>{
                                 console.log(value)
                                this.setState({
                                  isEmployee: value,
                             })}}
                             value={this.state.isEmployee}
                             />
                             <Text style = {[fontStyle.semibold, fontStyle.regular, this.state.isEmployee ? colorStyle.myOrangeColor:colorStyle.darkgrayColor,]}>Employee?</Text>
                  </View> */}
                </View>
                <View style={formStyle.formMargin}>
                  <TextInput
                  keyboardType="email-address"
                    placeholder={"Username"}
                    placeholderTextColor = {color.darkgrayColor.color}
                    
                    selectionColor={color.myOrangeColor.color}
                    style = {[ renderItem.inputBox]}
                    ref={(input) => {
                      this.emailRef = input;
                    }}
                    value={this.state.email}
                    returnKeyType={"next"}
                    onSubmitEditing={() => {
                      this.pwdRef.focus();
                    }}
                    
                    onChangeText={(val) => this.updateInputVal(val, "email")}
                   
                  />
                </View>

                <View style={[formStyle.formMargin/* ,{flexDirection: "row"} */] }>
                  <TextInput

                    placeholder={"Password"}
                    placeholderTextColor = {color.darkgrayColor.color}
                    selectionColor={color.myOrangeColor.color}
                    style = {[ renderItem.inputBox]}
                    value={this.state.password}
                    ref={(input) => {
                      this.pwdRef = input;
                    }}
                    returnKeyType={'done'}
                    onChangeText={(val) => this.updateInputVal(val, "password")}
                    secureTextEntry={!this.state.showHidePwd}
                    onSubmitEditing={() => {
                      ;
                    }}
                    
                  />

                  <Icon
                    name={this.state.pwdEye}
                    style={[formStyle.formIcon, ]}
                    type="font-awesome"
                    color="orange"
                    size = {20}
                    onPress={() => {
                      this.showOrHidePassword();
                    }}
                  />
                  
                </View>

                <View style = {[formStyle.formMargin, {flexDirection: 'row', justifyContent: 'space-between'}]}>
                <TouchableOpacity  onPress = {()=>{
                  this.props.navigation.navigate('afterlogin', {screen: 'masterhome'})
                }}>
                  <Text 
                  style = {[
                    fontStyle.regular, 
                    fontStyle.sizeSmall, 
                    colorStyle.myOrangeColor,
                    {
                      textDecorationLine:'underline', 
                      textDecorationColor:colorStyle.myOrangeColor.color
                      }
                      ]}>Continue as Guest?</Text>

                </TouchableOpacity>

                <View >
                  <TouchableOpacity onPress={() => this.gotoForgot()}>
                    <Text
                      style = {[
                        fontStyle.regular, 
                        fontStyle.sizeSmall, 
                        colorStyle.myOrangeColor,
                        {
                          textDecorationLine:'underline', 
                          textDecorationColor:colorStyle.myOrangeColor.color
                          }
                          ]}
                    >
                    
                      Forgot password?
                    </Text>
                  </TouchableOpacity>
                </View>
                </View>

               

{/* <View>
<TouchableWithoutFeedback
                    onPress={() => {
                      // this.validateLoginData();
                    }}
                  >
                    <Text
                      style={[
                        fontStyle.semibold,
                        fontStyle.sizeMedium,
                        colorStyle.linkColor,
                        colorStyle.linkBorderColor,
                        buttonStyle.default,
                        styles.loginButtonWidth, ],{textAlign:"center"}}
                    >
                      Or sign in with
                    </Text>
                  </TouchableWithoutFeedback>
</View> */}

{/* <View style={[formStyle.formButton,{paddingTop:20,alignItems:"center"}]}>
                  <TouchableWithoutFeedback
                    onPress={() => {
                      this.validateLoginData();
                    }}
                  >
                    <Text
                      style={[
                        fontStyle.semibold,
                        fontStyle.sizeMedium,
                        colorStyle.linkColor,
                        colorStyle.linkBorderColor,
                        buttonStyle.default,
                        styles.loginButtonWidth,
                      ]}
                    >
                      Login
                    </Text>
                  </TouchableWithoutFeedback>
                </View> */}
                {// from here
                }
                {/* <View 
                style={{flex: 1,
                  flexDirection: 'row',
                  justifyContent: 'space-between',paddingTop:70,}}
                >
                  <View 
                  style={{width:"50%",alignItems: "center", justifyContent: "space-around",
                  backgroundColor: "#FFFFF",height:72
                  }}
                  >
                  <TouchableWithoutFeedback
                    onPress={() => {
                      // this.validateLoginData();
                      this.gotoRegister()
                    }}
                  >
                    <View>
                    <Text
                      style={[
                        fontStyle.regular,
                        fontStyle.sizeRegular,
                        colorStyle.darkgrayColor,
                        colorStyle.linkBorderColor,
                        // buttonStyle.default,
                        // styles.loginButtonWidth,
                      ]}
                    >
                      Don't have an account?
                      
                    </Text>
                    <Text  style={[
                        fontStyle.semibold,
                        fontStyle.sizeRegular,
                        colorStyle.lightBlack,
                        colorStyle.linkBorderColor,
                        // buttonStyle.default,
                        // styles.loginButtonWidth,
                      ]}>SIGN UP</Text>
                    </View>
                  </TouchableWithoutFeedback>
                  
                  </View>
                  <View 
                  style={{width:"50%",alignItems: "center",backgroundColor: "#FC9200",height:72}}
                  >
              
                  <TouchableWithoutFeedback
                    onPress={() => {
                      this.validateLoginData();
                    }}
                  >
                    <Text
                      style={[
                        fontStyle.semibold,
                        fontStyle.sizeMedium,
                        colorStyle.textWhiteColor,
                        colorStyle.linkBorderColor,
                        // buttonStyle.default,
                        // styles.loginButtonWidth,
                      ]}
                    >
                     Signin
                    </Text>
                  </TouchableWithoutFeedback>
                  </View>
                </View> */}

                {//till here
                }

               {/*  <View style={[formStyle.formButton, styles.signupText]}>
                  <TouchableWithoutFeedback 
                   onPress={() => {
                      this.gotoRegister();
                    }}>
                    <Text
                      style={[
                        fontStyle.regular,
                        fontStyle.sizeRegular,
                        colorStyle.darkgrayColor,
                      ]}
                    >
                      new users?
                      <Text style={[colorStyle.linkedColor]}>
                        signup
                      </Text>
                    </Text>
                  </TouchableWithoutFeedback>
                </View> */}
              {/* </View> */}
            </View>
           
           
          
          </KeyboardAwareScrollView>

          <View 
                style={{//flex: 1,
                  alignSelf: "flex-end",

                  flexDirection: 'row',
                  justifyContent: 'space-between',  /* marginTop: "12%" */}}
                >
                  <View 
                  style={{width:"50%",alignItems: "center", justifyContent: "space-around",
                  backgroundColor: "#FFFFF",height:72, borderTopWidth: 0.5, borderTopColor: "gray"
                  }}
                  >
                  <TouchableWithoutFeedback
                    onPress={() => {
                      // this.validateLoginData();
                      this.gotoRegister()
                    }}
                  >
                    <View>
                    <Text
                      style={[
                        fontStyle.regular,
                        fontStyle.sizeRegular,
                        colorStyle.darkgrayColor,
                        colorStyle.linkBorderColor,
                        // buttonStyle.default,
                        // styles.loginButtonWidth,
                      ]}
                    >
                      Don't have an account?
                      
                    </Text>
                    <Text  style={[
                        fontStyle.semibold,
                        fontStyle.sizeRegular,
                        colorStyle.blackColor,
                        colorStyle.linkBorderColor,
                        // buttonStyle.default,
                        // styles.loginButtonWidth,
                      ]}>SIGN UP</Text>
                    </View>
                  </TouchableWithoutFeedback>
                  
                  </View>
                  <View 
                  style={{width:"50%",alignItems: "center", justifyContent: "space-around",
                  backgroundColor: "#FC9200",height:72}}
                  >
              
                  <TouchableWithoutFeedback
                    onPress={() => {
                      this.validateLoginData();
                    }}
                  >
                    <View style = {{flexDirection: "row"}}>
                    <Text
                      style={[
                        fontStyle.semibold,
                        fontStyle.sizeMedium,
                        colorStyle.textWhiteColor,
                        colorStyle.linkBorderColor,
                        {marginRight: 10}
                        // buttonStyle.default,
                        // styles.loginButtonWidth,
                      ]}
                    >
                     SIGN IN
                    </Text>
                    <Icon name = "arrow-right" color = "white" size = {18} />
                    </View>
                  </TouchableWithoutFeedback>
                  </View>
          </View>
         
          <Modal
            animationType="slide"
            transparent={true}
            visible={this.state.appExitmodalVisible}
            onRequestClose={() => {
              this.onCloseModel();
            }}
            // onDismiss={() => this.gotoLogin()}
          >
            <Confirmation
              modalMsg={"Are you sure you want to exit the app?"}
              onCancel={this.onCloseModel}
              onOk={this.onOKClicked}
            />
          </Modal>

          <Modal
            animationType="slide"
            transparent={true}
            visible={this.state.forgotPassword}
            onRequestClose={() => {
              this.onCloseForgot();
            }}
            // onDismiss={() => this.gotoLogin()}
          >
            <Confirmation
            from = {'forgotPassword'}
              modalMsg={"Please enter the registered email Id."}
              onCancel={this.onCloseForgot}
              onOk={this.onForgotPassword}
            />
          </Modal>
          
          {this.state.spinner && <Spinner />}
        </SafeAreaView>
      
    );
  }
}

const styles = StyleSheet.create({
  loadingContainer: {
    backgroundColor: "rgba(0,0,0,0.5)",
    position: "absolute",
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  logoStyle: {
    width: "60%",
    //height:'60%',
    resizeMode: "contain",
    marginLeft: "20%",
    //marginBottom: 40,
    marginTop: 5,
    bottom:70,
    // justifyContent: "flex-start"
  },
  helloStyle: {
    width: '60%',
    //height:'70%',
    // width:100,
    // height:100,
    resizeMode: "contain",
    marginLeft: "18%",
    //marginBottom: "-100%",
    //marginTop: 20,
  },
  forgotLink: {
    marginRight: 20,
    marginLeft: 20,
    marginTop: 5,
    marginBottom: 20,
  },
  forgotLinkText: {
    textAlign: "right",
  },
  loginButtonWidth: {
    width: 100,
  },
  signupText: {
    marginTop: 20,
    marginBottom: 20,
  },
  offlineContainer: {
    backgroundColor: "#b52424",
    height: 50,
  },
  offlineText: { color: "#fff", fontSize: 20, textAlign: "center" },
});
