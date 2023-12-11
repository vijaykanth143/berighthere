import Login from "./../Components/Login";

import Register from "./../Components/Register";


import Splash from '../Components/Splash';
import AfterSplash from "../Components/AfterSplash";

import React, { Component } from "react";
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Auth = createNativeStackNavigator();


class AuthNav extends Component {
    render(){
        return (
            <Auth.Navigator
             initialRouteName='Splash' screenOptions={{
                headerShown: false,
                gestureEnabled: false
            }}>
                <Auth.Screen name="Splash" component={Splash} />
                <Auth.Screen name='AfterSplash' component={AfterSplash} />
                <Auth.Screen name='Login' component={Login} />
                <Auth.Screen name="Register" component={Register} />
               
            </Auth.Navigator>
    );

    }
   
}
export default AuthNav;