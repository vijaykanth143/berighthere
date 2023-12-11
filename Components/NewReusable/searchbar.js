import {Text, StyleSheet, View, TextInput, Image} from 'react-native';
import React, {Component} from 'react';
import Icon from 'react-native-vector-icons/AntDesign';
import Icon2 from 'react-native-vector-icons/Fontisto';
import Icon3 from 'react-native-vector-icons/Feather';
import CommonHelpers from '../../Utils/CommonHelpers';
import font from '../../Styles/font';
export default class Searchbar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      properties: '',
    };
  }
  onChangeSearch = (e) => {
    this.setState({properties: e});
    this.props.apiCall(e);

    /* console.log('search params: ', params, this.props.params)
    navigation.push('SRP', 
          {
            param: params,//result.dataArray,
            //searchTerm: true,
          }
        );
   // CommonHelpers.searchCall(params) */
  };
  render() {
    return (
      <View
        style={[
          {
            flexDirection: 'row',
            justifyContent: 'space-between',
            padding: '1%',
           // marginTop: 30,
          },
          this.props.style,
        ]}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Icon name="search1" size={20} color={'grey'} />
          <TextInput
            onSubmitEditing={(nativeEvent)=> {
              //this.setState({properties: nativeEvent.nativeEvent.text});
              this.props.apiCall(nativeEvent.nativeEvent.text);
           // CommonHelpers.searchCall(nativeEvent.nativeEvent.text, this.props.navigation)
          }}
            //value={this.state.properties}
            placeholder={this.props.text}
            placeholderTextColor={'grey'}
            style={{color: 'black', width: '90%', height: 50, fontFamily: font.regular.fontFamily}}
          />
        </View>
       {/*  <View style={{flexDirection: 'row', alignItems: 'center'}}>
          {this.props.icon == 'list-2' ? (
            <Icon2
              name={this.props.icon}
              size={20}
              color={'#a9a9a9'}
              style={{marginHorizontal: 15}}
            />
          ) : (
            <Icon3
              name={this.props.icon}
              size={25}
              color={'#a9a9a9'}
              style={{marginHorizontal: 10}}
            />
          )}

          <Image
            source={require('./../../Assets/Icons/greylocation.png')}
            style={{height: 28, width: 25, marginBottom: 5}}
          />
        </View> */}
      </View>
    );
  }
}

const styles = StyleSheet.create({});
