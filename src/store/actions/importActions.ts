import { ImportDataHeaders, SET_IMPORT_HEADERS, ImportAction } from '../types';
import { RootState } from '..';

//Establish Initial Headers
export const initHeaders = (data: [string], prevState: any): any => {
  for (let header of data) {
    if (header.toUpperCase() === 'ASIN') {
      prevState.asin = header;
    }

    if (header.toUpperCase() === 'COST') {
      prevState.cost = header;
    }

    if (
      header.toUpperCase() === 'LISTPRICE' ||
      header.toUpperCase() === 'LIST PRICE'
    ) {
      prevState.listPrice = header;
      console.log(header);
    }

    if (header.toUpperCase() === 'SUPPLIER') {
      prevState.supplier = header;
    }

    if (header.toUpperCase() === 'CONDITION') {
      prevState.condition = header;
    }

    if (header.toUpperCase() === 'MSKU') {
      prevState.msku = header;
    }
  }
  prevState.headers = data;
  return prevState;
};
