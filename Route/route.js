/* 
import {  createAppContainer } from "react-navigation";
import { createStackNavigator } from 'react-navigation-stack'
import Login from "./../Components/Login";
import Register from "./../Components/Register";
import Home from "./../Components/Home";
import Detail from "./../Components/Detail"
import Wishlist from "./../Components/Wishlist"
import History from "./../Components/History"

import PropertyList from "../Components/PropertyList";
import Booking from '../Components/Booking';
import BookingDetails from '../Components/BookingDetails';
import BookingRequestReceived from '../Components/BookingRequestReceived';
import UpcomingBookings from '../Components/UpcomingBookings'
import SRP from "../Components/SRP";
import ScanPage from '../Components/ScanPage';
import TopTabNavigator from '../Components/TopTabNavigator';
import PreviousBookings from "../Components/PreviousBookings";
import CurrentBookings from "../Components/CurrentBookings";
import BookedPropertyDetails from '../Components/BookedPropertyDetails';
import EmpSeatReservation from './../Components/EmpSeatReservation';
import EmpSeatReservationList from './../Components/EmpSeatReservationList';
import UpcomingReservations from './../Components/UpcomingReservations';
import HistoryReservations from './../Components/HistoryReservations';
import EmployeeCurrentReservation from './../Components/EmployeeCurrentReservation';
import ChangePassword from './../Components/ChangePassword';
import RaiseIssue from './../Components/RaiseIssue';
import IssuesList from './../Components/IssuesList';
import EmpAllocatedReservation from "../Components/EmpAllcatedReservation";

import Splash from '../Components/Splash';
import AfterSplash from "../Components/AfterSplash";
import Session from "../config/Session";
import { Component } from "react";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
const Stack = createNativeStackNavigator();


export default class route extends Component{
 render(){
  return(
    <Stack.Navigator initialRouteName='Splash'  screenOptions={{
      headerShown: false
    }}>
          <Stack.Screen name="Splash" component={Splash}   />
          <Stack.Screen name='Home' component={Home}/>
          <Stack.Screen name = 'SRP' component={SRP}/>
          <Stack.Screen name = 'AfterSplash' component={AfterSplash} />
          <Stack.Screen name = 'Login' component={Login}/>
          <Stack.Screen name = "Register" component={Register}/>
          <Stack.Screen name = "Detail" component = {Detail}/>
          <Stack.Screen name = 'TopTabNavigator' component = {TopTabNavigator} />
          <Stack.Screen name = "IssuesList" component  = {IssuesList}/>
          <Stack.Screen name = 'Sidemenu' component = {Sidemenu}/>
        </Stack.Navigator>

  );
 }
} */