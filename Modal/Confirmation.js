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
//import { translate } from "../Config/Language";
import formStyle from "./../Styles/control";
import fontStyle from "./../Styles/font";
import colorStyle from "./../Styles/color";
import buttonStyle from "./../Styles/button";
export default class Confirmation extends React.Component {
  constructor(props) {
    super(props);
    console.log("props: ", props);
    this.state = {
      width: Dimensions.get("window").width,
      height: Dimensions.get("window").height,
    };
  }
  componentDidMount() {
    Dimensions.addEventListener("change", ({ window: { width, height } }) => {
      this.setState({
        width: width,
        height: height,
      });
    });
  }

  componentWillUnmount() {
    Dimensions.removeEventListener("change");
  }

  onCancelClicked = () => {
    this.props.onCancel();
  };

  onYesClicked = () => {
    this.props.onOk();
  };

  render() {
    return (
      // <ScrollView>
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
              <Text
                style={[
                  colorStyle.darkgrayColor,
                  fontStyle.regular,
                  fontStyle.sizeMedium,
                  styles.modalContentDetailText,
                ]}
              >
                {this.props.modalMsg}
              </Text>
            </View>

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
                    colorStyle.textWhiteColor,
                    colorStyle.linkBorderColor,
                    colorStyle.backColor,
                    buttonStyle.defaultRadius,
                    styles.modelCloseBtn,
                  ]}
                >
                  {translate("Yes")}
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
                    colorStyle.textWhiteColor,
                    colorStyle.linkBorderColor,
                    colorStyle.backColor,
                    buttonStyle.defaultRadius,
                    styles.modelCloseBtn,
                  ]}
                >
                  {translate("Cancel")}
                  
                </Text>
              </TouchableWithoutFeedback>
              
            </View>
          </View>
        </View>
      </View>
      // </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.4)",
    borderRadius:10
  },
  modalContainerPopup: {
    position: "relative",  borderRadius:10
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
