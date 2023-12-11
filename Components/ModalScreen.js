import React, { Component } from "react";
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  TouchableWithoutFeedback,
  Dimensions,
  FlatList,
  TouchableOpacity,
  LogBox, 
  Platform,
  ActionSheetIOS
} from "react-native";
import color from "./../Styles/color";
import { listofamenitiesapi, propertytypesAPI, resourcegroupsapi, login_check } from "./../Rest/userAPI";
import CommonHelpers from "./../Utils/CommonHelpers";
import font from "./../Styles/font";
import button from "./../Styles/button";
import box from "./../Styles/box";
import Icon from "react-native-vector-icons/FontAwesome";
//import Modal from 'react-native-modalbox';
import Modal from 'react-native-modal';
import filterParameters from './ModalComponent/filterParameters';
import { Picker } from '@react-native-picker/picker';
import FlatlistComponent from './ReusableComponents/FlatlistComponent';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import ButtonLocation from './ModalComponent/ButtonLocation';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
var screen = Dimensions.get('window');
import { PROPERTY_TYPES, RESOURCE_GROUPS } from "../config/RestAPI";
import Session from "../config/Session";



export default class ModalScreen extends Component {
  constructor() {
    super();
    this.state = {
      listOfAmenities: [],
      modalOpen: false,
      selectedSortParameter: 'low_to_high',
      allSortParameters: filterParameters[0].sortParameters,
      iAllSortParameters : filterParameters[0].iSortParameters,

      locationParameter: filterParameters[5].mylocations,
      locationsSelected: [],
      locationIndex: -1,
      filterPage: 1,
      perFilterPage: 6,
      loadMoreVisible: true,
      displayLocations: [],
      pl_longitude: '',
      pl_latitude: '',

      //Phase 2 code.
      /* distanceParameter: filterParameters[2].distance,
      distanceSelected: null,
      dIndexSel: null, */

      values: [100, 500],

      propertyType: filterParameters[6].resource_plan,
      propertyTypeSelection: [],

      resourceType: filterParameters[6].resource_plan,
      resourceTypeSelection: [],

      amenitiesParameter: filterParameters[4].amenities,
      amenitiesSelected: [],


      enablePagination: false, //for propertyTypes
      prev_page_url: '',
      next_page_url: '',
      last_page_url: '',
      links: '',

      r_enablePagination: false, //for resource types
      r_prev_page_url: '',
      r_next_page_url: '',
      r_last_page_url: '',
      r_links: '',
      isLogin: false,
      //****************filter parameters end******************


    }

  }
  getAmenitesList = () => {
    this.setState({
      spinner: true,
    })
    listofamenitiesapi().then(result => {
      //console.log(result.dataArray);
      if (result.status) {
        this.setState({
          listOfAmenities: result.dataArray,
        }, () => {
          ////console.log(this.state.listOfAmenities);
        })
      }
      else {
        if (result.message == "Network Error") {
          CommonHelpers.showFlashMsg("No Network Connection", "danger");
        } else {
          CommonHelpers.showFlashMsg(result.message + " -get list of amenities", "danger");
        }

      }
    })
  }

  componentDidMount() {
    LogBox.ignoreLogs(['VirtualizedLists should never be nested']);
    this.getPropertytypeslist(PROPERTY_TYPES);
    this.getAmenitesList();
    this.getResourceTypeList(RESOURCE_GROUPS);
    this.setState({
      modalOpen: true,
    })

    login_check().then(async(result) => {
      
     if(!result.status){
                this.setState({
                  isLogin: false
                })      
     }
     else{
      this.setState({
        isLogin:true
      })
     }

    }).catch(error => {
      //////console.log(error)
    })

  }

