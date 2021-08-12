//Establish Initial Headers
export const initHeaders = (data: [string], prevState: any): any => {
  for (let header of data) {
    if (header.toUpperCase() === 'ASIN') {
      prevState.headersObject.asin = header;
    }

    if (header.toUpperCase() === 'COST') {
      prevState.headersObject.cost = header;
    }

    if (
      header.toUpperCase() === 'LISTPRICE' ||
      header.toUpperCase() === 'LIST PRICE'
    ) {
      prevState.headersObject.listPrice = header;
    }

    if (header.toUpperCase() === 'SUPPLIER') {
      prevState.headersObject.supplier = header;
    }

    if (header.toUpperCase() === 'CONDITION') {
      prevState.headersObject.condition = header;
    }

    if (header.toUpperCase() === 'MSKU') {
      prevState.headersObject.msku = header;
    }

    if (
      header.toUpperCase() === 'SUPPLIER URL' ||
      header.toUpperCase() === 'SUPPPLIERURL'
    ) {
      prevState.headersObject.supplierUrl = header;
    }
  }
  prevState.headers = data;
  return prevState;
};
