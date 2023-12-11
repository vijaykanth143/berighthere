import React, { Component} from 'react';
import {View, Text, TouchableOpacity, FlatList, StyleSheet, TextInput, BackHandler } from 'react-native';
import font from '../Styles/font';
import color from '../Styles/color';
import button from '../Styles/button';
import renderItem from '../Styles/renderItem';
import LogoHeader from './ReusableComponents/LogoHeader';

import box from '../Styles/box';
import moment from 'moment';
import SimilarPropertiesCard from './ReusableComponents/SimilarPropertiesCard';
import { getIssuesListAPI, login_check } from './../Rest/userAPI';
import Icon from 'react-native-vector-icons/FontAwesome';

import CommonHelpers from '../Utils/CommonHelpers';
import {  ISSUES_DETAIL } from './../config/RestAPI'
import route from '../Route/route';
import Spinner from '../UI/Spinner';
import Session from '../config/Session';
import Drawer from "react-native-drawer";
import Sidemenu from "../Navigation/Sidemenu";

export default class IssuesList extends Component{
   

    constructor(){
        super();
        this.state = {
            data: [],
            spinner: false,
            searchPhrase: '',
            searchClicked: false,

            //pagination variables
            enablePagination: false,
            prev_page_url: null,
            next_page_url: null,
            last_page_url: null,
            links: [],
            //paginationvariables ends
        }
    }

    componentDidMount = ()=>{

        this.backhandler = BackHandler.addEventListener("hardwareBackPress", this.goBack)
       this.setState({
           spinner: true,
       })
        login_check().then(async(result) => {
            this.setState({
                spinner: false,
            })
            
            console.log("login check", result.message, result.status);
           if(!result.status){
             CommonHelpers.showFlashMsg("Session Expired. Please login again.", "danger");
             await Session.setUserDetails({});
                      await Session.setUserToken('');
                      //console.log(await Session.getUserDetails());
                      await Session.setUserId('');
                      await Session.setUserName('');
                      this.props.navigation.push('auth',{screen: 'Login'})
                     
           }
           else{
            //console.log(ISSUES_DETAIL+'?user_id=' + await Session.getUserId());
            this.apiCall(ISSUES_DETAIL+'?user_id=' + await Session.getUserId());
           }
      
          }).catch(error => {
            this.setState({
                spinner: false,
            })
            
            console.log(error)
           
          })
       
    }

    componentWillUnmount=()=>{
        if(this.backhandler)
        this.backhandler.remove();
    }

    goBack=async()=>{
       
        this.props.navigation.goBack();
        return true;
    }

    apiCall = (url)=>{
        this.setState({
            spinner: true, 
        })
        getIssuesListAPI(url).then(async(result)=>{
            this.setState({
                spinner: false
            })
            //console.log("issues List api ", result.dataArray);
            if(result.dataArray.length !=0){
                this.setState({
                    data: result.dataArray,
                });
                if (result.pagesData.data.last_page > 1) {
                    this.setState({
                        enablePagination: true,
                        prev_page_url: result.pagesData.data.prev_page_url + '&user_id='+ await Session.getUserId(),
                        next_page_url: result.pagesData.data.next_page_url + '&user_id='+ await Session.getUserId(),
                        last_page_url: result.pagesData.data.last_page_url + '&user_id='+ await Session.getUserId(),
                        links: result.pagesData.data.links,
                    }, () => {
                        console.log("Button status: ", this.state.prev_page_url, this.state.next_page_url, this.state.last_page_url);
                    })
                }
            }
            else{
                //console.log('issues list',result.dataArray,result.message, result.status);
                CommonHelpers.showFlashMsg("No existing issues.", "danger");
            }
        })
    }

