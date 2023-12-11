import React, { Component } from 'react';

import { View, Text, TouchableWithoutFeedback, Image, TouchableOpacity, TextInput, StyleSheet, StatusBar, BackHandler, RefreshControl, Dimensions, FlatList } from 'react-native';

import color from '../Styles/color';

import font from '../Styles/font';
import box from '../Styles/box';
import { employeePropertyListAPI, getPropertyListAPI, property_searchAPI, addToWishlist, login_check } from '../Rest/userAPI';
import FlatListComponent from './ReusableComponents/FlatlistComponent';
import CommonHelpers from '../Utils/CommonHelpers';
import SimilarPropertiesCard from './ReusableComponents/SimilarPropertiesCard';
import { AWS_URL, EMPLOYEE_PROPERTY_LIST, PROPERTY_LIST, SEARCH, ADD_TO_WISHLIST } from '../config/RestAPI';
import Spinner from '../Utils/Spinner';
import MapIcon from 'react-native-vector-icons/FontAwesome5';
import { StarRatingComponent } from './ReusableComponents/StarRatingComponent';
import location from '../Location/location';
import Session from '../config/Session';
import LogoHeader from './ReusableComponents/LogoHeader';
import Drawer from "react-native-drawer";
import Sidemenu from "../Navigation/Sidemenu";
import Searchbar from './NewReusable/searchbar';
import SortBy from './Filters/SortBy';
import FilterBy from './Filters/FilterBy';
import Mapping from './MeetingSpaces/Reusables/Mapping';
import CategoryItem from './MeetingSpaces/Reusables/CategoryItem';

export default class SRP extends Component {

  constructor() {

    super();

    this.state = {

      refreshing: false,
      data: [],
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
      // for filter

      modalOpen: false,
      showMaps: false,
      mapMarkers: [],
      isLogin: false,
      filterByOpen: false,
      sortByOpen: false,
      mapByOpen: false,
      longitude: null,
      latitude: null,
      propertyTypeSelection: [],
      resourceTypeSelection: [],
      amenitiesSelected: [],
      selectedSortParameter: '',
      values: [/* 100, 500 */],


      // for filter ends
      selectedSearchCategories: [],
      searchCategoryids: [],
      search_keyword: null,

    }

  }



  componentDidMount = async () => {

    this.backhandler = BackHandler.addEventListener("hardwareBackPress", async () => {
      //console.log('SRP');

      if(this.state.showMaps){
        this.setState({
          showMaps: false
        })
      }
      else{
        const userId = JSON.parse(await Session.getUserId());
        const role_id = JSON.parse(await Session.getRoleId());

        await Session.setSelectedAmenityType(JSON.stringify([]));
    await Session.setSelectedPropertyType(JSON.stringify([]));
    await Session.setSelectedResourceType(JSON.stringify([]));
    await Session.setSelectedSortOrder('');
    await Session.setSelectedValuesRange(JSON.stringify([]));

        if (userId != null && Number(role_id) == 5)

          this.props.navigation.push('bottomtabnavigator'/* 'masterhome' */);

        else if (userId != null && Number(role_id) == 7)
          this.props.navigation.push('afterlogin', { screen: 'employeehome' });
        else {

          this.props.navigation.push('masterhome')

        }

      }
        
        return true;
    })

    const searchCategories = JSON.parse(await Session.getWorkSpaceSearchCategories());
        //console.log('search categories : ****', searchCategories);
        let selectedCategoriesids = this.props.route.params.param.resource_group_id;
        //console.log('category ids: ****', selectedCategoriesids);

        let selectedCategories = [];

        if ( selectedCategoriesids != undefined && selectedCategoriesids.length > 0) {
            searchCategories.map((category, index) => {
                ////////console.log(category);
                let i = selectedCategoriesids.indexOf(category.id);
                if (i > -1) {
                    selectedCategories.push(category);
                }
            })
        }

      this.setState({
        selectedSearchCategories: selectedCategories,
        sortOrder: this.props.route.params.name != null ? this.props.route.params.name : '',
        sortPrice: this.props.route.params.price == undefined ? [] : this.props.route.params.price.length != 0 ? this.props.route.params.price : [],
        longitude: this.props.route.params.param.longitude == null ? null : this.props.route.params.param.longitude,
        latitude: this.props.route.params.param.latitude == null ? null: this.props.route.params.param.latitude,

      }, () => {

        //this.getAmenitesList();

        this.props.route.params.searchTerm ? this.searchCall() :

          this.apiCall(this.props.route.params.param == undefined ? {} : this.props.route.params.param, PROPERTY_LIST);

      })

    



    location.check().then((value) => {

      this.setState({

        locationPermission: value,

      }, () => {

        if (this.state.locationPermission) {

          location.getGeoLocation().then(async (value) => {

            await Session.setLocationCoords(value)

            this.setState({

              locationCoords: value,

            }, () => {



              //this.apiCallPropertyNearBy();

              //////console.log("Location Details: ", this.state.locationCoords, this.state.locationPermission);

            })

          })

        }

        else {

          location.requestPermission().then(value => {

            if (value) {

              location.getGeoLocation().then(async (values) => {

                await Session.setLocationCoords(values)

                this.setState({

                  locationPermission: true, //value,

                  locationCoords: values,

                }, async () => {



                  //this.apiCallPropertyNearBy();

                  //////console.log("Location Details: ", this.state.locationCoords, this.state.locationPermission);

                })

              })

            } else {

              this.setState({

                locationPermission: value,

              })

            }

          })

        }

      })

    });



    login_check().then(result => {

      if (result.status) {

        this.setState({

          isLogin: true,

        })

      }

    }).catch(error => {

      //console.log(error)

    })

  }

