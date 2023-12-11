import React, {Component} from 'react';
import {View, Text, TouchableOpacity, BackHandler, FlatList ,StyleSheet, TextInput } from 'react-native';
import box from '../Styles/box';
import font from '../Styles/font';
import color from '../Styles/color';
import renderItem from '../Styles/renderItem';
import ThemedDialog from 'react-native-elements/dist/dialog/Dialog';
import { AWS_URL, EMPLOYEE_CURRENT_RESERVATION, EMPLOYEE_PROPERTY_LIST, EMP_UPCOMING_RESERVATION,EMP_ALLOCATED_SEAT } from "../config/RestAPI";
import Spinner from '../UI/Spinner';
import Session from '../config/Session';
import { EmpAllocatedApi, getPropertyResouceTypes, getPropertyListAPI, getEmpMappedPropertyListAPI } from '../Rest/userAPI';
import Icon from 'react-native-vector-icons/FontAwesome';
import { StarRatingComponent } from './ReusableComponents/StarRatingComponent';
import SimilarPropertiesCard from './ReusableComponents/SimilarPropertiesCard';
import CommonHelpers from '../Utils/CommonHelpers';

export default class EmpAllocatedReservation extends Component{
    constructor(){
        super();

        this.state  = { 
            data: null,
            spinner: false,
            resourceTypes: [],

             //pagination variables
             enablePagination: false,
             prev_page_url: null,
             next_page_url: null,
             last_page_url: null,
             links: [],
             //paginationvariables ends

             searchPhrase: '',
             searchclicked: false,
        }
        
    }

    componentDidMount = async () => {
       
        let details = await Session.getUserDetails();
        details = JSON.parse(details);
        console.log(details);
        
        //this.props.searchTerm ? this.searchCall():
        this.apiCall({"emp_id":  details.id }, EMPLOYEE_PROPERTY_LIST);

        //this.fetchResourceTypes();


       /*  this.apiCall({

            "employee_id": Number(await Session.getUserId()),
            "corporate_id": userDetails.corporate_id,
            }, EMP_ALLOCATED_SEAT);
         */
    }

    fetchResourceTypes = async()=>{
        this.setState({
          spinner: true,
        })
        console.log("called");
        getPropertyResouceTypes().then((result)=>{
          this.setState({
            spinner: false,
          })
          console.log("resource types ",result.dataArray.data);
          if(result.status){
            //console.log("resource types ",result.dataArray);
            this.setState({
              resourceTypes : result.dataArray.data,
            }, async()=>{
                let userDetails = await Session.getUserDetails();
        userDetails = JSON.parse(userDetails);
        console.log(userDetails);
        this.apiCall({

            "employee_id": Number(await Session.getUserId()),
            "corporate_id": userDetails.corporate_id,
            }, EMP_ALLOCATED_SEAT);
            })
          }
        }).catch(error=>{
          console.log(error, "resource types error in allocated booking.");
        })
        
      }
  
    setSearchPhrase = (val) => {
        this.setState({
            searchPhrase: val
        }, () => {
            console.log(this.state.searchPhrase);
        })

    }
    setClicked = () => {
        this.setState({
            searchClicked: true,
        }, () => {
            console.log("clicked");
        })
    }

    apiCall = (param, url) => {
        this.setState({
          spinner: true,
        });
        console.log("From  api call: ", url);
    
    
        getEmpMappedPropertyListAPI(param, url).then(async(result) => {
          console.log( "search results: ", result.pagesData);
          
          if (result.status) {
            console.log("before: ", result.dataArray.length);
            result.dataArray.forEach((item, index) => {
              //console.log(item.least_plan_price.price);
            })
    
            this.setState({
              data: result.dataArray,
            });
    
            if (result.pagesData.last_page > 1) {
              this.setState({
                enablePagination: true,
                prev_page_url: result.pagesData.prev_page_url,
                next_page_url: result.pagesData.next_page_url,
                last_page_url: result.pagesData.last_page_url,
                links: result.pagesData.links,
              }, () => {
                console.log("Button status: ", this.state.prev_page_url, this.state.next_page_url, this.state.last_page_url);
              })
            }
          } else {
            
            if(result.message == "Request failed with status code 404"){
            CommonHelpers.showFlashMsg("No properties to show.", "danger");
            }
            else
            CommonHelpers.showFlashMsg(result.message, "danger");
          }
          this.setState({
            spinner: false,
            //refreshing: false
          });
          
        })
    
      }

