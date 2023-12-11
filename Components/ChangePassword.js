import React, {Component} from 'react';
import {View, Text, TouchableOpacity, StatusBar, BackHandler, TextInput} from 'react-native';
import font from '../Styles/font';
import box from '../Styles/box';
import color from '../Styles/color';
import renderItem from '../Styles/renderItem';
import LogoHeader from './ReusableComponents/LogoHeader';
import button from '../Styles/button';
import CommonHelpers from '../Utils/CommonHelpers';
import { changePasswordAPI } from '../Rest/userAPI';
import Session from '../config/Session';
import Drawer from "react-native-drawer";
import Sidemenu from "../Navigation/Sidemenu";


export default class ChangePassword extends Component{

    constructor(){
        super();
        this.state = {
            currentPassword: '',
            currentError: false,
            newPassword: '',
            newError: false,

            confirmPassword: '',
            confirmError: false,
        }
    }

    validate = ()=>{
        if(this.state.currentPassword == ''){
            this.setState({
                currentError: true,
            });
            CommonHelpers.showFlashMsg("Enter current password.","danger");
            return false;
        }
        else if(this.state.newPassword == ''){
            this.setState({
                newError: true,
            });
            CommonHelpers.showFlashMsg("Enter new password.","danger");
            return false;
        }
        else if (this.state.confirmPassword == ''){
            this.setState({
                confirmError: true,
            });
            CommonHelpers.showFlashMsg("Re-enter new password.","danger");
            return false;
        }
        else if(this.state.newPassword.trim().localeCompare(this.state.confirmPassword.trim())){
            
            CommonHelpers.showFlashMsg("Password do not match.", "danger");
            this.setState({
                newError: true,
                confirmError: true,
            });
            return false;

        }else if(!CommonHelpers.validatePassword(this.state.newPassword)){ 
            this.setState({
                newError: true,
                confirmError: true,
            });
            CommonHelpers.showFlashMsg("Password should contain Upper-case, Lower-case letters, numbers, special character and should be 8 letters atleast.","danger");
            return false;
            
        }

        //console.log(this.state.newPassword.trim().localeCompare(this.state.confirmPassword.trim()))

        return true;
    }

    handleChangePassword =async ()=>{

        const params = {
            "user_id": await Session.getUserId(),
            "old_password": this.state.currentPassword,
            "password": this.state.newPassword,
        }

        changePasswordAPI(params).then(async(result)=>{

            if(result.status){
                CommonHelpers.showFlashMsg(result.message, "success");
                await Session.setUserDetails({});
                await Session.setUserToken('');
                //console.log(await Session.getUserDetails());
                await Session.setUserId('');
                await Session.setUserName('');
                this.props.navigation.push('auth',{screen:'Login'});
               
            }
            else{
                if(result.message == "Request failed with status code 404")
                CommonHelpers.showFlashMsg("Old password doesn't match", "danger");
            }

        }).catch(error=>{
            console.log(error)
        })
    }

    goBack=()=>{
       this.props.navigation.goBack();
        return true;
    }
    componentWillUnmount=()=>{
        this.BackHandler.remove();
    }
    componentDidMount=()=>{
        this.BackHandler = BackHandler.addEventListener("hardwareBackPress", this.goBack)
    }
    closeControlPanel = () => {
        this._drawer.close()
      };
      openControlPanel = () => {
        this._drawer.open()
      };
    render(){
        return(
            <Drawer
            ref={(ref) => this._drawer = ref}
        type="overlay"
        content={<Sidemenu navigation = {this.props.navigation} close = {()=>this.closeControlPanel()} />}
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
            <View style = {[/* renderItem.topViewMargin */{ height: "70%"} ]} >
                <LogoHeader /* title = {"Change Password"}  */
                qrvisible ={ false} navigation = {this.props.navigation}
                onBarsPress = {()=>{this.openControlPanel()}}
                />

            <View style = {[box.centerBox, { alignSelf: "flex-start", width: "100%", justifyContent:'space-around'}  ]}>
                {/* <Text style = {[font.regular, font.sizeRegular, color.blackColor, {textAlign: "left"}]}>Current Password *</Text> */}

                <TextInput
                    placeholder={"Enter Current Password"}
                    placeholderTextColor = {color.darkgrayColor.color}
                    keyboardType= "default"
                    secureTextEntry = {true}
                   style = {[renderItem.inputBox]}
                   selectionColor = {color.myOrangeColor.color}
                    value={this.state.currentPassword}
                    returnKeyType={"next"}
                   
                    blurOnSubmit={true}
                    onChangeText={(val) => {this.setState({
                        currentPassword: val,
                    })}}
                   
                  />

<TextInput
                    placeholder={"Enter New Password"}
                    placeholderTextColor = {color.darkgrayColor.color}
                    keyboardType= "default"
                    secureTextEntry = {true}
                   style = {[renderItem.inputBox]}
                   selectionColor = {color.myOrangeColor.color}
                   
                  
                   
                    value={this.state.newPassword}
                    returnKeyType={"next"}
                   
                    blurOnSubmit={true}
                    onChangeText={(val) => {this.setState({
                        newPassword: val,
                    })}}
                   
                  />

<TextInput
                    placeholder={"Confirm New Password"}
                    placeholderTextColor = {color.darkgrayColor.color}
                    keyboardType= "default"
                    secureTextEntry = {true}
                   style = {[renderItem.inputBox]}
                   selectionColor = {color.myOrangeColor.color}
                   
                   
                    value={this.state.confirmPassword}
                    returnKeyType={"next"}
                   
                    blurOnSubmit={true}
                    onChangeText={(val) => {this.setState({
                       confirmPassword: val,
                    })}}
                    tintColor={this.state.confirmError ? "#ff0000" : "orange"}
                    baseColor={this.state.confirmError ? "#ff0000" : "#999999"}
                    textColor="#999999"
                    inputContainerStyle={[color.inputBackground, {backgroundColor: "white"}]}
                    labelTextStyle={font.regular}
                    titleTextStyle={font.semibold}
                    affixTextStyle={font.semibold}
                    contentInset={{
                      top: 12,
                      label: 10,
                      input: 12,
                    }}
                  />

                  <TouchableOpacity onPress = {()=>{
                      if(this.validate()){

                      this.handleChangePassword();

                      }
                  }}>
                      <Text style= {[button.defaultRadius, font.regular, font.sizeRegular, color.myOrangeColor, color.orangeBorder]}>Change Password</Text>
                  </TouchableOpacity>


            </View>
           
            </View>
            </Drawer>
        );
    }
}

