import {BOOK_UPDATED} from "../actions/actionTypes"

export function actionfetchCart(refresher) {
    console.log("action", refresher);
  
    return (dispatch) => {
      // get data from db
      dispatch({
        type: BOOK_UPDATED,
        payload: refresher,
      });
    };
  }