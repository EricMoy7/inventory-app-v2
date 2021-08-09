import React, { FC, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import MaterialTable from 'material-table';

import Message from '../UI/Message';
import { setSuccess } from '../../store/actions/authActions';
import { RootState } from '../../store';

import firebase from '../../firebase/config';

import { renderTableStyle } from '../utilities/renderTableStyle';
import { store } from 'react-notifications-component';

const db = firebase.firestore();

const Inventory: FC = () => {
  const { user, needVerification, success } = useSelector(
    (state: RootState) => state.auth
  );
  const dispatch = useDispatch();

  const [rows, setRows] = useState<Array<any>>([]);
  const [columns, setColumns] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  //Set local inventory path
  const inventoryPath = `users/${user?.id}/inventory`;

  useEffect(() => {
    if (success) {
      dispatch(setSuccess(''));
    }
    console.log(user);
  }, [success, dispatch]);

  useEffect(() => {
    const inventory = db.collection(`users/${user?.id}/inventory/`);
    const headers = db.doc(
      `users/${user?.id}/settings/headers/inventoryHeaders/mainHeaders`
    );
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

  async function handleColumnDrag(
    sourceIndex: number,
    destinationIndex: number
  ): Promise<void> {
    //TODO: Correctly type this
    const oldColumns = columns as any[];
    const currentColumn = oldColumns.splice(sourceIndex, 1)[0];
    oldColumns.splice(destinationIndex, 0, currentColumn);

    const newHeaders = [];
    for (let i = 0; i < oldColumns.length; i++) {
      newHeaders.push({
        title: oldColumns[i].title,
        field: oldColumns[i].field
          ? oldColumns[i].field
          : oldColumns[i].title.toLowerCase(),
        editable: oldColumns[i].editable ? oldColumns[i].editable : true,
      });
    }
    await db
      .doc(`users/${user?.id}/settings/headers/inventoryHeaders/mainHeaders`)
      .set({ columns: newHeaders });
  }

  return (
    <section className="section">
      <div className="container" style={{ maxWidth: '100%' }}>
        {needVerification && (
          <Message type="success" msg="Please verify your email address." />
        )}
        <h1 className="is-size-1">Welcome {user?.firstName}</h1>
        <MaterialTable
          title="All Inventory"
          onColumnDragged={handleColumnDrag}
          options={{
            columnsButton: true,
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
            pageSizeOptions: [10, 25, 50, 75, 100],
          }}
          isLoading={isLoading}
          columns={columns}
          data={rows}
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
                  db.doc(`${inventoryPath}/${newData.msku}`).set(newData, {
                    merge: true,
                  });
                  resolve('Done');
                }, 1000);
              }),
            onRowUpdate: (newData, oldData) =>
              new Promise((resolve, reject) => {
                setTimeout(() => {
                  db.doc(`${inventoryPath}/${oldData.msku}`).update(newData);

                  resolve('Done');
                }, 1000);
              }),
            onRowDelete: (oldData) =>
              new Promise((resolve, reject) => {
                setTimeout(() => {
                  db.doc(`${inventoryPath}/${oldData.msku}`).delete();

                  store.addNotification({
                    title: 'Product Edit',
                    message: `${oldData.msku} has successfully been deleted!`,
                    type: 'success',
                    insert: 'top',
                    container: 'top-right',
                    animationIn: ['animate__animated', 'animate__fadeIn'],
                    animationOut: ['animate__animated', 'animate__fadeOut'],
                    dismiss: {
                      duration: 1000,
                      onScreen: true,
                    },
                  });

                  resolve('Done');
                }, 1000);
              }),
          }}
        />
      </div>
    </section>
  );
};

export default Inventory;
