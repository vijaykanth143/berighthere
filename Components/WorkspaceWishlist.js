import React, { Component } from 'react';
import { View, Text, TouchableWithoutFeedback, Image, TouchableOpacity, FlatList, TextInput, StyleSheet, StatusBar, BackHandler, RefreshControl, Dimensions } from 'react-native';
import color from './../Styles/color';
import font from './../Styles/font';
import box from './../Styles/box';
import { getPropertyListAPI, getWishlist, addToWishlist } from './../Rest/userAPI';

import CommonHelpers from './../Utils/CommonHelpers';
import SimilarPropertiesCard from './ReusableComponents/SimilarPropertiesCard';
import { AWS_URL, BASE_URL, EMPLOYEE_PROPERTY_LIST, GET_WISHLIST, MEETING_PROPERTY_LIST, PROPERTY_LIST, SEARCH, third_party_text, ADD_TO_WISHLIST } from './../config/RestAPI';
import Spinner from './../Utils/Spinner';
import Icon from "react-native-vector-icons/FontAwesome";

import location from './../Location/location';

import Session from './../config/Session';

import button from './../Styles/button';

import { ActivityIndicator } from 'react-native';



export default class WorkspaceWishlist extends Component {
    constructor() {
        super();
        this.state = {
            refreshing: false,
            data: null,
            enablePagination: false,
            prev_page_url: null,
            next_page_url: null,
            last_page_url: null,
            spinner: false,
            sortOrder: '',
            sortPrice: [],
            listOfAmenities: [],
            locationPermission: false,
            locationCoords: {},

            // employee longin
            emp_id: null,
            username: null,

            //meeting spaces:
            selectedSearchCategories: [],
            searchCategoryids: [],
            params: {},
            scrolling: false,


            // for filter
            modalOpen: false,
            showMaps: false,
            mapMarkers: [],

            
            // for filter ends
        }
    }

    componentDidMount = async () => {
        ////console.log('Its a search result : ' , this.props.route.params.searchTerm);

        this.backhandler = BackHandler.addEventListener("hardwareBackPress", async() => {

           /*  this.props.navigation.goBack(); */
           const userId = JSON.parse(await Session.getUserId());
           if(userId != null)
           this.props.navigation.push('bottomtabnavigator'/* 'masterhome' */);
           else{
            this.props.navigation.push('masterhome');
           }

            return true;


        })
        const params = 
            {

                "user_id" : Number(await Session.getUserId()),
               /*  "is_meeting_space" : 1,
                "status" : 1 */
            
            }
        

        this.apiCall(params, GET_WISHLIST);
       
    }

    refresh = async () => {
        this.setState({
            refreshing: true,
            spinner: true
        })
        const params = 
        {

            "user_id" : Number(await Session.getUserId()),
           /*  "is_meeting_space" : 1,
            "status" : 1 */
        
        }
    

    this.apiCall(params, GET_WISHLIST);


      



       
    }

    apiCall =async (param, url) => {
        this.setState(
            {
                data: [],
                spinner: true
            }
        )
        

    //console.log("From  api call: ", url, param);
        getWishlist(param, url).then(async (result) => {

            if (result.status) {
                let meetingdata = [];

               // console.log('WISH LIST Results: ', JSON.stringify(result.pagesData));
                result.dataArray.map((item, index)=>{
                    console.log(item.is_workspace, item.is_meeting_space)
                    if(item.is_workspace == 1){
                        meetingdata.push(item)

                    }
                })
                
                this.setState({
                    data: meetingdata//result.dataArray,
                },()=>{
                    console.log('data', this.state.data)
                });

                /* if (result.pagesData.last_page > 1) {
                    this.setState({
                        enablePagination: true,
                        prev_page_url: result.pagesData.prev_page_url,
                        next_page_url: result.pagesData.next_page_url,
                        last_page_url: result.pagesData.last_page_url,
                        links: result.pagesData.links,
                    })
                }
 */
            } else {
                ////console.log('No results  ***')
                this.setState({
                    data: []
                })
                CommonHelpers.showFlashMsg(result.message, "danger");
            }
            this.setState({
                spinner: false,
                refreshing: false
            });

        })

    }

    openPropertyDetail = (id) => {
    
        this.props.navigation.push('detail',{
          property_id: id,
        } );
       
    this.setState({
      spinner: false,
    })
      };

      calladdToWishlist =async(resource_id)=>{
        console.log('added to wishlist', resource_id);
        const params ={
            "user_id" : Number(await Session.getUserId()),
            "resource_id" : resource_id,
            "is_workspace" : 1,
            "status" : 1
        }
    
        addToWishlist(params, ADD_TO_WISHLIST).then(async(result)=>{
            console.log('wishlist status: ', result.status)
           CommonHelpers.showFlashMsg(result.message, 'success');
           const params = 
        {

            "user_id" : Number(await Session.getUserId()),
           /*  "is_meeting_space" : 1,
            "status" : 1 */
        
        }
    

    this.apiCall(params, GET_WISHLIST);
        })
    }
    

