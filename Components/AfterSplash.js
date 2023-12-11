import React, {Component} from 'react';
import {View, Text, TouchableOpacity, ScrollView, Image, Dimensions, FlatList, BackHandler, Switch, } from 'react-native';
import color from '../Styles/color';
import font from '../Styles/font';
import button from '../Styles/button';
import box from '../Styles/box';

import { AWS_URL, camera, changes_to_privacy_policy, children_privacy, contact_us, cookies, information_collection_and_use, links_to_other_sites, location_information, privacyPolicy, PROPERTY_LIST, security, service_providers, } from "../config/RestAPI";
import SimilarPropertiesCard from './../Components/ReusableComponents/SimilarPropertiesCard'
import Spinner from '../UI/Spinner';
import { getPropertyListAPI,  } from "./../Rest/userAPI";
import { StarRatingComponent } from "./ReusableComponents/StarRatingComponent";
import Modal from 'react-native-modalbox';

import { termsandconditions, elegibilty_text, 
    content_text,
    CLAIMS_OF_COPYRIGHT_INFRINGEMENT_text, user_account_deletion,
    review_text1, review_text2,review_text3,
    review_text4,review_text5 ,review_text6,
    space_accounts_text1, space_accounts_text2, 
    space_accounts_text3, user_accounts_text1,user_accounts_text2,
    disputes_text,  third_party_text,link_text ,liability_text,
    indem_text, mis_text,mod_text,copyright_text,contact_text, } from '../config/RestAPI';
    import Icon from 'react-native-vector-icons/FontAwesome';

import CommonHelpers from '../Utils/CommonHelpers';
import image from '../Styles/image';


export default class AfterSplash extends Component{

