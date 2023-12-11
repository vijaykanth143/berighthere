
import BookModel from "./bookModel";

export default class CommonModel {
  status;
  message;
  dataArray = [];
  return_id;

//   // Book detail list
//   deserializeBookListJSON(rawObject) {
//     Object.assign(this, rawObject);
//     this.dataArray = rawObject.docs.map((item) =>
//       new BookModel().deserializeJSON(item)
//     );

//     return this.dataArray;
//   }
}
