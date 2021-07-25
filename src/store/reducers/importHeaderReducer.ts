import { ImportDataHeaders, SET_IMPORT_HEADERS, ImportAction } from '../types';

const initialState: ImportDataHeaders = {
  headersObject: {
    asin: 'None Found',
    cost: 'None Found',
    listPrice: 'None Found',
    supplier: 'None Found',
    condition: 'None Found',
    msku: 'None Found',
  },
  headers: [],
  hasUploaded: false,
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
