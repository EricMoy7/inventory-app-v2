import React, { FC, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import MaterialTable from 'material-table';

import Message from '../UI/Message';
import { setSuccess } from '../../store/actions/authActions';
import { RootState } from '../../store';
// Firebase imports removed
// import firebase from '../../firebase/config';
// renderTableStyle import removed as logic is now inline or simplified
// import { renderTableStyle } from '../utilities/renderTableStyle';
// react-notifications-component import removed
// import { store } from 'react-notifications-component';

// Fake data for demo purposes based on user-provided Amazon links
const fakeInventoryData = [
  { msku: 'DEMO-001', asin: 'B085TFF7M1', 'product-name': 'Logitech C920x Pro HD Webcam', imageUrl: 'https://m.media-amazon.com/images/I/71iNwni9TsL._AC_SX679_.jpg', price: 59.99, quantity: 75, supplier: { 'Logitech Store': 'https://www.amazon.com/stores/Logitech' } },
  { msku: 'DEMO-002', asin: 'B0CV4M5QXD', 'product-name': 'Logitech G502 Hero Mouse', imageUrl: 'https://m.media-amazon.com/images/I/61mpMH5TzkL._AC_SX679_.jpg', price: 49.99, quantity: 120, supplier: { 'Logitech Store': 'https://www.amazon.com/stores/Logitech' } },
  { msku: 'DEMO-003', asin: 'B0BKVY4WKT', 'product-name': 'Logitech MX Keys S Combo', imageUrl: 'https://m.media-amazon.com/images/I/61+403-rNoL._AC_SL1500_.jpg', price: 199.99, quantity: 50, supplier: { 'Logitech Store': 'https://www.amazon.com/stores/Logitech' } },
  { msku: 'DEMO-004', asin: 'B0CSP61VR4', 'product-name': 'GravaStar M2 Mouse', imageUrl: 'https://m.media-amazon.com/images/I/61lLcfYDCOL._AC_SL1500_.jpg', price: 79.95, quantity: 90, supplier: { 'GravaStar Store': 'https://www.amazon.com/stores/GravaStar' } },
  { msku: 'DEMO-005', asin: 'B0C74GYW3J', 'product-name': 'FIFINE AmpliGame AM8T Microphone', imageUrl: 'https://m.media-amazon.com/images/I/61-0YoCB2LL._AC_SL1441_.jpg', price: 45.99, quantity: 110, supplier: { 'FIFINE Store': 'https://www.amazon.com/stores/FIFINEMICROPHONE' } },
];

// Static columns for demo purposes
const fakeColumns = [
  { title: 'Image', field: 'imageUrl', editable: 'never', render: (rowData: any) => <a href={`https://www.amazon.com/dp/${rowData.asin}`} target="_blank" rel="noreferrer"><img src={rowData.imageUrl} style={{ width: 50, height: 50 }} alt={rowData['product-name']} /></a> },
  { title: 'MSKU', field: 'msku', editable: 'onAdd' }, // Keep MSKU editable on add for potential demo interaction
  { title: 'Product Name', field: 'product-name', render: (rowData: any) => <div style={{ width: '200px', display: 'inline-block', fontSize: 'small', fontWeight: 'bold' }}>{rowData['product-name']}</div> },
  { title: 'ASIN', field: 'asin' },
  { title: 'Price', field: 'price', type: 'numeric' },
  { title: 'Quantity', field: 'quantity', type: 'numeric' },
  { title: 'Supplier', field: 'supplier', render: (rowData: any) => (
    <div>
      {rowData.supplier ? Object.keys(rowData.supplier).map((key: string) => (
        <button key={key} className="bg-blue-500 hover:bg-blue-700 text-white text-xs font-bold py-1 px-2 rounded m-1" onClick={() => window.open(rowData.supplier[key], '_blank')}>
          {key}
        </button>
      )) : <div></div>}
      {/* Popper/Editor removed for demo */}
    </div>
  )},
];

// Firestore instance removed
// const db = firebase.firestore();

const Inventory: FC = () => {
  const { user, needVerification, success } = useSelector(
    (state: RootState) => state.auth
  );
  const dispatch = useDispatch();

  // Use fake data and columns
  const [rows, setRows] = useState<Array<any>>(fakeInventoryData);
  const [columns, setColumns] = useState<any[]>(fakeColumns); // Use any[] for simplicity with MaterialTable columns
  const [isLoading, setIsLoading] = useState(false); // Set initial loading to false

  // Firebase path removed
  // const inventoryPath = `users/${user?.id}/inventory`;

  // Removed useEffect for success message handling related to Firebase
  // useEffect(() => {
  //   if (success) {
  //     dispatch(setSuccess(''));
  //   }
  //   console.log(user);
  // }, [success, dispatch]);

  // Removed useEffect for fetching data from Firebase
  // useEffect(() => {
  //   const inventory = db.collection(`users/${user?.id}/inventory/`);
  //   const headers = db.doc(
  //     `users/${user?.id}/settings/headers/inventoryHeaders/mainHeaders`
  //   );
  //   try {
  //     getHeaderData(headers);
  //     getInventoryData(inventory);
  //   } catch (err) {
  //     console.log(err);
  //   }
  //   setIsLoading(false);
  // }, []);

  // Removed Firebase data fetching functions
  // function getInventoryData(...) { ... }
  // function getHeaderData(...) { ... }

  // Removed Firebase column drag handler
  // async function handleColumnDrag(...) { ... }

  return (
    <section className="section">
      <div className="container" style={{ maxWidth: '100%' }}>
        {needVerification && (
          <Message type="success" msg="Please verify your email address." />
        )}
        {/* Display generic welcome or user first name if available */}
        <h1 className="is-size-1">Welcome {user?.firstName || 'User'}</h1>
        <MaterialTable
          title="Demo Inventory" // Changed title
          // onColumnDragged removed
          options={{
            columnsButton: true, // Keep columns button for UI demo
            headerStyle: {
              position: 'sticky',
              top: 0,
              fontSize: 12,
            },
            padding: 'dense',
            filtering: true,
            grouping: false,
            exportButton: true,
            search: true,
            maxBodyHeight: 700,
            pageSize: 50,
            pageSizeOptions: [10, 25, 50, 75, 100], // Keep pagination options
          }}
          isLoading={isLoading} // Keep loading state indicator
          columns={columns} // Use static columns
          data={rows} // Use static rows
          // editable prop removed as Firebase interaction is disabled
        />
      </div>
    </section>
  );
};

export default Inventory;
