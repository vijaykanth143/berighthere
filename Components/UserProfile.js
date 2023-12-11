import React, { Component } from 'react';
import { View, Text, Image, Switch, SafeAreaView, BackHandler, Dimensions, Platform, TextInput, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Session from '../config/Session';
import box from '../Styles/box';
import color from '../Styles/color';
import font from '../Styles/font';
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import renderItem from '../Styles/renderItem';
import button from '../Styles/button';
import Modal from 'react-native-modalbox';
import { deleteEmployee, deleteMember, getCities, getCountries, getStates, updateUserProfileMember } from '../Rest/userAPI';
import CommonHelpers from '../Utils/CommonHelpers';
import Spinner from '../UI/Spinner';
import * as ImagePicker from 'react-native-image-picker';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import storage from "../StoragePermissions/storage";
import image from '../Styles/image';
import { AWS_URL } from '../config/RestAPI';
import DatePicker from 'react-native-date-picker'
import moment from 'moment';
import Geocoder from 'react-native-geocoding';
import { SinglePickerMaterialDialog } from 'react-native-material-dialog';

Geocoder.init("AIzaSyDgQlUgbgkWodIedIBpYIE8dMZJ7jjbbfA", { language: "en" });

export default class UserProfile extends Component {

    constructor(props) {
        super(props);
        this.state = {
            name: '',
            nameEdit: false,
            emp_code: '',
            crp_name: '',
            crp_contact: '',
            crp_number: '',
            crp_number_error: true,
            crp_number_edit: false,
            crp_email: '',
            crp_email_edit: false,
            dob: '',
            dob_edit: false,
            phone_number: '',
            phone_number_error: true,
            phone_number_edit: false,
            email_id: '',
            email_edit: false,
            address: '',
            address1: '',
            address2: '',
            address_edit: false,
            isEnabled: false,
            spinner: false,

            phonenumberforAPI: '',
            user_pic: null,
            showOptions: false,
            imageDetails: null,
            latitude: null,
            longitude: null,
            state: null,
            city: null,
            country: null,
            pin: null,
            city_edit: false,
            state_edit: false,
            country_edit: false,
            pin_edit: false,
            allCountries: [],
            allstates: [],
            allcities: [],
            showCountriesList: false, 
            showStatesList: false, 
            showCitiesList: false,
            selectedCountry: null, 
            selectedState: null, 
            selectedCity: null,

            state_id: null, 
            city_id: null, 
            country_id: null, 

        }
    }

    componentWillUnmount() {
        if (this.backhandler)
            this.backhandler.remove();
    }

    componentDidMount = async () => {

        this.backhandler = BackHandler.addEventListener('hardwareBackPress', () => {
            this.props.navigation.goBack();
            return true;
        })

        storage.checkCamera().then(result => {
            if (result) {
                //console.log("camera accessible")
            }
            else {
                storage.requestCameraPermission();
            }
        }).catch(error => {
            //console.log(error) 
        });

        let details = await Session.getUserDetails();
        details = JSON.parse(details);

        console.log("user details: ", details);
        this.setState({
            name: details.name,
            emp_code: details.id,
            crp_name: details.company_name,
            crp_contact: details.contact_person,
            crp_number: details.contact_number,
            crp_email: details.department_id,
            dob: details.dob,
            phone_number: details.mobile_no,
            phonenumberforAPI: details.mobile_no,
            email_id: details.email,
            address: details.address1 + ' ' + details.address2,
            address1: details.address1 == 'null' ? '' : details.address1,
            address2: details.address2 == 'null' ? '' : details.address2,
            role_id: details.role_id,
            user_pic: { uri: AWS_URL + details.profile_img_path },
            state_id: details.state_id, 
            city_id: details.city_id, 
            country_id: details.country_id, 


        }, async()=>{
            console.log(this.state.country_id, this.state.city_id, this.state.state_id, (this.state.country_id == '0' || this.state.state_id == '0', this.state.city_id == '0'), );
            let coords = (this.state.country_id == '0' || this.state.state_id == '0', this.state.city_id == '0') ? JSON.parse(await Session.getLocationCoords()) : null;
          //  console.log(coords != 'null' , coords != null , coords != undefined)
            (coords != 'null' && coords != null && coords != undefined) ?
                this.setState({
                    latitude: coords.coords.latitude,
                    longitude: coords.coords.longitude,
                }, () => {
                    this.getReverseGeocoding();
                    
                }) : null
    
                this.getAllCountries();

        })

       
    }

    getAllCountries=()=>{
        getCountries().then((result)=>{
            this.setState({
                allCountries: result.dataArray,
            }, ()=>{
                if(this.state.country_id != '0' && this.state.country_id != null){
                    this.state.allCountries.map((row, index) => {

                        if(Number(row.id) == Number(this.state.country_id))
                       { 
                        this.setState({
                            selectedCountry: row,
                            country: row.name
                           
                        },()=>{
                            this.getStates();
                        })
                    }
                    
                    })

                }
               // console.log(this.state.allCountries[0])
            })
        }
        );
    }

    getStates=()=>{
        const params = {
            'country_id': this.state.selectedCountry.id,
        }

        getStates(params).then((result)=>{
            this.setState({
                allstates: result.dataArray,
                
            },()=>{
                if(this.state.state_id != '0' || this.state.state_id != null){
                    this.state.allstates.map((row, index) => {

                        if(Number(row.id) == Number(this.state.state_id))
                       { 
                        this.setState({
                            selectedState: row,
                            state: row.name
                        },()=>{
                            this.getCities();
                        })
                    }
                    
                    })

                }
            })
        })
    }

    getCities = ()=>{
        const params = {
            state_id: this.state.selectedState.id,
        }

        getCities(params).then((result)=>{
            this.setState({
                allcities: result.dataArray, 
                

            },()=>{
                if(this.state.city_id != '0' || this.state.city_id != null){
                    this.state.allcities.map((row, index) => {

                        if(Number(row.id) == Number(this.state.city_id))
                       { 
                        this.setState({
                            selectedCity: row,
                            city: row.name
                        })
                    }
                    
                    })

                }
            })
        })
    }

    onPhoneTextChange = (phoneVal) => {
        console.warn("testing " + phoneVal.length);

        var phone = phoneVal.replace(/[^\d]/g, "");
        //console.log("phone number1 is ", phone)
        if (phone.length > 10) {
            phone = phone.substring(0, 10)
        }

        if (phone.length == 0) {
            phone = phone;
        }
        else if (phone.length < 4) {
            phone = phone;
            //console.log(phone);
        } else if (phone.length == 4) {
            phone = phone.substring(0, 4) + '-'
        }
        else {
            phone = phone.substring(0, 4) + '-' + phone.substring(4, 10)
        }

        return phone;

    }

    deleteMemberAccount = async () => {
        this.setState({
            spinner: true
        });
        let mobileNumber = this.state.phone_number;
        if (mobileNumber.length > 10) {
            mobileNumber = this.state.phone_number.split('-')[0] + this.state.phone_number.split('-')[1];

        }

        const params = {
            'email': this.state.email_id,
            'status': 0,
            'mobileNo': mobileNumber,
            'name': this.state.name,

        }
        deleteMember(params).then(async (result) => {

            if (result.status) {
                await Session.setUserDetails({});
                await Session.setUserToken('');
                await Session.setUserId('');
                await Session.setUserName('');
                this.props.navigation.push('auth', { screen: 'Login' });
                CommonHelpers.showFlashMsg('User Account deleted successfully.', 'success');
            }
            else {
                CommonHelpers.showFlashMsg(result.message, 'danger');
            }
            this.setState({
                spinner: false
            })
        })
    }
    deleteEmployeeAccount = async () => {
        this.setState({
            spinner: true
        })
        const params = {
            'employee_id': Number(await Session.getUserId()),
            'status': 0,


        }
        deleteEmployee(params).then(async (result) => {

            if (result.status) {
                await Session.setUserDetails({});
                await Session.setUserToken('');
                await Session.setUserId('');
                await Session.setUserName('');
                this.props.navigation.push('auth', { screen: 'Login' });
                CommonHelpers.showFlashMsg('User Account deleted successfully.', 'success');
            }
            else {
                CommonHelpers.showFlashMsg(result.message, 'danger');
            }
            this.setState({
                spinner: false
            })
        })
    }

    updateUserProfile = async () => {

        let details = await Session.getUserDetails();
        details = JSON.parse(details);
        //console.log('details:', details, details.mobile_no);
        let mobileNumber = this.state.phone_number;
        if (mobileNumber.length > 10) {
            mobileNumber = this.state.phone_number.split('-')[0] + this.state.phone_number.split('-')[1];
        }
        const params = new FormData();
        this.state.imageDetails != null ?
            params.append('profile_img_path', { name: this.state.imageDetails.assets[0].fileName, type: this.state.imageDetails.assets[0].type, uri: this.state.imageDetails.assets[0].uri }) :
            params.append('profile_img_path', null);
        const otherDetails = {
            'name': 'sai sheela',//details.name,
            'email': details.email,
            'mobileNo': details['mobile_no'],

            'dob': this.state.dob,
            'address1': this.state.address1,//details.address1,
            'address2': this.state.address2,
            'city_id': (this.state.selectedCity != null && this.state.selectedCountry != null) ? this.state.selectedCity.id: (this.state.selectedCity == null && this.state.selectedCountry != null)? '0' : details.city_id,
            'country_id':  this.state.selectedCountry != null ? this.state.selectedCountry.id:  details.country_id,
            'state_id': (this.state.selectedState != null && this.state.selectedCountry != null) ? this.state.selectedState.id :(this.state.selectedState == null && this.state.selectedCountry != null)? '0':details.state_id,
            'postal_code': details.postal_name,
            'company_name': details.company_name,
            'on_boarding_mode': details.on_boarding_mode,
            'contact_number': details.contact_number,
            'latitude': details.latitude,
            'longitude': details.longitude,
            'is_verified': details.is_verified,
            'is_document_verified': details.is_document_verified,
            'user_code': details.user_code,
            'contact_person': details.contact_person,

            'status': 1,
            'roleId': await Session.getRoleId(),

        }

        Object.keys(otherDetails).forEach((key) => {
            params.append(key, otherDetails[key]);
        });
        //console.log('params for update: ', JSON.stringify(params));


        updateUserProfileMember(params).then(result => {
            //console.log('update result', result);
            if (result.status) {
                CommonHelpers.showFlashMsg(result.message, 'success');
                Session.setUserName(result.name);
                Session.setUserDetails(result.dataArray);
            }
            else {
                CommonHelpers.showFlashMsg(result.message, 'danger');
            }
        })
    }

    captureImage = async () => {
        this.setState({
            showOptions: false,
        })
        let options = {
            storageOptions: {
                mediaType: 'photo',
                path: 'images',
                saveToPhotos: true,
            },
            //includeBase64: true,
        }
        await ImagePicker.launchCamera(options, (response) => {
            if (response.errorCode == 'camera_unavailable') {
                CommonHelpers.showFlashMsg('camera Unavailable', 'danger')
            } else if (!response.didCancel) {
                //console.log(response);
                this.setState({
                    imageDetails: response,
                    user_pic: { uri: response.assets[0].uri }
                }, () => {
                    this.updateUserProfile();
                })

            }

        }).catch(err => {
            //console.log(err)
        })
    }
    openGallery = async () => {
        this.setState({
            showOptions: false,
        })
        let options = {
            storageOptions: {
                mediaType: 'photo',
                path: 'images',
                saveToPhotos: true
            },
            //includeBase64: true,
        }
        await ImagePicker.launchImageLibrary(options).then((response) => {
            if (!response.didCancel) {
                //console.log(response);
                this.setState({
                    imageDetails: response,
                    user_pic: { uri: response.assets[0].uri }
                }, () => {
                    this.updateUserProfile();
                })
            }

        }).catch(error => { //console.log(error) 
        })


    }

    getReverseGeocoding = () => {
        let country = 'hi';
        //console.log(this.state.latitude, this.state.longitude)
        Geocoder.from({
            longitude: "77.5863",
            latitude: "14.6777",
            /*  latitude: this.state.latitude, 
             longitude: this.state.longitude */
        })
            .then(json => {
                //console.log(JSON.stringify(json))
                var addressComponent = json.results[0].address_components;
                //console.log(addressComponent);
                addressComponent.forEach((item, index) => {
                    //console.log(item.types[0])
                    const value = item.types[0];

                    switch (value) {
                        case "postal_code":  //console.log(item.long_name)
                            this.setState({
                                pin: item.long_name
                            });
                            break;
                        case "administrative_area_level_3":  //console.log(item.long_name)
                            this.setState({
                                city: item.long_name
                            });
                            break;
                        case "administrative_area_level_1":   //console.log(item.long_name)
                            this.setState({
                                state: item.long_name
                            })
                            break;
                        case 'country':  //console.log(item.long_name)
                            this.setState({
                                country: item.long_name
                            })
                            break;
                    }
                })
            })
            .catch(error => console.warn(error));

        return country;
    }

    render() {
        return (

            <SafeAreaView style={Platform.OS === 'ios' ? null : { paddingTop: '5%', flex: 1, }} >

                <View height={100} style={{ flexDirection: 'row', paddingTop: 10, /* flex: 1, */ alignItems: 'center' }}>
                    <View style={{ flex: 1, alignItems: 'center' }}>
                        <TouchableOpacity onPress={() => {
                            this.props.navigation.goBack();
                        }}>
                            <Icon name="angle-left" color="black" size={30} />
                        </TouchableOpacity>

                    </View>
                    <View style={{ flex: 2, alignItems: 'center' }}>
                        <Text style={[color.myOrangeColor, font.regular, font.sizeMedium, font.bold,]}>My Profile</Text>
                    </View>
                    <View style={{ flex: 1, alignItems: 'flex-start' }}>
                    </View>
                </View>

                <KeyboardAwareScrollView keyboardShouldPersistTaps={'always'} style={{ marginBottom: 100, }}>

                    <View style={{
                        height: 200,

                        width: '100%'
                    }}>
                        {
                            this.state.user_pic == null ?
                                <TouchableOpacity onPress={() => {
                                    this.setState({
                                        showOptions: true
                                    })

                                }}>
                                    <MaterialIcon
                                        name='person-pin'
                                        size={150}
                                        color={color.grayColor.color}
                                        style={{
                                            alignSelf: 'center'
                                        }}
                                    />

                                </TouchableOpacity>
                                :
                                <TouchableOpacity
                                    onPress={() => {
                                        this.setState({
                                            showOptions: true,
                                        })
                                    }}>
                                    <Image

                                        source={this.state.user_pic}
                                        style={[image.imageContain, {
                                            width: 150,
                                            height: 150,
                                            alignSelf: 'center',
                                            borderRadius: 75
                                        }]}
                                    />

                                </TouchableOpacity>
                        }

                        <TouchableOpacity onPress={() => {
                            this.setState({
                                showOptions: true,
                            })
                        }}>
                            {this.state.user_pic == null ?
                                <Text style={[
                                    font.bold,
                                    font.sizeRegular,
                                    color.myOrangeColor,
                                    {
                                        textAlign: 'center'
                                    }
                                ]}>Upload Profile Picture</Text> :
                                <Text style={[
                                    font.bold,
                                    font.sizeRegular,
                                    color.myOrangeColor,
                                    {
                                        textAlign: 'center'
                                    }
                                ]}>Change Profile Picture</Text>}

                        </TouchableOpacity>
                    </View>
                    {/* name */}
                    <View
                        height={60}
                        width={'90%'}
                        style={[
                            button.defaultRadius,
                            {
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                padding: '5%',
                                borderColor: color.textWhiteColor.color,
                                alignSelf: 'center'
                            }
                        ]}
                    >
                        <TextInput
                            placeholder='Name'
                            editable={this.state.nameEdit}
                            style={[renderItem.inputBox, { width: '90%', borderBottomWidth: 0, color: color.blackColor.color }]}
                            value={this.state.name}
                            onChangeText={(val) => {
                                this.setState({
                                    name: val
                                })
                            }}
                        />
                        {/*  <TouchableOpacity onPress={() => {
                            this.setState({
                                nameEdit: !this.state.nameEdit
                            })
                        }}>
                            <Icon name='pencil' size={20} color={this.state.nameEdit ? color.myOrangeColor.color : color.grayColor.color} />
                        </TouchableOpacity> */}
                    </View>
                    {/* name ends */}

                    {/* member / employee code */}
                    {/*   <View
                        height={60}
                        width={'90%'}
                        style={[
                            button.defaultRadius,
                            {
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                padding: '5%',
                                borderColor: color.myOrangeColor.color,
                                alignSelf: 'center',
                                marginTop: 10
                            }
                        ]}
                    >
                        <TextInput
                            placeholder='Member/ Employee Code'
                            value={this.state.emp_code}
                            editable={false}
                            style={[renderItem.inputBox, { width: '90%', borderBottomWidth: 0, color: color.blackColor.color}]}

                        />
                         <Icon name = 'pencil'/> 

                    </View> */}
                    {/* member /employee code ends */}

                    {/* Company name */}
                    {/*   <View
                        height={60}
                        width={'90%'}
                        style={[
                            button.defaultRadius,
                            {
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                padding: '5%',
                                borderColor: color.myOrangeColor.color,
                                alignSelf: 'center',
                                marginTop: 10
                            }
                        ]}
                    >
                        <TextInput
                            placeholder='Corporate Name'
                            value={this.state.crp_name}
                            editable={false}
                            style={[renderItem.inputBox, { width: '90%', borderBottomWidth: 0, color: color.blackColor.color}]}
                        />
                        { <Icon name = 'pencil' color = {this.state.nameEdit ? color.darkgrayColor.color: color.lightGray.color}/> }

                    </View> */}
                    {/* Company name*/}


                    {/* Company Contact */}
                    {/*  <View
                        height={60}
                        width={'90%'}
                        style={[
                            button.defaultRadius,
                            {
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                padding: '5%',
                                borderColor: color.myOrangeColor.color,
                                alignSelf: 'center',
                                marginTop: 10
                            }
                        ]}
                    >
                        <TextInput
                            placeholder='Corporate Contact'
                            value={this.state.crp_contact}
                            editable={false}
                            style={[renderItem.inputBox, { width: '90%', borderBottomWidth: 0, }]}
                        />
                        {/* <Icon name = 'pencil' color = {this.state.nameEdit ? color.darkgrayColor.color: color.lightGray.color}/> }

                    </View> */}
                    {/* Company Contact*/}

                    {/* Company Number */}
                    {/*   <View
                        height={60}
                        width={'90%'}
                        style={[
                            button.defaultRadius,
                            {
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                padding: '5%',
                                borderColor: color.myOrangeColor.color,
                                alignSelf: 'center',
                                marginTop: 10
                            }
                        ]}
                    >
                        <TextInput
                            placeholder='Corporate Number'
                            keyboardType='phone-pad'
                            value={this.state.crp_number}
                            editable={this.state.crp_number_edit}
                            onChangeText={(val) => {
                                this.setState({
                                    crp_number: this.onPhoneTextChange(val),
                                    crp_number_error: false,
                                }, () => { 
                                    //console.log("final phone number: ", this.state.crp_number) 
                                });

                            }}
                            style={[renderItem.inputBox, { width: '90%', borderBottomWidth: 0, }]}
                        />
                        {/* <TouchableOpacity onPress={() => {
                            this.setState({
                                crp_number_edit: !this.state.crp_number_edit,
                            })
                        }}>

                            <Icon name='pencil' size={20} color={this.state.crp_number_edit ? color.myOrangeColor.color : color.grayColor.color} />

                        </TouchableOpacity> }
                        { }

                    </View> */}
                    {/* Company Number*/}

                    {/* Company email */}
                    {/*  <View
                        height={60}
                        width={'90%'}
                        style={[
                            button.defaultRadius,
                            {
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                padding: '5%',
                                borderColor: color.myOrangeColor.color,
                                alignSelf: 'center',
                                marginTop: 10
                            }
                        ]}
                    >
                        <TextInput
                            placeholder='Corporate Email'
                            keyboardType='email-address'
                            value={this.state.crp_email}
                            editable={this.state.crp_email_edit}
                            onChangeText={(val) => {
                                this.setState({
                                    crp_email: val,
                                })
                            }}
                            style={[renderItem.inputBox, { width: '90%', borderBottomWidth: 0, }]}
                        />
                         <TouchableOpacity onPress={() => {
                            this.setState({
                                crp_email_edit: !this.state.crp_email_edit,
                            })
                        }}>

                            <Icon name='envelope' size={20} color={this.state.crp_email_edit ? color.myOrangeColor.color : color.grayColor.color} />

                        </TouchableOpacity> 
                        { }

                    </View> */}
                    {/* Company email*/}


                    {/*Date of birth. */}
                    <View
                        height={60}
                        width={'90%'}
                        style={[
                            button.defaultRadius,
                            {
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                padding: '5%',
                                borderColor: color.textWhiteColor.color,
                                alignSelf: 'center',
                                marginTop: 10
                            }
                        ]}
                    >

                        <Text style={[{
                            width: '90%',
                            alignSelf: 'center',
                            // backgroundColor: 'red'
                        }]}>
                            {this.state.dob == 'null' ? 'Date of Birth' : moment(this.state.dob).format('DD MMM YYYY')}
                        </Text>
                        <TouchableOpacity onPress={() => {
                            this.setState({
                                dob_edit: !this.state.dob_edit,
                            })
                        }}>

                            <Icon name='pencil' size={20} color={this.state.dob_edit ? color.myOrangeColor.color : color.grayColor.color} />

                        </TouchableOpacity>


                    </View>
                    {/* date of joining*/}


                    {/* User Number */}
                    <View
                        height={60}
                        width={'90%'}
                        style={[
                            button.defaultRadius,
                            {
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                padding: '5%',
                                borderColor: color.textWhiteColor.color,
                                alignSelf: 'center',
                                marginTop: 10
                            }
                        ]}
                    >
                        <TextInput
                            placeholder='My Phone Number'
                            keyboardType='phone-pad'
                            value={this.state.phone_number}
                            editable={this.state.phone_number_edit}
                            onChangeText={(val) => {
                                this.setState({
                                    phone_number: this.onPhoneTextChange(val),
                                    phone_number_error: false,
                                    phonenumberforAPI: val,
                                }, () => {
                                    //console.log("final phone number: ", this.state.phone_number) 
                                });
                            }}
                            style={[renderItem.inputBox, { width: '90%', borderBottomWidth: 0, color: color.blackColor.color }]}
                        />
                        {/*  <TouchableOpacity onPress={() => {
                            this.setState({
                                phone_number_edit: !this.state.phone_number_edit,
                            })
                        }}>

                            <Icon name='pencil' size={20} color={this.state.phone_number_edit ? color.myOrangeColor.color : color.grayColor.color} />

                        </TouchableOpacity> */}
                        { }

                    </View>
                    {/* User Number*/}


                    {/* user email */}
                    <View
                        height={60}
                        width={'90%'}
                        style={[
                            button.defaultRadius,
                            {
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                padding: '5%',
                                borderColor: color.textWhiteColor.color,
                                alignSelf: 'center',
                                marginTop: 10
                            }
                        ]}
                    >
                        <TextInput
                            placeholder='My Email ID'
                            keyboardType='email-address'
                            value={this.state.email_id}
                            editable={this.state.email_edit}
                            onChangeText={(val) => {
                                this.setState({
                                    email_id: val,
                                })
                            }}
                            style={[renderItem.inputBox, { width: '90%', borderBottomWidth: 0, color: color.blackColor.color }]}
                        />
                        {/*  <TouchableOpacity onPress={() => {
                            this.setState({
                                email_edit: !this.state.email_edit,
                            })
                        }}>

                            <Icon name='envelope' size={20} color={this.state.email_edit ? color.myOrangeColor.color : color.grayColor.color} />

                        </TouchableOpacity> */}
                        { }

                    </View>
                    {/* user email*/}

                    {/* address */}
                    <View
                        //height = {60} 
                        width={'90%'}
                        style={[
                            button.defaultRadius,
                            {
                                marginTop: 10,
                                alignItems: 'center',
                                justifyContent: 'flex-start',
                                borderColor: color.textWhiteColor.color,
                                alignSelf: 'center'
                            }
                        ]}>
                        <View
                            height={60}

                            style={[

                                {
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',

                                    alignSelf: 'center'
                                }
                            ]}
                        >
                            <Text style={[font.regular, font.sizeRegular, color.myOrangeColor, { width: '90%' }]}>Address</Text>
                            <TouchableOpacity onPress={() => {
                                this.setState({
                                    address_edit: !this.state.address_edit
                                })
                            }}>
                                <Icon name='pencil' size={20} color={this.state.address_edit ? color.myOrangeColor.color : color.grayColor.color} />
                            </TouchableOpacity>
                        </View>

                        <TextInput
                            placeholder='Address Line 1'
                            multiline={true}
                            value={this.state.address1}
                            style={[renderItem.inputBox, {
                                borderBottomWidth: 0.1,
                                height: 100,
                                width: '90%',
                                height: 60,
                            }]}
                            editable={this.state.address_edit}
                            onChangeText={(val) => {
                                this.setState({
                                    address1: val
                                })
                            }}
                        />
                        <TextInput
                            placeholder='Address Line 2'
                            multiline={true}
                            value={this.state.address2 == null ? '' : this.state.address2}
                            style={[renderItem.inputBox, {
                                borderBottomWidth: 0.1,
                                height: 100,
                                width: '90%',
                                height: 60,
                            }]}
                            editable={this.state.address_edit}
                            onChangeText={(val) => {
                                this.setState({
                                    address2: val
                                })
                            }}
                        />
                        
                        <View style={[box.horizontalBox, {
                           width: '100%',
                           height: 80, 
                        }]}>
                            <View width ={'100%'} >
                                <View style = {[box.horizontalBox]}>
                                <Text style = {[
                                        font.regular, 
                                        font.sizeRegular, 
                                        color.darkgrayColor
                                     ]}>Country</Text>
                                      <TouchableOpacity onPress={() => {
                                this.setState({
                                    country_edit: !this.state.country_edit
                                })
                            }}>
                                <Icon name='pencil' size={20} color={this.state.country_edit ? color.myOrangeColor.color : color.grayColor.color} />
                            </TouchableOpacity>


                                </View>
                                {
                                    this.state.country_edit ?
                                    <TouchableOpacity 
                                    style = { [button.defaultRadius,{
                                        width: Dimensions.get('window').width * 0.4,
                                        borderColor: color.grayBorderColor.borderColor
                                    }]} 
                                    onPress={()=>{
                                        this.setState({
                                            showCountriesList: true, 
                                        })
                                    }}>
                                        <Text style = {[
                                        font.semibold, 
                                        font.sizeRegular, 
                                        color.darkgrayColor,
                                       
                                     ]}>{this.state.country}</Text>


                                    </TouchableOpacity>
                                   
                                     : 
                                
                                
                                <Text style = {[
                                        font.semibold, 
                                        font.sizeRegular, 
                                        color.darkgrayColor,
                                        {
                                           // width: Dimensions.get('window').width * 0.81,
                                        }
                                     ]}>{this.state.country}</Text>}
                            </View>
                          


                            {/* <View  >
                                <View style = {[box.horizontalBox, ]}>
                                <Text style = {[
                                        font.regular, 
                                        font.sizeRegular, 
                                        color.darkgrayColor
                                     ]}>Pin Code</Text>
                                     <TouchableOpacity onPress={() => {
                                this.setState({
                                    pin_edit: !this.state.pin_edit
                                })
                            }}>
                                <Icon name='pencil' size={20} color={this.state.pin_edit ? color.myOrangeColor.color : color.grayColor.color} />
                            </TouchableOpacity>


                                </View>
                                
                                     {
                                        this.state.pin_edit ?
                                        <TextInput
                            placeholder='Pin Code'
                            multiline={false}
                            keyboardType='number-pad'
                            maxLength={6}
                            value={this.state.pin == null ? '' : this.state.pin}
                            style={[renderItem.inputBox, {
                                borderBottomWidth: 0.1,
                                height: 100,
                                width: Dimensions.get('window').width * 0.4,
                                height: 60,
                            }]}
                            editable={this.state.pin_edit}
                            onChangeText={(val) => {
                                this.setState({
                                    pin: val
                                })
                            }}
                        /> :     
                                <Text style = {[
                                        font.semibold, 
                                        font.sizeRegular, 
                                        color.darkgrayColor,
                                            {
                                                width: Dimensions.get('window').width * 0.4,
                                            }
                                        
                                     ]}>{this.state.pin}</Text>
                                }
                            </View>
 */}
                        </View>



                        <View style={[box.horizontalBox, {
                            width: '100%',
                            height: 80, 
                            
                        }]}>
                             <View width = {'45%'} >
                                <View style = {[box.horizontalBox, ]}>
                                <Text style = {[
                                        font.regular, 
                                        font.sizeRegular, 
                                        color.darkgrayColor
                                     ]}>
                                    State
                                </Text>
                                <TouchableOpacity onPress={() => {
                                this.setState({
                                    state_edit: !this.state.state_edit
                                })
                            }}>
                                <Icon name='pencil' size={20} color={this.state.state_edit ? color.myOrangeColor.color : color.grayColor.color} />
                            </TouchableOpacity>

                                </View>
                                {
                                    this.state.state_edit ?
                                    <TouchableOpacity 
                                    onPress={()=>{
                                        this.setState({
                                            showStatesList: true,
                                        })
                                    }}
                                    style= {[button.defaultRadius, color.grayBorderColor]}>
                                        <Text style = {[
                                        font.semibold, 
                                        font.sizeRegular, 
                                        color.darkgrayColor, {
                                            width: Dimensions.get('window').width *0.4
                                        }
                                     ]}>{this.state.state}</Text>
                                    </TouchableOpacity>
                                    
                                    : 
                                
                                
                                <Text style = {[
                                        font.semibold, 
                                        font.sizeRegular, 
                                        color.darkgrayColor, {
                                            width: Dimensions.get('window').width *0.4
                                        }
                                     ]}>{this.state.state}</Text>}
                            </View>
                            <View width = {'45%'} >
                                <View style={[box.horizontalBox]}>
                                    <Text style = {[
                                        font.regular, 
                                        font.sizeRegular, 
                                        color.darkgrayColor
                                     ]}>
                                        City
                                    </Text>
                                    <TouchableOpacity onPress={() => {
                                this.setState({
                                    city_edit: !this.state.city_edit
                                })
                            }}>
                                <Icon name='pencil' size={20} color={this.state.city_edit ? color.myOrangeColor.color : color.grayColor.color} />
                            </TouchableOpacity>




                                </View>

                                {
                                    this.state.city_edit ?
                                    <TouchableOpacity 
                                    onPress ={()=>{
                                        this.setState({
                                            showCitiesList: true, 
                                        })
                                    }}
                                    style={[button.defaultRadius,color.grayBorderColor, ]}>
                                        <Text style = {[
                                        font.semibold, 
                                        font.sizeRegular, 
                                        color.darkgrayColor,
                                        {
                                            width: Dimensions.get('window').width * 0.4,
                                        }
                                     ]}>{this.state.city}</Text>

                                    </TouchableOpacity>
                                    
                                    
                                    
                                     : <Text style = {[
                                        font.semibold, 
                                        font.sizeRegular, 
                                        color.darkgrayColor,
                                        {
                                            width: Dimensions.get('window').width * 0.4,
                                        }
                                     ]}>{this.state.city}</Text>

                                }
                                
                            </View>

                           

                        </View>





                    </View>
                    {/* address ends */}

                    {/* change / reset password */}

                    <TouchableOpacity
                        onPress={() => {
                            this.props.navigation.push('changepassword')
                        }}
                        width={'90%'}
                        style={[
                            button.defaultRadius,
                            {
                                marginTop: 10,
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                borderColor: 'white',// color.myOrangeColor.color,
                                alignSelf: 'flex-start',

                            }
                        ]}>
                        <Text style={[
                            color.darkgrayColor,
                            font.regular,
                            font.sizeRegular,
                            {
                                textDecorationLine: 'underline'
                            }
                        ]}>Reset password</Text>
                    </TouchableOpacity>

                    {/* User account deletion */}

                    {
                        Number(this.state.role_id) == 7 ? null :
                            <View height={50} style={[box.horizontalBox, button.defaultRadius, {
                                /*  flexDirection: 'row', 
                                 justifyContent: 'space-between',  */
                                borderColor: 'red',
                                alignItems: 'center',
                                width: '90%',
                                alignSelf: 'center',
                                marginTop: 10,
                                marginBottom: 100
                            }]}>
                                <Text style={[font.semibold, font.regular, font.sizeVeryRegular, color.redColor, { width: '80%' }]}>Delete Account?</Text>
                                <Switch
                                    trackColor={{ false: "#767577", true: "orange" }}
                                    thumbColor={this.state.isEnabled ? "#fff" : "#f4f3f4"}
                                    ios_backgroundColor="#3e3e3e"
                                    onValueChange={value => {
                                        //console.log(value)
                                        this.setState({
                                            isEnabled: value,
                                        })
                                    }}
                                    value={this.state.isEnabled}
                                    style={{ marginRight: 10 }}
                                />
                            </View>
                    }

                    {/* User account deletion */}


                    <View height={70} style={{

                        flexDirection: 'row',
                        justifyContent: 'space-between'
                        , position: "absolute",
                        bottom: 0,
                    }}>
                        <TouchableOpacity
                            onPress={() => {
                                this.props.navigation.goBack();
                            }}
                            style={{
                                alignItems: "center",
                                justifyContent: "space-around",
                                borderTopWidth: 0.5,
                                borderTopColor: "gray",
                                borderBottomWidth: 0.5,
                                width: "50%",
                                borderBottomColor: "gray",
                                backgroundColor: "#FFFFF",
                                height: 72,
                            }}>
                            <Text style={[
                                font.semibold,
                                font.sizeMedium,
                                color.darkgrayColor,
                                color.linkBorderColor,


                            ]}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => {
                                this.updateUserProfile();
                            }}
                            style={{
                                alignItems: "center",
                                justifyContent: "space-around",
                                borderTopWidth: 0.5,
                                borderTopColor: "gray",
                                backgroundColor: color.myOrangeColor.color,
                                width: "50%",
                                height: 72,
                            }}>
                            <Text style={[
                                font.semibold,
                                font.sizeMedium,
                                color.textWhiteColor,
                                color.linkBorderColor,
                            ]}>Update</Text>
                        </TouchableOpacity>

                    </View>

                </KeyboardAwareScrollView>

                {/* <View height= {160} style={{
                    
                    flexDirection: 'row',
                    justifyContent: 'space-between'
                    , position: "absolute",
                    bottom: 0, 
                }}>
                    <TouchableOpacity
                        onPress={() => {
                            this.props.navigation.goBack();
                        }}
                        style={{
                            alignItems: "center",
                            justifyContent: "space-around",
                            borderTopWidth: 0.5,
                            borderTopColor: "gray",
                            backgroundColor: "white",
                            width: "50%",
                            backgroundColor: "#FFFFF",
                            height: 72,
                        }}>
                        <Text style={[
                            font.semibold,
                            font.sizeMedium,
                            color.darkgrayColor,
                            color.linkBorderColor,


                        ]}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                    onPress = {()=>{
                        this.updateUserProfile();
                    }}
                        style={{
                            alignItems: "center",
                            justifyContent: "space-around",
                            borderTopWidth: 0.5,
                            borderTopColor: "gray",
                            backgroundColor: color.myOrangeColor.color,
                            width: "50%",
                            height: 72,
                        }}>
                        <Text style={[
                            font.semibold,
                            font.sizeMedium,
                            color.textWhiteColor,
                            color.linkBorderColor,
                        ]}>Update</Text>
                    </TouchableOpacity>

                </View>  */}


                {this.state.isEnabled && <Modal position={"center"} swipeToClose={false}
                    onClosed={() => { this.setState({ isEnabled: false }) }}
                    style={{
                        //justifyContent: 'space-around',
                        //alignItems: 'space-around',
                        //padding: 20,
                        height: Dimensions.get('screen').height * 0.3,
                        width: Dimensions.get('screen').width * 0.9,
                    }} isOpen={this.state.isEnabled}>
                    <View height={"100%"}>
                        <View style={[/* box.centerBox, */ color.inputBackground, { alignItems: "flex-start", padding: "4%" }]}>
                            <Text style={[font.semibold, font.sizeMedium, color.blackColor,]}>Confirmation</Text>
                        </View>

                        <View style={[box.centerBox]}>
                            <Text style={[font.regular, font.sizeMedium, color.blackColor,]}>Are you sure you want to delete your account?</Text>
                        </View>

                        <View style={{ flex: 1, flexDirection: "row", height: 100 }}>
                            <TouchableOpacity

                                style={{
                                    bottom: 0,
                                    flex: 1,
                                    marginTop: "auto",
                                    backgroundColor: "orange",
                                    height: "100%",
                                    justifyContent: "center",
                                    borderRightWidth: 1,
                                    borderRightColor: "white"
                                }}

                                onPress={async () => {
                                    this.setState({
                                        isEnabled: false,
                                    })
                                }}>
                                <Text style={[font.semibold, font.sizeLarge, color.textWhiteColor, { textAlign: "center" }]}>No</Text>
                            </TouchableOpacity>


                            <TouchableOpacity style={
                                [color.lightGrayBackColor,
                                {
                                    bottom: 0,
                                    flex: 1,
                                    marginTop: "auto",
                                    height: "100%",
                                    justifyContent: "center",
                                }]}
                                onPress={async () => {
                                    if (Number(await Session.getRoleId()) == 5)
                                        this.deleteMemberAccount();
                                    else if (Number(await Session.getRoleId()) == 7)
                                        this.deleteEmployeeAccount();
                                }}>
                                <Text style={[font.regular, font.sizeMedium, color.blackColor, { textAlign: "center" }]}>Yes, Delete</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                </Modal>}
                {
                    this.state.showOptions && <Modal position={"center"} swipeToClose={false}
                        onClosed={() => { this.setState({ showOptions: false }) }}
                        style={{
                            //justifyContent: 'space-around',
                            //alignItems: 'space-around',
                            //padding: 20,
                            height: Dimensions.get('screen').height * 0.2,
                            width: Dimensions.get('screen').width * 0.9,
                        }} isOpen={this.state.showOptions}>
                        <View height={"100%"}>
                            <View style={[box.centerBox, color.inputBackground, {/* alignItems: "flex-start", */ padding: "4%" }]}>
                                <Text style={[font.semibold, font.sizeMedium, color.blackColor, { textAlign: "center" }]}>Upload from gallery or take a new picture?</Text>
                            </View>



                            <View style={{ flex: 1, flexDirection: "row", }}>
                                <TouchableOpacity style={{ bottom: 0, flex: 1, marginTop: "auto", backgroundColor: "orange", height: "100%", justifyContent: "center", borderRightWidth: 1, borderRightColor: "white" }}
                                    onPress={this.openGallery}>
                                    <Text style={[font.bold, font.sizeLarge, color.textWhiteColor, { textAlign: "center" }]}>Open Gallery</Text>
                                </TouchableOpacity>


                                <TouchableOpacity style={{ bottom: 0, flex: 1, marginTop: "auto", backgroundColor: "orange", height: "100%", justifyContent: "center" }}
                                    onPress={this.captureImage}>
                                    <Text style={[font.bold, font.sizeLarge, color.textWhiteColor, { textAlign: "center" }]}>Open Camera</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                    </Modal>
                }

                {this.state.spinner && <Spinner />}

                {

                    this.state.dob_edit &&
                    <DatePicker
                        modal
                        //minuteInterval={30}
                        open={this.state.dob_edit}
                        date={
                            new Date()
                        }
                        maximumDate={new Date()}
                        mode={'date'}
                        // minimumDate={this.checkBookingOpen() ? this.checkWeekendDate(new Date(moment(new Date()).add(1, 'day'))) : this.checkWeekendDate(new Date(moment(new Date()).add(2, 'days')))}
                        onConfirm={(date) => {
                            //console.log(date);
                            this.setState({
                                dob: date,
                                dob_edit: false
                            })

                        }}
                        onCancel={() => {
                            this.setState({
                                dob_edit: false
                            })
                        }}
                    />
                }

{

this.state.showCountriesList &&



<SinglePickerMaterialDialog



title={'Select'}

colorAccent={color.myOrangeColor.color}

items={this.state.allCountries.map((row, index) => {
    

    return { value: index, label: row.name, details: row };

})}

visible={this.state.showCountriesList}

selectedItems={this.state.country}

onCancel={() => this.setState({ showCountriesList: false })}

onOk={result => {

    console.log(result)
    this.setState({
        country: result.selectedItem.label, 
        selectedCountry: result.selectedItem.details,
        selectedState: null, 
        selectedCity: null,
        country_edit: false, 
        showCountriesList: false,
        state_id: null
    },()=>{
        this.getStates();
    })
}}
scrolled={true}

/>

}

{

this.state.showStatesList &&



<SinglePickerMaterialDialog



title={'Select'}

colorAccent={color.myOrangeColor.color}

items={this.state.allstates.map((row, index) => {
    

    return { value: index, label: row.name, details: row };

})}

visible={this.state.showStatesList}

selectedItems={this.state.state}

onCancel={() => this.setState({ showStatesList: false })}

onOk={result => {

    console.log(result)
    this.setState({
        state: result.selectedItem.label, 
        selectedState: result.selectedItem.details,
        state_edit: false, 
        showStatesList: false,
        city_id: null
    },()=>{
       this.getCities();
    })
}}
scrolled={true}

/>

}

{

this.state.showCitiesList &&



<SinglePickerMaterialDialog



title={'Select'}

colorAccent={color.myOrangeColor.color}

items={this.state.allcities.map((row, index) => {
    

    return { value: index, label: row.name, details: row };

})}

visible={this.state.showCitiesList}

selectedItems={this.state.city}

onCancel={() => this.setState({ showCitiesList: false })}

onOk={result => {

    console.log(result)
    this.setState({
        city: result.selectedItem.label, 
        selectedCity: result.selectedItem.details,
        state_edit: false, 
        showCitiesList: false
    })
}}
scrolled={true}

/>

}





            </SafeAreaView>

        );
    }
}
