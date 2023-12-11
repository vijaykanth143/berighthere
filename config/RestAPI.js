
// live api base url
export const BASE_URL = "https://berighthere.com/api/"

import Session from "./Session";
//export const BASE_URL  = "https://uatnew.berighthere.com/api/";
//export const BASE_URL  = "https://dev.berighthere.com/api/";
//export const RAZORPAY_KEY = 'rzp_test_P6I9FiuDfakrt0'; //TEST KEY
export const RAZORPAY_KEY = 'rzp_live_Q7sEDrHF9UaUit'; // live key

// QA api base url
// export const BASE_URL = "http://13.233.76.246/api/";

// Staging api base url
// export const BASE_URL = "http://13.233.76.246/api/";


export const AWS_URL = "https://brhfiles.s3.ap-south-1.amazonaws.com/"

export const LOGIN_CHECK =  BASE_URL + 'check-login';

export const LOGIN = BASE_URL + "member-auth";
export const REGISTER = BASE_URL + 'member-singup';
export const PROPERTY_LIST = BASE_URL + "property-list";
export const TOKEN  = BASE_URL + "v1/oauth/token"
//export const BOOKING_LIST = BASE_URL + "booking-list/"
export const PROPERTY_INFO = BASE_URL + "property-info/";
export const SEARCH  = BASE_URL + 'property-search';
export const BOOKING_REQUEST = BASE_URL + "request-booking";
export const MEMBER_DIRECT_BOOKING = BASE_URL + 'direct-booking';
export const MEMBER_DIRECT_BOOKING_CALLBACK = BASE_URL + 'callback_razor';
//export const FETCH_BOOKING = BASE_URL + "booking-list/";
export const LIST_OF_AMENITIES = BASE_URL + "amenities";
export const PROPERTY_TYPES = BASE_URL + 'propertytype';
export const RESOURCE_GROUPS = BASE_URL + 'resourcegroup';
export const MEMBER_CURRENT_BOOKING = BASE_URL + 'member-current-booking';
export const MEMBER_PREVIOUS_BOOKING = BASE_URL + 'member-booking-history';
export const MEMBER_UPCOMING_BOOKING  = BASE_URL + 'member-upcoming-booking';
export const MEMBER_BOOKING_CANCELLATION = BASE_URL + 'booking-cancel-request'//'booking_cancel';

export const BOOKING_INFO  = BASE_URL + 'booking-info';

//export const EMPLOYEE_LOGIN = BASE_URL + 'employeeauth';
export const EMPLOYEE_PROPERTY_LIST =BASE_URL+ 'employee-property-list';
export const GET_SEAT_RESERVATION = BASE_URL + 'get-seat-reservation';
export const SEAT_RESERVATION_EMP = BASE_URL + 'post-seat-reservation';
export const EMP_UPCOMING_RESERVATION  = BASE_URL + 'employee-upcoming-reservation';
export const EMPLOYEE_CURRENT_RESERVATION  = BASE_URL + 'employee-current-reservation';
export const EMP_RESERVATION_HISTORY = BASE_URL + 'employee-reservation-history';
export const EMP_ALLOCATED_SEAT  =BASE_URL + 'employee-allocated-seat';
export const EMP_CHECK_DETAILS = BASE_URL + 'employee_check_details'; //for check out and check in
export const EMP_BOOKING_DETAILS = BASE_URL + 'employee_booking_details/';
export const GET_USER_DOCUMENTS = BASE_URL + 'get_user_documents/';
export const EMPLOYEE_MODIFY_RESERVATION = BASE_URL + 'edit-seat-reservation';
export const DELETE_SEAT_RESERVATION = BASE_URL + 'delete-seat-reservation';
export const GET_ROLE_DOCUMENT =  BASE_URL + 'get_role_document/7';
export const GET_USER_LOCATION = BASE_URL + 'check-user-location';
export const ISSUE_CATEGORY = BASE_URL + 'issues_category';
export const ISSUES_DETAIL = BASE_URL + 'issues_detail';
export const CORPORATE_ISSUES  = BASE_URL + 'corporate_issues';
export const CHANGE_PASSWORD  = BASE_URL + 'change-psw';
export const FORGOT_PASSWORD  =BASE_URL + 'member-forgot-psw';