  _renderSearchCategories = ({ item, index }) => {
    return (

        <CategoryItem
            from={'meetingsrp'}
            name={item.resource_group_name}
            onPress={() => {
                let selectedIds = this.state.searchCategoryids;
                let idIndex = selectedIds.indexOf(item.id);
                selectedIds.splice(idIndex, 1);
                let selectedCategories = this.state.selectedSearchCategories;
                selectedCategories.map((category, index) => {
                    if (category.id == item.id) {
                        selectedCategories.splice(index, 1);
                    }
                })
                this.setState({
                    selectedSearchCategories: selectedCategories,
                    searchCategoryids: selectedIds,
                }, async() => {
                  let params;
                  this.state.isLogin ?
                     params = {
                        'latitude': this.props.route.params.param.latitude,
                        'longitude': this.props.route.params.param.longitude,
                        'resource_group_id': this.state.searchCategoryids,
                        'user_id': await Session.getUserId(),
                        
                    }
                    :
                     params = {
                      'latitude': this.props.route.params.param.latitude,
                      'longitude': this.props.route.params.param.longitude,
                      'resource_group_id': this.state.searchCategoryids,
                  }

                    this.setState({
                        params: params
                    })

                    this.apiCall(params, PROPERTY_LIST/* MEETING_PROPERTY_LIST */);
                })
            }}

        />



    );





}



  refresh = async () => {

    this.setState({

      refreshing: true,

      spinner: true

    })

    this.setState({

      sortOrder: this.props.route.params.name != null ? this.props.route.params.name : '',
      sortPrice: this.props.route.params.price == undefined ? [] : this.props.route.params.price.length != 0 ? this.props.route.params.price : [],
      longitude: this.props.route.params.param.longitude == null ? null : this.props.route.params.param.longitude,
      latitude: this.props.route.params.param.latitude == null ? null: this.props.route.params.param.latitude,

    }, () => {
      this.props.route.params.searchTerm ? this.searchCall() :
      this.apiCall(this.props.route.params.param == undefined ? {} : this.props.route.params.param, PROPERTY_LIST);



    })

    location.check().then((value) => {

      this.setState({

        locationPermission: value,

      }, () => {

        if (this.state.locationPermission) {

          location.getGeoLocation().then(async (value) => {

            await Session.setLocationCoords(value)

            this.setState({

              locationCoords: value,

            })

          })

        }

        else {

          location.requestPermission().then(value => {

            if (value) {

              location.getGeoLocation().then(async (values) => {

                await Session.setLocationCoords(values)

                this.setState({

                  locationPermission: true, //value,

                  locationCoords: values,

                })

              })

            } else {

              this.setState({

                locationPermission: value,

              })

            }

          })

        }

      })

    });



  }



  searchCall() {

    this.setState({

      data: this.props.route.params.param,

    }, () => {

      this.setState({

        spinner: false,

        refreshing: false

      });

    });

  }



