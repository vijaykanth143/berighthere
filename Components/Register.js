import React from "react";
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  TouchableWithoutFeedback,
  Image,
  KeyboardAvoidingView,
  Platform,
  InputAccessoryView,
  Keyboard,
  BackHandler,
  Animated,
  Appearance, 
  TextInput
} from "react-native";

import formStyle from "./../Styles/control";
import fontStyle from "./../Styles/font";
import colorStyle from "./../Styles/color";
import buttonStyle from "./../Styles/button";
import boxStyle from "./../Styles/box";
import { Header } from "react-native-elements";
// import { setI18nConfig, translate } from "./../../Config/Language";

//import { Icon } from "react-native-elements";
import Icon from 'react-native-vector-icons/FontAwesome';
import CommonHelpers from "./../Utils/CommonHelpers";
import { registerAPI } from "./../Rest/userAPI";
// import CountryPicker from "react-native-country-picker-modal";
// import Mixpanel from "react-native-mixpanel";
import Spinner from "./../UI/Spinner";
import Session from "./../config/Session";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import color from "./../Styles/color";
import renderItem from '../Styles/renderItem';
import Geocoder from 'react-native-geocoding';

Geocoder.init("AIzaSyDgQlUgbgkWodIedIBpYIE8dMZJ7jjbbfA", {language : "en"});

export default class Register extends React.Component {
  constructor(props) {
    super(props);
    this.firstnameRef = React.createRef();
    this.lastnameRef = React.createRef();
    this.emailRef = React.createRef();
    this.phonenumberRef = React.createRef();
    this.passwordRef = React.createRef();
    this.confirmPwdRef = React.createRef();
    this.compNameRef = React.createRef();
    // setI18nConfig();
    this.state = {
      firstname: "",
      lastname: "",
      compName: '',
      email: "",
      phonenumber: "",
      password: "",
      confirmPassword: "",
      showHidePwd: false,
      pwdEye: "eye-slash",
      emailError: false,
      compNameError: false,
      passwordError: false,
      confirmPassworderror: false,
      firstnameError: false,
      lastnameError: false,
      phonenumberError: false,
      spinner: false,
      isPrivacy: true,
      countryCode: "IN",
      countryCallingCide: "91",
      countryPickerVisible: false,
      latitude: null, 
      longitude: null, 
      country : null,
      state: null, 
      city: null,
    };
  }

  componentDidMount=async() =>{
   
    this.backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      this.backAction
    );

    console.log(await Session.getLocationCoords());
    let coords =JSON.parse(await Session.getLocationCoords());
     (coords != 'null' || coords != null || coords != undefined) ?  
     this.setState({
      latitude: coords.coords.latitude,
      longitude: coords.coords.longitude, 
    }, ()=>{
      this.getCountry();
      this.getState()
    }): null
  } 

  // App Exit popup
  backAction = () => {
    this.props.navigation.goBack();
   
    return true;
  };

 

  updateInputVal = (val, prop, errorKey) => {
    const state = this.state;
    state[prop] = val;
    state[errorKey] = false;
    this.setState(state);
  };

