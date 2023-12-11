import React, { Component } from "react";
import { View, Text, TouchableOpacity, FlatList, StyleSheet, TextInput } from 'react-native';
import font from "../Styles/font";
import button from '../Styles/button';
import color from "../Styles/color";
import box from "../Styles/box";
import Spinner from "../UI/Spinner";
import SimilarPropertiesCard from "./ReusableComponents/SimilarPropertiesCard";
import Session from "../config/Session";
import { empHistoryReservationAPI, getPropertyResouceName, getPropertyResouceTypes } from "../Rest/userAPI";
import { AWS_URL, EMP_RESERVATION_HISTORY } from "../config/RestAPI";
import moment from "moment";
import Icon from 'react-native-vector-icons/FontAwesome';

import CommonHelpers from "../Utils/CommonHelpers";

export default class HistoryReservations extends Component {
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

      resourceTypes: [],
    }
  }

  componentDidMount = async () => {
    this.fetchResourceTypes();
    // this.apiCall(await Session.getUserId(), EMP_RESERVATION_HISTORY);

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
      //console.log(error, "resource types error in history booking.");
    })
    this.apiCall(await Session.getUserId(), EMP_RESERVATION_HISTORY);
  }


 apiCall = (emp_id, url) => {
    empHistoryReservationAPI({ 'employee_id': Number(emp_id) }, url).then(result => {
      // //console.log("Reservation history details from the api: ",result.status,result.dataArray);
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
            //console.log("Button status: ", this.state.prev_page_url, this.state.next_page_url, this.state.last_page_url);
          })
        }
      }
    }).catch(error => { //console.log("emp reservation history error", JSON.stringify(error))
     })
  }
  _renderHistory = (item) => {
    ////console.log(JSON.stringify(item));
    let resourcetype = '--';
    // //console.log(this.state.resourceTypes);
    this.state.resourceTypes.forEach((element) => {
      ////console.log(element.id,item.item.booking_seat_details[0].resource_group_id);
      if (item.item.booking_seat_details.length != 0) {
        if (element.id == item.item.booking_seat_details[0].resource_group_id) {
          resourcetype = element.resource_group_name;
          //console.log(resourcetype)
        }
      }

    })
    /* let images  = []
    item.item.property_images.forEach(element => {
        images.push({url: AWS_URL + element.image_path});
        
    });
    //console.log(images);*/

    if (this.state.searchPhrase == '') {
      return (
        <View height={350}>


          <SimilarPropertiesCard
            //imageList={images}
            fromEmpReservation={true}
            from="SRP"
            isLogin={true}
            iconName='heart'
            iconColor='orange'
            contentdetails={

              <View style={[box.centerBox, { justifyContent: "flex-start",/*  backgroundColor: "red" */ }]}>
                <View style={{ flex: 1 }}>
                  <View style={{ flex: 1, flexDirection: "row" /* ,backgroundColor: "pink", */ /* justifyContent: "center", */, alignItems: "center", justifyContent: "space-between" }}>


                    <Text style={[color.myOrangeColor, font.bold, font.sizeLarge, { marginRight: 5 }]}>{item.item.booking_id}</Text>
                    {/* <Text style={[color.blackColor, font.semibold, font.sizeLarge, ]}>{item.item.property_details.property_name}</Text> */}

                    <TouchableOpacity onPress={() => {
                      this.raiseIssue(item.item);
                    }}>
                      <Text style={[button.defaultRadius, font.regular, font.sizeRegular, color.myOrangeColor, color.orangeBorder]}>Raise an Issue</Text>
                    </TouchableOpacity>
                  </View>
                  <Text style={[{flex: 0.5},color.blackColor, font.semibold, font.sizeMedium,]}>{item.item.property_details.property_name}</Text>
                </View>

                <View style={[{  flexDirection: "row", }]}>

                  <View style={{ flex: 1, padding: 5 }}>
                    <Text style={[color.blackColor, font.semibold, font.sizeRegular]}>Start Date</Text>
                    <Text style={[color.blackColor, font.regular, font.sizeRegular,]}>{moment(item.item.start_date).format("DD MMMM, YYYY- HH : mm")}</Text>
                  </View>
                  <View style={{ flex: 1, padding: 5 }}>
                    <Text style={[color.blackColor, font.semibold, font.sizeRegular]}>End Date</Text>
                    <Text style={[color.blackColor, font.regular, font.sizeRegular,]}>{moment(item.item.end_date).format("DD MMMM, YYYY- HH : mm")}</Text>
                  </View>
                </View>

                <View style={[{ flexDirection: "row", }]}>
                  <View style={{ flex: 1, padding: 5 }}>
                    <Text style={[color.blackColor, font.semibold, font.sizeRegular]}>Workspace Type</Text>
                    <Text style={[color.blackColor, font.regular, font.sizeRegular,]}>{resourcetype}</Text>
                  </View>
                  <View style={{ flex: 1, padding: 5 }}>
                    <Text style={[color.blackColor, font.semibold, font.sizeRegular]}>Workspace Name</Text>
                    <Text style={[color.blackColor, font.regular, font.sizeRegular,]}>{item.item.resources.resource_name}</Text>
                  </View>
                </View>

                

                <View style={{ flexDirection: 'row' }}>
                  <View style={{ flex: 1 }}>
                    <Text style={[color.myOrangeColor, font.semibold, font.sizeRegular]}>Status</Text>
                    <Text style={[color.myOrangeColor, font.regular, font.sizeRegular]}>{CommonHelpers.bookingStatusInfo(JSON.stringify(item.item.status))}</Text>

                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[{ flex: 1 }, color.blackColor, font.semibold, font.sizeRegular,]}>Number of People</Text>
                    <Text style={[{ flex: 1 }, color.blackColor, font.regular, font.sizeRegular,]}>{item.item.no_of_people}</Text>
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
            //imageList={images}
            fromEmpReservation={true}
            from="SRP"
            isLogin= {true}
            iconName='heart'
            iconColor='orange'
            contentdetails={

              <View style={[box.centerBox, { justifyContent: "flex-start",/*  backgroundColor: "red" */ }]}>
                <View style={{ flex: 1 }}>
                  <View style={{ flex: 1, flexDirection: "row" /* ,backgroundColor: "pink", */ /* justifyContent: "center", */, alignItems: "center", justifyContent: "space-between" }}>


                    <Text style={[color.myOrangeColor, font.bold, font.sizeLarge, { marginRight: 5 }]}>{item.item.booking_id}</Text>
                    {/* <Text style={[color.blackColor, font.semibold, font.sizeLarge, ]}>{item.item.property_details.property_name}</Text> */}

                    <TouchableOpacity onPress={() => {
                      this.raiseIssue(item.item);
                    }}>
                      <Text style={[button.defaultRadius, font.regular, font.sizeRegular, color.myOrangeColor, color.orangeBorder]}>Raise an Issue</Text>
                    </TouchableOpacity>
                  </View>
                  <Text style={[color.blackColor, font.semibold, font.sizeMedium,]}>{item.item.property_details.property_name}</Text>
                </View>

                <View style={[{ flex: 1, flexDirection: "row", }]}>

                  <View style={{ flex: 1, padding: 5 }}>
                    <Text style={[color.blackColor, font.semibold, font.sizeRegular]}>Start Date</Text>
                    <Text style={[color.blackColor, font.regular, font.sizeRegular,]}>{moment(item.item.start_date).format("DD MMMM, YYYY- HH:mm")}Hrs</Text>
                  </View>
                  <View style={{ flex: 1, padding: 5 }}>
                    <Text style={[color.blackColor, font.semibold, font.sizeRegular]}>End Date</Text>
                    <Text style={[color.blackColor, font.regular, font.sizeRegular,]}>{moment(item.item.end_date).format("DD MMMM, YYYY- HH:mm")}Hrs</Text>
                  </View>
                </View>

                <View style={[{ flex: 1, flexDirection: "row", }]}>
                  <View style={{ flex: 1, padding: 5 }}>
                    <Text style={[color.blackColor, font.semibold, font.sizeRegular]}>Workspace Type</Text>
                    <Text style={[color.blackColor, font.regular, font.sizeRegular,]}>{resourcetype}</Text>
                  </View>
                  <View style={{ flex: 1, padding: 5 }}>
                    <Text style={[color.blackColor, font.semibold, font.sizeRegular]}>Workspace Name</Text>
                    <Text style={[color.blackColor, font.regular, font.sizeRegular,]}>{item.item.resources.resource_name}</Text>
                  </View>
                </View>

                {/*   <View style = {[{flex: 1, flexDirection: "row", }]}>
                      <View style = {{flex: 1, padding: 5}}>
                          <Text style = {[color.blackColor, font.semiBold, font.sizeRegular]}>Check-in</Text>
                      <Text style = {[color.blackColor, font.regular, font.sizeRegular,]}>Dedicated Desk</Text>
                      </View>
                      <View style = {{ flex: 1, padding: 5}}>
                          <Text style = {[color.blackColor, font.semiBold, font.sizeRegular]}>Check-out</Text>
                      <Text style = {[color.blackColor, font.regular, font.sizeRegular,]}>Dedicated desk</Text>
                      </View>
                  </View> */}

                <View style={{ flexDirection: 'row' }}>
                  <View style={{ flex: 1 }}>
                    <Text style={[color.myOrangeColor, font.semibold, font.sizeRegular]}>Status</Text>
                    <Text style={[color.myOrangeColor, font.regular, font.sizeRegular]}>{CommonHelpers.bookingStatusInfo(JSON.stringify(item.item.status))}</Text>

                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[{ flex: 1 }, color.blackColor, font.semibold, font.sizeRegular,]}>Number of People</Text>
                    <Text style={[{ flex: 1 }, color.blackColor, font.regular, font.sizeRegular,]}>{item.item.no_of_people}</Text>
                  </View>

                </View>




              </View>

            } />
        </View>
      );
    }



  }


  setSearchPhrase = (val) => {
    this.setState({
      searchPhrase: val
    }, () => {
      //console.log(this.state.searchPhrase);
    })

  }
  setClicked = () => {
    this.setState({
      searchClicked: true,
    }, () => {
      //console.log("clicked");
    })
  }

  raiseIssue = (params) => {
    //console.log("params: ", params);
    this.props.navigation.push('raiseissue', {
      emplogin: 1,
      params: params,
      purpose: "new",
    });
  }
  render() {
    return (
      this.state.data == null ?
        <View style={[box.centerBox, { height: "100%", justifyContent: this.state.spinner ? "flex-start" : "center" }]}>
          {this.state.spinner ?
            <Text style={[font.regular, font.sizeRegular, color.blackColor, { textAlign: "center", }]}>Searching...</Text> :
            <Text style={[font.regular, font.sizeRegular, color.blackColor, { textAlign: "center", }]}> No Previous Reservations.</Text>}
        </View> :
        <View style={[{ height: "100%", justifyContent: this.state.spinner ? "flex-start" : "center", paddingTop: "2%" }]}>
          <FlatList
            keyboardShouldPersistTaps='always'
            data={this.state.data}
            renderItem={this._renderHistory}
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
            ListFooterComponent={this.state.enablePagination ?
              <View>
                <View style={{ flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "space-around" }}>
                  <TouchableOpacity disabled={this.state.prev_page_url != null ? false : true}
                    onPress={async () => {
                      //console.log(this.state.prev_page_url);
                      this.apiCall(await Session.getUserId(), this.state.prev_page_url);

                    }}
                  >
                    <Text style={[font.regular, font.sizeRegular, color.myOrangeColor]}>Prev</Text>
                  </TouchableOpacity>
                  <TouchableOpacity disabled={this.state.next_page_url != null ? false : true}
                    onPress={async () => {
                      //console.log(this.state.next_page_url);
                      this.apiCall(await Session.getUserId(), this.state.next_page_url);

                    }}>
                    <Text style={[font.regular, font.sizeRegular, color.myOrangeColor]}>Next</Text>
                  </TouchableOpacity>
                  <TouchableOpacity disabled={this.state.last_page_url != null ? false : true}
                    onPress={async () => {
                      //console.log(this.state.last_page_url);
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
          {this.state.spinner && <Spinner />}
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