export const PROPERTY_RESOURCE_NAMES = BASE_URL + 'propertyresources';
export const PROPERTY_RESOURCE_TYPES = BASE_URL + 'resourcegroup';

export const MAPPED_PROPERTY = BASE_URL + 'mappedproperty';

export const DELETE_MEMBER  = BASE_URL + 'member/';
export const DELETE_EMPLOYEE  = BASE_URL + 'changeemployeestatus';



// meeting spaces
export const MEETING_RESOURCE_GROUP = BASE_URL + 'meeting-resource-group';
export const MEETING_PROPERTY_LIST = BASE_URL + 'meeting-property-list';
export const MEETING_PROPERTY_INFO = BASE_URL + 'meeting-property-info';
export const MEETING_TIME_AVAILABILITY = BASE_URL + 'check-direct-booking-exist';
export const PUSH_GUEST_LIST = BASE_URL + 'post-invite-guest';
export const DELETE_GUEST= BASE_URL+ 'delete-invite-guest/';
export const MODIFY_MEETING = BASE_URL + 'request-modify-booking/';

export const ADD_TO_WISHLIST = BASE_URL + 'post-property-wish-list';
export const GET_WISHLIST = BASE_URL + 'property-wish-list';


export const termsandconditions = "BeRightHere.com (“we” or “us”) owns and operates the website at berighthere.com (the “Site”), where you can find information about our products and services. These Website Terms and Conditions (the “Website Terms”) describe the rights and obligations of an unregistered website user or visitor (“user” or “you”) in connection with your use of the Site. By accessing or using the Site in any way, including as an unregistered website visitor, you agree to be bound by these Website Terms and our Privacy Policy, which is available on the Site. These Website Terms apply only to your use of the Site, and the content made available on or through the Site, as an unregistered website user or visitor. If you use or access any of our physical space, restricted-access web-based services (i.e., those requiring a login), the broker or referral program or other services we provide, your use of such space, services or program is subject to the terms and conditions you received or accepted when you signed up for such space, services or program. In case such terms and conditions are specifically not received or accepted at the time of sign up for such space, services or program, the website terms contained herein will apply. From time to time, we may make modifications, deletions or additions to the Site or these Website Terms. Your continued use of the Site following the posting of any changes to the Website Terms constitutes acceptance of those changes."
export const elegibilty_text = "The Site and services it describes are available only to individuals who are at least 18 years old, unless we specify otherwise. No one under this age may access or use the Site or provide any personal information through the Site.";
export const content_text = "The text, images, videos, audio clips, software and other content generated, provided, or otherwise made accessible on or through the Site (collectively, “Content”) are contributed by us and our licensors. The Content and the Site are protected by Indian and international copyright laws. We and our licensors retain all proprietary rights in the Site and the Content made available on or through the Site, and, except as expressly set forth in these Website Terms, no rights are granted to any Content. Subject to these Website Terms, we grant each user of the Site a worldwide, non-exclusive, non-sublicensable and non-transferable license to use (i.e., to download and display locally) Content solely for viewing, browsing and using the functionality of the Site. All Content is for general informational purposes only. We reserve the right, but do not have any obligation to monitor, remove, edit, modify or remove any Content, in our sole discretion, at any time for any reason or for no reason at all.";
export const CLAIMS_OF_COPYRIGHT_INFRINGEMENT_text = "For claims of copyright infringement, please contact us at support@berighthere.com or one of the physical addresses set out in Section CONTACT below.";
export const review_text1 =  "Please be aware that by submitting content to this Website by email, postings on this Website or otherwise, including any coworking reviews, questions, photographs or videos, comments, suggestions, ideas or the like contained in any submissions (collectively, 'Submissions'), you grant BeRightHere.com and its affiliates a nonexclusive, royalty-free, perpetual, transferable, irrevocable and fully sub-licensable right to (a) use, reproduce, modify, adapt, translate, distribute, publish, create derivative works from and publicly display and perform such Submissions throughout the world in any media, now known or hereafter devised, for any purpose; and (b) use the name that you submit in connection with such Submission. You acknowledge that BeRightHere.com may choose to provide attribution of your comments or reviews at our discretion. You further grant BeRightHere.com the right to pursue at law any person or entity that violates your or BeRightHere.com 's rights in the Submissions by a breach of this Agreement. You acknowledge and agree that Submissions are non-confidential and non-proprietary. Spaces whom a representative of theirs “claim” their space in which the content was submitted by a 3rd party contributor also grant BeRightHere.com and its affiliates the same rights listed above.";

