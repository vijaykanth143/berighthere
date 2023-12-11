import React, { Component } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AuthNav from './Navigation/AuthNav';
import StackNav from './Navigation/StackNav';
import BottomTabNavigator from './Components/BottomTabNavigator';
const Stack = createNativeStackNavigator();

const MyTheme = {
  dark: false,
  colors: {
    //primary: 'rgb(255, 45, 85)',
    background: 'rgb(255,255,252)',
    //card: 'rgb(255, 255, 255)',
    //text: 'rgb(28, 28, 30)',
    //border: 'rgb(199, 199, 204)',
    //notification: 'rgb(255, 69, 58)',
  },
};


 export default class App extends Component {

  constructor() {
    super();
    this.state = {
      //auto_login_valid: null,
      role_id: null,
    }
  }

  componentDidMount = async () => {
   
  }

 
  render() {
    return (
      <NavigationContainer theme={MyTheme}>
       <Stack.Navigator  screenOptions={{headerShown: false, gestureEnabled: true}}>
        <Stack.Screen name = "auth" component = {AuthNav}/>
        <Stack.Screen name = 'afterlogin'/*  component = {BottomTabNavigator} */component={StackNav} options = {{gestureEnabled: false}}/>
       </Stack.Navigator>
      </NavigationContainer>
    
    );
  }
}  