import React, { FC, useEffect } from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Button from '@material-ui/core/Button';

import { ImportData } from '../../../store/types';

import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

import { useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { ImportDataHeaders } from '../../../store/types';

import firebase from '../../../firebase/config';

const db = firebase.firestore();

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
      position: 'absolute',
      width: '600px',
      height: '800px',
      backgroundColor: theme.palette.background.paper,
      border: '2px solid #000',
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
      display: 'block',
    },
    formControl: {
      margin: theme.spacing(1),
      width: '100%',
    },
    selectEmpty: {
      marginTop: theme.spacing(2),
    },
  })
);

const ImportInventoryForm: FC = () => {
  const { user, needVerification, success } = useSelector(
    (state: RootState) => state.auth
  );
  // getModalStyle is not a pure function, we roll the style only on the first render

  //Three different states are in this component: 2 Global, 1 Local
  // Global headers is only to preview file headers to set the initial local headers state
  // 2nd Global is data of the CSV file
  const [modalStyle] = React.useState(getModalStyle);
  const [open, setOpen] = React.useState(false);
  const [styleState, setStyleState] = React.useState({ display: 'None' });

  const classes = useStyles();

  const globalState = useSelector(
    (state: { import: {}; importData: [] }) => state
  );

  const headerState = globalState.import as ImportDataHeaders;
  const dataState = globalState.importData as ImportData;

  const [state, setState] = React.useState(headerState);

  React.useEffect(() => {
    if (headerState.hasUploaded === true) {
      setStyleState({ display: 'Block' });
      setOpen(true);
    }
  }, [headerState]);

  const handleChange = (event: any) => {
    let value = event.target.value;
    let name = event.target.name;

    setState((prevalue: any) => {
      return {
        ...prevalue,
        [name]: value,
      };
    });
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const submitData = async () => {
    console.log(dataState);

    const batch = db.batch();
    const headersArray = dataState[0];
    const indexMap: { [key: string]: number } = {};

    for (const key in state) {
      //Remove if statement after below is fixed
      if (typeof state[key] === 'string') {
        indexMap[key] =
          //Fix this type garbage
          //ImportDataHeaders indexer has headers:[] and hasUploaded:Boolean
          //Make these their own or collapse headers into a nested object
          //@ts-ignore
          headersArray.indexOf(state[key]);
      }
    }

    for (let i = 1; i < (dataState as []).length - 1; i++) {
      const productName = dataState[i][indexMap.msku];
      const productDetails: { [key: string]: string } = {};
      for (const key in indexMap) {
        productDetails[key] = dataState[i][indexMap[key]];
      }
      console.log(productDetails);
      const path = db.doc(`users/${user?.id}/inventory/${productName}`);
      batch.set(path, productDetails, { merge: true });
    }
    await batch.commit();
  };

  const body = (
    <div style={modalStyle} className={classes.paper}>
      <form>
        {Object.keys(headerState).map((key) => {
          if (key !== 'headers') {
            return (
              <div>
                <FormControl className={classes.formControl}>
                  <InputLabel htmlFor={key}>
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                  </InputLabel>
                  <Select
                    name={key}
                    id={key}
                    value={state[key]}
                    onChange={handleChange}
                  >
                    {headerState.headers.map((item) => (
                      <MenuItem key={item} value={item}>
                        {item}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>
            );
          }
        })}
        <Button onClick={submitData}>Upload to Database</Button>
      </form>
    </div>
  );

  return (
    <div>
      <Button
        type="button"
        onClick={handleOpen}
        style={{ display: styleState.display }}
      >
        Open Modal
      </Button>

      <Modal open={open} onClose={handleClose}>
        {body}
      </Modal>
    </div>
  );
};

export default ImportInventoryForm;
