export interface UserCredentials {
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
