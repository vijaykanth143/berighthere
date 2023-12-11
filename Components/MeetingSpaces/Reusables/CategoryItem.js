import React, { Component } from 'react';
import { TouchableOpacity, Text, View } from 'react-native';
import font from '../../../Styles/font';
import color from '../../../Styles/color';
import button from '../../../Styles/button';
import Icon from 'react-native-vector-icons/FontAwesome'
export default class CategoryItem extends Component {

  constructor() {
    super();

    this.state = {
      clicked: false,
    }
  }

  handleClick= ()=>{
    this.setState({
      clicked: !this.state.clicked,
    },this.props.onPress);
  }


  render() {
    return (
      this.props.from == 'meetingsrp' ? 
      <View style={
        [
        button.smallPriceButton,
        {
          flexDirection: 'row',
          marginLeft: 5,
          marginRight: 5,
        }
        ]}>
         
            <Text style={
                [font.semibold,
                font.sizeSmall,
                color.myOrangeColor,
                {
                    alignSelf: 'center',
                    padding: 5,
                    marginLeft: 5,
                    marginRight: 5,
                    //backgroundColor: this.state.clicked ? color.myOrangeColor.color : color.whiteBackground.backgroundColor
                }]}>{this.props.name}</Text>

                <TouchableOpacity 
                onPress  ={()=>{
                  this.handleClick();
                }
                }

                
                style = {{
                  alignSelf: 'center'
                }} >
                <Icon 
                name = 'close' 
                color = {'white'}
                size={10}
                style = {
                 { backgroundColor: color.darkgrayColor.color,
                  borderRadius: 150,
                  padding: 5,
                  margin: 1,
                  alignSelf: 'center'
                }

                }
                />

                </TouchableOpacity>

                



      

      </View>
      :
        <TouchableOpacity style={
          [
          button.smallPriceButton,
          {
           
              alignSelf: 'flex-start',
             
              marginLeft: 5,
              marginRight: 5,
              backgroundColor: this.state.clicked ? color.myOrangeColor.color : color.whiteBackground.backgroundColor
          }]} 
          onPress={() => {
            this.handleClick();
            
        }}>
            <Text style={
                [font.semibold,
                font.sizeSmall,
                color.darkgrayColor,
                ]}>{this.props.name}</Text>



        </TouchableOpacity>
    );
  }
}