import React, { Component } from 'react';

import { View, ScrollView, Dimensions, Text, BackHandler, Linking, Platform, TouchableOpacity } from 'react-native';

import Modal from 'react-native-modalbox';

import color from '../Styles/color';

import font from '../Styles/font';

import button from '../Styles/button';

import box from '../Styles/box';

import {

    termsandconditions, elegibilty_text,

    content_text,

    CLAIMS_OF_COPYRIGHT_INFRINGEMENT_text, user_account_deletion,

    review_text1, review_text2, review_text3,

    review_text4, review_text5, review_text6,

    space_accounts_text1, space_accounts_text2,

    space_accounts_text3, user_accounts_text1, user_accounts_text2,

    disputes_text, third_party_text, link_text, liability_text,

    indem_text, mis_text, mod_text, copyright_text, contact_text,

}

    from '../config/RestAPI';

import {

    AWS_URL, camera,

    changes_to_privacy_policy,

    children_privacy, contact_us,

    cookies, information_collection_and_use,

    links_to_other_sites, location_information,

    privacyPolicy, PROPERTY_LIST, security, service_providers,

} from "../config/RestAPI";

import LogoHeader from './ReusableComponents/LogoHeader';

import Drawer from 'react-native-drawer';

import Sidemenu from '../Navigation/Sidemenu';

import { Image } from 'react-native';

import image from '../Styles/image';





export default class PolicyScreen extends Component {

    constructor(props) {

        super(props);

        this.state = {

            tncmodal: false,

            privacymodal: false,

            aboutUs: false,

        }

    }

    componentDidMount = () => {



        this.backhandler = BackHandler.addEventListener('hardwareBackPress', () => {

            this.props.navigation.goBack();

            return true;

        })

        this.setState({

            tncmodal: this.props.route.params.tncmodal,

            privacymodal: this.props.route.params.privacymodal,

            aboutUs: this.props.route.params.aboutUs,

        });



    }



    componentWillUnmount() {

        if (this.backhandler)

            this.backhandler.remove();

    }





    closeControlPanel = () => {

        this._drawer.close()

    };

    openControlPanel = () => {

        this._drawer.open()

    };



    callTheNumber = () => {

        let number = '';

        if (Platform.OS === 'ios') {

            number = 'telprompt:${07569522573}';

        }

        else {

            number = 'tel:${07569522573}';

        }

        Linking.openURL(number);

    }



