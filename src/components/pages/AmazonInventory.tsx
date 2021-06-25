import React, { FC, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import MaterialTable from 'material-table';

import Message from '../UI/Message';
import { setSuccess } from '../../store/actions/authActions';
import { RootState } from '../../store';

import firebase from '../../firebase/config'

import { renderTableStyle } from '../utilities/renderTableStyle';

const db = firebase.firestore();

const AmazonInventory: FC = () => {
  const { user, needVerification, success } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();

  const [rows, setRows] = useState<Array<any>>([]);
  const [columns, setColumns] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (success) {
      dispatch(setSuccess(''));
    }
    console.log(user)
  }, [success, dispatch]);

  useEffect(() => {
    const inventory = db.collection(`users/${user?.id}/_GET_FBA_MYI_UNSUPPRESSED_INVENTORY_DATA_`);
    const headers = db.doc(`users/${user?.id}/headers/amazonReport`);
    getHeaderData(headers);
    getInventoryData(inventory);
    setIsLoading(false);
  }, []);

  function getInventoryData(inventory: firebase.firestore.CollectionReference<firebase.firestore.DocumentData>) {
    const unsubscribe = inventory.onSnapshot((snapshot: { docs: any[]; }) => {
      const data = snapshot.docs.map((doc: { data: () => any; }) => doc.data());
      setRows(data);
    });
    return () => unsubscribe();
  }

  function getHeaderData(headers: firebase.firestore.DocumentReference<firebase.firestore.DocumentData>) {
    const unsubscribe = headers.onSnapshot((snapshot) => {
      let colList = snapshot?.data()?.columns;

      setColumns(renderTableStyle(colList));
    });
    return () => unsubscribe;
  }


  return(
    <section className="section">
      <div className="container" style={{maxWidth: '90%'}}>
        {needVerification && <Message type="success" msg="Please verify your email address." />}
        <h1 className="is-size-1">Welcome {user?.firstName}</h1>
        <MaterialTable
          columns={columns}
          data={rows}
          title="Demo Title"
        />
      </div>
    </section>
  );
}

export default AmazonInventory;