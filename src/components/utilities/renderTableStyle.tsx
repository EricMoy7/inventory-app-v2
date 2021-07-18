import React from "react";
import firebase from '../../firebase/config';
import { User } from "../../store/types";

const db = firebase.firestore()

export function renderTableStyle(colList: any, user: User | null) {
  colList.map((column: { title: string; }, idx: string | number) => {
    if (column.title === "Image") {
      colList[idx] = {
        ...column,
        render: (rowData: { [x: string]: string | undefined; asin: any; imageUrl: string | undefined; imageWidth: any; imageHeight: any; }) => (
          <a href={`https://www.amazon.com/dp/${rowData.asin}`} target="_blank">
            <img
              src={rowData.imageUrl}
              style={{
                width: rowData.imageWidth,
                height: rowData.imageHeight,
              }}
              alt={rowData["Product Name"]}
            />
          </a>
        ),
      };
    }

    if (column.title === "Product Name") {
      colList[idx] = {
        ...column,
        render: (rowData: { [x: string]: boolean | React.ReactChild | React.ReactFragment | React.ReactPortal | null | undefined; }) =>
            <tr style={{ width: "200px", display: "inline-block", fontSize: "small", fontWeight: "bold" }}>
              {rowData["product-name"]}
            </tr>
      };
    }
  });


  return colList;
}