import React, {Component} from 'react';
import { View, BackHandler, StatusBar, Dimensions } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import UpcomingReservations from './UpcomingReservations';
import EmployeeCurrentReservation from './EmployeeCurrentReservation';
import HistoryReservations from './HistoryReservations';
import color from '../Styles/color';
import font from '../Styles/font';
import LogoHeader from './ReusableComponents/LogoHeader';
import EmpAllocatedReservation from './EmpAllcatedReservation';
import Drawer from "react-native-drawer";
import Sidemenu from "../Navigation/Sidemenu";

export default class EmpSeatReservationList extends Component {

    componentDidMount= ()=>{
          // add back listener
    this.backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        this.goBack
      );

    }

    componentWillUnmount=()=>{
      if(this.backHandler)
        this.backHandler.remove();
    }
  

    goBack = () => {
        console.log("going back");
        this.props.navigation.goBack();
          return true;
       
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
      content={<Sidemenu navigation = {this.props.navigation} close = {()=>{
        this.closeControlPanel();
      }} />}
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
        <StatusBar backgroundColor='white' barStyle='dark-content' />
        {/* <Header name={'angle-left'} 
                    onPress={() => { this.goBack() }}
                    style={[color.myOrangeColor, renderItem.topViewMargin ]}
                    title={"Reservation List"} /> */}
                    <LogoHeader navigation = {this.props.navigation} /* title ="Reservation List" */  onBarsPress={()=>{
               this.openControlPanel()}}/>
    
      <Tab.Navigator initialRouteName = {"Upcoming"} 
      screenOptions={{
        tabBarLabelStyle: { fontSize: font.sizeVeryRegular.fontSize, fontFamily: font.semibold.fontFamily ,
        textTransform:"capitalize"},
        tabBarItemStyle: { width: Dimensions.get("screen").width / 4 },
        //tabBarStyle: { backgroundColor: 'orange' },
        tabBarIndicatorStyle :{
          backgroundColor:'orange'
      },
      tabBarInactiveTintColor: color.grayColor.color,
      tabBarActiveTintColor: color.myOrangeColor.color,

      }}
     /*  tabBarOptions= {{
        
  activeTintColor: "orange", 
  inactiveTintColor: "gray", 
  indicatorStyle :{
    backgroundColor:'orange'
},
labelStyle: {fontFamily: font.bold.fontFamily,
fontSize: font.sizeSmall.fontSize},
upperCaseLabel: false

}} */
backBehavior = 'none'
>
        <Tab.Screen name="Allocated" component={EmpAllocatedReservation} />
        <Tab.Screen name="Current" component={EmployeeCurrentReservation} />
        <Tab.Screen name="Upcoming" component={UpcomingReservations} />
        <Tab.Screen name="History" component={HistoryReservations} />
      </Tab.Navigator>
    </View>
    </Drawer>
        );
    }
}