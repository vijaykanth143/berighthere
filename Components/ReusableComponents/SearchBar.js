import React, {Component} from 'react';
import {View, TextInput, TouchableOpacity ,StyleSheet} from 'react-native';
import { Icon } from 'react-native-vector-icons/FontAwesome';
import box from '../../Styles/box';

export default class SearchBar extends Component{
    render(){
        return(
            <View style = {styles.container}>
                <Icon name="search" color = "black"/>
                <TextInput
          style={styles.input}
          placeholder="Search"
          value={this.props.searchPhrase}
          onChangeText={this.props.setSearchPhrase}
          onFocus={() => {
            this.props.setClicked();
          }}
        />
            </View>
        );
    }
}
const styles = StyleSheet.create({
    container: {
      margin: 15,
      justifyContent: "flex-start",
      alignItems: "center",
      flexDirection: "row",
      width: "90%",
  
    },
    searchBar__unclicked: {
      padding: 10,
      flexDirection: "row",
      width: "95%",
      backgroundColor: "#d9dbda",
      borderRadius: 15,
      alignItems: "center",
    },
    searchBar__clicked: {
      padding: 10,
      flexDirection: "row",
      width: "80%",
      backgroundColor: "#d9dbda",
      borderRadius: 15,
      alignItems: "center",
      justifyContent: "space-evenly",
    },
    input: {
      fontSize: 20,
      marginLeft: 10,
      width: "90%",
    },
  });