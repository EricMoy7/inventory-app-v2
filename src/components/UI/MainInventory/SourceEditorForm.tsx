import React, { useState } from 'react';
import { TextField, Button } from '@material-ui/core';

import { RootState } from '../../../store';
import { useSelector, useDispatch } from 'react-redux';

import firebase from '../../../firebase/config';

const db = firebase.firestore();

const SourceEditorForm = (props: any) => {
  const { user, needVerification, success } = useSelector(
    (state: RootState) => state.auth
  );

  const [state, setState] = useState({ supplier: null, url: null });

  const changeState = (e: any) => {
    const { value, name } = e.target;
    setState({
      ...state,
      [name]: value,
    });
  };

  const onSubmit = async () => {
    console.log('submitting');
    const product = await db
      .doc(`users/${user?.id}/inventory/${props.msku}`)
      .get();
    if (product.exists) {
      console.log('product exists');
      const oldProduct = product.data()!.supplier;
      if (props.supplier) {
        const newSupplier = { [props.supplier]: state.url };
        await db
          .doc(`users/${user?.id}/inventory/${props.msku}`)
          .set({ ...oldProduct, ...newSupplier });
      } else if (state.supplier) {
        const newSupplier = { [state.supplier!]: state.url }; // Added non-null assertion
        await db
          .doc(`users/${user?.id}/inventory/${props.msku}`)
          .set(
            { supplier: { ...oldProduct, ...newSupplier } },
            { merge: true }
          );
      }
    }
  };

  return (
    <div>
      <TextField
        id="outlined-basic"
        label="Supplier"
        variant="outlined"
        name="supplier"
        value={state.supplier}
        onChange={changeState}
      />
      <TextField
        name="url"
        id="outlined-basic"
        label="Link"
        variant="outlined"
        onChange={changeState}
        value={state.url}
      />
      <Button onClick={onSubmit}>Submit</Button>
    </div>
  );
};

export default SourceEditorForm;
