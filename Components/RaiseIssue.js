import React, { Component } from "react";
import { View, Text, TouchableOpacity, TouchableWithoutFeedbackBase, BackHandler, TouchableWithoutFeedback, TextInput, Image, Alert, PermissionsAndroid,Platform, ActionSheetIOS, Dimensions } from 'react-native'
import font from "../Styles/font";
import button from "../Styles/button";
import color from "../Styles/color";
import LogoHeader from "./ReusableComponents/LogoHeader";
import box from "../Styles/box";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Picker } from '@react-native-picker/picker';
import Session from "../config/Session";
import moment from "moment";
import Icon from 'react-native-vector-icons/FontAwesome';
import CommonHelpers from "../Utils/CommonHelpers";
import Modal from "react-native-modalbox";
import formStyle from "./../Styles/control";
import { confirmEmpSeatReservationAPI, 
    getIssueCategoryAPI, 
    getSeatReservationAPI, 
    modifyEmpSeatReservationAPI, 
    raiseIssuewithImageAPI, 
    raiseIssueWithoutImageAPI, 
    login_check, 
    modifyIssuewithImageAPI, 
    modifyIssueWithoutImageAPI } from "../Rest/userAPI";
import route from "../Route/route";
import Spinner from "../UI/Spinner";
import { AWS_URL } from './../config/RestAPI';
import image from "../Styles/image";
import * as ImagePicker from 'react-native-image-picker';
import storage from "../StoragePermissions/storage";
import renderItem from "../Styles/renderItem";
import Drawer from "react-native-drawer";
import Sidemenu from "../Navigation/Sidemenu";

export default class RaiseIssue extends Component {
    constructor() {
        super();
        this.state = {

            emp_id: null,
            emp_name: null,
            corporate_id: null,
            role_id: null,

            defaultPropertyName: '',
            defaultName: '',

            issueCategoryList: [],
            iIssuesCategoryList: [],
            selectedIssueCategory: '',

            propertyName: '',
            issueTitle: '',

            raisedDate: '',
            raisedTime: '',

            description: '',

            selectedIssueStatus: 1,

            images: [],

            spinner: false,
            imageSource: null,

            showOptions: false,
            iIssueStatus: [],

            changed: false,
        }
    }

    componentDidMount = async () => {
       // console.log(this.props.route.params.purpose);

        storage.checkCamera().then(result => {
            if (result) {
                console.log("camera accessible")
            }
            else {
                storage.requestCameraPermission();
            }
        }).catch(error => { console.log(error) });

       /*  storage.checkWrite().then(result => {
            if (result) {
                console.log("write is allowed");
            }
            else {
                storage.requestWritePermission();
            }
        }) */


        /*   const cameragranted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA);
          if(cameragranted === PermissionsAndroid.RESULTS.GRANTED) {
            // if get here, the user has accepted the permissions
          } else {
            // if get here, the user did NOT accepted the permissions
          }
          const writegranted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE) */

        this.backHandler = BackHandler.addEventListener(
            "hardwareBackPress",
            ()=>{
                    console.log("going back");
                    this.props.navigation.goBack();
                    return true;
            }
            //this.goBack
        );

        this.setState({
            iIssueStatus: this.props.route.params.purpose == 'modify' ? ['Open', 'Assigned to Staff', 'In Progress', 'Resolved', 'Closed', 'Re-open']:['open'],
                   })

        login_check().then(async (result) => {
            this.setState({
                spinner: false,
            })

            console.log("login check", result.message, result.status);
            if (!result.status) {
                CommonHelpers.showFlashMsg("Session Expired. Please login again.", "danger");
                await Session.setUserDetails({});
                await Session.setUserToken('');
                //console.log(await Session.getUserDetails());
                await Session.setUserId('');
                await Session.setUserName('');
                this.props.navigation.push('auth',{screen: 'Login'})
               
            }
            else {
                let emp_details = await Session.getUserDetails();
                
                emp_details = JSON.parse(emp_details);
                console.log("role id is : ",emp_details.role_id,await Session.getUserName(), await Session.getUserId(), emp_details.id,);

                this.setState({
                    emp_id: emp_details.id,
                    emp_name: await Session.getUserName(),
                    corporate_id: emp_details.corporate_id,
                    role_id: emp_details.role_id,
                    propertyName: this.props.route.params.purpose != 'modify' ? this.props.route.params.params.property_details.property_name : null,
                    defaultPropertyName: this.props.route.params.purpose != 'modify' ? this.props.route.params.params.property_details.property_name : null,
                    dafaultName: await Session.getUserName(),

                });

                this.getIssuesCategory();

                this.props.route.params.purpose == "modify" ? this.handleAutoPopulate() : null;
            }

        }).catch(error => {
            this.setState({
                spinner: false,
            })

            console.log(error)

        })


    }