    renderPropertyCard = (item) => {
        console.log(item.item);
        let imageList =CommonHelpers.processRawImages(item.item.images);
        /* item.images.forEach(element => {
          imageList.push({ url: AWS_URL + element.image_path });
        }); */
        return (
          <TouchableWithoutFeedback onPress={() => {
            
            this.openPropertyDetail(item.item.id)
          }} >
            <View height={400}>
    
              <SimilarPropertiesCard
                imageList={imageList}
                from="SRP"
                isLogin= {true}
                iconName= {item.item.wish_list ?'heart':'heart-o'}
                iconColor='orange'
                addToWishlist = {()=>this.calladdToWishlist(Number(item.item.resource_id))}
                contentdetails={
                  <View style={[box.detailsBox]}>
                    <View style={{ flex: 1 }}>
                    {
                      <View style={{ flexDirection: "row", marginBottom: "2%", flex: 0.5 }}>
                        
                        <Text style={[font.bold, font.sizeExtraLarge, color.blackColor, { marginRight: 15 }]}>
                          Starts from {'\u20B9'}{item.item.least_plan_price == null ? "--" : Intl.NumberFormat("en-IN").format(item.item.least_plan_price.price)}
                        </Text>
    
                      </View>}
                      <View style={{
                        /* flexDirection: "row", */ flex: 1,  /* backgroundColor: "red",  */ /* alignItems: "center" */
                      }}>
                        <Text
                          style={[font.regular,
                          font.sizeLarge,
                          color.blackColor, { marginRight: "1%", flex: 1}]}>
                          { item.item.show_actual_name ? item.item.property_name : item.item.pseudoname}
                        </Text>
                        <View style={{ marginTop: 1, flex: 1, width: '50%' }}>
                         {/*  <StarRatingComponent rating={5}  /> */}
                        </View>
    
                      </View>
                      <View style={{ flex: 2 ,}}>
    
                        <Text
                          style={[font.regular,
                          font.sizeMedium,
                          color.darkgrayColor, { marginBottom: "1%", /* flex: 1 */ }]}>
                         {/*  {item.address1}, */} {item.item.locality}, {item.item.city!=null? item.item.city.name: ''}
                        </Text>
                       {/*  <Text style={[font.regular, font.sizeMedium, color.blackColor, { flex: 1,textAlign :'justify' }]}>
                          {item.short_desc}.
                        </Text> */}
                        <View width={Dimensions.get('screen').width * 0.4}
                                            style={{
                                                flexDirection: 'row',
                                                flexWrap: 'wrap',
                                                marginTop: 10
    
                                            }}>
                                            {
                                                item.item.property_amenities.map((item, index) => {
                                                    //console.log(item.icon_path);
                                                    return (
                                                        <Image source={{ uri: AWS_URL + item.icon_path }}
                                                            style={{
                                                                width: 20,
                                                                height: 20,
                                                                marginRight: '4%',
                                                                resizeMode: 'contain'
                                                            }} />
                                                    );
                                                })
                                            }
                                        </View>
                      </View>
    
                    </View>
    
    
                  </View>
    
                } />
    
            </View>
          </TouchableWithoutFeedback>
        );
    
      }

   

    componentWillUnmount() {
        if (this.backhandler)
            this.backhandler.remove();
    }

    render() {
        return (

                <View style={{ top: 10, paddingBottom: 20, alignContent: "center", height: "95%" }}>
       
        {this.state.data != null ?

                        <FlatList
                        keyExtractor = {(item,index)=>{item.id}}
                            keyboardShouldPersistTaps='always'
                           key={(item)=>{item.id}}
                            data={this.state.data}
                            renderItem={(item)=>this.renderPropertyCard(item)}
                            horizontal={false}
                            onEndReached = {()=>{
                                console.log('scrolling value', this.state.next_page_url)
                                this.setState({
                                    scrolling: true,
                                })
                                if(this.state.next_page_url != null)
                                this.apiScrollCall(this.state.params, this.state.next_page_url);
                                else{
                                    CommonHelpers.showFlashMsg('Reached the end of list', 'success');
                                    this.setState({
                                        scrolling: false
                                    })
                                }
                            }}
                            refreshControl={<RefreshControl
                                refreshing={this.state.refreshing}
                                onRefresh={this.refresh}
                            />}
                            refreshing={this.state.refreshing}
                            ListFooterComponent={this.state.scrolling ?
                                <View>
                                    <ActivityIndicator  color={color.myOrangeColor.color} size={'large'} />
                                </View> : null
                            }
                        /> :
                        <View style={[box.centerBox, { height: "100%", justifyContent: this.state.spinner ? "flex-start" : "center" }]}>
                            {this.state.spinner ? <Text style={[font.semibold, font.regular, color.darkgrayColor, { textAlign: "center" }]}>
                                Searching...
                            </Text> :
                                <Text style={[font.semibold, font.regular, color.darkgrayColor, { textAlign: "center" }]}>
                                    Sorry! No Search Results
                                </Text>}
                        </View>
                        }

                    {this.state.spinner && <Spinner />}


                </View>

                


           
        );

    }
}


