import React, {Component} from "react";
import { Image, View, Dimensions } from "react-native";
import image from '../../../Styles/image';
import box from '../../../Styles/box';
//import Carousel from "react-native-reanimated-carousel";
//import Carousel from "react-native-snap-carousel";
import Session from '../../../config/Session';
import Carousel from "react-native-anchor-carousel";
import { GestureHandlerRootView } from "react-native-gesture-handler";

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

export default class RenderCarousel extends Component{

    /* constructor(){
        super();
        this.state = {
            activeIndex: 0,
        }
    } */


    _renderItem=({item, index})=>{
        console.log(item)
        return(
            <View style={{
                backgroundColor:'white',
                borderRadius: 20,
                height: 200,
                padding: 10,
              }}
              
              >
                 <Image 
                style = {[image.imageCover, image.carouselImage]}
                source = {item.url} />
            </View>
        );
    }
    render(){
        return(
            <View>
                <Carousel
                 //style={styles.carousel}
                 ref={c => {
                  this.numberCarousel = c;
                 }}
                 data={this.props.images}
                 initialIndex={this.props.images.length > 1?1:0}
                 renderItem={(item)=>{
                    console.log(item)
                    return(
                        <View style={{
                            backgroundColor:'white',
                            borderRadius: 20,
                            height: 200,
                            //padding: 10,
                          }}
                          
                          >
                             <Image 
                            style = {[image.imageCover, {
                                width: '100%',
                                height: '100%'
                            }
                            ]}
                            source = {{uri: item.item.url}} />
                        </View>
                    );
                 }}
                 itemWidth={ this.props.images.length>1? Dimensions.get('window').width * 0.8:Dimensions.get('window').width }
                 separatorWidth={10}
                 containerWidth={Dimensions.get('window').width}
         />
                
                
              
            </View>
        );
    }
}