    render() {

        return (



            <Drawer

                ref={(ref) => this._drawer = ref}

                type="overlay"

                content={<Sidemenu navigation={this.props.navigation} close={() => {

                    this.closeControlPanel();

                }} />}

                tapToClose={true}

                openDrawerOffset={0.2} // 20% gap on the right side of drawer

                panCloseMask={0.2}

                closedDrawerOffset={-3}

                //styles={drawerStyles}

                side='right'

                tweenHandler={(ratio) => ({

                    main: { opacity: (2 - ratio) / 2 }

                })}>

                <View height={'100%'}>

                    <LogoHeader navigation={this.props.navigation}

                        onBarsPress={() => {

                            this.openControlPanel()

                        }}

                    />



                    {this.state.tncmodal &&

                        <View height={"90%"} width={'100%'}

                            style={{

                                marginTop: '10%', padding: '3%',



                            }}>

                            <ScrollView keyboardShouldPersistTaps={"always"}>

                                <Text style={[font.bold, font.sizeLarge, color.myOrangeColor, { textAlign: "center", marginBottom: "10%" }]}>Terms</Text>

                                <Text style={[font.regular, font.sizeRegular, color.darkgrayColor, { textAlign: "justify", marginBottom: "10%" }]}>{"Effective Date: March 31, 2021 "}</Text>

                                <Text style={[font.regular, font.sizeRegular, color.darkgrayColor, { textAlign: "justify", lineHeight: 14 + 14 * 1 }]}>

                                    {termsandconditions}

                                </Text>

                                <Text style={[font.bold, font.sizeLarge, color.myOrangeColor, { textAlign: "center", marginBottom: "10%" }]}>Eligibility</Text>

                                <Text style={[font.regular, font.sizeRegular, color.darkgrayColor, { textAlign: "justify", lineHeight: 14 + 14 * 1 }]}>

                                    {elegibilty_text}

                                </Text>

                                <Text style={[font.bold, font.sizeLarge, color.myOrangeColor, { textAlign: "center", marginBottom: "10%" }]}>Content</Text>

                                <Text style={[font.regular, font.sizeRegular, color.darkgrayColor, { textAlign: "justify", lineHeight: 14 + 14 * 1 }]}>

                                    {content_text}

                                </Text>



                                <Text style={[font.bold, font.sizeLarge, color.myOrangeColor, { textAlign: "center", marginBottom: "10%" }]}>CLAIMS OF COPYRIGHT INFRINGEMENT</Text>

                                <Text style={[font.regular, font.sizeRegular, color.darkgrayColor, { textAlign: "justify", lineHeight: 14 + 14 * 1 }]}>

                                    {CLAIMS_OF_COPYRIGHT_INFRINGEMENT_text}

                                </Text>



                                <Text style={[font.bold, font.sizeLarge, color.myOrangeColor, { textAlign: "center", marginBottom: "10%" }]}>REVIEWS, ENQUIRIES, COMMENTS AND USE OF OTHER INTERACTIVE AREAS</Text>

                                <Text style={[font.regular, font.sizeRegular, color.darkgrayColor, { textAlign: "justify", lineHeight: 14 + 14 * 1 }]}>

                                    {review_text1}

                                </Text>

                                <Text style={[font.regular, font.sizeRegular, color.darkgrayColor, { textAlign: "justify", lineHeight: 14 + 14 * 1 }]}>

                                    {review_text2}

                                </Text>

                                <Text style={[font.regular, font.sizeRegular, color.darkgrayColor, { textAlign: "justify", lineHeight: 14 + 14 * 1 }]}>

                                    {review_text3}

                                </Text>

                                <Text style={[font.regular, font.sizeRegular, color.darkgrayColor, { textAlign: "justify", lineHeight: 14 + 14 * 1 }]}>

                                    {review_text4}

                                </Text>

                                <Text style={[font.regular, font.sizeRegular, color.darkgrayColor, { textAlign: "justify", lineHeight: 14 + 14 * 1 }]}>

                                    {review_text5}

                                </Text>

                                <Text style={[font.regular, font.sizeRegular, color.darkgrayColor, { textAlign: "justify", lineHeight: 14 + 14 * 1 }]}>

                                    {review_text6}

                                </Text>



                                <Text style={[font.bold, font.sizeLarge, color.myOrangeColor, { textAlign: "center", marginBottom: "10%" }]}>BERIGHTHERE.COM SPACE ACCOUNTS</Text>

                                <Text style={[font.regular, font.sizeRegular, color.darkgrayColor, { textAlign: "justify", lineHeight: 14 + 14 * 1 }]}>

                                    {space_accounts_text1}

                                </Text>

                                <Text style={[font.regular, font.sizeRegular, color.darkgrayColor, { textAlign: "justify", lineHeight: 14 + 14 * 1 }]}>

                                    {space_accounts_text2}

                                </Text>

                                <Text style={[font.regular, font.sizeRegular, color.darkgrayColor, { textAlign: "justify", lineHeight: 14 + 14 * 1 }]}>

                                    {space_accounts_text3}

                                </Text>



                                <Text style={[font.bold, font.sizeLarge, color.myOrangeColor, { textAlign: "center", marginBottom: "10%" }]}>USER ACCOUNTS</Text>

                                <Text style={[font.regular, font.sizeRegular, color.darkgrayColor, { textAlign: "justify", lineHeight: 14 + 14 * 1 }]}>

                                    {user_accounts_text1}

                                </Text>



                                <Text style={[font.regular, font.sizeRegular, color.darkgrayColor, { textAlign: "justify", lineHeight: 14 + 14 * 1 }]}>

                                    {user_accounts_text2}

                                </Text>

                                <Text style={[font.bold, font.sizeLarge, color.myOrangeColor, { textAlign: "center", marginBottom: "10%" }]}>USER ACCOUNT DELETION</Text>

                                <Text style={[font.regular, font.sizeRegular, color.darkgrayColor, { textAlign: "justify", lineHeight: 14 + 14 * 1 }]}>

                                    {user_account_deletion}

                                </Text>



                                <Text style={[font.bold, font.sizeLarge, color.myOrangeColor, { textAlign: "center", marginBottom: "10%" }]}>DISPUTES BETWEEN COWORKING SPACES AND USERS</Text>

                                <Text style={[font.regular, font.sizeRegular, color.darkgrayColor, { textAlign: "justify", lineHeight: 14 + 14 * 1 }]}>

                                    {disputes_text}

                                </Text>



                                <Text style={[font.bold, font.sizeLarge, color.myOrangeColor, { textAlign: "center", marginBottom: "10%" }]}>THIRD-PARTY SUPPLIERS</Text>

                                <Text style={[font.regular, font.sizeRegular, color.darkgrayColor, { textAlign: "justify", lineHeight: 14 + 14 * 1 }]}>

                                    {third_party_text}

                                </Text>



                                <Text style={[font.bold, font.sizeLarge, color.myOrangeColor, { textAlign: "center", marginBottom: "10%" }]}>LINKS TO THIRD-PARTY SITES</Text>

                                <Text style={[font.regular, font.sizeRegular, color.darkgrayColor, { textAlign: "justify", lineHeight: 14 + 14 * 1 }]}>

                                    {link_text}

                                </Text>



                                <Text style={[font.bold, font.sizeLarge, color.myOrangeColor, { textAlign: "center", marginBottom: "10%" }]}>LIABILITY DISCLAIMER</Text>

                                <Text style={[font.regular, font.sizeRegular, color.darkgrayColor, { textAlign: "justify", lineHeight: 14 + 14 * 1 }]}>

                                    {liability_text}

                                </Text>



                                <Text style={[font.bold, font.sizeLarge, color.myOrangeColor, { textAlign: "center", marginBottom: "10%" }]}>INDEMNIFICATION</Text>

                                <Text style={[font.regular, font.sizeRegular, color.darkgrayColor, { textAlign: "justify", lineHeight: 14 + 14 * 1 }]}>

                                    {indem_text}

                                </Text>



                                <Text style={[font.bold, font.sizeLarge, color.myOrangeColor, { textAlign: "center", marginBottom: "10%" }]}>MICELLANEOUS</Text>

                                <Text style={[font.regular, font.sizeRegular, color.darkgrayColor, { textAlign: "justify", lineHeight: 14 + 14 * 1 }]}>

                                    {mis_text}

                                </Text>



                                <Text style={[font.bold, font.sizeLarge, color.myOrangeColor, { textAlign: "center", marginBottom: "10%" }]}>MODIFICATIONS TO THIS AGREEMENT</Text>

                                <Text style={[font.regular, font.sizeRegular, color.darkgrayColor, { textAlign: "justify", lineHeight: 14 + 14 * 1 }]}>

                                    {mod_text}

                                </Text>



                                <Text style={[font.bold, font.sizeLarge, color.myOrangeColor, { textAlign: "center", marginBottom: "10%" }]}>COPYRIGHT AND TRADEMARK NOTICES</Text>

                                <Text style={[font.regular, font.sizeRegular, color.darkgrayColor, { textAlign: "justify", lineHeight: 14 + 14 * 1 }]}>

                                    {copyright_text}

                                </Text>



                                <Text style={[font.bold, font.sizeLarge, color.myOrangeColor, { textAlign: "center", marginBottom: "10%" }]}>CONTACT</Text>

                                <Text style={[font.regular, font.sizeRegular, color.darkgrayColor, { textAlign: "justify", lineHeight: 14 + 14 * 1 }]}>

                                    {contact_text}

                                </Text>





                            </ScrollView>

                        </View>

                    }



                    {this.state.privacymodal &&

                        <View height={"90%"} width={'100%'}

                            style={{

                                marginTop: '10%', padding: '3%',



                            }}>

                            <ScrollView keyboardShouldPersistTaps={"always"}>

                                <Text style={[font.bold, font.sizeLarge, color.myOrangeColor, { textAlign: "center", marginBottom: "10%" }]}>Privacy Policy</Text>



                                <Text style={[font.regular, font.sizeRegular, color.darkgrayColor, { textAlign: "justify", lineHeight: 14 + 14 * 1 }]}>

                                    {privacyPolicy}

                                </Text>

                                <Text style={[font.bold, font.sizeLarge, color.myOrangeColor, { textAlign: "center", marginBottom: "10%" }]}>Information Collection and Use</Text>

                                <Text style={[font.regular, font.sizeRegular, color.darkgrayColor, { textAlign: "justify", lineHeight: 14 + 14 * 1 }]}>

                                    {information_collection_and_use}

                                </Text>

                                <Text style={[font.bold, font.sizeLarge, color.myOrangeColor, { textAlign: "center", marginBottom: "10%" }]}>Location Information</Text>

                                <Text style={[font.regular, font.sizeRegular, color.darkgrayColor, { textAlign: "justify", lineHeight: 14 + 14 * 1 }]}>

                                    {location_information}

                                </Text>



                                <Text style={[font.bold, font.sizeLarge, color.myOrangeColor, { textAlign: "center", marginBottom: "10%" }]}>Camera</Text>

                                <Text style={[font.regular, font.sizeRegular, color.darkgrayColor, { textAlign: "justify", lineHeight: 14 + 14 * 1 }]}>

                                    {camera}

                                </Text>



                                <Text style={[font.bold, font.sizeLarge, color.myOrangeColor, { textAlign: "center", marginBottom: "10%" }]}>Cookies</Text>

                                <Text style={[font.regular, font.sizeRegular, color.darkgrayColor, { textAlign: "justify", lineHeight: 14 + 14 * 1 }]}>

                                    {cookies}

                                </Text>





                                <Text style={[font.bold, font.sizeLarge, color.myOrangeColor, { textAlign: "center", marginBottom: "10%" }]}>Service Providers</Text>

                                <Text style={[font.regular, font.sizeRegular, color.darkgrayColor, { textAlign: "justify", lineHeight: 14 + 14 * 1 }]}>

                                    {service_providers}

                                </Text>





                                <Text style={[font.bold, font.sizeLarge, color.myOrangeColor, { textAlign: "center", marginBottom: "10%" }]}>Security</Text>

                                <Text style={[font.regular, font.sizeRegular, color.darkgrayColor, { textAlign: "justify", lineHeight: 14 + 14 * 1 }]}>

                                    {security}

                                </Text>





                                <Text style={[font.bold, font.sizeLarge, color.myOrangeColor, { textAlign: "center", marginBottom: "10%" }]}>Links to Other Sites</Text>

                                <Text style={[font.regular, font.sizeRegular, color.darkgrayColor, { textAlign: "justify", lineHeight: 14 + 14 * 1 }]}>

                                    {links_to_other_sites}

                                </Text>

                                <Text style={[font.bold, font.sizeLarge, color.myOrangeColor, { textAlign: "center", marginBottom: "10%" }]}>USER ACCOUNT DELETION</Text>

                                <Text style={[font.regular, font.sizeRegular, color.darkgrayColor, { textAlign: "justify", lineHeight: 14 + 14 * 1 }]}>

                                    {user_account_deletion}

                                </Text>





                                <Text style={[font.bold, font.sizeLarge, color.myOrangeColor, { textAlign: "center", marginBottom: "10%" }]}>Children's Privacy</Text>

                                <Text style={[font.regular, font.sizeRegular, color.darkgrayColor, { textAlign: "justify", lineHeight: 14 + 14 * 1 }]}>

                                    {children_privacy}

                                </Text>



                                <Text style={[font.bold, font.sizeLarge, color.myOrangeColor, { textAlign: "center", marginBottom: "10%" }]}>Changes To Privacy Policy</Text>

                                <Text style={[font.regular, font.sizeRegular, color.darkgrayColor, { textAlign: "justify", lineHeight: 14 + 14 * 1 }]}>

                                    {changes_to_privacy_policy}

                                </Text>



                                <Text style={[font.bold, font.sizeLarge, color.myOrangeColor, { textAlign: "center", marginBottom: "10%" }]}>Contact Us</Text>

                                <Text style={[font.regular, font.sizeRegular, color.darkgrayColor, { textAlign: "justify", lineHeight: 14 + 14 * 1 }]}>

                                    {contact_us}

                                </Text>





                            </ScrollView>

                        </View>

                    }



                    {this.state.aboutUs &&

                        <View height={"100%"} width={'100%'}

                            style={{

                                padding: '3%',

                                // justifyContent:'space-around'

                            }}>

                            <View keyboardShouldPersistTaps={"always"}

                                style={[box.centerBox, box.shadow_box,

                                {

                                    flex: 0,

                                    shadowColor: color.myOrangeColor.color

                                }]}>

                                <Text style={[

                                    font.bold,

                                    font.sizeDoubleLarge,

                                    color.myOrangeColor, {

                                        textAlign: 'center'

                                    }

                                ]}>About Us</Text>



                                <Text style={

                                    [

                                        font.semibold,

                                        font.sizeExtraLarge,

                                        color.grayColor, {

                                            textAlign: 'left',





                                            //marginTop: "10%"

                                        }]}>

                                    Workspace solutions by BeRightHere.com

                                    caters to businesses of all sizes –

                                    enterprises, global firms and startups.

                                    Whether you are responsible for seating

                                    thousands of employees across markets or

                                    just need one hotdesk, the answer to your

                                    woes is closer than you think.

                                </Text>



                            </View>





                            <View style={[box.centerBox, {/* backgroundColor: 'pink', */ height: 200, flex: 0,

                                marginTop: 50



                            }]}>

                                <Text style={[font.semibold,

                                font.sizeMedium, color.myOrangeColor]}>Contact Us</Text>

                                <View style={[box.horizontalBox]}>

                                    <View>

                                        <Text style={[font.semibold,

                                        font.sizeRegular, color.darkgrayColor]}>Email: </Text>

                                        <TouchableOpacity onPress={() => {

                                            Platform.OS === 'android'?

                                            Linking.openURL('mailto:support@berighthere.com?subject=SendMail&body=I have a query'):

                                            (

                                                Linking.canOpenURL('mailto:support@berighthere.com?subject=SendMail&body=I have a query')

                                            ).then(result=>{

                                                console.log(result);

                                                if(result){

                                                    Linking.openURL('mailto:support@berighthere.com?subject=SendMail&body=I have a query');

                                                }



                                            })

                                        }}>

                                            <Text style={[font.semibold,

                                            font.sizeVeryRegular, color.darkgrayColor]}>support@berighthere.com</Text>

                                        </TouchableOpacity>



                                    </View>



                                    <View>

                                        <Text style={[font.semibold,

                                        font.sizeRegular, color.darkgrayColor]}>Phone: </Text>

                                        <TouchableOpacity onPress={() => {

                                            console.log('number clicked')

                                            let number = '';

                                            if (Platform.OS === 'ios') {

                                                number = 'telprompt:${8550099887}';

                                            }

                                            else {

                                                number = 'tel:${8550099887}';

                                            }

                                            Platform.OS === 'ios'?

                                            Linking.openURL(number):

                                            (

                                                Linking.canOpenURL(number).then(result=>{

                                                    console.log(result);

                                                    if(result){

                                                        Linking.openURL(number);

                                                    }

                                                })

                                            );

                                        }}>

                                            <Text style={[font.semibold,

                                            font.sizeVeryRegular, color.darkgrayColor]}>+91-8550099887</Text>

                                        </TouchableOpacity>





                                    </View >

                                </View>



                                <View>

                                    <Text style={[font.semibold,

                                    font.sizeRegular, color.darkgrayColor]}>Website</Text>

                                    <TouchableOpacity onPress={() => {

                                        Linking.openURL('https://www.berighthere.com/');

                                    }}>

                                        <Text style={[font.semibold,

                                        font.sizeVeryRegular, color.darkgrayColor]}>www.berighthere.com</Text>



                                    </TouchableOpacity>



                                </View>

                            </View>

                        </View>

                    }



                </View>

            </Drawer>

        );



    }

}