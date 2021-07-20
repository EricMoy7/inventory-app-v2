import React, { useEffect } from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';

import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

import { useSelector } from 'react-redux';
import { ImportDataHeaders } from '../../../store/types';

function rand() {
  return Math.round(Math.random() * 20) - 10;
}

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

export default function ImportInventoryForm() {
  const classes = useStyles();
  // getModalStyle is not a pure function, we roll the style only on the first render
  const [modalStyle] = React.useState(getModalStyle);
  const [open, setOpen] = React.useState(false);

  const globalState = useSelector(
    (state: { import: {} }) => state.import
  ) as ImportDataHeaders;

  const [state, setState] = React.useState(globalState);

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
    console.log(globalState);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const body = (
    <div style={modalStyle} className={classes.paper}>
      {Object.keys(globalState).map((key) => {
        if (key !== 'headers') {
          return (
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
                {globalState.headers.map((item) => (
                  <MenuItem key={item} value={item}>
                    {item}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          );
        }
      })}
    </div>
  );

  return (
    <div>
      <button type="button" onClick={handleOpen}>
        Open Modal
      </button>
      <Modal open={open} onClose={handleClose}>
        {body}
      </Modal>
    </div>
  );
}