    getIssuesCategory = () => {
        getIssueCategoryAPI().then(result => {
            console.log(result.dataArray);
            let iIssuesList = [];
            if (result.status) {
                this.setState({
                    issueCategoryList: result.dataArray,
                }, () => {
                    this.props.route.params.purpose == "modify" ?

                        result.dataArray.forEach(item => {
                            if (this.props.route.params.param.category_id != null) {
                                if (item.id == Number(this.props.route.params.param.category_id.id)) {
                                    this.setState({
                                        selectedIssueCategory: item,
                                    })
                                }
                            }
                        })

                        : null
                })
                result.dataArray.forEach((element)=>{
                    iIssuesList.push(element.name)
                })
                this.setState({
                    iIssuesCategoryList: iIssuesList,

                })
            }
        }).catch(error => {
            console.log(error);
        })
    }

    handleAutoPopulate = async () => {
        console.log("incoming params: ", JSON.stringify(this.props.route.params.param), this.props.route.params.param.property_name);

        this.setState({
            emp_id: await Session.getUserId(),
            emp_name: this.props.route.params.param.name,
            corporate_id: this.props.route.params.param.allData.corporate_id,
            role_id: this.props.route.params.param.allData.role_id,

            //defaultPropertyName: '',
            //defaultName: '',

            //issueCategoryList: [],
            selectedIssueCategory: this.props.route.params.param.category_id,

            propertyName: this.props.route.params.param.property_name,
            issueTitle: this.props.route.params.param.issue_title,

            raisedDate: this.props.route.params.param.raise_date,
            raisedTime: this.props.route.params.param.raise_time,

            description: this.props.route.params.param.description,

            selectedIssueStatus: this.props.route.params.param.status,

            imageSource: this.props.route.params.param.image != null ? { uri: AWS_URL + this.props.route.params.param.image } : null,

            // images: [],

        }, () => {
            console.log(this.state.imageSource);
        });

    }

    onStartDateSelect = (event, value) => {
        console.log(event);
        if (event.type == "set") {


        }
        else {
            this.setState({
                isStartDatePicked: false,
                showStartTimer: false
                // isStartTimePicked: false
            })
        }



    }


    validate = () => {

        if (this.state.selectedIssueCategory == '' || this.state.selectedIssueCategory == null) {
            CommonHelpers.showFlashMsg("Please select a Issue Category", "danger");
            return false;
        } else if (this.state.propertyName == '' || this.state.propertyName == null) {
            CommonHelpers.showFlashMsg("Please enter the property name", "danger");
            return false;
        }
        else if (this.state.issueTitle == '' || this.state.issueTitle == null) {
            CommonHelpers.showFlashMsg("Issue Title is missing", "danger");
            return false;

        } else if (this.state.description == '' || this.state.description == null) {
            CommonHelpers.showFlashMsg("Please enter the description of the issue.", "danger");
            return false;
        }
        else if (this.state.emp_name == '' || this.state.emp_name == null) {
            CommonHelpers.showFlashMsg("Please enter the name", "danger");
            return false;

        }
        else if (this.state.selectedIssueStatus == '' || this.state.selectedIssueStatus == null) {
            CommonHelpers.showFlashMsg("Please select the issue status.", "danger");
        }


        return true;


    }
    goBack = () => {
       
            this.props.navigation.goBack();
          
        
       
        return true;
    }

