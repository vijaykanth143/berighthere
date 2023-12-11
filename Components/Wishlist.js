import React, {Component} from 'react';
import { Text, View, BackHandler, StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import UpcomingBookings from './UpcomingBookings';
import PreviousBookings from './PreviousBookings';
import CurrentBookings from './CurrentBookings';
import Header from './BookingComponents/Header';
import color from '../Styles/color';

import font from '../Styles/font';
import LogoHeader from './ReusableComponents/LogoHeader';
import CommonHelpers from '../Utils/CommonHelpers';
import { login_check , getWishlist} from '../Rest/userAPI';
import route from '../Route/route';
import Session from '../config/Session';
import Drawer from "react-native-drawer";
import Sidemenu from "../Navigation/Sidemenu";
import MeetingWishlist from './MeetingSpaces/MeetingWishlist';
import { GET_WISHLIST } from '../config/RestAPI';
import WorkspaceWishlist from './WorkspaceWishlist';


export default class Wishlist extends Component {

  
    componentDidMount=async ()=>{
      let userdetails  = await Session.getUserDetails();
      userdetails = JSON.parse(userdetails);

        // add back listener
  this.backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
       
          ()=>{
           // this.props.route.params.payment ? this.props.navigation.push('home'):
            this.props.navigation.goBack();
            return true; 
          }
    );
    login_check().then(async(result) => {
      console.log("login check", result.message, result.status);
     if(!result.status){
      await Session.setUserDetails({});
      await Session.setUserToken('');
      //console.log(await Session.getUserDetails());
      await Session.setUserId('');
      await Session.setUserName('');
      this.props.navigation.push('auth',{screen: 'Login'})
     /*  Navigation.setRoot({
        root: route.beforeLogin,
      }) */
       CommonHelpers.showFlashMsg("Session Expired. Please login again.", "danger");
      
     }

    }).catch(error => {
      console.log(error)
    })

   

  }

  componentWillUnmount(){
    if(this.backHandler)
    this.backHandler.remove();
  }

  closeControlPanel = () => {
    this._drawer.close()
  };
  openControlPanel = () => {
    this._drawer.open()
  };

 
    
  
    render(){
        const Tab = createMaterialTopTabNavigator();
        return(
          <Drawer
          ref={(ref) => this._drawer = ref}
      type="overlay"
      content={<Sidemenu navigation = {this.props.navigation} />}
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

            
                
    <View style= {{height: '100%'}} >
       {/*  <StatusBar backgroundColor={'white'} barStyle={'dark-content'} /> */}
        <LogoHeader 
        from = {'meetingsrp'}
        navigation={this.props.navigation}
            title = "Favorite"  topTab = {true}
           // qrvisible = {true} 
            //qrpress = {()=>{this.openScanPage()}} 
            onBarsPress={()=>{
              this.openControlPanel()}}
               />
       {/*  <Header name={'angle-left'} 
                    onPress={() => { this.goBack() }}
                    style={[color.myOrangeColor, ]}
                    title={"Manage Bookings"} /> */}
    
      <Tab.Navigator initialRouteName = {"Meeting Space"} 
screenOptions={{
  tabBarLabelStyle: { fontSize: font.sizeRegular.fontSize, fontFamily: font.semibold.fontFamily ,
  textTransform:"capitalize"},
  //tabBarItemStyle: { width: 100 },
  //tabBarStyle: { backgroundColor: 'orange' },
  tabBarIndicatorStyle :{
    backgroundColor:'orange'
},
tabBarInactiveTintColor: color.grayColor.color,
tabBarActiveTintColor: color.myOrangeColor.color,

}}
backBehavior= 'none'
>
      
        <Tab.Screen name = "Meeting Space" component = {MeetingWishlist} initialParams/>
       { <Tab.Screen name="Workspace" component={WorkspaceWishlist} />}
        
        
      </Tab.Navigator>
    </View>
    </Drawer>
    
        );
    }
}