    _renderIssues = (item) => {
        console.log("item: ", item.item.issue_code);

        const statusText = CommonHelpers.issueStatusInfo(item.item.status);
   
         if (this.state.searchPhrase == '') {
             return (
                 <View height={350}>
                     <SimilarPropertiesCard
                         /* imageList={images} */
                         fromEmpReservation={true}
                         from="SRP"
                         isLogin= {true}
                         iconName='heart'
                         iconColor='orange'
                         contentdetails={
                             <View style ={[ box.centerBox, /* {backgroundColor: "pink"} */]}>
                               <View style= {{flex: 1, flexDirection: 'row'}}>
                           <View style = {{ flex: 1 , flexDirection: "row"}}>
                            <Text style = {[font.semibold, font.sizeMedium, color.myOrangeColor]}>Issue ID: </Text>
                            <Text style = {[font.semibold, font.sizeMedium, color.myOrangeColor]}>{item.item.issue_code}</Text>
                            </View>

                            <View style = {{flex: 1, /* flexDirection: "row" */}}>
                            <Text style = {[font.semibold, font.sizeRegular, color.blackColor]}>Date {'&'} Time: </Text>
                            <Text style = {[font.semibold, font.sizeRegular, color.darkgrayColor]}>{moment(item.item.raised_date).format("DD MMMM YYYY, HH:mm")}Hrs</Text>
                            </View>
                            </View>

                            <View style = {{flex: 1, flexDirection: 'row', justifyContent: 'space-around'}}>

<View style = {{flex: 1, /* flexDirection: "row" */}}> 
    <Text style = {[font.semibold, font.sizeRegular, color.blackColor]}>Property Name: </Text>
    <Text style = {[font.semibold,font.sizeRegular, color.darkgrayColor]}>{item.item.property==null?"Unknown":item.item.property.property_name}</Text>
</View>

<View style = {{flex: 1,/*  flexDirection: "row", */ flexWrap: 'wrap'}}>
<Text style = {[font.semibold, font.sizeRegular, color.blackColor]}>Issue Category : </Text>
    <Text style = {[font.semibold, font.sizeRegular, color.darkgrayColor, { flexWrap: 'wrap', width: '90%'}]}>{item.item.category != null?item.item.category.name: '-----'}</Text>
    </View>
                            </View>

                                   <View style = {{flex: 1, }}>
                                 <Text style = {[font.semibold, font.sizeRegular, color.blackColor]}>Issue Description: </Text>
                                     <Text style = {[font.semibold, font.sizeRegular, color.blackColor, {flexWrap:"wrap"}]}>{item.item.description}</Text>
                                     </View> 


                                         <View style = {{flex: 1, flexDirection: "row", justifyContent: 'space-around', alignItems: 'center'}}>
                                <Text style = {[font.semibold, font.sizeRegular, color.myOrangeColor]}>Status: </Text>
                                <Text style = {[font.semibold, font.sizeRegular, color.myOrangeColor , {flex: 1}]}>{ statusText/* item.item.status */}</Text>
                                <TouchableOpacity onPress = {async ()=>{
                                           console.log(item.item)
                                              let params = {
                                                category_id:item.item.category == null? null : item.item.category,
                                                property_name:item.item.property==null?"Unknown":item.item.property.property_name,
                                                issue_title: item.item.title == null?'': item.item.title,
                                                name: item.item.corporate == null ? await Session.getUserName(): item.item.corporate.name,
                                                raise_date: item.item.raised_date==null ? null: item.item.raised_date,
                                                raise_time: item.item.raised_time==null? null: item.item.raised_time,
                                                description : item.item.description,
                                                status: item.item.status,
                                                image : item.item.issue_image == ''? null: item.item.issue_image,
                                                allData: item.item,
                                             }
    
                                             console.log("image;" ,item.item.issue_image, params)
                                             this.props.navigation.push('raiseissue', {
                                                emplogin: 1,
                                                param: params,
                                                purpose: "modify",
                                            })

                                             }}>
                                             <Text style = {[button.defaultRadius, font.regular, font.sizeRegular, color.myOrangeColor,{borderColor:color.myOrangeColor.color}]}>Update/ Modify Issue</Text>
                                         </TouchableOpacity>  
                                    </View>

                                           

                                 </View>

                             
                         } />
                 </View>
             );
 
         }
         else if (item.item.issue_code.toString().toLowerCase().includes(this.state.searchPhrase.toLowerCase().trim())) {
             return (
                 <View height={400}>
                     <SimilarPropertiesCard
                         /* imageList={images} */
                         fromEmpReservation={true}
                         from="SRP"
                         isLogin= {true}
                         iconName='heart'
                         iconColor='orange'
                         contentdetails={
                            <View style ={[ box.centerBox, /* {backgroundColor: "pink"} */]}>
                               <View style= {{flex: 1, flexDirection: 'row'}}>
                           <View style = {{ flex: 1 , flexDirection: "row"}}>
                            <Text style = {[font.semibold, font.sizeMedium, color.myOrangeColor]}>Issue ID: </Text>
                            <Text style = {[font.semibold, font.sizeMedium, color.myOrangeColor]}>{item.item.issue_code}</Text>
                            </View>

                            <View style = {{flex: 1, /* flexDirection: "row" */}}>
                            <Text style = {[font.semibold, font.sizeRegular, color.blackColor]}>Date {'&'} Time: </Text>
                            <Text style = {[font.semibold, font.sizeRegular, color.darkgrayColor]}>{moment(item.item.raised_date).format("DD MMMM YYYY, HH:mm")}Hrs</Text>
                            </View>
                            </View>

                            <View style = {{flex: 1, flexDirection: 'row', justifyContent: 'space-around'}}>

<View style = {{flex: 1, /* flexDirection: "row" */}}> 
    <Text style = {[font.semibold, font.sizeRegular, color.blackColor]}>Property Name: </Text>
    <Text style = {[font.semibold,font.sizeRegular, color.darkgrayColor]}>{item.item.property==null?"Unknown":item.item.property.property_name}</Text>
</View>

<View style = {{flex: 1,/*  flexDirection: "row", */ flexWrap: 'wrap'}}>
<Text style = {[font.semibold, font.sizeRegular, color.blackColor]}>Issue Category : </Text>
    <Text style = {[font.semibold, font.sizeRegular, color.darkgrayColor, { flexWrap: 'wrap', width: '90%'}]}>{item.item.category != null?item.item.category.name: '-----'}</Text>
    </View>
                            </View>

                                   <View style = {{flex: 1, }}>
                                 <Text style = {[font.semibold, font.sizeRegular, color.blackColor]}>Issue Description: </Text>
                                     <Text style = {[font.semibold, font.sizeRegular, color.blackColor, {flexWrap:"wrap"}]}>{item.item.description}</Text>
                                     </View> 


                                         <View style = {{flex: 1, flexDirection: "row", justifyContent: 'space-around', alignItems: 'center'}}>
                                <Text style = {[font.semibold, font.sizeRegular, color.myOrangeColor]}>Status: </Text>
                                <Text style = {[font.semibold, font.sizeRegular, color.myOrangeColor , {flex: 1}]}>{ statusText/* item.item.status */}</Text>
                                <TouchableOpacity onPress = {async ()=>{
                                           console.log(item.item)
                                              let params = {
                                                category_id:item.item.category == null? null : item.item.category,
                                                property_name:item.item.property==null?"Unknown":item.item.property.property_name,
                                                issue_title: item.item.title == null?'': item.item.title,
                                                name: item.item.corporate == null ? await Session.getUserName(): item.item.corporate.name,
                                                raise_date: item.item.raised_date==null ? null: item.item.raised_date,
                                                raise_time: item.item.raised_time==null? null: item.item.raised_time,
                                                description : item.item.description,
                                                status: item.item.status,
                                                image : item.item.issue_image == ''? null: item.item.issue_image,
                                                allData: item.item,
                                             }
    
                                             console.log("image;" ,item.item.issue_image, params)
                                             this.props.navigation.push('raiseissue', {
                                                emplogin: 1,
                                                param: params,
                                                purpose: "modify",
                                            })

                                             }}>
                                             <Text style = {[button.defaultRadius, font.regular, font.sizeRegular, color.myOrangeColor,{borderColor:color.myOrangeColor.color}]}>Update/ Modify Issue</Text>
                                         </TouchableOpacity>  
                                    </View>

                                           

                                 </View>
                         } />
                 </View>
             );
 
         }
 
 
 
     }
     setClicked = () => {
        this.setState({
            searchClicked: true,
        }, () => {
            console.log("clicked");
        })
    }
    