  getResourceTypeList = (url) => {
    console.log(url);
    this.setState({
      spinner: true,
    });
     resourcegroupsapi(url).then(result => {
      console.log("Resources types",result.dataArray);
      if (result.status) {

        this.setState({
          resourceType: result.dataArray,
        })
        if (result.pagesData.last_page > 1) {
          this.setState({
            r_enablePagination: true,
            r_prev_page_url: result.pagesData.prev_page_url,
            r_next_page_url: result.pagesData.next_page_url,
            r_last_page_url: result.pagesData.last_page_url,
            r_links: result.pagesData.links,
          }, () => {
            console.log("Button status: ", this.state.prev_page_url, this.state.next_page_url, this.state.last_page_url);
          })
        }
      }
      else {
        this.setState({

          propertyType: []
        })
      }
    }

    ).catch(error => {
      console.log(error);
      this.setState({
        propertyType: []
      })
    })
  }

  getPropertytypeslist = (url) => {
    console.log(url);
    this.setState({
      spinner: true,
    });
    propertytypesAPI(url).then(result => {
      // console.log(result);
      if (result.status) {

        this.setState({
          propertyType: result.dataArray,
        })
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
      }
      else {
        this.setState({

          propertyType: []
        })
      }
    }

    ).catch(error => {
      console.log(error);
      this.setState({
        propertyType: []
      })
    })
  }

  onFilterClosed = () => {
    ////console.log("Modal closed.");

    this.setState({
      modalOpen: false,
      displayLocations: [],
      filterPage: 1
    }, () => {
      this.props.closing();
    })
   
  }

  onFilterOpened = () => {
    ////console.log("modal opened.");
    this._newLocationList();
   
  }

  _renderLocation = (location) => {
    ////console.log(location);

    return (
      <ButtonLocation key={location.index} from="location"
        locationStyle={this.state.locationIndex == location.index ? [button.defaultRadius,
        font.bold, color.textWhiteColor,
        color.orangeBorder,
        { backgroundColor: "#f45b1e", borderWidth: 1 }] : [button.defaultRadius,
        font.bold, color.myOrangeColor,
        color.orangeBorder, { borderWidth: 1 }]}
        style={{ margin: "1%", width: "30%", marginBottom: "2%" }}
        onPress={() => {
          this.setState({
            locationIndex: location.index,
            locationsSelected: location.item.name, //this.compare("locationsSelected", location.item), //for multiple selections
            pl_latitude: location.item.latitude,
            pl_longitude: location.item.longitude,
          }, () => {
            //console.log("Latest Array: ", this.state.locationsSelected, this.state.pl_latitude, this.state.pl_longitude)
          });
        }}
        item={location.item.name} />
    );

  }

  _loadMore = () => {
    this.setState({
      filterPage: this.state.filterPage + 1,
    }, this._newLocationList)

  }
  _newLocationList = () => {
    var temp_array = [];
    ////console.log(this.state.locationParameter.length, this.state.displayLocations.length);

    if (this.state.displayLocations.length > this.state.locationParameter.length) {
      this.setState({
        loadMoreVisible: false,
      })
    }
    else {

      if (this.state.locationParameter.length == this.state.displayLocations.length) {
        this.setState({
          loadMoreVisible: false,
        })
      } else {
        var current_len;
        if (this.state.locationParameter.length >= (this.state.filterPage * this.state.perFilterPage)) {
          current_len = (this.state.filterPage * this.state.perFilterPage);
        }
        else {
          current_len = this.state.locationParameter.length;
        }
        for (var i = 0; i < current_len; i++) {
          temp_array.push(this.state.locationParameter[i]);
        }
        this.setState({
          displayLocations: temp_array,
          loadMoreVisible: true,
        }, () => {
          if (this.state.displayLocations.length >= this.state.locationParameter.length) {
            this.setState({
              loadMoreVisible: false,
            });
          }
        })

      }
    }
  }

