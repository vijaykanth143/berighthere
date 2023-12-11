import {Pressable, Text, View} from 'react-native';
import React, {Component} from 'react';

export class CustomButton extends Component {
  render() {
    return (
      <Pressable
        android_ripple={'orange'}
        style={{
          borderColor: 'orange',
          borderWidth: 1,
          alignItems: 'center',
          width: '40%',
          paddingVertical: 8,
          paddingHorizontal: 0,
          marginTop: 20,
          marginBottom: 10,
        }}>
        <Text style={{color: 'orange', letterSpacing: 0.7}}>CHECK IN</Text>
      </Pressable>
    );
  }
}

export default CustomButton;
