import React, { Component } from "react";
import {View ,  Image, TouchableOpacity, Dimensions, Text} from 'react-native'

import color from "../../Styles/color";
import { Header } from "react-native-elements";
import Icon from "react-native-vector-icons/FontAwesome";

import navigation from "../../Styles/navigation";

import Session from "../../config/Session";
import font from "../../Styles/font";


export default class LogoHeader extends Component{

  gohome = async()=>{
    let details = await Session.getUserDetails();
    details = JSON.parse(details);
    if(Number(details.role_id) == 7){
      this.props.navigation.push('employeehome')
      /* this.props.navigation.push('SRP', {
        emplogin: 1
      }) */
     

    }
    else{
      const userId = JSON.parse(await Session.getUserId());
     // console.log('logohearder', typeof userId)
      if(userId != '')
      this.props.navigation.push('bottomtabnavigator'/* 'masterhome'*/ );
     else{
      this.props.navigation.push('masterhome');
     }
    }
  }

 
   
    render(){

        
        return(

          this.props.from == 'bookingmeetingspaces' || this.props.from == 'summarymeetingspaces'?

          <Header

          containerStyle={
            [
              color.whiteBackground, 
              navigation.headerContainer, 
              {
                height: Dimensions.get('screen').height*0.12, 
                justifyContent: "center", 
                marginBottom: 15, 
                borderBottomColor: this.props.from =='summarymeetingspaces'?'white': color.myOrangeColor.color, 
                borderBottomWidth: 2 
              }
            ]
          }
          leftContainerStyle = {{flex: 1, 
           
          }}
          leftComponent={
            <View>

           
            <TouchableOpacity disabled = {this.props.from == 'Home' || this.props.from == 'meetingspaces'? true: false} onPress = {()=>{
              this.props.navigation.goBack();
              //this.gohome()       
            }}>
              <Icon name='angle-left' size = {30} color = {color.myOrangeColor.color}/>
            
              </TouchableOpacity>
{
  this.props.from == 'summarymeetingspaces' ? null:<Text style = {[font.regular, font.semibold, font.sizeRegular, {}]}>SELECTION</Text>
}
              
            </View>
          }

          centerComponent = {
          this.props.from == 'meetingspaces'? 
         
            <Text style = {
              [color.myOrangeColor, 
                font.semibold, 
                font.sizeRegular
              ]
            }>Hello,<Text style = {
              [font.sizeRegular, 
                color.grayColor,
                font.semibold
              ]
              }>{this.props.title}
              </Text>
              </Text>
          
            : this.props.from == 'bookingmeetingspaces' || this.props.from == 'summarymeetingspaces' ? <Text style = {
              [font.sizeMedium, 
                color.myOrangeColor,
                font.bold
              ]
              }>{this.props.title}
              </Text> :
              null
          }
          centerContainerStyle = {{
            //flex:  this.props.from == 'meetingspaces' ?1:0,  
            justifyContent: 'center',
            width: this.props.from == 'meetingspaces' ?Dimensions.get('screen').width *0.6:0,
          }}
        
          rightComponent={
            <View style={{ flexDirection: "row", paddingRight: "2%",  }}>
                {this.props.qrvisible?
              <TouchableOpacity onPress={ this.props.qrpress} style={[{ alignItems: "center", justifyContent: "space-around", shadowColor: "#F8F8F8", backgroundColor: "white", marginRight: 10 }]}>
                <Icon name="qrcode" size={30} color="orange" />
              </TouchableOpacity>:null}

              {
                this.props.from == 'Home' || this.props.from == 'meetingspaces'  || this.props.from == 'meetingsrp' || this.props.from == 'bookingmeetingspaces' || this.props.from == 'summarymeetingspaces' ? null : 
              
              <TouchableOpacity style = {{marginLeft: "10%", marginRight: "10%"}} onPress={()=>{
                
                this.gohome()
              }}>
                <Icon name="home" size={30} color="orange" />
              </TouchableOpacity>
              }
              <TouchableOpacity onPress={
             
                this.props.onBarsPress
                
              }
              >
                <Icon name="bars" size={30} color="orange" />
              </TouchableOpacity>
            </View>
          }
          rightContainerStyle = {{justifyContent: "center"}}
        >

        </Header>
          
          
          :

       
             <Header
              containerStyle={[color.whiteBackground, navigation.headerContainer, {height: Dimensions.get('screen').height*0.12, justifyContent: "center", marginBottom: 15 }]}
              leftContainerStyle = {{flex: 1, 
               // backgroundColor: 'red' 
              }}
              leftComponent={
                <TouchableOpacity disabled = {this.props.from == 'Home' || this.props.from == 'meetingspaces'? true: false} onPress = {()=>{
                  this.gohome()       
                }}>
                  {
                   /*  this.props.from == 'meetingspaces' || this.props.from == 'meetingsrp'? */
                    <Image
                  style={{
                    //marginTop: 10,
                   width: Dimensions.get('screen').width * 0.2,
                    //flex: 1,
                    //height: '100%',
                    resizeMode: 'contain',
                   
                  }}
                  source={require("./../../Assets/images/BRHlogoorange.png")} /> 
                 /*  :
                  <Image
                    style={{
                      width: Dimensions.get('screen').width * 0.4,
                      flex: 1,
                      height: '100%',
                      resizeMode: 'contain',
                    }}
                    source={require("./../../Assets/images/BRHnew.png")} /> */
                  }
                
                  </TouchableOpacity>
              }

              centerComponent = {
              this.props.from == 'meetingspaces'? 
             
                <Text style = {
                  [color.myOrangeColor, 
                    font.semibold, 
                    font.sizeRegular
                  ]
                }>Hello, 
                <Text style = {
                  [font.sizeRegular, 
                    color.grayColor,
                    font.semibold
                  ]
                  }>{this.props.title}
                  </Text>
                  </Text>
              
                : this.props.from == 'meetingsrp' ? <Text style = {
                  [font.sizeMedium, 
                    color.myOrangeColor,
                    font.bold
                  ]
                  }>{this.props.title}
                  </Text> :
                  null
              }
              centerContainerStyle = {{
                //flex:  this.props.from == 'meetingspaces' ?1:0,  
                justifyContent: 'center',
                width: this.props.from == 'meetingspaces' ?Dimensions.get('screen').width *0.6:0,
              }}
            
              rightComponent={
                <View style={{ flexDirection: "row", paddingRight: "2%",  }}>
                    {this.props.qrvisible?
                  <TouchableOpacity onPress={ this.props.qrpress} style={[{ alignItems: "center", justifyContent: "space-around", shadowColor: "#F8F8F8", backgroundColor: "white", marginRight: 10 }]}>
                    <Icon name="qrcode" size={30} color="orange" />
                  </TouchableOpacity>:null}

                  {
                    this.props.from == 'Home' || this.props.from == 'meetingspaces'  || this.props.from == 'meetingsrp'? null : 
                  
                  <TouchableOpacity style = {{marginLeft: "10%", marginRight: "10%"}} onPress={()=>{
                    
                    this.gohome()
                  }}>
                    <Icon name="home" size={30} color="orange" />
                  </TouchableOpacity>
                  }
                  <TouchableOpacity onPress={
                 
                    this.props.onBarsPress
                    
                  }
                  >
                    <Icon name="bars" size={30} color="orange" />
                  </TouchableOpacity>
                </View>
              }
              rightContainerStyle = {{justifyContent: "center"}}
            >

            </Header>


          
          
           
        );
    }
}