export const review_text2 = "This Website may contain discussion forums, bulletin boards, review services or other forums in which you or third parties may post reviews of coworking experiences or other content, messages, materials or other items on this Website (Interactive Areas). If BeRightHere.com provides such Interactive Areas, you are solely responsible for your use of such Interactive Areas and use them at your own risk. By using any Interactive Areas, you expressly agree not to post, upload to, transmit, distribute, store, create or otherwise publish through this Website any of the following:"
export const review_text3 = "Any message, data, information, text, music, sound, photos, graphics, code or any other material (Content) that is unlawful, libelous, defamatory, obscene, pornographic, indecent, lewd, suggestive, harassing, threatening, invasive of privacy or publicity rights, abusive, inflammatory, fraudulent or otherwise objectionable; \n Content that would constitute, encourage or provide instructions for a criminal offense, violate the rights of any party, or that would otherwise create liability or violate any local, state, national or international law, including, without limitation, the regulations of the country of incorporation or country in which services are utilized. \n Content that may infringe any patent, trademark, trade secret, copyright or other intellectual or proprietary right of any party \n Content that impersonates any person or entity or otherwise misrepresents your affiliation with a person or entity, including BeRightHere.com \n Unsolicited promotions, political campaigning, advertising, contests, raffles, or solicitations \n Private information of any third party, including, without limitation, surname (family name) addresses, phone numbers, email addresses, Aadhaar number and credit card numbers \n Viruses, corrupted data or other harmful, disruptive or destructive files \n Content that is unrelated to the topic of the Interactive Area(s) in which such Content is posted \n Content or links to content that, in the sole judgment of BeRightHere.com, (a) violates the previous subsections herein, (b) is objectionable, (c) which restricts or inhibits any other person from using or enjoying the Interactive Areas or this Website, or (d) which may expose BeRightHere.com or its affiliates or its users to any harm or liability of any type"
export const review_text4 = "BeRightHere.com takes no responsibility and assumes no liability for any Content posted, stored or uploaded by you or any third party, or for any loss or damage thereto, nor is BeRightHere.com liable for any mistakes, defamation, slander, libel, omissions, falsehoods, obscenity, pornography or profanity you may encounter. As a provider of interactive services, BeRightHere.com is not liable for any statements, representations or Content provided by its users in any public forum, personal home page or other Interactive Area. Although BeRightHere.com has no obligation to screen, edit or monitor any of the Content posted to or distributed through any Interactive Area, BeRightHere.com reserves the right, and has absolute discretion, to remove, screen, translate or edit without notice any content posted or stored on this Website at any time and for any reason, or to have such actions performed by third parties on its behalf, and you are solely responsible for creating backup copies of and replacing any content you post or store on this Website at your sole cost and expense.";
export const review_text5 = "If it is determined that you retain moral rights (including rights of attribution or integrity) in the content, you hereby declare that (a) you do not require that any personally identifying information be used in connection with the Content, or any derivative works of or upgrades or updates thereto; (b) you have no objection to the publication, use, modification, deletion and exploitation of the content by BeRightHere.com or its licensees, successors and assigns; (c) you forever waive and agree not to claim or assert any entitlement to any and all moral rights of an author in any of the content; and (d) you forever release BeRightHere.com, and its licensees, successors and assigns, from any claims that you could otherwise assert against BeRightHere.com by virtue of any such moral rights.";
export const review_text6 = "Any use of the Interactive Areas or other portions of this Website in violation of the foregoing violates the terms of this Agreement and may result in, among other things, termination or suspension of your rights to use the Interactive Areas and/or this Website.";
export const space_accounts_text1  = "All information submitted in connection with a User account on the Services (each, a “User Account”) must be accurate and truthful. Users agree to notify BeRightHere.com immediately if their User Account has been used without authorization or there has been any other breach of security of the User Account. Each User also agrees to provide additional information BeRightHere.com may reasonably request and to answer truthfully and completely any questions BeRightHere.com might ask you in order to verify such User's identity. Users, whether by verified account or guest users cannot take legal action against BeRightHere.com for any disputes that may arise between them and a BeRightHere.com space for any reason. Please be aware that by submitting content to this Website by email, postings on this Website or otherwise, including any coworking reviews, questions, photographs or videos, comments, suggestions, ideas or the like contained in any submissions (collectively, Submissions), you grant BeRightHere.com and its affiliates a nonexclusive, royalty-free, perpetual, transferable, irrevocable and fully sub-licensable right to (a) use, reproduce, modify, adapt, translate, distribute, publish, create derivative works from and publicly display and perform such Submissions throughout the world in any media, now known or hereafter devised, for any purpose; and (b) use the name that you submit in connection with such Submission. You acknowledge that BeRightHere.com may choose to provide attribution of your comments or reviews at our discretion. You further grant BeRightHere.com the right to pursue at law any person or entity that violates your or BeRightHere.com 's rights in the Submissions by a breach of this Agreement. You acknowledge and agree that Submissions of user content are non-confidential and non-proprietary. Further Users agree and understand that:";
export const space_accounts_text2 = "Spaces are only entitled multiple space listing (page) per location. Duplicate space listings will be removed without further notice \n Space submissions to the site using the “Add Your Space” feature will be approved at the sole discretion of BeRightHere.com. If information is missing, BeRightHere.com will make a reasonable attempt to request information for the space. Submissions that are not deemed a “coworking space” may not be approved for publication on the site. Coworking spaces are generally defined by BeRightHere.com to have shared work space for community, shared amenities for customers, and paid passes and membership options of less than 6 months term. BeRightHere.com reserves the right to approve, disapprove, and remove listings at their sole discretion regardless if the space meets the above criteria. \n The basic space page listing is free. Spaces may enable bookings and subscribe to Marketing Services (“Premium Plans”) for a fee and commission. The spaces will agree to separate and additional terms when enabling these services. \n BeRightHere.com employs sales personnel, and works with commercial broker partners to provide a full range of office search services for corporate users. BeRightHere.com captures leads and in certain instances works directly with the customer and coworking space operators to find a suitable solution. Operators may choose to participate in this broker placement program by signing an agreement with us and/or our broker partners \n BeRightHere.com is not liable for any damages that may be incurred from content on the Website or its affiliates including but not limited to reviews, photos, descriptions, and other forms of media which may have opinions of 3rd parties. \n Spaces may not take legal action against BeRightHere.com, Users or 3rd parties for their opinions in the form of media (text, photos, reviews, comments) created and published on the site \n Spaces that would like their listings permanently removed from the site, may request to do so for a fee of $100. This fee goes to cover the labor, hosting, and administrative costs in supporting the profile and delisting"
export const space_accounts_text3= "BeRightHere.com reserves the right to remove space listings, terminate and remove unwarranted content or activity from the website without notice. BeRightHere.com reserves the right and may pursue legal action against perpetrators for damages caused but these and other prohibited activities.";
export const user_accounts_text1= "All information submitted in connection with a User account on the Services (each, a “User Account”) must be accurate and truthful. Users agree to notify BeRightHere.com immediately if their User Account has been used without authorization or there has been any other breach of security of the User Account. Each User also agrees to provide additional information BeRightHere.com may reasonably request and to answer truthfully and completely any questions BeRightHere.com might ask you in order to verify such User's identity. Users, whether by verified account or guest users cannot take legal action against BeRightHere.com for any disputes that may arise between them and a BeRightHere.com space for any reason. Please be aware that by submitting content to this Website by email, postings on this Website or otherwise, including any coworking reviews, questions, photographs or videos, comments, suggestions, ideas or the like contained in any submissions (collectively, Submissions), you grant BeRightHere.com and its affiliates a nonexclusive, royalty-free, perpetual, transferable, irrevocable and fully sub-licensable right to (a) use, reproduce, modify, adapt, translate, distribute, publish, create derivative works from and publicly display and perform such Submissions throughout the world in any media, now known or hereafter devised, for any purpose; and (b) use the name that you submit in connection with such Submission. You acknowledge that BeRightHere.com may choose to provide attribution of your comments or reviews at our discretion. You further grant BeRightHere.com the right to pursue at law any person or entity that violates your or BeRightHere.com 's rights in the Submissions by a breach of this Agreement. You acknowledge and agree that Submissions of user content are non-confidential and non-proprietary. Further Users agree and understand that:"
export const user_accounts_text2  = "Users are only entitled 1 account per person. Duplicate user profiles will be removed without further notice \n BeRightHere.com employs internal sales teams and works with commercial broker partners to provide office search support to users. Users may be contacted by our team and commercial partners to assist in finding office solutions \n BeRightHere.com is not liable for any damages that may be incurred from content on the Website or its affiliates including but not limited to reviews, photos, descriptions, and other forms of media which may have opinions of 3rd parties \n Users may not take legal action against BeRightHere.com, Spaces or 3rd parties for their opinions in the form of media (text, photos, reviews, comments) created and published on the site \n BeRightHere.com reserves the right to remove user profiles, terminate and remove unwarranted content or activity from the website without notice.";
export const user_account_deletion = 'You may choose to terminate your account at our Site any time, in which case we will permanently delete your account and all data associated with it. Individual registered users may contact us directly through the below mentioned email or phone number to request deletion of their data from BeRightHere.com Website or the Android and iOS Apps. This activity may take up to 28 days to come into effect. \n Email: support@berighthere.com \n Phone:  +918050369875';
export const disputes_text = "Coworking Spaces are bound to honour the rates, pricing, tours, days passes and bookings listed and facilitated through the Website. BeRightHere.com does not recognize any third party and/or agency affiliated with the Spaces as a Space Owner. If a Space is unable to fulfill any promise or reservation, the Space will work with the Customers to reach a mutually satisfactory resolution, which may include the issuance of a refund of Customers by the Space. BeRightHere.com is under no obligation to become involved in disputes between Spaces and Customers, or Users and any third party. In the event of any dispute, we may provide the Space Owner's contact information to the Customer so that the two parties may resolve their dispute.";
export const third_party_text = "BeRightHere.com does not provide or own coworking spaces, locations or events. Although BeRightHere.com displays information about properties owned by third-party suppliers and facilitates leads and in some cases reservations with certain suppliers and affiliate sites, such actions do not in any way imply, suggest, or constitute BeRightHere.com’s sponsorship or approval of third-party suppliers, or any affiliation between BeRightHere.com and third-party suppliers. Although BeRightHere.com members may rate and review particular properties based on their own experiences, BeRightHere.com does not endorse or recommend the products or services of any third-party suppliers. You agree that BeRightHere.com is not responsible for the accuracy or completeness of information it obtains from third-party suppliers and displays on its sites or apps. \n If you engage with a third-party supplier, you agree to review and be bound by the supplier’s terms and conditions of purchase and site use (the “Terms of Use”), Privacy Policy, and any other rules or policies related to the supplier’s site or property. Your interactions with third-party suppliers are at your own risk. BeRightHere.com will have no liability with respect to the acts, omissions, errors, representations, warranties, breaches or negligence of any third-party suppliers or for any personal injuries, death, property damage, or other damages or expenses resulting from your interactions with third-party suppliers. \n This Website may link you to supplier sites or other websites that BeRightHere.com does not operate or control. For further information, please refer to the “Links to Third-Party Sites” section below.";
export const link_text = "This Website may contain hyperlinks to websites operated by parties other than BeRightHere.com. Such hyperlinks are provided for your reference only. We do not control such websites and are not responsible for their contents or the privacy or other practices of such websites. Further, it is up to you to take precautions to ensure that whatever links you select or software you download (whether from this Website or other websites) is free of such items as viruses, worms, trojan horses, defects and other items of a destructive nature. Our inclusion of hyperlinks to such websites does not imply any endorsement of the material on such websites or any association with their operators. In some cases, you may be asked by a third-party site to link your profile on BeRightHere.com to a profile on another third-party site. Choosing to do so is purely optional, and the decision to allow this information to be linked can be disabled (with the third-party site) at any time.";
export const liability_text = "To the extent permitted by law, we and our affiliates, parents, and successors and each of our and their employees, assignees, officers, agents and directors (collectively, the “BeRightHere.com Here Parties”) disclaim all warranties and terms, express or implied, with respect to the Site, Content or services (including third party services) on or accessible through the Site, including any warranties or terms of merchantability, fitness for a particular purpose, title, non-infringement and any implied warranties, or arising from course of dealing, course of performance or usage in trade. In no event shall the BeRightHere.com Parties be liable under contract, tort, strict liability, negligence or any other legal or equitable theory with respect to the Site for (a) any special, indirect, incidental, punitive, compensatory or consequential damages of any kind whatsoever (however arising) or (b) damages in excess of (in the aggregate) US$100.";
export const indem_text = "You agree to defend and indemnify BeRightHere.com and its affiliates and any of their officers, directors, employees and agents from and against any claims, causes of action, demands, recoveries, losses, damages, fines, penalties or other costs or expenses of any kind or nature including but not limited to reasonable legal and accounting fees, brought by third parties as a result of: \n Your breach of this Agreement or the documents referenced herein \n Your violation of any law or the rights of a third party \n Your use of this Website";
export const mis_text = "These Website Terms shall be governed by and construed in accordance with the laws of the Republic of India. These Website Terms constitute the entire agreement between us regarding the Site and supersedes and merges any prior proposals, understandings and contemporaneous communications. If any provision of these Website Terms is held to be invalid or unenforceable, that provision shall be limited or eliminated to the minimum extent necessary so that these Website Terms shall otherwise remain in full force and effect and enforceable. In order for any waiver of compliance with these Website Terms to be binding, we must provide you with written notice of such waiver. The failure of either party to enforce its rights under these Website Terms at any time for any period will not be construed as a waiver of such rights.";
export const mod_text = "BeRightHere.com may modify this agreement at any time. Any modification is effective upon the posting of same by BeRightHere.com on its website. BeRightHere.com may also notify You of any modifications by email correspondence to You.";
export const copyright_text = "All contents of this Website are: ©2021 BeRightHere.com. All rights reserved. BeRightHere.com is not responsible for content on websites operated by parties other than BeRightHere.com. The graphic logo, the ratings stars and all other product or service names or slogans displayed on this Website are registered and/or common law trademarks of BeRightHere.com and/or its suppliers or licensors, and may not be copied, imitated or used, in whole or in part, without the prior written permission of BeRightHere.com or the applicable trademark holder. In addition, the look and feel of this Website, including all page headers, custom graphics, button icons and scripts, is the service mark, trademark and/or trade dress of BeRightHere.com and may not be copied, imitated or used, in whole or in part, without the prior written permission of BeRightHere.com. All other trademarks, registered trademarks, product names and company names or logos mentioned in this Website are the property of their respective owners. Reference to any products, services, processes or other information, by trade name, trademark, manufacturer, supplier or otherwise does not constitute or imply endorsement, sponsorship or recommendation thereof by BeRightHere.com. If you are aware of an infringement of either your brand or our brand, please let us know by emailing us at support@berighthere.com.";
export const contact_text = "If you have any questions, complaints, or claims with respect to the Site, you may contact us at \n 59 B, V Block, Kovaipudur, Coimbatore - 641402, Tamil Nadu, India \n E-mail : support@beriberighthere.com"


