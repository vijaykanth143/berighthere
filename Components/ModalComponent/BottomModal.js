import React, { Component } from 'react';
import { ScrollView, 
  Text, 
  View, 
  Dimensions, 
  StyleSheet, 
  TouchableOpacity, 
  LogBox, 
  FlatList} from 'react-native';
import Modal from 'react-native-modalbox';
import box from '../../Styles/box';
import font from '../../Styles/font';
import color from '../../Styles/color';
import button from '../../Styles/button';
var screen = Dimensions.get('window');
import ButtonLocation from './ButtonLocation';

export default class BottomModal extends Component {

  componentDidMount() {
    console.log("Modalbox: ", this.props.properties);
    LogBox.ignoreLogs(['VirtualizedLists should never be nested']);
}


renderProperties = (property)=>{
  console.log("property type details: ", property.item.plan_name)
  return (
    <ButtonLocation
      style={{ margin: "1%", width:100/*  "30%" */,  height: 100, marginBottom: "2%" }}
      item={property.item.plan_name}
      buttonClickStyle={[button.defaultRadius,
      font.bold, color.textWhiteColor,
      color.orangeBorder,
      { backgroundColor: "#f45b1e", borderWidth: 1 }]}

      buttonNotClickStyle={[button.defaultRadius,
      font.bold, color.orangeColor,
      color.orangeBorder, { borderWidth: 1 }]}

      onPress={() => {
        this.setState({
          propertyTypeSelection: this.compare("propertyTypeSelection", property.item.resource_id),
        }, console.log("property type filter state updated.", this.state.propertyTypeSelection)
        );

      }}

    />

  );
}
  render() {
    return (
      <View height={"100%"}>
      <Modal 
      style={[styles.modal, styles.modal4, box.bill_shadow_box, { backgroundColor: "rgba(255,255,255,0.6)"} ]}

        position={"bottom"}
        isOpen={this.props.isOpen}
        onClosed = {this.props.onClosed}
        onOpened = {this.props.onOpened}
        swipeArea={30}
        backdropColor = {"#fafafa"}
        backdropOpacity = {0.9} 
      >
        
        
        <View style = {[styles.greybar]}></View>
        <View style = {[box.simpleBox]}>
          <Text style = {[font.semibold, color.darkgrayColor,
            font.sizeExtraLarge]}>Filters</Text>

        </View>
        <ScrollView keyboardShouldPersistTaps='always' nestedScrollEnabled={true}>
          <View style={{ width: screen.width -10, }}>
            {this.props.modalContent}
          </View>
        </ScrollView>
        
        
          <TouchableOpacity 
          onPress = {this.props.onPressApply}
          style = {{backgroundColor: "orange", 
          width: "95%", 
          alignItems: "center",
          justifyContent: "center",
          height: 50,
          //padding: "3%",
          marginBottom: 5
          }}>
            <Text style = {[font.regular, font.sizeLarge, color.textWhiteColor]}>APPLY</Text>
          </TouchableOpacity>
          
      </Modal>
      </View>
    );

  }
}

const styles = StyleSheet.create({
  modal: {
    justifyContent: 'center',
    alignItems: 'center',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
   
  },
  modal4: {
    height: "70%"
  },
  greybar: {
    backgroundColor: "#eaeaea", 
        marginTop: "2%", 
        borderRadius: 50, 
        padding: 0, 
        width: "30%",
        height: "1%"
  }
});