  /*  _newLocationList = () => {
     var temp_array = [];
     ////console.log(this.state.locationParameter.length, this.state.displayLocations.length);
 
     if (this.state.displayLocations.length > this.state.locationParameter.length) {
       this.setState({
         loadMoreVisible: false,
       })
     }
     else {
 
       if (this.state.locationParameter.length == this.state.displayLocations.length) {
         this.setState({
           loadMoreVisible: false,
         })
       } else {
         var current_len;
         if (this.state.locationParameter.length >= (this.state.filterPage * this.state.perFilterPage)) {
           current_len = (this.state.filterPage * this.state.perFilterPage);
         }
         else {
           current_len = this.state.locationParameter.length;
         }
         for (var i = 0; i < current_len; i++) {
           temp_array.push(this.state.locationParameter[i]);
         }
         this.setState({
           displayLocations: temp_array,
           loadMoreVisible: true,
         }, () => {
           if (this.state.displayLocations.length >= this.state.locationParameter.length) {
             this.setState({
               loadMoreVisible: false,
             });
           }
         })
 
       }
     }
   } */

  multiSliderValuesChange = (values) => {
    this.setState({
      values,
    });
  }

  _renderPropertyType = (property) => {
    //console.log(" list of property types:",property.item);
    return (
      <ButtonLocation
        style={{ margin: "1%", width: "30%", marginBottom: "2%" }}
        item={property.item.property_type_name}//{property.item.plan_name}
        buttonClickStyle={[button.defaultRadius, font.sizeSmall,
        font.bold, color.textWhiteColor,
        color.orangeBorder,
        { backgroundColor: "#fc9200", borderWidth: 1 , justifyContent: "center"}]}

        buttonNotClickStyle={[button.defaultRadius,
        font.bold, color.myOrangeColor, font.sizeSmall,
        color.orangeBorder, { borderWidth: 1 , justifyContent: "center"}]}

        onPress={() => {
          this.setState({
            propertyTypeSelection: this.compare("propertyTypeSelection", property.item.id),
          }, console.log("property type filter state updated.", this.state.propertyTypeSelection)
          );

        }}

      />

    );
  }

  _renderResourceType = (property) => {
    console.log(" list of resource types:",property.item.resource_group_code);
    if(this.props.from == 'meetingSpace')
   
    {
      
      if(property.item.resource_group_code == 'MR' ||
      property.item.resource_group_code == 'CR' ||
  property.item.resource_group_code == 'CH' ||
    property.item.resource_group_code == 'BH' ||
    property.item.resource_group_code == 'BR' ||
    property.item.resource_group_code == 'EVNT' ||
    property.item.resource_group_code == 'AUDT'|| property.item.resource_group_code=='TR'  ){
      //console.log(this.props.from, property.item.resource_group_code);
      return (
      
        <ButtonLocation
          style={{ margin: "1%", width: "30%", marginBottom: "2%" }}
          item={property.item.resource_group_name}//{property.item.plan_name}
          buttonClickStyle={[button.defaultRadius,font.sizeSmall,
            
          font.bold, color.textWhiteColor,
          color.orangeBorder,
          { backgroundColor: "#fc9200", borderWidth: 1 }]}
  
          buttonNotClickStyle={[button.defaultRadius, font.sizeSmall,
            
          font.bold, color.myOrangeColor,
          color.orangeBorder, { borderWidth: 1 }]}
  
          onPress={() => {
            this.setState({
              resourceTypeSelection: this.compare("resourceTypeSelection", property.item.id),
            }, console.log("resource type filter state updated.", this.state.resourceTypeSelection)
            );
  
          }}
  
        />
  
      );

    }

    }
    else{
      return (
        <ButtonLocation
          style={{ margin: "1%", width: "30%", marginBottom: "2%" }}
          item={property.item.resource_group_name}//{property.item.plan_name}
          buttonClickStyle={[button.defaultRadius,font.sizeSmall,
            
          font.bold, color.textWhiteColor,
          color.orangeBorder,
          { backgroundColor: "#fc9200", borderWidth: 1 }]}
  
          buttonNotClickStyle={[button.defaultRadius, font.sizeSmall,
            
          font.bold, color.myOrangeColor,
          color.orangeBorder, { borderWidth: 1 }]}
  
          onPress={() => {
            this.setState({
              resourceTypeSelection: this.compare("resourceTypeSelection", property.item.id),
            }, console.log("resource type filter state updated.", this.state.resourceTypeSelection)
            );
  
          }}
  
        />
  
      );

    }
    
    
  
  }