    constructor(){
        super();
        this.state = {
            nearByList: [{
    
                "address2": "Koramangala",
               
                "pseudoname": "BRH Koramangala Block 3",
               
                "images": [
                    {
                        "id": 7978,
                        "property_id": 1203,
                        "image_path": "images/properties/property-images/image/1655797659_6.jpg",
                        "thumbnail_path": "images/properties/property-images/thumbnail/1655797659_6.jpg",
                        "image_order": "6",
                        "status": 1,
                        "created_at": "2022-06-21T07:47:39.000000Z",
                        "updated_at": "2022-09-30T09:28:38.000000Z",
                        "deleted_at": null,
                        "is_default": 0
                    },
                    {
                        "id": 7979,
                        "property_id": 1203,
                        "image_path": "images/properties/property-images/image/1655797841_7.jpeg",
                        "thumbnail_path": "images/properties/property-images/thumbnail/1655797841_7.jpeg",
                        "image_order": "7",
                        "status": 1,
                        "created_at": "2022-06-21T07:50:42.000000Z",
                        "updated_at": "2022-09-30T09:28:38.000000Z",
                        "deleted_at": null,
                        "is_default": 0
                    },
                    {
                        "id": 8123,
                        "property_id": 1203,
                        "image_path": "images/properties/property-images/image/1664530038_8.jpg",
                        "thumbnail_path": "images/properties/property-images/thumbnail/1664530038_8.jpg",
                        "image_order": "8",
                        "status": 1,
                        "created_at": "2022-09-30T09:27:18.000000Z",
                        "updated_at": "2022-09-30T09:29:29.000000Z",
                        "deleted_at": null,
                        "is_default": 1
                    },
                    {
                        "id": 8126,
                        "property_id": 1203,
                        "image_path": "images/properties/property-images/image/1664530118_10.jpg",
                        "thumbnail_path": "images/properties/property-images/thumbnail/1664530118_10.jpg",
                        "image_order": "10",
                        "status": 1,
                        "created_at": "2022-09-30T09:28:38.000000Z",
                        "updated_at": "2022-09-30T09:28:38.000000Z",
                        "deleted_at": null,
                        "is_default": 1
                    }
                ]
                
            },
            
            {
                
                "address2":  "Koramangala",
               
                "pseudoname": "BRH Koramangala Block 8",
               
                "images": [
                    {
                        "id": 7955,
                        "property_id": 1195,
                        "image_path": "images/properties/property-images/image/1651210500_2.png",
                        "thumbnail_path": "images/properties/property-images/thumbnail/1651210500_2.png",
                        "image_order": "2",
                        "status": 1,
                        "created_at": "2022-04-29T05:35:00.000000Z",
                        "updated_at": "2022-07-04T04:35:11.000000Z",
                        "deleted_at": null,
                        "is_default": 0
                    },
                    {
                        "id": 7956,
                        "property_id": 1195,
                        "image_path": "images/properties/property-images/image/1651210500_3.png",
                        "thumbnail_path": "images/properties/property-images/thumbnail/1651210500_3.png",
                        "image_order": "3",
                        "status": 1,
                        "created_at": "2022-04-29T05:35:00.000000Z",
                        "updated_at": "2022-07-04T04:35:11.000000Z",
                        "deleted_at": null,
                        "is_default": 0
                    },
                    {
                        "id": 7982,
                        "property_id": 1195,
                        "image_path": "images/properties/property-images/image/1656909311_4.jpeg",
                        "thumbnail_path": "images/properties/property-images/thumbnail/1656909311_4.jpeg",
                        "image_order": "4",
                        "status": 1,
                        "created_at": "2022-07-04T04:35:11.000000Z",
                        "updated_at": "2022-07-04T04:48:18.000000Z",
                        "deleted_at": null,
                        "is_default": 0
                    },
                    {
                        "id": 7983,
                        "property_id": 1195,
                        "image_path": "images/properties/property-images/image/1656909311_5.jpeg",
                        "thumbnail_path": "images/properties/property-images/thumbnail/1656909311_5.jpeg",
                        "image_order": "5",
                        "status": 1,
                        "created_at": "2022-07-04T04:35:11.000000Z",
                        "updated_at": "2022-07-04T04:48:18.000000Z",
                        "deleted_at": null,
                        "is_default": 1
                    },
                    {
                        "id": 7984,
                        "property_id": 1195,
                        "image_path": "images/properties/property-images/image/1656909311_6.jpeg",
                        "thumbnail_path": "images/properties/property-images/thumbnail/1656909311_6.jpeg",
                        "image_order": "6",
                        "status": 1,
                        "created_at": "2022-07-04T04:35:11.000000Z",
                        "updated_at": "2022-07-04T04:35:11.000000Z",
                        "deleted_at": null,
                        "is_default": 0
                    }
                ]
                
            },
            
            {
                
                "address2":  "2972, 2nd Floor, Coffee Day Building",
               
                "pseudoname": "BRH VV Mohalla",
               
                "images": [
                    {
                        "id": 8040,
                        "property_id": 1215,
                        "image_path": "images/properties/property-images/image/1662450279_1.jpg",
                        "thumbnail_path": "images/properties/property-images/thumbnail/1662450279_1.jpg",
                        "image_order": "1",
                        "status": 1,
                        "created_at": "2022-09-06T07:44:40.000000Z",
                        "updated_at": "2022-09-06T12:26:43.000000Z",
                        "deleted_at": null,
                        "is_default": 0
                    },
                    {
                        "id": 8041,
                        "property_id": 1215,
                        "image_path": "images/properties/property-images/image/1662450407_2.jpg",
                        "thumbnail_path": "images/properties/property-images/thumbnail/1662450407_2.jpg",
                        "image_order": "2",
                        "status": 1,
                        "created_at": "2022-09-06T07:46:47.000000Z",
                        "updated_at": "2022-10-06T07:52:48.000000Z",
                        "deleted_at": null,
                        "is_default": 0
                    },
                    {
                        "id": 8044,
                        "property_id": 1215,
                        "image_path": "images/properties/property-images/image/1662450409_5.jpg",
                        "thumbnail_path": "images/properties/property-images/thumbnail/1662450409_5.jpg",
                        "image_order": "5",
                        "status": 1,
                        "created_at": "2022-09-06T07:46:49.000000Z",
                        "updated_at": "2022-09-06T07:47:19.000000Z",
                        "deleted_at": null,
                        "is_default": 0
                    },
                    {
                        "id": 8045,
                        "property_id": 1215,
                        "image_path": "images/properties/property-images/image/1662450409_6.jpg",
                        "thumbnail_path": "images/properties/property-images/thumbnail/1662450409_6.jpg",
                        "image_order": "6",
                        "status": 1,
                        "created_at": "2022-09-06T07:46:51.000000Z",
                        "updated_at": "2022-10-06T07:52:48.000000Z",
                        "deleted_at": null,
                        "is_default": 1
                    },
                    {
                        "id": 8048,
                        "property_id": 1215,
                        "image_path": "images/properties/property-images/image/1662450439_8.jpg",
                        "thumbnail_path": "images/properties/property-images/thumbnail/1662450439_8.jpg",
                        "image_order": "8",
                        "status": 1,
                        "created_at": "2022-09-06T07:47:20.000000Z",
                        "updated_at": "2022-09-06T12:26:43.000000Z",
                        "deleted_at": null,
                        "is_default": 0
                    },
                    {
                        "id": 8056,
                        "property_id": 1215,
                        "image_path": "images/properties/property-images/image/1662450534_10.jpg",
                        "thumbnail_path": "images/properties/property-images/thumbnail/1662450534_10.jpg",
                        "image_order": "10",
                        "status": 1,
                        "created_at": "2022-09-06T07:48:55.000000Z",
                        "updated_at": "2022-09-06T07:48:55.000000Z",
                        "deleted_at": null,
                        "is_default": 0
                    },
                    {
                        "id": 8057,
                        "property_id": 1215,
                        "image_path": "images/properties/property-images/image/1662450535_11.jpg",
                        "thumbnail_path": "images/properties/property-images/thumbnail/1662450535_11.jpg",
                        "image_order": "11",
                        "status": 1,
                        "created_at": "2022-09-06T07:48:55.000000Z",
                        "updated_at": "2022-09-06T07:48:55.000000Z",
                        "deleted_at": null,
                        "is_default": 0
                    },
                    {
                        "id": 8058,
                        "property_id": 1215,
                        "image_path": "images/properties/property-images/image/1662467209_9.jpg",
                        "thumbnail_path": "images/properties/property-images/thumbnail/1662467209_9.jpg",
                        "image_order": "9",
                        "status": 1,
                        "created_at": "2022-09-06T12:26:49.000000Z",
                        "updated_at": "2022-09-06T12:26:49.000000Z",
                        "deleted_at": null,
                        "is_default": 0
                    },
                    {
                        "id": 8059,
                        "property_id": 1215,
                        "image_path": "images/properties/property-images/image/1662467209_10.jpg",
                        "thumbnail_path": "images/properties/property-images/thumbnail/1662467209_10.jpg",
                        "image_order": "10",
                        "status": 1,
                        "created_at": "2022-09-06T12:26:50.000000Z",
                        "updated_at": "2022-09-06T12:26:50.000000Z",
                        "deleted_at": null,
                        "is_default": 0
                    }
                ]
                
            },
            
            {
                
                "address2": "Coimbatore",
               
                "pseudoname": "BRH Saibaba Colony",
               
                "images":[
                    {
                        "id": 7970,
                        "property_id": 1201,
                        "image_path": "images/properties/property-images/image/1655278578_2.jpeg",
                        "thumbnail_path": "images/properties/property-images/thumbnail/1655278578_2.jpeg",
                        "image_order": "2",
                        "status": 1,
                        "created_at": "2022-06-15T07:36:19.000000Z",
                        "updated_at": "2022-10-06T09:47:53.000000Z",
                        "deleted_at": null,
                        "is_default": 0
                    },
                    {
                        "id": 7971,
                        "property_id": 1201,
                        "image_path": "images/properties/property-images/image/1655278579_3.jpeg",
                        "thumbnail_path": "images/properties/property-images/thumbnail/1655278579_3.jpeg",
                        "image_order": "3",
                        "status": 1,
                        "created_at": "2022-06-15T07:36:19.000000Z",
                        "updated_at": "2022-10-06T09:47:53.000000Z",
                        "deleted_at": null,
                        "is_default": 0
                    },
                    {
                        "id": 8127,
                        "property_id": 1201,
                        "image_path": "images/properties/property-images/image/1665049673_4.jpeg",
                        "thumbnail_path": "images/properties/property-images/thumbnail/1665049673_4.jpeg",
                        "image_order": "4",
                        "status": 1,
                        "created_at": "2022-10-06T09:47:53.000000Z",
                        "updated_at": "2022-10-06T09:47:53.000000Z",
                        "deleted_at": null,
                        "is_default": 1
                    },
                    {
                        "id": 8128,
                        "property_id": 1201,
                        "image_path": "images/properties/property-images/image/1665049673_5.jpeg",
                        "thumbnail_path": "images/properties/property-images/thumbnail/1665049673_5.jpeg",
                        "image_order": "5",
                        "status": 1,
                        "created_at": "2022-10-06T09:47:53.000000Z",
                        "updated_at": "2022-10-06T09:47:53.000000Z",
                        "deleted_at": null,
                        "is_default": 0
                    },
                    {
                        "id": 8129,
                        "property_id": 1201,
                        "image_path": "images/properties/property-images/image/1665049673_6.jpeg",
                        "thumbnail_path": "images/properties/property-images/thumbnail/1665049673_6.jpeg",
                        "image_order": "6",
                        "status": 1,
                        "created_at": "2022-10-06T09:47:53.000000Z",
                        "updated_at": "2022-10-06T09:47:53.000000Z",
                        "deleted_at": null,
                        "is_default": 0
                    },
                    {
                        "id": 8130,
                        "property_id": 1201,
                        "image_path": "images/properties/property-images/image/1665049673_7.jpeg",
                        "thumbnail_path": "images/properties/property-images/thumbnail/1665049673_7.jpeg",
                        "image_order": "7",
                        "status": 1,
                        "created_at": "2022-10-06T09:47:53.000000Z",
                        "updated_at": "2022-10-06T09:47:53.000000Z",
                        "deleted_at": null,
                        "is_default": 0
                    },
                    {
                        "id": 8131,
                        "property_id": 1201,
                        "image_path": "images/properties/property-images/image/1665049673_8.jpeg",
                        "thumbnail_path": "images/properties/property-images/thumbnail/1665049673_8.jpeg",
                        "image_order": "8",
                        "status": 1,
                        "created_at": "2022-10-06T09:47:54.000000Z",
                        "updated_at": "2022-10-06T09:47:54.000000Z",
                        "deleted_at": null,
                        "is_default": 0
                    }
                ]
                
            }
            
            ,
            {
                
                "address2":  "Royapettah",
               
                "pseudoname": "BRH Royapetta",
               
                "images":[
                    {
                        "id": 8060,
                        "property_id": 1216,
                        "image_path": "images/properties/property-images/image/1662963435_1.jpg",
                        "thumbnail_path": "images/properties/property-images/thumbnail/1662963435_1.jpg",
                        "image_order": "1",
                        "status": 1,
                        "created_at": "2022-09-12T06:17:16.000000Z",
                        "updated_at": "2022-09-12T07:48:06.000000Z",
                        "deleted_at": null,
                        "is_default": 0
                    },
                    {
                        "id": 8061,
                        "property_id": 1216,
                        "image_path": "images/properties/property-images/image/1662963436_2.jpg",
                        "thumbnail_path": "images/properties/property-images/thumbnail/1662963436_2.jpg",
                        "image_order": "2",
                        "status": 1,
                        "created_at": "2022-09-12T06:17:16.000000Z",
                        "updated_at": "2022-09-12T07:48:06.000000Z",
                        "deleted_at": null,
                        "is_default": 0
                    },
                    {
                        "id": 8062,
                        "property_id": 1216,
                        "image_path": "images/properties/property-images/image/1662963436_3.jpg",
                        "thumbnail_path": "images/properties/property-images/thumbnail/1662963436_3.jpg",
                        "image_order": "3",
                        "status": 1,
                        "created_at": "2022-09-12T06:17:16.000000Z",
                        "updated_at": "2022-09-12T07:48:06.000000Z",
                        "deleted_at": null,
                        "is_default": 0
                    },
                    {
                        "id": 8063,
                        "property_id": 1216,
                        "image_path": "images/properties/property-images/image/1662963436_4.jpg",
                        "thumbnail_path": "images/properties/property-images/thumbnail/1662963436_4.jpg",
                        "image_order": "4",
                        "status": 1,
                        "created_at": "2022-09-12T06:17:16.000000Z",
                        "updated_at": "2022-09-12T07:48:06.000000Z",
                        "deleted_at": null,
                        "is_default": 0
                    },
                    {
                        "id": 8064,
                        "property_id": 1216,
                        "image_path": "images/properties/property-images/image/1662963436_5.jpg",
                        "thumbnail_path": "images/properties/property-images/thumbnail/1662963436_5.jpg",
                        "image_order": "5",
                        "status": 1,
                        "created_at": "2022-09-12T06:17:17.000000Z",
                        "updated_at": "2022-09-12T07:48:06.000000Z",
                        "deleted_at": null,
                        "is_default": 0
                    },
                    {
                        "id": 8065,
                        "property_id": 1216,
                        "image_path": "images/properties/property-images/image/1662963437_6.jpg",
                        "thumbnail_path": "images/properties/property-images/thumbnail/1662963437_6.jpg",
                        "image_order": "6",
                        "status": 1,
                        "created_at": "2022-09-12T06:17:17.000000Z",
                        "updated_at": "2022-09-12T07:48:06.000000Z",
                        "deleted_at": null,
                        "is_default": 0
                    },
                    {
                        "id": 8066,
                        "property_id": 1216,
                        "image_path": "images/properties/property-images/image/1662963437_7.jpg",
                        "thumbnail_path": "images/properties/property-images/thumbnail/1662963437_7.jpg",
                        "image_order": "7",
                        "status": 1,
                        "created_at": "2022-09-12T06:17:17.000000Z",
                        "updated_at": "2022-09-12T07:48:06.000000Z",
                        "deleted_at": null,
                        "is_default": 0
                    },
                    {
                        "id": 8067,
                        "property_id": 1216,
                        "image_path": "images/properties/property-images/image/1662963437_8.jpg",
                        "thumbnail_path": "images/properties/property-images/thumbnail/1662963437_8.jpg",
                        "image_order": "8",
                        "status": 1,
                        "created_at": "2022-09-12T06:17:17.000000Z",
                        "updated_at": "2022-09-12T07:48:06.000000Z",
                        "deleted_at": null,
                        "is_default": 0
                    },
                    {
                        "id": 8068,
                        "property_id": 1216,
                        "image_path": "images/properties/property-images/image/1662963437_9.jpg",
                        "thumbnail_path": "images/properties/property-images/thumbnail/1662963437_9.jpg",
                        "image_order": "9",
                        "status": 1,
                        "created_at": "2022-09-12T06:17:17.000000Z",
                        "updated_at": "2022-09-12T07:48:06.000000Z",
                        "deleted_at": null,
                        "is_default": 0
                    },
                    {
                        "id": 8069,
                        "property_id": 1216,
                        "image_path": "images/properties/property-images/image/1662963437_10.jpg",
                        "thumbnail_path": "images/properties/property-images/thumbnail/1662963437_10.jpg",
                        "image_order": "10",
                        "status": 1,
                        "created_at": "2022-09-12T06:17:18.000000Z",
                        "updated_at": "2022-09-12T07:48:06.000000Z",
                        "deleted_at": null,
                        "is_default": 0
                    },
                    {
                        "id": 8070,
                        "property_id": 1216,
                        "image_path": "images/properties/property-images/image/1662968886_10.jpg",
                        "thumbnail_path": "images/properties/property-images/thumbnail/1662968886_10.jpg",
                        "image_order": "10",
                        "status": 1,
                        "created_at": "2022-09-12T07:48:06.000000Z",
                        "updated_at": "2022-09-12T07:48:06.000000Z",
                        "deleted_at": null,
                        "is_default": 1
                    }
                ]
                
            },
            
            {
                
                "address2": "Saidapet",
               
                "pseudoname": "BRH Guindy",
               
                "images":[
                    {
                        "id": 8021,
                        "property_id": 1210,
                        "image_path": "images/properties/property-images/image/1660302308_1.jpg",
                        "thumbnail_path": "images/properties/property-images/thumbnail/1660302308_1.jpg",
                        "image_order": "1",
                        "status": 1,
                        "created_at": "2022-08-12T11:05:09.000000Z",
                        "updated_at": "2022-08-12T11:05:09.000000Z",
                        "deleted_at": null,
                        "is_default": 1
                    },
                    {
                        "id": 8022,
                        "property_id": 1210,
                        "image_path": "images/properties/property-images/image/1660302309_2.jpg",
                        "thumbnail_path": "images/properties/property-images/thumbnail/1660302309_2.jpg",
                        "image_order": "2",
                        "status": 1,
                        "created_at": "2022-08-12T11:05:09.000000Z",
                        "updated_at": "2022-08-12T11:05:09.000000Z",
                        "deleted_at": null,
                        "is_default": 0
                    },
                    {
                        "id": 8023,
                        "property_id": 1210,
                        "image_path": "images/properties/property-images/image/1660302309_3.jpg",
                        "thumbnail_path": "images/properties/property-images/thumbnail/1660302309_3.jpg",
                        "image_order": "3",
                        "status": 1,
                        "created_at": "2022-08-12T11:05:09.000000Z",
                        "updated_at": "2022-08-12T11:05:09.000000Z",
                        "deleted_at": null,
                        "is_default": 0
                    },
                    {
                        "id": 8024,
                        "property_id": 1210,
                        "image_path": "images/properties/property-images/image/1660302309_4.jpg",
                        "thumbnail_path": "images/properties/property-images/thumbnail/1660302309_4.jpg",
                        "image_order": "4",
                        "status": 1,
                        "created_at": "2022-08-12T11:05:10.000000Z",
                        "updated_at": "2022-08-12T11:05:10.000000Z",
                        "deleted_at": null,
                        "is_default": 0
                    },
                    {
                        "id": 8025,
                        "property_id": 1210,
                        "image_path": "images/properties/property-images/image/1660302310_5.jpg",
                        "thumbnail_path": "images/properties/property-images/thumbnail/1660302310_5.jpg",
                        "image_order": "5",
                        "status": 1,
                        "created_at": "2022-08-12T11:05:10.000000Z",
                        "updated_at": "2022-08-12T11:05:10.000000Z",
                        "deleted_at": null,
                        "is_default": 0
                    }
                ]
                
            }
            
            
            
            ],
            spinner :false,
            tncmodal: false,
            privacymodal: false,
            isEnabled: false,
        }
    }

