import { ImportDataAction } from '../types';

const initialState: [] = [];

export default (state = initialState, action: ImportDataAction) => {
  const payload = action.payload;
  if (payload) {
    return payload;
  } else return state;
};