    setSearchPhrase = (val) => {
        this.setState({
            searchPhrase: val
        }, () => {
            console.log(this.state.searchPhrase);
        })

    }
    closeControlPanel = () => {
        this._drawer.close()
      };
      openControlPanel = () => {
        this._drawer.open()
      };

    render(){
        return(
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
            <View /* style = {[renderItem.topViewMargin, {height: '80%'}]} */ style={{ top: 10, paddingBottom: 80, alignContent: "center", height: "95%" }}>
                <LogoHeader 
                navigation = {this.props.navigation}
                title = "Issues List"  qrvisible = {false} onBarsPress = {()=>this.openControlPanel() }/>

                {this.state.data == null? null
            
                :
                
                <View style={[{ height: "100%", justifyContent: this.state.spinner ? "flex-start" : "center", paddingTop: "2%" }]}>
                <FlatList
                    keyboardShouldPersistTaps='always'
                    data={this.state.data}
                    renderItem={this._renderIssues}
                    horizontal={false}
                    keyExtractor={(item, index) => {
                        return item.id.toString();
                    }}
                    ListHeaderComponent={
                        <View style={styles.container}>
                            <Icon name="search" color="black" />
                            <TextInput
                                style={[styles.input, font.regular, font.sizeRegular, color.blackColor, color.whiteBackground]}
                                placeholder="Search by Issue ID"
                                placeholderTextColor={"black"}
                                value={this.state.searchPhrase}
                                onChangeText={this.setSearchPhrase}
                                onFocus={() => {
                                    this.setClicked();
                                }}
                            />
                        </View>
                    }



                    //stickyHeaderIndices={[0]}
                    ListFooterComponent={this.state.enablePagination ?
                        <View>
                            <View style={{ flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "space-around" }}>
                                <TouchableOpacity disabled={this.state.prev_page_url != null ? false : true}
                                    onPress={async () => {
                                        console.log(this.state.prev_page_url);
                                        this.apiCall( this.state.prev_page_url);

                                    }}
                                >
                                    <Text style={[font.regular, font.sizeRegular, color.myOrangeColor]}>Prev</Text>
                                </TouchableOpacity>
                                <TouchableOpacity disabled={this.state.next_page_url != null ? false : true}
                                    onPress={async () => {
                                        console.log(this.state.next_page_url);
                                        this.apiCall(this.state.next_page_url);

                                    }}>
                                    <Text style={[font.regular, font.sizeRegular, color.myOrangeColor]}>Next</Text>
                                </TouchableOpacity>
                                <TouchableOpacity disabled={this.state.last_page_url != null ? false : true}
                                    onPress={async () => {
                                        console.log(this.state.last_page_url);
                                        this.apiCall(this.state.last_page_url);

                                    }}>
                                    <Text style={[font.regular, font.sizeRegular, color.myOrangeColor]}>Last</Text>
                                </TouchableOpacity>

                            </View>
                            <View style={{ flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center" }}>

                                {this.state.links.map((item, index) => {
                                    //console.log(JSON.stringify(item));
                                    return (item.label == "pagination.previous" || item.label == "pagination.next" ? null :
                                        <TouchableOpacity disabled={item.url == null ? true : false} style={{ padding: "2%", }} onPress={async () => {
                                            this.apiCall( item.url  + '&user_id='+ await Session.getUserId());
                                        }}>
                                            <Text style={item.url == null ? {} : [color.myOrangeColor, font.regular, font.sizeRegular, { textDecorationLine: "underline", textDecorationColor: "orange" }]}>{item.label}</Text>
                                        </TouchableOpacity>
                                    );

                                })}

                            </View>
                        </View> : null
                    }

                />
                {this.state.spinner && <Spinner />}

            </View>
                
                }

            </View>
            </Drawer>

            
        );
    }
}



const styles = StyleSheet.create({
    container: {
        margin: 15,
        justifyContent: "flex-start",
        alignItems: "center",
        flexDirection: "row",
        width: "90%",

    },
    searchBar__unclicked: {
        padding: 10,
        flexDirection: "row",
        width: "95%",
        backgroundColor: "#d9dbda",
        borderRadius: 15,
        alignItems: "center",
    },
    searchBar__clicked: {
        padding: 10,
        flexDirection: "row",
        width: "80%",
        backgroundColor: "#d9dbda",
        borderRadius: 15,
        alignItems: "center",
        justifyContent: "space-evenly",
    },
    input: {
        fontSize: 20,
        marginLeft: 10,
        width: "95%",

    },
});