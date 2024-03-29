import React, { ChangeEvent, FC, SetStateAction, useEffect } from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';

import { ImportData } from '../../../store/types';

import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

import { useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { ImportDataHeaders } from '../../../store/types';

import firebase from '../../../firebase/config';
import { Autocomplete } from '@material-ui/lab';
import { TextField } from '@material-ui/core';

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
    button: {
      alignSelf: 'center',
      display: 'block',
    },
    modalButton: {
      aliagnSelf: 'center',
    },
    footerDiv: {
      position: 'absolute',
      bottom: 0,
      width: '90%',
    },
    addOnSelect: {
      minWidth: '200px',
      maxWidth: '100%',
    },
    inputContainer: { display: 'flex', flexDirection: 'column' },
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

  //TODO: Define state in type file
  const [state, setState] = React.useState<{
    [key: string]: string | undefined | null;
  }>(headerState.headersObject);

  const [newHeaders, setNewHeaders] = React.useState<any[]>([]);
  const [selectedHeaderInput, setSelectedHeaderInput] =
    React.useState<string>(' ');
  const [selectedHeaderValue, setSelectedHeaderValue] =
    React.useState<string>(' ');

  React.useEffect(() => {
    if (headerState.hasUploaded === true) {
      setStyleState({ display: 'Block' });
      setOpen(true);
    }
  }, [headerState]);

  /////////////////////////////////////////////////////////////////////////////
  //Utility functions /////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////
  function isIterable(obj: any) {
    // checks for null and undefined
    if (obj == null) {
      return false;
    }
    return typeof obj[Symbol.iterator] === 'function';
  }

  function camelCase(str: string) {
    return str
      .replace(/(?:^\w|[A-Z]|\b\w)/g, function (word: string, index: number) {
        return index == 0 ? word.toLowerCase() : word.toUpperCase();
      })
      .replace(/\s+/g, '');
  }
  /////////////////////////////////////////////////////////////////////////////
  //=========================================================================//
  /////////////////////////////////////////////////////////////////////////////

  const handleChange = (event: any) => {
    let value = event.target.value;
    let name = event.target.name;

    setState((prevalue: any) => {
      if (name.indexOf(' ') >= 0) {
        return {
          ...prevalue,
          [camelCase(name)]: value,
        };
      } else {
        return {
          ...prevalue,
          [name.toLowerCase()]: value,
        };
      }
    });
  };

  const handleOpen = () => {
    console.log(state);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const headerInput = (key: string) => {
    return (
      <FormControl className={classes.formControl}>
        <InputLabel htmlFor={key}>
          {key.charAt(0).toUpperCase() + key.slice(1)}
        </InputLabel>
        <Select name={key} id={key} value={state[key]} onChange={handleChange}>
          {headerState.headers.map((item) => (
            <MenuItem key={item} value={item}>
              {item}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    );
  };

  const addHeaderInput = (headerName: string) => {
    setNewHeaders((prevValue: any) => {
      return [...prevValue, headerInput(headerName)];
    });
  };

  const submitData = async () => {
    const batch = db.batch();
    const headersArray = dataState[0];
    const indexMap: { [key: string]: number } = {};

    for (const key in state) {
      //Remove if statement after below is fixed
      if (typeof state[key] === 'string' && state[key] !== 'None Found') {
        indexMap[key] =
          //Fix this type garbage
          //ImportDataHeaders indexer has headers:[] and hasUploaded:Boolean
          //Make these their own or collapse headers into a nested object
          //@ts-ignore
          headersArray.indexOf(state[key]);
      }
    }

    const productDetails: {
      [key: string]: string | number | null | string[] | {};
    } = {
      ...headerState.headersObject,
    };

    console.log(indexMap);

    for (let i = 1; i < (dataState as []).length - 1; i++) {
      const productName = dataState[i][indexMap.msku];
      for (const key in indexMap) {
        if (key === 'cost' || key === 'listPrice') {
          productDetails[key] = parseFloat(dataState[i][indexMap[key]]);
        } else if (key === 'supplier') {
          if (isIterable(dataState[i][indexMap[key]])) {
            const supplierObject: { [key: string]: string } = {};
            const suppliers = dataState[i][indexMap[key]]
              .split(',')
              .map((item) => item.trim());
            let supplierString = dataState[i][indexMap['supplierUrl']];

            let supplierUrls;
            if (supplierString) {
              supplierUrls = supplierString
                .split(',')
                .map((item) => item.trim());
            } else {
              supplierUrls = new Array(suppliers.length).fill(null);
            }

            for (let i = 0; i < suppliers.length; i++) {
              supplierObject[suppliers[i]] = supplierUrls[i];
            }

            productDetails[key] = supplierObject;
          } else {
            productDetails[key] = [dataState[i][indexMap[key]]];
          }
        } else {
          if (dataState[i][indexMap[key]] !== undefined) {
            productDetails[key] = dataState[i][indexMap[key]];
          } else {
            productDetails[key] = null;
          }
        }
      }
      const path = db.doc(`users/${user?.id}/inventory/${productName}`);
      batch.set(path, productDetails, { merge: true });
    }
    await batch.commit();
  };

  const body = (
    <div style={modalStyle} className={classes.paper}>
      <form>
        {Object.keys(headerState.headersObject).map((key) => {
          if (state[key] !== 'None Found') {
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

        {newHeaders}
        <div className={classes.footerDiv}>
          <InputLabel htmlFor="addOn">Add new header</InputLabel>
          <Autocomplete
            className={classes.addOnSelect}
            freeSolo
            id="addOn"
            options={headerState.headers
              .filter((item: string) => {
                if (Object.values(state).indexOf(item) >= 0) {
                  return false; //skipping
                } else {
                  return true;
                }
              })
              .map((item: string) => item)}
            onChange={(
              event: ChangeEvent<{}>,
              newValue: string | null | void
            ) => {
              if (newValue) {
                addHeaderInput(newValue as string);
              } else {
                setSelectedHeaderInput(' ');
              }
            }}
            onInputChange={(event, newInputValue) => {
              setSelectedHeaderInput(newInputValue);
            }}
            inputValue={selectedHeaderInput}
            value={selectedHeaderValue}
            renderInput={(params) => {
              return (
                <TextField {...params} margin="normal" variant="outlined" />
              );
            }}
          />
          <Button className={classes.button} onClick={submitData}>
            Upload to Database
          </Button>
        </div>
      </form>
    </div>
  );

  return (
    <div>
      <Container className={classes.inputContainer}>
        <Button
          type="button"
          onClick={handleOpen}
          style={{ display: styleState.display }}
          className={classes.modalButton}
        >
          Open Modal
        </Button>

        <Modal open={open} onClose={handleClose}>
          {body}
        </Modal>
      </Container>
    </div>
  );
};

export default ImportInventoryForm;
