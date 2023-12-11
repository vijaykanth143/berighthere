import { Dimensions, StyleSheet } from 'react-native';
import color from './color';
const width = Dimensions.get('window').width;
//console.log(width);
const height = Dimensions.get('window').height;
//console.log(height);
export default StyleSheet.create({
    imageContain: { resizeMode: 'contain' },
    imageCover: { resizeMode: 'cover' },
    userImage: { width: 25, height: 25 },
    logo: { width: 150, height: 35, position: "relative", top: 1, left: 0 },
    notifiImage: { width: 23, height: 23, position: "relative", right: 5, top: 2, },
    carouselImage: {width: width*0.3, height: height * 0.2},
    reservationImage: {width: "100%", height: "100%", borderWidth: 1, borderColor: color.lightGray.color},
    reviewImageBox: {width: 50, 
    height: 50, 
    borderRadius: 50, 
    backgroundColor: "grey",
//borderWidth: 1,
//borderColor: "#000"
 },
 
 propertyCoverImage: {width: "100%", height: "100%"}
})