    componentWillUnmount = () => {
        // this.unsubscribe();
        if (this.backHandler) this.backHandler.remove();
    };

   
    _handleupload = async () => {

        console.log("clicked")
        this.setState({
            showOptions: true,
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
            if (response.errorCode == 'camera_unavailable' ) {
                CommonHelpers.showFlashMsg('camera Unavailable', 'danger')
             }else if (!response.didCancel) {
                console.log(response);
                this.setState({
                    images: response,
                    imageSource: { uri: response.assets[0].uri }
                })

            }

        }).catch(err=>{
            console.log(err)
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
                console.log(response);
                this.setState({
                    images: response,
                    imageSource: { uri: response.assets[0].uri }
                })
            }

        }).catch(error => { console.log(error) })
        /*  try {
             const res = await DocumentPicker.pick({
                 type: [DocumentPicker.types.images],
                 copyTo: "cachesDirectory"
             })
             console.log("image details: ", res);
             this.setState({
                 images: res,
 
             });
 
         } catch (err) {
             console.log(err)
         } */

    }

    handleData = async (p) => {
        //console.log("check_in data initiated", this.state.hide_id_proof);
        if (this.state.images.length == 0) {
            let params = JSON.stringify({
                "description": this.state.description,
                "status": Number(this.state.selectedIssueStatus),
                "raised_by": Number(this.state.emp_id),
                "category_id": this.state.selectedIssueCategory.id,
                "property_id": this.props.route.params.purpose != "modify" ? this.props.route.params.params.property_details.id : this.props.route.params.param.allData.property.id,
                "title": this.state.issueTitle,
                "corporate_id": Number(this.state.role_id) == 7 ? this.state.corporate_id: null,
                "role_id": Number(this.state.role_id),
                "created_by": this.state.emp_id,
                "issue_image": null,
            });

            console.log("calling handle raise issue  with params: ", params);

            this._handleAPICall(params);

        }
        else {
            const params = new FormData();

            params.append('issue_image[]', { name: this.state.images.assets[0].fileName, type: this.state.images.assets[0].type, uri: this.state.images.assets[0].uri });


            Object.keys(p).forEach((key) => {
                params.append(key, p[key]);
            });
            console.log("params: ", JSON.stringify(params));
            console.log("calling handle check in with params: ", params);

            this._handleAPICall(params);

        }
    }

    _handleAPICall = (params) => {

         if(this.props.route.params.purpose == "modify"){
            if (this.state.images.length != 0) {
                modifyIssuewithImageAPI(params, Number(this.props.route.params.param.allData.id)).then(async(result) => {
                    //console.log(result);
                    this.setState({
                        spinner: false,
                    })
                   
                    console.log("result raise issue api : ", result.status);
                    if (result.status) {
                        console.log("the role id is : " , this.state.role_id);
                        
                        CommonHelpers.showFlashMsg("Issue raised successfully." , "success");
                       // console.log("role_id",userDetails.role_id);
                   this._handleNavigation()
    
                    }
                    else {
                        CommonHelpers.showFlashMsg("Unable to raise the issue. Please try again.", "danger");
                    }
                }).catch(error => {
                    console.log("raise issue with image error****", error)
                })
            }
            else {
                
                modifyIssueWithoutImageAPI(params, Number(this.props.route.params.param.allData.id)).then((result) => {
                    this.setState({
                        spinner: false,
                    })
                    console.log("result raise issue api : ", result.status);
                    if (result.status) {
                        CommonHelpers.showFlashMsg("Issue raised successfully.", "success");
                        this._handleNavigation();
    
                    }
                    else {
                        CommonHelpers.showFlashMsg("Unable to raise the issue. Please try again.", "danger");
                    }
    
                }).catch(error => {
                    console.log("error raise issue", error);
                })
            }

         }
         else{
             console.log("new request");
            if (this.state.images.length != 0) {
                raiseIssuewithImageAPI(params).then(async(result) => {
                    //console.log(result);
                    this.setState({
                        spinner: false,
                    })
                   
                    console.log("result raise issue api : ", result.status);
                    if (result.status) {
                        console.log("the role id is : " , this.state.role_id);
                        
                        CommonHelpers.showFlashMsg("Issue raised successfully." , "success");
                       // console.log("role_id",userDetails.role_id);
                   /*  Number(this.state.role_id) != 7 ?
                       Navigation.setRoot({
                        root: route.memberissueList
                    })
                       
                       : Navigation.setRoot({
                            root: route.issueList
                        })
                        
     */
    this._handleNavigation();
                    }
                    else {
                        CommonHelpers.showFlashMsg("Unable to raise the issue. Please try again.", "danger");
                    }
                }).catch(error => {
                    console.log("raise issue with image error****", error)
                })
            }
            else {
                raiseIssueWithoutImageAPI(params).then((result) => {
                    this.setState({
                        spinner: false,
                    })
                    console.log("result raise issue api : ", result.status);
                    if (result.status) {
                        CommonHelpers.showFlashMsg("Issue raised successfully.", "success");
                        this._handleNavigation()
                      /*   Navigation.setRoot({
                            root: route.issueList
                        }) */
    
                    }
                    else {
                        CommonHelpers.showFlashMsg("Unable to raise the issue. Please try again.", "danger");
                    }
    
                }).catch(error => {
                    console.log("error raise issue", error);
                })
            }

         }
       
    }

    _handleNavigation=()=>{
     this.props.navigation.push('IssuesList');    
    }
    closeControlPanel = () => {
        this._drawer.close()
      };
      openControlPanel = () => {
        this._drawer.open()
      };


    render() {
        let selectedIssueCategory = this.state.selectedIssueCategory;
        let selectedIssueStatus = this.state.selectedIssueStatus;

        return (
            <Drawer
            ref={(ref) => this._drawer = ref}
        type="overlay"
        content={<Sidemenu navigation = {this.props.navigation} />}
        tapToClose={true}
        openDrawerOffset={0.2} // 20% gap on the right side of drawer
        panCloseMask={0.2}
        closedDrawerOffset={-3}
        //styles={drawerStyles}
        side = 'right'
        tweenHandler={(ratio) => ({
          main: { opacity:(2-ratio)/2 }
        })}
        >
            <View style={{ flex: 1 }}>
                <LogoHeader navigation = {this.props.navigation}
                qrvisible={false} title={"Hot Desk: Raise an Issue"} onBarsPress={()=>{
               this.openControlPanel()}} />
                <KeyboardAwareScrollView contentContainerStyle={box.scrollViewCenter}
                    keyboardShouldPersistTaps="always">

                    {/* issue category */}

                    <View style={[box.centerBox,]}>
                        <Text style={[font.semibold, font.regular, color.blackColor]}>Issue Category *</Text>
                      { 
                       Platform.OS === 'ios'? 
                       <TouchableOpacity disabled = {this.props.route.params.purpose == 'modify'? true: false}


                       onPress = {()=>{
                           ActionSheetIOS.showActionSheetWithOptions(
                               {options: this.state.iIssuesCategoryList,
                                   title: "Select a Issue Category",
                                   tintColor: 'orange',  },
                               buttonIndex=> {
                                   if (this.state.issueCategoryList.length == 1) {

                                       this.setState({
                                           selectedIssueCategory: this.state.issueCategoryList[buttonIndex],
   
                                       })
   
                                   }
                                   else {
                                      
                                           console.log("selected item: ", this.state.issueCategoryList[buttonIndex])
                                           this.setState({
                                               selectedIssueCategory: this.state.issueCategoryList[buttonIndex] ,
   
                                           });
                                       
                                   }

                               }
                           )
                       }}>
                           <View style={[button.defaultRadius, color.orangeBorder, {flexDirection: 'row', justifyContent : 'space-between', marginTop: '3%'}]}>
                               <Text style = {[font.regular, color.orangeColor,font.sizeRegular]}>{this.state.selectedIssueCategory == '' ?'Select Issue Category': this.state.selectedIssueCategory.name}</Text>
                               <Icon  color={color.myOrangeColor.color} name = 'angle-down' size={20}/>
                           </View>
                       </TouchableOpacity>
                   :
                       <Picker
                            selectedValue={selectedIssueCategory}
                            enabled = {this.props.route.params.purpose == 'modify'? false : true}
                            style={[color.blackColor, { width: "100%", }]}
                            dropdownIconColor="black"
                            onValueChange={(itemValue, itemIndex) => {
                                if (this.state.issueCategoryList.length == 1) {

                                    this.setState({
                                        selectedIssueCategory: itemValue,

                                    })

                                }
                                else {
                                    if (itemIndex != 0) {
                                        console.log("selected item: ", itemValue)
                                        this.setState({
                                            selectedIssueCategory: itemValue,

                                        });
                                    }
                                }
                            }
                            }>
                            {this.state.issueCategoryList.length == 1 ? null : <Picker.Item label='Issues Category' value='0' />}
                            {
                                this.state.issueCategoryList.map((item) => {
                                    return (
                                        <Picker.Item label={item.name} value={item} fontFamily="Montserrat-SemiBold" />);
                                })
                            }

                        </Picker>
                        }
                    </View>

                      {/* issue status */}
                      <View style={[box.centerBox,]}>
                        <Text style={[font.semibold, font.regular, color.blackColor]}>Issue Status *</Text>
                       {
                         Platform.OS === 'ios' ? 
                       
                       

                         <TouchableOpacity disabled = {this.props.route.params.purpose != 'modify'? true: (this.state.selectedIssueStatus == 1 || this.state.selectedIssueStatus == 2 || this.state.selectedIssueStatus == 3 )? true: false} onPress = {()=>{
                             ActionSheetIOS.showActionSheetWithOptions(
                                 {options: this.state.iIssueStatus, 
                                  disabledButtonIndices : this.props.route.params.purpose == 'modify' ? [0,1,2,3]:[]
                              
                              }, 
                                 buttonIndex =>{
                                  this.setState({
                                      selectedIssueStatus: buttonIndex+1,
                                      changed: true
                                  })  
                                 }
                             )
                         }}>
                             <View style =  {[button.defaultRadius, color.orangeBorder, {flexDirection: 'row', justifyContent: 'space-between', marginTop: '3%'}]}>
                                 <Text style = {[font.regular, color.myOrangeColor,font.sizeRegular]}>{this.state.selectedIssueStatus == ''? 'Select the Issue Status' : this.state.iIssueStatus[this.state.selectedIssueStatus -1]}</Text>
                                 <Icon  color={color.myOrangeColor.color} name ='angle-down' size = {20}/>
                             </View>
                         </TouchableOpacity>
                         :
                       
                       
                       this.props.route.params.purpose == "modify" ?
                        <Picker
                            selectedValue={selectedIssueStatus}
                            style={[color.blackColor, { width: "100%", }]}
                            enabled = {Number(this.state.selectedIssueStatus) == 1 || Number(this.state.selectedIssueStatus) == 2||Number(this.state.selectedIssueStatus) == 3  ? false : true}
                            dropdownIconColor="black"
                            onValueChange={(itemValue, itemIndex) => {
                                console.log("staTUS: ", itemValue)
                                this.setState({
                                    selectedIssueStatus: itemValue,
                                    changed: true

                                })
                            }
                            }>
                            <Picker.Item label='Open' value='1' enabled = {false} style = {[color.darkgrayColor]} />
                            <Picker.Item label='Assigned To Staff' value='2' enabled = {false} style = {[color.darkgrayColor]} />
                            <Picker.Item label='In Progress' value='3' enabled = {false} style = {[color.darkgrayColor]}/>
                            <Picker.Item label='Resolved' value='4' enabled = {Number(this.props.status) == 6 || Number(this.props.status) == 5 ? false :true} style = {[color.darkgrayColor]}/>
                            <Picker.Item label='Close' value='6' enabled = {true}  />
                            <Picker.Item label='Re-Open' value='5' enabled = {true} />
                        </Picker>
                        :
                         <Picker
                         selectedValue={selectedIssueStatus}
                         enabled={false}

                         style={[color.blackColor, { width: "100%", }]}
                         dropdownIconColor="gray"
                         onValueChange={(itemValue, itemIndex) => {
                             console.log("staTUS: ", itemValue)
                             this.setState({
                                 selectedIssueStatus: itemValue,
                                 //changed: true
                             })
                         }
                         }>
                         <Picker.Item label='Open' value='1' />
                     </Picker>
                        }
                    </View>

                    {/*  Property Name */}
                    <View style={[box.centerBox]}>
                        <Text style={[font.semibold, font.regular, color.blackColor]}>Property Name *  {/* {this.state.propertyName} */}</Text>
                        <View style={[formStyle.formMargin,]}>
                           { this.props.route.params.purpose == 'modify' ? <Text style = {[font.regular, color.blackColor, font.sizeRegular]} >{this.state.propertyName}</Text> :
                           <TextInput
                                placeholder={"Property Name (Field can't be edited.)"}
                                placeholderTextColor = {color.darkgrayColor.color}
                                selectionColor = {color.myOrangeColor.color}
                                style = {[renderItem.inputBox]}
                                keyboardType="default"
                                //value={this.state.propertyName}
                                defaultValue={this.state.propertyName}
                                returnKeyType={"next"}
                                editable = {false}
                                

                                blurOnSubmit={true}
                                onChangeText={(val) => {
                                    this.setState({
                                        propertyName: val,
                                    })
                                }}
                               
                            />}
                        </View>
                    </View>

                    {/*  Issue Title*/}
                    <View style={[box.centerBox]}>
                        <Text style={[font.semibold, font.regular, color.blackColor]}>Issue Title * {/* {this.state.issueTitle} */}</Text>
                        <View style={[formStyle.formMargin,]}>
                            {
                                this.props.route.params.purpose == 'modify' ? <Text style = {[font.regular, color.blackColor, font.sizeRegular]}>{this.state.issueTitle}</Text>:
                                <TextInput
                                placeholder={"Enter title for issue"}
                                placeholderTextColor = {color.darkgrayColor.color}
                                selectionColor = {color.myOrangeColor.color}
                                style = {[renderItem.inputBox]}
                                keyboardType="default"
                                editable = {this.props.route.params.purpose == 'modify'? false : true}

                                defaultValue={this.state.issueTitle}
                                returnKeyType={"next"}

                                blurOnSubmit={true}
                                onChangeText={(val) => {
                                    this.setState({
                                        issueTitle: val,
                                    })
                                }}
                               
                            />
                            }
                        </View>
                    </View>

                    {/* Raised By */}
                    <View style={[box.centerBox]}>
                        <Text style={[font.semibold, font.regular, color.blackColor]}>Raised By * {/* {" " + this.state.emp_name} */}</Text>
                        <View style={[formStyle.formMargin,]}>
                           { this.props.route.params.purpose== 'modify'? <Text style = {[font.regular, color.blackColor, font.sizeRegular]}>{this.state.emp_name}</Text> : 
                           <TextInput
                                placeholder={"Name (Field can't be edited)"}
                                placeholderTextColor = {color.darkgrayColor.color}
                                selectionColor = {color.myOrangeColor.color}
                                style = {[renderItem.inputBox]}
                                keyboardType="default"
                                //disabled = {true}
                                defaultValue={this.state.emp_name}
                                returnKeyType={"next"}
                                editable={false}

                                blurOnSubmit={true}
                                onChangeText={(val) => {
                                    this.setState({
                                        emp_name: val,
                                    })
                                }}
                                
                            />}
                        </View>
                    </View>

                    {/* Raised date and time */}
                    <View style={[box.centerBox,]}>
                        <Text style={[font.semibold, font.regular, color.blackColor]}>Raised Date {'&'} Time *</Text>
                        <View style={[formStyle.formMargin,]}>

                            <Text style={[font.regular, font.sizeRegular, color.blackColor]}> {this.state.raisedDate == '' ? moment().format("DD MMMM YYYY- HH : mm") : moment(this.state.raisedDate).format("DD MMMM YYYY, HH: mm")} Hrs </Text >
                        </View>


                    </View>

                    {/* Description */}


                    <View style={[box.centerBox,]}>
                        <Text style={[font.semibold, font.regular, color.blackColor]}>Description *</Text>
                        <View style={[formStyle.formMargin,]}>
                           { 
                           this.props.route.params.purpose =='modify'? <Text style = {[font.regular, color.blackColor, font.sizeRegular]}>{this.state.description}</Text> : 
                           <TextInput placeholder="Enter Description"
                                placeholderTextColor={"black"}
                                editable= {this.props.route.params.purpose == 'modify' ? false: true}
                                multiline={true}
                                numberOfLines={4}
                                selectionColor = {color.myOrangeColor.color}
                                onChangeText={(text) => this.setState({ description: text })}
                                value={this.state.description}
                                style={[button.defaultRadius, color.lightBlack,  { textAlign: 'justify', fontFamily: font.regular.fontFamily }]} />
                                }
                        </View>


                    </View>

                  

                    {/* image upload */}
                    {
                        this.state.imageSource == null && this.props.route.params.purpose != 'modify'? 
                            <View style={[box.centerBox]}>
                                <Text style={[font.semibold, font.regular, color.blackColor]}>Images</Text>


                                <View>

                                    <View style={[/* box.centerBox,  */{ flex: 1, flexDirection: "row", marginTop: 10 }]}>
                                        <TouchableOpacity /* style = {{flex: 1}} */ onPress={() => {
                                            this._handleupload();
                                        }}>
                                            <View style={[button.defaultRadius, { flexDirection: "row", alignItems: "center" }]}>
                                                <Text style={[font.semibold, font.regular, color.blackColor, { marginRight: 10 }]}>Browse Image</Text>
                                                <Icon name="cloud" color="black" size={15} />
                                            </View>
                                        </TouchableOpacity>
                                        {this.state.images.length != 0 ?

                                            <View style={[{ flexDirection: "row", flex: 1, marginLeft: 10 }]}>
                                                <Text style={[font.semibold, font.regular, color.blueColor, { flex: 1, textDecorationLine: "underline", textDecorationColor: "blue", }]}>{this.state.images.assets[0].fileName}</Text>
                                                <TouchableOpacity onPress={() => {
                                                    this.setState({
                                                        images: []
                                                    })
                                                }}>
                                                    <Icon name="close" color="red" size={15} />
                                                </TouchableOpacity>
                                            </View> : null}

                                    </View>
                                </View>

                            </View>

                            : null
                    }



                    {/* display image incase of modify */}
                    {this.state.imageSource == null ? null :
                        <View style={[box.centerBox,]}>
                           { this.props.route.params.purpose == 'modify' ? null : 
                           <TouchableOpacity onPress={() => {
                                this.setState({
                                    imageSource: null,
                                    images: []
                                })
                            }}>
                                <Text style={[font.regular,
                                font.sizeRegular,
                                color.myOrangeColor,
                                {
                                    textDecorationLine: "underline",
                                    textDecorationColor: color.myOrangeColor.color,
                                    textAlign: 'right'
                                }]}>Change Image</Text>
                            </TouchableOpacity>}
                            <Image source={this.state.imageSource} style={[image.imageContain, { height: 200, width: "100%" }]} />
                        </View>

                    }



                </KeyboardAwareScrollView>

                <View height={80} style={{ position: "relative", bottom: 0, flexDirection: "row", }}>
                    <TouchableOpacity style={{ flex: 1, alignItems: "center", justifyContent: "center", borderTopWidth: 0.5 }}
                        onPress={() => {
                            this.goBack();
                        }}
                    >
                        <Text style={[font.semibold, font.sizeLarge, color.blackColor, {}]}>CANCEL</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "orange" }}
                        onPress={() => {
                            console.log('changed status',this.state.changed)
                            if(this.props.route.params.purpose == 'modify'){
                                if (this.validate() && this.state.changed) {
                                    let params = {
                                        "description": this.state.description,
                                        "status": this.state.selectedIssueStatus,
                                        "raised_by": this.state.emp_id,
                                        "category_id": this.state.selectedIssueCategory.id,
                                        "property_id": this.props.route.params.purpose != "modify" ? this.props.route.params.params.property_details.id : this.props.route.params.param.allData.property.id,
                                        "title": this.state.issueTitle,
                                        "corporate_id": Number(this.state.role_id) == 7 ?this.state.corporate_id : null,
                                        "role_id": Number(this.state.role_id),
                                        "created_by": this.state.emp_id,
                                    }
    
    
                                    this.setState({
                                        spinner: true,
                                    });
                                    this.handleData(params);
    
    
    
                                } else if (!this.state.changed){
                                    CommonHelpers.showFlashMsg('Issue not modified', 'danger');
                                }

                            }
                            else{
                                if (this.validate() ) {
                                    let params = {
                                        "description": this.state.description,
                                        "status": this.state.selectedIssueStatus,
                                        "raised_by": this.state.emp_id,
                                        "category_id": this.state.selectedIssueCategory.id,
                                        "property_id": this.props.route.params.purpose != "modify" ? this.props.route.params.params.property_details.id : this.props.route.params.param.allData.property.id,
                                        "title": this.state.issueTitle,
                                        "corporate_id": Number(this.state.role_id) == 7 ?this.state.corporate_id : null,
                                        "role_id": Number(this.state.role_id),
                                        "created_by": this.state.emp_id,
                                    }
    
    
                                    this.setState({
                                        spinner: true,
                                    });
                                    this.handleData(params);
    
    
    
                                } 
                            }
                           
                        }}>
                        <Text style={[font.semibold, font.sizeLarge, color.textWhiteColor]}>ADD</Text>
                    </TouchableOpacity>
                </View>

               

                {this.state.spinner && <Spinner />}

                {
                    this.state.showOptions && <Modal position={"center"} swipeToClose = {false}
                    onClosed = {()=>{this.setState({showOptions: false})}}
                    style  ={{
                        //justifyContent: 'space-around',
                        //alignItems: 'space-around',
                        //padding: 20,
                        height: Dimensions.get('screen').height * 0.2 ,
                        width:Dimensions.get('screen').width * 0.9,
                      }} isOpen={this.state.showOptions}>
                        <View height = {"100%"}>
                    <View style = {[box.centerBox, color.inputBackground, {/* alignItems: "flex-start", */ padding: "4%" }]}>
                        <Text style = {[font.semibold, font.sizeMedium, color.blackColor,{textAlign: "center"} ]}>Upload from gallery or take a new picture?</Text>
                    </View>
 
                    
 
                    <View style = {{flex: 1,  flexDirection: "row", }}>
                    <TouchableOpacity style = {{bottom: 0,flex: 1, marginTop: "auto", backgroundColor: "orange", height: "100%", justifyContent: "center", borderRightWidth: 1, borderRightColor: "white"}}
                    onPress = {this.openGallery}>
                        <Text style = {[font.bold, font.sizeLarge, color.textWhiteColor, {textAlign: "center"}]}>Open Gallery</Text>
                    </TouchableOpacity>
                   
 
                    <TouchableOpacity style = {{bottom: 0,flex: 1, marginTop: "auto", backgroundColor: "orange", height:"100%", justifyContent: "center"}}
                    onPress = {this.captureImage}>
                        <Text style = {[font.bold, font.sizeLarge, color.textWhiteColor, {textAlign: "center"}]}>Open Camera</Text>
                    </TouchableOpacity>
                    </View>
                </View>

                      </Modal>
                }

            </View>
            </Drawer>
        );
    }
}