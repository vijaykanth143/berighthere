import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  Platform,
  ScrollView

} from "react-native";
import color from "../Styles/color";
import font from "../Styles/font";
import Session from "../config/Session";
import route from "../Route/route";
import Icon from "react-native-vector-icons/FontAwesome";
import { DrawerContentScrollView } from "@react-navigation/drawer";
import Modal from 'react-native-modalbox';

//import RazorpayCheckout from 'react-native-razorpay';

export default class Sidemenu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      emplogin: 0,
      close: 0,
      tncmodal: false,
      privacymodal: false,
      isLogin: false,
    }
  }

  componentDidMount = async () => {
    let login = JSON.parse(await Session.getUserId());
    console.log('User id',typeof login);
    if(login == ""){
      console.log('Guest login')
      this.setState({
        isLogin: false,
        username: "Hello, Guest",
      })
      this.setState({
       // username: await Session.getUserName(),
        emplogin: await Session.getRoleId() == '7' ? 1 : 0,
      });
      

    }
    else{
      this.setState({
        isLogin: true,
      })
      this.setState({
        username: await Session.getUserName(),
        emplogin: await Session.getRoleId() == '7' ? 1 : 0,
      });
    }
   

  }
  navigate = async () => {
    this.setState({
      close: 1,
    }, this.props.close)


  }
  render() {
    return (
      this.state.emplogin == 1 ? //employee sidemenu
        <DrawerContentScrollView style={{ flex: 1, backgroundColor: "rgba(255, 160, 30, 0.7)", height: Dimensions.get('screen').height, width: "100%", /* paddingTop: '10%' */ }}>

         {/*  <View style={{ height: Dimensions.get('screen').height * 0.1, alignSelf:'center'
         }}>
            <TouchableOpacity onPress={() => {
              this.navigate();
            }} >
              <Icon name="arrow-left" color={"white"} size={20} style={{ marginLeft: 10 }} />
            </TouchableOpacity>
          </View> */}
          <View style={{ height: Dimensions.get('screen').height * 0.2,/*  backgroundColor: 'pink', */ flexDirection: 'row', justifyContent: "flex-end", /* padding: "2%" */ /* alignItems:"center" */ }}>
            <View style={{ width: "35%" }}>
              <Icon name="user-circle-o" size={Platform.OS === 'android' ? 50 : 70} color="white" style={{ marginTop: 15, marginLeft: 25 }} />
              <TouchableOpacity onPress = {()=>{
                this.navigate();
                this.props.navigation.navigate('userprofile');
              }}>
              <Text  style={[color.textWhiteColor, font.regular, font.sizeVeryRegular, { marginTop: 15, marginLeft: 25 }]}>My Profile</Text>
              </TouchableOpacity>
            </View>
            <View style={{ marginTop: 20, marginLeft: 10,/* backgroundColor: "black", */ width: "65%" }}>
              <Text style={[font.sizeDoubleLarge, font.bold, color.textWhiteColor,]}>{this.state.username}</Text>
              <Text style={[color.textWhiteColor, font.regular, font.sizeVeryRegular]}>Employee</Text>
              <TouchableOpacity onPress={() => {
                //this.navigate();
                this.props.navigation.push('changepassword');

              }}>
                <Text style={[color.textWhiteColor, font.regular, font.sizeVeryRegular, { paddingTop: 10, textDecorationLine: "underline" }]}>Change Password</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={{ alignContent: "flex-end", /*  flex: 2, */ height: Dimensions.get('screen').height * 0.5 }}>
            <TouchableOpacity onPress={() => {
              this.navigate();
              this.props.navigation.push('seatreservation', {
                purpose: 'new'
              });

            }}>
              <View style={{ display: "flex", flexDirection: 'row', height: 60, paddingTop: 20 }}>
                <View style={{ width: "90%" }}>
                  <Text style={[color.textWhiteColor, font.bold, { marginLeft: 25 }]} >Reserve Seat</Text>
                </View>

              </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => {
              this.navigate();
              this.props.navigation.push('seatreservationlist')
              /*  Navigation.setRoot({
                 root: route.SeatReservationList,
               }) */
            }}>
              <View style={{ display: "flex", flexDirection: 'row', height: 60, paddingTop: 20 }}>
                <View style={{ width: "90%" }}>
                  <Text style={[color.textWhiteColor, font.bold, { marginLeft: 25 }]} >My Seat Reservation</Text>
                </View>
              </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => {
              this.navigate();
              this.props.navigation.push('TopTabNavigator')
              /*  Navigation.setRoot({
                 root: route.SeatReservationList,
               }) */
            }}>
              <View style={{ display: "flex", flexDirection: 'row', height: 60, paddingTop: 20 }}>
                <View style={{ width: "90%" }}>
                  <Text style={[color.textWhiteColor, font.bold, { marginLeft: 25 }]} >My Bookings</Text>
                </View>
              </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => {
              this.navigate();
              this.props.navigation.push('IssuesList');

            }}>
              <View style={{ display: "flex", flexDirection: 'row', height: 60, paddingTop: 20 }}>
                <View style={{ width: "90%" }}>
                  <Text style={[color.textWhiteColor, font.bold, { marginLeft: 25 }]} >Issues List</Text>
                </View>

              </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => {
              this.navigate();
              this.props.navigation.push('bottomtabnavigator');


            }}>
              <View style={{ display: "flex", flexDirection: 'row', height: 60, paddingTop: 20 }}>
                <View style={{ width: "90%" }}>
                  <Text style={[color.textWhiteColor, font.bold, { marginLeft: 25 }]} >Discover</Text>
                </View>

              </View>
            </TouchableOpacity>

          </View>

          <View style={{ height: Dimensions.get('screen').height * 0.1, /* flex: 1, */ /* backgroundColor: 'red' , *//*  bottom: 10, position: "absolute", */ /*marginBottom: 0 */ }}>
            <TouchableOpacity
              onPress={async () => {
                await Session.setUserDetails({});
                await Session.setUserToken('');

                await Session.setUserId('');
                await Session.setUserName('');
                this.props.navigation.navigate('Login');
              }}
              style={{ display: "flex", flexDirection: 'row', height: 60, paddingTop: 20, }}>
              <View style={{ width: "90%" }}>
                <Text style={[color.textWhiteColor, font.bold, { marginLeft: 25 }]}>Logout</Text>
              </View>

            </TouchableOpacity>
          </View>

        </DrawerContentScrollView>
        : // member sidemenu
        <View style={{ backgroundColor: "rgba(255, 160, 30, 0.7)", height: "100%", width: "100%", paddingTop: '1%',  }}>

          <View style={{ height: Dimensions.get('screen').height * 0.2, display: "flex", flexDirection: 'row',
        alignItems: 'center' }}>
            <View style={{ width: "35%" }}>
              <Icon name="user-circle-o" size={Platform.OS === 'android' ? 50 : 70} color="white" style={{ marginTop: 25, marginLeft: 25 }} />
            </View>
            <View style={{ marginTop: 25, marginLeft: 10,  /* backgroundColor: "black", */ width: 200 }}>
              <Text style={[font.sizeDoubleLarge, font.regular, font.bold, color.textWhiteColor,]}>{this.state.username}</Text>
              <Text style={[color.textWhiteColor, font.regular, font.sizeVeryRegular]}>Member</Text>
              
            </View>
          </View>

          <View style={{/* flex: 1 */height: Dimensions.get('screen').height * 0.5, }}>
            <TouchableOpacity onPress={() => {
              if(this.state.isLogin){
                this.navigate()
              this.props.navigation.navigate('TopTabNavigator')

              }
              else{
                this.props.navigation.navigate('auth', {screen: 'login'})
              }
              
            }}>
              <View style={{ display: "flex", flexDirection: 'row', height: 60, paddingTop: 20 }}>
                <View style={{ width: "90%" }}>
                  <Text style={[color.textWhiteColor, font.regular, font.bold, { marginLeft: 25 }]} >Manage bookings</Text>
                </View>

              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {
               if(this.state.isLogin){
                this.navigate();
              this.props.navigation.navigate('IssuesList')

              }
              else{
                this.props.navigation.navigate('auth', {screen: 'login'})
              }
              
            }}>
              <View style={{ display: "flex", flexDirection: 'row', height: 60, paddingTop: 20 }}>
                <View style={{ width: "90%" }}>
                  <Text style={[color.textWhiteColor, font.regular, font.bold, { marginLeft: 25 }]}>Manage Issues</Text>
                </View>


              </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => {
               if(this.state.isLogin){
                this.navigate();
             this.props.navigation.navigate('bottomtabnavigator', {
              screen: 'Wishlist',
             });
              }
              else{
                this.props.navigation.navigate('auth', {screen: 'login'})
              }
              
             
            }}>
              <View style={{ display: "flex", flexDirection: 'row', height: 60, paddingTop: 20 }}>
                <View style={{ width: "90%" }}>
                  <Text style={[color.textWhiteColor, font.regular, font.bold, { marginLeft: 25 }]}>My Favorites</Text>
                </View>


              </View>
            </TouchableOpacity>


            <TouchableOpacity onPress={() => {
               if(this.state.isLogin){
                this.navigate();
             this.props.navigation.navigate('bottomtabnavigator', {
              screen: 'UserProfile'
             });

              }
              else{
                this.props.navigation.navigate('auth', {screen: 'login'})
              }
              
             
            }}>
              <View style={{ display: "flex", flexDirection: 'row', height: 60, paddingTop: 20 }}>
                <View style={{ width: "90%" }}>
                  <Text style={[color.textWhiteColor, font.regular, font.bold, { marginLeft: 25 }]}>User Profile</Text>
                </View>


              </View>
            </TouchableOpacity>



           {/*  <TouchableOpacity style={{ width: "90%", }} onPress={()=>{
              this.navigate();
              this.props.navigation.push('policyscreen', {
                tncmodal: true,
                privacymodal: false
              })

            }}>
            <View >
              <Text style={[color.textWhiteColor, font.regular,  font.bold, { marginLeft: 25 }]}>Terms and Conditions</Text>
            </View>
            </TouchableOpacity>

            <TouchableOpacity style={{ width: "90%" }} 
            onPress={()=>{
              this.navigate();
              this.props.navigation.push('policyscreen', {
                tncmodal: false,
                privacymodal: true
              })

            }}
            >
            <View>
              <Text style={[color.textWhiteColor, font.regular, font.bold, { marginLeft: 25 }]}>Privacy Policy</Text>
            </View>

            </TouchableOpacity> */}

          </View>

          <View style={{/* flex: 1 */height: Dimensions.get('screen').height * 0.2,  }}>

          <TouchableOpacity style={{ width: "90%" }} onPress={()=>{
              this.navigate();
              this.props.navigation.push('policyscreen', {
                tncmodal: false,
                privacymodal: false,
                aboutUs: true,

              })

            }}>
            <View >
              <Text style={[color.textWhiteColor, font.regular,  font.bold, { marginLeft: 25 }]}>About Us</Text>
            </View>
            </TouchableOpacity>

            <TouchableOpacity style={{ width: "90%",paddingTop: 10 }} onPress={()=>{
              this.navigate();
              this.props.navigation.push('policyscreen', {
                tncmodal: true,
                privacymodal: false
              })

            }}>
            <View >
              <Text style={[color.textWhiteColor, font.regular,  font.bold, { marginLeft: 25 }]}>Terms and Conditions</Text>
            </View>
            </TouchableOpacity>

            <TouchableOpacity style={{ width: "90%", paddingTop: 10 }} 
            onPress={()=>{
              this.navigate();
              this.props.navigation.push('policyscreen', {
                tncmodal: false,
                privacymodal: true
              })

            }}
            >
            <View>
              <Text style={[color.textWhiteColor, font.regular, font.bold, { marginLeft: 25 }]}>Privacy Policy</Text>
            </View>

            </TouchableOpacity>
           
            <TouchableOpacity
              onPress={async () => {
                await Session.setUserDetails({});
                await Session.setUserToken('');
                console.log(await Session.getUserDetails());
                await Session.setUserId('');
                await Session.setUserName('');
                this.props.navigation.navigate('Login');
                /*  Navigation.setRoot({
                   root: route.beforeLogin,
                 }) */
              }}
              style={{
                justifyContent: 'flex-end',
                marginBottom: 30,
                marginTop: 10
              }}>
              <View style={{ width: "90%" }}>
                <Text style={[color.textWhiteColor,  font.regular,font.bold, { marginLeft: 25 }]}> { this.state.isLogin ?'Logout': 'Login'}</Text>
              </View>

            </TouchableOpacity>

          </View>

        </View>

    )
  }
}