  _renderAmenitiesParameter = (amenity) => {
    ////console.log(amenity.item);
    return (
      <ButtonLocation
        style={{ margin: "1%", width: "30%", marginBottom: "2%" }}
        item={amenity.item.amenity_name}
        buttonClickStyle={[button.defaultRadius, font.sizeSmall,
          
        font.bold, color.textWhiteColor,
        color.orangeBorder,
        { backgroundColor: "#fc9200", borderWidth: 1 }]}

        buttonNotClickStyle={[button.defaultRadius, font.sizeSmall,
        font.bold, color.myOrangeColor,
        color.orangeBorder, { borderWidth: 1 }]}

        onPress={() => {
          this.setState({
            amenitiesSelected: this.compare("amenitiesSelected", amenity.item.id),
          }, //console.log("your selections: ", this.state.amenitiesSelected)
          );
        }}
      />
    );
  }

  compare = (arrayName, item) => {
    var temp_array = this.state[arrayName];
    //console.log(temp_array);

    var index = -1;
    index = temp_array.indexOf(item);
    //console.log("index: ", index);

    if (index > -1) {
      temp_array.splice(index, 1);
    }
    else {
      temp_array.push(item);
    }

    return temp_array;
  }

  renderList() {
    const sortParameter = this.state.selectedSortParameter;
    return (
      <View style={[box.centerBox, { padding: "2%" }]}>
        <View width={"100%"} style={{ borderWidth: 0.4, 
          marginRight: 10,
           marginTop: "2%", 
           marginBottom: 10,
            borderColor: color.myOrangeColor.color }}>
         { 
          Platform.OS === 'ios' ?
          <TouchableOpacity onPress = {()=>{
            ActionSheetIOS.showActionSheetWithOptions(
              {
               options : this.state.iAllSortParameters,
               tintColor: color.myOrangeColor.color,
              },
              buttonIndex=>{
                this.setState({
                  selectedSortParameter: this.state.allSortParameters[buttonIndex].value,
                  //selectedSortParameter: this.state.iAllSortParameters[buttonIndex],
                }, ()=>{
                  console.log(this.state.selectedSortParameter);
                })


              }
            )
          }}>
            <View 
            style= {[
              button.defaultRadius,
              {borderColor: color.myOrangeColor.color ,
              flexDirection: 'row', 
              justifyContent: 'space-between', 
              marginTop: '3%'}]}
              >
              <Text 
              style ={[
                font.regular, 
                font.sizeRegular, 
                color.myOrangeColor]}>
                  {this.state.selectedSortParameter == '' ?
                  'Select the sort order' : 
                  this.state.selectedSortParameter }
                  </Text>
              <Icon 
              name = 'angle-down' 
              size = {20} 
              color = {color.myOrangeColor.color}
              />
            </View>
          </TouchableOpacity>
          
          : 
         
         <Picker
            selectedValue={sortParameter}
            style={{ width: "100%", 
            color: color.myOrangeColor.color, 
            fontFamily: font.regular.fontFamily }}
            dropdownIconColor = {color.myOrangeColor.color}
            mode={"dropdown"}
            //itemStyle={{}}
            prompt="Pick your choice"
            // fontFamily = "Montserrat-Regular"
            onValueChange={(itemValue, itemIndex) => {
              this.setState({
                selectedSortParameter: itemValue,
              })
            }
            }>
            {
              this.state.allSortParameters.map((item) => {
                return (
                  <Picker.Item key={item.value} 
                  label={"Sort by: " + item.label} 
                  value={item.value} 
                  
                  style={{ fontSize: 14,  
                    color: color.myOrangeColor.color, 
                    fontFamily: font.regular.fontFamily 
                  }} 
                    fontFamily={font.semibold.fontFamily}
                     />
                );
              })
            }
          </Picker>
}

        </View>

        <View
          style={[
            color.settingsButtonBorder,
            box.shadow_box,
            color.whiteBackground,
            // styles.searchStyle,
            {
              flex: 1,
              padding: 10,
              paddingTop: 10,
              backgroundColor: 'white',
            }
          ]}
        >
          <TouchableWithoutFeedback onPress={() => {
            ////console.log('Hello')
          }}>

           <GooglePlacesAutocomplete
              GooglePlacesDetailsQuery={{ fields: "geometry" }}
              textInputProps={{ placeholderTextColor: "gray" }}
              fetchDetails={true} // you need this to fetch the details object onPress
              placeholder='Search Areas, Location etc...'
              renderLeftButton={() =>

                <Icon name="search" color="black" size={20} style={{ alignSelf: "center", paddingLeft: 5 }} />
              }
              styles={{
                textInput: { color: "gray", fontFamily: font.regular.fontFamily, 
                
                //fontSize: font.sizeVeryRegular.fontSize, 
                allowFontScaling: false }, row: {
                  backgroundColor: "white",
                }, description: { color: "gray" }
              }}
              query={{
                key: "AIzaSyDgQlUgbgkWodIedIBpYIE8dMZJ7jjbbfA",
                language: "en", // language of the results
              }}
              onPress={(data, details = null) => {
                //console.log("data", data);
                //console.log("details", details);
                console.log(JSON.stringify(details?.geometry?.location));

                this.setState({

                  pl_latitude: details.geometry.location.lat,
                  pl_longitude: details.geometry.location.lng,

                });
              }}
              onFail={(error) => console.error(error)} />

          </TouchableWithoutFeedback>
        </View>






        {/*  <View style={{ marginTop: "4%" }}>
          <Text style={[font.semibold, font.sizeLarge]}>Filter by location</Text>
          <View style={{ flexDirection: "column", flex: 1 }}>
            <FlatlistComponent
              data={this.state.displayLocations}
              extraData={this.state}
              renderItem={this._renderLocation}
              horizontal={false}
              numColumns={3}
              columnWrapperStyle={{ justifyContent: "center" }}
              ListFooterComponent={() =>
                this.state.loadMoreVisible ?
                  <View>
                    <TouchableOpacity onPress={this._loadMore}>
                      <Text style={[font.regular,
                      font.sizeMedium,
                      color.myOrangeColor]}>
                        More...
                      </Text>
                    </TouchableOpacity>
                  </View>
                  : null

              }
              ListFooterComponentStyle={{ alignItems: "flex-end", marginRight: "10%", }}
            />


          </View>
        </View>  */}

        {/* Phase 2 code. */}
        {/*  <View style = {{flexDirection: "row"}}>
            <Text style = {[font.semibold, 
              font.sizeMedium, 
              color.darkgrayColor]}> Distance (Kms) {"   "}
              </Text>
              <FlatList
              data = {this.state.distanceParameter}
              renderItem = {this._renderDistance}
              horizontal={false}
              numColumns={5}
              columnWrapperStyle={{ justifyContent: "center" }}
              extraData={
                this.state.dIndexSel}
              />
              </View> */}


        {/* value slider  */}
        <View style={{ marginTop: "4%" }}>
          <View style={[{ flexDirection: "row" }]}>
            <Text style={[font.semibold, font.sizeMedium, color.darkgrayColor,]}>Price </Text>
            {this.state.values.length == 0 ? null : this.state.values.length == 1 ? <Text style={[font.semibold, font.sizeMedium, color.blackColor]}>
              Rs.{this.state.values[0]}</Text> :
              <Text style={[font.semibold, font.sizeMedium, color.blackColor]}>
                Rs.{this.state.values[0]} -- Rs.{this.state.values[1]}</Text>}
          </View>

          <MultiSlider
            values={[this.state.values[0], this.state.values[1]]}
            sliderLength={280}
            onValuesChange={this.multiSliderValuesChange}
            min={0}
            max={10000}
            step={100}
            selectedStyle={{ backgroundColor: "orange" }}
            markerStyle={{ backgroundColor: "orange" }}
          />
        </View>
        {/* value slider end */}

        {/* property type parameter */}
        <View style={{ marginTop: "4%" }}>
          <Text style={[
            font.semibold,
            font.sizeMedium,
            color.darkgrayColor
          ]}>Property Type</Text>

          <FlatList //Component
            data={this.state.propertyType}
            extraData={this.state}
            renderItem={this._renderPropertyType}
            horizontal={false}
            numColumns={3}
            columnWrapperStyle={{ justifyContent: "center" }}
            ListFooterComponent={
              this.state.enablePagination ?
                <View>
                  <View style={{ flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "space-around" }}>
                    <TouchableOpacity disabled={this.state.prev_page_url != null ? false : true}
                      onPress={() => {
                        console.log(this.state.prev_page_url);
                        this.getPropertytypeslist(this.state.prev_page_url);

                      }}
                    >
                      <Text style={[font.regular, font.sizeRegular, color.myOrangeColor]}>Prev</Text>
                    </TouchableOpacity>
                    <TouchableOpacity disabled={this.state.next_page_url != null ? false : true}
                      onPress={() => {
                        console.log(this.state.next_page_url);
                        this.getPropertytypeslist(this.state.next_page_url);

                      }}>
                      <Text style={[font.regular, font.sizeRegular, color.myOrangeColor]}>Next</Text>
                    </TouchableOpacity>
                    <TouchableOpacity disabled={this.state.last_page_url != null ? false : true}
                      onPress={() => {
                        console.log(this.state.last_page_url);
                        this.getPropertytypeslist(this.state.last_page_url);

                      }}>
                      <Text style={[font.regular, font.sizeRegular, color.myOrangeColor]}>Last</Text>
                    </TouchableOpacity>

                  </View>
                </View> : null
            }
          />
        </View>
        {/* property type parameter */}


         {/* resource type parameter */}
         <View style={{ marginTop: "4%" }}>
          <Text style={[
            font.semibold,
            font.sizeMedium,
            color.darkgrayColor
          ]}>Resource Type</Text>

          

          <FlatList //Component
            data={this.state.resourceType}
            extraData={this.state}
            renderItem={this._renderResourceType}
            horizontal={false}
           numColumns={3}
            columnWrapperStyle={{ justifyContent: "center" }}
            ListFooterComponent={
              this.state.r_enablePagination ?
                <View>
                  <View style={{ flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "space-around" }}>
                    <TouchableOpacity disabled={this.state.r_prev_page_url != null ? false : true}
                      onPress={() => {
                        console.log(this.state.r_prev_page_url);
                        this.getResourceTypeList(this.state.r_prev_page_url);

                      }}
                    >
                      <Text style={[font.regular, font.sizeRegular, color.myOrangeColor]}>Prev</Text>
                    </TouchableOpacity>
                    <TouchableOpacity disabled={this.state.r_next_page_url != null ? false : true}
                      onPress={() => {
                        console.log(this.state.r_next_page_url);
                        this.getResourceTypeList(this.state.r_next_page_url);

                      }}>
                      <Text style={[font.regular, font.sizeRegular, color.myOrangeColor]}>Next</Text>
                    </TouchableOpacity>
                    <TouchableOpacity disabled={this.state.r_last_page_url != null ? false : true}
                      onPress={() => {
                        console.log(this.state.r_last_page_url);
                        this.getResourceTypeList(this.state.r_last_page_url);

                      }}>
                      <Text style={[font.regular, font.sizeRegular, color.myOrangeColor]}>Last</Text>
                    </TouchableOpacity>

                  </View>
                </View> : null
            }
          />
          
        </View>
        {/* resource type parameter */}

        <View style={{ marginTop: "4%" }}>
          <Text style={[
            font.semibold,
            font.sizeMedium,
            color.darkgrayColor
          ]}>Amenities</Text>
          <FlatlistComponent
            data={this.state.listOfAmenities}
            extraData={this.state}
            renderItem={this._renderAmenitiesParameter}
            horizontal={false}
            numColumns={3}
            columnWrapperStyle={{ justifyContent: "center" }}
          />

        </View>

      </View>
    );
  }

