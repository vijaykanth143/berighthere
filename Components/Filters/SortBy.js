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
import color from "../../Styles/color";
import { listofamenitiesapi, propertytypesAPI, resourcegroupsapi, login_check } from "../../Rest/userAPI";
import CommonHelpers from "../../Utils/CommonHelpers";
import font from "../../Styles/font";
import button from "../../Styles/button";
import box from "../../Styles/box";
import Icon from "react-native-vector-icons/FontAwesome";
import RadioGroup from 'react-native-radio-buttons-group';
//import Modal from 'react-native-modalbox';
import Modal from 'react-native-modal';
import filterParameters from '../ModalComponent/filterParameters';
import { Picker } from '@react-native-picker/picker';
import FlatlistComponent from '../ReusableComponents/FlatlistComponent';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import ButtonLocation from '../ModalComponent/ButtonLocation';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
var screen = Dimensions.get('window');
import { PROPERTY_TYPES, RESOURCE_GROUPS } from "../../config/RestAPI";
import Session from "../../config/Session";
import { BackHandler } from "react-native";



export default class SortBy extends Component {
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
      distanceParameter: filterParameters[2].distance,
      distanceSelected: null,
      dIndexSel: null,

      values: [/* 100, 500 */],

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

      costSortOption: [

        {

            id: '1', // acts as primary key, should be unique and non-empty string

            label: 'Sort By Low to High',

            value: 'low_to_high',

            labelStyle: { color: "black", fontFamily: font.regular.fontFamily },

            size: 20,

            selected: true

        }, {

            id: '2',

            label: 'Sort By High to Low',

            value: 'high_to_low',

            labelStyle: { color: "black", fontFamily: font.regular.fontFamily },

            size: 20,

            selected: false

            //disabled: true

        }

    ],


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

  

  async componentDidMount() {
    LogBox.ignoreLogs(['VirtualizedLists should never be nested']);
    
   

    this.setState({
      modalOpen: true,
      amenitiesSelected: JSON.parse(await Session.getSelectedAmenityType()),
      propertyTypeSelection: JSON.parse(await Session.getSelectedPropertyType()),
      resourceTypeSelection: JSON.parse(await Session.getSelectedResourceType()),
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

  onFilterClosed =async () => {
    ////console.log("Modal closed.");
    await Session.setSelectedSortOrder(this.state.selectedSortParameter);
    await Session.setSelectedValuesRange(JSON.stringify(this.state.values));
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

   multiSliderValuesChange = (values) => {
    this.setState({
      values,
    });
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

  onPressRadioButton = (options) => {
    console.log("my option: ", JSON.stringify(options));
    options.forEach(element => {

        if (element.selected) {
            element.labelStyle = { color: "black", fontFamily: "Montserrat-SemiBold" }
           /*  this.setState({
                reserveOptionSelected: element.id,
            }); */

            this.setState({
              selectedSortParameter: element.value,
              //selectedSortParameter: this.state.iAllSortParameters[buttonIndex],
            }, ()=>{
              console.log(this.state.selectedSortParameter);
            })
        } else {
            element.labelStyle = { color: "black", fontFamily: "Montserrat-Regular" }
        }
    });
}

  renderList() {
    const sortParameter = this.state.selectedSortParameter;
    return (
      <View style={[box.centerBox, { padding: "2%" }]}>
        {/* value slider  */}
        <View style={{ margin: "2%", marginBottom : 0 }}>
          <View style={[{ flexDirection: "row" }]}>
            <Text style={[font.semibold, font.sizeMedium, color.darkgrayColor,]}>Price </Text>
            {this.state.values.length == 0 ? null : this.state.values.length == 1 ? <Text style={[font.semibold, font.sizeMedium, color.blackColor]}>
              Rs.{this.state.values[0]}</Text> :
              <Text style={[font.semibold, font.sizeMedium, color.blackColor]}>
                Rs.{this.state.values[0]} -- Rs.{this.state.values[1]}</Text>}
          </View>

          <MultiSlider
            values={[100,700]/* [this.state.values[0], this.state.values[1]] */}
            sliderLength={280}
            onValuesChange={this.multiSliderValuesChange}
            min={0}
            max={10000}
            step={100}
            selectedStyle={{ backgroundColor: "orange" }}
            markerStyle={{ backgroundColor: "orange" }}
          />
        </View>

        <View>

                        <Text style={[font.semibold, font.regular, color.blackColor]}></Text>

                        <RadioGroup

                            radioButtons={this.state.costSortOption}

                            onPress={this.onPressRadioButton}

                            containerStyle={{
                              //justifyContent:'flex-start',
                          //backgroundColor: 'red',
                          alignItems: 'flex-start'
                        }}

                            layout='column'
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
      

<View /* height={'100%'} */>
      <Modal 
      
      isVisible={this.state.modalOpen}
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
      onBackButtonPress ={()=>{
        this.onFilterClosed();
      }}
      propagateSwipe = {true}
      style = {{
        margin: 0, 
        backgroundColor: 'white', 
        height: Dimensions.get('screen').height*0.4, 
        flex:0 , 
        bottom: 0, 
        position: 'absolute',
        width: '100%',
        alignItems: 'center'
      }}
      
      >
        <View style={{ flex: 1, alignItems: 'center', width: '100%'}}>
           <View style={[styles.greybar]}></View>
      <View style={[box.simpleBox, {
        margin:'2%',
      }]}>
         <Text style={[font.semibold, color.darkgrayColor,
          font.sizeExtraLarge]}>Sort</Text>
        

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


              console.log('what we have: ', this.props.resource, this.props.amenity, this.props.property);
            var params =this.state.isLogin ?{
              "property_type_id": /* this.props.property,// */this.state.propertyTypeSelection.length == 0 ? null : this.state.propertyTypeSelection,
              "amenity_id": /* this.props.amenity,// */this.state.amenitiesSelected.length == 0 ? null : this.state.amenitiesSelected,
              "latitude": this.props.latitude,//this.state.pl_latitude == '' ? null : this.state.pl_latitude.toString(),
              "longitude": this.props.longitude,//this.state.pl_longitude == '' ? null : this.state.pl_longitude.toString(),
              "is_meeting_space": this.props.from == 'meetingSpace' ? 1: null,
              "resource_group_id": /* this.props.resource,// */this.state.resourceTypeSelection.length == 0 ?[] /* null */: this.state.resourceTypeSelection,
              'user_id': await Session.getUserId(),
            } : {
              "property_type_id": /* this.props.property,// */this.state.propertyTypeSelection.length == 0 ? null : this.state.propertyTypeSelection,
              "amenity_id": /* this.props.amenity,// */this.state.amenitiesSelected.length == 0 ? null : this.state.amenitiesSelected,
              "latitude": this.props.latitude,//this.state.pl_latitude == '' ? null : this.state.pl_latitude.toString(),
              "longitude":this.props.longitude,// this.state.pl_longitude == '' ? null : this.state.pl_longitude.toString(),
              "is_meeting_space": this.props.from == 'meetingSpace' ? 1: null,
              "resource_group_id": /* this.props.resource,// */this.state.resourceTypeSelection.length == 0 ?[] /* null */: this.state.resourceTypeSelection
            }

            console.log(params);

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
           // bottom: 5
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