import { ImportDataHeaders, SET_IMPORT_HEADERS, ImportAction } from '../types';

const initialState: ImportDataHeaders = {
  asin: 'None Found',
  cost: 'None Found',
  listPrice: 'None Found',
  supplier: 'None Found',
  condition: 'None Found',
  msku: 'None Found',
  headers: [],
};

export default (state = initialState, action: ImportAction) => {
  switch (action.type) {
    case SET_IMPORT_HEADERS:
      const payload = action.payload;
      return {
        ...state,
        ...payload,
      };
    default:
      return state;
  }
};
