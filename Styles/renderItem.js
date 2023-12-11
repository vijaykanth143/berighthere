import { Dimensions, StyleSheet } from 'react-native';
import color from './color';
import font from './font';
const width = Dimensions.get('screen').width;
//console.log(width);
const height = Dimensions.get('screen').height;
//console.log(height);
export default StyleSheet.create({
    smallView: {
        backgroundColor: 'white',
        borderRadius: 20,
        height: 150,
        padding: 5,
    },

    inputBox:{color: color.myOrangeColor.color, 
        borderBottomWidth: 0.5, 
        height: 50, 
        fontFamily: font.regular.fontFamily,
        borderBottomColor: color.myOrangeColor.color, },

    fillWidthView: {
        backgroundColor: 'white',
        borderRadius: 20,
        //height: "100%",
        width: width - 20,
        padding: "3%",
        marginRight: 5,
        marginLeft: 10,
        marginBottom: 0
    },
    rectangleCardView: {
        backgroundColor: 'white',
        borderRadius: 20,
        height: "90%",
        width: width - 40,
        padding: "3%",
       marginRight: 5,
        marginLeft: 9,
        marginBottom: 10,
        marginTop: 5
    },
    withoutPaddingView: {
        backgroundColor: 'white',
        //borderRadius: 20,
        height: "95%",
        width: width - 40,
        marginRight: 5,
        marginLeft: 9,
        marginBottom: 10
    },
    afterSplashView: {
        backgroundColor: 'white',
        //borderRadius: 20,
        height: "95%",
        width: width - 120,
        marginRight: 10,
        marginLeft: 20,
        marginBottom: 10
    },
    search_result_page_view: {
        backgroundColor: 'white',
        //borderRadius: 20,
        height: "95%",
        width: "95%",
        marginRight: 5,
        marginLeft: 9,
        marginBottom: 10
    },
    topRightView: {
        backgroundColor: "rgba(255,255,255,0.8)",
        width: 30,
        height: 30,
        alignItems: "center",
        justifyContent: "space-around",
        alignSelf: "flex-end",
        position: 'absolute',
        top: 10,
        right: 10
    },
    topLeftView: {
        backgroundColor: "rgba(255,255,255,0.8)",
        width: 30,
        height: 30,
        alignItems: "center",
        justifyContent: "space-around",
        alignSelf: "flex-end",
        position: 'absolute',
        top: 10,
        left: 10
    },

    topViewMargin: {
        marginTop: "5%",
    }, 
    scrollViewcomponent: {
        marginTop: "2%", 
        marginBottom: 130
    }
    


})
