import React, { Component } from 'react';
import { Text, View, BackHandler, StatusBar } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

import UpcomingBookings from './UpcomingBookings';
import PreviousBookings from './PreviousBookings';
import CurrentBookings from './CurrentBookings';
import color from '../Styles/color';

import font from '../Styles/font';
import LogoHeader from './ReusableComponents/LogoHeader';
import CommonHelpers from '../Utils/CommonHelpers';
import { login_check } from '../Rest/userAPI';
import Session from '../config/Session';
import Drawer from "react-native-drawer";
import Sidemenu from "../Navigation/Sidemenu";
import Home from './Home';
import MeetingHome from './MeetingSpaces/MeetingHome';




export default class MasterHome extends Component {
    constructor(){
        super();
        /* if (Text.defaultProps == null) Text.defaultProps = {};
        Text.defaultProps.allowFontScaling = false; */
        this.state = {
            name : '',
            isLogin: false
        }
    }
    componentDidMount = async () => {
        let userdetails = await Session.getUserDetails();
        if(userdetails == ''){
            this.setState({
                name: 'Guest',
            })

        }
        else{
            //userdetails = JSON.parse(userdetails);
            this.setState({
                name : await Session.getUserName(),
            })

        }
        


        // add back listener
        this.backHandler = BackHandler.addEventListener(
            "hardwareBackPress",

            () => {
                // this.props.route.params.payment ? this.props.navigation.push('home'):
                this.props.navigation.goBack();
                return true;
            }
        );
        login_check().then(async (result) => {
            console.log("login check", result.message, result.status);
            if (!result.status) {
                
                this.setState({
                    isLogin:false
                })
            }
            else{
                this.setState({
                    isLogin: true
                })
            }

        }).catch(error => {
            console.log(error)
        })

    }

    componentWillUnmount() {
        if (this.backHandler)
            this.backHandler.remove();
    }

    closeControlPanel = () => {
        this._drawer.close()
    };
    openControlPanel = () => {
        this._drawer.open()
    };



    render() {
        const Tab = createMaterialTopTabNavigator();
        return (
            <Drawer
                ref={(ref) => this._drawer = ref}
                type="overlay"
                content={<Sidemenu navigation={this.props.navigation} />}
                tapToClose={true}
                openDrawerOffset={0.2} // 20% gap on the right side of drawer
                panCloseMask={0.2}
                closedDrawerOffset={-3}
                //styles={drawerStyles}
                side='right'
                tweenHandler={(ratio) => ({
                    main: { opacity: (2 - ratio) / 2 }
                })}
            >



                <View style={{ height: '100%' }} >
                    {/*  <StatusBar backgroundColor={'white'} barStyle={'dark-content'} /> */}
                    <LogoHeader
                        navigation={this.props.navigation}
                        title={this.state.isLogin ? ' '+ this.state.name : ' Guest'} topTab={true}
                        //qrvisible = {true} 
                        //qrpress = {()=>{this.openScanPage()}} 
                        onBarsPress={() => {
                            this.openControlPanel()
                        }}

                        from = {'meetingspaces'}
                       
                    />
                    {/*  <Header name={'angle-left'} 
                      onPress={() => { this.goBack() }}
                      style={[color.myOrangeColor, ]}
                      title={"Manage Bookings"} /> */}

                    <Tab.Navigator initialRouteName={"MeetingSpaces"}
                    
                    
                        screenOptions={{
                            swipeEnabled: false,
                            gestureEnabled:false,
                            tabBarPressOpacity: 0,
                            tabBarStyle : {
                                backgroundColor: color.lightGrayBack.backgroundColor
                            },
                            tabBarLabelStyle: {
                                fontSize: font.sizeRegular.fontSize,
                                fontFamily: font.semibold.fontFamily,
                            },
                            tabBarIndicatorStyle: {
                                backgroundColor: 'orange',
                                height: '100%'
                            },
                           
                            
                            tabBarInactiveTintColor: color.grayColor.color,
                            tabBarActiveTintColor: color.textWhiteColor.color//color.myOrangeColor.color,

                        }}
                        
                        backBehavior='none'
                    >

                        <Tab.Screen name="Meeting Spaces" component={MeetingHome}  options={{gestureEnabled: false}}/>
                        <Tab.Screen name="Work Spaces" component={Home} />

                    </Tab.Navigator>
                   
                </View>
              
            </Drawer>

        );
    }
}