    componentDidMount = ()=>{
        
        this.backHandler = BackHandler.addEventListener('hardwareBackPress',()=>{
            if(this.state.tncmodal || this.state.privacymodal){
                this.setState({
                    tncmodal: false,
                    privacymodal: false
                })
                return true;
            }
            else{
                BackHandler.exitApp();
                return true;
            }
        })
    }

    componentWillUnmount=()=>{
        if(this.backHandler){
            this.backHandler.remove();
        }
    }

  

      _renderNearByPlaces = ({ item, index }) => {
        //console.log(item)
        
        let imageList = CommonHelpers.processRawImages(item.images);//[];
        
        return (
          
            <View height={290} >
              <SimilarPropertiesCard
                from="afterSplash"
                imageList={imageList}
                isLogin = {false}
                iconName='heart'
                iconColor='orange'
                contentdetails={
                  <View style={[box.detailsBox, { marginTop: "20%", height: 100 }]}>
                    <View style={{ flex: 1 }}>
                      <View style={{ /* flexDirection: "row" */ /* marginBottom : 10 */ }}>
                        <Text
                          style={[font.regular,
                          font.sizeMedium,
                          color.blackColor, { marginRight: 10, /* flexWrap: 'wrap', */ width: '100%' }]}>
                          {item.pseudoname}
                        </Text>
                         <View style = {[{/* marginTop: 5, *//*  flex: 1 */ width: 50, marginLeft: '2%'}]}>
                         
                   { <StarRatingComponent 
                   rating = {5} 
                   //isDisabled = {true}
                   readonly= {true}
                    />}
                    </View> 
                      </View>
    
                      <Text
                        style={[font.regular,
                        font.sizeMedium,
                        color.darkgrayColor, { marginBottom: "1%" }]}>
                       {item.address2}
                      </Text>
    
    
                    </View>
                  </View>
                } />
            </View>
         
        );
      }
    
