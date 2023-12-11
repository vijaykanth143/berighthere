import axios from "axios";
import commonModel from "../Models/commonModel"

export const getBookListAPI = async (type, page, offset) => {
    const token = await Session._getToken();
    console.log("token: ", token);
  
    var url = `${"https://www.googleapis.com/books/v1/volumes?q=flowers&filter=free-ebooks&key=AIzaSyBk3p4zZaRmhvfH7qhzIKvV9R1jJFrWndM"}`;
    console.log("url: ", url);
  
    return new Promise((resolve, reject) => {
      axios
        .get(url,{
          headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
                    }})
        .then((response) => {
          console.log("BOOK_LIST response", JSON.stringify(response));
          if (response.data.status == true) {
            commonModel.status = true;
            commonModel.message = "Retrived Successfully";
            // book list data
            commonModel.dataArray = 
              response.data.items
            
            // commonModel.return_id=response.data.data.hasNextPage;
          } else {
            commonModel.status = false;
            commonModel.message = "Error, Please Try again later";
          }
          resolve(commonModel);
        })
        .catch((error) => {
          console.log("BOOK_LIST error", JSON.stringify(error.response.data.error));
          commonModel.status = false;
          commonModel.message = error.message;
          resolve(commonModel);
        });
    });
  };
