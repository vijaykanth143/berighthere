import React, {Component} from 'react';
import { Text, View,  } from 'react-native';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import color from '../Styles/color';
import CommonHelpers from '../Utils/CommonHelpers';
import { login_check } from '../Rest/userAPI';
import Session from '../config/Session';
import Wishlist from './Wishlist';
import MasterHome from './MasterHome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import UserProfile from './UserProfile';

export default class BottomTabNavigator extends Component {
    componentDidMount=async ()=>{
      let userdetails  = await Session.getUserDetails();
      userdetails = JSON.parse(userdetails);

  
    login_check().then(async(result) => {
      console.log("login check", result.message, result.status);
     if(!result.status){
      await Session.setUserDetails({});
      await Session.setUserToken('');
      
      await Session.setUserId('');
      await Session.setUserName('');
      this.props.navigation.push('auth',{screen: 'Login'})
    
       CommonHelpers.showFlashMsg("Session Expired. Please login again.", "danger");
      
     }

    }).catch(error => {
      console.log(error)
    })

  }

    render(){
        const BottomTab = createMaterialBottomTabNavigator();
        return(
        
            
                
    <View style= {{height: '100%'}} >
      <BottomTab.Navigator initialRouteName = {'Home'}   
      shifting={true}
      labeled={false}
      barStyle={{ backgroundColor:color.darkgrayColor.color, height: 60, marginBottom: 0 }}
       screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused
              ? 'ios-home'
              : 'ios-home-outline';
              size = 25//focused ?25: 20;
              color = '#fff'
          } else if (route.name === 'Wishlist') {
            iconName = focused ? 'ios-heart' : 'ios-heart-outline';
            size = 25//focused ?25: 20;
            color = '#fff'
          }
          else if(route.name === 'UserProfile'){
            iconName = focused ? 'ios-person-sharp' : 'ios-person-outline';
            size = 25//focused ?25: 20;
            color = '#fff'
          }

          // You can return any component that you like here!
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        /* tabBarStyle: { height: 10 }, */
        
        
      })
    
    }
      
    

>
   
        <BottomTab.Screen name = 'Home' component={MasterHome} options = {{
            
        }}/>
      
        <BottomTab.Screen name = "Wishlist" component = {Wishlist}/>
        {<BottomTab.Screen name = "UserProfile" component = {UserProfile}/>}
       
        
        
        
      </BottomTab.Navigator>
    </View>
   /*  </Drawer> */
    
        );
    }
}