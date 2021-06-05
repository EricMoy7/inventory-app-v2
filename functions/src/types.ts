export interface UserCredentials {
  [x: string]: any;
  id?: string;
  uid: string;
  sellerId?: string;
  mwsAuthToken?: string;
}

export interface Data {
  [key: string]: string;
}

export interface ActiveListingsReport {
  data: {
    [index: number]: {
      [key: string]: string;
    };
  };
}

export interface InventoryData {
  [index: number]: {
    [key: string]: string;
  };
}

export interface ReportIdData {
  reportType: string;
  reportId?: string;
  requestId?: string;
  version?: string;
}
