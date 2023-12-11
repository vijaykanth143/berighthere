import { StyleSheet } from 'react-native'
import color from './color'
export default StyleSheet.create({
    default: {
        borderWidth: 1,
        borderRadius: 20,
        textAlign: 'center',
        paddingTop: 10,
        paddingBottom: 10,
        paddingRight: 15,
        paddingLeft: 15
    },
    defaultRadius: {
        borderWidth: 1,
        borderRadius: 0,
        textAlign: 'center',
        paddingTop: 10,
        paddingBottom: 10,
        paddingRight: 15,
        paddingLeft: 15
    },
    smallPriceButton: {
        paddingRight: 8,
        paddingLeft: 10,
        borderWidth: 0.5,
        borderRadius: 10,
        borderColor: color.darkgrayColor.color
        
    },
    smallBillPriceButton: {
        paddingRight: 8,
        paddingLeft: 10,
        borderWidth: 1,
        borderRadius: 20
    },
    smallButton: {
        borderWidth: 1,
        padding:5,
        borderRadius: 15,
    },
    mediumButton: {
        borderWidth: 1,
        paddingTop: 8,
        paddingBottom: 7,
        paddingRight: 8,
        paddingLeft: 10,
        borderRadius: 19,
    },
    saveButton: {
        width: 60, height: 30, borderRadius: 15, borderWidth: 1, textAlign: 'center', alignItems: 'center', paddingBottom: 5
    },
    AddButton: {
        width: 60, height: 25, borderRadius: 0, borderWidth: 1, textAlign: 'center', alignItems: 'center', paddingBottom: 5
    },
    // addButton: {
    //     width: 80, height: 33, borderRadius: 50, borderWidth: 1, borderColor: '#307EA0', backgroundColor: '#fff',
    //     textAlign: 'center', alignItems: 'center', paddingBottom: 4,
    // },
   dollarItem: {
        width: 150, height: 35, borderRadius: 17, borderWidth: 2,marginBottom: 10, marginTop: 10,  },
    loserButton: {
        width: 65, height: 30, borderRadius: 15, borderWidth: 1, paddingBottom: 4, textAlign:'center',alignContent: 'center', alignItems: 'center', alignSelf: 'center',
    },
    winnerButton: { width: 65, height: 30, borderRadius: 15, borderWidth: 1, marginTop: 15, paddingTop: 5 },
    coachButton: {
        width: '100%', height: 35, borderRadius: 17, borderWidth: 2, textAlign: 'center', alignItems: 'center', marginTop: 15,paddingTop:4
      },
})