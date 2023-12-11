import React, { Component } from 'react';
import { View, Image, Dimensions, Text, StatusBar, Platform, AppState } from 'react-native';

import Session from './../config/Session';

import location from '../Location/location';
import CommonHelpers from "../Utils/CommonHelpers";
import { login_check } from '../Rest/userAPI';


export default class Splash extends Component {

  constructor() {
    super();
    this.state = {
      auto_login_valid: null,
    }
  }


   componentDidMount = async () => {
    this.start_timer();

    console.log("App's current state at launch: ", AppState.currentState);
    this.listener = AppState.addEventListener('change', status=>{
      console.log('the status is : ', status);
      if(status === 'active'){
        Platform.OS === 'ios' ?
    location.checkTrackingPermission().then((value)=>{
      if(value){
        console.log("Tracking enabled");
      }
      else{
        location.requestTracking().then((value)=>{
          if(value){
            console.log("Tracking enabled");
          }
        })
      }
    })
    : null
      }
    })

    

    if (await Session.getUserName() == null ? 0 : 1)
      login_check().then(result => {
        console.log("login check", result.message, result.status);
        this.setState({
          auto_login_valid: result.status,
        })

      }).catch(error => {
        console.log(error)
      })
  }

  start_timer = () => {
    this.timer = setTimeout(() => {
      this.navigationLogic()
    }, 5000)
  }

  stop_timer = () => {
    clearTimeout(this.timer)
  }

  componentWillUnmount() {
    this.stop_timer();
    if(this.listener)
    this.listener.remove();
  }
  navigationLogic = async () => {
    const details = await Session.getUserName() == null ? 0 : 1;
    console.log("Test login: ", details);

    console.log('user details from session: ', await Session.getUserDetails());
    console.log('role id: ', await Session.getRoleId());


    let role_id = await Session.getUserDetails();
    role_id = JSON.parse(role_id);
   // console.log("role id parsed here: ", role_id.role_id);

    await location.check().then((value) => {
      this.setState({
        locationPermission: value,
      }, () => {
        if (this.state.locationPermission) {
          location.getGeoLocation().then(async (value) => {
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
              location.getGeoLocation().then(async (values) => {
                await Session.setLocationCoords(values)
                this.setState({
                  locationPermission: value,
                  locationCoords: values,
                }, async () => {

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

    if (this.state.auto_login_valid) {
      if (details && Number(/* role_id.role_id */await Session.getRoleId()) == 5) {
        CommonHelpers.showFlashMsg("You are already Logged in!", "success");
        //this.props.navigation.push('afterlogin',{screen:'Home'});
        this.props.navigation.push('afterlogin',{screen:'bottomtabnavigator'/* 'masterhome' */});
        

      }
      else if (details && Number(role_id.role_id) == 7) {
        CommonHelpers.showFlashMsg("EmployeeLoginSuccess: You are already Logged in!", "success");
        this.props.navigation.push('afterlogin', {screen: 'employeehome'});
       
        /* this.props.navigation.push('afterlogin',{screen:'SRP',params:{
          emplogin: 1
        }}) */

      }

    }
    else {
      if(this.state.auto_login_valid != null && !this.state.auto_login_valid){
       // CommonHelpers.showFlashMsg("Session expired. Please login", "danger");
      }

      /*  Platform.OS === 'ios' ? this.props.navigation.push('Login') :  */this.props.navigation.push('AfterSplash');
     
      //CommonHelpers.showFlashMsg("Welcome back! Login to your account.", "success");
    }

  }; 
  render() {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <StatusBar barStyle="dark-content" backgroundColor="#fff" />
        {/*  <Text>this splash screen</Text> */}
        <Image source={require('./../Assets/images/BRHlogoorange.png')}
          style={{
            resizeMode: "contain",
            width: Dimensions.get("screen").width * 0.3,
            height: Dimensions.get("screen").height * 0.4
          }} />
      </View>
    );
  }
}