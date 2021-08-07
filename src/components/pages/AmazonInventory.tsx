import React, { FC, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import MaterialTable from 'material-table';

import Message from '../UI/Message';
import { setSuccess } from '../../store/actions/authActions';
import { RootState } from '../../store';

import firebase from '../../firebase/config';

import { renderTableStyle } from '../utilities/renderTableStyle';

const db = firebase.firestore();

const AmazonInventory: FC = () => {
  const { user, needVerification, success } = useSelector(
    (state: RootState) => state.auth
  );
  const dispatch = useDispatch();

  const [rows, setRows] = useState<Array<any>>([]);
  const [columns, setColumns] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (success) {
      dispatch(setSuccess(''));
    }
    console.log(user);
  }, [success, dispatch]);

  useEffect(() => {
    const inventory = db.collection(
      `users/${user?.id}/_GET_FBA_MYI_UNSUPPRESSED_INVENTORY_DATA_`
    );
    const headers = db.doc(`users/${user?.id}/headers/amazonReport`);
    try {
      getHeaderData(headers);
      getInventoryData(inventory);
    } catch (err) {
      console.log(err);
    }
    setIsLoading(false);
  }, []);

  function getInventoryData(
    inventory: firebase.firestore.CollectionReference<firebase.firestore.DocumentData>
  ) {
    const unsubscribe = inventory.onSnapshot((snapshot: { docs: any[] }) => {
      const data = snapshot.docs.map((doc: { data: () => any }) => doc.data());
      setRows(data);
    });
    return () => unsubscribe();
  }

  function getHeaderData(
    headers: firebase.firestore.DocumentReference<firebase.firestore.DocumentData>
  ) {
    const unsubscribe = headers.onSnapshot((snapshot) => {
      let colList = snapshot?.data()?.columns;
      if (colList) {
        setColumns(renderTableStyle(colList, user));
      }
    });
    return () => unsubscribe;
  }

  return (
    <section className="section">
      <div className="container" style={{ maxWidth: '90%' }}>
        {needVerification && (
          <Message type="success" msg="Please verify your email address." />
        )}
        <h1 className="is-size-1">Welcome {user?.firstName}</h1>
        <MaterialTable
          options={{
            columnsButton: true,
            headerStyle: {
              position: 'sticky',
              top: 0,
              fontSize: 12,
              whiteSpace: 'nowrap',
              width: 30,
            },
            padding: 'dense',
            filtering: true,
            grouping: false,
            exportButton: true,
            search: true,
            maxBodyHeight: 700,
            pageSize: 50,
            pageSizeOptions: [10, 25, 50, 75, 100],
          }}
          isLoading={isLoading}
          columns={columns}
          data={rows}
          title="Demo Title"
          editable={{
            onBulkUpdate: (changes) =>
              new Promise((resolve, reject) => {
                setTimeout(() => {
                  resolve('Done');
                }, 1000);
              }),
            onRowAddCancelled: (rowData) => console.log('Row adding cancelled'),
            onRowUpdateCancelled: (rowData) =>
              console.log('Row editing cancelled'),
            onRowAdd: (newData) =>
              new Promise((resolve, reject) => {
                setTimeout(() => {
                  db.doc(
                    `users/${user?.id}/_GET_FBA_MYI_UNSUPPRESSED_INVENTORY_DATA_/${newData.sku}`
                  ).set(newData, {
                    merge: true,
                  });
                  resolve('Done');
                }, 1000);
              }),
            onRowUpdate: (newData, oldData) =>
              new Promise((resolve, reject) => {
                setTimeout(() => {
                  db.doc(
                    `users/${user?.id}/_GET_FBA_MYI_UNSUPPRESSED_INVENTORY_DATA_/${oldData.sku}`
                  ).update(newData);

                  resolve('Done');
                }, 1000);
              }),
            onRowDelete: (oldData) =>
              new Promise((resolve, reject) => {
                setTimeout(() => {
                  db.doc(
                    `users/${user?.id}/_GET_FBA_MYI_UNSUPPRESSED_INVENTORY_DATA_/${oldData.sku}`
                  ).delete();

                  resolve('Done');
                }, 1000);
              }),
          }}
        />
      </div>
    </section>
  );
};

export default AmazonInventory;