export const privacyPolicy = "This Mobile App is provided by BeRightHere.com, which is owned and operated by Mikro Grafeio Services Pvt Ltd and is intended for use as is. \n This page is used to inform website visitors regarding our policies with the collection, use, and disclosure of Personal Information if anyone decided to use our Service. \n If you choose to use our Service, then you agree to the collection and use of information in relation to this policy. The Personal Information that we collect is used for providing and improving the Service. We will not use or share your information with anyone except as described in this Privacy Policy. \n The terms used in this Privacy Policy have the same meanings as in our Terms and Conditions, which is accessible at berighthere.com unless otherwise defined in this Privacy Policy."
export const information_collection_and_use = "For a better experience, while using our Service, we may require you to provide us with certain personally identifiable information, including but not limited to Name, Email, Contact details, Address. The information that we request is will be retained by us and used as described in this privacy policy. \n The app does use third party services that may collect information used to identify you. \n Link to privacy policy of third party service providers used by the payment app razorpay.\n If you purchase a product or a service, you will be required to provide information for making the payment of such product or service. Since credit card, UPI and Bank Transfer settlements are processed by appropriate third-party payment agencies, we will not retain your credit card number or security code. \n We want to inform you that whenever you use our Service, in a case of an error in the app we collect data and information (through third party products) on your phone called Log Data. This Log Data may include information such as your device Internet Protocol ('IP') address, device name, operating system version, the configuration of the app when utilizing our Service, the time and date of your use of the Service, and other statistics."
export const location_information = 'We may collect the location information of your device when you share your location information with your friends, or in order for us to provide optimized search results to you. When you do not accept sending your location information by your mobile device settings, location information will not be sent to us. \n Furthermore, for certain properties, we provide QR Code scanning using your camera and your Live location for you to access the properties or workspace which you have booked for. We only use this information to validate physical presence at the property you wish to check in to. \n Even when you do not accept sending your location information, we may estimate your approximate location from network information such as your IP address.'
export const camera = 'Many of our services require us to collect images and other information from your device’s camera and photos. For example you won’t be able to take pictures or upload photos from your camera roll when reporting a workspace related issue to us unless we can access your camera or photos. '
export const cookies = 'Cookies are files with a small amount of data that are commonly used as anonymous unique identifiers. These are sent to your browser from the websites that you visit and are stored on your device’s internal memory.\n This Service does not use these “cookies” explicitly. However, the app may use third party code and libraries that use “cookies” to collect information and improve their services. You have the option to either accept or refuse these cookies and know when a cookie is being sent to your device. If you choose to refuse our cookies, you may not be able to use some portions of this Service.';
export const service_providers = 'We may employ third-party companies and individuals due to the following reasons: \n U+02022 To facilitate our Service \n U+02022 To provide the Service on our behalf \n U+02022 To perform Service-related services; or \n U+02022 To assist us in analysing how our Service is used.\n We want to inform users of this Service that these third parties have access to your Personal Information. The reason is to perform the tasks assigned to them on our behalf. However, they are obligated not to disclose or use the information for any other purpose.'
export const security = 'We value your trust in providing us your Personal Information, thus we are striving to use commercially acceptable means of protecting it. But remember that no method of transmission over the internet, or method of electronic storage is 100% secure and reliable, and we cannot guarantee its absolute security.'
export const links_to_other_sites = " This Service may contain links to other sites. If you click on a third-party link, you will be directed to that site. Note that these external sites are not operated by us. Therefore, we strongly advise you to review the Privacy Policy of these websites. We have no control over and assume no responsibility for the content, privacy policies, or practices of any third-party sites or services."
export const children_privacy = 'These Services do not address anyone under the age of 13. We do not knowingly collect personally identifiable information from children under 13. In the case we discover that a child under 13 has provided us with personal information, we immediately delete this from our servers. If you are a parent or guardian and you are aware that your child has provided us with personal information, please contact us so that we will be able to do necessary actions. ';
export const changes_to_privacy_policy = 'We may update our Privacy Policy from time to time. Thus, you are advised to review this page periodically for any changes. We will notify you of any changes by posting the new Privacy Policy on this page. These changes are effective immediately after they are posted on this page.';
export const contact_us  = "If you have any questions regarding Privacy, complaints, or claims with respect to the App or Site, you may contact us at 59 B, V Block, Kovaipudur, Coimbatore - 641402, Tamil Nadu, India. \n Email: support@berighthere.com"