    _renderAlloted = (item) => {
        console.log(item)
        let imageList =CommonHelpers.processRawImages(item.item.images);
        /* item.item.images.forEach(element => {
          imageList.push({ url: AWS_URL + element.image_path });
        });
         */
         if (this.state.searchPhrase == '') {
             return (
                 <View height={400}>
                     <SimilarPropertiesCard
                         imageList={imageList}
                         
                         //fromEmpReservation={true}
                         from="SRP"
                         isLogin = {true}
                         iconName='heart'
                         iconColor='orange'
                         contentdetails={
                            <View style={[box.detailsBox]}>
                            <View style={{ flex: 1 }}>
                            
                              <View style={{
                                /* flexDirection: "row", */ flex: 1,  /* backgroundColor: "red",  */ /* alignItems: "center" */
                              }}>
                                <Text
                                  style={[font.regular,
                                  font.sizeLarge,
                                  color.blackColor, { marginRight: "1%", flex: 1}]}>
                                  {item.item.property_name}
                                </Text>
                                <View style={{ marginTop: 1, flex: 1, width: '50%' }}>
                                  <StarRatingComponent rating={5}/* {item.rating} */ />
                                </View>
            
                              </View>
                              <View style={{ flex: 2 ,}}>
            
                                <Text
                                  style={[font.regular,
                                  font.sizeMedium,
                                  color.darkgrayColor, { marginBottom: "1%", /* flex: 1 */ }]}>
                                 {/*  {item.item.address1}, */} {item.item.address2}
                                </Text>
                                <Text style={[font.regular, font.sizeMedium, color.blackColor, { flex: 1, }]}>
                                  {item.item.short_desc}.
                                </Text>
                              </View>
            
                            </View>
            
            
                          </View>
            
                         } />
                 </View>
             );
 
         }
         else if (item.item.property_name.toLowerCase().includes(this.state.searchPhrase.toLowerCase().trim())) {
             return (
                 <View height={400}>
                     <SimilarPropertiesCard
                         imageList={imageList}
                         //fromEmpReservation={true}
                         from="SRP"
                         isLogin={true}
                         iconName='heart'
                         iconColor='orange'
                         contentdetails={
                            <View style={[box.detailsBox]}>
                            <View style={{ flex: 1 }}>
                            
                              <View style={{
                                /* flexDirection: "row", */ flex: 1,  /* backgroundColor: "red",  */ /* alignItems: "center" */
                              }}>
                                <Text
                                  style={[font.regular,
                                  font.sizeLarge,
                                  color.blackColor, { marginRight: "1%", flex: 1}]}>
                                  {item.item.property_name}
                                </Text>
                                <View style={{ marginTop: 1, flex: 1, width: '50%' }}>
                                  <StarRatingComponent rating={5}/* {item.rating} */ />
                                </View>
            
                              </View>
                              <View style={{ flex: 2 ,}}>
            
                                <Text
                                  style={[font.regular,
                                  font.sizeMedium,
                                  color.darkgrayColor, { marginBottom: "1%", /* flex: 1 */ }]}>
                                 {/*  {item.item.address1}, */} {item.item.address2}
                                </Text>
                                <Text style={[font.regular, font.sizeMedium, color.blackColor, { flex: 1, }]}>
                                  {item.item.short_desc}.
                                </Text>
                              </View>
            
                            </View>
            
            
                          </View>
            
                         } />
                 </View>
             );
 
         }
 
 
 
     }

    render(){

       
        return(

            this.state.data == null? <View style={[box.centerBox, { height: "100%", justifyContent: this.state.spinner ? "flex-start" : "center" }]}>
            {this.state.spinner ?
                <Text style={[font.regular, font.sizeRegular, color.blackColor, { textAlign: "center", }]}>Searching...</Text> :
                <Text style={[font.regular, font.sizeRegular, color.blackColor, { textAlign: "center", }]}> No Alloted Reservations.</Text>}
        </View>:
            <View style={[{ height: "100%", justifyContent: this.state.spinner ? "flex-start" : "center", paddingTop: "2%" }]}>

<FlatList
                        keyboardShouldPersistTaps='always'
                        data={this.state.data}
                        renderItem={this._renderAlloted}
                        horizontal={false}
                        keyExtractor={(item, index) => {
                            return item.id.toString();
                        }}
                        ListHeaderComponent={
                            <View style={styles.container}>
                                <Icon name="search" color="black" />
                                <TextInput
                                    style={[styles.input, font.regular, font.sizeRegular, color.blackColor, color.whiteBackground]}
                                    placeholder="Search by Property Name"
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
                                            this.apiCall(await Session.getUserId(), this.state.prev_page_url);

                                        }}
                                    >
                                        <Text style={[font.regular, font.sizeRegular, color.myOrangeColor]}>Prev</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity disabled={this.state.next_page_url != null ? false : true}
                                        onPress={async () => {
                                            console.log(this.state.next_page_url);
                                            this.apiCall(await Session.getUserId(), this.state.next_page_url);

                                        }}>
                                        <Text style={[font.regular, font.sizeRegular, color.myOrangeColor]}>Next</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity disabled={this.state.last_page_url != null ? false : true}
                                        onPress={async () => {
                                            console.log(this.state.last_page_url);
                                            this.apiCall(await Session.getUserId(), this.state.last_page_url);

                                        }}>
                                        <Text style={[font.regular, font.sizeRegular, color.myOrangeColor]}>Last</Text>
                                    </TouchableOpacity>

                                </View>
                                <View style={{ flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center" }}>

                                    {this.state.links.map((item, index) => {
                                        //console.log(JSON.stringify(item));
                                        return (item.label == "pagination.previous" || item.label == "pagination.next" ? null :
                                            <TouchableOpacity disabled={item.url == null ? true : false} style={{ padding: "2%", }} onPress={async () => {
                                                this.apiCall(await Session.getUserId(), item.url);
                                            }}>
                                                <Text style={item.url == null ? {} : [color.myOrangeColor, font.regular, font.sizeRegular, { textDecorationLine: "underline", textDecorationColor: "orange" }]}>{item.label}</Text>
                                            </TouchableOpacity>
                                        );

                                    })}

                                </View>
                            </View> : null
                        }

                    />

                    {this.state.spinner && <Spinner/>}
                
            </View>
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