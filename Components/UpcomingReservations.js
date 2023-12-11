import React, { Component } from "react";
import { View, Text, TouchableOpacity, FlatList, StyleSheet, TextInput, Dimensions, ScrollView, Image } from 'react-native';
import font from "../Styles/font";
import color from "../Styles/color";
import button from '../Styles/button';
import box from "../Styles/box";
import Spinner from "../UI/Spinner";
import SimilarPropertiesCard from "./ReusableComponents/SimilarPropertiesCard";
import Session from "../config/Session";
import { deleteEmpSeatReservationAPI, empUpcomingReservationAPI, getPropertyResouceTypes, get_user_document_api, post_emp_checkout, post_emp_check_details } from "../Rest/userAPI";
import { AWS_URL, EMP_UPCOMING_RESERVATION } from "../config/RestAPI";
import moment from "moment";
import Icon from 'react-native-vector-icons/FontAwesome';
import Modal from 'react-native-modalbox';
import CommonHelpers from "../Utils/CommonHelpers";
import CustomePushNotifications from "./CustomePushNotifications";

export default class UpcomingReservations extends Component {
    constructor() {
        super();
        this.state = {
            data: null,
            imageList: [],
            spinner: false,
            //pagination variables
            enablePagination: false,
            prev_page_url: null,
            next_page_url: null,
            last_page_url: null,
            links: [],
            //paginationvariables ends

            searchPhrase: '',
            searchclicked: false,

            checkinModal: false,
            checkinPropertyName: '',
            checkinReservationId: '',
            checkinDateTime: '',
            checkinIDProof: [],
            checkinVACcert: [],

            hide_id_proof: false,
            hide_cert: false,
            hideCheckin: false,
            documentsExist: false,
            storageReadPermission: null,
            storageWritePermission: null,
            imagesource: {},

            cancelModal: false,
            cancelItem: '',
          

            resourceTypes: [],


        }
    }

    componentDidMount = async () => {

        this.fetchResourceTypes();
      //  this.notifications = CustomePushNotifications.configureNotifis(this.props.navigation);

       // CustomePushNotifications.checkinReminder(new Date(), 'Checkout Alert', "You have been checked-out of the property", this.notifications, {type: 1});

        // this.apiCall(await Session.getUserId(), EMP_UPCOMING_RESERVATION);
    }

    apiCall = (emp_id, url) => {
        this.setState({
            spinner: true,
        })
        empUpcomingReservationAPI({ 'employee_id': Number(emp_id) }, url).then(result => {
            this.setState({
                spinner: false,
            })
            //////console.log("Upcoming reservation details from the api: ",result.status,result.dataArray);
            if (result.status) {

                this.setState({
                    data: result.dataArray,

                });
                if (result.pagesData.results.last_page > 1) {
                    this.setState({
                        enablePagination: true,
                        prev_page_url: result.pagesData.results.prev_page_url,
                        next_page_url: result.pagesData.results.next_page_url,
                        last_page_url: result.pagesData.results.last_page_url,
                        links: result.pagesData.results.links,
                    }, () => {
                        ////console.log("Button status: ", this.state.prev_page_url, this.state.next_page_url, this.state.last_page_url);
                    })
                }
            }

        }).catch(error => {////console.log("emp upcoming reservation error", JSON.stringify(error))
        })
    }

    fetchResourceTypes = async () => {
        this.setState({
            spinner: true,
        })
        //console.log("called");
        getPropertyResouceTypes().then((result) => {
            this.setState({
                spinner: false,
            })
            //console.log("resource types ", result.dataArray.data);
            if (result.status) {
                ////console.log("resource types ",result.dataArray);
                this.setState({
                    resourceTypes: result.dataArray.data,
                })
            }
        }).catch(error => {
            //console.log(error, "resource types error in upcoming booking.");
        })
        this.apiCall(await Session.getUserId(), EMP_UPCOMING_RESERVATION);
    }