  apiCall = (param, url) => {

    this.setState({

      spinner: true,

    });

    console.log("From  api call: ", url, param);
    getPropertyListAPI(param, url).then(async (result) => {

      if (result.status) {

        if (this.state.sortOrder == "low_to_high") {

          result.dataArray.sort((a, b) => {

            return a.least_plan_price.price - b.least_plan_price.price;

          });

          


        }

        else if (this.state.sortOrder == "high_to_low") {

          result.dataArray.sort((a, b) => {

            return b.least_plan_price.price - a.least_plan_price.price;

          });

          /*  result.dataArray.forEach((e) => {
 
             //////console.log(e.least_plan_price.price);
 
           }); */





        }


        if (this.state.sortPrice.length != 0) {

          //////console.log("here");

          var spliceArray = []

          var temp_array = result.dataArray;

          temp_array.forEach((item, index) => {

            ////////console.log(this.props.route.params.price[0], this.props.route.params.price[1], index,Number(item.least_plan_price.price));

            if (item.least_plan_price != null)

              if (Number(item.least_plan_price.price) < Number(this.state.sortPrice[0]) || Number(item.least_plan_price.price) > Number(this.state.sortPrice[1])) {

                console.log("splice", index, item.least_plan_price.price);

                spliceArray.push(index);

              }

          })



          for (var i = spliceArray.length - 1; i >= 0; i--) {



            result.dataArray.splice(spliceArray[i], 1);



          }
        }

        let mapMarkers = [];
        result.dataArray.map((item, index) => {
          const mapItem = {
            coordinate: {
              latitude: parseFloat(item.latitude),
              longitude: parseFloat(item.longitude),
            },
            imageURL: item.images.length == 0 ? require('./../Assets/images/BRHlogoorange.png') : { uri: CommonHelpers.processRawImages(item.images)[0].url },//{uri:AWS_URL+ item.images[0].image_path},
            item: item
          }
          mapMarkers.push(mapItem);
        })


        this.setState({

          data: result.dataArray,
          mapMarkers: mapMarkers

        }, async () => {

          if (this.props.route.params.emplogin == 1) {

            //////console.log("yess!!!!");



            await Session.setEmpPropertyDetails(this.state.data);

          }
        });



        if (result.pagesData.last_page > 1) {

          this.setState({

            enablePagination: true,

            prev_page_url: result.pagesData.prev_page_url,

            next_page_url: result.pagesData.next_page_url,

            last_page_url: result.pagesData.last_page_url,

            links: result.pagesData.links,

          }, () => {

            //console.log("Button status: ", this.state.prev_page_url, this.state.next_page_url, this.state.last_page_url);

          })

        }

      } else {

        await Session.setEmpPropertyDetails([])

        ////console.log('No results  ***')



        CommonHelpers.showFlashMsg(result.message, "danger");

      }

      this.setState({

        spinner: false,

        refreshing: false

      });



    })



  }

  openPropertyDetail = (id) => {



    this.props.navigation.push('detail', {

      property_id: id,

    });



    this.setState({

      spinner: false,

    })

  };



  calladdToWishlist = async (resource_id) => {

    //console.log('added to wishlist', resource_id);

    const params = {

      "user_id": Number(await Session.getUserId()),

      "resource_id": resource_id,

      "is_workspace": 1,

      "status": 1

    }



    addToWishlist(params, ADD_TO_WISHLIST).then(result => {

      //console.log('wishlist status: ', result.status)

      CommonHelpers.showFlashMsg(result.message, 'success');

      this.apiCall(this.props.route.params.param == undefined ? {} : this.props.route.params.param, PROPERTY_LIST);

    })

  }

  onMapClosed = () => {



    this.setState({

      showMaps: false,

    })

  }