//   showOrHidePassword = () => {
//     if (this.state.showHidePwd) {
//       this.setState({ showHidePwd: false });
//       this.setState({ pwdEye: "eye-slash" });
//     } else {
//       this.setState({ showHidePwd: true });
//       this.setState({ pwdEye: "eye" });
//     }
//   };

  closeKeyboard = () => {
    Keyboard.dismiss();
  };

  selectPrivacy = () => {
    console.warn(this.state.isPrivacy);
    this.setState({
      isPrivacy: this.state.isPrivacy ? false : true,
    });
  };

  onSubmit = async () => {
    this.closeKeyboard();
    if (this.validateFields()) {
      if (this.state.isPrivacy) {
        var params = 
        { 
            "name": this.state.firstname,
            "email": this.state.email.toLowerCase(),
            "password": this.state.password,
            "mobile_no": this.state.phonenumber.split('-')[0] + this.state.phonenumber.split('-')[1],
            "status" : 1,
            "company_name": this.state.compName,       
        };
        // console.log("the value of emails",params)
        this.setState({
          spinner: true,
        });
        let that = this;
        registerAPI(params).then((result) => {
            console.log("Result",result.status)
          this.setState({
            spinner: false,
          });

          if (result.status == true) {
           

            CommonHelpers.showFlashMsg(result.message, "success");
            this.props.navigation.push('Login');

           
            this.resetFormElements();
          } else {
            if (result.message == "Network Error") {
              CommonHelpers.showFlashMsg(
                "No Network Connection",
                "danger"
              );
            } else {
              CommonHelpers.showFlashMsg(result.message, "danger");
              var str=result.message
            //   if(str.includes(translate("Number")))
            //   {           
            //     this.setState({
            //       phonenumberError: true,
            //     });
            //   } else {
            //   this.setState({
            //     emailError: true,
            //   });
            //  }         
            }
          }
        });
      } else {
        CommonHelpers.showFlashMsg(
          
            "Accept our terms and condition before creating the account"
          ,
          "danger"
        );
      }
    }
  };

  resetFormElements = () => {
    /* this.firstnameRef.setValue("");
    this.lastnameRef.setValue("");
    this.emailRef.setValue("");
    this.phonenumberRef.setValue(""), this.passwordRef.setValue(""); */
    this.setState({
      firstname: "",
      lastname: "",
      email: "",
      phonenumber: "",
      password: "",
    });
  };

  validateFields() {
    // First name validations
    if (this.state.firstname.trim().length == 0) {
      CommonHelpers.showFlashMsg("first name is required", "danger");
      this.setState({
        firstnameError: true,
      });
      return false;
    }

    if (this.state.firstname.trim().length < 3) {
      CommonHelpers.showFlashMsg(
        "first name must be 3 characters or more",
        "danger"
      );
      this.setState({
        firstnameError: true,
      });
      return false;
    }

    if (this.state.firstname.trim().length > 20) {
      CommonHelpers.showFlashMsg(
        "first name can't exceed 20 characters",
        "danger"
      );
      this.setState({
        firstnameError: true,
      });
      return false;
    }

    if (!CommonHelpers.validateName(this.state.firstname)) {
      this.setState({
        firstnameError: true,
      });
      CommonHelpers.showFlashMsg(
        "firstname only allow alphabets.",
        "danger"
      );
      return false;
    }

    // last name validations
    if (this.state.lastname.trim().length == 0) {
      CommonHelpers.showFlashMsg("last name is required", "danger");
      this.setState({
        lastnameError: true,
      });
      return false;
    }

    if (this.state.lastname.trim().length < 1) {
      CommonHelpers.showFlashMsg(
        "last name must be 1 characters or more",
        "danger"
      );
      this.setState({
        lastnameError: true,
      });
      return false;
    }

    if (this.state.lastname.trim().length > 20) {
      CommonHelpers.showFlashMsg(
        "last name can't exceed 20 characters",
        "danger"
      );
      this.setState({
        lastnameError: true,
      });
      return false;
    }

    if (!CommonHelpers.validateName(this.state.lastname)) {
      this.setState({
        lastnameError: true,
      });
      CommonHelpers.showFlashMsg(
        "Please enter the full lastname.",
        "danger"
      );
      return false;
    }

    //email validation

    if (this.state.email.trim().length == 0) {
      CommonHelpers.showFlashMsg("enterEmail", "danger");
      this.setState({
        emailError: true,
      });
      return false;
    }

    if (!CommonHelpers.validateEmail(this.state.email)) {
      this.setState({
        emailError: true,
      });
      CommonHelpers.showFlashMsg("Invalid Email Id", "danger");
      return false;
    }

    // phone number validation
    if (this.state.phonenumber.trim().length == 0) {
      CommonHelpers.showFlashMsg(
        "Phone number is required.",
        "danger"
      );
      this.setState({
        phonenumberError: true,
      });
      return false;
    }

    if (!CommonHelpers.validatePhoneNumber(this.state.phonenumber)) {
      CommonHelpers.showFlashMsg(
        "Oops, please enter a 10-digit phone number",
        "danger"
      );
      this.setState({
        phonenumberError: true,
      });
      return false;
    }

    // Passwprd validations
    if (this.state.password.trim().length == 0) {
      CommonHelpers.showFlashMsg("Password is required", "danger");
      this.setState({
        passwordError: true,
      });
      return false;
    }

    if (this.state.password.trim().length < 3) {
      CommonHelpers.showFlashMsg("Password must be 6 characters or more",
        "danger"
      );
      this.setState({
        passwordError: true,
      });
      return false;
    }

    if (this.state.password.trim().length > 20) {
      CommonHelpers.showFlashMsg(
        "Password can't exceed 20 characters",
        "danger"
      );
      this.setState({
        passwordError: true,
      });
      return false;
    }

    if (!CommonHelpers.validatePassword(this.state.password)) {
      CommonHelpers.showFlashMsg(
        "Password need to have a lower case, upper case, number and a special character.",
        "danger"
      );
      this.setState({
        passwordError: true,
      });
      return false;
    }


    //confirm password validations
    if (this.state.confirmPassword.trim().length == 0) {
      CommonHelpers.showFlashMsg("Password is required", "danger");
      this.setState({
        confirmPassworderror: true,
      });
      return false;
    }

    if (this.state.confirmPassword.trim().length < 3) {
      CommonHelpers.showFlashMsg("Password must be 6 characters or more",
        "danger"
      );
      this.setState({
        confirmPassworderror: true,
      });
      return false;
    }

    if (this.state.confirmPassword.trim().length > 20) {
      CommonHelpers.showFlashMsg(
        "Password can't exceed 20 characters",
        "danger"
      );
      this.setState({
        confirmPassworderror: true,
      });
      return false;
    }

    if (!CommonHelpers.validatePassword(this.state.confirmPassword)) {
      CommonHelpers.showFlashMsg(
        "Password need to have a lower case, upper case, number and a special character.",
        "danger"
      );
      this.setState({
        confirmPassworderror: true,
      });
      return false;
    }

    if(!(this.state.confirmPassword === this.state.password)){
      CommonHelpers.showFlashMsg(
        "Passwords don't match.",
        "danger"
      );
      this.setState({
        confirmPassworderror: true,
        passwordError: true,
      });
      return false;

    }





    return true;
  }

  onPhoneTextChange = (phoneVal) => {
    console.warn("testing " + phoneVal.length);

    var phone = phoneVal.replace(/[^\d]/g, "");
    console.log("phone number1 is ",phone)
    if (phone.length > 10) {
        phone = phone.substring(0,10)
    } 

    if(phone.length == 0){
      phone = phone;
    }
    else if (phone.length< 4){
      phone = phone;
      console.log(phone);
    }else if(phone.length == 4){
      phone = phone.substring(0,4)+ '-'
    }
    else {
      phone = phone.substring(0,4)+ '-' + phone.substring(4, 10)
    }


    /* if(phone.length == 0){
      phone = phone;
    } else if(phone.length < 4){
      phone = '('+phone;
    } else if(phone.length < 7){
      phone = '('+phone.substring(0,3)+') '+phone.substring(3,6);
    } else{
      phone = '('+phone.substring(0,3)+') '+phone.substring(3,6)+'-'+phone.substring(6,10);
    }
 */
   
    this.setState({
      phonenumber: phone,
      phonenumberError: false,
    },()=>{console.log("final phone number: ", this.state.phonenumber)});
    //this.phonenumberRef.setValue(phone);
  };

  getCountry=()=>{
    let country = 'hi';
    console.log(this.state.latitude, this.state.longitude)
    Geocoder.from({
      longitude: "77.5863",
        latitude: "14.6777",
      /* longitude: "77.1025",
        latitude: "28.7041", */
     /*  latitude: this.state.latitude, 
      longitude: this.state.longitude */
    })
		.then(json => {
      console.log(JSON.stringify(json))
		var addressComponent = json.results[0].address_components;
			console.log('address conponent: ',addressComponent);
      addressComponent.forEach((item, index)=>{
        if(item.types[0] == 'country'){
          console.log(item.long_name)
          this.setState({
            country: item.long_name
          })
        }
      })
		})
		.catch(error => console.warn(error));

return country;
  }

  getState=()=>{
    let country = 'hi';
    console.log(this.state.latitude, this.state.longitude)
    Geocoder.from({
      longitude: "77.5863",
      latitude: "14.6777",
     /*  latitude: this.state.latitude, 
      longitude: this.state.longitude */
    })
		.then(json => {
      console.log(JSON.stringify(json))
		var addressComponent = json.results[0].address_components;
			console.log(addressComponent);
      addressComponent.forEach((item, index)=>{
        if(item.types[0] == "administrative_area_level_1"){
          console.log(item.long_name)
          this.setState({
            state: item.long_name
          })
        }
      })
		})
		.catch(error => console.warn(error));

return country;
  }

  render() {
    return (
      <>
        {/* <StatusBar barStyle="dark-content" /> */}
        <SafeAreaView style={styles.mainContainer}>
        <KeyboardAwareScrollView keyboardShouldPersistTaps="always"> 
        <View style = {{flex: 1}}>
                <View style = {{flex: 2, /* backgroundColor: "pink", */ alignItems: "center", justifyContent: "space-around"}}>
                <Image
                  style={[ { width: "60%",
                  height:100,
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
                <View style = {{flex: 5, /* backgroundColor: "yellow", */ justifyContent: "center"}}>
                <Image
                  style={[ { width: "100%",
                 height:280,
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
          <View style = {[boxStyle.centerBox]}
           /*  contentContainerStyle={[boxStyle.scrollViewCenter, { flexDirection: "column" ,justifyContent: 'space-between' , }, ]}
            keyboardShouldPersistTaps="always" */
          >
             
            {/* <KeyboardAwareScrollView keyboardShouldPersistTaps="always"> */}
              <View style={formStyle.formMargin}>
                <Text
                  style={[
                    fontStyle.bold,
                    fontStyle.sizeDoubleLarge,
                    colorStyle.blackColor,
                  ]}
                >
                  Welcome!
                </Text>
                <Text style={[fontStyle.regular, fontStyle.sizeRegular, colorStyle.blackColor,{paddingTop:10,paddingBottom:10}]}> 
                    Sign up now
                </Text>
              </View>
              <View style={formStyle.formMargin}>
                <TextInput
                  placeholder={"First Name *"}
                  placeholderTextColor = {color.darkgrayColor.color}
                  selectionColor={color.myOrangeColor.color}
                  style = {[ renderItem.inputBox]}
                  ref={(input) => {
                    this.firstnameRef = input;
                  }}
                  value={this.state.firstname}
                  returnKeyType={"next"}
                  onSubmitEditing={() => {
                    this.lastnameRef.focus();
                  }}
                  onChangeText={(val) =>
                    this.updateInputVal(val, "firstname", "firstnameError")
                  }
                 
                
                />
              </View>
              <View style={formStyle.formMargin}>
                <TextInput
                  placeholder={"Last Name *"}
                  placeholderTextColor = {color.darkgrayColor.color}
                  selectionColor={color.myOrangeColor.color}
                  style = {[ renderItem.inputBox]}
                  ref={(input) => {
                    this.lastnameRef = input;
                  }}
                  value={this.state.lastname}
                  onChangeText={(val) =>
                    this.updateInputVal(val, "lastname", "lastnameError")
                  }
                  returnKeyType={"next"}
                  onSubmitEditing={() => {
                    this.emailRef.focus();
                  }}
                 
                />
              </View>

              <View style={formStyle.formMargin}>
                <TextInput
                  placeholder={"Company Name (Optional)"}
                  placeholderTextColor = {color.darkgrayColor.color}
                  selectionColor={color.myOrangeColor.color}
                  style = {[ renderItem.inputBox]}
                  ref={(input) => {
                    this.compNameRef = input;
                  }}
                  value={this.state.compName}
                  onChangeText={(val) =>
                    this.updateInputVal(val, "compName", "compNameError")
                  }
                  returnKeyType={"next"}
                  onSubmitEditing={() => {
                    this.compNameRef.focus();
                  }}
                 
                />
              </View>

              {/* <View style={[boxStyle.horizontalBox, formStyle.formMargin]}>
                <Text>Country</Text>
                <Text>{this.state.country}</Text>
              </View>

              <View style={[boxStyle.horizontalBox, formStyle.formMargin]}>
                <Text>
                  State
                </Text>
                <Text>{this.state.state}</Text>
              </View> */}

              <View style={formStyle.formMargin}>
                <TextInput
                  placeholder={"Email Id *"}
                  placeholderTextColor = {color.darkgrayColor.color}
                  selectionColor={color.myOrangeColor.color}
                  style = {[ renderItem.inputBox]}
                  keyboardType="email-address"
                  ref={(input) => {
                    this.emailRef = input;
                  }}
                  value={this.state.email}
                  onChangeText={(val) =>
                    this.updateInputVal(val, "email", "emailError")
                  }
                  returnKeyType={"next"}
                  onSubmitEditing={() => {
                    this.phonenumberRef.focus();
                  }}
                  
                />
              </View>
             

              <View style={formStyle.formMargin}>
                <View>
                  <TextInput
                    placeholder={"Mobile Number *"}
                    placeholderTextColor = {color.darkgrayColor.color}
                  selectionColor={color.myOrangeColor.color}
                  style = {[ renderItem.inputBox]}
                    keyboardType="phone-pad"
                    ref={(input) => {
                      this.phonenumberRef = input;
                    }}
                    returnKeyType={"next"}
                    onSubmitEditing={() => {
                      this.passwordRef.focus();
                    }}
                    value={this.state.phonenumber}
                    onChangeText={(val) => this.onPhoneTextChange(val)}
                    
                    inputAccessoryViewID={"phone_number"}
                  />
                </View>
                {/* <TouchableWithoutFeedback
                  onPress={() => {
                    console.log(this.state.countryPickerVisible);
                    this.setState({ countryPickerVisible: true });
                  }}
                >
                  <View
                    style={[
                      styles.flagStyle,
                      // colorStyle.inputBackground,
                      colorStyle.borderBottomColor,
                    ]}
                  >
                    <CountryPicker
                      withAlphaFilter
                      withCallingCode
                      visible={this.state.countryPickerVisible}
                      // withModal
                      countryCode={this.state.countryCode}
                      onSelect={(country) => {
                        console.log("country", country);
                        this.setState({ countryCode: country.cca2 });
                        this.setState({
                          countryCallingCide: country.callingCode[0],
                          countryPickerVisible: false,
                        });
                      }}
                      // containerButtonStyle={styles.flagStyle}
                    />
                  </View>
                </TouchableWithoutFeedback> */}
              </View>

              <View style={formStyle.formMargin}>
                <TextInput
                  placeholder={"Password"}
                  blurOnSubmit={false}
   onSubmitEditing={()=> Keyboard.dismiss()}
                  placeholderTextColor = {color.darkgrayColor.color}
                  selectionColor={color.myOrangeColor.color}
                  style = {[ renderItem.inputBox]}
                  value={this.state.password}
                 // blurOnSubmit={false}
                  autoCapitalize="none"
                //  onSubmitEditing={() => Keyboard.dismiss()}
                  textContentType="oneTimeCode"
                  secureTextEntry={true}
                  keyboardType="default"
                //   title={"password_title"}
                  returnKeyType={"done"}
                  ref={(input) => {
                    this.passwordRef = input;
                  }}
                  onChangeText={(val) =>
                    this.setState({
                      password: val,
                      passwordError: false
                    })
                    //this.updateInputVal(val, "password", "passwordError")
                  }
                 // secureTextEntry={true} 
                 
                  
                />

                {/* <Icon
                  name={this.state.pwdEye}
                  containerStyle={formStyle.formIcon}
                  type="font-awesome"
                  color="#999"
                  onPress={() => {
                    this.showOrHidePassword();
                  }}
                /> */}
              </View>

              <View style={[formStyle.formMargin, {marginBottom : 100,}]}>
                <TextInput
                  placeholder={"Confirm Password *"}
                  placeholderTextColor = {color.darkgrayColor.color}
                  selectionColor={color.myOrangeColor.color}
                  style = {[ renderItem.inputBox]}
                  value={this.state.confirmPassword}
                  blurOnSubmit={false}
                  autoCapitalize="none"
                  onSubmitEditing={() => Keyboard.dismiss()}
                  textContentType="oneTimeCode"
                 //textContentType={'password'}
                  keyboardType="default"
                  //secureTextEntry= {true}
                //   title={"password_title"}
                  returnKeyType={"done"}
                  ref={(input) => {
                    this.confirmPwdRef = input;
                  }}
                  onChangeText={(val) =>
                    this.setState({
                      confirmPassword: val,
                      confirmPassworderror: false,
                      //passwordError: false
                    })
                    //this.updateInputVal(val, "confirmPassword", "passwordError")
                  }
                  secureTextEntry={!this.state.showHidePwd}
                 
                  
                />

              {/*   <Icon
                  name={this.state.pwdEye}
                  containerStyle={formStyle.formIcon}
                  type="font-awesome"
                  color="#999"
                  onPress={() => {
                    this.showOrHidePassword();
                  }}
                /> */}
              </View>
            {/* </KeyboardAwareScrollView> */}
          </View>
          </KeyboardAwareScrollView>


          <View 
                style={{flex: 1,
                  flexDirection: 'row',
                  justifyContent: 'space-between'/* ,paddingTop:100, */, position: "absolute", bottom: 0}}
                >
                  <View style = {{flex: 1, alignItems: "center", justifyContent: "space-around", borderTopWidth: 0.5, borderTopColor: "gray", backgroundColor: "white"}}>
                  <TouchableWithoutFeedback
                  style={{width:"50%",/* alignItems: "center", */
                  backgroundColor: "#FFFFF",height:72, 
                  
                  }}
                    onPress={() => {
                      this.props.navigation.push('Login')
                       
                    }}
                  >
                    <View>
                    <Text
                      style={[
                        fontStyle.regular,
                        fontStyle.sizeRegular,
                        colorStyle.darkgrayColor,
                        colorStyle.linkBorderColor,
                        
                       /*  {textAlign: "center"} */
                        // buttonStyle.default,
                        // styles.loginButtonWidth,
                      ]}
                    >
                      Have an account?
                      
                    </Text>
                    <Text style={[
                        fontStyle.semibold,
                        fontStyle.sizeRegular,
                        colorStyle.darkgrayColor,
                        colorStyle.linkBorderColor,
                       /*  {textAlign: "center"} */
                        // buttonStyle.default,
                        // styles.loginButtonWidth,
                      ]}>SIGN IN</Text>
                    </View>
                  </TouchableWithoutFeedback>
                  
                  </View>
                  <View 
                  style={{width:"50%",alignItems: "center",backgroundColor: "#FC9200",height:72, justifyContent:"center"}}
                  >
              
                  <TouchableWithoutFeedback
                    onPress={() => {
                      //this.validateFields;
                      this.onSubmit();
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
                     CONTINUE
                    </Text>
                    <Icon name = "arrow-right" color= "white" size = {18}/>
                    </View>
                  </TouchableWithoutFeedback>
                  </View>
                </View>
        
          {this.state.spinner && <Spinner />}
        </SafeAreaView>
      </>
    );
  }
}

const styles = StyleSheet.create({
  mainContainer: { position: "relative", flex: 1 },
  backArrow: {
    width: 24,
    resizeMode: "contain",
    position: "absolute",
    left: 15,
    top: 15,
    zIndex: 99,
  },
  logoStyle: {
    width: "60%",
    height: 100,
    resizeMode: "contain",
    marginLeft: "20%",
    marginBottom: 40,
    marginTop: 20,
  },
  inner: { padding: 24, flex: 1, justifyContent: "space-around" },
  accessoryBtn: { textAlign: "right", padding: 10, margin: 10 },
  accessoryBtnView: {
    justifyContent: "flex-end",
    alignContent: "flex-end",
    alignItems: "flex-end",
  },
  checkboxContainer: { flexDirection: "row", minHeight: 50, marginBottom: 30 },
  checkbox: { alignSelf: "center" },
  privacylabel: { marginTop: 8, marginLeft: 15 },
  squareIcon: { position: "relative", top: -3 },

  countryFlag: {
    position: "absolute",
    right: 0,
    width: "15%",
    height: "90%",
    borderBottomWidth: 1,
  },
  flagStyle: {
    alignContent: "center",
    alignSelf: "center",
    textAlign: "center",
    alignItems: "center",
    marginTop: 20,
    position: "absolute",
    right: 0,
  },
  flexStyle: { flexDirection: "row", flex: 1, width: "100%" },
  loginButtonWidth:{marginBottom:10}
});
