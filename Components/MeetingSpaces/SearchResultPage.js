import React, { Component } from 'react';

import { View, Text, TouchableWithoutFeedback, Image, TouchableOpacity, FlatList, TextInput, StyleSheet, StatusBar, BackHandler, RefreshControl, Dimensions } from 'react-native';

import color from '../../Styles/color';

import font from '../../Styles/font';

import box from '../../Styles/box';

import { addToWishlist, getPropertyListAPI, login_check } from '../../Rest/userAPI';

import FlatListComponent from '../ReusableComponents/FlatlistComponent';

import CommonHelpers from '../../Utils/CommonHelpers';

import SimilarPropertiesCard from '../ReusableComponents/SimilarPropertiesCard';

import { ADD_TO_WISHLIST, AWS_URL, BASE_URL, EMPLOYEE_PROPERTY_LIST, MEETING_PROPERTY_LIST, PROPERTY_LIST, SEARCH, third_party_text } from '../../config/RestAPI';

import Spinner from '../../Utils/Spinner';

import Icon from "react-native-vector-icons/FontAwesome";

import { StarRatingComponent } from '../ReusableComponents/StarRatingComponent';

import { listofamenitiesapi } from '../../Rest/userAPI';

import location from '../../Location/location';

import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

import Session from '../../config/Session';

import LogoHeader from '../ReusableComponents/LogoHeader';

import ModalScreen from "../ModalScreen";

import Drawer from "react-native-drawer";

import Sidemenu from "../../Navigation/Sidemenu";



import button from '../../Styles/button';

import CategoryItem from './Reusables/CategoryItem';

import MapIcon from 'react-native-vector-icons/FontAwesome5';

import { ActivityIndicator } from 'react-native';

import Mapping from './Reusables/Mapping';
import FilterBy from '../Filters/FilterBy';
import SortBy from '../Filters/SortBy';
import image from '../../Styles/image';

export default class SearchResultPage extends Component {

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
            //meeting spaces:
            selectedSearchCategories: [],
            searchCategoryids: [],
            params: {},
            scrolling: false,
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
            selectedSortParameter:'',
            values: [/* 100, 500 */],
            


