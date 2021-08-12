import { ImportDataHeaders, SET_IMPORT_HEADERS, ImportAction } from '../types';

const initialState: ImportDataHeaders = {
  headersObject: {
    asin: null,
    cost: null,
    listPrice: null,
    supplier: null,
    condition: null,
    msku: 'None Found',
    imageUrl: null,
    imageHeight: null,
    imageWidth: null,
    supplierUrl: null,
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