  renderPropertyCard = (item) => {

    ////console.log(item.item);

    let imageList = CommonHelpers.processRawImages(item.item.images);

    /* item.item.images.forEach(element => {

      imageList.push({ url: AWS_URL + element.image_path });

    }); */

    return (

      <TouchableWithoutFeedback onPress={() => {



        this.state.emp_id == null ? this.openPropertyDetail(item.item.id) : null

      }} >

        <View height={400}>



          <SimilarPropertiesCard

            imageList={imageList}

            from="SRP"

            isLogin={this.state.isLogin}

            iconName={item.item.wish_list ? 'heart' : 'heart-o'}

            iconColor='orange'

            addToWishlist={() => this.calladdToWishlist(Number(item.item.resource_id))}

            contentdetails={

              <View style={[box.detailsBox]}>

                <View style={{ flex: 1 }}>

                  {this.props.route.params.emplogin == 1 ? null :

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

                      color.blackColor, { marginRight: "1%", flex: 1 }]}>

                      {this.props.route.params.emplogin == 1 ? item.item.property_name : item.item.show_actual_name ? item.item.property_name : item.item.pseudoname}

                    </Text>

                    <View style={{ marginTop: 1, flex: 1, width: Dimensions.get('screen').width * 0.5 }}>

                      <StarRatingComponent rating={5}/* {item.rating} */ />

                    </View>



                  </View>

                  <View style={{ flex: 2, }}>



                    <Text

                      style={[font.regular,

                      font.sizeMedium,

                      color.darkgrayColor, { marginBottom: "1%", /* flex: 1 */ }]}>

                      {/*  {item.item.address1}, */} {item.item.locality}, {item.item.city != null ? item.item.city.name : ''}

                    </Text>

                    {/*  <Text style={[font.regular, font.sizeMedium, color.blackColor, { flex: 1,textAlign :'justify' }]}>

                      {item.item.short_desc}.

                    </Text> */}

                    <View width={Dimensions.get('screen').width * 0.8}

                      style={{

                        flexDirection: 'row',

                        flexWrap: 'wrap',

                        marginTop: 10



                      }}>

                      {

                        item.item.property_amenities.map((item, index) => {

                          ////console.log(item.icon_path);

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



  //************filter funtions */



  onFilterByClosed = async () => {


    this.setState({
      filterByOpen: false,
      amenitiesSelected: JSON.parse(await Session.getSelectedAmenityType()),
      propertyTypeSelection: JSON.parse(await Session.getSelectedPropertyType()),
      resourceTypeSelection: JSON.parse(await Session.getSelectedResourceType()),
    }, () => {
      //console.log('afger setting: ', this.state.resourceTypeSelection);
    })

  }

  onSortByClosed = async () => {
    ////console.log(sortOrder, values)

    this.setState({
      sortByOpen: false,
      selectedSortParameter: await Session.getSelectedSortOrder(),
      values: JSON.parse(await Session.getSelectedValuesRange()),
    })
    return true;

  }

  onMapByClosed = () => {

    this.setState({
      mapByOpen: false,
    })

  }

  onFilterByOpened = () => {

    this.setState({

      filterByOpen: true,


    })

  }

  onSortByOpened = () => {

    this.setState({

      sortByOpen: true,


    })

  }

  onMapByOpened = () => {

    this.setState({

      mapByOpen: true,


    })

  }

  //********** filter funtions end. */



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


  render() {

    return (

      <Drawer

        ref={(ref) => this._drawer = ref}

        type="overlay"

        content={<Sidemenu navigation={this.props.navigation} close={() => this.closeControlPanel()} />}

        tapToClose={true}

        openDrawerOffset={0.2} // 20% gap on the right side of drawer

        panCloseMask={0.2}

        closedDrawerOffset={-3}

        //styles={drawerStyles}

        side='right'

        tweenHandler={(ratio) => ({

          main: { opacity: (2 - ratio) / 2 }

        })}

      >

        {

          //member dashboard

          <View style={{ top: 10, paddingBottom: 80, alignContent: "center", height: "95%" }}>

            <LogoHeader
              navigation={this.props.navigation}
              title="Be Right Here"
              onBarsPress={() => { this.openControlPanel() }}
            />

            {this.state.data != 0 ?

              <FlatListComponent

                keyboardShouldPersistTaps='always'
                key = {(item)=>{
                  item.id
                }}

                data={this.state.data}

                renderItem={this.renderPropertyCard}

                horizontal={false}

                refreshControl={<RefreshControl

                  refreshing={this.state.refreshing}
                  

                  onRefresh={this.refresh}

                />}

                refreshing={this.state.refreshing}

                ListHeaderComponent={<View

                  style={[

                    color.settingsButtonBorder,
                    color.whiteBackground,

                    {
                      flex: 1,
                      padding: 5,
                      backgroundColor: 'white',
                    }

                  ]}

                >

                  <TouchableWithoutFeedback>
                    <Searchbar
                      text="Search Company Properties..."
                      icon="list-2"
                      navigation={this.props.navigation}
                      apiCall ={async(e)=>{
                        this.setState({
                          search_keyword: e
                        })
                        let params = this.state.isLogin ?{
                          "property_type_id": this.state.propertyTypeSelection.length == 0 ? null : this.state.propertyTypeSelection,
              "amenity_id": this.state.amenitiesSelected.length == 0 ? null : this.state.amenitiesSelected,
              "latitude": this.state.latitude,//this.state.pl_latitude == '' ? null : this.state.pl_latitude.toString(),
              "longitude": this.state.longitude,//this.state.pl_longitude == '' ? null : this.state.pl_longitude.toString(),
              "is_meeting_space":null,
              "resource_group_id": this.state.resourceTypeSelection.length == 0 ?[] /* null */: this.state.resourceTypeSelection,
              'user_id': await Session.getUserId(),
              'search_keyword': e


                        } :
                        {
                          "property_type_id": this.state.propertyTypeSelection.length == 0 ? null : this.state.propertyTypeSelection,
              "amenity_id": this.state.amenitiesSelected.length == 0 ? null : this.state.amenitiesSelected,
              "latitude": this.state.latitude,//this.state.pl_latitude == '' ? null : this.state.pl_latitude.toString(),
              "longitude": this.state.longitude,//this.state.pl_longitude == '' ? null : this.state.pl_longitude.toString(),
              "is_meeting_space":null,
              "resource_group_id": this.state.resourceTypeSelection.length == 0 ?[] /* null */: this.state.resourceTypeSelection,
              'search_keyword': e
              

                        }
                        console.log('search params: ', params)

                        this.apiCall(params, PROPERTY_LIST);
                        
                      }}
                       />

                  </TouchableWithoutFeedback>

                  {
                                        this.state.selectedSearchCategories.length == 0 ? null :
                                    
                                    <View style={{
                                        height: 33,
                                        paddingTop: 5,
                                    }}>

                                        {

                                            this.state.selectedSearchCategories.length == 0 ? null :



                                                <FlatList
                                                    data={this.state.selectedSearchCategories}
                                                    renderItem={this._renderSearchCategories}
                                                    horizontal={true}
                                                    key={(item) => {
                                                        item.id
                                                    }}
                                                    keyExtractor={(item, index) => { item.id }}
                                                    showsHorizontalScrollIndicator={false}
                                                    extraData={this.state}
                                                />
                                        }

                                    </View>
                                    }

                  {/* filters */}

                  <View style={
                    [box.centerBox, box.horizontalBox,
                    {
                      backgroundColor: color.darkgrayColor.color,

                      // opacity:0.5,
                      marginTop: 10,
                      justifyContent: 'space-around',
                      padding: '1%',
                      height: Dimensions.get('window').height * 0.06,

                    }]}>
                    <TouchableOpacity
                      onPress={() => {
                        this.onSortByOpened();
                      }}
                      style={[, {
                        flex: 1,
                        height: '100%',
                        //backgroundColor: 'yellow',
                        alignItems: 'center',

                        justifyContent: 'center'
                      }]}>
                      <View style={[box.horizontalBox,]}>
                        <Image
                          source={require('./../Assets/images/SortWhite.png')}
                          style={[
                            {
                              marginRight: 5,
                              width: 20,
                              height: 20
                            }]}
                        />
                        <Text style={[
                          font.sizeRegular,
                          font.regular,
                          color.textWhiteColor, {
                            opacity: 1,
                          }
                        ]}>Sort</Text>
                      </View>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => {
                        this.onFilterByOpened();
                      }}
                      style={[{
                        flex: 1,
                        height: '100%',
                        //backgroundColor: 'yellow',
                        alignItems: 'center',

                        justifyContent: 'center'
                      }]}>
                      <View style={[box.horizontalBox]}>
                        <Image
                          source={require('./../Assets/images/FilterWhite.png')}
                          style={[

                            {
                              marginRight: 5,
                              width: 20,
                              height: 20
                            }]}
                        />
                        <Text style={[
                          font.sizeRegular,
                          font.regular,
                          color.textWhiteColor
                        ]}>Filter</Text>
                      </View>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => {
                        this.setState({
                          showMaps: true,
                        })
                      }}
                      style={[{
                        flex: 1,
                        height: '100%',
                        //backgroundColor: 'yellow',
                        alignItems: 'center',

                        justifyContent: 'center'
                      }]}>
                      <View style={[box.horizontalBox]}>
                        <MapIcon name='map-marked' size={20} color={'white'} style={{ marginRight: 5 }} />
                        <Text style={[
                          font.sizeRegular,
                          font.regular,
                          color.textWhiteColor
                        ]}>Map</Text>
                      </View>
                    </TouchableOpacity>

                  </View>

                </View>}

                ListFooterComponent={this.state.enablePagination ?

                  <View>

                    <View style={{ flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "space-around" }}>

                      <TouchableOpacity disabled={this.state.prev_page_url != null ? false : true}

                        onPress={() => {

                          //////console.log(this.state.prev_page_url);

                          this.apiCall(this.props.route.params.param, this.state.prev_page_url);



                        }}

                      >

                        <Text style={[font.regular, font.sizeRegular, color.myOrangeColor]}>Prev</Text>

                      </TouchableOpacity>

                      <TouchableOpacity disabled={this.state.next_page_url != null ? false : true}

                        onPress={() => {

                          //////console.log(this.state.next_page_url);

                          this.apiCall(this.props.route.params.param, this.state.next_page_url);



                        }}>

                        <Text style={[font.regular, font.sizeRegular, color.myOrangeColor]}>Next</Text>

                      </TouchableOpacity>

                      <TouchableOpacity disabled={this.state.last_page_url != null ? false : true}

                        onPress={() => {

                          //////console.log(this.state.last_page_url);

                          this.apiCall(this.props.route.params.param, this.state.last_page_url);



                        }}>

                        <Text style={[font.regular, font.sizeRegular, color.myOrangeColor]}>Last</Text>

                      </TouchableOpacity>



                    </View>

                    <View style={{ flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center" }}>



                      {this.state.links.map((item, index) => {

                        //////console.log(JSON.stringify(item));

                        return (item.label == "pagination.previous" || item.label == "pagination.next" ? null :

                          <TouchableOpacity disabled={item.url == null ? true : false} style={{ padding: "2%", }} onPress={() => {

                            this.apiCall(this.props.route.params.param, item.url);

                          }}>

                            <Text style={item.url == null ? {} : [color.myOrangeColor, font.regular, font.sizeRegular, { textDecorationLine: "underline", textDecorationColor: "orange" }]}>{item.label}</Text>

                          </TouchableOpacity>

                        );



                      })}



                    </View>

                  </View> : null

                }

              // ListFooterComponentStyle={this.props.ListFooterComponentStyle}

              /> :

              <View style={[box.centerBox, { height: "100%", justifyContent: this.state.spinner ? "flex-start" : "center" }]}>

                {this.state.spinner ? <Text style={[font.semibold, font.regular, color.darkgrayColor, { textAlign: "center" }]}>

                  Searching...

                </Text> :

                  <Text style={[font.semibold, font.regular, color.darkgrayColor, { textAlign: "center" }]}>

                    Sorry! No Search Results

                  </Text>}

              </View>}



            {this.state.spinner && <Spinner />}

            {this.state.filterByOpen && 
                    <FilterBy
                    navigation={this.props.navigation} 
                    closing={() => { this.onFilterByClosed() }} 
                    from={'workSpace'}
                    longitude= {this.state.longitude}
                    latitude ={this.state.latitude}
                   
                    />

                    }

            {
                    this.state.sortByOpen && 
                    <SortBy
                    navigation={this.props.navigation} 
                    closing={() => { this.onSortByClosed() }} 
                    from={'workSpace'}
                    longitude= {this.state.longitude}
                    latitude ={this.state.latitude}
                   
                    />

                    }

{

this.state.showMaps 
&& !isNaN( parseFloat(this.state.mapMarkers[0].coordinate.latitude) )
&& !isNaN( parseFloat(this.state.mapMarkers[0].coordinate.longitude) )
&& 
<Mapping

    initialRegion={{

        latitude: parseFloat(this.state.mapMarkers[0].coordinate.latitude),

        longitude: parseFloat(this.state.mapMarkers[0].coordinate.longitude),

        latitudeDelta: 0.015,

        longitudeDelta: 0.0121,

    }}

    mapMarkers={this.state.mapMarkers}

    navigation={this.props.navigation}

    closing={() => { this.onMapClosed() }}

    openDetails={(item) => {

        this.onMapClosed();
        this.openPropertyDetail(item.id);
    }}

    from={'meetingSpace'} />

}

          </View>

          //member dashboard ends

        }

      </Drawer>

    );



  }

}



const styles = StyleSheet.create({

  padding: { justifyContent: "center", position: "relative", left: 40, top: 0 },

  searchIcon: {

    width: 20,

    height: 20,

    position: "absolute",

    top: 15,

    left: 8,

  },

  filterIcon: {

    width: 20,

    height: 20,

    position: "absolute",

    top: 15,

    right: 38,

  },

  searchcontainer: {

    //margin: 15,

    justifyContent: "flex-start",

    alignItems: "center",

    flexDirection: "row",

    width: "100%",

    //backgroundColor: "pink"



  },

  searchinput: {

    fontSize: 20,

    marginLeft: 10,

    width: "95%",



  },

});