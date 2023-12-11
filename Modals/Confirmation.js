import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  TouchableWithoutFeedback,
  ScrollView,
} from "react-native";
// import { translate } from "../Config/Language";
import formStyle from "./../Styles/control";
import fontStyle from "./../Styles/font";
import colorStyle from "./../Styles/color";
import buttonStyle from "./../Styles/button";
import boxStyle from "./../Styles/box";
import { TextInput } from "react-native";
import { CommonActions } from "@react-navigation/native";
import CommonHelpers from "../Utils/CommonHelpers";
import renderItem from "../Styles/renderItem";

export default class Confirmation extends React.Component {
  constructor(props) {
    super(props);
    console.log("props: ", props);
    this.state = {
      width: Dimensions.get("window").width,
      height: Dimensions.get("window").height,
      email: null,
    };
  }
 

  onCancelClicked = () => {
    this.props.onCancel();
  };

  onYesClicked = () => {
    this.props.onOk();
  };

  onForgot = () => {
    this.props.onOk(this.state.email);
  };

  render() {
    return (
      this.props.from == 'forgotPassword' ?
      <View style={styles.modalContainer}>
        <View  style={[
            styles.modalContainerPopup,
            colorStyle.inputBackground,
            { width: this.state.width * 0.9 },
          ]}>
            <View style={[styles.modalContent]}>
            <View style={[styles.modalContentDetail]}>
              
              <Text
                style={[
                  colorStyle.darkgrayColor,
                  fontStyle.regular,
                  fontStyle.sizeMedium,
                  styles.modalContentDetailText,{textAlign: this.props.from == 'tnc'? "justify": "center"}
                ]}
              >
                {this.props.modalMsg}
              </Text>
              <TextInput
              placeholder="Enter Email"
              selectionColor={'orange'}
              placeholderTextColor={'orange'}
              style  ={[renderItem.inputBox]}
              defaultValue = {this.state.email}
              onChangeText = {(value)=>{
                
                  this.setState({
                    email: value
                  })
                
                
              }}
              />
            </View>
                {//this.props.from !="tnc"?
            <View style={[formStyle.formButton,styles.flexStyle]}>
              <TouchableWithoutFeedback
                onPress={() => {
                  if(CommonHelpers.validateEmail(this.state.email))
                  this.onForgot();
                  else{
                    CommonHelpers.showFlashMsg('Enter a valid email id.', 'danger')
                  }
                }}
              >
                <Text
                  style={[
                    fontStyle.regular,
                    fontStyle.sizeRegular,
                    colorStyle.myOrangeColor,
                    colorStyle.orangeBorder,
                    
                    buttonStyle.defaultRadius,
                    styles.modelCloseBtn,
                  ]}
                >
                  {/* {translate("Yes")} */}
                  {this.props.okText ? this.props.okText : 'Send Reset Link'}
                </Text>
              </TouchableWithoutFeedback>
              <TouchableWithoutFeedback
                onPress={() => {
                  this.onCancelClicked();
                }}
              >
                <Text
                  style={[
                    fontStyle.regular,
                    fontStyle.sizeRegular,
                    colorStyle.myOrangeColor,
                    colorStyle.linkBorderColor,
                    colorStyle.orangeBorder,
                    buttonStyle.defaultRadius,
                    styles.modelCloseBtn,
                  ]}
                >
                  {/* {translate("Cancel")} */}
                  {this.props.cancelText? this.props.cancelText: 'Cancel'}
                </Text>
              </TouchableWithoutFeedback>
            </View>// : null
            }

          </View>

          </View>




      </View> :
      
      <View style={styles.modalContainer}>
        <View
          style={[
            styles.modalContainerPopup,
            colorStyle.inputBackground,
            { width: this.state.width * 0.9 },
          ]}
        >
          
          <View style={[styles.modalContent]}>
            <View style={[styles.modalContentDetail]}>
              {this.props.from == 'tnc'? 
              <View>
              <Text style={[fontStyle.bold, 
              fontStyle.sizeDoubleLarge, 
              colorStyle.myOrangeColor, 
              {textAlign: "center", marginBottom: "5%"}]}>
                Terms
                </Text>
                <Text  style={[
                  colorStyle.darkgrayColor,
                  fontStyle.regular,
                  fontStyle.sizeMedium,
                  styles.modalContentDetailText,{textAlign: "justify"}
                ]}>{this.props.date}</Text>
                </View>: null}
              <Text
                style={[
                  colorStyle.darkgrayColor,
                  fontStyle.regular,
                  fontStyle.sizeMedium,
                  styles.modalContentDetailText,{textAlign: this.props.from == 'tnc'? "justify": "center"}
                ]}
              >
                {this.props.modalMsg}
              </Text>
            </View>
                {//this.props.from !="tnc"?
            <View style={[formStyle.formButton,styles.flexStyle]}>
              <TouchableWithoutFeedback
                onPress={() => {
                  this.onYesClicked();
                }}
              >
                <Text
                  style={[
                    fontStyle.regular,
                    fontStyle.sizeMedium,
                    colorStyle.myOrangeColor,
                    colorStyle.orangeBorder,
                    
                    buttonStyle.defaultRadius,
                    styles.modelCloseBtn,
                  ]}
                >
                  {/* {translate("Yes")} */}
                  {this.props.okText ? this.props.okText : 'Yes'}
                </Text>
              </TouchableWithoutFeedback>
              <TouchableWithoutFeedback
                onPress={() => {
                  this.onCancelClicked();
                }}
              >
                <Text
                  style={[
                    fontStyle.regular,
                    fontStyle.sizeMedium,
                    colorStyle.myOrangeColor,
                    colorStyle.linkBorderColor,
                    colorStyle.orangeBorder,
                    buttonStyle.defaultRadius,
                    styles.modelCloseBtn,
                  ]}
                >
                  {/* {translate("Cancel")} */}
                  {this.props.cancelText? this.props.cancelText: 'Cancel'}
                </Text>
              </TouchableWithoutFeedback>
            </View>// : null
            }

          </View>
        </View>
      </View>
      
    );
  }
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.2)",
    borderRadius:10
  },
  modalContainerPopup: {
    position: "relative",  //borderRadius:10
  },
  // modalHeader: {
  //  // height: 50,
  //  borderRadius:10,
  //   alignItems: "center",
  // },
  // modalHeaderText: {
  // // /  lineHeight: 50,
  //   textTransform: "uppercase",
  // },
  flexStyle:{
   flexDirection:'row',justifyContent:'space-between'
  },
  // modalHeaderIcon: {
  //   position: "absolute",
  //   right: -10,
  //   top: -6,
  //   width: 25,
  //   height: 25,
  //   zIndex: 10000,
  // },
  modalContent: {
    padding: 15,
  },
  modalContentDetailText: {
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 20,
  },
  modalContentMessageText: {
    marginBottom: 10,
    textAlign: "center",
  },
  modalContentImg: {
    alignItems: "center",
    marginBottom: 20,
  },
  modalContentImgItem: {
    width: 100,
    resizeMode: "contain",
  },
  modelCloseBtn: {
    textTransform: "uppercase",
    marginBottom: 15,
    width: "49%",
  },
});