            // for filter ends

        }

    }


    componentDidMount = async () => {

        ////////console.log('Its a search result : ' , this.props.route.params.searchTerm);



        this.backhandler = BackHandler.addEventListener("hardwareBackPress", async () => {


console.log('maps: ', this.state.showMaps, 'filters: ', this.state.filterByOpen, 'sort : ', this.state.sortByOpen);
            if(this.state.showMaps){
                console.log('closing the maps.')
                this.setState({
                    showMaps: false
                })
            }
            else{
                 /*  this.props.navigation.goBack(); */
        await Session.setSelectedAmenityType(JSON.stringify([]));
        await Session.setSelectedPropertyType(JSON.stringify([]));
        await Session.setSelectedResourceType(JSON.stringify([]));
        await Session.setSelectedSortOrder('');
        await Session.setSelectedValuesRange(JSON.stringify([]));
            const userId = JSON.parse(await Session.getUserId());

            if (this.state.isLogin)
                this.props.navigation.push('bottomtabnavigator'/* 'masterhome' */);
            else {
                this.props.navigation.push('masterhome');
            }

            }

           
            return true;
        })


        const searchCategories = JSON.parse(await Session.getMeetingSearchCategories());
        console.log('search categories : ****', searchCategories);
        let selectedCategoriesids = this.props.route.params.param.resource_group_id;
        console.log('category ids: ****', selectedCategoriesids);

        let selectedCategories = [];

        if (selectedCategoriesids.length > 0) {
            searchCategories.map((category, index) => {
                //////console.log(category);
                let i = selectedCategoriesids.indexOf(category.id);
                if (i > -1) {
                    selectedCategories.push(category);
                }
            })
        }


        this.setState({
            selectedSearchCategories: selectedCategories,
            searchCategoryids: selectedCategoriesids,
            params: this.props.route.params.param,
            sortOrder: this.props.route.params.name != null ? this.props.route.params.name : '',
            sortPrice: this.props.route.params.price == undefined ? [] : this.props.route.params.price.length != 0 ? this.props.route.params.price : [],
            longitude: this.props.route.params.param.longitude == null ? null : this.props.route.params.param.longitude,
            latitude: this.props.route.params.param.latitude == null ? null: this.props.route.params.param.latitude,
            

        }, () => {

            console.log('params to send : ******', this.props.route.params.param == undefined ? {} : this.props.route.params.param)

            //this.getAmenitesList();
            

            this.props.route.params.searchTerm ? this.searchCall() :

                this.apiCall(this.props.route.params.param == undefined ? {} : this.props.route.params.param, PROPERTY_LIST/* MEETING_PROPERTY_LIST */);

        })





        location.check().then(async (value) => {

            await Session.setLocationPermission(value);

            this.setState({

                locationPermission: value,

            }, () => {

                if (this.state.locationPermission) {

                    location.getGeoLocation().then(async (value) => {
                        //console.log(value);

                        await Session.setLocationCoords(value)

                        this.setState({

                            locationCoords: value,
                            //latitude: value.coords.latitude.toString(),
                            //longitude: value.coords.longitude.toString(),

                        })

                    })

                }

                else {

                    location.requestPermission().then(async (value) => {

                        await Session.setLocationPermission(value);

                        if (value) {

                            location.getGeoLocation().then(async (values) => {

                                await Session.setLocationCoords(values)

                                this.setState({

                                    locationPermission: true, //value,

                                    locationCoords: values,
                                   // latitude: values.coords.latitude.toString(),
                           // longitude: values.coords.longitude.toString(),

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

        login_check().then((result) => {

            if (result.status) {

                this.setState({

                    isLogin: true

                })

            }

        })

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

                this.apiCall(this.state.params, PROPERTY_LIST/* MEETING_PROPERTY_LIST */);
        })

        location.check().then(async (value) => {

            await Session.setLocationPermission(value);

            this.setState({

                locationPermission: value,

            }, () => {

                if (this.state.locationPermission) {

                    location.getGeoLocation().then(async (value) => {

                        await Session.setLocationCoords(value)

                        this.setState({

                            locationCoords: value,
                           // latitude: value.coords.latitude.toString(),
                           // longitude: value.coords.longitude.toString(),

                        }, () => {



                            //this.apiCallPropertyNearBy();

                            //////////console.log("Location Details: ", this.state.locationCoords, this.state.locationPermission);

                        })

                    })

                }

                else {

                    location.requestPermission().then(async (value) => {

                        await Session.setLocationPermission(value);

                        if (value) {

                            location.getGeoLocation().then(async (values) => {

                                await Session.setLocationCoords(values)

                                this.setState({

                                    locationPermission: true, //value,

                                    locationCoords: values,
                                    //latitude: values.coords.latitude.toString(),
                                   // longitude: values.coords.longitude.toString(),

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

    onMapClosed = () => {



        this.setState({

            showMaps: false,

        })

    }

    calladdToWishlist = async (resource_id) => {

        ////console.log('added to wishlist');



        const params = {

            "user_id": Number(await Session.getUserId()),

            "resource_id": resource_id,

            "is_workspace": 0,

            "status": 1

        }



        addToWishlist(params, ADD_TO_WISHLIST).then(result => {

            ////console.log('wishlist status: ', result.status);

            CommonHelpers.showFlashMsg(result.message, 'success');

            this.apiCall(this.state.params, PROPERTY_LIST);



        })

    }

    apiCall = async (param, url) => {
        this.setState(
            {
                data: [],
                spinner: true
            }
        )
        console.log("From  api call: ", url, param);
        getPropertyListAPI(param, url).then(async (result) => {
            ////console.log("from " + this.props.route.params.name + "search results: ", result.status);
            if (result.status) {
                //////console.log('Results: ', JSON.stringify(result.pagesData));
                let mapMarkers = [];
                

                if (this.state.sortOrder == "low_to_high") {
                    result.dataArray.sort((a, b) => {
                      return a.least_plan_price.price - b.least_plan_price.price;
                    });
                    result.dataArray.forEach((e) => {
                      //console.log(e.least_plan_price.price);
                    });
                  }
                  else if (this.state.sortOrder == "high_to_low") {
                    result.dataArray.sort((a, b) => {
                      return b.least_plan_price.price - a.least_plan_price.price;
                    });
                    result.dataArray.forEach((e) => {
                      //console.log(e.least_plan_price.price);
                    });
                  }

                  if (this.state.sortPrice.length != 0) {
                    //////console.log("here");
                    var spliceArray = []
                    var temp_array = result.dataArray;
                    temp_array.forEach((item, index) => {
                      ////////console.log(this.props.route.params.price[0], this.props.route.params.price[1], index,Number(item.least_plan_price.price));
                      if(item.least_plan_price != null)
                      if (Number(item.least_plan_price.price) < Number(this.state.sortPrice[0]) || Number(item.least_plan_price.price) > Number(this.state.sortPrice[1])) {
                        console.log("splice", index, item.least_plan_price.price);
                        spliceArray.push(index);
                      }
                    })
                    for (var i = spliceArray.length - 1; i >= 0; i--) {
                      result.dataArray.splice(spliceArray[i], 1);
                    }
                    //console.log("array length: ", result.dataArray.length);
          
                  }

                  result.dataArray.map((item, index) => {
                    const mapItem = {
                        coordinate: {
                            latitude: parseFloat(item.latitude),
                            longitude: parseFloat(item.longitude),
                        },
                        imageURL: (item.images == null || item.images.length == 0) ? require('./../../Assets/images/BRHlogoorange.png') : { uri: CommonHelpers.processRawImages(item.images)[0].url },//{uri:AWS_URL+ item.images[0].image_path},
                        item: item
                    }
                    mapMarkers.push(mapItem);
                }) 

                this.setState({
                    data: result.dataArray,
                    mapMarkers: mapMarkers,
                //scrolling: false
                },()=>{
                    this.setState({
                        showMaps: this.props.route.params.openMaps,
                    })
                });

                if (result.pagesData.last_page > 1) {

                    this.setState({
                        enablePagination: true,
                        prev_page_url: result.pagesData.prev_page_url,
                        next_page_url: result.pagesData.next_page_url,
                        last_page_url: result.pagesData.last_page_url,
                        links: result.pagesData.links,
                    })
                }
                this.setState({
                    spinner: false,
                    refreshing: false
                });

            } else {
                ////////console.log('No results  ***')
                this.setState({
                    data: []
                })
                CommonHelpers.showFlashMsg(result.message, "danger");
                this.setState({
                    spinner: false,
                    refreshing: false
                });
            }
            
        })



    }

    apiScrollCall = async (param, url) => {
        ////console.log('url hit: ', url)
        await Session.setScrollData(JSON.stringify(this.state.data));
        //////console.log("From  api call: ", url, param);
        getPropertyListAPI(param, url).then(async (result) => {

            // ////console.log("from " + this.props.route.params.name + "search results: ", result.pagesData);
            if (result.status) {



                ////console.log('Results: ', JSON.stringify(result.pagesData.next_page_url));

                let data = [...this.state.data, ...result.dataArray]

                let mapMarkers = [];

                

                if (this.state.sortOrder == "low_to_high") {
                    /* result.dataArray */data.sort((a, b) => {
                      return a.least_plan_price.price - b.least_plan_price.price;
                    });
                    /* result.dataArray */data.forEach((e) => {
                      //console.log(e.least_plan_price.price);
                    });
                  }
                  else if (this.state.sortOrder == "high_to_low") {
                    /* result.dataArray */data.sort((a, b) => {
                      return b.least_plan_price.price - a.least_plan_price.price;
                    });
                    /* result.dataArray */data.forEach((e) => {
                      //console.log(e.least_plan_price.price);
                    });
                  }

                  if (this.state.sortPrice.length != 0) {
                    //console.log("here");
                    var spliceArray = []
                    var temp_array = data;//result.dataArray;
                    temp_array.forEach((item, index) => {
                      //console.log(this.props.route.params.price[0], this.props.route.params.price[1], index,Number(item.least_plan_price.price));
                      if(item.least_plan_price != null)
                      if (Number(item.least_plan_price.price) < Number(this.state.sortPrice[0]) || Number(item.least_plan_price.price) > Number(this.state.sortPrice[1])) {
                        //console.log("splice", index, item.least_plan_price.price);
                        spliceArray.push(index);
                      }
                    })
                    for (var i = spliceArray.length - 1; i >= 0; i--) {
                      /* result.dataArray */data.splice(spliceArray[i], 1);
                    }
                    //console.log("array length: ", /* result.dataArray */data.length);
          
                  }

                  /* result.dataArray */data.map((item, index) => {
                    //////console.log('item', item);
                    const mapItem = {
                        coordinate: {
                            latitude: parseFloat(item.latitude),
                            longitude: parseFloat(item.longitude),
                        },
                        imageURL:(item.images == null || item.images.length == 0 )? require('./../../Assets/images/BRHlogoorange.png') : { uri: CommonHelpers.processRawImages(item.images)[0].url },//{uri:AWS_URL+ item.images[0].image_path},
                        item: item
                    }
                    mapMarkers.push(mapItem);
                })

                this.setState({
                    data: data,
                    scrolling: false,
                    mapMarkers: mapMarkers
                })

                if (result.pagesData.last_page > 1) {
                    this.setState({
                        enablePagination: true,
                        prev_page_url: result.pagesData.prev_page_url,
                        next_page_url: result.pagesData.next_page_url,
                        last_page_url: result.pagesData.last_page_url,
                        links: result.pagesData.links,
                    })
                }
            } else {

                ////////console.log('No results  ***')
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

    openPropertyDetail = (params, images) => {



        this.props.navigation.push('meetingspacedetail', {

            params: params,

            resource_images: images == null ?[require('./../../Assets/images/BRHlogoorange.png')] : CommonHelpers.processRawImages(images),

        });



        this.setState({

            spinner: false,

        })

    };

    renderPropertyCard = (item) => {

        console.log(item.item.images == null ? item.item: null);

        const data = JSON.parse(JSON.stringify(item.item));

        let imageList = item.item.images == null ? [{url:require('./../../Assets/images/BRHlogoorange.png')}]: CommonHelpers.processRawImages(item.item.images);

        return (

            <TouchableWithoutFeedback key={item.index} onPress={() => {

                ////console.log("details for params", item.item.id, item.item.resource_id);

                const params = {

                    'property_id': Number(item.item.id),

                    'resource_id': Number(item.item.resource_id),

                    'is_meeting_space': 1,

                }

                this.openPropertyDetail(params, item.item.images == null ? [{url:require('./../../Assets/images/BRHlogoorange.png')}]: CommonHelpers.processRawImages(item.item.images));

            }} >

                <View height={370}>



                    <SimilarPropertiesCard

                        imageList={imageList}

                        from="SRP"

                        isLogin={this.state.isLogin}

                        iconName={item.item.wish_list ? 'heart' : 'heart-o'}

                        iconColor='orange'

                        addToWishlist={() => this.calladdToWishlist(Number(item.item.resource_id))}

                        contentdetails={

                            <View style={{ padding: '1%' }}>

                                <Text style={[

                                    font.semibold,

                                    font.sizeLarge,

                                    color.darkgrayColor,

                                    {

                                        padding: 3

                                    }



                                ]}>{data.resource_name}</Text>

                                <View style={[

                                    font.regular,

                                    font.sizeRegular,

                                    color.darkgrayColor,



                                    {

                                        flexDirection: 'row',

                                        justifyContent: 'space-between',

                                        padding: 3

                                    }]}>

                                    <Text>{data.locality}, {data.city['name']}</Text>

                                    <Text style={[

                                        font.regular,

                                        font.sizeRegular,

                                        color.myOrangeColor,

                                    ]}>{'\u20B9'} {

                                            item.item.least_plan_price == null ?

                                                "--" :

                                                Intl.NumberFormat("en-IN").format(item.item.least_plan_price.price)

                                        }/{item.item.least_plan_price == null ?

                                            "--" :

                                            item.item.least_plan_price.unit}</Text>





                                </View>

                                <View style={{

                                    flexDirection: 'row',

                                    justifyContent: 'space-between',



                                    padding: 3

                                }}>

                                    {/* <StarRatingComponent rating={5} /> */}

                                    {

                                        data.distance != null ?

                                            <Text>{Math.ceil(data.distance[0].distance)}Kms <Icon name='map-marker'></Icon></Text> : null

                                    }



                                </View>



                                <View style={{

                                    flexDirection: 'row',

                                    justifyContent: 'space-between',

                                    padding: 3,



                                }}>

                                    <View width={Dimensions.get('screen').width * 0.6}

                                        style={{

                                            flexDirection: 'row',

                                            flexWrap: 'wrap',



                                        }}>

                                        {

                                            data.property_amenities.map((item, index) => {

                                                ////////console.log(item.icon_path);

                                                return (

                                                    <Image source={{ uri: AWS_URL + item.icon_path }}

                                                        style={{

                                                            width: 20,

                                                            height: 20,

                                                            padding: 5,

                                                            marginRight: '2%',

                                                            resizeMode: 'contain'

                                                        }} />

                                                );

                                            })

                                        }

                                    </View>

                                    <TouchableOpacity onPress={() => {

                                        this.openPropertyDetail({

                                            'property_id': Number(item.item.id),

                                            'resource_id': Number(item.item.resource_id),

                                            'is_meeting_space': 1,

                                        }, item.item.images)

                                    }}>

                                        <Text style={[

                                            button.defaultRadius, font.bold, font.sizeRegular, {

                                                color: "white",

                                                backgroundColor: color.myOrangeColor.color,

                                                width: Dimensions.get('screen').width * 0.3,

                                                height: 40,

                                                borderColor: color.myOrangeColor.color,

                                                alignSelf: 'center'



                                            }



                                        ]}>

                                            {data.least_plan_price != null ?

                                                data.least_plan_price.is_only_request_booking == 1 ?

                                                    'REQUEST NOW' : 'BOOK NOW' : 'KNOW MORE'

                                            }</Text>



                                    </TouchableOpacity>



                                </View>

                            </View>

                        } />



                </View>

            </TouchableWithoutFeedback>

        );



    }



    //************filter funtions */


    onFilterByClosed = async() => {
       

        this.setState({
            filterByOpen: false,
            amenitiesSelected: JSON.parse(await Session.getSelectedAmenityType()),
            propertyTypeSelection: JSON.parse(await Session.getSelectedPropertyType()),
            resourceTypeSelection:JSON.parse(await Session.getSelectedResourceType()),
        },()=>{
            console.log('afger setting: ', this.state.resourceTypeSelection);
        })

    }

    onSortByClosed =async () => {
        //console.log(sortOrder, values)

        this.setState({
            sortByOpen: false,
            selectedSortParameter: await Session.getSelectedSortOrder(),
            values: JSON.parse(await Session.getSelectedValuesRange()),
        })

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

    _renderSearchCategories = ({ item, index }) => {
        return (

            <CategoryItem

                from={'meetingsrp'}

                name={item.resource_group_name}

                onPress={() => {



                    let selectedIds = this.state.searchCategoryids;

                    //////console.log('selected id list: ', selectedIds);

                    //////console.log('id to be removed: ', item.id);

                    let idIndex = selectedIds.indexOf(item.id);

                    //////console.log('index to remove', idIndex);

                    selectedIds.splice(idIndex, 1);



                    let selectedCategories = this.state.selectedSearchCategories;

                    /* let index = selectedCategories.indexOf(item.id);
    
                    //////console.log('index to remove category', index);
    
                    selectedCategories.splice(index,1); */

                    selectedCategories.map((category, index) => {

                        if (category.id == item.id) {

                            selectedCategories.splice(index, 1);

                        }

                    })



                    this.setState({

                        selectedSearchCategories: selectedCategories,

                        searchCategoryids: selectedIds,

                    }, () => {

                        const params = {

                            'latitude': this.props.route.params.param.latitude,

                            'longitude': this.props.route.params.param.longitude,

                            'resource_group_id': this.state.searchCategoryids,

                            'is_meeting_space': 1

                        }

                        this.setState({

                            params: params

                        })

                        this.apiCall(params, PROPERTY_LIST/* MEETING_PROPERTY_LIST */);

                        //////console.log('new selected categories******', this.state.selectedSearchCategories, this.state.searchCategoryids);

                    })



                }}

            />



        );





    }


    render() {

        return(

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

                <View style={{ top: 10,  
                    paddingBottom: /* this.state.filterByOpen || this.state.sortByOpen ? 0: */ 20,  
                    alignContent: "center", 
                    height: /* this.state.filterByOpen || this.state.sortByOpen ?'99%': */"95%" }}>

                    <LogoHeader

                        navigation={this.props.navigation}

                        title="Discover"

                        onBarsPress={() => {

                            this.openControlPanel()

                        }}

                        from={'meetingsrp'} />


                    {this.state.data != 0 ?

                        <FlatList

                            keyExtractor={(item, index) => { item.id }}

                            keyboardShouldPersistTaps='always'

                            key={(item) => {

                                item.id

                            }}

                            data={this.state.data}

                            renderItem={this.renderPropertyCard}

                            horizontal={false}

                            onEndReached={() => {

                                ////console.log('scrolling value', this.state.next_page_url)

                                this.setState({

                                    scrolling: true,

                                })

                                if (this.state.next_page_url != null)

                                    this.apiScrollCall(this.state.params, this.state.next_page_url);

                                else {

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



                            ListHeaderComponent={

                                <View
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

                                    <TouchableWithoutFeedback onPress={() => {
                                    }}>

                                        <GooglePlacesAutocomplete

                                            GooglePlacesDetailsQuery={{ fields: "geometry" }}

                                            textInputProps={{ placeholderTextColor: "gray" }}

                                            fetchDetails={true} // you need this to fetch the details object onPress

                                            placeholder='Search meeting spaces in...'

                                            query={{

                                                key: "AIzaSyDgQlUgbgkWodIedIBpYIE8dMZJ7jjbbfA",

                                                language: "en", // language of the results

                                                components: 'country:in'

                                            }}

                                            renderLeftButton={() =>



                                                <Icon name="search" color="black" size={20} style={{ alignSelf: "center", paddingLeft: 5 }} />

                                            }

                                            styles={{

                                                textInput: {

                                                    color: "gray",

                                                    backgroundColor: color.lightGray.color,

                                                    borderRadius: 20,

                                                    fontSize: font.sizeVeryRegular.fontSize,
                                                    allowFontScaling: false

                                                },

                                                textInputContainer: {

                                                    width: Dimensions.get('screen').width * 0.98,

                                                    backgroundColor: color.lightGray.color,

                                                    borderRadius: 10

                                                }, row: {

                                                    backgroundColor: 'white',

                                                }, description: { color: "gray" }

                                            }}

                                            onPress={(data, details = null) => {
                                                console.log('data', data, details)

                                                var params = {

                                                    "latitude": JSON.stringify(details.geometry.location.lat),

                                                    "longitude": JSON.stringify(details.geometry.location.lng),

                                                    "resource_group_id": this.state.searchCategoryids,

                                                    'is_meeting_space': 1

                                                };

                                                this.setState({

                                                    params: params,
                                                    latitude: JSON.stringify(details.geometry.location.lat),
                                                    longitude: JSON.stringify(details.geometry.location.lng),
                                                })

                                                this.apiCall(params, PROPERTY_LIST/* MEETING_PROPERTY_LIST */);

                                            }}

                                            onFail={(error) => console.error(error)} />

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

                                    <View style ={
                                       [ box.centerBox,box.horizontalBox,
                                        { 
                                           backgroundColor: color.darkgrayColor.color, 
                                           
                                          // opacity:0.5,
                                            marginTop: 10,
                                            justifyContent: 'space-around',
                                            padding: '1%',
                                            height: Dimensions.get('window').height*0.06,
                                            
                                            }]}>
                                                <TouchableOpacity 
                                                onPress={()=>{
                                                    this.onSortByOpened();
                                                }}
                                                style = {[,{
                                                    flex: 1,
                                                    height: '100%',
                                                    //backgroundColor: 'yellow',
                                                    alignItems: 'center',
                                                   
                                                    justifyContent: 'center'
                                                }]}>
                                                    <View style = {[box.horizontalBox, ]}>
                                                        <Image 
                                                        source={require('../../Assets/images/SortWhite.png')}
                                                        style = {[
                                                    {
                                                        marginRight: 5,
                                                        width: 20,
                                                        height: 20
                                                    }]}
                                                        />
                                                        <Text style={[
                                                            font.sizeRegular,
                                                            font.regular,
                                                            color.textWhiteColor,{
                                                                opacity:1,
                                                            }
                                                        ]}>Sort</Text>
                                                    </View>
                                                </TouchableOpacity>

                                                <TouchableOpacity 
                                                 onPress={()=>{
                                                    this.onFilterByOpened();
                                                }}
                                                 style = {[{
                                                    flex: 1,
                                                    height: '100%',
                                                    //backgroundColor: 'yellow',
                                                    alignItems: 'center',
                                                    
                                                    justifyContent: 'center'
                                                }]}>
                                                    <View style = {[box.horizontalBox]}>
                                                    <Image 
                                                        source={require('../../Assets/images/FilterWhite.png')}
                                                        style = {[
                                                       
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
                                                 onPress={()=>{
                                                    this.setState({
                                                        showMaps: true,
                                                    })
                                                }}
                                                style = {[{
                                                    flex: 1,
                                                    height: '100%',
                                                    //backgroundColor: 'yellow',
                                                    alignItems: 'center',
                                                   
                                                    justifyContent: 'center'
                                                }]}>
                                                    <View style = {[box.horizontalBox]}>
                                                        <MapIcon name='map-marked' size= {20} color= {'white'} style = {{marginRight: 5}}/>
                                                        <Text style={[
                                                            font.sizeRegular,
                                                            font.regular,
                                                            color.textWhiteColor
                                                        ]}>Map</Text>
                                                    </View>
                                                </TouchableOpacity>

                                    </View>

                                </View>

                            }

                            ListFooterComponent={this.state.scrolling ?

                                <View>

                                    <ActivityIndicator color={color.myOrangeColor.color} size={'large'} />

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
                    from={'meetingSpace'}
                    longitude= {this.state.longitude}
                    latitude ={this.state.latitude}
                   
                    />

                    }

{this.state.sortByOpen && 
                    <SortBy
                    navigation={this.props.navigation} 
                    closing={() => { this.onSortByClosed() }} 
                    from={'meetingSpace'}
                    longitude= {this.state.longitude}
                    latitude ={this.state.latitude}
                   
                    />

                    }





                </View>



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

                            //console.log('item pressed', item);

                            const params = {

                                'property_id': Number(item.id),

                                'resource_id': Number(item.resource_id),

                                'is_meeting_space': 1,

                            }

                            this.openPropertyDetail(params, item.images);

                        }}

                        from={'meetingSpace'} />

                }





            </Drawer>

        );



    }

}





