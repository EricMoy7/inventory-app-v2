import React, { FC, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { setSuccess } from '../../store/actions/authActions';
import { RootState } from '../../store';

import firebase from '../../firebase/config';

import FileInput from '../UI/FileInput';
import Button from '../UI/Button';

import Papa from 'papaparse';

import ImportInventoryForm from '../UI/ImportData/ImportInventoryForm';
import { ImportDataHeaders, SET_IMPORT_HEADERS } from '../../store/types';
import { initHeaders } from '../../store/actions/importActions';

const db = firebase.firestore();

const ImportData: FC = () => {
  const { user, needVerification, success } = useSelector(
    (state: RootState) => state.auth
  );
  const dispatch = useDispatch();

  const [selectedFile, setSelectedFile] = useState<File>();
  const [isFileSelected, setIsFileSelected] = useState(false);
  const headers = useSelector(
    (state: { import: {} }) => state.import
  ) as ImportDataHeaders;

  //TODO: Move data importer to its own component
  //TODO: Handle multiple files at once

  const changeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files !== null) {
      setSelectedFile(event.target.files[0]);
      setIsFileSelected(true);
    }
  };

  const handleSubmission = async () => {
    const config = {
      delimiter: ',',
      header: false,
      //TODO: Type results to array
      complete: (results: any) => {
        console.log('Upload Complete');

        const prevState = initHeaders(results.data[0], headers);

        dispatch({
          type: SET_IMPORT_HEADERS,
          payload: prevState,
        });
      },
    };

    if (selectedFile !== undefined) {
      Papa.parse(selectedFile, config);
    }
  };

  useEffect(() => {
    if (success) {
      dispatch(setSuccess(''));
    }
    console.log(user);
  }, [success, dispatch]);

  return (
    <div>
      <FileInput label="File Input" onChange={changeHandler}></FileInput>
      <Button text="Upload" onClick={handleSubmission} />
      <ImportInventoryForm />
    </div>
  );
};

export default ImportData;