    _renderUpcoming = (item) => {
        //console.log( 'upcoming booking ', JSON.stringify(item), item.item);
        let resourcetype = '--';
        // //console.log(this.state.resourceTypes);
        this.state.resourceTypes.forEach((element) => {
            //console.log(element.id, item.item.resource_group_id);
            if (element.id == item.item.resource_group_id) {
                resourcetype = element.resource_group_name;
                //console.log(resourcetype)
            }
        })

        let checkinButtonHide = false;
        ////console.log("check in check out length: ", item.item.check_in_check_out.length);

        item.item.check_in_check_out.length == 0 ? checkinButtonHide = false : checkinButtonHide = true;

        if (this.state.searchPhrase == '') {
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
                            <View style={[box.centerBox, { justifyContent: "flex-start",/*  backgroundColor: "red" */ }]}>
                                <Text style={[color.myOrangeColor, font.bold, font.sizeLarge, { flex: 0.5 }]}>{item.item.booking_id}</Text>
                                <Text style={[color.blackColor, font.semibold, font.sizeLarge, {/* marginBottom: "4%" */flex: 0.5 }]}>{item.item.property_details.property_name}</Text>

                                <View style={[{ flex: 1, flexDirection: "row", }]}>
                                    <View style={{ flex: 1, padding: 5 }}>
                                        <Text style={[color.blackColor, font.semibold, font.sizeRegular]}>Start Date</Text>
                                        <Text style={[color.blackColor, font.regular, font.sizeRegular,]}>{moment(item.item.start_date).format("DD MMMM, YYYY- HH : mm")}</Text>
                                    </View>
                                    <View style={{ flex: 1, padding: 5 }}>
                                        <Text style={[color.blackColor, font.semibold, font.sizeRegular]}>End Date</Text>
                                        <Text style={[color.blackColor, font.regular, font.sizeRegular,]}>{moment(item.item.end_date).format("DD MMMM, YYYY- HH : mm")}</Text>
                                    </View>
                                </View>

                                <View style={[{ flex: 1, flexDirection: "row", }]}>
                                    <View style={{ flex: 1, padding: 5 }}>
                                        <Text style={[color.blackColor, font.semibold, font.sizeRegular]}>Workspace Type</Text>
                                        <Text style={[color.blackColor, font.regular, font.sizeRegular,]}>{resourcetype}{/* Dedicated Desk */}</Text>
                                    </View>
                                    <View style={{ flex: 1, padding: 5 }}>
                                        <Text style={[color.blackColor, font.semibold, font.sizeRegular]}>Workspace Name</Text>
                                        <Text style={[color.blackColor, font.regular, font.sizeRegular,]}>{item.item.resources.resource_name}{/* Dedicated desk */}</Text>
                                    </View>
                                </View>
                                <View style={[{ flex: 1, flexDirection: "row", }]}>
                                    <View style={{ flex: 1, padding: 5, flexDirection: 'row' }}>
                                        <View style={{ flex: 1 }}>
                                            <Text style={[color.blackColor, font.semibold, font.sizeRegular]}>Status</Text>
                                            <Text style={[color.myOrangeColor, font.semibold, font.sizeRegular,]}>{CommonHelpers.bookingStatusInfo(JSON.stringify(item.item.status))}</Text>
                                        </View>
                                        <View style={{ flex: 1 }}>
                                            <Text style={[color.blackColor, font.semibold, font.sizeRegular,]}>Number of People</Text>
                                            <Text style={[color.blackColor, font.regular, font.sizeRegular,]}>{item.item.no_of_people}</Text>
                                        </View>
                                    </View>

                                </View>

                                <View style={[{ flex: 1, flexDirection: "row", }]}>
                                    {/* <View style={{ flex: 1, padding: 5 }}>
                                        <TouchableOpacity onPress={() => {
                                            this.setState({
                                                cancelItem: item.item.id,
                                                cancelModal: true,
                                               
                                            })
                                        }}>

                                            <Text style={[color.myOrangeColor, font.regular, font.sizeRegular, button.defaultRadius, { borderColor: color.myOrangeColor.color }]}>Cancel</Text>

                                        </TouchableOpacity>
                                    </View> */}
                                    <View style={{ flex: 1, padding: 5 }}>
                                        <TouchableOpacity
                                            onPress={() => {
                                                let params = {
                                                    number_of_people: item.item.no_of_people,
                                                    selectedProperty: {
                                                        label: item.item.property_details.property_name,
                                                        value: item.item.property_details.property_name,
                                                        id: item.item.property_id,
                                                        provider_id: item.item.provider_id,
                                                        start_time: item.item.property_details.start_at,
                                                        end_time: item.item.property_details.end_at,
                                                    },
                                                    selectedResourceGroup: {
                                                        id: item.item.resource_group_id,
                                                    },
                                                    resource_name: { id: item.item.resource_id, },
                                                    start_date: item.item.start_date,
                                                    end_date: item.item.end_date,
                                                    reserve_type_id: item.item.reserve_type_id,
                                                    item: item.item,
                                                }


                                                this.modifyBooking(params);

                                            }}>

                                            <Text style={[color.myOrangeColor, font.regular, font.sizeRegular, button.defaultRadius, { borderColor: color.myOrangeColor.color }]}>Reschedule</Text>

                                        </TouchableOpacity>
                                    </View>
                                </View>

                            </View>
                        } />
                </View>
            );

        }
        else if (item.item.property_details.property_name.toLowerCase().includes(this.state.searchPhrase.toLowerCase().trim())) {
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
                            <View style={[box.centerBox, { justifyContent: "flex-start",/*  backgroundColor: "red" */ }]}>
                                <Text style={[color.myOrangeColor, font.bold, font.sizeLarge,]}>{item.item.booking_id}</Text>
                                <Text style={[color.blackColor, font.semibold, font.sizeLarge, { marginBottom: "4%" }]}>{item.item.property_details.property_name}</Text>

                                <View style={[{ flex: 1, flexDirection: "row", }]}>
                                    <View style={{ flex: 1, padding: 5 }}>
                                        <Text style={[color.blackColor, font.semibold, font.sizeRegular]}>Start Date</Text>
                                        <Text style={[color.blackColor, font.regular, font.sizeRegular,]}>{moment(item.item.start_date).format("DD MMMM, YYYY- HH : mm")}</Text>
                                    </View>
                                    <View style={{ flex: 1, padding: 5 }}>
                                        <Text style={[color.blackColor, font.semibold, font.sizeRegular]}>End Date</Text>
                                        <Text style={[color.blackColor, font.regular, font.sizeRegular,]}>{moment(item.item.end_date).format("DD MMMM, YYYY- HH : mm")}</Text>
                                    </View>
                                </View>

                                <View style={[{ flex: 1, flexDirection: "row", }]}>
                                    <View style={{ flex: 1, padding: 5 }}>
                                        <Text style={[color.blackColor, font.semibold, font.sizeRegular]}>Workspace Type</Text>
                                        <Text style={[color.blackColor, font.regular, font.sizeRegular,]}>{resourcetype}{/* Dedicated Desk */}</Text>
                                    </View>
                                    <View style={{ flex: 1, padding: 5 }}>
                                        <Text style={[color.blackColor, font.semibold, font.sizeRegular]}>Workspace Name</Text>
                                        <Text style={[color.blackColor, font.regular, font.sizeRegular,]}>{item.item.resources.resource_name}{/* Dedicated desk */}</Text>
                                    </View>
                                </View>
                                <View style={[{ flex: 1, flexDirection: "row", }]}>
                                    <View style={{ flex: 1, padding: 5, flexDirection: 'row' }}>
                                        <View style={{ flex: 1 }}>
                                            <Text style={[color.blackColor, font.semibold, font.sizeRegular]}>Status</Text>
                                            <Text style={[color.myOrangeColor, font.semibold, font.sizeRegular,]}>{CommonHelpers.bookingStatusInfo(JSON.stringify(item.item.status))}</Text>
                                        </View>
                                        <View style={{ flex: 1 }}>
                                            <Text style={[color.blackColor, font.semibold, font.sizeRegular,]}>Number of People</Text>
                                            <Text style={[color.blackColor, font.regular, font.sizeRegular,]}>{item.item.no_of_people}</Text>
                                        </View>
                                    </View>

                                </View>

                                <View style={[{ flex: 1, flexDirection: "row", }]}>
                                   {/*  <View style={{ flex: 1, padding: 5 }}>
                                        <TouchableOpacity onPress={() => {
                                            this.setState({
                                                cancelItem: item.item.id,
                                                cancelModal: true,
                                               
                                            })
                                        }}>

                                            <Text style={[color.myOrangeColor, font.regular, font.sizeRegular, button.defaultRadius, { borderColor: color.myOrangeColor.color }]}>Cancel</Text>

                                        </TouchableOpacity>
                                    </View> */}
                                    <View style={{ flex: 1, padding: 5 }}>
                                        <TouchableOpacity
                                            onPress={() => {
                                                let params = {
                                                    number_of_people: item.item.no_of_people,
                                                    selectedProperty: {
                                                        label: item.item.property_details.property_name,
                                                        value: item.item.property_details.property_name,
                                                        id: item.item.property_id,
                                                        provider_id: item.item.provider_id,
                                                        start_time: item.item.property_details.start_at,
                                                        end_time: item.item.property_details.end_at,
                                                    },
                                                    selectedResourceGroup: {
                                                        id: item.item.resource_group_id,
                                                    },
                                                    resource_name: { id: item.item.resource_id, },
                                                    start_date: item.item.start_date,
                                                    reserve_type_id: item.item.reserve_type_id,
                                                    end_date: item.item.end_date,

                                                    item: item.item,
                                                }


                                                this.modifyBooking(params);

                                            }}>

                                            <Text style={[color.myOrangeColor, font.regular, font.sizeRegular, button.defaultRadius, { borderColor: color.myOrangeColor.color }]}>Reschedule</Text>

                                        </TouchableOpacity>
                                    </View>
                                </View>

                            </View>
                        } />
                </View>
            );

        }



    }

    modifyBooking = (params) => {
        //console.log("params: ", params);
        this.props.navigation.push('seatreservation', {
            emplogin: 1,
            params: params,
            purpose: "modify",
        })
    }

    setSearchPhrase = (val) => {
        this.setState({
            searchPhrase: val
        }, () => {
            ////console.log(this.state.searchPhrase);
        })

    }
    setClicked = () => {
        this.setState({
            searchClicked: true,
        }, () => {
            ////console.log("clicked");
        })
    }



    handleCancel = async () => {
        let params = {
            "employee_id": Number(await Session.getUserId()),
            "id": this.state.cancelItem

        }
        deleteEmpSeatReservationAPI(params).then(async (result) => {
            ////console.log(result.status);
            if (result.status) {
                this.setState({
                    cancelModal: false,
                })
                CommonHelpers.showFlashMsg(result.message, "success");
                this.apiCall(await Session.getUserId(), EMP_UPCOMING_RESERVATION)
                this.setState({
                    data: null
                })
            }
            else {
                this.setState({
                    cancelModal: false,
                });
                CommonHelpers.showFlashMsg(result.message, "danger");
                this.apiCall(await Session.getUserId(), EMP_UPCOMING_RESERVATION)

            }
        }).catch(error => {
            ////console.log("cancel reservation error", JSON.stringify(error))
        })

    }


    render() {
        return (
            this.state.data == null ?
                <View style={[box.centerBox, { height: "100%", justifyContent: this.state.spinner ? "flex-start" : "center" }]}>
                    {this.state.spinner ?
                        <Text style={[font.regular, font.sizeRegular, color.blackColor, { textAlign: "center", }]}>Searching...</Text> :
                        <Text style={[font.regular, font.sizeRegular, color.blackColor, { textAlign: "center", }]}> No Upcoming Reservations.</Text>}
                </View> :
                <View style={[{ height: "100%", justifyContent: this.state.spinner ? "flex-start" : "center", paddingTop: "2%" }]}>
                    <FlatList
                        keyboardShouldPersistTaps='always'
                        data={this.state.data}
                        renderItem={this._renderUpcoming}
                        horizontal={false}
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
                                            ////console.log(this.state.prev_page_url);
                                            this.apiCall(await Session.getUserId(), this.state.prev_page_url);

                                        }}
                                    >
                                        <Text style={[font.regular, font.sizeRegular, color.myOrangeColor]}>Prev</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity disabled={this.state.next_page_url != null ? false : true}
                                        onPress={async () => {
                                            ////console.log(this.state.next_page_url);
                                            this.apiCall(await Session.getUserId(), this.state.next_page_url);

                                        }}>
                                        <Text style={[font.regular, font.sizeRegular, color.myOrangeColor]}>Next</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity disabled={this.state.last_page_url != null ? false : true}
                                        onPress={async () => {
                                            ////console.log(this.state.last_page_url);
                                            this.apiCall(await Session.getUserId(), this.state.last_page_url);

                                        }}>
                                        <Text style={[font.regular, font.sizeRegular, color.myOrangeColor]}>Last</Text>
                                    </TouchableOpacity>

                                </View>
                                <View style={{ flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center" }}>

                                    {this.state.links.map((item, index) => {
                                        //////console.log(JSON.stringify(item));
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
                    {this.state.spinner && <Spinner />}

                    {this.state.cancelModal && <Modal position={"center"} swipeToClose={false}
                        onClosed={() => { this.setState({ cancelModal: false }) }}
                        style={{
                            //justifyContent: 'space-around',
                            //alignItems: 'space-around',
                            //padding: 20,
                            height: Dimensions.get('screen').height * 0.3,
                            width: Dimensions.get('screen').width * 0.9,
                        }} isOpen={this.state.cancelModal}>
                        <View height={"100%"}>
                            <View style={[/* box.centerBox, */ color.inputBackground, { alignItems: "flex-start", padding: "4%" }]}>
                                <Text style={[font.semibold, font.sizeMedium, color.blackColor,]}>Confirmation</Text>
                            </View>

                            <View style={[box.centerBox]}>
                                <Text style={[font.semibold, font.sizeMedium, color.blackColor,]}>Proceed to cancel the reservation?</Text>
                            </View>

                            <View style={{ flex: 1, flexDirection: "row", height: 100 }}>
                                <TouchableOpacity style={[color.lightGrayBackColor,{ bottom: 0, flex: 1, marginTop: "auto",  height: "100%", justifyContent: "center", borderRightWidth: 1, borderRightColor: "white" }]}
                                    onPress={async () => {
                                        this.setState({
                                            cancelModal: false,
                                        })
                                    }}>
                                    <Text style={[font.bold, font.sizeLarge, color.blackColor, { textAlign: "center" }]}>Not Now</Text>
                                </TouchableOpacity>


                                <TouchableOpacity style={{ bottom: 0, flex: 1, marginTop: "auto", backgroundColor: "orange", height: "100%", justifyContent: "center" }}
                                    onPress={async () => {
                                        this.handleCancel();
                                    }}>
                                    <Text style={[font.bold, font.sizeLarge, color.textWhiteColor, { textAlign: "center" }]}>Yes, Cancel</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                    </Modal>}



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