  openSearchResult = (param, name, price) => {
    this.props.from == 'meetingSpace'?
    this.props.navigation.push('meetingsrp', {
      param: param,
      name: name,
      price: price,

  }):
    this.props.navigation.push('SRP', {
      param: param,
      name: name,
      price: price
    });
    }


  render() {
    return (
      // <Modal
      //   style={[styles.modal, styles.modal4, box.bill_shadow_box, { backgroundColor: "rgba(255,255,255,0.6)" }]}

      //   position={"bottom"}
      //   isOpen={this.state.modalOpen}
      //   onClosed={() => { this.onFilterClosed() }}
      //   onOpened={() => { this.onFilterOpened() }}
      //   swipeArea={30}
      //   backdropColor={"#fafafa"}
      //   backdropOpacity={0.9}
      // >


      //   <View style={[styles.greybar]}></View>
      //   <View style={[box.simpleBox]}>
      //     <Text style={[font.semibold, color.darkgrayColor,
      //     font.sizeExtraLarge]}>Advanced Filter</Text>

      //   </View>
      //   <ScrollView keyboardShouldPersistTaps='always' nestedScrollEnabled={true}>
      //     <View style={{ width: screen.width - 10, }}>
      //       {this.renderList()}
      //     </View>
      //   </ScrollView>


      //   <TouchableOpacity
      //     onPress={() => {
      //       var myFilters = [];
      //       myFilters.push(this.state.selectedSortParameter,
      //         this.state.locationsSelected,
      //         this.state.values,
      //         this.state.propertyTypeSelection,
      //         this.state.amenitiesSelected,
      //         this.state.resourceTypeSelection,
      //       );

      //       var params = {
      //         "property_type_id": this.state.propertyTypeSelection.length == 0 ? null : this.state.propertyTypeSelection,
      //         "amenity_id": this.state.amenitiesSelected.length == 0 ? null : this.state.amenitiesSelected,
      //         "latitude": this.state.pl_latitude == '' ? null : this.state.pl_latitude.toString(),
      //         "longitude": this.state.pl_longitude == '' ? null : this.state.pl_longitude.toString(),
      //         "is_meeting_space": this.props.from == 'meetingSpace' ? 1: null,
      //         "resource_group_id": this.state.resourceTypeSelection.length == 0 ?[] /* null */: this.state.resourceTypeSelection
      //       }

      //       this.setState({
      //         modalOpen: false,
      //       })
            
      //       this.openSearchResult(params, this.state.selectedSortParameter, this.state.values);


      //       //console.log(myFilters);
      //     }}
      //     style={{
      //       backgroundColor: "orange",
      //       width: "95%",
      //       alignItems: "center",
      //       justifyContent: "center",
      //       height: 50,
      //       //padding: "3%",
      //       marginBottom: 5
      //     }}>
      //     <Text style={[font.regular, font.sizeLarge, color.textWhiteColor]}>APPLY</Text>
      //   </TouchableOpacity>

      // </Modal>

<View>
      <Modal isVisible={this.state.modalOpen}
      avoidKeyboard = {false}
      backdropColor = {'white'}
      onBackdropPress={()=>{
        this.setState({
          modalOpen: false
        })
      }}
      scrollHorizontal=  {true}
      backdropOpacity = {0.5}
      onModalHide = {() => { this.onFilterClosed() }}
      onModalWillShow ={() => { this.onFilterOpened() }}
      propagateSwipe = {true}
      style = {{
        margin: 0, 
        backgroundColor: 'white', 
        height: Dimensions.get('screen').height*0.7, 
        flex:0 , 
        bottom: 0, 
        position: 'absolute',
        width: '100%',
        alignItems: 'center'
      }}
      
      >
        <View style={{ flex: 1, alignItems: 'center', width: '100%'}}>
           <View style={[styles.greybar]}></View>
      <View style={[box.simpleBox]}>
         <Text style={[font.semibold, color.darkgrayColor,
          font.sizeExtraLarge]}>Advanced Filter</Text>

        </View>
        <ScrollView
        //horizontal={true}
         keyboardShouldPersistTaps='always' nestedScrollEnabled={true}>
          <View style={{ width: screen.width - 10, }}>
            {this.renderList()}
          </View>
        </ScrollView>


        <TouchableOpacity
          onPress={async() => {
            var myFilters = [];
            myFilters.push(this.state.selectedSortParameter,
              this.state.locationsSelected,
              this.state.values,
              this.state.propertyTypeSelection,
              this.state.amenitiesSelected,
              this.state.resourceTypeSelection,
            );



            var params =this.state.isLogin ?{
              "property_type_id": this.state.propertyTypeSelection.length == 0 ? null : this.state.propertyTypeSelection,
              "amenity_id": this.state.amenitiesSelected.length == 0 ? null : this.state.amenitiesSelected,
              "latitude": this.state.pl_latitude == '' ? null : this.state.pl_latitude.toString(),
              "longitude": this.state.pl_longitude == '' ? null : this.state.pl_longitude.toString(),
              "is_meeting_space": this.props.from == 'meetingSpace' ? 1: null,
              "resource_group_id": this.state.resourceTypeSelection.length == 0 ?[] /* null */: this.state.resourceTypeSelection,
              'user_id': await Session.getUserId(),
            } : {
              "property_type_id": this.state.propertyTypeSelection.length == 0 ? null : this.state.propertyTypeSelection,
              "amenity_id": this.state.amenitiesSelected.length == 0 ? null : this.state.amenitiesSelected,
              "latitude": this.state.pl_latitude == '' ? null : this.state.pl_latitude.toString(),
              "longitude": this.state.pl_longitude == '' ? null : this.state.pl_longitude.toString(),
              "is_meeting_space": this.props.from == 'meetingSpace' ? 1: null,
              "resource_group_id": this.state.resourceTypeSelection.length == 0 ?[] /* null */: this.state.resourceTypeSelection
            }

            this.setState({
              modalOpen: false,
            })
            
            this.openSearchResult(params, this.state.selectedSortParameter, this.state.values);


            //console.log(myFilters);
          }}
          style={{
            backgroundColor: "orange",
            width: "100%",
            alignItems: "center",
            justifyContent: "center",
            height: 50,
            //padding: "3%",
            //marginBottom: 5
          }}>
          <Text style={[font.regular, font.sizeLarge, color.textWhiteColor]}>APPLY</Text>
        </TouchableOpacity>
          
        </View>
      </Modal>
    </View>


    );
  }
}

const styles = StyleSheet.create({

  wrapper: {
    //paddingTop: 50,
    //flex: 1
  },

  modal: {
    justifyContent: 'center',
    alignItems: 'center'
  },

  modal2: {
    height: 230,
    backgroundColor: "#3B5998"
  },
  greybar: {
    backgroundColor: "#eaeaea",
    marginTop: "2%",
    borderRadius: 50,
    padding: 0,
    width: "30%",
    height: "1%"
  },

  modal3: {
    height: 300,
    width: 300
  },

  modal4: {
    height: "75%"
  },

  btn: {
    margin: 10,
    backgroundColor: "#3B5998",
    color: "white",
    padding: 10
  },

  btnModal: {
    position: "absolute",
    top: 0,
    right: 0,
    width: 50,
    height: 50,
    backgroundColor: "transparent"
  },

  text: {
    color: "black",
    fontSize: 22
  }

});