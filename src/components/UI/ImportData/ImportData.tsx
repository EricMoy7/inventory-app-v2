import React, { FC, useEffect, useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { RootState } from '../../../store';

import firebase from '../../../firebase/config';

import Papa from 'papaparse';

import { ImportDataHeaders, SET_IMPORT_HEADERS } from '../../../store/types';
import { initHeaders } from '../../../store/actions/importActions';

import { useDropzone } from 'react-dropzone';

import { makeStyles } from '@material-ui/core/styles';
import ImportInventoryForm from './ImportInventoryForm';

const db = firebase.firestore();

const useStyles = makeStyles({
  dropzone: {
    border: '2px gray dashed',
    color: 'black',
    width: '70%',
    padding: '100px 30px 100px 30px',
    margin: '0px auto 30px auto',
    height: '400px',
    textAlign: 'center',
    borderRadius: '10px',
    display: 'block',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  submitButton: {
    margin: 'auto',
    width: '70%',
    display: 'block',
    height: '',
  },
});

interface ParentCompProps {
  childComp?: React.ReactNode;
}

const ImportData: FC<ParentCompProps> = (props) => {
  const { childComp } = props;
  const { user, needVerification, success } = useSelector(
    (state: RootState) => state.auth
  );
  const dispatch = useDispatch();

  const classes = useStyles();

  const [selectedFile, setSelectedFile] = useState<File>();
  const [isFileSelected, setIsFileSelected] = useState(false);
  const headers = useSelector(
    (state: { import: {} }) => state.import
  ) as ImportDataHeaders;

  const onDrop = useCallback((acceptFiles) => {
    setSelectedFile(acceptFiles[0]);
    setIsFileSelected(true);
  }, []);

  useEffect(() => {
    if (selectedFile) {
      handleSubmission();
    }
  }, [selectedFile]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

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
          payload: { ...prevState, hasUploaded: true },
        });
      },
    };

    if (selectedFile !== undefined) {
      Papa.parse(selectedFile, config);
    }
  };

  return (
    <div>
      <div className={classes.dropzone} {...getRootProps()}>
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop the files here ...</p>
        ) : (
          <div>
            <text>Drag files here to upload, or click to browse...</text>
            <br></br>
            <text>Only CSV files are supported currently.</text>
          </div>
        )}
        {isFileSelected && !isDragActive ? (
          <text>{selectedFile?.name}</text>
        ) : (
          <p></p>
        )}
      </div>
      {childComp}
    </div>
  );
};

export default ImportData;
