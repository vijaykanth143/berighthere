import {Text, StyleSheet, View} from 'react-native';
import React, {Component} from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import Icon2 from 'react-native-vector-icons/MaterialCommunityIcons';
import {Shadow} from 'react-native-shadow-2';
import color from '../../Styles/color';
import font from '../../Styles/font';
export default class Card extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    console.log(this.props.icon);
    return (
      <View
        style={[
          {
            alignItems: 'center',
            padding: 10,
            paddingHorizontal: 13,
            width: '100%',//'21%',
            height: 90,
            borderRadius: 5,
            marginHorizontal: 8,
            marginBottom: 10,
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 2.12,
            shadowRadius: 2.22,
            elevation: 2,
            shadowColor: color.myOrangeColor.color,
            // background color must be set
            backgroundColor: '#fff',
          },
        ]}>
        {this.props.icon == 'qrcode-scan' ? (
          <Icon2
            name={this.props.icon}
            size={35}
            color={'orange'}
            style={{marginBottom: 5}}
          />
        ) : (
          <Icon
            name={this.props.icon}
            size={35}
            color={'orange'}
            style={{marginBottom: 5}}
          />
        )}

        <Text style={[ font.regular, {color: 'black', textAlign: 'center', fontSize: 10}]}>
          {this.props.text}
        </Text>

        <Text style={[ font.regular, {color: 'black', textAlign: 'center', fontSize: 10}]}>
          {this.props.qr}
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({});
