import React, { FC, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import MaterialTable from 'material-table';

import Message from '../UI/Message';
import { setSuccess } from '../../store/actions/authActions';
import { RootState } from '../../store';

import firebase from '../../firebase/config';

import FileInput from '../UI/FileInput';
import Button from '../UI/Button';

const db = firebase.firestore();

const ImportData: FC = () => {
  const { user, needVerification, success } = useSelector(
    (state: RootState) => state.auth
  );
  const dispatch = useDispatch();

  const [rows, setRows] = useState<Array<any>>([]);
  const [columns, setColumns] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [selectedFile, setSelectedFile] = useState<File>();
  const [isFileSelected, setIsFileSelected] = useState(false);

  //TODO: Move data importer to its own component
  //TODO: Handle multiple files at once

  const changeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files !== null) {
      setSelectedFile(event.target.files[0]);
      setIsFileSelected(true);
    }
  };

  const handleSubmission = () => {};

  useEffect(() => {
    if (success) {
      dispatch(setSuccess(''));
    }
    console.log(user);
  }, [success, dispatch]);

  return (
    <div>
      <FileInput label="File Input" onChange={changeHandler}></FileInput>
      <Button text="Upload" />
    </div>
  );
};

export default ImportData;
