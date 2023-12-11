export default filterParameters = [
    {sortParameters: [{
        label: "Price Low to High",
        value: "low_to_high",
      },
      {
        label: "Price high to Low",
        value: "high_to_low",
      }],
      iSortParameters : ['Price Low to High', 'Price high to Low'],
    },
    {
        locations: ["Delhi","Mumbai", "Banglore", "Hyderabad", "Chennai", "Kochi", "Pune", "Jaipur", ]
    },
    {
      distance: [5,10,15,20,25,],
    },
    {
      propertyType: ["Dedicated Desk", "Women Only", "Meeting Rooms"]
    },
    {
      amenities: ["Free Wifi", "Free TV", "Pantry", "Free Parking"]
        },
        {
          mylocations: [{ name: "Delhi",
          longitude: "77.1025",
           latitude: "28.7041",
           image: "https://static.goindigo.in/content/dam/indigov2/6e-website/destinations/delhi/Delhi-LotusTmple.jpg",
         }, { name: "Kolkata",
         longitude: "88.3639",
         latitude: "22.5726",
         image: "https://www.tripsavvy.com/thmb/vOsVUgkBhTmj3lntYNu-qBswRVM=/3668x2751/smart/filters:no_upscale()/victoria-memorial--kolkata--india-1140726002-95549087f08e4bafb44c1a71179a8ceb.jpg", }, 
         { name: "Mumbai",
         longitude: "72.8777",
         latitude: "19.0760",
         image: "https://upload.wikimedia.org/wikipedia/commons/b/bc/Mumbai_skyline_BWSL.jpg", }, 
         { name: "Bengaluru",
         longitude: "77.5946",
         latitude: "12.9716",
         image: "https://static.toiimg.com/thumb/msid-60290719,width-1200,height-900,resizemode-4/.jpg", }, 
         { name: "Chennai",
         longitude: "80.2707",
         latitude: "13.0827",
         image: "https://media.gettyimages.com/photos/high-angle-view-of-sea-and-buildings-against-sky-picture-id1144749579?s=612x612", }]
        },
        {
          resource_plan: [
            {
                "id": 5861,
                "plan_name": "Dedicated Desks - Monthly",
                "resource_id": 283,
                "image_path": null,
                "property_id": 45,
                "price": "9500",
                "description": "Dedicated Desks with all infrastructure",
                "access_period_unit_id": 1
            },
            {
                "id": 5863,
                "plan_name": "Flexi Desk - Monthly",
                "resource_id": 284,
                "image_path": null,
                "property_id": 45,
                "price": "5500",
                "description": "Flexi Desks with all infrastructure",
                "access_period_unit_id": 1
            },
            {
                "id": 5865,
                "plan_name": "Shared Space - 5 Seater",
                "resource_id": 282,
                "image_path": null,
                "property_id": 45,
                "price": "7500",
                "description": "5-seater Shared Space with all amenities (chgs mentioned is per desk)",
                "access_period_unit_id": 1
            },
            {
                "id": 5866,
                "plan_name": "Private Cabin - 2 Seater",
                "resource_id": 281,
                "image_path": null,
                "property_id": 45,
                "price": "22000",
                "description": "2-seater Private Cabin space with all amenities",
                "access_period_unit_id": 1
            },
            {
                "id": 5870,
                "plan_name": "Manager Room - 6 Seater",
                "resource_id": 285,
                "image_path": null,
                "property_id": 45,
                "price": "7000",
                "description": "6-Seater Manager Cabin",
                "access_period_unit_id": 1
            },
            {
                "id": 5871,
                "plan_name": "Meeting Room - 15 Seater",
                "resource_id": 279,
                "image_path": null,
                "property_id": 45,
                "price": "12000",
                "description": "15-Seater Meeting Room",
                "access_period_unit_id": 2
            },
            {
                "id": 5872,
                "plan_name": "Conference Room - 20 Seater",
                "resource_id": 280,
                "image_path": null,
                "property_id": 45,
                "price": "400",
                "description": "20-Seater Conference Room ",
                "access_period_unit_id": 3
            }
        ]
        }

]