    render(){
        return(
            <View height = {'100%'} width = {'100%'} style = {{paddingTop: '6%'}} >
                <ScrollView contentContainerStyle = {[{alignItems: 'center', paddingTop: '2%'}]}>
                    <Image 
                    source = {require('./../Assets/images/BRHnew.png')}
                    style = {[ image.imageContain,
                        {height: /* 100, // */ Dimensions.get('screen').width*0.25,
                        width: Dimensions.get('screen').width*0.6,
                        padding: 0
                    }]}
                    />
                    {/* <Text style = {[
                        font.sizeRegular, 
                        font.regular, 
                        color.darkgrayColor, 
                        { 
                            
                            textAlign: 'center', 
                            
                        }
                    ]}>
                                WORKSPACES IN INDIA
                    </Text> */}

                    <View  height = { 320} style = {{alignItems: 'flex-start'}}>
                        <Text style=
                        {[
                            font.semibold, 
                            font.sizeLarge, 
                            color.myOrangeColor, 
                            {marginLeft: 25, paddingTop: 25}]}>
                            Browse Popular Workspaces
                        </Text>

                        
            {
              this.state.nearByList.length != 0 ?
                
                 

                  <View style={{ marginTop: 20,  }}>
                    
                      <FlatList
                        data={this.state.nearByList}
                        renderItem={this._renderNearByPlaces}
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}
                        nestedScrollEnabled= {true}
                      /> 

                  </View>

               : null}
            
                    </View>

                    <Text style = {[font.sizeVeryRegular, font.bold, color.blackColor, {textAlign: 'center', width: '75%', lineHeight: 15, marginTop: 70}]}>
                        If you wish to explore properties 
                        and spaces on our platform without 
                        registering or logging in, please 
                        visit our {<Text style = {[color.myOrangeColor]}>website.</Text>}
                    </Text>

                    <View style = {{flex: 1, flexDirection: 'row', alignContent: 'space-around', height: 40, marginTop: 30}}>
                        <TouchableOpacity 
                        onPress = {()=>{
                            this.setState({
                                privacymodal: true,
                            })
                        }}
                        
                        style = {[button.defaultRadius,color.grayBorderColor, {width: '40%'}]}>
                            <Text style = {[font.semibold, 
                            font.sizeVeryRegular, 
                            color.myOrangeColor,
                            {textAlign: 'center'}
                            ]}>Privacy Policy</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress = {()=>{
                            this.setState({
                                tncmodal: true,
                            })
                        }} style = {[button.defaultRadius,color.grayBorderColor, {marginLeft: 20, width: '40%'}]}>
                            <Text style = {[font.semibold, font.sizeVeryRegular, color.myOrangeColor,{textAlign: 'center'}]}>Terms and Conditions</Text>
                        </TouchableOpacity>

                    </View>
                    <View style = {[ {flexDirection: 'row', padding: '12%', /* width: '75%', */
                    
                   // width : '70%', 
                   // lineHeight: 20, 
                    marginTop: 20,
                marginBottom: 60 
                }]}
                    >
                         <Switch 
                             trackColor={{ false: "#767577", true: "orange" }}
                             thumbColor={this.state.isEnabled ? "#fff" : "#f4f3f4"}
                             ios_backgroundColor="#3e3e3e"
                             onValueChange={value =>{
                                 console.log(value)
                                this.setState({
                                 isEnabled: value,
                             })}}
                             value={this.state.isEnabled}
                             style={{marginRight: 10, alignSelf:'flex-start',}}
                             />
                    <Text style = {[font.sizeSmall, font.semibold, color.blackColor, {textAlign:'left'} ]}>
                        By using this app you agree to BeRightHere.com's Terms 
                        and Conditions and Privacy Policy.</Text>

                    </View>

                    
                    
                    
                </ScrollView> 

                <View style = {{ flexDirection:'row', bottom: 0, position: 'absolute', height: 70, backgroundColor: color.myOrangeColor.color, width: '100%' }}>
                <TouchableOpacity 
                style= {[{
                    backgroundColor:'white', flex: 1,
                    borderTopColor: 'black',
                    borderTopWidth:0.5,
                
                }]}
                onPress = {()=>{
                    if(this.state.isEnabled)
                    this.props.navigation.push('afterlogin',{screen:'masterhome'});
                    //this.props.navigation.push('Login');
                    else{
                        CommonHelpers.showFlashMsg('Please accept the Privacy Policy and Terms and Conditions.', 'danger');
                    }
                   
                }}
                 >
                    <View style = {{flexDirection: 'row', justifyContent: 'center', height: '100%', alignItems: 'center', }}>
                    <Text style = {[font.regular, font.sizeRegular, color.blackColor,]} >Continue as Guest</Text>
                    <Icon name = 'arrow-right' size={20} style = {{marginLeft: 20}} color = {color.textWhiteColor.color}/>

                    </View>
                        
                </TouchableOpacity>
                <TouchableOpacity 
                style = {[{flex: 1, }]}
                onPress = {()=>{
                    if(this.state.isEnabled)
                   
                    this.props.navigation.push('Login');
                    else{
                        CommonHelpers.showFlashMsg('Please accept the Privacy Policy and Terms and Conditions.', 'danger');
                    }
                   
                }}
                 >
                    <View style = {{flexDirection: 'row', justifyContent: 'center', height: '100%', alignItems: 'center'}}>
                    <Text style = {[font.regular, font.sizeRegular, color.blackColor, color.textWhiteColor, ]} ><Text>LOGIN</Text> TO CONTINUE</Text>
                    <Icon name = 'arrow-right' size={20} style = {{marginLeft: 20}} color = {color.textWhiteColor.color}/>

                    </View>
                        
                </TouchableOpacity>
                    </View>

               {/*  <TouchableOpacity 
                onPress = {()=>{
                    if(this.state.isEnabled)
                    this.props.navigation.push('afterlogin',{screen:'masterhome'});
                    //this.props.navigation.push('Login');
                    else{
                        CommonHelpers.showFlashMsg('Please accept the Privacy Policy and Terms and Conditions.', 'danger');
                    }
                   
                }}
                style = {{bottom: 0, position: 'absolute', height: 50, backgroundColor: color.myOrangeColor.color, width: '100%' }} >
                    <View style = {{flexDirection: 'row', justifyContent: 'center', height: '100%', alignItems: 'center'}}>
                    <Text style = {[font.regular, font.sizeMedium, color.blackColor, color.textWhiteColor,{ letterSpacing: 2} ]} >LOGIN TO CONTINUE</Text>
                    <Icon name = 'arrow-right' size={20} style = {{marginLeft: 20}} color = {color.textWhiteColor.color}/>

                    </View>
                        
                </TouchableOpacity> */}

                {this.state.spinner && <Spinner/>}

                {this.state.tncmodal && <Modal position={"center"} swipeToClose = {false}
                onClosed = {()=>{this.setState({tncmodal: false})}}
                style  ={{
                    justifyContent: 'space-around',
                    alignItems: 'space-around',
                    padding: 20,
                    height: Dimensions.get('screen').height * 0.7,
                    width:Dimensions.get('screen').width * 0.9,
                  }} isOpen={this.state.tncmodal}>
                <View height = {"100%"}>
                    <ScrollView keyboardShouldPersistTaps = {"always"}>
            <Text style = {[font.bold, font.sizeLarge, color.myOrangeColor, {textAlign: "center", marginBottom: "10%"}]}>Terms</Text>
            <Text style = {[font.regular, font.sizeRegular, color.darkgrayColor, {textAlign: "justify", marginBottom: "10%"}]}>{"Effective Date: March 31, 2021 " }</Text>
            <Text style = {[font.regular, font.sizeRegular, color.darkgrayColor, {textAlign: "justify", lineHeight: 14 + 14*1}]}>
                {termsandconditions}
            </Text>
            <Text style = {[font.bold, font.sizeLarge, color.myOrangeColor, {textAlign: "center", marginBottom: "10%"}]}>Eligibility</Text>
            <Text style = {[font.regular, font.sizeRegular, color.darkgrayColor, {textAlign: "justify", lineHeight: 14 + 14*1}]}>
                {elegibilty_text}
            </Text>
            <Text style = {[font.bold, font.sizeLarge, color.myOrangeColor, {textAlign: "center", marginBottom: "10%"}]}>Content</Text>
            <Text style = {[font.regular, font.sizeRegular, color.darkgrayColor, {textAlign: "justify", lineHeight: 14 + 14*1}]}>
                {content_text}
            </Text>

            <Text style = {[font.bold, font.sizeLarge, color.myOrangeColor, {textAlign: "center", marginBottom: "10%"}]}>CLAIMS OF COPYRIGHT INFRINGEMENT</Text>
            <Text style = {[font.regular, font.sizeRegular, color.darkgrayColor, {textAlign: "justify", lineHeight: 14 + 14*1}]}>
                {CLAIMS_OF_COPYRIGHT_INFRINGEMENT_text}
            </Text>

            <Text style = {[font.bold, font.sizeLarge, color.myOrangeColor, {textAlign: "center", marginBottom: "10%"}]}>REVIEWS, ENQUIRIES, COMMENTS AND USE OF OTHER INTERACTIVE AREAS</Text>
            <Text style = {[font.regular, font.sizeRegular, color.darkgrayColor, {textAlign: "justify", lineHeight: 14 + 14*1}]}>
                {review_text1}
            </Text>
            <Text style = {[font.regular, font.sizeRegular, color.darkgrayColor, {textAlign: "justify", lineHeight: 14 + 14*1}]}>
                {review_text2}
            </Text>
            <Text style = {[font.regular, font.sizeRegular, color.darkgrayColor, {textAlign: "justify", lineHeight: 14 + 14*1}]}>
                {review_text3}
            </Text>
            <Text style = {[font.regular, font.sizeRegular, color.darkgrayColor, {textAlign: "justify", lineHeight: 14 + 14*1}]}>
                {review_text4}
            </Text>
            <Text style = {[font.regular, font.sizeRegular, color.darkgrayColor, {textAlign: "justify", lineHeight: 14 + 14*1}]}>
                {review_text5}
            </Text>
            <Text style = {[font.regular, font.sizeRegular, color.darkgrayColor, {textAlign: "justify", lineHeight: 14 + 14*1}]}>
                {review_text6}
            </Text>

            <Text style = {[font.bold, font.sizeLarge, color.myOrangeColor, {textAlign: "center", marginBottom: "10%"}]}>BERIGHTHERE.COM SPACE ACCOUNTS</Text>
            <Text style = {[font.regular, font.sizeRegular, color.darkgrayColor, {textAlign: "justify", lineHeight: 14 + 14*1}]}>
                {space_accounts_text1}
            </Text>
            <Text style = {[font.regular, font.sizeRegular, color.darkgrayColor, {textAlign: "justify", lineHeight: 14 + 14*1}]}>
                {space_accounts_text2}
            </Text>
            <Text style = {[font.regular, font.sizeRegular, color.darkgrayColor, {textAlign: "justify", lineHeight: 14 + 14*1}]}>
                {space_accounts_text3}
            </Text>

            <Text style = {[font.bold, font.sizeLarge, color.myOrangeColor, {textAlign: "center", marginBottom: "10%"}]}>USER ACCOUNTS</Text>
            <Text style = {[font.regular, font.sizeRegular, color.darkgrayColor, {textAlign: "justify", lineHeight: 14 + 14*1}]}>
                {user_accounts_text1}
            </Text>

            <Text style = {[font.regular, font.sizeRegular, color.darkgrayColor, {textAlign: "justify", lineHeight: 14 + 14*1}]}>
                {user_accounts_text2}
            </Text>
            <Text style = {[font.bold, font.sizeLarge, color.myOrangeColor, {textAlign: "center", marginBottom: "10%"}]}>USER ACCOUNT DELETION</Text>
            <Text style = {[font.regular, font.sizeRegular, color.darkgrayColor, {textAlign: "justify", lineHeight: 14 + 14*1}]}>
                {user_account_deletion}
            </Text>

            <Text style = {[font.bold, font.sizeLarge, color.myOrangeColor, {textAlign: "center", marginBottom: "10%"}]}>DISPUTES BETWEEN COWORKING SPACES AND USERS</Text>
            <Text style = {[font.regular, font.sizeRegular, color.darkgrayColor, {textAlign: "justify", lineHeight: 14 + 14*1}]}>
                {disputes_text}
            </Text>

            <Text style = {[font.bold, font.sizeLarge, color.myOrangeColor, {textAlign: "center", marginBottom: "10%"}]}>THIRD-PARTY SUPPLIERS</Text>
            <Text style = {[font.regular, font.sizeRegular, color.darkgrayColor, {textAlign: "justify", lineHeight: 14 + 14*1}]}>
                {third_party_text}
            </Text>

            <Text style = {[font.bold, font.sizeLarge, color.myOrangeColor, {textAlign: "center", marginBottom: "10%"}]}>LINKS TO THIRD-PARTY SITES</Text>
            <Text style = {[font.regular, font.sizeRegular, color.darkgrayColor, {textAlign: "justify", lineHeight: 14 + 14*1}]}>
                {link_text}
            </Text>

            <Text style = {[font.bold, font.sizeLarge, color.myOrangeColor, {textAlign: "center", marginBottom: "10%"}]}>LIABILITY DISCLAIMER</Text>
            <Text style = {[font.regular, font.sizeRegular, color.darkgrayColor, {textAlign: "justify", lineHeight: 14 + 14*1}]}>
                {liability_text}
            </Text>

            <Text style = {[font.bold, font.sizeLarge, color.myOrangeColor, {textAlign: "center", marginBottom: "10%"}]}>INDEMNIFICATION</Text>
            <Text style = {[font.regular, font.sizeRegular, color.darkgrayColor, {textAlign: "justify", lineHeight: 14 + 14*1}]}>
                {indem_text}
            </Text>

            <Text style = {[font.bold, font.sizeLarge, color.myOrangeColor, {textAlign: "center", marginBottom: "10%"}]}>MICELLANEOUS</Text>
            <Text style = {[font.regular, font.sizeRegular, color.darkgrayColor, {textAlign: "justify", lineHeight: 14 + 14*1}]}>
                {mis_text}
            </Text>

            <Text style = {[font.bold, font.sizeLarge, color.myOrangeColor, {textAlign: "center", marginBottom: "10%"}]}>MODIFICATIONS TO THIS AGREEMENT</Text>
            <Text style = {[font.regular, font.sizeRegular, color.darkgrayColor, {textAlign: "justify", lineHeight: 14 + 14*1}]}>
                {mod_text}
            </Text>

            <Text style = {[font.bold, font.sizeLarge, color.myOrangeColor, {textAlign: "center", marginBottom: "10%"}]}>COPYRIGHT AND TRADEMARK NOTICES</Text>
            <Text style = {[font.regular, font.sizeRegular, color.darkgrayColor, {textAlign: "justify", lineHeight: 14 + 14*1}]}>
                {copyright_text}
            </Text>

            <Text style = {[font.bold, font.sizeLarge, color.myOrangeColor, {textAlign: "center", marginBottom: "10%"}]}>CONTACT</Text>
            <Text style = {[font.regular, font.sizeRegular, color.darkgrayColor, {textAlign: "justify", lineHeight: 14 + 14*1}]}>
                {contact_text}
            </Text>


            </ScrollView>
            </View>
           
                    </Modal>}

                    {this.state.privacymodal && <Modal position={"center"} swipeToClose = {false}
                onClosed = {()=>{this.setState({privacymodal: false})}}
                style  ={{
                    justifyContent: 'space-around',
                    alignItems: 'space-around',
                    padding: 20,
                    height: Dimensions.get('screen').height * 0.7,
                    width:Dimensions.get('screen').width * 0.9,
                  }} isOpen={this.state.privacymodal}>
                <View height = {"100%"}>
                    <ScrollView keyboardShouldPersistTaps = {"always"}>
            <Text style = {[font.bold, font.sizeLarge, color.myOrangeColor, {textAlign: "center", marginBottom: "10%"}]}>Privacy Policy</Text>
            
            <Text style = {[font.regular, font.sizeRegular, color.darkgrayColor, {textAlign: "justify", lineHeight: 14 + 14*1}]}>
                {privacyPolicy}
            </Text>
            <Text style = {[font.bold, font.sizeLarge, color.myOrangeColor, {textAlign: "center", marginBottom: "10%"}]}>Information Collection and Use</Text>
            <Text style = {[font.regular, font.sizeRegular, color.darkgrayColor, {textAlign: "justify", lineHeight: 14 + 14*1}]}>
                {information_collection_and_use}
            </Text>
            <Text style = {[font.bold, font.sizeLarge, color.myOrangeColor, {textAlign: "center", marginBottom: "10%"}]}>Location Information</Text>
            <Text style = {[font.regular, font.sizeRegular, color.darkgrayColor, {textAlign: "justify", lineHeight: 14 + 14*1}]}>
                {location_information}
            </Text>

            <Text style = {[font.bold, font.sizeLarge, color.myOrangeColor, {textAlign: "center", marginBottom: "10%"}]}>Camera</Text>
            <Text style = {[font.regular, font.sizeRegular, color.darkgrayColor, {textAlign: "justify", lineHeight: 14 + 14*1}]}>
                {camera}
            </Text>

            <Text style = {[font.bold, font.sizeLarge, color.myOrangeColor, {textAlign: "center", marginBottom: "10%"}]}>Cookies</Text>
            <Text style = {[font.regular, font.sizeRegular, color.darkgrayColor, {textAlign: "justify", lineHeight: 14 + 14*1}]}>
                {cookies}
            </Text>
            

            <Text style = {[font.bold, font.sizeLarge, color.myOrangeColor, {textAlign: "center", marginBottom: "10%"}]}>Service Providers</Text>
            <Text style = {[font.regular, font.sizeRegular, color.darkgrayColor, {textAlign: "justify", lineHeight: 14 + 14*1}]}>
                {service_providers}
            </Text>
           

            <Text style = {[font.bold, font.sizeLarge, color.myOrangeColor, {textAlign: "center", marginBottom: "10%"}]}>Security</Text>
            <Text style = {[font.regular, font.sizeRegular, color.darkgrayColor, {textAlign: "justify", lineHeight: 14 + 14*1}]}>
                {security}
            </Text>

           
            <Text style = {[font.bold, font.sizeLarge, color.myOrangeColor, {textAlign: "center", marginBottom: "10%"}]}>Links to Other Sites</Text>
            <Text style = {[font.regular, font.sizeRegular, color.darkgrayColor, {textAlign: "justify", lineHeight: 14 + 14*1}]}>
                {links_to_other_sites}
            </Text>

            <Text style = {[font.bold, font.sizeLarge, color.myOrangeColor, {textAlign: "center", marginBottom: "10%"}]}>USER ACCOUNT DELETION</Text>
            <Text style = {[font.regular, font.sizeRegular, color.darkgrayColor, {textAlign: "justify", lineHeight: 14 + 14*1}]}>
                {user_account_deletion}
            </Text>

            <Text style = {[font.bold, font.sizeLarge, color.myOrangeColor, {textAlign: "center", marginBottom: "10%"}]}>Children's Privacy</Text>
            <Text style = {[font.regular, font.sizeRegular, color.darkgrayColor, {textAlign: "justify", lineHeight: 14 + 14*1}]}>
                {children_privacy}
            </Text>

            <Text style = {[font.bold, font.sizeLarge, color.myOrangeColor, {textAlign: "center", marginBottom: "10%"}]}>Changes To Privacy Policy</Text>
            <Text style = {[font.regular, font.sizeRegular, color.darkgrayColor, {textAlign: "justify", lineHeight: 14 + 14*1}]}>
                {changes_to_privacy_policy}
            </Text>

            <Text style = {[font.bold, font.sizeLarge, color.myOrangeColor, {textAlign: "center", marginBottom: "10%"}]}>Contact Us</Text>
            <Text style = {[font.regular, font.sizeRegular, color.darkgrayColor, {textAlign: "justify", lineHeight: 14 + 14*1}]}>
                {contact_us}
            </Text>


            </ScrollView>
            </View>
           
                    </Modal>}
                </View>

            
        );
    };

}