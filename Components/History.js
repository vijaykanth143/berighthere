import React from "react";
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  Button,
  Image,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Dimensions,
  BackHandler,
  Alert,
  ActivityIndicator,
  Modal,
  Keyboard,
} from "react-native";


global.userToken = "";
export default class History extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return(
      <>
      <View><Text>History</Text></View>
      </>
    )
  }
}

