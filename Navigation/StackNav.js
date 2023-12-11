
import { createAppContainer } from "react-navigation";
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
import React, { Component } from "react";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LogoHeader from "../Components/ReusableComponents/LogoHeader";
import EmployeeHome from '../Components/EmployeeHome';
import UserProfile from "../Components/UserProfile";
import PolicyScreen from "../Components/PolicyScreen";
import MasterHome from "../Components/MasterHome";
import SearchResultPage from "../Components/MeetingSpaces/SearchResultPage";
import MeetingSpaceDetails from "../Components/MeetingSpaces/MeetingSpaceDetails";
import BookingMeetingSpaces from "../Components/MeetingSpaces/BookingMeetingSpaces";
import MeetingSpacesBookingSummary from "../Components/MeetingSpaces/MeetingSpacesBookingSummary";
import BookingInformationPage from "../Components/MeetingSpaces/BookingInformationPage";
import BottomTabNavigator from "../Components/BottomTabNavigator";

const Stack = createNativeStackNavigator();


class StackNav extends Component {
    render(){
        return (
            <Stack.Navigator
             initialRouteName='masterhome' screenOptions={{
                headerShown: false,
                gestureEnabled: true
            }}>
                <Stack.Screen name='Home' component={Home} options={{gestureEnabled: false}}/>
                <Stack.Screen name='SRP' component={SRP} />
                {/* <Stack.Screen name="Detail" component={Detail} /> */}
                <Stack.Screen name='TopTabNavigator' component={TopTabNavigator} />
                <Stack.Screen name = 'bottomtabnavigator' component = {BottomTabNavigator}/>
                <Stack.Screen name="IssuesList" component={IssuesList} />

                
                <Stack.Screen name = 'bookedpropertydetails' component = {BookedPropertyDetails}/>
                <Stack.Screen name ='scanpage' component = {ScanPage}/>
                <Stack.Screen name = 'raiseissue' component = {RaiseIssue}/>
                <Stack.Screen name = 'detail' component = {Detail}/>
                <Stack.Screen name = 'booking' component={Booking}  options={{gestureEnabled: false}} />
                <Stack.Screen name = 'bookingdetails' component={BookingDetails}/>
                <Stack.Screen name= 'bookingrequestreceived' component = {BookingRequestReceived}/>
                <Stack.Screen name = 'changepassword' component = {ChangePassword}/>
                <Stack.Screen name = 'seatreservation' component = {EmpSeatReservation}/>
                <Stack.Screen name = 'seatreservationlist' component = {EmpSeatReservationList}/>
                <Stack.Screen name = 'employeehome' component = {EmployeeHome}/>
                <Stack.Screen name = 'userprofile' component = {UserProfile}/>
                <Stack.Screen name = 'policyscreen' component = {PolicyScreen}/>

                <Stack.Screen name = 'masterhome' component = {MasterHome}options={{gestureEnabled: false}} />
                <Stack.Screen name = 'meetingsrp' component  = {SearchResultPage}/>
                <Stack.Screen name = 'meetingspacedetail' component = {MeetingSpaceDetails}/>
                <Stack.Screen name = 'bookingmeetingspaces' component = {BookingMeetingSpaces} options={{gestureEnabled: false}} />
                <Stack.Screen name = 'meetingspacesbookingsummary' component = {MeetingSpacesBookingSummary} options={{gestureEnabled: false}}/>
                <Stack.Screen name = 'bookinginformationpage' component = {BookingInformationPage}/>
                
            </Stack.Navigator>
    );

    }
   
}
export default StackNav;